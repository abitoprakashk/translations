import React, {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {ErrorBoundary} from '@teachmint/common'
import {
  Accordion,
  Badges,
  BADGES_CONSTANTS,
  Button,
  BUTTON_CONSTANTS,
  Divider,
  EmptyState,
  Heading,
  HEADING_CONSTANTS,
  Icon,
  IconFrame,
  ICON_CONSTANTS,
  Para,
  Tooltip,
} from '@teachmint/krayon'
import classNames from 'classnames'
import {Trans, useTranslation} from 'react-i18next'
import {IS_MOBILE} from '../../../../../constants'
import SectionCard from './components/SectionCard/SectionCard'

import styles from './NewClassList.module.css'
import Loader from '../../../../../components/Common/Loader/Loader'
import {generatePath, useHistory} from 'react-router-dom'
import REPORT_CARD_ROUTES from '../../ReportCard.routes'
import {useSelector} from 'react-redux'
import {events} from '../../../../../utils/EventsConstants'
import Permission from '../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../utils/permission.constants'
import {sidebarData} from '../../../../../utils/SidebarItems'

const ImportReportCard = lazy(() =>
  import('./components/ImportReportCard/ImportReportCard')
)
const NewPreviewTemplate = lazy(() =>
  import('../common/NewPreviewTemplate/NewPreviewTemplate')
)

const ReportCardNotAvailableOnMobile = () => {
  return (
    <Para>
      <Trans key="reportCardNotCreatedDesktop">
        Report card structure not created,
        <br /> <span className={styles.highlight}>Go to Desktop</span> to create
        one!
      </Trans>
    </Para>
  )
}

const ImportButton = ({
  standard,
  onlyThisClassHasStructure,
  canImportReportCard = false,
}) => {
  return canImportReportCard && standard.id !== onlyThisClassHasStructure ? (
    <Permission
      permissionId={PERMISSION_CONSTANTS.reportCardWebController_copy_update}
    >
      <>
        <IconFrame
          className={styles.btn}
          data-standard-id={standard.id}
          data-btn-type={BUTTON_TYPE.IMPORT_TEMPLATE}
          data-for="importTemplateTooltip"
          data-tip
        >
          <Icon
            name="systemUpdateAlt"
            size={ICON_CONSTANTS.SIZES.XX_SMALL}
            type={ICON_CONSTANTS.TYPES.PRIMARY}
          />
        </IconFrame>
        <Tooltip
          place="left"
          toolTipBody="Import"
          toolTipId="importTemplateTooltip"
        />
      </>
    </Permission>
  ) : null
}

const BUTTON_TYPE = {
  IMPORT_TEMPLATE: 'importTemplate',
  PREVIEW_TEMPLATE: 'previewTemplate',
  EDIT_TEMPLATE: 'editTemplate',
  CUSTOMISE_TEMPLATE: 'customiseTemplate',
  CONTINUE_DRAFT: 'continueDraft',
}

const NewClassList = ({classes = [], standardList = {}}) => {
  const [defaultOpen, setDefaultOpen] = useState(null)
  const [showImport, setShowImport] = useState({})
  const [showPreview, setShowPreview] = useState({})
  const {t} = useTranslation()
  const containerRef = useRef()

  const history = useHistory()
  const eventManager = useSelector((state) => state.eventManager)

  const [canImportReportCard, onlyThisClassHasStructure] = useMemo(() => {
    const standardsWithStructure = Object.values(standardList).filter(
      ({template_details}) => template_details?.published
    )
    return [
      standardsWithStructure.length > 0,
      standardsWithStructure.length == 1 ? standardsWithStructure[0]._id : null,
    ]
  }, [standardList])

  useEffect(() => {
    let location = new URLSearchParams(window.location.search)
    const open = location.get('open')
    if (open) {
      setDefaultOpen(open)
      setTimeout(() => {
        containerRef.current
          ?.querySelector(`#accoridan${open}`)
          ?.scrollIntoView(true)
      }, 100)
    }
  }, [])

  const closeImportModal = useCallback(
    (standardId) => setShowImport({[standardId]: false}),
    []
  )

  const closePreviewModal = useCallback(
    (standardId) => setShowPreview({[standardId]: false}),
    []
  )

  const getTemplateUrl = useCallback(
    async (standard) => {
      return {previewUrl: standardList[standard.id]?.template_details?.url}
    },
    [standardList]
  )

  const clickHandler = useCallback(
    (e) => {
      let standardId = e.target?.dataset?.standardId
      let btnType = e.target?.dataset?.btnType

      if (!standardId) {
        const closest = e.target?.closest('[data-standard-id]')
        standardId = closest?.dataset?.standardId
        btnType = closest?.dataset?.btnType
      }

      if (
        standardId &&
        (btnType == BUTTON_TYPE.EDIT_TEMPLATE ||
          btnType == BUTTON_TYPE.CONTINUE_DRAFT)
      ) {
        eventManager.send_event(
          btnType == BUTTON_TYPE.CONTINUE_DRAFT
            ? events.REPORT_CARD_CONTINUE_DRAFT_CLICKED_TFI
            : events.REPORT_CARD_EDIT_CLICKED_TFI,
          {
            class_id: standardId,
            template_id: standardList[standardId]?.template_details?._id,
          }
        )

        history.replace(`${REPORT_CARD_ROUTES.BASE_ROUTE}?open=${standardId}`)
        history.push(
          generatePath(REPORT_CARD_ROUTES.EDIT_TEMPLATE, {
            standardId,
          })
        )
      }

      if (standardId && btnType == BUTTON_TYPE.IMPORT_TEMPLATE) {
        setShowImport({[standardId]: true})
        eventManager.send_event(
          events.REPORT_CARD_IMPORT_INITIALIZED_CLICKED_TFI,
          {
            class_id: standardId,
          }
        )
      }

      if (standardId && btnType == BUTTON_TYPE.PREVIEW_TEMPLATE) {
        setShowPreview({[standardId]: true})
        eventManager.send_event(events.REPORT_CARD_PREVIEW_CLICKED_TFI, {
          class_id: standardId,
          template_id: standardList[standardId]?.template_details?._id,
        })
      }
    },
    [eventManager]
  )

  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.mobile]: IS_MOBILE,
      })}
      ref={containerRef}
      onClick={clickHandler}
    >
      {classes.map((standard, index) => (
        <Accordion
          key={standard.id}
          allowHeaderClick
          headerContent={
            <>
              <Heading
                textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}
                weight={HEADING_CONSTANTS.WEIGHT.SEMIBOLD}
              >
                Class {standard.name}
              </Heading>
              {standardList[standard.id]?.template_details?.published ===
                true && (
                <Badges
                  label={t('created')}
                  showIcon
                  iconName="checkCircle1"
                  inverted
                  type={BADGES_CONSTANTS.TYPE.SUCCESS}
                  size={BADGES_CONSTANTS.SIZE.SMALL}
                  className={styles.headingBadge}
                />
              )}
              {standardList[standard.id]?.template_details?.published ===
                false && (
                <Badges
                  label={t('draft')}
                  showIcon={false}
                  inverted
                  type={BADGES_CONSTANTS.TYPE.WARNING}
                  size={BADGES_CONSTANTS.SIZE.SMALL}
                  className={styles.headingBadge}
                />
              )}
            </>
          }
          classes={{
            accordionBody: classNames(styles.accordionBody, {
              [styles.importReportCard]:
                canImportReportCard &&
                !standardList[standard.id]?.template_details?.published,
            }),
          }}
          isOpen={defaultOpen ? defaultOpen == standard.id : index == 0}
          id={`accoridan${standard.id}`}
        >
          <ErrorBoundary>
            {!standardList[standard.id]?.has_subject ? (
              <EmptyState
                iconName="assignment"
                content={t('noSubjectsFoundInClass')}
                button={{
                  children: t('addSubject'),
                  onClick: () => history.push(sidebarData.SCHOOL_SETUP.route),
                }}
                classes={{iconFrame: styles.white, wrapper: styles.emptyState}}
              />
            ) : (
              <>
                {standardList[standard.id]?.template_details ? (
                  <>
                    {standardList[standard.id]?.template_details?.published ===
                    false ? (
                      <EmptyState
                        iconName="assignment"
                        content={
                          IS_MOBILE ? (
                            <ReportCardNotAvailableOnMobile />
                          ) : (
                            t('reportCardNotCreated')
                          )
                        }
                        button={
                          !IS_MOBILE
                            ? {
                                children: t('continueDraft'),
                                'data-standard-id': standard.id,
                                'data-btn-type': BUTTON_TYPE.CONTINUE_DRAFT,
                              }
                            : false
                        }
                        classes={{
                          iconFrame: styles.white,
                          wrapper: styles.emptyState,
                        }}
                      />
                    ) : (
                      <div className={classNames(styles.sectionGrid)}>
                        {standardList[standard.id]?.section.map((section) => (
                          <SectionCard
                            key={section._id}
                            section={section}
                            standard={standard}
                            setDefaultOpen={setDefaultOpen}
                          />
                        ))}
                      </div>
                    )}
                    {!IS_MOBILE && (
                      <>
                        <Divider isVertical className={styles.divider} />
                        <div className={styles.previewContainer}>
                          <div className={styles.preview}>
                            {standardList[standard.id]?.template_details
                              ?.url && (
                              <embed
                                src={`${
                                  standardList[standard.id]?.template_details
                                    ?.url
                                }#toolbar=0&navpanes=0&scrollbar=0`}
                              />
                            )}
                          </div>
                          <div
                            className={classNames(styles.btnGroup, {
                              [styles.contentCenter]:
                                standardList[standard.id]?.template_details
                                  ?.published === false,
                            })}
                          >
                            {standardList[standard.id]?.template_details
                              ?.published === false ? (
                              <>
                                <ImportButton
                                  standard={standard}
                                  onlyThisClassHasStructure={
                                    onlyThisClassHasStructure
                                  }
                                />
                                <IconFrame
                                  className={styles.btn}
                                  data-for="previewTooltip"
                                  data-tip
                                  data-btn-type={BUTTON_TYPE.PREVIEW_TEMPLATE}
                                  data-standard-id={standard.id}
                                >
                                  <Icon
                                    name="eye1"
                                    size={ICON_CONSTANTS.SIZES.XX_SMALL}
                                    type={ICON_CONSTANTS.TYPES.PRIMARY}
                                  />
                                </IconFrame>

                                <Tooltip
                                  place="left"
                                  toolTipBody="Preview"
                                  toolTipId="previewTooltip"
                                />
                              </>
                            ) : (
                              <>
                                <ImportButton
                                  standard={standard}
                                  onlyThisClassHasStructure={
                                    onlyThisClassHasStructure
                                  }
                                  canImportReportCard={canImportReportCard}
                                />

                                <IconFrame
                                  className={styles.btn}
                                  data-for="previewTooltip"
                                  data-tip
                                  data-btn-type={BUTTON_TYPE.PREVIEW_TEMPLATE}
                                  data-standard-id={standard.id}
                                >
                                  <Icon
                                    name="eye1"
                                    size={ICON_CONSTANTS.SIZES.XX_SMALL}
                                    type={ICON_CONSTANTS.TYPES.PRIMARY}
                                  />
                                </IconFrame>
                                <Tooltip
                                  place="left"
                                  toolTipBody="Preview"
                                  toolTipId="previewTooltip"
                                />

                                <Permission
                                  permissionId={
                                    PERMISSION_CONSTANTS.reportCardWebController_getTemplate_read
                                  }
                                >
                                  <IconFrame
                                    className={styles.btn}
                                    data-standard-id={standard.id}
                                    data-btn-type={BUTTON_TYPE.EDIT_TEMPLATE}
                                    data-for="editTemplateTooltip"
                                    data-tip
                                  >
                                    <Icon
                                      name="edit2"
                                      size={ICON_CONSTANTS.SIZES.XX_SMALL}
                                      type={ICON_CONSTANTS.TYPES.PRIMARY}
                                    />
                                  </IconFrame>
                                  <Tooltip
                                    place="left"
                                    toolTipBody="Edit"
                                    toolTipId="editTemplateTooltip"
                                  />
                                </Permission>

                                {/* <IconFrame
                                className={styles.btn}
                                data-for="customizeTooltip"
                                data-tip
                              >
                                <Icon
                                  name="formatShapes"
                                  size={ICON_CONSTANTS.SIZES.XX_SMALL}
                                  type={ICON_CONSTANTS.TYPES.PRIMARY}
                                />
                              </IconFrame>
                              <Tooltip
                                place="left"
                                toolTipBody="Customise"
                                toolTipId="customizeTooltip"
                              /> */}
                              </>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </>
                ) : canImportReportCard ? (
                  <div className={classNames(styles.emptyWithImport)}>
                    <EmptyState
                      iconName="assignment"
                      content={
                        IS_MOBILE ? (
                          <ReportCardNotAvailableOnMobile />
                        ) : (
                          t('reportCardNotCreated')
                        )
                      }
                      button={false}
                      classes={{
                        iconFrame: styles.white,
                        wrapper: styles.emptyState,
                      }}
                    />
                    {!IS_MOBILE && (
                      <div
                        className={classNames(
                          styles.importBtnGroup,
                          styles.justifyCenter
                        )}
                      >
                        <Button
                          data-standard-id={standard.id}
                          data-btn-type={BUTTON_TYPE.EDIT_TEMPLATE}
                          onClick={() => {
                            eventManager.send_event(
                              events.REPORT_CARD_CREATE_STRUCTURE_CLICKED_TFI,
                              {class_id: standard.id}
                            )
                          }}
                        >
                          {t('create')}
                        </Button>
                        <Permission
                          permissionId={
                            PERMISSION_CONSTANTS.reportCardWebController_copy_update
                          }
                        >
                          <Button
                            type={BUTTON_CONSTANTS.TYPE.OUTLINE}
                            classes={{button: styles.importBtn}}
                            data-standard-id={standard.id}
                            data-btn-type={BUTTON_TYPE.IMPORT_TEMPLATE}
                          >
                            {t('import')}
                          </Button>
                        </Permission>
                      </div>
                    )}
                  </div>
                ) : (
                  <EmptyState
                    iconName="assignment"
                    content={
                      IS_MOBILE ? (
                        <ReportCardNotAvailableOnMobile />
                      ) : (
                        t('reportCardNotCreated')
                      )
                    }
                    button={{
                      children: t('create'),
                      'data-standard-id': standard.id,
                      'data-btn-type': 'editTemplate',
                      onClick: () =>
                        eventManager.send_event(
                          events.REPORT_CARD_CREATE_STRUCTURE_CLICKED_TFI,
                          {class_id: standard.id}
                        ),
                    }}
                    classes={{
                      iconFrame: styles.white,
                      wrapper: styles.emptyState,
                    }}
                  />
                )}
              </>
            )}
          </ErrorBoundary>

          {showImport[standard.id] && (
            <Suspense fallback={<Loader show local />}>
              <ImportReportCard
                onClose={closeImportModal}
                standard={standard}
                classes={classes}
              />
            </Suspense>
          )}

          {showPreview[standard.id] && (
            <Suspense fallback={<Loader show local />}>
              <NewPreviewTemplate
                onClose={closePreviewModal}
                getTemplateUrl={getTemplateUrl}
                data={standard}
              />
            </Suspense>
          )}
        </Accordion>
      ))}
    </div>
  )
}

export default React.memo(NewClassList)
