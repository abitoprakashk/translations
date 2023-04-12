import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import SearchBox from '../../Common/SearchBox/SearchBox'
import Table from '../../Common/Table/Table'
import UserProfile from '../../Common/UserProfile/UserProfile'
import * as SHC from '../../../utils/SchoolSetupConstants'
import {SECTION_OPTIONAL_ADD_STUDENT_TABLE_HEADERS} from '../../../utils/HierarchyOptions'
import RadioInput from '../../Common/RadioInput/RadioInput'
import DropdownField from '../../Common/DropdownField/DropdownField'
import Permission from '../../Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../utils/permission.constants'
import {searchBoxFilter} from '../../../utils/Helpers'
import AddSectionStudent from './AddSectionStudent'

export default function StudentsTable({students, handleChange, setActiveTab}) {
  const [sourceList, setSourceList] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [searchText, setSearchText] = useState('')
  const [studentType, setStudentType] = useState(0)
  const {t} = useTranslation()

  useEffect(() => {
    setFilteredStudents(students)
    setSourceList(students)
  }, [students])

  const joinedStudents = students?.filter(
    ({verification_status}) => !verification_status || verification_status === 1
  )
  const pendingStudents = students?.filter(
    ({verification_status}) => verification_status === 2
  )
  const rejectedStudents = students?.filter(
    ({verification_status}) => verification_status === 3
  )

  const studentTypeOptions = [
    {
      key: 0,
      value: `${t('uTypeOptionsValAll')} ${students?.length || 0}`,
    },
    {
      key: 1,
      value: `${t('uTypeOptionsValJoined')} ${joinedStudents?.length || 0}`,
    },
    {
      key: 2,
      value: `${t('uTypeOptionsValPending')} ${pendingStudents?.length || 0}`,
    },
  ]

  const handleSearchFilter = (text) => {
    setSearchText(text)
    let searchParams = [
      ['name'],
      ['phone_number'],
      ['email'],
      ['enrollment_number'],
    ]
    setFilteredStudents(searchBoxFilter(text, sourceList, searchParams))
  }

  const getRows = (students) => {
    let rows = []

    students?.forEach(
      ({
        name,
        img_url,
        email,
        enrollment_number,
        phone_number,
        verification_status,
        documents,
        _id,
      }) => {
        rows.push({
          id: _id,
          student_details: (
            <UserProfile
              image={img_url || documents.img_url}
              name={name}
              phoneNumber={
                enrollment_number?.trim() ||
                phone_number?.trim() ||
                email?.trim()
              }
              joinedState={verification_status}
            />
          ),
          action: (
            <Permission
              permissionId={
                PERMISSION_CONSTANTS.instituteClassController_moveStudentSection_update
              }
            >
              <div
                className="tm-hdg-14 tm-cr-bl-2 cursor-pointer"
                onClick={() => {
                  handleChange(SHC.ACT_SEC_MOVE_STUDENT, {name, _id})
                }}
              >
                {t('move')}
              </div>
            </Permission>
          ),
        })
      }
    )
    return rows
  }

  const handleStudentsType = (value) => {
    setStudentType(value)
    let list = []
    value = Number(value)
    switch (value) {
      case 0:
        list = students
        break
      case 1:
        list = joinedStudents
        break
      case 2:
        list = pendingStudents
        break
      case 3:
        list = rejectedStudents
        break
      default:
        break
    }
    setSourceList(list)
    setFilteredStudents(list)
    setSearchText('')
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center p-4">
        <div className="w-full lg:w-96">
          <SearchBox
            value={searchText}
            placeholder={t('searchForStudents')}
            handleSearchFilter={handleSearchFilter}
          />
        </div>
        <AddSectionStudent
          setActiveTab={setActiveTab}
          handleChange={handleChange}
          place="bottom"
        />
      </div>
      <div className="hidden lg:flex justify-start my-4 ml-5">
        <RadioInput
          value={studentType}
          fieldName="studentType"
          handleChange={(_, value) => handleStudentsType(value)}
          dropdownItems={studentTypeOptions}
        />
      </div>

      <div className="px-4 pb-2 lg:hidden">
        <DropdownField
          value={studentType}
          fieldName="studentType"
          handleChange={(_, value) => handleStudentsType(value)}
          dropdownItems={studentTypeOptions}
        />
      </div>

      <Table
        rows={getRows(filteredStudents)}
        cols={SECTION_OPTIONAL_ADD_STUDENT_TABLE_HEADERS}
      />
    </div>
  )
}
