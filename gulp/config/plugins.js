//? Поиск и замена
import replace from 'gulp-replace' 
//? Обработка ошибок
import plumber from 'gulp-plumber' 
//? Сообщения (подсказки)
import notify from 'gulp-notify' 
//? Локальный сервер
import browsersync from 'browser-sync'
//? Проверка обновления 
import newer from 'gulp-newer'
//? Условное ветвление
import ifPlugin from 'gulp-if'

export const plugins = {
    replace: replace,
    plumber: plumber,
    notify: notify,
    browsersync: browsersync,
    newer: newer,
    if: ifPlugin
}
