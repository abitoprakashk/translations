import {useSelector} from 'react-redux'

export const getGlobalNPSData = () => {
  const {NPSTemplateList} = useSelector((store) => store?.globalData)
  return {
    NPSTemplateList,
  }
}
