import {Trans} from 'react-i18next'
import {
  checkRegex,
  previousYearDuesValidationsList,
} from '../../../../../../utils/Validations'

export const formatStudentsList = (
  data,
  feeTypes,
  formValues,
  importedSessionDueData = {}
) => {
  let headers = Object.keys(previousYearDuesValidationsList)
  formValues.fee_types.map((selectedType) => {
    headers.push(feeTypes.find((type) => type._id === selectedType)?.name)
  })
  let arr = data.map((obj) => {
    let newObj = {}
    let row = {...obj}
    let classRoom = row.classroom?.split('-')
    let phnNumber = row.phone_number?.split('-')
    let date = new Date(row.admission_timestamp * 1000)
    newObj['UID*'] = row._id
    newObj['First Name'] = row.first_name
    newObj['Middle Name'] = row.middle_name
    newObj['Last Name'] = row.last_name
    newObj['Country Code'] = phnNumber.length === 2 ? phnNumber[0] : '91'
    newObj['Phone'] = phnNumber[1] || phnNumber[0]
    newObj['Enrollment ID'] = row.enrollment_number?.split('@')[0]
    newObj['Date of Admission'] = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`
    newObj['Class'] = classRoom?.splice(0, 1) || ''
    newObj['Section'] = classRoom?.toString().replace(',', '-') || ''
    newObj['Email'] = row.email
    formValues.fee_types.map((selectedType) => {
      newObj[feeTypes.find((type) => type._id === selectedType)?.name] =
        parseInt(
          importedSessionDueData[row._id]?.find(
            (d) => d.master_id === selectedType
          )?.amount || 0
        )
    })
    return newObj
  })
  return {
    header: headers,
    list: arr,
  }
}

export const validateStructureData = (
  formValues,
  t,
  isDownloadFile = false
) => {
  const errors = {}

  // Fee Types
  if (formValues.fee_types.length === 0) {
    errors.fee_types = t('selectAtleastOneCategory')
  }

  if (!isDownloadFile) {
    // Receipt Prefix Validation
    if (!formValues.receipt_prefix.trim()) {
      errors.receipt_prefix = t('preFixIsRequired')
    } else if (formValues.receipt_prefix.length < 1) {
      errors.receipt_prefix = t('prefixMustBeMoreThan1Character')
    } else if (formValues.receipt_prefix.length > 25) {
      errors.receipt_prefix = t('prefixcannotExceedMoreThan25Characters')
    }

    // Series Starting Number
    if (!formValues.series_starting_number) {
      errors.series_starting_number = t('startingNumberIsRequired')
    } else if (formValues.series_starting_number.length < 1) {
      errors.series_starting_number = t(
        'startingNumberMustBeMoreThan1Character'
      )
    } else if (formValues.series_starting_number.length > 16) {
      errors.series_starting_number = t(
        'startingNumberCannotExceedMoreThan16Characters'
      )
    }

    // Fee Categories
    if (formValues.fee_categories.length === 0) {
      errors.fee_categories = t('uploadCsvFileToProceed')
    }
  }
  return errors
}

export const validateStudentDuesCSV = (
  processedCSV,
  feeTypes,
  csvFeeCategories,
  t,
  maximumRows = 2000
) => {
  let finalValidationList = {'UID*': [/^[a-z0-9]{24}$/, 'nonEmpty']}
  csvFeeCategories.forEach((header) => {
    finalValidationList[header] = [/^\d+(\.?\d{0,2})?$/]
  })

  let rows = processedCSV.rows

  // No. of rows
  if (rows.length === 0)
    return {
      status: false,
      msg: t('fileIsEmpty'),
      obj: null,
    }

  // Number of rows
  if (rows.length > maximumRows)
    return {
      status: false,
      msg: (
        <Trans i18nKey={'moreThan2kNoOfStudentsUploadError'}>
          File has more than {{maximumRows}} number of students. Maximum of 2000
          student dues can be added at once.
        </Trans>
      ),
      obj: null,
    }

  // Rows structure
  if (!(rows && Array.isArray(rows)))
    return {
      status: false,
      msg: t('invalidRowsStructure'),
      obj: null,
    }

  // Fee categories check
  const categories = []
  feeTypes.forEach((type) => {
    categories.push(type.name)
  })
  const allCategoriesCheck = csvFeeCategories.map((category) => {
    return categories.includes(category)
  })
  if (allCategoriesCheck.includes(false)) {
    return {
      status: false,
      msg: t('invalidFeeCategoryInCsvFile'),
      obj: null,
    }
  }

  // Row value validations
  let allRowsRight = true
  let hasErrorAlready = processedCSV.headers.includes('Errors')

  for (let row = 0; row < rows.length; row++) {
    let validationFails = []

    Object.entries(rows[row]).map((entry) => {
      let key = entry[0]
      let value = entry[1]
      let colFlag = true

      if (finalValidationList[key])
        finalValidationList[key].forEach((element) => {
          if (element === 'nonEmpty') colFlag = colFlag && value !== ''
          else colFlag = colFlag && checkRegex(element, value)
        })

      if (!colFlag) validationFails.push(key)
      allRowsRight = allRowsRight && colFlag
    })
    if (hasErrorAlready) {
      rows[row].Errors = validationFails.join(', ')
    } else {
      rows[row].error = validationFails.join(', ')
    }
  }
  if (allRowsRight)
    return {
      status: true,
      obj: null,
    }

  return {
    status: false,
    msg: t('invalidDataInCsvFile'),
    obj: rows,
  }
}
