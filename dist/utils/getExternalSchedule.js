"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xlsx_1 = require("xlsx");
async function getExternalSchedule(sheet, name) {
    const data = [];
    let r = 11;
    let c = 8;
    let student;
    while (c <= 20) {
        while (r < 30) {
            student = sheet[xlsx_1.utils.encode_cell({ r, c })]?.v;
            if (student?.includes(name))
                break;
            r += 1;
        }
        if (student)
            break;
        c += 2;
        r = 12;
    }
    if (!student)
        throw Error('not found');
    c += 1;
    for (let row = 5; row <= 14; row += 3) {
        const title = sheet[xlsx_1.utils.encode_cell({ r: row, c })]?.v;
        const room = sheet[xlsx_1.utils.encode_cell({ r: row + 1, c })]?.v;
        if (title || room) {
            data.push({
                title: title
                    ? `${title.slice(0, 17)}${title.length > 17 ? '...' : ''}`
                    : 'MAI',
                group: '',
                number: row - 5,
                room: String(room ?? ''),
            });
        }
    }
    return data;
}
exports.default = getExternalSchedule;
