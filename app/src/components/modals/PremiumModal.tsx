import React, { ReactNode, useState } from 'react';
import { Dialog } from '../Dialog.tsx';
import { cn } from '../../utils.ts';

// ============================================
// Base Premium Modal Content
// ============================================

interface PremiumModalContentProps {
  title: string;
  message?: string | ReactNode;
  children?: ReactNode;
  actions: ReactNode;
}

const PremiumModalContent = ({ title, message, children, actions }: PremiumModalContentProps) => {
  return (
    <div className="flex flex-col">
      {/* Title */}
      <h2 className="px-6 pt-6 text-center text-xl font-bold text-white">
        {title}
      </h2>

      {/* Message/Content */}
      {message && (
        <div className="px-6 py-4 text-center text-sm text-gray-300">
          {typeof message === 'string' ? <p>{message}</p> : message}
        </div>
      )}

      {/* Custom children content */}
      {children && <div className="px-6 py-4">{children}</div>}

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 px-6 pb-6 pt-2">{actions}</div>
    </div>
  );
};

// ============================================
// Premium Alert Modal (Single Action)
// ============================================

interface PremiumAlertProps {
  title: string;
  message?: string | ReactNode;
  confirmText?: string;
  onConfirm: () => void;
  onClose?: () => void;
}

export const PremiumAlert = ({
  title,
  message,
  confirmText = 'OK',
  onConfirm,
  onClose,
}: PremiumAlertProps) => {
  const handleConfirm = () => {
    onConfirm();
    onClose?.();
  };

  return (
    <Dialog onClose={onClose} closeOnClickOutside={false}>
      <PremiumModalContent
        title={title}
        message={message}
        actions={
          <button
            onClick={handleConfirm}
            className={cn(
              'w-full rounded-2xl bg-highlight px-6 py-4',
              'text-base font-bold text-primaryDark',
              'transition-all active:scale-95'
            )}>
            {confirmText}
          </button>
        }
      />
    </Dialog>
  );
};

// ============================================
// Premium Confirm Modal (Two Actions)
// ============================================

interface PremiumConfirmProps {
  title: string;
  message?: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  destructive?: boolean;
}

export const PremiumConfirm = ({
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  onClose,
  destructive = false,
}: PremiumConfirmProps) => {
  const handleConfirm = () => {
    onConfirm();
    onClose?.();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose?.();
  };

  return (
    <Dialog onClose={onClose} closeOnClickOutside={false}>
      <PremiumModalContent
        title={title}
        message={message}
        actions={
          <>
            {/* Primary Action Button */}
            <button
              onClick={handleConfirm}
              className={cn(
                'w-full rounded-2xl px-6 py-4',
                'text-base font-bold',
                'transition-all active:scale-95',
                destructive ? 'bg-warn text-white' : 'bg-highlight text-primaryDark'
              )}>
              {confirmText}
            </button>

            {/* Secondary/Cancel Button */}
            <button
              onClick={handleCancel}
              className={cn(
                'w-full py-3 text-center',
                'text-sm text-gray-400',
                'transition-opacity hover:text-gray-300'
              )}>
              {cancelText}
            </button>
          </>
        }
      />
    </Dialog>
  );
};

// ============================================
// Premium Prompt Modal (Input Dialog)
// ============================================

interface PremiumPromptProps {
  title: string;
  message?: string;
  placeholder?: string;
  defaultValue?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: (value: string) => void;
  onCancel?: () => void;
  onClose?: () => void;
  inputType?: 'text' | 'email' | 'number' | 'tel' | 'url';
}

export const PremiumPrompt = ({
  title,
  message,
  placeholder = '',
  defaultValue = '',
  confirmText = 'Save',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  onClose,
  inputType = 'text',
}: PremiumPromptProps) => {
  const [value, setValue] = useState(defaultValue);

  const handleConfirm = () => {
    onConfirm(value);
    onClose?.();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose?.();
  };

  return (
    <Dialog onClose={onClose} closeOnClickOutside={false}>
      <PremiumModalContent
        title={title}
        message={message}
        actions={
          <>
            {/* Input Field */}
            <input
              type={inputType}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              autoFocus
              className={cn(
                'w-full rounded-xl border border-white/10 bg-primaryDark px-4 py-3',
                'text-base text-white placeholder-gray-500',
                'outline-none transition-all',
                'focus:border-highlight/50 focus:ring-2 focus:ring-highlight/20'
              )}
            />

            {/* Primary Action Button */}
            <button
              onClick={handleConfirm}
              disabled={!value.trim()}
              className={cn(
                'w-full rounded-2xl bg-highlight px-6 py-4',
                'text-base font-bold text-primaryDark',
                'transition-all active:scale-95',
                'disabled:opacity-50 disabled:active:scale-100'
              )}>
              {confirmText}
            </button>

            {/* Secondary/Cancel Button */}
            <button
              onClick={handleCancel}
              className={cn(
                'w-full py-3 text-center',
                'text-sm text-gray-400',
                'transition-opacity hover:text-gray-300'
              )}>
              {cancelText}
            </button>
          </>
        }
      />
    </Dialog>
  );
};
