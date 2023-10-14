import React from 'react';
import SwiperCore  from 'swiper/core';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; // Import Swiper CSS directly

// Install Swiper modules


interface CarouselProps {
  cards: JSX.Element[];
}

const Carousel = ({ cards }: CarouselProps) => {
  return (
    <Swiper
      spaceBetween={17} // Adjust the space between slides as needed
      slidesPerView={4} // Number of slides to show at a time
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
