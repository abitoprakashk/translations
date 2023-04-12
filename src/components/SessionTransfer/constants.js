import {t} from 'i18next'

export const TIME_IN_MILLISECONDS_TO_SHOW_SUCCESS_MODAL = 2000

export const STEP = {
  CLASSROOM: 'CLASSROOM',
  FEE: 'FEE',
}

export const STEPS_ORDER = {
  [STEP.CLASSROOM]: 1,
  [STEP.FEE]: 2,
}

export const TRANSFER_STEPS = [
  {
    id: STEP.CLASSROOM,
    description: t('importClassesStepperDesc'),
    title: t('classRoomStructure'),
  },
  {
    id: STEP.FEE,
    description: t('importFeeConfigStepperDesc'),
    title: t('feeStructure'),
  },
]
