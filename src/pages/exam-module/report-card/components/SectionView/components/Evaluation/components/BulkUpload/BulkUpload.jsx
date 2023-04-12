import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import {ErrorBoundary} from '@teachmint/common'
import {
  Tooltip,
  Alert,
  ALERT_CONSTANTS,
  Button,
  Drawer,
  Heading,
  HEADING_CONSTANTS,
  Para,
  PARA_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  Divider,
  isMobile,
} from '@teachmint/krayon'
import classNames from 'classnames'
import {useSelector, useDispatch} from 'react-redux'
import {useTranslation} from 'react-i18next'
import styles from './BulkUpload.module.css'

import CSVUpload from '../../../../../../../../../components/Common/CSVUpload/CSVUpload'
import Loader from '../../../../../../../../../components/Common/Loader/Loader'
import {showSuccessToast} from '../../../../../../../../../redux/actions/commonAction'
import {
  validateCSVdata,
  validateDataReset,
  downloadCSVcurrent,
  resetCurrentMarksheetCSVdata,
  downloadErrorCSV,
  resetErrorCSVData,
  updateMarksFromCSV,
  resetUpdatedFromCSVAction,
} from './../../../../../../redux/actions'
import {createAndDownloadCSV} from '../../../../../../../../../utils/Helpers.js'
import {events} from '../../../../../../../../../utils/EventsConstants'
import {PERMISSION_CONSTANTS} from '../../../../../../../../../utils/permission.constants'
import Permission from '../../../../../../../../../components/Common/Permission/Permission'

