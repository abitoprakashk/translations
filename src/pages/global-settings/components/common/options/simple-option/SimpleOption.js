import classNames from 'classnames'
// import {useState} from 'react'
import styles from './SimpleOption.module.css'
import {useTranslation} from 'react-i18next'

const SimpleOption = ({
  titleId,
  intiallySelectedOption,
  handleAction,
  optionsList,
}) => {
  const {t} = useTranslation()
  // const [selectedOption, setSelectedOption] = useState(intiallySelectedOption)

  const titleStyle = (id) => {
    return intiallySelectedOption === id
      ? classNames(styles.simpleOptionTitle, styles.simpleOptionTextWhite)
      : classNames(styles.simpleOptionTitle, styles.simpleOptionPrimaryText)
  }

  return (
    <>
      {optionsList &&
        optionsList.map(({id, icon, iconSelected, title}) => (
          <div
            key={id}
            className={classNames(styles.simpleOptionWrapper, {
              [styles.simpleOptionBGBlue]: intiallySelectedOption === id,
              [styles.simpleOptionBGWhite]: intiallySelectedOption !== id,
            })}
            onClick={() => {
              // setSelectedOption(id)
              handleAction(titleId, id, true)
            }}
          >
            {intiallySelectedOption === id ? iconSelected : icon}
            <div className={titleStyle(id)}>{t(title)}</div>
          </div>
        ))}
    </>
  )
}

export default SimpleOption
