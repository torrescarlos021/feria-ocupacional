'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Preguntas basadas en modelo RIASEC simplificado
const vocationalQuestions = [
  {
    id: 1,
    question: "¿Qué actividad disfrutarías más en un fin de semana libre?",
    options: [
      { text: "Armar o reparar algo con mis manos", type: "R" },
      { text: "Investigar un tema que me intriga", type: "I" },
      { text: "Crear algo artístico o diseñar", type: "A" },
      { text: "Organizar una reunión con amigos", type: "S" },
    ]
  },
  {
    id: 2,
    question: "En un proyecto escolar, prefieres ser quien...",
    options: [
      { text: "Construye el prototipo o maqueta", type: "R" },
      { text: "Analiza los datos y saca conclusiones", type: "I" },
      { text: "Diseña la presentación visual", type: "A" },
      { text: "Coordina al equipo y presenta", type: "E" },
    ]
  },
  {
    id: 3,
    question: "¿Qué tipo de video te atrapa más en YouTube?",
    options: [
      { text: "Tutoriales de construcción o DIY", type: "R" },
      { text: "Documentales científicos o tech", type: "I" },
      { text: "Arte, música o contenido creativo", type: "A" },
      { text: "Emprendimiento y negocios", type: "E" },
    ]
  },
  {
    id: 4,
    question: "¿Cómo te describirían tus amigos?",
    options: [
      { text: "Práctico/a y hábil con las manos", type: "R" },
      { text: "Curioso/a y analítico/a", type: "I" },
      { text: "Creativo/a y original", type: "A" },
      { text: "Sociable y buen/a líder", type: "S" },
    ]
  },
  {
    id: 5,
    question: "¿Qué problema mundial te gustaría resolver?",
    options: [
      { text: "Infraestructura y construcción sostenible", type: "R" },
      { text: "Enfermedades y avances médicos", type: "I" },
      { text: "Preservar la cultura y el arte", type: "A" },
      { text: "Desigualdad social y educación", type: "S" },
    ]
  },
  {
    id: 6,
    question: "En un videojuego, ¿qué rol prefieres?",
    options: [
      { text: "Constructor/ingeniero", type: "R" },
      { text: "Estratega/analista", type: "I" },
      { text: "Diseñador de personajes/mundos", type: "A" },
      { text: "Líder del equipo/clan", type: "E" },
    ]
  },
  {
    id: 7,
    question: "¿Qué asignatura te parece más interesante?",
    options: [
      { text: "Física o Tecnología", type: "R" },
      { text: "Biología o Química", type: "I" },
      { text: "Arte o Música", type: "A" },
      { text: "Historia o Filosofía", type: "S" },
    ]
  },
  {
    id: 8,
    question: "¿Cómo prefieres trabajar?",
    options: [
      { text: "Haciendo cosas tangibles y físicas", type: "R" },
      { text: "Resolviendo problemas complejos", type: "I" },
      { text: "Con libertad creativa total", type: "A" },
      { text: "Colaborando con otras personas", type: "S" },
    ]
  },
  {
    id: 9,
    question: "¿Qué te emociona más de tu futuro profesional?",
    options: [
      { text: "Crear productos o tecnología innovadora", type: "R" },
      { text: "Hacer descubrimientos importantes", type: "I" },
      { text: "Expresar mi visión única del mundo", type: "A" },
      { text: "Liderar mi propia empresa", type: "E" },
    ]
  },
  {
    id: 10,
    question: "Si pudieras tener un superpoder, sería...",
    options: [
      { text: "Construir cualquier cosa instantáneamente", type: "R" },
      { text: "Conocer todos los secretos del universo", type: "I" },
      { text: "Crear mundos enteros con mi imaginación", type: "A" },
      { text: "Conectar y entender a cualquier persona", type: "S" },
    ]
  },
  {
    id: 11,
    question: "En una feria de ciencias, te gustaría presentar...",
    options: [
      { text: "Un robot o dispositivo mecánico", type: "R" },
      { text: "Un experimento científico", type: "I" },
      { text: "Una instalación artística multimedia", type: "A" },
      { text: "Un proyecto de impacto social", type: "S" },
    ]
  },
  {
    id: 12,
    question: "¿Qué frase te representa más?",
    options: [
      { text: "Me gusta entender cómo funcionan las cosas", type: "R" },
      { text: "Siempre busco la verdad y el conocimiento", type: "I" },
      { text: "Veo el mundo de manera diferente", type: "A" },
      { text: "Me importa el bienestar de los demás", type: "S" },
    ]
  },
];

