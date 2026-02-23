'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const professions = [
  { 
    id: 'mechatronics', 
    name: 'Ing. Mecatrónico/a', 
    tagline: 'Robótica • Automatización • Innovación',
    frameColor: '#00f5ff',
    bgImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
  },
  { 
    id: 'systems', 
    name: 'Ing. en Sistemas', 
    tagline: 'Código • Software • Tecnología',
    frameColor: '#00ff88',
    bgImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
  },
  { 
    id: 'civil', 
    name: 'Ing. Civil', 
    tagline: 'Construcción • Infraestructura • Diseño',
    frameColor: '#ff9500',
    bgImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
  },
  { 
    id: 'industrial', 
    name: 'Ing. Industrial', 
    tagline: 'Procesos • Optimización • Calidad',
    frameColor: '#ffcc00',
    bgImage: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800&q=80',
  },
  { 
    id: 'doctor', 
    name: 'Médico/a', 
    tagline: 'Salud • Vida • Bienestar',
    frameColor: '#39ff14',
    bgImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80',
  },
  { 
    id: 'nurse', 
    name: 'Enfermero/a', 
    tagline: 'Cuidado • Atención • Servicio',
    frameColor: '#ff69b4',
    bgImage: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&q=80',
  },
  { 
    id: 'psychologist', 
    name: 'Psicólogo/a', 
    tagline: 'Mente • Bienestar • Comprensión',
    frameColor: '#9966ff',
    bgImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
  },
  { 
    id: 'lawyer', 
    name: 'Abogado/a', 
    tagline: 'Justicia • Derecho • Defensa',
    frameColor: '#c9a227',
    bgImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80',
  },
  { 
    id: 'architect', 
    name: 'Arquitecto/a', 
    tagline: 'Espacios • Diseño • Creatividad',
    frameColor: '#bf00ff',
    bgImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
  },
  { 
    id: 'designer', 
    name: 'Diseñador/a Gráfico', 
    tagline: 'Arte • Visual • Comunicación',
    frameColor: '#ff00ff',
    bgImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
  },
  { 
    id: 'accountant', 
    name: 'Contador/a', 
    tagline: 'Finanzas • Números • Estrategia',
    frameColor: '#2196f3',
    bgImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
  },
  { 
    id: 'business', 
    name: 'Administrador/a', 
    tagline: 'Liderazgo • Gestión • Negocios',
    frameColor: '#ff6b35',
    bgImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
  },
  { 
    id: 'marketing', 
    name: 'Mercadólogo/a', 
    tagline: 'Marcas • Estrategia • Impacto',
    frameColor: '#e91e63',
    bgImage: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&q=80',
  },
  { 
    id: 'chef', 
    name: 'Chef / Gastrónomo', 
    tagline: 'Sabor • Creatividad • Pasión',
    frameColor: '#ff5722',
    bgImage: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80',
  },
  { 
    id: 'teacher', 
    name: 'Docente', 
    tagline: 'Educación • Inspiración • Futuro',
    frameColor: '#4caf50',
    bgImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
  },
  { 
    id: 'vet', 
    name: 'Veterinario/a', 
    tagline: 'Animales • Salud • Cuidado',
    frameColor: '#8bc34a',
    bgImage: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800&q=80',
  },
];

