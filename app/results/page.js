'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const professions = [
  { 
    id: 'mechatronics', 
    name: 'Ing. Mecatrónico/a', 
    emoji: '🤖',
    frameColor: '#00f5ff',
    secondaryColor: '#0066ff',
    icon: '⚙️',
    tagline: 'Robótica • Automatización • Innovación',
    pattern: 'circuits', // circuitos y engranajes
  },
  { 
    id: 'systems', 
    name: 'Ing. en Sistemas', 
    emoji: '💻',
    frameColor: '#00ff88',
    secondaryColor: '#00aa55',
    icon: '🖥️',
    tagline: 'Código • Software • Tecnología',
    pattern: 'code', // código binario
  },
  { 
    id: 'civil', 
    name: 'Ing. Civil', 
    emoji: '🏗️',
    frameColor: '#ff9500',
    secondaryColor: '#cc7700',
    icon: '🌉',
    tagline: 'Construcción • Infraestructura • Diseño',
    pattern: 'blueprint', // planos
  },
  { 
    id: 'industrial', 
    name: 'Ing. Industrial', 
    emoji: '🏭',
    frameColor: '#ffcc00',
    secondaryColor: '#aa8800',
    icon: '📊',
    tagline: 'Procesos • Optimización • Calidad',
    pattern: 'gears', // engranajes
  },
  { 
    id: 'doctor', 
    name: 'Médico/a', 
    emoji: '👨‍⚕️',
    frameColor: '#39ff14',
    secondaryColor: '#00cc00',
    icon: '🩺',
    tagline: 'Salud • Vida • Bienestar',
    pattern: 'medical', // cruz médica y pulso
  },
  { 
    id: 'nurse', 
    name: 'Enfermero/a', 
    emoji: '👩‍⚕️',
    frameColor: '#ff69b4',
    secondaryColor: '#cc5599',
    icon: '💉',
    tagline: 'Cuidado • Atención • Servicio',
    pattern: 'medical',
  },
  { 
    id: 'psychologist', 
    name: 'Psicólogo/a', 
    emoji: '🧠',
    frameColor: '#9966ff',
    secondaryColor: '#7744cc',
    icon: '💭',
    tagline: 'Mente • Bienestar • Comprensión',
    pattern: 'mind', // ondas cerebrales
  },
  { 
    id: 'lawyer', 
    name: 'Abogado/a', 
    emoji: '⚖️',
    frameColor: '#c9a227',
    secondaryColor: '#997711',
    icon: '📜',
    tagline: 'Justicia • Derecho • Defensa',
    pattern: 'legal', // balanza y columnas
  },
  { 
    id: 'architect', 
    name: 'Arquitecto/a', 
    emoji: '🏛️',
    frameColor: '#bf00ff',
    secondaryColor: '#9900cc',
    icon: '📐',
    tagline: 'Espacios • Diseño • Creatividad',
    pattern: 'architecture', // líneas de planos
  },
  { 
    id: 'designer', 
    name: 'Diseñador/a Gráfico', 
    emoji: '🎨',
    frameColor: '#ff00ff',
    secondaryColor: '#cc00cc',
    icon: '✏️',
    tagline: 'Arte • Visual • Comunicación',
    pattern: 'creative', // formas geométricas
  },
  { 
    id: 'accountant', 
    name: 'Contador/a', 
    emoji: '📊',
    frameColor: '#2196f3',
    secondaryColor: '#1976d2',
    icon: '💰',
    tagline: 'Finanzas • Números • Estrategia',
    pattern: 'finance', // gráficas y números
  },
  { 
    id: 'business', 
    name: 'Administrador/a', 
    emoji: '💼',
    frameColor: '#ff6b35',
    secondaryColor: '#cc5522',
    icon: '📈',
    tagline: 'Liderazgo • Gestión • Negocios',
    pattern: 'business', // gráficas ascendentes
  },
  { 
    id: 'marketing', 
    name: 'Mercadólogo/a', 
    emoji: '📢',
    frameColor: '#e91e63',
    secondaryColor: '#c2185b',
    icon: '🎯',
    tagline: 'Marcas • Estrategia • Impacto',
    pattern: 'marketing', // targets y flechas
  },
  { 
    id: 'chef', 
    name: 'Chef / Gastrónomo', 
    emoji: '👨‍🍳',
    frameColor: '#ff5722',
    secondaryColor: '#e64a19',
    icon: '🍽️',
    tagline: 'Sabor • Creatividad • Pasión',
    pattern: 'culinary', // utensilios
  },
  { 
    id: 'teacher', 
    name: 'Docente', 
    emoji: '📚',
    frameColor: '#4caf50',
    secondaryColor: '#388e3c',
    icon: '🎓',
    tagline: 'Educación • Inspiración • Futuro',
    pattern: 'education', // libros y estrellas
  },
  { 
    id: 'vet', 
    name: 'Veterinario/a', 
    emoji: '🐾',
    frameColor: '#8bc34a',
    secondaryColor: '#689f38',
    icon: '🐕',
    tagline: 'Animales • Salud • Cuidado',
    pattern: 'vet', // huellas y corazones
  },
];

