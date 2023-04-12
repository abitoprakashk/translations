import {useEffect, useState} from 'react'
import {Redirect} from 'react-router-dom'
import Loader from '../../../../components/Common/Loader/Loader'
import {updatePaymentStatus} from '../../apiServices'
import {useDispatch} from 'react-redux'
import {
  showErrorOccuredAction,
  showLoadingAction,
  showToast,
} from '../../../../redux/actions/commonAction'
import {TOAST_CONSTANTS} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import {sidebarData} from '../../../../utils/SidebarItems'
import {utilsGetBillingData} from '../../../../routes/dashboard'
import {instituteBillingInfoAction} from '../../../../redux/actions/instituteInfoActions'
import {localStorageKeys} from '../../constants'

export default function CheckStatus() {
  const {t} = useTranslation()
  const {instituteInfo, instituteBillingInfo} = useSelector((state) => state)
  const dispatch = useDispatch()

  const [isLoadingLocal, setIsLoadingLocal] = useState(false)
  useEffect(() => {
    setIsLoadingLocal(true)
    updatePaymentStatus(
      window.localStorage.getItem('paymentTransactionID'),
      instituteBillingInfo?.installment_id,
      instituteBillingInfo?.pending_amount,
      instituteBillingInfo?.installment_name,
      instituteBillingInfo?.module_name
    )
      .then((res) => {
        if (res?.data?.obj !== 'COMPLETED') throw new Error()
        dispatch(
          showToast({
            type: TOAST_CONSTANTS.TYPES.SUCCESS,
            message: t('paymentCompletedSuccessfully'),
          })
        )
        window.localStorage.removeItem('paymentTransactionID')
      })
      .catch(() => {
        dispatch(
          showToast({
            type: TOAST_CONSTANTS.TYPES.ERROR,
            message: t('somethingWentWrong'),
          })
        )
      })
    dispatch(showLoadingAction(true))
    utilsGetBillingData(instituteInfo?._id)
      .then((res) => {
        dispatch(instituteBillingInfoAction(res?.data?.obj))
        localStorage.setItem(localStorageKeys.VERIFIED_SUITS, !!res?.data?.obj)
      })
      .catch(() => {
        dispatch(showErrorOccuredAction(false))
      })
      .finally(() => dispatch(showLoadingAction(false)))
    setIsLoadingLocal(false)
  }, [])

  return (
    <>
      <Loader show={isLoadingLocal} />
      <Redirect push to={sidebarData.BILLING.route} />
    </>
  )
}
