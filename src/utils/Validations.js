import {religionList, categoryList} from './constants'
import {getDateObjFromString} from './Helpers'
import {INSTITUTE_TYPES} from './../constants/institute.constants'

const regex = {
  uid: {final: /^[a-z0-9]{24}$/},
  name: {
    input: /^[a-zA-Z '.]{0,50}$/,
    final: /^[a-zA-Z '.]{1,50}$/,
  },
  role: {
    input: /^[A-Z0-9 '.]{3,50}$/,
    final: /^[A-Z0-9 '.]{3,50}$/,
  },
  country_code: {input: /^\d{0,3}$/, final: /^\d{0,3}$/},
  phone_number: {
    input: /^[0-9]{5,15}$/,
    final: /^[0-9]{5,15}$/,
  },
  email: {
    input: /.+/,
    final:
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  },
  designation: {input: /^.{0,50}$/, final: /^.{1,50}$/},
  qualification: {input: /^.{0,50}$/, final: /^.{1,50}$/},
  employee_id: {
    input: /^[a-z0-9 -/]{0,50}$/i,
    final: /^[a-zA-Z0-9 -/]{1,50}$/,
  },
  aadhar_number: {
    input: /^\d{1,12}$/,
    final: /^[2-9]{1}[0-9]{11}$/,
  },
  pan_number: {
    input: /^[a-z0-9]{0,10}$/i,
    final: /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/,
  },
  address: {input: /^.{0,100}$/, final: /^.{1,100}$/},
  pincode: {input: /^\d{0,12}$/, final: /^\d{3,12}$/},
  experience: {
    input: /^\d{0,2}(\.\d{0,2})?$/,
    final: /^\d{0,2}(\.\d{1,2})?$/,
  },
  employment_type: {
    input: /^.{0,50}$/,
    final: /(\bPermanent\b|\bContract\b|\bSelect\b)/,
  },
  gender: {
    input: /^.{0,50}$/,
    final: /(\bmale\b|\bfemale\b|\bothers\b|\b''\b)/,
  },
  class_department: {input: /^.{0,50}$/, final: /^.{1,50}$/},
  section_semester: {input: /^.{0,50}$/, final: /^.{0,50}$/},
  date: {
    input: '',
    final:
      /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/,
  },
  classroomName: {input: /^.{0,100}$/, final: /^.{1,100}$/},
  subject: {input: /^.{0,100}$/, final: /^.{1,100}$/},
  nonEmptyString: {input: /([^\s]*)/, final: /([^\s]*)/},
  OTP: {input: /^\d{0,6}$/, final: /^\d{6}$/},
  instituteName: {input: /^.{0,50}$/, final: /^.{1,50}$/},
  adminName: {input: /^.{0,50}$/, final: /^.{1,50}$/},
  guardian_name: {
    input: /^[a-zA-Z '.]{0,50}$/,
    final: /^[a-zA-Z '.]{0,50}$/,
  },
  guardian_number: {input: /^[0-9]{5,15}$/, final: /^[0-9]{5,15}$/},
  transport_distance: {
    input: /^\d{0,5}?(\.{1})?(\d{0,2})?$/,
    final: /^\d{0,5}?(\.\d{1,2})?$/,
  },
  transport_waypoint: {input: /^.{0,100}$/, final: /^.{0,100}$/},
  sessionName: {input: /^.{0,50}$/, final: /^.{0,50}$/},
  examName: {input: /^.{0,50}$/, final: /^.{0,50}$/},
  isbnCode: {input: /^\d{0,20}$/, final: /^\d{0,20}$/},
  bookName: {
    input: /^[a-zA-Z0-9 -~,()\\[\]'.]{0,50}$/,
    final: /^[a-zA-Z0-9 -~,()\\[\]'.]{0,50}$/,
  },
  authorName: {
    input: /^[a-zA-Z0-9- '.]{0,50}$/,
    final: /^[a-zA-Z0-9- '.]{1,50}$/,
  },
  vehicle_name: {input: /^.{0,50}$/, final: /^.{0,50}$/},
  waypoint_name: {input: /^.{0,50}$/, final: /^.{0,50}$/},
  route_name: {input: /^.{0,50}$/, final: /^.{0,50}$/},
  distance: {
    input: /^\d{0,5}?(\.{1})?(\d{0,2})?$/,
    final: /^\d{0,5}?(\.\d{1,2})?$/,
  },
  number: {input: /^.{0,20}$/, final: /^.{0,20}$/},
  categoryName: {
    input: /^[a-zA-Z0-9- ']{0,50}$/,
    final: /^[a-zA-Z0-9- ']{3,50}$/,
  },
}

const validatePhoneNumber = (countryCode, number) => {
  if (window?.countryList && !window?.countryList?.length) return false
  const country = window.countryList.find(
    (item) => item.isd_code == countryCode
  )
  if (country && country?.min_length && country?.max_length && number) {
    return (
      number.length >= country?.min_length &&
      number.length <= country?.max_length
    )
  }
  return false
}

export const validationsList = {
  teacher: {
    'First Name*': [regex.name.final, 'nonEmpty'],
    'Middle Name': [regex.name.final],
    'Last Name': [regex.name.final],
    'Country Code': [regex.country_code.final],
    'Teacher Mobile Number': [validatePhoneNumber],
    'Employment ID': [regex.employee_id.final],
    'Date of Birth': [regex.date.final],
    'Email Address': [regex.email.final],
    Gender: [regex.gender.final],
    'Aadhaar Number': [regex.aadhar_number.final],
    'PAN Number': [regex.pan_number.final],
    'Address Line 1': [regex.address.final],
    'Address Line 2': [regex.address.final],
    Country: [regex.name.final],
    State: [regex.name.final],
    'City/Town': [regex.name.final],
    Pincode: [regex.pincode.final],
    'Job Title': [regex.name.final],
    Designation: [regex.name.final],
    'Employment Type': [regex.name.final],
    'Date of Appointment': [regex.date.final],
    'Teaching Experience': [regex.experience.final],
  },
  student: {
    'First Name*': [regex.name.final, 'nonEmpty'],
    'Middle Name': [regex.name.final],
    'Last Name': [regex.name.final],
    'Country Code': [regex.country_code.final],
    Phone: [validatePhoneNumber],
    'Enrollment ID*': [regex.employee_id.final, 'nonEmpty'],
    'Date of Admission*': [regex.date.final, 'nonEmpty'],
    Class: [regex.class_department.final],
    Section: [regex.section_semester.final],
    Email: [regex.email.final],
    'Class Roll Number': [regex.employee_id.final],
    'Date of Birth': [regex.date.final],
    Gender: [regex.gender.final],
    'Address Line 1': [regex.address.final],
    'Address Line 2': [regex.address.final],
    Country: [regex.name.final],
    State: [regex.name.final],
    'City/Town': [regex.name.final],
    Pincode: [regex.pincode.final],
    'Father Contact Number': [regex.phone_number.final],
    'Father Name': [regex.name.final],
    'Father Occupation': [regex.name.final],
    'Mother Contact Number': [regex.phone_number.final],
    'Mother Name': [regex.name.final],
    'Mother Occupation': [regex.name.final],
    'Guardian Contact Number': [regex.phone_number.final],
    'Guardian Name': [regex.name.final],
    'Guardian Relationship': [regex.name.final],
    Religion: [],
    Category: [],
    'Right To Education (RTE Quota)': [],
    'Person with Disability (PwD)': [],
  },
}

export const updateValidationsList = {
  teacher: {
    'First Name*': [regex.name.final, 'nonEmpty'],
    'Middle Name': [regex.name.final],
    'Last Name': [regex.name.final],
    'Country Code': [regex.country_code.final],
    'Teacher Mobile Number': [validatePhoneNumber],
    'Employment ID': [regex.employee_id.final],
    'Date of Birth': [regex.date.final],
    'Email Address': [regex.email.final],
    Gender: [regex.gender.final],
    'Aadhaar Number': [regex.aadhar_number.final],
    'PAN Number': [regex.pan_number.final],
    'Address Line 1': [regex.address.final],
    'Address Line 2': [regex.address.final],
    Country: [regex.name.final],
    State: [regex.name.final],
    'City/Town': [regex.name.final],
    Pincode: [regex.pincode.final],
  },
  student: {
    UID: [regex.uid.final],
    'First Name*': [regex.name.final, 'nonEmpty'],
    'Middle Name': [regex.name.final],
    'Last Name': [regex.name.final],
    'Country Code': [regex.country_code.final],
    Phone: [validatePhoneNumber],
    'Enrollment ID*': [regex.employee_id.final],
    'Date of Admission*': [regex.date.final, 'nonEmpty'],
    Class: [regex.class_department.final],
    Section: [regex.section_semester.final],
    Email: [regex.email.final],
    'Class Roll Number': [regex.employee_id.final],
    'Date of Birth': [regex.date.final],
    Gender: [regex.gender.final],
    'Address Line 1': [regex.address.final],
    'Address Line 2': [regex.address.final],
    Country: [regex.name.final],
    State: [regex.name.final],
    'City/Town': [regex.name.final],
    Pincode: [regex.pincode.final],
    'Father Contact Number': [regex.phone_number.final],
    'Father Name': [regex.name.final],
    'Father Occupation': [regex.name.final],
    'Mother Contact Number': [regex.phone_number.final],
    'Mother Name': [regex.name.final],
    'Mother Occupation': [regex.name.final],
    'Guardian Contact Number': [regex.phone_number.final],
    'Guardian Name': [regex.name.final],
    'Guardian Relationship': [regex.name.final],
    Religion: [],
    Category: [],
    'Right To Education (RTE Quota)': [],
    'Person with Disability (PwD)': [],
  },
}

export const getStudentValidationsList = (instiType, isUpdate) => {
  let json = isUpdate
    ? {...updateValidationsList.student}
    : {...validationsList.student}
  if (instiType === INSTITUTE_TYPES.COLLEGE) {
    json['Program'] = [regex.designation.input]
    json['Stream'] = [regex.designation.input]
    json['Year'] = [regex.designation.input]
    json['Classroom Ids'] = []
    delete json.Section
    delete json.Class
    return json
  }
  if (instiType === INSTITUTE_TYPES.TUITION) {
    json['Department'] = [regex.designation.input]
    json['Batch'] = [regex.designation.input]
    delete json.Section
    delete json.Class
    return json
  }
  json['Last School Attended'] = [regex.designation.input]
  json['Last School Affiliated to'] = [regex.designation.input]
  json['Last Class Passed'] = [regex.designation.input]
  return json
}

export const previousYearDuesValidationsList = {
  'UID*': [regex.uid.final, 'nonEmpty'],
  'First Name': [regex.name.final],
  'Middle Name': [regex.name.final],
  'Last Name': [regex.name.final],
  'Country Code': [regex.country_code.final],
  Phone: [regex.phone_number.final],
  'Enrollment ID': [regex.employee_id.final],
  'Date of Admission': [regex.date.final],
  Class: [regex.class_department.final],
  Section: [regex.section_semester.final],
  Email: [regex.email.final],
}

export const checkRegex = (regex, value) => value === '' || regex.test(value)

export const numericRegex = (value) => checkRegex(/^[0-9\b]+$/, value)

export const floatingRegex = (value) => checkRegex(/^[0-9.\b]+$/, value)

export const alphaRegex = (value) => checkRegex(/^[a-zA-Z\s\b]+$/, value)

export const alphaNumericRegex = (value) =>
  checkRegex(/^[0-9a-zA-Z\s\b]+$/, value)

export const alphaNumericNoSpaceRegex = (value) =>
  checkRegex(/^[0-9a-zA-Z\b]+$/, value)

export const indianVechileNumberRegex = (value) => {
  if (value === '') return false
  return checkRegex(/^[A-Z]{2}\s[0-9]{2}\s[A-Z]{2}\s[0-9]{4}$/, value)
}

export const titleFieldRegex = (value) => {
  return checkRegex(/^[a-zA-Z0-9 -()']{0,50}$/, value)
}

export const validateInputs = (fieldName, value, isFinal) => {
  if (!regex[fieldName]) return true
  if (isFinal) return checkRegex(regex[fieldName].final, value)
  return checkRegex(regex[fieldName].input, value)
}

export const arrayCompare = (arr1, [...arr2]) => {
  let index = arr2.indexOf('Errors')
  if (index !== -1) {
    arr2.splice(index, 1)
  }
  if (
    !Array.isArray(arr1) ||
    !Array.isArray(arr2) ||
    arr1.length !== arr2.length
  )
    return false

  arr1 = arr1.concat().sort()
  arr2 = arr2.concat().sort()

  for (let i = 0; i < arr1.length; i++) if (arr1[i] !== arr2[i]) return false
  return true
}

export const validateTeacherCSV = (processedCSV) => {
  // Test for all headers(column heading)
  if (
    !arrayCompare(Object.keys(validationsList.teacher), processedCSV.headers)
  ) {
    return {
      status: false,
      msg: 'Column names are incorrect. Please use the sample CSV file for correct column names.',
      obj: null,
    }
  }

  let rows = processedCSV.rows

  // No. of rows
  if (rows.length === 0)
    return {
      status: false,
      msg: 'File is empty',
      obj: null,
    }

  // Test Number of rows
  if (rows.length > 100)
    return {
      status: false,
      msg: 'File has more than 100 number of teachers. Maximum of 100 teachers can be added at once.',
      obj: null,
    }

  // Test rows structure
  if (!(rows && Array.isArray(rows)))
    return {
      status: false,
      msg: 'Invalid rows Structure',
      obj: null,
    }

  // Test row value validations
  let allRowsRight = true
  //let teacherPhoneMap = []
  //let teacherEmailMap = []

  for (let row = 0; row < rows.length; row++) {
    let validationFails = []
    let teacherPhoneNum = rows[row]['Teacher Mobile Number']
    let teacherEmail = rows[row]['Email Address']

    // check atleast one exist phone or email
    if (
      (teacherEmail === null || teacherEmail === '') &&
      (teacherPhoneNum === null || teacherPhoneNum === '')
    ) {
      return {
        status: false,
        msg: 'Phone number or Email required.',
        obj: null,
      }
    }

    // // Check for dublicate phone number / email
    // if (
    //   teacherPhoneMap.includes(teacherPhoneNum) ||
    //   teacherEmailMap.includes(teacherEmail)
    // )
    //   return {
    //     status: false,
    //     msg: 'There are duplicates in the file. Please recheck and upload the correct file.',
    //     obj: null,
    //   }
    // if (teacherPhoneNum !== null && teacherPhoneNum !== '') {
    //   teacherPhoneMap.push(teacherPhoneNum)
    // }
    // if (teacherEmail !== null && teacherEmail !== '') {
    //   teacherEmailMap.push(teacherEmail)
    // }

    Object.entries(rows[row]).map((entry) => {
      let key = entry[0]
      let value = entry[1]

      let colFlag = true
      if (validationsList.teacher[key])
        validationsList.teacher[key].forEach((element) => {
          if (element === 'nonEmpty') colFlag = colFlag && value !== ''
          else if (
            typeof element === 'function' &&
            value !== null &&
            value !== ''
          ) {
            // calling validatePhoneNumber
            const isNumberValid = element(rows[row]?.['Country Code'], value)
            colFlag = colFlag && isNumberValid
          } else colFlag = colFlag && checkRegex(element, value)
        })

      if (!colFlag) validationFails.push(key)
      allRowsRight = allRowsRight && colFlag
    })
    rows[row].error = validationFails.join(', ')
  }

  if (allRowsRight)
    return {
      status: true,
      msg: 'The students are added successfully.',
      obj: null,
    }

  return {
    status: false,
    msg: 'The uploaded file has incorrect or insufficient data. Please download the file to view the errors.',
    obj: rows,
  }
}

export const validateStudentCSV = (processedCSV, instiType, isUpdate) => {
  // Test for all headers(column heading)
  let finalValidationList = getStudentValidationsList(instiType, isUpdate)
  if (!arrayCompare(Object.keys(finalValidationList), processedCSV.headers))
    return {
      status: false,
      msg: 'Column names are incorrect. Please use the sample CSV file for correct column names.',
      obj: null,
    }

  let rows = processedCSV.rows

  // No. of rows
  if (rows.length === 0)
    return {
      status: false,
      msg: 'File is empty',
      obj: null,
    }

  // Test Number of rows
  if (rows.length > 2000)
    return {
      status: false,
      msg: 'File has more than 2000 number of students. Maximum of 2000 students can be added at once.',
      obj: null,
    }

  // Test rows structure
  if (!(rows && Array.isArray(rows)))
    return {
      status: false,
      msg: 'Invalid rows Structure',
      obj: null,
    }

  // Test row value validations
  let allRowsRight = true
  let hasErrorAlready = processedCSV.headers.includes('Errors')

  for (let row = 0; row < rows.length; row++) {
    let validationFails = []

    let studentPhoneNum = rows[row]['Phone']
    let studentEmail = rows[row]['Email']

    // check atleast one exist phone or email
    if (
      (studentEmail === null || studentEmail === '') &&
      (studentPhoneNum === null || studentPhoneNum === '')
    ) {
      return {
        status: false,
        msg: 'Phone number or Email required.',
        obj: null,
      }
    }

    Object.entries(rows[row]).map((entry) => {
      let key = entry[0]
      let value = entry[1]
      let colFlag = true

      if (finalValidationList[key])
        finalValidationList[key].forEach((element) => {
          if (element === 'nonEmpty') colFlag = colFlag && value !== ''
          else if (
            typeof element === 'function' &&
            value !== null &&
            value !== ''
          ) {
            // calling validatePhoneNumber
            const isNumberValid = element(rows[row]?.['Country Code'], value)
            colFlag = colFlag && isNumberValid
          } else {
            colFlag = colFlag && checkRegex(element, value)
          }
        })

      if (!colFlag) validationFails.push(key)
      allRowsRight = allRowsRight && colFlag
    })
    if (hasErrorAlready) {
      rows[row].Errors = validationFails.join(', ')
    } else {
      rows[row].error = validationFails.join(', ')
    }
  }

  if (allRowsRight)
    return {
      status: true,
      msg: 'The students are added successfully.',
      obj: null,
    }

  return {
    status: false,
    msg: 'The uploaded file has incorrect or insufficient data. Please download the file to view the errors.',
    obj: rows,
  }
}

export const mapping = {
  UID: 'imember_id',
  'First Name*': 'name',
  'Middle Name': 'middle_name',
  'Last Name': 'last_name',
  'Country Code': 'country_code',
  Phone: 'phone_number',
  'Teacher Mobile Number': 'phone_number',
  'Enrollment ID*': 'enrollment_number',
  'Date of Admission*': 'admission_timestamp',
  Class: 'standard',
  Section: 'section',
  Email: 'email',
  'Email Address': 'email',
  'Class Roll Number': 'roll_number',
  'Date of Birth': 'date_of_birth',
  Gender: 'gender',
  'Address Line 1': 'line1',
  'Address Line 2': 'line2',
  Country: 'country',
  State: 'state',
  'City/Town': 'city',
  Pincode: 'pin',
  Designation: 'designation',
  Qualification: 'qualification',
  'Employee ID': 'employee_id',
  'Employment ID': 'employee_id',
  'Aadhaar Number': 'aadhar_number',
  'PAN Number': 'pan_number',
  'Job Title': 'job_profile',
  'Employment Type': 'employment_type',
  'Teaching Experience': 'experience',
  'Date of Appointment': 'date_of_appointment',
  'Father Contact Number': 'father_contact_number',
  'Father Name': 'father_name',
  'Father Occupation': 'father_occupation',
  'Mother Contact Number': 'mother_contact_number',
  'Mother Name': 'mother_name',
  'Mother Occupation': 'mother_occupation',
  'Guardian Contact Number': 'guardian_number',
  'Guardian Name': 'guardian_name',
  'Guardian Relationship': 'guardian_relationship',
  Religion: 'religion',
  Category: 'category',
  'Right To Education (RTE Quota)': 'right_to_education',
  'Person with Disability (PwD)': 'pwd',
  'Last School Attended': 'last_school_attended',
  'Last School Affiliated to': 'last_school_affiliation',
  'Last Class Passed': 'last_class_passed',
  Program: 'program',
  Stream: 'stream',
  Year: 'year',
  Courses: 'courses',
  Batch: 'batch',
  'Classroom Ids': 'classroom_ids',
  Department: 'department',
}

export const mapCsvKeys = (user_data, isTeacher, instituteType) => {
  const mapped_data = []
  user_data.rows.forEach((user) => {
    let mapped_user = {}
    for (let item in user) {
      const key = mapping[item] ? mapping[item] : item
      mapped_user[key] = user[item] || ''
    }
    if (instituteType === INSTITUTE_TYPES.TUITION) {
      mapped_user['standard'] = mapped_user['department']
      mapped_user['section'] = mapped_user['batch']
      delete mapped_user.department
      delete mapped_user.batch
    }
    mapped_user['current_address'] = {
      line1: mapped_user['line1'],
      line2: mapped_user['line2'],
      country: mapped_user['country'],
      state: mapped_user['state'],
      city: mapped_user['city'],
      pin: mapped_user['pin'],
    }
    if (
      mapped_user['phone_number'] !== null &&
      mapped_user['phone_number'] !== ''
    ) {
      mapped_user['phone_number'] =
        mapped_user['country_code'] + '-' + mapped_user['phone_number']
    }
    mapped_user['permanent_address'] = mapped_user['current_address']
    if (!isTeacher) {
      mapped_user['father_contact_number'] = mapped_user[
        'father_contact_number'
      ]
        ? mapped_user['country_code'] +
          '-' +
          mapped_user['father_contact_number']
        : ''
      mapped_user['mother_contact_number'] = mapped_user[
        'mother_contact_number'
      ]
        ? mapped_user['country_code'] +
          '-' +
          mapped_user['mother_contact_number']
        : ''
      mapped_user['guardian_number'] = mapped_user['guardian_number']
        ? mapped_user['country_code'] + '-' + mapped_user['guardian_number']
        : ''
      mapped_user.religion = getReligion(mapped_user.religion)
      mapped_user['category'] = getCategory(mapped_user['category'])
      mapped_user['pwd'] =
        mapped_user['pwd']?.toLowerCase() === 'yes' ? true : false
      mapped_user['right_to_education'] =
        mapped_user['right_to_education']?.toLowerCase() === 'yes'
          ? true
          : false
      let date = getDateObjFromString(mapped_user.admission_timestamp)
      mapped_user.admission_timestamp = date ? date.getTime() / 1000 : ''
      mapped_user.standard = mapped_user.standard || ''
      mapped_user.section = mapped_user.section || ''
    }
    if (mapped_user.date_of_birth?.includes('-')) {
      mapped_user.date_of_birth = mapped_user.date_of_birth?.replace(/-/g, '/')
    }
    if (mapped_user.classroom_ids) {
      mapped_user.classroom_ids = mapped_user.classroom_ids
        .split(',')
        .map((id) => id.trimLeft())
    }
    mapped_data.push(mapped_user)
  })
  return mapped_data
}

// Add Books CSV validation
export const addBooksCSVValidation = {
  addBooks: {
    'Name*': [regex.bookName.final, 'nonEmpty'],
    'ISBN Number*': [regex.isbnCode.final, 'nonEmpty'],
    'Author Name*': [regex.authorName.final, 'nonEmpty'],
  },
}

export const validateBulkAddBooksCSV = (processedCSV) => {
  if (
    !arrayCompare(
      Object.keys(addBooksCSVValidation.addBooks),
      processedCSV.headers
    )
  ) {
    return {
      status: false,
      msg: 'Column names are incorrect. Please use the sample CSV file for correct column names.',
      obj: null,
    }
  }

  let rows = processedCSV.rows
  // No. of rows
  if (rows.length === 0)
    return {
      status: false,
      msg: 'File is empty',
      obj: null,
    }

  // Test Number of rows
  if (rows.length > 5000) {
    return {
      status: false,
      msg: 'File has more than 100 number of books. Maximum of 100 books can be added at once.',
      obj: null,
    }
  }

  // Test rows structure
  if (!(rows && Array.isArray(rows))) {
    return {
      status: false,
      msg: 'Invalid rows Structure',
      obj: null,
    }
  }

  // Test row value validations
  let allRowsRight = true
  let addBookISBNNumberMap = []
  for (let row = 0; row < rows.length; row++) {
    let validationFails = []
    // // Check for dublicate books ISBN Number
    let ISBNNum = rows[row]['ISBN Number*']
    if (String(ISBNNum).length > 0 && addBookISBNNumberMap.includes(ISBNNum))
      return {
        status: false,
        msg: 'There are duplicate ISBN Numbers in the file. Please recheck and upload the correct file.',
        obj: null,
      }
    addBookISBNNumberMap.push(ISBNNum)

    Object.entries(rows[row]).map((entry) => {
      let key = entry[0]
      let value = entry[1]

      let colFlag = true
      if (addBooksCSVValidation.addBooks[key])
        addBooksCSVValidation.addBooks[key].forEach((element) => {
          if (element === 'nonEmpty') colFlag = colFlag && value !== ''
          else colFlag = colFlag && checkRegex(element, value)
        })
      if (!colFlag) validationFails.push(key)
      allRowsRight = allRowsRight && colFlag
    })
    rows[row].error = validationFails.join(', ')
  }
  if (allRowsRight)
    return {
      status: true,
      msg: 'Bulk Books Added Successfully.',
      obj: null,
    }

  return {
    status: false,
    msg: 'The uploaded file has incorrect or insufficient data. Please download the file to view the errors.',
    obj: rows,
  }
}

export const addBookMapping = {
  'Name*': 'name',
  'ISBN Number*': 'isbn_code',
  'Author Name*': 'author',
}

export const mapCsvAddBulkBooksKeys = (data, institute_id) => {
  const mapped_data = []
  data.rows.forEach((book) => {
    let mapped_books = {}
    for (let item in book) {
      const key = addBookMapping[item] ? addBookMapping[item] : item
      mapped_books[key] = book[item] || ''
    }
    mapped_books['institute_id'] = institute_id
    mapped_books['book_code'] = ''
    mapped_books['desc'] = ''
    mapped_data.push(mapped_books)
  })
  return mapped_data
}

const getReligion = (religion) => {
  if (!religion) return ''
  let rel = religionList.find((item) => item.value === religion.toUpperCase())
  return rel ? rel.value : ''
}

const getCategory = (category) => {
  if (!category) return ''
  let cat = categoryList.find((item) => item.value === category.toUpperCase())
  return cat ? cat.value : ''
}
