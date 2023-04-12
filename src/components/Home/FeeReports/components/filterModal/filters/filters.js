import React from 'react'
import {
  DATE_RANGE_INPUT_TYPE,
  INSTITUTE_TREE_TYPE,
  MULTI_SELECT_WITH_CHIPS,
} from '../../../../../../pages/fee/fees.constants'
import InstituteTree from '../../../../../../../../admin/src/pages/fee/components/tfi-common/InstituteTree/InstituteTree'
import {CheckboxGroup} from '@teachmint/krayon'
import classNames from 'classnames'
import styles from '../../../FeeReports.module.css'

const Filters = ({
  sortBy,
  numberItems,
  modalFilterValue,
  selectedFilterType,
  getInstallmentLabels,
  handleFilterDataChange,
}) => {
  return (
    <div className={styles.sortByCont}>
      {sortBy(numberItems, null, true).map((item) => {
        if (item.isVisible) {
          return (
            <div key={item.id} className={styles.blockSection}>
              <div
                className={classNames({
                  [styles.inputFieldSection]: ![
                    INSTITUTE_TREE_TYPE,
                    DATE_RANGE_INPUT_TYPE,
                  ].includes(item.inputField.type),
                })}
              >
                {item.inputField.type === MULTI_SELECT_WITH_CHIPS && (
                  <CheckboxGroup
                    name="sections"
                    size="s"
                    options={getInstallmentLabels(item, [
                      ...item.inputField.options,
                    ])}
                    selectedOptions={
                      modalFilterValue &&
                      selectedFilterType &&
                      modalFilterValue[selectedFilterType.value]
                        ? [...modalFilterValue[selectedFilterType.value].param1]
                        : []
                    }
                    onChange={(obj) => {
                      handleFilterDataChange(obj, item.dispatchType)
                    }}
                    wrapperClass={styles.checkboxWrapper}
                  />
                )}

                {item.inputField.type === INSTITUTE_TREE_TYPE && (
                  <div className={styles.checkboxCustom}>
                    <InstituteTree
                      preSelectedNodes={
                        modalFilterValue &&
                        selectedFilterType &&
                        modalFilterValue[selectedFilterType.value]
                          ? {
                              ...modalFilterValue[selectedFilterType.value]
                                .param1,
                            }
                          : {}
                      }
                      isVertical={true}
                      allChecked={false}
                      getSelectedNodes={item.inputField.onChange}
                      hierarchyTypes={item.inputField.hierarchyTypes}
                      expandChildNodesDefault={
                        item.inputField.expandChildNodesDefault ?? true
                      }
                      expandTill={item.inputField.expandTill}
                    />
                  </div>
                )}
              </div>
            </div>
          )
        }
      })}
    </div>
  )
}

export default Filters
