import React, {useState, useRef, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {useOutsideClickHandler} from '@teachmint/common'
import styles from './OrgAcademicSession.module.css'
import {Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import instituteDefaultImg from '../../../../assets/images/icons/sidebar/institute-default.svg'
import classNames from 'classnames'

export default function OrgAcademicSession() {
  const {instituteListInfo} = useSelector((state) => state)
  const [showSessionDropdown, setShowSessionDropdown] = useState(false)
  const [totalSession, setTotalSession] = useState(0)

  const wrapperRef = useRef(null)
  useOutsideClickHandler(wrapperRef, () => {
    setShowSessionDropdown(false)
  })

  useEffect(() => {
    if (instituteListInfo) {
      const sum = instituteListInfo.reduce(
        (partialSum, institute) =>
          partialSum +
          institute.sessions?.filter((session) => session.active_status === 1)
            ?.length,
        0
      )
      setTotalSession(sum)
    }
  }, [instituteListInfo])

  return (
    <div ref={wrapperRef}>
      <div
        className={styles.academicSessionContainer}
        onClick={() => {
          setShowSessionDropdown(!showSessionDropdown)
        }}
      >
        <Icon
          color="basic"
          name="eventAvailable"
          size={ICON_CONSTANTS.SIZES.XX_SMALL}
          type="outlined"
        />
        {totalSession} active sessions
        <Icon
          color="secondary"
          name="chevronDown"
          size={ICON_CONSTANTS.SIZES.X_SMALL}
          type="outlined"
        />
      </div>

      {showSessionDropdown && (
        <div
          className={classNames(
            styles.academicSessionDropdownItemContainer,
            styles.cursorDisable
          )}
        >
          {instituteListInfo?.map((institute) => (
            <div
              className={styles.academicSessionDropdownItem}
              key={institute?._id}
            >
              <div className={classNames(styles.instituteHeading)}>
                <img
                  className={styles.schoolImg}
                  src={institute?.ins_logo || instituteDefaultImg}
                  alt=""
                />
                {institute.name}
              </div>
              <div className={styles.sessionList}>
                {institute?.sessions?.map((session) =>
                  session.active_status === 1 ? (
                    <div className={styles.sessionCard} key={session?._id}>
                      {session.name}
                    </div>
                  ) : null
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
