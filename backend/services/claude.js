import dotenv from 'dotenv';
dotenv.config();

import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// import Groq from 'groq-sdk';

// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY
// });

const getChatReply = async ({
  userMessage,
  chatHistory = [],
  companyName,
  botName,
  ragContext = null
}) => {

  let systemPrompt = `You are ${botName}, a helpful customer support assistant for ${companyName}.
Your job is to help customers with their questions in a friendly, professional and concise way.
Keep responses short and to the point — maximum 3-4 sentences unless the question needs more detail.
If you don't know the answer, say so honestly and offer to connect them with a human agent.`;

  if (ragContext && ragContext.length > 0) {
    systemPrompt += `\n\nUse the following information from ${companyName}'s knowledge base to answer:\n\n`;
    ragContext.forEach((chunk, index) => {
      systemPrompt += `[Document ${index + 1}]:\n${chunk}\n\n`;
    });
    systemPrompt += `Answer based on the above information only. If the answer isn't in the documents, say you don't have that information and offer to escalate to a human.`;
  }

  const messages = [
    { role: 'system', content: systemPrompt },
    ...chatHistory.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    })),
    { role: 'user', content: userMessage }
  ];

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: messages,
    max_tokens: 1024,
    temperature: 0.7
  });

  return response.choices[0].message.content;
};

export default getChatReply;