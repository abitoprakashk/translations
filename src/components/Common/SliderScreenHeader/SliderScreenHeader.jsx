// import {TabGroup} from '@teachmint/krayon'
import classNames from 'classnames'
import React from 'react'
import LinearTabOptions from '../LinearTabOptions/LinearTabOptions'

export default function SliderScreenHeader({
  icon,
  title,
  options = null,
  optionsSelected = null,
  handleChange = null,
  iconHtml = null,
  rightSection = null,
  capitalizeTitle = true,
}) {
  return (
    <div
      className={classNames(
        'tm-bkcr-gy-5 rounded-t-3xl lg:rounded-tr-none pt-4 px-5 lg:px-10 lg:pt-5',
        {
          'pb-4 lg:pb-5': !options,
        }
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {typeof icon === 'string' && (
            <img src={icon} alt="" className="w-4 h-5 lg:w-5 lg:h-5 mr-2" />
          )}
          {typeof icon === 'object' && icon}
          {iconHtml}
          <div
            className={classNames('tm-hdg tm-hdg-16 lg:tm-hdg-20', {
              capitalize: capitalizeTitle,
            })}
          >
            {title}
          </div>
        </div>
        {rightSection ?? ''}
      </div>
      {options && (
        <div className="mt-2 lg:mt-6">
          <LinearTabOptions
            options={options}
            selected={optionsSelected}
            handleChange={handleChange}
          />
          {/* <TabGroup
            moredivClass="TabGroup-stories-module__moreDiv__2gikz"
            onTabClick={() => {}}
            selectedTab={optionsSelected}
            tabOptions={options}
          /> */}
        </div>
      )}
    </div>
  )
}
