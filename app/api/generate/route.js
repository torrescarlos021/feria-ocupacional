import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request) {
  try {
    const { profession } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        { error: 'API key de Gemini no configurada' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: {
        responseModalities: ["image", "text"],
      }
    });

    const prompts = {
      engineer: 'ingeniero profesional con casco de seguridad en obra moderna',
      doctor: 'médico profesional con bata blanca en hospital moderno',
      designer: 'diseñador gráfico creativo en estudio moderno',
      scientist: 'científico en laboratorio con equipo de investigación',
      entrepreneur: 'empresario exitoso en oficina moderna con vista a la ciudad',
      architect: 'arquitecto profesional con planos y maquetas',
      programmer: 'desarrollador de software con múltiples monitores',
      teacher: 'maestro inspirador en aula moderna',
    };

    const prompt = `Genera una imagen fotorrealista de alta calidad de un joven profesional mexicano como ${prompts[profession] || prompts.engineer}. Estilo: fotografía profesional corporativa, iluminación de estudio, aspecto exitoso e inspirador.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    let generatedImage = null;
    
    if (response.candidates && response.candidates[0]) {
      const parts = response.candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData) {
          generatedImage = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!generatedImage) {
      return Response.json(
        { error: 'No se pudo generar la imagen' },
        { status: 500 }
      );
    }

    return Response.json({ 
      success: true,
      image: generatedImage
    });

  } catch (error) {
    console.error('Error:', error);
    return Response.json(
      { error: 'Error al generar imagen: ' + error.message },
      { status: 500 }
    );
  }
}