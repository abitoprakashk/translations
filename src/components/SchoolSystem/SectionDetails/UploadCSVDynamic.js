import {ddmmyyyyDateChecker} from '../../../utils/dates.utils'

const CSVDataToQuery = (
  personaSettings,
  processedCSVData,
  type,
  isUpdate = false,
  ignoreClassAndSection = false,
  instituteType = 'SCHOOL'
) => {
  const {settingsKeyIds, dateSettingsKeyIds} = getActiveProfileKeyIds(
    personaSettings,
    isUpdate
  )
  const isValid = validateCSV(
    settingsKeyIds,
    processedCSVData.headers,
    processedCSVData.rows.slice(1),
    instituteType,
    dateSettingsKeyIds
  )
  if (typeof isValid === 'object') {
    return isValid
  }
  const queryData = getDataForQuery(
    settingsKeyIds,
    processedCSVData.rows.slice(1),
    isUpdate,
    ignoreClassAndSection,
    dateSettingsKeyIds
  )
  const data = {users: queryData}
  if (type === 'STUDENT') {
    data['type'] = 4
  } else if (type === 'TEACHER') {
    data['type'] = 2
  }
  return data
}

const getActiveProfileKeyIds = (personaSettings, isUpdate) => {
  const keyIds = []
  const dateKeyIds = []

  if (isUpdate === true) {
    keyIds.push('_id')
  }
  const profileCategoryIds = []
  for (let i = 0; i < personaSettings.length; i++) {
    if (personaSettings[i].setting_type === 1) {
      profileCategoryIds.push(String(personaSettings[i]._id))
    }
  }
  for (let i = 0; i < personaSettings.length; i++) {
    if (
      'category_id' in personaSettings[i] &&
      profileCategoryIds.includes(personaSettings[i].category_id) &&
      personaSettings[i].is_active === true
    ) {
      keyIds.push(personaSettings[i].key_id)
      if (personaSettings[i].field_type === 'DATE') {
        dateKeyIds.push(personaSettings[i].key_id)
      }
      if (personaSettings[i].field_type === 'PHONE_NUMBER') {
        keyIds.push(personaSettings[i].key_id + '_country_code')
      }
    }
  }
  return {settingsKeyIds: keyIds, dateSettingsKeyIds: dateKeyIds}
}

const getDataForQuery = (
  settingsKeyIds,
  personaCSVData,
  isUpdate,
  ignoreClassAndSection,
  dateSettingsKeyIds
) => {
  const personaMembersData = []
  for (let dataIndex = 0; dataIndex < personaCSVData.length; dataIndex++) {
    const personaMemberData = {}
    for (
      let settingIndex = 0;
      settingIndex < settingsKeyIds.length;
      settingIndex++
    ) {
      const keyId = settingsKeyIds[settingIndex]
      // const notNullKeyIds = ['standard', 'section']
      if (keyId in personaCSVData[dataIndex]) {
        if (
          dateSettingsKeyIds.includes(keyId) &&
          personaCSVData[dataIndex][keyId] !== ''
        ) {
          const userDate = personaCSVData[dataIndex][keyId]
          const [day, month, year] = userDate.split('/')
          const date = new Date(+year, month - 1, +day)
          const timestamp = date.getTime()
          personaCSVData[dataIndex][keyId] = timestamp / 1000
        }
        if (isUpdate === true) {
          personaMemberData[keyId] = personaCSVData[dataIndex][keyId]
        } else if (
          isUpdate === false &&
          personaCSVData[dataIndex][keyId] !== ''
        ) {
          personaMemberData[keyId] = personaCSVData[dataIndex][keyId]
        }
      }
      // if (
      //   (notNullKeyIds.includes(keyId) && personaMemberData[keyId] === '') ||
      //   (notNullKeyIds.includes(keyId) && ignoreClassAndSection === true)
      // ) {
      //   delete personaMemberData[keyId]
      // }
    }
    for (
      let settingIndex = 0;
      settingIndex < settingsKeyIds.length;
      settingIndex++
    ) {
      const keyId = settingsKeyIds[settingIndex]
      if (keyId.includes('_country_code')) {
        const numberKey = keyId.slice(0, keyId.indexOf('_country_code'))
        if (
          keyId in personaMemberData &&
          personaMemberData[keyId] !== '' &&
          personaMemberData[numberKey] !== ''
        ) {
          personaMemberData[numberKey] =
            personaMemberData[keyId] + '-' + personaMemberData[numberKey]
        }
        if (keyId in personaMemberData) {
          delete personaMemberData[keyId]
        }
      }
    }
    if (
      'class_ids' in personaCSVData[dataIndex] &&
      personaCSVData[dataIndex]['class_ids'] !== ''
    ) {
      personaMemberData['class_ids'] = processClassIds(
        personaCSVData[dataIndex]['class_ids']
      )
    }
    personaMembersData.push(personaMemberData)
  }
  return personaMembersData
}

const processClassIds = (classIds) => {
  let processedIds = []
  classIds = classIds.split(',')
  processedIds = classIds.map((id) => {
    return id.trim()
  })
  return processedIds
}

const validateCSV = (
  settingsKeyIds,
  CSVHeaders,
  CSVRows,
  instituteType,
  dateSettingsKeyIds
) => {
  const errorObject = {status: false}
  // For checking if the headers have been tampered
  for (let i = 0; i < CSVHeaders.length; i++) {
    if (
      !settingsKeyIds.includes(CSVHeaders[i]) &&
      CSVHeaders[i] !== 'country_code'
    ) {
      if (!(instituteType === 'COLLEGE' && CSVHeaders[i] == 'classroom_ids')) {
        errorObject[
          'msg'
        ] = `Headers are incompatible. Please make sure that headers and rows are in the same pattern as the sample CSV.`
        return errorObject
      }
    }
  }

  // If there are no headers or rows
  if (CSVRows.length === 0 || CSVHeaders.length === 0) {
    errorObject[
      'msg'
    ] = `Data Insufficient. Please make sure that headers and rows are in the same pattern as the sample CSV.`
    return errorObject
  }

  for (let i = 0; i < CSVRows.length; i++) {
    const member = CSVRows[i]
    for (
      let dateSettingIndex = 0;
      dateSettingIndex < dateSettingsKeyIds.length;
      dateSettingIndex++
    ) {
      if (dateSettingsKeyIds[dateSettingIndex] in member) {
        const date = member[dateSettingsKeyIds[dateSettingIndex]]
        if (date !== '' && date !== null) {
          const dateCheck = ddmmyyyyDateChecker(date)
          if (dateCheck?.status === false) {
            if (dateCheck.error === 1) {
              errorObject['msg'] = `Date format invalid. Please use dd/mm/yyyy.`
              return errorObject
            } else if (dateCheck.error === 2) {
              errorObject['msg'] = `Please enter valid dates.`
              return errorObject
            }
          }
        }
      }
    }
  }
}

export {CSVDataToQuery}
