import {useEffect, useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import styles from './ReviewMessage.module.css'
import {Datepicker, Input, TimePicker} from '@teachmint/krayon'
import {
  setDisplayUiData,
  addUserInputData,
  setAllVarsFilled,
} from '../../../../redux/actions/smsActions'
import {useTranslation} from 'react-i18next'
import {DateTime} from 'luxon'
import {Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import {SMS_VARIABLE_TYPES} from '../../../../constants'
export const ReviewMessage = ({data, setData}) => {
  const {smsBody, templateVariables, displayUiData} = useSelector(
    (state) => state.communicationInfo.sms
  )
  const [filledVariables, setFilledVariables] = useState(0)
  const [totalVariables, setTotalVariables] = useState(0)
  const [valueList, setValueList] = useState({})
  const [errorText, setErrorText] = useState('')
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const getVariableName = (text) => {
    const getVariableNamePattern = /[^{}]*(?=\})/g
    return text.match(getVariableNamePattern)
  }
  const setDateFormat = (date) => {
    return DateTime.fromJSDate(date).toLocaleString(DateTime.DATE_MED)
  }
  const checkIfTypeIsDate = (key) => {
    return templateVariables[key].input_type === SMS_VARIABLE_TYPES.DATE
  }
  const handleChange = (value, index, varType) => {
    let dumpVal = value
    if (checkIfTypeIsDate(varType)) {
      dumpVal = setDateFormat(new Date(value))
    }
    if (templateVariables[varType].input_type === SMS_VARIABLE_TYPES.TEXT) {
      if (dumpVal.length > 30) {
        setErrorText(t('commSmsErrorText'))
        return
      } else {
        setErrorText('')
      }
    }
    let tempApiData = {...data, [varType]: dumpVal}
    if (!dumpVal) {
      dispatch(setAllVarsFilled(false))
      delete tempApiData[varType]
    }
    let filledCount = Object.keys(tempApiData).length
    if (filledCount === totalVariables) {
      dispatch(setAllVarsFilled(true))
    }
    setValueList({...valueList, [index]: value})
    setFilledVariables(filledCount)
    setData(tempApiData)
  }

  const renderSmsContent = (index, varType) => {
    if (templateVariables[varType].input_type === SMS_VARIABLE_TYPES.DATE) {
      return (
        <div className={styles.dateOutsideWrapper}>
          <Datepicker
            key={index}
            onChange={(value) => handleChange(value, index, varType)}
            value={valueList[index] || ''}
            closeOnChange={true}
            dateFormat="dd MMM yy"
            classes={{input: styles.inputWrapper}}
            inputProps={{placeholder: templateVariables[varType].display_name}}
          />
        </div>
      )
    }
    if (templateVariables[varType].input_type === SMS_VARIABLE_TYPES.TIME) {
      return (
        <TimePicker
          key={index}
          setTime={(value) => handleChange(value, index, varType)}
          placeholder={templateVariables[varType].display_name}
          className={styles.timeFieldWrapper}
        />
      )
    }
    return (
      <Input
        key={index}
        type={templateVariables[varType].input_type}
        value={valueList[index]}
        onChange={({value}) => handleChange(value, index, varType)}
        classes={{wrapper: styles.inputWrapper}}
        placeholder={templateVariables[varType].display_name}
      />
    )
  }
  useEffect(() => {
    setData({})
  }, [])
  useEffect(() => {
    let tempString = smsBody
    const pattern = /\s*(\{[a-z_]+\})\s*/g
    const result = tempString.split(pattern).filter(Boolean)
    dispatch(setAllVarsFilled(false))
    if (getVariableName(tempString)) {
      setTotalVariables(getVariableName(tempString).length / 2)
    } else {
      dispatch(setAllVarsFilled(true))
    }
    dispatch(setDisplayUiData(result))
    dispatch(addUserInputData({}))
  }, [smsBody])

  return (
    <div className={styles.outsideContainer}>
      <div className={styles.container}>
        <div className={styles.titleArea}>
          <div>{t('reviewMessageBodyTitle')}</div>
          <div>
            {filledVariables}/{totalVariables} blanks filled
          </div>
        </div>
        <div className={styles.smsBubble}>
          <div className={styles.smsBodyContainer}>
            {displayUiData.map((item, index) => {
              const varName = getVariableName(item)
              if (varName) {
                let varType = varName[0]
                return renderSmsContent(index, varType)
              } else {
                return (
                  <span key={index} className={styles.messageText}>
                    {item}
                  </span>
                )
              }
            })}
          </div>
        </div>
        {errorText ? (
          <div className={styles.errorText}>
            <Icon
              name="error"
              type={ICON_CONSTANTS.TYPES.ERROR}
              version={ICON_CONSTANTS.VERSION.OUTLINED}
              size={ICON_CONSTANTS.SIZES.XX_SMALL}
            />
            &nbsp;
            {errorText}
          </div>
        ) : null}
      </div>
      <div className={styles.helpTitle}>{t('reviewMessageHelperTitle')}</div>
      <div className={styles.smsHelpContainer}>
        <div className={styles.helperInputText}>
          •&nbsp; <span>Fill details for</span>
          <Input
            type="text"
            disabled
            placeholder="Enter detail"
            classes={{wrapper: styles.inputWrapper}}
          />
          &nbsp; <span>in the content box to proceed</span>
        </div>
        <div>•&nbsp;{t('reviewMessageHelperBody2')}</div>
      </div>
    </div>
  )
}
