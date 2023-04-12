import {CSVtoJSObject} from './Helpers'
import produce from 'immer'
import {DateTime} from 'luxon'
import Compressor from 'compressorjs'

export const SUPPORTED_SHEET_FORMATS = ['csv', 'xls', 'xlsx']

export const ACCEPTED_SHEET_EXTENSIONS = SUPPORTED_SHEET_FORMATS.map(
  (ext) => `.${ext}`
).join(', ')

export const SUPPORTED_SHEET_FORMATS_SET = new Set(SUPPORTED_SHEET_FORMATS)

export const handleSheetUpload = async (
  sheetFile,
  beforeSheetDataLoad,
  onSheetDataLoad,
  onlyText
) => {
  const {read: XLSXRead, utils: XLSXUtils} = await import(
    /* webpackPrefetch: true, webpackChunkName: "xlsx" */ 'xlsx'
  )
  const readCSV = (stringText) =>
    XLSXRead(stringText, {
      type: 'string',
      raw: true,
    })

  const readExcel = (binaryStringText) =>
    XLSXRead(binaryStringText, {
      type: 'binary',
      raw: true,
      cellDates: true,
    })

  const getCSVTextData = (workSheet) =>
    XLSXUtils.sheet_to_csv(workSheet, {
      blankrows: false,
      raw: false,
    }).trim()

  const getExcelToCSVTextData = (workSheet) =>
    XLSXUtils.sheet_to_csv(workSheet, {
      blankrows: false,
      rawNumbers: true,
      raw: false,
    }).trim()

  const XSLX_READ_MODE_MAP = {
    csv: readCSV,
    xls: readExcel,
    xlsx: readExcel,
  }

  const CSV_TEXT_GENERATORS_MAP = {
    csv: getCSVTextData,
    xls: getExcelToCSVTextData,
    xlsx: getExcelToCSVTextData,
  }

  const FILE_READER_MODE_MAP = {
    csv: 'readAsText',
    xls: 'readAsBinaryString',
    xlsx: 'readAsBinaryString',
  }

  const fileExt = sheetFile.name.split('.').pop()
  if (!SUPPORTED_SHEET_FORMATS_SET.has(fileExt)) {
    onSheetDataLoad()
    return
  }

  beforeSheetDataLoad && beforeSheetDataLoad(sheetFile)

  const reader = new FileReader()
  reader.onload = (e) => {
    const data = e.target.result
    const wb = XSLX_READ_MODE_MAP[fileExt](data)

    /* Get first worksheet */
    const firstWorksheetName = wb.SheetNames[0]
    const workSheet = wb.Sheets[firstWorksheetName]

    /* Get data in csv text format */
    const csvTextData = CSV_TEXT_GENERATORS_MAP[fileExt](workSheet)

    if (onlyText) {
      onSheetDataLoad(true, csvTextData)
    } else {
      let processedCSVObject = CSVtoJSObject(csvTextData)
      onSheetDataLoad(true, processedCSVObject)
    }
  }
  reader[FILE_READER_MODE_MAP[fileExt]](sheetFile)
}

export const formatProcessedCSVMemberData = (
  processedCSVObject,
  fields,
  ignoreClassAndSection
) =>
  produce(processedCSVObject, (draft) => {
    draft.rows.forEach((student) => {
      fields.forEach((field) => {
        if (field === 'Date of Admission*') {
          student[field] = DateTime.fromFormat(
            student[field],
            'd/M/yyyy'
          ).toSeconds()
        } else {
          student[field] = student[field]
            ? DateTime.fromFormat(student[field], 'd/M/yyyy').toFormat(
                'dd/MM/yyyy'
              )
            : student[field]
        }
      })
      if (ignoreClassAndSection) {
        student['Class'] = ''
        student['Section'] = ''
      }
    })
  })

export const downloadFromLink = (url, name) => {
  var link = document.createElement('a')
  link.href = url
  link.download = `${name}`.replaceAll(' ', '')
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
}

const ICON_WIDTH = 50
const MIN_SIZE_REQUIRED_TO_COMPRESS = 400000
const IMAGE_COMPRESSED_QUALITY = 0.3

export const imageCompressedToIcon = (image, success, error) => {
  new Compressor(image, {
    width: ICON_WIDTH,
    success,
    error,
  })
}

export const imageCompressor = (options, success, error) => {
  if (options.image.size <= MIN_SIZE_REQUIRED_TO_COMPRESS) {
    success(options.image)
    return
  }
  new Compressor(options.image, {
    quality: options.compressedImageQuality || IMAGE_COMPRESSED_QUALITY,
    success,
    error,
  })
}
