import {Alert} from '@teachmint/krayon'
import React from 'react'
import styles from './RemainingStudentsBanner.module.css'
import {getActiveStudents} from '../../../redux/reducers/CommonSelectors'

function remaining_students(subscriptionData) {
  const total = parseInt(subscriptionData.lms_order_form_students)
  const signed_up = parseInt(subscriptionData.institute_signin_student)
  const canAdd = Math.max(0, total - signed_up)
  return canAdd
}

function joined_students_percentage(subscriptionData) {
  const total = parseInt(subscriptionData.lms_order_form_students)
  const signed_up = parseInt(subscriptionData.institute_signin_student)
  return (signed_up * 100.0) / total
}

function remaining_students_content(subscriptionData) {
  const canAdd = remaining_students(subscriptionData)
  return canAdd != 0
    ? `You can only add ${canAdd} more ${
        canAdd === 1 ? 'student' : 'students'
      } to your institute. ${
        subscriptionData.institute_signin_student
      } out of ${subscriptionData.lms_order_form_students} already added.`
    : `You can't add anymore students.`
}

function RemainingStudentsBanner(props) {
  const instituteStudentList = getActiveStudents(true)
  const subscriptionData = props.content
  subscriptionData.obj.institute_signin_student = instituteStudentList.length
  return (
    <>
      <Alert
        content={remaining_students_content(subscriptionData.obj)}
        hideClose={true}
        className={styles.alert}
        type={
          joined_students_percentage(subscriptionData.obj) >= 80
            ? joined_students_percentage(subscriptionData.obj) >= 90
              ? 'error'
              : 'warning'
            : 'info'
        }
      />
    </>
  )
}

export default RemainingStudentsBanner
