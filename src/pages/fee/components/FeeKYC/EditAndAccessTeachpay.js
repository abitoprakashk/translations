import {Button, BUTTON_CONSTANTS, Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import {useSelector} from 'react-redux'
import Permission from '../../../../components/Common/Permission/Permission'
import {events} from '../../../../utils/EventsConstants'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'
import {
  ACCESS_TEACHPAY_DASHBOARD,
  multiPaymentGateway,
} from '../../fees.constants'
import styles from './FeeKYC.module.css'

const EditAndAccessTeachpay = ({
  paymentGateway,
  setShowTeachPay,
  handleEditPg,
}) => {
  const eventManager = useSelector((state) => state.eventManager)
  return (
    <div className={styles.container}>
      {paymentGateway.pg_id === multiPaymentGateway.TEACHPAY && (
        <Button
          children={ACCESS_TEACHPAY_DASHBOARD}
          type={BUTTON_CONSTANTS.TYPE.OUTLINE}
          classes={{button: styles.buttonClass1}}
          onClick={() => {
            eventManager.send_event(
              events.ACCESS_TEACHPAY_DASHBOARD_CLICKED_TFI,
              {screen_name: 'payment_gateway_dashboard'}
            )
            setShowTeachPay(true)
          }}
        />
      )}

      {paymentGateway?.pg_credentials_id && (
        <Permission
          permissionId={
            PERMISSION_CONSTANTS.feeModuleController_pgCreate_create
          }
        >
          <Button
            width={BUTTON_CONSTANTS.WIDTH.FIT}
            type={BUTTON_CONSTANTS.TYPE.OUTLINE}
            onClick={() => {
              eventManager.send_event(
                events.FEE_PAYMENT_GATEWAY_EDIT_DETAILS_CLICKED_TFI,
                {
                  gateway_type: paymentGateway?.pg_id,
                }
              )
              handleEditPg(paymentGateway)
            }}
            classes={{button: styles.buttonClass2}}
            children={
              <Icon
                name={'edit'}
                type={ICON_CONSTANTS.TYPES.PRIMARY}
                version={ICON_CONSTANTS.VERSION.FILLED}
              />
            }
          />
        </Permission>
      )}
    </div>
  )
}

export default EditAndAccessTeachpay
