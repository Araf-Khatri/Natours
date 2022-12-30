/* eslint-disable */
// import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51MJz3iSFh6HvigjlWvWoL85VbfymsfC2zEWlOi6NQjMIceVxGVVpIOKdFG6JdYeY7zwdczgyE7GapRzOZjjvvvn800iMp6EDa9'
);
export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API endpoint
    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`
    );

    // 2) Create checkout form + change credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err.message);
    showAlert('error', err);
  }
};
