"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MSGS = {
    greeting: `прив)
* введи код доступа через /code
* код доступа есть у тех, кто уже участвует
* для расписания пиши /schedule
* /breakschedule покажет твои звонки (только после предыдущей команды)
* /code код для друзей
* /help направит в наш дискорд`,
    error: 'что-то ты делаешь не так',
    help: `получить помощь можно в дс
https://discord.gg/2Y2nZG6VU2`,
    cancel: 'действие отменено',
    unpin: 'все сообщения откреплены',
    dayPick: 'выбери день',
    nameInput: 'отправь мне свою фамилию',
    classSelect: 'выбери свой класс',
    fullnameInput: 'отправь мне своё полное ФИ',
    sendCode: 'отправь мне код вот так -> /code (код, который вам дали)',
    wrongCode: 'неверный код',
    usersCode: 'ты можешь привести 3-х друзей по своему коду:',
    accessGranted: 'доступ разрешён',
    accessDenied: 'доступ запрещён',
    answerSuccess: 'ок',
    answerError: 'ошибка',
};
exports.default = MSGS;
