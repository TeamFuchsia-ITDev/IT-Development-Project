import React from 'react';
import SwiperCore  from 'swiper/core';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; 
import 'swiper/css/effect-fade';


interface CarouselProps {
  cards: JSX.Element[];
}

const Carousel = ({ cards }: CarouselProps) => {
  return (
    <Swiper
      spaceBetween={17}
      slidesPerView={4} 
      navigation={{
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }}
    >
      {cards.map((card, index) => (
        <SwiperSlide key={index}>{card}</SwiperSlide>
      ))}

    </Swiper>
  );
};

export default Carousel;
