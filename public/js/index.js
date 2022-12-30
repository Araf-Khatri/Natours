/* eslint-disable */
// import '@babel/polyfill';
import 'core-js';
import displayMap from './leaflet';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { accountForm,  logout} from './accountform';
// DOM ELEMENTS
const leaflet = document.getElementById('map');

const form = document.querySelector('.form--login');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');

// DELEGATION
if (leaflet) {
  const locations = JSON.parse(leaflet.dataset.locations);
  console.log(locations);
  displayMap(locations);
}

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let type = 'login';
    const data = {};
    if (form.closest('.signup-form')) {
      data.passwordConfirm = document.getElementById('password-confirm').value;
      data.name = document.getElementById('name').value;
      type = 'signup';
    }

    data.email = document.getElementById('email').value;
    data.password = document.getElementById('password').value;
    
    document.querySelector('.btn--green').textContent = 'Please wait...'
    await accountForm(data, type);
    document.querySelector('.btn--green').textContent = type
  });
}

// if (loginForm) {
//   loginForm.addEventListener('submit', (e) => {
//     e.preventDefault();
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;

//     login(email, password);
//   });
// }

if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    // const name = document.getElementById('name').value;
    // const email = document.getElementById('email').value;
    updateSettings(form, 'data');
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').innerHTML = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateSettings(
      {
        passwordCurrent,
        password,
        passwordConfirm,
      },
      'password'
    );
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
    document.querySelector('.btn--save-password').innerHTML = 'Save password';
    // location.replace('/me')
  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}
