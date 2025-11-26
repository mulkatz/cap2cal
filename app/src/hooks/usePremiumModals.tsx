import React from 'react';
import { useDialogContext } from '../contexts/DialogContext.tsx';
import { PremiumAlert, PremiumConfirm, PremiumPrompt } from '../components/features/modals/PremiumModal.tsx';

export interface AlertOptions {
  title: string;
  message?: string;
  confirmText?: string;
}

export interface ConfirmOptions {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
}

export interface PromptOptions {
  title: string;
  message?: string;
  placeholder?: string;
  defaultValue?: string;
  confirmText?: string;
  cancelText?: string;
  inputType?: 'text' | 'email' | 'number' | 'tel' | 'url';
}

/**
 * Hook for showing premium-styled modals (alerts, confirmations, prompts).
 *
 * @example
 * ```tsx
 * const modals = usePremiumModals();
 *
 * // Show an alert
 * modals.alert({
 *   title: 'Success',
 *   message: 'Your changes have been saved.',
 *   confirmText: 'OK'
 * });
 *
 * // Show a confirmation
 * const confirmed = await modals.confirm({
 *   title: 'Delete Event',
 *   message: 'Are you sure you want to delete this event?',
 *   confirmText: 'Delete',
 *   cancelText: 'Cancel',
 *   destructive: true
 * });
 *
 * // Show a prompt
 * const name = await modals.prompt({
 *   title: 'Enter Name',
 *   placeholder: 'John Doe',
 *   confirmText: 'Save'
 * });
 * ```
 */
export const usePremiumModals = () => {
  const { push, pop } = useDialogContext();

  /**
   * Shows an alert modal with a single action button.
   * Returns a Promise that resolves when the user confirms.
   */
  const alert = (options: AlertOptions): Promise<void> => {
    return new Promise((resolve) => {
      push(
        <PremiumAlert
          title={options.title}
          message={options.message}
          confirmText={options.confirmText}
          onConfirm={() => {
            resolve();
          }}
          onClose={pop}
        />
      );
    });
  };

  /**
   * Shows a confirmation modal with confirm and cancel buttons.
   * Returns a Promise that resolves to true if confirmed, false if cancelled.
   */
  const confirm = (options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      push(
        <PremiumConfirm
          title={options.title}
          message={options.message}
          confirmText={options.confirmText}
          cancelText={options.cancelText}
          destructive={options.destructive}
          onConfirm={() => {
            resolve(true);
          }}
          onCancel={() => {
            resolve(false);
          }}
          onClose={pop}
        />
      );
    });
  };

  /**
   * Shows a prompt modal with a text input field.
   * Returns a Promise that resolves to the entered value, or null if cancelled.
   */
  const prompt = (options: PromptOptions): Promise<string | null> => {
    return new Promise((resolve) => {
      push(
        <PremiumPrompt
          title={options.title}
          message={options.message}
          placeholder={options.placeholder}
          defaultValue={options.defaultValue}
          confirmText={options.confirmText}
          cancelText={options.cancelText}
          inputType={options.inputType}
          onConfirm={(value) => {
            resolve(value);
          }}
          onCancel={() => {
            resolve(null);
          }}
          onClose={pop}
        />
      );
    });
  };

  return { alert, confirm, prompt };
};
