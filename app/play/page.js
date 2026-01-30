'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export default function PlayPage() {
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState('join'); // join, waiting, starting, question, answered, result, finished
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [finalRank, setFinalRank] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [maxTime, setMaxTime] = useState(20);

  // Conectar socket
  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  // Event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('game-starting', ({ countdown }) => {
      setGameState('starting');
      setCountdown(countdown);
    });

    socket.on('new-question', (data) => {
      setGameState('question');
      setCurrentQuestion(data);
      setSelectedAnswer(null);
      setResult(null);
      setTimeLeft(data.time);
      setMaxTime(data.time);
    });

    socket.on('answer-result', ({ received, answerIndex }) => {
      if (received) {
        setGameState('answered');
      }
    });

    socket.on('answer-revealed', (data) => {
      setGameState('result');
      setResult(data);
      setScore(data.totalScore);
      setStreak(data.streak);
    });

    socket.on('game-finished', ({ leaderboard }) => {
      setGameState('finished');
      const myRank = leaderboard.find(p => p.name === playerName);
      setFinalRank(myRank);
    });

    socket.on('room-closed', () => {
      setGameState('join');
      setError('La sala fue cerrada');
    });

    return () => {
      socket.off('game-starting');
      socket.off('new-question');
      socket.off('answer-result');
      socket.off('answer-revealed');
      socket.off('game-finished');
      socket.off('room-closed');
    };
  }, [socket, playerName]);

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'question' || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 0.1));
    }, 100);

    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // Starting countdown
  useEffect(() => {
    if (gameState !== 'starting' || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, countdown]);

  const joinRoom = useCallback(() => {
    if (!socket || !roomCode.trim() || !playerName.trim()) {
      setError('Ingresa el código y tu nombre');
      return;
    }

    socket.emit('join-room', { 
      roomCode: roomCode.toUpperCase(), 
      playerName: playerName.trim() 
    }, (response) => {
      if (response.success) {
        setGameState('waiting');
        setError('');
      } else {
        setError(response.error);
      }
    });
  }, [socket, roomCode, playerName]);

  const submitAnswer = useCallback((answerIndex) => {
    if (!socket || selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    socket.emit('submit-answer', { 
      roomCode: roomCode.toUpperCase(), 
      answerIndex 
    });
  }, [socket, roomCode, selectedAnswer]);

  // Renders
  if (gameState === 'join') {
    return <JoinScreen 
      roomCode={roomCode}
      setRoomCode={setRoomCode}
      playerName={playerName}
      setPlayerName={setPlayerName}
      onJoin={joinRoom}
      error={error}
    />;
  }

  if (gameState === 'waiting') {
    return <WaitingScreen playerName={playerName} />;
  }

  if (gameState === 'starting') {
    return <StartingScreen countdown={countdown} />;
  }

  if (gameState === 'question') {
    return (
      <QuestionScreen
        question={currentQuestion}
        timeLeft={timeLeft}
        maxTime={maxTime}
        onAnswer={submitAnswer}
        selectedAnswer={selectedAnswer}
      />
    );
  }

  if (gameState === 'answered') {
    return <AnsweredScreen />;
  }

  if (gameState === 'result') {
    return <ResultScreen result={result} score={score} streak={streak} />;
  }

  if (gameState === 'finished') {
    return <FinishedScreen rank={finalRank} playerName={playerName} />;
  }

  return null;
}

// ============ SUB-COMPONENTS ============

function JoinScreen({ roomCode, setRoomCode, playerName, setPlayerName, onJoin, error }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎮</div>
          <h1 className="font-display text-4xl font-black">
            <span className="text-white">UNIRSE AL</span>{' '}
            <span className="text-neon-cyan">JUEGO</span>
          </h1>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Código de sala</label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="ABC123"
              maxLength={6}
              className="input-neon w-full rounded-xl text-center text-2xl font-display tracking-widest uppercase"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Tu nombre</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Escribe tu nombre"
              maxLength={20}
              className="input-neon w-full rounded-xl text-center"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-center text-sm"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onJoin}
            className="w-full py-4 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-xl font-display font-bold text-xl text-arena-dark"
          >
            ENTRAR 🚀
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

function WaitingScreen({ playerName }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-8xl mb-6"
        >
          ✨
        </motion.div>
        
        <h2 className="font-display text-3xl font-bold text-white mb-4">
          ¡Estás dentro, <span className="text-neon-cyan">{playerName}</span>!
        </h2>
        
        <p className="text-xl text-gray-400 mb-8">
          Espera a que el presentador inicie el juego...
        </p>

        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
              className="w-3 h-3 bg-neon-cyan rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function StartingScreen({ countdown }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={countdown}
          initial={{ scale: 2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          className="text-center"
        >
          {countdown > 0 ? (
            <>
              <span className="font-display text-[120px] font-black text-glow-cyan text-neon-cyan">
                {countdown}
              </span>
              <p className="text-xl text-gray-400">¡Prepárate!</p>
            </>
          ) : (
            <span className="font-display text-6xl font-black text-glow-green text-neon-green">
              ¡VAMOS!
            </span>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function QuestionScreen({ question, timeLeft, maxTime, onAnswer, selectedAnswer }) {
  const timePercent = (timeLeft / maxTime) * 100;
  const colors = ['red', 'blue', 'yellow', 'green'];
  const shapes = ['▲', '◆', '●', '■'];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Timer bar */}
      <div className="h-2 bg-arena-card">
        <motion.div
          className="h-full"
          style={{
            width: `${timePercent}%`,
            background: timePercent > 50 
              ? '#39ff14' 
              : timePercent > 25 
                ? '#ffff00'
                : '#ff1493',
          }}
        />
      </div>

      {/* Question number and timer */}
      <div className="flex items-center justify-between p-4">
        <span className="text-gray-400">
          Pregunta {question.questionNumber}/{question.totalQuestions}
        </span>
        <span className="font-display text-3xl font-bold text-neon-cyan">
          {Math.ceil(timeLeft)}
        </span>
      </div>

      {/* Answer buttons - Full screen tap */}
      <div className="flex-1 grid grid-cols-2 gap-2 p-2">
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAnswer(index)}
            disabled={selectedAnswer !== null}
            className={`answer-btn ${colors[index]} rounded-xl text-white font-bold relative overflow-hidden
              ${selectedAnswer === index ? 'ring-4 ring-white selected' : ''}
              ${selectedAnswer !== null && selectedAnswer !== index ? 'opacity-40' : ''}
            `}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl opacity-20">{shapes[index]}</span>
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full p-4">
              <span className="text-3xl mb-2">{shapes[index]}</span>
              <span className="text-lg text-center leading-tight">{option}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function AnsweredScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-8xl mb-6"
        >
          ⏳
        </motion.div>
        <h2 className="font-display text-2xl font-bold text-white">
          ¡Respuesta enviada!
        </h2>
        <p className="text-gray-400 mt-2">Esperando resultados...</p>
      </motion.div>
    </div>
  );
}

function ResultScreen({ result, score, streak }) {
  const isCorrect = result.isCorrect;

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 text-center transition-colors
      ${isCorrect ? 'bg-neon-green/10' : 'bg-red-500/10'}
    `}>
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <div className="text-9xl mb-4">
          {isCorrect ? '✅' : '❌'}
        </div>
        
        <h2 className={`font-display text-4xl font-black mb-4
          ${isCorrect ? 'text-neon-green' : 'text-red-500'}
        `}>
          {isCorrect ? '¡CORRECTO!' : 'INCORRECTO'}
        </h2>

        {isCorrect && result.points > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-4"
          >
            <span className="text-5xl font-display font-black text-neon-yellow">
              +{result.points}
            </span>
            <span className="text-xl text-gray-400 ml-2">puntos</span>
          </motion.div>
        )}

        {streak > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-4"
          >
            <span className="text-2xl">🔥</span>
            <span className="text-xl text-neon-orange font-bold ml-2">
              ¡Racha de {streak}!
            </span>
          </motion.div>
        )}

        <div className="card-neon rounded-xl p-4 mt-6">
          <p className="text-gray-400 text-sm">Tu puntuación total</p>
          <p className="font-display text-4xl font-black score-display">{score}</p>
        </div>
      </motion.div>
    </div>
  );
}

function FinishedScreen({ rank, playerName }) {
  const emoji = rank?.rank === 1 ? '👑' : 
                rank?.rank === 2 ? '🥈' : 
                rank?.rank === 3 ? '🥉' : '🎉';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: 3 }}
          className="text-9xl mb-6"
        >
          {emoji}
        </motion.div>

        <h2 className="font-display text-3xl font-bold text-white mb-2">
          ¡Juego terminado!
        </h2>

        {rank && (
          <>
            <p className="text-xl text-gray-400 mb-6">
              Quedaste en el puesto <span className="text-neon-cyan font-bold">#{rank.rank}</span>
            </p>

            <div className="card-neon rounded-2xl p-6 mb-8">
              <p className="text-gray-400 text-sm mb-2">Puntuación final</p>
              <p className="font-display text-5xl font-black score-display">{rank.score}</p>
            </div>
          </>
        )}

        <motion.a
          href="/test"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block px-8 py-4 bg-gradient-to-r from-neon-magenta to-neon-cyan rounded-xl font-display font-bold text-xl text-arena-dark"
        >
          🎯 HACER TEST VOCACIONAL
        </motion.a>

        <p className="text-gray-500 text-sm mt-4">
          Descubre qué carrera va contigo
        </p>
      </motion.div>
    </div>
  );
}
