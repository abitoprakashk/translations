import {USER_TYPE} from './CustomCertificate.constants'

export const getRoleName = (staff, rolesList) => {
  const {roles, roles_to_assign, type} = staff || {}
  if (type === USER_TYPE.TEACHER) return 'Teacher'
  if (rolesList?.length) {
    const roleName = roles?.length
      ? rolesList.find((item) => item._id == roles[0])?.name
      : roles_to_assign?.length
      ? rolesList.find((item) => item._id == roles_to_assign[0])?.name
      : 'NA'
    return roleName
  }
}
