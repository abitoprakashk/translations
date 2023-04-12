import React from 'react'
import {useTranslation} from 'react-i18next'
import downloadIcon from '../../../assets/images/icons/download-blue.svg'
import crossIcon from '../../../assets/images/icons/cross-bg-gray.svg'
import {ACCEPTED_SHEET_EXTENSIONS} from '../../../utils/fileUtils'

export default function FileField({
  title,
  file,
  setFile,
  downloadSampleCSVFile,
  handleCSVFileChecks,
}) {
  const {t} = useTranslation()
  return (
    <div>
      <div className="flex mb-1 justify-between">
        <div className="tm-para2 tm-color-text-primary">{title}</div>
        <div className="flex items-center cursor-pointer">
          <img src={downloadIcon} alt="download" className="w-4 h-4 mr-2" />

          <div
            className="tm-para2 tm-color-blue"
            onClick={downloadSampleCSVFile}
          >
            {t('downloadSample')}
          </div>
        </div>
      </div>
      <div className="tm-input-field py-0.5 pr-0.5 flex items-center justify-between">
        {file && file.name ? (
          <div className="tm-bg-light-gray px-2 py-0.5 w-40 rounded-3xl h-8 flex items-center justify-between">
            <div className="tm-para3 truncate">{file.name}</div>
            <img
              src={crossIcon}
              alt=""
              className="w-6 h-6 cursor-pointer"
              onClick={() => setFile(null)}
            />
          </div>
        ) : (
          <div className="tm-para2 tm-color-text-primary">
            {t('uploadBulkStudents')}
          </div>
        )}

        <label htmlFor="input-file">
          <div className="tm-btn3-blue">
            {file && file.name ? 'Replace' : 'Upload'}
          </div>
        </label>
        <input
          type="file"
          id="input-file"
          className="hidden"
          accept={ACCEPTED_SHEET_EXTENSIONS}
          onChange={(e) => {
            if (!e.target.files[0]) return 0
            handleCSVFileChecks(e.target.files[0])
            e.target.value = null
          }}
        />
      </div>
    </div>
  )
}
