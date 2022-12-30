const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// IMPORTANT: after line 17 every route need
// authentication. User should be Logged in to access those
// routes down there
// ---Protect all routes after this middleware---
router.use(authController.protect);

router.patch(
  '/updateMyPassword',
  // authController.protect,
  authController.updatePassword
);

router.get(
  '/me',
  // authController.protect,
  userController.getMe,
  userController.getUser
);

router.patch(
  '/updateMe',
  /*authController.protect,*/ userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);

router.delete(
  '/deleteMe',
  /* authController.protect, */ userController.deleteMe
);

router.use(authController.restrictTo('admin'));
// now only admin will get access to routes
router
  .route('/')
  .get(userController.getAllUser)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
