import React from 'react'
import s from './MultipleCheckboxWithImage.module.scss'
import cx from 'classnames'
import {checkPropKey} from '../../SchoolSystem/SectionDetails/SliderStudent'
import defaultUserImg from '../../../assets/images/icons/user-profile.svg'

export default function MultipleCheckbox({
  items,
  handleChange,
  extraField,
  emptyListText = ' No students found in this class',
}) {
  return (
    <div className={cx(s.list_container, 'bg-white tm-border-radius1 pb-6')}>
      {items && items.length ? (
        <>
          {items.map((item) => (
            <div
              key={item.num}
              className={cx('flex items-center tm-border1-dark-bottom')}
            >
              <input
                type="checkbox"
                checked={item.checked}
                onChange={(e) => handleChange(item.num, e.target.checked)}
                className="mx-4 mr-8"
                readOnly
              />
              <img
                src={item.img_url || defaultUserImg}
                alt=""
                className="w-9 h-9 lg:w-11 lg:h-11 mr-2 cover rounded-full"
              ></img>
              <div
                className={`w-full py-4 pr-4 ${
                  item.checked ? 'tm-hdg tm-hdg-16' : 'tm-para tm-para-16'
                }`}
              >
                <p>{item.title}</p>
                <p className="tm-para tm-para-14 mt-2">
                  {checkPropKey(extraField, item)}
                </p>
              </div>
            </div>
          ))}
          <div className={cx('flex items-center h-20')}>
            <p></p>
          </div>
        </>
      ) : (
        <div className="tm-para tm-para-14 flex justify-center items-center mt-8">
          <span>{emptyListText}</span>
        </div>
      )}
    </div>
  )
}
