import React, {useEffect, useState} from 'react'
import {
  SearchBar,
  Table,
  Button,
  BUTTON_CONSTANTS,
  Modal,
  MODAL_CONSTANTS,
} from '@teachmint/krayon'
import {
  STUDENT,
  TABLE_COLS,
  TEMPLATE_STATUS,
} from '../../CustomCertificate.constants'
import {useParams, generatePath, useHistory} from 'react-router-dom'
import {
  getActiveStudents,
  roleListSelector,
} from '../../../../redux/reducers/CommonSelectors'
import styles from './UserListAndFilters.module.css'
import {useTranslation} from 'react-i18next'
import {CUSTOM_CERTIFICATE_SUB_ROUTES} from '../../CustomCertificates.routes'
import {
  eventManagerSelector,
  generatedDocumentStatusSelector,
  multipleGenerateRequestIdSelector,
  staffListSelector,
  templateDetailsSelector,
} from '../../redux/CustomCertificate.selectors'
import ClassHeirarchy from '../../../../components/Common/ClassHeirarchy/ClassHeirarchy'
import useInstituteHeirarchy from '../../../AttendanceReport/pages/StudentWiseAttendance/hooks/useInstituteHeirarchy'
import useFilter from './useFilter'
import {useDispatch, useSelector} from 'react-redux'
import globalActions from '../../../../redux/actions/global.actions'
import usePolling from '../../../../utils/CustomHooks/usePolling'
import Loader from '../../../../components/Common/Loader/Loader'
import LoadingPercentageButton from '../../../../components/Common/LoadingPercentageButton/LoadingPercentageButton'
import {downloadFromLink} from '../../../../utils/fileUtils'
import {CERTIFICATE_EVENTS} from '../../CustomCertificate.events'
import Permission from '../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'
import UserDetailsRow from '../../../../components/Common/UserDetailsRow/UserDetailsRow'
import {getRoleName} from '../../../../utils/StaffUtils'
import UserListEmptyState from './UserListEmptyState'

const ActionButton = ({user, triggerEvent}) => {
  const {userType, templateId, type} = useParams()
  const {t} = useTranslation()
  const history = useHistory()
  const onClick = () => {
    triggerEvent(CERTIFICATE_EVENTS.CERTIFICATE_GENERATE_CLICKED_TFI, {
      user_id: user._id,
    })
    const url = `${generatePath(CUSTOM_CERTIFICATE_SUB_ROUTES.FILL_DETAILS, {
      userType,
      templateId,
      type,
    })}?userId=${user._id}`
    history.push(url)
  }

  return (
    <Permission
      permissionId={
        PERMISSION_CONSTANTS.documentController_generateSingle_create
      }
    >
      <Button onClick={onClick} type={BUTTON_CONSTANTS.TYPE.TEXT}>
        {t(t('customCertificate.generate'))}
      </Button>
    </Permission>
  )
}

