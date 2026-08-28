"use client"

import Card from "../Card";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { useRef } from "react";


export default function TrendingTvSeries({ series }) {
    const swiperRef = useRef(null)

    return (
        <section className="py-8 px-4 sm:px-8 md:px-10 lg:px-16 bg-black text-white">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400 mb-4">
                Trending Tv Series
            </h2>

            <Swiper modules={[Autoplay]}
            onSwiper={(swiper) => {swiperRef.current = swiper}}
                loop={true}
                autoplay={{ delay: 0, disableOnInteraction: false, pauseOnMouseEnter: true }}
                speed={4000}
                spaceBetween={20}
                breakpoints={{
                    0: { slidesPerView: 3 },
                    768: { slidesPerView: 4 },
                    1024: { slidesPerView: 5 },
                    1280: { slidesPerView: 6 },
                    1536: {slidesPerView: 7}
                }}
            >
                {series.length > 0 ? (series.map((item) =>
                    <SwiperSlide key={item.id}>
                        <Card media={{ ...item, media_type: "tv" }} swiperRef={swiperRef}/>
                    </SwiperSlide>
                )) : (
                    <p className="text-gray-400"> No Trending Tv Series Found</p>
                )}

            </Swiper>


        </section>
    )



}