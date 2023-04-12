import React, {useEffect, useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import SearchBox from '../../Common/SearchBox/SearchBox'
import bookImage from '../../../assets/images/common/book-image.png'
import {utilsDeleteBook, utilsGetBooksList} from '../../../routes/dashboard'
import {instituteBooksListAction} from '../../../redux/actions/instituteInfoActions'
import {
  showErrorOccuredAction,
  showToast,
} from '../../../redux/actions/commonAction'
import {getDateFromTimeStamp} from '../../../utils/Helpers'
import Table from '../../Common/Table/Table'
import SliderAddBookList from './SliderAddBookList'
import NormalCard from '../../Common/NormalCard/NormalCard'
import RadioInput from '../../Common/RadioInput/RadioInput'
import '../LibraryManagement/LibraryPage.css'
import AssignSlider from './SliderAssignBook'
import DropdownField from '../../Common/DropdownField/DropdownField'
import {events} from '../../../utils/EventsConstants'
import BookProfile from './BookProfile'
import {utilsAssignBook} from '../../../routes/dashboard'
import {showLoadingAction} from '../../../redux/actions/commonAction'
import menuIcon from '../../../assets/images/icons/three-dot-menu.svg'
import hoverMenuIcon from '../../../assets/images/icons/three-dot-menu-hover.svg'
import AdminOptionMenu from '../../AdminPage/AdminOptionMenu'
import ConfirmationPopup from '../../Common/ConfirmationPopup/ConfirmationPopup'
import {t} from 'i18next'
import {searchBoxFilter} from '../../../utils/Helpers'
import Permission from '../../Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../utils/permission.constants'
import {Button} from '@teachmint/common'

export default function LibraryPage() {
  const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false)
  const [sourceList, setSourceList] = useState([])
  const [userType, setUserType] = useState(0)

  const [showMenu, setShowMenu] = useState(false)
  const {instituteBooksList, instituteInfo, eventManager} = useSelector(
    (state) => state
  )
  const [assignBookSlider, setAssignBookSlider] = useState(null)
  const [bookId, setBookId] = useState('')
  const [sliderScreen, setSliderScreen] = useState(null)

  const dispatch = useDispatch()
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    getInstituteBooks()
  }, [instituteInfo])
  useEffect(() => {
    setSourceList(instituteBooksList)
  }, [instituteBooksList])

  const filterdSourceList =
    userType != 0
      ? userType == 1
        ? sourceList.filter((book) => book.iids.length > 0)
        : sourceList.filter((book) => book.iids.length == 0)
      : sourceList
  let searchParams = [['name']]
  const resultvar = searchBoxFilter(searchText, filterdSourceList, searchParams)

  const joinedUsers = sourceList?.filter(({iids}) => iids.length > 0)
  const pendingUsers = sourceList?.filter(({iids}) => iids.length == 0)

  const userTypeOptions = [
    {key: 0, value: `${t('strUserTypeOptionsAll')} ${sourceList?.length || 0}`},
    {
      key: 1,
      value: `${t('strUserTypeOptionsAssigned')} ${joinedUsers?.length || 0}`,
    },
    {
      key: 2,
      value: `${t('strUserTypeOptionsAvailable')} ${pendingUsers?.length || 0}`,
    },
  ]

  const getInstituteBooks = (instituteId) => {
    utilsGetBooksList(instituteId)
      .then(({data}) => dispatch(instituteBooksListAction(data)))
      .catch(() => dispatch(showErrorOccuredAction(true)))
  }

  const onAddAdminClick = () => {
    eventManager.send_event(events.ADD_BOOK_CLICKED_TFI)
    setSliderScreen(true)
  }

  window.addEventListener('click', () => {
    if (showMenu) setShowMenu(false)
  })

  const cols = [
    {key: 'book_details', label: t('BOOK_DETAILS')},
    {key: 'assigned_date', label: t('ASSIGNED_ON')},
    {key: 'user', label: t('ASSIGNED_TO')},
    {key: 'assign', label: t('ASSIGN_RETURN')},
    {key: 'delete', label: ''},
  ]

  const mobile_cols = [
    {key: 'book_details', label: t('BOOK_DETAILS')},
    {key: 'user', label: t('ASSIGNED_TO')},
  ]

  useEffect(() => {
    if (bookId.active == false) {
      utilsAssignBook(bookId.book_id, bookId.iid, bookId.active).then(
        (response) => {
          if (response.status) getInstituteBooks()
          else dispatch(showLoadingAction(false))

          dispatch(showLoadingAction(false))
          if (response.status === true) {
            const selectedBook = instituteBooksList.find(
              (book) => book?._id === bookId?.book_id
            )
            eventManager.send_event(events.BOOK_STATUS_UPDATED_TFI, {
              status: 'return',
              ISBN_no: selectedBook?.isbn_code,
            })
            dispatch(
              showToast({
                type: 'success',
                message: t('bookStatusUpdatedSuccessfully'),
              })
            )
          } else {
            dispatch(
              showToast({
                type: 'error',
                message: t('bookStatusUpdationFailed'),
              })
            )
          }
        }
      )
    }
  }, [bookId])

  const handleBookDeletion = async () => {
    if (bookId) {
      const selectedBook = instituteBooksList.find(
        (book) => book?._id === bookId?._id
      )
      const response = await utilsDeleteBook(bookId._id)
      getInstituteBooks()
      setShowConfirmationPopUp(false)
      if (response.status === true) {
        eventManager.send_event(events.BOOK_REMOVED_TFI, {
          ISBN_no: selectedBook?.isbn_code,
        })
        dispatch(
          showToast({
            type: 'success',
            message: t('bookDeletedSuccessfully'),
          })
        )
      } else {
        dispatch(
          showToast({
            type: 'error',
            message: t('failedToDeleteThisBook'),
          })
        )
      }
    }
  }

  const getRows = (books) => {
    let rows = []
    books?.forEach((item) => {
      rows.push({
        id: item._id,
        book_details: (
          <BookProfile
            image={bookImage}
            name={<span className="tm-cr-bl-2">{item.name}</span>}
            isbnNumber={item.author}
          />
        ),
        assigned_date:
          item?.relations.length > 0 ? (
            <div className="mt-3 tm-color-text-primary tm-para-16">
              {getDateFromTimeStamp(item?.relations[0]?.c)}
            </div>
          ) : (
            <div className="mt-3 tm-color-text-primary tm-para-14">{'NA'}</div>
          ),
        user:
          item?.iids?.length > 0 ? (
            <div>
              <BookProfile
                name={
                  <span className="tm-cr-bl-2">
                    {item?.iids[0]?.fields?.name}
                  </span>
                }
                isbnNumber={item?.iids[0]?.phone_number}
              />
            </div>
          ) : (
            <div className="mt-3 tm-color-text-primary tm-para-14">
              {'Unassigned'}
            </div>
          ),
        assign: (
          <>
            <Permission
              permissionId={
                PERMISSION_CONSTANTS.bookController_associate_update
              }
            >
              <AssignBook
                data={item}
                key={item.user_id}
                setSelectedAdminCard={setBookId}
                setEditSlider={setAssignBookSlider}
              />
            </Permission>
          </>
        ),
        delete: (
          <DeleteBook
            data={item}
            selectedAdminCard={bookId}
            setSelectedAdminCard={setBookId}
            setShowConfirmationPopUp={() => setShowConfirmationPopUp(true)}
            showMenu={showMenu}
            setShowMenu={setShowMenu}
          />
        ),
      })
    })
    return rows
  }

  return (
    <div className="p-5">
      <div className="tm-hdg tm-hdg-24 mb-4">{t('library')}</div>

      {instituteBooksList?.length >= 0 ? (
        <NormalCard>
          <div className="flex flex-wrap justify-between items-center">
            <div
              className="w-full"
              onClick={(e) => {
                e.stopPropagation()
                showMenu && setShowMenu(false)
              }}
            >
              {sliderScreen && (
                <SliderAddBookList setSliderScreen={setSliderScreen} />
              )}

              {showConfirmationPopUp && (
                <ConfirmationPopup
                  onClose={() => {
                    eventManager.send_event(
                      events.REMOVE_BOOK_POPUP_CLICKED_TFI,
                      {action: 'cancel'}
                    )
                    setShowConfirmationPopUp()
                  }}
                  onAction={() => {
                    eventManager.send_event(
                      events.REMOVE_BOOK_POPUP_CLICKED_TFI,
                      {action: 'confirm'}
                    )
                    handleBookDeletion()
                  }}
                  icon={
                    'https://storage.googleapis.com/tm-assets/icons/colorful/remove-bg-red.svg'
                  }
                  title={t('bookRemoveConfirmationPopupTitle')}
                  desc={<div>{t('bookRemoveConfirmationPopupDesc')}</div>}
                  primaryBtnText={t('cancel')}
                  secondaryBtnText={t('delete')}
                  secondaryBtnStyle="tm-btn2-red"
                />
              )}

              {assignBookSlider && (
                <AssignSlider
                  book_id={bookId}
                  getInstituteBooks={getInstituteBooks}
                  dispatch={dispatch}
                  setAssignBookSlider={setAssignBookSlider}
                />
              )}

              <div className="flex flex-wrap justify-between items-center p-4">
                <div className="w-full lg:w-96">
                  <SearchBox
                    value={searchText}
                    placeholder={t('searchForBooks')}
                    handleSearchFilter={(text) => setSearchText(text)}
                  />
                </div>

                <div className="mt-3 lg:mt-0">
                  <Permission
                    permissionId={
                      PERMISSION_CONSTANTS.bookController_createRoute_create
                    }
                  >
                    <Button onClick={onAddAdminClick}>{t('addBook')}</Button>
                  </Permission>
                </div>
              </div>

              <div className="hidden lg:block pl-4 pb-4">
                <RadioInput
                  value={userType}
                  fieldName="userType"
                  handleChange={(_, value) => setUserType(value)}
                  dropdownItems={userTypeOptions}
                />
              </div>
              <div className="px-4 pb-2 lg:hidden">
                <DropdownField
                  value={userType}
                  fieldName="teacherType"
                  handleChange={(_, value) => setUserType(parseInt(value))}
                  dropdownItems={userTypeOptions}
                />
              </div>

              <div className="hidden lg:block">
                <Table cols={cols} rows={getRows(resultvar)} className="m-0" />
              </div>
              <div className="lg:hidden">
                <Table
                  rows={getRows(resultvar)}
                  cols={mobile_cols}
                  className="m-0"
                />
              </div>
            </div>
          </div>
        </NormalCard>
      ) : null}
    </div>
  )
}

