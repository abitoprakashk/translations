export const processInstituteMembersList = (
  instituteAdminList,
  instituteTeacherList,
  instituteStudentList
) => {
  let availableToAllocateInstituteMembers = []
  instituteTeacherList?.forEach((item) => {
    if (item?.verification_status != 4) {
      availableToAllocateInstituteMembers.push(item)
    }
  })
  instituteAdminList?.forEach((item) => {
    if (item?.verification_status != 4) {
      availableToAllocateInstituteMembers.push(item)
    }
  })
  instituteStudentList?.forEach((item) => {
    if (item?.verification_status != 4) {
      availableToAllocateInstituteMembers.push(item)
    }
  })

  return availableToAllocateInstituteMembers
}
