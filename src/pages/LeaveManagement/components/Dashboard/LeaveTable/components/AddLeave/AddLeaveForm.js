import React from 'react'
import {
  Button,
  DateRangePicker,
  Icon,
  Input,
  SearchBar,
} from '@teachmint/common'
import classNames from 'classnames'
import {DateTime} from 'luxon'

import styles from './AddLeave.module.css'
import Loader from '../../../../../../../components/Common/Loader/Loader'
import {useTranslation} from 'react-i18next'
import {events} from '../../../../../../../utils/EventsConstants'
import {useSelector} from 'react-redux'
import LeaveShiftSelector from '../LeaveShiftSelector'

const AddLeaveForm = ({
  request,
  edit,
  formRef,
  handleTextChange,
  selectedStaffState,
  searchResults,
  leaveType,
  seterror,
  setLeaveType,
  dateRange,
  handleDateChange,
  selectedLeaveCount,
  error,
  handleAddLeave,
  loading,
  reason,
  setReason,
  handleLeaveSlotChange,
  fromSlotOptions,
  toSlotOptions,
}) => {
  const {t} = useTranslation()

  const eventManager = useSelector((state) => state.eventManager)

  const fromDate = dateRange.selectedFrom
    ? DateTime.fromFormat(dateRange.selectedFrom, 'yyyy-LL-dd').ts
    : false
  const toDate = dateRange.selectedTo
    ? DateTime.fromFormat(dateRange.selectedTo, 'yyyy-LL-dd').ts
    : false

  return (
    <div className={styles.scroller}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <Icon name="calendar" color="basic" size={'xs'} />
          <div>
            {edit
              ? t('editLeave')
              : request
              ? t('requestLeave')
              : t('addLeave')}
          </div>
        </div>
        <div
          className={classNames(styles.bodywrapper, {
            [styles.requestLeave]: request,
          })}
        >
          {!request && (
            <>
              <div className={styles.info}>{t('addLeaveOnBehalf')}</div>
              <div
                className={classNames(styles.field, {
                  [styles.pointerNone]: edit,
                })}
              >
                <div className={styles.subtext}>
                  {edit && (
                    <>
                      {t('staff')} {t('name')}
                    </>
                  )}
                  {!edit && (
                    <>
                      {t('selectStaff')}{' '}
                      <span className={styles.asterisk}>*</span>
                    </>
                  )}
                </div>
                <div className={styles.searchbarWrapper}>
                  <form ref={formRef} autoComplete="off">
                    <SearchBar
                      autocomplete="off"
                      placeholder={t('searchByStaffName')}
                      onTextChange={handleTextChange}
                      inputValue={selectedStaffState?.name}
                      searchResults={searchResults}
                      containerClassName={styles.searchbarContainer}
                      dropdownClassName={
                        searchResults
                          ? styles.searchbarDropdown
                          : styles.nopadding
                      }
                    />
                  </form>
                </div>
              </div>
            </>
          )}

          <div className={classNames(styles.field, styles.leaveType)}>
            <div className={styles.subtext}>
              {t('leaveType')} <span className={styles.asterisk}>*</span>
            </div>
            <div className={styles.selectWrapper}>
              <Input
                type="select"
                // title="Leave Type"
                fieldName="country"
                value={leaveType.selected}
                options={leaveType.options}
                disabled={!selectedStaffState}
                onChange={(obj) => {
                  seterror(null)
                  setLeaveType({...leaveType, selected: obj.value})
                  eventManager.send_event(events.SELECT_LEAVE_TYPE_TFI, {
                    employee_name: selectedStaffState.name,
                    employee_user_id: selectedStaffState.id,
                    employee_type:
                      typeof selectedStaffState.rollName === 'object'
                        ? selectedStaffState.rollName?.props?.children
                        : selectedStaffState.rollName,
                    leave_type: obj.value,
                  })
                }}
                className={styles.inputGray}
              />
            </div>
          </div>

          <div className={classNames(styles.field, styles.dateWrapper)}>
            <div className={classNames(styles.flex, styles.dateTextWrap)}>
              <div className={classNames(styles.subtext, styles.flexGrowEqual)}>
                {t('from')} <span className={styles.asterisk}>*</span>
              </div>
              <div className={classNames(styles.subtext, styles.flexGrowEqual)}>
                {t('to')} <span className={styles.asterisk}>*</span>
              </div>
            </div>

            <DateRangePicker
              startDateMin={
                dateRange.from
                  ? DateTime.fromFormat(dateRange.from, 'yyyy-LL-dd').toJSDate()
                  : ''
              }
              endDateMin={
                dateRange.from
                  ? DateTime.fromFormat(dateRange.from, 'yyyy-LL-dd').toJSDate()
                  : ''
              }
              startDateMax={
                dateRange.to
                  ? DateTime.fromFormat(dateRange.to, 'yyyy-LL-dd').toJSDate()
                  : ''
              }
              endDateMax={
                dateRange.to
                  ? DateTime.fromFormat(dateRange.to, 'yyyy-LL-dd').toJSDate()
                  : ''
              }
              startDate={
                dateRange.selectedFrom
                  ? DateTime.fromFormat(
                      dateRange.selectedFrom,
                      'yyyy-LL-dd'
                    ).toJSDate()
                  : ''
              }
              endDate={
                dateRange.selectedTo
                  ? DateTime.fromFormat(
                      dateRange.selectedTo,
                      'yyyy-LL-dd'
                    ).toJSDate()
                  : ''
              }
              onChange={handleDateChange}
              className={classNames(styles.dateFieldWrap, styles.flex)}
              inputProps={{
                suffix: (
                  <Icon
                    name="calendar"
                    type="outlined"
                    color="secondary"
                    size="xxs"
                  />
                ),
                readOnly: true,
                className: styles.inputGray,
              }}
            />
          </div>

          {fromDate && toDate && fromDate <= toDate && (
            <div
              className={classNames(
                styles.flex,
                styles.field,
                styles.leaveSlotWrapper
              )}
            >
              {fromDate !== toDate && (
                <span
                  className={classNames(styles.subtext, styles.categoryName)}
                >
                  {DateTime.fromFormat(
                    dateRange.selectedFrom,
                    'yyyy-LL-dd'
                  ).toFormat('dd LLL yyyy')}
                </span>
              )}
              <LeaveShiftSelector
                name="fromSlot"
                selected={dateRange.fromSlot}
                options={fromSlotOptions}
                onChange={(e) => {
                  handleLeaveSlotChange('fromSlot', e.target?.value)
                }}
                className={styles.slotBtn}
              />
            </div>
          )}

          {toDate && fromDate && fromDate < toDate && (
            <div
              className={classNames(
                styles.flex,
                styles.field,
                styles.leaveSlotWrapper
              )}
            >
              <span className={classNames(styles.subtext, styles.categoryName)}>
                {DateTime.fromFormat(
                  dateRange.selectedTo,
                  'yyyy-LL-dd'
                ).toFormat('dd LLL yyyy')}
              </span>
              <LeaveShiftSelector
                name="toSlot"
                selected={dateRange.toSlot}
                options={toSlotOptions}
                onChange={(e) => {
                  handleLeaveSlotChange('toSlot', e.target.value)
                }}
                className={styles.slotBtn}
              />
            </div>
          )}

          {dateRange.fromSlot &&
          dateRange.toSlot &&
          typeof selectedLeaveCount === 'number' ? (
            <div className={classNames(styles.field, styles.leaveCount)}>
              <div className={styles.subtext}>
                {`${t('numberofleavesDays')} `}
                <Input
                  type="text"
                  value={String(selectedLeaveCount)}
                  isRequired={true}
                  errorClassName={''}
                  onChange={() => {}}
                  readOnly
                  className={styles.inputGray}
                />
              </div>
            </div>
          ) : null}

          <div className={classNames(styles.field, styles.reason)}>
            <div className={styles.subtext}>
              Reason {request && <span className={styles.asterisk}>*</span>}
            </div>
            <div className={styles.selectWrapper}>
              <Input
                type="textarea"
                fieldName="reason"
                placeholder="Type here"
                value={reason}
                onChange={(obj) => {
                  seterror(null)
                  setReason(obj.value)
                }}
                onBlur={() => {
                  eventManager.send_event(events.REASON_FOR_LEAVE_FILLED_TFI, {
                    reason,
                  })
                }}
                rows={3}
                maxLength={200}
                className={styles.inputGray}
              />
            </div>
          </div>

          {error ? <div className={styles.errormsg}>{error}</div> : null}
        </div>
        <div className={styles.footer}>
          <Button
            className={styles.submitBtn}
            onClick={handleAddLeave}
            size="big"
            disabled={loading || selectedLeaveCount < 0}
          >
            {edit ? t('update') : request ? t('request') : t('add')}
          </Button>
        </div>
        <Loader show={loading} />
      </div>
    </div>
  )
}

export default AddLeaveForm
