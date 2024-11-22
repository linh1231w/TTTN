import React, { useState, useEffect } from 'react';
import SliderService from '../../../Service/SliderSv';
import { motion, AnimatePresence } from 'framer-motion';

function Slider() {
    const [sliders, setSliders] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        SliderService.getAll()
            .then(response => {
                setSliders(response.data);
            })
            .catch(error => {
                console.error('Error fetching slider data:', error);
            });
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % sliders.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + sliders.length) % sliders.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const slideVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
        exit: { opacity: 0, scale: 1.1, transition: { duration: 0.4 } }
    };

    const contentVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.4, delay: 0.1 } }
    };

    return (
        <section className="section-slide">
            <div className="wrap-slick1 rs2-slick1">
                <motion.button 
                    className="arrow-slick1 prev-slick1 slick-arrow" 
                    onClick={prevSlide}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <i className="zmdi zmdi-caret-left"></i>
                </motion.button>
                <div className="slick1 slick-initialized slick-slider slick-dotted">
                    <div className="slick-list draggable">
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={currentSlide}
                                className="slick-track" 
                                variants={slideVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                {sliders.map((slider, index) => (
                                    index === currentSlide && (
                                        <div
                                            key={slider.id}
                                            className="item-slick1 bg-overlay1 slick-slide slick-current slick-active"
                                            data-thumb={`http://localhost:5011/api/admin${slider.image}`}
                                            data-caption={slider.name}
                                            style={{
                                                backgroundImage: `url(http://localhost:5011/api/admin${slider.image})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                width: '100%',
                                                height: '90vh',
                                                position: 'relative'
                                            }}
                                            role="tabpanel"
                                            id={`slick-slide0${index}`}
                                            aria-describedby={`slick-slide-control0${index}`}
                                        >
                                            <div className="container h-full">
                                                <div className="flex-col-c-m h-full p-t-80 p-b-50 respon5">
                                                    <motion.div 
                                                        className="layer-slick1 animated visible-true" 
                                                        variants={contentVariants}
                                                    >
                                                        <span className="ltext-201 txt-center cl0 respon2">{slider.name}</span>
                                                    </motion.div>
                                                    <motion.div 
                                                        className="layer-slick1 animated visible-true" 
                                                        variants={contentVariants}
                                                    >
                                                        <h2 className="ltext-103 txt-center cl0 p-t-20 p-b-30 respon1">{slider.description}</h2>
                                                    </motion.div>
                                                    <motion.div 
                                                        className="layer-slick1 animated visible-true" 
                                                        variants={contentVariants}
                                                    >
                                                        <motion.a 
                                                            href={slider.link} 
                                                            className="flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn2 p-lr-15 trans-04"
                                                            whileHover={{ scale: 1.03 }}
                                                            whileTap={{ scale: 0.97 }}
                                                        >
                                                            Shop Now
                                                        </motion.a>
                                                    </motion.div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
                <div className="wrap-slick1-dots p-lr-10">
                    <ul className="slick1-dots" role="tablist" style={{}}>
                        {sliders.map((slider, index) => (
                            <motion.li 
                                key={slider.id} 
                                className={index === currentSlide ? 'slick-active' : ''} 
                                role="presentation"
                                onClick={() => goToSlide(index)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <img src={`http://localhost:5011/api/admin${slider.image}`} alt={slider.name} />
                                <span className="caption-dots-slick1">{slider.name}</span>
                            </motion.li>
                        ))}
                    </ul>
                </div>
                <motion.button 
                    className="arrow-slick1 next-slick1 slick-arrow" 
                    onClick={nextSlide}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <i className="zmdi zmdi-caret-right"></i>
                </motion.button>
            </div>
        </section>
    );
}

export default Slider;