import React, {useState} from 'react'
import {
  AvatarGroup,
  KebabMenu,
  Table,
  ICON_CONSTANTS,
  Icon,
} from '@teachmint/krayon'
import {
  FILE_TYPES,
  TABLE_COLS,
} from '../../pages/GeneratedDocuments/GeneratedDocuments.constants'
import {generatePath, useHistory, useParams} from 'react-router-dom'
import {STUDENT, TEMPLATE_STATUS} from '../../CustomCertificate.constants'
import {
  getActiveStudents,
  getInactiveStudents,
  roleListSelector,
} from '../../../../redux/reducers/CommonSelectors'
import {
  defaultTemplatePreviewSelector,
  eventManagerSelector,
  staffListSelector,
  templateListSelector,
} from '../../redux/CustomCertificate.selectors'
import {getRoleName} from '../../CustomCertificate.utils'
import {useTranslation} from 'react-i18next'
import DocumentPreviewModal from '../DocumentPreviewModal/DocumentPreviewModal'
import {downloadFromLink} from '../../../../utils/fileUtils'
import {CUSTOM_CERTIFICATE_SUB_ROUTES} from '../../CustomCertificates.routes'
import styles from './GeneratedDocumentsTable.module.css'
import Loader from '../../../../components/Common/Loader/Loader'
import {useSelector} from 'react-redux'
import {CERTIFICATE_EVENTS} from '../../CustomCertificate.events'
import Permission from '../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'
import UserDetailsRow from '../../../../components/Common/UserDetailsRow/UserDetailsRow'

const CommonKabab = ({item, setPreviewData, regenerate, triggerEvent}) => {
  const {t} = useTranslation()

  const options = [
    {
      content: (
        <div
          className={styles.menuItem}
          onClick={() => {
            triggerEvent(CERTIFICATE_EVENTS.PREVIEW_CLICKED_TFI, {
              certificate_id: item.template_id,
              user_id: item?.file?.iids[0],
            })
            setPreviewData({
              template_preview_url: item?.file?.url,
              template_name: item.template_name,
            })
          }}
        >
          <Icon
            size={ICON_CONSTANTS.SIZES.X_SMALL}
            name="eye1"
            version={ICON_CONSTANTS.VERSION.OUTLINED}
          />
          {t('preview')}
        </div>
      ),
      handleClick: () => {},
    },
    {
      content: (
        <div
          className={styles.menuItem}
          onClick={() => {
            triggerEvent(CERTIFICATE_EVENTS.DOWNLOAD_CERTIFICATE_CLICKED_TFI, {
              certificate_id: item._id,
              user_id: item?.file?.iids[0] || null,
              bulk: !item?.file?.iids[0],
              document_id: item._id,
            })
            downloadFromLink(
              item?.file?.url,
              `${item.template_name}-template.${item?.file?.url
                .split('.')
                .pop()}`
            )
          }}
        >
          <Icon
            size={ICON_CONSTANTS.SIZES.X_SMALL}
            name="download"
            version={ICON_CONSTANTS.VERSION.OUTLINED}
          />
          {t('download')}
        </div>
      ),
      handleClick: () => {},
    },
  ]
  if (item?.file && item.file?.iids.length === 1) {
    options.unshift({
      content: (
        <Permission
          permissionId={
            PERMISSION_CONSTANTS.documentController_generateSingle_create
          }
        >
          <div className={styles.menuItem} onClick={() => regenerate(item)}>
            <Icon
              size={ICON_CONSTANTS.SIZES.X_SMALL}
              name="edit"
              version={ICON_CONSTANTS.VERSION.OUTLINED}
            />
            {t('customCertificate.regenerate')}
          </div>
        </Permission>
      ),
      handleClick: () => {},
    })
  }
  if (item?.file?.format === FILE_TYPES.ZIP) options.shift()
  return (
    <KebabMenu
      isVertical={true}
      options={options}
      classes={{iconFrame: styles.iconFrame, content: styles.contentWrapper}}
    />
  )
}

