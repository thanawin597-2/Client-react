import React from "react";
import Carousel from 'react-bootstrap/Carousel'; 
import slideImage1 from '../../assets/images/hotel_1.png'; 
import slideImage2 from '../../assets/images/hotel_02.png'; 
import slideImage3 from '../../assets/images/hotel_3.png'; 

const Parallax = () => {
    // 1. กำหนด Style สำหรับ Wrapper (กำหนดความสูงคงที่)
    const imageWrapperStyle = {
        height: '600px', // ความสูงคงที่สำหรับทุกสไลด์
        overflow: 'hidden' 
    };
    
    // 2. กำหนด Style สำหรับรูปภาพ (ให้เต็มพื้นที่และครอป)
    const imageStyle = {
        width: '100%',
        height: '100%',
        objectFit: 'cover' // ครอปรูปภาพให้เต็มพื้นที่ 600px
    };

    return (
        <Carousel fade className="parallax mb-5"> 
            
            <Carousel.Item>
                {/* Wrapper div สำหรับควบคุม height */}
                <div style={imageWrapperStyle}>
                    <img
                        className="d-block w-100"
                        src={slideImage1} 
                        alt="First slide - Hotel View 1"
                        style={imageStyle} 
                    />
                </div>
                
                <Carousel.Caption>
                    <h3  className="h3-parallax">An Underwater Oasis</h3>
                    <p className="p-parallax">Relax in our stunning natural grotto with views of the marine life.</p>
                </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
                {/* Wrapper div สำหรับควบคุม height */}
                <div style={imageWrapperStyle}>
                    <img 
                        className="d-block w-100" 
                        src={slideImage2} 
                        alt="Second slide - Hotel View 2" 
                        style={imageStyle}
                    />
                </div>
                <Carousel.Caption>
                    <h3  className="h3-parallax">Experience Grandeur</h3>
                    <p className="p-parallax">The perfect blend of luxury and stunning architecture awaits your stay.</p>
                </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
                {/* Wrapper div สำหรับควบคุม height */}
                <div style={imageWrapperStyle}>
                    <img 
                        className="d-block w-100" 
                        src={slideImage3} 
                        alt="Third slide - Hotel View 3" 
                        style={imageStyle}
                    />
                </div>
                <Carousel.Caption>
                    <h3 className="h3-parallax">Thrills & Family Fun</h3>
                    <p className="p-parallax">
                        Dive into adventure with our world-class water park facilities.
                    </p>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    );
}

export default Parallax;