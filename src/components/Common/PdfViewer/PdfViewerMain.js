import React, {useState} from 'react'
import cx from 'classnames'
import styles from './PdfViewer.module.css'
import {Document, Page, pdfjs} from 'react-pdf'
import {Icon} from '@teachmint/krayon'
const pdf_worker_url =
  (pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`)
pdfjs.GlobalWorkerOptions.workerSrc = pdf_worker_url

const PDFViewer = ({
  file,
  scale = 0.75,
  classes = {},
  allowZoom = false,
  onLoadError = () => {},
  onSourceError = () => {},
  onLoadSuccess,
  pageIndex,
  onPageClick = () => {},
  activePage,
}) => {
  const [numPages, setNumPages] = useState(null)
  const isMobile = window.innerWidth < 600
  const [currentScale, setScale] = useState(scale)

  const onDocumentLoadSuccess = ({numPages}) => {
    setNumPages(numPages)
    if (onDocumentLoadSuccess) {
      onLoadSuccess?.()
    }
  }
  const getWidth = () => {
    if (isMobile) return window.innerWidth - 30
    else return undefined
  }
  const loadingComponent = () => {
    return <div className={styles.loading}>Loading...</div>
  }

  const zoomIn = (prev) => {
    setScale(prev + 0.1)
  }
  const zoomOut = (prev) => {
    if (prev >= 0.4) setScale(prev - 0.1)
  }
  return (
    <div className={styles.wrapper}>
      <div className={cx({[classes.wrapper]: classes?.wrapper})}>
        {allowZoom && (
          <div className={styles.zoomDiv}>
            <span onClick={() => zoomIn(currentScale)}>
              <Icon name="add" />
            </span>
            <span onClick={() => zoomOut(currentScale)}>
              <Icon name="horizontalRule" />
            </span>
          </div>
        )}
        <Document
          file={file}
          zIndex={-1}
          onLoadSuccess={onDocumentLoadSuccess}
          options={{
            workerSrc: pdf_worker_url,
            disableAutoFetch: true,
          }}
          onLoadError={onLoadError}
          onSourceError={onSourceError}
          loading={loadingComponent()}
          noData=" "
        >
          {Number.isInteger(pageIndex) && pageIndex >= 0 ? ( // show specific Page
            <Page
              key={`page_${pageIndex + 1}`}
              pageNumber={pageIndex + 1}
              width={getWidth()}
              scale={currentScale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              noData=" "
              className={cx(styles.page, {
                [classes?.page]: classes?.page,
              })}
            />
          ) : (
            // show all the pages, scrollable
            Array.from({length: numPages}, (el, index) => {
              return (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  width={getWidth()}
                  scale={currentScale}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  noData=" "
                  className={cx(styles.page, {
                    [styles.gap]: numPages.length,
                    [classes?.page]: classes?.page,
                    [classes?.activePage]: activePage === index,
                  })}
                  onClick={() => onPageClick(index)}
                />
              )
            })
          )}
        </Document>
      </div>
    </div>
  )
}

export default PDFViewer
