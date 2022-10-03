"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClassNumberBtns = exports.getWeekdayBtns = exports.classEmoji = exports.weekdays = void 0;
exports.weekdays = [
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
];
exports.classEmoji = ['0️⃣8️⃣', '0️⃣9️⃣', '1️⃣0️⃣', '1️⃣1️⃣'];
function getWeekdayBtns(query, classNumber) {
    const btns = [];
    for (let i = 0; i < 3; i++) {
        btns.push([]);
        for (let j = 0; j < 2; j++) {
            btns[i].push({
                text: exports.weekdays[i * 2 + j],
                callback_data: `${i * 2 + j + 1}${query}${classNumber.padStart(2, '0')}`,
            });
        }
    }
    return btns;
}
exports.getWeekdayBtns = getWeekdayBtns;
function getClassNumberBtns(data) {
    const btns = [];
    for (let i = 0; i < data.length / 2; i++) {
        btns.push([]);
        for (let j = 0; j < data.length - i - 1; j++) {
            const usr = data[i * 2 + j];
            if (usr.classNumber) {
                const cls = usr.classNumber;
                btns[i].push({
                    text: exports.classEmoji[+cls - 8],
                    callback_data: `${cls.padStart(2, '0')}${usr.name}`,
                });
            }
        }
    }
    return btns;
}
exports.getClassNumberBtns = getClassNumberBtns;
