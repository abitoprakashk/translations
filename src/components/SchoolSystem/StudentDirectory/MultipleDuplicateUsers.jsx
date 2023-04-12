import React, {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import styles from './MultipleDuplicateUsers.module.scss'
import rightArrow from '../../../assets/images/icons/green-right.svg'
import SliderScreen from '../../Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../Common/SliderScreenHeader/SliderScreenHeader'
import {Table, Button} from '@teachmint/common'
import {events} from '../../../utils/EventsConstants'
import ConfirmationPopup from '../../Common/ConfirmationPopup/ConfirmationPopup'
import {
  duplicateStudentListAction,
  duplicateTeacherListAction,
} from '../../../redux/actions/instituteInfoActions'
import {Trans, useTranslation} from 'react-i18next'
import classNames from 'classnames'
import RemainingStudentsBanner from '../SectionDetails/RemainingStudentsBanner'
import {utilsGetSubscriptionData} from '../../../routes/dashboard'
import {dummySubscriptionData} from '../../../utils/DummyStats'

export default function MultipleDuplicateUsers({
  cols,
  rows,
  users,
  items,
  setSliderScreen,
  handleAddDuplicateUsers,
  instituteID = null,
}) {
  const [selectedUsers, setSelectedUsers] = useState(new Set([]))
  const {eventManager} = useSelector((state) => state)
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(null)
  const [subscriptionData, setSubscriptionData] = useState(
    dummySubscriptionData
  )

  const dispatch = useDispatch()
  const {t} = useTranslation()

  useEffect(() => {
    getSubscriptionData()
  }, [])

  const handleRowSelect = (rowId, checked) => {
    const newSet = new Set(selectedUsers) //shallow cloned the Set object
    checked ? newSet.add(rowId) : newSet.delete(rowId)
    setSelectedUsers(newSet)
  }

  const handleSelectAll = (checked) => {
    const newSet = new Set(
      checked ? items?.existing_users?.map((r) => r.phone_number) : []
    )
    setSelectedUsers(newSet)
  }

  const selectedUsersData = items.existing_users.filter((user) => {
    if (selectedUsers?.has(user.phone_number)) return user
  })

  function getSubscriptionData() {
    if (subscriptionData?.obj?.subscription_type === 0) {
      utilsGetSubscriptionData(instituteID).then(({data}) => {
        if (data.obj.subscription_type === 1)
          data.obj.lms_order_form_students = 10
        setSubscriptionData(data)
      })
    }
  }

  const canAddMore =
    parseInt(subscriptionData.obj.lms_order_form_students) -
    parseInt(subscriptionData.obj.institute_signin_student)
  return (
    <>
      {showConfirmationPopup && (
        <ConfirmationPopup
          onClose={() => setShowConfirmationPopup(false)}
          onAction={() => {
            dispatch(duplicateTeacherListAction([]))
            dispatch(duplicateStudentListAction({}))
            setSliderScreen(false)
          }}
          icon={
            'https://storage.googleapis.com/tm-assets/icons/colorful/remove-bg-red.svg'
          }
          title={t('mUsersConfirmationPopupTitle')}
          primaryBtnText={t('cancel')}
          secondaryBtnText={t('exit')}
        />
      )}
      <SliderScreen
        setOpen={() => setShowConfirmationPopup(true)}
        width={'840'}
      >
        <div className={styles.wrapper}>
          <SliderScreenHeader
            icon="https://storage.googleapis.com/tm-assets/icons/primary/students-primary.svg"
            title={<Trans i18nKey="addDyUsers">Add {{users}}</Trans>}
          />
          <>
            {users === 'Students' && (
              <RemainingStudentsBanner content={subscriptionData} />
            )}
            <div className={styles.mainContainer}>
              <img
                className="lg:w-20 lg:h-20 md:w-11 md:h-11 mr-2 ml-3 cover rounded-full mt-6 mb-6 sm:w-11 sm:w-11"
                src={rightArrow}
              ></img>
              <p className={styles.heading}>
                <Trans i18nKey="multipleUsersSuccessfullyAdded">
                  {`${items?.new_users?.length} ${
                    items?.new_users?.length === 1
                      ? users.substring(0, users.length - 1)
                      : users
                  }`}
                </Trans>
              </p>
              <div className={styles.topContainer}>
                <div className={styles.warningBox}>
                  <p className={styles.warningText}>
                    <Trans i18nKey="duplicateEntriesHaveDesc">
                      {`${items?.existing_users?.length}`} duplicate entries
                      have been skipped. To make edits please go to respective
                      user profiles.
                    </Trans>
                  </p>
                </div>
                <div className={styles.tableContainer}>
                  <Table
                    className={styles.table}
                    autoSize
                    selectable={true}
                    stickyHeader={true}
                    rows={rows}
                    cols={cols}
                    selectedRows={selectedUsers}
                    onSelectRow={handleRowSelect}
                    onSelectAll={handleSelectAll}
                    uniqueKey="id"
                  />
                </div>
              </div>
            </div>
          </>
          <div className={styles.footer}>
            <Button
              className={classNames(styles.higherSpecificity, styles.button)}
              onClick={() => {
                eventManager.send_event(
                  events[`IGNORE_${users.toUpperCase()}_CLICKED_TFI`]
                )
                dispatch(duplicateTeacherListAction([]))
                dispatch(duplicateStudentListAction({}))
                setSliderScreen(false)
              }}
            >
              {t('ignore')}
            </Button>
            <Button
              className={classNames(styles.higherSpecificity, {
                [styles.button2]: selectedUsersData.length > 0,
                [styles.disabledButton2]:
                  selectedUsersData.length <= 0 ||
                  selectedUsersData.length > canAddMore,
              })}
              disabled={
                users === 'Students' &&
                (selectedUsersData.length == 0 ||
                  selectedUsersData.length > canAddMore)
                  ? true
                  : false
              }
              onClick={() => {
                eventManager.send_event(
                  events[`ADD_AS_NEW_${users.toUpperCase()}S_CLICKED_TFI`]
                )
                handleAddDuplicateUsers(selectedUsersData)
              }}
            >
              <Trans i18nKey="addAsNewUsers">Add as new {{users}}</Trans>
            </Button>
          </div>
        </div>
      </SliderScreen>
    </>
  )
}
