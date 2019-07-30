const express = require('express');

const app = express();

const port = 3005;

app.use(morgan('dev'));
app.use(bodyParser.json());

app.get('/booking/reserved/:restaurantID', (req, res) => {
  // return unavailable times for booking
});

app.get('/booking/count/:restaurantID', (req, res) => {
  // return daily booking count
});

app.post('/booking/:restaurantID', (req, res) => {
  // create a new reservations
});

app.put('/booking/:reservationID', (req, res) => {
  // update an existing reservation
});

app.delete('/booking/:reservationID', (req, res) => {
  // delete an existing reservation
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))