import React from 'react'
import {Button} from '@teachmint/common'
import loadingImg from '../../../assets/images/icons/loader.png'
import s from './LoadingButton.module.css'
const LoadingButton = (props) => {
  return (
    <Button className={s.button} disabled {...props}>
      <img src={loadingImg} alt="" />
    </Button>
  )
}

export default LoadingButton
