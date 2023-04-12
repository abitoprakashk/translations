import {useSelector} from 'react-redux'

export const useContent = () => {
  return useSelector((state) => state.contentMvpInfo.content)
}
export const useInstituteId = () => {
  const {instituteInfo} = useSelector((state) => state)
  return instituteInfo && instituteInfo._id
}

export const useContentAccessCheckRequested = () => {
  const {contentAccessCheckRequested} = useSelector(
    (state) => state.contentMvpInfo.content
  )
  return contentAccessCheckRequested
}
