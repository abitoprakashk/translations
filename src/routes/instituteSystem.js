import axios from 'axios'
import {REACT_APP_API_URL, BACKEND_HEADERS} from '../constants'

// Get Hierarchy
export const utilsGetInstituteHierarchy = (_instituteId, _uuid, sessionId) => {
  return new Promise((resolve, reject) => {
    const headers = BACKEND_HEADERS
    if (sessionId) {
      headers['x-academicsessionid'] = sessionId
    }

    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}institute-class/institute/hierarchy`,
      headers,
    })
      .then((response) => {
        if (response?.data) resolve({...response?.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

// Update Node Meta Data
export const utilsUpdateNodeMetaData = (instituteId, uuid, metaData) => {
  const data = {
    uu_id: uuid,
    meta_data: metaData,
  }

  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}institute-class/update/entity/meta`,
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then((response) => {
        if (response?.data) resolve({...response?.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

// Get Section details
export const utilsGetSectionDetails = (instituteId, uuid) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}institute-class/section/details?hid=${uuid}`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response?.data) resolve({...response?.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

// Get section which don't have classteachers details
// export const utilsGetSectionWithoutClassteacherDetails = (
//   instituteId,
//   uuid
// ) => {
//   return new Promise((resolve, reject) => {
//     axios({
//       method: 'GET',
//       url: `${REACT_APP_API_URL}v1/get/section/details/${instituteId}/${uuid}`,
//       headers: BACKEND_HEADERS,
//     })
//       .then((response) => {
//         if (response?.data) resolve({...response?.data})
//         reject({errorOccured: true})
//       })
//       .catch(() => reject({errorOccured: true}))
//   })
// }
// Add new section for a class
export const utilsAddSection = (instituteId, uuid) => {
  const data = JSON.stringify({
    uu_id: uuid,
  })

  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}institute-class/add/section`,
      headers: BACKEND_HEADERS,
      data: JSON.parse(data),
    })
      .then((response) => {
        if (response?.data) resolve({...response?.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

// Assign class teacher to class section
export const utilsAssignClassTeacher = (nodeId, teacherId) => {
  const data = {
    node_id: nodeId,
    member_id: teacherId,
  }

  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}institute-class/assign/class/teacher`,
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then((response) => {
        if (response?.data) resolve({...response?.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

// Assign bulk class teacher to class section
// export const utilsBulkAssignClassTeacher = (payloadObj) => {
//   const data = {payloadObj}

//   return new Promise((resolve, reject) => {
//     axios({
//       method: 'POST',
//       url: `${REACT_APP_API_URL}institute-class/assign/class/teacher`,
//       headers: BACKEND_HEADERS,
//       data: data,
//     })
//       .then((response) => {
//         if (response?.data) resolve({...response?.data})
//         reject({errorOccured: true})
//       })
//       .catch(() => reject({errorOccured: true}))
//   })
// }

// Remove class teacher to class section
export const utilsRemoveClassTeacher = (instituteId, uuid) => {
  const data = {
    uu_id: uuid,
  }

  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}institute-class/remove/class/teacher`,
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then((response) => {
        if (response?.data) resolve({...response?.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

// Assign subject teacher
// export const utilsHierarchyCreateClassroom = (
//   instituteId,
//   uuid,
//   phoneNumber,
//   classroomName,
//   subjectName
// ) => {
//   const fd = new FormData()
//   fd.append('institute_id', instituteId)
//   fd.append('uu_id', uuid)
//   fd.append('phone_number', phoneNumber)
//   fd.append('class_name', classroomName)
//   fd.append('subject_name', subjectName)
//   fd.append('timings', JSON.stringify(['', '', '', '', '', '', '']))

//   return new Promise((resolve, reject) => {
//     axios({
//       method: 'POST',
//       url: `${REACT_APP_API_URL}v1/hierarchy/create/classroom`,
//       headers: BACKEND_HEADERS,
//       data: fd,
//     })
//       .then((response) => {
//         if (response?.data) resolve({...response?.data})
//         reject({errorOccured: true})
//       })
//       .catch(() => reject({errorOccured: true}))
//   })
// }

// Remove subject teacher
export const utilsRemoveSubjectTeacher = (instituteId, uuid) => {
  const data = {
    uu_id: uuid,
  }

  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}institute-class/remove/subject/teacher`,
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then((response) => {
        if (response?.data?.status) resolve({...response?.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

// Reassign subject teacher
export const utilsAssignSubjectTeacher = (nodeId, teacherId, tags = []) => {
  const data = {
    node_id: nodeId,
    member_id: teacherId,
    tags: tags,
  }

  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}institute-class/assign/subject/teacher`,
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then((response) => {
        if (response?.data?.status) resolve({...response?.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

// Remove subject co teacher
export const utilsRemoveSubjectCoTeacher = (nodeId, teacherIds) => {
  const data = {
    class_id: nodeId,
    teacher_ids: teacherIds,
  }

  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}institute-class/remove/coteacher`,
      data: data,
    })
      .then((response) => {
        if (response?.data?.status) resolve({...response?.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

// Delete Section
export const utilsDeleteSection = (instituteId, uuid) => {
  const data = {
    uu_id: uuid,
  }

  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}institute-class/delete/section`,
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then((response) => {
        if (response?.data) resolve({...response?.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

// Delete Subject
export const utilsDeleteSubject = (instituteId, uuid) => {
  const data = {
    uu_id: uuid,
  }

  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}institute-class/delete/subject`,
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then((response) => {
        if (response?.data?.status) resolve({...response?.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

// Update Node Name
export const utilsUpdateNodeName = (instituteId, uuid, name) => {
  const data = {
    uu_id: uuid,
    name: name,
  }

  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}institute-class/update/entity/name`,
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then((response) => {
        if (response?.data?.status) resolve({...response?.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

// Add new subject in section
export const utilsAddNewSubject = (instituteId, uuid, subjectName) => {
  const data = {
    uu_id: uuid,
    subject_name: subjectName,
  }

  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}institute-class/create/subject`,
      headers: BACKEND_HEADERS,
      data: data,
    })
      .then((response) => {
        if (response?.data) resolve({...response?.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

// Assign Single student to section
// export const utilsAddStudentSection = (
//   instituteId,
//   {
//     name,
//     phone_number,
//     country_code,
//     gender = '',
//     email = '',
//     enrollment_number = '',
//     guardian_name = '',
//     guardian_number = '',
//     guardian_country_code = '',
//     address = '',
//     pincode = '',
//     date_of_birth = '',
//     is_transport_required = false,
//     transport_distance = '',
//     transport_waypoint = '',
//   },
//   uuid
// ) => {
//   const student_data = [
//     {
//       'Name*': name,
//       'Country Code*': country_code,
//       'Phone*': phone_number,
//       Email: email,
//       Gender: gender,
//       'Enrollment Number': enrollment_number,
//       Address: address,
//       Pincode: pincode,
//       'Date of Birth': date_of_birth,
//       'Guardian Name': guardian_name,
//       'Guardian Country Code': guardian_country_code,
//       'Guardian Number': guardian_number,
//       'Transport Required': is_transport_required,
//       'Transport Distance': transport_distance,
//       'Transport Waypoint': transport_waypoint,
//     },
//   ]

//   const data = {headers: student_headers, rows: student_data}

//   return new Promise((resolve, reject) => {
//     axios({
//       method: 'POST',
//       url: `${REACT_APP_API_URL}v1/add/section/student`,
//       headers: BACKEND_HEADERS,
//       data: {data: data, class_id: uuid, institute_id: instituteId},
//     })
//       .then((response) => {
//         if (response?.data) resolve({...response.data})
//         reject({errorOccured: true})
//       })
//       .catch(() => reject({errorOccured: true}))
//   })
// }

// Assign Single student to section
export const utilsAssignStudentSection = (
  instituteId,
  imember_id,
  phoneNumber,
  uuid
) => {
  const data = {
    imember_id: imember_id,
    phone_number: phoneNumber,
    uu_id: uuid,
  }

  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}institute-class/assign/section/student`,
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

// Move Student
export const utilsMoveStudent = (
  instituteId,
  imember_id,
  fromID,
  toId,
  phoneNumber
) => {
  const data = {
    imember_id: imember_id,
    from_uuid: fromID,
    to_uuid: toId,
    phone_number: phoneNumber,
  }

  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}institute-class/move/student/section`,
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

// Add student in optionl subject
export const utilsAddStudentOptionalSubject = (
  instituteId,
  subjectId,
  imember_id
) => {
  const fd = new FormData()
  fd.append('institute_id', instituteId)
  fd.append('uu_id', subjectId)
  fd.append('imember_id', imember_id)

  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}v1/add/optional/student`,
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

// Remove student in optionl subject
export const utilsRemoveStudentOptionalSubject = (
  instituteId,
  subjectId,
  imember_id
) => {
  const fd = new FormData()
  fd.append('institute_id', instituteId)
  fd.append('uu_id', subjectId)
  fd.append('imember_id', imember_id)

  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}v1/delete/optional/class/student`,
      headers: BACKEND_HEADERS,
      data: fd,
    })
      .then((response) => {
        if (response?.data) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

export const utilsAddRemoveStudentsOptionalSubject = (
  class_id,
  removed_student_iids,
  added_student_iids
) => {
  const data = {
    class_id: class_id,
    removed_student_iids: removed_student_iids,
    added_student_iids: added_student_iids,
  }
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}institute-class/update/optional/class/students`,
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

// Get single teacher details
export const utilsGetSingleTeacherDetails = (instituteId, imember_id) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}v1/get/single/teacher/detail/${instituteId}/${imember_id}`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response?.data) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

// Delete teacher
export const utilsDeleteTeacher = (instituteId, imember_id) => {
  const fd = new FormData()
  fd.append('institute_id', instituteId)
  fd.append('imember_id', imember_id)

  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}v1/delete/institute/teacher`,
      headers: BACKEND_HEADERS,
      data: fd,
    })
      .then((response) => {
        if (response?.data) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

// Get single student details
export const utilsGetSingleStudentDetails = (instituteId, imember_id) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}v1/get/single/student/detail/${instituteId}/${imember_id}`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response?.data) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

// Delete Student
export const utilsDeleteStudent = (instituteId, imember_id) => {
  const fd = new FormData()
  fd.append('institute_id', instituteId)
  fd.append('imember_id', imember_id)

  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}v1/delete/institute/student`,
      headers: BACKEND_HEADERS,
      data: fd,
    })
      .then((response) => {
        if (response?.data) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

// Update Student Data
export const utilsUpdateStudentData = (
  instituteId,
  imember_id,
  {
    name,
    phone_number,
    country_code,
    admission_timestamp,
    gender = '',
    email = '',
    class_department = '',
    section_semester = '',
    enrollment_number = '',
    guardian_name = '',
    guardian_number = '',
    guardian_country_code = '',
    address = '',
    pincode = '',
    date_of_birth = '',
    is_transport_required = false,
    transport_distance = '',
    transport_waypoint = '',
  },
  uuid
) => {
  const fd = new FormData()

  fd.append('institute_id', instituteId)
  fd.append('imember_id', imember_id)
  fd.append('name', name)
  fd.append('country_code', country_code)
  fd.append('phone_number', phone_number)
  fd.append('gender', gender || '')
  fd.append('email', email)
  fd.append('class_department', class_department)
  fd.append('section_semester', section_semester)
  fd.append('enrollment_number', enrollment_number)
  fd.append('guardian_name', guardian_name)
  fd.append('guardian_country_code', guardian_country_code)
  fd.append('guardian_number', guardian_number)
  fd.append('address', address)
  fd.append('pincode', pincode)
  fd.append('date_of_birth', date_of_birth)
  fd.append('admission_timestamp', admission_timestamp)
  fd.append('is_transport_required', is_transport_required)
  fd.append('transport_distance', transport_distance || 0)
  fd.append('transport_waypoint', transport_waypoint || '')
  fd.append('uu_id', uuid)

  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}v1/update/institute/student`,
      headers: BACKEND_HEADERS,
      data: fd,
    })
      .then((response) => {
        if (response?.data) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

// Update Teacher Data
export const utilsUpdateTeacherData = (
  instituteId,
  imember_id,
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
  const fd = new FormData()

  fd.append('institute_id', instituteId)
  fd.append('imember_id', imember_id)
  fd.append('name', name)
  fd.append('country_code', country_code)
  fd.append('phone_number', phone_number)
  fd.append('gender', gender)
  fd.append('email', email)
  fd.append('designation', designation)
  fd.append('qualification', qualification)
  fd.append('employee_id', employee_id)
  fd.append('aadhar_number', aadhar_number)
  fd.append('pan_number', pan_number)
  fd.append('address', address)
  fd.append('pincode', pincode)
  fd.append(
    'employment_type',
    employment_type === 'Select' ? '' : employment_type
  )
  fd.append('date_of_birth', date_of_birth)
  fd.append('experience', experience)
  fd.append('date_of_appointment', date_of_appointment)

  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}v1/update/institute/teacher`,
      headers: BACKEND_HEADERS,
      data: fd,
    })
      .then((response) => {
        if (response?.data) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

// Get all hierarchy students
export const utilsGetUncatergorizedClasses = (_instituteId) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}institute-class/uncategorized/classroom`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response?.data) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

// Get all hierarchy students
export const utilsGetInstituteSectionList = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}institute-class/session/classes/section/info`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response?.data?.status) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

// Get student based attendance
export const utilsGetStudentBasedAttendanceSummary = (iid) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}offline-attendance/summary`,
      headers: BACKEND_HEADERS,
      params: {iid},
    })
      .then((response) => {
        if (response?.data?.status) resolve({...response.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}
