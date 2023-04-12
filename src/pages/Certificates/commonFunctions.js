import {TAB_OPTIONS_ARRAY} from './Certificates.constants'

export const isOnlyAlphabets = (value) => {
  var pattern = new RegExp(/^[a-zA-Z ]+$/)
  return pattern.test(value)
}

export function debounce(method, delay) {
  let timerId = ''
  clearTimeout(timerId)
  timerId = setTimeout(function () {
    method()
  }, delay)
}

const fieldMap = {
  1: ['name', 'enrollment_number'],
  2: ['name', 'enrollment_number'],
  3: ['name', 'enrollment_number', 'date_of_admission'],
}

export function checkIfValid(type, data) {
  let isValid = true
  const fields = [...fieldMap[type]]
  fields.forEach((item) => {
    if (!data[item]) isValid = false
  })
  return isValid
}

export const getBreadCrumbData = (selectedType, selectedStudent) => {
  const data = [{label: 'Certificates', to: '/institute/dashboard/certificate'}]
  let route = window.location.pathname
  route = route.substring(route.indexOf('certificate'), route.length)
  route = route.split('/')
  if (route.length === 1) return data
  // else if (window.innerWidth < 600) {
  //   data.push({label: ''})
  //   return data
  // }
  else if (route[1] === 'new') {
    data.push({label: `Generate New Certificate`})
  } else if (route[1] === 'directory' && selectedType) {
    data.push({
      label: `Generate New Certificate (${TAB_OPTIONS_ARRAY[selectedType].label})`,
      to: '../certificate/new',
    })
  } else if (route[1] === 'create' && selectedType && selectedStudent) {
    data.push({
      label: `Generate New Certificate (${TAB_OPTIONS_ARRAY[selectedType].label})`,
      to: '../certificate/new',
    })
    data.push({label: selectedStudent.name})
  }
  return data
}
