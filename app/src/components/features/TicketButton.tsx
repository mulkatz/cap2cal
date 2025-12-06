import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db.ts';
import { CTAButton } from '../ui/buttons/CTAButton.tsx';
import { useState } from 'react';
import { findTickets } from '../../services/api.ts';
import { CaptureEvent } from '../../models/CaptureEvent.ts';
import { CameraPreview } from '@michaelwolz/camera-preview-lite';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { IconTicket } from '../../assets/icons';

export const TicketButton = ({ id, isFavourite }: { id: string; isFavourite: boolean }) => {
  const [fetching, setFetching] = useState(false);
  const { t } = useTranslation();
  const i18n = i18next.language;
  const fetchTickets = (item: CaptureEvent, searchQuery: string) => {
    setFetching(true);
    findTickets(searchQuery, i18n).then(async (value) => {
      if (value === null) {
        await db.eventItems.update(item, { ...item, alreadyFetchedTicketLink: null });
        setFetching(false);
        return;
      }

      const ticketLink = value.ticketLinks[0] || null;
      await db.eventItems.update(item, { ...item, alreadyFetchedTicketLink: ticketLink });
      setFetching(false);

      // Auto-open the ticket link if found
      if (ticketLink) {
        onTicket(ticketLink);
      }

      return;
    });
  };

  const item = useLiveQuery(async () => await db.eventItems.where('id').equals(id).first()) || null;

  if (!item) {
    // console.error(`error reading event with id ${id}. item not found`); //fixme is called onrender
    return null;
  }

  if (item.ticketDirectLink) {
    return (
      <CTAButton
        highlight={isFavourite}
        text={t('general.searchTickets')}
        icon={<IconTicket size={20} strokeWidth={2} />}
        onClick={() => onTicket(item.ticketDirectLink!)}
      />
    );
  }

  if (item.alreadyFetchedTicketLink) {
    return (
      <CTAButton
        highlight={isFavourite}
        text={t('general.buyTickets')}
        icon={<IconTicket size={20} strokeWidth={2} />}
        onClick={() => onTicket(item.alreadyFetchedTicketLink!)}
      />
    );
  }

  if (item.alreadyFetchedTicketLink === null) {
    return <CTAButton text={t('general.noTicketsAvailable')} disabled />;
  }

  if (item.alreadyFetchedTicketLink === undefined && item.ticketSearchQuery) {
    return (
      <CTAButton
        highlight={isFavourite}
        text={t('general.searchTickets')}
        icon={<IconTicket size={20} strokeWidth={2} />}
        loading={fetching}
        onClick={() => fetchTickets(item, item.ticketSearchQuery!)}
      />
    );
  }

  return null;
};
const onTicket = async (link: string) => {
  let sanitizedLink = link.replace(/^(https?:\/\/)?(www\.)?/, '');
  if (!sanitizedLink.startsWith('www.')) {
    sanitizedLink = 'www.' + sanitizedLink;
  }

  // Prepend 'https://' to make the link valid for window.open
  try {
    await CameraPreview.stop();
  } catch (e) {
    console.error('camera preview already stopped');
  }
  window.open('https://' + sanitizedLink, '_blank');
};
