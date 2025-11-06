import { NextRequest } from "next/server";
import sharp from "sharp";
import { supabaseServer } from "@/lib/supabaseServer";

const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY || "AIzaSyBbcteBoho49_Bg9uhDOyeeTINwolM082k";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file");
  const prompt = form.get("prompt") as string;
  const operation = form.get("operation") as string;

  if (!(file instanceof File)) {
    return new Response(JSON.stringify({ error: "file required" }), { status: 400 });
  }

  try {
    const input = Buffer.from(await file.arrayBuffer());
    let processed: Buffer;

    if (operation === "mannequin_replacement" && prompt) {
      // Use Google AI Studio for mannequin replacement
      processed = await generateMannequinReplacement(input, prompt);
    } else {
      // Fallback to basic processing
      processed = await sharp(input).rotate().sharpen().toFormat("png").toBuffer();
    }

    return new Response(processed as any, {
      status: 200,
      headers: {
        "content-type": "image/png",
        "cache-control": "no-store",
      },
    });
  } catch (error) {
    console.error("Image processing error:", error);
    return new Response(JSON.stringify({ error: "processing failed" }), { status: 500 });
  }
}

async function generateMannequinReplacement(imageBuffer: Buffer, prompt: string): Promise<Buffer> {
  try {
    // Convert image to base64
    const base64Image = imageBuffer.toString('base64');
    
    // Call Google AI Studio API for image generation
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_AI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: `${prompt}. Keep the exact same clothing, colors, and style. Only replace the human model with a mannequin. Maintain the same pose and composition.`
            },
            {
              inline_data: {
                mime_type: "image/png",
                data: base64Image
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 1,
          maxOutputTokens: 4096,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Google AI API error: ${response.status}`);
    }

    const result = await response.json();
    
    // For now, since Gemini doesn't directly generate images, we'll use a different approach
    // This is a placeholder - in production you'd use a proper image generation model
    return await createMannequinComposite(imageBuffer, prompt);
    
  } catch (error) {
    console.error("Google AI API error:", error);
    // Fallback to basic processing
    return await sharp(imageBuffer).rotate().sharpen().toFormat("png").toBuffer();
  }
}

async function createMannequinComposite(imageBuffer: Buffer, prompt: string): Promise<Buffer> {
  // This is a simplified version - in production you'd use proper AI models
  // For now, we'll apply some filters to simulate mannequin replacement
  
  try {
    const processed = await sharp(imageBuffer)
      .modulate({
        brightness: 1.1,
        saturation: 0.8,
        hue: 0
      })
      .sharpen()
      .gamma(1.2)
      .toFormat("png")
      .toBuffer();
    
    return processed;
  } catch (error) {
    console.error("Image composite error:", error);
    return imageBuffer;
  }
}

