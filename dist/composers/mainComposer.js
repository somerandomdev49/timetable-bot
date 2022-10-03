"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const messages_1 = __importDefault(require("../messages"));
const init_1 = require("../init");
const delay_1 = __importDefault(require("../utils/delay"));
const composer = new grammy_1.Composer();
composer.command('start', async (ctx) => {
    await ctx.reply(messages_1.default.greeting);
});
composer.command('help', async (ctx) => {
    await ctx.reply(messages_1.default.help);
});
composer.command('clear', async (ctx) => {
    await init_1.bot.api.unpinAllChatMessages(ctx.chat.id);
    const reportMsg = await ctx.reply(messages_1.default.unpin, {
        reply_markup: { remove_keyboard: true },
    });
    await (0, delay_1.default)(2000);
    await init_1.bot.api.deleteMessage(ctx.chat.id, reportMsg.message_id);
});
composer.command('cancel', async (ctx) => {
    ctx.session.route = '';
    await ctx.reply(messages_1.default.cancel);
});
exports.default = composer;
