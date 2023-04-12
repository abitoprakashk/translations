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
  marginFields,
} from '../../../../components/TemplateGenerator/TemplateGenerator.constants'
import styles from './PageSetupIdCard.module.css'
import landscapeIcon from './landscape.svg'
import portraitIcon from './portraitIcon.svg'
import {templatePageSettingsActions} from '../../../../components/TemplateGenerator/redux/TemplateGenerator.actionTypes'
import {useParams} from 'react-router-dom'
import {FRONT_AND_BACK, ID_DESIGN} from '../../CustomId.constants'
import classNames from 'classnames'

const radioStyle = {label: styles.radioText}

const PageSetupIdCard = () => {
  const {userType} = useParams()
  const [config, setConfig] = useState({
    pagesize: 'IDCARD',
    orientation: 'PORTRAIT',
    margin: {left: '0.4', right: '0.4', top: '0.2', bottom: '0.1'},
    design: FRONT_AND_BACK,
    name: '',
    description: '',
  })
  const [addMargins, setAddMargin] = useState(false)
  const [isDisabled, setDisabled] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    if (addMargins) {
      const pageSetupDiv = document.getElementById('marginInputs')
      pageSetupDiv.scrollIntoView({
        behavior: 'smooth',
      })
    }
  }, [addMargins])

  useEffect(() => {
    setDisabled(!config.name)
  }, [config])

  const designOptions = [
    {
      label: t('customId.frontBackLayout'),
      value: ID_DESIGN.FRONT_BACK,
      classes: radioStyle,
    },
    {
      label: t('customId.frontLayout'),
      value: ID_DESIGN.FRONT,
      classes: radioStyle,
    },
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
    const {pagesize, orientation, margin, name, description, design} = config
    dispatch({
      type: templatePageSettingsActions.SET_PAGE_SETTINGS,
      payload: {
        pageSettings: {pagesize, orientation, margin, design},
        name,
        description,
      },
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
        header={`${t('customId.createNewTemplate')} ${t(
          userType
        ).toLowerCase()}`}
        onClose={() => history.back()}
        size={MODAL_CONSTANTS.SIZE.AUTO}
        classes={{content: classNames('show-scrollbar show-scrollbar-small')}}
      >
        <div
          className={classNames(
            styles.modalBody,
            'show-scrollbar show-scrollbar-small'
          )}
          id="pageSetupDiv"
        >
          <Input
            title={t('customId.templateName')}
            type={INPUT_TYPES.TEXT}
            isRequired
            placeholder={t('customId.templateNamePlaceholder')}
            value={config.name}
            fieldName="name"
            onChange={onChange}
            maxLength={30}
            autoFocus
          />
          <div className={styles.designDiv}>
            <Para weight={PARA_CONSTANTS.WEIGHT.MEDIUM}>
              {t('customId.designId')}
            </Para>
            <div className={styles.orientationInput}>
              <RadioGroup
                size={RADIO_CONSTANTS.SIZE.SMALL}
                options={designOptions}
                selectedOption={config.design}
                handleChange={({selected}) => {
                  onChange({fieldName: 'design', value: selected})
                }}
              />
            </div>
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
                  onClick={() => setAddMargin(true)}
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

export default PageSetupIdCard
