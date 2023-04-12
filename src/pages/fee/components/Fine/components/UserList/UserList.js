import React, {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import styles from './UserList.module.css'
import {Table} from '@teachmint/common'
import {useTranslation} from 'react-i18next'
import SearchBar from '../../../tfi-common/SearchBar/SearchBar'
import {useFeeFineSelector} from '../../redux/FeeFineSelectors'
import EmptyList from '../EmptyList/EmptyList'
import UserProfile from '../../../../../../components/Common/UserProfile/UserProfile'
import {getStudentDetails} from '../../../../helpers/helpers'
import {FINED_USER_LIST_TABLE_COLS} from '../../FineConstant'
import {useEffect} from 'react'
import {fetchFeeFinedStudentListAction} from '../../redux/FineActions'
import {setSliderScreenAction} from '../../../../redux/feeTransactionActions'
import {SliderScreens} from '../../../../fees.constants'
import {
  getAmountFixDecimalWithCurrency,
  numDifferentiation,
} from '../../../../../../utils/Helpers'
import HistorySection from '../../../../components/FeeHistory/HistorySection'
import classNames from 'classnames'

export default function UserList() {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const {finedUserResponse, finedUserResponseloader} = useFeeFineSelector()
  const {
    students: finedUsersList = [],
    applied = 0,
    paid = 0,
    due = 0,
  } = finedUserResponse
  const studentsList = useSelector((state) => state.instituteStudentList)
  const {instituteInfo} = useSelector((state) => state)
  const [searchTerm, setSearchTerms] = useState('')

  useEffect(() => {
    dispatch(fetchFeeFinedStudentListAction())
  }, [])

  const handleSearchTerm = (value) => {
    setSearchTerms(value)
  }

  const handleNameClick = (studentInfo) => {
    dispatch(
      setSliderScreenAction(SliderScreens.STUDENT_DETAILS_SLIDER, {
        Id: studentInfo?._id,
        name: studentInfo?.name,
        phoneNumber: studentInfo?.phone_number,
        enrollmentNumber: studentInfo?.enrollment_number,
        email: studentInfo?.email,
        selectedSliderTab: 'FEE_HISTORY',
      })
    )
  }

  if (finedUserResponseloader) {
    return <div className="loading"></div>
  }

  if (finedUsersList.length === 0) {
    return <EmptyList />
  }

  const getFinedUserslist = () => {
    return finedUsersList.length === 0
      ? [
          {
            studentDetails: '',
            class: '',
            applied: t('noDataFound'),
            paid: '',
            due: '',
            waivedOff: '',
          },
        ]
      : finedUsersList
          .filter((row) => {
            if (searchTerm) {
              const student = getStudentDetails(studentsList, row._id)
              return !student
                ? false
                : student?.name
                    ?.toLowerCase()
                    ?.includes(searchTerm.toLowerCase()) ||
                    student?.phone_number?.includes(searchTerm) ||
                    student?.enrollment_number?.includes(searchTerm) ||
                    student?.email?.includes(searchTerm.toLowerCase())
            }
            return true
          })
          .reverse()
          .map((row) => {
            let studentInfo = getStudentDetails(studentsList, row._id)
            return {
              studentDetails: (
                <div className={styles.studentDetailsSection}>
                  {studentInfo ? (
                    <>
                      <UserProfile
                        handleChange={() => handleNameClick(studentInfo)}
                        name={studentInfo.name ?? '-'}
                        phoneNumber={
                          studentInfo?.enrollment_number ||
                          studentInfo?.phone_number ||
                          studentInfo?.email
                        }
                        image={studentInfo.img_url}
                      />
                    </>
                  ) : (
                    '-'
                  )}
                </div>
              ),
              class: studentInfo ? studentInfo?.classroom : '-',
              applied: (
                <span className={styles.appliedAmountText}>
                  {getAmountFixDecimalWithCurrency(
                    row.applied,
                    instituteInfo.currency
                  )}
                </span>
              ),
              paid: (
                <span className={styles.paidAmountText}>
                  {getAmountFixDecimalWithCurrency(
                    row.paid,
                    instituteInfo.currency
                  )}
                </span>
              ),
              due: (
                <span className={styles.dueAmountText}>
                  {getAmountFixDecimalWithCurrency(
                    row.due,
                    instituteInfo.currency
                  )}
                </span>
              ),
            }
          })
  }

  const fineStats = [
    {
      label: t('totalApplied'),
      amount: applied
        ? numDifferentiation(applied, instituteInfo.currency)
        : numDifferentiation(0, instituteInfo.currency),
      value: applied
        ? getAmountFixDecimalWithCurrency(applied, instituteInfo.currency)
        : getAmountFixDecimalWithCurrency(0, instituteInfo.currency),
      className: styles.payableAmount,
    },
    {
      label: t('collected'),
      amount: paid
        ? numDifferentiation(paid, instituteInfo.currency)
        : numDifferentiation(0, instituteInfo.currency),
      value: paid
        ? getAmountFixDecimalWithCurrency(paid, instituteInfo.currency)
        : getAmountFixDecimalWithCurrency(0, instituteInfo.currency),
      className: styles.paidAmount,
    },
    {
      label: t('due'),
      amount: due
        ? numDifferentiation(due, instituteInfo.currency)
        : numDifferentiation(0, instituteInfo.currency),
      value: due
        ? getAmountFixDecimalWithCurrency(due, instituteInfo.currency)
        : getAmountFixDecimalWithCurrency(0, instituteInfo.currency),
      className: styles.dueAmount,
    },
  ]

  return (
    <>
      <div className={styles.fineDetails}>
        {fineStats.map((detail, i) => {
          return <HistorySection key={i} feeDetail={detail} />
        })}
      </div>
      <div className={classNames(styles.section)}>
        <div className={styles.headerSection}>
          <div>
            {/* ========== FOR NEXT RELEASE ========== */}
            {/* <Button size="medium" className={styles.addFilterBtn}>
              <Icon color="primary" name={'filter'} size="xs" type="outlined" />
              {t('addFilters')}
            </Button> */}
          </div>
          <div className={styles.searchBarWrapper}>
            <SearchBar
              onChange={handleSearchTerm}
              placeholder={t('searchPlaceholder')}
              inputValue={searchTerm}
              wrapperClassName={styles.searchBarWrapper}
            />
          </div>
        </div>

        <Table rows={getFinedUserslist()} cols={FINED_USER_LIST_TABLE_COLS} />
      </div>
    </>
  )
}
