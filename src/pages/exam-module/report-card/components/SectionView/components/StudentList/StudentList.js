import React, {useEffect, useState} from 'react'
import {createPortal} from 'react-dom'
import {
  Button,
  Badges,
  Table,
  BADGES_CONSTANTS,
  BUTTON_CONSTANTS,
  EmptyState,
  Icon,
  ICON_CONSTANTS,
  Para,
  PARA_CONSTANTS,
  PlainCard,
  Divider,
} from '@teachmint/krayon'
import {useSelector, useDispatch} from 'react-redux'
import {useTranslation} from 'react-i18next'
import styles from './StudentList.module.css'
import {showSuccessToast} from '../../../../../../../redux/actions/commonAction'

import {events} from '../../../../../../../utils/EventsConstants'
import {STUDENT_DIRECTORY_COL} from '../../../../constants'
import {
  getStudentList,
  generateReportCard,
  stopPolling,
  // getStudentExamStructure,
} from '../../../../redux/actions'
import classNames from 'classnames'
import SliderPreview from '../../../common/SliderPreview/SliderPreview'
import Permission from '../../../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../../../utils/permission.constants'
import SearchInput from '../../../../../../../components/Common/Krayon/SearchInput'
import UserInfo from '../../../../../../../components/Common/Krayon/UserInfo'
import {IS_MOBILE} from '../../../../../../../constants'
import Loader from '../../../../../../../components/Common/Loader/Loader'
import {useHistory} from 'react-router-dom'
import {sidebarData} from '../../../../../../../utils/SidebarItems'
import {DateTime} from 'luxon'
import Spinner from '../../../../../../../components/Common/Krayon/Spinner'
// import StudentMarksEditor from './components/StudentMarksEditor/StudentMarksEditor'