const GeneratedDocumentsTable = ({rows}) => {
  const [previewDoc, setPreviewData] = useState('')

  const {isLoading} = defaultTemplatePreviewSelector()
  const eventManager = eventManagerSelector()
  const history = useHistory()
  const {userType} = useParams()
  const studentsActive = getActiveStudents(true)
  const studentInactive = getInactiveStudents()
  const studentsData = [...studentInactive, ...studentsActive]
  const staffList = staffListSelector()
  const templateList = templateListSelector()
  const rolesList = roleListSelector()
  const instituteType = useSelector(
    (store) => store.instituteInfo.institute_type
  )

  const getGeneratedByName = (iidOfCreator) => {
    return staffList?.find((staff) => staff?._id === iidOfCreator)?.name || 'NA'
  }

  const regenerate = (row) => {
    const templateData = templateList[userType].find(
      (item) => item._id == row.template_id
    )
    triggerEvent(CERTIFICATE_EVENTS.CERTIFICATE_REGENATE_CLICKED_TFI, {
      template_type: templateData.default ? 'default' : 'my_templates',
      certificate_id: templateData._id,
      user_id: row?.file?.iids[0],
    })

    const url = `${generatePath(CUSTOM_CERTIFICATE_SUB_ROUTES.FILL_DETAILS, {
      userType,
      templateId: templateData._id,
      type: templateData?.type?.toLowerCase(),
    })}?userId=${row?.file?.iids[0]}`
    history.push(url)
  }

  const formatStudentRows = () => {
    if (rows && rows.length) {
      return rows.map((item) => {
        let studentData
        if (item.file.format === FILE_TYPES.PDF) {
          studentData = studentsData.find(
            (student) => student._id == item?.file?.iids[0]
          )
        } else if (
          item.file.format === FILE_TYPES.ZIP &&
          item.sub_files.length
        ) {
          studentData = []
          item.sub_files.map((files) => {
            const student = studentsData.find(
              (student) => student._id == files?.iids[0]
            )
            studentData.push(student)
          })
          studentData = studentData.map((student) => {
            return {
              name: student?.full_name || student?.name,
              imgSrc: student?.img_url,
              id: student?._id,
            }
          })
        }
        return {
          personalInfo: Array.isArray(studentData) ? (
            <AvatarGroup
              data={studentData}
              classes={{wrapper: styles.avatarGroup, tooltip: styles.tooltip}}
              showToolTip
            />
          ) : (
            <>{studentData && <UserDetailsRow data={studentData} />}</>
          ),
          // class: `${studentData?.classroom ? studentData?.classroom : 'NA'}`,
          class: `${studentData?.hierarchy_nodes?.[0] || 'NA'}`,
          type: item.template_name,
          generated_by: getGeneratedByName(item.generated_by),
          action:
            item.file.status === TEMPLATE_STATUS.COMPLETED ? (
              <CommonKabab
                regenerate={regenerate}
                item={{...item}}
                setPreviewData={setPreviewData}
                triggerEvent={triggerEvent}
              />
            ) : (
              'Pending'
            ),
        }
      })
    }

    return []
  }

  const formatStaffRows = () => {
    if (rows && rows.length) {
      return rows.map((item) => {
        let staffDetails
        if (item.file.format === FILE_TYPES.PDF) {
          staffDetails = staffList.find(
            (staff) => staff?._id === item?.file?.iids[0]
          )
        } else if (
          item.file.format === FILE_TYPES.ZIP &&
          item.sub_files.length
        ) {
          staffDetails = []
          item.sub_files.map((files) => {
            const staff = staffList.find(
              (staff) => staff?._id == files?.iids[0]
            )
            staffDetails.push(staff)
          })
          staffDetails = staffDetails.map((staff) => {
            return {
              name: staff?.full_name || staff?.name,
              imgSrc: staff?.img_url,
              id: staff?._id,
              roles: staff?.roles || [],
              roles_to_assign: staff?.roles_to_assign || [],
            }
          })
        }
        return {
          personalInfo: Array.isArray(staffDetails) ? (
            <AvatarGroup
              classes={{wrapper: styles.avatarGroup, tooltip: styles.tooltip}}
              data={staffDetails}
              maxCount={staffDetails.length > 2 ? 3 : staffDetails.length}
              showToolTip
            />
          ) : (
            <UserDetailsRow data={staffDetails} />
          ),
          designation: getRoleName(staffDetails, rolesList),
          type: item.template_name,
          generated_by: getGeneratedByName(item.generated_by),
          action: (
            <CommonKabab
              regenerate={regenerate}
              item={item}
              setPreviewData={setPreviewData}
              triggerEvent={triggerEvent}
            />
          ),
        }
      })
    }
  }

  const getRows = () => {
    if (userType === STUDENT) return formatStudentRows()
    else return formatStaffRows()
  }

  const triggerEvent = (eventName, data = {}) => {
    eventManager.send_event(eventName, {
      user_type: userType,
      screen: 'recently_created',
      ...data,
    })
  }

  return (
    <div className={styles.tableContainer}>
      <Loader show={isLoading} />
      <DocumentPreviewModal
        isOpen={previewDoc?.template_name}
        url={previewDoc?.template_preview_url}
        header={previewDoc && `${previewDoc.template_name}`}
        showCloseIcon={true}
        onClose={() => setPreviewData(null)}
      />
      <Table cols={TABLE_COLS[userType](instituteType)} rows={getRows()} />
    </div>
  )
}

export default GeneratedDocumentsTable
