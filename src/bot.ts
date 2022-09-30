import { session } from 'grammy';
import checkUser from './antispam';
import mainComposer from './composers/mainComposer';
import scheduleComposer from './composers/scheduleComposer';
import scheduleRouter from './routers/scheduleRouter';
import SessionData from './types/SessionData';
// import type { Context, SessionFlavor } from 'grammy'
// import MSGS from './messages'
// import { delay, getClassNumberBtns, getWeekdayBtns, Lesson, State } from './utils/utils'
import 'dotenv/config';
import serviceComposer from './composers/serviceComposer';
import authMiddleware from './authMiddleware';
import { bot } from './init';

// TODO: move all main logic to external file and save only bot here

function startup(): void {
  bot.use(
    session({
      initial(): SessionData {
        return {
          route: '',
          user: {
            name: '',
            class: 0,
          },
          data: null,
        };
      },
    })
  );

  bot.use(checkUser);

  bot.use(mainComposer);

  // * [MARKETING MODULE] middleware for /code PROCESSING
  bot.use(serviceComposer);

  // * [MARKETING MODULE] middleware for checking users
  bot.use(authMiddleware);

  bot.use(scheduleRouter);

  bot.use(scheduleComposer);
}

// eslint-disable-next-line import/prefer-default-export
export { startup };
