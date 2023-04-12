import React, {useEffect, useState} from 'react'
import {Tooltip} from '@teachmint/krayon'
import {Link} from 'react-router-dom'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import {
  checkSubscriptionType,
  getAmountFixDecimalWithCurrency,
  numDifferentiation,
} from '../../../utils/Helpers'
import {DASHBOARD} from '../../../utils/SidebarItems'
import {events} from '../../../utils/EventsConstants'
import {showFeatureLockAction} from '../../../redux/actions/commonAction'
import {getFeeStatistics} from '../../../redux/actions/instituteInfoActions'
import {Input} from '@teachmint/common'
import styles from './FeeStatistics.module.css'

export default function FeeStatistics() {
  const [selectedFeeFilterOption, setSelectedFilterOption] =
    useState('total_annual_fee')
  const {eventManager, feeStatistics, instituteInfo} = useSelector(
    (state) => state
  )
  const dispatch = useDispatch()
  const {t} = useTranslation()

  const isPremium = checkSubscriptionType(instituteInfo)

  useEffect(() => {
    if (checkSubscriptionType(instituteInfo)) {
      dispatch(getFeeStatistics())
    }
  }, [])

  const feeStatisticsValue = {
    payable_amount:
      selectedFeeFilterOption == 'applicable_till_date'
        ? feeStatistics.payable_amount
        : feeStatistics.total_payable,
    discount_amount:
      selectedFeeFilterOption == 'applicable_till_date'
        ? feeStatistics.discount_amount
        : feeStatistics.total_discount,
    paid_amount:
      selectedFeeFilterOption == 'applicable_till_date'
        ? feeStatistics.paid_amount
        : feeStatistics.total_paid,
    due_amount:
      selectedFeeFilterOption == 'applicable_till_date'
        ? feeStatistics.due_amount
        : feeStatistics.total_due,
  }

  const attendanceItems = [
    {
      num: 1,
      title: t('totalApplicable'),
      value: feeStatisticsValue.payable_amount
        ? numDifferentiation(
            feeStatisticsValue.payable_amount,
            instituteInfo.currency
          )
        : numDifferentiation(0, instituteInfo.currency),
      amount: feeStatisticsValue.payable_amount
        ? getAmountFixDecimalWithCurrency(
            feeStatisticsValue.payable_amount,
            instituteInfo.currency
          )
        : numDifferentiation(0, instituteInfo.currency),
    },
    {
      num: 2,
      title: t('discountApplied'),
      value: feeStatisticsValue.discount_amount
        ? numDifferentiation(
            feeStatisticsValue.discount_amount,
            instituteInfo.currency
          )
        : numDifferentiation(0, instituteInfo.currency),
      amount: feeStatisticsValue.discount_amount
        ? getAmountFixDecimalWithCurrency(
            feeStatisticsValue.discount_amount,
            instituteInfo.currency
          )
        : numDifferentiation(0, instituteInfo.currency),
    },
    {
      num: 3,
      title: t('paidFee'),
      value: feeStatisticsValue.paid_amount
        ? numDifferentiation(
            feeStatisticsValue.paid_amount,
            instituteInfo.currency
          )
        : numDifferentiation(0, instituteInfo.currency),
      amount: feeStatisticsValue.paid_amount
        ? getAmountFixDecimalWithCurrency(
            feeStatisticsValue.paid_amount,
            instituteInfo.currency
          )
        : numDifferentiation(0, instituteInfo.currency),
    },
    {
      num: 4,
      title:
        selectedFeeFilterOption == 'applicable_till_date'
          ? t('overdueFee')
          : t('dueFee'),
      value: feeStatisticsValue.due_amount
        ? numDifferentiation(
            feeStatisticsValue.due_amount,
            instituteInfo.currency
          )
        : numDifferentiation(0, instituteInfo.currency),
      amount: feeStatisticsValue.due_amount
        ? getAmountFixDecimalWithCurrency(
            feeStatisticsValue.due_amount,
            instituteInfo.currency
          )
        : numDifferentiation(0, instituteInfo.currency),
    },
  ]

  const feeFilterOptions = [
    {
      value: 'applicable_till_date',
      label: t('applicableTillDate'),
    },
    {
      value: 'total_annual_fee',
      label: t('totalAnnualFee'),
    },
  ]

  const handleOnClickViewDetails = () => {
    if (isPremium) trackEvent(events.VIEW_FEES_DETAILS_TFI, null, 'UNLOCKED')
    else {
      trackEvent(events.VIEW_FEES_DETAILS_TFI, null, 'LOCKED')
      dispatch(showFeatureLockAction(true))
    }
  }

  const trackEvent = (type, status) => {
    let payload = {
      status,
      screen_name: 'DASHBOARD_STATISTICS',
    }
    if (type) {
      payload = {...payload, type}
    }
    eventManager.send_event(events.VIEW_FEES_STATISTICS_CLICKED_TFI, payload)
  }

  return (
    <div className="w-full justify-between px-4 py-1 lg:px-0 lg:pt-5">
      <div className="w-full flex flex-row justify-between items-end">
        <div className="flex items-center">
          <div className="tm-h7 flex justify-start">{t('fee')} </div>
        </div>
        <div className="relative">
          <div className="tm-h6 tm-color-blue">
            <div className="flex items-center">
              {!isPremium && (
                <img
                  className="h-4 lg:mr-2 mb-0.5 w-3.5"
                  alt="card-icon"
                  src="https://storage.googleapis.com/tm-assets/icons/secondary/lock-secondary.svg"
                />
              )}
              {/* <div>{t('viewDetails')}</div> */}
              <Input
                type="select"
                fieldName="feeFilterType"
                value={selectedFeeFilterOption}
                options={feeFilterOptions}
                onChange={(e) => setSelectedFilterOption(e.value)}
                classes={{wrapper: styles.inputWrapper}}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white my-4 tm-border-radius1 tm-box-shadow1">
        <div
          className={`flex flex-row flex-wrap justify-between ${
            !isPremium ? 'cursor-pointer relative' : ''
          }`}
          onClick={() => {
            if (isPremium) trackEvent(null, 'UNLOCKED')
            else {
              trackEvent(null, 'LOCKED')
              dispatch(showFeatureLockAction(true))
            }
          }}
        >
          {attendanceItems.map(({title, value, amount}) => (
            <>
              <Link
                to={
                  isPremium ? '/institute/dashboard/fees/collection' : DASHBOARD
                }
                onClick={handleOnClickViewDetails}
                className="tm-dashboard-statistics-card w-6/12 px-3 my-3 lg:w-1/4"
                key={title}
              >
                <div data-tip data-for={title}>
                  <div className="w-full flex flex-row">
                    <div className="tm-h4">{value}</div>
                    <div className=""></div>
                  </div>
                  <div className="tm-para3">{title}</div>
                </div>
              </Link>
              <Tooltip
                toolTipId={title}
                toolTipBody={amount}
                place="bottom"
                effect="solid"
              />
            </>
          ))}
        </div>
      </div>
    </div>
  )
}