const StudentList = ({classDetails}) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const eventManager = useSelector((state) => state.eventManager)
  const activeAdmins = useSelector((state) => state.instituteAdminList)
  const {students, studentsLoading} = useSelector(({reportCard}) => reportCard)
  const [previewData, setPreviewData] = useState(null)
  const [showDownloadAll, setShowDownloadAll] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilter] = useState({
    name: '',
  })
  // const [selectedStudent, setSelectedStudent] = useState(null)
  const [portalEl, setPortalEl] = useState(null)
  const [headingPortalEl, setHeadingPortalEl] = useState(null)
  const [selectedRows, setSelectedRows] = useState([])
  const [lastUpdatedMsg, setLastUpdatedMsg] = useState('')

  const {t} = useTranslation()

  const SCREEN_NAME = 'section_student_list_page'

  useEffect(() => {
    setPortalEl(document.getElementById('reportcardCtaWrapper'))
    setHeadingPortalEl(document.getElementById('actionButtonsForEditTemplate'))
  }, [studentsLoading])

  useEffect(() => {
    dispatch(
      getStudentList({
        section_id: classDetails.id,
      })
    )
    // dispatch(
    //   getStudentExamStructure({
    //     section_id: classDetails.id,
    //     class_id: classDetails.node_ids[0],
    //   })
    // )
    return () => dispatch(stopPolling())
  }, [])

  useEffect(() => {
    setIsLoading(false)
  }, [students])

  useEffect(() => {
    const {u, user_id} =
      students.sectionResults?.find(({status}) => status == 'SUCCEEDED') || {}

    if (!u && !user_id) return

    const updatedBy = activeAdmins.find((admin) => admin.user_id == user_id)
    const dateTime = u ? DateTime.fromMillis(u * 1000) : ''

    const msg = `Last updated${
      dateTime ? ` on ${dateTime.toFormat('dd-MMM-yyyy, hh:mm a')}` : ''
    }${updatedBy?.name ? ` by ${updatedBy.name}` : ''}`

    setLastUpdatedMsg(msg)
  }, [students.sectionResults, activeAdmins])

  // const handleRowClick = () => {
  //   setIsSliderOpen(true)
  //   // setSelectedStudent(item._id)
  // }

  const getRowObject = (item) => {
    return {
      id: item._id,
      name: (
        <div className={styles.studentCol}>
          <UserInfo
            name={item.name}
            profilePic={item.img_url}
            designation={item.phone_number}
          />
        </div>
      ),
      rollNumber: item.roll_number,
      enrollmentId: (
        <span className={styles.enrollmentCol}>
          {item?.enrollment_number || 'NA'}
        </span>
      ),
      status: item.url ? (
        <Badges
          label={t('generated')}
          iconName="done"
          type={BADGES_CONSTANTS.TYPE.PRIMARY}
          size={
            IS_MOBILE
              ? BADGES_CONSTANTS.SIZE.SMALL
              : BADGES_CONSTANTS.SIZE.MEDIUM
          }
        />
      ) : (
        <Badges
          label={t('notGenerated')}
          type={BADGES_CONSTANTS.TYPE.BASIC}
          size={
            IS_MOBILE
              ? BADGES_CONSTANTS.SIZE.SMALL
              : BADGES_CONSTANTS.SIZE.MEDIUM
          }
          showIcon={false}
        />
      ),
      action: item.url ? (
        <Button
          classes={{button: styles.previewBtn}}
          category={BUTTON_CONSTANTS.CATEGORY.PRIMARY}
          type={BUTTON_CONSTANTS.TYPE.TEXT}
          onClick={() => {
            eventManager.send_event(
              events.REPORT_CARD_PREVIEW_MARKS_CLICKED_TFI,
              {
                class_id: classDetails.id,
                user_id: item._id,
                enrollment: item.enrollment_number,
              }
            )
            setPreviewData(item)
          }}
        >
          <Icon name="forwardArrow" size={ICON_CONSTANTS.SIZES.XX_SMALL} />
        </Button>
      ) : null,
    }
  }

  const getRowData = () => {
    let flag = true
    let rows = students?.sectionStudents
    const query = filters.name?.toLowerCase().trim()

    if (query.length) {
      rows = rows?.filter((item) => {
        if (!item.url) {
          flag = false
        }
        return (
          item.roll_number?.toLowerCase().includes(query) ||
          item.name.toLowerCase().replace('  ', ' ').includes(query) ||
          item.enrollment_number?.toLowerCase().includes(query) ||
          item.phone_number?.toLowerCase().includes(query)
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

  const handleGenerateClick = async (isUpdate) => {
    setIsLoading(true)
    dispatch(
      generateReportCard({
        section_id: classDetails.id,
        node_ids: [classDetails._id],
        template_id: classDetails.selectedTemplate._id,
        section_name: classDetails?.name,
      })
    )
    eventManager.send_event(
      isUpdate
        ? events.REPORT_CARD_UPDATE_AVAILABLE_CLICKED_TFI
        : events.REPORT_CARD_GENERATE_CARDS_CLICKED_TFI,
      {
        class_id: classDetails.id,
        screen_name: SCREEN_NAME,
      }
    )

    if (students?.sectionStudents?.length > 250)
      dispatch(showSuccessToast(t('reportCardGenerationMessage')))
  }

  const handleDownloadAllClick = () => {
    eventManager.send_event(events.REPORT_CARD_DOWNLOAD_CLICKED_TFI, {
      class_id: classDetails.id,
      screen_name: SCREEN_NAME,
      all_reports: 'Yes',
    })
    var link = document.createElement('a')
    link.href = students.sectionResults[0].url
    link.download = `${classDetails.name}-reportcard.zip`
    document.body.appendChild(link)
    link.click()
  }

  const handleSearchFilter = ({value}) => {
    setFilter({...filters, name: value})
  }

  const handleCloseSliderPreview = (val) => {
    if (!val) {
      eventManager.send_event(
        events.REPORT_CARD_CLOSE_PREVIEW_MARKS_CLICKED_TFI,
        {
          class_id: classDetails.id,
          user_id: previewData?.user_id,
          enrollment: previewData?.enrollment_number,
        }
      )
      setPreviewData(null)
    }
  }

  const renderButtons = () => {
    if (!students?.sectionStudents?.length) {
      return (
        <Permission
          permissionId={
            PERMISSION_CONSTANTS.reportCardWebController_generateReportCard_create
          }
        >
          <Button
            category={BUTTON_CONSTANTS.CATEGORY.PRIMARY}
            size={
              IS_MOBILE
                ? BUTTON_CONSTANTS.SIZE.SMALL
                : BUTTON_CONSTANTS.SIZE.MEDIUM
            }
            isDisabled
          >
            Generate Report Cards
          </Button>
        </Permission>
      )
    }

    if (showDownloadAll) {
      return (
        <>
          <Button
            classes={{button: classNames(styles.iconBtn, styles.downloadIcon)}}
            onClick={handleDownloadAllClick}
            type={BUTTON_CONSTANTS.TYPE.OUTLINE}
            category={BUTTON_CONSTANTS.CATEGORY.PRIMARY}
            size={
              IS_MOBILE
                ? BUTTON_CONSTANTS.SIZE.SMALL
                : BUTTON_CONSTANTS.SIZE.MEDIUM
            }
          >
            <Icon
              name="download"
              type={ICON_CONSTANTS.TYPES.PRIMARY}
              size={ICON_CONSTANTS.SIZES.XX_SMALL}
            />
          </Button>

          <Permission
            permissionId={
              PERMISSION_CONSTANTS.reportCardWebController_generateReportCard_create
            }
          >
            <Button
              onClick={() => handleGenerateClick(true)}
              type={BUTTON_CONSTANTS.TYPE.FILLED}
              category={BUTTON_CONSTANTS.CATEGORY.PRIMARY}
              size={
                IS_MOBILE
                  ? BUTTON_CONSTANTS.SIZE.SMALL
                  : BUTTON_CONSTANTS.SIZE.MEDIUM
              }
              prefixIcon={
                isLoading ? (
                  <Spinner
                    className={classNames('mr-3', styles.spinner)}
                    speed={1}
                  />
                ) : (
                  'refresh'
                )
              }
              isDisabled={isLoading}
            >
              Update Report Cards
            </Button>
          </Permission>
        </>
      )
    } else {
      return (
        <Permission
          permissionId={
            PERMISSION_CONSTANTS.reportCardWebController_generateReportCard_create
          }
        >
          <Button
            category={BUTTON_CONSTANTS.CATEGORY.PRIMARY}
            size={
              IS_MOBILE
                ? BUTTON_CONSTANTS.SIZE.SMALL
                : BUTTON_CONSTANTS.SIZE.MEDIUM
            }
            onClick={handleGenerateClick}
            isDisabled={isLoading}
            classes={{label: 'inline-flex'}}
          >
            {isLoading ? (
              <>
                <span>Generating</span>
                <Spinner
                  className={classNames('ml-3', styles.spinner)}
                  speed={1}
                />
              </>
            ) : (
              `Generate Report Cards`
            )}
          </Button>
        </Permission>
      )
    }
  }

  return (
    <>
      <Loader show={studentsLoading} />
      {students?.sectionStudents?.length > 0 ? (
        <div>
          {portalEl &&
            createPortal(
              <div className={styles.desktopButtonView}>{renderButtons()}</div>,
              portalEl
            )}

          {headingPortalEl &&
            lastUpdatedMsg &&
            createPortal(
              <Para
                className={classNames(
                  styles.infoAlert,
                  IS_MOBILE ? 'items-start' : 'items-center'
                )}
                weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
              >
                <Icon
                  name="info"
                  type={ICON_CONSTANTS.TYPES.SECONDARY}
                  size={ICON_CONSTANTS.SIZES.XX_SMALL}
                  version={ICON_CONSTANTS.VERSION.OUTLINED}
                />{' '}
                {lastUpdatedMsg}
              </Para>,
              headingPortalEl
            )}

          <div className={styles.container}>
            <SearchInput
              value={filters.name}
              placeholder={t('searchStudentByNameAndOthers')}
              onChange={handleSearchFilter}
            />

            {IS_MOBILE ? (
              <div className={styles.studentListWrapper}>
                {getRowData().map((row) => (
                  <PlainCard className={styles.studentCard} key={row.id}>
                    <div className={styles.upperPart}>
                      {row.name}
                      {row.action}
                    </div>
                    <Divider
                      spacing={16}
                      className={styles.studentCardDivider}
                    />
                    <div className={styles.lowerPart}>
                      <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
                        <span>Roll number :</span>
                        <span>{row.rollNumber}</span>
                      </Para>
                      <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
                        <span>Enrolment Number :</span>
                        <span>{row.enrollmentId}</span>
                      </Para>
                      <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
                        <span>Status :</span>
                        <span>{row.status}</span>
                      </Para>
                    </div>
                  </PlainCard>
                ))}
              </div>
            ) : (
              <div className={styles.tableContainer}>
                <Table
                  classes={{table: styles.table, th: styles.th}}
                  cols={STUDENT_DIRECTORY_COL}
                  rows={getRowData()}
                  // isSelectable
                  onSelectRow={(id, checked) => {
                    const newSelectedRows = [...selectedRows]
                    if (checked) newSelectedRows.push(id)
                    else if (newSelectedRows.indexOf(id) > -1) {
                      newSelectedRows.splice(id, 1)
                    }
                    setSelectedRows(newSelectedRows)
                  }}
                  onSelectAll={(checked) => {
                    const selected = []
                    if (checked)
                      students?.sectionStudents?.forEach((item) =>
                        selected.push(item._id)
                      )
                    setSelectedRows(selected)
                  }}
                  selectedRows={selectedRows}
                />
              </div>
            )}
          </div>
          {previewData && (
            <SliderPreview
              previewData={previewData}
              setPreviewData={handleCloseSliderPreview}
              screenName={SCREEN_NAME}
            />
          )}
          {/* {isSliderOpen && (
            <StudentMarksEditor
              studentId={selectedStudent}
              setIsSliderOpen={setIsSliderOpen}
              sectionId={classDetails.id}
              classId={classDetails.node_ids[0]}
            />
          )} */}
        </div>
      ) : (
        <EmptyState
          iconName="people"
          content={t('noStudentsAddedInClass')}
          button={{
            children: t('addStudents'),
            onClick: () => history.push(sidebarData.SCHOOL_SETUP.route),
          }}
          classes={{wrapper: styles.emptyWrapper}}
        />
      )}
    </>
  )
}

export default React.memo(StudentList)
