import { NextFunction } from 'grammy';
import MSGS from './messages';
import CustomContext from './types/CustomContext';

let lastResetTime: number = new Date().getTime();

interface IDStat {
  [id: number]: number;
}

let accessLog: IDStat = {};
const banList: IDStat = {};

function updateAccessLog(id: number) {
  if (!accessLog[id]) {
    accessLog[id] = 1;
  } else {
    accessLog[id] += 1;
  }
}

export default function checkUser(
  ctx: CustomContext,
  next: NextFunction
): void {
  if (!ctx.from?.id) return ctx.reply(MSGS.error) as unknown as void;

  const { id } = ctx.from;
  const time = new Date().getTime();

  updateAccessLog(id);

  if (banList[id] < time) {
    delete banList[id];
  } else if (banList[id]) {
    ctx.reply('бан');
  } else if (accessLog[id] > 10) {
    banList[id] = time + 60000;
  }

  if (lastResetTime < time) {
    accessLog = {};
    lastResetTime = time + 10000;
  }

  if (!banList[id]) next();
  return 0 as unknown as void; // FIXME: what the hell is this ???
}
