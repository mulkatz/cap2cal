export const convert_to_google_calendar_intent0 = `
Convert the image into a Google Calendar web deeplink. Extract event details as accurately as possible, including the event title, start and end time in UTC, description, and location. Ensure that dates are in milliseconds (since epoch) format. Build the deeplink using the following structure:

"https://www.google.com/calendar/render?action=TEMPLATE&text=Event+Title&dates=StartMillis/EndMillis&details=Description&location=Location&sf=true&output=xml"

Make sure to:
- URL-encode the event title, description, and location to handle special characters.
- Accurately convert event start and end times from the image into Unix epoch time (milliseconds).
- Ensure proper date formatting in the "dates" parameter (StartMillis/EndMillis).
- Output a valid URL structure that can directly be opened in Google Calendar.

The output must follow this schema:

interface Response {
  error?: "error" | "success",
  data?: "https://www.google.com/calendar/render?action=TEMPLATE&text=Event+Title&dates=StartMillis/EndMillis&details=Description&location=Location&sf=true&output=xml"
}
`;
