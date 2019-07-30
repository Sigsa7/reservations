import React from 'react';
import axios from 'axios';

import {
  ModuleWrapper,
  AppWrapper,
  ContentWrapper,
  GlobalStyles,
  ModuleTitle,
} from '../theme/global';

import ReservationForm from './ReservationForm.jsx';
import ListTimes from './actions/ListTimes.jsx';
import ShowButton from './actions/ShowButton.jsx';
import InfoBox from './InfoBox.jsx';

import timeUtils from '../utils/timeUtils';

class App extends React.Component {
  constructor(props) {
    super(props);
    let id = location.pathname.slice(1);
    id = (id !== '') ? parseInt(id) : Math.floor(Math.random() * 100);
    this.state = {
      restaurantId: id,
      restaurant: {
        id: id,
        openTime: {
          hour: 0,
          minute: 0,
        },
        closeTime: {
          hour: 0,
          minute: 0,
        },
        timeIntervals: 0,
        maxSeating: 0,
        maxPartySize: 0,
      },
      bookingsToday: 0,
      available: [],
    };
  }

  componentDidMount() {
    const { restaurantId } = this.state;

    axios.get(`/${restaurantId}/reservations`)
      .then((response) => {
        const { restaurant_information } = response.data;
        let { bookings } = response.data;

        const restaurant = {
          id: restaurant_information._id,
          openTime: restaurant_information.open_time,
          closeTime: restaurant_information.close_time,
          timeIntervals: restaurant_information.time_intervals,
          maxSeating: restaurant_information.max_seating,
          maxPartySize: restaurant_information.max_party_size,
          maxTimeRange: restaurant_information.max_time_range,
        };

        bookings = bookings.map(booking => ({
          bookingTime: booking.booking_time,
          partyQty: booking.party_qty,
        }));

        this.setState({
          restaurant,
          available: timeUtils.getAvailableFromBookings(restaurant, bookings),
        });
      })
      .catch((err) => {
        console.log(err);
      });

    axios.get(`/booking/count/${restaurantId}`)
      .then((response) => {
        this.setState({
          bookingsToday: response.count,
        });
      });
  }

  render() {
    const { restaurant, available, bookingsToday } = this.state;
    return (
      <ModuleWrapper>
        <div>
          <GlobalStyles />
          <AppWrapper>
            <ContentWrapper>
              <div>
                <ModuleTitle>
                  Make a reservation
                </ModuleTitle>
              </div>
              <ReservationForm restaurant={restaurant} />
              {(available.length > 0) ? <ListTimes available={available} /> : <ShowButton />}
              <InfoBox bookingsToday={bookingsToday} availableCount={available.length} />
            </ContentWrapper>
          </AppWrapper>
        </div>
      </ModuleWrapper>
    );
  }
}

export default App;
