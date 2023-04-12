import React, {useState} from 'react'
import styles from './EditInstallmentModal.module.css'
import {ErrorBoundary} from '@teachmint/common'
import {
  Divider,
  Heading,
  Icon,
  ICON_CONSTANTS,
  Modal,
  MODAL_CONSTANTS,
  TabGroup,
} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import globalActions from '../../../../../../redux/actions/global.actions'
import {getStudentProfileFeeTabDetailsRequestAction} from '../../../redux/feeAndWallet/actions'
import {ADD_ON_FEE_TABS, ADD_ON_FEE_TAB_DATA} from '../../FeeTabConstant'
import AddOnFeeTable from './AddOnFeeTable'
import AddOnDiscountTable from './AddOnDiscountTable'
import classNames from 'classnames'
import {DateTime} from 'luxon'
import {getOrdinalNum} from '../../../../../../pages/YearlyCalendar/commonFunctions'
import {getAmountWithCurrency} from '../../../../../../utils/Helpers'
import {useAddStudentAddOnFeesSelector} from '../../../redux/selectros/feeTabSelectors'

export default function EditInstallmentModal({
  studentId = null,
  isOpen = true,
  setIsOpen = () => {},
  receiptPrefixList = [],
  editInstallmentModalData = {},
  setEditInstallmentModalData = () => {},
}) {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const [selectedTab, setSelectedTab] = useState(ADD_ON_FEE_TABS.ADD_ON_FEE)
  const [errorMessage, setErrorMessage] = useState('')
  const [addonFees, setAddonFees] = useState({})
  const [addonDiscounts, setAddonDiscounts] = useState({})
  const [totalRow, setTotalRow] = useState([])
  const {instituteInfo} = useSelector((state) => state)
  const addStudentAddOnFees = useAddStudentAddOnFeesSelector()
  const handleUpdateOnClick = () => {
    const successAction = (status) => {
      if (status == true) {
        setIsOpen(false)
        dispatch(getStudentProfileFeeTabDetailsRequestAction(studentId))
      }
    }
    if (selectedTab === ADD_ON_FEE_TABS.ADD_ON_FEE) {
      dispatch(
        globalActions.addStudentAddOnFees.request(
          addonFees,
          successAction,
          (error) => setErrorMessage(error)
        )
      )
    } else if (selectedTab === ADD_ON_FEE_TABS.ADD_ON_DISCOUNT) {
      dispatch(
        globalActions.addStudentAddOnDiscount.request(
          addonDiscounts,
          successAction,
          (error) => setErrorMessage(error)
        )
      )
    }
  }

  return (
    <ErrorBoundary>
      <Modal
        isOpen={isOpen}
        classes={{content: classNames(styles.modal, styles.higherSpecificity)}}
        size={MODAL_CONSTANTS.SIZE.LARGE}
        header={
          <>
            <div className={styles.modalHeadingSection}>
              <div className={styles.iconAndHeadingSection}>
                <Heading textSize="x_s">
                  {t('addOnEditInstallmentHeading', {
                    indexOrdinalNumber: getOrdinalNum(
                      editInstallmentModalData?.index
                    ),
                    date: DateTime.fromSeconds(
                      editInstallmentModalData?.installment_timestamp
                    ).toFormat('dd LLL yyyy'),
                  })}
                </Heading>
              </div>
              <div>
                <button onClick={() => setIsOpen(!isOpen)}>
                  <Icon
                    name="close"
                    size={ICON_CONSTANTS.SIZES.X_SMALL}
                    version="outlined"
                  />
                </button>
              </div>
            </div>
            <Divider length="100%" spacing="0px" thickness="1px" />
          </>
        }
        footerLeftElement={
          <div className={styles.footerMessage}>{t(errorMessage)}</div>
        }
        actionButtons={[
          {
            body: t('cancel'),
            isDisabled: addStudentAddOnFees.isLoading,
            onClick: () => setIsOpen(!isOpen),
            type: 'outline',
          },
          {
            body: t('update'),
            isDisabled: addStudentAddOnFees.isLoading,
            onClick: handleUpdateOnClick,
          },
        ]}
      >
        <>
          <div className={styles.modalSection}>
            <div className={styles.tabGroup}>
              <TabGroup
                onTabClick={(tab) => {
                  setSelectedTab(tab.id)
                }}
                selectedTab={selectedTab}
                showMoreTab={false}
                tabOptions={ADD_ON_FEE_TAB_DATA}
              />
            </div>
            <div className={styles.table}>
              {selectedTab === ADD_ON_FEE_TABS.ADD_ON_FEE ? (
                <AddOnFeeTable
                  editInstallmentModalData={editInstallmentModalData}
                  receiptPrefixList={receiptPrefixList}
                  setErrorMessage={setErrorMessage}
                  setAddonFees={setAddonFees}
                  studentId={studentId}
                  setTotalRow={setTotalRow}
                  setEditInstallmentModalData={setEditInstallmentModalData}
                />
              ) : (
                <AddOnDiscountTable
                  editInstallmentModalData={editInstallmentModalData}
                  receiptPrefixList={receiptPrefixList}
                  setAddonDiscounts={setAddonDiscounts}
                  setTotalRow={setTotalRow}
                />
              )}
            </div>
          </div>
          <div className={styles.sticky}>
            <span className={styles.totalRowColumn0}>{t('total')}</span>
            <span className={styles.totalRowColumn1}>
              {getAmountWithCurrency(totalRow[0], instituteInfo?.currency)}
            </span>
            <span className={styles.totalRowColumn2}>
              {getAmountWithCurrency(totalRow[1], instituteInfo?.currency)}
            </span>
            <span className={styles.totalRowColumn3}>
              {getAmountWithCurrency(totalRow[2], instituteInfo?.currency)}
            </span>
          </div>
        </>
      </Modal>
    </ErrorBoundary>
  )
}
