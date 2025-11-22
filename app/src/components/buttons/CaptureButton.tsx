import { IconCamera, IconCamera2, IconCamera3 } from '../../assets/icons';
import { ClipLoader } from 'react-spinners';
import imgButton from './../../assets/images/icon.png';
import { cn } from '../../utils.ts';
import { useTranslation } from 'react-i18next';
import { AppState } from '../../contexts/AppContext.tsx';

export const CaptureButton = ({ onClick, state }: { onClick: () => void; state: AppState }) => {
  const { t } = useTranslation();

  return (
    <>
      {state === 'camera' ? (
        <button
          onClick={onClick}
          className={cn(
            'flex h-[80px] w-[80px] origin-center items-center justify-center',
            // 'rounded-lg border-none bg-gradient-to-t from-[#1E96C8] to-[#37AEE2] text-base text-white',
            // "cursor-pointer select-none hover:from-[#17759C] hover:to-[#1D95C9]",
            'rounded-full border-none text-white shadow-[0_4px_14px_rgba(0,0,0,0.7)]',
            'cursor-pointer'
          )}>
          <img src={imgButton} alt="process" className="w-full" />
        </button>
      ) : (
        <button
          className={cn(
            'flex origin-center items-center justify-center',
            // 'rounded-[14px] border-[1px] border-secondary bg-primaryElevated p-0 text-[16px] text-white',
            'rounded-lg border-[2px] border-white/30 bg-gradient-to-t from-[#1f2e3d] to-[#2C4156] text-[16px] text-white shadow-[0_2px_6px_rgba(0.2,0.2,0.2,0.4)]',
            'cursor-pointer select-none'
          )}>
          <div onClick={onClick} className="flex items-center gap-[8px] px-[46px] py-[10px]">
            {state === 'loading' && (
              <div className={'flex h-[24px] w-[24px] items-center justify-center'}>
                <ClipLoader color={'#FFFFFF'} size={24} loading={false} />
              </div>
            )}
            {state === 'home' && <IconCamera3 size={24} className={'mb-0.5'} />}

            <span className="text-[26px] font-semibold">{t('general.ctaStart')}</span>
          </div>
        </button>
      )}
    </>
  );
};
