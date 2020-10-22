export const getCurrentWeek = () => {
    let curr = new Date();
    let week = [];
    for (let i = 0; i <= 6; i++) {
      let first = curr.getDate() - curr.getDay() + i;
      week.push({
        currentDate: curr,
        date: new Date(curr.setDate(first)).getDate(),
        day: new Date(curr.setDate(first)).toLocaleString('en-us', {
          weekday: 'long',
        }),
      });
    }
    return week;
  };
  
  export const formatEvents = (events, calendarList) => {
    let allEvents = [];
    for (const calendarId in events) {
      if (events.hasOwnProperty(calendarId)) {
        const items = events[calendarId];
        const eventCalendar = calendarList.filter(
          (cal) => cal.id === calendarId,
        )[0];
        const calendarEvents = items.map((item) => ({
          ...item,
          backgroundColor: eventCalendar.backgroundColor,
        }));
        allEvents = [...allEvents, ...calendarEvents];
      }
    }
    return allEvents;
  };
  