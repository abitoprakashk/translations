import React, {useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {StickyFooter} from '@teachmint/common'
import {Button} from '@teachmint/krayon'
import {
  addBooksCSVValidation,
  mapCsvAddBulkBooksKeys,
  validateBulkAddBooksCSV,
  validateInputs,
} from '../../../utils/Validations'
import {createAndDownloadCSV, JSObjectToCSV} from '../../../utils/Helpers'
import {
  utilsGetBooksList,
  utilsAddBookByData,
  utilsAddBulkBooks,
} from '../../../routes/dashboard'
import {instituteBooksListAction} from '../../../redux/actions/instituteInfoActions'
import {
  showErrorOccuredAction,
  showLoadingAction,
  showToast,
} from '../../../redux/actions/commonAction'
import InputField from '../../Common/InputField/InputField'
import {events} from '../../../utils/EventsConstants'
import CsvUpload from '../../../pages/user-profile/components/common/CsvUpload/CsvUpload'
import {addBooksSampleCSV} from '../../../utils/SampleCSVRows'
import {userTypeLabel} from './SliderAddBook.utils'
import ConfirmationPopup from '../../Common/ConfirmationPopup/ConfirmationPopup'
import AcknowledgementPopup from '../../Common/AcknowledgementPopup/AcknowledgementPopup'
import styles from './SliderAddBook.module.css'

export function SliderAddBook({callback = () => {}, setSliderScreen}) {
  const [bookName, setBookName] = useState('')
  const [isbnCode, setIsbnCode] = useState('')
  const [authors, setAuthors] = useState('')
  const [errorObject, setErrorObject] = useState({})
  const {instituteInfo, currentAdminInfo, eventManager} = useSelector(
    (state) => state
  )
  const [showPopup, setShowPopup] = useState(false)
  const [validationBookObject, setValidationBookObject] = useState({})
  const removeBgRed =
    'https://storage.googleapis.com/tm-assets/icons/colorful/remove-bg-red.svg'
  const tickBgGreen =
    'https://storage.googleapis.com/tm-assets/icons/colorful/tick-bg-green.svg'
  // const {roles, roles_to_assign} = currentAdminInfo

  const dispatch = useDispatch()
  const {t} = useTranslation()
  const close = () => setSliderScreen(null)

  const bookInputItems = {
    bookName: {
      fieldType: 'text',
      title: t('bookName'),
      value: bookName,
      placeholder: t('bookNamePlaceholder'),
      fieldName: 'bookName',
    },
    isbnCode: {
      fieldType: 'text',
      title: t('isbnCode'),
      value: isbnCode,
      placeholder: t('isbnCodePlaceholder'),
      fieldName: 'isbnCode',
    },
    authors: {
      fieldType: 'text',
      title: t('authors'),
      value: authors,
      placeholder: t('authorsPlaceholder'),
      fieldName: 'authors',
    },
  }

  const bookInputItemsList = [
    bookInputItems.bookName,
    bookInputItems.isbnCode,
    bookInputItems.authors,
  ]
  const getInstituteBooks = () => {
    utilsGetBooksList()
      .then(({data}) => dispatch(instituteBooksListAction(data)))
      .catch(() => dispatch(showErrorOccuredAction(true)))
  }

  const handleInputChange = (fieldName, value) => {
    switch (fieldName) {
      case 'bookName': {
        if (validateInputs('address', value, false)) {
          setBookName(value)
        }
        break
      }
      case 'isbnCode': {
        if (validateInputs('isbnCode', value, false)) {
          setIsbnCode(value)
        }
        break
      }
      case 'authors': {
        if (validateInputs('address', value, false)) {
          setAuthors(value)
        }
        break
      }

      default:
        break
    }
  }

  const handleSetError = (fieldName, error) => {
    let obj = {}
    obj[fieldName] = error
    setErrorObject((errorObject) => ({...errorObject, ...obj}))
  }

  const handleFormSubmit = async () => {
    setErrorObject({})
    let flag = true

    // Validate User Name
    if (
      String(bookName).length <= 0 ||
      !validateInputs('bookName', bookName, true)
    ) {
      handleSetError('bookName', t('required'))
      flag = false
    }

    // Validate Country Code
    if (
      String(isbnCode).length <= 0 ||
      !validateInputs('isbnCode', isbnCode, true)
    ) {
      handleSetError('isbnCode', t('incorrect'))
      flag = false
    }

    if (authors.length <= 0) {
      handleSetError('authors', t('required'))
      flag = false
    }

    if (flag && instituteInfo && instituteInfo._id) {
      dispatch(showLoadingAction(true))

      // Send Data to server
      let response = await utilsAddBookByData(
        instituteInfo._id,
        bookName,
        isbnCode,
        authors
      ).catch(() => dispatch(showErrorOccuredAction(true)))

      // Auto Update Admin List
      if (response.status) getInstituteBooks()
      else dispatch(showLoadingAction(false))

      dispatch(showLoadingAction(false))
      if (response.status === true) {
        eventManager.send_event(events.BOOK_ADDED_TFI, {
          name: bookName,
          ISBN_no: isbnCode,
          author_name: authors,
        })
        dispatch(
          showToast({
            type: 'success',
            message: t('bookAddedSuccessfully'),
          })
        )
        close()
      } else {
        dispatch(
          showToast({
            type: 'error',
            message: t('bookCannotBeAdded'),
          })
        )
        close()
      }
      setSliderScreen(false)
    }
  }

  // Bulk uploads books
  const userTypeName = userTypeLabel(currentAdminInfo?.type)

  const handleCSV = async (check, processedCSVObject) => {
    if (!processedCSVObject) {
      dispatch(showToast({type: 'error', message: t('fileTypeNotSupported')}))
      return
    }
    let validationGetObject = validateBulkAddBooksCSV(processedCSVObject)
    if (validationGetObject.status && instituteInfo && instituteInfo._id) {
      let response = await utilsAddBulkBooks(
        mapCsvAddBulkBooksKeys(processedCSVObject, instituteInfo?._id)
      ).catch(() => dispatch(showErrorOccuredAction(true)))

      validationGetObject = {
        ...validationGetObject,
        msg: response.msg,
        status: response.status,
      }
      if (response.status) {
        dispatch(
          showToast({
            type: 'success',
            message: t('bulkBooksAddedSuccessfully'),
          })
        )
        eventManager.send_event(events.UPLOAD_BULK_BOOKS_CLICKED_TFI, {
          screen_name: 'add_book_slider',
        })
      } else {
        dispatch(
          showToast({
            type: 'error',
            message: t('bulkBooksAddedFailed'),
          })
        )
      }
    }
    getInstituteBooks()
    dispatch(showLoadingAction(false))
    setValidationBookObject({
      ...validationGetObject,
      processedCSV: processedCSVObject,
    })
    setShowPopup(true)
  }
  const handleConfirmPopup = () => {
    setShowPopup(false)
    callback()
    close()
  }

  const downloadErrorCSVFile = () => {
    if (validationBookObject && validationBookObject.obj) {
      let processedCSV = validationBookObject.processedCSV
      let errorCSVStr = JSObjectToCSV(
        [...processedCSV.headers, 'Errors'],
        validationBookObject.obj
      )
      createAndDownloadCSV('Error', errorCSVStr)
    }
  }

  const downloadSampleCSVFile = () => {
    eventManager.send_event(
      events.DOWNLOAD_BULK_ADD_BOOKS_SAMPLE_FORMAT_CLICKED,
      {screen_name: 'add_book_slider'}
    )
    createAndDownloadCSV(
      'Bulk-Add-Books-Sample',
      JSObjectToCSV(
        Object.keys(addBooksCSVValidation.addBooks),
        addBooksSampleCSV.addBooks
      )
    )
  }

  return (
    <div>
      <div className={styles.addBookBulkUploadMainPart}>
        {showPopup && validationBookObject ? (
          validationBookObject.obj ? (
            <ConfirmationPopup
              onClose={setShowPopup}
              onAction={downloadErrorCSVFile}
              icon={removeBgRed}
              title="Failure"
              desc={'Data in CSV is invalid'}
              primaryBtnText={t('cancel')}
              secondaryBtnText={t('download')}
            />
          ) : (
            <AcknowledgementPopup
              onClose={setShowPopup}
              onAction={() => handleConfirmPopup()}
              icon={validationBookObject.status ? tickBgGreen : removeBgRed}
              title={validationBookObject.status ? t('success') : t('failure')}
              desc={validationBookObject.msg}
              primaryBtnText={t('confirm')}
            />
          )
        ) : null}
        <CsvUpload
          handleCSV={handleCSV}
          downloadSampleCSVFile={downloadSampleCSVFile}
          userType={userTypeName}
        />
      </div>
      <div>
        <div className="flex flex-wrap mt-1">
          {bookInputItemsList.map(
            ({
              fieldType,
              title,
              placeholder,
              fieldName,
              dropdownItems,
              event,
            }) => (
              <div className="w-full mb-2" key={fieldName}>
                <InputField
                  fieldType={fieldType}
                  title={title}
                  placeholder={placeholder}
                  value={bookInputItems[fieldName].value}
                  handleChange={handleInputChange}
                  fieldName={fieldName}
                  dropdownItems={dropdownItems}
                  errorText={errorObject[fieldName]}
                  eventName={event}
                />
              </div>
            )
          )}
        </div>
        <StickyFooter forSlider>
          <div className={styles.sliderFooter}>
            <Button onClick={handleFormSubmit}>{t('addBook')}</Button>
          </div>
        </StickyFooter>
      </div>
    </div>
  )
}
