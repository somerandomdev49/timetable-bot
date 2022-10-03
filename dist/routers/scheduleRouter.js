"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("@grammyjs/router");
const grammy_1 = require("grammy");
const messages_1 = __importDefault(require("../messages"));
const init_1 = require("../init");
const scheduleCmdHandler_1 = __importDefault(require("../utils/scheduleCmdHandler"));
const router = new router_1.Router((ctx) => ctx.session.route);
async function classSelectHandler(ctx) {
    if (!ctx.callbackQuery)
        return;
    if (!ctx.callbackQuery?.data)
        return;
    const classNumber = ctx.callbackQuery?.data;
    const q = ctx.session.user.name + classNumber;
    const inlineKeyboard = new grammy_1.InlineKeyboard()
        .text('Понедельник', `1${q}`)
        .text('Вторник', `2${q}`)
        .row()
        .text('Среда', `3${q}`)
        .text('Четверг', `4${q}`)
        .row()
        .text('Пятница', `5${q}`)
        .text('Суббота', `6${q}`)
        .row();
    ctx.session.route = '';
    const btns = await ctx.reply(messages_1.default.dayPick, { reply_markup: inlineKeyboard });
    await init_1.bot.api.pinChatMessage(btns.chat.id, btns.message_id);
}
router.route('schedule-name-input', scheduleCmdHandler_1.default);
router.route('schedule-class-select', classSelectHandler);
exports.default = router;