// Función para dibujar patrones específicos de cada carrera
function drawPattern(ctx, pattern, color, secondaryColor, size) {
  ctx.globalAlpha = 0.08;
  
  switch(pattern) {
    case 'circuits':
      // Circuitos y conexiones
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 30, y);
        ctx.lineTo(x + 30, y + 20);
        ctx.stroke();
        // Nodos
        ctx.beginPath();
        ctx.arc(x + 30, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
      // Engranajes pequeños
      for (let i = 0; i < 4; i++) {
        drawGear(ctx, 50 + i * 150, 50 + (i % 2) * 450, 20, color);
      }
      break;
      
    case 'code':
      // Código binario
      ctx.fillStyle = color;
      ctx.font = '14px monospace';
      for (let i = 0; i < 15; i++) {
        const x = (i % 5) * 120 + 20;
        const y = Math.floor(i / 5) * 200 + 50;
        const binary = Math.random() > 0.5 ? '01101' : '10010';
        ctx.fillText(binary, x, y);
      }
      // Corchetes de código
      ctx.font = '24px monospace';
      ctx.fillText('{ }', 30, 100);
      ctx.fillText('< />', size - 80, size - 50);
      break;
      
    case 'blueprint':
      // Líneas de plano arquitectónico
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      for (let i = 0; i < size; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, size);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(size, i);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      // Marcas de cota
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(50, 50);
      ctx.lineTo(200, 50);
      ctx.moveTo(50, 45);
      ctx.lineTo(50, 55);
      ctx.moveTo(200, 45);
      ctx.lineTo(200, 55);
      ctx.stroke();
      break;
      
    case 'gears':
      // Engranajes industriales
      drawGear(ctx, 80, 80, 35, color);
      drawGear(ctx, size - 80, 100, 25, color);
      drawGear(ctx, 100, size - 100, 30, color);
      drawGear(ctx, size - 100, size - 80, 40, color);
      break;
      
    case 'medical':
      // Cruces médicas y línea de pulso
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      // Cruz
      drawCross(ctx, 60, 60, 25, color);
      drawCross(ctx, size - 60, size - 80, 20, color);
      // Línea de pulso ECG
      ctx.beginPath();
      ctx.moveTo(20, size / 2);
      ctx.lineTo(80, size / 2);
      ctx.lineTo(100, size / 2 - 30);
      ctx.lineTo(120, size / 2 + 20);
      ctx.lineTo(140, size / 2);
      ctx.lineTo(200, size / 2);
      ctx.stroke();
      break;
      
    case 'mind':
      // Ondas cerebrales
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      for (let wave = 0; wave < 3; wave++) {
        ctx.beginPath();
        for (let x = 0; x < size; x += 5) {
          const y = 80 + wave * 180 + Math.sin(x * 0.05) * 15;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      // Burbujas de pensamiento
      ctx.beginPath();
      ctx.arc(size - 80, 80, 20, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(size - 50, 60, 10, 0, Math.PI * 2);
      ctx.stroke();
      break;
      
    case 'legal':
      // Balanza de justicia estilizada
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      // Poste central
      ctx.beginPath();
      ctx.moveTo(size / 2, 40);
      ctx.lineTo(size / 2, 120);
      ctx.stroke();
      // Brazos
      ctx.beginPath();
      ctx.moveTo(size / 2 - 60, 50);
      ctx.lineTo(size / 2 + 60, 50);
      ctx.stroke();
      // Platos
      ctx.beginPath();
      ctx.arc(size / 2 - 60, 70, 15, 0, Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(size / 2 + 60, 70, 15, 0, Math.PI);
      ctx.stroke();
      // Columnas en esquinas
      drawColumn(ctx, 40, size - 120, color);
      drawColumn(ctx, size - 55, size - 120, color);
      break;
      
    case 'architecture':
      // Líneas de perspectiva
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      const vanishX = size / 2;
      const vanishY = size / 3;
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.moveTo(vanishX, vanishY);
        ctx.lineTo(i * (size / 7), size);
        ctx.stroke();
      }
      // Cuadrícula
      ctx.strokeStyle = secondaryColor;
      ctx.setLineDash([3, 6]);
      for (let i = 50; i < 200; i += 30) {
        ctx.strokeRect(size - 180, size - i - 50, 120, 40);
      }
      ctx.setLineDash([]);
      break;
      
    case 'creative':
      // Formas geométricas coloridas
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      // Triángulo
      ctx.beginPath();
      ctx.moveTo(60, 100);
      ctx.lineTo(100, 40);
      ctx.lineTo(140, 100);
      ctx.closePath();
      ctx.stroke();
      // Círculo
      ctx.beginPath();
      ctx.arc(size - 80, 80, 30, 0, Math.PI * 2);
      ctx.stroke();
      // Cuadrado
      ctx.strokeRect(40, size - 120, 50, 50);
      // Líneas dinámicas
      ctx.beginPath();
      ctx.moveTo(size - 150, size - 40);
      ctx.bezierCurveTo(size - 100, size - 100, size - 50, size - 80, size - 30, size - 120);
      ctx.stroke();
      break;
      
    case 'finance':
      // Gráfica de barras
      ctx.fillStyle = color;
      const barWidth = 20;
      const heights = [40, 70, 55, 90, 65];
      heights.forEach((h, i) => {
        ctx.fillRect(40 + i * 35, size - 80 - h, barWidth, h);
      });
      // Línea de tendencia
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(40, size - 100);
      ctx.lineTo(size - 40, size - 160);
      ctx.stroke();
      // Símbolo $
      ctx.font = 'bold 40px Arial';
      ctx.fillText('$', size - 80, 80);
      break;
      
    case 'business':
      // Gráfica ascendente
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(50, size - 80);
      ctx.lineTo(100, size - 120);
      ctx.lineTo(150, size - 100);
      ctx.lineTo(200, size - 160);
      ctx.stroke();
      // Flecha hacia arriba
      ctx.beginPath();
      ctx.moveTo(200, size - 160);
      ctx.lineTo(190, size - 145);
      ctx.moveTo(200, size - 160);
      ctx.lineTo(210, size - 150);
      ctx.stroke();
      // Maletín estilizado
      ctx.strokeRect(size - 120, 50, 60, 45);
      ctx.beginPath();
      ctx.moveTo(size - 100, 50);
      ctx.lineTo(size - 100, 40);
      ctx.lineTo(size - 80, 40);
      ctx.lineTo(size - 80, 50);
      ctx.stroke();
      break;
      
    case 'marketing':
      // Target/Diana
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(100, 100, 40, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(100, 100, 25, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(100, 100, 10, 0, Math.PI * 2);
      ctx.fill();
      // Megáfono estilizado
      ctx.beginPath();
      ctx.moveTo(size - 120, size - 100);
      ctx.lineTo(size - 60, size - 130);
      ctx.lineTo(size - 60, size - 70);
      ctx.closePath();
      ctx.stroke();
      break;
      
    case 'culinary':
      // Utensilios de cocina
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      // Cuchillo
      ctx.beginPath();
      ctx.moveTo(60, 60);
      ctx.lineTo(60, 120);
      ctx.lineTo(70, 125);
      ctx.lineTo(70, 60);
      ctx.stroke();
      // Tenedor
      ctx.beginPath();
      ctx.moveTo(size - 80, 60);
      ctx.lineTo(size - 80, 90);
      ctx.moveTo(size - 90, 60);
      ctx.lineTo(size - 90, 85);
      ctx.moveTo(size - 70, 60);
      ctx.lineTo(size - 70, 85);
      ctx.moveTo(size - 95, 90);
      ctx.lineTo(size - 65, 90);
      ctx.lineTo(size - 80, 130);
      ctx.stroke();
      // Gorro de chef estilizado
      ctx.beginPath();
      ctx.arc(size / 2, size - 80, 30, Math.PI, 0);
      ctx.stroke();
      break;
      
    case 'education':
      // Libros apilados
      ctx.fillStyle = color;
      ctx.fillRect(40, size - 120, 60, 15);
      ctx.fillRect(45, size - 140, 55, 15);
      ctx.fillRect(42, size - 158, 58, 15);
      // Birrete
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(size - 120, 80);
      ctx.lineTo(size - 80, 60);
      ctx.lineTo(size - 40, 80);
      ctx.lineTo(size - 80, 100);
      ctx.closePath();
      ctx.stroke();
      // Borla
      ctx.beginPath();
      ctx.moveTo(size - 80, 60);
      ctx.lineTo(size - 80, 40);
      ctx.lineTo(size - 60, 45);
      ctx.stroke();
      // Estrellas
      drawStar(ctx, 80, 80, 15, color);
      drawStar(ctx, size - 60, size - 60, 12, color);
      break;
      
    case 'vet':
      // Huellas de animal
      ctx.fillStyle = color;
      drawPaw(ctx, 70, 70, 20);
      drawPaw(ctx, size - 90, 90, 15);
      drawPaw(ctx, 90, size - 100, 18);
      drawPaw(ctx, size - 70, size - 70, 22);
      // Corazón
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      drawHeart(ctx, size / 2, 70, 25);
      break;
      
    default:
      // Patrón genérico de grid
      ctx.strokeStyle = color;
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
  }
  
  ctx.globalAlpha = 1;
}

// Funciones auxiliares para dibujar elementos
function drawGear(ctx, x, y, radius, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.4, 0, Math.PI * 2);
  ctx.stroke();
  // Dientes
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
    ctx.lineTo(x + Math.cos(angle) * (radius + 8), y + Math.sin(angle) * (radius + 8));
    ctx.stroke();
  }
}

function drawCross(ctx, x, y, size, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x - size/6, y - size/2, size/3, size);
  ctx.fillRect(x - size/2, y - size/6, size, size/3);
}

function drawColumn(ctx, x, y, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  // Base
  ctx.fillRect(x - 5, y + 70, 25, 8);
  // Columna
  ctx.fillRect(x, y + 10, 15, 60);
  // Capitel
  ctx.fillRect(x - 5, y, 25, 12);
}

function drawStar(ctx, x, y, radius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function drawPaw(ctx, x, y, size) {
  // Almohadilla principal
  ctx.beginPath();
  ctx.ellipse(x, y + size/2, size/2, size/3, 0, 0, Math.PI * 2);
  ctx.fill();
  // Dedos
  const toePositions = [
    { dx: -size/2, dy: -size/4 },
    { dx: -size/6, dy: -size/2 },
    { dx: size/6, dy: -size/2 },
    { dx: size/2, dy: -size/4 },
  ];
  toePositions.forEach(pos => {
    ctx.beginPath();
    ctx.arc(x + pos.dx, y + pos.dy, size/5, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawHeart(ctx, x, y, size) {
  ctx.beginPath();
  ctx.moveTo(x, y + size/4);
  ctx.bezierCurveTo(x, y, x - size/2, y, x - size/2, y + size/4);
  ctx.bezierCurveTo(x - size/2, y + size/2, x, y + size * 0.75, x, y + size);
  ctx.bezierCurveTo(x, y + size * 0.75, x + size/2, y + size/2, x + size/2, y + size/4);
  ctx.bezierCurveTo(x + size/2, y, x, y, x, y + size/4);
  ctx.stroke();
}

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

      // Fondo oscuro con gradiente usando colores de la profesión
      const gradient = ctx.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, '#0a0a0f');
      gradient.addColorStop(0.5, '#12121a');
      gradient.addColorStop(1, '#0a0a0f');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);

      // Dibujar patrón específico de la profesión
      drawPattern(ctx, selectedProfession.pattern, selectedProfession.frameColor, selectedProfession.secondaryColor, size);

      // Marco exterior principal con doble línea
      ctx.strokeStyle = selectedProfession.frameColor;
      ctx.lineWidth = 4;
      ctx.strokeRect(12, 12, size - 24, size - 24);
      
      ctx.strokeStyle = selectedProfession.secondaryColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 20, size - 40, size - 40);

      // Barra superior con título de profesión
      const barGradient = ctx.createLinearGradient(30, 30, size - 30, 30);
      barGradient.addColorStop(0, selectedProfession.frameColor + '40');
      barGradient.addColorStop(0.5, selectedProfession.frameColor + '60');
      barGradient.addColorStop(1, selectedProfession.frameColor + '40');
      ctx.fillStyle = barGradient;
      ctx.fillRect(30, 30, size - 60, 50);
      
      ctx.strokeStyle = selectedProfession.frameColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(30, 30, size - 60, 50);

      // Texto en barra superior
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`FUTURO/A ${selectedProfession.name.toUpperCase()}`, size / 2, 62);

      // Área de la foto (circular)
      const centerX = size / 2;
      const centerY = size / 2 + 10;
      const radius = 150;

      // Anillos decorativos alrededor de la foto
      ctx.strokeStyle = selectedProfession.frameColor + '30';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 35, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.setLineDash([10, 5]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 25, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Glow effect
      const glowGradient = ctx.createRadialGradient(centerX, centerY, radius - 20, centerX, centerY, radius + 30);
      glowGradient.addColorStop(0, selectedProfession.frameColor + '30');
      glowGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 30, 0, Math.PI * 2);
      ctx.fill();

      // Borde de la foto
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 5, 0, Math.PI * 2);
      ctx.strokeStyle = selectedProfession.frameColor;
      ctx.lineWidth = 4;
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

      // Emoji de profesión en esquina de foto
      ctx.font = '45px Arial';
      ctx.fillText(selectedProfession.emoji, centerX + radius - 20, centerY + radius - 10);

      // Caja inferior con tagline
      const boxY = size - 115;
      const boxHeight = 75;
      
      const boxGradient = ctx.createLinearGradient(0, boxY, 0, boxY + boxHeight);
      boxGradient.addColorStop(0, 'rgba(0, 0, 0, 0.95)');
      boxGradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
      ctx.fillStyle = boxGradient;
      ctx.fillRect(30, boxY, size - 60, boxHeight);
      
      ctx.strokeStyle = selectedProfession.frameColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(30, boxY, size - 60, boxHeight);

      // Icono y tagline
      ctx.font = '28px Arial';
      ctx.fillText(selectedProfession.icon, size / 2, boxY + 35);
      
      ctx.fillStyle = selectedProfession.frameColor;
      ctx.font = '16px Arial';
      ctx.fillText(selectedProfession.tagline, size / 2, boxY + 60);

      // Logo CVDP
      ctx.fillStyle = '#666666';
      ctx.font = '10px Arial';
      ctx.fillText('CVDP • Tec de Monterrey Campus SLP • Feria Ocupacional 2025', size / 2, size - 18);

      // Esquinas decorativas con diseño más elaborado
      ctx.strokeStyle = selectedProfession.frameColor;
      ctx.lineWidth = 3;
      
      const cornerSize = 35;
      // Superior izquierda
      ctx.beginPath();
      ctx.moveTo(12, cornerSize + 12);
      ctx.lineTo(12, 12);
      ctx.lineTo(cornerSize + 12, 12);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(12, 12, 4, 0, Math.PI * 2);
      ctx.fillStyle = selectedProfession.frameColor;
      ctx.fill();
      
      // Superior derecha
      ctx.beginPath();
      ctx.moveTo(size - cornerSize - 12, 12);
      ctx.lineTo(size - 12, 12);
      ctx.lineTo(size - 12, cornerSize + 12);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(size - 12, 12, 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Inferior izquierda
      ctx.beginPath();
      ctx.moveTo(12, size - cornerSize - 12);
      ctx.lineTo(12, size - 12);
      ctx.lineTo(cornerSize + 12, size - 12);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(12, size - 12, 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Inferior derecha
      ctx.beginPath();
      ctx.moveTo(size - cornerSize - 12, size - 12);
      ctx.lineTo(size - 12, size - 12);
      ctx.lineTo(size - 12, size - cornerSize - 12);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(size - 12, size - 12, 4, 0, Math.PI * 2);
      ctx.fill();

      // Descargar
      const link = document.createElement('a');
      link.download = `futuro-${selectedProfession.id}-cvdp-2025.png`;
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
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <span className="text-sm text-gray-400 hover:text-neon-cyan transition-colors">← Volver al inicio</span>
          </Link>
          <h1 className="font-display text-3xl font-black">
            <span className="text-white">MARCO</span>{' '}
            <span className="text-neon-magenta">PROFESIONAL</span>
          </h1>
          <p className="text-gray-400 mt-2">Sube tu foto y obtén un marco personalizado de tu futura carrera</p>
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
              <h3 className="font-display text-xl font-bold text-white text-center mb-2">¿Cuál será tu carrera? 🎯</h3>
              <p className="text-gray-400 text-center mb-6 text-sm">Cada marco tiene elementos únicos de la profesión</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {professions.map((profession) => (
                  <motion.button
                    key={profession.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedProfession(profession)}
                    className={`card-neon rounded-xl p-3 text-center transition-all ${
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
                    <span className="text-2xl block mb-1">{profession.emoji}</span>
                    <span className="text-xs font-medium block">{profession.name}</span>
                    <span className="text-[10px] text-gray-500 block mt-1">{profession.icon}</span>
                  </motion.button>
                ))}
              </div>
              
              {selectedProfession && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-4 p-3 rounded-lg"
                  style={{ backgroundColor: selectedProfession.frameColor + '10', border: `1px solid ${selectedProfession.frameColor}30` }}
                >
                  <span className="text-2xl">{selectedProfession.emoji}</span>
                  <p className="text-sm mt-1" style={{ color: selectedProfession.frameColor }}>{selectedProfession.tagline}</p>
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
                {selectedProfession ? '🖼️ CREAR MI MARCO' : 'Selecciona una carrera'}
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
                {selectedProfession?.emoji || '🖼️'}
              </motion.div>
              <h3 className="font-display text-2xl font-bold text-white mb-4">
                Creando tu marco de {selectedProfession?.name}...
              </h3>
              <div className="max-w-xs mx-auto h-2 bg-arena-card rounded-full overflow-hidden">
                <motion.div 
                  className="h-full"
                  style={{ background: `linear-gradient(to right, ${selectedProfession?.frameColor}, ${selectedProfession?.secondaryColor})` }}
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
              <div className="card-neon rounded-2xl p-4 mb-6 overflow-hidden max-w-md mx-auto">
                <div 
                  className="relative rounded-xl p-4"
                  style={{ 
                    border: `3px solid ${selectedProfession?.frameColor}`,
                    background: `linear-gradient(135deg, ${selectedProfession?.frameColor}10 0%, #0a0a0f 50%, ${selectedProfession?.secondaryColor}10 100%)`
                  }}
                >
                  {/* Header */}
                  <div 
                    className="rounded-lg p-2 mb-4 text-center"
                    style={{ 
                      background: `linear-gradient(to right, ${selectedProfession?.frameColor}30, ${selectedProfession?.frameColor}50, ${selectedProfession?.frameColor}30)`,
                      border: `1px solid ${selectedProfession?.frameColor}50`
                    }}
                  >
                    <span className="text-white font-bold text-sm">FUTURO/A {selectedProfession?.name.toUpperCase()}</span>
                  </div>
                  
                  {/* Foto circular */}
                  <div className="relative mx-auto w-40 h-40 mb-4">
                    <div 
                      className="absolute inset-[-6px] rounded-full"
                      style={{ 
                        border: `3px solid ${selectedProfession?.frameColor}`,
                        boxShadow: `0 0 30px ${selectedProfession?.frameColor}40`
                      }}
                    />
                    <img 
                      src={uploadedImage} 
                      alt="Tu foto" 
                      className="w-full h-full rounded-full object-cover"
                    />
                    <span className="absolute bottom-0 right-0 text-3xl">{selectedProfession?.emoji}</span>
                  </div>
                  
                  {/* Tagline */}
                  <div 
                    className="bg-black/80 rounded-lg p-3 border text-center"
                    style={{ borderColor: selectedProfession?.frameColor + '50' }}
                  >
                    <span className="text-xl">{selectedProfession?.icon}</span>
                    <p 
                      className="text-sm mt-1"
                      style={{ color: selectedProfession?.frameColor }}
                    >
                      {selectedProfession?.tagline}
                    </p>
                  </div>
                  
                  {/* Logo */}
                  <p className="text-gray-600 text-[10px] mt-3">CVDP • Tec de Monterrey SLP • 2025</p>
                </div>
              </div>
              
              <div className="space-y-3 max-w-md mx-auto">
                <motion.button 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }} 
                  onClick={downloadImage} 
                  className="w-full py-4 rounded-xl font-display font-bold text-lg text-arena-dark"
                  style={{ background: `linear-gradient(to right, ${selectedProfession?.frameColor}, ${selectedProfession?.secondaryColor})` }}
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
