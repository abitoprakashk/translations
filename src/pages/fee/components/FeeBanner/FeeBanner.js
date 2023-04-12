import React from 'react'
import classNames from 'classnames'
import styles from './FeeBanner.module.css'
import {WEBINAR_STATUS} from '../../fees.constants'
import {useSelector} from 'react-redux'

export default function FeeBanner({
  phoneNo,
  handleTrainingClick = () => {},
  getNumber = () => {},
}) {
  const {webinarStatus} = useSelector((state) => state.feeStructure)

  const showWebinar = {
    none: true,
    registered: false,
    attended: false,
  }

  return (
    <div
      className={classNames(
        styles.backgroundColor,
        'tm-box-shadow1 tm-border-radius1 p-4 my-3 text-center'
      )}
    >
      {showWebinar.none && (
        <div className={styles.stripText}>
          <p className="tm-color-blue">
            {' '}
            <a
              href="https://forms.gle/Dj3ZSHbKzcGNSuQB9"
              target="_blank"
              rel="noreferrer"
              onClick={() => handleTrainingClick(WEBINAR_STATUS.NONE)}
            >
              Register
            </a>
          </p>
          <p className={styles.extraText}>
            to get Fee Module Training or call us at :{' '}
            <a href={getNumber()} className="tm-color-blue">
              {phoneNo}
            </a>
          </p>
        </div>
      )}

      {showWebinar.registered &&
        webinarStatus.status === WEBINAR_STATUS.REGISTERED && (
          <div className={styles.stripText}>
            <p className={styles.registeredExtraText}>
              Thanks for registering.{' '}
              <p className="tm-color-blue">
                {' '}
                <a
                  href="https://us06web.zoom.us/j/87598209127?pwd=K2JKd1ErZlo0UnRqS2VsWUtFNTM0dz09"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleTrainingClick(WEBINAR_STATUS.REGISTERED)}
                  className="tm-color-blue"
                >
                  {' '}
                  Click here{' '}
                </a>
              </p>{' '}
              to attend the product training session on 26th August at 3 pm
            </p>
          </div>
        )}

      {showWebinar.attended &&
        webinarStatus.status === WEBINAR_STATUS.ATTENDED && (
          <div className={styles.stripText}>
            <p className={styles.registeredExtraText}>
              Thanks for attending our product training webinar.
              <p className="tm-color-blue">
                {' '}
                <a
                  href="https://docs.google.com/forms/d/1DWaxOBoC0S0az5NCawc4xyOi7jJhkIFK-iE04zaCUoA/edit"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleTrainingClick(WEBINAR_STATUS.ATTENDED)}
                  className="tm-color-blue"
                >
                  Click here
                </a>
              </p>{' '}
              to share feedback
            </p>
          </div>
        )}
    </div>
  )
}
