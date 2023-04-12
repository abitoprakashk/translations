import React, {useEffect, useState} from 'react'
import OverviewCard from './Card'
import {t} from 'i18next'
import styles from './OverviewSection.module.css'
import {useDispatch, useSelector} from 'react-redux'
import globalActions from '../../../../../../redux/actions/global.actions'
import {formatCurrencyToCountry} from '../../../../../../utils/Helpers'

export default function OverviewSection() {
  const dispatch = useDispatch()
  const orgOverviewDetails = useSelector(
    (state) => state.globalData.orgOverviewDetails?.data
  )

  const [totalSchools, setTotalSchools] = useState(0)
  const [totalOwners, setTotalOwners] = useState(0)
  const [totalTeachers, setTotalTeachers] = useState(0)
  const [totalStudents, setTotalStudents] = useState(0)
  const [totalNonTeachingStaff, setTotalNonTeachingStaff] = useState(0)

  useEffect(() => {
    //call overview api for data
    dispatch(globalActions?.getOrgOverviewDetails?.request())
  }, [])

  useEffect(() => {
    if (orgOverviewDetails?.length > 0) {
      let parsedData = orgOverviewDetails.reduce((aggregated, data) => {
        return {
          no_of_owners: (aggregated?.no_of_owners || 0) + data?.no_of_owners,
          no_of_students:
            (aggregated?.no_of_students || 0) + data?.no_of_students,
          no_of_teachers:
            (aggregated?.no_of_teachers || 0) + data?.no_of_teachers,
          no_of_non_teaching_staff:
            (aggregated?.no_of_non_teaching_staff || 0) +
            data?.no_of_non_teaching_staff,
        }
      }, {})

      setTotalSchools(orgOverviewDetails.length)
      setTotalOwners(parsedData.no_of_owners)
      setTotalStudents(parsedData.no_of_students)
      setTotalTeachers(parsedData.no_of_teachers)
      setTotalNonTeachingStaff(parsedData.no_of_non_teaching_staff)
    }
  }, [orgOverviewDetails])

  const cardsData = [
    {
      iconName: 'locationCity',
      text: t('schools'),
      value: formatCurrencyToCountry(totalSchools || 0),
      className: styles.schools,
    },
    {
      iconName: 'accountCircle',
      text: t('owner'),
      value: formatCurrencyToCountry(totalOwners || 0),
      className: styles.owner,
    },
    {
      iconName: 'schoolCap',
      text: t('students'),
      value: formatCurrencyToCountry(totalStudents || 0),
      className: styles.students,
    },
    {
      iconName: 'people',
      text: t('teachers'),
      value: formatCurrencyToCountry(totalTeachers || 0),
      className: styles.teachers,
    },
    {
      iconName: 'work',
      text: t('nonTeachingStaffs'),
      value: formatCurrencyToCountry(totalNonTeachingStaff || 0),
      className: styles.nonTeachingStaffs,
    },
  ]

  return (
    <div className={styles.wrapper}>
      {cardsData.map((card, index) => {
        return <OverviewCard {...card} key={`${index}${card.value}`} />
      })}
    </div>
  )
}
