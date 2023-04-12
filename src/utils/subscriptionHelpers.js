import {isAndroidWebview, isIOSWebview} from '@teachmint/common'
import {BUTTON_CONSTANTS} from '@teachmint/krayon'
import moment from 'moment'
import {Trans} from 'react-i18next'
import {localStorageKeys} from '../pages/BillingPage/constants'
import {formatCurrencyToCountry, getSymbolFromCurrency} from './Helpers'

const isWebview = () => !!(isAndroidWebview() || isIOSWebview())

export const tooManyStudentsErrorContent = (
  subscriptionData,
  instituteStudentListLength
) => {
  if (isWebview()) return ''

  if (!subscriptionData.obj || subscriptionData.obj.subscription_type !== 2) {
    if (instituteStudentListLength === 10)
      return 'Your current <a href="https://www.teachmint.com/plans" class="underline tm-color-blue" target="_blank">Basic plan</a> allows adding only upto 10 students. To access Premium features and add more students, Please Contact us on <a class="underline tm-color-blue" href="tel:08035242348">+91-8035242348</a>'
    return 'You cannot add any more students as per your current <a href="https://www.teachmint.com/plans" class="underline tm-color-blue" target="_blank">Basic plan</a>. To access Premium features and add more students, Please Contact us on <a class="underline tm-color-blue" href="tel:08035242348">+91-8035242348</a>'
  }
  var message = `As per your subscription, you can add only ${subscriptionData.obj.lms_order_form_students} students. To purchase more student licenses, `
  if (
    (subscriptionData.obj.kam_name === null ||
      subscriptionData.obj.kam_name === '') &&
    (subscriptionData.obj.kam_phone_no === null ||
      subscriptionData.obj.kam_phone_no === null) &&
    (subscriptionData.obj.kam_email_id === null ||
      subscriptionData.obj.kam_email_id === '')
  )
    return message
  const kam =
    subscriptionData.obj.kam_name !== null &&
    subscriptionData.obj.kam_name !== ''
      ? subscriptionData.obj.kam_name
      : ''
  message += `Contact your account manager ${kam}`

  if (subscriptionData.obj.kam_email_id || subscriptionData.obj.kam_phone_no) {
    message += ' via '
    if (
      subscriptionData.obj.kam_email_id !== null &&
      subscriptionData.obj.kam_email_id !== '' &&
      subscriptionData.obj.kam_phone_no !== null &&
      subscriptionData.obj.kam_phone_no !== null
    ) {
      message += `<a class="underline tm-color-blue" href=tel:${subscriptionData.obj.kam_phone_no}>${subscriptionData.obj.kam_phone_no}</a> or `
      message += `<a class="underline tm-color-blue" href=mailto:${subscriptionData.obj.kam_email_id}>${subscriptionData.obj.kam_email_id}</a>`
    } else {
      if (
        subscriptionData.obj.kam_phone_no !== null &&
        subscriptionData.obj.kam_phone_no !== ''
      )
        message += `<a class="underline tm-color-blue" href=tel:${subscriptionData.obj.kam_phone_no}>${subscriptionData.obj.kam_phone_no}</a>`
      else
        message += `<a class="underline tm-color-blue" href=mailto:${subscriptionData.obj.kam_email_id}>${subscriptionData.obj.kam_email_id}</a>`
    }
  }
  return message
}

