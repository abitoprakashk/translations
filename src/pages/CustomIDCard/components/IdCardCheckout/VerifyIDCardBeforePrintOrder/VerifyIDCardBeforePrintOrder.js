import {Pagination, Para} from '@teachmint/krayon'
import React, {useContext, useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import globalActions from '../../../../../redux/actions/global.actions'
import {
  generateHTMLSkeletonIDCard,
  wrapContentInLiquidJsStyleLoop,
} from '../../../CustomId.utils'
import {
  getSelectedTemplateForUser,
  idCardCheckoutPreviewUrlsSelector,
} from '../../../redux/CustomId.selector'
import {IdCardCheckoutContext} from '../IdCardCheckoutStates/IdCardCheckout.context'
import PdfViewer from '../../../../../components/Common/PdfViewer/PdfViewer'
import styles from './VerifyIDCardBeforePrintOrder.module.css'
import {IDCheckoutActions} from '../IdCardCheckoutStates/IdCardCheckout.reducer'
import {CANCEL_BULK_ID_STATUS_POLLING} from '../../../redux/CustomId.saga'
import loaderImg from '../../../../../assets/images/icons/loader.png'

const IDS_IN_ONE_PAGE = 25

const VerifyIDCardBeforePrintOrder = ({userType, selectedIds}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const {internalDispatch} = useContext(IdCardCheckoutContext)
  const {data: template} = getSelectedTemplateForUser(userType)
  const idCardCheckoutPreviewUrls = idCardCheckoutPreviewUrlsSelector()

  const dispatch = useDispatch()

  useEffect(() => {
    internalDispatch({
      type: IDCheckoutActions.TOGGLE_NEXT_BUTTON_DISABILITY,
      data: true,
    })
    internalDispatch({
      type: IDCheckoutActions.SHOW_FOOTER_CHECKBOX,
      data: true,
    })
    internalDispatch({
      type: IDCheckoutActions.TOGGLE_FOOTER_CHECKBOX,
      data: false,
    })
    if (!idCardCheckoutPreviewUrls?.[userType]?.length) {
      setCurrentPage(1)
      generatePDF(0)
    }

    return () => {
      dispatch({type: CANCEL_BULK_ID_STATUS_POLLING})
      internalDispatch({
        type: IDCheckoutActions.SHOW_FOOTER_CHECKBOX,
        data: false,
      })
    }
  }, [userType])

  const generatePDF = (index) => {
    if (
      selectedIds.length &&
      selectedIds.slice(index, index + IDS_IN_ONE_PAGE - 1).length
    )
      dispatch(
        globalActions.generateIdCardsForCheckoutRequestId.request(
          {
            template_id: template._id,
            iids: selectedIds.slice(index, index + IDS_IN_ONE_PAGE - 1),
            default: template.default,
            userType,
            layout_html: getPreviewLayout(),
          },
          () => {
            generatePDF(index + IDS_IN_ONE_PAGE)
          }
        )
      )
  }
  const getPreviewLayout = () => {
    const {front_template, back_template} = template
    const {
      page_settings: {orientation},
    } = front_template

    let templateSkeleton
    templateSkeleton =
      orientation === 'LANDSCAPE'
        ? `${front_template?.html} ${back_template?.html || ''}`
        : `<div>${front_template?.html} ${back_template?.html || ''}</div>`

    const content = wrapContentInLiquidJsStyleLoop(templateSkeleton)

    const pageWidth = orientation === 'LANDSCAPE' ? 1200 : 900

    const pageHeight = orientation === 'LANDSCAPE' ? 508 : 1200

    let layout = `<div>
    <style>
    ${`.cards {
        display: grid;
        gap: ${20}px ${20}px;
        grid-template-columns: repeat(${2}, ${
      orientation === 'LANDSCAPE' ? 512 : 318
    }px);     
      }
      .card {
        display: flex;
        flex-direction: column;
        gap: ${20}px;
      }`}
    </style>
      <div class="cards">
        ${content}
      </div>
    </div>`
    const html = generateHTMLSkeletonIDCard({
      pageHeight,
      pageWidth,
      content: layout,
      margin: {top: 40, left: 40},
    })
    return html
  }

  const onPageChange = (page) => {
    setCurrentPage(page)
  }

  const loading = () => {
    return (
      <div className={styles.loadingPDF}>
        <img src={loaderImg} alt="" />
        <Para>
          Please wait while the document is generating for confirmation
        </Para>
      </div>
    )
  }

  return (
    <div>
      {!idCardCheckoutPreviewUrls && loading()}
      {idCardCheckoutPreviewUrls?.[userType] && (
        <div className={styles.previewContainer}>
          {idCardCheckoutPreviewUrls[userType][currentPage - 1] ? (
            <div>
              <PdfViewer
                file={idCardCheckoutPreviewUrls[userType][currentPage - 1]}
                classes={{wrapper: styles.pdfWrapper}}
              />
            </div>
          ) : (
            <div className={styles.loadingPDF}>{loading()}</div>
          )}
          {selectedIds.length / IDS_IN_ONE_PAGE > 1 && (
            <div className={styles.paginationDiv}>
              <Pagination
                collapsed
                onPageChange={onPageChange}
                page={currentPage}
                pageSize={1}
                totalEntries={selectedIds.length / IDS_IN_ONE_PAGE}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default VerifyIDCardBeforePrintOrder
