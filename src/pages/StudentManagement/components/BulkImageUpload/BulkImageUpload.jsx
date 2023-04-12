import {
  Dropdown,
  Heading,
  HEADING_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  PlainCard,
} from '@teachmint/krayon'
import {t} from 'i18next'
import {useEffect, useRef, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {
  getNodeDataWithChildrensParent,
  getNodesListOfSimilarType,
} from '../../../../utils/HierarchyHelpers'
import {NODE_CLASS, NODE_SECTION} from '../../../../utils/SchoolSetupConstants'
import {uploadFileBySignedUrl} from '../../../../utils/SignedUrlUpload'
import {getSignedUrl, updateUserProfile} from '../../../user-profile/apiService'
import styles from './BulkImageUpload.module.css'
import {Trans} from 'react-i18next'
import {INSTITUTE_MEMBER_TYPE} from '../../../../constants/institute.constants'
import globalActions from '../../../../redux/actions/global.actions'
import {USER_TYPE_SETTINGS} from '../../../user-profile/constants'
import {personaProfileSettingsSelector} from '../../../ProfileSettings/redux/ProfileSettingsSelectors'
import ErrorTableStep from './components/ErrorTableStep/ErrorTableStep'
import UploadStep from './components/UploadStep/UploadStep'
import SelectionStep from './components/SelectionStep/SelectionStep'

const ALLOWED_EXTENSIONS = ['image/png', 'image/jpg', 'image/jpeg']

export default function BulkImageUpload({setShow}) {
  const [classList, setClassList] = useState([])
  const [sectionList, setSectionList] = useState([])
  const [selectedClass, setSelectedClass] = useState(null)
  const [selectedSection, setSelectedSection] = useState(null)
  const [ongoingStep, setOngoingStep] = useState(1)

  const [validatedFiles, setValidatedFiles] = useState(null)
  const [errorFiles, setErrorFiles] = useState(null)
  const [currentUploadIndex, setCurrentUploadIndex] = useState(null)

  const [successFilesList, setSuccessFilesList] = useState([])
  const [errorFilesList, setErrorFilesList] = useState([])
  const [showCancelUploadPopup, setShowCancelUploadPopup] = useState(false)
  const [retry, setRetry] = useState(true)

  const dispatch = useDispatch()
  const instituteHierarchy = useSelector((state) => state.instituteHierarchy)
  const instituteStudentList = useSelector(
    (state) => state.instituteStudentList
  )
  const personaCategoryList = personaProfileSettingsSelector()

  const portalContainer = useRef(null)
  if (!portalContainer.current) {
    portalContainer.current = document.getElementById(
      'student-update-data-modal'
    )
  }

  // Get Classes List
  useEffect(() => {
    const classes = getNodesListOfSimilarType(instituteHierarchy, NODE_CLASS)
    const classesOptions = classes?.map(({id, name}) => {
      return {value: id, label: name}
    })

    setClassList(classesOptions)
    setSelectedClass(null)
  }, [])

  // Get Section List on updating class
  useEffect(() => {
    if (selectedClass) {
      const sections = getNodeDataWithChildrensParent(
        instituteHierarchy,
        selectedClass
      )

      const sectionsOptions =
        sections?.children
          ?.filter(({type}) => type === NODE_SECTION)
          .map(({id, name}) => {
            return {value: id, label: name}
          }) || []

      setSectionList(sectionsOptions)
      setSelectedSection(null)
      setErrorFiles(null)
      setValidatedFiles(null)
    }
  }, [selectedClass])

  useEffect(() => {
    dispatch(
      globalActions?.fetchPersonaProfileSettingsRequestAction?.request({
        persona: USER_TYPE_SETTINGS.STUDENT.id,
      })
    )
  }, [])

  const handleFileValidation = async (filesToUpload) => {
    let validatedFiles = {}
    const errorObj = []

    // Get students list from selected class
    const studentOfSelectedClass = instituteStudentList?.filter(
      ({details}) =>
        details?.standards?.[0] === selectedClass &&
        details?.sections?.[0] === selectedSection
    )

    // Check file validation (extensions and filename)
    // Error Types
    // 1 -> Wrong Extension
    // 2 -> Dublicate name
    // 3 -> No student with filename as enrollment_number
    Array.from(filesToUpload)?.forEach((file) => {
      let fileName = file?.name?.split('.')
      fileName?.pop()
      fileName = fileName?.join('.')

      let findStudentWithFilename = studentOfSelectedClass?.find(
        ({enrollment_number}) => enrollment_number === fileName
      )

      // Check for ":" replace with "\"
      if (!findStudentWithFilename && fileName.includes(':')) {
        fileName = fileName.replaceAll(':', '/')
        findStudentWithFilename = studentOfSelectedClass?.find(
          ({enrollment_number}) => enrollment_number === fileName
        )
      }

      if (!file?.type || !ALLOWED_EXTENSIONS?.includes(file?.type))
        errorObj.push({file, errorType: 1})
      else if (validatedFiles[fileName]) errorObj.push({file, errorType: 2})
      else if (!findStudentWithFilename) errorObj.push({file, errorType: 3})
      else if (file?.size >= 10000000) errorObj.push({file, errorType: 4})
      else validatedFiles[fileName] = {file, student: findStudentWithFilename}
    })

    validatedFiles = Object.values(validatedFiles)

    setValidatedFiles(validatedFiles)
    setErrorFiles(errorObj)
  }

  const handleSubmit = () => {
    setCurrentUploadIndex(0)
    setSuccessFilesList([])
    setErrorFilesList([])
  }

  useEffect(async () => {
    handleFileUpload(currentUploadIndex)
  }, [currentUploadIndex])

  const handleFileUpload = async (uploadIndex) => {
    if (
      validatedFiles &&
      !isNaN(uploadIndex) &&
      uploadIndex < validatedFiles?.length
    ) {
      const file = validatedFiles[uploadIndex]?.file
      const studentData = validatedFiles[uploadIndex]?.student
      const singedUrl = await getSignedUrl({
        filename: file?.name,
        key_id: 'img_url',
        persona: 'STUDENT',
      })

      uploadFileBySignedUrl(singedUrl?.obj?.signed_url, file, {
        imageCompression: true,
        uploadFinished: async () => {
          const studentDataNew = {}
          personaCategoryList?.data?.forEach(({is_active, key_id}) => {
            if (key_id in studentData && is_active)
              studentDataNew[key_id] = studentData[key_id]
          })

          await updateUserProfile({
            users: [
              {
                ...studentDataNew,
                _id: studentData?._id,
                img_url: singedUrl?.obj?.public_url,
              },
            ],
            user_type: INSTITUTE_MEMBER_TYPE.STUDENT,
          })

          const successFilesListNew = [...successFilesList]
          successFilesListNew.push(file?.name)

          setSuccessFilesList(successFilesListNew)
          setCurrentUploadIndex((count) => count + 1)
          setRetry(true)
        },
        onChunkUploadError: () => {
          try {
            if (retry) {
              handleFileUpload(uploadIndex)
              setRetry(false)
            } else {
              const errorFilesListNew = [...errorFilesList]
              errorFilesListNew.push(file?.name)
              setErrorFilesList(errorFilesListNew)
            }
          } catch {
            const errorFilesListNew = [...errorFilesList]
            errorFilesListNew.push(file?.name)
            setErrorFilesList(errorFilesListNew)
          }
        },
      })
    }
  }

  return (
    <PlainCard className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.headingWrapper}>
          {ongoingStep === 2 && (
            <Icon
              name="caution"
              type={ICON_CONSTANTS.TYPES.ERROR}
              size={ICON_CONSTANTS.SIZES.XX_SMALL}
            />
          )}
          <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
            {ongoingStep === 1 ? (
              t('bulkUploadPhotosHeading')
            ) : ongoingStep === 2 ? (
              <Trans
                values={{errorCount: errorFiles?.length || 0}}
                i18nKey="bulkImageErrorHeading"
              />
            ) : (
              t('uploadInProgress')
            )}
          </Heading>
        </div>

        {ongoingStep === 1 && (
          <div className={styles.dropdownWrapper}>
            <Dropdown
              fieldName="search"
              options={classList}
              onChange={({value}) => setSelectedClass(value)}
              classes={{wrapperClass: styles.dropdown}}
              selectedOptions={selectedClass}
              placeholder={t('selectAClass')}
              isDisabled={!classList?.length > 0}
            />
            <Dropdown
              fieldName="search"
              options={sectionList}
              onChange={({value}) => {
                setSelectedSection(value)
                setValidatedFiles(null)
                setErrorFiles(null)
              }}
              classes={{
                wrapperClass: styles.dropdown,
                dropdownClass:
                  sectionList?.length > 0 ? '' : styles.dropdownClassDisabled,
              }}
              selectedOptions={selectedSection}
              placeholder={t('selectASection')}
              isDisabled={!sectionList?.length > 0}
            />
          </div>
        )}
      </div>

      <div className={styles.body}>
        {ongoingStep === 1 ? (
          <SelectionStep
            selectedClass={selectedClass}
            selectedSection={selectedSection}
            validatedFiles={validatedFiles}
            setValidatedFiles={setValidatedFiles}
            errorFiles={errorFiles}
            setErrorFiles={setErrorFiles}
            ALLOWED_EXTENSIONS={ALLOWED_EXTENSIONS}
            handleFileValidation={handleFileValidation}
            setOngoingStep={setOngoingStep}
            setShow={setShow}
            handleSubmit={handleSubmit}
          />
        ) : ongoingStep === 2 ? (
          <ErrorTableStep
            validatedFiles={validatedFiles}
            errorFiles={errorFiles}
            setShow={setShow}
            setOngoingStep={setOngoingStep}
            handleSubmit={handleSubmit}
          />
        ) : (
          <UploadStep
            validatedFiles={validatedFiles}
            successFilesList={successFilesList}
            errorFilesList={errorFilesList}
            showCancelUploadPopup={showCancelUploadPopup}
            setShowCancelUploadPopup={setShowCancelUploadPopup}
            setShow={setShow}
          />
        )}
      </div>
    </PlainCard>
  )
}
