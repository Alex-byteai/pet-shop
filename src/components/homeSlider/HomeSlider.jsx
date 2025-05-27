import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import './HomeSlider.css';

import promo1 from '../../assets/images/promotions/promotion-1.jpg';
import promo2 from '../../assets/images/promotions/promotion-2.jpg';
import promo3 from '../../assets/images/promotions/promotion-3.jpg';
import promo4 from '../../assets/images/promotions/promotion-4.jpg';



const HomeSlider = () => {
  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{ delay: 2500, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      navigation={true}
      modules={[Autoplay, Pagination, Navigation]}
      className="HomeSlider"
    >
      <SwiperSlide><img src={promo1} alt="Promoción 1" /></SwiperSlide>
      <SwiperSlide><img src={promo2} alt="Promoción 2" /></SwiperSlide>
      <SwiperSlide><img src={promo3} alt="Promoción 3" /></SwiperSlide>
      <SwiperSlide><img src={promo4} alt="Promoción 4" /></SwiperSlide>
    </Swiper>
  );
};

export default HomeSlider;