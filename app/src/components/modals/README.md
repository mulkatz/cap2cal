# Premium Modal System

A premium-designed modal/dialog system matching the EventCard aesthetic with smooth animations, glassy effects, and a
cohesive design language.

## Design System

All modals follow these visual guidelines:

### Container

- **Background:** `primaryElevated` (#2C4156 - Navy)
- **Border Radius:** Large (`rounded-3xl`)
- **Border:** Thin 1px border of `white/5` (Glassy effect)
- **Shadow:** Heavy drop shadow (`shadow-2xl`)
- **Backdrop:** Dark blurred (`bg-black/80 backdrop-blur-sm`)

### Typography

- **Font:** 'Plus Jakarta Sans'
- **Title:** Bold, White, Centered
- **Body:** Regular, `text-gray-300`, Centered

### Buttons

- **Primary Action:** Full width, Background `highlight` (Yellow #e6de4d), Text `primaryDark` (Navy), Bold
- **Secondary Action:** Text-only, `text-gray-400`
- **Destructive Action:** Background `warn` (#FF2929), Text white

### Animations

- **Entry:** Fade + translate up animation (`animate-fadeInTranslateY`)
- **Interaction:** Scale on press (`active:scale-95`)

---

## Usage

### 1. Using the Hook (Recommended)

The `usePremiumModals` hook provides a simple API for showing alerts, confirmations, and prompts:

```tsx
import { usePremiumModals } from '../../hooks/usePremiumModals.tsx';

function MyComponent() {
  const modals = usePremiumModals();

  const handleDelete = async () => {
    // Show confirmation dialog
    const confirmed = await modals.confirm({
      title: 'Delete Event',
      message: 'Are you sure you want to delete this event? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      destructive: true
    });

    if (confirmed) {
      // User clicked "Delete"
      deleteEvent();
    }
  };

  const handleSuccess = async () => {
    // Show alert dialog
    await modals.alert({
      title: 'Success',
      message: 'Your event has been saved successfully.',
      confirmText: 'OK'
    });
  };

  const handleRename = async () => {
    // Show prompt dialog
    const newName = await modals.prompt({
      title: 'Rename Event',
      message: 'Enter a new name for this event:',
      placeholder: 'Event name',
      defaultValue: 'My Event',
      confirmText: 'Save',
      cancelText: 'Cancel'
    });

    if (newName) {
      // User entered a name and clicked "Save"
      renameEvent(newName);
    }
  };

  return (
    <div>
      <button onClick={handleDelete}>Delete</button>
      <button onClick={handleSuccess}>Test Success</button>
      <button onClick={handleRename}>Rename</button>
    </div>
  );
}
```

### 2. Using Components Directly

You can also use the modal components directly for more control:

```tsx
import { useDialogContext } from '../../contexts/DialogContext.tsx';
import { PremiumAlert, PremiumConfirm, PremiumPrompt } from '../modals';

function MyComponent() {
  const { push, pop } = useDialogContext();

  const showCustomDialog = () => {
    push(
      <PremiumConfirm
        title="Custom Dialog"
        message="This is a custom confirmation dialog."
        confirmText="Yes"
        cancelText="No"
        onConfirm={() => {
          console.log('User confirmed');
        }}
        onCancel={() => {
          console.log('User cancelled');
        }}
        onClose={pop}
      />
    );
  };

  return <button onClick={showCustomDialog}>Show Dialog</button>;
}
```

---

## API Reference

### `usePremiumModals()`

Returns an object with three methods:

#### `alert(options): Promise<void>`

Shows an alert modal with a single action button.

**Options:**

- `title` (string) - The alert title
- `message` (string, optional) - The alert message
- `confirmText` (string, optional) - Text for the confirm button (default: "OK")

**Returns:** Promise that resolves when the user confirms.

---

#### `confirm(options): Promise<boolean>`

Shows a confirmation modal with confirm and cancel buttons.

**Options:**

- `title` (string) - The confirmation title
- `message` (string, optional) - The confirmation message
- `confirmText` (string, optional) - Text for the confirm button (default: "Confirm")
- `cancelText` (string, optional) - Text for the cancel button (default: "Cancel")
- `destructive` (boolean, optional) - If true, uses red styling for destructive actions (default: false)

**Returns:** Promise that resolves to `true` if confirmed, `false` if cancelled.

---

#### `prompt(options): Promise<string | null>`

Shows a prompt modal with a text input field.

**Options:**

- `title` (string) - The prompt title
- `message` (string, optional) - The prompt message
- `placeholder` (string, optional) - Input placeholder text
- `defaultValue` (string, optional) - Default input value
- `confirmText` (string, optional) - Text for the confirm button (default: "Save")
- `cancelText` (string, optional) - Text for the cancel button (default: "Cancel")
- `inputType` ('text' | 'email' | 'number' | 'tel' | 'url', optional) - Input type (default: "text")

**Returns:** Promise that resolves to the entered value, or `null` if cancelled.

---

## Component Props

### `<PremiumAlert>`

```tsx
interface PremiumAlertProps {
  title: string;
  message?: string | ReactNode;
  confirmText?: string;
  onConfirm: () => void;
  onClose?: () => void;
}
```

### `<PremiumConfirm>`

```tsx
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
```

### `<PremiumPrompt>`

```tsx
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
```

---

## Migration Guide

### From Native `Alert.alert()`

**Before:**

```tsx
Alert.alert(
  'Delete Event',
  'Are you sure you want to delete this event?',
  [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: () => deleteEvent() }
  ]
);
```

**After:**

```tsx
const modals = usePremiumModals();

const confirmed = await modals.confirm({
  title: 'Delete Event',
  message: 'Are you sure you want to delete this event?',
  confirmText: 'Delete',
  cancelText: 'Cancel',
  destructive: true
});

if (confirmed) {
  deleteEvent();
}
```

---

## Examples

### Success Notification

```tsx
await modals.alert({
  title: '✓ Success',
  message: 'Your changes have been saved.',
  confirmText: 'Great!'
});
```

### Destructive Confirmation

```tsx
const shouldDelete = await modals.confirm({
  title: 'Delete Account',
  message: 'This action cannot be undone. All your data will be permanently deleted.',
  confirmText: 'Delete Forever',
  cancelText: 'Keep Account',
  destructive: true
});
```

### Name Input

```tsx
const eventName = await modals.prompt({
  title: 'Create Event',
  message: 'What would you like to call this event?',
  placeholder: 'e.g., Birthday Party',
  confirmText: 'Create',
  cancelText: 'Cancel'
});

if (eventName) {
  createEvent({ name: eventName });
}
```

### Email Input

```tsx
const email = await modals.prompt({
  title: 'Share Event',
  message: 'Enter the email address to share with:',
  placeholder: 'email@example.com',
  inputType: 'email',
  confirmText: 'Share'
});
```

---

## Best Practices

1. **Use descriptive titles** - Make it clear what the dialog is about
2. **Keep messages concise** - Users should understand the action quickly
3. **Use destructive styling** - When the action is permanent or dangerous
4. **Async/await pattern** - Makes the code more readable and easier to follow
5. **Handle null returns** - Always check if the user cancelled (for prompts)

---

## Advanced: Custom Dialog Content

For complex dialogs that don't fit the standard patterns, wrap your content in the base `<Dialog>` component:

```tsx
import { Dialog } from '../Dialog.tsx';

function MyCustomDialog({ onClose }: { onClose: () => void }) {
  return (
    <Dialog onClose={onClose}>
      <div className="flex flex-col px-6 py-8">
        {/* Your custom content */}
        <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-white">
          Custom Dialog
        </h2>
        {/* ... */}
      </div>
    </Dialog>
  );
}
```