// Carreras por tipo
const careersByType = {
  R: {
    name: "Realista",
    emoji: "🔧",
    color: "cyan",
    description: "Te gusta trabajar con las manos, herramientas y máquinas. Eres práctico/a y orientado/a a resultados.",
    careers: [
      { name: "Ingeniería Mecatrónica", icon: "🤖" },
      { name: "Ingeniería Civil", icon: "🏗️" },
      { name: "Ingeniería Mecánica", icon: "⚙️" },
      { name: "Arquitectura", icon: "🏛️" },
      { name: "Ingeniería Industrial", icon: "🏭" },
      { name: "Ingeniería Automotriz", icon: "🚗" },
    ]
  },
  I: {
    name: "Investigador",
    emoji: "🔬",
    color: "green",
    description: "Te fascina analizar, investigar y resolver problemas complejos. Buscas entender el porqué de las cosas.",
    careers: [
      { name: "Medicina", icon: "🩺" },
      { name: "Biotecnología", icon: "🧬" },
      { name: "Física", icon: "⚛️" },
      { name: "Ciencia de Datos", icon: "📊" },
      { name: "Ingeniería Química", icon: "🧪" },
      { name: "Investigación Científica", icon: "🔭" },
    ]
  },
  A: {
    name: "Artístico",
    emoji: "🎨",
    color: "magenta",
    description: "Tienes una visión única del mundo y necesitas expresarla. La creatividad es tu motor.",
    careers: [
      { name: "Diseño Gráfico", icon: "✏️" },
      { name: "Animación Digital", icon: "🎬" },
      { name: "Arquitectura", icon: "🏛️" },
      { name: "Diseño Industrial", icon: "💡" },
      { name: "Producción Musical", icon: "🎵" },
      { name: "Diseño UX/UI", icon: "📱" },
    ]
  },
  S: {
    name: "Social",
    emoji: "🤝",
    color: "yellow",
    description: "Te importa el bienestar de los demás. Disfrutas ayudar, enseñar y conectar con personas.",
    careers: [
      { name: "Psicología", icon: "🧠" },
      { name: "Medicina", icon: "🩺" },
      { name: "Educación", icon: "📚" },
      { name: "Trabajo Social", icon: "💚" },
      { name: "Comunicación", icon: "📢" },
      { name: "Recursos Humanos", icon: "👥" },
    ]
  },
  E: {
    name: "Emprendedor",
    emoji: "🚀",
    color: "orange",
    description: "Te gusta liderar, persuadir y tomar riesgos. Ves oportunidades donde otros ven problemas.",
    careers: [
      { name: "Administración de Empresas", icon: "💼" },
      { name: "Marketing Digital", icon: "📈" },
      { name: "Finanzas", icon: "💰" },
      { name: "Derecho Corporativo", icon: "⚖️" },
      { name: "Emprendimiento", icon: "🎯" },
      { name: "Relaciones Internacionales", icon: "🌎" },
    ]
  },
};

export default function TestPage() {
  const [gameState, setGameState] = useState('intro'); // intro, questions, results
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);

  const handleAnswer = (type) => {
    const newAnswers = { ...answers, [currentQuestion]: type };
    setAnswers(newAnswers);

    if (currentQuestion < vocationalQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      // Calcular resultados
      calculateResults(newAnswers);
    }
  };

  const calculateResults = (allAnswers) => {
    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0 };
    
    Object.values(allAnswers).forEach(type => {
      if (scores.hasOwnProperty(type)) {
        scores[type]++;
      }
    });

    // Ordenar por puntaje
    const sorted = Object.entries(scores)
      .sort(([,a], [,b]) => b - a)
      .map(([type, score]) => ({ type, score }));

    setResults({
      primary: sorted[0],
      secondary: sorted[1],
      scores
    });
    setGameState('results');
  };

  if (gameState === 'intro') {
    return <IntroScreen onStart={() => setGameState('questions')} />;
  }

  if (gameState === 'questions') {
    return (
      <QuestionScreen
        question={vocationalQuestions[currentQuestion]}
        questionNumber={currentQuestion + 1}
        totalQuestions={vocationalQuestions.length}
        onAnswer={handleAnswer}
      />
    );
  }

  if (gameState === 'results') {
    return <ResultsScreen results={results} />;
  }

  return null;
}

