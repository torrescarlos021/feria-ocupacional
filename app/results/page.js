'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const professions = [
  { 
    id: 'engineer', 
    name: 'Ingeniero/a', 
    emoji: '👷',
    frameColor: '#00f5ff',
    icon: '⚙️',
    tagline: 'Construyendo el futuro'
  },
  { 
    id: 'doctor', 
    name: 'Médico/a', 
    emoji: '👨‍⚕️',
    frameColor: '#39ff14',
    icon: '🩺',
    tagline: 'Salvando vidas'
  },
  { 
    id: 'designer', 
    name: 'Diseñador/a', 
    emoji: '🎨',
    frameColor: '#ff00ff',
    icon: '✏️',
    tagline: 'Creando experiencias'
  },
  { 
    id: 'scientist', 
    name: 'Científico/a', 
    emoji: '🔬',
    frameColor: '#ffff00',
    icon: '🧪',
    tagline: 'Descubriendo el mundo'
  },
  { 
    id: 'entrepreneur', 
    name: 'Empresario/a', 
    emoji: '💼',
    frameColor: '#ff6b35',
    icon: '📈',
    tagline: 'Liderando el cambio'
  },
  { 
    id: 'architect', 
    name: 'Arquitecto/a', 
    emoji: '🏛️',
    frameColor: '#bf00ff',
    icon: '📐',
    tagline: 'Diseñando espacios'
  },
  { 
    id: 'programmer', 
    name: 'Programador/a', 
    emoji: '💻',
    frameColor: '#00d4ff',
    icon: '🖥️',
    tagline: 'Código que transforma'
  },
  { 
    id: 'teacher', 
    name: 'Maestro/a', 
    emoji: '📚',
    frameColor: '#00ff88',
    icon: '🎓',
    tagline: 'Inspirando mentes'
  },
];

