import React, {useEffect, useState} from 'react'
import styles from './Slider.module.css'
import {Button, MultiSelectInput, StickyFooter} from '@teachmint/common'
import {useTranslation} from 'react-i18next'
import SliderScreen from '../../../../../components/Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../../../../components/Common/SliderScreenHeader/SliderScreenHeader'
import {
  DATE_RANGE_INPUT_TYPE,
  FEE_REPORTS_TEMPLATES,
  FEE_REPORTS_TITLE,
  FIELD_SORT,
  INSTITUTE_TREE_TYPE,
  MULTI_SELECT_WITH_CHIPS,
  SELECT_DETAILS_FOR_WHICH_YOU_WANT_TO_DOWNLOAD_REPORT,
} from '../../../fees.constants'
import NumberLabel from '../../tfi-common/NumberLabel/NumberLabel'
import {useDispatch, useSelector} from 'react-redux'
import {
  downloadReportAction,
  resetFeeReportStatesAction,
  setIsPendingChequeDataIncludedAction,
} from '../../../redux/feeReports/feeReportsAction'
import {getAcademicSessionMonths} from '../../../../../utils/Helpers'
import DateField from '../../../../../components/Common/DateField/DateField'
import {DateTime} from 'luxon'
import InstituteTree from '../../tfi-common/InstituteTree/InstituteTree'
import classNames from 'classnames'
import {inputFields} from './InputFields'
import {prepareDataForDownloadRequest} from '../commonFunctions'
import {validateReportDownloadButton} from '../validation'
import {events} from '../../../../../utils/EventsConstants'

