import React from 'react'
import styles from './SearchBox.module.css'
import {
  _stringToHslColor,
  _displayInitials,
  getAmountFixDecimalWithCurrency,
  truncateTextWithTooltip,
} from '../../../../../../utils/Helpers'
import {
  EmptyState,
  Heading,
  HEADING_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
} from '@teachmint/krayon'
import {useSelector} from 'react-redux'
import {t} from 'i18next'
import {ErrorBoundary} from '@teachmint/common'
import {CLASSNAME_TRUNCATE_LIMIT_MOBILE} from '../../../../fees.constants'

export default function SearchResultsContainerMobile({
  searchResults,
  handleCollectFeeClick,
  studentListObj,
}) {
  const instituteInfo = useSelector((state) => state.instituteInfo)

  return (
    <ErrorBoundary>
      <div className={styles.searchResultsContainerMobileSection}>
        {searchResults.length === 0 && (
          <div className={styles.studentListEmptyState}>
            <EmptyState
              button={false}
              iconName={'students'}
              content={t('noStudentInSection')}
            />
          </div>
        )}

        {searchResults.length !== 0 &&
          searchResults.map((s, i) => {
            let student = studentListObj[s.Id] || null
            return (
              <div
                key={i}
                className={styles.searchResultsContainerMobile}
                onClick={() => handleCollectFeeClick(s.Id)}
              >
                <div
                  className={styles.studentAvatar}
                  style={{
                    backgroundColor: _stringToHslColor(student?.full_name),
                  }}
                >
                  {_displayInitials(student?.full_name)}
                </div>
                <div className={styles.searchResultsContainerProfileDetails}>
                  <div className={styles.searchResultsContainerPersonalDetail}>
                    <div className={styles.searchResultsContainerName}>
                      <span
                        className={styles.searchResultsContainerStudentName}
                      >
                        {student?.full_name}
                      </span>
                      <Icon
                        name="forwardArrow"
                        size={ICON_CONSTANTS.SIZES.XX_SMALL}
                        type={ICON_CONSTANTS.TYPES.DEFAULT}
                      />
                    </div>
                    {s.phoneNumber && (
                      <div className={styles.searchResultsContainerDetails}>
                        <Icon
                          name="phone"
                          size={ICON_CONSTANTS.SIZES.XX_SMALL}
                          type={ICON_CONSTANTS.TYPES.SECONDARY}
                        />
                        <span>{s.phoneNumber}</span>
                      </div>
                    )}
                    <div className={styles.searchResultsContainerDetails}>
                      {s.enrollmentNumber && (
                        <span>
                          {t('studentEnrolmentID', {
                            enrollmentNumber: s.enrollmentNumber,
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={styles.searchResultsContainerStats}>
                    <div className={styles.searchResultsContainerStatInfo}>
                      <span>{t('class')}</span>
                      <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
                        {truncateTextWithTooltip(
                          `${s.class || 'Unassigned'} ${s.section}`,
                          CLASSNAME_TRUNCATE_LIMIT_MOBILE
                        )}
                      </Heading>
                    </div>
                    <div className={styles.searchResultsContainerStatInfo}>
                      <span>{t('paid')}</span>
                      <Heading
                        type={HEADING_CONSTANTS.TYPE.SUCCESS}
                        textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}
                      >
                        {getAmountFixDecimalWithCurrency(
                          s.totalPaid || s.paid || 0,
                          instituteInfo.currency
                        )}
                      </Heading>
                    </div>
                    <div className={styles.searchResultsContainerStatInfo}>
                      <span>{t('totalDue')}</span>
                      <Heading
                        type={HEADING_CONSTANTS.TYPE.ERROR}
                        textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}
                      >
                        {getAmountFixDecimalWithCurrency(
                          s.totalDue || s.due || 0,
                          instituteInfo.currency
                        )}
                      </Heading>
                    </div>
                  </div>
                  <div className={styles.searchResultsContainerParentDetails}>
                    <span
                      className={
                        styles.searchResultsContainerParentDetailsTitle
                      }
                    >
                      {t('parentDetails')}
                    </span>
                    <span
                      className={styles.searchResultsContainerParentDetailsName}
                    >
                      {student?.father_name || '--'},{' '}
                      {student?.father_contact_number || '--'}
                    </span>
                    <span
                      className={styles.searchResultsContainerParentDetailsName}
                    >
                      {student?.mother_name || '--'},{' '}
                      {student?.mother_contact_number || '--'}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
      </div>
    </ErrorBoundary>
  )
}
