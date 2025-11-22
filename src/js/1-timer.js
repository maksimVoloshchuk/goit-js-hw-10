import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  timerStartBtn: document.querySelector('.timer-start-btn'),
  timeInput: document.querySelector('#datetime-picker'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

export function showError(message) {
  iziToast.error({
    message,
    position: 'topRight',
    color: '#ff3838ff',
    // iconUrl: '../img/cross.svg',
    // icon: false,
    progressBar: false,
    messageColor: 'white',
  });
}

function disableStart(disabled) {
  refs.timerStartBtn.disabled = disabled;
}

function disableInput(disabled) {
  refs.timeInput.disabled = disabled;
}

let userSelectedDate;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selected = selectedDates[0];

    if (!selected) {
      disableStart(true);
      return;
    }

    if (selected <= new Date()) {
      showError('Please choose a date in the future');
      return;
    }

    disableStart(false);
    userSelectedDate = selected.getTime();
  },
};

document.addEventListener('DOMContentLoaded', () => {
  disableStart(true);
  flatpickr('#datetime-picker', options);
});

function startTimer() {
  disableStart(true);
  disableInput(true);

  function updateUI(timeParts) {
    refs.days.textContent = String(timeParts.days).padStart(2, '0');
    refs.hours.textContent = String(timeParts.hours).padStart(2, '0');
    refs.minutes.textContent = String(timeParts.minutes).padStart(2, '0');
    refs.seconds.textContent = String(timeParts.seconds).padStart(2, '0');
  }

  function nextInterval() {
    const dif = userSelectedDate - new Date().getTime();
    if (dif <= 0) {
      updateUI(convertMs(0));
      disableInput(false);
      return;
    }
    updateUI(convertMs(dif));
    setTimeout(nextInterval, 1000);
  }

  nextInterval();
}

refs.timerStartBtn.addEventListener('click', startTimer);
