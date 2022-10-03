"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const database_1 = require("../database");
const messages_1 = __importDefault(require("../messages"));
const composer = new grammy_1.Composer();
composer.command('code', async (ctx) => {
    if (!ctx.from?.id)
        throw new Error('userId is missing');
    const userId = ctx.from.id;
    const code = ctx.match;
    if (await (0, database_1.hasUserAccess)(userId)) {
        if (!code) {
            return ctx.reply(`${messages_1.default.usersCode} ${String(userId).slice(3, 9)}`);
        }
        return ctx.reply(messages_1.default.error);
    }
    if (!code)
        return ctx.reply(messages_1.default.sendCode);
    if (!(await (0, database_1.canUseCode)(code)))
        return ctx.reply(messages_1.default.wrongCode);
    const res = await (0, database_1.addNewTester)(userId, code);
    if (!res)
        return ctx.reply(messages_1.default.error);
    await ctx.reply(messages_1.default.accessGranted);
});
composer.command('id', async (ctx) => {
    const id = String(ctx.from?.id);
    await ctx.reply(`${id} ${ctx.msg.message_id}`);
});
exports.default = composer;
