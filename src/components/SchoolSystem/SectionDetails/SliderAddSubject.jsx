import React, {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {INSTITUTE_TYPES} from '../../../constants/institute.constants'
import {subjectOptions} from '../../../utils/SampleCSVRows'
import InputField from '../../Common/InputField/InputField'
import SliderScreen from '../../Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../Common/SliderScreenHeader/SliderScreenHeader'

export default function SliderAddSubject({
  setSliderScreen,
  handleSubmit,
  instituteType,
}) {
  const [subject, setSubject] = useState('')
  const [err, setErr] = useState('')
  const {t} = useTranslation()

  const handleChange = (value) => {
    if (String(value).length <= 100) setSubject(value)
  }

  const onSubmit = () => {
    if (subject === '') setErr(t('enterValidInput'))
    else {
      handleSubmit(subject)
      setSliderScreen(null)
    }
  }

  return (
    <SliderScreen setOpen={() => setSliderScreen(null)}>
      <>
        <SliderScreenHeader
          icon="https://storage.googleapis.com/tm-assets/icons/primary/students-primary.svg"
          title={
            instituteType === INSTITUTE_TYPES.TUITION
              ? t('addClassroom')
              : t('addSubject')
          }
        />

        <div className="p-5 lg:p-10 h-4/5 overflow-y-auto">
          <InputField
            fieldType="searchDropdown"
            title={
              instituteType === INSTITUTE_TYPES.TUITION
                ? t('className')
                : t('subjectName')
            }
            placeholder={
              instituteType === INSTITUTE_TYPES.TUITION
                ? t('className')
                : t('subjectName')
            }
            value={subject}
            handleChange={(_, value) => handleChange(value)}
            fieldName="subjectName"
            dropdownItems={subjectOptions}
            errorText={err}
          />

          <div
            className={`${
              subject === '' ? 'tm-btn1-gray' : 'tm-btn2-blue'
            } mt-6`}
            onClick={onSubmit}
          >
            {instituteType === INSTITUTE_TYPES.TUITION
              ? t('addClassroom')
              : t('addSubject')}
          </div>
        </div>
      </>
    </SliderScreen>
  )
}
