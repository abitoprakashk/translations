import React from 'react'
import {useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import StudentsListStyles from '../../StudentsList.module.css'
import userProfileImg from '../../../../../../../../../assets/images/icons/user-profile.svg'
import {getAmountFixDecimalWithCurrency} from '../../../../../../../../../utils/Helpers'
import {Para, PARA_CONSTANTS} from '@teachmint/krayon'

export const StudentDetails = ({rowData, studentDetails}) => {
  const {t} = useTranslation()
  return (
    <div className={StudentsListStyles.flex}>
      <img
        className={StudentsListStyles.img}
        src={studentDetails?.img_url || userProfileImg}
        alt={t('userImageAltText')}
      />
      <div className={StudentsListStyles.flexCol}>
        <div>{rowData.student_name || 'NA'}</div>
        <div>{rowData.phone_number || 'NA'}</div>
      </div>
    </div>
  )
}

export const StudentDueAmount = ({rowData}) => {
  const {instituteInfo} = useSelector((state) => state)
  return (
    <span>
      {getAmountFixDecimalWithCurrency(
        rowData.student.amount,
        instituteInfo.currency
      )}
    </span>
  )
}

export const StudentActions = ({
  rowData,
  index,
  handleModifySingleRecord,
  handleDeleteSingleRecord,
}) => {
  const {t} = useTranslation()

  return (
    <div className={StudentsListStyles.actions}>
      <Para
        textSize={PARA_CONSTANTS.TEXT_SIZE.X_LARGE}
        type={PARA_CONSTANTS.TYPE.PRIMARY}
        weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
        onClick={() => handleModifySingleRecord(rowData)}
        className={StudentsListStyles.actionLabel}
      >
        {t('previousSessionDuesModifyButton')}
      </Para>
      <Para
        textSize={PARA_CONSTANTS.TEXT_SIZE.X_LARGE}
        type={PARA_CONSTANTS.TYPE.ERROR}
        weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
        onClick={() => handleDeleteSingleRecord(rowData, index)}
        className={StudentsListStyles.actionLabel}
      >
        {t('delete')}
      </Para>
    </div>
  )
}