export const getBannerContent = (subscriptionData, canPay) => {
  if (
    !subscriptionData?.enable_communication ||
    !subscriptionData?.next_collection_date
  )
    return {showBanner: false}
  const billingEffectiveDate = moment.unix(subscriptionData?.billing_start_date)
  const _45daysBeforeBED = moment(billingEffectiveDate).subtract(45, 'days')
  const weekAfterBED = moment
    .unix(subscriptionData?.billing_start_date)
    .add(7, 'days')
  const nextPaymentDate = moment
    .unix(subscriptionData?.next_collection_date)
    .endOf('day')
  const monthBeforeDue = moment
    .unix(subscriptionData?.next_collection_date)
    .subtract(30, 'days')
  const fortnightBeforeDue = moment
    .unix(subscriptionData?.next_collection_date)
    .subtract(14, 'days')
  const weekAfterDue = moment
    .unix(subscriptionData?.next_collection_date)
    .add(7, 'days')
  const monthAfterDue = moment
    .unix(subscriptionData?.next_collection_date)
    .add(30, 'days')
  const bannerLastShown = localStorage.getItem(
    localStorageKeys.BANNER_LAST_SHOWN
  )
    ? moment.unix(localStorage.getItem(localStorageKeys.BANNER_LAST_SHOWN))
    : moment.unix(0)

  if (_45daysBeforeBED.isAfter(moment(), 'days'))
    // until BED-45
    return {
      showBanner: true,
      content:
        //prettier-ignore
        <Trans i18nKey={'welcomeBannerContent1'}>
          Welcome to your <b><u>{{product_package: cleanUpProductPackage(subscriptionData?.product_package)}} subscription!</u></b> Premium features for <b>{{number_of_students: subscriptionData?.no_of_students}} students</b> will be unlocked on <b>{{billing_effective_date: moment.unix(subscriptionData?.billing_start_date).format('Do MMMM YYYY')}}</b>
        </Trans>,
      iconType: 'info',
      icon: 'timeline',
      wrapper: 'infoBanner',
      button: {
        type: BUTTON_CONSTANTS.TYPE.FILLED,
        onClick: 'VIEW',
        label: 'viewDetails',
      },
      dismissable: false,
    }
  else if (billingEffectiveDate.isAfter(moment(), 'days'))
    //BED-45 to BED
    return {
      showBanner: true,
      content:
        // prettier-ignore
        <Trans i18nKey={'welcomeBannerContent2'}>
          Welcome to your <b><u>{{product_package: cleanUpProductPackage(subscriptionData?.product_package)}} subscription!</u></b> Premium features for <b>{{number_of_students: subscriptionData?.no_of_students}} students</b> are now unlocked for your institute
        </Trans>,
      iconType: 'info',
      icon: 'lock',
      wrapper: 'infoBanner',
      button: {
        type: BUTTON_CONSTANTS.TYPE.FILLED,
        onClick: 'VIEW',
        label: 'viewDetails',
      },
      dismissable: false,
    }
  else if (moment().isBetween(billingEffectiveDate, weekAfterBED, 'days', '[]'))
    // BED to BED+7
    return {
      showBanner: !bannerLastShown.isBetween(
        billingEffectiveDate,
        weekAfterBED,
        'days',
        '[]'
      ),
      content:
        // prettier-ignore
        <Trans i18nKey={'subscriptionActivationBannerContent'}>
          Subscription of <b><u>{{product_package: cleanUpProductPackage(subscriptionData?.product_package)}}</u></b> for <b>{{number_of_students: subscriptionData?.no_of_students}} students</b> for your institute is now active!
        </Trans>,
      iconType: 'success',
      icon: 'checkCircle',
      wrapper: 'successBanner',
      button: {
        type: BUTTON_CONSTANTS.TYPE.FILLED,
        onClick: 'VIEW',
        label: 'viewDetails',
      },
      dismissable: true,
      dismissLabel: 'acknowledge',
    }
  else if (moment().isBetween(monthBeforeDue, fortnightBeforeDue, '[)'))
    // DD-30 to DD-14
    return {
      showBanner:
        !bannerLastShown.isBetween(
          monthBeforeDue,
          fortnightBeforeDue,
          'days',
          '[]'
        ) && !(moment().diff(bannerLastShown, 'days') < 7),

      content: // prettier-ignore
        (
          <>
            <Trans i18nKey={'expiryWarningBannerContent'}>
              Dear Customer, your subscription will expire on <b><u>{{due_date: nextPaymentDate.format('Do MMMM YYYY')}}</u></b>
            </Trans>
            {!canPay && <Trans i18nKey={'contactOwnerToPay'} />}
          </>
        ),
      iconType: 'warning',
      icon: 'clock',
      iconVersion: 'outlined',
      wrapper: 'warningBanner',
      button: {
        type: BUTTON_CONSTANTS.TYPE.FILLED,
        onClick: 'PAY',
        label: 'payNow',
      },
      dismissable: true,
      dismissLabel: 'remindLater',
    }
  else if (
    moment().isBetween(fortnightBeforeDue, nextPaymentDate, 'days', '[)')
  )
    //DD-14 to DD
    return {
      showBanner: true,
      content:
        //prettier-ignore
        <Trans i18nKey={'expiryWarningBannerContent2'}>
          Dear Customer, your subscription will expire in <b><u>{{days_to_deactivation: `${nextPaymentDate.diff(moment(), 'days')} ${nextPaymentDate.diff(moment(), 'days') === 1 ? 'day' : 'days'}`}}</u></b>. Please pay at the earliest to avoid service disruption
        </Trans>,
      iconType: 'error',
      icon: 'error',
      wrapper: 'errorBanner',
      button: {
        type: BUTTON_CONSTANTS.TYPE.FILLED,
        onClick: 'PAY',
        label: 'payNow',
      },
      dismissable: false,
    }
  else if (moment().isSame(nextPaymentDate, 'days')) {
    // DD
    let diff_hours = nextPaymentDate.diff(moment(), 'hours')
    let diff_minutes =
      nextPaymentDate.diff(moment(), 'minutes') - diff_hours * 60
    diff_minutes = ('0' + diff_minutes).slice(-2)
    return {
      showBanner: true,
      content:
        //prettier-ignore
        <Trans i18nKey={'expiryErrorBannerContent2'}>
          Dear Customer, your subscription ends in <b><u>{{time_to_deactivation: `${diff_hours}hr : ${diff_minutes}min`}}</u></b>. Pay now to avoid account locking
        </Trans>,
      iconType: 'inverted',
      icon: 'error',
      iconVersion: 'outlined',
      wrapper: 'errorBanner2',
      button: {
        type: BUTTON_CONSTANTS.TYPE.OUTLINE,
        onClick: 'PAY',
        label: 'payNow',
        classes: 'errorButton2',
      },
      dismissable: false,
    }
  } else if (moment().isBetween(nextPaymentDate, weekAfterDue, 'days', '()'))
    //DD to DD+7
    return {
      showBanner: true,
      content:
        // prettier-ignore
        <Trans i18nKey={'expiryErrorBannerContent3'}>
          Dear customer, payment for your subscription is overdue. Your account will be locked on <b><u>{{read_only_date: moment(weekAfterDue).format('Do MMMM YYYY')}}</u></b>.
        </Trans>,
      iconType: 'inverted',
      icon: 'error',
      iconVersion: 'outlined',
      wrapper: 'errorBanner3',
      button: {
        type: BUTTON_CONSTANTS.TYPE.OUTLINE,
        onClick: 'PAY',
        label: 'payNow',
        classes: 'errorButton3',
      },
      dismissable: false,
    }
  else if (moment().isBetween(weekAfterDue, monthAfterDue, 'days', '[]'))
    //DD+7 to DD+30
    return {
      showBanner: true,
      content:
        // prettier-ignore
        <Trans i18nKey={'expiryErrorBannerContent4'}>
          Payment overdue since <b><u>{{due_date: nextPaymentDate.format('Do MMMM YYYY')}}</u></b>. Your account is now locked and will be fully suspended on <b><u>{{deactivation_date: monthAfterDue.format('Do MMMM YYYY')}}</u></b>
        </Trans>,
      iconType: 'inverted',
      icon: 'error',
      iconVersion: 'outlined',
      wrapper: 'errorBanner3',
      button: {
        type: BUTTON_CONSTANTS.TYPE.OUTLINE,
        onClick: 'PAY',
        label: 'payNow',
        classes: 'errorButton3',
      },
      dismissable: false,
    }
  else
    return {
      showBanner: false,
    }
}

