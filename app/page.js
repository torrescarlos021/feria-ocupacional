'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Cursor glow effect */}
      <div 
        className="pointer-events-none fixed w-96 h-96 rounded-full opacity-20 blur-3xl transition-all duration-300 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(0,245,255,0.4) 0%, rgba(255,0,255,0.2) 50%, transparent 70%)',
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: i % 2 === 0 ? '#00f5ff' : '#ff00ff',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between max-w-7xl mx-auto"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-magenta flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-neon-cyan">CVDP</h2>
              <p className="text-xs text-gray-400">Tec de Monterrey SLP</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Feria de Salud y Bienestar</p>
            <p className="font-display text-neon-magenta font-bold">ESFERA OCUPACIONAL</p>
          </div>
        </motion.div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block mb-6"
          >
            <span className="px-4 py-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 text-neon-cyan text-sm font-medium">
              ✨ Descubre tu futuro profesional
            </span>
          </motion.div>

          {/* Title */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black mb-6">
            <span className="block text-white">ENCUENTRA TU</span>
            <span className="block bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-yellow bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]">
              VOCACIÓN
            </span>
          </h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-12"
          >
            Compite, descubre y visualiza tu futuro profesional en una experiencia interactiva única
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/play">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-xl font-display font-bold text-xl text-arena-dark overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <span className="text-2xl">🎮</span>
                  UNIRSE AL JUEGO
                </span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
              </motion.button>
            </Link>

            <Link href="/host">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-neon-cyan/50 rounded-xl font-display font-bold text-xl text-neon-cyan hover:bg-neon-cyan/10 transition-colors flex items-center gap-3"
              >
                <span className="text-2xl">📺</span>
                SOY PRESENTADOR
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Features */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-5xl mx-auto"
        >
          {[
            { icon: '🧠', title: 'Quiz en Vivo', desc: 'Compite con tus compañeros en tiempo real', color: 'cyan' },
            { icon: '🎯', title: 'Test Vocacional', desc: 'Descubre las carreras que van contigo', color: 'magenta' },
            { icon: '🖼️', title: 'Tu Futuro en IA', desc: 'Visualízate como profesional con IA', color: 'yellow' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5, scale: 1.02 }}
              className="card-neon rounded-2xl p-6 text-center"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className={`font-display font-bold text-xl mb-2 text-neon-${feature.color}`}>
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Footer decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent" />
    </main>
  );
}
