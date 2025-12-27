
import { GoogleGenAI, Type } from "@google/genai";
import { CrowdLevel, CrowdPrediction, LiveBus, BusStop } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const predictCrowdWithGemini = async (
  routeNumber: string,
  timeOfDay: string,
  isWeekend: boolean,
  historicalTrend: string
): Promise<CrowdPrediction> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Predict crowd level for Chennai MTC Bus ${routeNumber} at ${timeOfDay} on ${isWeekend ? 'Weekend' : 'Weekday'}. Historical trend: ${historicalTrend}.`,
      config: {
        systemInstruction: "You are a transit expert for Chennai. Output a JSON prediction for bus crowding. Categories: LOW, MEDIUM, HIGH.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            percentage: { type: Type.NUMBER },
            category: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            reasoning: { type: Type.STRING }
          },
          required: ["percentage", "category", "confidence", "reasoning"]
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return {
      percentage: data.percentage || 50,
      category: (data.category as CrowdLevel) || CrowdLevel.MEDIUM,
      confidence: data.confidence || 0.8,
      reasoning: data.reasoning || "Based on typical traffic patterns in Chennai."
    };
  } catch (error) {
    console.error("Gemini Prediction Error:", error);
    return {
      percentage: 50,
      category: CrowdLevel.MEDIUM,
      confidence: 0.5,
      reasoning: "Failed to connect to AI engine."
    };
  }
};

/**
 * Uses Google Maps Grounding to get official location data and links for the bus's current position.
 */
export const getBusLocationInsight = async (bus: LiveBus, nextStop: BusStop) => {
  try {
    const model = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const response = await model.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Identify the specific area and nearby landmarks for Chennai MTC Bus ${bus.routeNumber} located at coordinates ${bus.currentLocation.lat}, ${bus.currentLocation.lng} while it travels towards ${nextStop.name}.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: bus.currentLocation.lat,
              longitude: bus.currentLocation.lng
            }
          }
        }
      },
    });

    // Extracting grounding chunks for official Google Maps links as per guidelines
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const links = groundingChunks
      .map((chunk: any) => {
        if (chunk.maps) {
          return {
            title: chunk.maps.title || "View Location",
            uri: chunk.maps.uri
          };
        }
        return null;
      })
      .filter((l: any) => l !== null);

    return {
      text: response.text || `Bus ${bus.routeNumber} is currently active near ${nextStop.name}.`,
      links
    };
  } catch (error) {
    console.error("Maps Grounding Error:", error);
    return {
      text: `Tracking Bus ${bus.routeNumber} near ${nextStop.name}.`,
      links: [{ title: "Open in Google Maps", uri: `https://www.google.com/maps?q=${bus.currentLocation.lat},${bus.currentLocation.lng}` }]
    };
  }
};

export const chatWithAssistant = async (query: string, context: any) => {
  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: `You are BusPal AI, a friendly assistant for Chennai commuters. 
        You have access to current bus data: ${JSON.stringify(context)}. 
        Answer user questions about which bus to take, current crowds, and route details. 
        Keep it concise and helpful.`
      }
    });
    const result = await chat.sendMessage({ message: query });
    return result.text;
  } catch (error) {
    return "I'm having trouble connecting right now. Please try again later!";
  }
};