export const parseAdminList = (instituteAdminList) => {
  const userInfo = {}
  instituteAdminList.forEach((user) => {
    const role_id = user?.roles?.[0] || user?.roles_to_assign?.[0]
    if (role_id) {
      if (!userInfo?.[role_id]) {
        userInfo[role_id] = []
      }
      userInfo[role_id].push({
        id: user?._id,
        name: user?.name,
        imgSrc: user?.img_url,
      })
    }
  })
  return userInfo
}
