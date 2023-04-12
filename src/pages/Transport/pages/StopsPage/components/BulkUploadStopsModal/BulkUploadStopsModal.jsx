import {useState} from 'react'
import {Trans, useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import {
  Button,
  BUTTON_CONSTANTS,
  Divider,
  Heading,
  HEADING_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  Modal,
  MODAL_CONSTANTS,
  Para,
  PARA_CONSTANTS,
  PlainCard,
  RadioGroup,
} from '@teachmint/krayon'
import globalActions from '../../../../../../redux/actions/global.actions'
import {alphaNumericRegex} from '../../../../../../utils/Validations'
import DragAndDropCSVUpload from '../../../../../../components/Common/DragAndDropCSVUpload/DragAndDropCSVUpload'
import styles from './bulkUploadStops.module.css'
import {showSuccessToast} from '../../../../../../redux/actions/commonAction'
import {events} from '../../../../../../utils/EventsConstants'

export default function BulkUploadStopsModal({showModal, setShowModal}) {
  if (!showModal) return null

  const [isUploadComplete, setIsUploadComplete] = useState(false)
  const [stopsListForApi, setStopsListForApi] = useState([])
  const [duplicates, setDuplicates] = useState({})
  const [showUploadSummary, setShowUploadSummary] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState({})

  const {t} = useTranslation()
  const dispatch = useDispatch()

  const transportStopsData = useSelector(
    (state) => state?.globalData?.transportStops?.data
  )
  const eventManager = useSelector((state) => state?.eventManager)

  const getTransportStopsMapWithStopName = () => {
    let stopNameStopsMap = {}
    transportStopsData?.forEach((stop) => {
      stopNameStopsMap[stop?.name?.toLowerCase()] = stop
    })
    return stopNameStopsMap
  }

  const transportStopsObj = getTransportStopsMapWithStopName()

  const inRangeOf = (val, max, min) => {
    return val <= max && val >= min
  }

  const isValidStopRow = (obj) => {
    if (
      !obj.name ||
      !alphaNumericRegex(obj.name) ||
      !(parseFloat(obj.distance) >= 0) ||
      obj.name.length >= 50
    )
      return false
    if (obj.latitude === '' && obj.longitude === '') return true
    if (
      inRangeOf(parseFloat(obj.latitude), 90, -90) &&
      inRangeOf(parseFloat(obj.longitude), 180, -180)
    )
      return true
    return false
  }

  const processStopsCSVRows = (rows) => {
    let validStopsWithDuplicates = []
    rows?.forEach((obj) => {
      if (isValidStopRow(obj)) validStopsWithDuplicates.push(obj)
    })
    let stops = {}
    let duplicateStops = {}
    validStopsWithDuplicates?.forEach((obj) => {
      let stopName = obj.name
      if (stops[stopName]) {
        if (duplicateStops[stopName]) {
          duplicateStops[stopName].push({
            latitude: obj.latitude,
            longitude: obj.longitude,
            distance: obj.distance,
          })
        } else {
          duplicateStops[stopName] = [
            stops[stopName],
            {
              latitude: obj.latitude,
              longitude: obj.longitude,
              distance: obj.distance,
            },
          ]
        }
      } else {
        stops[obj.name] = {
          latitude: obj.latitude,
          longitude: obj.longitude,
          distance: obj.distance,
        }
      }
    })
    let stopsForApi = []
    validStopsWithDuplicates?.forEach((obj) => {
      if (!duplicateStops[obj.name]) {
        let stopObj = {}
        if (transportStopsObj[obj?.name?.toLowerCase()]) {
          stopObj = {
            ...transportStopsObj[obj?.name?.toLowerCase()],
            distance: parseFloat(obj.distance),
          }
        } else {
          stopObj = {
            name: obj.name,
            distance: parseFloat(obj.distance),
            address: obj.name,
            passenger_ids: [],
          }
        }
        if (obj.latitude) {
          stopObj.latitude = parseFloat(obj.latitude)
          stopObj.longitude = parseFloat(obj.longitude)
          stopObj.address = obj.name
        }
        if (!stopObj['latitude'] || !stopObj['longitude']) {
          delete stopObj['latitude']
          delete stopObj['longitude']
        }
        stopsForApi.push(stopObj)
      }
    })
    setDuplicates(duplicateStops)
    setStopsListForApi(stopsForApi)
  }

  const onUpload = (processedCSVObject) => {
    setIsUploadComplete(true)
    processStopsCSVRows(
      processedCSVObject?.rows?.map((obj) => {
        return {
          name: obj[t('stopName')].trim(),
          distance: obj[t('distanceInKm')].trim(),
          latitude: obj[t('latitude')].trim(),
          longitude: obj[t('longitude')].trim(),
        }
      })
    )
  }

  const onRemove = () => {
    setStopsListForApi([])
    setDuplicates({})
    setIsUploadComplete(false)
    setSelectedOptions({})
  }

  const onModalClose = () => {
    setShowModal(false)
    setShowUploadSummary(false)
    eventManager.send_event(events.TRANSPORT_BULKUPLOAD_POPUP_CLICKED_TFI, {
      option: 'stops',
      action: 'close',
    })
  }

  const onUpdate = () => {
    let allStopsList = [...stopsListForApi]
    Object.keys(selectedOptions)?.forEach((stopName) => {
      let selectedOptionValues = selectedOptions[stopName].split(',')
      let stopObj = {}
      if (transportStopsObj[stopName?.toLowerCase()]) {
        stopObj = {
          ...transportStopsObj[stopName?.toLowerCase()],
          distance: parseFloat(selectedOptionValues[2]),
        }
      } else {
        stopObj = {
          name: stopName,
          distance: parseFloat(selectedOptionValues[2]),
          address: stopName,
          passenger_ids: [],
        }
      }
      if (selectedOptionValues[0] !== '') {
        stopObj.latitude = parseFloat(selectedOptionValues[0])
        stopObj.longitude = parseFloat(selectedOptionValues[1])
        stopObj.address = stopName
      }
      if (!stopObj['latitude'] || !stopObj['longitude']) {
        delete stopObj['latitude']
        delete stopObj['longitude']
      }
      allStopsList.push(stopObj)
    })
    const payload = {pickup_points_list: allStopsList}
    const apiSuccessAction = () => {
      setShowModal(false)
      dispatch(showSuccessToast(t('stopsUpdatedSuccesfully')))
    }
    dispatch(
      globalActions?.updateTransportStops?.request(payload, apiSuccessAction)
    )
    eventManager.send_event(events.TRANSPORT_BULKUPLOAD_POPUP_CLICKED_TFI, {
      option: 'stops',
      action: 'update',
      stops: allStopsList.length,
    })
  }

  const handleDuplicateOptionSelect = (stop, value) => {
    let newSelectedOptions = {...selectedOptions}
    newSelectedOptions[stop] = value
    setSelectedOptions(newSelectedOptions)
  }

  const DuplicateErrorCard = ({stop}) => {
    return (
      <PlainCard className={styles.duplicateErrorCard}>
        <Para
          weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
          type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
          className={styles.duplicateCardPadding}
        >
          {stop}
        </Para>
        <Divider spacing="12px" />
        <Para
          textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
          className={styles.duplicateCardPadding}
        >{`${t('choose')} ${t('lat/long/distance')}`}</Para>
        <div className={styles.options}>
          <RadioGroup
            options={duplicates[stop]?.map((obj) => ({
              value: `${obj.latitude},${obj.longitude},${obj.distance}`,
            }))}
            handleChange={(e) => handleDuplicateOptionSelect(stop, e.selected)}
            selectedOption={selectedOptions[stop]}
          />
        </div>
      </PlainCard>
    )
  }

  const helperText = {
    heading: t('howToUploadStopsInBulk'),
    rows: [
      t('stopBulkUploadHelperText1'),
      t('stopBulkUploadHelperText2'),
      t('stopBulkUploadHelperText3'),
      t('stopBulkUploadHelperText4'),
      t('stopBulkUploadHelperText5'),
    ],
  }

  const sampleCSVObj = {
    headers: [t('stopName'), t('distanceInKm'), t('latitude'), t('longitude')],
    title: 'BulkUploadStops',
  }

  const onNextButtonClick = () => {
    setShowUploadSummary(true)
    eventManager.send_event(events.TRANSPORT_BULKUPLOAD_POPUP_CLICKED_TFI, {
      option: 'stops',
      action: 'next',
    })
  }

  return (
    <Modal
      header={t('bulkUploadStops')}
      isOpen={showModal}
      onClose={onModalClose}
      classes={{content: styles.modalContent}}
      actionButtons={
        showUploadSummary
          ? [
              {
                onClick: onUpdate,
                body: t('update'),
                isDisabled: !(
                  stopsListForApi.length > 0 ||
                  Object.keys(duplicates).length > 0
                ),
              },
            ]
          : [
              {
                onClick: onNextButtonClick,
                body: t('next'),
                isDisabled: !isUploadComplete,
              },
            ]
      }
      footerLeftElement={
        showUploadSummary ? (
          <Button
            type={BUTTON_CONSTANTS.TYPE.TEXT}
            prefixIcon="backArrow"
            onClick={() => {
              setShowUploadSummary(false)
              onRemove()
            }}
          >
            {t('back')}
          </Button>
        ) : null
      }
      size={MODAL_CONSTANTS.SIZE.X_LARGE}
      shouldCloseOnOverlayClick={false}
    >
      {showUploadSummary ? (
        <div>
          <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
            {t('uploadSummary')}
          </Heading>
          <Divider spacing="16px" />
          <div className={styles.uploadSummary}>
            <Icon
              name="checkCircle"
              type={ICON_CONSTANTS.TYPES.SUCCESS}
              size={ICON_CONSTANTS.SIZES.XX_SMALL}
            />
            <div>
              <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>
                <Trans
                  i18nKey="nStopEntriesRecorded"
                  values={{nEntries: stopsListForApi.length}}
                ></Trans>
              </Para>
              <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
                {t('nStopsRecordedDesc')}
              </Para>
            </div>
          </div>
          {Object.keys(duplicates).length > 0 && (
            <PlainCard className={styles.duplicatesCard}>
              <div className={styles.duplicateSummary}>
                <Icon
                  name="caution"
                  type={ICON_CONSTANTS.TYPES.WARNING}
                  size={ICON_CONSTANTS.SIZES.XX_SMALL}
                />
                <div>
                  <Para
                    weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
                    type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
                  >
                    <Trans
                      i18nKey={'nDuplicateEntriesFound'}
                      values={{nDuplicates: Object.keys(duplicates).length}}
                    />
                  </Para>
                  <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
                    {t('duplicateStopEntriesDesc')}
                  </Para>
                </div>
              </div>
              <Divider
                spacing="0px"
                classes={{divider: styles.duplicatesCardDivider}}
              />
              <div className={styles.duplicateCardsWrapper}>
                {Object.keys(duplicates).map((stopName) => (
                  <DuplicateErrorCard key={stopName} stop={stopName} />
                ))}
              </div>
            </PlainCard>
          )}
        </div>
      ) : (
        <div>
          <DragAndDropCSVUpload
            onUpload={onUpload}
            onRemove={onRemove}
            sampleCSVObj={sampleCSVObj}
            uploadHelperText={helperText}
          />
        </div>
      )}
    </Modal>
  )
}
