import {hideToast} from '../../redux/actions/commonAction'
import {ToastStack} from '@teachmint/common'
import React from 'react'
import {shallowEqual, useDispatch, useSelector} from 'react-redux'
import styles from './AppToastStack.module.css'

function AppToastStack() {
  const dispatch = useDispatch()
  const toasts = useSelector((state) => {
    return Object.values(state.toasts)
  }, shallowEqual)
  return (
    <ToastStack
      className={styles.wrapper}
      autoClose
      toastList={toasts}
      onCloseClick={(id) => dispatch(hideToast({id}))}
    />
  )
}

export default AppToastStack
