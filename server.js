// Main file...
const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  // console.log('UNHANDLER EXCEPTION! *** Shut down...');
  // console.log(err);
  // console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  // .connect(process.env.DATABASE_LOCAL, {
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((/*con*/) => {
    // console.log(con.connections);
    console.log('DB connection successful!');
  });
// .catch((err) => console.log('ERROR'));

/*
// ->> create new tour with schema using model.
const testTour = new Tour({
  name: 'The Park Camper',
  price: 997,
});

testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log('ERROR', err);
  });
*/

// console.log(app.get('env'));
// console.log(process.env);

// ->> Start the server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLER REJECTION! *** Shut down...');
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});

// console.log(x);
