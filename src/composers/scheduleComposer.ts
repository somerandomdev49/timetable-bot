import { Composer, InlineKeyboard } from 'grammy';
import MSGS from '../messages';
import bot from '../new_bot';
import CustomContext from '../types/CustomContext';
import Lesson from '../types/Lesson';
import getBreakSchedule from '../utils/getBreakSchedule';
import getSchedule from '../utils/getSchedule';
import scheduleCmdHandler from '../utils/scheduleCmdHandler';
import { Break } from '../utils/utils';

const composer = new Composer<CustomContext>();

composer.command('schedule', scheduleCmdHandler);
// composer.command('schedule', async ctx => {
//     const name: string = ctx.match
//     let msg = 'send me your name'
//     let payload = {}

//     ctx.session.route = 'schedule-name-input'

//     if (name) {
//         const res: Data = await getFiles(name) // find all files that contain this name
//         ctx.session.data = res
//         console.log(res);

//         if (res.length === 1) {
//             const q: string = name + String(Object.keys(res.files)[0]).padStart(2, '0')
//             const inlineKeyboard = new InlineKeyboard()
//                 .text('Понедельник', `1${q}`).text('Вторник', `2${q}`).row()
//                 .text('Среда', `3${q}`).text('Четверг', `4${q}`).row()
//                 .text('Пятница', `5${q}`).text('Суббота', `6${q}`).row()

//             ctx.session.route = ''

//             msg = 'choice day'
//             payload = { reply_markup: inlineKeyboard }
//         } else if (res.length > 1 && res.length === Object.keys(res.files).length) {
//             ctx.session.user.name = name
//             ctx.session.route = 'schedule-class-select'

//             msg = 'select right class number' // TODO: add btns markup
//         } else {
//             msg = 'send your full name pls again'
//         }
//     }

//     let btns = await ctx.reply(msg, payload)
//     if (Object.keys(payload).length > 0) // check if user is found
//         await bot.api.pinChatMessage(btns.chat.id, btns.message_id)
// })

composer.on('callback_query', async (ctx) => {
  const query = String(ctx.callbackQuery.data);
  let msg = '';
  let schedule: Lesson[];

  try {
    schedule = await getSchedule(query);
  } catch (err: any) {
    await ctx.answerCallbackQuery(MSGS.answerError);
    return ctx.reply(err.message);
  }

  console.log(ctx.callbackQuery.data, schedule);

  while (
    schedule.map((val) => val.title).lastIndexOf('Окно') ===
    schedule.length - 1
  ) {
    schedule.pop();
  }

  const tableItem = ({ title, room }: Lesson): string =>
    title + room.padStart(26 - title.length, ' ');

  for (const item of schedule) {
    msg += `${tableItem(item)}\n`;
  }

  console.log(msg);

  if (!ctx.update.callback_query.message?.reply_markup) {
    const q: string = query.slice(1);
    const keyboard = new InlineKeyboard()
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
    const res = await ctx.editMessageText(newText, {
      parse_mode: 'MarkdownV2',
      reply_markup: { ...ctx.update.callback_query.message?.reply_markup },
    });
  } catch (e) {
    console.log(e);
  }

  await ctx.answerCallbackQuery(MSGS.answerSuccess);
  return 0 as unknown; // fix for return in arraw function
});

composer.command('breakschedule', async (ctx) => {
  // ctx.session.route = 'breakschedule'
  // await ctx.reply('send me your class')
  let msg = '';
  const match: number = +ctx.match ?? -1;
  let classNumber = 0;
  if (match >= 9 && match <= 11) {
    classNumber = match;
  } else {
    const chat = await bot.api.getChat(ctx.chat.id);
    const inlineBtn: any =
      chat.pinned_message?.reply_markup?.inline_keyboard[0][0];
    if (!inlineBtn) return ctx.reply(MSGS.error);
    const query: string = inlineBtn?.callback_data.slice(1); // FIXME: types issue
    classNumber = +query.slice(query.length - 2);
  }

  const breakSchedule: Break[] = await getBreakSchedule(classNumber);

  for (let i = 0; i < breakSchedule.length; i++) {
    const item = breakSchedule[i];
    msg += `${i + 1} ${item.start}   ${item.end}   ${item.duration} \n`;
  }

  await ctx.reply(`\`\`\`\n Начало | Конец | Перемена\n${msg}\n\`\`\``, {
    parse_mode: 'MarkdownV2',
  });
});

export default composer;
