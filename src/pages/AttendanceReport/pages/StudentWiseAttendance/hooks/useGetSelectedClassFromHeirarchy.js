import {useMemo} from 'react'
import {useSelector} from 'react-redux'

function useGetSelectedClassFromHeirarchy(reducerKey) {
  const {
    filterData: {heirarchy},
  } = useSelector((state) => state.attendanceReportReducer[reducerKey])

  const allselectedSections = useMemo(() => {
    const allSections = []
    heirarchy?.department?.forEach((department) => {
      department.standard?.forEach((standard) => {
        standard.section?.forEach((section) => {
          if (section.isSelected) {
            allSections.push(section._id)
          }
        })
      })
    })
    return allSections?.length ? allSections : null
  }, [heirarchy])

  return allselectedSections
}

export default useGetSelectedClassFromHeirarchy
