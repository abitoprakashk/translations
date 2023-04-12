import {useState} from 'react'
import {
  Para,
  Modal,
  RadioGroup,
  PARA_CONSTANTS,
  MODAL_CONSTANTS,
  Input,
  INPUT_TYPES,
} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'
import {customIdTemplateDetailsSelector} from '../../redux/CustomId.selector'
import styles from './BulkDownloadModal.module.css'
import {IDCARD, idPageSizeConfig} from '../../CustomId.constants'
import {
  generateHTMLSkeletonIDCard,
  wrapContentInLiquidJsStyleLoop,
} from '../../CustomId.utils'
import {orientation as orientationConstant} from '../../../../components/TemplateGenerator/TemplateGenerator.constants'

const BulkDownloadModal = ({isOpen, onClose, triggerBulkDownload}) => {
  const initialPageConfig = {
    A4: {
      margin: {top: 10, left: 30, right: 0, bottom: 0},
      spacing: {horizontal: 20, vertical: 20},
      dimensions: {height: 0, width: 0},
    },
    // A3: {
    //   margin: {top: 20, left: 20, right: 20, bottom: 20},
    //   spacing: {horizontal: 20, vertical: 20},
    //   dimensions: {height: 0, width: 0},
    // },
    // custom: {
    //   margin: {top: 20, left: 20, right: 20, bottom: 20},
    //   spacing: {horizontal: 20, vertical: 20},
    //   dimensions: {height: 1200, width: 900},
    // },
    IDCARD: {
      margin: {top: 0, left: 0, right: 0, bottom: 0},
      spacing: {horizontal: 0, vertical: 0},
      dimensions: {height: 0, width: 0},
    },
  }

  const [pageConfig, setPageConfig] = useState(initialPageConfig.A4)
  const [selectedLayout, setSelectedLayout] = useState('A4')
  const [customLayoutVisible, showCustomLayout] = useState(false)

  const {data: customIdTemplateDetails} = customIdTemplateDetailsSelector()
  const {
    frontTemplate: {
      pageSettings: {orientation},
      thumbnailUrl: frontThumbnail,
      html: frontHTML,
    },
    backTemplate: {thumbnailUrl: backThumbnail, html: backHTML} = {},
  } = customIdTemplateDetails
  const idCardWidth = idPageSizeConfig.IDCARD[orientation].width
  const idCardHeight = idPageSizeConfig.IDCARD[orientation].height

  const {t} = useTranslation()

  const layoutOptions = [
    {label: t('customId.a4Layout'), value: 'A4'},
    {label: t('customId.individualCards'), value: 'IDCARD'},
    // {label: t('customId.a3Layout'), value: 'A3'},
    // {label: t('customId.customLayout'), value: 'custom'},
  ]

  const updatePageConfig = (type, fieldName, value) => {
    const data = {...pageConfig}
    data[type][fieldName] = value
    setPageConfig(data)
  }

  const columnCount = orientation === 'LANDSCAPE' ? 2 : 5

  const layoutStyle = () => {
    const {
      spacing: {horizontal, vertical},
    } = pageConfig
    return {
      gap: `${vertical}px ${horizontal}px`,
      gridTemplateColumns: `repeat(${columnCount}, ${idCardWidth}px)`,
      // gridTemplateRows: `repeat(auto-fill, ${idCardHeight}px)`,
    }
  }

  const getWidthHeight = () => {
    const {
      dimensions: {height, width},
    } = pageConfig
    const customLayoutSelected = selectedLayout === 'custom'
    const pageOrientation =
      orientation === 'LANDSCAPE' ? 'PORTRAIT' : 'LANDSCAPE'
    const pageWidth = customLayoutSelected
      ? width
      : idPageSizeConfig[selectedLayout][pageOrientation].width
    const pageHeight = customLayoutSelected
      ? height
      : idPageSizeConfig[selectedLayout][pageOrientation].height
    const scale = customLayoutSelected
      ? 0.3
      : idPageSizeConfig[selectedLayout][orientation].scale
    return {
      width: `${pageWidth}px`,
      height: `${pageHeight}px`,
      transform: ` scale(${scale})`,
    }
  }

  const getPageMargins = () => {
    const {
      margin: {top, bottom, left, right},
    } = pageConfig

    return {padding: `${top}px ${right}px ${bottom}px ${left}px`}
  }

  const generateBulkIds = () => {
    const {
      margin,
      spacing: {horizontal, vertical},
      dimensions: {height, width},
    } = pageConfig

    const customLayoutSelected = selectedLayout === 'custom'
    let template
    if (selectedLayout != IDCARD) {
      template =
        orientation === 'LANDSCAPE'
          ? `${frontHTML} ${backHTML || ''}`
          : `<div class='card'>${frontHTML} ${backHTML || ''}</div>`
    } else template = `${frontHTML} ${backHTML || ''}`
    const content = wrapContentInLiquidJsStyleLoop(template)

    const pageOrientation =
      orientation === 'LANDSCAPE' ? 'PORTRAIT' : 'LANDSCAPE'

    const finalOrientation =
      selectedLayout === IDCARD
        ? orientation
        : orientationConstant[pageOrientation]

    const pageWidth = customLayoutSelected
      ? width
      : idPageSizeConfig[selectedLayout][finalOrientation].width

    const pageHeight = customLayoutSelected
      ? height
      : idPageSizeConfig[selectedLayout][finalOrientation].height

    const columnCount = orientation === 'LANDSCAPE' ? 2 : 5

    let layout = `<div>
    <style>
    ${
      selectedLayout != IDCARD
        ? `.cards {
        display: grid;
        gap: ${vertical}px ${horizontal}px;
        grid-template-columns: repeat(${columnCount}, ${idCardWidth}px);     
      }
      .card {
        display: flex;
        flex-direction: column;
        gap: ${vertical}px;
      }
      .card > div:nth-of-type(2) {
        transform: rotate(180deg);
      }`
        : ''
    }
    </style>
      <div class="cards">
        ${content}
      </div>
    </div>`
    const html = generateHTMLSkeletonIDCard({
      pageHeight,
      pageWidth,
      content: layout,
      margin,
    })
    triggerBulkDownload(html)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header={t('customId.downloadIdCards')}
      size={MODAL_CONSTANTS.SIZE.LARGE}
      classes={{content: styles.modalBody}}
      actionButtons={[
        {
          body: t('download'),
          onClick: () => {
            generateBulkIds()
            onClose()
          },
        },
      ]}
    >
      <div className={styles.modalBodyWrapper}>
        <div className={styles.configDiv}>
          <div className={styles.layoutConfig}>
            <Para
              type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
              textSize={PARA_CONSTANTS.TEXT_SIZE.X_LARGE}
              weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
            >
              {t('customId.chooseLayout')}
            </Para>
            <div className={styles.layoutOptions}>
              <RadioGroup
                options={layoutOptions}
                selectedOption={selectedLayout}
                handleChange={(value) => {
                  setPageConfig(initialPageConfig[value.selected])
                  setSelectedLayout(value.selected)
                  if (value.selected === 'custom') showCustomLayout(true)
                  else showCustomLayout(false)
                }}
              />
            </div>
          </div>
          <div className={styles.divider} />
          {/* {selectedLayout !== IDCARD && !customLayoutVisible && (
            <div className={styles.customLayoutButton}>
              <Button
                onClick={() => showCustomLayout(true)}
                type={BUTTON_CONSTANTS.TYPE.TEXT}
              >
                {t('customId.createCustomLayout')}
              </Button>
            </div>
          )} */}
          {customLayoutVisible && (
            <div className={styles.pageConfig}>
              {selectedLayout === 'custom' && (
                <div>
                  <Para
                    type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
                    textSize={PARA_CONSTANTS.TEXT_SIZE.SMALL}
                  >
                    {t('customId.setPageDimensions')}
                  </Para>
                  <div>
                    {['height', 'width'].map((item) => (
                      <Input
                        type="number"
                        title={item}
                        fieldName={item}
                        key={item}
                        value={pageConfig.dimensions[item]}
                        classes={{wrapper: styles.inputWrapper}}
                        min={idCardWidth}
                        onChange={({fieldName, value}) =>
                          updatePageConfig('dimensions', fieldName, value)
                        }
                        onBlur={() => {
                          if (pageConfig.dimensions.width < idCardWidth)
                            updatePageConfig('dimensions', item, idCardWidth)
                          if (pageConfig.dimensions.height < idCardHeight)
                            updatePageConfig('dimensions', item, idCardHeight)
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div>
                <Para
                  type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
                  textSize={PARA_CONSTANTS.TEXT_SIZE.SMALL}
                >
                  {t('customId.setMargin')}
                </Para>
                <div>
                  {['top', 'right', 'bottom', 'left'].map((item) => (
                    <Input
                      title={item}
                      fieldName={item}
                      key={item}
                      type={INPUT_TYPES.TEXT}
                      value={pageConfig.margin[item]}
                      classes={{wrapper: styles.inputWrapper}}
                      onChange={({fieldName, value}) =>
                        updatePageConfig('margin', fieldName, value)
                      }
                    />
                  ))}
                </div>
              </div>
              <div>
                <Para
                  type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
                  textSize={PARA_CONSTANTS.TEXT_SIZE.SMALL}
                >
                  {t('customId.setSpacing')}
                </Para>
                <div>
                  {['horizontal', 'vertical'].map((item) => (
                    <Input
                      title={item}
                      fieldName={item}
                      key={item}
                      type={INPUT_TYPES.TEXT}
                      value={pageConfig.spacing[item]}
                      classes={{wrapper: styles.inputWrapper}}
                      onChange={({fieldName, value}) =>
                        updatePageConfig('spacing', fieldName, value)
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        {selectedLayout !== IDCARD ? (
          <div className={styles.previewDiv}>
            <div className={styles.scale} style={getWidthHeight()}>
              <div
                className={styles.imageContainer}
                style={{...getPageMargins(), ...layoutStyle()}}
              >
                {new Array(5).fill(0).map((i) => (
                  <>
                    {orientation == 'LANDSCAPE' ? (
                      <>
                        <img src={frontThumbnail} key={i} />
                        {backThumbnail && <img src={backThumbnail} alt="" />}
                      </>
                    ) : (
                      <div
                        className={styles.card}
                        style={{gap: `${pageConfig.spacing.vertical}px`}}
                      >
                        <img src={frontThumbnail} key={i} />
                        {backThumbnail && <img src={backThumbnail} alt="" />}
                      </div>
                    )}
                  </>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.individual}>
            <img src={frontThumbnail} alt="" />
            {backThumbnail && <img src={backThumbnail} alt="" />}
          </div>
        )}
      </div>
    </Modal>
  )
}

export default BulkDownloadModal
