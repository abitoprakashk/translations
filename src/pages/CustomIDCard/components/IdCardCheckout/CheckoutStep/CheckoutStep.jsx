import React, {useContext, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {
  showErrorOccuredAction,
  showErrorToast,
  showLoadingAction,
  showSuccessToast,
} from '../../../../../redux/actions/commonAction'
import globalActions from '../../../../../redux/actions/global.actions'
import {getIdCardPayementId, idCardVerifyPayment} from '../../../CustomId.apis'
import Loader from '../../../../../components/Common/Loader/Loader'
import {
  getSelectedTemplateForUser,
  idCardOrderCheckoutSelector,
} from '../../../redux/CustomId.selector'
import CheckoutOrderConfirmCard from '../CheckoutOrderConfirmCard/CheckoutOrderConfirmCard'
import CheckoutVerifyOrder from '../CheckoutVerifyOrder/CheckoutVerifyOrder'
import {IdCardCheckoutContext} from '../IdCardCheckoutStates/IdCardCheckout.context'
import styles from './CheckoutStep.module.css'
import {REACT_APP_RAZORPAY_KEY} from '../../../../../constants'
import {t} from 'i18next'
import {IDCheckoutActions} from '../IdCardCheckoutStates/IdCardCheckout.reducer'
import {events} from '../../../../../utils/EventsConstants'
import {generateHTMLSkeletonIDCard} from '../../../CustomId.utils'
import {pageSizes} from '../../../../../components/TemplateGenerator/TemplateGenerator.utils'

export default function CheckoutStep({closeModal}) {
  const {idCardCheckoutData, internalDispatch} = useContext(
    IdCardCheckoutContext
  )

  const eventManager = useSelector((state) => state.eventManager)
  const {data: staffTemplate} = getSelectedTemplateForUser('staff')
  const {data: studentTemplate} = getSelectedTemplateForUser('student')

  const dispatch = useDispatch()
  const {data, isLoading} = idCardOrderCheckoutSelector()

  const getVendorLayout = (temp) => {
    const {front_template, back_template} = temp

    let backHTML,
      frontHTML,
      orientation = ''

    if (front_template && front_template?.html) {
      frontHTML = front_template?.html
      orientation = front_template?.page_settings?.orientation
    }

    if (back_template && back_template?.html) {
      backHTML = back_template?.html
    }

    let margin = {}
    if (orientation === 'LANDSCAPE')
      margin = {top: 35, right: 0, left: 59, bottom: 0}
    else margin = {top: 59, right: 0, left: 35, bottom: 0}

    const horizontal = orientation === 'LANDSCAPE' ? 59 : 12,
      vertical = orientation === 'LANDSCAPE' ? 12 : 59,
      pageHeight = 1754,
      pageWidth = 2480.5,
      idCardWidth = pageSizes.IDCARD[orientation].width,
      idCardHeight = pageSizes.IDCARD[orientation].height

    const loop = `{% assign start=0 %}
    {% assign end=20 %}
      {% for i in (start..users.length) %}
         {% for j in (start.. end) %}
         {%- if j == users.length -%}
          {% break %}
        {%- endif -%}
          {% assign INSTITUTE = users[j].INSTITUTE %}
          {% assign IMIS = users[j].IMIS %}
          {% assign CODE = users[j].CODE %}
          ${
            orientation === 'LANDSCAPE'
              ? `${frontHTML}`
              : `<div class='card'>${frontHTML}</div>`
          }
      {%- endfor%}
      
      {% for j in (start..end) %}
       {%- if j == users.length -%}
        {% break %}
      {%- endif -%}
           {% assign INSTITUTE = users[j].INSTITUTE %}
          {% assign IMIS = users[j].IMIS %}
          {% assign CODE = users[j].CODE %}
          ${
            orientation === 'LANDSCAPE'
              ? `${backHTML || ''}`
              : `<div class='card'>${backHTML || ''}</div>`
          }
      {%- endfor%}
      
      {%  assign start = start | plus: 20 %} 
      {%  assign end = end | plus: 20 %}
       {%- if end > users.length -%}
        {% break %}
      {%- endif -%}
     {%- endfor%}
    `

    const columnCount = orientation === 'LANDSCAPE' ? 4 : 5

    let layout = `<div>
    <style>
    ${`.cards {
        display: grid;
        gap: ${vertical}px ${horizontal}px;
        grid-template-columns: repeat(${columnCount}, ${idCardWidth}px);
        grid-template-rows:  repeat(${
          orientation === 'LANDSCAPE' ? 5 : 4
        }, ${idCardHeight}px);
      }
      .card {
        display: flex;
        flex-direction: column;
        gap: ${vertical}px;
      }
      .card > div:nth-of-type(2) {
        transform: rotate(180deg);
      }`}
    </style>
      <div class="cards">
        ${loop}
      </div>
    </div>`
    const html = generateHTMLSkeletonIDCard({
      pageHeight: orientation === 'LANDSCAPE' ? pageHeight : pageWidth,
      pageWidth: orientation === 'LANDSCAPE' ? pageWidth : pageHeight,
      content: layout,
      margin,
    })
    return html
  }

  useEffect(() => {
    if (idCardCheckoutData?.makePayment) {
      eventManager.send_event(events.IDCARD_ORDER_CHECKOUT_POPUP_CLICKED_TFI)
      handleGetIdCardPayementId(data?.order_id)
      internalDispatch({
        type: IDCheckoutActions.MAKE_PAYMENT_ACTION,
        data: false,
      })
    }
  }, [idCardCheckoutData?.makePayment])

  useEffect(() => {
    if (studentTemplate) {
      const data = {
        student: {
          iids: idCardCheckoutData?.selectedStudents,
          template_id: studentTemplate ? studentTemplate?._id : '',
          default: studentTemplate ? studentTemplate.default : false,
          html: studentTemplate ? getVendorLayout(studentTemplate) : '',
        },
        staff: {
          iids: idCardCheckoutData?.selectedStaff,
          template_id: staffTemplate ? staffTemplate?._id : '',
          default: staffTemplate ? staffTemplate?.default : false,
          html: staffTemplate ? getVendorLayout(staffTemplate) : '',
        },
        config: {
          ...idCardCheckoutData.idCardConfig,
        },
      }
      dispatch(globalActions.idCardOrderCheckout.request(data))
      internalDispatch({type: IDCheckoutActions.SET_IS_FINAL_STEP, data: true})
      return () => {
        internalDispatch({
          type: IDCheckoutActions.SET_IS_FINAL_STEP,
          data: false,
        })
      }
    }
  }, [studentTemplate])

  const handleGetIdCardPayementId = () => {
    const payload = {
      order_id: data?.order_id,
      delivery_address: {
        ...idCardCheckoutData.deliveryAddress,
      },
      billing_address: {
        ...idCardCheckoutData.billingAddress,
      },
    }

    dispatch(showLoadingAction(true))
    getIdCardPayementId(payload)
      .then(async ({data}) => {
        handlePay(data?.obj?.razorpay_order_id)
      })
      .catch(() => dispatch(showErrorOccuredAction(true)))
      .finally(() => dispatch(showLoadingAction(false)))
  }

  const handlePay = (orderId) => {
    if (orderId && data?.summary?.total) {
      const options = {
        key: REACT_APP_RAZORPAY_KEY,
        currency: 'INR',
        name: 'Teachmint',
        order_id: orderId,
        amount: data?.summary?.total,
        handler: handleVerifyPayment,
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
    }
  }

  const onPaymentSuccess = () => {
    dispatch(showSuccessToast(t('paymentSuccess')))
    dispatch(globalActions?.getIDCardOrderHistory?.request())
    closeModal()
  }
  const onPaymentFailure = () => {
    dispatch(showErrorToast(t('paymentFailed')))
  }

  const handleVerifyPayment = (resData) => {
    const payload = {order_id: data?.order_id, ...resData}

    dispatch(showLoadingAction(true))
    idCardVerifyPayment(payload)
      .then(async ({data}) => {
        if (data?.status) onPaymentSuccess()
        else onPaymentFailure()
      })
      .catch(() => dispatch(showErrorOccuredAction(true)))
      .finally(() => dispatch(showLoadingAction(false)))
  }

  return (
    <div className={styles.wrapper}>
      <Loader show={isLoading} />
      <CheckoutVerifyOrder summary={data?.summary} />
      <CheckoutOrderConfirmCard summary={data?.summary} />
    </div>
  )
}
