import {
  Button,
  BUTTON_CONSTANTS,
  EmptyState,
  Para,
  PARA_CONSTANTS,
  Table,
} from '@teachmint/krayon'
import {t} from 'i18next'
import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import Permission from '../../../../components/Common/Permission/Permission'
import {CONST_ITEM_ALLOCATION_STATUS} from '../../../../constants/inventory.constants'
import {showLoadingAction} from '../../../../redux/actions/commonAction'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'
import {studentWiseItemsList} from '../../pages/Overview/apiServices'
import {allocateItemsManuallyAction} from '../../pages/Overview/redux/actions/actions'
import {STUDENT_INVENTORY_TABLE_HEADERS} from '../../utils/Inventory.constants'
import styles from './StudentInventoryItemsPage.module.css'

export default function StudentInventoryItemsPage({currentStudent}) {
  const [inventoryItemsData, setInventoryItemsData] = useState(null)

  const dispatch = useDispatch()

  useEffect(() => {
    if (currentStudent?._id) getInventoryItemsData(currentStudent?._id)
  }, [currentStudent])

  const getInventoryItemsData = (studentId) => {
    dispatch(showLoadingAction(true))
    studentWiseItemsList({iid: studentId})
      .then(({obj}) => setInventoryItemsData(obj))
      .catch(() => {})
      .finally(() => dispatch(showLoadingAction(false)))
  }

  const getTableRows = () => {
    const rows = []
    if (inventoryItemsData?.item_list?.length > 0) {
      inventoryItemsData?.item_list?.forEach(
        ({_id, item_name, unit_code, category_name, condition}) => {
          rows.push({
            itemDetail: (
              <div>
                <Para
                  type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
                  className={styles.itemName}
                >
                  {item_name}
                </Para>
                <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
                  {unit_code}
                </Para>
              </div>
            ),
            category: category_name,
            condition: (
              <Para
                type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
                className={styles.conditionPara}
              >
                {String(condition).toLowerCase()}
              </Para>
            ),
            allocation: (
              <div className={styles.returnButtonWrapper}>
                <Permission
                  permissionId={
                    PERMISSION_CONSTANTS.inventoryItemController_allocateManual_update
                  }
                >
                  <Button
                    type={BUTTON_CONSTANTS.TYPE.TEXT}
                    onClick={() => {
                      dispatch(
                        allocateItemsManuallyAction({
                          allocationDetails: {
                            unit_ids: [_id],
                            allocate_to_type:
                              CONST_ITEM_ALLOCATION_STATUS.UNALLOCATED,
                          },
                          payload: {},
                        })
                      )
                      getInventoryItemsData(currentStudent?._id)
                    }}
                  >
                    {t('remove')}
                  </Button>
                </Permission>
              </div>
            ),
          })
        }
      )
    }
    return rows
  }

  return (
    <div>
      {inventoryItemsData?.item_list?.length > 0 ? (
        <div className={styles.tableWrapper}>
          <Table
            rows={getTableRows()}
            cols={STUDENT_INVENTORY_TABLE_HEADERS}
            classes={{table: styles.table}}
            virtualized
            autoSize
          />
        </div>
      ) : (
        <div className={styles.emptyStateWrapperOuter}>
          <EmptyState
            iconName="viewQuilt"
            content={t('emptyInventoryItemsDescription')}
            button={null}
          />
        </div>
      )}
    </div>
  )
}
