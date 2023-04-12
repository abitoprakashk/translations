import classNames from 'classnames'
import React from 'react'
import {useTranslation} from 'react-i18next'
import Permission from '../Permission/Permission'
import {Para, PARA_CONSTANTS} from '@teachmint/krayon'

export default function LinearTabOptions({
  options,
  selected,
  handleChange,
  className,
  shouldTranslation = false,
}) {
  const {t} = useTranslation()
  return (
    <div
      className={classNames(
        'flex',
        'tm-bdr-b-gy-3',
        'overflow-auto',
        className
      )}
    >
      {options.map(({id, label, permissionId = null}) => {
        const isSelected = id === selected
        return permissionId ? (
          <Permission permissionId={permissionId}>
            <div
              key={id}
              className={classNames(
                'w-fit mr-6 pt-2 pb-3 tm-para lg:tm-para-16 cursor-pointer whitespace-nowrap',
                {'tm-bdr-b-bl-2': isSelected}
              )}
              onClick={() => (handleChange ? handleChange(id) : null)}
            >
              <Para
                type={
                  isSelected
                    ? PARA_CONSTANTS.TYPE.PRIMARY
                    : PARA_CONSTANTS.TYPE.TEXT_SECONDARY
                }
                textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
              >
                {shouldTranslation ? t(label) : label}
              </Para>
            </div>
          </Permission>
        ) : (
          <div
            key={id}
            className={classNames(
              'w-fit mr-6 pt-2 pb-3 tm-para lg:tm-para-16 cursor-pointer whitespace-nowrap',
              {'tm-bdr-b-bl-2': isSelected}
            )}
            onClick={() => (handleChange ? handleChange(id) : null)}
          >
            <Para
              type={
                isSelected
                  ? PARA_CONSTANTS.TYPE.PRIMARY
                  : PARA_CONSTANTS.TYPE.TEXT_SECONDARY
              }
              textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
            >
              {shouldTranslation ? t(label) : label}
            </Para>
          </div>
        )
      })}
    </div>
  )
}
