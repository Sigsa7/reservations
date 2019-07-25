/* eslint-disable no-plusplus */
/* eslint-disable func-names */
const fs = require('fs');
const faker = require('faker');
const os = require('os');

const intervalOptions = [15, 30, 45, 60];
const openOptions = ['07:00', '08:00', '09:00', '10:00'];
const closeOptions = ['21:00', '22:00', '23:00', '24:00'];
const closeDateOptions = [0, 1, 2, 3, 4, 5, 6];

const createRestaurant = function () {
  const restaurantName = `${faker.lorem.word()} ${faker.lorem.word()}`;
  const openAssign = Math.floor(Math.random() * openOptions.length);
  const closeAssign = Math.floor(Math.random() * closeOptions.length);
  const intervalAssign = Math.floor(Math.random() * intervalOptions.length);
  const closeDateAssign = Math.floor(Math.random() * closeDateOptions.length);

  const openTime = openOptions[openAssign];
  const closeTime = closeOptions[closeAssign];
  const intervalTime = intervalOptions[intervalAssign];
  const closeDate = closeDateOptions[closeDateAssign];

  const row = `${restaurantName},${openTime},${closeTime},${closeDate},${intervalTime}\n`;
  const output = [];
  output.push(row);
  return output.join(os.EOL);
};

const generateRestaurants = () => {
  const writer = fs.createWriteStream('restaurants.csv');
  let i = 10000000;

  function write() {
    let ok = true;
    do {
      i--;
      if (i === 0) {
        const data = createRestaurant();
        writer.write(data, 'utf8');
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

generateRestaurants();
