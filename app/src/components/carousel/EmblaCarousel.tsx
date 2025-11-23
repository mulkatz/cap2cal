import React from 'react';
import { NextButton, PrevButton, usePrevNextButtons } from './EmblaCarouselArrowButtons';
import { SelectedSnapDisplay, useSelectedSnapDisplay } from './EmblaCarouselSelectedSnapDisplay';
import useEmblaCarousel from 'embla-carousel-react';

const EmblaCarousel = (props: any) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi);
  const { selectedSnap, snapCount } = useSelectedSnapDisplay(emblaApi);

  return (
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((value: any, index: number) => (
            <div className="embla__slide w-full" key={index}>
              <div className="embla__slide__number w-full">{value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between px-2">
        <span
          className={
            selectedSnap === 0
              ? 'pointer-events-none flex items-center opacity-0'
              : 'flex items-center justify-center opacity-100'
          }>
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
        </span>
        <SelectedSnapDisplay selectedSnap={selectedSnap} snapCount={snapCount} />
        <span className={selectedSnap + 1 === snapCount ? 'pointer-events-none opacity-0' : 'opacity-100'}>
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />{' '}
        </span>
      </div>
    </section>
  );
};

export default EmblaCarousel;
