import React, {useState} from 'react'
import {Icon, Table, Modal, PlainCard} from '@teachmint/krayon'
import styles from '../../FeeReports.module.css'
import {
  FEE_REPORTS_TEMPLATES,
  ICON_SIZES,
  screenWidth,
  MWEB_FEE_TABLE_CARD_DATA,
  MWEB_FEE_BOTTOM_SHEET_DATA,
} from '../../../../../pages/fee/fees.constants'
import {useTranslation} from 'react-i18next'
import tableStyles from '../../../../../pages/AttendanceReport/styles/Table.module.css'
import classNames from 'classnames'

const FeeTable = ({
  tableData,
  loader,
  getColumnMap,
  reportType,
  getSortSymbols,
  instituteInfo,
  getCustomTableColumns,
}) => {
  const {t} = useTranslation()
  const [selectedCardData, setSelectedCardData] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [feeTypeBreakUpModalProps, setFeeTypeBreakUpModalProps] = useState({
    isOpen: false,
  })

  const handleOpenFeeTypeBreakupModal = ({rowData, breakupArr = []}) => {
    let jsx = (
      <div className={classNames(styles.feeTypeBrakupJsxSection)}>
        {breakupArr?.map?.((item, idx) => {
          return <PlainCard key={idx}>{item}</PlainCard>
        })}
      </div>
    )

    setFeeTypeBreakUpModalProps((prev) => {
      return {...prev, isOpen: true, jsx, rowData}
    })
  }
  const handleOpenFeeTypeBreakupModalClose = () => {
    setFeeTypeBreakUpModalProps({isOpen: false})
  }

  const isPopupAllowed = () => {
    switch (reportType) {
      case 'FEE_COLLECTION_MONTH':
      case 'FEE_COLLECTION_DAILY':
      case 'FEE_COLLECTION_DEPARTMENTWISE':
      case 'FEE_COLLECTION_CLASSWISE':
      case 'FEE_COLLECTION_FEETYPEWISE':
      case 'FEE_COLLECTION_PAYMENTMODEWISE':
      case 'FEE_COLLECTION_SECTIONWISE':
        return false
    }
    return true
  }

  const getColumnData = () => {
    return (
      getColumnMap(FEE_REPORTS_TEMPLATES[reportType].value, getSortSymbols) || [
        {
          label: getSortSymbols('Student Name', 'studentName', 'name'),
          key: 'studentName',
        },
        {
          label: getSortSymbols('Class', 'classroom', 'class'),
          key: 'classroom',
        },
        {
          label: getSortSymbols(
            'Fee Applicable till date',
            'feeApplicableTillDate',
            'count'
          ),
          key: 'feeApplicableTillDate',
        },
        {
          key: 'paid',
          label: getSortSymbols('Paid', 'paid', 'count'),
        },
        {
          key: 'pendingDues',
          label: getSortSymbols('Overdue', 'pendingDues', 'count'),
        },
      ]
    )
  }

  const handleOpenPopup = (row) => {
    if (!isPopupAllowed()) return null
    setSelectedCardData(row)
    setIsModalOpen(true)
  }

  const rowData = (index, row, rowKey) => {
    if (index === 0 && row[rowKey.key]) {
      return <div className={styles.mwebPaymentStatus}>{row[rowKey.key]}</div>
    } else if (rowKey.label === 'divider') {
      return <div className={classNames(styles.mwebDivider)}></div>
    } else {
      return (
        <div
          className={classNames(
            index === 1 ? styles.mwebTableCardTitle : styles.mwebTableCardSub,
            styles.flex
          )}
        >
          {rowKey.label ? <div>{rowKey.label}&nbsp;</div> : ''}
          <div className={styles.mwebTableCardValue}>{row[rowKey.key]}</div>
        </div>
      )
    }
  }

  const tableMWeb = () => {
    return (
      <div>
        {getCustomTableColumns(tableData, instituteInfo, {
          handleOpenFeeTypeBreakupModal,
        }).map((row, idx) => (
          <div
            key={idx}
            className={styles.mwebTableCard}
            onClick={() => handleOpenPopup(row)}
          >
            {MWEB_FEE_TABLE_CARD_DATA[reportType].map((rowKey, index) => (
              <div key={index}>{rowData(index, row, rowKey)}</div>
            ))}
            {isPopupAllowed() && (
              <Icon
                name="arrowForwardIos"
                size={ICON_SIZES.SIZES.XXX_SMALL}
                className={styles.mwebTableCardArrow}
                version="filled"
              />
            )}
          </div>
        ))}
      </div>
    )
  }

  const getSelectedCardDataPopup = () => {
    if (!selectedCardData) return null
    return (
      <div className={styles.mwebModalCont}>
        {MWEB_FEE_BOTTOM_SHEET_DATA[reportType].map((row, idx) => (
          <div key={idx}>
            {row.label === 'divider' ? (
              <div className={styles.mwebDivider}></div>
            ) : idx <= 2 ? (
              <div
                className={
                  idx === 0 ? styles.mwebModalTitle : styles.mwebModalSubTitle
                }
              >
                {row.label} {selectedCardData[row.key]}
              </div>
            ) : (
              <div className={styles.mwebModalInfoCont}>
                {row.label === 'blue-cont' ? (
                  <div className={styles.popUpBlueCont}>
                    {row.data.map((subRow, index) => (
                      <div key={index} className={styles.popUpBlueInnerCont}>
                        <div>{subRow.label}</div>
                        <div>{selectedCardData[subRow.key]}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className={styles.mwebModalLabel}>{row.label}</div>
                    <div className={styles.mwebModalValue}>
                      {selectedCardData[row.key]}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
        <div
          onClick={() => {
            setSelectedCardData(null)
            setIsModalOpen(false)
          }}
        >
          <Icon
            name="close"
            size={ICON_SIZES.SIZES.X_SMALL}
            version="filled"
            className={styles.mwebModalCross}
          />
        </div>
        <br />
      </div>
    )
  }

  return loader ? null : tableData && tableData.length !== 0 ? (
    <>
      {feeTypeBreakUpModalProps?.isOpen && (
        <div className={styles.mwebModalLayout}>
          <Modal
            isOpen={feeTypeBreakUpModalProps?.isOpen}
            header={feeTypeBreakUpModalProps?.rowData?.studentName}
            onClose={handleOpenFeeTypeBreakupModalClose}
            size="s"
            children={feeTypeBreakUpModalProps?.jsx}
            classes={{content: 'show-scrollbar show-scrollbar-small'}}
          />
        </div>
      )}
      <div className={styles.mwebModalLayout}>
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setSelectedCardData(null)
            setIsModalOpen(false)
          }}
          showCloseIcon={true}
          children={getSelectedCardDataPopup()}
        />
      </div>
      {screenWidth() > 1024 ? (
        <div className={styles.tableData}>
          <Table
            virtualized
            autoSize
            cols={getColumnData()}
            rows={getCustomTableColumns(tableData, instituteInfo, {
              handleOpenFeeTypeBreakupModal,
            })}
            classes={{table: tableStyles.table}}
          />
        </div>
      ) : (
        tableMWeb()
      )}
    </>
  ) : (
    <div className={styles.noDataAvailable}>
      <div className={styles.noDataAvailIcon}>
        <Icon name="graph1" size={ICON_SIZES.SIZES.X_SMALL}></Icon>
      </div>
      <div className={styles.noDataAvailSub}>
        <div>{t('noDataToShow')}</div>
        <div>{t('noClassMatchingTheFilter')}</div>
      </div>
    </div>
  )
}

export default FeeTable
