const processDataSettingsCSV = (personaSettings, studentData) => {
  const {orderedSettings, categoryFieldLengths} =
    processSettingsData(personaSettings)
  const studentProccessedData = studentDataProcess(orderedSettings, studentData)
  const {categoryHeader, settingsHeader} = getHeaders(
    categoryFieldLengths,
    orderedSettings
  )
  return getCSVFormat(categoryHeader, settingsHeader, studentProccessedData)
}

const processSettingsData = (personaSettings) => {
  const categoryIdLabelMapper = []
  const categoryFieldMapper = {}
  const categoryFieldLengths = []
  let orderedSettings = []
  for (let i = 0; i < personaSettings.length; i++) {
    if (personaSettings[i].setting_type === 1) {
      let categoryKeyIdLabel = {}
      categoryKeyIdLabel[String(personaSettings[i]._id)] =
        personaSettings[i].label
      categoryIdLabelMapper.push(categoryKeyIdLabel)
      categoryFieldMapper[String(personaSettings[i]._id)] = []
    }
  }
  for (let i = 0; i < personaSettings.length; i++) {
    if (
      'category_id' in personaSettings[i] &&
      personaSettings[i]['category_id'] in categoryFieldMapper
    ) {
      let settingKeyId = personaSettings[i].key_id
      let label = personaSettings[i].label
      if (personaSettings[i].is_value_mandatory === true) {
        label += '*'
      }
      let settingKeyIdLabel = {}
      settingKeyIdLabel[settingKeyId] = label
      categoryFieldMapper[personaSettings[i]['category_id']].push(
        settingKeyIdLabel
      )
    }
  }
  for (let i = 0; i < categoryIdLabelMapper.length; i++) {
    let keyId = Object.keys(categoryIdLabelMapper[i])[0]
    let label = categoryIdLabelMapper[i][keyId]
    let categoryFieldLength = {}
    categoryFieldLength[label] = categoryFieldMapper[keyId].length
    categoryFieldLengths.push(categoryFieldLength)
    orderedSettings = orderedSettings.concat(categoryFieldMapper[keyId])
  }

  return {
    categoryFieldLengths: categoryFieldLengths,
    orderedSettings: orderedSettings,
  }
}

const studentDataProcess = (orderedSettings, studentsData) => {
  const processedData = []
  for (let i = 0; i < studentsData.length; i++) {
    let studentData = []
    for (
      let settingIndex = 0;
      settingIndex < orderedSettings.length;
      settingIndex++
    ) {
      let keyId = Object.keys(orderedSettings[settingIndex])[0]
      if (keyId in studentsData[i]) {
        studentData.push(studentsData[i][keyId])
      } else {
        studentData.push('')
      }
    }
    processedData.push(studentData)
  }
  return processedData
}

const getHeaders = (categoryFieldLengths, orderedSettings) => {
  const settingHeaders = orderedSettings.map((setting) => {
    let label = Object.values(setting)[0]
    return label
  })
  let categoryHeaders = []
  categoryFieldLengths.map((category) => {
    const label = Object.keys(category)[0]
    const size = category[label]
    let header = new Array(size).fill('')
    header[0] = label
    if (size < 1) {
      header = []
    }
    categoryHeaders = categoryHeaders.concat(header)
  })
  return {categoryHeaders: categoryHeaders, settingHeaders: settingHeaders}
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

export {processDataSettingsCSV}
