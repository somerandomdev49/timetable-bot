// import { InlineKeyboardButton } from ".pnpm/typegram@3.4.3/node_modules/typegram";

import { InlineKeyboardButton } from 'grammy/out/types.node';

// import { InlineKeyboardButton } from "grammy/out/platform.node"

export const weekdays: string[] = [
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
];
export const classEmoji: string[] = ['0️⃣8️⃣', '0️⃣9️⃣', '1️⃣0️⃣', '1️⃣1️⃣'];

export interface User {
  name: string | null | undefined;
  classNumber: string | null | undefined;
}

export interface Break {
  start: string;
  end: string;
  duration: string;
}

// export interface State {
//     user: {
//         name: string,
//         classNumber: string
//     }
// }

// export interface Lesson {
//     number: number,
//     name: string,
//     group: string,
//     teacher?: string,
//     room?: number // todo: add required room number
// }

export function getWeekdayBtns(
  query: string,
  classNumber: string
): InlineKeyboardButton[][] {
  const btns: InlineKeyboardButton[][] = [];

  for (let i = 0; i < 3; i++) {
    btns.push([]);
    for (let j = 0; j < 2; j++) {
      btns[i].push({
        text: weekdays[i * 2 + j],
        callback_data: `${i * 2 + j + 1}${query}${classNumber.padStart(
          2,
          '0'
        )}`,
      });
    }
  }

  return btns;
}

export function getClassNumberBtns(data: User[]): InlineKeyboardButton[][] {
  const btns: InlineKeyboardButton[][] = [];

  for (let i = 0; i < data.length / 2; i++) {
    btns.push([]);
    for (let j = 0; j < data.length - i - 1; j++) {
      const usr = data[i * 2 + j];
      if (usr.classNumber) {
        // FIXME: THIS CRUTCH

        const cls = usr.classNumber;
        btns[i].push({
          text: classEmoji[+cls - 8],
          callback_data: `${cls.padStart(2, '0')}${usr.name}`,
        });
      }
    }
  }

  return btns;
}