export default function ResultsPage() {
  const [step, setStep] = useState('upload');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedProfession, setSelectedProfession] = useState(null);
  const [bgImageLoaded, setBgImageLoaded] = useState(null);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (selectedProfession) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => setBgImageLoaded(img);
      img.src = selectedProfession.bgImage;
    }
  }, [selectedProfession]);

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
    
    setTimeout(() => {
      setStep('result');
    }, 1500);
  };

  const downloadImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const userImg = new Image();
    const bgImg = new Image();
    bgImg.crossOrigin = 'anonymous';
    
    const loadImage = (img, src) => new Promise((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

    try {
      await Promise.all([
        loadImage(userImg, uploadedImage),
        loadImage(bgImg, selectedProfession.bgImage)
      ]);

      const size = 600;
      canvas.width = size;
      canvas.height = size;

      // 1. Imagen de fondo
      const bgScale = Math.max(size / bgImg.width, size / bgImg.height);
      const bgWidth = bgImg.width * bgScale;
      const bgHeight = bgImg.height * bgScale;
      const bgX = (size - bgWidth) / 2;
      const bgY = (size - bgHeight) / 2;
      ctx.drawImage(bgImg, bgX, bgY, bgWidth, bgHeight);

      // 2. Overlay oscuro
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.fillRect(0, 0, size, size);

      // 3. Borde exterior
      ctx.strokeStyle = selectedProfession.frameColor;
      ctx.lineWidth = 8;
      ctx.strokeRect(8, 8, size - 16, size - 16);

      // 4. Línea interior
      ctx.strokeStyle = selectedProfession.frameColor + '60';
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 20, size - 40, size - 40);

      // 5. Barra superior
      const barHeight = 60;
      const barGradient = ctx.createLinearGradient(0, 25, 0, 25 + barHeight);
      barGradient.addColorStop(0, 'rgba(0,0,0,0.9)');
      barGradient.addColorStop(1, 'rgba(0,0,0,0.7)');
      ctx.fillStyle = barGradient;
      ctx.fillRect(25, 25, size - 50, barHeight);
      
      ctx.strokeStyle = selectedProfession.frameColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(25, 25, size - 50, barHeight);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`FUTURO/A ${selectedProfession.name.toUpperCase()}`, size / 2, 55);

      // 6. Foto del usuario
      const centerX = size / 2;
      const centerY = size / 2 + 15;
      const radius = 140;

      // Glow
      const glowGradient = ctx.createRadialGradient(centerX, centerY, radius * 0.8, centerX, centerY, radius * 1.3);
      glowGradient.addColorStop(0, selectedProfession.frameColor + '50');
      glowGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Borde foto
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 6, 0, Math.PI * 2);
      ctx.strokeStyle = selectedProfession.frameColor;
      ctx.lineWidth = 5;
      ctx.stroke();

      // Clip y dibujar foto
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.clip();

      const imgSize = radius * 2;
      const scale = Math.max(imgSize / userImg.width, imgSize / userImg.height);
      const scaledWidth = userImg.width * scale;
      const scaledHeight = userImg.height * scale;
      const offsetX = centerX - scaledWidth / 2;
      const offsetY = centerY - scaledHeight / 2;
      
      ctx.drawImage(userImg, offsetX, offsetY, scaledWidth, scaledHeight);
      ctx.restore();

      // 7. Caja inferior
      const boxY = size - 100;
      const boxHeight = 70;
      
      const boxGradient = ctx.createLinearGradient(0, boxY, 0, boxY + boxHeight);
      boxGradient.addColorStop(0, 'rgba(0,0,0,0.9)');
      boxGradient.addColorStop(1, 'rgba(0,0,0,0.7)');
      ctx.fillStyle = boxGradient;
      ctx.fillRect(25, boxY, size - 50, boxHeight);
      
      ctx.strokeStyle = selectedProfession.frameColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(25, boxY, size - 50, boxHeight);

      ctx.fillStyle = selectedProfession.frameColor;
      ctx.font = 'bold 18px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(selectedProfession.tagline, size / 2, boxY + 28);

      ctx.fillStyle = '#888888';
      ctx.font = '12px Arial, sans-serif';
      ctx.fillText('Feria Ocupacional 2025', size / 2, boxY + 52);

      // 8. Esquinas
      const cornerSize = 25;
      ctx.strokeStyle = selectedProfession.frameColor;
      ctx.lineWidth = 4;

      ctx.beginPath();
      ctx.moveTo(8, 8 + cornerSize);
      ctx.lineTo(8, 8);
      ctx.lineTo(8 + cornerSize, 8);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(size - 8 - cornerSize, 8);
      ctx.lineTo(size - 8, 8);
      ctx.lineTo(size - 8, 8 + cornerSize);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(8, size - 8 - cornerSize);
      ctx.lineTo(8, size - 8);
      ctx.lineTo(8 + cornerSize, size - 8);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(size - 8 - cornerSize, size - 8);
      ctx.lineTo(size - 8, size - 8);
      ctx.lineTo(size - 8, size - 8 - cornerSize);
      ctx.stroke();

      // Descargar
      const link = document.createElement('a');
      link.download = `mi-futuro-${selectedProfession.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Error al generar la imagen. Por favor intenta de nuevo.');
    }
  };

  const resetAll = () => {
    setStep('upload');
    setUploadedImage(null);
    setSelectedProfession(null);
    setBgImageLoaded(null);
  };

  return (
    <div className="min-h-screen p-4">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <span className="text-sm text-gray-400 hover:text-neon-cyan transition-colors">← Volver al inicio</span>
          </Link>
          <h1 className="font-display text-3xl font-black">
            <span className="text-white">MARCO</span>{' '}
            <span className="text-neon-magenta">PROFESIONAL</span>
          </h1>
          <p className="text-gray-400 mt-2">Sube tu foto y obtén un marco de tu futura carrera</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'upload' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="card-neon rounded-2xl p-12 cursor-pointer hover:border-neon-cyan/50 transition-all group"
              >
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-magenta/20 flex items-center justify-center border-2 border-dashed border-gray-600 group-hover:border-neon-cyan transition-colors">
                  <svg className="w-10 h-10 text-gray-400 group-hover:text-neon-cyan transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="font-display text-2xl font-bold text-white mb-2 group-hover:text-neon-cyan transition-colors">
                  Sube tu foto
                </h3>
                <p className="text-gray-400 mb-6">Toca aquí para seleccionar una imagen</p>
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-neon-cyan/10 rounded-xl text-neon-cyan text-sm font-medium">
                  Seleccionar imagen
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>
              <p className="text-gray-500 text-sm mt-4">Tip: Usa una foto donde se vea bien tu cara</p>
            </motion.div>
          )}

          {step === 'select' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <img src={uploadedImage} alt="Tu foto" className="w-24 h-24 rounded-full object-cover border-4 border-neon-cyan" />
                  <button onClick={resetAll} className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm hover:bg-red-600 transition-colors">
                    ✕
                  </button>
                </div>
              </div>
              <h3 className="font-display text-xl font-bold text-white text-center mb-2">¿Cuál será tu carrera?</h3>
              <p className="text-gray-400 text-center mb-6 text-sm">Cada marco tiene una imagen de fondo profesional</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {professions.map((profession) => (
                  <motion.button
                    key={profession.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedProfession(profession)}
                    className={`rounded-xl p-3 text-center transition-all overflow-hidden relative h-24 ${
                      selectedProfession?.id === profession.id 
                        ? 'ring-2' 
                        : 'ring-1 ring-gray-700 hover:ring-gray-500'
                    }`}
                    style={{
                      ringColor: selectedProfession?.id === profession.id ? profession.frameColor : undefined,
                    }}
                  >
                    <div 
                      className="absolute inset-0 opacity-40"
                      style={{
                        backgroundImage: `url(${profession.bgImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                    <div className="absolute inset-0 bg-black/60" />
                    <div className="relative z-10 h-full flex flex-col justify-center">
                      <div 
                        className="w-2 h-2 rounded-full mx-auto mb-2"
                        style={{ backgroundColor: profession.frameColor }}
                      />
                      <span className="text-xs font-medium text-white leading-tight">{profession.name}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
              
              {selectedProfession && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-4 rounded-xl overflow-hidden relative h-28"
                >
                  <div 
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${selectedProfession.bgImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <div className="absolute inset-0 bg-black/70" />
                  <div className="relative z-10 h-full flex flex-col justify-center">
                    <p className="font-bold text-xl text-white">{selectedProfession.name}</p>
                    <p className="text-sm mt-2" style={{ color: selectedProfession.frameColor }}>{selectedProfession.tagline}</p>
                  </div>
                </motion.div>
              )}
              
              <motion.button
                whileHover={selectedProfession ? { scale: 1.02 } : {}}
                whileTap={selectedProfession ? { scale: 0.98 } : {}}
                onClick={generateFramedImage}
                disabled={!selectedProfession}
                className={`w-full py-4 rounded-xl font-display font-bold text-xl transition-all ${
                  selectedProfession ? 'bg-gradient-to-r from-neon-magenta to-neon-cyan text-arena-dark cursor-pointer' : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                {selectedProfession ? 'CREAR MI MARCO' : 'Selecciona una carrera'}
              </motion.button>
            </motion.div>
          )}

          {step === 'generating' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-12">
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }} 
                className="w-20 h-20 mx-auto mb-8 rounded-full border-4 border-t-transparent"
                style={{ borderColor: selectedProfession?.frameColor, borderTopColor: 'transparent' }}
              />
              <h3 className="font-display text-2xl font-bold text-white mb-4">
                Creando tu marco...
              </h3>
              <p className="text-gray-400">{selectedProfession?.name}</p>
            </motion.div>
          )}

          {step === 'result' && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <h2 className="font-display text-2xl font-bold text-white mb-2">¡Tu marco está listo!</h2>
              <p className="text-gray-400 mb-6">Futuro/a {selectedProfession?.name}</p>
              
              {/* Preview */}
              <div className="rounded-2xl p-2 mb-6 overflow-hidden max-w-sm mx-auto border-2" style={{ borderColor: selectedProfession?.frameColor }}>
                <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: '1/1' }}>
                  <div 
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${selectedProfession?.bgImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <div className="absolute inset-0 bg-black/65" />
                  
                  <div className="relative z-10 h-full flex flex-col items-center justify-center p-4">
                    <div 
                      className="bg-black/80 rounded-lg px-4 py-2 mb-4 border"
                      style={{ borderColor: selectedProfession?.frameColor }}
                    >
                      <span className="text-white font-bold text-sm">FUTURO/A {selectedProfession?.name.toUpperCase()}</span>
                    </div>
                    
                    <div 
                      className="w-36 h-36 rounded-full overflow-hidden mb-4"
                      style={{ 
                        border: `4px solid ${selectedProfession?.frameColor}`,
                        boxShadow: `0 0 30px ${selectedProfession?.frameColor}50`
                      }}
                    >
                      <img src={uploadedImage} alt="Tu foto" className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="bg-black/80 rounded-lg px-4 py-2 border" style={{ borderColor: selectedProfession?.frameColor }}>
                      <p className="text-sm font-medium" style={{ color: selectedProfession?.frameColor }}>
                        {selectedProfession?.tagline}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 max-w-sm mx-auto">
                <motion.button 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }} 
                  onClick={downloadImage} 
                  className="w-full py-4 rounded-xl font-display font-bold text-lg text-white"
                  style={{ backgroundColor: selectedProfession?.frameColor }}
                >
                  DESCARGAR IMAGEN
                </motion.button>
                <button onClick={resetAll} className="w-full py-3 text-gray-400 hover:text-white transition-colors">
                  Crear otro marco
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
