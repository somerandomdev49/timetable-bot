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
    student = sheet[utils.encode_cell({ r, c })]?.v;

    if (student?.includes(name)) break;
    r += 1;

    if (!student) {
      c += 2;
      r = 12;
    }
  }

  c += 1;
  for (let row = 5; row < 11; row += 3) {
    const title: string = sheet[utils.encode_cell({ r: row, c })]?.v;
    const room: string = sheet[utils.encode_cell({ r: row + 1, c })]?.v;
    const teacher: string = sheet[utils.encode_cell({ r: row + 2, c })]?.v;

    data.push({
      title: (title.length > 17 ? `${title.slice(0, 17)}...` : title) || 'MAI',
      group: '', // TODO: add group
      number: row - 5,
      room: String(room ?? ''),
    });
  }

  return data;
}

export default getExternalSchedule;
