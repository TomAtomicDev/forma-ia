const { Telegraf } = require('telegraf');
require('dotenv').config();
const { groqService } = require('./services/groq');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Auth Middleware
const authMiddleware = (ctx, next) => {
    const authorizedIds = (process.env.AUTHORIZED_USERS || '').split(',').map(id => id.trim());
    const userId = ctx.from.id.toString();

    if (authorizedIds.includes(userId)) {
        return next();
    }
    
    console.log(`Acceso denegado para el usuario: ${userId}`);
    return ctx.reply('Lo siento, no tienes permiso para usar este bot.');
};

bot.start((ctx) => {
    const userId = ctx.from.id;
    ctx.reply(`¡Hola! Tu ID es: ${userId}\nAsegúrate de que esté en la lista blanca para continuar.`);
});

bot.on('text', authMiddleware, async (ctx) => {
    const userInput = ctx.message.text;
    
    await ctx.sendChatAction('typing');

    try {
        const response = await groqService.chat([
            { role: 'user', content: userInput }
        ]);
        
        await ctx.reply(response);
    } catch (error) {
        console.error('Error procesando mensaje:', error);
        await ctx.reply('Lo siento, hubo un error al procesar tu mensaje. Inténtalo de nuevo más tarde.');
    }
});

bot.launch();

console.log('Bot is running...');

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));