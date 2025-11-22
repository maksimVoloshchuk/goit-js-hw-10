import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');

function showSuccess(delay) {
  iziToast.error({
    message: `✅ Fulfilled promise in ${delay}ms`,
    position: 'topRight',
    color: '#26bc24ff',
    icon: false,
    // iconUrl: '../img/cross.svg',
    // iconText: 'A',
    iconText: '✅',
    progressBar: false,
    messageColor: 'white',
  });
}

function showError(delay) {
  iziToast.error({
    message: `❌ Rejected promise in ${delay}ms`,
    position: 'topRight',
    color: '#e55353ff',
    icon: false,
    progressBar: false,
    messageColor: 'white',
  });
}

form.addEventListener('submit', evt => {
  evt.preventDefault();
  const delay = Number(evt.target.elements.delay.value);
  const state = evt.target.elements.state.value;
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  })
    .then(ms => {
      showSuccess(ms);
    })
    .catch(ms => {
      showError(ms);
    });
  evt.target.reset();
});
