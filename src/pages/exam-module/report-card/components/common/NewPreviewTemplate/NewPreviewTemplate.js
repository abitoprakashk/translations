import {useEffect, useState} from 'react'
import {
  Icon,
  ICON_CONSTANTS,
  Modal,
  MODAL_CONSTANTS,
  Para,
  PARA_CONSTANTS,
} from '@teachmint/krayon'
import Loader from '../../../../../../components/Common/Loader/Loader'

import styles from './NewPreviewTemplate.module.css'

const NewPreviewTemplate = ({
  onClose,
  previewOnly = true,
  getTemplateUrl,
  onSave,
  data = {},
  header = '',
}) => {
  const [url, setUrl] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getTemplateUrl(data)
      .then(({previewUrl}) => setUrl(previewUrl))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Modal
      header={header || 'Report Card Preview'}
      size={MODAL_CONSTANTS.SIZE.LARGE}
      isOpen
      onClose={onClose}
      shouldCloseOnOverlayClick={previewOnly}
      shouldCloseOnEsc={previewOnly}
      actionButtons={
        !previewOnly && onSave
          ? [
              {
                body: 'Proceed',
                onClick: onSave,
                isDisabled: loading,
              },
            ]
          : []
      }
      footerLeftElement={
        !previewOnly ? (
          <div className="inline-flex mr-4 items-center gap-4">
            <Icon
              name="info"
              type={ICON_CONSTANTS.TYPES.INFO}
              version={ICON_CONSTANTS.VERSION.OUTLINED}
              size={ICON_CONSTANTS.SIZES.XX_SMALL}
            />
            <Para type={PARA_CONSTANTS.TYPE.INFO}>
              Corresponding exams will be updated and published to students and
              teachers. Changes will be reflected on Report Card after updating.
            </Para>
          </div>
        ) : null
      }
    >
      <Loader show={loading} local />
      {url && (
        <div className={styles.pdfContainer}>
          <object
            data={`${url}#toolbar=0&navpanes=0&scrollbar=0`}
            type="application/pdf"
            width="100%"
            height="100%"
            border="0"
          />
        </div>
      )}
    </Modal>
  )
}

export default NewPreviewTemplate
