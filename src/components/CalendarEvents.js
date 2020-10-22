import React, { useRef } from 'react';
import moment from 'moment';

// utils
import { getCurrentWeek } from '../utils/helpers';

const TimeSlotComponent = (props) => {
  return (
    <div
      style={{
        borderBottom: '1px solid #ccc',
        width: '100%',
        fontSize: '12px',
        ...props.style,
      }}
    >
      <div
        style={{
          paddingTop: '5px',
          paddingLeft: '5px',
          paddingRight: '5px',
          overflow: 'hidden',
          height: '1.2em',
          lineHeight: '1.2em',
        }}
      >
        {props.summary}
      </div>
      {props.startTime && (
        <div
          style={{
            paddingLeft: '5px',
            paddingRight: '5px',
            overflow: 'hidden',
            height: '1.2em',
            lineHeight: '1.2em',
          }}
        >
          {moment(new Date(props.startTime)).format('h:mm A')} -{' '}
          {moment(new Date(props.endTime)).format('h:mm A')}
        </div>
      )}
    </div>
  );
};

const CalendarEvents = ({ allCalendarEvents }) => {
  const eventWrapperRef = useRef(null);
  const currentWeek = getCurrentWeek();
  const timeSlots = 24;

  const makeTimeIntervals = (startTime, endTime, increment) => {
    startTime = startTime.toString().split(':');
    endTime = endTime.toString().split(':');
    increment = parseInt(increment, 10);

    let pad = (n) => {
      return n < 10 ? '0' + n.toString() : n;
    },
      startHr = parseInt(startTime[0], 10),
      startMin = parseInt(startTime[1], 10),
      endHr = parseInt(endTime[0], 10),
      currentHr = startHr,
      currentMin = startMin,
      previous = currentHr + ':' + pad(currentMin),
      current = '',
      r = [];

    do {
      currentMin += increment;
      if (currentMin % 60 === 0 || currentMin > 60) {
        currentMin = currentMin === 60 ? 0 : currentMin - 60;
        currentHr += 1;
      }
      current = currentHr + ':' + pad(currentMin);
      r.push(
        moment(previous, 'HH:mm:ss').format('h A')
      );
      previous = current;
    } while (currentHr !== endHr);

    return r;
  };

  const renderTimeCol = () => {
    const slotHeight = Math.floor(eventWrapperRef.current.clientHeight / 24);
    return (
      <div className="time-col">
        {makeTimeIntervals("01:00", "24:00", "60").map((ts) => (
          <div
            key={ts}
            style={{
              height: slotHeight,
              width: '100%',
              position: 'relative',
              display: 'flex',
              alignItems: 'flex-end',
              borderBottom: '1px solid #fff',
              justifyContent: 'flex-end',
            }}
          >
            <p
              style={{
                margin: 0,
                marginBottom: -10,
                paddingRight: 5,
                fontSize: 14,
              }}
            >
              {ts}
            </p>
          </div>
        ))}
      </div>
    );
  };

  const displayMatchingEvents = (matchingEvents) => {
    if (eventWrapperRef.current) {
      return matchingEvents.map((evt) => {
        const defaultTimeSlotHeight = Math.ceil(
          eventWrapperRef.current.clientHeight / timeSlots,
        );
        const startTime = new Date(evt.start.dateTime);
        const endTime = new Date(evt.end.dateTime);

        const startHours = startTime.getHours();
        const endHours = endTime.getHours();

        const startMin = startTime.getMinutes();
        const endMin = endTime.getMinutes();

        const minsHeight = Math.ceil(defaultTimeSlotHeight / 60 * startMin);

        const positionFromTop =
          eventWrapperRef.current.clientHeight / timeSlots * startHours;

        const t1 = startHours + Number(startMin / 60);
        const t2 = endHours + Number(endMin / 60);
        const changeInHours = Number(t2 - t1).toFixed(2);
        const slotHeight = Number(changeInHours) * defaultTimeSlotHeight;
        const timeSlotTopMargin = positionFromTop + minsHeight;
        return (
          <TimeSlotComponent
            style={{
              position: 'absolute',
              top: timeSlotTopMargin,
              backgroundColor: evt.backgroundColor,
              height: slotHeight,
              overflow: 'hidden',
            }}
            summary={evt.summary}
            startTime={evt.start.dateTime}
            endTime={evt.end.dateTime}
          />
        );
      });
    }
    return [];
  };

  const getEventsDiplayArr = (currentWeek, allCalendarEvents) => {
    return currentWeek.map((week) => {
      const dayEvents = [];
      const matchingEvt = allCalendarEvents.filter((evt) => {
        const evtDate = new Date(evt.start.dateTime).getDate();
        return evtDate === week.date;
      });
      for (let idx = 0; idx < timeSlots; idx++) {
        const slotHeight = Math.floor(
          eventWrapperRef.current.clientHeight / 24,
        );
        dayEvents.push(
          <TimeSlotComponent
            style={{
              minHeight: slotHeight,
            }}
            key={idx}
          />,
        );
      }
      const matchingEvts = displayMatchingEvents(matchingEvt);
      return [...dayEvents, ...matchingEvts];
    });
  };

  let twoDArray = [];
  if (eventWrapperRef.current) {
    twoDArray = getEventsDiplayArr(currentWeek, allCalendarEvents);
  }
  return (
    <div className="calendar-events">
      <div className="events-wrapper">
        <div className="header">
          <div className="time-col" />
          {currentWeek &&
            currentWeek.map((day) => (
              <div className="date-col" key={day.date}>
                <div className="date-header">
                  <div
                    className={`date ${new Date().getDate() === day.date &&
                      'active'}`}
                  >
                    {day.date}
                  </div>
                  <div className="day">{day.day}</div>
                </div>
              </div>
            ))}
        </div>
        <hr className="vertical" />
        <div
          ref={eventWrapperRef}
          style={{
            display: 'flex',
            width: '100%',
            height: '140vh',
          }}
        >
          {eventWrapperRef.current && renderTimeCol()}
          {twoDArray.map((d, index) => (
            <div
              key={index}
              className="date-col"
              style={{
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              {d}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarEvents;
