import React, {useEffect} from 'react'
import styles from './DiscountTillDateModal.module.css'
import {Divider, Heading, Icon, Table, Modal} from '@teachmint/krayon'
import {ErrorBoundary, ErrorOverlay, Tooltip} from '@teachmint/common'
import {useTranslation} from 'react-i18next'
import {
  DISCOUNT_TILL_DATE_MODAL_COLS,
  DISCOUNT_TILL_DATE_TABLE_NO_DATA,
} from '../../FeeTabConstant'
import {useDispatch, useSelector} from 'react-redux'
import {useStudentProfileFeeTabDiscountTillDateSelector} from '../../../redux/selectros/feeTabSelectors'
import {
  getStudentProfileFeeDiscountTillDateAction,
  setStudentProfileFeeDiscountTillDateStateAction,
} from '../../../redux/feeAndWallet/actions'
import {DateTime} from 'luxon'
import {useFeeStructure} from '../../../../../../pages/fee/redux/feeStructure/feeStructureSelectors'
import {getAmountFixDecimalWithCurrency} from '../../../../../../utils/Helpers'
import TableSkeleton from '../../skeletons/TableSkeleton/TableSkeleton'

export default function DiscountTillDateModal({
  studentId = null,
  isOpen = true,
  setIsOpen = () => {},
}) {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const {instituteInfo} = useSelector((state) => state)
  const {feeTypes} = useFeeStructure()
  const {isDataFetching, data, error} =
    useStudentProfileFeeTabDiscountTillDateSelector()

  useEffect(() => {
    if (studentId) {
      dispatch(getStudentProfileFeeDiscountTillDateAction(studentId))
    }

    return () => {
      dispatch(
        setStudentProfileFeeDiscountTillDateStateAction({
          isDataFetching: false,
          data: {},
          error: '',
        })
      )
    }
  }, [studentId])

  const rows = data?.transactions
    ? data?.transactions?.map((rowData, i) => {
        let appliedOn = rowData?.appliedOn
          .map((applied) => {
            let type = feeTypes.find((type) => type._id === applied)
            return type.name
          })
          ?.join(', ')

        return {
          id: `discountTIllDate${i}`,
          discountType: (
            <div className={styles.firstLetterCapital}>
              {rowData?.discountType}
            </div>
          ),
          amount: getAmountFixDecimalWithCurrency(
            rowData?.amount,
            instituteInfo.currency
          ),
          feeType: (
            <div>
              <span className={styles.feeType} data-tip data-for={`txnId_${i}`}>
                {appliedOn}
              </span>
              <Tooltip toolTipId={`txnId_${i}`} place="top" type="info">
                <span>{appliedOn}</span>
              </Tooltip>
            </div>
          ),
          addedOn: rowData?.timestamp
            ? DateTime.fromSeconds(rowData?.timestamp).toFormat('dd MMM yyyy')
            : '-',
        }
      })
    : DISCOUNT_TILL_DATE_TABLE_NO_DATA

  return (
    <>
      <ErrorBoundary>
        <div>
          <Modal
            size="l"
            isOpen={isOpen}
            header={
              <>
                <div className={styles.modalHeadingSection}>
                  <div className={styles.iconAndHeadingSection}>
                    <Heading textSize="x_s">
                      {t('totalDiscount')}:{' '}
                      {getAmountFixDecimalWithCurrency(
                        data.total ?? 0,
                        instituteInfo.currency
                      )}
                    </Heading>
                  </div>
                  <div>
                    <button onClick={() => setIsOpen(!isOpen)}>
                      <Icon name="close" size="x_s" version="outlined" />
                    </button>
                  </div>
                </div>
                <Divider length="100%" spacing="0px" thickness="1px" />
              </>
            }
            onClose={() => setIsOpen(!isOpen)}
          >
            {isDataFetching ? (
              <TableSkeleton tableRowsCount={7} />
            ) : (
              <>
                {error ?? <ErrorOverlay>{error}</ErrorOverlay>}
                <Table
                  uniqueKey={'id'}
                  rows={rows}
                  cols={DISCOUNT_TILL_DATE_MODAL_COLS}
                  isSelectable={false}
                />
              </>
            )}
          </Modal>
        </div>
      </ErrorBoundary>
    </>
  )
}
