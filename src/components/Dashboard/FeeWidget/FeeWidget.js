import {BUTTON_CONSTANTS, Widget} from '@teachmint/krayon'
import React, {useEffect, useMemo} from 'react'
import {useTranslation} from 'react-i18next'
import {Link} from 'react-router-dom'
import globalActions from '../../../redux/actions/global.actions'
import {sidebarData} from '../../../utils/SidebarItems'
import FeeBody from './components/FeeBody/FeeBody'
import {useDispatch, useSelector} from 'react-redux'
import styles from './FeeWidget.module.css'
import FeeFooter from './components/FeeFooter/FeeFooter'
import {FEE_WIDGET_EVENTS} from './events'
import {
  fetchFeeSettingRequestAction,
  fetchFeeStructuresRequestedAction,
} from '../../../pages/fee/redux/feeStructure/feeStructureActions'
import NoFeeStructure from './components/NoFeeStructure/NoFeeStructure'
import {checkSubscriptionType} from '../../../utils/Helpers'
import UnpaidWidgetLock from './components/UnpaidWidgetLock/UnpaidWidgetLock'
import ErrorStateWidget from './components/ErrorStateWidget/ErrorStateWidget'
import {events} from '../../../utils/EventsConstants'
function FeeWidget() {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const {error, isLoading} = useSelector((state) => state.globalData.feeWidget)
  const eventManager = useSelector((state) => state.eventManager)
  const {feeStructuresLoading, feeStructures} = useSelector(
    (state) => state.feeStructure
  )
  const instituteInfo = useSelector((state) => state.instituteInfo)
  const noFeeStructure = useMemo(
    () =>
      !feeStructuresLoading &&
      Object.keys(feeStructures.structureView).length === 0,
    [feeStructuresLoading, feeStructures]
  )

  useEffect(() => {
    eventManager.send_event(events.DASHBOARD_WIDGETS_LOADED, {
      widget_type: 'fee',
    })
    if (checkSubscriptionType(instituteInfo)) {
      dispatch(globalActions.feeWidget.request())
      dispatch(fetchFeeStructuresRequestedAction())
      dispatch(fetchFeeSettingRequestAction())
    }
  }, [])

  const RenderUI = () => {
    return (
      <Widget
        header={{
          icon: 'cash',
          title: t('fee'),
        }}
        actionButtons={
          noFeeStructure
            ? null
            : [
                {
                  body: (
                    <Link
                      to={sidebarData.FEE_REPORTS.route}
                      onClick={() => {
                        eventManager.send_event(
                          FEE_WIDGET_EVENTS.FEE_REPORT_DOWNLOAD_CLICKED_TFI
                        )
                      }}
                    >
                      {t('viewReports')}
                    </Link>
                  ),
                  type: BUTTON_CONSTANTS.TYPE.TEXT,
                },
              ]
        }
        body={
          error && !isLoading ? (
            <ErrorStateWidget
              onRetry={() => {
                if (checkSubscriptionType(instituteInfo)) {
                  dispatch(globalActions.feeWidget.request())
                }
              }}
            />
          ) : (
            <RenderBody />
          )
        }
        footer={
          (error && !isLoading) || noFeeStructure ? null : <RenderFooter />
        }
        classes={{
          iconFrame: styles.iconFrame,
          footer: styles.footer,
          headerTitle: styles.widgetHeaderTitle,
          header: styles.header,
        }}
      />
    )
  }

  const RenderBody = () => {
    if (!checkSubscriptionType(instituteInfo)) return <UnpaidWidgetLock />
    if (checkSubscriptionType(instituteInfo) && noFeeStructure)
      return <NoFeeStructure />

    return <FeeBody />
  }
  const RenderFooter = () => {
    if (noFeeStructure || !checkSubscriptionType(instituteInfo)) return null

    return <FeeFooter />
  }

  return (
    <div>
      <RenderUI />
    </div>
  )
}

export default FeeWidget
