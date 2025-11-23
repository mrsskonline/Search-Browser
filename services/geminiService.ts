import { GoogleGenAI } from "@google/genai";
import { SearchResult } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables.");
  }
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

export const performSmartSearch = async (query: string): Promise<SearchResult> => {
  const ai = getClient();
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `User Query: ${query}\n\nProvide a direct, comprehensive, and futuristic answer to the query. If the query implies a question, answer it. If it's a topic, summarize it. Format the text with markdown for readability.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No direct answer found.";
    
    // Extract grounding chunks for sources
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = chunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        uri: chunk.web.uri,
        title: chunk.web.title || new URL(chunk.web.uri).hostname,
      }));

    // Generate related topics simply by inferring from the answer (simulation for speed) or asking via a separate quick call if needed. 
    // To keep it fast, we will extract key terms or just use static extraction logic, 
    // but for quality, let's ask Gemini to suggest topics in a follow-up or assume the frontend handles dynamic topics.
    // For this implementation, we will mock the "related topics" to update based on the query to save tokens/latency,
    // or parse them if Gemini includes them naturally.
    
    const relatedTopics = [
      `Future of ${query}`,
      `${query} images`,
      `${query} news`,
      `Advanced ${query}`
    ];

    return {
      answer: text,
      sources: sources,
      relatedTopics: relatedTopics,
    };
  } catch (error) {
    console.error("Search failed:", error);
    return {
      answer: "Communication with the neural network interrupted. Please try again.",
      sources: [],
      relatedTopics: [],
    };
  }
};

export const generateFuturisticImage = async (prompt: string): Promise<string | null> => {
  const ai = getClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Generate a high-quality, futuristic, cinematic image representing: ${prompt}. Aspect ratio 16:9.`,
          },
        ],
      },
      config: {
        // Nano banana models do not support advanced image config like aspect ratio in the config object usually, 
        // but 2.5 flash image is capable. However, sticking to default config for safety.
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation failed:", error);
    return null;
  }
};
