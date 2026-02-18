const { Server } = require('socket.io');
const http = require('http');
const { v4: uuidv4 } = require('uuid');

const server = http.createServer((req, res) => {
  // Health check endpoint para Render
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    return;
  }
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Feria Ocupacional Socket Server');
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling'],
});

// Estado de las salas de juego
const gameRooms = new Map();

// Configuración del juego
const QUESTIONS_PER_GAME = 10;

// ==========================================
// BANCO DE PREGUNTAS EXPANDIDO (50+ preguntas)
// ==========================================
const allQuizQuestions = [
  // === CIENCIA Y TECNOLOGÍA ===
  {
    id: 1,
    question: "¿En qué área de la ciencia destacó Albert Einstein?",
    options: ["Biología", "Física Teórica", "Química", "Matemáticas Puras"],
    correct: 1,
    time: 15,
    image: "🧠",
    category: "ciencia"
  },
  {
    id: 2,
    question: "¿Quiénes fueron Marie y Pierre Curie?",
    options: ["Filósofos franceses", "Científicos pioneros en radioactividad", "Pintores impresionistas", "Músicos clásicos"],
    correct: 1,
    time: 15,
    image: "⚗️",
    category: "ciencia"
  },
  {
    id: 3,
    question: "¿Qué descubrió Nikola Tesla?",
    options: ["La penicilina", "La corriente alterna (AC)", "El teléfono", "La vacuna contra la rabia"],
    correct: 1,
    time: 15,
    image: "⚡",
    category: "ciencia"
  },
  {
    id: 4,
    question: "¿En qué campo destacó Ada Lovelace?",
    options: ["Primera programadora de la historia", "Primera astronauta", "Primera médica", "Primera abogada"],
    correct: 0,
    time: 15,
    image: "💻",
    category: "tecnologia"
  },
  {
    id: 5,
    question: "¿Qué inventó Alexander Graham Bell?",
    options: ["La bombilla", "El teléfono", "La radio", "El automóvil"],
    correct: 1,
    time: 15,
    image: "📞",
    category: "tecnologia"
  },
  {
    id: 6,
    question: "¿Quién desarrolló la teoría de la evolución?",
    options: ["Isaac Newton", "Charles Darwin", "Galileo Galilei", "Louis Pasteur"],
    correct: 1,
    time: 15,
    image: "🦎",
    category: "ciencia"
  },
  {
    id: 7,
    question: "¿En qué campo revolucionó Steve Jobs la tecnología?",
    options: ["Inteligencia Artificial", "Computación personal y dispositivos móviles", "Redes sociales", "Videojuegos"],
    correct: 1,
    time: 15,
    image: "📱",
    category: "tecnologia"
  },
  {
    id: 8,
    question: "¿Qué científica ganó dos Premios Nobel en diferentes ciencias?",
    options: ["Rosalind Franklin", "Marie Curie", "Jane Goodall", "Barbara McClintock"],
    correct: 1,
    time: 15,
    image: "🏆",
    category: "ciencia"
  },
  {
    id: 9,
    question: "¿Quién es conocido como el padre de la computación moderna?",
    options: ["Bill Gates", "Alan Turing", "Steve Wozniak", "Tim Berners-Lee"],
    correct: 1,
    time: 15,
    image: "🖥️",
    category: "tecnologia"
  },
  {
    id: 10,
    question: "¿Qué descubrió Isaac Newton mientras observaba una manzana caer?",
    options: ["La electricidad", "La gravedad", "La fotosíntesis", "El magnetismo"],
    correct: 1,
    time: 15,
    image: "🍎",
    category: "ciencia"
  },

  // === ARTE Y CULTURA ===
  {
    id: 11,
    question: "¿Cuál de estas NO es una obra de Salvador Dalí?",
    options: ["La persistencia de la memoria", "La tentación de San Antonio", "Guernica", "Cisnes reflejando elefantes"],
    correct: 2,
    time: 15,
    image: "🎨",
    category: "arte"
  },
  {
    id: 12,
    question: "¿Qué profesión ejerció Leonardo da Vinci además de pintor?",
    options: ["Solo fue pintor", "Ingeniero e inventor", "Médico", "Abogado"],
    correct: 1,
    time: 15,
    image: "🔧",
    category: "arte"
  },
  {
    id: 13,
    question: "¿Cuál fue la profesión principal de Frida Kahlo?",
    options: ["Escultora", "Arquitecta", "Pintora", "Fotógrafa"],
    correct: 2,
    time: 15,
    image: "🖼️",
    category: "arte"
  },
  {
    id: 14,
    question: "¿Qué creó el arquitecto Antoni Gaudí en Barcelona?",
    options: ["El Museo del Prado", "La Sagrada Familia", "La Torre Eiffel", "El Coliseo"],
    correct: 1,
    time: 15,
    image: "🏛️",
    category: "arquitectura"
  },
  {
    id: 15,
    question: "¿Quién pintó la Mona Lisa?",
    options: ["Miguel Ángel", "Rafael", "Leonardo da Vinci", "Botticelli"],
    correct: 2,
    time: 15,
    image: "🖼️",
    category: "arte"
  },
  {
    id: 16,
    question: "¿Qué estilo arquitectónico caracteriza a la Torre Eiffel?",
    options: ["Gótico", "Barroco", "Art Nouveau", "Hierro y acero del siglo XIX"],
    correct: 3,
    time: 15,
    image: "🗼",
    category: "arquitectura"
  },
  {
    id: 17,
    question: "¿Quién compuso 'Las cuatro estaciones'?",
    options: ["Mozart", "Beethoven", "Vivaldi", "Bach"],
    correct: 2,
    time: 15,
    image: "🎻",
    category: "arte"
  },
  {
    id: 18,
    question: "¿Qué artista es famoso por sus pinturas de girasoles?",
    options: ["Monet", "Van Gogh", "Renoir", "Cézanne"],
    correct: 1,
    time: 15,
    image: "🌻",
    category: "arte"
  },

  // === MEDICINA Y SALUD ===
  {
    id: 19,
    question: "¿En qué área trabajó Florence Nightingale?",
    options: ["Astronomía", "Enfermería y estadística médica", "Literatura", "Derecho"],
    correct: 1,
    time: 15,
    image: "🏥",
    category: "medicina"
  },
  {
    id: 20,
    question: "¿Quién descubrió la penicilina?",
    options: ["Louis Pasteur", "Alexander Fleming", "Robert Koch", "Edward Jenner"],
    correct: 1,
    time: 15,
    image: "💊",
    category: "medicina"
  },
  {
    id: 21,
    question: "¿Qué órgano del cuerpo bombea la sangre?",
    options: ["Pulmones", "Hígado", "Corazón", "Riñones"],
    correct: 2,
    time: 10,
    image: "❤️",
    category: "medicina"
  },
  {
    id: 22,
    question: "¿Quién desarrolló la primera vacuna exitosa?",
    options: ["Louis Pasteur", "Edward Jenner", "Jonas Salk", "Robert Koch"],
    correct: 1,
    time: 15,
    image: "💉",
    category: "medicina"
  },
  {
    id: 23,
    question: "¿Qué sistema del cuerpo incluye el cerebro y la médula espinal?",
    options: ["Sistema digestivo", "Sistema nervioso", "Sistema circulatorio", "Sistema respiratorio"],
    correct: 1,
    time: 15,
    image: "🧠",
    category: "medicina"
  },

  // === NEGOCIOS Y EMPRENDIMIENTO ===
  {
    id: 24,
    question: "¿Quién fundó Microsoft junto con Paul Allen?",
    options: ["Steve Jobs", "Bill Gates", "Mark Zuckerberg", "Jeff Bezos"],
    correct: 1,
    time: 15,
    image: "💼",
    category: "negocios"
  },
  {
    id: 25,
    question: "¿Qué empresa fundó Elon Musk para explorar el espacio?",
    options: ["Blue Origin", "SpaceX", "Virgin Galactic", "NASA"],
    correct: 1,
    time: 15,
    image: "🚀",
    category: "negocios"
  },
  {
    id: 26,
    question: "¿Qué significa CEO en una empresa?",
    options: ["Chief Executive Officer", "Chief Engineering Officer", "Corporate Executive Order", "Central Executive Operations"],
    correct: 0,
    time: 15,
    image: "👔",
    category: "negocios"
  },
  {
    id: 27,
    question: "¿Quién es la fundadora de Grupo Bimbo?",
    options: ["Lorenzo Servitje", "Carlos Slim", "Roberto Servitje", "Daniel Servitje"],
    correct: 0,
    time: 15,
    image: "🍞",
    category: "negocios"
  },
  {
    id: 28,
    question: "¿Qué red social fundó Mark Zuckerberg?",
    options: ["Twitter", "Instagram", "Facebook", "LinkedIn"],
    correct: 2,
    time: 10,
    image: "📱",
    category: "tecnologia"
  },

  // === INGENIERÍA ===
  {
    id: 29,
    question: "¿Qué tipo de ingeniero diseña puentes y edificios?",
    options: ["Ingeniero mecánico", "Ingeniero civil", "Ingeniero eléctrico", "Ingeniero químico"],
    correct: 1,
    time: 15,
    image: "🌉",
    category: "ingenieria"
  },
  {
    id: 30,
    question: "¿En qué campo trabaja un ingeniero mecatrónico?",
    options: ["Solo mecánica", "Solo electrónica", "Combinación de mecánica, electrónica e informática", "Solo informática"],
    correct: 2,
    time: 15,
    image: "🤖",
    category: "ingenieria"
  },
  {
    id: 31,
    question: "¿Qué construyó el ingeniero Gustave Eiffel además de la torre?",
    options: ["La Estatua de la Libertad (estructura interna)", "El Coliseo", "El Big Ben", "El Partenón"],
    correct: 0,
    time: 15,
    image: "🗽",
    category: "ingenieria"
  },
  {
    id: 32,
    question: "¿Qué tipo de energía aprovecha un panel solar?",
    options: ["Energía eólica", "Energía solar", "Energía hidráulica", "Energía nuclear"],
    correct: 1,
    time: 10,
    image: "☀️",
    category: "ingenieria"
  },
  {
    id: 33,
    question: "¿Qué material se usa principalmente en la construcción de aviones modernos?",
    options: ["Hierro", "Acero", "Aluminio y materiales compuestos", "Cobre"],
    correct: 2,
    time: 15,
    image: "✈️",
    category: "ingenieria"
  },

  // === EDUCACIÓN Y HUMANIDADES ===
  {
    id: 34,
    question: "¿Quién escribió 'Don Quijote de la Mancha'?",
    options: ["Gabriel García Márquez", "Miguel de Cervantes", "Jorge Luis Borges", "Pablo Neruda"],
    correct: 1,
    time: 15,
    image: "📚",
    category: "educacion"
  },
  {
    id: 35,
    question: "¿Qué filósofo griego fue maestro de Alejandro Magno?",
    options: ["Sócrates", "Platón", "Aristóteles", "Tales de Mileto"],
    correct: 2,
    time: 15,
    image: "🏛️",
    category: "educacion"
  },
  {
    id: 36,
    question: "¿Qué premio internacional reconoce logros en literatura, paz y ciencias?",
    options: ["Premio Pulitzer", "Premio Nobel", "Premio Cervantes", "Premio Goncourt"],
    correct: 1,
    time: 15,
    image: "🏅",
    category: "educacion"
  },
  {
    id: 37,
    question: "¿Cuántos idiomas oficiales tiene la ONU?",
    options: ["4", "5", "6", "7"],
    correct: 2,
    time: 15,
    image: "🌍",
    category: "educacion"
  },

  // === MEDIO AMBIENTE ===
  {
    id: 38,
    question: "¿Qué gas es el principal responsable del efecto invernadero?",
    options: ["Oxígeno", "Nitrógeno", "Dióxido de carbono", "Helio"],
    correct: 2,
    time: 15,
    image: "🌡️",
    category: "ambiente"
  },
  {
    id: 39,
    question: "¿Qué profesional estudia los ecosistemas y el medio ambiente?",
    options: ["Geólogo", "Ecólogo", "Meteorólogo", "Oceanógrafo"],
    correct: 1,
    time: 15,
    image: "🌿",
    category: "ambiente"
  },
  {
    id: 40,
    question: "¿Qué tipo de energía renovable utiliza el viento?",
    options: ["Solar", "Eólica", "Geotérmica", "Hidroeléctrica"],
    correct: 1,
    time: 10,
    image: "💨",
    category: "ambiente"
  },

  // === DEPORTES Y PSICOLOGÍA ===
  {
    id: 41,
    question: "¿Qué profesional ayuda a los atletas con su rendimiento mental?",
    options: ["Nutriólogo", "Psicólogo deportivo", "Fisioterapeuta", "Entrenador físico"],
    correct: 1,
    time: 15,
    image: "🧠",
    category: "psicologia"
  },
  {
    id: 42,
    question: "¿Quién es considerado el padre del psicoanálisis?",
    options: ["Carl Jung", "Sigmund Freud", "B.F. Skinner", "Ivan Pavlov"],
    correct: 1,
    time: 15,
    image: "🛋️",
    category: "psicologia"
  },

  // === DERECHO Y POLÍTICA ===
  {
    id: 43,
    question: "¿Qué profesional defiende los derechos de las personas ante la ley?",
    options: ["Contador", "Abogado", "Economista", "Sociólogo"],
    correct: 1,
    time: 10,
    image: "⚖️",
    category: "derecho"
  },
  {
    id: 44,
    question: "¿Cuál es la máxima ley en México?",
    options: ["Código Civil", "Ley Federal del Trabajo", "Constitución Política", "Código Penal"],
    correct: 2,
    time: 15,
    image: "📜",
    category: "derecho"
  },

  // === COMUNICACIÓN Y MEDIOS ===
  {
    id: 45,
    question: "¿Qué profesional crea contenido visual para marcas y empresas?",
    options: ["Contador", "Diseñador gráfico", "Abogado", "Ingeniero"],
    correct: 1,
    time: 15,
    image: "🎨",
    category: "comunicacion"
  },
  {
    id: 46,
    question: "¿Qué significa UX en diseño digital?",
    options: ["Ultra Experience", "User Experience", "Universal Exchange", "Unique Export"],
    correct: 1,
    time: 15,
    image: "📱",
    category: "tecnologia"
  },

  // === GASTRONOMÍA ===
  {
    id: 47,
    question: "¿Qué chef mexicano tiene 3 estrellas Michelin?",
    options: ["Enrique Olvera", "Daniela Soto-Innes", "Jorge Vallejo", "Elena Reygadas"],
    correct: 0,
    time: 15,
    image: "👨‍🍳",
    category: "gastronomia"
  },
  {
    id: 48,
    question: "¿Qué alimento es la base de la dieta mexicana desde tiempos prehispánicos?",
    options: ["Trigo", "Arroz", "Maíz", "Papa"],
    correct: 2,
    time: 10,
    image: "🌽",
    category: "gastronomia"
  },

  // === ASTRONOMÍA Y ESPACIO ===
  {
    id: 49,
    question: "¿Quién fue el primer ser humano en caminar sobre la Luna?",
    options: ["Buzz Aldrin", "Neil Armstrong", "Yuri Gagarin", "John Glenn"],
    correct: 1,
    time: 15,
    image: "🌙",
    category: "ciencia"
  },
  {
    id: 50,
    question: "¿Qué planeta de nuestro sistema solar es conocido como el 'planeta rojo'?",
    options: ["Venus", "Júpiter", "Marte", "Saturno"],
    correct: 2,
    time: 10,
    image: "🔴",
    category: "ciencia"
  },

  // === MATEMÁTICAS Y LÓGICA ===
  {
    id: 51,
    question: "¿Qué profesional usa las matemáticas para calcular riesgos en seguros?",
    options: ["Contador", "Actuario", "Economista", "Estadístico"],
    correct: 1,
    time: 15,
    image: "📊",
    category: "matematicas"
  },
  {
    id: 52,
    question: "¿Qué matemático griego es famoso por su teorema sobre triángulos rectángulos?",
    options: ["Euclides", "Pitágoras", "Arquímedes", "Tales"],
    correct: 1,
    time: 15,
    image: "📐",
    category: "matematicas"
  },

  // === HISTORIA ===
  {
    id: 53,
    question: "¿Qué civilización construyó Teotihuacán?",
    options: ["Mayas", "Aztecas", "Cultura Teotihuacana (origen desconocido)", "Olmecas"],
    correct: 2,
    time: 15,
    image: "🏛️",
    category: "historia"
  },
  {
    id: 54,
    question: "¿En qué año llegó Cristóbal Colón a América?",
    options: ["1492", "1519", "1521", "1455"],
    correct: 0,
    time: 10,
    image: "⛵",
    category: "historia"
  },

  // === FINANZAS ===
  {
    id: 55,
    question: "¿Qué profesional se encarga de auditar los estados financieros de una empresa?",
    options: ["Economista", "Contador público", "Administrador", "Banquero"],
    correct: 1,
    time: 15,
    image: "📈",
    category: "finanzas"
  },
  {
    id: 56,
    question: "¿Qué es el PIB de un país?",
    options: ["Producto Interno Bruto", "Precio Internacional Bancario", "Plan de Inversión Básica", "Proyecto de Infraestructura Base"],
    correct: 0,
    time: 15,
    image: "💰",
    category: "finanzas"
  },

  // === PREGUNTAS ADICIONALES ===
  {
    id: 57,
    question: "¿Qué científico desarrolló la teoría de la relatividad?",
    options: ["Newton", "Einstein", "Hawking", "Bohr"],
    correct: 1,
    time: 15,
    image: "🌌",
    category: "ciencia"
  },
  {
    id: 58,
    question: "¿Qué red social es conocida por sus videos cortos y virales?",
    options: ["Facebook", "LinkedIn", "TikTok", "Twitter"],
    correct: 2,
    time: 10,
    image: "📱",
    category: "tecnologia"
  },
  {
    id: 59,
    question: "¿Qué arquitecta iraquí-británica ganó el Premio Pritzker en 2004?",
    options: ["Zaha Hadid", "Rem Koolhaas", "Frank Gehry", "Norman Foster"],
    correct: 0,
    time: 15,
    image: "🏗️",
    category: "arquitectura"
  },
  {
    id: 60,
    question: "¿Qué inventor creó el sistema de producción en masa para automóviles?",
    options: ["Karl Benz", "Henry Ford", "Rudolf Diesel", "Gottlieb Daimler"],
    correct: 1,
    time: 15,
    image: "🚗",
    category: "ingenieria"
  }
];

