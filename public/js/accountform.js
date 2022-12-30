/* eslint-disable */
// import axios from 'axios';
import { showAlert } from './alerts';

// signup/login , data
export const accountForm = async (data, type) => {
  try {
    console.log(data);
    const res = await axios({
      method: 'POST',
      url: `http://127.0.0.1:3000/api/v1/users/${type}`,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type === 'login' ? 'Logged in': 'You signed up'} successfully`);
      setTimeout(() => {
        location.assign('/');
      }, 1500);
    }

    console.log(res);
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/logout',
    });
    console.log(res);
    if(res.data.status === 'success') location.reload(true)
  } catch (err) {
    console.log(err)
    showAlert('error', 'Error loggin out! Try again.');
  }
  location.assign('/')
};
