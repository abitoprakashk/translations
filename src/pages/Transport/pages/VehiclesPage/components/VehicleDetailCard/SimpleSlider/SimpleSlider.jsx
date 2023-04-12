import {useState} from 'react'
import classNames from 'classnames'
import styles from './simpleSlider.module.css'
import {Icon} from '@teachmint/krayon'

export default function SimpleSlider({options, initialPage = 0}) {
  if (!Array.isArray(options) || options.length === 0) return null

  const [currentPage, setCurrentPage] = useState(initialPage)

  const onBackArrowClick = () => {
    if (currentPage === 0) return
    setCurrentPage(currentPage - 1)
  }
  const onForwardArrowClick = () => {
    if (currentPage === options.length - 1) return
    setCurrentPage(currentPage + 1)
  }

  return (
    <div className={styles.slider}>
      {currentPage !== 0 && (
        <Icon
          name="backArrow"
          className={classNames(styles.backArrow)}
          onClick={onBackArrowClick}
        />
      )}
      {currentPage !== options.length - 1 && (
        <Icon
          name="forwardArrow"
          className={classNames(styles.forwardArrow)}
          onClick={onForwardArrowClick}
        />
      )}
      {options[currentPage]}
    </div>
  )
}
