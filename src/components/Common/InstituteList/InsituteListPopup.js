import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {
  instituteInfoAction,
  instituteListInfoAction,
  pendingInstituteListInfoAction,
  showInstituteListAction,
} from '../../../redux/actions/instituteInfoActions'
import ListPopup from '../ListPopup/ListPopup'
import instituteDefaultImg from '../../../assets/images/icons/sidebar/institute-default.svg'
import {
  utilsGetPendingInstituteList,
  utilsGetInstituteList,
} from '../../../routes/dashboard'
import {
  showLoadingAction,
  showErrorOccuredAction,
  showErrorMessageAction,
} from '../../../redux/actions/commonAction'
import {setAdminSpecificToLocalStorage} from '../../../utils/Helpers'
import {BROWSER_STORAGE_KEYS} from '../../../constants/institute.constants'
import {organisationInfoAction} from '../../../redux/actions/organisationInfoAction'

export default function InstituteListPopup({
  closeActive,
  title,
  getTeacherExist,
  setPageNum,
}) {
  const [selectedInstitute, setSelectedInstitute] = useState(null)
  const {
    instituteListInfo,
    instituteInfo,
    adminInfo,
    pendingInstituteListInfo,
  } = useSelector((state) => state)
  const dispatch = useDispatch()
  const {t} = useTranslation()

  let instituteList = instituteListInfo?.map(
    ({_id, ins_logo, role, name}, index) => {
      let icon = instituteDefaultImg
      if (ins_logo) icon = ins_logo
      return {num: index, desc: 'ID: ' + _id, role, icon, title: name}
    }
  )

  let pendingInstituteList = pendingInstituteListInfo?.map(
    ({institute_id, ins_logo, iid, name, role}, index) => {
      let icon = instituteDefaultImg
      if (ins_logo) icon = ins_logo
      return {
        num: index,
        desc: 'ID: ' + institute_id,
        role,
        iid,
        icon,
        title: name,
      }
    }
  )

  const handleItemSelection = (index) => {
    setSelectedInstitute(instituteList[index])
  }

  const getActiveInstituteList = () => {
    utilsGetInstituteList(adminInfo?.user_type)
      .then(({institutes, organisation}) => {
        dispatch(instituteListInfoAction(institutes))
        dispatch(organisationInfoAction(organisation))
      })
      .catch((err) => {
        dispatch(showErrorOccuredAction(true))
        if (err && err.msg) {
          dispatch(showErrorMessageAction(err.msg))
        }
      })
      .finally(() => dispatch(showLoadingAction(false)))
  }

  const getPendingInstituteList = (phone_number = null, email = null) => {
    dispatch(showLoadingAction(true))
    utilsGetPendingInstituteList(phone_number, email)
      .then((response) => {
        dispatch(pendingInstituteListInfoAction(response?.obj))
      })
      .catch((err) => {
        dispatch(showErrorOccuredAction(true))
        if (err && err.msg) {
          dispatch(showErrorMessageAction(err.msg))
        }
      })
      .finally(() => dispatch(showLoadingAction(false)))
  }

  const handleShowDashboard = () => {
    if (selectedInstitute !== null) {
      setAdminSpecificToLocalStorage(
        BROWSER_STORAGE_KEYS.CURRENT_INSTITUTE_ID,
        instituteListInfo[selectedInstitute.num]._id
      )
      dispatch(instituteInfoAction(instituteListInfo[selectedInstitute.num]))
      dispatch(showInstituteListAction(false))
      getTeacherExist(
        instituteListInfo[selectedInstitute.num]._id,
        instituteListInfo[selectedInstitute.num]?.institute_type,
        instituteListInfo[selectedInstitute.num]?.hierarchy_id
      )
    }
  }

  const getIndexOfSelectedInstitute = () => {
    if (instituteInfo && instituteListInfo)
      instituteListInfo.map(({_id}, index) => {
        if (instituteInfo._id === _id)
          setSelectedInstitute(instituteList[index])
        return
      })
  }

  useEffect(() => {
    getPendingInstituteList(adminInfo?.phone_number, adminInfo?.email)
  }, [adminInfo?.phone_number, adminInfo?.email])

  useEffect(() => {
    getIndexOfSelectedInstitute()
  }, [])
  return (
    <ListPopup
      heading={title}
      listItems={instituteList}
      pendingInstitutes={pendingInstituteList}
      selectedItem={selectedInstitute}
      handleItemSelection={handleItemSelection}
      actionTxt={t('goToInstitute')}
      action={handleShowDashboard}
      closeActive={closeActive}
      getActiveInstituteList={getActiveInstituteList}
      getPendingInstituteList={getPendingInstituteList}
      setPageNum={setPageNum}
    />
  )
}
