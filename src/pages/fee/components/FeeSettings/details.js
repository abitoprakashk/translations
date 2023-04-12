import {useDispatch, useSelector} from 'react-redux'
import classNames from 'classnames'
import {events} from '../../../../utils/EventsConstants'
import ToggleAccordion from '../../../global-settings/components/common/options/toggle-accordion/ToggleAccordion'
import {feeSettingsUpdate} from '../../redux/feeCollectionActions'
import {useFeeCollection} from '../../redux/feeCollectionSelectors'
import DetailHeader from './DetailHeader'
import {Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import landscape_double from './assets/landscape_double.svg'
import landscape_single from './assets/landscape_single.svg'
import portrait_single from './assets/portrait_single.svg'
import styles from './FeeSettings.module.css'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'
import Permission from '../../../../components/Common/Permission/Permission'
import DigitalSignature from './DigitalSignature/DigitalSignature'

const Details = ({listDetail = {}}) => {
  const dispatch = useDispatch()
  const {feeSettingLoading} = useFeeCollection()
  const eventManager = useSelector((state) => state.eventManager)

  const RECEIPT_LAYOUT_PREVIEW = {
    landscape_double: landscape_double,
    landscape_single: landscape_single,
    portrait_single: portrait_single,
  }

  const RECEIPT_LAYOUT_SAMPLE = {
    landscape_double:
      'https://storage.googleapis.com/tm-assets/files/fees/sample_landscape_double.pdf',
    landscape_single:
      'https://storage.googleapis.com/tm-assets/files/fees/sample_landscape_single.pdf',
    portrait_single:
      'https://storage.googleapis.com/tm-assets/files/fees/sample_portrait_single.pdf',
  }

  const handleSettingsChange = (id, value) => {
    let primarykey = listDetail.primarykey
    let subKey = listDetail.subKey
    let newobj = {_id: id, status: value}
    eventManager.send_event(events.FEE_TOGGLE_SETTING_CLICKED_TFI, {
      type: primarykey,
      sub_type: subKey,
      settingName: listDetail?.settings[id].title,
      status: value,
    })
    let detailListData = {
      [primarykey]: {
        [subKey]: [newobj],
      },
    }
    dispatch(feeSettingsUpdate(detailListData))
  }

  return (
    <>
      <div>
        <DetailHeader title={listDetail.title} desc={listDetail.desc} />
        <div className={styles.communicationSettingWrapper}>
          {(listDetail.primarykey != 'receipt_settings' ||
            listDetail.subKey != 'layout') &&
            listDetail?.settings &&
            Object.keys(listDetail?.settings).map((key) => (
              <div key={key}>
                <ToggleAccordion
                  id={listDetail?.settings[key]._id}
                  title={listDetail?.settings[key].title}
                  isOn={listDetail?.settings[key].status}
                  handleActions={handleSettingsChange}
                  feeSettingLoading={feeSettingLoading}
                  permissionId={
                    PERMISSION_CONSTANTS.feeModuleController_updateFeeSettings_update
                  }
                  classes={{
                    toogleAccordionContainer:
                      key === 'digital_signature' &&
                      listDetail.settings[key]['status'] === true
                        ? styles.toogleAccordionContainer
                        : '',
                  }}
                />
                {key === 'digital_signature' &&
                  listDetail.settings[key]['status'] === true && (
                    <DigitalSignature listDetail={listDetail} />
                  )}
                <hr className={styles.communicationSettingHorizontalLine} />
              </div>
            ))}
          <div className={styles.setup_container}>
            {listDetail.primarykey == 'receipt_settings' &&
              listDetail.subKey == 'layout' &&
              listDetail?.settings &&
              Object.keys(listDetail?.settings).map((key) => (
                <Permission
                  key={listDetail?.settings[key]._id}
                  permissionId={
                    PERMISSION_CONSTANTS.feeModuleController_updateFeeSettings_update
                  }
                >
                  <div
                    key={listDetail?.settings[key]._id}
                    className={classNames(
                      'tm-border-radius1 tm-box-shadow1 p-4 flex gap-2',
                      styles.setup_card,
                      listDetail?.settings[key].status
                        ? styles.selected_card
                        : null
                    )}
                  >
                    <div
                      className="flex justify-start gap-2 w-full cursor-pointer"
                      onClick={() =>
                        handleSettingsChange(
                          listDetail?.settings[key]._id,
                          true
                        )
                      }
                    >
                      <img
                        className="cursor-pointer"
                        src={
                          RECEIPT_LAYOUT_PREVIEW[listDetail?.settings[key]._id]
                        }
                      />
                      <div className="tm-h6 flex flex-col justify-center gap-1 cursor-pointer">
                        <span>{listDetail?.settings[key].title}</span>
                      </div>
                    </div>
                    <div
                      className={classNames(
                        'tm-h6 tm-color-blue flex flex-col justify-center gap-1',
                        styles.viewSampleWrapper
                      )}
                    >
                      <a
                        className="flex gap-1 justify-end"
                        href={
                          RECEIPT_LAYOUT_SAMPLE[listDetail?.settings[key]._id]
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span>View sample</span>
                        <div
                          className={classNames(
                            'flex justify-center',
                            styles.launchIcon
                          )}
                        >
                          <Icon
                            name="launch"
                            type={ICON_CONSTANTS.TYPES.PRIMARY}
                            size={ICON_CONSTANTS.SIZES.XXX_SMALL}
                          />
                        </div>
                      </a>
                    </div>
                  </div>
                </Permission>
              ))}
          </div>
        </div>
      </div>
    </>
  )
}
export default Details
