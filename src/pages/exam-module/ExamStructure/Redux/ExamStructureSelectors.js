import {useSelector} from 'react-redux'

const useExamStructure = () => {
  return useSelector((state) => state.examStructureData)
}

export const useClassesExamStructureList = () => {
  return useExamStructure().classesExamStructureList
}

export const useExamStructureForClass = () => {
  return useExamStructure().classExamStructure
}

export const useSampleTerm = () => {
  return useExamStructure().classExamStructure?.sample_term
}

export const useSampleExam = () => {
  return useExamStructure().classExamStructure?.sample_term.children[0]
}

export const useAddToTermExam = () => {
  return useExamStructure().addToTermExam
}

export const useExamStructureSaved = () => {
  return useExamStructure().isSaved
}

export const useGradesCriteria = () => {
  return useExamStructure().gradesCriteria
}

export const useImportStatusInfo = () => {
  return useExamStructure().importStatus
}
