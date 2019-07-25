/* eslint-disable no-nested-ternary */
/* eslint-disable no-plusplus */
/* eslint-disable func-names */
const fs = require('fs');
const faker = require('faker');
const os = require('os');
const moment = require('moment');

const intervalOptions = [15, 30, 45, 60];
const openOptions = ['07:00', '08:00', '09:00', '10:00'];
const closeOptions = ['21:00', '22:00', '23:00', '24:00'];
const tableOptions = [2, 4, 6, 8, 10, 20];
const tableNumberOptions = [3, 5, 7, 9, 11];

const generateRandom = function (options) {
  return Math.floor(Math.random() * options.length);
};

const createRestaurant = function () {
  const restaurantName = `${faker.lorem.word()} ${faker.lorem.word()}`;
  const openTime = openOptions[Math.floor(Math.random() * openOptions.length)];
  const closeTime = closeOptions[Math.floor(Math.random() * closeOptions.length)];
  const intervalTime = intervalOptions[Math.floor(Math.random() * intervalOptions.length)];

  const row = `${restaurantName},${openTime},${closeTime},${intervalTime}\n`;
  const output = [];
  output.push(row);
  return output.join(os.EOL);
};

const createReservation = function (restaurant) {
  const start = moment('2019-08-01');
  const stop = start.clone().add(3, 'months');
  let output = [];

  for (let i = moment(start); i.isBefore(stop); i.add(1, 'days')) {
    const partySize = faker.random.number({ min: 1, max: 20 });
    const tableSize = partySize > 10 ? 20 : ((partySize % 2 === 0) ? partySize : partySize + 1); 
    const date = i.format('YYYY-MM-DD');
    const hour = faker.random.number({ min: 8, max: 23 });
    const minute = ['00', '15', '30', '45'][Math.floor(Math.random()* 4)];
    const timeStamp = `${date} ${hour}:${minute}`;

    const row = `${restaurant + 1},${timeStamp},${partySize},${tableSize}`;
    output.push(row);
  }
  return output.join('\n') + '\n';
};

const generateRestaurants = () => {
  const writer = fs.createWriteStream('rawdata/restaurants.csv');
  console.log('generate restaurants: time before seed', moment().format('LTS'));

  let i = 3000000;

  function write() {
    let ok = true;
    do {
      i--;
      if (i === 0) {
        const data = createRestaurant();
        writer.write(data, 'utf8');
        console.log('generate restaurants: time after seed', moment().format('LTS'));
      } else {
        const data = createRestaurant();
        ok = writer.write(data, 'utf8');
      }
    } while (i > 0 && ok);
    if (i > 0) {
      writer.once('drain', write);
    }
  }
  write();
};
