/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')
const {google} = require('googleapis')
const config = require('./config.json')
const englishTranslations = require('../../../src/i18n/en/en.json')
const {
  flattenTranslations,
  getCurrentDate,
  getLanguageIndices,
  isValidTranslationString,
} = require('./utils')

// Read and write permissions
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
const TRANSLATIONS_FILE_PATH = path.resolve(__dirname, '../../../src/i18n')

const getAuthClient = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.resolve(__dirname, 'service-account-key.json'),
    scopes: SCOPES,
  })

  const client = await auth.getClient()
  return client
}

const syncTranslationStrings = async () => {
  const authClient = await getAuthClient()
  const sheets = google.sheets({version: 'v4', auth: authClient})

  // Read local translation files and update sheet with newly added translation strings
  const newTranslations = await getNewTranslationStrings(sheets)
  await addNewTranslationsToSheet(sheets, newTranslations)

  // Read translations from sheet and update local translation files
  const finalTranslationValues = await readSheetDataInRange(
    sheets,
    `${config.finalSheetName}!A1:Z`
  )

  if (!finalTranslationValues?.length) {
    return
  }

  const [header, ...rows] = finalTranslationValues
  const langIndices = getLanguageIndices(header)

  const allTranslations = {}
  rows.forEach((row) => {
    Object.entries(langIndices).forEach(([lang, index]) => {
      if (!allTranslations[lang]) {
        allTranslations[lang] = {}
      }

      if (isValidTranslationString(row[index])) {
        const keys = row[0].split('.')
        const lastKey = keys.pop()

        let target = allTranslations[lang]
        keys.forEach((key) => {
          target = target[key] || {}
        })

        target[lastKey] = row[index]
      }
    })
  })

  // Retain newly added translation strings
  allTranslations.en = {
    ...(allTranslations.en || {}),
    ...newTranslations,
  }

  updateTranslationFiles(allTranslations)
}

const getNewTranslationStrings = async (sheets) => {
  const sheetTranslationKeys = await readSheetDataInRange(
    sheets,
    `${config.finalSheetName}!A:A`
  )

  if (!sheetTranslationKeys?.length) {
    return {}
  }

  const translationKeys = new Set(
    sheetTranslationKeys.slice(1).map(([key]) => key)
  )

  const newTranslations = {}
  const enTranslations = flattenTranslations(englishTranslations)

  Object.entries(enTranslations).forEach(([key, value]) => {
    if (!translationKeys.has(key)) {
      newTranslations[key] = value
    }
  })

  return newTranslations
}

const addNewTranslationsToSheet = async (sheet, newTranslations) => {
  const numOfNewTranslations = Object.keys(newTranslations).length
  console.log(`Found ${numOfNewTranslations} new translation strings`)

  if (numOfNewTranslations > 0) {
    const currentDate = getCurrentDate()
    const rowsToAdd = Object.entries(newTranslations).map(([key, value]) => [
      currentDate,
      key,
      value,
    ])

    fs.writeFileSync('test.json', JSON.stringify(rowsToAdd))

    await appendToSheet(sheet, `${config.copySheetName}!A:C`, rowsToAdd)
  }
}

const updateTranslationFiles = async (allTranslations) => {
  try {
    for await (const [lang, translations] of Object.entries(allTranslations)) {
      const directoryPath = path.resolve(TRANSLATIONS_FILE_PATH, lang)
      if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, {recursive: true})
      }

      fs.writeFileSync(
        path.resolve(directoryPath, `${lang}.json`),
        JSON.stringify(translations, null, 2)
      )

      console.log(`${lang} - translation file updated`)
    }
  } catch (err) {
    console.log(`Updating translations files failed: ${err}`)
  }
}

const readSheetDataInRange = async (sheet, range) => {
  try {
    const res = await sheet.spreadsheets.values.get({
      spreadsheetId: config.spreadSheetID,
      range,
    })
    return res.data.values
  } catch (err) {
    console.log(`Could not read from sheet: ${range}`)
  }
}

const appendToSheet = async (sheets, range, values) => {
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: config.spreadSheetID,
      range: range,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: values,
      },
    })
    console.log(`${values.length} new rows added`)
  } catch (err) {
    console.log(`Could not append values to sheet: ${err}`)
  }
}

syncTranslationStrings()
