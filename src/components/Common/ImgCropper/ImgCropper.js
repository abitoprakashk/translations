import React, {useState, useRef, useEffect} from 'react'
import ReactCrop, {centerCrop, makeAspectCrop} from 'react-image-crop'
import {Input} from '@teachmint/krayon'
import {canvasPreview} from './canvasPreview'
import {useDebounceEffect} from './useDebounceEffect'
import 'react-image-crop/dist/ReactCrop.css'
import styles from './ImgCropper.module.css'
import classNames from 'classnames'

/*
 * This component accepts 3 setting parameters, 4 text parameters and 1 style parameter:
 * 1. scale - To scale selected image. Default set to 1.
 * 2. rotate - To rotate selected image. Default set to 0.
 * 3. aspect - To set aspect ratio for crop. Default set to undefined.
 *
 * Referrence - https://codesandbox.io/s/react-image-crop-demo-with-react-hooks-y831o?file=/src/App.tsx:0-4243
 */
export default function ImgCropper({
  scale = 1,
  rotate = 0,
  aspect = undefined,
  title = '',
  placeholder = '',
  helperText = '',
  fieldName = 'file',
  classes = {},
  updatePreview,
  showPreview,
  uploadButtonTitle,
  handleChange,
}) {
  const [imgSrc, setImgSrc] = useState('')
  const [crop, setCrop] = useState()
  const [completedCrop, setCompletedCrop] = useState()
  const [infoMsg, setInfoMsg] = useState('')
  const previewCanvasRef = useRef(null)
  const imgRef = useRef(null)
  const [fileType, setFileType] = useState('')

  // reset preview if there is no image
  useEffect(() => {
    if (!imgSrc) {
      updatePreview(null)
    }
  }, [imgSrc])

  function centerAspectCrop(mediaWidth, mediaHeight, aspect = 16 / 5) {
    return centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspect,
        mediaWidth,
        mediaHeight
      ),
      mediaWidth,
      mediaHeight
    )
  }

  function onSelectFile({value}) {
    setInfoMsg('')
    if (value) {
      handleChange()
      if (value.type != 'image/jpeg' && value.type != 'image/png') {
        setInfoMsg('Invalid file type')
        return false
      }
      if (value.size > 204800) {
        setInfoMsg('File size is larger than 200 KB')
        return false
      }
      setFileType(value.type)
      setCrop(undefined) // Makes crop preview update between images.
      const reader = new FileReader()
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || '')
      )
      reader.readAsDataURL(value)
    } else {
      setImgSrc(undefined)
    }
  }

  function onImageLoad(e) {
    const {width, height} = e.currentTarget
    setCrop(centerAspectCrop(width, height, aspect))
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate,
          updatePreview,
          fileType
        )
      }
    },
    100,
    [completedCrop, scale, rotate]
  )

  return (
    <div className={classNames(styles.App, classes.imgCropperContainer)}>
      <div className={styles.cropControls}>
        <Input
          defaultText={helperText}
          infoType={infoMsg ? 'error' : ''}
          fieldName={fieldName}
          isRequired={false}
          onChange={onSelectFile}
          placeholder={placeholder}
          showMsg
          title={title}
          actionName={uploadButtonTitle}
          type="file"
          classes={classes}
          acceptableTypes={'image/jpeg,image/png'}
          infoMsg={infoMsg}
        />
      </div>
      {!!imgSrc && (
        <>
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={imgSrc}
              style={{transform: `scale(${scale}) rotate(${rotate}deg)`}}
              onLoad={onImageLoad}
            />
          </ReactCrop>
          {!!completedCrop && (
            <div>
              <canvas
                ref={previewCanvasRef}
                className={showPreview ? styles.croppedImageCanvas : 'hidden'}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
