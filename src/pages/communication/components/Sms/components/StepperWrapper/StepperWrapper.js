import classNames from 'classnames'
import styles from './StepperWrapper.module.css'

export const StepperWrapper = ({currentStep, totalSteps}) => {
  const renderSteps = () => {
    const tempArr = [...Array(totalSteps)]
    return tempArr.map((item, index) => {
      return (
        <div
          key={index}
          className={classNames(styles.step, {
            [styles.activeStep]: index <= currentStep,
          })}
        ></div>
      )
    })
  }
  return (
    <div className={styles.outerMwebStepperWrapper}>
      <div className={styles.stepCount}>
        {'Step ' + `${currentStep + 1}` + '/' + `${totalSteps}`}
      </div>
      <div className={styles.stepperBarsWrapper}>{renderSteps()}</div>
    </div>
  )
}
