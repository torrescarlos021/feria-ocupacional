'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const professions = [
  { id: 'engineer', name: 'Ingeniero/a', emoji: '👷', prompt: 'professional engineer at work with blueprints and technology' },
  { id: 'doctor', name: 'Médico/a', emoji: '👨‍⚕️', prompt: 'professional doctor in white coat with stethoscope in modern hospital' },
  { id: 'designer', name: 'Diseñador/a', emoji: '🎨', prompt: 'creative designer working on digital art in modern studio' },
  { id: 'scientist', name: 'Científico/a', emoji: '🔬', prompt: 'scientist in laboratory with equipment doing research' },
  { id: 'entrepreneur', name: 'Empresario/a', emoji: '💼', prompt: 'successful entrepreneur in modern office with city view' },
  { id: 'architect', name: 'Arquitecto/a', emoji: '🏛️', prompt: 'architect presenting building design with 3D models' },
  { id: 'programmer', name: 'Programador/a', emoji: '💻', prompt: 'software developer coding with multiple monitors setup' },
  { id: 'teacher', name: 'Maestro/a', emoji: '📚', prompt: 'inspiring teacher in modern classroom with students' },
];

export default function ResultsPage() {
  const [step, setStep] = useState('upload'); // upload, select, generating, result
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedProfession, setSelectedProfession] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef(null);

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
    setIsGenerating(true);

    // Simulación de generación (en producción conectarías con Replicate API)
    // Por ahora mostramos un placeholder después de unos segundos
    setTimeout(() => {
      // En producción: llamar a API de Replicate para face swap
      setGeneratedImage('/placeholder-result.jpg'); // Placeholder
      setStep('result');
      setIsGenerating(false);
    }, 4000);
  };

  const resetAll = () => {
    setStep('upload');
    setUploadedImage(null);
    setSelectedProfession(null);
    setGeneratedImage(null);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <span className="text-sm text-gray-400 hover:text-neon-cyan transition-colors">
              ← Volver al inicio
            </span>
          </Link>
          <h1 className="font-display text-3xl font-black">
            <span className="text-white">VISUALIZA TU</span>{' '}
            <span className="text-neon-magenta">FUTURO</span>
          </h1>
          <p className="text-gray-400 mt-2">
            Sube tu foto y mira cómo te verías como profesional
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'upload' && (
            <UploadStep 
              onUpload={handleImageUpload}
              fileInputRef={fileInputRef}
            />
          )}

          {step === 'select' && (
            <SelectStep
              uploadedImage={uploadedImage}
              selectedProfession={selectedProfession}
              onSelect={setSelectedProfession}
              onGenerate={generateImage}
              onBack={resetAll}
            />
          )}

          {step === 'generating' && (
            <GeneratingStep profession={selectedProfession} />
          )}

          {step === 'result' && (
            <ResultStep
              uploadedImage={uploadedImage}
              profession={selectedProfession}
              onReset={resetAll}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function UploadStep({ onUpload, fileInputRef }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center"
    >
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="card-neon rounded-2xl p-12 cursor-pointer hover:border-neon-cyan/50 transition-all group"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-7xl mb-6"
        >
          📷
        </motion.div>
        
        <h3 className="font-display text-2xl font-bold text-white mb-2 group-hover:text-neon-cyan transition-colors">
          Sube tu foto
        </h3>
        <p className="text-gray-400 mb-6">
          Toca aquí para seleccionar una imagen de tu galería
        </p>

        <div className="inline-flex items-center gap-2 px-6 py-3 bg-neon-cyan/10 rounded-xl text-neon-cyan text-sm">
          <span>📱</span>
          <span>Seleccionar imagen</span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onUpload}
          className="hidden"
        />
      </div>

      <div className="mt-6 text-sm text-gray-500">
        <p>💡 Tip: Usa una foto donde se vea bien tu cara, con buena iluminación</p>
      </div>
    </motion.div>
  );
}

