import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../models/db.ts';

export const Image = ({ id }: { id: string }) => {
  const img =
    useLiveQuery(async () => {
      return db.images.where('id').equals(id).first();
    }) || null;

  return (
    <>
      {img ? (
        <img
          src={img.dataUrl}
          className="mx-auto h-auto max-h-[70vh] w-auto rounded-md"
          alt={'the capture of the poster'}
        />
      ) : null}
    </>
  );
};
