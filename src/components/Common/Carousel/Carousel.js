import React, {useState} from 'react'
import {Carousel} from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import styles from './Carousel.module.css'

const CarouselComponent = ({items = [], ...rest}) => {
  const [selectedItem, setSelectedItem] = useState(0)
  return (
    <div className={styles.carouselDiv}>
      <Carousel
        showArrows
        centerMode={true}
        centerSlidePercentage={100}
        showStatus={false}
        selectedItem={selectedItem}
        onClickThumb={setSelectedItem}
        infiniteLoop={true}
        {...rest}
      >
        {items &&
          items.length &&
          items.map((item) => (
            <div key={item}>
              <img src={item} />
            </div>
          ))}
      </Carousel>
    </div>
  )
}

export default CarouselComponent
