"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const messages_1 = __importDefault(require("../messages"));
const init_1 = require("../init");
const getFiles_1 = __importDefault(require("./getFiles"));
const utils_1 = require("./utils");
async function handler(ctx) {
    let msg = messages_1.default.nameInput;
    let payload = {};
    ctx.session.route = 'schedule-name-input';
    if (ctx.match || (ctx.msg?.text && ctx.msg?.text !== '/schedule')) {
        const name = ctx.match ? String(ctx.match) : String(ctx.msg?.text);
        const res = await (0, getFiles_1.default)(name);
        ctx.session.data = res;
        console.log(res, `'${name}'`);
        if (res.length === 1) {
            const q = name + String(Object.keys(res.files)[0]).padStart(2, '0');
            const inlineKeyboard = new grammy_1.InlineKeyboard()
                .text('Понедельник', `1${q}`)
                .text('Вторник', `2${q}`)
                .row()
                .text('Среда', `3${q}`)
                .text('Четверг', `4${q}`)
                .row()
                .text('Пятница', `5${q}`)
                .text('Суббота', `6${q}`)
                .row()
                .text('Завтра', `0${q}`);
            ctx.session.route = '';
            msg = messages_1.default.dayPick;
            payload = { reply_markup: inlineKeyboard };
        }
        else if (res.length > 1 && res.length === Object.keys(res.files).length) {
            const classes = Object.entries(res.files);
            const keyboard = new grammy_1.InlineKeyboard();
            for (let i = 0; i < res.length; i++) {
                if (i > 0 && i % 2 === 0)
                    keyboard.row();
                const cls = classes[i][0];
                keyboard.text(utils_1.classEmoji[+cls - 8], `${cls.padStart(2, '0')}`);
            }
            ctx.session.user.name = name;
            ctx.session.route = 'schedule-class-select';
            msg = messages_1.default.classSelect;
            payload = { reply_markup: keyboard };
        }
        else {
            msg = messages_1.default.fullnameInput;
        }
    }
    console.log(payload);
    const btns = await ctx.reply(msg, payload);
    if (Object.keys(payload).length > 0 &&
        ctx.session.route !== 'schedule-class-select')
        await init_1.bot.api.pinChatMessage(btns.chat.id, btns.message_id);
}
exports.default = handler;
