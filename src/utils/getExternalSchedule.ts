import { Sheet, utils } from 'xlsx';
import Lesson from '../types/Lesson';

async function getExternalSchedule(
  sheet: Sheet,
  name: string
): Promise<Lesson[]> {
  const data: Lesson[] = [];

  // find student group
  let r = 11;
  let c = 8;
  let student: string | undefined;
  while (c <= 20) {
    // TODO: optimize algorithm for 9 classes
    while (r < 30) {
      student = sheet[utils.encode_cell({ r, c })]?.v;

      if (student?.includes(name)) break;
      r += 1;
    }
    if (student) break;

    c += 2;
    r = 12;
  }

  if (!student) throw Error('not found');

  c += 1;
  for (let row = 5; row <= 14; row += 3) {
    const title: string | undefined =
      sheet[utils.encode_cell({ r: row, c })]?.v;
    const room: string | undefined =
      sheet[utils.encode_cell({ r: row + 1, c })]?.v;
    // const teacher: string = sheet[utils.encode_cell({ r: row + 2, c })]?.v;

    if (title || room) {
      data.push({
        title: title
          ? `${title.slice(0, 17)}${title.length > 17 ? '...' : ''}`
          : 'MAI',
        group: '', // TODO: add group
        number: row - 5,
        room: String(room ?? ''),
      });
    }
  }

  return data;
}

export default getExternalSchedule;