// Función para seleccionar preguntas aleatorias sin repetir
function selectRandomQuestions(count) {
  const shuffled = [...allQuizQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

io.on('connection', (socket) => {
  console.log(`🎮 Usuario conectado: ${socket.id}`);

  // Host crea una nueva sala
  socket.on('create-room', (callback) => {
    const roomCode = generateRoomCode();
    const room = {
      code: roomCode,
      hostId: socket.id,
      players: new Map(),
      currentQuestion: -1,
      gameState: 'lobby',
      answers: new Map(),
      questionStartTime: null,
      selectedQuestions: [], // Preguntas seleccionadas para este juego
    };
    
    gameRooms.set(roomCode, room);
    socket.join(roomCode);
    
    console.log(`🏠 Sala creada: ${roomCode}`);
    callback({ success: true, roomCode });
  });

  // Jugador se une a una sala
  socket.on('join-room', ({ roomCode, playerName }, callback) => {
    const room = gameRooms.get(roomCode.toUpperCase());
    
    if (!room) {
      callback({ success: false, error: 'Sala no encontrada' });
      return;
    }
    
    if (room.gameState !== 'lobby') {
      callback({ success: false, error: 'El juego ya comenzó' });
      return;
    }

    const player = {
      id: socket.id,
      name: playerName,
      score: 0,
      streak: 0,
      answers: []
    };
    
    room.players.set(socket.id, player);
    socket.join(roomCode.toUpperCase());
    
    io.to(room.hostId).emit('player-joined', {
      players: Array.from(room.players.values())
    });
    
    console.log(`👤 ${playerName} se unió a ${roomCode}`);
    callback({ success: true, playerName });
  });

  // Host inicia el juego
  socket.on('start-game', ({ roomCode }) => {
    const room = gameRooms.get(roomCode);
    if (!room || room.hostId !== socket.id) return;
    
    room.gameState = 'starting';
    room.currentQuestion = -1;
    
    // Seleccionar preguntas aleatorias para este juego
    room.selectedQuestions = selectRandomQuestions(QUESTIONS_PER_GAME);
    console.log(`🎲 Seleccionadas ${room.selectedQuestions.length} preguntas aleatorias para sala ${roomCode}`);
    
    io.to(roomCode).emit('game-starting', { countdown: 3 });
    
    setTimeout(() => {
      nextQuestion(roomCode);
    }, 3000);
  });

  // Host pasa a la siguiente pregunta
  socket.on('next-question', ({ roomCode }) => {
    const room = gameRooms.get(roomCode);
    if (!room || room.hostId !== socket.id) return;
    nextQuestion(roomCode);
  });

  // Jugador envía respuesta
  socket.on('submit-answer', ({ roomCode, answerIndex }) => {
    const room = gameRooms.get(roomCode);
    if (!room || room.gameState !== 'question') return;
    
    const player = room.players.get(socket.id);
    if (!player || room.answers.has(socket.id)) return;
    
    const timeElapsed = Date.now() - room.questionStartTime;
    const question = room.selectedQuestions[room.currentQuestion];
    const maxTime = question.time * 1000;
    const timeBonus = Math.max(0, Math.floor((1 - timeElapsed / maxTime) * 500));
    
    const isCorrect = answerIndex === question.correct;
    let points = 0;
    
    if (isCorrect) {
      player.streak++;
      const streakBonus = Math.min(player.streak - 1, 3) * 100;
      points = 500 + timeBonus + streakBonus;
      player.score += points;
    } else {
      player.streak = 0;
    }
    
    room.answers.set(socket.id, {
      answerIndex,
      isCorrect,
      points,
      timeElapsed
    });
    
    player.answers.push({
      questionId: question.id,
      answerIndex,
      isCorrect,
      points
    });
    
    socket.emit('answer-result', { 
      received: true,
      answerIndex 
    });
    
    io.to(room.hostId).emit('answer-count', {
      count: room.answers.size,
      total: room.players.size
    });
    
    console.log(`📝 ${player.name} respondió ${isCorrect ? '✅' : '❌'}`);
  });

  // Desconexión
  socket.on('disconnect', () => {
    console.log(`👋 Usuario desconectado: ${socket.id}`);
    
    for (const [roomCode, room] of gameRooms) {
      if (room.players.has(socket.id)) {
        room.players.delete(socket.id);
        io.to(room.hostId).emit('player-left', {
          players: Array.from(room.players.values())
        });
      }
      
      if (room.hostId === socket.id) {
        io.to(roomCode).emit('room-closed');
        gameRooms.delete(roomCode);
      }
    }
  });
});

function nextQuestion(roomCode) {
  const room = gameRooms.get(roomCode);
  if (!room) return;
  
  room.currentQuestion++;
  room.answers.clear();
  
  if (room.currentQuestion >= room.selectedQuestions.length) {
    room.gameState = 'finished';
    const leaderboard = getLeaderboard(room);
    io.to(roomCode).emit('game-finished', { leaderboard });
    return;
  }
  
  const question = room.selectedQuestions[room.currentQuestion];
  room.gameState = 'question';
  room.questionStartTime = Date.now();
  
  io.to(roomCode).emit('new-question', {
    questionNumber: room.currentQuestion + 1,
    totalQuestions: room.selectedQuestions.length,
    question: question.question,
    options: question.options,
    time: question.time,
    image: question.image
  });
  
  setTimeout(() => {
    revealAnswer(roomCode);
  }, question.time * 1000);
}

function revealAnswer(roomCode) {
  const room = gameRooms.get(roomCode);
  if (!room || room.gameState !== 'question') return;
  
  room.gameState = 'answer-reveal';
  const question = room.selectedQuestions[room.currentQuestion];
  
  const answerCounts = [0, 0, 0, 0];
  let correctCount = 0;
  
  for (const [, answer] of room.answers) {
    answerCounts[answer.answerIndex]++;
    if (answer.isCorrect) correctCount++;
  }
  
  for (const [playerId, player] of room.players) {
    const answer = room.answers.get(playerId);
    io.to(playerId).emit('answer-revealed', {
      correctIndex: question.correct,
      yourAnswer: answer ? answer.answerIndex : -1,
      isCorrect: answer ? answer.isCorrect : false,
      points: answer ? answer.points : 0,
      totalScore: player.score,
      streak: player.streak
    });
  }
  
  io.to(room.hostId).emit('answer-revealed-host', {
    correctIndex: question.correct,
    answerCounts,
    correctCount,
    totalPlayers: room.players.size,
    leaderboard: getLeaderboard(room).slice(0, 5)
  });
}

function getLeaderboard(room) {
  return Array.from(room.players.values())
    .sort((a, b) => b.score - a.score)
    .map((player, index) => ({
      rank: index + 1,
      name: player.name,
      score: player.score,
      streak: player.streak
    }));
}

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Socket.io server running on port ${PORT}`);
  console.log(`📚 Banco de preguntas: ${allQuizQuestions.length} preguntas disponibles`);
  console.log(`🎯 Preguntas por juego: ${QUESTIONS_PER_GAME}`);
});

module.exports = { io, gameRooms };
