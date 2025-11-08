// import { EventError, EventSuccess } from '../models/model.ts';
import { ApiError, ApiEvent, ApiFindResult, ApiSuccess } from './model.ts';

const ANALYSE_API_URL = 'https://analyse-u6pn2d2dsq-uc.a.run.app';
const FIND_TICKETS_API_URL = 'https://findtickets-u6pn2d2dsq-uc.a.run.app';

type EventSuccess = ApiSuccess<{ items: ApiEvent[] }>;
type EventError = ApiError;

export const fetchData = async (
  image: string,
  i18n: string,
  authToken?: string
): Promise<EventSuccess | EventError> => {
  // console.log('YYYY fetch data', i18n, image);

  // // const { userLanguage } = useAppContext();
  // const userLanguage = (i18next.language ? i18next.language.split('-')[0] : 'en') || 'en';
  // // const userLanguage = 'de';
  //
  // const userLanguageCode = userLanguage.split('-')[0] || 'en'; // Get the language code or default to 'en'
  // const fullLanguageName = getFullLanguageName(userLanguageCode);

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const res = await fetch(ANALYSE_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        image,
        i18n,
      }),
    });

    if (res.status === 200) {
      const data = await res.json();

      console.log('YYYY GOT RESPONSE', JSON.stringify(data.data));
      return JSON.parse(data.data);
    }

    // Handle 403 - capture limit reached
    if (res.status === 403) {
      const errorData = await res.json();
      console.log('YYYY LIMIT REACHED', errorData);
      return {
        status: 'error',
        data: {
          reason: 'LIMIT_REACHED',
        },
      };
    }

    console.log('YYYY GOT ERROR', res.status, res.statusText, await res.json());

    return {
      status: 'error',
      data: {
        reason: 'PROBABLY_NOT_AN_EVENT', // fixme use other reason
      },
    };
  } catch (error) {
    return {
      status: 'error',
      data: {
        reason: 'UNKNOWN', // fixme use other reason
      },
    };
  }
};

export const findTickets = async (query: string, i18n: string): Promise<ApiFindResult | null> => {
  console.log('with query', query);
  const res = await fetch(FIND_TICKETS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
    }),
  });

  if (res.status === 200) {
    const data = await res.json();
    return data satisfies ApiFindResult;
  }

  return null;
};
//
// const getFullLanguageName = (languageCode: string): string => {
//   try {
//     const languageNames = new Intl.DisplayNames(['en'], { type: 'language' });
//     return languageNames.of(languageCode) || 'English'; // Default to 'English' if no valid name found
//   } catch (error) {
//     return 'English'; // Fallback to 'English' in case of an error
//   }
// };
