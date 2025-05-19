import { Swiper, SwiperSlide } from "swiper/react";
import { MdOutlinePets } from "react-icons/md";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./CardSlider.css";

import { Pagination, Navigation } from "swiper/modules";

const CardSlider = ( {children} ) => {
  return (
    <>
      <Swiper
        className="card-slider"
        initialSlide={12/2}
        slidesPerView={3}
        centeredSlides={true}
        spaceBetween={30}
        pagination={{
          clickable: false,
        }}
        navigation={true}
        modules={[Pagination, Navigation]}

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