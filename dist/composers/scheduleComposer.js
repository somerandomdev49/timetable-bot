"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const messages_1 = __importDefault(require("../messages"));
const init_1 = require("../init");
const getBreakSchedule_1 = __importDefault(require("../utils/getBreakSchedule"));
const getSchedule_1 = __importDefault(require("../utils/getSchedule"));
const scheduleCmdHandler_1 = __importDefault(require("../utils/scheduleCmdHandler"));
const composer = new grammy_1.Composer();
composer.command('schedule', scheduleCmdHandler_1.default);
composer.on('callback_query', async (ctx) => {
    const query = String(ctx.callbackQuery.data);
    let msg = '';
    let schedule;
    try {
        schedule = await (0, getSchedule_1.default)(query);
    }
    catch (err) {
        await ctx.answerCallbackQuery(messages_1.default.answerError);
        return ctx.reply(err.message);
    }
    console.log(ctx.callbackQuery.data, schedule);
    while (schedule.map((val) => val.title).lastIndexOf('Окно') ===
        schedule.length - 1) {
        schedule.pop();
    }
    const tableItem = ({ title, room }) => title + room.padStart(26 - title.length, ' ');
    for (const item of schedule) {
        msg += `${tableItem(item)}\n`;
    }
    console.log(msg);
    if (!ctx.update.callback_query.message?.reply_markup) {
        const q = query.slice(1);
        const keyboard = new grammy_1.InlineKeyboard()
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
        return ctx.reply(`\`\`\`\n${msg}\n\`\`\``, {
            parse_mode: 'MarkdownV2',
            reply_markup: keyboard,
        });
    }
    const newText = `\`\`\`\n${msg}\n\`\`\``;
    try {
        await ctx.editMessageText(newText, {
            parse_mode: 'MarkdownV2',
            reply_markup: { ...ctx.update.callback_query.message?.reply_markup },
        });
    }
    catch (e) {
        console.log(e);
    }
    await ctx.answerCallbackQuery(messages_1.default.answerSuccess);
    return 0;
});
composer.command('breakschedule', async (ctx) => {
    let msg = '';
    const match = +ctx.match ?? -1;
    let classNumber = 0;
    if (match >= 9 && match <= 11) {
        classNumber = match;
    }
    else {
        const chat = await init_1.bot.api.getChat(ctx.chat.id);
        const inlineBtn = chat.pinned_message?.reply_markup?.inline_keyboard[0][0];
        if (!inlineBtn) {
            ctx.reply(messages_1.default.error);
            return;
        }
        const query = inlineBtn?.callback_data.slice(1);
        classNumber = +query.slice(query.length - 2);
    }
    const breakSchedule = await (0, getBreakSchedule_1.default)(classNumber);
    for (let i = 0; i < breakSchedule.length; i++) {
        const item = breakSchedule[i];
        msg += `${i + 1} ${item.start}   ${item.end}   ${item.duration} \n`;
    }
    await ctx.reply(`\`\`\`\n Начало | Конец | Перемена\n${msg}\n\`\`\``, {
        parse_mode: 'MarkdownV2',
    });
});
exports.default = composer;
