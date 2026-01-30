'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export default function HostPage() {
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState('idle'); // idle, lobby, starting, question, answer-reveal, finished
  const [roomCode, setRoomCode] = useState('');
  const [players, setPlayers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [timeLeft, setTimeLeft] = useState(0);
  const [maxTime, setMaxTime] = useState(20);
  const [answerCount, setAnswerCount] = useState(0);
  const [answerStats, setAnswerStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [countdown, setCountdown] = useState(0);

  // Conectar socket
  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  // Event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('player-joined', ({ players }) => {
      setPlayers(players);
    });

    socket.on('player-left', ({ players }) => {
      setPlayers(players);
    });

    socket.on('game-starting', ({ countdown }) => {
      setGameState('starting');
      setCountdown(countdown);
    });

    socket.on('new-question', (data) => {
      setGameState('question');
      setCurrentQuestion(data);
      setQuestionNumber(data.questionNumber);
      setTotalQuestions(data.totalQuestions);
      setTimeLeft(data.time);
      setMaxTime(data.time);
      setAnswerCount(0);
      setAnswerStats(null);
    });

    socket.on('answer-count', ({ count, total }) => {
      setAnswerCount(count);
    });

    socket.on('answer-revealed-host', (data) => {
      setGameState('answer-reveal');
      setAnswerStats(data);
      setLeaderboard(data.leaderboard);
    });

    socket.on('game-finished', ({ leaderboard }) => {
      setGameState('finished');
      setLeaderboard(leaderboard);
    });

    return () => {
      socket.off('player-joined');
      socket.off('player-left');
      socket.off('game-starting');
      socket.off('new-question');
      socket.off('answer-count');
      socket.off('answer-revealed-host');
      socket.off('game-finished');
    };
  }, [socket]);

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'question' || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 0.1));
    }, 100);

    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // Countdown para inicio
  useEffect(() => {
    if (gameState !== 'starting' || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, countdown]);

  const createRoom = useCallback(() => {
    if (!socket) return;
    
    socket.emit('create-room', (response) => {
      if (response.success) {
        setRoomCode(response.roomCode);
        setGameState('lobby');
      }
    });
  }, [socket]);

  const startGame = useCallback(() => {
    if (!socket || players.length === 0) return;
    socket.emit('start-game', { roomCode });
  }, [socket, roomCode, players.length]);

  const nextQuestion = useCallback(() => {
    if (!socket) return;
    socket.emit('next-question', { roomCode });
  }, [socket, roomCode]);

  // Render según estado
  if (gameState === 'idle') {
    return <IdleScreen onCreateRoom={createRoom} />;
  }

  if (gameState === 'lobby') {
    return (
      <LobbyScreen 
        roomCode={roomCode} 
        players={players} 
        onStart={startGame}
        canStart={players.length > 0}
      />
    );
  }

  if (gameState === 'starting') {
    return <CountdownScreen count={countdown} />;
  }

  if (gameState === 'question') {
    return (
      <QuestionScreen
        question={currentQuestion}
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
        timeLeft={timeLeft}
        maxTime={maxTime}
        answerCount={answerCount}
        totalPlayers={players.length}
      />
    );
  }

  if (gameState === 'answer-reveal') {
    return (
      <AnswerRevealScreen
        question={currentQuestion}
        stats={answerStats}
        leaderboard={leaderboard}
        onNext={nextQuestion}
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
      />
    );
  }

  if (gameState === 'finished') {
    return <FinalScreen leaderboard={leaderboard} roomCode={roomCode} />;
  }

  return null;
}

// ============ SUB-COMPONENTS ============

function IdleScreen({ onCreateRoom }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="text-8xl mb-8">🎯</div>
        <h1 className="font-display text-5xl md:text-7xl font-black mb-4">
          <span className="text-white">FERIA</span>{' '}
          <span className="text-neon-cyan">OCUPACIONAL</span>
        </h1>
        <p className="text-xl text-gray-400 mb-12">Pantalla del Presentador</p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCreateRoom}
          className="px-12 py-6 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-2xl font-display font-bold text-2xl text-arena-dark"
        >
          CREAR SALA
        </motion.button>
      </motion.div>
    </div>
  );
}

