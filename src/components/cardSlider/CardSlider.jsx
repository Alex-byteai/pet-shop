import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./CardSlider.css";

import { Pagination, Navigation } from "swiper/modules";

const CardSlider = ( {children} ) => {
  return (
    <>
      <Swiper
        slidesPerView={3}
        centeredSlides={true}
        spaceBetween={30}
        pagination={{
          type: 'fraction',
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        {Array.isArray(children) ? (
          children.map((child, index) => (
            <SwiperSlide key={index}>
              {child}
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide>
            {children}
          </SwiperSlide>
        )}
      </Swiper>
    </>
  );
};


export default CardSlider;