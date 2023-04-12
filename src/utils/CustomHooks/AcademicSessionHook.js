import {useSelector} from 'react-redux'

export const useActiveAcademicSessionId = () => {
  const {instituteActiveAcademicSessionId} = useSelector((state) => state)

  return instituteActiveAcademicSessionId
}
