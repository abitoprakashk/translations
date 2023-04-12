import React, {useCallback, useEffect, useState} from 'react'
import styles from './EditInstallmentModal.module.css'
import DeleteRecieptsModalStyles from '../../../../../../components/Common/DeleteRecieptsModal/DeleteRecieptsModal.module.css'
import {ErrorBoundary} from '@teachmint/common'
import {Button, Icon, ICON_CONSTANTS, Input, Table} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'
import {useFeeStructure} from '../../../../../../pages/fee/redux/feeStructure/feeStructureSelectors'
import {useDispatch, useSelector} from 'react-redux'
import globalActions from '../../../../../../redux/actions/global.actions'
import {ADD_ON_FEE_TABLE_COLS} from '../../FeeTabConstant'
import DeleteRecieptsModal from '../../../../../Common/DeleteRecieptsModal/DeleteRecieptsModal'
import {
  DELETE_ADD_ON_FEE_STEPS,
  DEPENDANCY_CASES,
  STEPS_IDS,
  STEP_STATUS,
} from '../../../../../../pages/user-profile/components/Student/studentConstants'
import {
  getDependancyStepsData,
  deleteAddOnFeeAllAReceiptsConfirmationTransText,
  getAddOnFeesStepsDataAfterDeleteReceipts,
  getStudentDetails,
} from '../../../../../../pages/fee/helpers/helpers'
import AlertModal from '../../../../../Common/AlertModal/AlertModal'
import feeStructureActionTypes from '../../../../../../pages/fee/redux/feeStructure/feeStructureActionTypes'
import {getAmountWithCurrency} from '../../../../../../utils/Helpers'
import {FEE_TAB_ACTION_TYPES} from '../../../redux/feeAndWallet/actionTypes'
import AddNewFeeTypeCard from './AddNewFeeTypeCard'
import AddOnToolTipBody from './AddOnToolTipBody'

