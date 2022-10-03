"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const xlsx_1 = __importDefault(require("xlsx"));
const init_1 = require("../init");
async function getBreakSchedule(classNumber) {
    const classFolder = await init_1.drive.files.list({
        q: `'${process.env.FOLDER_ID}' in parents and name = '${classNumber} класс'`,
    });
    if (!classFolder?.data?.files?.[0]?.id) {
        throw new Error('error folder');
    }
    const fileId = await init_1.drive.files.list({
        q: `'${classFolder.data.files[0].id}' in parents`,
        pageSize: 1,
    });
    if (!fileId?.data?.files?.[0]?.id) {
        console.log(fileId);
        throw new Error('error file');
    }
    const res = await fetch(`https://drive.google.com/uc?id=${fileId.data.files[0].id}&export=download`);
    const arrayBuffer = await res.arrayBuffer();
    const array = new Uint8Array(arrayBuffer);
    const workbook = xlsx_1.default.read(array, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[1]];
    const data = [];
    const factor = classNumber < 10 ? 0 : 12;
    for (let rowNum = 2 + factor; rowNum <= 10 + factor; rowNum++) {
        const getColumn = (c) => sheet[xlsx_1.default.utils.encode_cell({ r: rowNum, c })]?.w?.padStart(5, '0') ??
            '';
        const item = {
            start: getColumn(1),
            end: getColumn(2),
            duration: getColumn(3),
        };
        data.push(item);
    }
    return data;
}
exports.default = getBreakSchedule;
