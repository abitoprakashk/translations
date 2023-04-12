const processDataSettingsKeyIdCSV = (
  personaSettings,
  studentsSourceData,
  update = false
) => {
  const studentsData = []
  for (let i = 0; i < studentsSourceData.length; i++) {
    studentsData.push({...studentsSourceData[i]})
  }
  const {settingsKeyIdLabel, dateSettingKeyIds} =
    sortedSettingsKeyIdLabelMapper(personaSettings, update)
  const processedStudentsData = processStudentsData(
    settingsKeyIdLabel,
    studentsData,
    dateSettingKeyIds
  )
  const {keyIdHeaders, labelHeaders} = getHeaders(settingsKeyIdLabel)
  return getCSVFormat(keyIdHeaders, labelHeaders, processedStudentsData)
}

const sortedSettingsKeyIdLabelMapper = (personaSettings, update) => {
  const profileCategories = []
  const profileCategoryFieldMapper = {}
  const settingsKeyIdLabel = []
  const dateSettingKeyIds = []
  if (update === true) {
    settingsKeyIdLabel.push({_id: 'Id*'})
  }
  for (let i = 0; i < personaSettings.length; i++) {
    const setting = personaSettings[i]
    if (setting.setting_type === 2 && setting.is_active === true) {
      if (setting.field_type === 'DATE') {
        dateSettingKeyIds.push(String(setting.key_id))
      }
      const categoryId = setting.category_id
      if (categoryId in profileCategoryFieldMapper) {
        profileCategoryFieldMapper[categoryId].push(setting)
      } else {
        profileCategoryFieldMapper[categoryId] = [setting]
      }
    }
  }
  for (let i = 0; i < personaSettings.length; i++) {
    const setting = personaSettings[i]
    if (setting.setting_type === 1) {
      const categoryId = String(setting._id)
      setting.fields =
        categoryId in profileCategoryFieldMapper
          ? profileCategoryFieldMapper[categoryId]
          : []
      profileCategories.push(setting)
    }
  }
  profileCategories.sort(function (a, b) {
    const seqA = a.sequence
    const seqB = b.sequence
    if (seqA === undefined || seqB === undefined) {
      return -1
    }
    return seqA - seqB
  })
  profileCategories.forEach((currCategory) => {
    const currSettings = currCategory.fields
    currSettings.sort(function (a, b) {
      const seqA = a.sequence
      const seqB = b.sequence
      if (seqA === undefined || seqB === undefined) {
        return -1
      }
      return seqA - seqB
    })
  })
  profileCategories.forEach((currCategory) => {
    const currSettings = currCategory.fields
    currSettings.forEach((currSetting) => {
      const keyId = currSetting.key_id
      const label = currSetting.label
      const fieldType = currSetting.field_type
      const keyIdLabel = {}
      keyIdLabel[keyId] = label + (currSetting.is_value_mandatory ? '*' : '')
      if (fieldType === 'PHONE_NUMBER') {
        const countryCodeKey = keyId + '_country_code'
        const countryCodeObj = {}
        countryCodeObj[countryCodeKey] = 'Country Code'
        settingsKeyIdLabel.push(countryCodeObj)
      }
      settingsKeyIdLabel.push(keyIdLabel)
    })
  })
  return {settingsKeyIdLabel, dateSettingKeyIds}
}

const processStudentsData = (
  settingskeyIdLabel,
  studentsData,
  dateSettingKeyIds
) => {
  const processedStudentsData = []
  for (let i = 0; i < studentsData.length; i++) {
    const processedStudentData = []
    const studentData = studentsData[i]

    for (
      let settingIndex = 0;
      settingIndex < settingskeyIdLabel.length;
      settingIndex++
    ) {
      const key = Object.keys(settingskeyIdLabel[settingIndex])[0]
      if (key.includes('_country_code')) {
        const numberKey = key.slice(0, key.indexOf('_country_code'))
        if (
          numberKey in studentData &&
          studentData[numberKey] != '' &&
          studentData[numberKey].includes('-')
        ) {
          const numberSplit = studentData[numberKey].split('-')
          studentData[key] = numberSplit[0]
          studentData[numberKey] = numberSplit[1]
        }
      }
    }

    for (
      let settingIndex = 0;
      settingIndex < settingskeyIdLabel.length;
      settingIndex++
    ) {
      const key = Object.keys(settingskeyIdLabel[settingIndex])[0]
      if (key in studentData) {
        if (studentData[key] === null) {
          studentData[key] = ''
        }
        if (dateSettingKeyIds.includes(key) && studentData[key] !== '') {
          let date = studentData[key]
          date = new Date(date * 1000)
          let day = date.getDate()
          day = String(day).length === 1 ? `0${day}` : day
          let month = date.getMonth() + 1
          month = String(month).length === 1 ? `0${month}` : month
          const year = date.getFullYear()
          const formattedDate = day + '/' + month + '/' + year
          studentData[key] = formattedDate
        }
        processedStudentData.push(studentData[key])
      } else {
        processedStudentData.push('')
      }
    }
    processedStudentsData.push(processedStudentData)
  }
  return processedStudentsData
}

const getHeaders = (settingsKeyIdLabel) => {
  const settingsLabel = []
  const settingsKeyId = []
  settingsKeyIdLabel.forEach((element) => {
    const key = Object.keys(element)[0]
    const label = element[key]
    settingsLabel.push(label)
    settingsKeyId.push(key)
  })
  return {keyIdHeaders: settingsKeyId, labelHeaders: settingsLabel}
}

const getCSVFormat = (categoryHeader, settingHeader, studentData) => {
  let CSVObj = [categoryHeader, settingHeader, ...studentData]
  let CSVRows = CSVObj.map((item) => {
    let advanceItems = item.map((element) => {
      if (!element) return ''
      if (typeof element === 'string') return `"${element.replace(/"/g, '""')}"`
      return `"${element}"`
    })
    return advanceItems.join(',')
  })
  return CSVRows.join('\n')
}

export {processDataSettingsKeyIdCSV}
