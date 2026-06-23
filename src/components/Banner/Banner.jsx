import React, { useState, useEffect } from 'react';
import './Banner.css';
import ban1Image from '../../img/banner1.jpg';
import ban2Image from '../../img/banner2.jpg';

const Banner = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const banners = [
    { id: 1, src: ban1Image, alt: "Banner 1" },
    { id: 2, src: ban2Image, alt: "Banner 2" }
];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }, 5000); // 5 giây

        return () => clearInterval(interval);
    }, [banners.length]);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? banners.length - 1 : prevIndex - 1));
    };

    return (
        <div className="banner-carousel">
         <div className="banner-wrapper">
        {banners.map((banner, index) => ( 
            <div
                key={banner.id} 
                className={`banner-slide ${index === currentIndex ? 'active' : ''}`} 
            >
                <img
                    src={banner.src}
                    alt={banner.alt}
                    className="banner-image"
                />
            </div>
        ))}
    </div>

            <button className="nav-btn prev" onClick={prevSlide}>&#10094;</button>
            <button className="nav-btn next" onClick={nextSlide}>&#10095;</button>

            <div className="banner-dots">
                {banners.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
};

export default Banner;