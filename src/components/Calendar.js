import React, { Component } from 'react';
import { GoogleLogout } from 'react-google-login';
import { Redirect } from 'react-router-dom';
import { getCalendarList, getCalendarEvent } from '../actions/calendarAction';
import '../styles/App.css';
import { formatEvents } from '../utils/helpers';
import CalendarEvents from './CalendarEvents';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const curr = new Date();
const first = curr.getDate() - curr.getDay();
const last = first + 6;

const firstday = new Date(curr.setDate(first)).toISOString();
const lastday = new Date(curr.setDate(last)).toISOString();

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accessToken: null,
      calendarList: [],
      events: {},
      allCalendarEvents: []
    };
    this.logoutButtonRef = React.createRef();
  }

  componentDidMount() {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      this.setState({ accessToken }, () => {
        getCalendarList(accessToken)
          .then(({ data: { items: calendarList } }) => {
            // toggle the first calendar
            calendarList[0].isToggled = true;
            this.setState(() => ({ calendarList }));

            // pre-populate calendar event for the first calendar in the list
            this.updateCalendarEvents(calendarList[0]);
          })
          .catch((e) => {
            if (e.response.status === 401) {
              if (this.logoutButtonRef.current) {
                this.logoutButtonRef.current.click()
              }
            }
          });
      });
    }
  }

  logout = () => {
    localStorage.removeItem('accessToken');
    this.setState((state) => ({
      accessToken: null,
    }));
  };

  onToggleCalendar = (event) => {
    const { value } = event.target;
    const calendarList = [...this.state.calendarList];
    calendarList[value] = {
      ...calendarList[value],
      isToggled: !calendarList[value].isToggled,
    };
    this.setState(
      (prev) => ({
        ...prev,
        calendarList: calendarList,
      }),
      () => {
        this.updateCalendarEvents(calendarList[value]);
      },
    );
  };

  updateCalendarEvents = async (calendar) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      const { data: { items = [] } = {} } = await getCalendarEvent(
        accessToken,
        calendar.id.replaceAll('#', '%23'),
        firstday,
        lastday,
      );
      const events = { ...this.state.events };
      if (calendar.isToggled) {
        events[calendar.id] = items;
      } else {
        events[calendar.id] = [];
      }
      const allCalendarEvents = formatEvents(events, this.state.calendarList);
      this.setState((prev) => ({
        ...prev,
        allCalendarEvents,
        events,
      }));
    }
  };

  render() {
    const accessToken = localStorage.getItem('accessToken');

    const { calendarList, allCalendarEvents } = this.state;
    return accessToken ? (
      <div className="wrap">
        <div className="main-calendar">
          <div className="view-header">
            <div>{new Date().toLocaleString('en-us', {month: 'long'})}, {new Date().getFullYear()}</div>
            <GoogleLogout
              className="button ml-auto"
              clientId={CLIENT_ID}
              buttonText="Logout"
              onLogoutSuccess={() => this.logout()}
              onFailure={(err) => console.log(err)}
            />
          </div>
          <hr />
          <div className="calendar-wrapper">
            <div className="calendar-list">
              <h4>Calendars</h4>
              <div>
                {calendarList &&
                  calendarList.map((calendar, idx) => (
                    <div className="calender" key={calendar.id}>
                      <label className="switch">
                        <input
                          type="checkbox"
                          defaultChecked={calendar.isToggled}
                          name={calendar.summaryOverride || calendar.summary}
                          value={idx}
                          onChange={this.onToggleCalendar}
                        />
                        <span
                          className="slider round"
                          style={{
                            backgroundColor: calendar.isToggled
                              ? calendar.backgroundColor
                              : null,
                          }}
                        />
                      </label>
                      <div className="calendar-summary">
                        {calendar.summaryOverride || calendar.summary}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <CalendarEvents allCalendarEvents={allCalendarEvents} />
          </div>
        </div>
      </div>
    ) : (
      <Redirect to="/" />
    );
  }
}

export default Calendar;
