import {useMemo} from 'react'
import {t} from 'i18next'
import {useSelector} from 'react-redux'
import {paymentStatus, paymentStatusLabels} from '../fees.constants'

export default function usePaymentStatusAccordingToCurrency() {
  const currency = useSelector((state) => state?.instituteInfo?.currency)
  const isInternational = useMemo(
    () => (currency ? currency !== 'INR' : false),
    [currency]
  )

  return useMemo(
    () =>
      Object.values(paymentStatusLabels)
        .filter((status) => status.key !== paymentStatus.ONLINE)
        .filter((item) => (isInternational ? item.visibleToInernational : true))
        .map((status) => {
          return {
            value: status.key,
            label: isInternational
              ? t(status?.internationalLabel)
              : t(status.label),
          }
        }),
    [currency]
  )
}
