import {useState} from 'react'
import {Trans, useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import styles from './bulkUploadPassengers.module.css'
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
  Table,
  TOOLTIP_CONSTANTS,
  Tooltip,
} from '@teachmint/krayon'
import globalActions from '../../../../../../redux/actions/global.actions'
import DragAndDropCSVUpload from '../../../../../../components/Common/DragAndDropCSVUpload/DragAndDropCSVUpload'
import {showSuccessToast} from '../../../../../../redux/actions/commonAction'
import classNames from 'classnames'
import {events} from '../../../../../../utils/EventsConstants'

export default function BulkUploadPassengersModal({showModal, setShowModal}) {
  if (!showModal) return null

  const [isUploadComplete, setIsUploadComplete] = useState(false)
  const [stopsForApi, setStopsForApi] = useState({})
  const [duplicates, setDuplicates] = useState({})
  const [notFoundStops, setNotFoundStops] = useState({})
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

  const getPassengerIdStopNameMap = () => {
    let passengerIdStopNameMap = {}

    transportStopsData?.forEach((stop) => {
      stop?.passenger_ids?.forEach((passengerId) => {
        passengerIdStopNameMap[passengerId] = stop?.name?.toLowerCase()
      })
    })

    return passengerIdStopNameMap
  }

  const transportStopsObj = getTransportStopsMapWithStopName()

  const passengerIdStopNameMap = getPassengerIdStopNameMap()

  const instituteActiveTeacherList = useSelector(
    (state) => state?.instituteActiveTeacherList
  )
  const instituteActiveStudentList = useSelector(
    (state) => state?.instituteActiveStudentList
  )

  const getValidPassengersUid = () => {
    let validUidSet = new Set()
    instituteActiveTeacherList?.forEach((obj) => {
      validUidSet.add(obj._id)
    })
    instituteActiveStudentList?.forEach((obj) => {
      validUidSet.add(obj._id)
    })
    return validUidSet
  }

  const validPassengerUids = getValidPassengersUid()

  const getSampleCSVRows = () => {
    let rows = []
    instituteActiveStudentList?.forEach((obj) => {
      let existingStopName = passengerIdStopNameMap[obj?._id] || ''
      rows.push({
        [t('stopName')]: existingStopName,
        [t('name')]: obj.full_name,
        [t('role')]: t('student'),
        [t('classNSection')]: obj.classroom,
        [t('enrollmentID')]: obj.enrollment_number,
        [t('uid')]: obj._id,
      })
    })
    instituteActiveTeacherList?.forEach((obj) => {
      rows.push({
        [t('stopName')]: '',
        [t('name')]: obj.full_name,
        [t('role')]: t('teacher'),
        [t('classNSection')]: obj.classroom,
        [t('enrollmentID')]: obj?.enrollment_number || '-',
        [t('uid')]: obj._id,
      })
    })
    return rows
  }

  const sampleCSVObj = {
    headers: [
      t('stopName'),
      t('name'),
      t('role'),
      t('classNSection'),
      t('enrollmentID'),
      t('uid'),
    ],
    rows: getSampleCSVRows(),
    title: 'BulkUploadPassengers',
  }

  const processCSVRows = (rows) => {
    let stopsNotFound = {}
    let validRowsWithDuplicates = rows?.filter((obj) => {
      let isStopExists =
        obj.uid &&
        obj.stopName &&
        transportStopsObj[obj?.stopName?.toLowerCase()] &&
        validPassengerUids?.has(obj.uid)
      if (
        obj.stopName &&
        obj.uid &&
        validPassengerUids?.has(obj.uid) &&
        !isStopExists
      ) {
        stopsNotFound[obj?.stopName?.toLowerCase()] = [
          ...(stopsNotFound[obj?.stopName?.toLowerCase()] || []),
          obj,
        ]
      }
      return isStopExists
    })

    let tempRows = {}
    let duplicateRows = {}
    validRowsWithDuplicates?.forEach((obj) => {
      let uid = obj.uid
      if (tempRows[uid]) {
        if (duplicateRows[uid]) {
          duplicateRows[uid].push({
            stopName: obj.stopName,
            name: obj.name,
            class: obj.class,
          })
        } else {
          duplicateRows[uid] = [
            tempRows[uid],
            {stopName: obj.stopName, name: obj.name, class: obj.class},
          ]
        }
      } else {
        tempRows[uid] = {
          stopName: obj.stopName,
          name: obj.name,
          class: obj.class,
        }
      }
    })
    let validStops = {}
    validRowsWithDuplicates?.forEach((obj) => {
      if (
        !duplicateRows[obj.uid] &&
        !(
          passengerIdStopNameMap[obj.uid]?.toLowerCase() ===
          obj?.stopName?.toLowerCase()
        )
      ) {
        const stopName = transportStopsObj[obj?.stopName?.toLowerCase()]?.name
        if (validStops[stopName]) {
          validStops[stopName].push(obj.uid)
        } else {
          validStops[stopName] = [obj.uid]
        }
      }
    })
    setNotFoundStops(stopsNotFound)
    setDuplicates(duplicateRows)
    setStopsForApi(validStops)
  }

  const onUpload = (processedCSVObject) => {
    setIsUploadComplete(true)
    processCSVRows(
      processedCSVObject?.rows?.map((obj) => {
        return {
          stopName: obj[t('stopName')].trim(),
          uid: obj[t('uid')].trim(),
          name: obj[t('name')].trim(),
          class: obj[t('classNSection')].trim(),
        }
      })
    )
  }

  const onRemove = () => {
    setStopsForApi({})
    setDuplicates({})
    setIsUploadComplete(false)
    setSelectedOptions({})
  }

  const onModalClose = () => {
    setShowModal(false)
    setShowUploadSummary(false)
    eventManager.send_event(events.TRANSPORT_BULKUPLOAD_POPUP_CLICKED_TFI, {
      option: 'passengers',
      action: 'close',
    })
  }

  const getPayload = (stopsObj) => {
    let stopsList = []

    Object.keys(stopsObj)?.forEach((stopName) => {
      let stop = {...transportStopsObj[stopName?.toLowerCase()]}
      stop.passenger_ids = (stop?.passenger_ids || []).concat(
        stopsObj[stopName]
      )
      if (!stop['latitude'] || !stop['longitude']) {
        delete stop['latitude']
        delete stop['longitude']
      }
      if (!stop['address']) {
        stop['address'] = stopName
      }
      stopsList.push(stop)
    })
    return {pickup_points_list: stopsList}
  }

  const onUpdate = () => {
    let allValidStops = {...stopsForApi}

    Object.keys(selectedOptions)?.forEach((passengerUID) => {
      const selectedStop = selectedOptions[passengerUID]
      const stopName = transportStopsObj[selectedStop?.toLowerCase()]?.name
      if (allValidStops[stopName]) {
        allValidStops[stopName].push(passengerUID)
      } else {
        allValidStops[stopName] = [passengerUID]
      }
    })

    const payload = getPayload(allValidStops)
    const apiSuccessAction = () => {
      setShowModal(false)
      dispatch(showSuccessToast(t('passengersAddedToStopsSuccessfully')))
    }
    dispatch(
      globalActions?.updateTransportStops?.request(payload, apiSuccessAction)
    )
    eventManager.send_event(events.TRANSPORT_BULKUPLOAD_POPUP_CLICKED_TFI, {
      option: 'passengers',
      action: 'update',
      stops: Object.keys(allValidStops).length,
      passengers: getNoOfPassengers(allValidStops),
    })
  }

  const handleDuplicateOptionSelect = (passengerUID, value) => {
    let newSelectedOptions = {...selectedOptions}
    newSelectedOptions[passengerUID] = value
    setSelectedOptions(newSelectedOptions)
  }

  const DuplicateErrorCard = ({passengerUID}) => {
    return (
      <PlainCard className={styles.duplicateErrorCard}>
        <div
          className={classNames(
            styles.duplicateCardPadding,
            styles.displayFlex
          )}
        >
          <Para
            weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
            type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
          >
            {duplicates[passengerUID][0].name}
          </Para>
          {duplicates[passengerUID][0]?.class && (
            <>
              <span className={styles.dotSeparator}></span>
              <Para>{duplicates[passengerUID][0].class}</Para>
            </>
          )}
        </div>
        <Divider spacing="12px" />
        <Para
          textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
          className={styles.duplicateCardPadding}
        >{`${t('choose')} ${t('stop')}`}</Para>
        <div className={styles.options}>
          <RadioGroup
            options={duplicates[passengerUID]?.map((obj) => ({
              value: `${obj.stopName}`,
            }))}
            handleChange={(e) =>
              handleDuplicateOptionSelect(passengerUID, e.selected)
            }
            selectedOption={selectedOptions[passengerUID]}
          />
        </div>
      </PlainCard>
    )
  }

  const helperText = {
    heading: t('howToAssignPassengersToStopsInBulk'),
    rows: [
      t('passengerBulkUploadHelperText1'),
      t('passengerBulkUploadHelperText2'),
      t('passengerBulkUploadHelperText3'),
      t('passengerBulkUploadHelperText4'),
    ],
  }

  const getNoOfPassengers = (stops) => {
    let n = 0
    Object.keys(stops)?.forEach((stopName) => {
      n = n + stops[stopName].length
    })
    return n
  }

  const STOPS_NOT_FOUND_TABLE_COLS = [
    {key: 'stop', label: t('stopName')},
    {
      key: 'passengers',
      label: t('passengersAssigned'),
    },
  ]

  const stopsNotFoundPassengersLabel = (passengers) => {
    if (passengers.length === 0) return ''
    if (passengers.length === 1) return passengers[0].name
    return (
      <Para
        className={styles.displayFlex}
        type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
      >
        {`${passengers[0].name}, ${passengers[1].name}`}
        {passengers?.length > 2 && (
          <>
            {', '}
            <Para
              type={PARA_CONSTANTS.TYPE.PRIMARY}
              data-tip
              data-for={`extraInfo${passengers[0]?.uid}`}
            >
              {` +${passengers?.length - 2} ${t('more')}`}
              <Tooltip
                toolTipId={`extraInfo${passengers[0]?.uid}`}
                place={TOOLTIP_CONSTANTS.TOOLTIP_POSITIONS.BOTTOM}
                classNames={{toolTipBody: styles.staffDetailsTooltipBody}}
                toolTipBody={passengers?.map(({name}) => `${name}`).join(', ')}
              ></Tooltip>
            </Para>
          </>
        )}
      </Para>
    )
  }

  const getStopsNotFoundRows = () => {
    let rows = []
    Object.keys(notFoundStops)?.forEach((stopName) => {
      rows.push({
        stop: stopName,
        passengers: stopsNotFoundPassengersLabel(notFoundStops[stopName]),
      })
    })

    return rows
  }

  const onNextButtonClick = () => {
    setShowUploadSummary(true)
    eventManager.send_event(events.TRANSPORT_BULKUPLOAD_POPUP_CLICKED_TFI, {
      option: 'passengers',
      action: 'next',
    })
  }

  return (
    <Modal
      header={t('bulkUploadPassengers')}
      isOpen={showModal}
      onClose={onModalClose}
      classes={{content: styles.modalContent}}
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
      actionButtons={
        showUploadSummary
          ? [
              {
                onClick: onUpdate,
                body: t('update'),
                isDisabled: !(
                  Object.keys(stopsForApi).length > 0 ||
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
                  i18nKey="nPassengersAddedInNStops"
                  values={{
                    nPassengers: getNoOfPassengers(stopsForApi),
                    nStops: Object.keys(stopsForApi).length,
                  }}
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
                    {t('duplicatePassengerEntriesDesc')}
                  </Para>
                </div>
              </div>
              <Divider
                spacing="0px"
                classes={{divider: styles.duplicatesCardDivider}}
              />
              <div className={styles.duplicateCardsWrapper}>
                {Object.keys(duplicates).map((passengerUID) => (
                  <DuplicateErrorCard
                    key={passengerUID}
                    passengerUID={passengerUID}
                  />
                ))}
              </div>
            </PlainCard>
          )}
          {Object.keys(notFoundStops).length > 0 && (
            <PlainCard className={styles.notFoundStops}>
              <div className={styles.duplicateSummary}>
                <Icon
                  name="info"
                  type={ICON_CONSTANTS.TYPES.ERROR}
                  size={ICON_CONSTANTS.SIZES.XX_SMALL}
                />
                <div>
                  <Para
                    weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
                    type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
                  >
                    {t('stopsNotFound')}
                  </Para>
                  <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
                    {t('stopsNotFoundDesc')}
                  </Para>
                </div>
              </div>
              <div className={styles.notFoundStopsTable}>
                <Table
                  rows={getStopsNotFoundRows()}
                  cols={STOPS_NOT_FOUND_TABLE_COLS}
                />
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