function LobbyScreen({ roomCode, players, onStart, canStart }) {
  return (
    <div className="min-h-screen flex flex-col p-8">
      {/* Header con código */}
      <div className="text-center mb-8">
        <p className="text-xl text-gray-400 mb-4">Únete en <span className="text-neon-cyan font-bold">tudominio.com/play</span></p>
        <div className="inline-block px-8 py-4 bg-arena-card rounded-2xl border border-arena-border">
          <p className="text-sm text-gray-500 mb-2">CÓDIGO DE SALA</p>
          <div className="room-code">{roomCode}</div>
        </div>
      </div>

      {/* Grid de jugadores */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
          <AnimatePresence mode="popLayout">
            {players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, scale: 0, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0 }}
                className="card-neon rounded-xl p-4 text-center"
              >
                <div className="text-3xl mb-2">
                  {['😎', '🤓', '😁', '🚀', '⭐', '🔥', '💪', '🎯'][index % 8]}
                </div>
                <p className="font-display font-bold text-white truncate">{player.name}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {players.length === 0 && (
          <div className="text-center py-20">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              ⏳
            </motion.div>
            <p className="text-xl text-gray-400">Esperando jugadores...</p>
          </div>
        )}
      </div>

      {/* Footer con botón de inicio */}
      <div className="text-center mt-8">
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className="text-4xl font-display font-bold text-neon-cyan">{players.length}</span>
          <span className="text-xl text-gray-400">jugadores conectados</span>
        </div>
        
        <motion.button
          whileHover={canStart ? { scale: 1.05 } : {}}
          whileTap={canStart ? { scale: 0.95 } : {}}
          onClick={onStart}
          disabled={!canStart}
          className={`px-12 py-6 rounded-2xl font-display font-bold text-2xl transition-all ${
            canStart 
              ? 'bg-gradient-to-r from-neon-green to-neon-cyan text-arena-dark cursor-pointer' 
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
        >
          {canStart ? '🚀 INICIAR JUEGO' : 'ESPERANDO JUGADORES...'}
        </motion.button>
      </div>
    </div>
  );
}

function CountdownScreen({ count }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={count}
          initial={{ scale: 2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {count > 0 ? (
            <span className="font-display text-[200px] font-black text-glow-cyan text-neon-cyan">
              {count}
            </span>
          ) : (
            <span className="font-display text-8xl font-black text-glow-green text-neon-green">
              ¡VAMOS!
            </span>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function QuestionScreen({ question, questionNumber, totalQuestions, timeLeft, maxTime, answerCount, totalPlayers }) {
  const timePercent = (timeLeft / maxTime) * 100;
  const colors = ['red', 'blue', 'yellow', 'green'];
  const shapes = ['▲', '◆', '●', '■'];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Timer bar */}
      <div className="h-3 bg-arena-card">
        <motion.div
          className="h-full"
          style={{
            width: `${timePercent}%`,
            background: timePercent > 50 
              ? 'linear-gradient(90deg, #39ff14, #00f5ff)' 
              : timePercent > 25 
                ? 'linear-gradient(90deg, #ffff00, #ff6b35)'
                : 'linear-gradient(90deg, #ff6b35, #ff1493)',
          }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <div className="text-xl text-gray-400">
          Pregunta <span className="text-neon-cyan font-bold">{questionNumber}</span> de {totalQuestions}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">👥</span>
          <span className="text-xl">
            <span className="text-neon-green font-bold">{answerCount}</span>
            <span className="text-gray-400">/{totalPlayers}</span>
          </span>
        </div>
        <div className="text-5xl font-display font-black text-neon-cyan">
          {Math.ceil(timeLeft)}
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-6xl mb-6 block">{question.image}</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white max-w-4xl">
            {question.question}
          </h2>
        </motion.div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-5xl">
          {question.options.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`answer-btn ${colors[index]} rounded-xl text-white text-2xl font-bold flex items-center gap-4`}
            >
              <span className="text-3xl opacity-70">{shapes[index]}</span>
              <span>{option}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnswerRevealScreen({ question, stats, leaderboard, onNext, questionNumber, totalQuestions }) {
  const colors = ['red', 'blue', 'yellow', 'green'];
  const shapes = ['▲', '◆', '●', '■'];
  const isLastQuestion = questionNumber >= totalQuestions;

  return (
    <div className="min-h-screen flex flex-col p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="font-display text-3xl font-bold text-white mb-2">{question.question}</h2>
        <p className="text-xl text-gray-400">
          <span className="text-neon-green font-bold">{stats.correctCount}</span> de {stats.totalPlayers} respondieron correctamente
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Respuestas con estadísticas */}
        <div className="grid grid-cols-2 gap-4">
          {question.options.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`answer-btn ${colors[index]} ${
                index === stats.correctIndex ? 'correct ring-4 ring-neon-green' : 'opacity-50'
              } rounded-xl text-white text-xl font-bold relative overflow-hidden`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl opacity-70">{shapes[index]}</span>
                <span className="flex-1">{option}</span>
                <span className="text-3xl font-black">{stats.answerCounts[index]}</span>
              </div>
              {index === stats.correctIndex && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 text-3xl"
                >
                  ✅
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Leaderboard */}
        <div className="card-neon rounded-2xl p-6">
          <h3 className="font-display text-2xl font-bold text-neon-cyan mb-6 text-center">
            🏆 TOP 5
          </h3>
          <div className="space-y-3">
            {leaderboard.slice(0, 5).map((player, index) => (
              <motion.div
                key={player.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-4 p-4 rounded-xl ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30' :
                  index === 1 ? 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border border-gray-400/30' :
                  index === 2 ? 'bg-gradient-to-r from-orange-700/20 to-orange-800/20 border border-orange-700/30' :
                  'bg-arena-card border border-arena-border'
                }`}
              >
                <span className="text-3xl">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </span>
                <span className="flex-1 font-display font-bold text-xl">{player.name}</span>
                <span className="font-display font-bold text-2xl score-display">{player.score}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Next button */}
      <div className="text-center mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="px-12 py-6 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-2xl font-display font-bold text-2xl text-arena-dark"
        >
          {isLastQuestion ? '🏁 VER RESULTADOS FINALES' : '➡️ SIGUIENTE PREGUNTA'}
        </motion.button>
      </div>
    </div>
  );
}

