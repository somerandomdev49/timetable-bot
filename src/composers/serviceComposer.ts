import { Composer } from 'grammy';
import { addNewTester, canUseCode, hasUserAccess } from '../database';
import MSGS from '../messages';
import CustomContext from '../types/CustomContext';

const composer = new Composer<CustomContext>();

// FIXME: authed user can use this cmd too
composer.command('code', async (ctx) => {
  if (!ctx.from?.id) throw new Error('userId is missing');
  const userId = ctx.from.id;
  const code = ctx.match;

  if (await hasUserAccess(userId)) {
    if (!code) {
      return ctx.reply(`${MSGS.usersCode} ${String(userId).slice(3)}`);
    }
    return ctx.reply(MSGS.error);
  }
  if (!code) return ctx.reply(MSGS.sendCode);

  if (!(await canUseCode(code))) return ctx.reply(MSGS.wrongCode);

  const res = await addNewTester(userId, code); // 2nd param is strange
  if (!res) return ctx.reply(MSGS.error);

  await ctx.reply(MSGS.accessGranted);
});

// development only for now
composer.command('id', async (ctx) => {
  const id = String(ctx.from?.id);
  await ctx.reply(`${id} ${ctx.msg.message_id}`);
});

export default composer;
