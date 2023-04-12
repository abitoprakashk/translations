import {useLayoutEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import useSectionData from './useSectionData'

function useTeacherList() {
  const [sectionTeacherData, setsectionTeacherData] = useState(null)
  const {instituteActiveTeacherList: instituteTeacherList} = useSelector(
    (state) => state
  )
  const {allSection} = useSectionData()
  const getAllTeacherList = () => {
    return allSection.map((section) => {
      const newSection = {...section}
      instituteTeacherList.some((teacher) => {
        if (teacher?.details?.class_teacher?.includes(section.id)) {
          newSection.teacher = teacher.full_name
          newSection.teacherPhoneNumber = teacher.phone_number
          newSection.teacherID = teacher._id
          return true
        }
        return false
      })
      return newSection
    })
  }

  useLayoutEffect(() => {
    if (!allSection || !instituteTeacherList) return
    setsectionTeacherData(getAllTeacherList())
  }, [allSection, instituteTeacherList])
  return {sectionTeacherData}
}

export default useTeacherList
