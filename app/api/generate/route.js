import Replicate from 'replicate';

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

    const prompts = {
      engineer: 'professional engineer wearing safety helmet and vest, at modern construction site, corporate photography, confident pose',
      doctor: 'professional doctor wearing white coat and stethoscope, in modern hospital, medical professional portrait',
      designer: 'creative graphic designer in modern design studio, artistic professional portrait',
      scientist: 'scientist in laboratory wearing lab coat, with research equipment, professional portrait',
      entrepreneur: 'successful business entrepreneur in modern office, wearing professional suit, confident pose',
      architect: 'professional architect with building blueprints, modern office, corporate portrait',
      programmer: 'software developer at desk with multiple monitors, modern tech office, professional portrait',
      teacher: 'inspiring teacher in modern classroom, friendly and professional appearance',
    };

    const prompt = prompts[profession] || prompts.engineer;

    console.log('Generating image with InstantID...');

    const output = await replicate.run(
      "zsxkib/instant-id:491ddf5be63c64e86dc48de8bb1b553cd1b93d7852a8ece2d8c4e6c0b9677d14",
      {
        input: {
          image: image,
          prompt: prompt + ", high quality, professional photography, 8k",
          negative_prompt: "blurry, low quality, distorted face, ugly, bad anatomy",
          num_inference_steps: 30,
          guidance_scale: 5,
          ip_adapter_scale: 0.8,
          controlnet_conditioning_scale: 0.8,
        }
      }
    );

    console.log('Output:', output);

    // Replicate retorna una URL de la imagen
    const imageUrl = Array.isArray(output) ? output[0] : output;

    if (!imageUrl) {
      return Response.json(
        { error: 'No se pudo generar la imagen' },
        { status: 500 }
      );
    }

    return Response.json({ 
      success: true,
      image: imageUrl
    });

  } catch (error) {
    console.error('Error:', error);
    return Response.json(
      { error: 'Error al generar imagen: ' + error.message },
      { status: 500 }
    );
  }
}