const BulkUpload = ({setIsSliderOpen, sectionId}) => {
  const dispatch = useDispatch()
  const eventManager = useSelector((state) => state.eventManager)
  const activeStandard = useSelector(
    ({reportCard}) => reportCard.activeStandard
  )
  const activeSection = useSelector(({reportCard}) => reportCard.activeSection)
  const classSectionName = `${activeStandard.name}-${activeSection.name}`
  const {standardId: classId} = useParams()
  const {
    csvValidationResult,
    currentMarksheetCSV,
    errorMarksheetCSV,
    updatedFromCSV,
    csvValidationResultFailed,
  } = useSelector(({reportCard}) => reportCard)
  const [isLoading, setIsLoading] = useState(false)
  const [showTable, setShowTable] = useState(false)
  const [noOfErrors, setNoOfErrors] = useState(0)
  const [staticErrorMsg, setStaticErrorMsg] = useState(null)

  const {t} = useTranslation()

  useEffect(() => {
    return () => {
      dispatch(validateDataReset())
      dispatch(resetCurrentMarksheetCSVdata())
      dispatch(resetErrorCSVData())
    }
  }, [])

  useEffect(() => {
    if (csvValidationResult) {
      eventManager.send_event(events.REPORT_CARD_CSV_UPLOADED_TFI, {
        class_id: classId,
        section_id: sectionId,
        upload_status: csvValidationResult.has_no_error ? 'no_error' : 'error',
      })
      setShowTable(true)
      let count = 0
      if (csvValidationResult.has_no_error) {
        setIsLoading(false)
        return
      }
      if (csvValidationResult.message.length) {
        setStaticErrorMsg(csvValidationResult.message[0])
      } else {
        setStaticErrorMsg(null)
      }
      csvValidationResult.data.forEach((row) => {
        row.forEach((item) => {
          if (item.error.length) count++
        })
      })
      setNoOfErrors(count + csvValidationResult.message.length)
    } else {
      setShowTable(false)
    }
    setIsLoading(false)
  }, [csvValidationResult])

  useEffect(() => {
    if (csvValidationResultFailed) {
      setIsLoading(false)
      setShowTable(false)
      setStaticErrorMsg(t('somethingWentWrong'))
    }
  }, [csvValidationResultFailed])

  useEffect(() => {
    if (currentMarksheetCSV)
      createAndDownloadCSV(`${classSectionName} marksheet`, currentMarksheetCSV)
  }, [currentMarksheetCSV])

  useEffect(() => {
    if (errorMarksheetCSV)
      createAndDownloadCSV(`${classSectionName} issue list`, errorMarksheetCSV)
  }, [errorMarksheetCSV])

  useEffect(() => {
    if (updatedFromCSV) {
      dispatch(resetUpdatedFromCSVAction())
      setIsSliderOpen(false)
      dispatch(showSuccessToast(t('marksUpdated')))
    }
  }, [updatedFromCSV])

  const handleCSV = (success, csvStr) => {
    if (!success) return
    eventManager.send_event(events.REPORT_CARD_UPLOAD_CSV_INITIATED_TFI, {
      class_id: classId,
      section_id: sectionId,
    })
    dispatch(validateDataReset())
    setIsLoading(true)
    let params = {
      section_id: sectionId,
      csv_str: csvStr,
      standard_id: classId,
    }
    dispatch(validateCSVdata(params))
  }

  const handleDownloadErrorFile = () => {
    eventManager.send_event(events.REPORT_CARD_DOWNLOAD_CSV_ERROR_CLICKED_TFI, {
      class_id: classId,
      section_id: sectionId,
    })
    dispatch(downloadErrorCSV(csvValidationResult))
  }

  const handleDownloadCurrentMarksheetFile = () => {
    eventManager.send_event(
      events.REPORT_CARD_DOWNLOAD_MARKSHEET_CSV_CLICKED_TFI,
      {
        class_id: classId,
        section_id: sectionId,
      }
    )
    if (currentMarksheetCSV) {
      createAndDownloadCSV(`${classSectionName} marksheet`, currentMarksheetCSV)
    } else {
      dispatch(downloadCSVcurrent({section_id: sectionId}))
    }
  }

  const handleProceedOnClick = () => {
    eventManager.send_event(events.REPORT_CARD_CSV_PROCEED_CLICKED_TFI, {
      class_id: classId,
      section_id: sectionId,
    })
    dispatch(
      updateMarksFromCSV({
        ...csvValidationResult,
        section_id: sectionId,
        standard_id: classId,
      })
    )
  }

  const renderHeaderRow = (row) => {
    return row?.map((item, i) => (
      <th
        key={item.key}
        className={classNames({
          [styles.errorCell]:
            item.error.length && !csvValidationResult.has_no_error,
          [styles.successCell]:
            !item.error.length &&
            csvValidationResult.has_no_error &&
            item.is_changed,
        })}
      >
        {item.error.length ? (
          <>
            <a
              className={styles.errorAnchor}
              data-for={`${i - 3}-${item.key}-header`}
              data-tip
            >
              {item.value}
            </a>
            <Tooltip
              title={t('issue')}
              toolTipBody={item.error}
              toolTipId={`${i - 3}-${item.key}-header`}
            />
          </>
        ) : (
          item.value
        )}
      </th>
    ))
  }

  const renderBody = () => {
    if (!csvValidationResult?.data) return
    let data = {...csvValidationResult}
    let arr = data.data.slice(3)
    return arr.map((item, i) => (
      <tr key={i}>
        {item.map((row) => (
          <td
            key={row.key}
            className={classNames({
              [styles.errorCell]: row.error.length && !data.has_no_error,
              [styles.successCell]:
                !row.error.length && data.has_no_error && row.is_changed,
            })}
          >
            {row.error.length ? (
              <>
                <a
                  className={styles.errorAnchor}
                  data-for={`${i}-${row.key}`}
                  data-tip
                >
                  {row.value}
                </a>
                <Tooltip
                  title={t('issue')}
                  toolTipBody={row.error}
                  toolTipId={`${i}-${row.key}`}
                />
              </>
            ) : (
              row.value
            )}
          </td>
        ))}
      </tr>
    ))
  }

  const errorAlertComponent = () => {
    return (
      <div className={styles.alertContent}>
        <Para
          textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
          type={ALERT_CONSTANTS.TYPE.ERROR}
        >
          {staticErrorMsg
            ? staticErrorMsg
            : `${noOfErrors} ${t('csvErrorAlert')}`}
        </Para>
        <Permission
          permissionId={
            PERMISSION_CONSTANTS.BulkCsvController_downloadedErrorList_read
          }
        >
          <Icon
            name="download"
            type={ICON_CONSTANTS.TYPES.PRIMARY}
            size={ICON_CONSTANTS.SIZES.XX_SMALL}
            onClick={handleDownloadErrorFile}
            className={styles.downloadIcon}
          />
        </Permission>
      </div>
    )
  }

  return (
    <Drawer
      direction="right"
      open={true}
      widthInPercent={isMobile() ? 97 : 70}
      onClose={() => setIsSliderOpen(false)}
    >
      <Drawer.Header>
        <Heading
          textSize={HEADING_CONSTANTS.TEXT_SIZE.X_SMALL}
          weight={HEADING_CONSTANTS.WEIGHT.BOLD}
        >
          {t('uploadCsv')}
        </Heading>
        {csvValidationResult?.has_no_error && (
          <Permission
            permissionId={
              PERMISSION_CONSTANTS.BulkCsvController_uploadCsv_update
            }
          >
            <Button onClick={handleProceedOnClick}>{t('proceed')}</Button>
          </Permission>
        )}
      </Drawer.Header>
      <Drawer.Content>
        <div className={styles.wrapper}>
          {!showTable ? (
            <ErrorBoundary>
              <CSVUpload
                headingText={t('bulkUploadMarks')}
                downloadButtonText={t('downloadCurrentMarksheet')}
                handleCSV={handleCSV}
                downloadSampleCSVFile={handleDownloadCurrentMarksheetFile}
                permissions={{
                  downloadPermission:
                    PERMISSION_CONSTANTS.BulkCsvController_getDownloadCsv_read,
                  uploadPermission:
                    PERMISSION_CONSTANTS.BulkCsvController_validateCsv_read,
                }}
                onlyText={true}
              />
              <Divider spacing={20} />
              <div className={styles.desc}>
                <div className={styles.heading}>
                  {t('howToBulkUploadMarks')}
                </div>
                <ol className={styles.points}>
                  <li>{t('step1ToBulkUpload')}</li>
                  <li>{t('step2ToBulkUpload')}</li>
                  <li>{t('step3ToBulkUpload')}</li>
                  <li>{t('step4ToBulkUpload')}</li>
                </ol>
              </div>
            </ErrorBoundary>
          ) : (
            <ErrorBoundary>
              <Button
                type="text"
                prefixIcon="refresh"
                classes={{button: styles.reupload}}
                onClick={() => {
                  eventManager.send_event(
                    events.REPORT_CARD_CSV_REUPLOAD_CLICKED_TFI,
                    {
                      class_id: classId,
                      section_id: sectionId,
                    }
                  )
                  dispatch(validateDataReset())
                }}
              >
                Re-upload
              </Button>
              {!csvValidationResult?.has_no_error && (
                <Alert
                  hideClose={true}
                  type="error"
                  content={errorAlertComponent()}
                  className={styles.alertWrapper}
                />
              )}
              {csvValidationResult?.data?.length &&
              !csvValidationResult.message.length ? (
                <div className={styles.tableWrapper}>
                  <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
                    Changes Preview
                  </Heading>
                  <table className={styles.table}>
                    <thead>
                      <tr>{renderHeaderRow(csvValidationResult?.data[0])}</tr>
                      <tr>{renderHeaderRow(csvValidationResult?.data[1])}</tr>
                      <tr>{renderHeaderRow(csvValidationResult?.data[2])}</tr>
                    </thead>
                    <tbody>{renderBody()}</tbody>
                  </table>
                </div>
              ) : null}
            </ErrorBoundary>
          )}
        </div>
        <Loader show={isLoading} />
      </Drawer.Content>
    </Drawer>
  )
}

export default BulkUpload
