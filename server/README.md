# Booking
> View available restaurant reservation times for a given date and party size. Create new reservations, and update or cancel existing bookings. 

## API Server Routes

| HTTP Method   | Endpoint                           | Description                                       |
|:--------------|:-----------------------------------|:--------------------------------------------------|
| GET           | /booking/reserved/:restaurantID    | Return available times for booking                |
| GET           | /booking/count/:restaurantID       | Return daily booking count                        |
| POST          | /booking/:restaurantID             | Create a new reservation                          |
| PUT           | /booking/:reservationID            | Update an existing reservation                    |
| DELETE        | /booking/:reservationID            | Cancel a reservation                              |

#### `GET /booking/reserved/:restaurantID?year=YEAR&month=MONTH&day=DAY&party=SIZE&time=TIME`
**Parameters**: Restaurant ID

**Query String**:
- Date requested (YYYY-MM-DD)
- Party size
- Time

Given a specific restaurant ID, a specific date, and a specific party size, this request will send back times that are unavailable for booking within 2.5 hours of the time provided.

#### `GET /booking/count/:restaurantID`
**Parameters**: Restaurant ID

Given a specific restaurant ID, the response will include the number of bookings that have been made at the restaurant for the current day.

#### `POST /booking/:restaurantID?year=YEAR&month=MONTH&day=DAY&party=SIZE&time=TIME`
**Parameters**: Restaurant ID

**Query String**:
- Date requested (YYYY-MM-DD)
- Party size
- Time

Creates a reservation at the given restaurant ID, for the given date, and for the given party size
This assumes that the date is available for booking (the date should be held)

#### `PUT /booking/:reservationID?year=YEAR&month=MONTH&day=DAY&party=SIZE&time=TIME`
**Parameters**: Reservation ID

**Query String**:
- New date requested (YYYY-MM-DD)
- New party size 
- New time

Given the reservation ID, updates the existing reservation to the desired date, time, and party size.

#### `DELETE /booking/:reservationID`
**Parameters**: Reservation ID

Given the reservation ID, cancels the reservation and removes it from the reserved time.
