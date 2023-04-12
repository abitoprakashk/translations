import axios from 'axios'
import {REACT_APP_API_URL} from '../../constants'
import {sidebarData} from '../../utils/SidebarItems'
import {removeCountryCodeFromPhone} from '../../utils/subscriptionHelpers'

export const getCollectionInstallments = async (institute_id) => {
  const res = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}sarvesh-subscription/installment/details`,
    headers: {'Content-Type': 'application/json'},
    params: {institute_id: institute_id},
  })
  return res
}

export const getPaymentLink = async (
  instituteInfo,
  instituteBillingInfo,
  currentAdminInfo
) => {
  let uuid = self.crypto.randomUUID()
  window.localStorage.setItem('paymentTransactionID', uuid)
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}institute/subscription/generate_payment_link`,
    headers: {'Content-Type': 'application/json'},
    data: {
      transaction_id: uuid,
      institute_id: instituteInfo?._id,
      institute_name: instituteInfo?.name,
      currency: 'INR',
      pending_amount: instituteBillingInfo?.pending_amount,
      buyer_phone: removeCountryCodeFromPhone(currentAdminInfo?.phone_number),
      email: currentAdminInfo?.email,
      callback_url: `http://${window.location.host}${sidebarData.BILLING.subRoutes[0]}`,
    },
  })
  return res
}

export const updatePaymentStatus = async (
  transaction_id,
  installment_id,
  pending_amount,
  installment_name,
  module
) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}institute/subscription/update_payment`,
    headers: {'Content-Type': 'application/json'},
    data: {
      transaction_id: transaction_id,
      installment_id: installment_id,
      pending_amount: pending_amount,
      installment_name: installment_name,
      module: module,
    },
  })
  return res
}
