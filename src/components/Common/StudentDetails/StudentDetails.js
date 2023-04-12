import React from 'react'
import styles from './StudentDetails.module.css'
import {Avatar, Badges, Icon, ICON_CONSTANTS, Para} from '@teachmint/krayon'
import {useDispatch} from 'react-redux'
import {setSliderScreenAction} from '../../../pages/fee/redux/feeCollectionActions'
import {
  SliderScreens,
  STUDENT_NAME_SECTION_TRUNCATE_LIMIT,
} from '../../../pages/fee/fees.constants'
import {t} from 'i18next'
import classNames from 'classnames'
import Dot from '../../../assets/images/icons/dot.svg'
import {truncateTextWithTooltip} from '../../../utils/Helpers'

export default function StudentDetails({
  fullName = '',
  studentData = {},
  phoneNumber = '',
  enrollmentNumber = '',
  verificationStatus = '',
  classes = {},
  selectedSliderTab = 'BASIC_INFO',
}) {
  const dispatch = useDispatch()
  const joinTrans = t('joined')
  const notJoinTrans = t('notJoined')
  return (
    <div className={classNames('flex gap-2', classes?.wrapper)}>
      <div>
        <Avatar name={fullName} onClick={() => {}} size={'l'} />
      </div>
      <div>
        <div
          className={classNames(styles.studentProfile, classes?.studentName)}
          onClick={() => {
            dispatch(
              setSliderScreenAction(SliderScreens.STUDENT_DETAILS_SLIDER, {
                ...studentData,
                selectedSliderTab,
              })
            )
          }}
        >
          {truncateTextWithTooltip(
            fullName,
            STUDENT_NAME_SECTION_TRUNCATE_LIMIT
          )}
        </div>
        <div className="flex gap-2 items-center">
          {phoneNumber && (
            <div className="flex">
              <div className={styles.phoneNumber}>
                <Icon
                  name="call"
                  size={ICON_CONSTANTS.SIZES.XX_SMALL}
                  type={ICON_CONSTANTS.TYPES.SECONDARY}
                />
                <Para>{phoneNumber}</Para>
              </div>
            </div>
          )}
          {enrollmentNumber && (
            <div className="flex gap-2 items-center">
              <img src={Dot} />
              <Para>ID: {enrollmentNumber}</Para>
            </div>
          )}
          {verificationStatus && (
            <div className="flex gap-2 items-center ">
              <img src={Dot} />
              <Para>
                <Badges
                  label={verificationStatus === 1 ? joinTrans : notJoinTrans}
                  showIcon={false}
                  type={verificationStatus === 1 ? 'success' : 'error'}
                />
              </Para>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
