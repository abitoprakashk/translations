import styles from '../../FeesPage/FeesCollectionPage.module.css'
import SliderStudentDetail from '../../../../../components/SchoolSystem/StudentDirectory/SliderStudentDetail'
import CollectFeeModal from '../../FeeCollection/components/CollectFeeModal/CollectFeeModal'
import Header from '../../FeeCollection/components/Header/Header'
import SearchBox from '../../FeeCollection/components/SearchBox/SearchBox'
import SectionWiseStudents from '../../FeeCollection/components/SectionWiseStudents/SectionWiseStudents'
import ReceiptPreviewModal from '../../ReceiptPreviewModal/ReceiptPreviewModal'
import {useFeeCollectionContext} from './FeeCollectionContext'
import {SliderScreens} from '../../../fees.constants'
import SectionWiseStudentsMobile from '../../FeeCollection/components/SectionWiseStudentsMobile/SectionWiseStudentsMobile'
import FeeCollectionOverview from '../../FeeCollection/components/FeeCollectionOverview/FeeCollectionOverview'
import {ErrorBoundary} from '@teachmint/common'

export default function FeeCollectionContextComponent() {
  const {
    isShowClasses,
    searchValue,
    sliderScreen,
    sliderData,
    setSliderScreen,
    showCollectFeeModal,
    classId,
    selectedStudentId,
    setShowCollectFeeModal,
    setSearchValue,
    isSearchFieldClicked,
    setIsSearchFieldClicked,
    setIsShowClasses,
    handleCollectFeeClick,
    studentListObj,
    recordPaymentDetails,
    submitFees,
    isMobile,
    selectedSection,
    setSelectedSection,
    studentsData,
    sections,
    feeStatistics,
    sendClickEvent,
    studentsDataLoder,
  } = useFeeCollectionContext()

  return (
    <div className={styles.container}>
      {isMobile && selectedSection ? null : (
        <Header sendClickEvent={sendClickEvent} />
      )}
      {isMobile && selectedSection ? null : (
        <div className={styles.parent}>
          <div className={styles.content}>
            <SearchBox
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              isSearchFieldClicked={isSearchFieldClicked}
              setIsSearchFieldClicked={setIsSearchFieldClicked}
              isShowClasses={isShowClasses}
              setIsShowClasses={setIsShowClasses}
              handleCollectFeeClick={handleCollectFeeClick}
              studentListObj={studentListObj}
              sendClickEvent={sendClickEvent}
              feeStatistics={feeStatistics}
            />
          </div>
          {isShowClasses || searchValue ? null : (
            <FeeCollectionOverview feeStatistics={feeStatistics} />
          )}
        </div>
      )}
      {isShowClasses && !searchValue && !isMobile && (
        <SectionWiseStudents
          studentsData={studentsData}
          sections={sections}
          selectedSection={selectedSection}
          handleCollectFeeClick={handleCollectFeeClick}
          sendClickEvent={sendClickEvent}
          studentsDataLoder={studentsDataLoder}
        />
      )}
      {isShowClasses && !searchValue && isMobile && (
        <ErrorBoundary>
          <SectionWiseStudentsMobile
            studentsData={studentsData}
            sections={sections}
            selectedSection={selectedSection}
            setSelectedSection={setSelectedSection}
            handleCollectFeeClick={handleCollectFeeClick}
            studentListObj={studentListObj}
            studentsDataLoder={studentsDataLoder}
          />
        </ErrorBoundary>
      )}
      {sliderScreen === SliderScreens.STUDENT_DETAILS_SLIDER && sliderData && (
        <SliderStudentDetail
          setSliderScreen={setSliderScreen}
          phoneNumber={sliderData.phoneNumber}
          studentId={sliderData.Id}
          localLoader={false}
          width={'870'}
          selectedSliderTab={sliderData.selectedSliderTab}
        />
      )}
      {showCollectFeeModal && (
        <CollectFeeModal
          studentId={selectedStudentId}
          classId={classId}
          setShowCollectFeeModal={setShowCollectFeeModal}
        />
      )}
      {recordPaymentDetails?.isPopupOpen && (
        <ReceiptPreviewModal
          isOpen={recordPaymentDetails?.isPopupOpen}
          recordPaymentDetails={recordPaymentDetails}
          receiptIds={submitFees?.receipts}
          submitFees={submitFees}
        />
      )}
    </div>
  )
}
