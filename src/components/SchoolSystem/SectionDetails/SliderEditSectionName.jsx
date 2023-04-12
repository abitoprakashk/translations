import React, {useState} from 'react'
import {useTranslation} from 'react-i18next'
import InputField from '../../Common/InputField/InputField'
import SliderScreen from '../../Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../Common/SliderScreenHeader/SliderScreenHeader'

export default function SliderEditSectionName({
  setSliderScreen,
  setSelectedSubject,
  oldName,
  handleSubmit,
  nodeId,
  title,
  fieldName,
  maxLength,
}) {
  const [name, setsectionName] = useState(oldName)
  const [err, setErr] = useState('')
  const {t} = useTranslation()

  const close = () => {
    setSliderScreen(null)
    setSelectedSubject(null)
  }

  const handleChange = (value) => {
    if (String(value).length <= maxLength) setsectionName(value)
  }

  const onSubmit = () => {
    if (name === '') setErr(t('enterValidInput'))
    else {
      if (name !== oldName) handleSubmit(nodeId, name)
      close()
    }
  }

  return (
    <SliderScreen setOpen={() => close(null)}>
      <>
        <SliderScreenHeader
          icon="https://storage.googleapis.com/tm-assets/icons/primary/students-primary.svg"
          title={title}
        />

        <div className="p-5 lg:p-10 h-4/5 overflow-y-auto">
          <InputField
            fieldType="text"
            title={fieldName}
            placeholder={fieldName}
            value={name}
            handleChange={(_, value) => handleChange(value)}
            fieldName="name"
            errorText={err}
          />

          <div
            className={`${
              name === '' || name === oldName ? 'tm-btn1-gray' : 'tm-btn2-blue'
            }  mt-6`}
            onClick={onSubmit}
          >
            {t('update')}
          </div>
        </div>
      </>
    </SliderScreen>
  )
}
