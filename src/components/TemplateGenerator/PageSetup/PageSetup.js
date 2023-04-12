import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import {
  Modal,
  MODAL_CONSTANTS,
  Input,
  INPUT_TYPES,
  RadioGroup,
  Button,
  BUTTON_CONSTANTS,
  RADIO_CONSTANTS,
  Radio,
  Para,
  PARA_CONSTANTS,
} from '@teachmint/krayon'
import {t} from 'i18next'
import {
  orientation,
  paperSize,
  marginFields,
} from '../TemplateGenerator.constants'
import styles from './PageSetup.module.css'
import landscapeIcon from './landscape.svg'
import portraitIcon from './portraitIcon.svg'
import {templatePageSettingsActions} from '../redux/TemplateGenerator.actionTypes'
import {useHistory, useLocation} from 'react-router-dom'
import {eventManagerSelector} from '../../../redux/reducers/CommonSelectors'
import {TEMPLATE_GENERATOR_EVENTS} from '../TemplateGenerator.events'

const radioStyle = {label: styles.radioText}

const PageSetup = ({redirectURL}) => {
  const {search} = useLocation()
  const templateType = new URLSearchParams(search).get('templateType')
  const eventManager = eventManagerSelector()
  const history = useHistory()
  const [config, setConfig] = useState({
    pagesize: 'A4',
    orientation: 'PORTRAIT',
    margin: {left: '0.5', right: '0.5', top: '0.5', bottom: '0.5'},
    name: '',
    description: '',
  })
  const [addMargins, setAddMargin] = useState(false)
  const [isDisabled, setDisabled] = useState(true)
  const dispatch = useDispatch()
  const showDescription = false

  useEffect(() => {
    if (addMargins) {
      const pageSetupDiv = document.getElementById('marginInputs')
      pageSetupDiv.scrollIntoView({
        behavior: 'smooth',
      })
    }
  }, [addMargins])

  useEffect(() => {
    if (showDescription) {
      const allowConfirm = Object.values(config).every((v) => !!v)
      if (allowConfirm) setDisabled(false)
      else setDisabled(true)
    } else setDisabled(!config.name)
  }, [config])

  const pageOptions = [
    {
      label: paperSize.A4,
      value: paperSize.A4,
      classes: radioStyle,
    },
    // {
    //   label: 'US Letter',
    //   value: paperSize.LETTER,
    //   classes: radioStyle,
    // },
  ]

  const orientationOptions = [
    {
      label: t('portrait'),
      image: portraitIcon,
      value: orientation.PORTRAIT,
      classes: radioStyle,
    },
    {
      label: t('landscape'),
      image: landscapeIcon,
      value: orientation.LANDSCAPE,
      classes: radioStyle,
    },
  ]

  const onChange = ({fieldName, value}) => {
    setConfig({...config, [fieldName]: value})
  }

  const marginChange = ({fieldName, value}) => {
    const {margin} = {...config}
    margin[fieldName] = value
    setConfig({...config, margin})
  }

  const onConfirm = () => {
    triggerEvent(
      TEMPLATE_GENERATOR_EVENTS.TEMPLATE_MAKER_TEMPLATE_CREATE_NOW_CLICKED_TFI,
      {name: config?.name}
    )
    const {pagesize, orientation, margin, name, description} = config
    dispatch({
      type: templatePageSettingsActions.SET_PAGE_SETTINGS,
      payload: {
        pageSettings: {pagesize, orientation, margin},
        name,
        description,
      },
    })
  }

  const triggerEvent = (eventName, data) => {
    eventManager.send_event(eventName, {
      template_type: templateType,
      ...data,
    })
  }

  return (
    <div>
      <Modal
        isOpen={true}
        actionButtons={[
          {
            body: t('next'),
            onClick: onConfirm,
            isDisabled,
          },
        ]}
        header={t('templateGenerator.createNewTemplate')}
        onClose={() => {
          triggerEvent(
            TEMPLATE_GENERATOR_EVENTS.TEMPLATE_MAKER_CLOSE_CLICKED_TFI
          )
          redirectURL ? history.push(redirectURL) : history.goBack()
        }}
        size={MODAL_CONSTANTS.SIZE.AUTO}
      >
        <div className={styles.modalBody} id="pageSetupDiv">
          <Input
            title={t('templateGenerator.certificate_name')}
            type={INPUT_TYPES.TEXT}
            isRequired
            placeholder={t('templateGenerator.certificate_name_placeholder')}
            value={config.name}
            fieldName="name"
            onChange={onChange}
            maxLength={30}
            onBlur={() =>
              triggerEvent(
                TEMPLATE_GENERATOR_EVENTS.TEMPLATE_MAKER_TEMPLATE_NAME_FILLED_TFI,
                {name: config.name}
              )
            }
            autoFocus
          />
          {showDescription && (
            <Input
              title={t('templateGenerator.certificate_desc')}
              type={INPUT_TYPES.TEXT_AREA}
              isRequired
              placeholder={t('templateGenerator.certificate_desc_placeholder')}
              fieldName="description"
              onChange={onChange}
              maxLength={50}
              rows={1}
              value={config.description}
            />
          )}
          <div className={styles.pageSize}>
            <Para weight={PARA_CONSTANTS.WEIGHT.MEDIUM}>
              {t('templateGenerator.paperSize')}
            </Para>
            <RadioGroup
              size={RADIO_CONSTANTS.SIZE.SMALL}
              options={pageOptions}
              selectedOption={config.pagesize}
              handleChange={({selected}) => {
                triggerEvent(
                  TEMPLATE_GENERATOR_EVENTS.TEMPLATE_MAKER_TEMPLATE_PAPER_SIZE_SELECTED_TFI,
                  {paper_size: selected}
                )
                onChange({fieldName: 'pagesize', value: selected})
              }}
            />
          </div>
          <div className={styles.orientationDiv}>
            <Para weight={PARA_CONSTANTS.WEIGHT.MEDIUM}>
              {t('templateGenerator.orientation')}
            </Para>
            <div className={styles.orientationInput}>
              {orientationOptions.map((item) => {
                return (
                  <div key={item?.value}>
                    <div
                      className={styles.imgContainer}
                      onClick={() => {
                        triggerEvent(
                          TEMPLATE_GENERATOR_EVENTS.TEMPLATE_MAKER_TEMPLATE_ORIENTATION_SELECTED_TFI,
                          {orientation: item?.value}
                        )
                        onChange({fieldName: 'orientation', value: item?.value})
                      }}
                    >
                      <img src={item.image} alt="" />
                    </div>
                    <Radio
                      isSelected={config.orientation === item?.value}
                      fieldName={item?.value}
                      label={item?.label || item?.value}
                      size={RADIO_CONSTANTS.SIZE.SMALL}
                      icon={item?.icon}
                      iconType={item?.iconType}
                      handleChange={({fieldName}) => {
                        triggerEvent(
                          TEMPLATE_GENERATOR_EVENTS.TEMPLATE_MAKER_TEMPLATE_ORIENTATION_SELECTED_TFI,
                          {orientation: fieldName}
                        )
                        onChange({fieldName: 'orientation', value: fieldName})
                      }}
                      classes={item.classes}
                    />
                  </div>
                )
              })}
            </div>
          </div>
          <div>
            {!addMargins ? (
              <div className={styles.addMarginButton}>
                <Button
                  onClick={() => {
                    triggerEvent(
                      TEMPLATE_GENERATOR_EVENTS.TEMPLATE_MAKER_TEMPLATE_ADD_PAGE_MARGIN_CLICKED_TFI
                    )
                    setAddMargin(true)
                  }}
                  type={BUTTON_CONSTANTS.TYPE.TEXT}
                  prefixIcon="add"
                >
                  {t('templateGenerator.addPageMargins')}
                </Button>
              </div>
            ) : (
              <div className={styles.marginDiv}>
                <Para weight={PARA_CONSTANTS.WEIGHT.MEDIUM}>
                  {t('templateGenerator.margin')}
                </Para>
                <div className={styles.marginInputs} id="marginInputs">
                  {marginFields.map((item) => {
                    return (
                      <Input
                        key={item.fieldName}
                        fieldName={item.fieldName}
                        onChange={marginChange}
                        value={config.margin[item.fieldName]}
                        title={item.label}
                        type={INPUT_TYPES.TEXT}
                        placeholder="0.5"
                        suffix="cm"
                      />
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default PageSetup
