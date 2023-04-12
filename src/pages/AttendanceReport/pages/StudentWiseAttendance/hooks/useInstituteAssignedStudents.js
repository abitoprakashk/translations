import {useLayoutEffect, useMemo, useState} from 'react'
import {useSelector} from 'react-redux'
import useInstituteHeirarchy from './useInstituteHeirarchy'

function useInstituteAssignedStudents() {
  const {instituteActiveStudentList} = useSelector((state) => state)
  const {sectionWithName} = useInstituteHeirarchy({
    allSelected: true,
  })
  const [students, setstudents] = useState(null)

  const getActiveStudentList = useMemo(() => {
    if (!sectionWithName) return null
    const allselectedSections = Object.keys(sectionWithName)
    return instituteActiveStudentList?.filter((student) => {
      let match = false
      student?.details?.sections?.some((section) => {
        if (allselectedSections.includes(section)) {
          student.sectionName = sectionWithName?.[section]
          match = true
          return true
        }
      })
      return match
    })
  }, [instituteActiveStudentList, sectionWithName])

  useLayoutEffect(() => {
    if (instituteActiveStudentList?.length && sectionWithName) {
      setstudents(getActiveStudentList)
    }
  }, [instituteActiveStudentList, sectionWithName])

  return students
}

export default useInstituteAssignedStudents
