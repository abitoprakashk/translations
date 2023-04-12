import {
  Avatar,
  Badges,
  BADGES_CONSTANTS,
  Button,
  BUTTON_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  Para,
  PARA_CONSTANTS,
  Table,
} from '@teachmint/krayon'
import {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useRouteMatch} from 'react-router-dom'
import Permission from '../../../../components/Common/Permission/Permission'
import {INSTITUTE_TYPES} from '../../../../constants/institute.constants'
import history from '../../../../history'
import {checkSubscriptionType, getScreenWidth} from '../../../../utils/Helpers'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'
import {
  STUDENT_DIRECTORY_TABLE_HEADERS,
  STUDENT_DIRECTORY_TABLE_HEADERS_MOBILE,
} from '../../studentManagement.constants'
import AssignToClassModal from '../AssignToClassModal/AssignToClassModal'
import styles from './StudentTable.module.css'
import {useDispatch, useSelector} from 'react-redux'
import {showFeatureLockAction} from '../../../../redux/actions/commonAction'
import {events} from '../../../../utils/EventsConstants'

export default function StudentTable({
  instituteType,
  filteredData,
  selectedStudents,
  setSelectedStudents,
  setSmsPopupData,
}) {
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showAssignClassModal, setShowAssignClassModal] = useState(false)
  const dispatch = useDispatch()

  const {t} = useTranslation()
  let {path} = useRouteMatch()
  const {instituteInfo} = useSelector((state) => state)
  const eventManager = useSelector((state) => state.eventManager)
  const isPremium = checkSubscriptionType(instituteInfo)

  const getUserNameUI = (obj, name, index) => (
    <div
      className={styles.nameAvatarWrapper}
      onClick={() => {
        eventManager.send_event(events.SIS_USER_PROFILE_OPENED_TFI, {
          seq_no: index,
        })
        history.push(`${path}/${obj?._id}`)
      }}
    >
      <Avatar name={name} imgSrc={obj?.img_url} />

      <div className={styles.nameWrapper}>
        <Para
          type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
          weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
        >
          {name}

          <a
            href={`${obj?.phone_number ? 'tel' : 'mailto'}:${
              obj?.phone_number || obj?.email
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <Icon
              name={obj?.phone_number ? 'phone' : 'localPostOffice'}
              type={ICON_CONSTANTS.TYPES.SECONDARY}
              size={ICON_CONSTANTS.SIZES.XXXX_SMALL}
              className={styles.phoneIcon}
            ></Icon>
          </a>
        </Para>
        <Para>{obj?.enrollment_number || '-'}</Para>
      </div>
    </div>
  )

  const getClassroomUI = (student) => {
    // If college
    if (instituteType === INSTITUTE_TYPES.COLLEGE) {
      return student?.classrooms?.length > 0 ? (
        <Para
          type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
          className={styles.classroomNamePara}
          title={student.classrooms.join(', ')}
        >
          {student?.classrooms?.join(', ')}
        </Para>
      ) : (
        'NA'
      )
    }

    // If school
    if (student?.hierarchy_nodes?.[0])
      return (
        <Para
          type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
          className={styles.classroomNamePara}
          title={student.classroom}
        >
          {student.hierarchy_nodes[0]}
        </Para>
      )

    return (
      <Permission
        permissionId={
          PERMISSION_CONSTANTS.instituteClassController_moveStudentSection_update
        }
      >
        <Button
          type={BUTTON_CONSTANTS.TYPE.TEXT}
          onClick={() => {
            setSelectedStudent(student)
            setShowAssignClassModal(true)
            eventManager.send_event(
              events.SIS_PROFILE_ASSIGN_SECTION_CLICKED_TFI,
              {member_id: student?._id, screen_name: 'student_management'}
            )
          }}
        >
          {t('assign')}
        </Button>
      </Permission>
    )
  }

  const getContactUI = (phoneNumber, email) => (
    <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>
      {phoneNumber || email || '-'}
    </Para>
  )

  const getUserStatusUI = (phoneNumber, userId, status) => {
    switch (status) {
      case 1:
        return (
          <Badges
            label={t('joinedOnApp')}
            inverted={true}
            type={BADGES_CONSTANTS.TYPE.SUCCESS}
            showIcon={false}
          />
        )
      case 2:
        return (
          <div className={styles.statusWrapper}>
            <Badges
              label={t('appNotInstalled')}
              inverted={true}
              type={BADGES_CONSTANTS.TYPE.WARNING}
              showIcon={false}
            />
            {phoneNumber && (
              <Permission
                permissionId={PERMISSION_CONSTANTS.SmsController_send_create}
              >
                <Icon
                  name="localPostOffice"
                  type={ICON_CONSTANTS.TYPES.PRIMARY}
                  size={ICON_CONSTANTS.SIZES.X_SMALL}
                  className={styles.mailIcon}
                  onClick={() => {
                    isPremium
                      ? setSmsPopupData({users: [userId]})
                      : dispatch(showFeatureLockAction(!isPremium))
                  }}
                ></Icon>
              </Permission>
            )}
          </div>
        )

      default:
        return (
          <Badges
            label={t('inactive')}
            inverted={true}
            showIcon={false}
            className={styles.statusInActiveBadge}
          />
        )
    }
  }

  const getTableRows = () => {
    let allRows = []

    if (filteredData)
      allRows = filteredData
        ?.filter(({verification_status}) => verification_status !== 4)
        ?.map((obj, index) => ({
          id: obj?._id,
          name: getUserNameUI(obj, obj?.full_name, index),
          class: getClassroomUI(obj),
          contact: getContactUI(obj?.phone_number, obj?.email),
          status: getUserStatusUI(
            obj?.phone_number,
            obj?._id,
            obj?.verification_status
          ),
        }))

    return allRows
  }

  const handleRowSelect = (rowId, checked) => {
    const newSet = new Set(selectedStudents)
    checked ? newSet.add(rowId) : newSet.delete(rowId)
    setSelectedStudents(Array.from(newSet))
  }

  const handleSelectAll = (checked) => {
    const newSet = new Set(checked ? filteredData.map((item) => item._id) : [])
    setSelectedStudents(Array.from(newSet))
  }

  return (
    <>
      <div className={styles.tableWrapper}>
        <Table
          rows={getTableRows()}
          cols={
            getScreenWidth() > 768
              ? STUDENT_DIRECTORY_TABLE_HEADERS
              : STUDENT_DIRECTORY_TABLE_HEADERS_MOBILE
          }
          isSelectable={getScreenWidth() > 768 ? true : false}
          selectedRows={selectedStudents}
          onSelectRow={handleRowSelect}
          onSelectAll={handleSelectAll}
          classes={{table: styles.table}}
          virtualized
          autoSize
        />
      </div>

      {showAssignClassModal && (
        <AssignToClassModal
          showModal={showAssignClassModal}
          setShowModal={() => {
            setShowAssignClassModal(false)
            setSelectedStudent(null)
          }}
          student={selectedStudent}
          screenName="student_directory"
        />
      )}
    </>
  )
}
