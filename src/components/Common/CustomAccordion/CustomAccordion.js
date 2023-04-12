import React from 'react'
import styles from './CustomAccordion.module.css'

export default function CustomAccordion({
  title,
  icon,
  iconSelected,
  isOpen,
  isLeafNode,
  handleActions,
  children = null,
}) {
  return (
    <div className={styles.container}>
      <div
        className={`flex px-3 py-4 items-center justify-between rounded-lg tm-bdr-gy-3 cursor-pointer tm-bgcr-wh-1`}
        onClick={handleActions}
      >
        <div className="flex items-center">
          {icon && iconSelected && (
            <img
              src={isOpen ? iconSelected : icon}
              alt=""
              className="w-5 h-5 mr-3"
            />
          )}
          <div
            className={`tm-para-16 ${
              isOpen && isLeafNode ? 'tm-cr-wh-1' : 'tm-color-text-primary'
            }`}
          >
            {title}
          </div>
        </div>
        <img
          src={
            isOpen
              ? isLeafNode
                ? 'https://storage.googleapis.com/tm-assets/icons/white/right-arrow-white.svg'
                : 'https://storage.googleapis.com/tm-assets/icons/primary/down-arrow-primary.svg'
              : 'https://storage.googleapis.com/tm-assets/icons/primary/right-arrow-primary.svg'
          }
          className={styles.icon}
        />
      </div>
      {isOpen && children}
    </div>
  )
}
