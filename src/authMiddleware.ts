import { Context, NextFunction } from 'grammy';
import { hasUserAccess } from './database';
import MSGS from './messages';

export default async function auth(
  ctx: Context,
  next: NextFunction
): Promise<void> {
  if (!ctx.from?.id) throw new Error('error: userId not provided');
  if (ctx.msg?.pinned_message) return;
  const userId = ctx.from.id;

  if (!(await hasUserAccess(userId))) {
    await ctx.reply(MSGS.accessDenied);
    return;
  }

  await next();
}
