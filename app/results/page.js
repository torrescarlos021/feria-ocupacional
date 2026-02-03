'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const professions = [
  { id: 'engineer', name: 'Ingeniero/a', emoji: '👷' },
  { id: 'doctor', name: 'Médico/a', emoji: '👨‍⚕️' },
  { id: 'designer', name: 'Diseñador/a', emoji: '🎨' },
  { id: 'scientist', name: 'Científico/a', emoji: '🔬' },
  { id: 'entrepreneur', name: 'Empresario/a', emoji: '💼' },
  { id: 'architect', name: 'Arquitecto/a', emoji: '🏛️' },
  { id: 'programmer', name: 'Programador/a', emoji: '💻' },
  { id: 'teacher', name: 'Maestro/a', emoji: '📚' },
];

export default function ResultsPage() {
  const [step, setStep] = useState('upload');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedProfession, setSelectedProfession] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState('');
  const [loadingText, setLoadingText] = useState('');
  const fileInputRef = useRef(null);

  const loadingMessages = [
    "Analizando tu foto... 📸",
    "Preparando la magia de IA... ✨",
    "Generando tu futuro profesional... 🎯",
    "Aplicando transformación... 🪄",
    "Casi listo... 🚀"
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        setStep('select');
      };
      reader.readAsDataURL(file);
    }
  };

  const generateImage = async () => {
    if (!selectedProfession || !uploadedImage) return;
    
    setStep('generating');
    setError('');
    
    let messageIndex = 0;
    setLoadingText(loadingMessages[0]);
    const loadingInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      setLoadingText(loadingMessages[messageIndex]);
    }, 3000);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          image: uploadedImage,
          profession: selectedProfession.id 
        }),
      });

      const data = await response.json();
      clearInterval(loadingInterval);

      if (!response.ok) throw new Error(data.error || 'Error al generar imagen');

      setGeneratedImage(data.image);
      setStep('result');

    } catch (err) {
      clearInterval(loadingInterval);
      setError(err.message);
      setStep('error');
    }
  };

  const resetAll = () => {
    setStep('upload');
    setUploadedImage(null);
    setSelectedProfession(null);
    setGeneratedImage(null);
    setError('');
  };

  const downloadImage = async () => {
    if (!generatedImage) return;
    
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mi-futuro-como-${selectedProfession.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      window.open(generatedImage, '_blank');
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <span className="text-sm text-gray-400 hover:text-neon-cyan transition-colors">← Volver al inicio</span>
          </Link>
          <h1 className="font-display text-3xl font-black">
            <span className="text-white">VISUALIZA TU</span>{' '}
            <span className="text-neon-magenta">FUTURO</span>
          </h1>
          <p className="text-gray-400 mt-2">Sube tu foto y mira cómo te verías como profesional</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'upload' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="card-neon rounded-2xl p-12 cursor-pointer hover:border-neon-cyan/50 transition-all group"
              >
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-7xl mb-6">
                  📷
                </motion.div>
                <h3 className="font-display text-2xl font-bold text-white mb-2 group-hover:text-neon-cyan transition-colors">
                  Sube tu selfie
                </h3>
                <p className="text-gray-400 mb-6">Toca aquí para seleccionar una foto de tu galería</p>
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-neon-cyan/10 rounded-xl text-neon-cyan text-sm">
                  <span>📱</span>
                  <span>Seleccionar imagen</span>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>
              <p className="text-gray-500 text-sm mt-4">💡 Tip: Usa una foto donde se vea bien tu cara</p>
            </motion.div>
          )}

          {step === 'select' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <img src={uploadedImage} alt="Tu foto" className="w-24 h-24 rounded-full object-cover border-4 border-neon-cyan" />
                  <button onClick={resetAll} className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm hover:bg-red-600">
                    ✕
                  </button>
                </div>
              </div>
              <h3 className="font-display text-xl font-bold text-white text-center mb-6">¿Cómo te quieres ver? 🎯</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {professions.map((profession) => (
                  <motion.button
                    key={profession.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedProfession(profession)}
                    className={`card-neon rounded-xl p-4 text-center transition-all ${
                      selectedProfession?.id === profession.id ? 'border-neon-cyan bg-neon-cyan/10 ring-2 ring-neon-cyan' : 'hover:border-neon-cyan/30'
                    }`}
                  >
                    <span className="text-3xl block mb-2">{profession.emoji}</span>
                    <span className="text-sm font-medium">{profession.name}</span>
                  </motion.button>
                ))}
              </div>
              <motion.button
                whileHover={selectedProfession ? { scale: 1.02 } : {}}
                whileTap={selectedProfession ? { scale: 0.98 } : {}}
                onClick={generateImage}
                disabled={!selectedProfession}
                className={`w-full py-4 rounded-xl font-display font-bold text-xl transition-all ${
                  selectedProfession ? 'bg-gradient-to-r from-neon-magenta to-neon-cyan text-arena-dark cursor-pointer' : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                {selectedProfession ? '✨ GENERAR MI IMAGEN' : 'Selecciona una profesión'}
              </motion.button>
            </motion.div>
          )}

          {step === 'generating' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-12">
              <motion.div animate={{ rotate: 360, scale: [1, 1.1, 1] }} transition={{ rotate: { duration: 2, repeat: Infinity, ease: "linear" }, scale: { duration: 1, repeat: Infinity } }} className="text-8xl mb-8 inline-block">
                {selectedProfession?.emoji}
              </motion.div>
              <h3 className="font-display text-2xl font-bold text-white mb-4">Creando tu imagen de {selectedProfession?.name}</h3>
              <p className="text-neon-cyan mb-8">{loadingText}</p>
              <div className="max-w-xs mx-auto h-2 bg-arena-card rounded-full overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-neon-cyan to-neon-magenta" animate={{ x: ["-100%", "100%"] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} style={{ width: "50%" }} />
              </div>
              <p className="text-gray-500 text-sm mt-6">Esto puede tomar 20-40 segundos...</p>
            </motion.div>
          )}

          {step === 'result' && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="font-display text-2xl font-bold text-white mb-2">¡Tu futuro como {selectedProfession?.name}!</h2>
              <p className="text-gray-400 mb-6">Generado con Inteligencia Artificial</p>
              <div className="card-neon rounded-2xl p-2 mb-6 overflow-hidden">
                <img src={generatedImage} alt={`Tu futuro como ${selectedProfession?.name}`} className="w-full rounded-xl" />
              </div>
              <div className="space-y-3">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={downloadImage} className="w-full py-4 bg-gradient-to-r from-neon-green to-neon-cyan rounded-xl font-display font-bold text-lg text-arena-dark">
                  📥 DESCARGAR IMAGEN
                </motion.button>
                <button onClick={resetAll} className="w-full py-3 text-gray-400 hover:text-white transition-colors">
                  🔄 Generar otra imagen
                </button>
                <Link href="/recursos"><button className="w-full py-3 text-neon-cyan hover:underline">📚 Ver recursos de carreras →</button></Link>
              </div>
            </motion.div>
          )}

          {step === 'error' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <div className="text-6xl mb-4">😅</div>
              <h3 className="font-display text-xl font-bold text-white mb-2">Algo salió mal</h3>
              <p className="text-gray-400 mb-6">{error}</p>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={resetAll} className="px-8 py-3 bg-neon-cyan/20 border border-neon-cyan rounded-xl text-neon-cyan font-bold">
                🔄 Intentar de nuevo
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
