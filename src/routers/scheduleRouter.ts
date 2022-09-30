import { Router } from '@grammyjs/router';
import { InlineKeyboard } from 'grammy';
import MSGS from '../messages';
import { bot } from '../init';
import CustomContext from '../types/CustomContext';
import scheduleCmdHandler from '../utils/scheduleCmdHandler';

const router = new Router<CustomContext>((ctx) => ctx.session.route);

async function classSelectHandler(ctx: CustomContext) {
  if (!ctx.callbackQuery) return;
  if (!ctx.callbackQuery?.data) return;
  const classNumber: string = ctx.callbackQuery?.data;
  // ctx.session.user.class = classNumber

  // const { name } = ctx.session.user;

  // const res: Data = await getFiles(name);
  const q: string = ctx.session.user.name + classNumber;
  const inlineKeyboard = new InlineKeyboard()
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

  const btns = await ctx.reply(MSGS.dayPick, { reply_markup: inlineKeyboard });
  await bot.api.pinChatMessage(btns.chat.id, btns.message_id);
}

router.route('schedule-name-input', scheduleCmdHandler);

router.route('schedule-class-select', classSelectHandler);

export default router;
