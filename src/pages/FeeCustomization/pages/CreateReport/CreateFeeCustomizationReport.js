import classNames from 'classnames'
import React, {useEffect, useMemo, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import {
  Prompt,
  useHistory,
  useLocation,
  useParams,
  useRouteMatch,
} from 'react-router-dom'
import {showErrorToast} from '../../../../redux/actions/commonAction'
import {sidebarData} from '../../../../utils/SidebarItems'
import CreateCustomReportModal from '../../../fee/components/FeeReports/components/CreateCustomReportModal/CreateCustomReportModal'
import {
  fetchInstalmentDateTimestampAction,
  fetchInstituteFeeTypesAction,
} from '../../../fee/redux/feeReports/feeReportsAction'
import {
  CRUDFeeCustomReportApi,
  FEE_CUSTOM_REPORT_CRUD,
} from '../../api/feeCustomization.api'
import {FEE_CUSTOMIZATION_ROUTES} from '../../constants/feeCustomization.routes.constants'
import Header from '../../components/Header/Header'
import {setEditorFieldsAction} from '../../redux/feeCustomization.actions'
import FeePivotTable from './components/FeePivotTable/FeePivotTable'
import FeePivotTableEditor from './components/FeePivotTableEditor/FeePivotTableEditor'
import styles from './CreateFeeCustomizationReport.module.css'
import globalActions from '../../../../redux/actions/global.actions'
import {
  convertValueArrToObj,
  ignoreExtraFields,
} from '../../utils/feeCustomization.state.helpers'
import LoaderScreen from '../../components/LoaderScreen/LoaderScreen'
import lottieLoader from '../../lottie/dataLoader.json'
import useGetDateFilterRange, {
  DATE_FILTER,
  DATE_FILTER_API_REQUEST,
  DATE_FILTER_API_RESPONSE,
} from '../../../../hooks/useFilterDateRange'
import {PIVOT_TABLE_EDITOR_DATA_FIELDS} from '../../constants/feeCustomization.editor.constants'
import FeeCustomizationPropmpt from '../../components/FeeCustomizationPropmpt/FeeCustomizationPropmpt'
import {
  BUTTON_CONSTANTS,
  Icon,
  IconFrame,
  ICON_CONSTANTS,
  ICON_FRAME_CONSTANTS,
} from '@teachmint/krayon'
import isEqual from 'lodash.isequal'
import {events} from '../../../../utils/EventsConstants'
import useFeeDownloadReport from '../../hooks/useFeeDownloadReport'

function CreateFeeCustomizationReport({location}) {
  const eventManager = useSelector((state) => state.eventManager)
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const history = useHistory()
  const search = useLocation().search
  const _title = new URLSearchParams(search)?.get('title')
  const [title, setTitle] = useState(_title || location.record?.name)
  const [disablePublishBtn, setdisablePublishBtn] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [pendingRoute, setPendingRoute] = useState(null)
  const viewRoute = useRouteMatch({
    path: FEE_CUSTOMIZATION_ROUTES.VIEW.fullPath,
    strict: true,
  })
  const editRoute = useRouteMatch({
    path: FEE_CUSTOMIZATION_ROUTES.EDIT.fullPath,
    strict: true,
  })
  const {id: templateId} = useParams()
  const [openEditor, setopenEditor] = useState(!viewRoute)
  const instalmentTimestampList = useSelector(
    (state) => state.feeReports.instalmentTimestampList
  )
  const feeTypeList = useSelector((state) => state.feeReports.feeTypeList)
  const templateEditorData = useSelector(
    (state) => state.globalData.templateEditor
  )
  const editorData = useSelector((state) => state.feeCustomization.editor)
  const [routeLocked, setrouteLocked] = useState(false)
  const tableRef = useRef(null)
  const editorRef = useRef(null)

  const defaultDate = useMemo(() => {
    const dateRange = structuredClone(
      templateEditorData?.data?.dateRange || location.record?.dateRange
    )
    const dateValue = structuredClone(
      DATE_FILTER[DATE_FILTER_API_RESPONSE[dateRange?.type]]
    )
    if (dateRange?.type) {
      if (dateRange?.type === DATE_FILTER_API_REQUEST.CUSTOM) {
        dateValue.meta = {
          startDate: dateRange.from,
          endDate: dateRange.to,
          key: 'selection',
        }
      }
      return dateValue
    }
  }, [templateEditorData?.data, location?.record])

  const dateApiReq = useGetDateFilterRange({defaultDate})
  const {downloadExcel, isLoading: DownloadReportLoading} =
    useFeeDownloadReport()

  // Needed to populate filter fields
  useEffect(() => {
    !instalmentTimestampList?.length &&
      dispatch(fetchInstalmentDateTimestampAction())
    !feeTypeList?.length && dispatch(fetchInstituteFeeTypesAction())

    return () => {
      dispatch(setEditorFieldsAction({}))
      dispatch(globalActions.templateEditor.success(null))
      dispatch(globalActions.pivotTableData.success(null))
    }
  }, [])

  useEffect(() => {
    if (
      (editorData?.rows?.length || editorData?.columns?.length) &&
      editorData?.values?.length
    ) {
      setdisablePublishBtn(false)
    } else {
      setdisablePublishBtn(true)
    }
  }, [editorData])

  useEffect(() => {
    const tempData = structuredClone(
      templateEditorData?.data || location.record
    )
    const data = ignoreExtraFields(tempData)
    const changedObj = ignoreExtraFields(editorData)
    //  edit or view mode and create mode
    if (
      tempData?.name ||
      ((changedObj?.rows?.length || changedObj?.columns?.length) &&
        changedObj?.values?.length)
    ) {
      const editorFieldsChanged = !isEqual(changedObj, data)
      const titleChange = !isEqual(tempData?.name, title)
      setrouteLocked(editorFieldsChanged || titleChange)
    }
  }, [templateEditorData, location.record, editorData, title])

  useEffect(() => {
    if (!location.record) {
      if (editRoute || viewRoute) {
        dispatch(globalActions.templateEditor.request(templateId))
      }
    }
  }, [location])

  useEffect(() => {
    if (dateApiReq) {
      let data
      if (templateEditorData?.data) {
        data = structuredClone(templateEditorData.data)
      } else {
        data = structuredClone(location.record)
      }
      if (data) {
        data.dateRange = {
          ...data.dateRange,
          ...dateApiReq,
        }
        setEditorFieldsToRedux(data)
        data?.name && setTitle(data?.name)
      }
    }
  }, [dateApiReq])

  const setEditorFieldsToRedux = (record) => {
    const obj = {}
    Object.values(PIVOT_TABLE_EDITOR_DATA_FIELDS).forEach((key) => {
      obj[key] = record[key]
    })
    dispatch(setEditorFieldsAction(obj))
  }

  const handlePublish = async () => {
    setdisablePublishBtn(true)
    const _editorData = structuredClone(convertValueArrToObj(editorData))
    _editorData.dateRange = {
      ..._editorData.dateRange,
    }
    const res = await CRUDFeeCustomReportApi({
      type:
        editRoute || viewRoute
          ? FEE_CUSTOM_REPORT_CRUD.UPDATE
          : FEE_CUSTOM_REPORT_CRUD.CREATE,
      json: {
        ..._editorData,
        name: title?.trim(),
        ...(editRoute || viewRoute ? {template_id: templateId} : {}),
      },
    })
    if (res.status) {
      history.replace(sidebarData.FEE_REPORTS.route)
    } else {
      dispatch(showErrorToast(res.msg || 'Something went wrong'))
    }
    eventManager.send_event(events.FEE_REPORTS_CUSTOM_PUBLISH_CLICKED_TFI, {
      ...(editRoute || viewRoute ? {template_id: templateId} : {}),
    })
  }

  const handleDownload = () => {
    const {selectedFilterValues, dateApiReq} = editorRef.current
    const {RenderTable} = tableRef.current
    downloadExcel({
      RenderTable,
      selectedFilterValues,
      dateApiReq,
      title,
    })
    eventManager.send_event(events.FEE_REPORTS_CUSTOM_DOWNLOAD_CLICKED_TFI, {
      ...(editRoute || viewRoute ? {template_id: templateId} : {}),
    })
  }

  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.tableCollapse]: openEditor,
      })}
    >
      {DownloadReportLoading ? (
        <LoaderScreen
          lottie={lottieLoader}
          heading={t('createReport')}
          para={t('createReportPara')}
        />
      ) : null}
      {templateEditorData.isLoading ? (
        <LoaderScreen
          lottie={lottieLoader}
          heading={t('createReport')}
          para={t('createReportPara')}
        />
      ) : (
        <>
          <Header
            actionButtons={[
              {
                category: 'primary',
                children: t('download'),
                classes: {
                  button: styles.downloadBtn,
                },
                onClick: handleDownload,
                prefixIcon: 'download',
                size: BUTTON_CONSTANTS.SIZE.SMALL,
                type: BUTTON_CONSTANTS.TYPE.TEXT,
                width: 'fit',
                isDisabled: disablePublishBtn,
              },
              {
                category: 'primary',
                children: t('publish'),
                classes: {},
                onClick: () => {
                  setrouteLocked(false)
                  handlePublish()
                },
                size: BUTTON_CONSTANTS.SIZE.SMALL,
                type: openEditor
                  ? BUTTON_CONSTANTS.TYPE.FILLED
                  : BUTTON_CONSTANTS.TYPE.OUTLINE,
                width: 'fit',
                isDisabled: disablePublishBtn,
              },
              ...(openEditor
                ? []
                : [
                    {
                      category: 'primary',
                      children: t('cutomizeReport'),
                      classes: {},
                      onClick: () => {
                        setopenEditor(true)
                      },
                      size: BUTTON_CONSTANTS.SIZE.SMALL,
                      type: BUTTON_CONSTANTS.TYPE.FILLED,
                      width: 'fit',
                    },
                  ]),
            ]}
            onEditClick={() => {
              setShowEditModal(true)
              eventManager.send_event(
                events.FEE_REPORTS_CUSTOM_EDIT_CLICKED_TFI,
                {
                  custom_report_id: templateId,
                  screen_name: 'name_click',
                }
              )
            }}
            title={title}
          />
          <div className={styles.bodyWrapper}>
            <div className={classNames(styles.tableWrapper, {})}>
              <FeePivotTable ref={tableRef} />
            </div>

            <div
              className={classNames(
                styles.editorWrapper,
                'show-scrollbar show-scrollbar-small',
                {[styles.open]: openEditor}
              )}
            >
              <IconFrame
                size={ICON_FRAME_CONSTANTS.SIZES.LARGE}
                className={classNames(styles.closeBtn)}
                onClick={() => setopenEditor(false)}
              >
                <Icon
                  name={'arrowForwardIos'}
                  size={ICON_CONSTANTS.SIZES.XXX_SMALL}
                />
              </IconFrame>
              <FeePivotTableEditor
                ref={editorRef}
                disablePublishBtn={(val) => setdisablePublishBtn(val)}
              />
            </div>
          </div>
          {showEditModal ? (
            <CreateCustomReportModal
              onClose={() => {
                setShowEditModal(false)
              }}
              btnText={t('update')}
              onClick={(value) => {
                setShowEditModal(false)
                setTitle(value)
              }}
              title={title}
            />
          ) : null}
        </>
      )}
      <Prompt
        when={routeLocked}
        message={(location) => {
          setPendingRoute(location.pathname)
          return false
        }}
      />
      {pendingRoute ? (
        <FeeCustomizationPropmpt
          title={t('unpublisedRedport')}
          desc={t('feeCustomisationReset')}
          showCloseIcon
          onClose={() => setPendingRoute(null)}
          actionButtons={[
            {
              body: t('exitWithoutSaving'),
              onClick: () => {
                setrouteLocked(false)
                setTimeout(() => {
                  history.push(pendingRoute)
                }, 0)
                eventManager.send_event(
                  events.FEE_REPORTS_CUSTOM_EXIT_POPUP_CLICKED_TFI,
                  {
                    action: 'exit_without_saving',
                  }
                )
              },
              type: 'outline',
              size: BUTTON_CONSTANTS.SIZE.MEDIUM,
              classes: {button: styles.btn},
            },
            {
              body: t('publish'),
              onClick: () => {
                setrouteLocked(false)
                setTimeout(() => {
                  handlePublish()
                }, 0)
                eventManager.send_event(
                  events.FEE_REPORTS_CUSTOM_EXIT_POPUP_CLICKED_TFI,
                  {
                    action: 'publish',
                  }
                )
              },
              category: BUTTON_CONSTANTS.CATEGORY.PRIMARY,
              size: BUTTON_CONSTANTS.SIZE.MEDIUM,
              classes: {button: styles.btn},
            },
          ]}
        />
      ) : null}
    </div>
  )
}

export default CreateFeeCustomizationReport
