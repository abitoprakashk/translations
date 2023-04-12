import {useSelector} from 'react-redux'

export const useInstituteId = () => {
  const {instituteInfo} = useSelector((state) => state)
  return instituteInfo && instituteInfo._id
}

export const useSliderScreen = () => {
  return useSelector(
    (state) =>
      state.feeStructure && {
        sliderScreen: state.feeStructure.sliderScreen,
        sliderData: state.feeStructure.sliderData,
      }
  )
}

export const useFeeStructure = () => {
  return useSelector((state) => state.feeStructure)
}

export const useFeeSettings = () => {
  return useSelector((state) => state.feeStructure.feeSettings)
}

export const useFeeStructureSettings = () => {
  return useSelector(
    (state) => state.feeStructure.feeSettings.miscellaneous_settings
  )
}

export const usePreviousSessionDueSettings = () => {
  return useSelector(
    (state) =>
      state.feeStructure.feeSettings.miscellaneous_settings
        .previous_due_structure.settings
  )
}

export const useTransportStructureSettings = () => {
  return useSelector(
    (state) =>
      state.feeStructure.feeSettings.miscellaneous_settings.transport_structure
        .settings
  )
}

export const useFeeStructuresData = () => {
  return useSelector((state) => state.feeStructure.feeStructures)
}

export const useGetSpecificFeeType = (feeTypeId) => {
  return useSelector((state) => state.feeStructure.feeTypes).find(
    (type) => type._id === feeTypeId
  )
}

export const previouslyImportedSessionDue = () => {
  return useSelector((state) => state.previouslyImportedSessionDue)
}
