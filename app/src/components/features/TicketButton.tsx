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
import { useFirebaseContext } from '../../contexts/FirebaseContext.tsx';

export const TicketButton = ({ id, isFavourite }: { id: string; isFavourite: boolean }) => {
  const { featureFlags } = useFirebaseContext();
  const [fetching, setFetching] = useState(false);
  const { t } = useTranslation();
  const i18n = i18next.language;

  // Check if ticket search is enabled (defaults to true for backwards compatibility)
  const ticketSearchEnabled = featureFlags?.ticket_search_enabled ?? true;
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

  // If ticket search is disabled via remote config, don't render the button
  if (!ticketSearchEnabled) {
    return null;
  }

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
  // Ensure the link has a valid protocol, but preserve the domain as-is
  const sanitizedLink = link.startsWith('http://') || link.startsWith('https://')
    ? link
    : 'https://' + link;

  try {
    await CameraPreview.stop();
  } catch (e) {
    console.error('camera preview already stopped');
  }
  window.open(sanitizedLink, '_blank');
};
