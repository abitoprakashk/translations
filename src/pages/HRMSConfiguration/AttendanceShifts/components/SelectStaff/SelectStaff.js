import {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import styles from './SelectStaff.module.css'
import {t} from 'i18next'
import produce from 'immer'
import {
  Divider,
  Para,
  PARA_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
} from '@teachmint/krayon'
import StaffSelection from './StaffSelection'
import {STAFF_TYPE} from '../../constants/shift.constants'

export default function SelectStaff({shiftInfo, setShiftInfo, isEdit}) {
  const {staffListData} = useSelector((state) => state.staffAttendance)
  const shiftList = useSelector((state) => state.globalData?.shiftList?.data)
  const [selectedStaffType, setSelectedStaffType] = useState(
    STAFF_TYPE.TEACHING
  )
  const [selectedTeachers, setSelectedTeachers] = useState([])
  const [selectedStaff, setSelectedStaff] = useState([])
  const [staffList, setStaffList] = useState([])
  const [teacherList, setTeacherList] = useState([])
  const [localShiftList, setLocalShiftList] = useState(null)

  useEffect(() => {
    const updatedShiftList = shiftList.map((shift) => {
      if (shift._id === shiftInfo._id) {
        return shiftInfo
      }
      return shift
    })
    setLocalShiftList(updatedShiftList)
  }, [])

  useEffect(() => {
    if (staffListData && localShiftList) {
      setStaffData()
    }
  }, [staffListData, localShiftList])

  const setStaffData = () => {
    const teacherData = getStaffData(STAFF_TYPE.TEACHING)
    const staffData = getStaffData(STAFF_TYPE.NON_TEACHING)
    const selectedTeacherList = [
      ...(isEdit
        ? teacherData.staffInCurrentShift.map((s) => s._id)
        : [
            ...teacherData.staffNotInShift,
            ...teacherData.staffInCurrentShift,
          ].map((s) => s._id)),
    ]
    const selectedStaffList = [
      ...(isEdit
        ? staffData.staffInCurrentShift.map((s) => s._id)
        : [...staffData.staffNotInShift, ...staffData.staffInCurrentShift].map(
            (s) => s._id
          )),
    ]
    setSelectedTeachers(selectedTeacherList)
    setSelectedStaff(selectedStaffList)
    setStaffList([
      ...staffData.staffNotInShift,
      ...staffData.staffInCurrentShift,
      ...staffData.staffInDifferentShift,
    ])
    setTeacherList([
      ...teacherData.staffNotInShift,
      ...teacherData.staffInCurrentShift,
      ...teacherData.staffInDifferentShift,
    ])
    if (!isEdit) {
      const updatedShift = produce(shiftInfo, (draftState) => {
        draftState.staffs = Array.from(
          new Set([...selectedTeacherList, ...selectedStaffList])
        )
      })
      setShiftInfo(updatedShift)
    }
  }

  const getStaffData = (selectedStaffType) => {
    const isTeacher = selectedStaffType === STAFF_TYPE.TEACHING
    return staffListData
      .filter(
        (staff) =>
          (isTeacher && staff.roles === STAFF_TYPE.TEACHING) ||
          (!isTeacher && staff.roles !== STAFF_TYPE.TEACHING)
      )
      .reduce(
        (acc, staff) => {
          const inShift = localShiftList.find((shift) =>
            shift.staffs?.includes(staff._id)
          )
          if (inShift) {
            const staffShiftData = {
              ...staff,
              badgeLabel: inShift?.name,
              isDisabled: Boolean(inShift?._id !== shiftInfo?._id),
            }
            if (inShift._id === shiftInfo._id) {
              acc.staffInCurrentShift.push(staffShiftData)
            } else {
              acc.staffInDifferentShift.push(staffShiftData)
            }
          } else {
            acc.staffNotInShift.push(staff)
          }
          return acc
        },
        {
          staffInDifferentShift: [],
          staffNotInShift: [],
          staffInCurrentShift: [],
        }
      )
  }

  const onChangeTeachers = (selectedTeacherIds) => {
    const updatedShift = produce(shiftInfo, (draftState) => {
      draftState.staffs = Array.from(
        new Set([...selectedTeacherIds, ...selectedStaff])
      )
    })
    setSelectedTeachers([...selectedTeacherIds])
    setShiftInfo(updatedShift)
  }

  const onChangeStaff = (selectedStaffIds) => {
    const updatedShift = produce(shiftInfo, (draftState) => {
      draftState.staffs = Array.from(
        new Set([...selectedTeachers, ...selectedStaffIds])
      )
    })
    setSelectedStaff([...selectedStaffIds])
    setShiftInfo(updatedShift)
  }

  return (
    <>
      <div className={styles.staffMainWrapper}>
        <div className={styles.staffContainer}>
          <div>
            <div onClick={() => setSelectedStaffType(STAFF_TYPE.TEACHING)}>
              <Para
                type={
                  selectedStaffType === STAFF_TYPE.TEACHING
                    ? PARA_CONSTANTS.TYPE.PRIMARY
                    : PARA_CONSTANTS.TYPE.TEXT_SECONDARY
                }
                className={styles.staffTypeWrapper}
              >
                <span>
                  {t('teachers')}{' '}
                  {`(${selectedTeachers?.length}/${teacherList?.length})`}
                </span>
                <Icon
                  name={'forwardArrow'}
                  size={ICON_CONSTANTS.SIZES.XX_SMALL}
                  type={
                    selectedStaffType === STAFF_TYPE.TEACHING
                      ? ICON_CONSTANTS.TYPES.PRIMARY
                      : ICON_CONSTANTS.TYPES.SECONDARY
                  }
                />
              </Para>
              <Divider spacing={0} />
            </div>
            <div onClick={() => setSelectedStaffType(STAFF_TYPE.NON_TEACHING)}>
              <Para
                type={
                  selectedStaffType === STAFF_TYPE.NON_TEACHING
                    ? PARA_CONSTANTS.TYPE.PRIMARY
                    : PARA_CONSTANTS.TYPE.TEXT_SECONDARY
                }
                className={styles.staffTypeWrapper}
              >
                <span>
                  {t('staff')}{' '}
                  {`(${selectedStaff?.length}/${staffList?.length})`}
                </span>
                <Icon
                  name={'forwardArrow'}
                  size={ICON_CONSTANTS.SIZES.XX_SMALL}
                  type={
                    selectedStaffType === STAFF_TYPE.NON_TEACHING
                      ? ICON_CONSTANTS.TYPES.PRIMARY
                      : ICON_CONSTANTS.TYPES.SECONDARY
                  }
                />
              </Para>
              <Divider spacing={0} />
            </div>
          </div>
          <Divider isVertical spacing={0} />
          <div className={styles.staffListWrapper}>
            {teacherList.length > 0 && (
              <StaffSelection
                show={selectedStaffType === STAFF_TYPE.TEACHING}
                data={teacherList}
                onChange={onChangeTeachers}
                filterOnProperty={['name']}
                staffType={t('teachers')}
                preSelectedRows={selectedTeachers}
                isSelectable
              />
            )}
            {staffList.length > 0 && (
              <StaffSelection
                show={selectedStaffType === STAFF_TYPE.NON_TEACHING}
                data={staffList}
                onChange={onChangeStaff}
                filterOnProperty={['name']}
                staffType={t('staff')}
                preSelectedRows={selectedStaff}
                isSelectable
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
