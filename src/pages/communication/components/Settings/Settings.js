import classNames from 'classnames'
import React from 'react'
import {Trans, useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import {setIsCheckedAnonymousAction} from '../../redux/actions/commonActions'
import {setIsPollPublicAction} from '../../redux/actions/pollActions'
import styles from './Settings.module.css'

export default function Settings({surveyType}) {
  const {t} = useTranslation()
  const identityofRespondentsWillBeHidden = t(
    'identityofRespondentsWillBeHidden'
  )
  const allowRespondentsToSeePollResults = t('allowRespondentsToSeePollResults')
  const tYes = t('yes')
  const tNo = t('no')

  const {is_anonymous} = useSelector(
    ({communicationInfo}) => communicationInfo.common
  )
  const {is_poll_public} = useSelector(
    ({communicationInfo}) => communicationInfo.poll
  )
  const dispatch = useDispatch()

  const visiblityOptions = [
    {id: 1, label: tYes, value: true},
    {id: 2, label: tNo, value: false},
  ]

  const handleOnChange = () => {
    dispatch(setIsCheckedAnonymousAction(!is_anonymous))
  }

  const renderVisiblityRadio = () => {
    return visiblityOptions.map((item) => (
      <div className="mb-2" key={item.id}>
        <label>
          <input
            type="radio"
            value={item.value}
            name="visiblity"
            checked={is_poll_public === item.value}
            onChange={() => dispatch(setIsPollPublicAction(item.value))}
          />
          <span
            className={classNames(styles.settingsRadioOptionText, {
              [styles.settingsRadioOptionCheckedText]:
                is_poll_public !== item.value,
              [styles.settingsRadioOptionUncheckedText]:
                is_poll_public !== item.value,
            })}
          >
            {item.label}
          </span>
        </label>
      </div>
    ))
  }

  return (
    <div>
      <div className={classNames(styles.pollSettingsCardHeading, 'p-3')}>
        {t('settings')}
      </div>
      <hr className="mb-4" />
      {surveyType !== 'poll' && (
        <div className="flex ml-3 items-start">
          <input
            type="checkbox"
            className={styles.settingsCheckboxInput}
            checked={is_anonymous}
            onChange={handleOnChange}
          />
          <div className={styles.settingsCheckboxLabelSec}>
            <div className={styles.settingsCheckboxLabel}>
              {/* Make {surveyType || 'feedback'} anonymous */}
              <Trans i18nKey={'makeSurveyType'}>
                Make {surveyType || 'feedback'} anonymous
              </Trans>
            </div>
            <div className={styles.settingsCheckboxLabelSubInfo}>
              {identityofRespondentsWillBeHidden}
            </div>
          </div>
        </div>
      )}

      {surveyType === 'poll' && (
        <div className="py-4 ml-3">
          <div className={styles.settingsRadioHeading}>
            {allowRespondentsToSeePollResults}
          </div>
          <div className="py-2">{renderVisiblityRadio()}</div>
        </div>
      )}
    </div>
  )
}
