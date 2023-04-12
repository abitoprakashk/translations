import {
  Heading,
  Icon,
  IconFrame,
  Modal,
  HEADING_CONSTANTS,
  ICON_FRAME_CONSTANTS,
  ICON_CONSTANTS,
} from '@teachmint/krayon'
import {t} from 'i18next'
import React, {useCallback, useState} from 'react'
import PDFViewer from '../../../../components/Common/PdfViewer/PdfViewer'
import {downloadFromLink} from '../../../../utils/fileUtils'
import styles from './CustomIdPreview.module.css'

const CustomIdPreview = ({url, title, onClose, ...props}) => {
  const [activePage, setActivePage] = useState(0)

  const onLoadSuccess = useCallback(() => {
    const target = document.getElementsByClassName('react-pdf__Document')?.[0]
    const callback = () => {
      let pages = target.getElementsByClassName('react-pdf__Page')
      if (pages && pages.length) {
        for (let i = 0; i < 2; i++) {
          const page = pages[i]
          const label =
            i == 0 ? t('customId.frontView') : t('customId.backView')
          page?.insertAdjacentHTML(
            'beforeend',
            `<span class="${styles.pageLabel}">${label}</span>`
          )
        }
      }
      observer.disconnect()
    }

    const observer = new MutationObserver(callback)
    observer.observe(target, {childList: true})
  }, [])

  return (
    <div>
      <Modal
        isOpen={!!url}
        onClose={onClose}
        header={
          <div className={styles.modalHeader}>
            <div>
              <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.X_SMALL}>
                {title}
              </Heading>
              <IconFrame
                type={ICON_FRAME_CONSTANTS.TYPES.PRIMARY}
                size={ICON_FRAME_CONSTANTS.SIZES.SMALL}
                onClick={() => downloadFromLink(url)}
              >
                <Icon
                  size={ICON_CONSTANTS.SIZES.XXX_SMALL}
                  name="download"
                ></Icon>
              </IconFrame>
            </div>
            <div className="cursor_pointer">
              <Icon
                onClick={onClose}
                name="close"
                size={ICON_CONSTANTS.SIZES.X_SMALL}
              />
            </div>
          </div>
        }
        {...props}
      >
        <div className={styles.idPreview}>
          {url && (
            <>
              <div className={styles.pageList}>
                <PDFViewer
                  file={url}
                  scale={0.3}
                  classes={{page: styles.page, activePage: styles.activePage}}
                  onPageClick={(index) => {
                    setActivePage(index)
                  }}
                  activePage={activePage}
                  onLoadSuccess={onLoadSuccess}
                />
              </div>
              <div className={styles.pagePreview}>
                <PDFViewer file={url} scale={1} pageIndex={activePage} />
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default CustomIdPreview
