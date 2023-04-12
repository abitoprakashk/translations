import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import styles from './SwitchAdmin.module.css'
import {switchAdminAction} from '../../../../redux/actions/commonAction'
import {REACT_APP_TEACHMINT_ACCOUNTS_URL} from '../../../../constants'

export default function SwitchAdmin() {
  const {showAdminSwitchPopup, adminInfo} = useSelector((state) => state)
  const dispatch = useDispatch()

  return (
    <>
      {showAdminSwitchPopup && (
        <div
          className={styles.container}
          onClick={() => dispatch(switchAdminAction(false))}
        >
          <div className={styles.iframeWrapper}>
            <iframe
              className={styles.iframe}
              src={`${REACT_APP_TEACHMINT_ACCOUNTS_URL}?switch_account=true&current_id=${adminInfo?._id}`}
            />

            <img
              className={styles.iframeCross}
              alt=""
              src="https://storage.googleapis.com/tm-assets/icons/primary/close-primary.svg"
              onClick={() => dispatch(switchAdminAction(false))}
            />
          </div>
        </div>
      )}
    </>
  )
}
