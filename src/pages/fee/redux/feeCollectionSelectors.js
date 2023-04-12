import {useSelector} from 'react-redux'

export const useInstituteId = () => {
  const {instituteInfo} = useSelector((state) => state)
  return instituteInfo && instituteInfo._id
}

export const useFeeCollection = () => {
  return useSelector((state) => state.feeCollection)
}

export const useFeeSettings = () => {
  return useSelector((state) => state.feeSettings)
}

export const useSelectedStudent = () => {
  return useSelector(
    (state) => state.feeCollection && state.feeCollection.selectedStudent
  )
}

export const useSliderScreen = () => {
  return useSelector(
    (state) =>
      state.feeCollection && {
        sliderScreen: state.feeCollection.sliderScreen,
        sliderData: state.feeCollection.sliderData,
      }
  )
}
