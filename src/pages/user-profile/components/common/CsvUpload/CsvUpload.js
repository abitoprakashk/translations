import React from 'react'
import {useDispatch} from 'react-redux'
import CSVUploadCardV1 from '../../../../../components/Common/CSVUploadCardV1/CSVUploadCardV1'
import Or from '../../../../../components/Common/Or/Or'
import {Trans} from 'react-i18next'

import {showLoadingAction} from '../../../../../redux/actions/commonAction'

const CsvUpload = ({
  downloadSampleCSVFile,
  handleCSV,
  userType,
  hasExisting,
}) => {
  const dispatch = useDispatch()
  return (
    <>
      <div>
        <div className="flex justify-between tm-hdg tm-hdg-16">
          <div>
            <Trans i18nKey="bulkUpdate">
              Bulk {hasExisting ? 'Update' : 'Upload'}
            </Trans>
          </div>
          <div
            className="flex items-center cursor-pointer"
            onClick={downloadSampleCSVFile}
          >
            <div className="tm-cr-bl-2">
              <Trans i18nKey="downloadExistingList">
                Download {hasExisting ? 'Existing' : 'Sample'} List
              </Trans>
            </div>
            <img
              src="https://storage.googleapis.com/tm-assets/icons/blue/download-blue.svg"
              alt=""
              className="w-4 h-4 ml-2"
            />
          </div>
        </div>
        <CSVUploadCardV1
          beforeSheetDataLoad={() => dispatch(showLoadingAction(true))}
          onSheetDataLoad={handleCSV}
          userType={userType}
        />
      </div>

      {!hasExisting && <Or />}
    </>
  )
}

export default CsvUpload
