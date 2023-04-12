import React from 'react'
import styles from './Fine.module.css'
import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import emptyFineImage from '../../../../assets/images/dashboard/empty/empty_fine.svg'
import EmptyScreenV1 from '../../../../components/Common/EmptyScreenV1/EmptyScreenV1'
import {fetchFeeTypesRequestedAction} from '../../redux/feeStructure/feeStructureActions'
import {useFeeStructure} from '../../redux/feeStructure/feeStructureSelectors'
import RuleConfigureSlider from './components/RuleConfigureSlider/RuleConfigureSlider'
import RuleInfoCard from './components/RuleInfoCard/RuleInfoCard'
import {Icon, Button} from '@teachmint/common'
import {
  CREATE_NEW_RULE_BTN_LBL,
  DELETE_RULE_CONFIRMATION_POPUP,
  FEE_FINE_EMPTY_SCREEN,
  FINE_RULES_LBL,
} from './FineConstant'
import {useTranslation} from 'react-i18next'
import UserList from './components/UserList/UserList'
import {
  deleteFeeFineRuleAction,
  fetchFeeFineRulesAction,
  setFeeFineStatesAction,
} from './redux/FineActions'
import {useFeeFineSelector} from './redux/FeeFineSelectors'
import ConfirmationPopup from '../../../../components/Common/ConfirmationPopup/ConfirmationPopup'
import {events} from '../../../../utils/EventsConstants'
import {getFeeTypeNames} from './commonFunctions'
import Permission from '../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'

export default function Fine() {
  const {t} = useTranslation()
  const {feeTypes} = useFeeStructure()
  const dispatch = useDispatch()
  const {instituteInfo, eventManager} = useSelector((state) => state)
  const {
    fineRules,
    fineRuleLoader,
    isDeleteRuleModalOpen,
    isConfigureRuleSliderOpen,
  } = useFeeFineSelector()
  const [ruleToDelete, setRuleToDelete] = useState(null)

  useEffect(() => {
    dispatch(fetchFeeTypesRequestedAction())
    dispatch(fetchFeeFineRulesAction())
  }, [instituteInfo._id])

  const handleFineConfigureClick = () => {
    eventManager.send_event(events.FINE_CREATE_NEW_RULE_CLICKED_TFI)
    dispatch(setFeeFineStatesAction({isConfigureRuleSliderOpen: true}))
  }

  const handleDeleteRuleClick = (rule) => {
    let ruleId = rule._id

    let deletRule = fineRules.find((rule) => rule._id === ruleId)
    setRuleToDelete(deletRule)
    dispatch(setFeeFineStatesAction({isDeleteRuleModalOpen: true}))
    let feeTypesName = getFeeTypeNames({
      feeTypes,
      selectedFeeTypes: rule.master_categories,
    })
    eventManager.send_event(events.FINE_RULES_DELETE_BUTTON_CLICKED_TFI, {
      fee_type: feeTypesName,
    })
  }

  const confirmDeleteRule = () => {
    let feeTypesName = getFeeTypeNames({
      feeTypes,
      selectedFeeTypes: ruleToDelete.master_categories,
    })

    eventManager.send_event(
      events.FINE_RULES_DELETE_BUTTON_POP_UP_CLICKED_TFI,
      {
        fee_type: feeTypesName,
        action: 'confirm',
      }
    )

    dispatch(
      deleteFeeFineRuleAction(
        {_id: ruleToDelete._id},
        {eventManager, feeTypesName}
      )
    )
  }

  const cancelDeleteRule = () => {
    let feeTypesName = getFeeTypeNames({
      feeTypes,
      selectedFeeTypes: ruleToDelete.master_categories,
    })
    eventManager.send_event(
      events.FINE_RULES_DELETE_BUTTON_POP_UP_CLICKED_TFI,
      {
        fee_type: feeTypesName,
        action: 'cancel',
      }
    )
    dispatch(setFeeFineStatesAction({isDeleteRuleModalOpen: false}))
  }

  if (fineRuleLoader) {
    return <div className="loading"></div>
  }

  return (
    <>
      {isConfigureRuleSliderOpen && (
        <RuleConfigureSlider
          setOpen={() =>
            dispatch(setFeeFineStatesAction({isConfigureRuleSliderOpen: false}))
          }
          feeTypes={feeTypes}
        />
      )}

      {isDeleteRuleModalOpen && (
        <ConfirmationPopup
          onClose={cancelDeleteRule}
          onAction={() => {
            confirmDeleteRule()
            dispatch(setFeeFineStatesAction({isDeleteRuleModalOpen: false}))
          }}
          icon={
            'https://storage.googleapis.com/tm-assets/icons/colorful/remove-bg-red.svg'
          }
          title={t(DELETE_RULE_CONFIRMATION_POPUP.title)}
          desc={t(DELETE_RULE_CONFIRMATION_POPUP.desc)}
          primaryBtnText={t(DELETE_RULE_CONFIRMATION_POPUP.primaryBtnText)}
          secondaryBtnText={t(DELETE_RULE_CONFIRMATION_POPUP.secondaryBtnText)}
        />
      )}

      {fineRules.length > 0 ? (
        <section>
          <div className={styles.rulesSection}>
            <div className={styles.headingSection}>
              <div>
                <div className={styles.headingTitleSection}>
                  <Icon
                    color="basic"
                    name="configure"
                    size="xs"
                    type="filled"
                  />{' '}
                  {t(FINE_RULES_LBL)}
                </div>
              </div>
              <div>
                <Permission
                  permissionId={
                    PERMISSION_CONSTANTS.feeModuleController_createFeeFineRules_create
                  }
                >
                  <Button
                    className={styles.addNew}
                    size="big"
                    type="primary"
                    onClick={handleFineConfigureClick}
                  >
                    + {t(CREATE_NEW_RULE_BTN_LBL)}
                  </Button>
                </Permission>
              </div>
            </div>
            <div className={styles.rulesCardSection}>
              {fineRules.map((rule, idx) => {
                return (
                  <RuleInfoCard
                    key={`rule${idx}`}
                    ruleNumber={idx + 1}
                    rule={rule}
                    feeTypes={feeTypes}
                    t={t}
                    handleDeleteRuleClick={handleDeleteRuleClick}
                  />
                )
              })}
            </div>
          </div>
          <UserList />
        </section>
      ) : (
        <div>
          <Permission
            permissionId={
              PERMISSION_CONSTANTS.feeModuleController_createFeeFineRules_create
            }
          >
            <EmptyScreenV1
              image={emptyFineImage}
              title={t(FEE_FINE_EMPTY_SCREEN.title)}
              desc={t(FEE_FINE_EMPTY_SCREEN.desc)}
              btnText={t(FEE_FINE_EMPTY_SCREEN.btnText)}
              btnType="primary"
              handleChange={handleFineConfigureClick}
            />
          </Permission>
        </div>
      )}
    </>
  )
}
