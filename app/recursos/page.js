'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const resources = [
  {
    id: 'cv',
    title: '📄 Cómo hacer tu CV',
    icon: '📄',
    color: 'cyan',
    content: {
      title: "Guía para crear un CV profesional",
      sections: [
        {
          title: "📌 Estructura básica",
          items: [
            "Datos personales: nombre, teléfono, email, LinkedIn",
            "Objetivo profesional: 2-3 líneas de tus metas",
            "Educación: institución, carrera, fechas",
            "Experiencia: prácticas, proyectos, voluntariado",
            "Habilidades: técnicas y blandas",
            "Idiomas: nivel de dominio"
          ]
        },
        {
          title: "✅ Tips que funcionan",
          items: [
            "Mantén tu CV en 1 página (máximo 2)",
            "Usa verbos de acción: desarrollé, lideré, implementé",
            "Cuantifica logros: 'aumenté ventas 20%'",
            "Personaliza para cada vacante",
            "Revisa ortografía 3 veces mínimo",
            "Usa formato PDF para enviar"
          ]
        },
        {
          title: "❌ Errores comunes",
          items: [
            "Incluir foto (a menos que te la pidan)",
            "Poner información irrelevante",
            "Usar diseños muy elaborados",
            "Mentir sobre habilidades",
            "Dejar huecos sin explicar",
            "Email poco profesional: fiestero2005@..."
          ]
        }
      ]
    }
  },
  {
    id: 'myths',
    title: '🎓 Mitos vs Realidades',
    icon: '🎓',
    color: 'magenta',
    content: {
      title: "Verdades y mitos de la universidad",
      myths: [
        {
          myth: "La carrera que elijas define toda tu vida",
          reality: "Muchos profesionales exitosos cambian de rumbo. Lo importante son las habilidades que desarrollas.",
          verdict: "MITO"
        },
        {
          myth: "Solo las universidades caras son buenas",
          reality: "La calidad depende más de tu esfuerzo y aprovechamiento que del nombre de la institución.",
          verdict: "MITO"
        },
        {
          myth: "Las prácticas profesionales son importantes",
          reality: "Son esenciales. El 70% de las contrataciones vienen de prácticas o recomendaciones.",
          verdict: "REALIDAD"
        },
        {
          myth: "No necesitas inglés si te quedas en México",
          reality: "El 85% de las vacantes mejor pagadas requieren inglés. Es casi obligatorio.",
          verdict: "MITO"
        },
        {
          myth: "El promedio no importa tanto",
          reality: "Para becas, posgrados y primeros empleos, sí puede hacer diferencia.",
          verdict: "DEPENDE"
        },
        {
          myth: "Las habilidades blandas no se aprenden",
          reality: "Comunicación, liderazgo y trabajo en equipo se desarrollan con práctica intencional.",
          verdict: "MITO"
        }
      ]
    }
  },
  {
    id: 'careers',
    title: '🎯 Explora Carreras',
    icon: '🎯',
    color: 'yellow',
    content: {
      title: "Áreas profesionales populares",
      areas: [
        {
          name: "Ingeniería y Tecnología",
          careers: ["Mecatrónica", "Sistemas", "Industrial", "Civil"],
          salary: "$18,000 - $45,000/mes",
          growth: "📈 Alta demanda"
        },
        {
          name: "Ciencias de la Salud",
          careers: ["Medicina", "Nutrición", "Psicología", "Enfermería"],
          salary: "$15,000 - $80,000/mes",
          growth: "📈 Demanda estable"
        },
        {
          name: "Negocios y Administración",
          careers: ["Administración", "Finanzas", "Marketing", "RRHH"],
          salary: "$12,000 - $50,000/mes",
          growth: "📊 Mercado competido"
        },
        {
          name: "Diseño y Creatividad",
          careers: ["Diseño Gráfico", "UX/UI", "Animación", "Arquitectura"],
          salary: "$10,000 - $35,000/mes",
          growth: "📈 Creciendo con digital"
        },
        {
          name: "Ciencias Sociales",
          careers: ["Derecho", "Comunicación", "Relaciones Int.", "Educación"],
          salary: "$12,000 - $40,000/mes",
          growth: "📊 Según especialidad"
        }
      ]
    }
  },
  {
    id: 'tips',
    title: '💡 Tips de Preparatoria',
    icon: '💡',
    color: 'green',
    content: {
      title: "Aprovecha al máximo tu prepa",
      tips: [
        {
          category: "📚 Académico",
          items: [
            "Mantén promedio arriba de 85 para becas",
            "Toma cursos extra de lo que te interesa",
            "Participa en olimpiadas académicas",
            "Aprende un segundo idioma YA"
          ]
        },
        {
          category: "🤝 Desarrollo personal",
          items: [
            "Únete a clubes y grupos estudiantiles",
            "Desarrolla habilidades de comunicación",
            "Haz voluntariado (se ve increíble en CV)",
            "Aprende a manejar tu tiempo"
          ]
        },
        {
          category: "💻 Habilidades digitales",
          items: [
            "Domina Excel (sí, todavía importa)",
            "Aprende lo básico de programación",
            "Usa LinkedIn aunque no trabajes aún",
            "Crea un portafolio de tus proyectos"
          ]
        },
        {
          category: "🎯 Planificación",
          items: [
            "Investiga universidades desde 4to semestre",
            "Prepárate para exámenes de admisión",
            "Visita campus en días abiertos",
            "Habla con profesionales de carreras que te interesan"
          ]
        }
      ]
    }
  },
  {
    id: 'contact',
    title: '📞 Contacto CVDP',
    icon: '📞',
    color: 'purple',
    content: {
      title: "Centro de Vinculación y Desarrollo Profesional",
      info: {
        description: "Estamos aquí para ayudarte en tu camino profesional. Ofrecemos orientación vocacional, bolsa de trabajo, y asesoría para tu desarrollo.",
        services: [
          "🎯 Orientación vocacional",
          "💼 Bolsa de trabajo y prácticas",
          "📄 Revisión de CV",
          "🎤 Talleres de entrevistas",
          "🌐 Networking con empresas"
        ],
        contact: {
          email: "cvdp.slp@tec.mx",
          phone: "444 123 4567",
          location: "Edificio de Servicios Escolares, Planta Baja",
          hours: "Lunes a Viernes 9:00 - 18:00"
        },
        social: {
          instagram: "@cvdp_tecslp",
          linkedin: "/tecslp-cvdp"
        }
      }
    }
  }
];

