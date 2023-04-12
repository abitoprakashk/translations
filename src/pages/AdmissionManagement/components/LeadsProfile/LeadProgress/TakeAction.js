import {useSelector} from 'react-redux'
import {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {
  Heading,
  HEADING_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  PlainCard,
} from '@teachmint/krayon'
import {
  admissionFormLeadProfileStatus,
  feeStatusLeadProfile,
  collectFeeModalTitle,
  admissionCrmFieldTypes,
} from '../../../utils/constants'
import {events} from '../../../../../utils/EventsConstants'
import FollowUps from '../../Common/FollowUps/FollowUps'
import SendSms from '../../Common/SendSms/SendSms'
import styles from './TakeAction.module.css'
import ProfileFees from './ProfileFees'
import {useAdmissionCrmSettings} from '../../../redux/admissionManagement.selectors'
import LeadProfileAdmissionForm from '../LeadProfileAdmissionForm/LeadProfileAdmissionForm'
import {calculateAmount} from '../../../utils/helpers'
import {getSymbolFromCurrency} from '../../../../../utils/Helpers'
import {DEFAULT_CURRENCY} from '../../../../../constants/common.constants'

export default function TakeAction({leadData}) {
  const {t} = useTranslation()
  const admissionCrmSettings = useAdmissionCrmSettings()
  const eventManager = useSelector((state) => state.eventManager)
  const {fee_settings: feesData} = admissionCrmSettings.data
  const instituteInfo = useSelector((state) => state.instituteInfo)
  const [showAdmissionForm, setShowAdmissionForm] = useState(false)
  const [showFollowupsModal, setShowFollowupsModal] = useState(false)
  const [showSmsModal, setShowSmsModal] = useState(false)
  const [showCollectFeeModal, setShowCollectFeeModal] = useState(false)
  const [collectFeesData, setCollectFeesData] = useState({})
  let formFee = feesData.form_fees.class_fees[leadData.class_id]
  let admissionFormFee = feesData.admission_fees.class_fees[leadData.class_id]
  let applicationFormFees = calculateAmount(formFee?.fee_amount, formFee?.tax)
  let applicationAdmissionFees = calculateAmount(
    admissionFormFee?.fee_amount,
    admissionFormFee?.tax
  )

  const handleCollectFee = (isEnquiryForm) => {
    const feeType = isEnquiryForm
      ? admissionCrmFieldTypes.ENQUIRY_FORM
      : admissionCrmFieldTypes.ADMISSION_FORM
    eventManager.send_event(
      isEnquiryForm
        ? events.ADMISSION_LEAD_PROFILE_FORM_FEE_CLICKED_TFI
        : events.ADMISSION_LEAD_PROFILE_ADMISSION_FEE_CLICKED_TFI
    )
    setShowCollectFeeModal(true)
    setCollectFeesData({
      feeType: feeType,
      collectAdmissionFeeStage: feesData.admission_fees_required
        ? feesData.admission_fees.collect_fee_stage_id
        : '',
      leadId: leadData?._id,
      currentLeadStageId: leadData?.lead_stage_id,
      title: collectFeeModalTitle[feeType],
      feesData: isEnquiryForm ? formFee : admissionFormFee,
    })
  }

  const renderCard = ({
    isPrefixIcon = true,
    prefixIcon,
    prefixIconType,
    label,
    suffixIcon = 'forwardArrow',
    className,
  }) => {
    return (
      <PlainCard className={className}>
        <div className={styles.cardContent}>
          {isPrefixIcon ? (
            <Icon
              name={prefixIcon}
              type={prefixIconType}
              size={ICON_CONSTANTS.SIZES.X_SMALL}
            />
          ) : (
            <p className={styles.currencyStyle}>{prefixIcon}</p>
          )}
          <p className={styles.cardText}>{label}</p>
          <Icon
            name={suffixIcon}
            size={ICON_CONSTANTS.SIZES.XX_SMALL}
            type={ICON_CONSTANTS.TYPES.SECONDARY}
            className={styles.icon}
          />
        </div>
      </PlainCard>
    )
  }

  if (leadData.isloading) {
    return <div className="loading" />
  }

  return (
    <div>
      {showAdmissionForm && (
        <LeadProfileAdmissionForm
          profileData={leadData}
          showAdmissionForm={showAdmissionForm}
          setShowAdmissionForm={setShowAdmissionForm}
        />
      )}
      {showFollowupsModal && (
        <FollowUps
          eventName="lead_profile"
          showModal={showFollowupsModal}
          setShowModal={setShowFollowupsModal}
          leadId={leadData?._id}
          isProfilePage={true}
        />
      )}
      {showSmsModal && (
        <SendSms
          leadId={leadData?._id}
          showModal={showSmsModal}
          setShowModal={setShowSmsModal}
          eventName="lead_profile"
          isProfilePage={true}
        />
      )}
      {showCollectFeeModal && (
        <ProfileFees
          feesData={collectFeesData}
          setShowModal={setShowCollectFeeModal}
        />
      )}
      <PlainCard className={styles.outerContainer}>
        <div className={styles.outerCardWrapper}>
          <Heading
            children={t('takeAction')}
            textSize={HEADING_CONSTANTS.TEXT_SIZE.MEDIUM}
          />
          <div className={styles.cardCollectionWrapper}>
            {leadData?.status_adm_form !==
              admissionFormLeadProfileStatus.COMPLETED && (
              <div
                className={styles.admissionFormCard}
                onClick={() => {
                  eventManager.send_event(
                    events.ADMISSION_LEAD_PROFILE_ADMISSION_FORM_CLICKED_TFI
                  )
                  setShowAdmissionForm(!showAdmissionForm)
                }}
              >
                {renderCard({
                  prefixIcon: 'document',
                  label: t('admissionForm'),
                  prefixIconType: ICON_CONSTANTS.TYPES.ERROR,
                  className: styles.admissionFormCardStyle,
                })}
              </div>
            )}
            {leadData?.status_form_fee !== feeStatusLeadProfile.PAID &&
              applicationFormFees !== 0 && (
                <div
                  onClick={() => handleCollectFee(true)}
                  className={
                    leadData?.status_adm_form ===
                    admissionFormLeadProfileStatus.COMPLETED
                      ? styles.admissionFormCard
                      : styles.commonCardStyle
                  }
                >
                  {renderCard({
                    isPrefixIcon: false,
                    prefixIcon: getSymbolFromCurrency(
                      instituteInfo.currency || DEFAULT_CURRENCY
                    ),
                    label: t('formFee'),
                    prefixIconType: ICON_CONSTANTS.TYPES.SUCCESS,
                    className: styles.formFeeCardStyle,
                  })}
                </div>
              )}
            <div
              onClick={() => {
                eventManager.send_event(
                  events.ADMISSION_LEAD_PROFILE_FOLLOWUP_CLICKED_TFI
                )
                setShowFollowupsModal(!showFollowupsModal)
              }}
              className={
                leadData?.status_adm_form ===
                  admissionFormLeadProfileStatus.COMPLETED &&
                leadData?.status_form_fee === feeStatusLeadProfile.PAID
                  ? styles.admissionFormCard
                  : styles.commonCardStyle
              }
            >
              {renderCard({
                prefixIcon: 'call',
                label: t('followUp'),
                prefixIconType: ICON_CONSTANTS.TYPES.PRIMARY,
                className: styles.followUpCardStyle,
              })}
            </div>
            <div
              onClick={() => {
                eventManager.send_event(
                  events.ADMISSION_LEAD_PROFILE_SEND_SMS_CLICKED_TFI
                )
                setShowSmsModal(!showSmsModal)
              }}
              className={styles.smsCardWrapperStyle}
            >
              {renderCard({
                prefixIcon: 'chat',
                label: t('sendSMS'),
                prefixIconType: ICON_CONSTANTS.TYPES.WARNING,
                className: styles.sendSmsCardStyle,
              })}
            </div>
            {leadData?.status_adm_fee !== feeStatusLeadProfile.PAID &&
              applicationAdmissionFees !== 0 && (
                <div
                  className={styles.commonCardStyle}
                  onClick={() => handleCollectFee(false)}
                >
                  {renderCard({
                    isPrefixIcon: false,
                    prefixIcon: getSymbolFromCurrency(
                      instituteInfo.currency || DEFAULT_CURRENCY
                    ),
                    label: t('admissionFee'),
                    prefixIconType: ICON_CONSTANTS.TYPES.SUCCESS,
                    className: styles.admissionFeeCardStyle,
                  })}
                </div>
              )}
          </div>
        </div>
      </PlainCard>
    </div>
  )
}
