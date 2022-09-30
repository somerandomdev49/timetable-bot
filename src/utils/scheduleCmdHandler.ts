import { InlineKeyboard } from 'grammy';
import MSGS from '../messages';
import { bot } from '..';
import CustomContext from '../types/CustomContext';
import Data from '../types/FilesData';
import getFiles from './getFiles';
import { classEmoji } from './utils';

// const classes = [
//   [0, 1],
//   [0, 1, 2],
//   [0, 1, 2],
//   [0, 1, 2],
// ];

export default async function handler(ctx: CustomContext): Promise<void> {
  let msg = MSGS.nameInput;
  let payload = {};

  ctx.session.route = 'schedule-name-input';

  if (ctx.match || (ctx.msg?.text && ctx.msg?.text !== '/schedule')) {
    const name = ctx.match ? String(ctx.match) : String(ctx.msg?.text); // FIXME: why it says that `ctx.msg.text` can be undefined ???

    const res: Data = await getFiles(name); // find all files that contain this name
    ctx.session.data = res;
    console.log(res, `'${name}'`);

    if (res.length === 1) {
      const q: string =
        name + String(Object.keys(res.files)[0]).padStart(2, '0');
      const inlineKeyboard = new InlineKeyboard()
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

      msg = MSGS.dayPick;
      payload = { reply_markup: inlineKeyboard };
    } else if (res.length > 1 && res.length === Object.keys(res.files).length) {
      // TEST: 'Ксения'

      const classes = Object.entries(res.files);
      const keyboard = new InlineKeyboard();

      for (let i = 0; i < res.length; i++) {
        if (i > 0 && i % 2 === 0) keyboard.row();
        const cls = classes[i][0];
        // const id = classes[i][1];
        keyboard.text(classEmoji[+cls - 8], `${cls.padStart(2, '0')}`);
      }

      ctx.session.user.name = name;
      ctx.session.route = 'schedule-class-select';

      msg = MSGS.classSelect;
      payload = { reply_markup: keyboard };
    } else {
      msg = MSGS.fullnameInput;
    }
  }

  console.log(payload);

  const btns = await ctx.reply(msg, payload);
  if (
    Object.keys(payload).length > 0 &&
    ctx.session.route !== 'schedule-class-select'
  )
    // check if user is found
    await bot.api.pinChatMessage(btns.chat.id, btns.message_id);
}
