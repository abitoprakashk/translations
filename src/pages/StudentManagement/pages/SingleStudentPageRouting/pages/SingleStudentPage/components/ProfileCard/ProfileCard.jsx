import {
  Badges,
  BADGES_CONSTANTS,
  Button,
  Icon,
  ICON_CONSTANTS,
  PlainCard,
  Heading,
  KebabMenu,
  Para,
  PARA_CONSTANTS,
  BUTTON_CONSTANTS,
  HEADING_CONSTANTS,
  Divider,
} from '@teachmint/krayon'
import {t} from 'i18next'
import styles from './ProfileCard.module.css'
import UserProfile from '../../../../../../../../assets/images/icons/user-profile.svg'
import CommunicationSMSModal from '../../../../../../../../components/Common/CommunicationSMSModal/CommunicationSMSModal'
import {useState} from 'react'
import {Link, useRouteMatch} from 'react-router-dom'
import {SINGLE_STUDENT_DETAILED_PROFILE_ROUTE} from '../../../../SingleStudentPageRouting'
import Permission from '../../../../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../../../../utils/permission.constants'
import AssignToClassModal from '../../../../../../components/AssignToClassModal/AssignToClassModal'
import classNames from 'classnames'
import DeleteModal from '../DeleteModal/DeleteModal'
import {INSTITUTE_TYPES} from '../../../../../../../../constants/institute.constants'
import SliderStudentDetail from '../../../../../../../../components/SchoolSystem/StudentDirectory/SliderStudentDetail'
import {useDispatch, useSelector} from 'react-redux'
import {showFeatureLockAction} from '../../../../../../../../redux/actions/commonAction'
import {checkSubscriptionType} from '../../../../../../../../utils/Helpers'
import {events} from '../../../../../../../../utils/EventsConstants'