const UserListAndFilters = () => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const eventManager = eventManagerSelector()
  const instituteType = useSelector(
    (store) => store.instituteInfo.institute_type
  )
  const {userType, templateId} = useParams()

  const data =
    userType === STUDENT ? getActiveStudents(true) : staffListSelector()
  const rolesList = roleListSelector()
  const [selectedRows, setSelectedRows] = useState([])
  const [loadingButton, showLoadingButton] = useState()
  const [showFilterModal, setShowFilter] = useState(false)
  const {data: templateDetails} = templateDetailsSelector()
  const [filters, setSelectedFilter] = useState({
    searchFilter: '',
    checkboxFilter: [],
  })

  const generatedDocumentStatus = generatedDocumentStatusSelector()
  const {data: multipleGenerateRequestId, isLoading} =
    multipleGenerateRequestIdSelector()

  const {clear, start, intervalId} = usePolling(
    () => {
      dispatch(
        globalActions.generatedDocumentStatus.request([
          multipleGenerateRequestId,
        ])
      )
    },
    {delay: 3000}
  )

  useEffect(() => {
    if (multipleGenerateRequestId && !intervalId) {
      start()
      showLoadingButton(true)
    }
    if (
      generatedDocumentStatus &&
      generatedDocumentStatus[0].file?.status == TEMPLATE_STATUS.COMPLETED
    ) {
      triggerEvent(CERTIFICATE_EVENTS.CERTIFICATE_DOWNLOADED_TFI, {
        screen: 'select_users',
      })
      downloadFromLink(
        generatedDocumentStatus[0].file?.url,
        `bulk-${new Date().toLocaleDateString()}-${new Date().toLocaleTimeString()}.zip`.replace(
          ' ',
          '-'
        )
      )
      showLoadingButton(false)
      dispatch(globalActions.generatedDocumentStatus.reset())
      dispatch(globalActions.bulkCertificateGenerate.reset())
      clear()
    }
  }, [multipleGenerateRequestId, generatedDocumentStatus])

  const bulkDownload = () => {
    const obj = {
      iids: [...selectedRows],
      template_id: templateId,
      default: templateDetails.default,
    }
    dispatch(globalActions.bulkCertificateGenerate.request(obj))
    setSelectedRows([])
  }

  const searchFilter = useFilter({
    data,
    keyToFilter: 'name',
    filterValue: filters.searchFilter,
  })

  const checkboxFilter = useFilter({
    data: searchFilter,
    keyToFilter: 'details.sections',
    filterValue: filters.checkboxFilter,
  })

  const {heirarchy, handleSelection, allselectedSections} =
    useInstituteHeirarchy({
      allSelected: false,
    })

  const formatStudentData = () => {
    const data = checkboxFilter.map((item) => {
      return {
        id: item._id,
        personal_info: <UserDetailsRow data={item} />,
        details: item?.hierarchy_nodes?.[0] || 'NA',
        action: <ActionButton user={item} triggerEvent={triggerEvent} />,
      }
    })
    return data
  }

  const formatStaffData = () => {
    const data = checkboxFilter
      .filter((i) => i.verification_status != 4)
      .map((item) => {
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
          action: <ActionButton user={item} triggerEvent={triggerEvent} />,
        }
      })
    return data
  }

  const getRows = () => {
    if (userType === STUDENT) {
      return formatStudentData()
    } else return formatStaffData()
  }

  const onSelectAll = (isSelected) => {
    const selected = []
    triggerEvent(
      CERTIFICATE_EVENTS.CERTIFICATE_SELECT_ALL_CHECKBOX_CLICKED_TFI,
      {
        checked: isSelected,
      }
    )
    if (isSelected) {
      checkboxFilter.forEach((item) => selected.push(item._id))
    }
    setSelectedRows(selected)
  }

  const onSelectRow = (id, checked) => {
    triggerEvent(CERTIFICATE_EVENTS.CERTIFICATE_NAME_CHECKBOX_CLICKED_TFI, {
      user_id: id,
    })
    const newSelectedRows = [...selectedRows]
    if (checked) newSelectedRows.push(id)
    else if (newSelectedRows.indexOf(id) > -1) {
      newSelectedRows.splice(newSelectedRows.indexOf(id), 1)
    }
    setSelectedRows(newSelectedRows)
  }

  const updateFilter = (type, value) => {
    setSelectedFilter({...filters, [type]: value})
  }

  const triggerEvent = (eventName, data = {}) => {
    eventManager.send_event(eventName, {
      user_screen: userType,
      template_type: templateDetails?.default ? 'default' : 'my_templates',
      certificate_id: templateId,
      ...data,
    })
  }

  return (
    <>
      {userType && (
        <>
          <Loader show={isLoading} />
          <div className={styles.filterRow}>
            <SearchBar
              placeholder={t('seachByName')}
              handleChange={({value}) => {
                updateFilter('searchFilter', value)
              }}
              value={filters.searchFilter}
            />
            <div>
              {userType === STUDENT && (
                <>
                  <Button
                    prefixIcon="filter"
                    type={BUTTON_CONSTANTS.TYPE.OUTLINE}
                    onClick={() => setShowFilter(true)}
                  >
                    {t('filters')}
                  </Button>
                  <Modal
                    isOpen={showFilterModal}
                    size={MODAL_CONSTANTS.SIZE.MEDIUM}
                    onClose={() => setShowFilter(false)}
                    header={`${t('filter')}: ${t('classSection')}`}
                    classes={{
                      modal: styles.modal,
                      content: styles.modalContent,
                      footer: styles.modalFooter,
                    }}
                    actionButtons={[
                      {
                        body: t('close'),
                        onClick: () => setShowFilter(false),
                        type: 'outline',
                      },
                      {
                        body: t('apply'),
                        onClick: () => {
                          updateFilter('checkboxFilter', allselectedSections)
                          setShowFilter(false)
                        },
                      },
                    ]}
                  >
                    <ClassHeirarchy
                      heirarchy={heirarchy?.department}
                      handleSelection={handleSelection}
                    />
                  </Modal>
                </>
              )}
              {selectedRows.length > 1 && (
                <Permission
                  permissionId={
                    PERMISSION_CONSTANTS.documentController_generateBulk_create
                  }
                >
                  <Button
                    prefixIcon="download"
                    prefixIconVersion={BUTTON_CONSTANTS.ICON_VERSION.FILLED}
                    classes={{prefixIcon: styles.downloadIcon}}
                    onClick={() => {
                      triggerEvent(
                        CERTIFICATE_EVENTS.CERTIFICATE_BULK_DOWNLOAD_CLICKED_TFI,
                        {
                          user_ids: selectedRows,
                        }
                      )
                      bulkDownload()
                    }}
                  >
                    {t('customCertificate.bulkDownload')}
                  </Button>
                </Permission>
              )}
              {loadingButton && <LoadingPercentageButton small />}
            </div>
          </div>
          <div className={styles.tableContainer}>
            {getRows() && getRows().length > 0 ? (
              <Table
                virtualized
                isSelectable={true}
                cols={TABLE_COLS[userType](instituteType)}
                rows={getRows()}
                onSelectAll={onSelectAll}
                onSelectRow={onSelectRow}
                selectedRows={selectedRows}
                autoSize
                classes={{
                  table: styles.table,
                }}
              />
            ) : (
              <UserListEmptyState desc={t('noClassesMatchingFilter')} />
            )}
          </div>
        </>
      )}
    </>
  )
}

export default UserListAndFilters