function IntroScreen({ onStart }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-8xl mb-6"
        >
          🎯
        </motion.div>

        <h1 className="font-display text-4xl font-black mb-4">
          <span className="text-white">TEST</span>{' '}
          <span className="text-neon-magenta">VOCACIONAL</span>
        </h1>

        <p className="text-xl text-gray-300 mb-8">
          Descubre qué carreras van mejor con tu personalidad y tus intereses
        </p>

        <div className="card-neon rounded-xl p-6 mb-8 text-left">
          <h3 className="font-display font-bold text-neon-cyan mb-4">📋 Instrucciones</h3>
          <ul className="space-y-2 text-gray-300">
            <li>• Responde las 12 preguntas honestamente</li>
            <li>• No hay respuestas correctas o incorrectas</li>
            <li>• Elige la opción que más te represente</li>
            <li>• Tómate tu tiempo, no hay límite</li>
          </ul>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="px-10 py-5 bg-gradient-to-r from-neon-magenta to-neon-cyan rounded-xl font-display font-bold text-xl text-arena-dark"
        >
          COMENZAR TEST 🚀
        </motion.button>
      </motion.div>
    </div>
  );
}

function QuestionScreen({ question, questionNumber, totalQuestions, onAnswer }) {
  const progress = (questionNumber / totalQuestions) * 100;

  return (
    <div className="min-h-screen flex flex-col p-4">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Pregunta {questionNumber} de {totalQuestions}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-arena-card rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-neon-cyan to-neon-magenta"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="flex-1 flex flex-col"
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-8 text-center">
            {question.question}
          </h2>

          <div className="flex-1 flex flex-col gap-3 max-w-2xl mx-auto w-full">
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 10 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onAnswer(option.type)}
                className="card-neon rounded-xl p-5 text-left hover:border-neon-cyan/50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-neon-cyan/10 flex items-center justify-center text-neon-cyan font-bold group-hover:bg-neon-cyan/20 transition-colors">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-lg text-white group-hover:text-neon-cyan transition-colors">
                    {option.text}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ResultsScreen({ results }) {
  const primary = careersByType[results.primary.type];
  const secondary = careersByType[results.secondary.type];

  return (
    <div className="min-h-screen p-4 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-7xl mb-4"
          >
            {primary.emoji}
          </motion.div>
          <h1 className="font-display text-3xl font-black mb-2">
            <span className="text-white">Tu perfil es</span>{' '}
            <span className={`text-neon-${primary.color}`}>{primary.name}</span>
          </h1>
          <p className="text-gray-300">{primary.description}</p>
        </div>

        {/* Primary careers */}
        <div className="card-neon rounded-2xl p-6 mb-6">
          <h3 className="font-display font-bold text-xl text-neon-cyan mb-4">
            🎯 Carreras recomendadas para ti
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {primary.careers.map((career, index) => (
              <motion.div
                key={career.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-arena-dark/50 rounded-xl p-4 flex items-center gap-3"
              >
                <span className="text-2xl">{career.icon}</span>
                <span className="text-sm font-medium">{career.name}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Secondary profile */}
        <div className="card-neon rounded-2xl p-6 mb-6 opacity-80">
          <h3 className="font-display font-bold text-lg text-gray-300 mb-3">
            También tienes rasgos de perfil {secondary.emoji} {secondary.name}
          </h3>
          <div className="flex flex-wrap gap-2">
            {secondary.careers.slice(0, 3).map((career) => (
              <span 
                key={career.name}
                className="px-3 py-1 bg-arena-dark/50 rounded-full text-sm text-gray-400"
              >
                {career.icon} {career.name}
              </span>
            ))}
          </div>
        </div>

        {/* Score breakdown */}
        <div className="card-neon rounded-2xl p-6 mb-8">
          <h3 className="font-display font-bold text-lg text-white mb-4">
            📊 Tu perfil completo
          </h3>
          <div className="space-y-3">
            {Object.entries(results.scores)
              .sort(([,a], [,b]) => b - a)
              .map(([type, score]) => {
                const profile = careersByType[type];
                const percentage = (score / vocationalQuestions.length) * 100;
                return (
                  <div key={type}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">
                        {profile.emoji} {profile.name}
                      </span>
                      <span className="text-gray-400">{score} pts</span>
                    </div>
                    <div className="h-2 bg-arena-dark rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className={`h-full bg-neon-${profile.color}`}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4">
          <Link href="/results">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-4 bg-gradient-to-r from-neon-magenta to-neon-cyan rounded-xl font-display font-bold text-xl text-arena-dark"
            >
              🖼️ CREAR MI COLLAGE CON IA
            </motion.button>
          </Link>

          <Link href="/recursos">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 border-2 border-neon-cyan/30 rounded-xl font-display font-bold text-lg text-neon-cyan hover:bg-neon-cyan/10 transition-colors"
            >
              📚 VER RECURSOS
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
