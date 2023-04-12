import React, {useRef, useState} from 'react'
import {useSelector} from 'react-redux'
import styles from './DuplicateUserCard.module.scss'
import classNames from 'classnames'
import {events} from '../../../utils/EventsConstants'
import {Trans} from 'react-i18next'
import userDefaultImg from '../../../assets/images/icons/user-profile.svg'
import {useOutsideClickHandler} from '@teachmint/common'

export default function DuplicateUserCard({
  items,
  handleUpdateProfile,
  handleCreateNewProfile,
  hideCreateNew,
  userType,
}) {
  const wrapperRef = useRef(null)
  const [showDropdown, setShowDropdown] = useState(true)
  const {eventManager} = useSelector((state) => state)
  useOutsideClickHandler(wrapperRef, () => {
    setShowDropdown(false)
  })

  const renderHTML = (
    <div className={styles.mainContainer} ref={wrapperRef}>
      <p className={classNames(styles.heading, styles.topContainer)}>
        {items.length} existing {items.length > 1 ? 'accounts' : 'account'}{' '}
        found
      </p>
      <div
        className={classNames(
          styles.listContainer,
          'bg-white tm-border-radius1'
        )}
      >
        {items.map((item) => (
          <button
            className={classNames(styles.button, {
              [styles.disabled]: hideCreateNew,
            })}
            key={item._id}
            disabled={hideCreateNew}
            onClick={() => handleUpdateProfile(item._id, item.phone_number)}
          >
            <div
              className={classNames(
                'flex items-center tm-border1-dark-bottom',
                styles.card
              )}
            >
              <img
                src={item.img_url || userDefaultImg}
                alt=""
                className="w-9 h-9 lg:w-11 lg:h-11 mr-2 ml-3 cover rounded-full"
              ></img>
              <div className="w-9/12 tm-para tm-para-16 flex flex-col ml-2 items-start overflow-auto">
                <p className={styles.userName}>{item.name}</p>
                <div className="flex items-center mt-1">
                  <div className={styles.userId}>{item.phone_number}</div>
                  {item.classroom ? (
                    <>
                      <img
                        src="https://storage.googleapis.com/tm-assets/icons/secondary/dot-secondary.svg"
                        alt=""
                        className="w-1 h-1 mx-2"
                      />
                      <div className={styles.userId2}>{item.classroom}</div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
      {!hideCreateNew && (
        <button
          className={classNames(styles.button2, 'tm-border1-dark-top')}
          onClick={() => {
            eventManager.send_event(
              events[`ADD_AS_NEW_${userType.toUpperCase()}_CLICKED_TFI`]
            )
            handleCreateNewProfile()
          }}
        >
          <p className={styles.btnTxt2}>
            <Trans i18nKey="addAsNewUserType">Add as new {{userType}}</Trans>
          </p>
        </button>
      )}
    </div>
  )

  return showDropdown ? renderHTML : null
}
