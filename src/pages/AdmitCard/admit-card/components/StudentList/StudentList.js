import React, {useEffect, useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {t} from 'i18next'

import {Icon} from '@teachmint/common'
import {Table, Button, BUTTON_CONSTANTS, EmptyState} from '@teachmint/krayon'
import SearchBox from '../../../../../components/Common/SearchBox/SearchBox'
import UserProfile from '../../../../../components/Common/UserProfile/UserProfile'
import LoadingButton from '../../../../../components/Common/LoadingButton/LoadingButton'
import styles from './StudentList.module.css'

import {events} from '../../../../../utils/EventsConstants'
import {STUDENT_DIRECTORY_COL} from '../../constants'
import classNames from 'classnames'
import usePolling from '../../../../../utils/CustomHooks/usePolling'
import Permission from '../../../../../components/Common/Permission/Permission'

import FormDataModal from '../FormDataModal/FormDataModal'
import {
  getAdmitCardStudentListSectionWise,
  getAdmitCardGenerated,
  getAdmitCardBulkDownload,
  getAdmitCardDownloadUrl,
} from '../../../admitCard.selectors'

import PreviewStaticImage from '../PreviewStaticImage/PreviewStaticImage'
import globalActions from '../../../../../redux/actions/global.actions'
import {PERMISSION_CONSTANTS} from '../../../../../utils/permission.constants'

const StudentList = ({classDetails}) => {
  const dispatch = useDispatch()
  const {eventManager} = useSelector((state) => state)

  const [showPreview, setShowPreview] = useState(false)
  const [fileData, setFileData] = useState('')
  const [showDownloadAll, setShowDownloadAll] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [filters, setFilter] = useState({
    name: '',
  })

  const students = getAdmitCardStudentListSectionWise()
  const admitCardBulkGenerate = getAdmitCardGenerated()
  const admitCardBulkDownload = getAdmitCardBulkDownload()
  const admitCardDownloadUrl = getAdmitCardDownloadUrl()

  useEffect(() => {
    dispatch(
      globalActions.getStudentListSectionWise.request({
        section_id: classDetails.id,
      })
    )
    return () => {
      dispatch(globalActions.generateAdmitCards.reset())
      dispatch(globalActions.getAdmitCardDownloadUrl.reset())
    }
  }, [])

  const {clear, start} = usePolling(
    () => {
      dispatch(
        globalActions.bulkDownloadAdmitCard.request({
          section_id: classDetails.id,
          request_id: admitCardBulkGenerate?.data,
        })
      )
    },
    {delay: 1500}
  )

  useEffect(() => {
    if (admitCardBulkGenerate?.data != null) {
      start()
      setIsLoading(true)
    } else {
      clear()
    }
  }, [admitCardBulkGenerate?.data])

  useEffect(() => {
    if (
      admitCardBulkDownload?.data != null &&
      Object.keys(admitCardBulkDownload?.data).length != 0
    ) {
      clear()
      setIsLoading(false)
      dispatch(
        globalActions.getStudentListSectionWise.request({
          section_id: classDetails.id,
        })
      )
    }
  }, [admitCardBulkDownload?.data])

  useEffect(() => {
    if (admitCardDownloadUrl?.data != null) {
      var link = document.createElement('a')
      link.href = admitCardDownloadUrl?.data[0]?.url
      link.download = `${classDetails.name}-admitcard.zip`
      document.body.appendChild(link)
      link.click()
    }
  }, [admitCardDownloadUrl?.data])

  const getRowObject = (item) => {
    return {
      name: (
        <div className={styles.studentCol}>
          <UserProfile
            image={item.img_url}
            name={item.name}
            phoneNumber={
              item.enrollment_number !== null && item.enrollment_number !== ''
                ? item.enrollment_number
                : item.phone_number
            }
          />
        </div>
      ),
      enrollmentId: (
        <span className={styles.enrollmentCol}>
          {item?.enrollment_number || 'NA'}
        </span>
      ),
      status: item.url ? (
        <span>
          <Icon name="checkCircle" color="success" size="xxxs" />{' '}
          {t('generated')}
        </span>
      ) : (
        t('notGenerated')
      ),
      action: item.url ? (
        <Button
          type={BUTTON_CONSTANTS.TYPE.TEXT}
          onClick={() => {
            eventManager.send_event(
              events.ADMIT_CARD_STUDENT_PREVIEW_TAB_CLICKED_TFI,
              {
                sections_id: classDetails.id,
                student_id: item._id,
              }
            )
            setShowPreview(!showPreview)
            setFileData(item)
          }}
        >
          {t('admitCardPreviewIndividualStudent')}
        </Button>
      ) : null,
    }
  }

  const getRowData = () => {
    let flag = true
    let rows = students?.data?.section_students
    if (filters.name.length) {
      rows = rows.filter((item) => {
        if (!item.url) {
          flag = false
        }
        return (
          item.name
            .toLowerCase()
            .replace('  ', ' ')
            .includes(filters.name.toLowerCase()) ||
          item.enrollment_number
            ?.toLowerCase()
            .includes(filters.name.toLowerCase()) ||
          item.phone_number?.toLowerCase().includes(filters.name.toLowerCase())
        )
      })
    }
    rows = rows?.map((item) => {
      if (flag && !item.url) {
        flag = false
      }
      return getRowObject(item)
    })
    if (flag && !showDownloadAll) {
      setIsLoading(false)
      setShowDownloadAll(true)
    } else if (!flag && showDownloadAll) {
      setShowDownloadAll(false)
    }
    return rows
  }

  const handleGenerateClick = () => {
    eventManager.send_event(events.ADMIT_CARD_GENERATE_CLICKED_TFI, {
      sections_id: classDetails.id,
    })
    setShowModal(!showModal)
  }

  const handleUpdateClick = () => {
    eventManager.send_event(events.ADMIT_CARD_UPDATE_CLICKED_TFI, {
      sections_id: classDetails.id,
    })
    dispatch(globalActions.generateAdmitCards.reset())
    setShowModal(!showModal)
  }

  const handleDownloadAllClick = () => {
    eventManager.send_event(events.ADMIT_CARD_BULK_DOWNLOAD_CLICKED_TFI, {
      sections_id: classDetails.id,
    })
    dispatch(
      globalActions.getAdmitCardDownloadUrl.request({
        section_id: classDetails.id,
      })
    )
  }

  const handleSearchFilter = (value) => {
    setFilter({...filters, name: value})
  }

  const renderButtons = () => {
    if (!students?.data?.section_students?.length) {
      return (
        <div className={styles.generateButton}>
          <Button isDisabled classes={{button: styles.generateBtn}}>
            {`${t('admitCardGenerate')} ${classDetails?.name} ${t(
              'admitCardGenerateCards'
            )}`}
          </Button>
        </div>
      )
    }
    if (showDownloadAll) {
      return (
        <>
          <div className={styles.generateDownloadButton}>
            <Button
              onClick={handleDownloadAllClick}
              prefixIcon="download"
              type={BUTTON_CONSTANTS.TYPE.OUTLINE}
            >
              {t('admitCardDownloadAll')}
            </Button>
          </div>
          {isLoading ? (
            <div
              className={classNames(
                styles.generateButton,
                styles.generateLoading
              )}
            >
              <LoadingButton size="medium" />
            </div>
          ) : (
            <Permission
              permissionId={
                PERMISSION_CONSTANTS.admitCardController_generate_create
              }
            >
              <div className={classNames(styles.generateButton)}>
                <div className={styles.generateButtonWrapper}>
                  <Button onClick={handleUpdateClick}>
                    {t('admitCardUpdate')}
                  </Button>
                </div>
              </div>
            </Permission>
          )}
        </>
      )
    } else {
      if (isLoading) {
        return (
          <div
            className={classNames(
              styles.generateButton,
              styles.generateLoading
            )}
          >
            <LoadingButton size="medium" />
          </div>
        )
      } else {
        return (
          <Permission
            permissionId={
              PERMISSION_CONSTANTS.admitCardController_generate_create
            }
          >
            <div className={styles.generateButton}>
              <Button
                onClick={handleGenerateClick}
                classes={{button: styles.generateBtn}}
              >
                {`${t('admitCardGenerate')} ${classDetails?.name} ${t(
                  'admitCardGenerateCards'
                )}`}
              </Button>
            </div>
          </Permission>
        )
      }
    }
  }

  return (
    <div>
      {showModal && (
        <FormDataModal
          showModal={showModal}
          setShowModal={setShowModal}
          sectionId={students?.data?.section_students[0]?.node_id}
        />
      )}
      <div className={styles.generateButtonWrapper}>
        <div className={styles.desktopButtonView}>{renderButtons()}</div>
      </div>

      <div className={styles.container}>
        <div className={styles.searchWrapper}>
          <SearchBox
            value={filters.string}
            placeholder={t('admitCardSearchBoxPlaceholder')}
            handleSearchFilter={handleSearchFilter}
          />
        </div>
        <div className={styles.tableContainer}>
          <Table cols={STUDENT_DIRECTORY_COL} rows={getRowData()} />
        </div>

        <div className={styles.mobileButtonView}>{renderButtons()}</div>
      </div>
      <div className={styles.emptyStateContainer}>
        {getRowData()?.length === 0 ? (
          <EmptyState
            iconName="students"
            button={false}
            content={t('admitCardEmptyStateMsg')}
          />
        ) : (
          <div></div>
        )}
      </div>

      {showPreview && (
        <PreviewStaticImage
          showPreview={showPreview}
          setShowPreview={setShowPreview}
          data={fileData}
          screenName="studentList"
          sectionId={classDetails.id}
        />
      )}
    </div>
  )
}

export default StudentList
