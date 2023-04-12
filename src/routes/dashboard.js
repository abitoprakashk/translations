import axios from 'axios'
import {t} from 'i18next'
import {DateTime} from 'luxon'
import {REACT_APP_API_URL, BACKEND_HEADERS} from '../constants'
import {freePlanSubscriptionData} from '../utils/DummyStats'
import i18n from 'i18next'
import {sidebarData} from '../utils/SidebarItems'
import {localStorageKeys} from '../pages/BillingPage/constants'
import {isMobile} from '@teachmint/krayon'

//to get the info for the admin
export const utilsGetAdminInfo = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}institute-admin/admin/info`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response && response.data && response.data.status === true)
          resolve({
            admin: response.data.obj.admin,
            institute: response.data.obj.institute,
          })
        localStorage.setItem('lang', response.data.obj.admin.lang)
        i18n.changeLanguage(localStorage.getItem('lang'))
        reject({msg: response.data.msg, errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

export const utilsGetInstituteStats = (_institute_id) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}institute/stats`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response && response.data && response.data.status === true)
          resolve({data: response.data.obj})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

export const utilsGetInstituteAcademicDetails = (institute_id) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}institute/sessions?institute_id=${institute_id}`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response?.data) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

export const utilsGetTeacherStats = (_institute_id) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}institute/teacher/stats`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response && response.data && response.data.status === true)
          resolve({data: response.data.obj})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

export const utilsGetAttendanceStats = (institute_id, start_date, end_date) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}institute/stats/daily?sd=${start_date}&ed=${end_date}`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response && response.data && response.data.status === true)
          resolve({data: response.data.obj})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

export const utilsCreateFeedback = (feedback, ref, redirectedFrom) => {
  return new Promise((resolve, reject) => {
    let data = {
      text: feedback,
      ref: ref,
      redirected_from: redirectedFrom,
    }
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}feedback/create`,
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then(async (response) => {
        if (response && response.data && response.data.status === true)
          resolve({status: true})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

export const getConfigDetails = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}get/events_config`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response && response.data && response.data.status)
          resolve(response.data)
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

export const log_event = (eventID, data) => {
  return new Promise((resolve, reject) => {
    let fd = new FormData()
    fd.append('event_id', eventID)
    fd.append('data', JSON.stringify(data))

    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}log/event_u/${eventID}`,
      headers: {
        Accept: 'application/json',
      },
      data: fd,
    })
      .then((response) => {
        if (response && response.data && response.data.status === true)
          resolve({response})
      })
      .catch(() => reject())
  })
}

