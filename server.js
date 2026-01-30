const { Server } = require('socket.io');
const http = require('http');
const { v4: uuidv4 } = require('uuid');

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"]
  }
});

// Estado de las salas de juego
const gameRooms = new Map();

// Preguntas del quiz de cultura general
const quizQuestions = [
  {
    id: 1,
    question: "¿En qué área de la ciencia destacó Albert Einstein?",
    options: ["Biología", "Física Teórica", "Química", "Matemáticas Puras"],
    correct: 1,
    time: 20,
    image: "🧠"
  },
  {
    id: 2,
    question: "¿Quiénes fueron Marie y Pierre Curie?",
    options: ["Filósofos franceses", "Científicos pioneros en radioactividad", "Pintores impresionistas", "Músicos clásicos"],
    correct: 1,
    time: 20,
    image: "⚗️"
  },
  {
    id: 3,
    question: "¿Cuál de estas NO es una obra de Salvador Dalí?",
    options: ["La persistencia de la memoria", "El gran masturbador", "Guernica", "Cisnes reflejando elefantes"],
    correct: 2,
    time: 25,
    image: "🎨"
  },
  {
    id: 4,
    question: "¿Qué profesión ejerció Leonardo da Vinci además de pintor?",
    options: ["Solo fue pintor", "Ingeniero e inventor", "Médico", "Abogado"],
    correct: 1,
    time: 20,
    image: "🔧"
  },
  {
    id: 5,
    question: "¿En qué campo revolucionó Steve Jobs la tecnología?",
    options: ["Inteligencia Artificial", "Computación personal y dispositivos móviles", "Redes sociales", "Videojuegos"],
    correct: 1,
    time: 20,
    image: "📱"
  },
  {
    id: 6,
    question: "¿Qué descubrió Nikola Tesla?",
    options: ["La penicilina", "La corriente alterna (AC)", "El teléfono", "La vacuna contra la rabia"],
    correct: 1,
    time: 20,
    image: "⚡"
  },
  {
    id: 7,
    question: "¿Cuál fue la profesión principal de Frida Kahlo?",
    options: ["Escultora", "Arquitecta", "Pintora", "Fotógrafa"],
    correct: 2,
    time: 15,
    image: "🖼️"
  },
  {
    id: 8,
    question: "¿En qué área trabajó Florence Nightingale?",
    options: ["Astronomía", "Enfermería y estadística médica", "Literatura", "Derecho"],
    correct: 1,
    time: 20,
    image: "🏥"
  },
  {
    id: 9,
    question: "¿Qué creó el arquitecto Antoni Gaudí en Barcelona?",
    options: ["El Museo del Prado", "La Sagrada Familia", "La Torre Eiffel", "El Coliseo"],
    correct: 1,
    time: 20,
    image: "🏛️"
  },
  {
    id: 10,
    question: "¿En qué campo destacó Ada Lovelace?",
    options: ["Primera programadora de la historia", "Primera astronauta", "Primera médica", "Primera abogada"],
    correct: 0,
    time: 20,
    image: "💻"
  }
];

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
      gameState: 'lobby', // lobby, question, answer-reveal, leaderboard, finished
      answers: new Map(),
      questionStartTime: null,
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
    
    // Notificar al host del nuevo jugador
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
    const question = quizQuestions[room.currentQuestion];
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
    
    // Notificar al jugador su resultado inmediato
    socket.emit('answer-result', { 
      received: true,
      answerIndex 
    });
    
    // Notificar al host cuántos han respondido
    io.to(room.hostId).emit('answer-count', {
      count: room.answers.size,
      total: room.players.size
    });
    
    console.log(`📝 ${player.name} respondió ${isCorrect ? '✅' : '❌'}`);
  });

  // Desconexión
  socket.on('disconnect', () => {
    console.log(`👋 Usuario desconectado: ${socket.id}`);
    
    // Buscar si era un jugador y removerlo
    for (const [roomCode, room] of gameRooms) {
      if (room.players.has(socket.id)) {
        room.players.delete(socket.id);
        io.to(room.hostId).emit('player-left', {
          players: Array.from(room.players.values())
        });
      }
      
      // Si el host se desconecta, cerrar la sala
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
  
  if (room.currentQuestion >= quizQuestions.length) {
    // Juego terminado
    room.gameState = 'finished';
    const leaderboard = getLeaderboard(room);
    io.to(roomCode).emit('game-finished', { leaderboard });
    return;
  }
  
  const question = quizQuestions[room.currentQuestion];
  room.gameState = 'question';
  room.questionStartTime = Date.now();
  
  // Enviar pregunta a todos
  io.to(roomCode).emit('new-question', {
    questionNumber: room.currentQuestion + 1,
    totalQuestions: quizQuestions.length,
    question: question.question,
    options: question.options,
    time: question.time,
    image: question.image
  });
  
  // Timer para revelar respuesta
  setTimeout(() => {
    revealAnswer(roomCode);
  }, question.time * 1000);
}

function revealAnswer(roomCode) {
  const room = gameRooms.get(roomCode);
  if (!room || room.gameState !== 'question') return;
  
  room.gameState = 'answer-reveal';
  const question = quizQuestions[room.currentQuestion];
  
  // Calcular estadísticas
  const answerCounts = [0, 0, 0, 0];
  let correctCount = 0;
  
  for (const [, answer] of room.answers) {
    answerCounts[answer.answerIndex]++;
    if (answer.isCorrect) correctCount++;
  }
  
  // Enviar resultados a jugadores
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
  
  // Enviar al host
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
});

module.exports = { io, gameRooms };
