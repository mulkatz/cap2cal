import { Image } from './dialogs/Image.tsx';
import { Card } from './Card.group.tsx';
import { Dialog } from './Dialog.tsx';

export const Presenter = () => {
  const onClose = () => {
    console.log('on close');
  };

  return (
    <Dialog onClose={onClose}>
      <Card>
        <Image id={'1729033915056'} />
      </Card>
    </Dialog>
  );
};
