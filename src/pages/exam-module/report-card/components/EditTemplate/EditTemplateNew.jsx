import React, {useState, useEffect, useRef} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import {useParams, useHistory} from 'react-router-dom'
import {Button, BUTTON_CONSTANTS, Divider, Para, Popup} from '@teachmint/krayon'
import {createPortal} from 'react-dom'

import styles from './EditTemplate.module.css'
import LeftPanel from './components/LeftPanel/LeftPanel'
import RightPanel from './components/RightPanel/RightPanel'
import {
  convertTemplateFieldsIntoDataObj,
  validateTemplateFieldsObj,
} from './utils'
import {
  getTemplateFields,
  saveAsDraftAction,
  resetSavedFlag,
} from '../../redux/actions'
import REPORT_CARD_ROUTES from '../../ReportCard.routes'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../../../redux/actions/commonAction'
import Loader from '../../../../../components/Common/Loader/Loader'
// import NewPreviewTemplate from '../common/NewPreviewTemplate/NewPreviewTemplate'
import {RC_PREVIEW, TEMPLATE_SECTIONS_ID} from '../../constants'
import useResizeObserver from './hooks/useResizeObserver'
import useColResize from './hooks/useColResize'
import Permission from '../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../utils/permission.constants'
import {events} from '../../../../../utils/EventsConstants'

// const PREVIEW_TYPE = {
//   TEMP: 'temp',
//   FINAL: 'final',
// }

const RC_ORIENTATION = RC_PREVIEW.ORIENTATION
const A4 = RC_PREVIEW.PAGE_TYPE.A4
const {inchToPixel, pixelToInch} = RC_PREVIEW.CONVERTER

