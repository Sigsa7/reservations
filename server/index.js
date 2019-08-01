/* eslint-disable no-nested-ternary */
const newRelic = require('newrelic');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const expressStaticGzip = require('express-static-gzip');
const db = require('../database/controllers/dbControllers.js');

const app = express();

const port = 3005;


app.use(morgan('dev'));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/../public/')));
app.use('/:restaurant_id', express.static(path.join(__dirname, '/../public/')));
app.use('/', expressStaticGzip('/../public/', {
  enableBrotli: true,
  orderPreference: ['br', 'gz'],
  setHeaders: function (res, path) {
    res.setHeader("Cache-Control", "public, max-age=31536000");
  },
}));

app.get('/booking/reserved/:restaurantID', db.cacheReservedDates, db.getReservedDates);

app.get('/booking/count/:restaurantID', db.getBookingCount);

app.post('/booking/:restaurantID', db.createReservation);

app.put('/booking/:reservationID', db.updateReservation);

app.delete('/booking/:reservationID', db.deleteReservation);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));