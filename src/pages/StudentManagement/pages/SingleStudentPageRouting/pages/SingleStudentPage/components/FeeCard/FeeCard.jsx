import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import FeeSummary from './Summary'
import SliderStudentDetail from '../../../../../../../../components/SchoolSystem/StudentDirectory/SliderStudentDetail'
import {fetchFeeCategoriesRequestedAction} from '../../../../../../../fee/redux/feeStructure/feeStructureActions'
import {useFeeStructure} from '../../../../../../../fee/redux/feeStructure/feeStructureSelectors'
import SectionOverviewCard from '../../../../../../components/SectionOverviewCard/SectionOverviewCard'
import styles from './FeeCard.module.css'
import {checkPermission} from '../../../../../../../../utils/Permssions'
import {PERMISSION_CONSTANTS} from '../../../../../../../../utils/permission.constants'
import {checkSubscriptionType} from '../../../../../../../../utils/Helpers'
import {INSTITUTE_TYPES} from '../../../../../../../../constants/institute.constants'
import {events} from '../../../../../../../../utils/EventsConstants'

export default function FeeCard({currentStudent}) {
  const [showSlider, setShowSlider] = useState(false)

  const {feeTypes} = useFeeStructure()
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const usersPermission = useSelector(
    (state) => state?.globalData?.userRolePermission
  )
  const {instituteInfo} = useSelector((state) => state)
  const isPremium = checkSubscriptionType(instituteInfo)
  const eventManager = useSelector((state) => state.eventManager)

  useEffect(() => {
    if (
      checkPermission(
        usersPermission,
        PERMISSION_CONSTANTS.feeModuleController_getStudentFeeDetails_read
      ) &&
      isPremium
    ) {
      if (feeTypes?.length === 0) {
        dispatch(fetchFeeCategoriesRequestedAction())
      }
    }
  }, [feeTypes])

  const {data} = useSelector(
    (state) => state.studentProfileFeeAndWalletTab.feeTab.summary
  )

  return (
    checkPermission(
      usersPermission,
      PERMISSION_CONSTANTS.feeModuleController_getStudentFeeDetails_read
    ) &&
    instituteInfo?.institute_type !== INSTITUTE_TYPES.COLLEGE && (
      <SectionOverviewCard
        cardLabel={t('feeSummary')}
        icon="rupeeSymbol1"
        actionLabel={t('view')}
        actionHandle={() => {
          eventManager.send_event(events.SIS_VIEW_FEE_SUMMARY_CLICKED_TFI)
          setShowSlider(true)
        }}
        classes={{header: styles.header, iconFrame: styles.iconFrame}}
      >
        {currentStudent && (
          <div className={styles.body}>
            <FeeSummary data={data} />
          </div>
        )}

        {showSlider && (
          <SliderStudentDetail
            setSliderScreen={setShowSlider}
            phoneNumber={currentStudent?.phone_number}
            studentId={currentStudent?._id}
            localLoader={false}
            width={'870'}
            selectedSliderTab={'FEE_HISTORY'}
          />
        )}
      </SectionOverviewCard>
    )
  )
}