export default function ProfileCard({currentStudent, instituteType}) {
  if (!currentStudent) return null

  const [showSMSModal, setShowSMSModal] = useState(false)
  const [showAssignClassModal, setShowAssignClassModal] = useState(false)
  const [showDeleteStudentModal, setShowDeleteStudentModal] = useState(false)
  const [showEditProfileSilder, setShowEditProfileSilder] = useState(false)
  const {instituteInfo} = useSelector((state) => state)
  const eventManager = useSelector((state) => state.eventManager)
  const dispatch = useDispatch()
  const isPremium = checkSubscriptionType(instituteInfo)

  let {url} = useRouteMatch()

  const userDetails = [
    {
      label: 'academicDetails',
      itemClass: 'academicDetailsItemLabel',
      items: [
        {
          label: 'class',
          value: (
            <div className={styles.classDetailItemWrapper}>
              <Para
                type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
                textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
              >
                {currentStudent?.classroom || '-'}
              </Para>
              <Permission
                permissionId={
                  PERMISSION_CONSTANTS.instituteClassController_moveStudentSection_update
                }
              >
                <Button
                  type={BUTTON_CONSTANTS.TYPE.TEXT}
                  onClick={() => {
                    eventManager.send_event(
                      currentStudent?.classroom
                        ? events.SIS_PROFILE_CHANGE_SECTION_CLICKED_TFI
                        : events.SIS_PROFILE_ASSIGN_SECTION_CLICKED_TFI,
                      {
                        member_id: currentStudent?._id,
                        screen_name: 'profile_overview',
                      }
                    )
                    setShowAssignClassModal(true)
                  }}
                  classes={{
                    button: styles.classAssignChangeButton,
                    label: styles.classAssignChangeButtonLabel,
                  }}
                >
                  {t(
                    currentStudent?.hierarchy_nodes?.[0] ? 'change' : 'assign'
                  )}
                </Button>
              </Permission>
            </div>
          ),
          visiblity: [
            INSTITUTE_TYPES.SCHOOL,
            INSTITUTE_TYPES.TUITION,
            INSTITUTE_TYPES.HOBBY,
          ],
        },
        {
          label: 'classRollNo',
          value: currentStudent?.roll_number || '-',
          visiblity: [
            INSTITUTE_TYPES.COLLEGE,
            INSTITUTE_TYPES.SCHOOL,
            INSTITUTE_TYPES.TUITION,
            INSTITUTE_TYPES.HOBBY,
          ],
        },
        // {
        //   label: 'classTeacher',
        //   value: currentStudent?.classroom || '-',
        //   visiblity: [
        //     INSTITUTE_TYPES.SCHOOL,
        //     INSTITUTE_TYPES.TUITION,
        //     INSTITUTE_TYPES.HOBBY,
        //   ],
        // },
      ],
    },
    {
      label: 'familyDetails',
      itemClass: 'familyDetailsItemLabel',
      items: [
        {
          label: 'father',
          value: currentStudent?.father_name ? (
            <Para
              type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
              textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
            >
              {currentStudent?.father_name}{' '}
              {currentStudent?.father_contact_number && (
                <Dot style={styles.detailItemValueDotMargin} />
              )}
              {currentStudent?.father_contact_number}
            </Para>
          ) : (
            '-'
          ),
          visiblity: [
            INSTITUTE_TYPES.COLLEGE,
            INSTITUTE_TYPES.SCHOOL,
            INSTITUTE_TYPES.TUITION,
            INSTITUTE_TYPES.HOBBY,
          ],
        },
        {
          label: 'mother',
          value: currentStudent?.mother_name ? (
            <Para
              type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
              textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
            >
              {currentStudent?.mother_name}{' '}
              {currentStudent?.mother_contact_number && (
                <Dot style={styles.detailItemValueDotMargin} />
              )}
              {currentStudent?.mother_contact_number}
            </Para>
          ) : (
            '-'
          ),
          visiblity: [
            INSTITUTE_TYPES.COLLEGE,
            INSTITUTE_TYPES.SCHOOL,
            INSTITUTE_TYPES.TUITION,
            INSTITUTE_TYPES.HOBBY,
          ],
        },
      ],
    },
  ]

  const getUserStatusUI = () => {
    switch (currentStudent?.verification_status) {
      case 1:
        return (
          <Badges
            label={t('joinedOnApp')}
            inverted={true}
            type={BADGES_CONSTANTS.TYPE.SUCCESS}
            showIcon={false}
            className={styles.statusBadge}
          />
        )
      case 2:
        return (
          <>
            <Badges
              label={t('appNotInstalled')}
              inverted={true}
              type={BADGES_CONSTANTS.TYPE.WARNING}
              showIcon={false}
              className={styles.statusBadge}
            />
            <div className={styles.smsIconWrapper}>
              <Permission
                permissionId={PERMISSION_CONSTANTS.SmsController_send_create}
              >
                <Icon
                  name="localPostOffice"
                  type={ICON_CONSTANTS.TYPES.PRIMARY}
                  size={ICON_CONSTANTS.SIZES.XX_SMALL}
                  onClick={() => {
                    isPremium
                      ? setShowSMSModal(true)
                      : dispatch(showFeatureLockAction(!isPremium))
                  }}
                ></Icon>
              </Permission>
            </div>
          </>
        )

      default:
        return (
          <Badges
            label={t('inactive')}
            inverted={true}
            showIcon={false}
            className={classNames(
              styles.statusBadge,
              styles.statusInActiveBadge
            )}
          />
        )
    }
  }

  const ProfilePic = (
    <img
      src={currentStudent?.img_url || UserProfile}
      alt="profile image"
      className={styles.profilePic}
      onClick={() => setShowEditProfileSilder(true)}
    />
  )

  return (
    <PlainCard className={styles.card}>
      <div className={styles.profilePicWrapperMobile}>
        {ProfilePic}

        <div className={styles.nameContactStatusWrapper}>
          <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.X_SMALL}>
            {`${currentStudent?.name || ''} ${
              currentStudent?.middle_name || ''
            } ${currentStudent?.last_name || ''}`}
          </Heading>
          <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
            {currentStudent?.phone_number || currentStudent?.email}
          </Para>
          <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
            {currentStudent?.enrollment_number}
          </Para>
          {getUserStatusUI()}
        </div>
      </div>

      <Divider spacing="16px" classes={{wrapper: styles.mobileDivider}} />

      <div className={styles.profilePicWrapper}>
        {ProfilePic}
        {getUserStatusUI()}
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.profileInfoWrapper}>
          <div className={styles.nameWrapper}>
            <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.MEDIUM}>
              {`${currentStudent?.name || ''} ${
                currentStudent?.middle_name || ''
              } ${currentStudent?.last_name || ''}`}
            </Heading>
          </div>

          <Permission
            permissionId={PERMISSION_CONSTANTS.ipsController_deleteUser_delete}
          >
            <KebabMenu
              options={[
                {
                  content: (
                    <Para type={PARA_CONSTANTS.TYPE.ERROR}>
                      {t('deleteStudent')}
                    </Para>
                  ),
                  handleClick: () => {
                    setShowDeleteStudentModal(true)
                    eventManager.send_event(
                      events.SIS_OVERVIEW_DELETE_USER_CLICKED_TFI,
                      {member_id: currentStudent?._id}
                    )
                  },
                  icon: (
                    <Icon
                      size={ICON_CONSTANTS.SIZES.X_SMALL}
                      name="delete1"
                      type={ICON_CONSTANTS.TYPES.ERROR}
                    />
                  ),
                },
              ]}
              isVertical={true}
              classes={{
                tooltipWrapper: styles.tooltipWrapper,
                optionsWrapper: styles.kebabMenuOptionsWrapper,
                option: styles.optionWrapper,
                iconFrame: styles.kebabMenuIconFrame,
              }}
            />
          </Permission>
        </div>

        <div className={styles.contactEnrollWrapper}>
          <Para
            type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
            textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
          >
            {currentStudent?.phone_number || currentStudent?.email}
          </Para>
          <Dot />
          <Para
            type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
            textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
          >
            {currentStudent?.enrollment_number}
          </Para>
        </div>

        <div className={styles.detailsFullProfileButtonWrapper}>
          <div className={styles.detailsOuterWrapper}>
            {userDetails?.map((detailsItems, i) => (
              <div key={i} className={styles.detailsWrapper}>
                <Para
                  type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
                  weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
                >
                  {t(detailsItems.label)}
                </Para>

                {detailsItems.items
                  ?.filter(({visiblity}) => visiblity.includes(instituteType))
                  ?.map((detailsItem, j) => (
                    <div key={j} className={styles.detailsItem}>
                      <Para
                        className={styles[detailsItems.itemClass]}
                        textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
                      >
                        {t(detailsItem.label)}:
                      </Para>
                      {typeof detailsItem.value === 'string' ? (
                        <Para
                          type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
                          textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
                        >
                          {detailsItem.value}
                        </Para>
                      ) : (
                        detailsItem.value
                      )}
                    </div>
                  ))}
              </div>
            ))}
          </div>

          <Link
            to={`${url}${SINGLE_STUDENT_DETAILED_PROFILE_ROUTE}`}
            relative="path"
            onClick={() =>
              eventManager.send_event(
                events.SIS_VIEW_FULL_INFORMATION_CLICKED_TFI
              )
            }
          >
            <Button classes={{button: styles.viewProfielButton}}>
              View Full Information
            </Button>
          </Link>
        </div>
      </div>

      {showSMSModal && (
        <CommunicationSMSModal
          showModal={showSMSModal}
          setShowModal={setShowSMSModal}
          templateId="WELCOME_SMS"
          usersList={[currentStudent?._id]}
        />
      )}

      {showAssignClassModal && (
        <AssignToClassModal
          showModal={showAssignClassModal}
          setShowModal={setShowAssignClassModal}
          student={currentStudent}
          screenName="student_directory"
          currentClass={currentStudent?.details?.standards?.[0]}
          currentSection={currentStudent?.details?.sections?.[0]}
        />
      )}

      {showEditProfileSilder && (
        <SliderStudentDetail
          setSliderScreen={setShowEditProfileSilder}
          studentId={currentStudent?._id}
          width="900"
        />
      )}

      {showDeleteStudentModal && (
        <DeleteModal
          handleClosePopup={() => setShowDeleteStudentModal(false)}
          currentStudentId={currentStudent?._id}
          studentName={currentStudent?.name}
        />
      )}
    </PlainCard>
  )
}

function Dot({style = ''}) {
  return <span className={classNames(styles.dot, style)}></span>
}
