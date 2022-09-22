import type { Sheet, WorkBook } from 'xlsx';
import xlsx from 'xlsx';
import { drive } from '../new_bot';
// import fetch from "node-fetch";
import { Break } from './utils';

export default async function getBreakSchedule(
  classNumber: number
): Promise<Break[]> {
  const classFolder = await drive.files.list({
    q: `'${process.env.FOLDER_ID}' in parents and name = '${classNumber} класс'`,
  });
  if (!classFolder?.data?.files?.[0]?.id) {
    throw new Error('error folder');
  }

  const fileId = await drive.files.list({
    q: `'${classFolder.data.files[0].id}' in parents`,
    pageSize: 1,
  });
  if (!fileId?.data?.files?.[0]?.id) {
    console.log(fileId);
    throw new Error('error file');
  }

  const res = await fetch(
    `https://drive.google.com/uc?id=${fileId.data.files[0].id}&export=download`
  );
  const arrayBuffer = await res.arrayBuffer();

  const array: Uint8Array = new Uint8Array(arrayBuffer);
  const workbook: WorkBook = xlsx.read(array, { type: 'array' });
  const sheet: Sheet = workbook.Sheets[workbook.SheetNames[1]];

  const data: Break[] = [];

  const factor = classNumber < 10 ? 0 : 12;
  for (let rowNum = 2 + factor; rowNum <= 10 + factor; rowNum++) {
    const getColumn = (c: number) =>
      sheet[xlsx.utils.encode_cell({ r: rowNum, c })]?.w?.padStart(5, '0') ??
      '';

    const item: Break = {
      start: getColumn(1),
      end: getColumn(2),
      duration: getColumn(3),
    };

    data.push(item);
  }

  return data;
}
