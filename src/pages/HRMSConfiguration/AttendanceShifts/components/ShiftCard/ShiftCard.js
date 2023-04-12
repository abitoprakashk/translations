import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import styles from './ShiftCard.module.css'
import {t} from 'i18next'
import {Trans} from 'react-i18next'
import {
  Divider,
  Heading,
  HEADING_CONSTANTS,
  KebabMenu,
  PlainCard,
  Icon,
  ICON_CONSTANTS,
  Para,
  PARA_CONSTANTS,
  Badges,
  BADGES_CONSTANTS,
  Button,
  BUTTON_CONSTANTS,
  AvatarGroup,
  Modal,
  MODAL_CONSTANTS,
  Popup,
} from '@teachmint/krayon'
import AddEditShiftModal from '../AddEditShfitModal/AddEditShiftModal'
import StaffSelection from '../SelectStaff/StaffSelection'
import SelectStaff from '../SelectStaff/SelectStaff'
import Permission from '../../../../../components/Common/Permission/Permission'
import globalActions from '../../../../../redux/actions/global.actions'
import {getStaffGroups} from '../../utils/shift.utils'
import {ATTENDANCE_METHOD, STAFF_TYPE} from '../../constants/shift.constants'
import {showSuccessToast} from '../../../../../redux/actions/commonAction'
import {PERMISSION_CONSTANTS} from '../../../../../utils/permission.constants'
import {events} from '../../../../../utils/EventsConstants'
import {validateSelectStaffStep} from '../../utils/validation'

const SHIFT_BADGES = {
  [ATTENDANCE_METHOD.GEOFENCE]: {
    icon: 'gpsNotFixed',
    label: t('geofenceConfigured'),
    styleClass: 'geofence',
  },
  [ATTENDANCE_METHOD.BIOMETRIC]: {
    icon: 'fingerprint',
    label: t('biometricConfigured'),
    styleClass: 'biometric',
  },
}

