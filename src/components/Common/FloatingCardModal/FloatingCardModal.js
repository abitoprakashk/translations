import React, {forwardRef, useEffect, useRef, useImperativeHandle} from 'react'
import {useState} from 'react'
import styles from './FloatingCardModal.module.scss'
import FilterBlueIcon from '../../../assets/images/icons/filterBlue.svg'
import FilterWhiteIcon from '../../../assets/images/icons/filterWhite.svg'
import {Modal, useOutsideClickHandler} from '@teachmint/common'
import {getScreenWidth} from '../../../utils/Helpers'
import cx from 'classnames'
import {t} from 'i18next'

let FloatingCardModal = forwardRef((props, ref) => {
  const {
    buttonText = 'addFilters',
    children,
    onCloseAction,
    onOpenAction,
    rightAlign = false,
    wrapperClass,
  } = props
  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    if (isOpen && onOpenAction) onOpenAction()
  }, [isOpen])

  const toggle = () => {
    setOpen(!isOpen)
  }

  useImperativeHandle(ref, () => ({
    closeFilter: () => {
      setOpen(false)
    },
  }))

  const wrapperRef = useRef(null)
  useOutsideClickHandler(wrapperRef, () => {
    onCloseAction && onCloseAction()
    setOpen(false)
  })

  const closeModal = (e) => {
    e.stopPropagation()
    const {className} = e.target
    if (
      className.includes('Modal-module_block') &&
      className.includes('Modal-module_modal')
    )
      toggle()
  }
  return (
    <div className={styles.container} ref={wrapperRef}>
      {getScreenWidth() > 700 ? (
        <button
          className={cx('tm-btn2-white-blue flex', styles.btn)}
          onClick={toggle}
        >
          <img src={FilterBlueIcon} alt="" />
          <span>{t(buttonText)}</span>
        </button>
      ) : (
        <button className={cx('tm-btn2-blue', styles.btn)} onClick={toggle}>
          <img src={FilterWhiteIcon} alt="" />
          <span>{t(buttonText)}</span>
        </button>
      )}
      {isOpen && (
        <>
          <div
            className={cx(styles.desktop_wrapper, wrapperClass, {
              [styles.rightAlign]: rightAlign,
            })}
          >
            {children}
          </div>
          <div className={styles.mobile_wrapper} onClick={(e) => closeModal(e)}>
            <Modal show={true}>{children}</Modal>
          </div>
        </>
      )}
    </div>
  )
})

FloatingCardModal.displayName = 'FloatingCardModal'
export default FloatingCardModal
