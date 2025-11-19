import { IconCamera, IconDecorator, IconExport, IconStar, IconTriangleRight } from '../assets/icons';
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
    <div className={'flex w-full items-start justify-between text-[18px] font-bold'}>
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
    <div className="flex w-full items-start justify-between text-[18px] font-bold">
      <p>{date}</p>
      <p>{time}</p>
    </div>
  );
};

// ## Main Component: EventCardAtom
const EventCardAtom = React.memo(({
  data,
  onFavourite,
  isFavourite,
  onShare,
  onImage,
  onExport,
  onTicket,
  onWebLink,
  onAddress,
}: Props) => {
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

  const formattedTimeFrom = dateTimeFrom?.time ? formattedTime(dateTimeFrom.date + 'T' + dateTimeFrom.time) : undefined;
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
    // <Card highlight={isFavourite} inline usePattern className={'bg-gradient-to-br from-[#1D2E3F] to-[#243445] max-h-[60vh]'}>
    <Card highlight={isFavourite} inline usePattern className={'bg-gradient-to-b from-[#2b3f54] to-[#2b3f54]/50 max-h-[60vh]'}>
      <>
        <div className={'flex w-full flex-col overflow-y-auto overflow-x-hidden px-3 text-secondary'}>
          {/* Header */}
          <div className={'mb-3'}>
            <div className="mt-1 w-full text-[21px] leading-[21px]" style={{ maxWidth: '100%' }}>
              {title}
            </div>
            <div className={'text-[13px]'}>{kind}</div>
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
          <div className={'mb-2 cursor-pointer'} onClick={onAddress}>
            <div className={'text-[17px] font-medium'}>{location?.city}</div>
            <div className={'text-[12px] font-light opacity-70 underline'}>{location?.address}</div>
          </div>

          {/* Description & Agenda */}
          <div className="flex max-h-full w-[calc(100%_+_8px)] grow flex-col gap-3 overflow-y-auto pr-[8px] text-[16px] font-normal opacity-90">
            {description?.short && <p>{description.short}</p>}

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
          <div className={'mb-3 mt-2 block cursor-pointer text-[12px] font-light opacity-70 underline'} onClick={onWebLink}>
            {shortenedWebLink}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex w-full gap-2 rounded-tl-lg p-1.5 text-[12px]">
          <IconButton onClick={onImage} icon={<IconCamera />} />
          <div className="ml-auto flex gap-2">
            <IconButton onClick={onExport} icon={<IconExport />} />
            <IconButton active={isFavourite} onClick={onFavourite} icon={<IconStar />} />
          </div>
        </div>

        {/* Ticket Button */}
        {showTicketButton && (
          <>
            {/* Use a div for a semantic divider */}
            <div className={cn('h-[2px] w-full ', isFavourite ? 'bg-yellow-300' : 'bg-[#415970]')} />
            <TicketButton isFavourite={isFavourite} id={id} />
          </>
        )}
      </>
    </Card>
  );
});

export default EventCardAtom;