function AssignBook({data, setSelectedAdminCard, setEditSlider}) {
  const {eventManager} = useSelector((state) => state)
  const [showReturnConfirmationModal, setShowReturnConfirmationModal] =
    useState(false)

  const responseAssign = {
    book_id: data?._id,
  }

  const responseReturn = {
    book_id: data?._id,
    iid: data?.iids[0]?._id,
    active: false,
  }

  const handleAdminCardSelection = () => {
    if (data?.iids.length > 0) {
      setShowReturnConfirmationModal(true)
    } else {
      eventManager.send_event(events.ASSIGN_BOOK_CLICKED_TFI, {
        ISBN_no: data?.isbn_code,
      })
      setSelectedAdminCard(responseAssign)
      setEditSlider(true)
    }
  }

  const handleReturnBook = () => {
    eventManager.send_event(events.RETURN_BOOK_CLICKED_TFI, {
      ISBN_no: data?.isbn_code,
    })
    setSelectedAdminCard(responseReturn)
    setShowReturnConfirmationModal(false)
  }

  return (
    <div className="flex flex-row">
      <div className="relative inset-y-0 right-0">
        <div
          className="w-full lg:w-min text-right tm-hdg-12 lg:tm-hdg-14 cursor-pointer tm-cr-bl-2 mt-4 lg:mt-0"
          onClick={handleAdminCardSelection}
        >
          {data?.iids.length > 0 ? t('return') : t('assign')}
        </div>
      </div>
      {showReturnConfirmationModal && (
        <ConfirmationPopup
          onClose={setShowReturnConfirmationModal}
          onAction={handleReturnBook}
          title={t('returnConfirmationModalTitle')}
          desc={t('returnConfirmationModalBody')}
          primaryBtnText={t('cancel')}
          secondaryBtnText={t('return')}
          icon="https://storage.googleapis.com/tm-assets/icons/colorful/tick-bg-green.svg"
        />
      )}
    </div>
  )
}

