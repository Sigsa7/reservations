/* eslint-disable no-nested-ternary */
/* eslint-disable no-plusplus */
/* eslint-disable func-names */
const fs = require('fs');
const faker = require('faker');
const os = require('os');
const moment = require('moment');

const intervalOptions = [15, 30, 60];
const minuteOptions = {
  '15': [15, 30, 45, 0],
  '30': [30, 0],
  '60': 0,
};
const openOptions = [7, 8, 9, 10];
const closeOptions = [21, 22, 23, 24];
const tableOptions = [2, 4, 6, 8, 10, 20];
const tableNumberOptions = [3, 5, 7, 9, 11];

const generateRandom = function (options) {
  return Math.floor(Math.random() * options.length);
};

const generateMinute = function (interval) {
  const options = minuteOptions[interval];
  return options[generateRandom(options)];
};

const createRestaurant = function () {
  const restaurantName = `${faker.lorem.word()} ${faker.lorem.word()}`;
  const openTime = openOptions[generateRandom(openOptions)];
  const closeTime = closeOptions[generateRandom(closeOptions)];
  const intervalTime = intervalOptions[generateRandom(intervalOptions)];

  const row = `${restaurantName},${openTime}:00,${closeTime}:00,${intervalTime}\n`;
  const output = [];
  output.push(row);
  return [output.join(os.EOL), openTime, closeTime, intervalTime];
};

const createReservation = function (restaurantID, openTime, closeTime, intervalTime) {
  const start = moment('2019-08-01');
  const stop = start.clone().add(3, 'months');
  let output = [];

  for (let i = moment(start); i.isBefore(stop); i.add(1, 'days')) {
    const partySize = faker.random.number({ min: 1, max: 20 });
    const tableSize = partySize > 10 ? 20 : ((partySize % 2 === 0) ? partySize : partySize + 1);
    const date = i.format('YYYY-MM-DD');
    const hour = faker.random.number({ min: openTime, max: closeTime });
    const minute = generateMinute(intervalTime);
    const timeStamp = `${date} ${hour}:${minute}`;

    const row = `${restaurantID},${timeStamp},${partySize},${tableSize}`;
    output.push(row);
  }
  return output.join('\n') + '\n';
};


const generateRestaurants = () => {
  const restaurantsWriter = fs.createWriteStream('rawdata/restaurants.csv');
  const reservationsWriter = fs.createWriteStream('rawdata/reservations.csv');
  console.log('generate restaurants/reservations: time before seed', moment().format('LTS'));

  let i = 1;

  function write() {
    let restaurantOk = true;
    let reservationOk = true;
    do {
      i--;
      if (i === 0) {
        const restaurantData = createRestaurant();
        restaurantsWriter.write(restaurantData[0], 'utf8');
        const reservationsData = createReservation(i + 1, restaurantData[1], restaurantData[2], restaurantData[3]);
        reservationsWriter.write(reservationsData, 'utf8');
        console.log('generate restaurants/reservations: time after seed', moment().format('LTS'));
      } else {
        const data = createRestaurant();
        restaurantOk = restaurantsWriter.write(data, 'utf8');
        reservationOk = reservationsWriter.write(data, 'utf8');
      }
    } while (i > 0 && restaurantOk && reservationOk);
    if (i > 0) {
      restaurantsWriter.once('drain', write);
      reservationsWriter.once('drain', write);
    }
  }
  write();
};

generateRestaurants();

const createSeating = function (restaurant) {
  let output = [];
  for (var i = 0; i < tableOptions.length; i++) {
    let assign = generateRandom(tableNumberOptions);
    let row = `${restaurant + 1},${tableOptions[i]},${tableNumberOptions[assign]}`;
    output.push(row);
  }
  return output.join('\n') + '\n';
};

const generateSeating = function () {
  const writer = fs.createWriteStream('rawdata/seating.csv');
  console.log('generate seating: time before seed', moment().format('LTS'));

  let i = 3000000;

  function write() {
    let ok = true;
    do {
      i--;
      if (i === 0) {
        const data = createSeating(i);
        writer.write(data, 'utf8');
        console.log('generate seating: time after seed', moment().format('LTS'));        
      } else {
        const data = createSeating(i);
        ok = writer.write(data, 'utf8');
      }
    } while (i > 0 && ok);
    if (i > 0) {
      writer.once('drain', write);
    }
  }
  write();
};