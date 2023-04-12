import React, {useCallback, useState} from 'react'
import MultipleCheckboxWithImage from '../../../Common/MultipleCheckboxWithImage/MultipleCheckboxWithImage'
import SearchBox from '../../../Common/SearchBox/SearchBox'
import cx from 'classnames'
// import {
//   showLoadingAction,
//   showErrorOccuredAction,
// } from '../../../../redux/actions/commonAction'
// import {useDispatch} from 'react-redux'
import {useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import s from './CheckBoxListWithSearch.module.scss'
import {checkPropKey} from '../SliderStudent'
// import {utilsGetUncatergorizedClasses} from '../../../../routes/instituteSystem'
// import {instituteAllClassesAction} from '../../../../redux/actions/instituteInfoActions'

const CheckBoxListWithSearch = ({
  list,
  extraField,
  primaryButtonText,
  isAllSelected = true,
  onSubmit = () => {},
  submitDisableAllowed = true,
}) => {
  const [selectAll, setSelectAll] = useState(isAllSelected)
  const [data, setData] = useState([])
  const [searchString, setSearch] = useState('')
  const [edited, setEdited] = useState(false)
  const {t} = useTranslation()

  useEffect(() => {
    setData([...list])
  }, [list])

  const listOfStudentsRow = useCallback(
    () =>
      data.filter((item) => {
        let value = searchString
        if (
          item?.title
            ?.toString()
            ?.toLowerCase()
            .includes(value.toLowerCase()) ||
          item?.phone_number
            ?.toString()
            ?.toLowerCase()
            .includes(value.toLowerCase()) ||
          item?.email
            ?.toString()
            ?.toLowerCase()
            .includes(value.toLowerCase()) ||
          item?.enrollment_number
            ?.toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        )
          return item
        else if (
          extraField &&
          checkPropKey(extraField, item)
            .toLowerCase()
            .includes(value.toLowerCase())
        )
          return item
      }),
    [data, searchString, selectAll]
  )

  useEffect(() => {
    let allSelected = listOfStudentsRow().every((item) => item.checked)
    setSelectAll(allSelected)
  }, [data, listOfStudentsRow])

  // const getInstituteClasses = (instituteId) => {
  //   dispatch(showLoadingAction(true))
  //   utilsGetUncatergorizedClasses(instituteId)
  //     .then(({status, obj}) => {
  //       if (status) dispatch(instituteAllClassesAction(obj))
  //     })
  //     .catch((_err) => dispatch(showErrorOccuredAction(true)))
  //     .finally(() => dispatch(showLoadingAction(false)))
  // }

  const handleSelectAll = (e) => {
    setSelectAll(e.target.checked)
    setEdited(true)
    let filterdItemsIds = listOfStudentsRow().map((item) => item._id)

    let updatedData = data.map((item) => {
      if (filterdItemsIds.includes(item._id)) {
        return {...item, checked: e.target.checked}
      } else {
        return item
      }
    })
    setData(updatedData)
  }

  const handleSearch = (value) => {
    setSearch(value)
  }
  const handleItemCheckboxClick = (id, isChecked) => {
    setEdited(true)
    setData(
      data.map((item) => {
        if (item._id == id) return {...item, checked: isChecked}
        return item
      })
    )
  }

  const isOneChecked = data.find((item) => item.checked)

  const assignStudents = async () => {
    onSubmit(data)
  }

  const isDisabled = () => {
    if (!submitDisableAllowed && edited) return false
    if (!submitDisableAllowed && !edited) return true
    else if (submitDisableAllowed && isOneChecked) return false
    else if (submitDisableAllowed && !isOneChecked) return true
  }

  return (
    <div className={s.container}>
      {listOfStudentsRow() && (
        <>
          <SearchBox
            placeholder={t('searchStudent')}
            value={searchString}
            handleSearchFilter={handleSearch}
          />
          {listOfStudentsRow().length > 0 && (
            <>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="mx-4 mt-6 mb-6"
                readOnly
              />
              <span className="tm-para tm-para-14 mt-2">{t('selectAll')}</span>
            </>
          )}
          <MultipleCheckboxWithImage
            handleChange={handleItemCheckboxClick}
            items={listOfStudentsRow()}
            extraField={extraField}
            emptyListText={
              searchString ? t('noResults') : t('noStudentsFoundInThisClass')
            }
          />
          <div className={s.import}>
            <div
              className={cx('tm-btn2-blue mt-6', {
                disabled: isDisabled(),
              })}
              onClick={isDisabled() ? () => {} : assignStudents}
            >
              {primaryButtonText}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default CheckBoxListWithSearch