function SelectStep({ uploadedImage, selectedProfession, onSelect, onGenerate, onBack }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Preview de la imagen subida */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <img 
            src={uploadedImage} 
            alt="Tu foto" 
            className="w-32 h-32 rounded-full object-cover border-4 border-neon-cyan"
          />
          <button
            onClick={onBack}
            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm hover:bg-red-600 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      <h3 className="font-display text-xl font-bold text-white text-center mb-6">
        ¿Cómo te quieres ver?
      </h3>

      {/* Grid de profesiones */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {professions.map((profession) => (
          <motion.button
            key={profession.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(profession)}
            className={`card-neon rounded-xl p-4 text-center transition-all ${
              selectedProfession?.id === profession.id 
                ? 'border-neon-cyan bg-neon-cyan/10' 
                : 'hover:border-neon-cyan/30'
            }`}
          >
            <span className="text-3xl block mb-2">{profession.emoji}</span>
            <span className="text-sm font-medium">{profession.name}</span>
          </motion.button>
        ))}
      </div>

      {/* Botón de generar */}
      <motion.button
        whileHover={selectedProfession ? { scale: 1.02 } : {}}
        whileTap={selectedProfession ? { scale: 0.98 } : {}}
        onClick={onGenerate}
        disabled={!selectedProfession}
        className={`w-full py-4 rounded-xl font-display font-bold text-xl transition-all ${
          selectedProfession
            ? 'bg-gradient-to-r from-neon-magenta to-neon-cyan text-arena-dark cursor-pointer'
            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
        }`}
      >
        {selectedProfession ? '✨ GENERAR MI IMAGEN' : 'Selecciona una profesión'}
      </motion.button>
    </motion.div>
  );
}

function GeneratingStep({ profession }) {
  const loadingTexts = [
    "Preparando tu transformación...",
    "Aplicando magia de IA...",
    "Casi listo...",
    "Generando tu futuro..."
  ];
  
  const [textIndex, setTextIndex] = useState(0);

  useState(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="text-center py-12"
    >
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 1, repeat: Infinity }
        }}
        className="text-8xl mb-8 inline-block"
      >
        {profession.emoji}
      </motion.div>

      <h3 className="font-display text-2xl font-bold text-white mb-4">
        Creando tu imagen de {profession.name}
      </h3>

      <AnimatePresence mode="wait">
        <motion.p
          key={textIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-gray-400 mb-8"
        >
          {loadingTexts[textIndex]}
        </motion.p>
      </AnimatePresence>

      {/* Loading bar */}
      <div className="max-w-xs mx-auto h-2 bg-arena-card rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-neon-cyan to-neon-magenta"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 4, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}

function ResultStep({ uploadedImage, profession, onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="text-6xl mb-4"
      >
        🎉
      </motion.div>

      <h2 className="font-display text-2xl font-bold text-white mb-2">
        ¡Así te verías como {profession.name}!
      </h2>
      <p className="text-gray-400 mb-6">
        Tu futuro se ve increíble
      </p>

      {/* Imagen resultado (placeholder por ahora) */}
      <div className="card-neon rounded-2xl p-4 mb-6">
        <div className="relative aspect-square rounded-xl overflow-hidden bg-arena-dark">
          {/* En producción, aquí iría la imagen generada */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-8xl mb-4">{profession.emoji}</div>
            <p className="text-gray-400 text-sm px-4 text-center">
              Vista previa simulada - En producción se mostraría tu imagen generada con IA
            </p>
            <img 
              src={uploadedImage}
              alt="Tu foto"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 bg-gradient-to-r from-neon-green to-neon-cyan rounded-xl font-display font-bold text-lg text-arena-dark"
        >
          📥 DESCARGAR IMAGEN
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 border-2 border-neon-magenta/50 rounded-xl font-display font-bold text-lg text-neon-magenta hover:bg-neon-magenta/10 transition-colors"
        >
          📱 COMPARTIR
        </motion.button>

        <button
          onClick={onReset}
          className="w-full py-3 text-gray-400 hover:text-white transition-colors"
        >
          🔄 Probar con otra profesión
        </button>

        <Link href="/recursos">
          <button className="w-full py-3 text-neon-cyan hover:underline">
            📚 Ver recursos de carreras →
          </button>
        </Link>
      </div>
    </motion.div>
  );
}
