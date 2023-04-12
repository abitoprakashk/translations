import React, {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import Loader from '../../../../../../components/Common/Loader/Loader'
import ErrorScreen from '../../../../../FeeCustomization/pages/CreateReport/components/FeePivotTable/ErrorScreen'
import EmptyScreen from './EmptyScreen'
import FeeCard from '../FeeCard/FeeCard'
import classNames from 'classnames'
import {
  BUTTON_CONSTANTS,
  Icon,
  IconFrame,
  ICON_CONSTANTS,
  ICON_FRAME_CONSTANTS,
  KebabMenu,
} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'
import {generatePath, useHistory} from 'react-router-dom'
import {FEE_CUSTOMIZATION_ROUTES} from '../../../../../FeeCustomization/constants/feeCustomization.routes.constants'
import {
  CRUDFeeCustomReportApi,
  deleteFeeCustomizationReportAPI,
  FEE_CUSTOM_REPORT_CRUD,
} from '../../../../../FeeCustomization/api/feeCustomization.api'
import {showErrorToast} from '../../../../../../redux/actions/commonAction'
import CreateCustomReportModal from '../CreateCustomReportModal/CreateCustomReportModal'
import {Button} from '@teachmint/common'
import {events} from '../../../../../../utils/EventsConstants'
import styles from './styles.module.css'
import DeleteModal from './DeleteModal'
import {convertValueArrToObj} from '../../../../../FeeCustomization/utils/feeCustomization.state.helpers'

function CustomReports({getCustomReportsData}) {
  const {t} = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  const eventManager = useSelector((state) => state.eventManager)
  const [showLoader, setshowLoader] = useState(false)
  const [isNewReport, setisNewReport] = useState(false)
  const [selectedReport, setselectedReport] = useState(null)
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [showCreateCustomReportModal, setshowCreateCustomReportModal] =
    useState(false)
  const {isLoading, error, data} = useSelector(
    (state) => state.globalData.feeCustomReports
  )

  const handleAddEditReport = async (value) => {
    if (isNewReport) {
      setshowCreateCustomReportModal(false)
      history.push(FEE_CUSTOMIZATION_ROUTES.CREATE.fullPath + `?title=${value}`)
      eventManager.send_event(
        events.FEE_REPORTS_CREATE_CUSTOM_PROCEED_CLICKED_TFI,
        {
          report_name: value,
        }
      )
    } else {
      setshowCreateCustomReportModal(false)
      let _selectedReport = structuredClone(
        convertValueArrToObj(selectedReport)
      )
      _selectedReport = {
        ..._selectedReport,
        template_id: selectedReport._id,
        name: value,
      }
      delete _selectedReport._id
      const res = await CRUDFeeCustomReportApi({
        type: FEE_CUSTOM_REPORT_CRUD.UPDATE,
        json: _selectedReport,
      })
      if (res.status) {
        getCustomReportsData()
      } else {
        dispatch(showErrorToast(res.msg || 'Something went wrong'))
      }
      eventManager.send_event(
        events.FEE_REPORTS_CUSTOM_NAME_EDIT_DONE_CLICKED_TFI,
        {
          report_name: value,
        }
      )
    }
  }

  const onEdit = (record) => {
    history.push({
      pathname: generatePath(FEE_CUSTOMIZATION_ROUTES.EDIT.fullPath, {
        id: record._id,
      }),
      record,
    })
    eventManager.send_event(events.FEE_REPORTS_CUSTOM_EDIT_CLICKED_TFI, {
      custom_report_id: record._id,
      screen_name: '3-dots',
    })
  }
  const onDelete = async () => {
    const id = selectedReport._id
    setshowLoader(true)
    setShowDeletePopup(false)
    eventManager.send_event(
      events.FEE_REPORTS_CUSTOM_DELETE_POPUP_CLICKED_TFI,
      {
        custom_report_id: id,
        action: 'delete',
      }
    )
    const res = await deleteFeeCustomizationReportAPI(id)
    if (res.status) {
      getCustomReportsData()
    } else {
      dispatch(showErrorToast(res.msg || 'Something went wrong'))
    }
    setshowLoader(false)
  }
  const onRename = (record) => {
    setselectedReport(record)
    setisNewReport(false)
    setshowCreateCustomReportModal(true)
    eventManager.send_event(events.FEE_REPORTS_CUSTOM_NAME_EDIT_CLICKED_TFI, {
      screen_name: '3 - dots ',
    })
  }

  const RenderUI = () => {
    if (isLoading) return <Loader show />
    if (error)
      return (
        <div className="relative w-full">
          <ErrorScreen getData={getCustomReportsData} />
        </div>
      )
    if (data?.length)
      return (
        <div className={classNames('flex', styles.customCardWrapper)}>
          <FeeCard
            className={classNames(
              `flex justify-center items-center`,
              styles.customCard
            )}
            onClick={() => {
              setisNewReport(true)
              setshowCreateCustomReportModal(true)
              eventManager.send_event(
                events.FEE_REPORTS_CREATE_CUSTOM_CLICKED_TFI
              )
            }}
          >
            <FeeCard.Header>
              <IconFrame
                className={classNames(styles.addFrame)}
                size={ICON_FRAME_CONSTANTS.SIZES.LARGE}
                type="basic"
              >
                <Icon name="add" type="inverted" />
              </IconFrame>
            </FeeCard.Header>
            <FeeCard.Body>
              <Button
                className={classNames('mt-4', styles.btn)}
                size={BUTTON_CONSTANTS.SIZE.SMALL}
              >
                {t('createCustomReports')}
              </Button>
            </FeeCard.Body>
          </FeeCard>
          {data.map((record) => (
            <FeeCard
              className={styles.customCard}
              key={record._id}
              onClick={(e) => {
                if (!e.target.closest('[data-qa="kebab"]'))
                  history.push({
                    pathname: generatePath(
                      FEE_CUSTOMIZATION_ROUTES.VIEW.fullPath,
                      {
                        id: record._id,
                      }
                    ),
                    record,
                  })
              }}
            >
              <FeeCard.Header>
                <IconFrame
                  className={styles.frame}
                  size={ICON_FRAME_CONSTANTS.SIZES.LARGE}
                  type={ICON_FRAME_CONSTANTS.TYPES.SUCCESS}
                >
                  <Icon
                    size={ICON_CONSTANTS.SIZES.X_SMALL}
                    name="tableView"
                    type={ICON_CONSTANTS.TYPES.INVERTED}
                  />
                </IconFrame>
                <KebabMenu
                  isVertical
                  classes={{tooltipWrapper: styles.tooltipWrapper}}
                  options={[
                    {
                      content: t('edit'),
                      handleClick: () => onEdit(record),
                    },
                    {
                      content: t('rename'),
                      handleClick: () => onRename(record),
                    },
                    {
                      content: t('delete'),
                      handleClick: () => {
                        setselectedReport(record)
                        setShowDeletePopup(true)
                        eventManager.send_event(
                          events.FEE_REPORTS_CUSTOM_DELETE_CLICKED_TFI,
                          {
                            custom_report_id: record._id,
                          }
                        )
                      },
                    },
                  ]}
                />
              </FeeCard.Header>
              <FeeCard.Header>
                <div className={styles.title}>{record.name}</div>
                <Icon
                  name="arrowForwardIos"
                  size={ICON_CONSTANTS.SIZES.XX_SMALL}
                />
              </FeeCard.Header>
            </FeeCard>
          ))}
        </div>
      )
    return (
      <EmptyScreen
        onClick={() => {
          setisNewReport(true)
          setshowCreateCustomReportModal(true)
          eventManager.send_event(events.FEE_REPORTS_CREATE_CUSTOM_CLICKED_TFI)
        }}
      />
    )
  }

  return (
    <>
      <RenderUI />
      <Loader showLoader={showLoader} />
      {showCreateCustomReportModal ? (
        <CreateCustomReportModal
          onClick={handleAddEditReport}
          btnText={isNewReport ? t('proceed') : t('update')}
          title={isNewReport ? '' : selectedReport?.name}
          onClose={() => {
            setshowCreateCustomReportModal(false)
          }}
        />
      ) : null}
      {showDeletePopup ? (
        <DeleteModal
          setShowDeletePopup={setShowDeletePopup}
          onDelete={onDelete}
          selectedReport={selectedReport}
        />
      ) : null}
    </>
  )
}

export default CustomReports
