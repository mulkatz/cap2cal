import { ApiEvent } from '../api/model.ts';
import { CaptureEvent } from './CaptureEvent.ts';

// export const captureEventArrayMock = [
//   {
//     title: 'Herbst-FLOHMARKT',
//     kind: 'Ausstellung',
//     location: {
//       city: 'Berlin',
//       address: '13353 Wedding,  Föhrer Straße 12',
//     },
//     dateTimeFrom: {
//       date: '2019-02-20',
//       timezone: 'Europe/London',
//       time: '10:00',
//     },
//     dateTimeTo: {
//       date: '2019-02-20',
//       timezone: 'Europe/London',
//       time: '10:00',
//     },
//     description: {
//       short:
//         'Here is the event card layout you requested, designed to display all your event information with a clean and modern look. The layout includes a bold title, a description section with details like time and location, and icons for easy readability and modern look and icons... ',
//       long: 'Here is the event card layout you requested, designed to display all your event information with a clean and modern look. The layout includes a bold title, a description section with details like time and location, and icons for easy readability and modern look and icons... ',
//     },
//     webLink: 'dein-flohmark.de/prenzlau/...',
//     ticketLink: 'dein-flohmark.de/prenzlau/',
//   },
//   {
//     title: 'Herbst-FLOHMARKT',
//     kind: 'Ausstellung',
//     location: {
//       city: 'Berlin',
//       address: '13353 Wedding,  Föhrer Straße 12',
//     },
//     dateTimeFrom: {
//       date: '2019-02-20',
//       timezone: 'Europe/London',
//       time: '10:00',
//     },
//     dateTimeTo: {
//       date: '2019-02-20',
//       timezone: 'Europe/London',
//       time: '10:00',
//     },
//     description: {
//       short:
//         'Here is the event card layout you requested, designed to display all your event information with a clean and modern look. The layout includes a bold title, a description section with details like time and location, and icons for easy readability and modern look and icons... ',
//       long: 'Here is the event card layout you requested, designed to display all your event information with a clean and modern look. The layout includes a bold title, a description section with details like time and location, and icons for easy readability and modern look and icons... ',
//     },
//     webLink: 'dein-flohmark.de/prenzlau/...',
//     ticketLink: 'dein-flohmark.de/prenzlau/',
//   },
//   {
//     title: 'Herbst-FLOHMARKT',
//     kind: 'Ausstellung',
//     location: {
//       city: 'Berlin',
//       address: '13353 Wedding,  Föhrer Straße 12',
//     },
//     dateTimeFrom: {
//       date: '2019-02-20',
//       timezone: 'Europe/London',
//       time: '10:00',
//     },
//     dateTimeTo: {
//       date: '2019-02-20',
//       timezone: 'Europe/London',
//       time: '10:00',
//     },
//     description: {
//       short:
//         'Here is the event card layout you requested, designed to display all your event information with a clean and modern look. The layout includes a bold title, a description section with details like time and location, and icons for easy readability and modern look and icons... ',
//       long: 'Here is the event card layout you requested, designed to display all your event information with a clean and modern look. The layout includes a bold title, a description section with details like time and location, and icons for easy readability and modern look and icons... ',
//     },
//     webLink: 'dein-flohmark.de/prenzlau/...',
//     ticketLink: 'dein-flohmark.de/prenzlau/',
//   },
// ];
//
// export const apiEventMock: ApiEvent = {
//   title: 'Herbst-FLOHMARKT',
//   kind: 'Ausstellung',
//   location: {
//     city: 'Berlin',
//     address: '13353 Wedding,  Föhrer Straße 12',
//   },
//   dateTimeFrom: {
//     date: '2019-02-20',
//     // timezone: 'Europe/London',
//     time: '10:00',
//   },
//   dateTimeTo: {
//     date: '2019-02-20',
//     // timezone: 'Europe/London',
//     time: '10:00',
//   },
//   description: {
//     short:
//       'Here is the event card layout you requested, designed to display all your event information with a clean and modern look. The layout includes a bold title, a description section with details like time and location, and icons for easy readability and modern look and icons... ',
//     long: 'Here is the event card layout you requested, designed to display all your event information with a clean and modern look. The layout includes a bold title, a description section with details like time and location, and icons for easy readability and modern look and icons... ',
//   },
//   links: ['dein-flohmark.de/prenzlau/...'],
//   ticketDirectLink: 'dein-flohmark.de/prenzlau/',
//   id: '123456789',
//   tags: ['foo'],
// };
//
// export const captureEventMock: CaptureEvent = {
//   title: 'Herbst-FLOHMARKT',
//   kind: 'Ausstellung',
//   location: {
//     city: 'Berlin',
//     address: '13353 Wedding,  Föhrer Straße 12',
//   },
//   dateTimeFrom: {
//     date: '2024-02-20',
//     timezone: 'Europe/London',
//     time: '10:00',
//   },
//   dateTimeTo: {
//     date: '2024-02-20',
//     timezone: 'Europe/London',
//     time: '12:00',
//   },
//   description: {
//     short:
//       'Here is the event card layout you requested, designed to display all your event information with a clean and modern look. The layout includes a bold title, a description section with details like time and location, and icons for easy readability and modern look and icons... ',
//     long: 'Here is the event card layout you requested, designed to display all your event information with a clean and modern look. The layout includes a bold title, a description section with details like time and location, and icons for easy readability and modern look and icons... ',
//   },
//   webLink: 'dein-flohmark.de/prenzlau/foo/bar/baz/foo/index',
//   ticketDirectLink: 'dein-flohmark.de/prenzlau/',
//   id: '1729033915056',
//   // imgId: 1729033915056,
// };
