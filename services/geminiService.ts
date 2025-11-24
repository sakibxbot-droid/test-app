
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Using a mock response. Please set the API_KEY environment variable.");
}

const getAi = () => {
  if (!API_KEY) return null;
  return new GoogleGenAI({ apiKey: API_KEY });
};


export const generateTournamentDetails = async (gameName: string): Promise<{title: string, description: string}> => {
  const ai = getAi();
  if (!ai) {
    return {
      title: `Epic ${gameName} Showdown`,
      description: `Get ready for an exciting tournament for ${gameName}. Compete with the best and claim victory!`
    };
  }

  try {
    const prompt = `Generate a cool, short, and exciting tournament title and a one-sentence description for a "${gameName}" competition. Format the output as a JSON object with keys "title" and "description". For example: {"title": "Valorant Vanguard Series", "description": "Clash in a high-stakes 5v5 battle for glory and prizes."}`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (text) {
        const details = JSON.parse(text);
        return {
            title: details.title || `Awesome ${gameName} Event`,
            description: details.description || `Join the ultimate ${gameName} challenge.`
        };
    }
    throw new Error("Empty response from API");
  } catch (error) {
    console.error("Error generating tournament details:", error);
    return {
      title: `Epic ${gameName} Showdown`,
      description: `Get ready for an exciting tournament for ${gameName}. Compete with the best and claim victory!`
    };
  }
};
