import {useSelector} from 'react-redux'

const useExamPlanner = () => {
  const data = useSelector((state) => state.examPlannerData)
  return data
}

export const useExistingExam = () => {
  return useExamPlanner().existingExams
}
