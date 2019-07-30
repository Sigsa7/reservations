/* eslint-disable no-nested-ternary */
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const moment = require('moment');

const app = express();

const pool = new Pool({
  database: 'sigsa_reservations2',
});

const port = 3005;

app.use(morgan('dev'));
app.use(bodyParser.json());

app.get('/booking/reserved/:restaurantID', (req, res) => {

});

app.get('/booking/count/:restaurantID', (req, res) => {
  const { restaurantID } = req.params;
  const { date } = req.body;

  pool.query('SELECT COUNT(*) FROM reservations WHERE restaurant_id = $1 AND create_at = $2', [restaurantID, date], (err, data) => {
    if (err) {
      throw err;
    }
    res.send(data.rows[0]);
  });
});

app.post('/booking/:restaurantID', (req, res) => {
  const { restaurantID } = req.params;
  const { dateTime, partySize } = req.body;
  const tableSize = partySize > 10 ? 20 : (partySize % 2 === 0 ? partySize : partySize + 1);
  const createAt = moment().format('YYYY-MM-DD');
  
  pool.query('INSERT INTO reservations (restaurant_id, date_time, party_size, table_size, create_at) VALUES($1, $2, $3, $4, $5)',
    [restaurantID, dateTime, partySize, tableSize, createAt], (err, data) => {
      if (err) {
        throw err;
      }
      res.sendStatus(200);
    });
});

app.put('/booking/:reservationID', (req, res) => {
  // update an existing reservation
});

app.delete('/booking/:reservationID', (req, res) => {
  // delete an existing reservation
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))