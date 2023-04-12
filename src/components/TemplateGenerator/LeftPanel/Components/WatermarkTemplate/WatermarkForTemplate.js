import {RangeSlider} from '@teachmint/krayon'
import React, {useCallback} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch} from 'react-redux'
import {templatePageSettingsActions} from '../../../redux/TemplateGenerator.actionTypes'
import {useTemplateWaterMark} from '../../../redux/TemplateGenerator.selectors'
import ImagesComponent from '../ImageComponent/ImagesComponent'
import styles from './WatermarkForTemplate.module.css'

const WatermarkForTemplate = ({module}) => {
  const dispatch = useDispatch()
  const watermarkData = useTemplateWaterMark()
  const {t} = useTranslation()
  const onWatermarkSelect = (url) => {
    if (url === 'none') {
      dispatch({
        type: templatePageSettingsActions.SET_WATERMARK_URL,
        payload: '',
      })
    } else
      dispatch({
        type: templatePageSettingsActions.SET_WATERMARK_URL,
        payload: url,
      })
  }

  const handleOpacityChange = useCallback((obj) => {
    dispatch({
      type: templatePageSettingsActions.SET_WATERMARK_OPACITY,
      payload: obj.selectedMax.toString(),
    })
  }, [])

  const handleSizeChange = useCallback((obj) => {
    dispatch({
      type: templatePageSettingsActions.SET_WATERMARK_SIZE,
      payload: obj.selectedMax.toString(),
    })
  }, [])

  return (
    <>
      <ImagesComponent
        type={'WATERMARK'}
        onImageClick={onWatermarkSelect}
        allowedFormates={['image/png', '.png']}
        label="Add Logo"
        module={module}
        alertContent={t('templateGenerator.uploadSizeLimitText')}
      />
      {watermarkData?.url && (
        <div className={styles.wrapper}>
          <div>
            <RangeSlider
              type={'single'}
              min={0}
              max={100}
              label={t('templateGenerator.chooseOpacity')}
              onChange={handleOpacityChange}
              step={1}
              disabled={!watermarkData?.url}
              preSelectedMax={watermarkData?.opacity || 50}
              classes={{label: styles.sliderLabel}}
            />
          </div>
          <div>
            <RangeSlider
              type={'single'}
              min={0}
              max={100}
              label={t('templateGenerator.chooseSize')}
              onChange={handleSizeChange}
              step={1}
              disabled={!watermarkData?.url}
              preSelectedMax={watermarkData?.size || 50}
              classes={{label: styles.sliderLabel}}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default WatermarkForTemplate
