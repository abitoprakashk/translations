import {useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {utilsGetUsersList, utilsUpdateAdmin} from '../../../routes/dashboard'
import {instituteBooksListAction} from '../../../redux/actions/instituteInfoActions'
import {
  showErrorOccuredAction,
  showLoadingAction,
  showToast,
} from '../../../redux/actions/commonAction'
import {validateInputs} from '../../../utils/Validations'
import InputField from '../../Common/InputField/InputField'
import SliderScreen from '../../Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../Common/SliderScreenHeader/SliderScreenHeader'
import {INSTITUTE_MEMBER_TYPE} from '../../../constants/institute.constants'

export default function SliderEditBook({setShowEditSlider, selectedBookCard}) {
  const [errorObject, setErrorObject] = useState({})
  const [isNameUpdated, setIsNameUpdated] = useState(false)
  const {instituteInfo} = useSelector((state) => state)
  const bookDetails = {
    bookName: selectedBookCard?.name,
    isbnNumber: selectedBookCard?.isbn_code,
    bookId: selectedBookCard?._id,
    authors: selectedBookCard?.authors,
  }
  const [bookName, setBookName] = useState(bookDetails?.bookName)
  const [isbnCode, setIsbnCode] = useState(bookDetails?.isbnNumber)
  const [authors, setAuthors] = useState(bookDetails?.authors)
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const close = () => setShowEditSlider(null)

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
    bookInputItems.adminName,
    bookInputItems.phoneNumber,
    bookInputItems.authors,
  ]
  const getInstituteBooks = () => {
    utilsGetUsersList({type: [INSTITUTE_MEMBER_TYPE.ADMIN]})
      .then(({data}) => dispatch(instituteBooksListAction(data)))
      .catch(() => dispatch(showErrorOccuredAction(true)))
  }

  const handleInputChange = (fieldName, value) => {
    switch (fieldName) {
      case 'bookName': {
        if (!isNameUpdated && value !== bookDetails.bookName) {
          setIsNameUpdated(true)
        } else if (value === bookDetails.adminName && isNameUpdated)
          setIsNameUpdated(false)
        if (validateInputs('name', value, false)) setBookName(value)
        break
      }
      case 'isbnCode': {
        if (validateInputs('isbnCode', value, false)) {
          setIsbnCode(value)
        }
        break
      }
      case 'authors': {
        if (validateInputs('name', value, false)) {
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

    // Validate User ID
    if (String(bookDetails.userId).length <= 0 && isNameUpdated) {
      handleSetError('userId', t('required'))
      flag = false
    }

    if (flag && instituteInfo && instituteInfo._id) {
      dispatch(showLoadingAction(true))

      // Send Data to server
      let response = await utilsUpdateAdmin(
        bookDetails._id,
        bookDetails.name,
        bookDetails.isbnNumber,
        instituteInfo._id,
        bookName
      ).catch(() => dispatch(showErrorOccuredAction(true)))

      // Auto Update Admin List
      if (response.status) getInstituteBooks(instituteInfo._id)
      else dispatch(showLoadingAction(false))

      dispatch(showLoadingAction(false))
      if (response.status === true) {
        dispatch(
          showToast({
            type: 'success',
            message: t('bookDataUpdatedSuccessfully'),
          })
        )
        close()
      } else {
        dispatch(
          showToast({
            type: 'error',
            message: t('bookDataCouldNotBeUpdated'),
          })
        )
        close()
      }
      setShowEditSlider(null)
    }
  }
  return (
    <SliderScreen setOpen={() => setShowEditSlider(null)}>
      <>
        <SliderScreenHeader
          icon="https://storage.googleapis.com/tm-assets/icons/primary/students-primary.svg"
          title={t('updateUser')}
        />

        <div className="p-5 lg:p-10 h-4/5 overflow-y-auto">
          <div>
            <div className="">
              <div className="flex flex-wrap mt-6">
                {bookInputItemsList.map(
                  ({
                    fieldType,
                    title,
                    placeholder,
                    fieldName,
                    dropdownItems,
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
                      />
                    </div>
                  )
                )}
              </div>
              {isNameUpdated && (
                <div className="tm-btn2-blue mt-6" onClick={handleFormSubmit}>
                  {t('updateBook')}
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    </SliderScreen>
  )
}