function DeleteBook({
  data,
  selectedAdminCard,
  setSelectedAdminCard,
  setShowConfirmationPopUp,
  showMenu,
  setShowMenu,
}) {
  const {eventManager} = useSelector((state) => state)
  const [hoverOnMenu, setHoverOnMenu] = useState(false)
  const {_id} = data

  const handleAdminCardSelection = () => {
    setSelectedAdminCard(data)
    setShowMenu(true)
  }

  const activeMenusList = [
    {
      menu: t('delete'),
      data: (
        <Permission
          permissionId={PERMISSION_CONSTANTS.bookController_deleteRoute_delete}
        >
          <div className="text-red">{t('delete')}</div>
        </Permission>
      ),
      onClickHandler: (...args) => {
        eventManager.send_event(events.REMOVE_CLICKED_TFI, {
          ISBN_no: data?.isbn_code,
        })
        setShowConfirmationPopUp(...args)
      },
    },
  ]

  return (
    <div className="flex flex-row">
      <div className="relative inset-y-0 right-0">
        <img
          className="cursor-pointer menu-icon"
          onMouseEnter={() => setHoverOnMenu(true)}
          onMouseLeave={() => setHoverOnMenu(false)}
          src={hoverOnMenu ? hoverMenuIcon : menuIcon}
          onClick={handleAdminCardSelection}
        />
        {showMenu && _id === selectedAdminCard._id && (
          <div className="absolute top-0 right-0">
            <AdminOptionMenu
              menusList={activeMenusList}
              onClose={setShowMenu}
            />
          </div>
        )}
      </div>
    </div>
  )
}
