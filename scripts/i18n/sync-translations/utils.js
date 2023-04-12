const config = require('./config.json')

const getCurrentDate = () => {
  const today = new Date()
  const day = today.getDate().toString().padStart(2, '0')
  const month = (today.getMonth() + 1).toString().padStart(2, '0')
  const year = today.getFullYear().toString()

  return `${day}/${month}/${year}`
}

const isValidTranslationString = (value) =>
  !!value.length && !config.emptyValuePlaceHolders.includes(value)

const getLanguageIndices = (header) => {
  const langIndices = {}
  const languageNameAndCodes = config.languages.reduce((acc, curr) => {
    acc[curr.sheetName || curr.code] = curr.code
    return acc
  }, {})

  header.forEach((item, index) => {
    if (languageNameAndCodes[item]) {
      langIndices[languageNameAndCodes[item]] = index
    }
  })

  return langIndices
}

const flattenTranslations = (translations) => {
  const allTranslations = {}

  Object.entries(translations).forEach(([key, value]) => {
    if (typeof value === 'object') {
      Object.entries(value).forEach(([subKey, subValue]) => {
        allTranslations[`${key}.${subKey}`] = subValue
      })
    } else {
      allTranslations[key] = value
    }
  })

  return allTranslations
}

module.exports = {
  flattenTranslations,
  getCurrentDate,
  getLanguageIndices,
  isValidTranslationString,
}
