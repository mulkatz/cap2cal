import { CaptureEvent } from '../models/CaptureEvent.ts';
import { CalendarPermissionScope, CapacitorCalendar } from '@ebarooni/capacitor-calendar';
import { useDialogContext } from '../contexts/DialogContext.tsx';
import { Dialog } from '../components/Dialog.tsx';
import { PermissionDeniedAtom } from '../components/dialogs/PermissionDenied.atom.tsx';
import { useTranslation } from 'react-i18next';

export const useCalendarExport = () => {
  const { t } = useTranslation();
  const dialogs = useDialogContext();

  const exportToCalendar = async (event: CaptureEvent): Promise<void> => {
    try {
      const { title, description, dateTimeFrom, dateTimeTo, location } = event;

      if (!dateTimeFrom || !dateTimeFrom.date) {
        return;
      }

      const isFullDay = !dateTimeFrom.time;
      let startDateTime: Date;
      let endDateTime: Date;

      if (isFullDay) {
        startDateTime = new Date(`${dateTimeFrom.date}T00:00:00`);
        endDateTime = new Date(`${dateTimeFrom.date}T23:59:59`);
      } else {
        startDateTime = new Date(`${dateTimeFrom.date}T${dateTimeFrom.time}`);

        if (dateTimeTo?.time) {
          const endDate = dateTimeTo.date || dateTimeFrom.date;
          endDateTime = new Date(`${endDate}T${dateTimeTo.time}`);
        } else {
          endDateTime = new Date(startDateTime.getTime() + 90 * 60 * 1000);
        }
      }

      const locationString = [location?.address, location?.city].filter(Boolean).join(', ');

      const permissions = await CapacitorCalendar.checkPermission({
        scope: CalendarPermissionScope.WRITE_CALENDAR,
      });
      let permissionStatus = permissions.result;

      if (permissionStatus !== 'granted') {
        const request = await CapacitorCalendar.requestFullCalendarAccess();
        permissionStatus = request.result;
      }

      if (permissionStatus !== 'granted') {
        dialogs.replace(
          <Dialog onClose={dialogs.pop}>
            <PermissionDeniedAtom type={'calendar'} onClose={dialogs.pop} />
          </Dialog>
        );
        return;
      }

      await CapacitorCalendar.createEventWithPrompt({
        title: title || t('general.newEvent'),
        description: description?.long || description?.short || '',
        location: locationString,
        startDate: startDateTime.getTime(),
        endDate: endDateTime.getTime(),
        isAllDay: isFullDay,
      });
    } catch (error) {
      // Error handling could be enhanced here
    }
  };

  return { exportToCalendar };
};
