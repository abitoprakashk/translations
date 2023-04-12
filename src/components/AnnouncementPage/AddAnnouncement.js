import React, {useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {
  showErrorOccuredAction,
  showLoadingAction,
} from '../../redux/actions/commonAction'
import {utilsSendAnnouncement} from '../../routes/dashboard'
import {userTypeOptions} from '../../utils/SampleCSVRows'
import CreatePopupCard from '../Common/CreatePopupCard/CreatePopupCard'
import InputField from '../Common/InputField/InputField'

export default function AddAnnouncement({
  setShowAddAnnouncement,
  getAnnouncements,
}) {
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [userType, setUserType] = useState('teachers')
  const [errorObject, setErrorObject] = useState({})
  const {instituteInfo} = useSelector((state) => state)
  const dispatch = useDispatch()
  const {t} = useTranslation()

  const handleInputChange = (fieldName, value) => {
    switch (fieldName) {
      case 'title': {
        if (value.length <= 30) setTitle(value)
        break
      }
      case 'desc': {
        if (value.length <= 100) setDesc(value)
        break
      }
      case 'userType': {
        setUserType(value)
        break
      }
    }
  }

  const handleSetError = (fieldName, error) => {
    let obj = {}
    obj[fieldName] = error
    setErrorObject((errorObject) => ({...errorObject, ...obj}))
  }

  const validateFields = (isFinal = false) => {
    let flag = true
    let titleTemp = title.trim()
    let descTemp = desc.trim()

    if (titleTemp.length < 3 || titleTemp.length > 30) {
      if (isFinal) handleSetError('title', t('enterAtleast3characters'))
      flag = false
    }
    if (descTemp.length < 3 || descTemp.length > 100) {
      if (isFinal) handleSetError('desc', t('enterAtleast3characters'))
      flag = false
    }
    return flag
  }

  const handleFormSubmit = () => {
    setErrorObject({})

    if (validateFields(true) && instituteInfo) {
      dispatch(showLoadingAction(true))
      utilsSendAnnouncement(instituteInfo._id, title, desc, userType)
        .then(() => {
          setShowAddAnnouncement(false)
          getAnnouncements()
        })
        .catch(() => dispatch(showErrorOccuredAction(true)))
        .finally(() => dispatch(showLoadingAction(false)))
    }
  }

  return (
    <CreatePopupCard
      title={t('sendAnnouncement')}
      onClose={setShowAddAnnouncement}
      htmlContent={
        <div className="p-4">
          <InputField
            fieldType="dropdown"
            title={t('selectUser')}
            placeholder={t('selectUser')}
            value={userType}
            handleChange={handleInputChange}
            fieldName="userType"
            dropdownItems={Object.values(userTypeOptions)}
          />

          <InputField
            fieldType="text"
            title={t('addTitle')}
            placeholder={t('enterTitle')}
            value={title}
            handleChange={handleInputChange}
            fieldName="title"
            errorText={errorObject['title']}
            inputLimit={`${title.length}/30`}
          />

          <InputField
            fieldType="textarea"
            title={t('description')}
            placeholder={t('writeYourMessageHere')}
            value={desc}
            handleChange={handleInputChange}
            fieldName="desc"
            errorText={errorObject['desc']}
            inputLimit={`${desc.length}/100`}
          />

          <div className="tm-btn2-blue my-6" onClick={handleFormSubmit}>
            {t('send')}
          </div>
        </div>
      }
    />
  )
}
