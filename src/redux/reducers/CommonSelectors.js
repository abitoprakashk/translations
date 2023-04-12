import {useSelector} from 'react-redux'

export const useInstituteId = () => {
  const {instituteInfo} = useSelector((state) => state)
  return instituteInfo && instituteInfo._id
}

export const useCountryCode = () => {
  const {
    instituteInfo: {
      address: {country},
    },
    countryList,
  } = useSelector((state) => state)
  return countryList.find((item) => item.country === country)?.isd_code || '91'
}

export const useCountry = () => {
  const {
    instituteInfo: {
      address: {country},
    },
    countryList,
  } = useSelector((state) => state)
  return (
    countryList.find((item) => item.country === country)?.country || 'India'
  )
}

export const getActiveStudents = (_isActive = false) => {
  const {instituteStudentList, instituteActiveStudentList} = useSelector(
    (state) => state
  )
  if (!_isActive) {
    return instituteStudentList
  } else {
    return instituteActiveStudentList
  }
}

export function getInactiveStudents() {
  const {instituteInActiveStudentList} = useSelector((state) => state)
  return instituteInActiveStudentList
}

export const getActiveTeachers = (_isActive = false) => {
  const {instituteTeacherList, instituteActiveTeacherList} = useSelector(
    (state) => state
  )
  if (!_isActive) {
    return instituteTeacherList
  } else {
    return instituteActiveTeacherList
  }
}

export function getInactiveTeachers() {
  const {instituteInActiveTeacherList} = useSelector((state) => state)
  return instituteInActiveTeacherList
}

export function roleListSelector() {
  const rolesList = useSelector((store) => store.rolesList)
  return rolesList
}

export const eventManagerSelector = () => {
  const eventManager = useSelector((store) => store.eventManager)
  return eventManager
}

export const permissionsSelector = () => {
  const permissions = useSelector(
    (state) => state.globalData?.userRolePermission
  )
  return permissions
}