export default function ShiftCard({shift}) {
  const dispatch = useDispatch()
  const eventManager = useSelector((state) => state.eventManager)
  const {staffListData} = useSelector((state) => state.staffAttendance)
  const [showEditShiftModal, setShowEditShiftModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showViewTeacherModal, setShowViewTeacherModal] = useState(false)
  const [showViewStaffModal, setShowViewStaffModal] = useState(false)
  const [showManageUsersModal, setShowManageUsersModal] = useState(false)
  const [staffGroups, setStaffGroups] = useState({})
  const [shiftInfo, setShiftInfo] = useState({})
  const shiftName = shift?.name

  useEffect(() => {
    if (shift && staffListData) {
      const shiftStaffList = staffListData.filter((staff) =>
        shift?.staffs.find((staff_id) => staff_id === staff._id)
      )
      const group = getStaffGroups(shiftStaffList)
      setStaffGroups(group)
      setShiftInfo({...shift})
    }
  }, [shift, staffListData])

  const onDeleteShift = () => {
    eventManager.send_event(events.ATTENDANCE_SHIFT_DELETED_TFI, {
      shift_id: shiftInfo._id,
    })
    dispatch(
      globalActions?.deleteShift?.request(
        {
          shift: shift?._id,
        },
        () => {
          dispatch(showSuccessToast(t('shiftDeletedSuccessfully')))
          setShowDeleteModal(false)
        }
      )
    )
  }

  const updateUsers = () => {
    dispatch(
      globalActions?.updateShift?.request({shift: shiftInfo}, () => {
        setShowManageUsersModal(false)
        dispatch(showSuccessToast(t('updatedShiftUsersSuccessfully')))
      })
    )
  }

  return (
    <PlainCard className={styles.shiftCardWrapper}>
      <div className={styles.cardSection}>
        <div className={styles.cardHeadingSection}>
          <Heading
            textSize={HEADING_CONSTANTS.TEXT_SIZE.X_SMALL}
            className={styles.cardHeading}
          >
            {shift?.name}
          </Heading>

          <Permission
            permissionId={
              PERMISSION_CONSTANTS.InstituteShiftController_update_route_create
            }
          >
            <KebabMenu
              isVertical
              classes={{
                tooltipWrapper: styles.tooltipWrapper,
                iconFrame: styles.kebabIcon,
                optionsWrapper: styles.kebabOptionsWrapper,
              }}
              options={[
                {
                  icon: (
                    <Icon
                      name="edit2"
                      size={ICON_CONSTANTS.SIZES.XX_SMALL}
                      type={ICON_CONSTANTS.TYPES.BASIC}
                    />
                  ),
                  content: <Para>{t('edit')}</Para>,
                  handleClick: () => {
                    eventManager.send_event(
                      events.ATTENDANCE_SHIFTS_KMENU_CLICKED_TFI,
                      {shift_id: shiftInfo._id, action: 'edit'}
                    )
                    setShowEditShiftModal(true)
                  },
                },
                {
                  icon: (
                    <Permission
                      permissionId={
                        PERMISSION_CONSTANTS.InstituteShiftController_remove_delete
                      }
                    >
                      <Icon
                        name="delete1"
                        size={ICON_CONSTANTS.SIZES.XX_SMALL}
                        type={ICON_CONSTANTS.TYPES.ERROR}
                      />
                    </Permission>
                  ),
                  content: (
                    <Permission
                      permissionId={
                        PERMISSION_CONSTANTS.InstituteShiftController_remove_delete
                      }
                    >
                      <Para type={PARA_CONSTANTS.TYPE.ERROR}>
                        {t('delete')}
                      </Para>
                    </Permission>
                  ),
                  handleClick: () => {
                    eventManager.send_event(
                      events.ATTENDANCE_SHIFTS_KMENU_CLICKED_TFI,
                      {shift_id: shiftInfo._id, action: 'delete'}
                    )
                    setShowDeleteModal(true)
                  },
                },
              ]}
            />
          </Permission>
        </div>
        <div className={styles.cardDuration}>
          <Icon
            name="clock"
            size={ICON_CONSTANTS.SIZES.XX_SMALL}
            type={ICON_CONSTANTS.TYPES.SECONDARY}
            version={ICON_CONSTANTS.VERSION.OUTLINED}
          />
          <Para type={PARA_CONSTANTS.TYPE.TEXT_SECONDARY}>
            {shift?.setting?.outtime
              ? `${shift?.setting?.intime} - ${shift?.setting?.outtime}`
              : `${t('shiftStartsAt')} ${shift?.setting?.intime}`}
          </Para>
        </div>
        <Badges
          size={BADGES_CONSTANTS.SIZE.SMALL}
          iconName={SHIFT_BADGES[shift?.setting?.attendance_method]?.icon}
          label={SHIFT_BADGES[shift?.setting?.attendance_method]?.label}
          inverted
          showIcon
          className={
            styles[SHIFT_BADGES[shift?.setting?.attendance_method]?.styleClass]
          }
        />
      </div>
      <Divider spacing={'0'} />
      <div className={styles.cardMidSection}>
        <div className={styles.cardSection}>
          <Para
            type={PARA_CONSTANTS.TYPE.TEXT_SECONDARY}
            textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
            className={styles.groupType}
          >
            {t('teachers')}
          </Para>
          {staffGroups?.[STAFF_TYPE.TEACHING]?.length > 0 ? (
            <AvatarGroup
              size={'s'}
              data={staffGroups?.[STAFF_TYPE.TEACHING]?.map((teacher) => {
                return {
                  id: teacher.user_id,
                  name: teacher.name,
                  imgSrc: teacher.img_url,
                }
              })}
              maxCount={3}
              onClick={() => setShowViewTeacherModal(true)}
              onMoreClick={() => setShowViewTeacherModal(true)}
              classes={{
                wrapper: styles.avatarGroupWrapper,
                showMoreBtn: styles.avatarMoreButton,
              }}
            />
          ) : (
            '-'
          )}
        </div>
        <Divider spacing={'0'} isVertical />
        <div className={styles.cardSection}>
          <Para
            type={PARA_CONSTANTS.TYPE.TEXT_SECONDARY}
            textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
            className={styles.groupType}
          >
            {t('staff')}
          </Para>
          {staffGroups?.[STAFF_TYPE.NON_TEACHING]?.length > 0 ? (
            <AvatarGroup
              size={'s'}
              data={staffGroups?.[STAFF_TYPE.NON_TEACHING]?.map((staff) => {
                return {
                  id: staff.user_id,
                  name: staff.name,
                  imgSrc: staff.img_url,
                }
              })}
              maxCount={3}
              onClick={() => setShowViewStaffModal(true)}
              onMoreClick={() => setShowViewStaffModal(true)}
              classes={{
                wrapper: styles.avatarGroupWrapper,
                showMoreBtn: styles.avatarMoreButton,
              }}
            />
          ) : (
            '-'
          )}
        </div>
      </div>
      <Divider spacing={'0'} />
      <div className={styles.cardSection}>
        <Permission
          permissionId={
            PERMISSION_CONSTANTS.InstituteShiftController_update_route_create
          }
        >
          <Button
            type={BUTTON_CONSTANTS.TYPE.OUTLINE}
            category={BUTTON_CONSTANTS.CATEGORY.PRIMARY}
            width={BUTTON_CONSTANTS.WIDTH.FULL}
            onClick={() => {
              eventManager.send_event(events.SHIFT_MANAGE_USERS_CLICKED_TFI, {
                shift_id: shiftInfo._id,
              })
              setShowManageUsersModal(true)
            }}
          >
            {t('manageUsers')}
          </Button>
        </Permission>
      </div>

      {/* Delete shift popup */}
      <Popup
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        actionButtons={[
          {
            id: 'cancel',
            onClick: () => setShowDeleteModal(false),
            body: t('cancel'),
            type: BUTTON_CONSTANTS.TYPE.OUTLINE,
            category: BUTTON_CONSTANTS.CATEGORY.PRIMARY,
          },
          {
            id: 'delete',
            onClick: onDeleteShift,
            body: t('delete'),
            type: BUTTON_CONSTANTS.TYPE.FILLED,
            category: BUTTON_CONSTANTS.CATEGORY.DESTRUCTIVE,
          },
        ]}
        header={`${t('delete')} ${shiftName}?`}
        headerIcon={
          <Icon
            name="delete1"
            size={ICON_CONSTANTS.SIZES.X_SMALL}
            type={ICON_CONSTANTS.TYPES.BASIC}
          />
        }
        classes={{
          content: styles.deletePopupWrapper,
          header: styles.header,
        }}
        showCloseIcon
      >
        <Para
          textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
          type={PARA_CONSTANTS.TYPE.TEXT_SECONDARY}
        >
          <Trans i18nKey="deleteShiftWarning">{{shiftName}}</Trans>
        </Para>
      </Popup>

      {/* View Teachers popup */}
      <Popup
        isOpen={showViewTeacherModal}
        onClose={() => setShowViewTeacherModal(false)}
        header={`${t('teachersInShift')} ${shiftName}`}
        classes={{
          content: styles.popupWrapper,
          header: styles.header,
        }}
        showCloseIcon
      >
        <StaffSelection
          show
          data={staffGroups?.[STAFF_TYPE.TEACHING]}
          filterOnProperty={['name']}
          isSelectable={false}
          hideTableHeader
          searchPlaceholder={t('attendanceShiftSearchByTeacherName')}
        />
      </Popup>

      {/* View Staff popup */}
      <Popup
        isOpen={showViewStaffModal}
        onClose={() => setShowViewStaffModal(false)}
        header={`${t('staffInShift')} ${shiftName}`}
        classes={{
          content: styles.popupWrapper,
          header: styles.header,
        }}
        showCloseIcon
      >
        <StaffSelection
          show
          data={staffGroups?.[STAFF_TYPE.NON_TEACHING]}
          filterOnProperty={['name']}
          isSelectable={false}
          hideTableHeader
          searchPlaceholder={t('attendanceShiftSearchByStaffName')}
        />
      </Popup>

      {/* Edit Shift Modal */}
      {showEditShiftModal && (
        <AddEditShiftModal
          showModal={showEditShiftModal}
          setShowModal={setShowEditShiftModal}
          header={t('setupAttendanceConfiguration')}
          shift={shift}
          isEdit
        />
      )}

      {/* Manage Users modal */}
      {showManageUsersModal && (
        <Modal
          size={MODAL_CONSTANTS.SIZE.AUTO}
          header={`${t('manageUsers')}`}
          showCloseIcon
          onClose={() => {
            setShiftInfo({...shift})
            setShowManageUsersModal(false)
          }}
          isOpen={showManageUsersModal}
          shouldCloseOnOverlayClick
          classes={{
            modal: styles.manageUsersModal,
            content: styles.manageUsersContent,
          }}
          actionButtons={[
            {
              body: t('update'),
              onClick: updateUsers,
              isDisabled: !validateSelectStaffStep(shiftInfo),
            },
          ]}
        >
          <SelectStaff
            shiftInfo={shiftInfo}
            setShiftInfo={setShiftInfo}
            isEdit
          />
        </Modal>
      )}
    </PlainCard>
  )
}
