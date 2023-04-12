import {
  Badges,
  Button,
  BUTTON_CONSTANTS,
  HeaderTemplate,
  TabGroup,
} from '@teachmint/krayon'
import {useEffect, useRef, useState} from 'react'
import {Trans, useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import {generatePath, useHistory, useParams} from 'react-router-dom'
import UserDetailsRow from '../../../../components/Common/UserDetailsRow/UserDetailsRow'
import globalActions from '../../../../redux/actions/global.actions'
import {
  getActiveStudents,
  roleListSelector,
} from '../../../../redux/reducers/CommonSelectors'
import useFilter from '../../../CustomCertificate/components/UserListAndFilters/useFilter'
import SelectedTemplateInfo from '../../components/SelectedTemplateInfo/SelectedTemplateInfo'
import StudentStaffTable from '../../components/StudentStaffTable/StudentStaffTable'
import {
  IDCARD,
  idPageSizeConfig,
  PREVIEW,
  PREVIEW_SAVE,
  STUDENT,
  STAFF,
  PURCHASE_ORDER_STATUS,
} from '../../CustomId.constants'
import {
  CUSTOM_ID_CARD_ROOT_ROUTE,
  CUSTOM_ID_CARD_SUB_ROUTE,
} from '../../CustomId.routes'
import {TAB_OPTION} from '../IdTemplatesOverview/IdTemplatesOverview'
import styles from './GenerateIdCard.module.css'
import ActionButtons from '../../components/StudentStaffTable/ActionButtons'
import SliderStudentDetail from '../../../../components/SchoolSystem/StudentDirectory/SliderStudentDetail'
import {
  bulkGeneratedIDCardStatusSelector,
  customIdTemplateDetailsSelector,
  generateBulkIdCardSelector,
  generateSingleIdCardSelector,
  getIDCardOrderData,
  idCardAccessoriesConfigSelector,
} from '../../redux/CustomId.selector'
import {useMemo} from 'react'
import MissingFieldsKabab from '../../components/StudentStaffTable/MissingFieldsKabab'
import {
  generateHTMLSkeletonIDCard,
  wrapContentInLiquidJsStyleLoop,
} from '../../CustomId.utils'
import Loader from '../../../../components/Common/Loader/Loader'
import CustomIdPreview from '../../components/CustomIdPreview/CustomIdPreview'
import {downloadFromLink} from '../../../../utils/fileUtils'
import usePolling from '../../../../utils/CustomHooks/usePolling'
import {TEMPLATE_STATUS} from '../../../CustomCertificate/CustomCertificate.constants'
import useStaffListHook from '../../../../utils/CustomHooks/useStaffListHook'
import SliderEditAdmin from '../../../../components/Home/Admin/SliderEditAdmin'
import {personaProfileSettingsSelector} from '../../../ProfileSettings/redux/ProfileSettingsSelectors'
import {getCategoriesCollection} from '../../../ProfileSettings/ProfileSettings.utils'
import {SETTING_TYPE} from '../../../ProfileSettings/ProfileSettings.constant'
import {fetchCategoriesRequestAction} from '../../../ProfileSettings/redux/actions/ProfileSettingsActions'
import {getRoleName} from '../../../../utils/StaffUtils'
import SliderTeacherDetail from '../../../TeacherDirectory/components/SliderTeacherDetail/SliderTeacherDetail'
import SetupCard from '../../../../components/Common/SetupCard/SetupCard'
import OrderIdCardModal from '../../components/IdCardCheckout/OrderIdCardModal/OrderIdCardModal'
import OrderStatusInfo from '../../components/IdCardCheckout/OrderStatusInfo/OrderStatusInfo'
import {events} from '../../../../utils/EventsConstants'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'

const GenerateIdCard = () => {
  const {t} = useTranslation()
  const orderHistoryData = getIDCardOrderData()
  const eventManager = useSelector((state) => state.eventManager)
  const {userType, templateId, isDefault} = useParams()
  const history = useHistory()
  const {data: idCardAccessoriesConfig} = idCardAccessoriesConfigSelector()
  const dispatch = useDispatch()
  const [loadingButtonVisible, showLoadingButton] = useState(false)
  const [activeTab, setActiveTab] = useState()
  const [isPreview, showPreview] = useState()
  const [orderModalOpen, setOrderModal] = useState()
  const [selectedUser, setSelectedUser] = useState({})
  const [filters, setSelectedFilter] = useState({
    searchFilter: '',
    checkboxFilter: [],
  })
  const previewType = useRef('')
  const {data: customIdTemplateDetails, isLoading: templateDetailsLoading} =
    customIdTemplateDetailsSelector()
  const {data: singleIdPdfUrl, isLoading: singleIdGenerateLoading} =
    generateSingleIdCardSelector()
  const {data: bulkRequestId, isLoading: bulkRequestLoading} =
    generateBulkIdCardSelector()
  const generatedDocumentStatus = bulkGeneratedIDCardStatusSelector()
  const {clear, start, intervalId} = usePolling(
    () => {
      dispatch(globalActions.bulkGeneratedIDCardStatus.request([bulkRequestId]))
    },
    {delay: 3000}
  )

  useEffect(() => {
    if (bulkRequestId && !intervalId) {
      start()
      showLoadingButton(true)
    }
    if (
      bulkRequestId &&
      generatedDocumentStatus &&
      Array.isArray(generatedDocumentStatus) &&
      generatedDocumentStatus[0].file?.status == TEMPLATE_STATUS.COMPLETED
    ) {
      // triggerEvent(CERTIFICATE_EVENTS.CERTIFICATE_DOWNLOADED_TFI, {
      //   screen: 'select_users',
      // })
      downloadFromLink(generatedDocumentStatus[0].file?.url)
      showLoadingButton(false)
      dispatch(globalActions.bulkGeneratedIDCardStatus.reset())
      dispatch(globalActions.generateBulkIdCard.reset())
      clear()
    }
  }, [bulkRequestId, generatedDocumentStatus])

  useEffect(() => {
    dispatch(globalActions?.getIDCardOrderHistory?.request())
  }, [])

  useEffect(() => {
    if (templateId) {
      dispatch(
        globalActions.customIdTemplateDetails.request({
          id: templateId,
          isDefault: isDefault,
        })
      )
    }
  }, [])

  useEffect(() => {
    if (singleIdPdfUrl) {
      if (previewType.current === PREVIEW) {
        showPreview(true)
      } else if (previewType.current === PREVIEW_SAVE) {
        downloadFromLink(singleIdPdfUrl)
        dispatch(globalActions.generateSingleIdCard.reset())
      }
    }
  }, [singleIdPdfUrl])

  useEffect(() => {
    setActiveTab(userType)
  }, [userType])

  const getIMISFields = (template) => {
    return template?.fields?.IMIS || []
  }

  const getUsedFieldsForUser = () => {
    let fieldsUsedInTemplate = [
      ...getIMISFields(customIdTemplateDetails?.frontTemplate),
      ...getIMISFields(customIdTemplateDetails?.backTemplate),
    ]
    return fieldsUsedInTemplate
  }
  const personaProfileSettingsData = personaProfileSettingsSelector()

  useEffect(() => {
    const getProfileSettings = {
      persona: 'STAFF',
    }
    dispatch(
      globalActions?.fetchPersonaProfileSettingsRequestAction?.request(
        getProfileSettings
      )
    )
  }, [])

  useEffect(() => {
    let categoriesCollection = null
    if (
      personaProfileSettingsData.data &&
      personaProfileSettingsData.data.length > 0
    ) {
      categoriesCollection = getCategoriesCollection(
        personaProfileSettingsData.data,
        SETTING_TYPE.CATEGORY_FOR_INFO
      )
    }
    dispatch(fetchCategoriesRequestAction(categoriesCollection))
  }, [personaProfileSettingsData])

  const fieldsUsedInTemplate = getUsedFieldsForUser()
  const studentList = getActiveStudents(true)
  const {activeStaffList, reloadList} = useStaffListHook()
  const data = userType === STUDENT ? studentList : activeStaffList
  const rolesList = roleListSelector()

  const updateFilter = (type, value) => {
    setSelectedFilter({...filters, [type]: value})
  }

  const searchFilter = useFilter({
    data,
    keyToFilter: ['name', 'phone_number'],
    filterValue: filters.searchFilter,
  })

  const checkboxFilter = useFilter({
    data: searchFilter,
    keyToFilter: 'details.sections',
    filterValue: filters.checkboxFilter,
  })

  const triggerBulkDownload = (userIds, layoutHtml) => {
    const payload = {
      template_id: templateId,
      default: isDefault === 'false' ? false : true,
      layout_html: layoutHtml || generateSingleId(true),
      iids: userIds,
    }
    dispatch(globalActions.generateBulkIdCard.request(payload))
  }

  const getPreviewUrl = (userId) => {
    const payload = {
      template_id: templateId,
      default: isDefault === 'false' ? false : true,
      layout_html: generateSingleId(false),
      iid: userId,
    }
    dispatch(globalActions.generateSingleIdCard.request(payload))
  }

  const formatStudentData = () => {
    const data = checkboxFilter.map((item) => {
      const missingFields = fieldsUsedInTemplate.filter((field) => {
        return !item[field.id]
      })
      return {
        id: item._id,
        personal_info: <UserDetailsRow data={item} />,
        details:
          (item?.hierarchy_nodes?.length && item?.hierarchy_nodes[0]) || 'NA',
        status: (
          <MissingFieldsKabab
            missingFields={missingFields.filter(
              (v, i, a) =>
                a.findIndex((v2) => ['id'].every((k) => v2[k] === v[k])) === i
            )}
            openUserProfile={() => setSelectedUser({...item})}
          />
        ),
        action: (
          <ActionButtons
            previewTypeRef={previewType}
            getPreviewUrl={getPreviewUrl}
            user={{...item}}
            setSelectedUserId={setSelectedUser}
          />
        ),
      }
    })
    return data
  }

  const formatStaffData = () => {
    const data = checkboxFilter
      .filter((i) => i.verification_status != 4)
      .map((item) => {
        const missingFields = fieldsUsedInTemplate.filter((field) => {
          return !item[field.id]
        })
        return {
          id: item._id,
          personal_info: (
            <UserDetailsRow
              data={item}
              name={item.name}
              phoneNumber={item.phone_number}
              img={item.img_url}
            />
          ),
          details: getRoleName(item, rolesList),
          status: (
            <MissingFieldsKabab
              missingFields={missingFields.filter(
                (v, i, a) =>
                  a.findIndex((v2) => ['id'].every((k) => v2[k] === v[k])) === i
              )}
              openUserProfile={() => setSelectedUser({...item})}
            />
          ),
          action: (
            <ActionButtons
              previewTypeRef={previewType}
              getPreviewUrl={getPreviewUrl}
              user={{...item}}
              setSelectedUserId={setSelectedUser}
            />
          ),
        }
      })
    return data
  }

  const getRows = () => {
    if (userType === STUDENT) {
      return formatStudentData()
    } else return formatStaffData()
  }

  const onTabClick = ({id}) => {
    history.push(
      generatePath(CUSTOM_ID_CARD_ROOT_ROUTE, {
        userType: id,
      })
    )
  }

  const rows = useMemo(
    () => getRows(),
    [filters, data, customIdTemplateDetails]
  )

  const missingFieldsForUsers = () => {
    let count = 0
    checkboxFilter.forEach((item) => {
      fieldsUsedInTemplate.find((field) => {
        if (!item[field.id]) {
          count++
          return true
        }
      })
    })
    return count
  }

  const missingFieldsForUsersCount = useMemo(
    () => missingFieldsForUsers(),
    [filters, studentList, activeStaffList, customIdTemplateDetails]
  )

  const generateSingleId = (isBulk) => {
    const {frontTemplate, backTemplate} = customIdTemplateDetails
    const template = `${frontTemplate.html} ${backTemplate?.html || ''}`
    const content = isBulk ? wrapContentInLiquidJsStyleLoop(template) : template
    const {height, width} =
      idPageSizeConfig[IDCARD][frontTemplate?.pageSettings?.orientation]
    const html = generateHTMLSkeletonIDCard({
      pageHeight: height,
      pageWidth: width,
      content,
    })
    return html
  }

  const toggleStaffSlider = (isUpdated) => {
    setSelectedUser({})
    if (isUpdated !== null) reloadList?.()
  }

  const toggleOrderModal = () => {
    setOrderModal(!orderModalOpen)
    dispatch(globalActions.generateBulkIdCard.reset())
  }

  const getDiscountLabel = () => {
    const discount = idCardAccessoriesConfig.discount
    const discountDateUnformatted = idCardAccessoriesConfig?.discount_last_date // 03-04-2023
    const discountDate = discountDateUnformatted
    // DateTime(discountDateUnformatted)
    return (
      <Trans key={'customId.orderIdSubDiscount'}>
        {{discount}}% Early Bird Discount (Valid till {{discountDate}})
      </Trans>
    )
  }

  return (
    <div className={styles.wrapper}>
      <Loader
        show={
          singleIdGenerateLoading ||
          bulkRequestLoading ||
          templateDetailsLoading
        }
      />
      <HeaderTemplate
        mainHeading={t('customId.idCards')}
        subHeading={t(
          userType === STUDENT
            ? 'customId.generateIdSubHeadingStudent'
            : 'customId.generateIdSubHeadingStaff'
        )}
      />
      <SetupCard
        heading={t('customId.orderIdHeader')}
        text={
          idCardAccessoriesConfig?.discount ? (
            <Badges
              className={styles.discountBadge}
              label={getDiscountLabel()}
              showIcon={true}
              iconName="localOffer"
              type="error"
              inverted
            />
          ) : (
            t('customId.orderIdSub')
          )
        }
        permissionId={
          PERMISSION_CONSTANTS.IdCardOrderController_checkout_create
        }
        actionBtn={t('customId.orderNow')}
        onClick={() => {
          toggleOrderModal()
          eventManager.send_event(events.IDCARD_ORDER_BANNER_CLICKED_TFI)
        }}
        icon="assignmentInd"
      />
      {orderModalOpen && (
        <OrderIdCardModal
          isOpen={orderModalOpen}
          toggleOrderModal={toggleOrderModal}
        />
      )}
      <CustomIdPreview
        url={isPreview && singleIdPdfUrl}
        title={t('customId.cardPreview')}
        onClose={() => {
          dispatch(globalActions.generateSingleIdCard.reset())
          showPreview(false)
        }}
      />
      <div className={styles.topNav}>
        <div className={styles.tabsWrapper}>
          <TabGroup
            tabOptions={TAB_OPTION}
            onTabClick={onTabClick}
            selectedTab={activeTab}
            tabGroupType="primary"
            moredivClass={styles.tabsWrapper}
            showMoreTab={false}
          />
        </div>

        {orderHistoryData?.length > 0 && (
          <Button
            type={BUTTON_CONSTANTS.TYPE.TEXT}
            size={BUTTON_CONSTANTS.SIZE.LARGE}
            prefixIcon="history"
            onClick={() => {
              eventManager.send_event(events.PURCHASE_HISTORY_OPENED_TFI)
              history.push(
                generatePath(CUSTOM_ID_CARD_SUB_ROUTE.PURCHASE_HISTORY, {
                  userType,
                })
              )
            }}
          >
            {t('purchaseHistory')}
          </Button>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.mainContent}>
          {userType === STUDENT && selectedUser._id && (
            <SliderStudentDetail
              setSliderScreen={() => setSelectedUser({})}
              studentId={selectedUser._id}
              width={900}
            />
          )}
          {userType === STAFF && selectedUser._id && selectedUser.type === 2 ? (
            <SliderTeacherDetail
              setSliderScreen={toggleStaffSlider}
              selectedTeacher={selectedUser}
            />
          ) : (
            userType === STAFF &&
            selectedUser._id && (
              <SliderEditAdmin
                setShowEditSlider={toggleStaffSlider}
                selectedAdminCard={selectedUser}
                isSameUser={selectedUser.type === 3}
              />
            )
          )}

          {customIdTemplateDetails && (
            <>
              <SelectedTemplateInfo
                userCount={rows.length}
                missingFieldsForUsersCount={missingFieldsForUsersCount}
                customIdTemplateDetails={customIdTemplateDetails}
              />

              <StudentStaffTable
                rows={rows}
                updateFilter={updateFilter}
                filters={filters}
                triggerBulkDownload={triggerBulkDownload}
                loadingButtonVisible={loadingButtonVisible}
              />
            </>
          )}
        </div>

        {orderHistoryData?.length > 0 &&
          orderHistoryData.filter(
            ({status}) => status !== PURCHASE_ORDER_STATUS.DELIVERED
          ).length > 0 && (
            <OrderStatusInfo orderHistoryData={orderHistoryData} />
          )}
      </div>
    </div>
  )
}

export default GenerateIdCard
