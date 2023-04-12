/* eslint-disable no-unused-vars */
import React, {useEffect, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {
  Alert,
  ALERT_CONSTANTS,
  Button,
  Divider,
  Heading,
  HEADING_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  Para,
  PARA_CONSTANTS,
} from '@teachmint/krayon'
import styles from './Header.module.css'
import classNames from 'classnames'
function Header({onReset, showReset, isDuePresent}) {
  const {t} = useTranslation()
  const [showDueMessage, setshowDueMessage] = useState(false)
  const dueRef = useRef(null)

  useEffect(() => {
    if (!dueRef.current && isDuePresent) {
      setshowDueMessage(true)
    }
    if (!isDuePresent) {
      setshowDueMessage(false)
    }
  }, [isDuePresent])

  return (
    <div>
      <div className={'justify-between flex'}>
        <Heading
          className={'ml-2'}
          textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}
        >
          {t('tableFormatEditor')}
        </Heading>
        {showReset ? (
          <Button
            category="destructive"
            classes={{
              button: 'px-4',
            }}
            onClick={onReset}
            type="text"
          >
            {t('reset')}
          </Button>
        ) : null}
      </div>
      <Divider classes={{wrapper: styles.divider}} />
      {showDueMessage ? (
        <div className={classNames('pb-4')}>
          <Alert
            type={ALERT_CONSTANTS.TYPE.WARNING}
            hideClose
            content={
              <div className={classNames('flex justify-between items-center')}>
                <Para
                  textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
                  type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
                >
                  {t('dueMessage')}
                </Para>
                <Icon
                  name="close"
                  size={ICON_CONSTANTS.SIZES.XX_SMALL}
                  className={classNames('cursor-pointer')}
                  onClick={() => {
                    setshowDueMessage(false)
                    dueRef.current = true
                  }}
                />
              </div>
            }
          />
        </div>
      ) : null}
    </div>
  )
}

export default Header
