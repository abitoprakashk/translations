import React from 'react'
import classNames from 'classnames'
import {Dropdown, Table, Icon} from '@teachmint/krayon'
import styles from '../../FeeReports.module.css'
import {Doughnut} from 'react-chartjs-2'
import {getAmountFixDecimalWithCurrency} from '../../../../../../utils/Helpers'
import {useTranslation} from 'react-i18next'
import {FEE_REPORTS_TEMPLATES, ICON_SIZES} from '../../../../fees.constants'
import {events} from '../../../../../../utils/EventsConstants'

const DoughnutCard = ({
  payDetails,
  getInstallmentLabels,
  getFeeData,
  getFeeClassData,
  getPaymentModeDetails,
  getFeeDataDefaulters,
  selectedDropDownOpt,
  doughnutData,
  doughnutDatatemp,
  getCurrencySymbol,
  chartOptions = {},
  eventManager,
  feeReportTemplateType,
}) => {
  const {t} = useTranslation()
  let paramName = payDetails.field

  const isEmptyState = (donutData) => {
    if (donutData.datasets[0]) {
      let isEmpty = true
      donutData.datasets[0].data.map((val) => {
        if (val !== 0) {
          isEmpty = false
        }
      })
      return isEmpty
    }
    return true
  }
  return (
    <div key={payDetails.title} className={classNames(styles.graphCont)}>
      <div className={styles.doughnutCardHeader}>
        <div className={styles.doughnutCardTitle}>{payDetails.title}</div>
        <div className={styles.wAuto}>
          <Dropdown
            fieldName="paidFeeGraph"
            isMultiSelect={false}
            isDisabled={false}
            placeholder="Select"
            classes={{
              optionsClass: styles.selectedOptDropClass,
              optionClass: styles.dropdownOption,
              dropdownClass:
                payDetails.title !== 'Fee Amount Overview'
                  ? styles.dropdownWrapperClass
                  : styles.classdropdownWraaperClass,
              placeholder: styles.dropdownPlaceholder,
            }}
            options={
              payDetails.title === 'Fee Amount Overview'
                ? getInstallmentLabels(payDetails.options)
                : payDetails.options
            }
            onChange={(val) => {
              eventManager.send_event(events.FEE_REPORT_CARD_TFI, {
                ...FEE_REPORTS_TEMPLATES[feeReportTemplateType].events,
                parameter: payDetails.options?.find(
                  (x) => x.value === val.value
                )?.label,
              })
              if (paramName === 0) {
                getFeeData(val.value)
              } else if (paramName === 1) {
                getFeeClassData(val.value)
              } else if (paramName === 2) {
                getPaymentModeDetails(val.value)
              } else {
                getFeeDataDefaulters(val.value)
              }
            }}
            selectedOptions={selectedDropDownOpt[paramName]}
          />
        </div>
      </div>
      {payDetails.cardType === 'graph' ? (
        <div className={styles.doughnutCardBody}>
          <div className={styles.doughnutGraph}>
            {isEmptyState(
              doughnutData[paramName]
                ? doughnutData[paramName]
                : doughnutDatatemp
            ) ? (
              <div className={styles.isEmptyDoughnut}>
                <div className={styles.isEmptyDoughnutIcon}>
                  <Icon
                    name={paramName === 0 ? 'payments' : 'students'}
                    size={ICON_SIZES.SIZES.MEDIUM}
                  />
                </div>
                <div>
                  {paramName === 0
                    ? t('noPaidOrDueAmount')
                    : t('noStudentsAssigned')}
                </div>
              </div>
            ) : (
              <Doughnut
                data={
                  doughnutData[paramName]
                    ? doughnutData[paramName]
                    : doughnutDatatemp
                }
                options={{...chartOptions}}
              />
            )}
          </div>
          <div className={styles.doughnutStatCont}>
            {payDetails.labels.map((label, index) => (
              <div key={index} className={classNames(styles.graphLabels)}>
                <div
                  className={styles.doughnutCardLegend}
                  style={{backgroundColor: label.color}}
                ></div>
                <div className={styles.doughnutStateLabel}>{label.label}</div>
                <div className={styles.amountValue}>
                  {paramName !== 1
                    ? getAmountFixDecimalWithCurrency(
                        doughnutData?.[paramName]?.labelData?.[index] ?? 0,
                        getCurrencySymbol()
                      )
                    : doughnutData?.[paramName]?.labelData?.[index]}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.defaulterTableCont}>
          <div className={styles.defaulterTable}>
            <Table
              cols={payDetails.cols}
              rows={doughnutData[paramName]?.['tableData']}
              classes={{table: styles.defaultersTable}}
            />
          </div>
        </div>
      )}
      {/* <div
        className={classNames(styles.divider, styles.defaulterTableDivider)}
      ></div>
      <div
        className={styles.defaulterDownload}
        onClick={() => payDetails.detailedReportRedirection()}
      >
        {t('viewDetailedReport')}
      </div> */}
    </div>
  )
}

export default DoughnutCard
