import { hybridRAG } from "../services/ragService.js";
import { askAI } from "../services/aiService.js";
import User from "../models/userModel.js";

export async function runAdmin({ question, userId }) {
  let userContext = "";

  if (userId) {
    try {
      const user = await User.findById(userId);
      if (user?.role === "admin") {
        userContext = `\nالمسؤول: ${user?.firstName || "Admin"}`;
      }
    } catch (e) {
      console.log("Error fetching user data:", e.message);
    }
  }

  const { products, context } = await hybridRAG({});

  const systemPrompt = `You are an AI assistant for e-commerce admins.
You speak both English and Arabic fluently. Respond in the same language the user uses.

${userContext}

${context}

Analyze sales, inventory, pricing, and customer behavior, and give business insights.`;

  const answer = await askAI({ 
    systemPrompt, 
    userPrompt: question 
  });

  return { 
    answer, 
    productsUsed: products.length
  };
}
