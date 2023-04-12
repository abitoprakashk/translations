import {VirtualizedLazyList} from '@teachmint/common'
import {
  Button,
  BUTTON_CONSTANTS,
  EmptyState,
  Icon,
  ICON_CONSTANTS,
  Modal,
  MODAL_CONSTANTS,
} from '@teachmint/krayon'
import classNames from 'classnames'
import {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import Loader from '../../../../../../../components/Common/Loader/Loader'
import {getAutomatedMessages} from '../../../../../redux/actions/schedulerActions'
import Message from './Message/Message'
import {ReceiversList} from './ReceiversList/ReceiversList'
import styles from './SendMessages.module.css'

function SendMessages({toggleModal, rule}) {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const sendMessages = useSelector(
    (state) => state.communicationInfo.scheduler.sendMessages?.[rule._id]
  )

  const isLoading = useSelector(
    (state) => state.communicationInfo.scheduler.loadingInfo.messages
  )

  const [selectedMessage, setSelectedMessage] = useState(null)

  useEffect(() => {
    dispatch(getAutomatedMessages({rule_id: rule._id}))
  }, [])

  if (isLoading) {
    return <Loader show />
  }

  const content = !sendMessages?.length ? (
    <EmptyState iconName="chat1" content={t('noMessagesSent')} button={null} />
  ) : (
    <div className={styles.vListWrapper}>
      <VirtualizedLazyList
        itemCount={sendMessages.length}
        rowsData={sendMessages}
        loadMoreItems={() => {}}
        RowJSX={({item}) => (
          <Message
            key={item._id}
            post={item}
            onSelect={(tab) => setSelectedMessage({id: item._id, tab})}
          />
        )}
        dynamicSize={true}
        loadMorePlaceholder={<div className="loader" />}
        showLoadMorePlaceholder={false}
      />
    </div>
  )

  return (
    <Modal
      size={MODAL_CONSTANTS.SIZE.LARGE}
      isOpen
      onClose={toggleModal}
      header={
        selectedMessage
          ? t('listOfReceivers')
          : t('ruleMessageSent', {rule: capitalize(rule.name)})
      }
      actionButtons={[
        {
          body: <div className={styles.dismissBtn}>{t('dismiss')}</div>,
          onClick: toggleModal,
        },
      ]}
      footerLeftElement={
        selectedMessage && (
          <Button
            type={BUTTON_CONSTANTS.TYPE.TEXT}
            prefixIcon={
              <Icon
                name="arrowBackIos"
                size={ICON_CONSTANTS.SIZES.XXXX_SMALL}
                type={ICON_CONSTANTS.TYPES.PRIMARY}
                version={ICON_CONSTANTS.VERSION.FILLED}
                className={styles.prefixIconBtn}
              />
            }
            onClick={() => setSelectedMessage(null)}
          >
            {t('backToAllMessages')}
          </Button>
        )
      }
    >
      <div
        className={classNames(styles.container, {
          [styles.emptyContainer]: !sendMessages?.length,
        })}
      >
        {selectedMessage ? (
          <ReceiversList
            selectedMessage={selectedMessage}
            setSelectedMessage={setSelectedMessage}
          />
        ) : (
          content
        )}
      </div>
    </Modal>
  )
}

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)

export default SendMessages
