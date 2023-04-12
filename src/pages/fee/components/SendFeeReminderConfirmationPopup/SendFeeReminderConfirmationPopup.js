import React from 'react'
import styles from './SendFeeReminderConfirmationPopup.module.css'
import {Trans, useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import {Icon} from '@teachmint/common'
import ConfirmationPopup from '../../../../components/Common/ConfirmationPopup/ConfirmationPopup'
import classNames from 'classnames'

const SendFeeReminderConfirmationPopup = ({
  getStudentIdsLoader = false,
  setShowPopup,
  handleSendReminder,
  studentCount = 0,
  feesReminderLoading,
  isClassLevel = false,
}) => {
  const {t} = useTranslation()
  const {instituteInfo} = useSelector((state) => state)
  const popupContent = () => (
    <div>
      <div>
        <Trans i18nKey={'sendReminderPopupSubtitle'}>
          Reminder will be sent to
          <span className={styles.sendReminderPopupSubtitleStudentCount}>
            {`${studentCount}`}
          </span>
          students and parents, who have due fee amount, via SMS and app
          notification
        </Trans>
      </div>
      <div className={styles.styleBgData}>
        <Icon name="chat" color="secondary" size="xxs" />
        <p className={styles.sendReminderPopupBodyText}>
          {t('sendReminderPopupBodyText', {currency: instituteInfo.currency})}
        </p>
      </div>
      {/* <div className={styles.noDueData}>{t('sendReminderPopupFootText')}</div> */}
    </div>
  )

  const confirmationPopupWhenZeroStudent = () => (
    <ConfirmationPopup
      onClose={setShowPopup}
      iconClassName={classNames(
        styles.reminderIconClass,
        styles.reminderIconClassHigherSpecificity
      )}
      icon={
        <div className={styles.confirmationPopupIcon}>
          <Icon name="alert" color="success" size={'4xl'} />
        </div>
      }
      title={t('sendReminderPopupTitle')}
      desc={
        getStudentIdsLoader ? null : (
          <p className={styles.sendReminderPopupBodyText}>
            {isClassLevel
              ? t('sendReminderPopupBodyWhenNoStudentsClassLevel')
              : t('sendReminderPopupBodyWhenNoStudentsInstituteLevel')}
          </p>
        )
      }
      hideButtons={getStudentIdsLoader}
      primaryBtnText={t('ackPopupBtnText')}
      primaryBtnStyle={`tm-btn2-blue w-9/10`}
      closeActive={false}
    />
  )

  return (
    <>
      {studentCount === 0 ? (
        confirmationPopupWhenZeroStudent()
      ) : (
        <ConfirmationPopup
          onClose={setShowPopup}
          onAction={studentCount === 0 ? () => {} : handleSendReminder}
          iconClassName={classNames(
            styles.reminderIconClass,
            styles.reminderIconClassHigherSpecificity
          )}
          icon={
            <div className={styles.confirmationPopupIcon}>
              <Icon name="alert" color="success" size={'4xl'} />
            </div>
          }
          title={t('sendReminderPopupTitle')}
          desc={
            getStudentIdsLoader ? (
              <div className={classNames(styles.loader)} />
            ) : (
              popupContent()
            )
          }
          primaryBtnText={t('btnTextCancel')}
          secondaryBtnText={t('sendReminder')}
          hideButtons={feesReminderLoading}
          closeActive={false}
          loaderClassName={styles.loader}
        />
      )}
    </>
  )
}

export default SendFeeReminderConfirmationPopup