function FinalScreen({ leaderboard, roomCode }) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Confetti effect
    if (typeof window !== 'undefined' && showConfetti) {
      import('canvas-confetti').then((confetti) => {
        const duration = 5 * 1000;
        const end = Date.now() + duration;

        const frame = () => {
          confetti.default({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#00f5ff', '#ff00ff', '#ffff00', '#39ff14'],
          });
          confetti.default({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#00f5ff', '#ff00ff', '#ffff00', '#39ff14'],
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        };
        frame();
      });
    }
  }, [showConfetti]);

  const winner = leaderboard[0];
  const podium = leaderboard.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="font-display text-6xl font-black mb-4">
          <span className="text-white">¡TENEMOS</span>{' '}
          <span className="text-neon-yellow">GANADOR!</span>
        </h1>

        {/* Podium */}
        <div className="flex items-end justify-center gap-4 my-12">
          {/* 2do lugar */}
          {podium[1] && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="w-32 h-24 bg-gradient-to-t from-gray-500 to-gray-400 rounded-t-xl flex flex-col items-center justify-center">
                <span className="text-4xl">🥈</span>
              </div>
              <div className="bg-arena-card p-4 rounded-b-xl">
                <p className="font-display font-bold text-lg truncate max-w-[120px]">{podium[1].name}</p>
                <p className="text-gray-400">{podium[1].score} pts</p>
              </div>
            </motion.div>
          )}

          {/* 1er lugar */}
          {podium[0] && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-40 h-32 bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-t-xl flex flex-col items-center justify-center">
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-6xl"
                >
                  👑
                </motion.span>
              </div>
              <div className="bg-arena-card p-4 rounded-b-xl border-2 border-yellow-500">
                <p className="font-display font-bold text-xl text-neon-yellow truncate max-w-[150px]">{podium[0].name}</p>
                <p className="text-2xl font-bold score-display">{podium[0].score} pts</p>
              </div>
            </motion.div>
          )}

          {/* 3er lugar */}
          {podium[2] && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <div className="w-32 h-20 bg-gradient-to-t from-orange-800 to-orange-600 rounded-t-xl flex flex-col items-center justify-center">
                <span className="text-4xl">🥉</span>
              </div>
              <div className="bg-arena-card p-4 rounded-b-xl">
                <p className="font-display font-bold text-lg truncate max-w-[120px]">{podium[2].name}</p>
                <p className="text-gray-400">{podium[2].score} pts</p>
              </div>
            </motion.div>
          )}
        </div>

        <p className="text-xl text-gray-400 mb-8">
          ¡Ahora todos pueden hacer el <span className="text-neon-cyan font-bold">Test Vocacional</span> en sus dispositivos!
        </p>

        <div className="card-neon rounded-xl p-6 inline-block">
          <p className="text-sm text-gray-400 mb-2">Escanea o ve a</p>
          <p className="font-display text-2xl text-neon-cyan font-bold">tudominio.com/test</p>
        </div>
      </motion.div>
    </div>
  );
}
