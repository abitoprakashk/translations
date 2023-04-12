import React, {useEffect} from 'react'
import styles from './FeeTab.module.css'
import InstalmentWiseDetails from './components/InstalmentWiseDetails/InstalmentWiseDetails'
import Summary from './components/Summary/Summary'
import {useFeeStructure} from '../../../../pages/fee/redux/feeStructure/feeStructureSelectors'
import {useDispatch, useSelector} from 'react-redux'
import {fetchFeeCategoriesRequestedAction} from '../../../../pages/fee/redux/feeStructure/feeStructureActions'
import {ErrorBoundary} from '@teachmint/common'
import CollectFeeModal from '../../../../pages/fee/components/FeeCollection/components/CollectFeeModal/CollectFeeModal'
import {
  getStudentProfileFeeTabDetailsRequestAction,
  setFeeCollectSliderScreen,
} from '../redux/feeAndWallet/actions'
import {useFeeCollection} from '../../../../pages/fee/redux/feeCollectionSelectors'
import ReceiptPreviewModal from '../../../../pages/fee/components/ReceiptPreviewModal/ReceiptPreviewModal'

export default function FeeTab({
  studentId = null,
  sendClickEvents = () => {},
  handleSetSliderScreen,
}) {
  const {feeTypes} = useFeeStructure()
  const dispatch = useDispatch()
  const {collectFeeSlider} = useSelector(
    (state) => state.studentProfileFeeAndWalletTab.feeTab
  )
  const {isDataFetching} = useSelector(
    (state) => state.studentProfileFeeAndWalletTab.feeTab
  )
  const {recordPaymentDetails, submitFees} = useFeeCollection()

  useEffect(() => {
    if (feeTypes?.length === 0) {
      dispatch(fetchFeeCategoriesRequestedAction())
    }
  }, [feeTypes])

  useEffect(() => {
    if (!isDataFetching) {
      dispatch(getStudentProfileFeeTabDetailsRequestAction(studentId))
    }
  }, [])

  const handleFeeCollectSliderClose = (isOpen = false) => {
    dispatch(setFeeCollectSliderScreen(isOpen))
    dispatch(getStudentProfileFeeTabDetailsRequestAction(studentId))
  }

  return (
    <>
      {collectFeeSlider?.isOpen && (
        <CollectFeeModal
          setShowCollectFeeModal={handleFeeCollectSliderClose}
          studentId={collectFeeSlider?.sliderData?.studentId}
          classId={collectFeeSlider?.sliderData?.classId}
        />
      )}

      {recordPaymentDetails?.isPopupOpen && (
        <ReceiptPreviewModal
          isOpen={recordPaymentDetails?.isPopupOpen}
          recordPaymentDetails={recordPaymentDetails}
          receiptIds={submitFees?.receipts}
          submitFees={submitFees}
          handleSetSliderScreen={handleSetSliderScreen}
        />
      )}

      <div className={styles.section}>
        <ErrorBoundary>
          <Summary
            studentId={studentId}
            isDataFetching={isDataFetching}
            sendClickEvents={sendClickEvents}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <InstalmentWiseDetails
            studentId={studentId}
            isDataFetching={isDataFetching}
            sendClickEvents={sendClickEvents}
          />
        </ErrorBoundary>
      </div>
    </>
  )
}
