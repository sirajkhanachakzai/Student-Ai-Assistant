
import { GoogleGenAI } from "@google/genai";
import { Message } from "../types";

const SYSTEM_INSTRUCTION = `
You are "EduAssist AI", a highly intelligent and empathetic student helpdesk bot for "Global Tech University".
Your primary goal is to help students with:
1. Academic questions (math, coding, science, humanities).
2. Course administrative info (deadlines, syllabus, pre-requisites).
3. Campus life (library hours, student clubs).

Guidelines:
- If a student asks a specific course question, provide clear, step-by-step explanations.
- If they are frustrated, be empathetic.
- If you don't know administrative specific info (like their personal grades), tell them to open a "Support Ticket" using the feature in the sidebar.
- Keep responses professional yet friendly.
- Use markdown formatting for clarity.
`;

export const geminiService = {
  async generateResponse(history: Message[]) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Map internal message format to Gemini content format
    const contents = history.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
          topP: 0.8,
        },
      });

      return response.text || "I'm sorry, I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "There was an error connecting to the AI service. Please check your connection.";
    }
  }
};
