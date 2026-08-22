import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import './GalleryCarousel.css';

export default function GalleryCarousel() {
  // Assuming the user will upload 1.webp, 2.webp, etc. up to 10
  const totalImages = 10;
  const slides = Array.from({ length: totalImages }, (_, i) => `/gallery/${i + 1}.webp`);

  return (
    <section className="gallery-section section" id="gallery">
      <div className="container">
        <div className="section-header reveal">
          <h2 className="section-title">Past Event Highlights</h2>
          <p className="section-subtitle">
            Glimpses from our previous hackathons and events
          </p>
        </div>
      </div>
      
      <div className="gallery-container reveal reveal-delay-1">
        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          coverflowEffect={{
            rotate: 20,
            stretch: 0,
            depth: 300,
            modifier: 1,
            slideShadows: true,
          }}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          navigation={true}
          modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
          className="mySwiper"
          loop={true}
        >
          {slides.map((src, index) => (
            <SwiperSlide key={index}>
              <div className="swiper-slide-inner">
                {/* Fallback styling for when images aren't uploaded yet */}
                <img 
                  src={src} 
                  alt={`Event Highlight ${index + 1}`} 
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="image-placeholder" style={{ display: 'none' }}>
                  <span>Upload {index + 1}.webp</span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
