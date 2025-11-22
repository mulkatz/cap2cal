import { IconCalendarPlus, IconCamera, IconDecorator, IconExport, IconStar, IconTriangleRight } from '../assets/icons';
// Import all utilities from a single source
import {
  cn,
  formattedDate,
  formattedTime,
  formatTimeToShort, // Assumed to be moved to utils.ts
  transformUrl, // Assumed to be moved to utils.ts
} from '../utils.ts';
import { IconButton } from './buttons/IconButton.tsx';
import { CaptureEvent } from '../models/CaptureEvent.ts';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { TicketButton } from './TicketButton.tsx';
import { Card } from './Card.group.tsx';

// Props type remains the same
type Props = {
  data: CaptureEvent;
  isFavourite: boolean;
  onFavourite: () => void;
  onShare: () => void;
  onImage: () => void;
  onExport: () => void;
  onTicket?: (link: string) => void;
  onWebLink?: () => void;
  onAddress?: () => void;
};

// ## Sub-component: DoubleDate
// This component is simple and presentational. It's fine as-is.
function DoubleDate(props: {
  formattedDateFrom: '' | undefined | string;
  formattedDateTo: '' | undefined | string;
  formattedTimeFrom: '' | undefined | string;
  formattedTimeTo: '' | undefined | string;
}) {
  return (
    <div className={'flex w-full items-start justify-between text-[18px] font-bold text-highlight'}>
      <div className={'flex items-center gap-1.5'}>
        <IconDecorator />
        <div className={'flex flex-col justify-center leading-[26px]'}>
          {props.formattedDateFrom && <p>{props.formattedDateFrom}</p>}
          {props.formattedDateTo && <p>{props.formattedDateTo}</p>}
        </div>
      </div>
      <div className={'flex flex-col justify-center leading-[26px]'}>
        {props.formattedTimeFrom && <p>{props.formattedTimeFrom}</p>}
        {props.formattedTimeTo && <p>{props.formattedTimeTo}</p>}
      </div>
    </div>
  );
}

// ## Sub-component: SingleDate
// Drastically simplified. It no longer contains any formatting logic
// and just displays the pre-formatted strings it receives as props.
const SingleDate = ({ date, time }: { date?: string; time?: string }) => {
  return (
    <div className="flex w-full items-start justify-between text-[18px] font-bold text-highlight">
      <p>{date}</p>
      <p>{time}</p>
    </div>
  );
};

