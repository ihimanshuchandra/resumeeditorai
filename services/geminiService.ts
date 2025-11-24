import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData, Industry } from "../types";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

interface ParseInput {
  text?: string;
  fileData?: string; // base64
  mimeType?: string;
}

export const parseResumeText = async (input: ParseInput): Promise<ResumeData> => {
  const ai = getAIClient();
  
  const prompt = `
    Parse the provided resume (text or document) into a structured JSON format. 
    Extract personal info, a professional summary, work experience, education, and a list of skills.
    If dates are missing, use "Present" or estimate based on context if possible, otherwise leave blank.
    For experience descriptions, consolidate bullet points into a single text block separated by newlines.
    
    Ensure the output strictly follows the JSON schema provided.
  `;

  let contentParts: any[] = [];
  
  if (input.fileData && input.mimeType) {
    contentParts.push({
      inlineData: {
        data: input.fileData,
        mimeType: input.mimeType
      }
    });
    contentParts.push({ text: prompt });
  } else if (input.text) {
    contentParts.push({ text: `${prompt}\n\nResume Text:\n${input.text}` });
  } else {
    throw new Error("No input provided for parsing");
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: { parts: contentParts },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          personalInfo: {
            type: Type.OBJECT,
            properties: {
              fullName: { type: Type.STRING },
              email: { type: Type.STRING },
              phone: { type: Type.STRING },
              linkedin: { type: Type.STRING },
              location: { type: Type.STRING },
              website: { type: Type.STRING },
            },
            required: ["fullName"],
          },
          summary: { type: Type.STRING },
          experience: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING, description: "Generate a unique random ID" },
                company: { type: Type.STRING },
                role: { type: Type.STRING },
                startDate: { type: Type.STRING },
                endDate: { type: Type.STRING },
                description: { type: Type.STRING },
              },
            },
          },
          education: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING, description: "Generate a unique random ID" },
                institution: { type: Type.STRING },
                degree: { type: Type.STRING },
                year: { type: Type.STRING },
              },
            },
          },
          skills: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ["personalInfo", "experience", "education", "skills"],
      },
    },
  });

  const jsonText = response.text;
  if (!jsonText) throw new Error("Failed to parse resume");
  
  return JSON.parse(jsonText) as ResumeData;
};

export const improveText = async (
  currentText: string, 
  type: 'summary' | 'experience', 
  industry: Industry
): Promise<string> => {
  const ai = getAIClient();

  let instruction = "";
  if (type === 'summary') {
    instruction = `Rewrite this professional summary to be more impactful, concise, and tailored for the ${industry} industry. Use strong keywords.`;
  } else {
    instruction = `Rewrite this job description to be achievement-oriented. Use strong action verbs. Focus on results and metrics suitable for the ${industry} industry. Maintain a bullet-point style using hyphens or standard bullets.`;
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
      Original Text: "${currentText}"
      
      Instruction: ${instruction}
      
      Return only the improved text.
    `,
  });

  return response.text || currentText;
};