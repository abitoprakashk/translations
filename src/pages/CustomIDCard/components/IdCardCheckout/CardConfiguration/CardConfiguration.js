import {
  Dropdown,
  Icon,
  ICON_CONSTANTS,
  Input,
  Para,
  PARA_CONSTANTS,
  RequiredSymbol,
  useOutsideClickHandler,
} from '@teachmint/krayon'
import React, {useContext, useEffect, useRef, useState} from 'react'
import {ChromePicker, CirclePicker} from 'react-color'
import {useTranslation} from 'react-i18next'
import {useDispatch} from 'react-redux'
import CarouselComponent from '../../../../../components/Common/Carousel/Carousel'
import HeaderWithAddButton from '../../../../../components/TemplateGenerator/LeftPanel/Components/HeaderWithAddButton/HeaderWithAddButton'
import globalActions from '../../../../../redux/actions/global.actions'
import {uploadFileBySignedUrl} from '../../../../../utils/SignedUrlUpload'
import {IDCARD} from '../../../CustomId.constants'
import {IdCardCheckoutContext} from '../IdCardCheckoutStates/IdCardCheckout.context'
import {IDCheckoutActions} from '../IdCardCheckoutStates/IdCardCheckout.reducer'
import styles from './CardConfiguration.module.css'

const CardConfiguration = ({config, fieldName, subFields, label}) => {
  const [selectedOptionId, setOption] = useState()
  const [activeColor, onColorChange] = useState()
  const [showChromePicker, toggleChromePicker] = useState(false)
  const {internalDispatch, idCardCheckoutData} = useContext(
    IdCardCheckoutContext
  )
  const {t} = useTranslation()
  const dispatch = useDispatch()

  const colorPickerRef = useRef('')
  useOutsideClickHandler(colorPickerRef, () => {
    toggleChromePicker(false)
  })

  useEffect(() => {
    const selectedValue = idCardCheckoutData.idCardConfig?.[fieldName]
    setOption(selectedValue || config[0]._id)
    if (!selectedValue) {
      internalDispatch({
        type: IDCheckoutActions.SET_ID_CARD_CONFIG,
        data: {
          ...idCardCheckoutData.idCardConfig,
          [fieldName]: config[0]._id,
        },
      })
    }
  }, [config])

  useEffect(() => {
    if (
      subFields &&
      (!activeColor || !idCardCheckoutData.idCardConfig?.lanyard_text)
    ) {
      internalDispatch({
        type: IDCheckoutActions.TOGGLE_NEXT_BUTTON_DISABILITY,
        data: true,
      })
    } else if (
      subFields &&
      activeColor &&
      idCardCheckoutData.idCardConfig?.lanyard_text
    ) {
      internalDispatch({
        type: IDCheckoutActions.TOGGLE_NEXT_BUTTON_DISABILITY,
        data: false,
      })
    } else {
      internalDispatch({
        type: IDCheckoutActions.TOGGLE_NEXT_BUTTON_DISABILITY,
        data: false,
      })
    }
  }, [activeColor, subFields, idCardCheckoutData.idCardConfig?.lanyard_text])
  useEffect(() => {
    internalDispatch({
      type: IDCheckoutActions.SET_ID_CARD_CONFIG,
      data: {
        ...idCardCheckoutData.idCardConfig,
        [fieldName]: selectedOptionId,
      },
    })
  }, [selectedOptionId])

  const handleChange = (fieldName, value) => {
    internalDispatch({
      type: IDCheckoutActions.SET_ID_CARD_CONFIG,
      data: {
        ...idCardCheckoutData.idCardConfig,
        [fieldName]: value,
      },
    })
  }

  const selectedOption =
    config &&
    config?.find((item) => {
      return item._id === selectedOptionId
    })

  const uploadUsignedUrl = ({file, signed_url, public_url}) => {
    uploadFileBySignedUrl(signed_url, file, {
      uploadFinished: () => handleChange('lanyard_logo', public_url),
    })
  }
  const handleLogoUpload = ({value}) => {
    dispatch(
      globalActions.getDocumentImageUploadSignedUrl.request(
        {
          type: value.type,
          module: IDCARD,
          file: value,
        },
        uploadUsignedUrl
      )
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.carouselWrapper}>
        <CarouselComponent
          autoPlay
          centerSlidePercentage={100}
          emulateTouch
          items={selectedOption?.images}
          showIndicators={false}
        />
      </div>
      <div className={styles.otherOptions}>
        <Para
          size={PARA_CONSTANTS.TEXT_SIZE.LARGE}
          weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
          type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
          className={styles.selectHead}
        >
          {label}
        </Para>
        <Dropdown
          fieldName={fieldName}
          title="label"
          options={config?.map((item) => {
            return {label: item.name, value: item._id}
          })}
          selectedOptions={selectedOptionId}
          onChange={(selected) => setOption(selected.value)}
        />
        {subFields && (
          <div className={styles.extraFields}>
            {selectedOption?.colors && (
              <Para>
                Choose Colour
                <RequiredSymbol />
              </Para>
            )}
            <div className={styles.colors}>
              {selectedOption?.color_options && (
                <>
                  <div className={styles.colorWrapper} ref={colorPickerRef}>
                    <HeaderWithAddButton
                      action={() => toggleChromePicker(!showChromePicker)}
                    />
                    {showChromePicker && (
                      <div className={styles.popover}>
                        <ChromePicker
                          onChange={(color) => {
                            onColorChange(color.hex)
                          }}
                          onChangeComplete={(color) => {
                            onColorChange(color.hex)
                            handleChange('lanyard_color', color.hex)
                          }}
                          color={activeColor}
                          disableAlpha={true}
                        />
                      </div>
                    )}
                  </div>
                </>
              )}
              {selectedOption?.colors && (
                <CirclePicker
                  color={activeColor}
                  onChange={(color) => {
                    onColorChange(color.hex)
                    handleChange('lanyard_color', color.hex)
                  }}
                  colors={[...selectedOption?.colors]}
                  circleSize={24}
                  circleSpacing={4}
                  // className={styles.container}
                />
              )}
            </div>
            {activeColor && (
              <div className={styles.selectedColorDiv}>
                <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
                  Selected color:
                </Para>
                <span
                  className={styles.selectedColor}
                  style={{background: `${activeColor}`}}
                ></span>
              </div>
            )}

            <div className={styles.inputs}>
              <Input
                fieldName="lanyard_logo"
                onChange={handleLogoUpload}
                placeholder="Eg. abc.jpg"
                showMsg
                title="Upload Logo"
                type="file"
                classes={{wrapper: styles.fileInput}}
                acceptableTypes="image/*"
              />
              <Input
                title="Text to print"
                type="text"
                fieldName="lanyard_text"
                onChange={({value}) => handleChange('lanyard_text', value)}
                value={idCardCheckoutData?.idCardConfig?.lanyard_text}
                isRequired
                placeholder={'School name'}
                maxLength={50}
              />
            </div>
          </div>
        )}
        {selectedOption?.specifications && (
          <div className={styles.specifications}>
            <Para
              type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
              className={styles.helperTextHeading}
            >
              {t('customId.specifications')}
            </Para>
            <div className={styles.helperTextRowsWrapper}>
              {selectedOption.specifications.map((info) => (
                <div key={info} className={styles.helperTextrow}>
                  <Icon
                    name="checkCircle"
                    type={ICON_CONSTANTS.TYPES.SUCCESS}
                    size={ICON_CONSTANTS.SIZES.XX_SMALL}
                  />
                  <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>{info}</Para>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CardConfiguration
