import React, {useState} from 'react'
import {useTranslation} from 'react-i18next'
import DropdownField from '../../../Common/DropdownField/DropdownField'
import {
  ACADEMIC_YEAR,
  SELECT_CLASS,
  SELECT_YEAR,
  SELECT_CLASS_TEXT,
} from '../constant'
import cx from 'classnames'
import {
  utilsGetClassListForSession,
  utilsGetStudentListForSection,
} from '../../../../routes/dashboard'
import Loader from '../../../Common/Loader/Loader'
import CheckBoxListWithSearch from './CheckBoxListWithSearch'
import s from './ImportStudents.module.scss'

const ImportStudents = ({sessionInfo = [], onSubmit}) => {
  const {t} = useTranslation()
  const [classList, setClassList] = useState([
    {id: '', class: t('selectClass')},
  ])
  const [showLoader, setLoader] = useState(false)
  const [selectedClass, setClass] = useState(null)
  const [selectedSession, setSession] = useState(null)
  const [studentList, setStudentList] = useState([])
  const [proceedClicked, setProceed] = useState(false)
  const sessionInfoItems = [{_id: '', name: t('selectSession')}, ...sessionInfo]

  const handleChangeSession = async (field, value) => {
    setLoader(true)
    setSession(value)
    const res = await utilsGetClassListForSession(value)
    if (res?.obj) {
      const arr = [{id: '', class: t('selectClass')}, ...res.obj]
      setClassList(arr)
    }
    setLoader(false)
  }
  const handleChangeClass = (fieldName, value) => {
    setClass(value)
  }

  const handleProceed = async () => {
    setLoader(true)
    setProceed(true)
    const res = await utilsGetStudentListForSection(selectedClass)
    if (res?.obj) {
      const arr = res.obj.map((item) => {
        return {...item, title: item.name, checked: true, num: item._id}
      })
      setStudentList(arr)
    }
    setLoader(false)
  }
  return (
    <>
      <Loader show={showLoader} />
      {studentList.length || proceedClicked ? (
        <>
          <CheckBoxListWithSearch
            onSubmit={onSubmit}
            list={studentList}
            extraField="phone_number"
            primaryButtonText={t('importStudents')}
          />
        </>
      ) : (
        <>
          <div>
            <div>
              <div className="flex justify-between tm-hdg tm-hdg-16 mb-6">
                <div>1. {ACADEMIC_YEAR}</div>
              </div>
              <p className="tm-para tm-para-12 lg:tm-para-14 mb-2">
                {SELECT_YEAR}
              </p>
              <DropdownField
                handleChange={handleChangeSession}
                value={selectedSession}
                fieldName={ACADEMIC_YEAR}
                dropdownItems={sessionInfoItems.map((item) => {
                  return {key: item._id, value: item.name}
                })}
                onClick={() => {}}
              />
            </div>
            <div className="mt-6">
              <div className="flex justify-between tm-hdg tm-hdg-16 mb-6">
                <div>2. {SELECT_CLASS}</div>
              </div>
              <p className="tm-para tm-para-12 lg:tm-para-14 mb-2">
                {SELECT_CLASS_TEXT}
              </p>
              <DropdownField
                handleChange={handleChangeClass}
                value={selectedClass}
                fieldName={SELECT_CLASS}
                dropdownItems={classList.map((item) => {
                  return {
                    key: item.id,
                    value: item.subject
                      ? `${item.class} - ${item.subject}`
                      : item.class,
                  }
                })}
                onClick={() => {}}
              />
            </div>
          </div>
          <div className={s.proceed}>
            <div
              className={cx('tm-btn2-blue mt-6', {disabled: !selectedClass})}
              onClick={!selectedClass ? () => {} : handleProceed}
            >
              {t('proceed')}
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default ImportStudents
