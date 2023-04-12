// import {ReactLiquid} from 'react-liquid'
import styles from './RightPanel.module.css'
import {templateHTML, templateStyles} from '../../constants'

import React, {useRef, useEffect, useState} from 'react'
import {useLiquid} from 'react-liquid'
import {Para, PARA_CONSTANTS} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'
import classNames from 'classnames'
import {RC_PREVIEW} from '../../../../constants'
import useResizeObserver from '../../hooks/useResizeObserver'

const RC_ORIENTATION = RC_PREVIEW.ORIENTATION
const A4 = RC_PREVIEW.PAGE_TYPE.A4
const {inchToPixel, pixelToInch} = RC_PREVIEW.CONVERTER

const commonPrintStyle = {position: 'fixed', left: '150vw', top: 0}
const toPrintStyle = {
  [RC_ORIENTATION.PORTRAIT]: {...commonPrintStyle, width: '8.27in'},
  [RC_ORIENTATION.LANDSCAPE]: {...commonPrintStyle, width: '11.69in'},
}

const RightPanel = ({
  data,
  highlighterRef,
  rightContainerRef,
  // showPreview,
  orientation = RC_ORIENTATION.PORTRAIT,
}) => {
  const {markup} = useLiquid(templateHTML, data)
  const [previewMarkup, setPreviewMarkup] = useState('')
  const ref = useRef(null)
  const {t} = useTranslation()

  useResizeObserver(rightContainerRef)

  useEffect(() => {
    if (!ref.current.querySelectorAll('[data-id=subjectNameRef]')[0]) {
      setPreviewMarkup(markup)
      return
    }
    let termHeight = ref.current
      .querySelectorAll('[data-id=termNameRef]')[0]
      ?.getBoundingClientRect().height
    let testHeight = ref.current
      .querySelectorAll('[data-id=testNameRef]')[0]
      ?.getBoundingClientRect().height
    let termTotalHeight = ref.current
      .querySelectorAll('[data-id=termResultTotalRef]')[0]
      ?.getBoundingClientRect().height
    let testResultHeight = ref.current
      .querySelectorAll('[data-id=testResultRef]')[0]
      ?.getBoundingClientRect().height
    let termSubResultHeight = ref.current
      .querySelectorAll('[data-id=termSubResultTotRef]')[0]
      ?.getBoundingClientRect().height
    let sessionSubTotHeight = ref.current
      .querySelectorAll('[data-id=sessionSubTotRef]')[0]
      ?.getBoundingClientRect().height

    let row1Height = termHeight || 32
    let row2Height = testHeight || termTotalHeight || 48
    let row3Height =
      testResultHeight || termSubResultHeight || sessionSubTotHeight || 0

    ref.current.querySelectorAll('[data-id=subjectNameRef]')[0].style.height =
      row1Height + row2Height + row3Height + 'px'
    let sessionTotalElem = ref.current.querySelectorAll(
      '[data-id=sessionTotalRef]'
    )[0]
    if (sessionTotalElem) {
      sessionTotalElem.style.height = row1Height + row2Height - 1 + 'px'
    }

    if (ref.current?.querySelector) {
      const container = ref.current.querySelector('.container')
      // don't add margin to container, won't be able to put margin from bottom on each page
      // container.style.margin = templateStyles.PAGE.margin
      container.style.width = templateStyles.PAGE.width
    }

    setTimeout(() => {
      setPreviewMarkup(ref.current.innerHTML)
    }, 200)
  }, [markup])

  const divideIntoPages = (previewMarkup, orientation) => {
    const templateHeight = ref?.current?.offsetHeight
    const availableWidth = rightContainerRef?.current?.offsetWidth
    const containerPaddingX =
      parseInt(window.getComputedStyle(rightContainerRef?.current).padding) ||
      20 // in pixel // not calculating in real time due to performance impact
    const pageGutter = 20 // in pixels
    const pageHeight = inchToPixel(A4[orientation].height) // in pixels
    const pageFullHeight = A4[orientation].height // in inch
    const pageFullWidth = A4[orientation].width // in inch
    const currentPreviewWidthInInch = pixelToInch(
      availableWidth - 2 * containerPaddingX
    )
    const scaledHeight =
      (currentPreviewWidthInInch / pageFullWidth) * pageFullHeight
    // 40 is the total parent vertical padding
    let noOfPages = templateHeight ? Math.ceil(templateHeight / pageHeight) : 1

    let arr = []

    for (let i = 0; i < noOfPages; i++) {
      const marginTop = i == 0 ? 0 : pageFullHeight - scaledHeight
      arr.push(
        <div
          className={styles.pdfPage}
          style={{
            marginTop: `-${marginTop}in`,
            width: `${pageFullWidth}in`,
            height: `${pageFullHeight}in`,
            transform: `scale(calc(${currentPreviewWidthInInch} / ${pageFullWidth}))`,
          }}
        >
          <div
            className={styles.page}
            style={{top: `-${i * pageFullHeight}in`}}
          >
            <div dangerouslySetInnerHTML={{__html: previewMarkup}} />
          </div>
        </div>
      )
    }
    return (
      <div
        style={{
          height: `calc(${noOfPages * scaledHeight}in + ${
            (noOfPages - 1) * pageGutter
          }px)`,
          overflow: 'hidden',
        }}
        id="pageContainer"
      >
        {arr}
      </div>
    )
  }

  return (
    <div className={classNames('flex flex-col items-end', styles.rightWrapper)}>
      <div
        id="rightPanelPlaceholder"
        className={styles.rightPanelPlaceholder}
      />
      <div className={styles.container} ref={rightContainerRef}>
        <div
          id="toPrint"
          dangerouslySetInnerHTML={{__html: markup}}
          ref={ref}
          style={toPrintStyle[orientation]}
        />
        <div className={classNames(styles.flex, styles.spaceBetween)}>
          <Para
            type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
            className={styles.semiBold}
          >
            {t('preview')}
          </Para>
        </div>
        {previewMarkup && divideIntoPages(previewMarkup, orientation)}
        <div className={styles.highlight} ref={highlighterRef} />
      </div>
    </div>
  )
}

export default React.memo(RightPanel)
