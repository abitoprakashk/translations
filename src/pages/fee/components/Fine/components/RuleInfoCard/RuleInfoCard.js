import {Card, Icon} from '@teachmint/common'
import React from 'react'
import {useSelector} from 'react-redux'
import {RULES_OPTION_VALUE} from '../../FineConstant'
import Badge from '../Badge/Badge'
import CalloutCard from '../CalloutCard/CalloutCard'
import styles from './RuleInfoCard.module.css'
import {getAmountFixDecimalWithCurrency} from '../../../../../../utils/Helpers'
import Permission from '../../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../../utils/permission.constants'
import {getSymbolFromCurrency} from '../../../../../../utils/Helpers'
import {DEFAULT_CURRENCY} from '../../../../../../constants/common.constants'

export default function RuleInfoCard({
  rule = {},
  feeTypes = [],
  ruleNumber = 0,
  t = () => {},
  handleDeleteRuleClick = () => {},
}) {
  const {instituteInfo} = useSelector((state) => state)
  const {
    master_categories,
    per_day_amount,
    type,
    slot_wise_amounts,
    grace_period,
  } = rule

  let newMasterCategories = [...master_categories]

  const joinAndGetFeeTypes = (feeTypesArr) => {
    return feeTypes
      .filter((type) => feeTypesArr.includes(type._id))
      .map((type) => type.name)
      .join(', ')
  }

  return (
    <Card className={styles.card}>
      <div className={styles.headerSection}>
        <div className={styles.ruleNumber}>
          <Badge title={`Type ${ruleNumber}`} />
        </div>
        <div>
          {/* <div>
            <span className={styles.editBtn}>
              <Icon color="primary" name="edit1" size="xs" type="outlined" />
            </span>
          </div> */}
          <div>
            <Permission
              permissionId={
                PERMISSION_CONSTANTS.feeModuleController_deleteFineRule_delete
              }
            >
              <span
                className={styles.deleteBtn}
                onClick={() => handleDeleteRuleClick(rule)}
              >
                <Icon color="error" name="delete" size="xs" type="outlined" />
              </span>
            </Permission>
          </div>
        </div>
      </div>
      <div>
        <CalloutCard heading={t('tableFieldsFeeType')}>
          <div>
            {newMasterCategories.length > 2 ? (
              <span className={styles.valueNames}>
                {joinAndGetFeeTypes(newMasterCategories.splice(0, 2))}{' '}
                <span className={styles.moreText}>
                  + {newMasterCategories.length} {t('more')}
                </span>
              </span>
            ) : (
              <span className={styles.valueNames}>
                {joinAndGetFeeTypes(newMasterCategories)}
              </span>
            )}
          </div>
        </CalloutCard>

        {type === RULES_OPTION_VALUE.perDay && (
          <>
            <CalloutCard heading={t('perDayAmount')}>
              {getAmountFixDecimalWithCurrency(
                per_day_amount,
                instituteInfo.currency
              )}
            </CalloutCard>
            <CalloutCard heading={t('gracePeriod')}>
              {grace_period > 0 ? (
                <sapn>
                  {grace_period}{' '}
                  <span className={styles.notApplicabletext}>
                    {t('daysPostDueDate')}
                  </span>
                </sapn>
              ) : (
                <span className={styles.notApplicabletext}>N/A</span>
              )}
            </CalloutCard>
          </>
        )}

        {type === RULES_OPTION_VALUE.slotWise && (
          <CalloutCard heading={t('slot')}>
            <div className={styles.slotTableSection}>
              <table className={styles.slotTable}>
                {slot_wise_amounts.length > 0 &&
                  slot_wise_amounts.map((slot, idx) => {
                    return (
                      <tr key={`slot${idx}`}>
                        <td className={styles.slotTd}>
                          {slot.from} - {slot.to} {t('days')}
                        </td>
                        <td className={styles.slotTd}>:</td>
                        <td className={styles.slotTd}>
                          {getSymbolFromCurrency(
                            instituteInfo.currency || DEFAULT_CURRENCY
                          )}{' '}
                          {slot.amount}{' '}
                        </td>
                      </tr>
                    )
                  })}
              </table>
            </div>
          </CalloutCard>
        )}
      </div>
    </Card>
  )
}
