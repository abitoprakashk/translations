import {useRef} from 'react'
import {useDispatch} from 'react-redux'
import {Editor} from '@tinymce/tinymce-react'
import {t} from 'i18next'
import {
  Accordion,
  Heading,
  HEADING_CONSTANTS,
  IconFrame,
  ICON_FRAME_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  Input,
  INPUT_TYPES,
  RequiredSymbol,
  Para,
} from '@teachmint/krayon'
import FormPreview from '../FormPreview/FormPreview'
import styles from './WebPage.module.css'
import {onboardingFlowStepsId} from '../../../utils/constants'
import {showToast} from '../../../../../redux/actions/commonAction'
import {checkRegex} from '../../../../../utils/Validations'
import {
  REACT_APP_ADMISSION_CRM_DOMAIN,
  REACT_APP_TINY_EMC_API_KEY,
} from '../../../../../constants'

export default function WebPage({formData, setFormData}) {
  const dispatch = useDispatch()
  const editorRef = useRef(null)

  const handleChange = ({fieldName, value}) => {
    let newFormData = {...formData}
    newFormData.instructions[fieldName] = value
    setFormData(newFormData)
  }

  const handleCopyClick = () => {
    if (!formData.domain_url) {
      return
    }
    dispatch(showToast({type: 'success', message: t('successfullyCopied')}))
    navigator &&
      navigator.clipboard.writeText(`${formData.domain_url}/admission`)
  }

  return (
    <div className={styles.bodyContent}>
      <div className={styles.formContent}>
        <Accordion
          isOpen={true}
          headerContent={
            <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.X_SMALL}>
              {t('webpageStepTitle')}
            </Heading>
          }
          classes={{accordionWrapper: styles.accordionWrapper}}
        >
          <div>
            <div className={styles.editableSection}>
              <Input
                type={INPUT_TYPES.TEXT}
                title={t('webPageDomainUrlLabel')}
                fieldName="domain_url"
                isRequired={true}
                suffix={`.${REACT_APP_ADMISSION_CRM_DOMAIN}/admission`}
                value={formData.domain_url.replace(
                  `.${REACT_APP_ADMISSION_CRM_DOMAIN}`,
                  ''
                )}
                onChange={({fieldName, value}) => {
                  if (checkRegex(/^[a-zA-Z0-9][a-zA-Z0-9-]*$/, value)) {
                    setFormData({
                      ...formData,
                      [fieldName]:
                        `${value}.${REACT_APP_ADMISSION_CRM_DOMAIN}`.toLowerCase(),
                    })
                  }
                }}
              />
              <div onClick={handleCopyClick}>
                <IconFrame
                  size={ICON_FRAME_CONSTANTS.SIZES.LARGE}
                  type={ICON_FRAME_CONSTANTS.TYPES.PRIMARY}
                >
                  <Icon
                    name="copy"
                    size={ICON_CONSTANTS.SIZES.XX_SMALL}
                    type={ICON_CONSTANTS.TYPES.PRIMARY}
                    version={ICON_CONSTANTS.VERSION.OUTLINED}
                  />
                </IconFrame>
              </div>
            </div>
            <div className={styles.formGroup}>
              <Input
                isRequired={true}
                type={INPUT_TYPES.TEXT}
                fieldName="heading"
                title={t('webPageInstructionsHeadingLabel')}
                value={formData.instructions?.heading}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <Para>
                {t('webPageInstructionsLabel')}
                <RequiredSymbol />
              </Para>
              <Editor
                cloudChannel="6"
                apiKey={REACT_APP_TINY_EMC_API_KEY}
                textareaName="text"
                value={formData.instructions?.text}
                onEditorChange={(content) =>
                  handleChange({fieldName: 'text', value: content})
                }
                onInit={(_, editor) => (editorRef.current = editor)}
                init={{
                  width: `auto`,
                  height: `600px`,
                  menubar: false,
                  branding: true,
                  resize: false,
                  elementpath: false,
                  contextmenu: '',
                  toolbar_mode: 'wrap',
                  nonbreaking_force_tab: true,
                  content_css: [
                    'https://fonts.googleapis.com/css2?family=Inter',
                  ],
                  plugins: ['advlist', 'autolink', 'lists', 'code'],
                  toolbar:
                    'bold italic | alignleft aligncenter alignright alignjustify | bullist numlist',
                  content_style: `
                    body {
                      margin: 0.5cm;
                      font-family: 'Inter';
                      font-size: 12pt;
                      line-height: 20px;
                      color: #CCCCCC;
                      background-color: #2F3C51;
                    }
                    li {
                      margin-top: 16px;
                    }
                  `,
                }}
              />
            </div>
          </div>
        </Accordion>
      </div>
      <FormPreview type={onboardingFlowStepsId.WEB_PAGE} />
    </div>
  )
}
