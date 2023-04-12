import {religionList, categoryList} from '../../../../../utils/constants'

export const parentInfoFields = [
  {
    fieldType: 'phoneNumber',
    title: `Father's Phone Number`,
    fieldName: 'fatherContactNumber',
    countryCode: 'fatherContactNumberCountryCode',
  },
  {
    fieldType: 'text',
    title: 'Father’s Name',
    fieldName: 'fatherName',
  },
  {
    fieldType: 'text',
    title: 'Father’s Occupation',
    fieldName: 'fatherOccupation',
  },
  {
    fieldType: 'phoneNumber',
    title: `Mother's Phone Number`,
    fieldName: 'motherContactNumber',
    countryCode: 'motherContactNumberCountryCode',
  },
  {
    fieldType: 'text',
    title: 'Mother’s Name',
    fieldName: 'motherName',
  },
  {
    fieldType: 'text',
    title: 'Mother’s Occupation',
    fieldName: 'motherOccupation',
  },
  {
    fieldType: 'phoneNumber',
    title: `Guardian's Phone Number`,
    fieldName: 'guardianNumber',
    countryCode: 'guardianNumberCountryCode',
  },
  {
    fieldType: 'text',
    title: 'Guardian’s Name',
    fieldName: 'guardianName',
  },
  {
    fieldType: 'text',
    title: 'Guardian’s Relationship',
    fieldName: 'guardianRelationship',
  },
]

export const demographicsFields = [
  {
    fieldType: 'select',
    title: 'Religion',
    fieldName: 'religion',
    dropdownItems: religionList,
  },
  {
    fieldType: 'select',
    title: 'Category',
    fieldName: 'category',
    dropdownItems: categoryList,
  },
  {
    fieldType: 'select',
    title: 'Right To Education (RTE Quota)',
    fieldName: 'rightToEducation',
    dropdownItems: [
      {value: true, label: 'Yes'},
      {value: false, label: 'No'},
    ],
  },
  {
    fieldType: 'select',
    title: 'Person with Disability (PwD)',
    fieldName: 'pwd',
    dropdownItems: [
      {value: true, label: 'Yes'},
      {value: false, label: 'No'},
    ],
  },
]
