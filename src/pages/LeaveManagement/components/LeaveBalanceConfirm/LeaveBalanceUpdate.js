import React, {useEffect} from 'react'
import {
  Input,
  Button,
  Slider,
  Icon,
  Modal,
  useSmoothSlider,
} from '@teachmint/common'
import styles from './LeaveBalanceUpdate.module.scss'
import {Trans, useTranslation} from 'react-i18next'
import useLeaveBalanceForm from './hooks/useLeaveBalanceForm'
import {useDispatch, useSelector} from 'react-redux'
import {
  getLeaveBalance,
  hideLeaveBalanceUpdateForm,
  resetSessionLeaveResponse,
} from '../../redux/actions/leaveManagement.actions'
import {IS_MOBILE} from '../../../../constants'
import {events} from '../../../../utils/EventsConstants'

const LIMIT_EXCEED_ERROR_CODE = 7075

function LeavebalanceUpdateForm() {
  const {leaves, submitting, errors, success, setInputValue, submitLeaves} =
    useLeaveBalanceForm()

  const {t} = useTranslation()
  const eventManager = useSelector((state) => state.eventManager)

  const {error_code, error_obj: errorObj} = errors || {}

  const hasLimitError = leaves.reduce((acc, curr) => {
    if (
      error_code === LIMIT_EXCEED_ERROR_CODE &&
      curr.value < errorObj[curr.key.toLowerCase()]
    ) {
      acc[curr.key] = {
        limit: errorObj[curr.key.toLowerCase()],
      }
    }
    return acc
  }, {})

  useEffect(() => {
    eventManager.send_event(events.UPDATE_LEAVE_LIMIT_CLICKED_TFI)
  }, [success])

  return (
    <div className={styles.scroller}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <Icon name="edit1" color="basic" size="xs" type="filled" />
          <div>{t('editLeaveLimit')}</div>
        </div>
        <div className={styles.leaveBalanceForm}>
          <p className={styles.title}>{t('setQuotaForTypeOfLeaves')}</p>

          {leaves.map(({key, title, subtext, value}, index) => (
            <div className={styles.row} key={key}>
              <div>
                <div className={styles.rowTitle}>{title}</div>
                {subtext}
              </div>
              <Input
                className={styles.input}
                classes={{
                  wrapper: styles.noPadding,
                  input: styles.noBackground,
                }}
                type="number"
                value={String(value)}
                onChange={({value}) => {
                  value = value.replace(/[^0-9]/g, '')
                  setInputValue(index, value)
                }}
                isRequired
                showError={Boolean(hasLimitError[key])}
                errorMsg={value && hasLimitError[key] ? ' ' : ''}
              />
              {!!(value && hasLimitError[key]) && (
                <p className={styles.errorMsg}>
                  <Trans i18nKey="leaveLimitExceededErrorMsg" t={t}>
                    {{title}} quota can&apos;t be less than{' '}
                    {{limit: hasLimitError[key].limit}}, i.e. maximum number of
                    leaves already taken by your staff members
                  </Trans>
                </p>
              )}
            </div>
          ))}
        </div>
        <div className={styles.footer}>
          <Button
            className={styles.submitBtn}
            onClick={submitLeaves}
            size="big"
            disabled={
              submitting ||
              leaves.some(
                ({value}) => value === '' || value < 0 || value >= 100
              ) ||
              Object.keys(hasLimitError).length != 0
            }
          >
            {t('confirmLimit')}
          </Button>
        </div>
      </div>
    </div>
  )
}

function LeaveBalanceUpdate() {
  const {
    showLeaveBalanceUpdateForm,
    submitSuccess: success,
    submitError: errors,
  } = useSelector((state) => state.leaveManagement.yearlyLeavesOfInstitute)

  const dispatch = useDispatch()
  const {t} = useTranslation()

  const [renderSlider, open] = useSmoothSlider(showLeaveBalanceUpdateForm)

  useEffect(() => {
    return () => {
      if (showLeaveBalanceUpdateForm === false)
        dispatch(resetSessionLeaveResponse())
    }
  }, [showLeaveBalanceUpdateForm])

  return (
    <>
      {renderSlider && (
        <div className={styles.slider}>
          <Slider
            open={open}
            hasCloseIcon
            setOpen={() => {
              dispatch(hideLeaveBalanceUpdateForm())
            }}
            content={<LeavebalanceUpdateForm />}
            widthInPercent={30}
          />
        </div>
      )}
      {success && (
        <Modal
          wrapperClassName={styles.modalWrapper}
          className={styles.modal}
          show
        >
          <>
            <div
              className={`${styles.iconWrapper} ${styles.iconWrapperSuccess}`}
            >
              <Icon name="checkCircle" color="success" type="filled" />
            </div>
            <h3 className={styles.msg}>{t('leaveQuotaUpdatedSuccessfully')}</h3>
            <p className={styles.info}>{t('leaveQuotaUpdatedInfoDetail')}</p>
            <Button
              type="border"
              className={styles.btn}
              size={IS_MOBILE ? 'medium' : 'big'}
              onClick={() => {
                dispatch(resetSessionLeaveResponse())
                dispatch(getLeaveBalance())
              }}
            >
              {t('okay')}
            </Button>
          </>
        </Modal>
      )}
      {errors && !errors.error_code && errors.msg && (
        <Modal
          wrapperClassName={styles.modalWrapper}
          className={styles.modal}
          show
        >
          <>
            <div className={`${styles.iconWrapper} ${styles.iconWrapperError}`}>
              <Icon name="error" color="error" type="filled" />
            </div>
            <h3 className={styles.msg}>{errors.msg}</h3>
            <Button
              type="border"
              className={styles.btn}
              size={IS_MOBILE ? 'medium' : 'big'}
              onClick={() => {
                dispatch(resetSessionLeaveResponse())
              }}
            >
              {t('okay')}
            </Button>
          </>
        </Modal>
      )}
    </>
  )
}

export default LeaveBalanceUpdate
