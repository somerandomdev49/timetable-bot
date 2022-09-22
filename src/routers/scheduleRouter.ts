import { Router } from '@grammyjs/router';
import { InlineKeyboard } from 'grammy';
import MSGS from '../messages';
import bot from '../new_bot';
import CustomContext from '../types/CustomContext';
import Data from '../types/FilesData';
import getFiles from '../utils/getFiles';
import scheduleCmdHandler from '../utils/scheduleCmdHandler';

const router = new Router<CustomContext>((ctx) => ctx.session.route);

async function classSelectHandler(ctx: CustomContext) {
  if (!ctx.callbackQuery) return;
  if (!ctx.callbackQuery?.data) return;
  const classNumber: string = ctx.callbackQuery?.data;
  // ctx.session.user.class = classNumber

  const { name } = ctx.session.user;

  const res: Data = await getFiles(name);
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

// // **** TEMP FUNC
// async function classSelectHandler(ctx: CustomContext) {
//   if (!ctx.callbackQuery) return;
//   if (!ctx.callbackQuery?.data) return;
//   const q: string = ctx.callbackQuery?.data;

//   const inlineKeyboard = new InlineKeyboard()
//     .text('Понедельник', `1${q}`)
//     .text('Вторник', `2${q}`)
//     .row()
//     .text('Среда', `3${q}`)
//     .text('Четверг', `4${q}`)
//     .row()
//     .text('Пятница', `5${q}`)
//     .text('Суббота', `6${q}`)
//     .row();

//   ctx.session.route = '';

//   await ctx.reply('выбери день', { reply_markup: inlineKeyboard });
// }

router.route('schedule-name-input', scheduleCmdHandler);
// router.route('schedule-name-input', async ctx => {
// const name = String(ctx.msg?.text)
// let msg: string = 'send me your name' // todo: make convenient typing
// let payload = {}

// if (name) {
//     const res: Data = await getFiles(name) // find all files that contain this name
//     ctx.session.data = res
//     console.log(res);

//     if (res.length === 1) {
//         const q: string = name + String(Object.keys(res.files)[0]).padStart(2, '0')
//         const inlineKeyboard = new InlineKeyboard()
//             .text('Понедельник', `1${q}`).text('Вторник', `2${q}`).row()
//             .text('Среда', `3${q}`).text('Четверг', `4${q}`).row()
//             .text('Пятница', `5${q}`).text('Суббота', `6${q}`).row()

//         ctx.session.route = ''

//         msg = 'choice day'
//         payload = { reply_markup: inlineKeyboard }
//     } else if (res.length > 1 && res.length === Object.keys(res.files).length) {
//         ctx.session.user.name = name
//         ctx.session.route = 'schedule-class-select'

//         msg = 'select right class number' // TODO: add btns markup
//     } else {
//         msg = 'send your full name pls again'
//     }
// }

// await ctx.reply(msg, payload)

//     await  scheduleCmdHandler(ctx)
// })

router.route('schedule-class-select', classSelectHandler);

export default router;
