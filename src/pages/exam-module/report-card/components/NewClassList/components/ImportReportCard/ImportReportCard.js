import React, {useCallback, useEffect, useState} from 'react'
import {
  Button,
  Checkbox,
  Divider,
  EmptyState,
  Heading,
  HEADING_CONSTANTS,
  Modal,
  MODAL_CONSTANTS,
  Para,
  PARA_CONSTANTS,
  PlainCard,
} from '@teachmint/krayon'
import {useDispatch, useSelector} from 'react-redux'
import styles from './ImportReportCard.module.css'
import classNames from 'classnames'
import {useTranslation} from 'react-i18next'
// import FooterRadioGroup from './FooterRadioGroup'
import {IS_MOBILE} from '../../../../../../../constants'
import {
  getClassSectionDataCounts,
  getClassSectionSubjects,
  importReportCardTemplate,
} from '../../../../apiService'
import Loader from '../../../../../../../components/Common/Loader/Loader'
import {RC_IMPORT_TYPE} from '../../../../constants'
import {generatePath, useHistory} from 'react-router-dom'
import REPORT_CARD_ROUTES from '../../../../ReportCard.routes'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../../../../../redux/actions/commonAction'
import {getImportStatusInfo} from '../../../../../ExamStructure/Apis/apis'
import {events} from '../../../../../../../utils/EventsConstants'