export default function AddOnFeeTable({
  studentId = null,
  receiptPrefixList = [],
  editInstallmentModalData = {},
  setErrorMessage = () => {},
  setAddonFees = () => {},
  setTotalRow = () => {},
  setEditInstallmentModalData = () => {},
}) {
  const {feeTypes} = useFeeStructure()
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const [existingRowData, setExistingRowData] = useState([])
  const [newRowData, setNewRowData] = useState([])
  const [rowsData, setRowsData] = useState([])
  const [feeTypesToFeeNameDictionary, setFeeTypesToFeeNameDictionary] =
    useState({})
  const [addFeeTypeOpen, setAddFeeTypeOpen] = useState(false)
  const [deleteReceiptsModalProps, setDeleteReceiptsModalProps] = useState({
    isOpen: false,
    header: t('deleteReceiptsToDeleteAddOnFeeType'),
    steps: {...DELETE_ADD_ON_FEE_STEPS},
  })
  const [structureToDelete] = useState(null)
  const [alertModalProps, setAlertModalProps] = useState({
    isOpen: false,
    header: t('cannotDeleteStructure'),
    text: '',
  })

  const {data} = useSelector(
    (state) => state.studentProfileFeeAndWalletTab.feeTab.instlamentwiseDetails
  )

  const {instituteStudentList, instituteInfo, eventManager} = useSelector(
    (state) => state
  )

  useEffect(() => {
    setExistingRowData(
      editInstallmentModalData?.details.map((obj) => ({
        feeType: obj.category_master_id,
        existingFeeAmount: obj.amount,
        addOnAmount: 0,
        addOnAmountWithTax: 0,
        totalAmount: obj.amount,
        transactionId: obj.transaction_id,
        isAddon: obj?.is_addon || false,
        receiptPrefix: obj?.receipt_prefix || null,
        dueLogs: obj?.due_logs || [],
        tax: obj.tax,
      }))
    )

    setFeeTypesToFeeNameDictionary(
      feeTypes.reduce((acc, curr) => {
        acc[curr._id] = {
          name: curr.name,
          isUsed: editInstallmentModalData?.details.some(
            (data) => data.category_master_id === curr._id.toString()
          ),
        }
        return acc
      }, {})
    )
  }, [])

  useEffect(() => {
    setRowsData(existingRowData.concat(newRowData))

    setTotalRow(
      existingRowData.concat(newRowData).reduce(
        (totals, data) => {
          totals[0] += Number(data?.existingFeeAmount || 0)
          totals[1] += Number(data?.addOnAmountWithTax || 0)
          totals[2] += Number(data?.totalAmount || 0)
          return totals
        },
        [0, 0, 0]
      )
    )
    const addonFeesApiData = {
      existing: existingRowData.map((row) => ({
        transaction_id: row.transactionId,
        amount: Number(row?.addOnAmount || 0),
      })),
      new: newRowData.map((row) => ({
        fee_type: row.feeType,
        receipt_prefix: row.receiptPrefix,
        amount: Number(row?.addOnAmount || 0),
        tax: Number(row?.tax || 0),
        installment: editInstallmentModalData.installment_timestamp,
        student_id: studentId,
      })),
    }
    setAddonFees(addonFeesApiData)

    if (newRowData.length === 0) return
    setFeeTypesToFeeNameDictionary((prevFeeTypesToFeeNameDictionary) => {
      const updatedFeeTypesToFeeNameDictionary = {
        ...prevFeeTypesToFeeNameDictionary,
      }
      newRowData.forEach((data) => {
        updatedFeeTypesToFeeNameDictionary[data.feeType] = {
          ...updatedFeeTypesToFeeNameDictionary[data.feeType],
          isUsed: true,
        }
      })
      return updatedFeeTypesToFeeNameDictionary
    })
  }, [existingRowData, newRowData])

  const handleDataChange = (prevData, updatedAddOnAmount, index) => {
    const updatedData = [...prevData]
    updatedData[index].addOnAmount = updatedAddOnAmount
    updatedData[index].addOnAmountWithTax = Number(
      updatedAddOnAmount * (1 + updatedData[index].tax / 100)
    ).toFixed(2)
    updatedData[index].totalAmount =
      Number(updatedData[index].existingFeeAmount) +
      Number(updatedAddOnAmount) * (1 + updatedData[index].tax / 100)
    return updatedData
  }

  const handleExistingDataChange = (updatedAddOnAmount, index) => {
    setExistingRowData((prevData) =>
      handleDataChange(prevData, updatedAddOnAmount, index)
    )
  }

  const handleNewDataChange = (updatedAddOnAmount, index) => {
    setNewRowData((prevData) =>
      handleDataChange(
        prevData,
        updatedAddOnAmount,
        index - existingRowData.length
      )
    )
  }

  const deleteAddOnFeeTypeButton = () => {
    handleDeleteIconClick({
      transactionId: deleteReceiptsModalProps?.transactionId,
      feeType: deleteReceiptsModalProps?.feeTypeId,
    })
    setDeleteReceiptsModalProps((prev) => {
      return {
        ...prev,
        isOpen: false,
      }
    })
  }

  const handleDeleteIconClick = (rowData) => {
    const student_name =
      getStudentDetails(instituteStudentList, studentId)?.full_name || studentId
    const successAction = (resp) => {
      if (!resp?.obj?.dependency) {
        setExistingRowData(
          existingRowData.filter((x) => x.feeType !== rowData.feeType)
        )
        setNewRowData(newRowData.filter((x) => x.feeType !== rowData.feeType))

        const newEditInstallmentModalDataDetails =
          editInstallmentModalData.details.filter(
            (detail) => detail.category_master_id !== rowData.feeType
          )
        setEditInstallmentModalData({
          ...editInstallmentModalData,
          details: newEditInstallmentModalDataDetails,
        })

        const newData = data.map((item) => {
          if (
            item.installment_timestamp ===
            editInstallmentModalData.installment_timestamp
          ) {
            const details = item.details.filter(
              (detail) => detail.category_master_id !== rowData.feeType
            )
            return {...item, details}
          }
          return item
        })

        dispatch({
          type: FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_FEE_INSTALLMENT_WISE_DETAILS_STATE,
          payload: {
            data: newData,
          },
        })
      } else {
        const transactions = resp.obj.transactions
        let newSteps = getDependancyStepsData({
          transactions,
          steps: deleteReceiptsModalProps?.steps,
          typography: {
            summaryInfoText: t('deleteAddonFeeSummaryInfoText', {
              feeName: feeTypesToFeeNameDictionary[rowData.feeType].name,
              studentName: student_name,
            }),
            deleteHeading: t('deleteAddonFeeDeleteHeading', {
              feeName: feeTypesToFeeNameDictionary[rowData.feeType].name,
              studentName: student_name,
            }),
          },
          includeStudents: false,
        })
        setDeleteReceiptsModalProps((prev) => {
          return {
            ...prev,
            transactions,
            isOpen: true,
            steps: newSteps,
            transactionId: rowData.transactionId,
            feeTypeId: rowData.feeType,
            feeTypeName: feeTypesToFeeNameDictionary[rowData.feeType].name,
            studentName: studentId,
          }
        })
      }
    }

    const failureAction = (resp) => {
      setErrorMessage(resp.msg)
    }

    if (!Object.prototype.hasOwnProperty.call(rowData, 'transactionId')) {
      successAction()
    } else {
      dispatch(
        globalActions.deleteAddOnFee.request(
          {
            transaction_ids: [rowData.transactionId],
          },
          successAction,
          failureAction
        )
      )
    }
  }

  const rows = rowsData.map((rowData, index) => {
    return {
      feeType: (
        <div className={styles.feeTypeBlock}>
          <div className={styles.feeTypeBlockFeeName}>
            <span>{feeTypesToFeeNameDictionary[rowData.feeType].name}</span>
            {rowData.tax > 0 && (
              <span className={styles.taxText}>
                {t('taxAddOnFeeTable', {tax: rowData.tax})}
              </span>
            )}
          </div>
          <span className={styles.prefixText}>{rowData?.receiptPrefix}</span>
        </div>
      ),
      existingFeeAmount: (
        <div className={styles.existingFeeAmount}>
          {getAmountWithCurrency(
            rowData.existingFeeAmount,
            instituteInfo?.currency
          )}
          <AddOnToolTipBody
            uniqueIdentifier={rowData.feeType}
            logs={rowData.dueLogs}
            currency={instituteInfo?.currency}
          />
        </div>
      ),
      addOnAmount: (
        <div className={styles.addOnAmountBlock}>
          <Input
            classes={{wrapper: styles.addOnAmountInput}}
            fieldName="addOnAmount"
            onChange={(obj) => {
              if ('transactionId' in rowData) {
                handleExistingDataChange(obj.value, index)
              } else {
                handleNewDataChange(obj.value, index)
              }
            }}
            showMsg
            prefix={getAmountWithCurrency(null, instituteInfo?.currency)}
            type="number"
            value={rowData.addOnAmount}
            onKeyDown={(e) =>
              ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()
            }
          />
          {rowData.tax > 0 && (
            <span className={styles.addOnAmountTaxText}>{`${t(
              'tax'
            )} - ${getAmountWithCurrency(
              null,
              instituteInfo?.currency
            )} ${Number(rowData.addOnAmount * (rowData.tax / 100)).toFixed(
              2
            )}`}</span>
          )}
        </div>
      ),
      newFeeAmount: (
        <div className={styles.newFeeAmount}>
          {getAmountWithCurrency(rowData.totalAmount, instituteInfo?.currency)}
          {rowData.isAddon && (
            <span onClick={() => handleDeleteIconClick(rowData)}>
              <Icon
                name="delete1"
                type={ICON_CONSTANTS.TYPES.ERROR}
                size={ICON_CONSTANTS.SIZES.X_SMALL}
              />
            </span>
          )}
        </div>
      ),
    }
  })

  const unusedFeeTypes = Object.entries(feeTypesToFeeNameDictionary)
    .filter(([_id, value]) => !value.isUsed)
    .map(([value, {name}]) => ({label: name, value}))

  const closeDeleteReceiptsModal = () => {
    setDeleteReceiptsModalProps((prev) => {
      return {
        ...prev,
        isOpen: false,
      }
    })
  }

  const handleConfirmDeleteAllReciepts = () => {
    setAlertModalProps({...alertModalProps, isOpen: false})
    setDeleteReceiptsModalProps((prev) => {
      return {
        ...prev,
        buttonLoader: true,
      }
    })

    let data = {is_cancelled: false, receipts: {}, pending_transactions: []}
    deleteReceiptsModalProps?.transactions.forEach((item) => {
      if (item?.receipt_no) {
        if (data.receipts[item.academic_session_id]) {
          data.receipts[item.academic_session_id].push(item?.receipt_no)
        } else {
          data.receipts[item.academic_session_id] = [item?.receipt_no]
        }
      }
    })

    data.pending_transactions = deleteReceiptsModalProps?.transactions
      .filter((item) => !item.receipt_no)
      .map((item) => item.transaction_id)

    const onSuccess = () => {
      const student_name =
        getStudentDetails(instituteStudentList, studentId)?.full_name ||
        studentId

      let newData = getAddOnFeesStepsDataAfterDeleteReceipts({
        DependancyCase: DEPENDANCY_CASES.UPDATE,
        steps: deleteReceiptsModalProps?.steps,
        feeTypeName: deleteReceiptsModalProps.feeTypeName,
        studentName: student_name,
      })
      setDeleteReceiptsModalProps((prev) => {
        return {...prev, ...newData}
      })
    }

    const onFailed = (errorMsg) => {
      let newData = {
        buttonLoader: false,
        toasts: [
          {content: errorMsg || t('genericErrorMessage'), type: 'error'},
        ],
      }
      setDeleteReceiptsModalProps((prev) => {
        return {...prev, ...newData}
      })
    }

    dispatch({
      type: feeStructureActionTypes.REVOKE_FEE_RECEIPTS_TRANSACTIONS_REQUEST,
      payload: {data, onSuccess, onFailed},
    })
  }

  const handleDeleteAllReciepts = () => {
    let transactionCount =
      (deleteReceiptsModalProps?.transactions &&
        deleteReceiptsModalProps?.transactions.length) ||
      0

    const student_name =
      getStudentDetails(instituteStudentList, studentId)?.full_name || studentId

    let text = deleteAddOnFeeAllAReceiptsConfirmationTransText({
      transactionCount: transactionCount,
      feeType: deleteReceiptsModalProps.feeTypeName,
      studentName: student_name,
    })

    setAlertModalProps({
      ...alertModalProps,
      isOpen: true,
      header: t('deleteAllReceipts'),
      text,
      handleCloseModal: closeDeleteReceiptsModal,
      actionButtons: [
        {
          body: t('cancel'),
          onClick: closeDeleteReceiptsModal,
          type: 'outline',
        },
        {
          body: t('delete'),
          onClick: handleConfirmDeleteAllReciepts,
          category: 'destructive',
        },
      ],
    })
  }

  const deleteReceiptModalButtons = useCallback(() => {
    let actionBtn = {}
    Object.keys(deleteReceiptsModalProps?.steps).forEach((key) => {
      let ele = deleteReceiptsModalProps?.steps[key]
      if (key === STEPS_IDS.STEP_1 && ele.status === STEP_STATUS.IN_PROGRESS) {
        actionBtn = {
          text: t('deleteAllReceipts'),
          onClick: () => handleDeleteAllReciepts(),
        }
      } else if (
        key === STEPS_IDS.STEP_2 &&
        ele.status === STEP_STATUS.IN_PROGRESS
      ) {
        actionBtn = {
          text: t('deleteAddOnFeeType'),
          onClick: deleteAddOnFeeTypeButton,
        }
      }
    })

    return [
      {
        body: t('cancel'),
        onClick: () => closeDeleteReceiptsModal(),
        type: 'outline',
      },
      {
        body: (
          <div className={styles.buttonLoadingSection}>{actionBtn.text}</div>
        ),
        onClick: actionBtn.onClick,
        type: 'destructive',
      },
    ]
  }, [
    structureToDelete,
    Object.keys(deleteReceiptsModalProps).map(
      (item) => deleteReceiptsModalProps[item]
    ),
  ])
  const handleAlertModalClose = () => {
    setAlertModalProps((prev) => {
      return {...prev, isOpen: false}
    })
  }

  return (
    <ErrorBoundary>
      {alertModalProps?.isOpen && (
        <div className={DeleteRecieptsModalStyles.alertModalSection}>
          <AlertModal
            {...alertModalProps}
            handleCloseModal={handleAlertModalClose}
            actionButtons={alertModalProps?.actionButtons || []}
          />
        </div>
      )}

      {deleteReceiptsModalProps?.isOpen && (
        <DeleteRecieptsModal
          {...deleteReceiptsModalProps}
          handleCloseModal={() => closeDeleteReceiptsModal()}
          handleDeleteAllReciepts={() => handleDeleteAllReciepts()}
          actionButtons={deleteReceiptModalButtons()}
          toastOnCloseClick={() => {}}
          strutureInfo={{
            ...structureToDelete,
          }}
          eventManager={eventManager}
        />
      )}

      <div className={styles.addOnFeeTable}>
        <Table rows={rows} cols={ADD_ON_FEE_TABLE_COLS} />
        {addFeeTypeOpen && (
          <div className={styles.addNewFeeTypeCardParent}>
            <AddNewFeeTypeCard
              receiptPrefixList={receiptPrefixList}
              unusedFeeTypes={unusedFeeTypes}
              setAddFeeTypeOpen={setAddFeeTypeOpen}
              newRowData={newRowData}
              setNewRowData={setNewRowData}
            />
          </div>
        )}
        {!addFeeTypeOpen && unusedFeeTypes.length > 0 && (
          <div className={styles.addOnFeeTypeButton}>
            <Button type="text" onClick={() => setAddFeeTypeOpen(true)}>
              {t('addOnFeeType')}
            </Button>
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
}
