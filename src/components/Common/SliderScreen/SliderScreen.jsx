import classNames from 'classnames'
import {useRef} from 'react'
import {useOutsideClickHandler} from '@teachmint/common'
import PropTypes from 'prop-types'
import styles from './SliderScreen.module.css'

function SliderScreen({setOpen, children, width = '600', scroll = false}) {
  const wrapperRef = useRef(null)
  useOutsideClickHandler(wrapperRef, (e) => {
    setOpen(e)
  })
  return (
    <div className="tm-popup-bg flex items-end lg:justify-end">
      <div
        className={classNames(
          styles.sliderCard,
          'relative bg-white h-5/6 tm-w-full2 lg:h-full rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none',
          scroll ? 'overflow-y-scroll' : ''
        )}
        ref={wrapperRef}
        style={{width: `${width}px`}}
      >
        <div
          className={classNames(
            'hidden lg:flex absolute w-10 h-10 bg-white rounded-full top-4 -left-4 flex items-center justify-center tm-box-shadow1 cursor-pointer',
            styles.closeIcon
          )}
          onClick={setOpen}
        >
          <img
            src="https://storage.googleapis.com/tm-assets/icons/secondary/right-arrow-secondary.svg"
            className="w-4 h-4"
            alt=""
          />
        </div>
        {children}
      </div>
    </div>
  )
}

SliderScreen.propTypes = {
  setOpen: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
}

export default SliderScreen
