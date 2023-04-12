import axios from 'axios'
import {
  REACT_APP_API_URL,
  BACKEND_HEADERS,
} from '../../../../../../src/constants'
import React, {useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {Radio, Divider} from '@teachmint/krayon'
import classNames from 'classnames'
import SettingsHeader from '../SettingsHeader/SettingsHeader'
import styles from './GlobalLanguageSettings.module.css'
import languages from './constant'
import i18n from 'i18next'
import {adminInfoAction} from '../../../../../redux/actions/adminInfo'

const GlobalLanguageSettings = () => {
  const dispatch = useDispatch()
  const {adminInfo} = useSelector((state) => state)
  const [selectedLanguage, setSelectedLanguage] = useState(
    adminInfo.lang || 'en'
  )
  const handleChange = (language) => {
    return new Promise(() => {
      let data = {lang: language}

      axios({
        method: 'POST',
        url: `${REACT_APP_API_URL}institute-admin/admin/info/update`,
        headers: BACKEND_HEADERS,
        data: data,
      }).then((response) => {
        if (response && response.data && response.data.status === true) {
          setSelectedLanguage(language)
          localStorage.setItem('lang', language)
          adminInfo.lang = language
          dispatch(adminInfoAction(adminInfo))
          i18n.changeLanguage(localStorage.getItem('lang'))
        }
      })
    })
  }

  return (
    <>
      <div>
        <SettingsHeader />
        <div className={`${styles.preferrence_settings_container}`}>
          <div
            className={classNames(
              `tm-border-radius1`,
              styles.preferrence_settings_card
            )}
          >
            {Object.keys(languages).map((language, i) => {
              return (
                <div key={i}>
                  <Radio
                    fieldName={languages[language]}
                    handleChange={() => handleChange(language)}
                    isSelected={language == selectedLanguage ? true : false}
                    label={languages[language]}
                    classes={{label: styles.label}}
                  />
                  {i !== Object.keys(languages).length - 1 && (
                    <span className={styles.divider_line}>
                      <Divider></Divider>
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
export default GlobalLanguageSettings
