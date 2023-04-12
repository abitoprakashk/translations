import {Button, Icon, IconFrame, ICON_CONSTANTS, Para} from '@teachmint/krayon'
import classNames from 'classnames'
import React from 'react'
import {useTranslation} from 'react-i18next'
import styles from './styles.module.css'

function EmptyScreen({
  name = 'graph1',
  desc = 'publishedCustomreports',
  onClick = () => {},
  cta = 'createCustomReports',
  classes = {desc: ''},
}) {
  const {t} = useTranslation()
  return (
    <div className={styles.wrapper}>
      <IconFrame type="primary">
        <Icon
          name={name}
          type={ICON_CONSTANTS.TYPES.SECONDARY}
          size={ICON_CONSTANTS.SIZES.X_SMALL}
        />
      </IconFrame>
      <Para className={classNames(styles.mtopMedium, classes.desc)}>
        {t(desc)}
      </Para>
      {cta ? (
        <Button classes={{button: styles.twoxstopMedium}} onClick={onClick}>
          {t(cta)}
        </Button>
      ) : null}
    </div>
  )
}

export default EmptyScreen
