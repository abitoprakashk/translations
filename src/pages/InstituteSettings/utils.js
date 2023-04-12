import {createAndDownloadCSV, JSObjectToCSV} from './../../utils/Helpers'

export const generateErrorCSV = (obj, ignoreRow = false) => {
  if (obj) {
    let errorCSVStr = JSObjectToCSV(
      [
        'Row Number',
        'Error',
        'Field',
        'Label',
        'Uploaded Value',
        'Accepted Values',
      ],
      obj.map((item) => ({
        record: ignoreRow ? '' : Number(item.record_number) + 2,
        error: item?.error_message,
        field: item?.key_id,
        label: item?.label,
        uploadedValue: item?.uploaded_value,
        permissibleValues: item?.permissible_values,
      }))
    )
    createAndDownloadCSV('Error', errorCSVStr)
  }
}
