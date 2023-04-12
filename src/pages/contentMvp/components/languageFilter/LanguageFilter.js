import {Dropdown} from '@teachmint/krayon'
import React, {useEffect} from 'react'
import styles from './LanguageFilter.module.css'
import {DEFAULT_LANGUAGE, PAGE_PATH, PAYLOAD_FIELDS} from '../../constants'
import {useDispatch, useSelector} from 'react-redux'
import {useHistory, useParams} from 'react-router-dom'
import {CONTENT_ACTION_TYPES} from '../../redux/actionTypes'
import globIcon from '../../../../assets/images/icons/glob-dark-gray.svg'
import {events} from '../../../../utils/EventsConstants'
import {
  clearContentAction,
  setLanguageAction,
} from '../../redux/actions/contentActions'
import {useContent} from '../../redux/contentSelectors'
import {getUrlWithParams} from '../../commonFunctions'

export default function LanguageFilter() {
  const {currentLanguage, languageList, selectedCourse} = useContent()
  const eventManager = useSelector((state) => state.eventManager)
  const urlParams = useParams()

  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    if (selectedCourse) {
      if (!languageList?.[selectedCourse]) {
        dispatch({
          type: CONTENT_ACTION_TYPES.FETCH_TAXONOY_REQUESTED,
          payload: {
            field: PAYLOAD_FIELDS.language,
            tfile_id: selectedCourse,
          },
        })
      } else if (!currentLanguage) {
        const language = languageList[selectedCourse]?.[DEFAULT_LANGUAGE]
          ? DEFAULT_LANGUAGE
          : Object.keys(languageList[selectedCourse])[0]
        handleLanguageSelection(language)
      }
    }
  }, [selectedCourse, urlParams.language, currentLanguage])

  const handleLanguageSelection = (selectedLanguage) => {
    eventManager.send_event(events.PC_LANG_SELECTED, {
      language: selectedLanguage,
    })

    history.push(
      getUrlWithParams(PAGE_PATH.classPage, {
        course: selectedCourse,
        language: selectedLanguage,
      })
    )
    dispatch(clearContentAction(null))
    dispatch(setLanguageAction(selectedLanguage))
  }

  const languages = Object.keys(languageList?.[selectedCourse] || {})
  if (!languages.length) {
    return null
  }

  return (
    <div className={styles.dropdownContainer}>
      <Dropdown
        classes={{dropdownClass: styles.dropdown}}
        options={languages.map((value) => ({
          label: value,
          value,
        }))}
        isDisabled={languages.length < 2}
        onChange={({value}) => handleLanguageSelection(value)}
        selectedOptions={currentLanguage}
        selectionPlaceholder={
          <div className={styles.dropdownPlaceholder}>
            <img src={globIcon} className={styles.languageLogo} />
            <span>{currentLanguage}</span>
          </div>
        }
      />
    </div>
  )
}
