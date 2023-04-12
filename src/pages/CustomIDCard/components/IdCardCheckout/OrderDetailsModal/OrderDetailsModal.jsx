import {
  Accordion,
  Avatar,
  AVATAR_CONSTANTS,
  Badges,
  BADGES_CONSTANTS,
  Heading,
  HEADING_CONSTANTS,
  Modal,
  MODAL_CONSTANTS,
  Para,
  PARA_CONSTANTS,
  PlainCard,
  TabGroup,
} from '@teachmint/krayon'
import {t} from 'i18next'
import React, {useEffect, useState} from 'react'
import {Trans} from 'react-i18next'
import styles from './OrderDetailsModal.module.css'
import {idCardAccessoriesConfigSelector} from '../../../redux/CustomId.selector'
import {events} from '../../../../../utils/EventsConstants'
import {useSelector} from 'react-redux'
import useStaffListHook from '../../../../../utils/CustomHooks/useStaffListHook'
import {PURCHASE_ORDER_STATUS as POS} from '../../../CustomId.constants'

export default function OrderDetailsModal({item, handleClose}) {
  const [directoryTabs, setDirectoryTabs] = useState([])
  const [selectedTab, setSelectedTab] = useState(directoryTabs[0]?.id)

  const {data: idConfig} = idCardAccessoriesConfigSelector()
  const eventManager = useSelector((state) => state.eventManager)

  const instituteStudentList = useSelector(
    (state) => state?.instituteStudentList
  )
  const {activeStaffList} = useStaffListHook()

  useEffect(() => {
    const directoryTabsNew = []

    if (item?.student?.iids?.length > 0)
      directoryTabsNew.push({label: t('students'), id: 'student'})
    if (item?.staff?.iids?.length > 0)
      directoryTabsNew.push({label: t('staff'), id: 'staff'})

    setDirectoryTabs(directoryTabsNew)
    setSelectedTab(directoryTabsNew[0]?.id)
  }, [item])

  const getUserToDisplay = (selectedTab) => {
    const userDetails = []

    if (selectedTab === directoryTabs[0]?.id)
      item?.student?.iids?.forEach((studentId) => {
        const student = instituteStudentList?.find(({_id}) => _id === studentId)
        userDetails.push(student)
      })
    else
      item?.staff?.iids?.forEach((staffId) => {
        const staff = activeStaffList?.find(({_id}) => _id === staffId)
        userDetails.push({...staff, enrollment_number: staff?.employee_id})
      })

    return (
      <div className={styles.listingTable}>
        <div className={styles.listingTableHeader}>
          <Para>
            {t(
              selectedTab === directoryTabs[0]?.id ? 'allStudents' : 'allstaff'
            )}
          </Para>
        </div>

        {userDetails?.map(
          ({
            _id,
            name,
            hierarchy_nodes,
            enrollment_number,
            classroom,
            img_src,
          }) => (
            <div key={_id} className={styles.userInfo}>
              <div className={styles.basicInfoWrapper}>
                <Avatar
                  name={name}
                  size={AVATAR_CONSTANTS.SIZE.MEDIUM}
                  imgSrc={img_src}
                />
                <div className={styles.basicInfo}>
                  <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>{name}</Para>
                  <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
                    {enrollment_number}
                  </Para>
                </div>
              </div>

              {(hierarchy_nodes?.length > 0 || classroom) && (
                <Badges
                  label={
                    hierarchy_nodes?.length > 0 ? hierarchy_nodes[0] : classroom
                  }
                  showIcon={false}
                  size={BADGES_CONSTANTS.SIZE.SMALL}
                />
              )}
            </div>
          )
        )}
      </div>
    )
  }

  const idCardDetails = [
    {
      label: 'IDCardType',
      value: idConfig?.card_type?.find(
        ({_id}) => _id === item?.config?.card_type_id
      )?.name,
    },
    {
      label: 'lanyardType',
      value: idConfig?.lanyard?.find(
        ({_id}) => _id === item?.config?.lanyard_id
      )?.name,
    },
    {
      label: 'logoOnLanyard',
      value: item?.config?.lanyard_logo ? (
        <a href={item?.config?.lanyard_logo} target="_blank" rel="noreferrer">
          <Para
            type={PARA_CONSTANTS.TYPE.PRIMARY}
            textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
          >
            Logo.png
          </Para>
        </a>
      ) : (
        t('na')
      ),
    },
    {label: 'textOnLanyard', value: item?.config?.lanyard_text},
    {
      label: 'lanyardColour',
      value: (
        <div className={styles.lanyardColorWrapper}>
          <div
            className={styles.lanyardColorBox}
            style={{backgroundColor: item?.config?.lanyard_color}}
          ></div>
          <Para
            textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
            type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
          >
            {item?.config?.lanyard_color}
          </Para>
        </div>
      ),
    },
    {
      label: 'cardHolderType',
      value: idConfig?.holder?.find(({_id}) => _id === item?.config?.holder_id)
        ?.name,
    },
  ]

  const addressItems = [
    {
      label: 'deliveryAddress',
      value: `${item?.delivery_address?.line_1} ${item?.delivery_address?.line_2} ${item?.delivery_address?.city} ${item?.delivery_address?.state}`,
    },
    {
      label: 'billingAddress',
      value: `${item?.billing_address?.line_1} ${item?.billing_address?.line_2} ${item?.billing_address?.city} ${item?.billing_address?.state}`,
    },
  ]

  const getStatusBadges = (statusType) => {
    switch (statusType) {
      case POS.ORDER_PROCESSING:
        return (
          <Badges
            label={t('orderProcessing')}
            type={BADGES_CONSTANTS.TYPE.WARNING}
            showIcon={false}
            size={BADGES_CONSTANTS.SIZE.SMALL}
          />
        )
      case POS.IN_PRINTING:
        return (
          <Badges
            label={t('inPrinting')}
            type={BADGES_CONSTANTS.TYPE.PRIMARY}
            showIcon={false}
            size={BADGES_CONSTANTS.SIZE.SMALL}
          />
        )
      case POS.PREPARING_FOR_DISPATCH:
        return (
          <Badges
            label={t('preparingForDispatch')}
            type={BADGES_CONSTANTS.TYPE.PRIMARY}
            showIcon={false}
            size={BADGES_CONSTANTS.SIZE.SMALL}
          />
        )
      case POS.DISPATCHED:
        return (
          <Badges
            label={t('dispatched')}
            type={BADGES_CONSTANTS.TYPE.PRIMARY}
            showIcon={false}
            size={BADGES_CONSTANTS.SIZE.SMALL}
          />
        )
      case POS.DELIVERED:
        return (
          <Badges
            label={t('delivered')}
            type={BADGES_CONSTANTS.TYPE.SUCCESS}
            showIcon={false}
            size={BADGES_CONSTANTS.SIZE.SMALL}
          />
        )
      default:
        return (
          <Badges
            label={t('cancelled')}
            type={BADGES_CONSTANTS.TYPE.ERROR}
            showIcon={false}
            size={BADGES_CONSTANTS.SIZE.SMALL}
          />
        )
    }
  }

  return (
    <Modal
      header={`${t('orderDetailsFor')} ${item?.receipt_order_id}`}
      classes={{
        modal: styles.modalWrapper,
        header: styles.modalHeader,
        content: styles.modalBody,
      }}
      isOpen={true}
      onClose={handleClose}
      actionButtons={[
        {
          onClick: () => {
            eventManager.send_event(
              events.DOWNLOAD_ID_CARD_ORDER_RECEIPT_CLICKED_TFI
            )
            window.open(item?.receipt, '_blank')
          },
          body: t('downloadReceipt'),
          prefixIcon: 'download',
        },
      ]}
      size={MODAL_CONSTANTS.SIZE.SMALL}
      shouldCloseOnOverlayClick={false}
    >
      <>
        <PlainCard className={styles.imgInfoWrapper}>
          <div className={styles.imgWrapper}>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHu4xboueuX0A9WH1cK2XOS09AHQVczC5BQw&usqp=CAU"
              alt=""
            />
          </div>
          <div className={styles.infoContent}>
            {getStatusBadges(item?.status)}
            <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>
              ID Card + Lanyard + Holder
            </Para>
            <div>
              {item?.summary?.student_price_per_set && (
                <div className={styles.infoTextWrapper}>
                  <Para
                    textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
                    type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
                  >
                    {t('student')}:
                  </Para>
                  <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
                    <Trans
                      i18nKey="qtySets"
                      values={{quantity: item?.summary?.student_no_of_sets}}
                    />
                    , ₹{item?.summary?.student_price_per_set}/Set
                  </Para>
                </div>
              )}
              {item?.summary?.staff_no_of_sets && (
                <div className={styles.infoTextWrapper}>
                  <Para
                    textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
                    type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
                  >
                    {t('staff')}:
                  </Para>
                  <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
                    <Trans
                      i18nKey="qtySets"
                      values={{quantity: item?.summary?.staff_no_of_sets}}
                    />
                    , ₹{item?.summary?.staff_price_per_set}/Set
                  </Para>
                </div>
              )}
            </div>
            <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
              ₹ {item?.summary?.total}
            </Heading>
          </div>
        </PlainCard>
        <div className="flex">
          <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
            Need help? Call us at
          </Para>
          &nbsp;
          <Para
            type={PARA_CONSTANTS.TYPE.PRIMARY}
            textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
          >
            +91 8447575553
          </Para>
        </div>
        <Accordion
          isOpen={true}
          classes={{accordionWrapper: styles.accordionWrapper}}
          headerContent={
            <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>
              {t('IDCardDetails')}
            </Para>
          }
        >
          <div className={styles.detailWrapper}>
            {idCardDetails.map(({label, value}, i) => (
              <div className={styles.detailsItem} key={i}>
                <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
                  {t(label)}:
                </Para>
                {typeof value === 'string' ? (
                  <Para
                    textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
                    type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
                  >
                    {value}
                  </Para>
                ) : (
                  value
                )}
              </div>
            ))}
            {item?.student?.url && (
              <div className={styles.detailsItem}>
                <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
                  {t('customId.studentIdCardsFile')}:
                </Para>
                {item?.student?.status === 'COMPLETED' ? (
                  <a target="_blank" rel="noreferrer" href={item.student.url}>
                    Student.pdf
                  </a>
                ) : (
                  <span>Pending</span>
                )}
              </div>
            )}
            {item?.staff?.url && (
              <div className={styles.detailsItem}>
                <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
                  {t('customId.staffIdCardsFile')}:
                </Para>
                {item?.staff?.status === 'COMPLETED' ? (
                  <a target="_blank" rel="noreferrer" href={item.staff.url}>
                    Staff.pdf
                  </a>
                ) : (
                  <span>Pending</span>
                )}
              </div>
            )}
          </div>
        </Accordion>

        <div>
          {addressItems.map(({label, value}, i) => (
            <div className={styles.addressItem} key={i}>
              <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
                {t(label)}
              </Heading>
              <Para>{value}</Para>
            </div>
          ))}
        </div>

        <div className={styles.listing}>
          <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
            {t('idCardDetaislStudentListHeading')}
          </Heading>

          <div className={styles.tabGroupWrapper}>
            <TabGroup
              tabOptions={directoryTabs}
              onTabClick={(tab) => setSelectedTab(tab?.id)}
              selectedTab={selectedTab}
              showMoreTab={false}
            />
          </div>

          {getUserToDisplay(selectedTab)}
        </div>
      </>
    </Modal>
  )
}
