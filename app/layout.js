import './globals.css'

export const metadata = {
  title: 'Feria Ocupacional | CVDP - Tec de Monterrey',
  description: 'Descubre tu vocación profesional en la Feria de Salud y Bienestar',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="arena-bg min-h-screen">
        {children}
      </body>
    </html>
  )
}
