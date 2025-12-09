import { v4 as uuidv4 } from 'uuid';

export const chatResolvers = {
    Mutation: {
        sendMessage: async (_: any, { text }: { text: string }) => {
            // Simulate AI delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Simple mock AI logic
            let responseText = "I'm sorry, I didn't understand that.";
            const lowerText = text.toLowerCase();

            if (lowerText.includes('hello') || lowerText.includes('hi')) {
                responseText = "Hello! How can I help you with your order today?";
            } else if (lowerText.includes('status') || lowerText.includes('order')) {
                responseText = "You can check your order status in the Orders tab. Is there anything else?";
            } else if (lowerText.includes('menu') || lowerText.includes('food')) {
                responseText = "We have a great selection of restaurants! Browse them on the homepage.";
            } else if (lowerText.includes('help')) {
                responseText = "I'm here to assist! You can ask about orders, menus, or account settings.";
            } else {
                responseText = `I processed: "${text}". How else can I assist?`;
            }

            return {
                id: uuidv4(),
                sender: 'AI Assistant',
                text: responseText,
                timestamp: new Date().toISOString(),
                isBot: true
            };
        }
    }
};
