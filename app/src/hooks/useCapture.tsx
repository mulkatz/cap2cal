import React, { ChangeEvent, RefObject, useEffect, useState } from 'react';
import { NotCaptured } from '../components/dialogs/NotCaptured.atom.tsx';
import { Card } from '../components/Card.group.tsx';
import { Dialog } from '../components/Dialog.tsx';
import { CardController } from '../components/Card.controller.tsx';
import { CaptureEvent } from '../models/CaptureEvent.ts';
import toast from 'react-hot-toast';
import { useDialogContext } from '../contexts/DialogContext.tsx';
import { useResultContext } from '../contexts/ResultContext.tsx';
import { LoadingController } from '../components/dialogs/Loading.controller.tsx';
import { ApiEvent, ExtractionError } from '../api/model.ts';
import { db } from '../models/db.ts';
import { fetchData } from '../api/api.ts';
import { useTranslation } from 'react-i18next';
import { useFirebaseContext } from '../contexts/FirebaseContext.tsx';
import { MultiDialog } from '../components/MultiDialog.tsx';
import i18next from 'i18next';
import { colors } from '../design-tokens/colors.ts';

export const useCapture = () => {
  const [capturedImage, setCapturedImage] = useState<string>();

  const { t } = useTranslation();
  const dialogs = useDialogContext();
  const resultPage = useResultContext();
  const { logAnalyticsEvent } = useFirebaseContext();

  useEffect(() => {
    if (capturedImage) {
      // onCaptured(capturedImage);
    }
  }, [capturedImage]);

  const onCaptured = async (imgUrl: string) => {
    setCapturedImage(imgUrl);

    // Show loading state on ResultPage with pattern background
    resultPage.show(
      <Card>
        <LoadingController />
      </Card>
    );

    const hasRequiredData = (item: ApiEvent) => {
      return item.title && item.dateTimeFrom && item.dateTimeFrom.date;
    };

    try {
      const result = await fetchData(imgUrl, i18next.language);

      if ('success' === result.status) {
        const items = result.data.items;
        const sanitizedItems: ApiEvent[] = [];
        items.forEach((item) => {
          if (hasRequiredData(item)) {
            sanitizedItems.push(item);
          }
        });

        // console.log('got items', items);

        if (sanitizedItems.length === 0) {
          logAnalyticsEvent('extraction_error', {
            reason: 'PROBABLY_NOT_AN_EVENT' satisfies ExtractionError,
          });

          pushError('PROBABLY_NOT_AN_EVENT');
          return;
        }

        const createEvents = (items: ApiEvent[]) => {
          let createdAt = Date.now(); // Initialize the base timestamp

          // Helper function to create a CaptureEvent
          const createCaptureEvent = (event: ApiEvent): CaptureEvent => {
            const captureEvent: CaptureEvent = {
              ...event,
              timestamp: createdAt,
              isFavorite: false,
              img: {
                dataUrl: imgUrl,
                id: event.id,
              },
            } satisfies CaptureEvent;
            createdAt += 1; // Increment the timestamp for the next event
            return captureEvent;
          };

          const events: CaptureEvent[] = items.map(createCaptureEvent);

          return events;
        };

        const events = createEvents(sanitizedItems);

        // console.log('got events', events);

        if (events.length > 1) {
          await Promise.all(events.map((event) => saveEvent(event, imgUrl)));
          resultPage.show(
            <div className="flex w-full max-w-md flex-col gap-4">
              <MultiDialog>
                {events.map((event) => (
                  <CardController key={event.title} data={event} />
                ))}
              </MultiDialog>
            </div>
          );
        } else {
          await saveEvent(events[0], imgUrl);
          resultPage.show(<CardController data={events[0]} />);
        }
        logAnalyticsEvent('extraction_success');
        return;
      }

      pushError('PROBABLY_NOT_AN_EVENT');
      logAnalyticsEvent('extraction_error', {
        reason: result.data?.reason || 'UNKNOWN',
      });
    } catch (e) {
      pushError('UNKNOWN');
      logAnalyticsEvent('extraction_error', {
        reason: 'UNKNOWN' satisfies ExtractionError,
      });
    } finally {
      setCapturedImage(undefined);
    }
  };

  const pushError = (reason: ExtractionError) => {
    resultPage.show(
      <Card>
        <NotCaptured reason={reason} onClose={resultPage.hide} />
      </Card>
    );
  };

  const toastError = () => {
    toast.error(t('toasts.extract.error'), {
      style: {
        borderColor: colors.accent,
        backgroundColor: colors.primary,
        color: colors.secondary,
      },
      duration: 2500,
    });
  };

  const toastSuccess = () => {
    toast.success(t('toasts.extract.success'), {
      style: {
        borderColor: colors.accent,
        backgroundColor: colors.primary,
        color: colors.secondary,
      },
      duration: 2500,
    });
  };

  const saveEvent = async (event: CaptureEvent, imgUrl: string) => {
    db.eventItems.add(event, event.id);
    const img = { id: event.id, dataUrl: imgUrl };
    db.images.add(img, event.id);
  };

  const onImport = (ref: RefObject<HTMLInputElement>) => {
    ref.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>, ref: RefObject<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    console.log('handleFileChange');
    if (file) {
      const dataType = file.type;
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log('onloadend');
        const base64String = reader.result as string; // The result is a Base64 string
        onCaptured(base64String);

        if (ref?.current) {
          ref.current.value = '';
        }
      };
      reader.readAsDataURL(file); // Convert the file to a Base64 string
      // You can now handle the selected file (e.g., upload it, preview it, etc.)
    }
  };

  return { setCapturedImage, capturedImage, onImportFile: handleFileChange, onImport, onCaptured };
};
