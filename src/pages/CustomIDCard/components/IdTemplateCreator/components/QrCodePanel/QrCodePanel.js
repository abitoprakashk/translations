import {Icon, ICON_CONSTANTS, Para, PARA_CONSTANTS} from '@teachmint/krayon'
import React from 'react'
import {useTranslation} from 'react-i18next'
import {useEditorRef} from '../../../../../../components/TemplateGenerator/redux/TemplateGenerator.selectors'
import {templateFieldsSelector} from '../../../../../CustomCertificate/redux/CustomCertificate.selectors'
import styles from './QrCodePanel.module.css'

const QrCodePanel = ({userType}) => {
  const {t} = useTranslation()
  const editorRef = useEditorRef()

  const templateFields = templateFieldsSelector()

  const panelFields = templateFields[userType]?.data?.CODE

  const insertFieldInTemplate = (e, {id, value, name}) => {
    editorRef.addImage({
      url: value,
      id,
      name,
      category: 'CODE',
      isDynamic: true,
      hideImageOptions: false,
      width: 75,
    })
  }

  return (
    <>
      <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
        {t('customId.selectSecurity')}
      </Para>
      <div className={styles.fieldsWrapper}>
        {panelFields?.map((item) => (
          <div key={item.id} className={styles.fieldItem}>
            <span>{item.name}</span>
            <span
              onClick={(e) =>
                insertFieldInTemplate(e, {
                  id: item.id,
                  name: item.name,
                  value: item?.value || item?.default_value,
                  type: item.type,
                  category: item.category,
                })
              }
            >
              <Icon
                name="circledClose"
                type={ICON_CONSTANTS.TYPES.PRIMARY}
                version={ICON_CONSTANTS.VERSION.OUTLINED}
                size={ICON_CONSTANTS.SIZES.XX_SMALL}
              />
            </span>
          </div>
        ))}
      </div>
    </>
  )
}

export default QrCodePanel
