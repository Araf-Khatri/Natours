/* eslint-disable */
// import axios from 'axios';
import { showAlert } from './alerts';

// signup/login , data
export const accountForm = async (data, type) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/users/${type}`,
      data,
    });

    if (res.data.status === 'success') {
      showAlert(
        'success',
        `${type === 'login' ? 'Logged in' : 'You signed up'} successfully`
      );
      setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async (e) => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });
    if (res.data.status === 'success') location.reload(true);
  } catch (err) {
    showAlert('error', 'Error loggin out! Try again.');
  }
  location.assign('/');
};
