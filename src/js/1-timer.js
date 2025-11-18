import flatpickr from 'flatpickr';
import iziToast from 'izitoast';

// Завдання
// #region Task
// - Стилізація

// - Пошук елементів: кнопка старт, інпут

// В 1 завданні обов’язково кнопка Старт має бути неактивною одразу при завантаженні сторінки, коли йде відлік часу і при обиранні невалідної дати. Інпут треба робити неактивним, коли йде відлік часу, коли таймер доходить до 00 - знов робимо інпут активним, щоб можна було обрати нову дату.

// - Вибір Дати
// записати вибрану дату після валідації її в методі
// library options
// якщо користувач вибрав в минулому то ініціювати бібліотеку повідомлення та заблокувати кнопку старт
// якщо в майбутньому то зробити кнопку старт валідною доти не валідна
// заблокувати кнопку старт поки інтервал не завершиться

// - Відлік часу

//після натисканя відлік раз 1 секунду кнопка старт та інпут стають не активними
// оновлення інтерфейс таймера textContent
// таймер зупиняєтья коли дійшов до кінцевої дати тобто 00 00 00 00

//  щоб має зробити таймер щоб рахувати
//  він повинен знати першу вибрану дату в млс в майбутньому
//  він повинен знати теперішню дату в мілісекундаї
// цб різницю перетворити в години дні за допомогою конвертації convertMs(ms)

// - Форматування часу
// функція convertMs( ) повертає обʼєкт з рохрахованим часом що залишився докінцевох лати
// Напиши функцію, наприклад addLeadingZero(value), яка використовує метод рядка padStart() і перед відмальовуванням інтерфейсу форматує значення.
// Використовувати датасет

// - Бібліотека повідомлень
// Повідомлення

// #endregion

// //:  ======== Пошук ДОМ елементів ========

const refs = {
  startBtn: document.querySelector('button[data-start]'),
  input: document.querySelector('#datetime-picker[data-active]'),
  clockFace: document.querySelectorAll('.value'),

  days: document.querySelector('.value[data-days]'),
  hours: document.querySelector('.value[data-hours]'),
  minutes: document.querySelector('.value[data-minutes]'),
  seconds: document.querySelector('.value[data-seconds]'),
};
// додано дестркутуризацію
const { startBtn, input, clockFace, days, hours, minutes, seconds } = refs;

//: - ======== button settings ========

startBtn.dataset.start = 'disable';

//: - ======== data pick ========
// записати сюди дату
let currentTime;
let userSelectedDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    currentTime = new Date();
    if (selectedDates[0] > currentTime) {
      startBtn.dataset.start = 'enable';
      userSelectedDate = selectedDates[0];
    } else {
      console.log('Option - false ');
      startBtn.dataset.start = 'disable';

      iziToast.show({
        title: 'Hey',
        messageSize: '20',
        message: `Please choose a date in the future! for exapmle ${new Date(
          Date.now() + 76000000
        ).toLocaleString('uk-UA')}`,
        position: 'center',
        close: true,
        closeOnEscape: true,
        theme: 'light',
        color: 'red',
      });
    }
  },
};

// lib init
flatpickr('#datetime-picker', options);

//: - ======== timer ========

const timer = {
  isActive: false,
  intervalId: null,

  start() {
    if (this.isActive) return;
    this.isActive = true;
    input.dataset.active = 'disable';
    startBtn.dataset.start = 'disable';

    this.intervalId = setInterval(() => {
      currentTime = new Date();
      const diffMS = userSelectedDate - currentTime;
      const result = convertMs(diffMS);
      console.log(result);

      days.textContent = result.days;
      hours.textContent = result.hours;
      minutes.textContent = result.minutes;
      seconds.textContent = result.seconds;

      // перетворення в масив та перевірка чи всі значення відповідають "00"
      if ([...clockFace].every(time => time.textContent.trim() === '00')) {
        this.stop();
      }
    }, 1000);
  },

  stop() {
    if (!this.isActive) return;
    this.isActive = false;
    clearInterval(this.intervalId);
    // disable => enable . забув замінити :)
    input.dataset.active = 'enable';
  },
};

//: - ======== init ========

startBtn.addEventListener('click', () => timer.start());

//: - ======== Функція преведеннчя мс ========

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const pad = num => String(num).padStart(2, '0');

  // Remaining days
  const days = pad(Math.floor(ms / day));
  // Remaining hours
  const hours = pad(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = pad(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = pad(Math.floor((((ms % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
}