const ImportReportCard = ({onClose, standard, classes = []}) => {
  const [step, setStep] = useState(1)
  const [selectedClass, setSelectedClass] = useState(null)
  const [importType, setImportType] = useState(
    RC_IMPORT_TYPE.include_structure.value
  )
  const [previewUrl, setPreviewUrl] = useState(null)
  const [selectedSubjects, setSelectedSubjects] = useState({})
  const [subjectList, setSubjectList] = useState([])
  const [standardDataCount, setStandardDataCount] = useState({})
  const [isClassEvaluated, setIsClassEvaluated] = useState(false)
  const [loading, setLoading] = useState(false)

  const {t} = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  const standardList = useSelector((state) => state.reportCard?.standardList)
  const eventManager = useSelector((state) => state.eventManager)

  useEffect(() => {
    setSelectedClass(
      classes.filter(
        ({id}) =>
          id != standard.id && standardList[id]?.template_details?.published
      )[0]?.id
    )
    onStepChange(1)
  }, [classes])

  // const onSelectImportType = useCallback(({fieldName}) => {
  //   setImportType(fieldName)
  // }, [])

  const onSelectSubject = useCallback(({fieldName, value}) => {
    setSelectedSubjects((subjects) => {
      const temp = {...subjects}
      if (value) temp[fieldName] = true
      else delete temp[fieldName]

      return temp
    })
  }, [])

  useEffect(() => {
    setPreviewUrl(standardList[selectedClass]?.template_details?.url)
  }, [selectedClass, standardList])

  useEffect(() => {
    if (isClassEvaluated) {
      setImportType(RC_IMPORT_TYPE.include_customization.value)
    }
  }, [isClassEvaluated])

  const redirectToEditTemplate = () => {
    history.push(
      generatePath(REPORT_CARD_ROUTES.EDIT_TEMPLATE, {
        standardId: standard.id,
      })
    )
  }

  const onStepChange = useCallback(
    (step) => {
      if (step === 2) {
        setSelectedSubjects({})
        setLoading(true)
        getClassSectionSubjects({class_id: standard.id})
          .then((res) => {
            if (res.status) {
              setSubjectList(res.obj)
            }
          })
          .finally(() => setLoading(false))
      }
      if (step === 1) {
        setLoading(true)
        Promise.all([
          getClassSectionDataCounts({
            node_types: JSON.stringify(['Term', 'Test']),
          }),
          getImportStatusInfo({class_id: standard.id}),
        ])
          .then(([res1, res2]) => {
            if (res1.status) {
              setStandardDataCount(res1.obj)
            }
            if (res2.status) {
              setIsClassEvaluated(res2.obj?.evaluated || false)
            }
          })
          .finally(() => setLoading(false))
      }
      setStep(step)
    },
    [selectedClass, standard]
  )

  const onImport = useCallback(() => {
    const subjectIds = Object.keys(selectedSubjects)

    eventManager.send_event(events.REPORT_CARD_IMPORT_FINALIZED_CLICKED_TFI, {
      source_class_id: selectedClass,
      target_class_id: standard.id,
      type: RC_IMPORT_TYPE[importType].eventValue,
      subject_ids: subjectIds,
    })

    const data = {
      copy_from_class_id: selectedClass,
      copy_to_class_id: standard.id,
      include_structure: [
        RC_IMPORT_TYPE.include_both.value,
        RC_IMPORT_TYPE.include_structure.value,
      ].includes(importType),
      subject_ids: subjectIds,
      include_customization: [
        RC_IMPORT_TYPE.include_both.value,
        RC_IMPORT_TYPE.include_customization.value,
      ].includes(importType),
    }

    setLoading(true)

    importReportCardTemplate(data)
      .then((res) => {
        if (res.status) {
          dispatch(
            showSuccessToast('Report card structure imported successfully')
          )

          eventManager.send_event(events.REPORT_CARD_IMPORTED_TFI, {
            source_class_id: selectedClass,
            target_class_id: standard.id,
            type: RC_IMPORT_TYPE[importType].eventValue,
            subject_ids: subjectIds,
          })

          redirectToEditTemplate()
        } else {
          dispatch(showErrorToast(res.msg || t('somethingWentWrong')))
        }
      })
      .finally(() => setLoading(false))
  }, [
    selectedClass,
    standard,
    importType,
    selectedSubjects,
    history,
    eventManager,
  ])

  return (
    <>
      {step == 1 && (
        <Modal
          header={`Import template to Class ${standard.name}`}
          isOpen
          size={MODAL_CONSTANTS.SIZE.LARGE}
          onClose={() => {
            onClose(standard.id)
            eventManager.send_event(
              events.REPORT_CARD_IMPORT_CROSS_CLICKED_TFI,
              {
                source_class_id: selectedClass,
                target_class_id: standard.id,
                screen_name: 'class selection',
              }
            )
          }}
          // footerLeftElement={
          //   IS_MOBILE ? null : (
          //     <FooterRadioGroup
          //       onSelect={onSelectImportType}
          //       selected={importType}
          //       evaluated={isClassEvaluated}
          //     />
          //   )
          // }
          actionButtons={
            !isClassEvaluated
              ? [
                  {
                    body: t('next'),
                    onClick: () => {
                      onStepChange(2)
                      eventManager.send_event(
                        events.REPORT_CARD_IMPORT_TEMPLATE_SELECTED_TFI,
                        {
                          source_class_id: selectedClass,
                          target_class_id: standard.id,
                          type: RC_IMPORT_TYPE[importType].eventValue,
                        }
                      )
                    },
                    isDisabled: loading,
                  },
                ]
              : undefined
          }
        >
          <div
            className={classNames(styles.flex, styles.container, {
              [styles.mobile]: IS_MOBILE,
              'justify-center': isClassEvaluated,
            })}
          >
            <Loader show={loading} local />
            {isClassEvaluated ? (
              <EmptyState
                classes={{wrapper: styles.emptyState}}
                iconName="error"
                content="Ouch! We found marks added for this class. Importing is not allowed!"
                button={{
                  children: t('editReportCard'),
                  onClick: redirectToEditTemplate,
                }}
              />
            ) : (
              <>
                <div
                  className={classNames(
                    styles.flex,
                    styles.flexColumn,
                    styles.cardListWrapper,
                    {
                      [styles.flexGrow]: IS_MOBILE,
                    }
                  )}
                >
                  <Para
                    textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
                    className={styles.label}
                  >
                    Select class to import from
                  </Para>

                  <div className={styles.cardList}>
                    {classes.map((otherStandard) =>
                      otherStandard.id != standard.id &&
                      standardList[otherStandard.id]?.template_details
                        ?.published ? (
                        <PlainCard
                          key={otherStandard.id}
                          className={classNames(styles.card, {
                            [styles.active]: selectedClass == otherStandard.id,
                          })}
                          onClick={() => setSelectedClass(otherStandard.id)}
                        >
                          <Heading
                            textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}
                            className={styles.sectionName}
                          >
                            Class {otherStandard.name}
                          </Heading>
                          <Para className={styles.classInfo}>
                            <span>
                              {standardDataCount[otherStandard.id]?.Term} Terms
                            </span>
                            <span className={styles.dot} />
                            <span>
                              {standardDataCount[otherStandard.id]?.Test} Exams
                            </span>
                          </Para>
                        </PlainCard>
                      ) : null
                    )}
                  </div>
                </div>
                {!IS_MOBILE && (
                  <>
                    <Divider isVertical spacing={20} />
                    <div
                      className={classNames(
                        styles.flex,
                        styles.flexColumn,
                        styles.previewContainer
                      )}
                    >
                      <Para
                        textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
                        className={styles.label}
                      >
                        Class {standardList[selectedClass]?.name} report card
                        preview
                      </Para>
                      {previewUrl && (
                        <embed
                          className={styles.preview}
                          src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                        />
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </Modal>
      )}
      {step == 2 && (
        <Modal
          header={`Import template to Class ${standard.name}`}
          isOpen
          size={MODAL_CONSTANTS.SIZE.LARGE}
          onClose={() => {
            onClose(standard.id)
            eventManager.send_event(
              events.REPORT_CARD_IMPORT_CROSS_CLICKED_TFI,
              {
                source_class_id: selectedClass,
                target_class_id: standard.id,
                screen_name: 'subject selection',
              }
            )
          }}
          footerLeftElement={
            <Button
              prefixIcon="backArrow"
              type="text"
              onClick={() => onStepChange(1)}
              isDisabled={loading}
            >
              {t('back')}
            </Button>
          }
          actionButtons={[
            {
              body: t('import'),
              onClick: onImport,
              isDisabled: loading || Object.keys(selectedSubjects).length == 0,
            },
          ]}
        >
          <div className={classNames(styles.container)}>
            <Loader show={loading} local />
            <div className={classNames(styles.flex, styles.flexColumn)}>
              <Para
                textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
                className={styles.label}
              >
                Select subjects of Class {standard.name}
              </Para>
              <div className={styles.subjectList}>
                {subjectList.map((subject) => (
                  <Checkbox
                    key={subject.id}
                    fieldName={subject.id}
                    handleChange={onSelectSubject}
                    label={subject.name}
                    isSelected={selectedSubjects[subject.id]}
                  />
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

export default React.memo(ImportReportCard)
