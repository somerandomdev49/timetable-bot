import { Composer } from 'grammy';
import MSGS from '../messages';
import bot from '../new_bot';
import CustomContext from '../types/CustomContext';
import delay from '../utils/delay';

const composer = new Composer<CustomContext>();

composer.command('start', async (ctx) => {
  await ctx.reply(MSGS.greeting);
});

composer.command('help', async (ctx) => {
  await ctx.reply(MSGS.help);
});

composer.command('clear', async (ctx) => {
  await bot.api.unpinAllChatMessages(ctx.chat.id);

  const reportMsg = await ctx.reply(MSGS.unpin, {
    reply_markup: { remove_keyboard: true },
  });

  await delay(2000);

  await bot.api.deleteMessage(ctx.chat.id, reportMsg.message_id);
});

composer.command('cancel', async (ctx) => {
  ctx.session.route = '';
  await ctx.reply(MSGS.cancel);
});

export default composer;
