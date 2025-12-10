import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";


const refs = {
    input: document.querySelector('#datetime-picker'),
    startBtn: document.querySelector('[data-start]'),
    days: document.querySelector('[data-days]'),
    hours: document.querySelector('[data-hours]'),
    minutes: document.querySelector('[data-minutes]'),
    seconds: document.querySelector('[data-seconds]'),
};

refs.startBtn.disabled = true;

let userSelectedDate;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (selectedDate <= new Date()) {
      


        iziToast.error({
            title: 'Please choose a date in the future',
            position: 'topRight',
          })
          
      refs.startBtn.disabled = true;
    } else {
      userSelectedDate = selectedDate;
      refs.startBtn.disabled = false; 
    }

    console.log(selectedDate);          
  },
};

flatpickr("#datetime-picker", options);

const timer = {
    isActive: false,

    start() {
        refs.startBtn.disabled = true;
        refs.input.disabled = true;

        if (this.isActive) {
            return
        } 
        this.isActive = true;

        const initTime = userSelectedDate;
        
       this.IntervalId = setInterval(() => {
            const currentTime = new Date();
            const diffMs = initTime - currentTime;
            const { days, hours, minutes, seconds } = convertMs(diffMs);
            refs.days.textContent = String(days).padStart(2, '0');
            refs.hours.textContent = String(hours).padStart(2, '0');
            refs.minutes.textContent = String(minutes).padStart(2, '0');
           refs.seconds.textContent = String(seconds).padStart(2, '0');
           
           if (diffMs <= 0) {
               this.stop();
           }
        }, 1000)
    },

    stop() {
        clearInterval(this.IntervalId);
        this.isActive = false;

        refs.days.textContent = '00'
        refs.hours.textContent = '00'
        refs.minutes.textContent = '00'
        refs.seconds.textContent = '00'

        refs.input.disabled = false;
        refs.startBtn.disabled = true;
    }
}

refs.startBtn.addEventListener('click', ()=>{
    timer.start();
})









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
  
