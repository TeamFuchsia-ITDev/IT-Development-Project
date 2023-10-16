import React from 'react';
import SwiperCore  from 'swiper/core';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; 
import 'swiper/css/effect-fade';


interface CarouselProps {
  cards: JSX.Element[];
  slidesPerView: number;
  loop : boolean;
}

const Carousel = ({ cards, slidesPerView, loop }: CarouselProps) => {
  return (
    <Swiper
      spaceBetween={30}
      slidesPerView={slidesPerView} 
      effect="fade"
      loop={loop}
    >
      {cards.map((card, index) => (
        <SwiperSlide key={index}>{card}</SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Carousel;
