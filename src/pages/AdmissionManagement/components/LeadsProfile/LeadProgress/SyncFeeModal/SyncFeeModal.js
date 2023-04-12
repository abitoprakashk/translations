import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {t} from 'i18next'
import classNames from 'classnames'
import {
  Modal,
  MODAL_CONSTANTS,
  Heading,
  HEADING_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  Button,
  Divider,
  Para,
  PARA_CONSTANTS,
  Input,
  INPUT_TYPES,
  Popup,
  BUTTON_CONSTANTS,
} from '@teachmint/krayon'
import {useApplicableFeeStructures} from '../../../../redux/admissionManagement.selectors'
import globalActions from '../../../../../../redux/actions/global.actions'
import {getAmountWithCurrency} from '../../../../../../utils/Helpers'
import styles from './SyncFeeModal.module.css'

const feeStructureType = {
  STANDARD: t('recurringFee'),
  TRANSPORT: t('transportFee'),
  ONE_TIME: t('oneTimeFee'),
  CUSTOM: t('custom'),
}

export default function SyncFeeModal({
  leadId,
  showSyncFeeModal,
  setShowSyncFeeModal,
  setIsAlert,
}) {
  const dispatch = useDispatch()

  const instituteInfo = useSelector((state) => state.instituteInfo)
  const applicableFeeStructures = useApplicableFeeStructures()

  const [feeStructures, setFeeStructures] = useState([])
  const [selectedFeeStructure, setSelectedFeeStructure] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [showPopupMsg, setShowPopupMsg] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    dispatch(
      globalActions.getApplicableFeeStructures.request(leadId, (list) => {
        setIsLoading(false)
        setFeeStructures(list)
      })
    )
  }, [])

  const syncFeeStructure = () => {
    setErrorMessage('')
    dispatch(
      globalActions.syncAdmissionFee.request(
        {
          lead_id: leadId,
          fee_structure_id: selectedFeeStructure,
        },
        () => {
          setShowSyncFeeModal(false)
          setIsAlert(false)
        },
        (error) => setErrorMessage(error)
      )
    )
  }

  const getModalHeader = () => {
    return (
      <div>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.X_SMALL}>
              {t('choseFeeStructureLeadProfilePage')}
            </Heading>
          </div>
          <div>
            <Icon
              name="close"
              onClick={() => setShowSyncFeeModal(!showSyncFeeModal)}
              size={ICON_CONSTANTS.SIZES.XX_SMALL}
              className={styles.modalClickable}
            />
          </div>
        </div>
        <Divider spacing="0" />
      </div>
    )
  }

  const getModalFooter = () => {
    return (
      <div>
        <Divider spacing="0" />
        <div className={styles.modalFooter}>
          <div className={styles.modalErrorSection}>
            {errorMessage && (
              <>
                <Icon name="info" type={ICON_CONSTANTS.TYPES.ERROR} />
                <div>{errorMessage}</div>
              </>
            )}
          </div>
          <Button
            onClick={syncFeeStructure}
            classes={{button: styles.changeLeadStageButton}}
            isDisabled={selectedFeeStructure === ''}
          >
            {t('syncNowLeadProfilePageFooterButton')}
          </Button>
        </div>
      </div>
    )
  }

  const handlePopup = () => {
    setShowPopupMsg(false)
    setShowSyncFeeModal(false)
  }

  const renderFeeStructure = () => {
    return (
      !applicableFeeStructures.isLoading &&
      feeStructures.length !== 0 && (
        <Input
          isRequired={true}
          type={INPUT_TYPES.DROPDOWN}
          title={t('confirmAdmissionModalFeeStructureLabel')}
          onChange={({value}) => setSelectedFeeStructure(value)}
          fieldName="feeStructure"
          selectionPlaceholder={
            selectedFeeStructure
              ? feeStructures.find(
                  (structure) =>
                    structure.fee_structure_id === selectedFeeStructure
                ).name
              : t('confirmAdmissionModalFeeStructurePlaceholder')
          }
          classes={{
            dropdownClass: styles.dropdownField,
            optionClass: styles.dropdownOptionWidth,
            optionsClass: classNames(styles.dropdown, styles.zIndex),
          }}
          options={feeStructures.map((structure) => ({
            value: structure.fee_structure_id,
            label: (
              <div>
                <div className={styles.structureName}>{structure.name}</div>
                <div className={styles.structureDetails}>
                  <Para
                    textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
                    weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
                  >
                    {feeStructureType[structure.fee_type]}
                  </Para>
                  <Divider
                    spacing="12px"
                    isVertical={true}
                    className={styles.structureDetailsSpacing}
                  />
                  <Para
                    textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
                    weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
                  >
                    {getAmountWithCurrency(
                      structure.categories.reduce(
                        (previousAmount, {amount_with_tax}) => {
                          return (previousAmount += amount_with_tax)
                        },
                        0
                      ),
                      instituteInfo?.currency
                    )}
                  </Para>
                </div>
              </div>
            ),
          }))}
        />
      )
    )
  }

  return (
    <div>
      {!isLoading &&
        (feeStructures.length == 0 ? (
          showPopupMsg && (
            <Popup
              isOpen
              onClose={handlePopup}
              header={t('feeNotConfiguredPopupHeader')}
              shouldCloseOnOverlayClick={false}
              shouldCloseOnEsc={false}
              actionButtons={[
                {
                  onClick: handlePopup,
                  body: t('ok'),
                  type: BUTTON_CONSTANTS.TYPE.FILLED,
                },
              ]}
            >
              <Para
                type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
                className={styles.descriptionStyle}
              >
                {t('feeNotConfiguredPopupMsgLeadProfilePage')}
              </Para>
            </Popup>
          )
        ) : (
          <Modal
            isOpen={showSyncFeeModal}
            header={getModalHeader()}
            footer={getModalFooter()}
            size={MODAL_CONSTANTS.SIZE.MEDIUM}
            shouldCloseOnOverlayClick={false}
            shouldCloseOnEsc={false}
            onClose={() => setShowSyncFeeModal(!showSyncFeeModal)}
            classes={{
              modal: styles.modal,
            }}
          >
            <div className={styles.feeStructure}>{renderFeeStructure()}</div>
          </Modal>
        ))}
    </div>
  )
}
