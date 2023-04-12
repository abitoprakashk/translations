import {
  Button,
  Input,
  Para,
  BUTTON_CONSTANTS,
  PARA_CONSTANTS,
  INPUT_TYPES,
} from '@teachmint/krayon'
import React from 'react'
import {useEffect} from 'react'
import {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch} from 'react-redux'
import {templatePageSettingsActions} from '../../../redux/TemplateGenerator.actionTypes'
import {
  usePageSettings,
  useEditorRef,
} from '../../../redux/TemplateGenerator.selectors'

import styles from './TemplateLayoutTab.module.css'

const marginInputs = ['left', 'top', 'right', 'bottom']

const TemplateLayoutTab = () => {
  const {t} = useTranslation()
  const pageSettingsValue = usePageSettings()
  const {margin} = pageSettingsValue
  const dispatch = useDispatch()
  const [marginValues, setMargin] = useState({})
  const editorRef = useEditorRef()

  useEffect(() => {
    setMargin(margin)
  }, [margin])

  const handleMarginChange = ({fieldName, value}) => {
    if (value === '' || !Number.isNaN(Number(value)))
      setMargin({...marginValues, [fieldName]: value})
  }

  const updateMargins = () => {
    const editorContent = editorRef.getEditorContent()
    editorRef.resetEditor({contentAfterReset: editorContent})
    dispatch({
      type: templatePageSettingsActions.SET_MARGINS,
      payload: marginValues,
    })
  }

  return (
    <>
      <Para
        weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
        type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
      >
        {t('templateGenerator.setMargin')}
      </Para>
      <div className={styles.inputWrapper}>
        {marginInputs.map((type) => {
          return (
            <Input
              key={type}
              fieldName={type}
              value={marginValues[type]}
              title={t(`templateGenerator.${type}`)}
              suffix="cm"
              onChange={handleMarginChange}
              type={INPUT_TYPES.TEXT}
            />
          )
        })}
      </div>
      <div className={styles.button}>
        <Button
          type={BUTTON_CONSTANTS.TYPE.OUTLINE}
          width={BUTTON_CONSTANTS.WIDTH.FULL}
          onClick={updateMargins}
        >
          {t('templateGenerator.updateMargin')}
        </Button>
      </div>
    </>
  )
}

export default TemplateLayoutTab
