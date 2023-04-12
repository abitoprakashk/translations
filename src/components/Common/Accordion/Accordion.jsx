import React from 'react'

export default function Accordion({
  title,
  icon,
  iconSelected,
  isOpen,
  isLeafNode,
  handleActions,
  children = null,
}) {
  return (
    <div>
      <div
        className={`flex px-3 py-4 items-center justify-between rounded-lg tm-bdr-gy-3 cursor-pointer ${
          isOpen && isLeafNode ? 'tm-bgcr-bl-2' : 'tm-bgcr-wh-1'
        }`}
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
            className={`tm-para-14 ${
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
          className="w-3 h-3"
        />
      </div>
      {isOpen && children}
    </div>
  )
}
