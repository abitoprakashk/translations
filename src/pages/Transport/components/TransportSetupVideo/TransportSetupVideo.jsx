import classNames from 'classnames'
import {useTranslation} from 'react-i18next'
import styles from './transportSetupVideo.module.css'

export default function TransportSetupVideo({className}) {
  const {t} = useTranslation()

  return (
    <iframe
      src="https://www.youtube.com/embed/vjtfiqtP1sU"
      title={t('transportSetupVideoIframeTitle')}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen="allowfullscreen"
      className={classNames(styles.video, className)}
    ></iframe>
  )
}
