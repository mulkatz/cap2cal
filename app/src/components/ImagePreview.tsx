import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../models/db.ts';

export const ImagePreview = ({ id }: { id: string }) => {
  const img =
    useLiveQuery(async () => {
      return db.images.where('id').equals(id).first();
    }) || null;

  return (
    <TransformWrapper>
      <TransformComponent
        wrapperStyle={
          {
            // borderWidth: '1px',
            // borderStyle: 'solid',
            // borderColor: '#41526A',
            // borderRadius: '12px',
            // overflow: 'hidden',
            // border-[1px] border-secondary
          }
        }>
        {/*<div className={'border-[1px] border-secondary shadow-2xl shadow-accentElevated'}>*/}
        <img src={img?.dataUrl} alt="captured image" />
        {/*</div>*/}
      </TransformComponent>
    </TransformWrapper>
  );
};
