import {Button, Icon, Modal} from '@teachmint/common'
import {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {toCamelCasedKeys} from '../../../../../utils/Helpers'
import {getNodesListOfSimilarTypeWithChildren} from '../../../../../utils/HierarchyHelpers'
import {
  useClassesExamStructureList,
  useImportStatusInfo,
} from '../../Redux/ExamStructureSelectors'
import MenuItem from '../MenuItem/MenuItem'
import styles from './ImportExamStructurePopup.module.css'
import useQuery from '../../../../../hooks/UseQuery'
import {useDispatch, useSelector} from 'react-redux'
import {
  postExamStructureImport,
  getImportStatusInfo,
} from '../../Redux/ExamStructureActions'
import {EXAM_STRUCTURE_PATHS} from '../../Constants/Constants'
// import {useOutsideClickHandler} from '@teachmint/common'
// import {useRef} from 'react'
// import PDFViewer from '../../../../../components/Common/PdfViewer/PdfViewer'
import history from '../../../../../history'

const ImportExamStructurePopup = () => {
  //   const [show, setShow] = useState(true)
  const [selectedClass, setSelectedClass] = useState(0)
  const [classesWithExamStructure, setClassesWithExamStructure] = useState(null)
  const [listOfClasses, setListOfClasses] = useState([])
  const [showImport, setShowImport] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const {instituteHierarchy} = useSelector((state) => state)
  const {t} = useTranslation()
  const query = useQuery()
  const dispatch = useDispatch()

  const importStatus = useImportStatusInfo()

  //   const wrapperRef = useRef(null)
  //   useOutsideClickHandler(wrapperRef, () => setShow(false))

  const examStructureObj = useClassesExamStructureList()

  const classId = query.get('classId')

  useEffect(() => {
    dispatch(getImportStatusInfo({class_id: classId}))
    setIsLoading(true)
  }, [])

  useEffect(() => {
    if (importStatus) {
      setShowImport(!importStatus.evaluated)
      setIsLoading(false)
    }
  }, [importStatus])

  useEffect(() => {
    setListOfClasses([
      ...getNodesListOfSimilarTypeWithChildren(instituteHierarchy, 'STANDARD'),
    ])
  }, [instituteHierarchy])

  const classesWithExamStructureList = () => {
    const list = []
    listOfClasses?.map((item) => {
      const {
        classId: id,
        name: standardName,
        previewLink: pdfLink,
        passingCriteria: passingPercentage,
      } = toCamelCasedKeys(examStructureObj[item.id])
      if (pdfLink && id !== classId)
        return list.push({id, standardName, pdfLink, passingPercentage})
    })
    return list
  }
  useEffect(() => {
    setClassesWithExamStructure(classesWithExamStructureList())
  }, [examStructureObj, listOfClasses])

  const handleImport = () => {
    dispatch(
      postExamStructureImport({
        copyToClassId: classId,
        copyFromClassId: classesWithExamStructure[selectedClass].id,
        standardName: classesWithExamStructure[selectedClass].standardName,
      })
    )
    history.push({
      pathname: EXAM_STRUCTURE_PATHS.examPattern,
      search: `?classId=${classId}`,
    })
  }
  const renderImport = () => {
    return (
      <Modal show={true} className={styles.container}>
        <div className={styles.bodyContainer}>
          <div className={styles.header}>
            <div className={styles.title}>{t('selectClassToImport')}</div>
            <div className={styles.desc}>{t('copyStructureAndSubject')}</div>
          </div>

          <div className={styles.secondaryContainer}>
            <div className={styles.sideMenu}>
              {classesWithExamStructure?.map((item, index) => {
                const {standardName} = toCamelCasedKeys(item)
                return (
                  <div
                    className={styles.sideMenuEntry}
                    key={index}
                    onClick={() => {
                      setSelectedClass(index)
                    }}
                  >
                    <MenuItem
                      title={`Class ${standardName}`}
                      isSelected={index === selectedClass}
                    />
                  </div>
                )
              })}
            </div>
            <div className={styles.pdfContainer}>
              {classesWithExamStructure?.length ? (
                <>
                  <object
                    className={styles.pdfViewer}
                    data={
                      classesWithExamStructure[selectedClass]?.pdfLink +
                      '#toolbar=0&navpanes=0&scrollbar=0'
                    }
                    type="application/pdf"
                  />
                </>
              ) : (
                <div className={styles.noStructure}>
                  {t('noStructureToImport')}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <div className={styles.footerDesc}>
            {t('currentStructureUpdateImport')}
          </div>
          <Button
            className={styles.importStructure}
            onClick={handleImport}
            size="big"
            disabled={
              !classesWithExamStructure || !classesWithExamStructure.length
            }
          >
            {t('importStructure')}
          </Button>
        </div>

        <span
          onClick={() => {
            history.goBack()
          }}
        >
          <Icon
            className={styles.close}
            size="xxl"
            type="filled"
            color="secondary"
            name="close"
          />
        </span>
      </Modal>
    )
  }

  const renderImportBlock = () => {
    return (
      <Modal show={true} className={styles.containerMsgModal}>
        <div className={styles.bodyContainer}>
          <div className={styles.header}>
            <div className={styles.headerTitle}>{t('actionNotAllowed')}</div>
          </div>

          <div className={styles.descriptionContainer}>
            <div className={styles.titleMsg}>{t('sorryYouCannotImport')}</div>
            <div className={styles.descMsg}>{t('alreadyEvaluationDone')}</div>
          </div>
        </div>

        <span
          onClick={() => {
            history.goBack()
          }}
        >
          <Icon
            className={styles.close}
            size="xxl"
            type="filled"
            color="secondary"
            name="close"
          />
        </span>
      </Modal>
    )
  }

  return isLoading ? (
    <div className="loader" />
  ) : showImport ? (
    renderImport()
  ) : (
    renderImportBlock()
  )
}

export default ImportExamStructurePopup
