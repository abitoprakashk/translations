import {useMemo} from 'react'

const useActiveDepartments = ({instituteHierarchy = []}) => {
  const activeDepartments = useMemo(() => {
    const departments = instituteHierarchy?.children
    return departments
      .filter((department) => {
        return department.status === 1
      })
      .map((department) => ({
        ...department,
        children: department.children.filter(
          (standard) => standard.status === 1
        ),
      }))
  }, [instituteHierarchy])

  return {
    activeDepartments,
  }
}

export default useActiveDepartments