export const sendTokentoServer = (token) => {
  return new Promise((resolve, reject) => {
    let fd = new FormData()
    fd.append('fcm', token)

    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}admin/info`,
      headers: BACKEND_HEADERS,
      data: fd,
    })
      .then((response) => {
        if (response && response.data && response.data.status === true)
          resolve({status: true})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

export const getFirebaseMessaging = async () => {
  const firebase = (
    await import(
      /* webpackPrefetch: true, webpackChunkName: "firebase" */ 'firebase'
    )
  ).default
  let messaging = null
  if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey: 'AIzaSyC86r_KE3JS7lhSBFq8x1mpR9WqucpS7_M',
      authDomain: 'excellent-math-274709.firebaseapp.com',
      databaseURL: 'https://excellent-math-274709.firebaseio.com',
      projectId: 'excellent-math-274709',
      storageBucket: 'excellent-math-274709.appspot.com',
      messagingSenderId: '554736302166',
      appId: '1:554736302166:web:cc281dcb31c5211c0563f7',
      measurementId: 'G-3YS9P6ZDWX',
    })
  } else firebase.app()

  if (firebase.messaging.isSupported()) messaging = firebase.messaging()
  return messaging
}

export const utilsGetInstituteClassesWithTeacherData = (instituteId) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}get/institute/teacher/classes/${instituteId}`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response && response.data && response.data.status === true)
          resolve({data: response.data.obj})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

export const utilsGetTeacherAttendance = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}institute-user/teachers/attendance`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response && response.data && response.data.status === true)
          resolve({data: response.data.obj})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

export const utilsUpdateInstituteInfo = (
  instituteId,
  instituteName,
  instituteLogo
) => {
  return new Promise((resolve, reject) => {
    const data = {
      name: instituteName,
      logo: instituteLogo,
    }

    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}institute/update`,
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then((response) => {
        if (response && response.data && response.data.status === true)
          resolve({status: true, obj: response.data.obj})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

/**
 * Add bulk books CSV
 */
export const utilsAddBulkBooks = (booksData) => {
  return new Promise((resolve, reject) => {
    const data = {}
    data['ele_list'] = booksData

    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}book/create/many`,
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then((response) => {
        if (response && response.data) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

/**
 * Add teachers
 */
export const utilsAddTeachers = (users, check) => {
  return new Promise((resolve, reject) => {
    const data = {}
    data['check'] = check
    data['users'] = users
    data['user_type'] = 2

    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}institute-user/add/users`,
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then((response) => {
        if (response && response.data) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

/**
 * Add students
 */
export const utilsAddStudentsByCSVHierarchy = (users, check) => {
  return new Promise((resolve, reject) => {
    const data = {}
    data['check'] = check
    data['users'] = users
    data['user_type'] = 4

    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}institute-user/add/users`,
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then((response) => {
        if (response?.data) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

/**
 * Add students via CSV
 */
export const utilsAddStudentsByCSVNonHierarchy = (users, check, classId) => {
  return new Promise((resolve, reject) => {
    const data = {}
    data['check'] = check
    data['users'] = users
    data['user_type'] = 4
    data['node_id'] = classId

    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}institute-user/add/users`,
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then((response) => {
        if (response?.data) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

export const utilsUpdateStudentsFromCSV = (users) => {
  return new Promise((resolve, reject) => {
    const data = {}
    data['users'] = users
    data['user_type'] = 4

    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}institute-user/update/csv`,
      data: data,
    })
      .then((response) => {
        if (response?.data) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

/**
 * Add teacher via data
 */
export const utilsAddTeacherByData = (
  instituteId,
  {
    name,
    phone_number,
    country_code,
    gender = '',
    email = '',
    designation = '',
    qualification = '',
    employee_id = '',
    aadhar_number = '',
    pan_number = '',
    address = '',
    pincode = '',
    employment_type = '',
    date_of_birth = '',
    experience = '',
    date_of_appointment = '',
  }
) => {
  return new Promise((resolve, reject) => {
    const teacher_data = [
      {
        'Name*': name,
        'Phone*': phone_number,
        'Country Code*': country_code,
        Gender: gender,
        Email: email,
        Designation: designation,
        Qualification: qualification,
        'Employee ID': employee_id,
        'Aadhaar Number': aadhar_number,
        'PAN Number': pan_number,
        Address: address,
        Pincode: pincode,
        'Employment Type': employment_type,
        'Date of Birth': date_of_birth,
        'Teaching Experience': experience,
        'Date of Appointment': date_of_appointment,
      },
    ]

    const data = {}
    data['users'] = [teacher_data]
    data['case'] = 'ONE'

    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}add/institute/teacher/${instituteId}`,
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then((response) => {
        if (response && response.data) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

/**
 * Add students via Data
 */
export const utilsAddStudentsByData = (
  instituteId,
  {
    name,
    phone_number,
    country_code,
    gender = '',
    email = '',
    standard,
    section,
    enrollment_number = '',
    admission_timestamp = DateTime.now().toSeconds(),
    guardian_name = '',
    guardian_number = '',
    guardian_country_code = '',
    address = '',
    pincode = '',
    date_of_birth = '',
    // admission_timestamp = DateTime.now().toSeconds(),
    is_transport_required = false,
    transport_waypoint = null,
  },
  nodeId = null
) => {
  return new Promise((resolve, reject) => {
    const data = {}
    const student_data = [
      {
        name: name,
        country_code: country_code,
        phone_number: phone_number,
        email: email,
        gender: gender,
        enrollment_number: enrollment_number,
        standard: standard,
        section: section,
        address: address,
        pincode: pincode,
        admission_timestamp: admission_timestamp,
        date_of_birth: date_of_birth,
        guardian_name: guardian_name,
        guardian_country_code: guardian_country_code,
        guardian_number: guardian_number,
        is_transport_required: is_transport_required,
        transport_waypoint: transport_waypoint,
      },
    ]

    data['users'] = student_data
    data['case'] = 'ONE'
    data['user_type'] = 4
    data['node_id'] = nodeId

    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}add/institute/student/${instituteId}`,
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then((response) => {
        if (response?.data?.status === true) {
          resolve({...response.data})
        }
        reject({errorMessage: response?.data?.msg || t('genericErrorMessage')})
      })
      .catch(() => reject({errorMessage: t('genericErrorMessage')}))
  })
}

export const utilsGetUsersList = (data) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}ips/directory/list`,
      data,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response?.data) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

export const utilsGetAdminsList = () => {
  // Response :: response.data.obj = {admin : list of instituteAdmin, kam: list of KAM users}
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}institute-admin`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response?.data) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

export const parseSidebarData = (givenSidebarObj) => {
  const allowedMenus = new Set()
  const premiumItems = new Set()
  if (
    localStorage.getItem(localStorageKeys.VERIFIED_SUITS) !== 'true' ||
    isMobile()
  )
    givenSidebarObj.allowed_menus = givenSidebarObj?.allowed_menus.filter(
      (item) => item._id !== 'BILLING'
    )

  givenSidebarObj?.allowed_menus?.forEach((module) => {
    allowedMenus.add(module?._id)
    module?.submodules?.forEach((submodule) => {
      allowedMenus.add(submodule?._id || module?._id)
      if (submodule?.premium) {
        premiumItems.add(submodule?._id || module?._id)
      }
    })
  })

  let firstAllowedMenu =
    givenSidebarObj?.allowed_menus?.[0]?.submodules?.[0]?._id || // first submodule ID in case submodule present (eg facility > hostel)
    givenSidebarObj?.allowed_menus?.[0]?._id || // first module ID in case there is no submodule (eg communcation)
    'DASHBOARD' // DASHBOARD route in case there is no allowed menus (user has zero permission)

  // this is the final object stored in redux for sidebar purpose
  const sidebarReduxStoreData = {
    groups: givenSidebarObj?.allowed_menus,
    allowedMenus: allowedMenus,
    premiumItems: premiumItems,
    homePageRoute: sidebarData?.[firstAllowedMenu]?.route,
  }
  return sidebarReduxStoreData
}

export const utilsGetSidebar = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}module-permission/sidebar`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        response?.data?.status === true
          ? resolve({data: parseSidebarData(response?.data?.obj)})
          : reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

export const utilsGetCurrentAdmin = (_instituteId) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}institute-admin/current/institute/admin`,
      headers: BACKEND_HEADERS,
    })
      .then((response) =>
        response?.data?.status === true
          ? resolve({data: response?.data?.obj})
          : reject({errorOccured: true})
      )
      .catch(() => reject({errorOccured: true}))
  })
}

/** Student list with full details for CSV */
export const utilsGetUsersListDetailed = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}institute-user/students`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response?.data) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

/**
 * Add students via Data
 */
export const utilsAddClassroomsByData = (classroomName, subject, timings) => {
  return new Promise((resolve, reject) => {
    const data = {
      name: classroomName,
      subject: subject,
      timetable: timings,
    }

    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}institute-class/create/uncategorized/classroom`,
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then((response) => {
        if (response && response.data) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

/**
 * Get list of ongoing, upcoming and completed classes
 */
export const utilsGetTodaysSchedule = (_instituteId) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}institute/today/schedule`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => resolve(response.data))
      .catch(() => reject({errorOccured: true}))
  })
}

/**
 * Add Admins via Data
 */
export const utilsAddAdminsByData = (
  instituteId,
  adminName,
  countryCode,
  phoneNumber,
  roles
) => {
  return new Promise((resolve, reject) => {
    const userData = [
      {
        name: adminName,
        country_code: countryCode,
        phone_number: countryCode + '-' + phoneNumber,
        roles_to_assign: roles,
      },
    ]

    const data = {}
    data['users'] = userData
    data['user_type'] = 1

    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}institute-admin/create`,
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then((response) => {
        if (response && response.data) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

/**
 * Update Admin
 */

export const utilsUpdateAdmin = (
  imember_id,
  user_id,
  phoneNumber,
  instituteId,
  adminName,
  roles
) => {
  return new Promise((resolve, reject) => {
    const userData = [
      {
        imember_id: imember_id,
        name: adminName,
        phone_number: phoneNumber,
        roles: roles,
      },
    ]
    const data = {}
    data['users'] = userData
    data['user_type'] = 1
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}institute-admin/update`,
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then((response) => {
        if (response && response.data) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

/**
 * Delete Admins
 */
export const utilsDeleteAdmin = (imember_id, institute_id) => {
  return new Promise((resolve, reject) => {
    const data = {}
    data['imember_id'] = imember_id
    data['institute_id'] = institute_id

    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}institute-admin/delete`,
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then((response) => {
        if (response && response.data) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

/**
 * Register for free trial
 */
export const utilsRegisterForFreeTrial = (_institute_id) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}institute/start/free/trial`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response && response.data) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

/**
 * Get list of a Announcements
 */
export const utilsGetAnnouncements = (_instituteId) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}communication/admin/announcements`,
      headers: BACKEND_HEADERS,
    })
      .then((response) =>
        response?.data?.status
          ? resolve({data: response.data.obj})
          : reject({errorOccured: true})
      )
      .catch(() => reject({errorOccured: true}))
  })
}

/**
 *  Send Announcement
 */
export const utilsSendAnnouncement = (institute_id, title, desc, type) => {
  return new Promise((resolve, reject) => {
    const data = {
      title: title,
      message: desc,
      type: type,
    }
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}communication/send/announcement`,
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then((response) => {
        if (response && response.data) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

/**
 *  Remind Teachers
 */
export const utilsResendReminder = (instituteId) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}v1/send/teacher/reminder/${instituteId}`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response && response.data) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

/**
 * Get flags with country code Phone number field
 */
export const utilsGetFlag = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}institute-admin/country/codes`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response && response.data) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

/*
 * Get list of Institutes for an admin
 */
export const utilsGetInstituteList = (userType) => {
  let url = `${REACT_APP_API_URL}institute/list`
  if (userType === 7) {
    url = `${REACT_APP_API_URL}organisation/institutes`
  }
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: url,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response && response.data && response.data.status === true)
          resolve({
            institutes:
              userType === 7 ? response.data.obj.institutes : response.data.obj,
            organisation:
              userType === 7 ? response.data.obj.organisation : null,
          })
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

/*
 * Get list of Pending Institutes for an admin
 */
export const utilsGetPendingInstituteList = (
  phone_number = null,
  email = null
) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}institute/pending/list?phone_number=${phone_number}&email=${email}`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response?.data) resolve(response.data)
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

/*
 * Update status of pending institute
 */
export const utilsUpdatePendingStatus = (params) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}institute/update/request`,
      headers: BACKEND_HEADERS,
      data: params,
    })
      .then((response) => {
        resolve(response.data.status)
      })
      .catch(() => reject({errorOccured: true}))
  })
}

/**
 * Get KYC url
 */
export const utilsGetKYCUrl = (_instituteId) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}fee-module/kyc/token/url`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response && response.data && response.data.status === true)
          resolve({data: response.data.obj})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

/**
 * Get Website Builder Link
 */
export const utilsGetWebsiteBuilderUrl = (_instituteId) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}website-builder/token/url`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response && response.data && response.data.status === true)
          resolve({data: response.data.obj})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

/**
 * Get Admission Management Link
 */
export const utilsGetAdmissionManagementUrl = (_instituteId) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}admission/query/token/url`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response && response.data && response.data.status === true)
          resolve({data: response.data.obj})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

/**
 * Get Support Ticket Link
 */
export const utilsGetSupportTicketUrl = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}institute-support-ticket/token/url`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response && response.data && response.data.status === true)
          resolve({data: response.data.obj})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

/**
 * Get Help Center Link
 */
export const utilsGetHelpCenterUrl = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}institute-support-ticket/helpcentre/url`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response && response.data && response.data.status === true)
          resolve({data: response.data.obj})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

export const createAcademicSessionApi = (
  sessionName,
  startTime,
  endTime,
  sessionStatus,
  instituteType,
  affiliatedBy,
  departments,
  country
) => {
  return new Promise((resolve, reject) => {
    const data = {
      name: sessionName,
      start_time: startTime,
      end_time: endTime,
      active_status: sessionStatus ? 1 : 0,
      country: country,
    }
    if (instituteType !== 'Select') data['institute_type'] = instituteType
    if (affiliatedBy && departments?.length > 0) {
      data['affiliated_by'] = affiliatedBy
      data['departments'] = JSON.stringify(departments)
    }
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}institute/create/session`,
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then((response) => {
        if (response?.data) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

export const updateAcademicSessionApi = (
  sessionId,
  sessionName,
  startTime,
  endTime,
  sessionStatus
) => {
  return new Promise((resolve, reject) => {
    const data = {
      _id: sessionId,
      name: sessionName,
      start_time: startTime,
      end_time: endTime,
      active_status: sessionStatus ? 1 : 0,
    }

    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}institute/update/session`,
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then((response) => {
        if (response?.data) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

/**
 * Get Live Class Details
 */
export const utilsGetLiveClassDetails = (instituteId, classId) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}institute-class/live/class/url?class_id=${classId}`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response?.data) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

/**
 * Get All Books
 */

export const utilsGetBooksList = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}book/list`,
      headers: BACKEND_HEADERS,
    })
      .then((response) =>
        response?.data?.status === true
          ? resolve({data: response?.data?.obj})
          : reject({errorOccured: true})
      )
      .catch(() => reject({errorOccured: true}))
  })
}

/**
 * Add New Book
 */
export const utilsAddBookByData = (
  instituteId,
  bookName,
  isbnCode,
  authorName
) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      name: bookName,
      isbn_code: isbnCode,
      author: authorName,
    })

    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}book/create`,
      headers: BACKEND_HEADERS,
      data: JSON.parse(data),
    })
      .then((response) => {
        if (response && response.data) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

/**
 * Update Admin
 */

export const utilsUpdateBook = (
  user_id,
  phoneNumber,
  instituteId,
  adminName,
  roles
) => {
  return new Promise((resolve, reject) => {
    const fd = new FormData()
    fd.append('user_id', user_id)
    fd.append('phone_number', phoneNumber)
    fd.append('instituteId', instituteId)
    fd.append('name', adminName)
    fd.append('roles', roles)

    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}book/update`,
      headers: BACKEND_HEADERS,
      data: fd,
    })
      .then((response) => {
        if (response && response.data) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

/**
 * Delete Admins
 */
export const utilsDeleteBook = (book_id) => {
  return new Promise((resolve, reject) => {
    const data = {_id: book_id}
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}book/delete`,
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then((response) => {
        if (response && response.data) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

/**
 * Add New Book
 */
export const utilsAssignBook = (book_id, iid, active) => {
  return new Promise((resolve, reject) => {
    const data = {
      book_id: book_id,
      iid: iid,
      active: active,
    }

    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}book/associate`,
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then((response) => {
        if (response && response.data) resolve({...response.data})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

/**
 * Get All Hostels
 */

export const utilsGetHostelList = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}hostel/list`,
      headers: BACKEND_HEADERS,
    })
      .then((response) =>
        response?.data?.status === true
          ? resolve({data: response?.data?.obj})
          : reject({errorOccured: true})
      )
      .catch(() => reject({errorOccured: true}))
  })
}

/**
 * Get All Rooms
 */

export const utilsGetRoomList = (hostel_id) => {
  const data = {hostel_id: hostel_id}
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}hostel-room/custom/list`,
      headers: BACKEND_HEADERS,
      params: data,
    })
      .then((response) =>
        response?.data?.status === true
          ? resolve({data: response?.data?.obj})
          : reject({errorOccured: true})
      )
      .catch(() => reject({errorOccured: true}))
  })
}

/**
 * Add New Room
 */
export const utilsAddRoomByData = (
  hostelId,
  roomName,
  block,
  floor,
  occupancy
) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      hostel_id: hostelId,
      name: roomName,
      block: block,
      floor: floor,
      occupancy: occupancy,
    })

    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}hostel-room/create`,
      headers: BACKEND_HEADERS,
      data: JSON.parse(data),
    })
      .then((response) => {
        if (response && response.data) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

/**
 * Add New Hostel
 */
export const utilsAddHostelByData = (
  hostelName,
  address,
  rooms,
  hostelType
) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      name: hostelName,
      address: address,
      no_of_room: rooms,
      hostel_type: hostelType,
    })

    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}hostel/create`,
      headers: BACKEND_HEADERS,
      data: JSON.parse(data),
    })
      .then((response) => {
        if (response && response.data) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

/**
 * Associate Hostel Warden
 */
export const utilsAssignWarden = (hostel_id, iid, active) => {
  return new Promise((resolve, reject) => {
    const data = {
      hostel_id: hostel_id,
      iid: iid,
      active: active,
    }

    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}hostel/associate`,
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then((response) => {
        if (response && response.data) resolve({...response.data})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

/**
 * Delete Hostel
 */
export const utilsDeleteHostel = (hostel_id) => {
  return new Promise((resolve, reject) => {
    const data = {_id: hostel_id}
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}hostel/delete`,
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then((response) => {
        if (response && response.data) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

/**
 * Associate Hostel Warden
 */
export const utilsAssignStudent = (room_id, iid, active) => {
  return new Promise((resolve, reject) => {
    const data = {
      room_id: room_id,
      iid: iid,
      active: active,
    }

    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}hostel-room/associate`,
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then((response) => {
        if (response && response.data) resolve({...response.data})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

/**
 * Delete Room
 */
export const utilsDeleteRoom = (room_id) => {
  return new Promise((resolve, reject) => {
    const data = {_id: room_id}
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}hostel-room/delete`,
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then((response) => {
        if (response && response.data) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

/**
 *  Get class-section list for a session
 */
export const utilsGetClassListForSession = (sessionId) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}institute-class/session/classes?session_id=${sessionId}`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response?.data) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

/**
 *  Get student list for a class
 */

export const utilsAssignToClass = (data) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}institute-class/assign/students`,
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then((response) => {
        if (response?.data) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

/**
 *  Get student list for a section
 */

export const utilsGetStudentListForSection = (sectionId) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}institute-user/section/students`,
      headers: BACKEND_HEADERS,
      data: {section_id: sectionId},
    })
      .then((response) => {
        if (response?.data) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

/**
 * calls the api to get list of students enrolled in a classroom.
 */
// export const utilsGetEnrolledStudentsList = (classroomId, instituteId) => {
//   return new Promise((resolve, reject) => {
//     let fd = new FormData()
//     fd.append('class_id', `${classroomId}`)
//     fd.append('institute_id', instituteId)
//     axios({
//       method: 'POST',
//       url: `${REACT_APP_API_URL}get/class/users`,
//       headers: BACKEND_HEADERS,
//       data: fd,
//     })
//       .then((response) => {
//         if (response && response.data && response.data.status === true) {
//           resolve({data: response.data.obj})
//         }
//       })
//       .catch(() => {
//         reject({errorOccured: true})
//       })
//   })
// }

/**
 * calls the api to get list of students enrolled in a classroom.
 */
export const utilsGetUncategorizedClassUsers = (classroomId, _instituteId) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}institute/uncategorized/users?class_id=${classroomId}`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response && response.data && response.data.status === true) {
          resolve({data: response.data.obj})
        }
      })
      .catch(() => {
        reject({errorOccured: true})
      })
  })
}

export const getCountryDataWithCountryCode = (data) => {
  //data contains  {country_code || country}
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}util/get_country_info`,
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then((response) => {
        // console.log(response)
        if (response && response.data && response.data.status === true) {
          resolve({...response?.data?.obj})
        }
      })
      .catch(() => {
        reject({errorOccured: true})
      })
  })
}

/**
 * Setup Progress APIs
 */
/**
 * calls api to get all the sections with pending students
 */
export const utilsGetClassTeachersWithPendingStudents = () => {
  return new Promise((resolve, reject) => {
    axios(
      {
        method: 'GET',
        url: `${REACT_APP_API_URL}class-setup/pendingsections`,
        headers: BACKEND_HEADERS,
      },
      {
        withCredentials: true, //correct
      }
    )
      .then((response) => {
        if (response && response.data && response.data.status === true)
          resolve({data: response.data.obj})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}
/**
 * calls api to get all the sections with unassigned class teacher
 */
export const utilsGetSectionsWithUnassignedClassTeacher = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}class-setup/unassignedsections`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response && response.data && response.data.status === true)
          resolve({data: response.data.obj})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}
/**
 * calls api to assign class teachers to selected sections
 */
export const utilsBulkAssignClassTeachersToSection = (data) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}class-setup/assign/classteachers`,
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then((response) => {
        if (response?.data) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

export const getStudentDependency = ({imember_id}) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}institute-user/check/student/dependencies`,
      headers: BACKEND_HEADERS,
      data: {imember_ids: [imember_id]},
    }).then((response) => {
      if (response?.data?.status === true) {
        resolve(response?.data?.obj)
      } else {
        reject()
      }
    })
  })
}

/**
 * Method for updating phone number or email for invitations in InstituteMembers
 */
export const updateRequestUserInfo = (data) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}institute-user/update/request-user-info`,
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then((response) => {
        if (response && response.data && response.data.status === true) {
          resolve({...response?.data})
        }
      })
      .catch(() => {
        reject({errorOccured: true})
      })
  })
}

/**
 * calls api to get subscription info of institute
 */
export const utilsGetSubscriptionData = (institute_id) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}subscription/details/${institute_id}`,
    })
      .then((response) => {
        if (response && response.data) {
          if (response.data.status === true) resolve({data: response.data})
          else resolve({data: freePlanSubscriptionData})
        }
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

export const utilsGetBillingData = async (institute_id) => {
  const res = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}sarvesh-subscription/details`,
    headers: {'Content-Type': 'application/json'},
    params: {institute_id: institute_id},
  })
  return res
}
