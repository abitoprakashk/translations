import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Switch} from 'react-router-dom'
import {events} from '../../../../utils/EventsConstants'
import OptionsBox from '../../../global-settings/components/common/containers/options-box/OptionsBox'
import {setSelectedSettingCategoryAction} from '../../../global-settings/redux/GlobalSettingsActions'
import {useSelectedSettingCategory} from '../../../global-settings/redux/GlobalSettingsSelectors'
import {fSettings} from '../../apis/fees.utils'
import {intializationOfSetting} from '../../helpers/helpers'
import {useFeeStructure} from '../../redux/feeStructure/feeStructureSelectors'
import Details from './details'
import styles from './FeeSettings.module.css'

const FeeSettings = () => {
  const dispatch = useDispatch()
  const [selectedSettingSubCategory, setSelectedSettingSubCategory] =
    useState('')
  const selectedSettingCategory = useSelectedSettingCategory()
  const [listDetail, setListDetail] = useState({})

  const {feeSettings} = useFeeStructure()
  const [settings, setSettings] = useState(fSettings(feeSettings))
  const [titleAndOptionIds, setTitleAndOptionIds] = useState({})
  const eventManager = useSelector((state) => state.eventManager)

  const handleActions = (titleId, optionId) => {
    if (!titleId && !optionId) return
    dispatch(setSelectedSettingCategoryAction(titleId))
    let newObj = {}

    if (titleId && !optionId) {
      eventManager.send_event(events.FEE_HEAD_SETTING_CLICKED_TFI, {
        type: titleId,
      })
      Object.keys(settings).find((keySettings) => {
        if (keySettings === titleId) {
          Object.keys(settings).find(() => {
            let optId = Object.keys(settings[titleId]).filter(
              (key) => key !== 'title' && key !== 'desc'
            )[0]
            newObj = {
              primarykey: titleId,
              subKey: optId,
              settings: settings[titleId][optId]['settings'],
              title: settings[titleId][optId].title,
              desc: settings[titleId][optId].desc,
            }
            setSelectedSettingSubCategory(optId)
            return newObj
          })
        }
      })
    }

    if (titleId && optionId) {
      Object.keys(settings).find((key) => {
        eventManager.send_event(events.FEE_SUB_HEAD_SETTING_CLICKED_TFI, {
          type: titleId,
          sub_type: settings[titleId][optionId].title,
        })
        key
        newObj = {
          primarykey: titleId,
          subKey: optionId,
          settings: settings[titleId][optionId]['settings'],
          title: settings[titleId][optionId].title,
          desc: settings[titleId][optionId].desc,
        }
        setSelectedSettingSubCategory(optionId)
        return newObj
      })
    }
    setListDetail(newObj)
    setTitleAndOptionIds({titleId, optionId})
  }

  // function intializationOfSetting() {
  //   if (settings) {
  //     let objKeys = Object.keys(settings)
  //     if (objKeys.length > 0) {
  //       let titleId = objKeys[0]
  //       let optionId = Object.keys(settings[titleId])[0]
  //       setSelectedSettingSubCategory(optionId)
  //       handleActions(titleId, optionId)
  //     }
  //   }
  // }

  useEffect(() => {
    intializationOfSetting({
      funcs: {setSelectedSettingSubCategory, handleActions},
      params: {settings},
    })
  }, [])

  useEffect(() => {
    const {titleId, optionId} = titleAndOptionIds
    handleActions(titleId, optionId)
  }, [settings])

  useEffect(() => {
    setSettings(fSettings(feeSettings))
  }, [feeSettings])
  return (
    <div className={styles.settingsWrapper}>
      <div className={styles.settingsSidebar}>
        {Object.values(settings).map(
          ({
            id,
            title,
            icon,
            //   iconSelected,
            titleType,
            optionType,
            desc,
            settingsList,
          }) => (
            <div key={id} className={styles.settingsCategoryWrapper}>
              <OptionsBox
                id={id}
                icon={icon}
                //   iconSelected={iconSelected}
                title={title}
                optionType={optionType}
                titleType={titleType}
                desc={desc}
                isOn={selectedSettingCategory === id}
                optionsList={Object.values(settingsList)}
                handleAction={handleActions}
                isLeafNode={false}
                selectedOption={selectedSettingSubCategory}
              />
            </div>
          )
        )}
      </div>
      <div className={styles.settingsContiner}>
        <Switch>
          <Details
            listDetail={listDetail}
            handleActions={handleActions}
            titleAndOptionIds={titleAndOptionIds}
          />
        </Switch>
      </div>
    </div>
  )
}

export default FeeSettings
