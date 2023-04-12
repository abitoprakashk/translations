import {
  Avatar,
  Badges,
  BADGES_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  Para,
  PARA_CONSTANTS,
  Table,
  Tooltip,
  TOOLTIP_CONSTANTS,
} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'
import {checkSubscriptionType, getScreenWidth} from '../../../../utils/Helpers'
import {
  TEACHER_DIRECTORY_TABLE_HEADERS,
  TEACHER_DIRECTORY_TABLE_HEADERS_MOBILE,
  TEACHER_DIRECTORY_TABLE_HEADERS_COLLEGE,
  TEACHER_DIRECTORY_TABLE_HEADERS_MOBILE_COLLEGE,
} from '../../teacherDirectory.constants'
import styles from './TeacherTable.module.css'
import {INSTITUTE_TYPES} from '../../../../constants/institute.constants'
import Permission from '../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'
import {useDispatch, useSelector} from 'react-redux'
import {showFeatureLockAction} from '../../../../redux/actions/commonAction'
export default function TeacherTable({
  instituteType,
  filteredData,
  selectedTeachers,
  setSelectedTeachers,
  setSmsPopupData,
  setShowTeacherDetailsSilder,
}) {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const {instituteInfo} = useSelector((state) => state)
  const isPremium = checkSubscriptionType(instituteInfo)

  const getUserNameUI = (obj, name) => (
    <div
      className={styles.nameAvatarWrapper}
      onClick={() => setShowTeacherDetailsSilder(obj)}
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
        <Para>{obj?.employee_id || '-'}</Para>
      </div>
    </div>
  )

  const getClassAndSubjectUI = (userID, userData) => {
    if (!userData?.length) return '-'

    // Find class subject mapping
    const classSubjectMap = {}
    userData?.forEach((item) => {
      if (item[0] in classSubjectMap) classSubjectMap[item[0]].push(item[1])
      else classSubjectMap[item[0]] = [item[1]]
    })

    const classSubjectList = Object.keys(classSubjectMap)?.map(
      (item) => `${item} (${classSubjectMap[item].join(', ')})`
    )

    return (
      <div className={styles.classSubjectWrapper}>
        <Para
          type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
          className={styles.classSubjectPara}
        >
          {classSubjectList?.[0]}
        </Para>
        {classSubjectList?.length > 1 ? (
          <div className={styles.tooltipBadgeWrapper}>
            <a data-tip data-for={`tooltip-class-subject-${userID}`}>
              <Badges
                label={`+ ${classSubjectList?.length - 1}`}
                type={BADGES_CONSTANTS.TYPE.PRIMARY}
                size={BADGES_CONSTANTS.SIZE.SMALL}
                showIcon={false}
                className={styles.classSubjectTooltipBadge}
              />
            </a>
            <Tooltip
              toolTipId={`tooltip-class-subject-${userID}`}
              title={
                <div>
                  {classSubjectList.slice(1).map((item, index) => (
                    <Para key={index} className={styles.textWhite}>
                      {item}
                    </Para>
                  ))}
                </div>
              }
              place={TOOLTIP_CONSTANTS.TOOLTIP_POSITIONS.BOTTOM}
              // effect={TOOLTIP_CONSTANTS.TOOLTIP_EFFECTS.FLOAT}
              // clickable={true}
            ></Tooltip>
          </div>
        ) : null}
      </div>
    )
  }

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
                      : dispatch(showFeatureLockAction(true))
                  }}
                />
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
      allRows = filteredData?.map((obj) => ({
        id: obj?._id,
        name: getUserNameUI(obj, obj?.full_name),
        contact: obj?.phone_number || obj?.email,
        classTeacher: (
          <Para
            type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
            className={styles.classTeacherPara}
            title={
              obj?.class_teacher_nodes?.map(({name}) => name)?.join(', ') || '-'
            }
          >
            {obj?.class_teacher_nodes?.map(({name}) => name)?.join(', ') || '-'}
          </Para>
        ),
        classSubject: getClassAndSubjectUI(obj?._id, obj?.details?.acadamics),
        status: getUserStatusUI(
          obj?.phone_number,
          obj?._id,
          obj?.verification_status
        ),
      }))

    return allRows
  }

  const handleRowSelect = (rowId, checked) => {
    const newSet = new Set(selectedTeachers)
    checked ? newSet.add(rowId) : newSet.delete(rowId)
    setSelectedTeachers(Array.from(newSet))
  }

  const handleSelectAll = (checked) => {
    const newSet = new Set(checked ? filteredData.map((item) => item._id) : [])
    setSelectedTeachers(Array.from(newSet))
  }

  const getDirectoryHeaders = () => {
    if (getScreenWidth() > 768) {
      if (instituteType === INSTITUTE_TYPES.COLLEGE)
        return TEACHER_DIRECTORY_TABLE_HEADERS_COLLEGE
      return TEACHER_DIRECTORY_TABLE_HEADERS
    } else {
      if (instituteType === INSTITUTE_TYPES.COLLEGE)
        return TEACHER_DIRECTORY_TABLE_HEADERS_MOBILE_COLLEGE
      return TEACHER_DIRECTORY_TABLE_HEADERS_MOBILE
    }
  }

  return (
    <div className={styles.tableWrapper}>
      <Table
        rows={getTableRows()}
        cols={getDirectoryHeaders()}
        isSelectable={getScreenWidth() > 768 ? true : false}
        selectedRows={selectedTeachers}
        onSelectRow={handleRowSelect}
        onSelectAll={handleSelectAll}
        classes={{table: styles.table}}
        virtualized
        autoSize
      />
    </div>
  )
}
