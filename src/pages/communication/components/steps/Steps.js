import React from 'react'
import classNames from 'classnames'
import styles from './Steps.module.css'
import {Trans} from 'react-i18next'

const Steps = ({currentStepIndex, allSteps}) => {
  const renderSteps = () => {
    return allSteps.map((step, index) => (
      <div
        key={step}
        className={classNames(
          styles.step,
          index === currentStepIndex ? styles.doing : ''
        )}
      >
        <div
          className={classNames(
            styles.dot,
            index < currentStepIndex
              ? styles.doneDot
              : index == currentStepIndex
              ? styles.doingDot
              : ''
          )}
        >
          {index < allSteps.length - 1 && (
            <div
              className={classNames(
                styles.line,
                index < currentStepIndex
                  ? styles.doneLine
                  : index == currentStepIndex
                  ? styles.doingLine
                  : ''
              )}
            ></div>
          )}
        </div>
        <div className={styles.stepText}>
          <Trans i18nKey={'communicationStep'}>{step}</Trans>
        </div>
      </div>
    ))
  }
  return <div className={styles.stepsWrapper}>{renderSteps()}</div>
}

export default Steps