export default function ResultsPage() {
  const [step, setStep] = useState('upload');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedProfession, setSelectedProfession] = useState(null);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

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

  const generateFramedImage = () => {
    if (!selectedProfession || !uploadedImage) return;
    setStep('generating');
    
    // Pequeño delay para efecto visual
    setTimeout(() => {
      setStep('result');
    }, 1200);
  };

  const downloadImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      const size = 600;
      canvas.width = size;
      canvas.height = size;

      // Fondo oscuro con gradiente
      const gradient = ctx.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, '#0a0a0f');
      gradient.addColorStop(0.5, '#12121a');
      gradient.addColorStop(1, '#0a0a0f');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);

      // Patrón de grid sutil
      ctx.strokeStyle = 'rgba(0, 245, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let i = 0; i < size; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, size);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(size, i);
        ctx.stroke();
      }

      // Marco exterior principal
      ctx.strokeStyle = selectedProfession.frameColor;
      ctx.lineWidth = 6;
      ctx.strokeRect(15, 15, size - 30, size - 30);

      // Marco interior decorativo
      ctx.strokeStyle = selectedProfession.frameColor + '60';
      ctx.lineWidth = 2;
      ctx.strokeRect(30, 30, size - 60, size - 60);

      // Línea decorativa superior
      ctx.strokeStyle = selectedProfession.frameColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(50, 80);
      ctx.lineTo(size - 50, 80);
      ctx.stroke();

      // Emoji de profesión arriba
      ctx.font = '50px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(selectedProfession.emoji, size / 2, 60);

      // Área de la foto (circular)
      const centerX = size / 2;
      const centerY = size / 2 - 20;
      const radius = 160;

      // Glow effect detrás de la foto
      const glowGradient = ctx.createRadialGradient(centerX, centerY, radius - 20, centerX, centerY, radius + 40);
      glowGradient.addColorStop(0, selectedProfession.frameColor + '40');
      glowGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 40, 0, Math.PI * 2);
      ctx.fill();

      // Círculo de borde para la foto
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 6, 0, Math.PI * 2);
      ctx.strokeStyle = selectedProfession.frameColor;
      ctx.lineWidth = 5;
      ctx.stroke();

      // Círculo interior decorativo
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 12, 0, Math.PI * 2);
      ctx.strokeStyle = selectedProfession.frameColor + '40';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Clip circular para la imagen
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.clip();

      // Dibujar imagen del usuario
      const imgSize = radius * 2;
      const scale = Math.max(imgSize / img.width, imgSize / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const offsetX = centerX - scaledWidth / 2;
      const offsetY = centerY - scaledHeight / 2;
      
      ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
      ctx.restore();

      // Caja de texto inferior
      const boxY = size - 145;
      const boxHeight = 110;
      
      // Fondo de la caja con gradiente
      const boxGradient = ctx.createLinearGradient(0, boxY, 0, boxY + boxHeight);
      boxGradient.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
      boxGradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
      ctx.fillStyle = boxGradient;
      ctx.fillRect(40, boxY, size - 80, boxHeight);
      
      // Borde de la caja
      ctx.strokeStyle = selectedProfession.frameColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(40, boxY, size - 80, boxHeight);

      // Línea decorativa en la caja
      ctx.strokeStyle = selectedProfession.frameColor + '60';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(60, boxY + 55);
      ctx.lineTo(size - 60, boxY + 55);
      ctx.stroke();

      // Texto de profesión
      ctx.fillStyle = selectedProfession.frameColor;
      ctx.font = 'bold 26px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Futuro/a ${selectedProfession.name}`, centerX, boxY + 38);

      // Tagline
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px Arial';
      ctx.fillText(selectedProfession.tagline, centerX, boxY + 78);

      // Icono decorativo
      ctx.font = '20px Arial';
      ctx.fillText(selectedProfession.icon, centerX, boxY + 100);

      // Logo CVDP
      ctx.fillStyle = '#666666';
      ctx.font = '11px Arial';
      ctx.fillText('CVDP - Tec de Monterrey Campus SLP', centerX, size - 20);

      // Esquinas decorativas
      ctx.strokeStyle = selectedProfession.frameColor;
      ctx.lineWidth = 4;
      
      // Superior izquierda
      ctx.beginPath();
      ctx.moveTo(15, 50);
      ctx.lineTo(15, 15);
      ctx.lineTo(50, 15);
      ctx.stroke();
      
      // Superior derecha
      ctx.beginPath();
      ctx.moveTo(size - 50, 15);
      ctx.lineTo(size - 15, 15);
      ctx.lineTo(size - 15, 50);
      ctx.stroke();
      
      // Inferior izquierda
      ctx.beginPath();
      ctx.moveTo(15, size - 50);
      ctx.lineTo(15, size - 15);
      ctx.lineTo(50, size - 15);
      ctx.stroke();
      
      // Inferior derecha
      ctx.beginPath();
      ctx.moveTo(size - 50, size - 15);
      ctx.lineTo(size - 15, size - 15);
      ctx.lineTo(size - 15, size - 50);
      ctx.stroke();

      // Descargar
      const link = document.createElement('a');
      link.download = `mi-futuro-${selectedProfession.id}-cvdp.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    img.src = uploadedImage;
  };

  const resetAll = () => {
    setStep('upload');
    setUploadedImage(null);
    setSelectedProfession(null);
  };

  return (
    <div className="min-h-screen p-4">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <span className="text-sm text-gray-400 hover:text-neon-cyan transition-colors">← Volver al inicio</span>
          </Link>
          <h1 className="font-display text-3xl font-black">
            <span className="text-white">MARCO</span>{' '}
            <span className="text-neon-magenta">PROFESIONAL</span>
          </h1>
          <p className="text-gray-400 mt-2">Sube tu foto y obtén un marco de tu futura profesión</p>
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
              <h3 className="font-display text-xl font-bold text-white text-center mb-6">¿Qué marco quieres? 🖼️</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {professions.map((profession) => (
                  <motion.button
                    key={profession.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedProfession(profession)}
                    className={`card-neon rounded-xl p-4 text-center transition-all ${
                      selectedProfession?.id === profession.id 
                        ? 'ring-2' 
                        : 'hover:border-neon-cyan/30'
                    }`}
                    style={{
                      borderColor: selectedProfession?.id === profession.id ? profession.frameColor : undefined,
                      ringColor: selectedProfession?.id === profession.id ? profession.frameColor : undefined,
                      backgroundColor: selectedProfession?.id === profession.id ? profession.frameColor + '15' : undefined
                    }}
                  >
                    <span className="text-3xl block mb-2">{profession.emoji}</span>
                    <span className="text-sm font-medium">{profession.name}</span>
                  </motion.button>
                ))}
              </div>
              <motion.button
                whileHover={selectedProfession ? { scale: 1.02 } : {}}
                whileTap={selectedProfession ? { scale: 0.98 } : {}}
                onClick={generateFramedImage}
                disabled={!selectedProfession}
                className={`w-full py-4 rounded-xl font-display font-bold text-xl transition-all ${
                  selectedProfession ? 'bg-gradient-to-r from-neon-magenta to-neon-cyan text-arena-dark cursor-pointer' : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                {selectedProfession ? '🖼️ CREAR MI MARCO' : 'Selecciona una profesión'}
              </motion.button>
            </motion.div>
          )}

          {step === 'generating' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-12">
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} 
                className="text-8xl mb-8 inline-block"
              >
                🖼️
              </motion.div>
              <h3 className="font-display text-2xl font-bold text-white mb-4">
                Creando tu marco...
              </h3>
              <div className="max-w-xs mx-auto h-2 bg-arena-card rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-neon-cyan to-neon-magenta" 
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          )}

          {step === 'result' && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <div className="text-4xl mb-4">🎉</div>
              <h2 className="font-display text-2xl font-bold text-white mb-2">¡Tu marco está listo!</h2>
              <p className="text-gray-400 mb-6">Futuro/a {selectedProfession?.name}</p>
              
              {/* Preview del marco */}
              <div className="card-neon rounded-2xl p-4 mb-6 overflow-hidden">
                <div 
                  className="relative rounded-xl p-6"
                  style={{ 
                    border: `3px solid ${selectedProfession?.frameColor}`,
                    background: `linear-gradient(135deg, ${selectedProfession?.frameColor}15 0%, #0a0a0f 100%)`
                  }}
                >
                  {/* Emoji arriba */}
                  <div className="text-5xl mb-4">{selectedProfession?.emoji}</div>
                  
                  {/* Foto circular */}
                  <div className="relative mx-auto w-44 h-44 mb-4">
                    <div 
                      className="absolute inset-[-6px] rounded-full"
                      style={{ 
                        border: `4px solid ${selectedProfession?.frameColor}`,
                        boxShadow: `0 0 25px ${selectedProfession?.frameColor}50`
                      }}
                    />
                    <img 
                      src={uploadedImage} 
                      alt="Tu foto" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  
                  {/* Texto */}
                  <div 
                    className="bg-black/70 rounded-lg p-4 border"
                    style={{ borderColor: selectedProfession?.frameColor + '50' }}
                  >
                    <h3 
                      className="font-display text-xl font-bold mb-1"
                      style={{ color: selectedProfession?.frameColor }}
                    >
                      Futuro/a {selectedProfession?.name}
                    </h3>
                    <p className="text-white text-sm mb-2">{selectedProfession?.tagline}</p>
                    <span className="text-xl">{selectedProfession?.icon}</span>
                  </div>
                  
                  {/* Logo */}
                  <p className="text-gray-500 text-xs mt-4">CVDP - Tec de Monterrey SLP</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <motion.button 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }} 
                  onClick={downloadImage} 
                  className="w-full py-4 bg-gradient-to-r from-neon-green to-neon-cyan rounded-xl font-display font-bold text-lg text-arena-dark"
                >
                  📥 DESCARGAR IMAGEN
                </motion.button>
                <button onClick={resetAll} className="w-full py-3 text-gray-400 hover:text-white transition-colors">
                  🔄 Crear otro marco
                </button>
                <Link href="/recursos"><button className="w-full py-3 text-neon-cyan hover:underline">📚 Ver recursos de carreras →</button></Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
