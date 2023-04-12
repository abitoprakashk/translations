import React, {useState} from 'react'
import {
  AvatarGroup,
  Table,
  Icon,
  ICON_CONSTANTS,
  Modal,
  Badges,
  MODAL_CONSTANTS,
} from '@teachmint/krayon'

import {useParams} from 'react-router-dom'
import {
  getActiveStudents,
  getInactiveStudents,
  roleListSelector,
} from '../../../../redux/reducers/CommonSelectors'
import styles from './GeneratedIdCardsTable.module.css'
import {useSelector} from 'react-redux'
import UserDetailsRow from '../../../../components/Common/UserDetailsRow/UserDetailsRow'
import {
  GENERATED_ID_TABLE_COLS,
  STUDENT,
  TEMPLATE_STATUS,
} from '../../CustomId.constants'
import {getRoleName} from '../../../../utils/StaffUtils'
import {downloadFromLink} from '../../../../utils/fileUtils'
import {useTranslation} from 'react-i18next'
import useStaffListHook from '../../../../utils/CustomHooks/useStaffListHook'

const GeneratedIdCardsTable = ({rows}) => {
  const {userType} = useParams()
  const {t} = useTranslation()
  const studentsActive = getActiveStudents(true)
  const [userListModal, openUserListModal] = useState([])
  const [downloadLink, setDownloadLink] = useState(null)
  const studentInactive = getInactiveStudents()
  const studentsData = [...studentInactive, ...studentsActive]
  const {staffList} = useStaffListHook()
  const rolesList = roleListSelector()
  const instituteType = useSelector(
    (store) => store.instituteInfo.institute_type
  )

  const getGeneratedByName = (iidOfCreator) => {
    return staffList?.find((staff) => staff?._id === iidOfCreator)?.name
  }

  const formatStudentRows = () => {
    if (rows && rows.length) {
      return rows.map((item) => {
        let studentData

        studentData = []
        item.file.iids.map((iid) => {
          const student = studentsData.find((student) => student._id == iid)
          studentData.push(student)
        })
        studentData = studentData.map((student) => {
          return {
            name: student?.full_name || student?.name,
            imgSrc: student?.img_url,
            img_url: student?.img_url,
            id: student?._id,
            phone_number: student?.phone_number,
            hierarchy_nodes: student?.hierarchy_nodes,
          }
        })

        return {
          personalInfo:
            studentData.length > 1 ? (
              <AvatarGroup
                data={studentData}
                classes={{wrapper: styles.avatarGroup, tooltip: styles.tooltip}}
                showToolTip
                onClick={() => {
                  openUserListModal(studentData)
                  setDownloadLink(item.file.url)
                }}
              />
            ) : (
              <>{studentData && <UserDetailsRow data={studentData[0]} />}</>
            ),
          class: `${
            studentData.length == 1
              ? studentData[0]?.hierarchy_nodes?.[0] || 'NA'
              : 'NA'
          }`,
          type: item?.front_template.name,
          generated_by: getGeneratedByName(item.generated_by),
          action:
            item.file.status === TEMPLATE_STATUS.COMPLETED ? (
              <span
                className="cursor_pointer"
                onClick={() => downloadFromLink(item.file.url)}
              >
                <Icon
                  type={ICON_CONSTANTS.TYPES.PRIMARY}
                  name="download"
                ></Icon>
              </span>
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
        let staffDetails = []
        item.file.iids.map((iid) => {
          const staff = staffList?.find((staff) => staff?._id == iid)
          staffDetails.push(staff)
        })
        staffDetails = staffDetails.map((staff) => {
          return {
            name: staff?.full_name || staff?.name,
            imgSrc: staff?.img_url,
            id: staff?._id,
            roles: staff?.roles || [],
            phone_number: staff?.phone_number,
            roles_to_assign: staff?.roles_to_assign || [],
            roleName: getRoleName(staff, rolesList),
          }
        })

        return {
          personalInfo:
            staffDetails.length > 1 ? (
              <AvatarGroup
                classes={{wrapper: styles.avatarGroup, tooltip: styles.tooltip}}
                data={staffDetails}
                maxCount={staffDetails.length > 2 ? 3 : staffDetails.length}
                showToolTip
                onClick={() => {
                  setDownloadLink(item.file.url)
                  openUserListModal(staffDetails)
                }}
              />
            ) : (
              <UserDetailsRow data={staffDetails[0]} />
            ),
          designation: getRoleName(staffDetails[0], rolesList),
          type: item?.front_template?.name,
          generated_by: getGeneratedByName(item.generated_by),
          action:
            item.file.status === TEMPLATE_STATUS.COMPLETED ? (
              <span
                className="cursor_pointer"
                onClick={() => downloadFromLink(item.file.url)}
              >
                <Icon
                  type={ICON_CONSTANTS.TYPES.PRIMARY}
                  name="download"
                ></Icon>
              </span>
            ) : (
              'Pending'
            ),
        }
      })
    }
  }

  const getRows = () => {
    if (userType === STUDENT) return formatStudentRows()
    else return formatStaffRows()
  }

  return (
    <div className={styles.tableContainer}>
      <Modal
        header={t(
          userType === STUDENT
            ? 'customId.listOfStudent'
            : 'customId.listOfStaff'
        )}
        isOpen={userListModal.length}
        classes={{modal: styles.modalBody}}
        onClose={() => openUserListModal([])}
        size={MODAL_CONSTANTS.SIZE.SMALL}
        actionButtons={[
          {
            body: t('download'),
            onClick: () => downloadFromLink(downloadLink),
          },
        ]}
      >
        <div className={styles.userList}>
          {userListModal.map((user) => (
            <div key={user._id}>
              <UserDetailsRow data={user} />
              <Badges
                showIcon={false}
                label={
                  userType === STUDENT
                    ? user?.hierarchy_nodes?.[0] || 'NA'
                    : user?.roleName || 'NA'
                }
              ></Badges>
            </div>
          ))}
        </div>
      </Modal>
      <Table
        cols={GENERATED_ID_TABLE_COLS[userType](instituteType)}
        rows={getRows()}
      />
    </div>
  )
}

export default GeneratedIdCardsTable
