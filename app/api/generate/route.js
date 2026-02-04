import Replicate from 'replicate';

// Banco de imágenes de profesionales con caras frontales claras
const professionalImages = {
  engineer: [
    "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800",
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800",
  ],
  doctor: [
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800",
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800",
  ],
  designer: [
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
    "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800",
  ],
  scientist: [
    "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800",
    "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800",
  ],
  entrepreneur: [
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800",
  ],
  architect: [
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800",
    "https://images.unsplash.com/photo-1574359411659-15573a27fd0c?w=800",
  ],
  programmer: [
    "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?w=800",
    "https://images.unsplash.com/photo-1580894894513-541e068a3e2b?w=800",
  ],
  teacher: [
    "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800",
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800",
  ],
};

function getRandomImage(profession) {
  const images = professionalImages[profession] || professionalImages.engineer;
  return images[Math.floor(Math.random() * images.length)];
}

export async function POST(request) {
  try {
    const { image, profession } = await request.json();

    if (!process.env.REPLICATE_API_TOKEN) {
      return Response.json(
        { error: 'API token de Replicate no configurado' },
        { status: 500 }
      );
    }

    if (!image) {
      return Response.json(
        { error: 'No se recibió imagen' },
        { status: 400 }
      );
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const targetImage = getRandomImage(profession);

    console.log('🎯 Profession:', profession);
    console.log('🖼️ Target image:', targetImage);

    // Face-swap: poner cara del usuario en imagen de profesional
    const output = await replicate.run(
      "codeplugtech/face-swap",
      {
        input: {
          input_image: targetImage,  // Imagen del profesional
          swap_image: image,         // Selfie del usuario
        }
      }
    );

    console.log('✅ Output:', output);

    if (!output) {
      return Response.json(
        { error: 'No se pudo generar la imagen' },
        { status: 500 }
      );
    }

    return Response.json({ 
      success: true,
      image: output
    });

  } catch (error) {
    console.error('❌ Error:', error);
    return Response.json(
      { error: 'Error al generar imagen: ' + error.message },
      { status: 500 }
    );
  }
}
