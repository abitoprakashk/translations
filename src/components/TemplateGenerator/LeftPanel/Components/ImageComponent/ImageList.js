import {Icon} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'
import {NONE} from '../../LeftPanel.constants'
import styles from './ImagesComponent.module.css'

const ImageList = ({images = [], onImageClick, imageDeleteHandler}) => {
  const {t} = useTranslation()
  return (
    <div className={styles.imageListWrapper}>
      {images?.length > 0 &&
        images.map((item) => {
          if (item === NONE)
            return (
              <div className={styles.none} onClick={() => onImageClick('none')}>
                {t('none')}
              </div>
            )
          return (
            <div key={item._id} onClick={() => onImageClick(item.url)}>
              <img src={item.url} alt="" />
              <div className={styles.overlayDiv}>
                {imageDeleteHandler && item?.default === false ? (
                  <>
                    <span
                      className={styles.imageDeleteBlock}
                      onClick={(e) => {
                        e.stopPropagation()
                        imageDeleteHandler(e, item._id)
                      }}
                    >
                      <Icon name="delete1" size="3xs" />
                    </span>
                  </>
                ) : null}
              </div>
            </div>
          )
        })}
    </div>
  )
}

export default ImageList