export default function FeePaidDueSlider({
  setOpen,
  sliderHeading,
  handleDataChange,
  feeReportTemplateKey,
}) {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  let numberForVisibleSection = 0

  const {
    instituteAcademicSessionInfo,
    instituteActiveAcademicSessionId,
    instituteStudentList,
    eventManager,
  } = useSelector((state) => state)
  const sessionRange = instituteAcademicSessionInfo.find(
    (session) => session._id == instituteActiveAcademicSessionId
  )
  const sessionMonths = getAcademicSessionMonths(
    sessionRange.start_time,
    sessionRange.end_time
  )

  const {
    dateRange,
    months,
    paymentModes,
    isPendingChequeDataIncluded,
    reportTemplateId,
    hierarchyIds,
    masterCategoryIds,
    feeTypeList,
    instalmentTimestampList,
    selectedInstalmentTimestamp,
    chequeStatus,
    loader,
  } = useSelector((state) => state.feeReports)

  const state = useSelector((state) => state)
  const {instituteHierarchy, instituteInfo} = state

  const [reportName] = useState('')
  const [isQuerySaveChecked] = useState(false)
  const [isDownloadButtonDisabled, setIsDownloadButtonDisabled] = useState(true)
  const [categoryBreakdown, setCategoryBreakdown] = useState(false)

  useEffect(() => {
    return () => {
      dispatch(resetFeeReportStatesAction())
    }
  }, [])

  useEffect(() => {
    setIsDownloadButtonDisabled(
      validateReportDownloadButton(reportTemplateId, {
        months,
        paymentModes,
        hierarchyIds: Object.keys(hierarchyIds).length
          ? Object.keys(hierarchyIds)
          : [],
        selectedInstalmentTimestamp,
        chequeStatus,
        masterCategoryIds,
      })
    )
    return () => {
      setIsDownloadButtonDisabled(false)
    }
  }, [
    months,
    paymentModes,
    hierarchyIds,
    selectedInstalmentTimestamp,
    chequeStatus,
    masterCategoryIds,
  ])

  const handleIsPendingChequeDataIncluded = (checked) => {
    dispatch(setIsPendingChequeDataIncludedAction(checked))
  }

  const trackEventClick = () => {
    eventManager.send_event(events.FEE_REPORT_DOWNLOAD_CLICKED_TFI, {
      ...FEE_REPORTS_TEMPLATES[feeReportTemplateKey].events,
      screen_name: 'fee_report',
    })
  }

  const handleDownloadReport = () => {
    let hierarchy_ids = hierarchyIds

    if (
      [
        FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_STUDENTWISE.value,
        FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_CLASSWISE.value,
        FEE_REPORTS_TEMPLATES.FEE_COLLECTION_CLASSWISE.value,
        FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_SECTIONWISE.value,
        FEE_REPORTS_TEMPLATES.FEE_COLLECTION_SECTIONWISE.value,
      ].includes(reportTemplateId)
    ) {
      hierarchy_ids = Object.keys(hierarchyIds).length
        ? Object.keys(hierarchyIds)
        : []
    }

    let data = {}
    data.report_type = reportTemplateId
    data.meta = {
      report_name: reportName,
      hierarchy_ids,
      category_master_ids: masterCategoryIds,
      date_range: {
        start_date: DateTime.fromFormat(
          dateRange.startDate,
          'yyyy-MM-dd'
        ).toSeconds(),
        end_date: DateTime.fromFormat(dateRange.endDate, 'yyyy-MM-dd')
          .endOf('day')
          .toSeconds(),
      },
      months,
      timestamps: selectedInstalmentTimestamp,
      payment_modes: paymentModes,
      transaction_statuses: chequeStatus,
      is_pending_cheque: isPendingChequeDataIncluded,
      category_breakdown: categoryBreakdown,
    }
    data.is_saved = isQuerySaveChecked

    data = prepareDataForDownloadRequest(data)
    data.metaData = {
      instituteInfo,
      reportName: FEE_REPORTS_TITLE[data.report_type],
      sessionStartDate: sessionRange.start_time,
      sessionEndDate: sessionRange.end_time,
      instituteStudentList,
      instituteHierarchy,
      feeTypeList,
      instalmentTimestampList,
      trackEventClick,
    }
    dispatch(downloadReportAction(data))
  }

  const getSelectedNodes = (nodes, type, dispatchType) => {
    const ids = {}
    Object.keys(nodes).map((node) => {
      if (nodes[node].type === type) {
        ids[node] = true
      }
    })

    handleDataChange(ids, dispatchType)
  }

  let allStates = {
    dateRange,
    paymentModes,
    isPendingChequeDataIncluded,
    masterCategoryIds,
    hierarchyIds,
    months,
    selectedInstalmentTimestamp,
    chequeStatus,
    reportTemplateId,
    feeTypeList,
    instalmentTimestampList,
    instituteHierarchy,
    sessionMonths,
    categoryBreakdown,
  }

  let allFunctions = {
    t,
    getSelectedNodes,
    handleIsPendingChequeDataIncluded,
    setCategoryBreakdown,
  }

  const numberItems = inputFields(allStates, allFunctions, styles)

  function sortBy(array, keys = null) {
    if (keys === null) {
      keys = FIELD_SORT.DEFAULT

      let sequence = Object.values(FEE_REPORTS_TEMPLATES).find(
        (report) => report.value === reportTemplateId
      )

      if (typeof sequence?.sort !== 'undefined') {
        keys = sequence.sort
      }
    }

    let sortedArr = []

    array.forEach((ele) => {
      let index = keys.indexOf(ele.id)
      if (index != -1) {
        // element found
        if (typeof sortedArr[index] !== 'undefined') {
          sortedArr.splice(index, 0, ele)
        } else {
          sortedArr[index] = ele
        }
      } else {
        // element not found
        sortedArr.push(ele)
      }
    })
    return sortedArr
  }

  return (
    <div>
      <SliderScreen setOpen={() => setOpen(false)} width="1000">
        <>
          <SliderScreenHeader
            title={sliderHeading}
            // iconHtml={<div className={styles.headerBigDotIcon}></div>}
          />
          <div
            className={classNames(
              styles.contentSection,
              'show-scrollbar show-scrollbar-big'
            )}
          >
            <div className={styles.sliderTitleSection}>
              <span className={styles.sliderTitle}>
                {t(SELECT_DETAILS_FOR_WHICH_YOU_WANT_TO_DOWNLOAD_REPORT)}
              </span>
            </div>
            {loader ? (
              <div className="loading"></div>
            ) : (
              <div>
                {sortBy(numberItems).map((item) => {
                  if (item.isVisible) {
                    numberForVisibleSection++
                    return (
                      <div key={item.id} className={styles.blockSection}>
                        <div className={styles.numberLabelSection}>
                          <NumberLabel
                            number={numberForVisibleSection}
                            label={item.numberLabel.label}
                            isRequired={true}
                            labelClassName={styles.textCapitalize}
                          />
                        </div>
                        <div
                          className={classNames({
                            [styles.inputFieldSection]: ![
                              INSTITUTE_TREE_TYPE,
                              DATE_RANGE_INPUT_TYPE,
                            ].includes(item.inputField.type),
                          })}
                        >
                          {item.inputField.type === MULTI_SELECT_WITH_CHIPS && (
                            <>
                              <MultiSelectInput
                                showSelectAll={true}
                                options={item.inputField.options}
                                selectedOptions={item.inputField.value}
                                onChange={(obj) =>
                                  handleDataChange(obj, item.dispatchType)
                                }
                                withTags={true}
                                placeholderClassName={styles.inputField}
                                placeholder={item.inputField.placeholder}
                                dropdownClassName={classNames(
                                  'show-scrollbar show-scrollbar-small',
                                  styles.zIndex15
                                )}
                              />
                            </>
                          )}

                          {item.inputField.type === INSTITUTE_TREE_TYPE && (
                            <>
                              <InstituteTree
                                isVertical={false}
                                allChecked={true}
                                getSelectedNodes={item.inputField.onChange}
                                hierarchyTypes={item.inputField.hierarchyTypes}
                                expandChildNodesDefault={
                                  item.inputField.expandChildNodesDefault ??
                                  true
                                }
                                expandTill={item.inputField.expandTill}
                              />
                            </>
                          )}

                          {item.inputField.type === DATE_RANGE_INPUT_TYPE && (
                            <div className={styles.dateSection}>
                              <div className={styles.dateField}>
                                <DateField
                                  value={dateRange.startDate}
                                  handleChange={(_, value) => {
                                    handleDataChange(
                                      {startDate: value},
                                      item.dispatchType
                                    )
                                  }}
                                  fieldName="startDate"
                                  min={DateTime.fromMillis(
                                    parseInt(sessionRange.start_time)
                                  ).toFormat('yyyy-MM-dd')}
                                  max={DateTime.fromMillis(
                                    parseInt(sessionRange.end_time)
                                  ).toFormat('yyyy-MM-dd')}
                                  classes={{
                                    dateWrapper: classNames(
                                      styles.dateWrapper,
                                      styles.higherSpecifisity
                                    ),
                                  }}
                                />
                              </div>

                              <div className={styles.dateField}>
                                <DateField
                                  value={dateRange.endDate}
                                  handleChange={(_, value) => {
                                    handleDataChange(
                                      {endDate: value},
                                      item.dispatchType
                                    )
                                  }}
                                  fieldName="endDate"
                                  min={DateTime.fromMillis(
                                    parseInt(sessionRange.start_time)
                                  ).toFormat('yyyy-MM-dd')}
                                  // max={DateTime.now().toFormat('yyyy-MM-dd')}
                                  max={DateTime.fromMillis(
                                    parseInt(sessionRange.end_time)
                                  ).toFormat('yyyy-MM-dd')}
                                  classes={{
                                    dateWrapper: classNames(
                                      styles.dateWrapper,
                                      styles.higherSpecifisity
                                    ),
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        {item?.subSection
                          ? item?.subSection.map(
                              (subSection) =>
                                subSection.isVisible && (
                                  <div key={subSection.id}>
                                    {subSection.html}
                                  </div>
                                )
                            )
                          : null}
                      </div>
                    )
                  }
                })}
              </div>
            )}
          </div>

          {!loader && (
            <StickyFooter forSlider={true}>
              <div className={styles.footerSection}>
                {/* FOR NEXT RELASE */}
                {/* <div className={styles.footerCheckboxSection}>
                <div>
                  <Input
                    type="checkbox"
                    isChecked={isQuerySaveChecked}
                    fieldName="permanent"
                    onChange={() => setIsQuerySaveChecked(!isQuerySaveChecked)}
                    labelTxt={t(
                      SAVE_THIS_QUERY_YOU_CAN_ACCESS_IT_VIA_SAVED_REPORTS_QUERIES
                    )}
                    className={styles.footerCheckbox}
                  />
                </div>
                {isQuerySaveChecked && (
                  <div>
                    <Input
                      type="text"
                      fieldName="name"
                      value={reportName}
                      isRequired={true}
                      onChange={(obj) => setReportName(obj.value)}
                    />
                  </div>
                )}
              </div> */}
                <div>
                  <Button
                    size={'big'}
                    className={styles.downloadReportBtn}
                    onClick={handleDownloadReport}
                    disabled={isDownloadButtonDisabled}
                  >
                    {t('downloadReport')}
                  </Button>
                </div>
              </div>
            </StickyFooter>
          )}
        </>
      </SliderScreen>
    </div>
  )
}