export default function EditTemplate() {
  const selectedTemplateFields = useSelector(
    ({reportCard}) => reportCard.selectedTemplateFields
  )
  const isSaved = useSelector(({reportCard}) => reportCard.isUpdated)
  const isTemplateApiInProgress = useSelector(
    ({reportCard}) => reportCard.templateApiInProgress
  )
  const eventManager = useSelector((state) => state.eventManager)
  const [templateField, setTemplateField] = useState(null)
  const [data, setData] = useState({
    show_student_details: true,
  })
  const [portalEl, setPortalEl] = useState(null)
  const [activeTab, setActiveTab] = useState(null)
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false)
  const [isPublish, setIsPublish] = useState(false)
  // const [showPreview, setShowPreview] = useState(false)
  const [disablePublish, setDisablePublish] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [orientation, setOrientation] = useState(RC_ORIENTATION.PORTRAIT)

  const dividerFlagRef = useRef()
  const highlighterRef = useRef()
  const rightContainerRef = useRef()
  const timeoutRef = useRef()
  const rightContainerWidthBeforeDrag = useRef()

  const previewAreaResized = useResizeObserver(rightContainerRef)

  const {t} = useTranslation()
  const dispatch = useDispatch()
  const {standardId} = useParams()
  const history = useHistory()

  useColResize(
    {
      target: dividerFlagRef?.current?.nextSibling,
      onResize: (xChange) => {
        const newWidth = Math.min(
          inchToPixel(A4[orientation].width),
          Math.max(400, rightContainerWidthBeforeDrag.current - xChange)
        )

        document.documentElement.style.setProperty(
          '--preview-width',
          `${newWidth}px`
        )
      },
      onResizeStart: () => {
        rightContainerWidthBeforeDrag.current =
          rightContainerRef?.current.offsetWidth
        userEventHandler(events.REPORT_CARD_TEMPLATE_PREVIEW_ZOOM_CLICKED_TFI, {
          class_id: standardId,
        })
      },
    },
    10
  )

  useEffect(() => {
    setPortalEl(document.getElementById('rightPanelPlaceholder'))
    return () => {
      dispatch(resetSavedFlag())
    }
  }, [])

  useEffect(() => {
    if (!selectedTemplateFields) return
    setTemplateField(selectedTemplateFields)
  }, [selectedTemplateFields])

  useEffect(() => {
    if (!templateField) return
    let convertedData = convertTemplateFieldsIntoDataObj(templateField)
    setData({
      ...data,
      ...convertedData,
    })
  }, [templateField])

  useEffect(() => {
    if (standardId) {
      dispatch(getTemplateFields({class_id: standardId}))
    }
  }, [standardId])

  useEffect(() => {
    if (isSaved) {
      history.push(`${REPORT_CARD_ROUTES.BASE_ROUTE}?open=${standardId}`)
      dispatch(showSuccessToast(t('templateSavedSuccessfully')))
    }
  }, [isSaved])

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      const target = rightContainerRef.current?.querySelector(
        `.preview-${activeTab}`
      )
      if (target) {
        const baseOffset =
          rightContainerRef.current?.querySelector('pageContainer') || 64 // in pixel
        const pageGutter = 20 // in pixel
        const bufferHeight = 20
        const availableWidth = rightContainerRef?.current?.offsetWidth
        const containerPaddingX =
          parseInt(
            window.getComputedStyle(rightContainerRef?.current).padding
          ) || 20
        const pageFullWidth = A4[orientation].width // in inch
        const currentPreviewWidthInInch = pixelToInch(
          availableWidth - 2 * containerPaddingX
        )
        const scaledFactor = currentPreviewWidthInInch / pageFullWidth
        const a4pageHeightInPixelScaled =
          inchToPixel(A4[orientation].height) * scaledFactor // in pixel

        let height = Math.ceil(
          target.offsetHeight * scaledFactor + bufferHeight
        )

        let top = Math.round(
          baseOffset + target.offsetTop * scaledFactor - bufferHeight / 2
        )

        // on which page top of highlight will be
        const topIntersectingPage = Math.ceil(
          top / (a4pageHeightInPixelScaled + pageGutter)
        )

        // on which page bottom of that highlight should lies
        const heightIntersectingPage = Math.ceil(
          (top + height) / (a4pageHeightInPixelScaled + pageGutter)
        )

        // if top of highlight is supposed to be on greater than first page
        // then need to add page gutter
        if (topIntersectingPage > 1) {
          // per page gutter
          top += (topIntersectingPage - 1) * pageGutter
        }

        // if bottom of highlight is supposed to be on different page than of top
        // that means highlight is covering multiple page, so pageGutters need to
        // be added in height to cover that difference
        if (heightIntersectingPage - topIntersectingPage >= 1) {
          height += (heightIntersectingPage - topIntersectingPage) * pageGutter
        }

        highlighterRef.current.style.height = `${height}px`
        highlighterRef.current.style.top = `${top}px`

        setTimeout(() => highlighterRef.current?.scrollIntoViewIfNeeded(), 300)
      }
    }, 200)
  }, [
    activeTab,
    data,
    timeoutRef,
    rightContainerRef,
    highlighterRef,
    orientation,
    previewAreaResized,
  ])

  const userEventHandler = (event, data) => {
    eventManager.send_event(event, {
      class_id: standardId,
      ...data,
    })
  }

  const handleChange = ({fieldName, value}) => {
    setData({...data, [fieldName]: value})
  }

  const handleObjToSave = (obj) => {
    setTemplateField({...obj})
  }

  const validateTemplateFields = (templateField) => {
    let res = validateTemplateFieldsObj(templateField)
    if (res?.error) {
      dispatch(showErrorToast(res.errorMsg))
      return false
    }
    return true
  }

  const preparePayload = () => {
    let fetchParams = [...templateField.template.fetch_params]
    let commonSubjectsIndex = fetchParams.findIndex(
      (item) =>
        item.meta.template_section_id === TEMPLATE_SECTIONS_ID.COMMON_SUBJECTS
    )
    if (commonSubjectsIndex === -1) {
      fetchParams.push(templateField.scholastic.common_subjects)
    } else {
      fetchParams[commonSubjectsIndex] =
        templateField.scholastic.common_subjects
    }
    let payload = {
      ...templateField,
      template: {
        ...templateField.template,
        fetch_params: fetchParams,
        published: isPublish,
      },
      class_id: standardId,
    }

    return payload
  }

  const saveTemplate = () => {
    const payload = preparePayload()
    userEventHandler(
      isPublish
        ? events.REPORT_CARD_PUBLISH_CLICKED_TFI
        : events.REPORT_CARD_SAVE_DRAFT_CLICKED_TFI,
      payload
    )
    if (payload) dispatch(saveAsDraftAction(payload))
  }

  // const getTemplateUrl = async () => {
  //   // const payload = preparePayload()
  //   // call preview API
  //   return {
  //     previewUrl:
  //       'https://teachmint-dev.storage.googleapis.com/8ba38279-3975-41e0-815d-e734b58b0de0/report-card/b118301a-560d-4312-85d2-564e411964f1.pdf',
  //   }
  // }

  return (
    <div className={styles.wrapper}>
      <Loader show={isTemplateApiInProgress} />
      {portalEl &&
        createPortal(
          <div className="flex gap-2">
            {!selectedTemplateFields?.template?.published && (
              <Permission
                permissionId={
                  PERMISSION_CONSTANTS.reportCardWebController_template_update
                }
              >
                <Button
                  type={BUTTON_CONSTANTS.TYPE.OUTLINE}
                  isDisabled={disablePublish}
                  onClick={() => {
                    // eventManager.send_event(
                    //   events.REPORT_CARD_UPLOAD_CSV_CLICKED_TFI,
                    //   {
                    //     class_id: classId,
                    //     section_id: sectionId,
                    //   }
                    // )
                    if (!validateTemplateFields(templateField)) return
                    setIsPublish(false)
                    saveTemplate()
                  }}
                >
                  {t('saveAsDraft')}
                </Button>
              </Permission>
            )}
            <Permission
              permissionId={
                PERMISSION_CONSTANTS.reportCardWebController_template_update
              }
            >
              <Button
                type={BUTTON_CONSTANTS.TYPE.FILLED}
                category={BUTTON_CONSTANTS.CATEGORY.CONSTRUCTIVE}
                isDisabled={disablePublish}
                onClick={() => {
                  // eventManager.send_event(
                  //   events.REPORT_CARD_UPLOAD_CSV_CLICKED_TFI,
                  //   {
                  //     class_id: classId,
                  //     section_id: sectionId,
                  //   }
                  // )
                  if (!validateTemplateFields(templateField)) return
                  setIsPublish(true)
                  setShowConfirmationPopup(true)
                }}
              >
                {t('publish')}
              </Button>
            </Permission>
          </div>,
          portalEl
        )}
      <LeftPanel
        data={data}
        setData={setData}
        handleChange={handleChange}
        objToSave={templateField}
        setObjToSave={handleObjToSave}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setDisablePublish={setDisablePublish}
        userEventHandler={userEventHandler}
      />
      <span ref={dividerFlagRef} />
      <Divider isVertical classes={{wrapper: styles.divider}} />
      <RightPanel
        data={data}
        highlighterRef={highlighterRef}
        rightContainerRef={rightContainerRef}
        // showPreview={() => setShowPreview(PREVIEW_TYPE.TEMP)}
        orientation={orientation}
      />
      {showConfirmationPopup && (
        <Popup
          isOpen
          header={t('publistReportCardTemplate')}
          onClose={() => setShowConfirmationPopup(false)}
          actionButtons={[
            {
              id: 'cancel-btn',
              body: t('cancel'),
              onClick: () => {
                setShowConfirmationPopup(false)
              },
              type: BUTTON_CONSTANTS.TYPE.OUTLINE,
              category: BUTTON_CONSTANTS.CATEGORY.DESTRUCTIVE,
            },
            {
              id: 'proceed-btn',
              body: t('proceed'),
              onClick: () => {
                setShowConfirmationPopup(false)
                saveTemplate()
              },
            },
          ]}
        >
          <Para className="mt-4">{t('publishReportCardTemplateMsg')}</Para>
        </Popup>
      )}
      {/* {showPreview == PREVIEW_TYPE.TEMP && (
        <NewPreviewTemplate
          onClose={() => setShowPreview(false)}
          getTemplateUrl={getTemplateUrl}
        />
      )} */}
      {/* {showPreview == PREVIEW_TYPE.FINAL && (
        <NewPreviewTemplate
          onClose={() => setShowPreview(false)}
          onSave={saveTemplate}
          getTemplateUrl={getTemplateUrl}
          previewOnly={false}
          header="Confirm template"
        />
      )} */}
    </div>
  )
}
