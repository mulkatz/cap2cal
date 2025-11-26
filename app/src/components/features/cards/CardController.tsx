import { CaptureEvent } from '../../../models/CaptureEvent.ts';
import EventCardAtom from './EventCard.tsx';
import { db } from '../../../db/db.ts';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  createAppleCalendarLink,
  createGoogleCalendarLink,
  createOutlookCalendarLink,
  isApplePlatform,
  openATag,
} from '../../../utils.ts';
import { useDialogContext } from '../../../contexts/DialogContext.tsx';
import { Dialog } from '../../ui/Dialog.tsx';
import { ExportChooser } from '../dialogs/ExportChooser.tsx';
import { Share } from '@capacitor/share';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { ImagePreview } from '../../ui/ImagePreview.tsx';
import { CalendarPermissionScope, CapacitorCalendar } from '@ebarooni/capacitor-calendar';
import { PermissionDeniedAtom } from '../dialogs/PermissionDenied.tsx';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export const CardController = React.memo(({ data }: { data: CaptureEvent }) => {
  const { t } = useTranslation();
  const dialogs = useDialogContext();

  // Optimized: Only query image when needed, with proper dependencies
  const img = useLiveQuery(async () => await db.images.where('id').equals(data.id).first(), [data.id]) || null;

  // Query from database to get live updates (e.g., when favorite state changes)
  const item = useLiveQuery(async () => await db.eventItems.where('id').equals(data.id).first(), [data.id]) ?? data;
  if (!item) return null;

  const onFavourite = useCallback(async () => {
    await db.eventItems.update(item, { ...item, isFavorite: !item.isFavorite });
  }, [item]);

  async function sharePdfFile(pdfBase64Data: string, fileName: string) {
    try {
      // 1. Write the PDF to the Cache directory
      const writeFileResult = await Filesystem.writeFile({
        path: fileName, // e.g., 'myDocument.pdf'
        data: pdfBase64Data,
        directory: Directory.Cache,
        // encoding: Encoding.UTF8 // Not typically needed for base64, as data is already a string
      });

      // 2. Get the URI of the saved file
      // The writeFileResult.uri is already the native path for sharing.
      // For some older approaches or if you only have the path and directory:
      // const uriResult = await Filesystem.getUri({
      //   directory: Directory.Cache,
      //   path: fileName,
      // });
      // const nativePath = uriResult.uri;

      const nativePath = writeFileResult.uri;

      // 3. Check if sharing is available
      const canShare = await Share.canShare();
      if (!canShare.value) {
        console.log('Sharing is not available on this platform.');
        // Optionally, provide fallback or user feedback
        return;
      }

      // 4. Share the file
      await Share.share({
        title: t('share.shareFile', { fileName }),
        text: t('share.checkOutPdf', { fileName }),
        files: [nativePath], // Use the 'files' array for local file URIs
        // url: nativePath, // Alternatively, for a single file, 'url' can also work
        dialogTitle: t('share.shareFile', { fileName }),
      });

      console.log('PDF shared successfully');
    } catch (error) {
      console.error('Error sharing PDF:', error);
      // Handle errors, e.g., show an alert to the user
    }
  }

  // --- How to use it (example) ---

  // Assume you have your PDF as a base64 string
  // const myPdfBase64 = "JVBERi0xLjcKJeLjz9MKNyAwIG9iago8PAovVHlwZS..."; // Your actual base64 data
  // const myPdfFileName = "myReport.pdf";

  // Call the function when ready to share
  // sharePdfFile(myPdfBase64, myPdfFileName);

  async function shareContent() {
    const item = {
      title: t('share.appTitle'),
      description: t('share.appDescription'),
      link: 'https://cap2cal.app',
    };

    const message = t('share.checkOutTool', { title: item.title, description: item.description, link: item.link });

    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: message,
          // url: item.link,
        });
        console.log('Content shared successfully!');
      } catch (error) {
        console.error('Error sharing content:', error);
      }
    } else {
      console.error('Web Share API not supported on this device.');
      // Optional: Provide a fallback for devices that don’t support the Web Share API
    }
  }

  const onShare = async () => {
    if (true) {
      if (!img?.dataUrl) return;

      const addFormatter = true;
      try {
        sharePdfFile(dummyPdf, 'dummy.pdf');
        // shareContent();
        // await navigator.share({
        //   title: 'this is a title',
        //   // text: 'this is a message',
        //   // url: 'https://cap2cal.app',
        // });
        // await navigator.share({
        //   title: 'this is a title',
        //   text: 'test123',
        //   //           text: `Guck mal, hab ich grad gesehen:
        //   //
        //   // ${addFormatter ? '_' + item.title + '_' : item.title}
        //   //
        //   // ${item.description.short}
        //   //
        //   // by https://cap2cal.app
        //   // `,
        //   // files: [file],
        //   // files: [],
        // });
        console.log('Content shared successfully');
      } catch (err) {
        console.error('Error sharing content:', err);
      }
    } else {
      console.log('Web Share API is not supported in this browser.');
    }
  };

  const onImage = useCallback(() => {
    dialogs.push(<ImagePreview id={item.id} onClose={dialogs.pop} />);
  }, [dialogs, item.id]);

  /**
   * Creates a calendar event using the native device calendar via Capacitor.
   * It preserves all business logic from the original .ics creation function.
   */
  const exportToCalendar = async (): Promise<void> => {
    try {
      // ---------------------------------
      // 1. PRESERVE ORIGINAL LOGIC: VALIDATION & DATE/TIME CALCULATION
      // ---------------------------------
      const { title, description, dateTimeFrom, dateTimeTo, location } = item;

      if (!dateTimeFrom || !dateTimeFrom.date) {
        console.error('Event creation failed: Start date is missing.');
        return;
      }

      const isFullDay = !dateTimeFrom.time;
      let startDateTime: Date;
      let endDateTime: Date;

      if (isFullDay) {
        // Logic for an all-day event
        startDateTime = new Date(`${dateTimeFrom.date}T00:00:00`);
        // For the plugin, the end date for a single all-day event should be the same day.
        // The `isAllDay: true` flag will handle the rest.
        endDateTime = new Date(`${dateTimeFrom.date}T23:59:59`);
      } else {
        // Logic for a timed event
        startDateTime = new Date(`${dateTimeFrom.date}T${dateTimeFrom.time}`);

        if (dateTimeTo?.time) {
          // End time is present
          const endDate = dateTimeTo.date || dateTimeFrom.date;
          endDateTime = new Date(`${endDate}T${dateTimeTo.time}`);
        } else {
          // No end time defaults to a 90-minute duration
          endDateTime = new Date(startDateTime.getTime() + 90 * 60 * 1000);
        }
      }

      // Combine location details into a single string
      const locationString = [location?.address, location?.city].filter(Boolean).join(', ');

      // ---------------------------------
      // 2. PERMISSIONS FLOW
      // ---------------------------------
      // 1. Check if we already have permission to write to the calendar
      const permissions = await CapacitorCalendar.checkPermission({
        scope: CalendarPermissionScope.WRITE_CALENDAR,
      });
      let permissionStatus = permissions.result;

      // 2. If permission is not granted, request it from the user.
      if (permissionStatus !== 'granted') {
        const request = await CapacitorCalendar.requestFullCalendarAccess();
        permissionStatus = request.result;
      }

      if (permissionStatus !== 'granted') {
        console.warn('Permission to write to calendar was denied.');

        dialogs.replace(<PermissionDeniedAtom type={'calendar'} onClose={dialogs.pop} />);
        // Optionally, show a message to the user here.
        return;
      }

      // ---------------------------------
      // 3. CREATE NATIVE EVENT
      // ---------------------------------
      await CapacitorCalendar.createEventWithPrompt({
        title: title || t('general.newEvent'),
        description: description?.long || description?.short || '',
        location: locationString,
        startDate: startDateTime.getTime(),
        endDate: endDateTime.getTime(),
        isAllDay: isFullDay,
      });

      console.log('Event successfully created in the native calendar.');
    } catch (error) {
      // Catch errors from the plugin (e.g., user cancels the prompt) or other issues.
      console.error('Failed to create calendar event:', error);
    }
  };

  const onExport = useCallback(() => {
    const onApple = () => {
      const calendarLink = createAppleCalendarLink(item);
      if (!calendarLink) return;
      openATag(calendarLink, item.title);
    };
    const onGoogle = () => {
      const calendarLink = createGoogleCalendarLink(item);
      if (!calendarLink) return;
      openATag(calendarLink);
    };
    const onOutlook = () => {
      const calendarLink = createOutlookCalendarLink(item);
      if (!calendarLink) return;
      openATag(calendarLink);
    };

    dialogs.push(
      <Dialog onClose={dialogs.pop}>
        <ExportChooser
          onApple={isApplePlatform() ? onApple : undefined} // Enable only if on iOS or macOS
          onGoogle={onGoogle}
          onOutlook={onOutlook}
          onClose={dialogs.pop}
        />
      </Dialog>
    );
  }, [dialogs, item]);

  const onTicket = useCallback((link: string) => {
    let sanitizedLink = link.replace(/^(https?:\/\/)?(www\.)?/, '');
    if (!sanitizedLink.startsWith('www.')) {
      sanitizedLink = 'www.' + sanitizedLink;
    }

    // Prepend 'https://' to make the link valid for window.open
    window.open('https://' + sanitizedLink, '_blank');
  }, []);

  const onWeblink = useCallback(() => {
    // fixme use all links
    const hasHttp = item.links?.[0] && (item.links[0].startsWith('http://') || item.links[0].startsWith('https://'));
    item.links?.[0] && window.open(hasHttp ? item.links[0] : `https://${item.links[0]}`, '_blank');
  }, [item.links]);

  const onAddress = useCallback(() => {
    if (!item.location) return;
    const { city, address } = item.location;
    const searchTerm = [city, address].filter(Boolean).join(', ');
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURI(searchTerm)}`;
    window.open(url, '_blank');
  }, [item.location]);

  const onDelete = useCallback(async () => {
    // Delete the event from the database
    await db.eventItems.delete(item.id);
    // Also delete the associated image if it exists
    if (img?.id) {
      await db.images.delete(img.id);
    }
  }, [item.id, img?.id]);

  return (
    <>
      <EventCardAtom
        data={item}
        isFavourite={!!item.isFavorite}
        onFavourite={onFavourite}
        onExport={exportToCalendar}
        onImage={onImage}
        onAddress={onAddress}
        onDelete={onDelete}
      />
    </>
  );
});

const dummyPdf = ``;