export default function RecursosPage() {
  const [activeResource, setActiveResource] = useState(null);

  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <span className="text-sm text-gray-400 hover:text-neon-cyan transition-colors">
              ← Volver al inicio
            </span>
          </Link>
          <h1 className="font-display text-4xl font-black">
            <span className="text-white">RECURSOS</span>{' '}
            <span className="text-neon-cyan">ÚTILES</span>
          </h1>
          <p className="text-gray-400 mt-2">
            Todo lo que necesitas para prepararte para tu futuro
          </p>
        </div>

        {/* Grid de recursos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {resources.map((resource, index) => (
            <motion.button
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveResource(resource)}
              className={`card-neon rounded-xl p-6 text-left transition-all hover:border-neon-${resource.color}/50`}
            >
              <span className="text-4xl block mb-3">{resource.icon}</span>
              <h3 className={`font-display font-bold text-lg text-neon-${resource.color}`}>
                {resource.title}
              </h3>
            </motion.button>
          ))}
        </div>

        {/* Modal de recurso */}
        <AnimatePresence>
          {activeResource && (
            <ResourceModal 
              resource={activeResource} 
              onClose={() => setActiveResource(null)} 
            />
          )}
        </AnimatePresence>

        {/* Quick links */}
        <div className="card-neon rounded-2xl p-6">
          <h3 className="font-display font-bold text-xl text-white mb-4">
            🔗 Enlaces rápidos
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: '🌐', label: 'Sitio Tec', url: '#' },
              { icon: '📧', label: 'Email CVDP', url: 'mailto:cvdp.slp@tec.mx' },
              { icon: '📱', label: 'Instagram', url: '#' },
              { icon: '💼', label: 'LinkedIn', url: '#' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.url}
                className="flex items-center gap-2 p-3 bg-arena-dark/50 rounded-lg hover:bg-arena-dark transition-colors"
              >
                <span>{link.icon}</span>
                <span className="text-sm text-gray-300">{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ResourceModal({ resource, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="card-neon rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="text-4xl">{resource.icon}</span>
            <h2 className={`font-display text-2xl font-bold text-neon-${resource.color} mt-2`}>
              {resource.content.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-arena-dark flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content based on type */}
        {resource.id === 'cv' && <CVContent content={resource.content} />}
        {resource.id === 'myths' && <MythsContent content={resource.content} />}
        {resource.id === 'careers' && <CareersContent content={resource.content} />}
        {resource.id === 'tips' && <TipsContent content={resource.content} />}
        {resource.id === 'contact' && <ContactContent content={resource.content} />}
      </motion.div>
    </motion.div>
  );
}

function CVContent({ content }) {
  return (
    <div className="space-y-6">
      {content.sections.map((section, idx) => (
        <div key={idx}>
          <h3 className="font-display font-bold text-lg text-white mb-3">
            {section.title}
          </h3>
          <ul className="space-y-2">
            {section.items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-300">
                <span className="text-neon-cyan">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function MythsContent({ content }) {
  return (
    <div className="space-y-4">
      {content.myths.map((item, idx) => (
        <div key={idx} className="bg-arena-dark/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded text-xs font-bold ${
              item.verdict === 'MITO' ? 'bg-red-500/20 text-red-400' :
              item.verdict === 'REALIDAD' ? 'bg-green-500/20 text-green-400' :
              'bg-yellow-500/20 text-yellow-400'
            }`}>
              {item.verdict}
            </span>
          </div>
          <p className="text-white font-medium mb-2">"{item.myth}"</p>
          <p className="text-gray-400 text-sm">{item.reality}</p>
        </div>
      ))}
    </div>
  );
}

function CareersContent({ content }) {
  return (
    <div className="space-y-4">
      {content.areas.map((area, idx) => (
        <div key={idx} className="bg-arena-dark/50 rounded-xl p-4">
          <h4 className="font-display font-bold text-white mb-2">{area.name}</h4>
          <div className="flex flex-wrap gap-2 mb-3">
            {area.careers.map((career) => (
              <span key={career} className="px-2 py-1 bg-neon-cyan/10 text-neon-cyan rounded text-sm">
                {career}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">💰 {area.salary}</span>
            <span className="text-gray-400">{area.growth}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function TipsContent({ content }) {
  return (
    <div className="space-y-6">
      {content.tips.map((tip, idx) => (
        <div key={idx}>
          <h3 className="font-display font-bold text-lg text-white mb-3">
            {tip.category}
          </h3>
          <ul className="space-y-2">
            {tip.items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-300">
                <span className="text-neon-green">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function ContactContent({ content }) {
  const { info } = content;
  
  return (
    <div className="space-y-6">
      <p className="text-gray-300">{info.description}</p>
      
      <div>
        <h4 className="font-display font-bold text-white mb-3">Servicios</h4>
        <ul className="space-y-2">
          {info.services.map((service, i) => (
            <li key={i} className="text-gray-300">{service}</li>
          ))}
        </ul>
      </div>

      <div className="bg-arena-dark/50 rounded-xl p-4">
        <h4 className="font-display font-bold text-white mb-3">📍 Contacto</h4>
        <div className="space-y-2 text-gray-300">
          <p>📧 {info.contact.email}</p>
          <p>📞 {info.contact.phone}</p>
          <p>📍 {info.contact.location}</p>
          <p>🕐 {info.contact.hours}</p>
        </div>
      </div>

      <div className="flex gap-4">
        <a href="#" className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-center font-bold">
          📱 {info.social.instagram}
        </a>
        <a href="#" className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl text-center font-bold">
          💼 LinkedIn
        </a>
      </div>
    </div>
  );
}
