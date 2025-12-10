const delayLabel = document.querySelector('label');
delayLabel.classList.add("delay-label");

const delayInput = document.querySelector('[name="delay"]');
delayInput.classList.add('delay-input');

const submitBtn = document.querySelector('button');
submitBtn.classList.add("subBtn");

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector('.form');


form.addEventListener('submit', onFormSubmit);

function onFormSubmit(event) {
  event.preventDefault();

  const delay = Number(event.currentTarget.elements.delay.value);
  const state = event.currentTarget.elements.state.value;

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });

  event.currentTarget.reset();
    
  promise
    .then(delayValue => {
      iziToast.success({
        title: 'Success',
        message: `✅ Fulfilled promise in ${delayValue}ms`,
        position: 'topRight',
      });
    })
    .catch(delayValue => {
      iziToast.error({
        title: 'Error',
        message: `❌ Rejected promise in ${delayValue}ms`,
        position: 'topRight',
      });
    });
}