export const getPopupContent = (subscriptionData) => {
  if (
    !subscriptionData?.enable_communication ||
    !subscriptionData?.next_collection_date
  )
    return {showPopup: false}
  const weekAfterBED = moment
    .unix(subscriptionData?.billing_start_date)
    .add(7, 'days')
  if (moment().isBefore(weekAfterBED, 'days'))
    return {
      showPopup: false,
    }

  const nextPaymentDate = moment
    .unix(subscriptionData?.next_collection_date)
    .endOf('day')
  const weekBeforeDue = moment
    .unix(subscriptionData?.next_collection_date)
    .subtract(7, 'days')
  const weekAfterDue = moment
    .unix(subscriptionData?.next_collection_date)
    .add(7, 'days')
  const monthAfterDue = moment
    .unix(subscriptionData?.next_collection_date)
    .add(30, 'days')
  const popupLastShown = localStorage.getItem(localStorageKeys.POPUP_LAST_SHOWN)
    ? moment.unix(localStorage.getItem(localStorageKeys.POPUP_LAST_SHOWN))
    : moment.unix(0)

  if (moment().isBetween(weekBeforeDue, nextPaymentDate, 'days', '[)'))
    return {
      showPopup: !popupLastShown.isSame(moment(), 'days'),
      header:
        // prettier-ignore
        <Trans i18nKey={'expiryPopupHeader1'}>
          URGENT: Subscription expiring on <span>{{due_date: moment.unix(subscriptionData?.next_collection_date).format('Do MMMM YYYY')}}</span>!
        </Trans>,
      icon: 'warningTriangle',
      content:
        // prettier-ignore
        <Trans i18nKey={'expiryPopupContent1'}>
          Payment of <b>{{pending_amount: `${getSymbolFromCurrency('INR')} ${formatCurrencyToCountry(parseFloat(subscriptionData?.pending_amount))}`}}</b> for your subscription is due on <span><b>{{due_date: moment.unix(subscriptionData?.next_collection_date).format('Do MMMM YYYY')}}</b>. </span><span>Please pay at the earliest to avoid service disruption.</span> Thank you for being a valued customer.
        </Trans>,
    }
  else if (moment().isSame(nextPaymentDate, 'days')) {
    let diff_hours = nextPaymentDate.diff(moment(), 'hours')
    let diff_minutes =
      nextPaymentDate.diff(moment(), 'minutes') - diff_hours * 60
    diff_minutes = ('0' + diff_minutes).slice(-2)
    return {
      showPopup: !(moment().diff(popupLastShown, 'hours') < 3),
      header:
        // prettier-ignore
        <Trans i18nKey={'expiryPopupHeader2'}>
          URGENT: Subscription is expiring in <span>{{time_to_deactivation: `${diff_hours}hr : ${diff_minutes}min`}}</span>
        </Trans>,
      icon: 'warningTriangle',
      content:
        // prettier-ignore
        <Trans i18nKey={'expiryPopupContent2'}>
          Payment of <b>{{pending_amount: `${getSymbolFromCurrency('INR')} ${formatCurrencyToCountry(parseFloat(subscriptionData?.pending_amount))}`}}</b> for your subscription is due on <span><b>{{due_date: moment.unix(subscriptionData?.next_collection_date).format('Do MMMM YYYY')}}</b>. </span><span>Please pay today to avoid service disruption.</span> Thank you for being a valued customer.
        </Trans>,
    }
  } else if (moment().isBetween(nextPaymentDate, weekAfterDue, 'days', '()'))
    //DD to DD+7
    return {
      showPopup: !popupLastShown.isSame(moment(), 'days'),
      header:
        // prettier-ignore
        <Trans i18nKey={'expiryPopupHeader3'}>
          CRITICAL: Account will be locked on <span>{{read_only_date: weekAfterDue.format('Do MMMM YYYY')}}</span>!
        </Trans>,
      icon: 'warningTriangle',

      content:
        // prettier-ignore
        <Trans i18nKey={'expiryPopupContent3'}>
          Payment of <b>{{pending_amount: `${getSymbolFromCurrency('INR')} ${formatCurrencyToCountry(parseFloat(subscriptionData?.pending_amount))}`}}</b> for your subscription is now overdue. <span>Your account will be locked on <b><u>{{read_only_date: weekAfterDue.format('Do MMM YYYY')}}</u></b> and you will not be able to perform any action or make any changes on the platform.</span> Please clear dues at the earliest. Thank you for being a valued customer.
        </Trans>,
    }
  else if (moment().isBetween(weekAfterDue, monthAfterDue, 'days', '[]'))
    //DD+7 to DD+30
    return {
      showPopup: !popupLastShown.isSame(moment(), 'days'),
      header:
        // prettier-ignore
        <Trans i18nKey={'expiryPopupHeader4'}>
          Account will be suspended on <span>{{deactivation_date: monthAfterDue.format('Do MMMM YYYY')}}</span>
        </Trans>,
      icon: 'warningTriangle',

      content:
        // prettier-ignore
        <Trans i18nKey={'expiryPopupContent4'}>
          Payment of <b>{{pending_amount: `${getSymbolFromCurrency('INR')} ${formatCurrencyToCountry(parseFloat(subscriptionData?.pending_amount))}`}}</b> for your subscription is overdue since <b><u>{{pending_date: nextPaymentDate.format('Do MMM YYYY')}}</u></b>. <span>Your account is now locked and will be fully suspended on <b><u>{{deactivation_date: monthAfterDue.format('Do MMM YYYY')}}</u></b>.</span> <span>After that you will not be able to access this platform at all.</span> Please clear dues at the earliest. Thank you for being a valued customer.
        </Trans>,
    }
  else if (moment().isAfter(monthAfterDue, 'days'))
    return {
      showPopup: true,
      dismissable: false,
      blocking: true,
      content:
        // prettier-ignore
        <Trans i18nKey={'blockingPopupContent'}>
          <span>This means that:</span><span>1. You can no longer make any changes to your institute</span><span>2. You cannot add students to your institute</span><span>3. You cannot communicate with teachers, students and parents</span><span>4. You cannot bulk export data from the platform</span>`,
        </Trans>,
      content2:
        // prettier-ignore
        <Trans i18nKey={'blockedNotice'}>
          Payment of {{pending_amount: `${getSymbolFromCurrency('INR')} ${formatCurrencyToCountry(parseFloat(subscriptionData?.pending_amount))}`}} is overdue for your subscription since {{due_date: nextPaymentDate.format('Do MMM YYYY')}}. Your institute is now suspended
        </Trans>,
    }
  else
    return {
      showPopup: false,
    }
}

// export const getSubscriptionBannerContent = (subscriptionData) => {
//   const nextPaymentDate = moment
//     .unix(subscriptionData?.next_collection_date)
//     .endOf('day')
//   const weekAfterDue = moment
//     .unix(subscriptionData?.next_collection_date)
//     .add(7, 'days')
//   const monthAfterDue = moment
//     .unix(subscriptionData?.next_collection_date)
//     .add(30, 'days')
//   const _3daysBeforeDue = moment
//     .unix(subscriptionData?.next_collection_date)
//     .subtract(3, 'days')
//   if (moment().isBefore(_3daysBeforeDue))
//     return {
//       showBanner: true,
//       icon: 'discount',
//       wrapper: 'successWrapper',
//       header: <Trans i18nKey={'billingPageBannerHeader1'} />,
//       content: <Trans i18nKey={'billingPageBannerSubHeading'} />,
//       button1: {
//         content: 'payNextInstallment',
//         type: BUTTON_CONSTANTS.TYPE.OUTLINE,
//         category: BUTTON_CONSTANTS.CATEGORY.PRIMARY,
//       },
//       button2: {
//         content: 'availDiscount',
//         type: BUTTON_CONSTANTS.TYPE.FILLED,
//         category: BUTTON_CONSTANTS.CATEGORY.CONSTRUCTIVE,
//       },
//     }
//   else if (moment().isBetween(_3daysBeforeDue, nextPaymentDate, 'days', '[)'))
//     return {
//       showBanner: true,
//       icon: 'due',
//       wrapper: 'warningWrapper',
//       header: <Trans i18nKey={'billingPageBannerHeader1'} />,
//       content: <Trans i18nKey={'billingPageBannerSubHeading'} />,
//       button1: {
//         content: 'payNextInstallment',
//         type: BUTTON_CONSTANTS.TYPE.OUTLINE,
//         category: BUTTON_CONSTANTS.CATEGORY.PRIMARY,
//       },
//       button2: {
//         content: 'payNow',
//         type: BUTTON_CONSTANTS.TYPE.FILLED,
//         category: BUTTON_CONSTANTS.CATEGORY.WARNING,
//       },
//     }
//   else if (moment().isSame(nextPaymentDate, 'days'))
//     return {
//       showBanner: true,
//       icon: 'exclamation',
//       wrapper: 'errorWrapper',
//       header: (
//         <Trans i18nKey={'billingPageBannerHeader2'}>
//           <b>Warning</b>: Your payment is due <b>today</b>. Account will be <b>blocked</b> on <b>{{blocked_date: subscriptionData.next_collection_date}}</b>
//         </Trans>
//       ),
//       content: <Trans i18nKey={'billingPageBannerSubHeading'} />,
//       button1: {
//         content: 'payNextInstallment',
//         type: BUTTON_CONSTANTS.TYPE.OUTLINE,
//         category: BUTTON_CONSTANTS.CATEGORY.PRIMARY,
//       },
//       button2: {
//         content: 'payNow',
//         type: BUTTON_CONSTANTS.TYPE.FILLED,
//         category: BUTTON_CONSTANTS.CATEGORY.DESTRUCTIVE,
//       },
//     }
//   else if (moment().isBetween(nextPaymentDate, weekAfterDue, 'days', '()'))
//     return {
//       showBanner: true,
//       icon: 'exclamation',
//       wrapper: 'errorWrapper',
//       header: (
//         <Trans i18nKey={'billingPageBannerHeader3'}>
//           <b>Warning</b>: Payment Overdue. You will not be able to make any changes to your account from <b>{{read_only_date: weekAfterDue.format('Do MMMM YYYY')}}</b>
//         </Trans>
//       ),
//       content: <Trans i18nKey={'billingPageBannerSubHeading'} />,
//       button1: {
//         content: 'payNextInstallment',
//         type: BUTTON_CONSTANTS.TYPE.OUTLINE,
//         category: BUTTON_CONSTANTS.CATEGORY.PRIMARY,
//       },
//       button2: {
//         content: 'payNow',
//         type: BUTTON_CONSTANTS.TYPE.FILLED,
//         category: BUTTON_CONSTANTS.CATEGORY.DESTRUCTIVE,
//       },
//     }
//   else if (moment().isBetween(weekAfterDue, monthAfterDue, 'days', '[]'))
//     return {
//       showBanner: true,
//       icon: 'exclamation',
//       wrapper: 'errorWrapper',
//       header: (
//         <Trans i18nKey={'billingPageBannerHeader4'}>
//           <b>Warning</b>: Payment Overdue. Your account will be deactivated on <b>{{deactivation_date: monthAfterDue.format('Do MMMM YYYY')}}</b>
//         </Trans>
//       ),
//       content: <Trans i18nKey={'billingPageBannerSubHeading'} />,
//       button1: {
//         content: 'payNextInstallment',
//         type: BUTTON_CONSTANTS.TYPE.OUTLINE,
//         category: BUTTON_CONSTANTS.CATEGORY.PRIMARY,
//       },
//       button2: {
//         content: 'payNow',
//         type: BUTTON_CONSTANTS.TYPE.FILLED,
//         category: BUTTON_CONSTANTS.CATEGORY.DESTRUCTIVE,
//       },
//     }
//   else
//     return {
//       showBanner: false,
//       content: 'Error',
//       iconType: 'error',
//     }
// }

export const allowedToPayRoles = {
  OWNER: 'owner',
  ACCOUNTANT: 'accountant',
}

export const removeCountryCodeFromPhone = (phone) => {
  return phone.split('-')[1]
}

const acceptableProductPackages = [
  'teachmint',
  'teachmint with online content',
  'teachmint with offline content',
  'teachmint with online and offline content',
  'teachmint with content',
]

export const cleanUpProductPackage = (value) => {
  if (acceptableProductPackages.includes(value.toLowerCase())) return value
  return 'Teachmint'
}
