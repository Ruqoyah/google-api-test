import axios from 'axios';

const BASE_URL = 'https://www.googleapis.com/calendar/v3';

export const getCalendarList = (accessToken) =>
  axios.get(`${BASE_URL}/users/me/calendarList`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const getCalendarEvent = async (
  accessToken,
  calendarId,
  timeMin,
  timeMax,
) => {
  try {
    const apiRequest = await axios.get(
      `${BASE_URL}/calendars/${calendarId}/events?timeMin=${timeMin}&timeMax=${timeMax}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return apiRequest;
  } catch (e) {
    console.error(e);
  }
};
