import {useDispatch, useSelector} from 'react-redux'
import {
  COLUMN_OPTIONS,
  FEE_PAYMENT_MODE_OPTIONS,
  ROW_OPTIONS,
  TRANSACTION_STATUS,
  VALUE,
  VALUE_OPTIONS,
} from '../constants/feeCustomization.editor.constants'
import {getClassList} from '../utils/feeCustomization.helpers'
import {useEffect, useMemo} from 'react'
import produce from 'immer'
import {INSTITUTE_HIERARCHY_TYPES} from '../../fee/fees.constants'
import {DateTime} from 'luxon'
import {DATE_FORMAT, MONTHS} from '../constants/feeCustomization.constants'
import {useTranslation} from 'react-i18next'
import globalActions from '../../../redux/actions/global.actions'
import {FEE_CUSTOMIZATION_API_KEYS_RESPONSE} from '../constants/feeCustomization.api.constants'
import {convertValueArrToObj} from '../utils/feeCustomization.state.helpers'
import StudentDetails from '../components/StudentDetails/StudentDetails'

function usePivotTableData() {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const allStudents = useSelector((state) => state.instituteActiveStudentList)
  const {
    rows: rowAttr,
    columns: colAttr,
    values: valueAttr,
    filter,
    dateRange,
  } = useSelector((state) => state.feeCustomization.editor)

  const editorData = useSelector((state) => state.feeCustomization.editor)

  const _rowAttr = useMemo(
    () => rowAttr?.map((key) => FEE_CUSTOMIZATION_API_KEYS_RESPONSE[key]) || [],
    [rowAttr]
  )
  const _colAttr = useMemo(
    () => colAttr?.map((key) => FEE_CUSTOMIZATION_API_KEYS_RESPONSE[key]) || [],
    [colAttr]
  )
  const _valueAttr = useMemo(
    () =>
      valueAttr?.map((key) => FEE_CUSTOMIZATION_API_KEYS_RESPONSE[key]) || [],
    [valueAttr]
  )

  const {data, isLoading, error} = useSelector(
    (state) => state.globalData.pivotTableData
  )
  const feeTypeList = useSelector((state) => state.feeReports.feeTypeList)
  const instituteHierarchy = useSelector((state) => state.instituteHierarchy)

  const feeTypeListObject = useMemo(() => {
    const obj = {}
    feeTypeList?.map((fee) => {
      obj[fee._id] = fee.name
    })
    return obj
  }, [feeTypeList])

  const classList = useMemo(() => {
    if (!instituteHierarchy) return []
    return getClassList(instituteHierarchy, INSTITUTE_HIERARCHY_TYPES.STANDARD)
  }, [instituteHierarchy])

  const sectionList = useMemo(() => {
    if (!instituteHierarchy) return []
    return getClassList(instituteHierarchy, INSTITUTE_HIERARCHY_TYPES.SECTION)
  }, [instituteHierarchy])

  const departmentList = useMemo(() => {
    if (!instituteHierarchy) return []
    return getClassList(
      instituteHierarchy,
      INSTITUTE_HIERARCHY_TYPES.DEPARTMENT
    )
  }, [instituteHierarchy])

  const allStudentObject = useMemo(() => {
    const obj = {}
    allStudents.forEach((student) => {
      obj[student._id] = student
    })
    return obj
  }, [allStudents])

  useEffect(() => {
    if (_rowAttr?.length || _colAttr?.length || _valueAttr?.length) {
      getData()
    } else resetData()
  }, [_rowAttr, _colAttr, _valueAttr, filter, dateRange])

  const getData = () => {
    let _editorData = structuredClone(editorData)
    _editorData = convertValueArrToObj(_editorData)
    dispatch(globalActions.pivotTableData.request(_editorData))
  }
  const resetData = () => {
    dispatch(globalActions.pivotTableData.reset())
  }

  // COLUMN and ROW values are overlapped.
  const swapReadableValues = ({switchKey, draft, draftKey}) => {
    switch (switchKey) {
      // COLUMN
      case COLUMN_OPTIONS.DEPARTMENT.value:
        draft[draftKey] = departmentList[draft[draftKey]]
        break
      case COLUMN_OPTIONS.CLASS.value:
        draft[draftKey] = classList[draft[draftKey]]
        break
      case COLUMN_OPTIONS.SECTION.value:
        draft[draftKey] = sectionList[draft[draftKey]]
        break
      case COLUMN_OPTIONS.FEE_TYPE.value:
        draft[draftKey] = feeTypeListObject[draft[draftKey]] || t('deletedFee')
        break
      case COLUMN_OPTIONS.PAYMENT_MODE.value:
        FEE_PAYMENT_MODE_OPTIONS.some((item) => {
          if (item.enum === draft[draftKey]) {
            draft[draftKey] = t(item.labelKey)
            return true
          }
        })

        break
      case COLUMN_OPTIONS.TRANSACTION_STATUS.value:
        TRANSACTION_STATUS.some((item) => {
          if (item.enum === +draft[draftKey]) {
            draft[draftKey] = t(item.labelKey)
            return true
          }
        })
        break
      case COLUMN_OPTIONS.PAYMENT_MONTH.value:
        draft[draftKey] = MONTHS[draft[draftKey] - 1]
        break
      case ROW_OPTIONS.PAYMENT_DATE.value:
        draft[draftKey] = `${DateTime.fromJSDate(
          new Date(draft[draftKey] * 1000)
        )?.toFormat(DATE_FORMAT)}`
        break

      // VALUE
      //  only for value key will be number(enum). for others string
      case VALUE_OPTIONS.FEE_APPLICABLE.enum:
        draft[draftKey] = t(VALUE_OPTIONS.FEE_APPLICABLE.titleKey)
        break
      case VALUE_OPTIONS.DISCOUNT.enum:
        draft[draftKey] = t(VALUE_OPTIONS.DISCOUNT.titleKey)
        break
      case VALUE_OPTIONS.DUE.enum:
        draft[draftKey] = t(VALUE_OPTIONS.DUE.titleKey)
        break
      case VALUE_OPTIONS.PAID_AMOUNT.enum:
        draft[draftKey] = t(VALUE_OPTIONS.PAID_AMOUNT.titleKey)
        break

      // ROW
      case ROW_OPTIONS.STUDENT_DETAILS.value:
        draft[draftKey] = {
          Component: StudentDetails,
          props: {
            title: allStudentObject[draft[draftKey]]?.full_name,
            desc:
              allStudentObject[draft[draftKey]]?.enrollment_number ||
              allStudentObject[draft[draftKey]]?.phone_number ||
              allStudentObject[draft[draftKey]]?.email,
            img: allStudentObject[draft[draftKey]]?.img_url,
          },
        }
        break
      case ROW_OPTIONS.INSTALLMENT_DATE.value:
        draft[draftKey] = `${DateTime.fromJSDate(
          new Date(draft[draftKey] * 1000)
        )?.toFormat(DATE_FORMAT)}`
        break
    }
  }

  const colKeys = useMemo(() => {
    if (!Object.keys(feeTypeListObject).length) return []
    if (!data) return []
    return (
      data &&
      data.cols.map((col) => {
        return produce(col, (draft) => {
          _colAttr.map((_colAttrKey, keyIndex) => {
            swapReadableValues({
              switchKey: _colAttrKey,
              draft,
              draftKey: keyIndex,
            })
          })
          //  values
          if (col.length > _colAttr.length) {
            swapReadableValues({
              switchKey: col[col.length - 1],
              draft,
              draftKey: col.length - 1,
            })
          }
          return draft
        })
      })
    )
  }, [feeTypeListObject, data, instituteHierarchy])

  const rowKeys = useMemo(() => {
    if (!Object.keys(allStudentObject).length) return []
    if (!data) return []
    return (
      data &&
      data.rows.map((row) => {
        return produce(row, (draft) => {
          _rowAttr.map((_rowAttrKey, keyIndex) => {
            swapReadableValues({
              switchKey: _rowAttrKey,
              draft,
              draftKey: keyIndex,
            })
          })
          return draft
        })
      })
    )
  }, [allStudentObject, data])

  const totalCols = useMemo(
    () => [
      ...(_colAttr ? _colAttr : []),
      ...(_valueAttr?.length ? [VALUE.VALUES.value] : []),
    ],
    [_colAttr, _valueAttr]
  )
  return {
    colKeys,
    rowAttr: _rowAttr,
    colAttr: totalCols, // add value to the col attr
    selectedColAttr: _colAttr,
    rowKeys,
    isLoading,
    data,
    error,
    getData,
  }
}

export default usePivotTableData
