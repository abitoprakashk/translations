import React, {useEffect, useState} from 'react'
import {Modal} from '@teachmint/krayon'
import {ErrorBoundary} from '@teachmint/common'
import styles from './FeeUpdateHistoryModal.module.css'
import classNames from 'classnames'
import DateUserInfo from './DateUserInfo/DateUserInfo'
import DateWiseHistory from './DateWiseHistory/DateWiseHistory'
import {useDispatch, useSelector} from 'react-redux'
import {FEE_TAB_ACTION_TYPES} from '../../../../redux/feeAndWallet/actionTypes'
import {useTranslation} from 'react-i18next'
import NoDataComp from '../../NoDataComp/NoDataComp'
import FeeUpdateHistorySkeleton from '../../../skeletons/FeeUpdateHistorySkeleton/FeeUpdateHistorySkeleton'

export default function FeeUpdateHistoryModal({
  isOpen = false,
  setIsOpen = () => {},
  studentId = null,
}) {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const {data, isDataFetching} = useSelector(
    (state) => state.studentProfileFeeAndWalletTab.feeTab.feeUpdateHistory
  )
  const [selectedRecord, setSelectedRecord] = useState(null)

  useEffect(() => {
    dispatch({
      type: FEE_TAB_ACTION_TYPES.FEE_UPDATE_HISTORY_REQUEST,
      payload: {studentId},
    })
  }, [])

  useEffect(() => {
    if (data && !selectedRecord && data.length > 0) {
      setSelectedRecord(data[0])
    }
  }, [data])

  const handleRecordClick = (id) => {
    let selectedDetail = data.find((item) => item.id === id)
    setSelectedRecord(selectedDetail)
  }

  return (
    <ErrorBoundary>
      <div>
        <Modal
          isOpen={isOpen}
          header={t('updateHistory')}
          onClose={() => setIsOpen(!isOpen)}
          size="l"
        >
          <div className={styles.contentSection}>
            <div
              className={classNames(
                styles.contentSectionBorder,
                styles.height56vh
              )}
            >
              {isDataFetching ? (
                <FeeUpdateHistorySkeleton />
              ) : (
                <>
                  {!selectedRecord ? (
                    <NoDataComp msg={t('noUpdateHistoryFound')} />
                  ) : (
                    <>
                      <div
                        className={classNames(
                          styles.lastChildBorderNone,
                          styles.height56vh
                        )}
                      >
                        {data.map((item) => (
                          <DateUserInfo
                            isActive={
                              item?.id == selectedRecord?.id ? true : false
                            }
                            key={item?.id}
                            item={item}
                            alterant_name={selectedRecord?.alterant_name ?? '-'}
                            handleRecordClick={handleRecordClick}
                          />
                        ))}
                      </div>
                      <div
                        className={classNames(
                          styles.height56vh,
                          styles.flex1,
                          styles.borderLeft
                        )}
                      >
                        <DateWiseHistory selectedRecord={selectedRecord} />
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </Modal>
      </div>
    </ErrorBoundary>
  )
}