// ## Main Component: EventCardAtom
const EventCardAtom = React.memo(
  ({ data, onFavourite, isFavourite, onShare, onImage, onExport, onTicket, onWebLink, onAddress }: Props) => {
    const { t } = useTranslation();
    const [agendaExpanded, setAgendaExpanded] = useState(false);
    // Removed unused 'buttonState'

    const {
      title,
      kind,
      location,
      dateTimeFrom,
      dateTimeTo,
      description,
      links,
      ticketDirectLink,
      id,
      ticketAvailableProbability,
      alreadyFetchedTicketLink,
      agenda,
    } = data;

    // --- Derived State & Formatters ---

    // Cleaned up date logic
    const isSingleDate = !!dateTimeFrom?.date && (!dateTimeTo?.date || dateTimeFrom.date === dateTimeTo.date);

    // Use a single source of truth for formatting (utils.ts)
    const formattedDateFrom = dateTimeFrom?.date ? formattedDate(dateTimeFrom.date, true) : undefined;
    const formattedDateTo = !isSingleDate && dateTimeTo?.date ? formattedDate(dateTimeTo.date, true) : undefined;

    const formattedTimeFrom = dateTimeFrom?.time
      ? formattedTime(dateTimeFrom.date + 'T' + dateTimeFrom.time)
      : undefined;
    const formattedTimeTo = dateTimeTo?.time ? formattedTime(dateTimeTo.date + 'T' + dateTimeTo.time) : undefined;

    // Pre-format strings to pass to the simple SingleDate component
    const singleDateDisplay = formattedDateFrom;
    const singleTimeDisplay =
      formattedTimeFrom && formattedTimeTo ? `${formattedTimeFrom} - ${formattedTimeTo}` : formattedTimeFrom;

    // Extracted complex boolean logic into a readable variable
    const showTicketButton =
      !!ticketDirectLink ||
      !!alreadyFetchedTicketLink ||
      (!!ticketAvailableProbability && ticketAvailableProbability > 0.7);

    // Use the utility function for URL transformation
    const webLink = links?.[0];
    const shortenedWebLink = webLink ? transformUrl(webLink) : '';

    // Removed unused variables: 'hasDate', 'dateFrom', 'dateTo'

    // --- Render ---
    return (
      <Card highlight={isFavourite} inline usePattern className={'max-h-[60vh] bg-primaryElevated'}>
        <>
          <div className={'flex w-full flex-col overflow-y-auto overflow-x-hidden px-5 text-secondary'}>
            {/* Header with Star */}
            <div className={'mb-3 flex items-start justify-between'}>
              <div className={'flex-1'}>
                <div
                  className="mt-1 w-full text-[24px] font-bold leading-[26px] text-secondary"
                  style={{ maxWidth: '100%' }}>
                  {title}
                </div>
                <div className={'text-[13px]'}>{kind}</div>
              </div>
              <div className={'ml-2 mt-1'}>
                <IconButton
                  active={isFavourite}
                  onClick={onFavourite}
                  icon={<IconStar width={22} height={22} />}
                  className={'h-[44px] w-[44px]'}
                />
              </div>
            </div>

            {/* Date/Time Section */}
            <div className={'mb-3'}>
              {isSingleDate ? (
                <SingleDate date={singleDateDisplay} time={singleTimeDisplay} />
              ) : (
                <DoubleDate
                  formattedDateFrom={formattedDateFrom}
                  formattedDateTo={formattedDateTo}
                  formattedTimeFrom={formattedTimeFrom}
                  formattedTimeTo={formattedTimeTo}
                />
              )}
            </div>

            {/* Location */}
            <div className={'mb-2 flex cursor-pointer items-start gap-2'} onClick={onAddress}>
              <svg
                className={'mt-0.5 flex-shrink-0 text-secondary/50'}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <div className={'text-[15px] font-normal text-secondary/70'}>
                {[location?.city, location?.address].filter(Boolean).join(', ')}
              </div>
            </div>

            {/* Description & Agenda */}
            <div className="flex max-h-full w-[calc(100%_+_8px)] grow flex-col gap-3 overflow-y-auto pr-[8px] text-[16px] font-normal text-secondary/70">
              {description?.short && (
                <p className="line-clamp-3 overflow-hidden">{description.short}</p>
              )}

              {agenda && agenda?.length > 0 && (
                <div>
                  <div
                    className={'mb-1 flex cursor-pointer items-center gap-1.5'}
                    onClick={() => setAgendaExpanded((prev) => !prev)}>
                    {t('general.agenda')}
                    <IconTriangleRight
                      width={10}
                      height={10}
                      className="transition-transform duration-200"
                      style={{ transform: agendaExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
                    />
                  </div>
                  {agendaExpanded && (
                    <div>
                      {agenda.map((value, index) => (
                        <div key={index} className="mb-1.5 flex gap-3 text-[13px]">
                          {/* Use the util function for formatting */}
                          <div className="font-bold tracking-wider">{formatTimeToShort(value.time)}</div>
                          <span className="font-normal">{value.description}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Web Link */}
            <div className={'mb-3 mt-2 block cursor-pointer text-[12px] font-light opacity-70'} onClick={onWebLink}>
              {shortenedWebLink}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex w-full items-center gap-2 px-3 pb-3">
            <IconButton onClick={onImage} icon={<IconCamera width={20} height={20} />} className={'h-[42px] w-[42px]'} />
            <IconButton onClick={onExport} icon={<IconCalendarPlus width={20} height={20} />} className={'h-[42px] w-[42px]'} />

            {/* Ticket Button - Fills remaining width */}
            {showTicketButton && (
              <div className={'flex-1'}>
                <TicketButton isFavourite={isFavourite} id={id} />
              </div>
            )}
          </div>
        </>
      </Card>
    );
  }
);

export default EventCardAtom;
