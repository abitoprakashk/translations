import {useSelector} from 'react-redux'

const getSelector = (selector) => {
  return useSelector((state) => state.globalData[selector])
}

export const getAdmitCardStudentListSectionWise = () => {
  return getSelector('getStudentListSectionWise')
}

export const getAdmitCardGenerated = () => {
  return getSelector('generateAdmitCards')
}

export const getAdmitCardBulkDownload = () => {
  return getSelector('bulkDownloadAdmitCard')
}

export const getAdmitCardDownloadUrl = () => {
  return getSelector('getAdmitCardDownloadUrl')
}
