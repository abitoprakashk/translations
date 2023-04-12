import {STAFF_TYPE} from '../../constants/staff.constants'

export const staffFields = {
  name: {
    fieldType: 'text',
    title: 'Name',
    placeholder: 'Enter name',
    fieldName: 'name',
    errorString: 'Enter a valid input',
  },
  phone_number: {
    fieldType: 'phoneNumber',
    title: 'Phone Number',
    placeholder: 'Enter Phone Number',
    fieldName: 'phone_number',
    errorString: 'Enter a valid input',
  },
  country_code: {
    fieldType: 'country_code',
    placeholder: '91',
    fieldName: 'country_code',
    errorString: 'Enter a valid input',
  },
  staff_type: {
    fieldType: 'select',
    dropdownItems: STAFF_TYPE,
    title: 'Type',
    placeholder: 'Enter Type',
    fieldName: 'staff_type',
    errorString: 'Enter a valid input',
  },
}

export const defaultStaffFieldValues = {
  name: '',
  phone_number: '',
  country_code: '',
  staff_type: 'Select',
}
