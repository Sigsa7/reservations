
import http from 'k6/http';
import faker from 'cdnjs.com/libraries/Faker';
import moment from '../../node_modules/moment/moment.js';

const minuteOptions = ['15', '30', '45', '00'];


// maximum requests executed by one VU per second, determined by experimentation.
// You can adjust this up/down depending on the performance of system you are testing.

const restaurantOptions = [
  faker.random.number({ min: 1, max: 200000 }),
  faker.random.number({ min: 1, max: 200000 }),
  faker.random.number({ min: 1, max: 200000 }),
  faker.random.number({ min: 1, max: 200000 }),
  faker.random.number({ min: 1, max: 200000 }),
  faker.random.number({ min: 1, max: 200000 }),
  faker.random.number({ min: 1, max: 200000 }),
  faker.random.number({ min: 1, max: 200000 }),
  faker.random.number({ min: 200001, max: 2000000 }),
  faker.random.number({ min: 200001, max: 2000000 }),
];

export const options = {
  vus: 200,
  duration: '2m',
};

export default function () {
  const getRestaurantID = restaurantOptions[Math.floor(Math.random() * 10)];
  let partySize = faker.random.number({ min: 1, max: 20 });
  let date = moment.utc().add(faker.random.number({ min: 1, max: 90 }), 'days').format('YYYY-MM-DD');
  let hour = Math.ceil(Math.random() * 23);
  hour = hour < 10 ? `0${hour}` : hour;
  let time = `${hour}:${minuteOptions[Math.floor(Math.random() * 4)]}:00`;
  let dateTime = `${date} ${time}`;

  const getBody = JSON.stringify({
    partySize, dateTime,
  });

  const postRestaurantID = restaurantOptions[Math.floor(Math.random() * 10)];
  date = moment.utc().add(faker.random.number({ min: 1, max: 90 }), 'days').format('YYYY-MM-DD');
  hour = Math.ceil(Math.random() * 23);
  hour = hour < 10 ? `0${hour}` : hour;
  time = `${hour}:${minuteOptions[Math.floor(Math.random() * 4)]}:00`;
  dateTime = `${date} ${time}`;
  partySize = faker.random.number({ min: 1, max: 20 });

  const postBody = JSON.stringify({
    partySize, dateTime,
  });

  http.request(
    'GET',
    `http://18.217.25.48:3005/booking/reserved/${getRestaurantID}`,
    getBody,
    { headers: { 'Content-Type': 'application/json' } }
  );

  http.request(
    'POST',
    `http://18.217.25.48:3005/booking/create/${postRestaurantID}`,
    postBody,
    { headers: { 'Content-Type': 'application/json' } }
  );
}
