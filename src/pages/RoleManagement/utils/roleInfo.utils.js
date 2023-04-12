export const parseRoleList = (roleList) => {
  const roleInfo = {}
  roleList.forEach((role) => {
    roleInfo[role._id] = role.name
  })

  return roleInfo
}
