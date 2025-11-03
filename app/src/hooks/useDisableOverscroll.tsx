import { useEffect } from 'react';
import { disableBounceOverscroll } from '../utils.ts';

export const useDisableOverscroll = () => {
  useEffect(() => {
    disableBounceOverscroll();
  }, []);

  return <></>;
};
