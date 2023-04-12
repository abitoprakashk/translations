import {
  Heading,
  HEADING_CONSTANTS,
  Icon,
  IconFrame,
  ICON_CONSTANTS,
  ICON_FRAME_CONSTANTS,
  Para,
  PlainCard,
} from '@teachmint/krayon'
import {t} from 'i18next'
import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useRouteMatch} from 'react-router-dom'
import history from '../../../../history'
import {showLoadingAction} from '../../../../redux/actions/commonAction'
import {events} from '../../../../utils/EventsConstants'
import SectionOverviewCard from '../../../StudentManagement/components/SectionOverviewCard/SectionOverviewCard'
import {SINGLE_STUDENT_ISSUED_ITEMS_ROUTE} from '../../../StudentManagement/pages/SingleStudentPageRouting/SingleStudentPageRouting'
import {
  studentWiseBooksList,
  studentWiseItemsList,
} from '../../pages/Overview/apiServices'
import styles from './StudentIssuedItemsCard.module.css'

export default function StudentIssuedItemsCard({
  currentStudent,
  hasInventoryPermission,
  hasLibraryPermission,
}) {
  const [inventoryItemsData, setInventoryItemsData] = useState(null)
  const [libraryBooksData, setLibraryBooksData] = useState(null)

  let {url} = useRouteMatch()
  const dispatch = useDispatch()
  const eventManager = useSelector((state) => state.eventManager)

  useEffect(() => {
    if (currentStudent?._id) {
      getInventoryItemsData(currentStudent?._id)
      getLibraryBooksData(currentStudent?._id)
    }
  }, [currentStudent])

  const getInventoryItemsData = (studentId) => {
    dispatch(showLoadingAction(true))
    studentWiseItemsList({iid: studentId})
      .then(({obj}) => setInventoryItemsData(obj))
      .catch(() => {})
      .finally(() => dispatch(showLoadingAction(false)))
  }

  const getLibraryBooksData = (studentId) => {
    dispatch(showLoadingAction(true))
    studentWiseBooksList({iid: studentId})
      .then(({obj}) => setLibraryBooksData(obj))
      .catch(() => {})
      .finally(() => dispatch(showLoadingAction(false)))
  }

  const overviewItems = []
  if (hasInventoryPermission)
    overviewItems.push({
      id: 'inventory',
      icon: 'inventory',
      label: 'inventoryItems',
      value: inventoryItemsData?.total_units || 0,
    })
  if (hasLibraryPermission)
    overviewItems.push({
      id: 'library',
      icon: 'menuBook',
      label: 'libraryBooks',
      value: libraryBooksData?.total || 0,
    })

  return (
    <SectionOverviewCard
      cardLabel={t('issuedItems')}
      icon="viewList"
      actionLabel={t('view')}
      actionHandle={() => {
        eventManager.send_event(events.SIS_VIEW_ISSUED_ITEMS_CLICKED_TFI)
        history.push(`${url}${SINGLE_STUDENT_ISSUED_ITEMS_ROUTE}`)
      }}
      actionShowInMobile={false}
      classes={{header: styles.header, iconFrame: styles.iconFrame}}
    >
      <div className={styles.body}>
        {overviewItems?.map(({id, label, value, icon}) => (
          <PlainCard key={id} className={styles.overviewItem}>
            <IconFrame
              className={styles.overviewItemIconFrame}
              size={ICON_FRAME_CONSTANTS.SIZES.MEDIUM}
            >
              <Icon name={icon} size={ICON_CONSTANTS.SIZES.X_SMALL} />
            </IconFrame>
            <div>
              <Heading
                type={id === 'status' ? HEADING_CONSTANTS.TYPE.SUCCESS : ''}
                textSize={HEADING_CONSTANTS.TEXT_SIZE.SMALL}
                className={styles.overviewItemValue}
              >
                {value}
              </Heading>
              <Para>{t(label)}</Para>
            </div>
          </PlainCard>
        ))}
      </div>
    </SectionOverviewCard>
  )
}
