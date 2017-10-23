'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = false;

/**
 * Запрос к коллекции
 * @param {Array} collection
 * @param {Object} actions – Функции для запроса
 * @returns {Array}
 */
exports.query = function (collection, ...actions) {
    let newCollection = [...collection];
    let formattingActions = actions.filter(action => action.isFormat);
    let limitingActions = actions.filter(action => action.isLimit);
    actions = actions.filter(action => !action.isFormat && ! action.isLimit);
    for (let action of actions) {
        newCollection = action(newCollection);
    }
    for (let formattingAction of formattingActions) {
        newCollection = formattingAction(newCollection);
    }
    for (let limitingAction of limitingActions) {
        newCollection = limitingAction(newCollection);
    }

    return newCollection;
};

/**
 * Выбор полей
 * @params {...String} fields
 * @returns {Function}
 */
exports.select = function (...fields) {

    /**
     * Скрывает ненужные поля у одного человека
     * @param {Object} person
     * @returns {Object} newData
     */
    let selection = function (person) {
        let newData = Object.assign({}, person);
        Object.keys(newData).forEach(prop => Object.defineProperty(newData, prop, {
            enumerable: false
        }));
        for (let field of fields) {
            if (person.hasOwnProperty(field)) {
                Object.defineProperty(newData, field, {
                    enumerable: true
                });
            }
        }

        return newData;
    };

    return function (collection) {
        return collection.map(selection);
    };
};

/**
 * Фильтрация поля по массиву значений
 * @param {String} property – Свойство для фильтрации
 * @param {Array} values – Доступные значения
 * @returns {Function}
 */
exports.filterIn = function (property, values) {
    let fil = function (collection) {
        return collection.filter(person => {
            return values.indexOf(person[property]) !== -1;
        });
    };
    fil.isFilter = true;

    return fil;
};

/**
 * Сортировка коллекции по полю
 * @param {String} property – Свойство для фильтрации
 * @param {String} order – Порядок сортировки (asc - по возрастанию; desc – по убыванию)
 * @returns {Function}
 */
exports.sortBy = function (property, order) {
    let ord = -1;
    if (order === 'desc') {
        ord = 1;
    }
    let sorting = function (collection) {
        return collection.sort((firstPerson, secondPerson) => {
            if (firstPerson[property] < secondPerson[property]) {
                return ord;
            }
            if (firstPerson[property] > secondPerson[property]) {
                return -ord;
            }

            return 0;
        });
    };
    sorting.isSort = true;

    return sorting;
};

/**
 * Форматирование поля
 * @param {String} property – Свойство для фильтрации
 * @param {Function} formatter – Функция для форматирования
 * @returns {Function}
 */
exports.format = function (property, formatter) {
    let formatPerson = function (person) {
        let newPerson = Object.assign({}, person);
        newPerson[property] = formatter(person[property]);

        return newPerson;
    };
    let formatAll = function (collection) {
        return collection.map(formatPerson);
    };
    formatAll.isFormat = true;

    return formatAll;
};

/**
 * Ограничение количества элементов в коллекции
 * @param {Number} count – Максимальное количество элементов
 * @returns {Function}
 */
exports.limit = function (count) {
    let cut = function (collection) {
        return collection.slice(0, count);
    };
    cut.isLimit = true;

    return cut;
};

if (exports.isStar) {

    /**
     * Фильтрация, объединяющая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     */
    exports.or = function () {
        return;
    };

    /**
     * Фильтрация, пересекающая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     */
    exports.and = function () {
        return;
    };
}
