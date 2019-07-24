# Booking server

## API Server Routes

| HTTP Method   | Endpoint                           | Description                                       |
|:--------------|:-----------------------------------|:--------------------------------------------------|
| GET           | /booking/reserved/:restaurantID    | Return available times for booking                |
| POST          | /booking/:restaurantID             | Create a new reservation                          |
| PUT           | /booking/:reservationID            | Update an existing reservation                    |
| DELETE        | /booking/:reservationID            | Cancel a reservation                              |

#### `GET /booking/reserved/:restaurantID?year=YEAR&month=MONTH&day=DAY&party=SIZE&time=TIME`
**Parameters**: Restaurant ID
**Query String**:
    1) Date requested (YYYY-MM-DD)
    2) Party size
    3) Time


Given a specific restaurant ID, a specific date, and a specific party size, this request will send back times that are available for booking. If a time is provided, the response will include times within a 2.5 hour block before and after the time provided. If no time is provided or if there are no available times within that block, the response will be all other available times given the date selected.

#### `POST /booking/:restaurantID?year=YEAR&month=MONTH&day=DAY&party=SIZE&time=TIME`
**Parameters**: Restaurant ID
**Query String**:
    1) Date requested (YYYY-MM-DD)
    2) Party size
    3) Time

Creates a reservation at the given restaurant ID, for the given date, and for the given party size
This assumes that the date is available for booking (the date should be held)

#### `PUT /booking/:reservationID?year=YEAR&month=MONTH&day=DAY&party=SIZE&time=TIME`
**Parameters**: Reservation ID
**Query String**:
    1) New date requested (YYYY-MM-DD)
    2) New party size 
    3) New time

Given the reservation ID, updates the existing reservation to the desired date, time, and party size.


#### `DELETE /booking/:reservationID`
**Parameters**: Reservation ID

Given the reservation ID, cancels the reservation and removes it from the reserved time.
