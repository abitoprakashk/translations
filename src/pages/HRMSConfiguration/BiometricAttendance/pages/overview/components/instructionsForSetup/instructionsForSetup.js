import React from 'react'
import styles from './instructionsForSetup.module.css'
import {Heading, PlainCard} from '@teachmint/krayon'
import classNames from 'classnames'
import {t} from 'i18next'
import {
  STEPPER_CONSTANTS,
  Para,
  PARA_CONSTANTS,
  Stepper,
} from '@teachmint/krayon'

export default function InstructionsForSetup() {
  const subSteps = {
    1: [
      t('connectBiometricMachineToInternet'),
      t('connectBiometricMachineToTeachmint'),
      [
        t('connectBiometricMachineToTeachmintESSL'),
        t('connectBiometricMachineToTeachmintBiomax'),
        t('connectBiometricMachineToTeachmintRealtime'),
      ],
    ],
    2: [
      t('insertBiometricMachineSerialNumber'),
      t('verifyBiometricMachineWithTeachmint'),
      t('noteVerifyBiometricMachineWithTeachmint'),
    ],
    3: [
      t('registerBiometricUsersManually'),
      t('mapBiometricUserIDManually'),
      t('verifyBiometricUserIDS'),
    ],
  }

  const SubSubSteps = ({item, index}) => {
    if (typeof item === 'string' || item instanceof String) {
      return `${String.fromCharCode(97 + index)}. ${item}`
    } else {
      return (
        <div className={styles.subStepDiv}>
          <ul>
            {item?.map((subitem, subindex) => (
              <li className={styles.listStyle} key={subindex}>
                {subitem}
              </li>
            ))}
          </ul>
        </div>
      )
    }
  }

  const StepComp = ({id}) => {
    return (
      <div className={styles.stepDiv2}>
        {subSteps[id].map((item, index) => (
          <Para
            textSize={PARA_CONSTANTS.TEXT_SIZE.X_LARGE}
            type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
            className={styles.subpoints}
            key={index}
          >
            <SubSubSteps item={item} index={index} />
          </Para>
        ))}
      </div>
    )
  }

  const MAJOR_STEPS = [
    {
      id: 1,
      title: t('biometricMachineConfiguration'),
      status: STEPPER_CONSTANTS.STATUS.NOT_STARTED,
      description: <StepComp id={1} />,
    },
    {
      id: 2,
      title: t('biometricMachineRegistration'),
      status: STEPPER_CONSTANTS.STATUS.NOT_STARTED,
      description: <StepComp id={2} />,
    },
    {
      id: 3,
      title: t('biometricUserRegistrationAndMapping'),
      status: STEPPER_CONSTANTS.STATUS.NOT_STARTED,
      description: <StepComp id={3} />,
    },
  ]

  return (
    <PlainCard className={classNames(styles.card)}>
      <Heading
        textSize="xxx_s"
        className={classNames(styles.fontWeight500, styles.fontLarge)}
      >
        {t('biometricIntegrationGuide')}
      </Heading>
      <div className={styles.stepsSection}>
        <Stepper
          isVertical={true}
          onClickOfStep={() => {}}
          steps={MAJOR_STEPS}
          classes={{
            wrapper: styles.stepperWrapper,
            step: styles.stepsStyle,
            infoWrapper: styles.infoWrapper,
            description: styles.stepDescription,
          }}
        />
      </div>
    </PlainCard>
  )
}
