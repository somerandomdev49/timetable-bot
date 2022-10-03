"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSheet = void 0;
const xlsx_1 = __importDefault(require("xlsx"));
const init_1 = require("../init");
const getExternalSchedule_1 = __importDefault(require("./getExternalSchedule"));
require("dotenv/config");
const { FOLDER_ID } = process.env;
const MAI_FILE_ID = process.env.MAI_FILE_ID ?? '';
async function getSheet(fildeId, pageNum = 0) {
    const res = await fetch(`https://docs.google.com/spreadsheets/d/${fildeId}/export`);
    const arrayBuffer = await res.arrayBuffer();
    const array = new Uint8Array(arrayBuffer);
    const workbook = xlsx_1.default.read(array, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[pageNum]];
    return sheet;
}
exports.getSheet = getSheet;
function tableParse(sheet, rawDay) {
    const data = [];
    let day = rawDay;
    if (day === 7)
        day = 1;
    for (let rowNum = 2 + 12 * (day - 1); rowNum <= 10 + 12 * (day - 1); rowNum++) {
        const title = sheet[xlsx_1.default.utils.encode_cell({ r: rowNum, c: 1 })]?.v;
        const group = sheet[xlsx_1.default.utils.encode_cell({ r: rowNum, c: 2 })]?.v;
        const room = sheet[xlsx_1.default.utils.encode_cell({ r: rowNum, c: 4 })]?.v;
        if (title === 'Московский авиационный институт')
            return null;
        data.push({
            title: title || 'Окно',
            group: group ?? '',
            number: rowNum - 1,
            room: String(room ?? ''),
        });
    }
    return data;
}
async function getSchedule(query) {
    const name = query.slice(1, -2);
    const cls = +query.slice(-2);
    const day = +query.slice(0, 1);
    console.log(name, cls, day);
    const classFolder = await init_1.drive.files.list({
        q: `'${FOLDER_ID}' in parents and name = '${cls} класс'`,
    });
    if (!classFolder?.data?.files?.[0]?.id) {
        throw new Error('error folder');
    }
    const filesList = await init_1.drive.files.list({
        q: `'${classFolder.data.files[0].id}' in parents and name contains '${name}'`,
    });
    if (!filesList?.data?.files?.[0]?.id) {
        throw new Error('error file');
    }
    const fileId = filesList.data.files[0].id;
    const sheet = await getSheet(fileId);
    let data = tableParse(sheet, day || new Date().getDay() + 1);
    if (data === null) {
        let pageNum;
        switch (cls) {
            case 8:
                pageNum = 3;
                break;
            case 9:
                pageNum = 1;
                break;
            case 10:
                pageNum = 0;
                break;
            case 11:
                pageNum = 2;
                break;
            default:
                throw new Error('unknown class value with nullish data');
        }
        const externalSheet = await getSheet(MAI_FILE_ID, pageNum);
        data = await (0, getExternalSchedule_1.default)(externalSheet, name);
    }
    return data;
}
exports.default = getSchedule;
