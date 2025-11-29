import { GoogleGenAI, Type } from "@google/genai";
import { AdCopy } from "../types";

const initGenAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key tidak dijumpai. Sila pastikan anda telah memilih API key.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateAdCopy = async (productName: string, imageBase64?: string): Promise<AdCopy> => {
  try {
    const ai = initGenAI();
    
    // Schema definition for structured JSON output
    const schema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "Tajuk iklan yang menarik (catchy), maksimum 60 karakter." },
        description: { type: Type.STRING, description: "Deskripsi produk yang memukau untuk media sosial (FB/Insta/TikTok)." },
        sellingPoints: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "3-5 poin jualan utama (USP)."
        },
        cta: { type: Type.STRING, description: "Call to Action yang kuat (contoh: Beli Sekarang, Klik Sini)." }
      },
      required: ["title", "description", "sellingPoints", "cta"]
    };

    const prompt = `Anda adalah pakar pemasaran digital Malaysia. Sila buat ayat iklan (copywriting) dalam Bahasa Melayu untuk produk: "${productName}". 
    Gunakan gaya bahasa yang santai tapi meyakinkan (persuasive). Sertakan emoji yang sesuai.`;

    const parts: any[] = [{ text: prompt }];

    // If we had a real backend, we would pass the image binary here. 
    // For this client-side demo, we rely mostly on the product name unless base64 is provided.
    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: imageBase64.split(',')[1] // remove data:image/jpeg;base64, prefix
        }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: parts
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.7
      }
    });

    const textResponse = response.text;
    if (!textResponse) throw new Error("Tiada respon dari AI");

    return JSON.parse(textResponse) as AdCopy;

  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};
