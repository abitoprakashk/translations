import styles from './SectionWiseStudentsMobile.module.css'
import classNames from 'classnames'
import {EmptyState, Input, Breadcrumb} from '@teachmint/krayon'
import {useFeeCollection} from '../../../../redux/feeCollectionSelectors'
import StudentDetailsShimmer from '../StudentDetailsShimmer/StudentDetailsShimmer'
import SearchResultsContainerMobile from '../SearchBox/SearchResultsContainerMobile'
import {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {ErrorBoundary} from '@teachmint/common'
import {TYPING_PLACEHOLDER} from '../../../../fees.constants'
import SectionCardMobile from './SectionCardMobile'

export default function SectionWiseStudentsMobile({
  studentsData,
  sections,
  selectedSection,
  setSelectedSection,
  handleCollectFeeClick,
  studentListObj,
}) {
  const {t} = useTranslation()
  const {studentDuesLoading} = useFeeCollection()
  const [search, setSearch] = useState('')
  const selectedSectionName = sections.find(
    (section) => section.id == selectedSection
  )?.name

  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const placeholderValue =
    TYPING_PLACEHOLDER.PLACEHOLDER_VALUES[placeholderIndex]

  const [typingIndex, setTypingIndex] = useState(0)
  const [typingComplete, setTypingComplete] = useState(false)

  useEffect(() => {
    if (typingComplete) {
      const eraseTimeout = setTimeout(() => {
        const eraseInterval = setInterval(() => {
          setTypingIndex((prevIndex) => {
            if (prevIndex > 0) {
              return prevIndex - 1
            } else {
              clearInterval(eraseInterval)
              setTypingComplete(false)
              setTypingIndex(0)
              setPlaceholderIndex(
                (prevIndex) =>
                  (prevIndex + 1) % TYPING_PLACEHOLDER.PLACEHOLDER_VALUES.length
              )
              return prevIndex
            }
          })
        }, TYPING_PLACEHOLDER.ERASE_INTERVAL_TIME)
        return () => clearInterval(eraseInterval)
      }, TYPING_PLACEHOLDER.DELAY_TIME)
      return () => clearTimeout(eraseTimeout)
    }
  }, [typingComplete])

  useEffect(() => {
    if (!typingComplete) {
      const typingInterval = setInterval(() => {
        setTypingIndex((prevIndex) => {
          if (prevIndex < placeholderValue?.length) {
            return prevIndex + 1
          } else {
            setTypingComplete(true)
            clearInterval(typingInterval)
            return prevIndex
          }
        })
      }, TYPING_PLACEHOLDER.TYPING_INTERVAL_TIME)

      return () => clearInterval(typingInterval)
    }
  }, [placeholderValue, typingComplete])

  const typingPlaceholderValue = `${t('searchBy')} ${placeholderValue?.slice(
    0,
    typingIndex
  )}${typingComplete ? '|' : ''}`

  return (
    <ErrorBoundary>
      <div className={styles.content}>
        <div className={styles.classesContainer}>
          {selectedSection && (
            <Breadcrumb
              paths={[
                {
                  label: t('FEE_COLLECTION'),
                  onClick: () => setSelectedSection(''),
                },
                {
                  label: selectedSectionName,
                },
              ]}
            />
          )}
          {selectedSection == '' && (
            <div
              className={classNames(
                styles.sectionList,
                'show-scrollbar show-scrollbar-small'
              )}
            >
              {sections.map((section, i) => {
                return <SectionCardMobile key={i} section={section} />
              })}
            </div>
          )}
          {studentDuesLoading && (
            <div className={styles.studentDetailsShimmerWrapper}>
              <StudentDetailsShimmer />
              <StudentDetailsShimmer />
              <StudentDetailsShimmer />
            </div>
          )}
          {selectedSection &&
            !studentDuesLoading &&
            studentsData.length == 0 && (
              <div className={styles.studentListEmptyState}>
                <EmptyState
                  button={false}
                  iconName={'students'}
                  content={t('noStudentInSection')}
                />
              </div>
            )}
          {selectedSection &&
            !studentDuesLoading &&
            studentsData.length > 0 && (
              <div className={styles.studentslistWrapper}>
                <div className={styles.sectionSearchBox}>
                  <Input
                    value={search}
                    fieldName="textField"
                    onChange={(e) => setSearch(e.value)}
                    placeholder={typingPlaceholderValue}
                    type="text"
                  />
                </div>
                <SearchResultsContainerMobile
                  searchResults={studentsData.filter((s) =>
                    search
                      ? (
                          s?.name +
                          '' +
                          s?.fatherName +
                          '' +
                          s?.motherName +
                          '' +
                          s?.fatherContactNumber +
                          '' +
                          s?.motherContactNumber +
                          '' +
                          s?.enrollmentNumber +
                          '' +
                          s?.phoneNumber +
                          '' +
                          s?.email
                        )
                          .toLowerCase()
                          .includes(search.toLowerCase())
                      : true
                  )}
                  handleCollectFeeClick={handleCollectFeeClick}
                  studentListObj={studentListObj}
                />
              </div>
            )}
        </div>
      </div>
    </ErrorBoundary>
  )
}
