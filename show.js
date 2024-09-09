var is_second_choice = false; // Флаг для отслеживания, сделан ли второй выбор игрока
var is_game_end = false;      // Флаг для отслеживания, закончилась ли игра
var card_id;                  // Переменная для хранения id первой выбранной двери
var first_open_card_id;       // Переменная для хранения id открытой карты с козлом, чтобы игрок не смог выбрать ее повторно

var games_count = 0;                // Счетчик общего количества игр
var win_without_change_count = 0;   // Счетчик выигрышей без смены двери
var win_with_change_count = 0;      // Счетчик выигрышей со сменой двери
var lose_without_change_count = 0;  // Счетчик проигрышей без смены двери
var lose_with_change_count = 0;     // Счетчик проигрышей со сменой двери

// Отображения изначальной статистики на странице
document.getElementById('total-games').textContent = games_count;
document.getElementById('wins-no-switch').textContent = win_without_change_count;
document.getElementById('losses-no-switch').textContent = lose_without_change_count;
document.getElementById('wins-switch').textContent = win_with_change_count;
document.getElementById('losses-switch').textContent = lose_with_change_count;

shuffle_the_doors();

// Функция, убирающая отображение элемента
function set_no_show(elem) {
    elem.classList.remove('show'); // Удаление класса 'show'
    elem.classList.add('no_show'); // Добавление класса 'no_show'
}

// Функция, добавляющая отображение элемента
function set_show(elem) {
    elem.classList.remove('no_show');
    elem.classList.add('show');
}

// Функция перемешивания дверей
function shuffle_the_doors() {
    const reset_doors = document.querySelectorAll('.opened');               // Поиск всех элементов с классом 'opened'
    reset_doors.forEach(door => {
        door.classList.remove('car_door');
        door.classList.add('goat_door');
    });

    const goatDoors = document.querySelectorAll('.goat_door');              // Поиск всех дверей с классом 'goat_door'

    const randomIndex = Math.floor(Math.random() * goatDoors.length);       // Выбор случайного индекса из дверей с козлом
    const selectedDoor = goatDoors[randomIndex];                            // Выбор случайной двери

    selectedDoor.classList.remove('goat_door');
    selectedDoor.classList.add('car_door');
}

// Функция, открывающая дверь
function open_door(card) {
    card.querySelectorAll('.opened').forEach(opened_door => {
        opened_door.classList.toggle('no_show');
        opened_door.classList.toggle('show');
    });

    card.querySelectorAll('.closed').forEach(closed_door => {
        closed_door.classList.toggle('no_show');
        closed_door.classList.toggle('show');
    });
}

// Функция, открывающая самую первую дверь с козлом
function open_door_with_goat(card) {
    const cards = document.querySelectorAll('.card');
    const other_cards = Array.from(cards).filter(item => item !== card);                     // Фильтрация, чтобы исключить выбранную карту
    const goat_door_cards = other_cards.filter(item => !item.querySelector('.car_door'));    // Фильтрация карт без машины
    const random_index = Math.floor(Math.random() * goat_door_cards.length);                 // Выбор случайного индекса из дверей с козлом
    const selected_card = goat_door_cards[random_index];                                     // Выбор случайной двери

    selected_card.querySelectorAll('.opened').forEach(opened_door => {
        opened_door.classList.toggle('no_show');
        opened_door.classList.toggle('show');
    });

    selected_card.querySelectorAll('.closed').forEach(closed_door => {
        closed_door.classList.toggle('no_show');
        closed_door.classList.toggle('show');
    });

    return selected_card.id;                                                                 // Возвращение id открытой карты
}

// Функция сброса игры
function reset_the_game() {
    is_game_end = false;                                   // Сброс флага окончания игры
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        set_no_show(card.querySelector('.opened'));
        set_show(card.querySelector('.closed'));
    });

    set_show(document.getElementById('first_step'));       // Показываем элемента с id 'first_step', все остальные скрываем
    set_no_show(document.getElementById('second_step'));
    set_no_show(document.getElementById('win'));
    set_no_show(document.getElementById('lose'));
    shuffle_the_doors();                                   // Перемешивание дверей
}

// Основная функция, в которой и происходит выбор дверей
function choose_the_door(card) {
    if (is_second_choice == false && is_game_end == false) {

        first_open_card_id = open_door_with_goat(card);         // Открытие двери с козлом после первого выбора игрока

        set_no_show(document.getElementById("first_step"));     // Скрытие элемента с id 'first_step'
        set_show(document.getElementById("second_step"));       // Показ элемента с id 'second_step'

        card_id = card.id;                                      // Сохранение id выбранной карты
        is_second_choice = true;                                // Установка флага второго выбора
    }

    else if (is_second_choice == true && is_game_end == false && first_open_card_id != card.id) {

        open_door(card);                                     // Открытие выбранной карты
        set_no_show(document.getElementById("second_step")); // Скрытие элемента с id 'second_step'

        if (card.querySelector('.car_door') != null) {       // Проверка, содержит ли карта машину
            set_show(document.getElementById("win"));        // Показ элемента с id 'win'

            if (card_id == card.id)
                win_without_change_count++;                  // Увеличение счетчика выигрышей без смены
            else
                win_with_change_count++;                     // Увеличение счетчика выигрышей со сменой
        } else {
            set_show(document.getElementById("lose"));       // Показываем элемента с id 'lose'

            if (card_id == card.id)
                lose_without_change_count++;                 // Увеличение счетчика проигрышей без смены
            else
                lose_with_change_count++;                    // Увеличение счетчика проигрышей со сменой
        }

        is_game_end = true;                                  // Установка флага окончания игры

        setTimeout(() => {
            games_count++;                                   // Увеличение счетчика игр
            reset_the_game();                                // Сброс игры

            // Обновление отображения статистики на странице
            document.getElementById('total-games').textContent = games_count;
            document.getElementById('wins-no-switch').textContent = win_without_change_count;
            document.getElementById('losses-no-switch').textContent = lose_without_change_count;
            document.getElementById('wins-switch').textContent = win_with_change_count;
            document.getElementById('losses-switch').textContent = lose_with_change_count;

            is_second_choice = false;                        // Сброс флага второго выбора
        }, 1500);                                            // Задержка 1.5 секунды
    }
}
