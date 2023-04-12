import React, {useEffect, useState} from 'react'
import {Dropdown, EmptyState, Widget} from '@teachmint/krayon'
import {t} from 'i18next'
import styles from './AdmissionWidget.module.css'
import classNames from 'classnames'
import {DownloadReport} from '../../../components/DownloadReport'
import {useDispatch, useSelector} from 'react-redux'
import globalActions from '../../../../../redux/actions/global.actions'
import {ADMISSION_CSV_FILE_NAME, ADMISSION_CSV_HEADER} from '../../Constants'
import {DateTime} from 'luxon'
import {
  formatCurrencyToCountry,
  getSymbolFromCurrency,
} from '../../../../../utils/Helpers'
import {DEFAULT_CURRENCY} from '../../../../../constants/common.constants'

export default function AdmissionWidget({getCsvData}) {
  const dispatch = useDispatch()
  const cardsDataStr = {
    inquiries: {
      value: 0,
      title: t('inquiries'),
      description: t('totalLeads'),
    },
    collections: {
      value: 0,
      title: t('collections'),
      description: t('totalCollected'),
      className: styles.collectionsValue,
      showCurrency: true,
    },
    applications: {
      value: 0,
      title: t('applications'),
      description: t('totalFormFilled'),
    },
    admissions: {
      value: 0,
      title: t('admissions'),
      description: t('totalAdmitted'),
    },
  }
  const [csvData, setCsvData] = useState([])
  const [admissionApiData, setAdmissionApiData] = useState([])
  const [showDataWidget, setShowDataWidget] = useState(false)
  const [admissionTotalData, setAdmissionTotalData] = useState(cardsDataStr)

  const dateDropDown = {
    yesterday: {
      label: 'Yesterday',
      value: 'yesterday',
      start_date: DateTime.now().plus({days: -1}).toISODate(),
      end_date: DateTime.now().toISODate(),
    },
    lastSevenDays: {
      label: 'Last 7 Days',
      value: 'lastSevenDays',
      start_date: DateTime.now().plus({days: -7}).toISODate(),
      end_date: DateTime.now().toISODate(),
    },
    lastThirtyDays: {
      label: 'Last 30 Days',
      value: 'lastThirtyDays',
      start_date: DateTime.now().plus({days: -30}).toISODate(),
      end_date: DateTime.now().toISODate(),
    },
    allSession: {
      label: 'All Session',
      value: 'allSession',
      start_date: '',
      end_date: '',
    },
  }

  const [selectedDateKey, setSelectedDateKey] = useState(
    dateDropDown.yesterday.value
  )

  const orgAdmissionReport = useSelector(
    (state) => state.globalData.orgAdmissionReport?.data
  )
  const {instituteListInfo} = useSelector((state) => state)
  const orgCurrency = instituteListInfo?.find(
    (institute) => institute?.currency !== null
  )?.currency

  useEffect(() => {
    if (orgAdmissionReport) {
      setAdmissionApiData(orgAdmissionReport)
    }
  }, [orgAdmissionReport])

  useEffect(() => {
    //call admission api for data
    dispatch(
      globalActions?.getOrgAdmissionReport?.request({
        start_date: dateDropDown[selectedDateKey].start_date,
        end_date: dateDropDown[selectedDateKey].end_date,
      })
    )
  }, [selectedDateKey])

  useEffect(() => {
    if (admissionApiData.length > 0) {
      let csvLines = [[...ADMISSION_CSV_HEADER]]
      let parsedData = admissionApiData.reduce((aggregated, data) => {
        csvLines.push([
          data?.institute_id,
          data?.no_of_inquiries,
          data?.fees_collected,
          data?.no_of_applications,
          data?.no_of_admissions,
        ])
        return {
          no_of_applications:
            (aggregated?.no_of_applications || 0) + data?.no_of_applications,
          no_of_inquiries:
            (aggregated?.no_of_inquiries || 0) + data?.no_of_inquiries,
          no_of_admissions:
            (aggregated?.no_of_admissions || 0) + data?.no_of_admissions,
          fees_collected:
            (aggregated?.fees_collected || 0) + data?.fees_collected,
        }
      }, {})

      let draft = {...admissionTotalData}
      draft.inquiries.value = parsedData.no_of_inquiries
      draft.collections.value = parsedData.fees_collected
      draft.applications.value = parsedData.no_of_applications
      draft.admissions.value = parsedData.no_of_admissions

      csvLines.push([
        t('total'),
        parsedData.no_of_inquiries,
        parsedData.fees_collected,
        parsedData.no_of_applications,
        parsedData.no_of_admissions,
      ])
      setCsvData(csvLines)
      setAdmissionTotalData(draft)
      setShowDataWidget(true)
    }
  }, [admissionApiData])

  const AdmissionCard = (data) => {
    return (
      <div className={styles.admissionCard}>
        <div className={classNames(styles.value, data.className)}>
          {data.showCurrency && (
            <span>
              {getSymbolFromCurrency(orgCurrency || DEFAULT_CURRENCY)}
            </span>
          )}{' '}
          {formatCurrencyToCountry(data.value)}
        </div>
        <div className={styles.title}>{data.title}</div>
        <div className={styles.description}>{data.description}</div>
      </div>
    )
  }

  return (
    <Widget
      header={{title: 'Admissions', icon: 'bookmark'}}
      classes={{iconFrame: styles.iconBgColor}}
      actionButtons={[
        <DownloadReport
          fileName={ADMISSION_CSV_FILE_NAME}
          data={getCsvData(csvData)}
          key={ADMISSION_CSV_FILE_NAME}
        />,
      ]}
      body={
        !showDataWidget ? (
          <EmptyState
            content={t('noDataAvailable')}
            iconName="formatListBulleted"
            button={null}
            classes={{
              wrapper: styles.emptyState,
              iconFrame: styles.emptyStateIconFrame,
            }}
          ></EmptyState>
        ) : (
          <div>
            <div>
              <Dropdown
                fieldName="chartDate"
                isMultiSelect={false}
                title={'Show All'}
                options={Object.keys(dateDropDown).map((key) => {
                  return {
                    label: dateDropDown[key].label,
                    value: dateDropDown[key].value,
                  }
                })}
                selectedOptions={selectedDateKey}
                onChange={(val) => {
                  setSelectedDateKey(val.value)
                }}
                classes={{dropdownClass: styles.dateDropDown}}
              />
            </div>
            <div className={styles.admissionWidget}>
              {Object.values(admissionTotalData).map((card) => (
                <AdmissionCard {...card} key={card.title} />
              ))}
            </div>
          </div>
        )
      }
    />
  )
}
