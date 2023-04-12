const dummyLastWeekTeachersAttendance = [0.8, 0.5, 0.3, 0.6, 0.2, 0.1, 0.2]
const dummyLastWeekStudentsAttendance = [0.5, 0.8, 0.7, 0.9, 0.2, 0.4, 0.6]

const mobileTeachersAttendance = 70
const mobileStudentAttendance = 30

export const dummyAttendanceStats = [
  dummyLastWeekTeachersAttendance,
  dummyLastWeekStudentsAttendance,
  mobileStudentAttendance,
  mobileTeachersAttendance,
]

export const dummySubscriptionData = {
  status: false,
  obj: {
    institute_signin_student: '0',
    lms_order_form_students: '10',
    billing_effective_date: null,
    trial_date: null,
    renewal_date: null,
    content_order_form_students: null,
    kam_name: null,
    kam_email_id: null,
    kam_phone_no: null,
    product_package: null,
    subscription_type: 0,
  },
}

export const freePlanSubscriptionData = {
  status: true,
  obj: {
    institute_signin_student: '0',
    lms_order_form_students: '10',
    billing_effective_date: null,
    trial_date: null,
    renewal_date: null,
    content_order_form_students: null,
    kam_name: null,
    kam_email_id: null,
    kam_phone_no: null,
    product_package: null,
    subscription_type: 1,
  },
}
