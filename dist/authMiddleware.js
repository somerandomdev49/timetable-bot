"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
const messages_1 = __importDefault(require("./messages"));
async function auth(ctx, next) {
    if (!ctx.from?.id)
        throw new Error('error: userId not provided');
    if (ctx.msg?.pinned_message)
        return;
    const userId = ctx.from.id;
    if (!(await (0, database_1.hasUserAccess)(userId))) {
        await ctx.reply(messages_1.default.accessDenied);
        return;
    }
    await next();
}
exports.default = auth;
