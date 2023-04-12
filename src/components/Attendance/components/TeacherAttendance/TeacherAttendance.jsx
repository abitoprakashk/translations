import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {
  showErrorOccuredAction,
  showLoadingAction,
} from '../../../../redux/actions/commonAction'
import {utilsGetTeacherAttendance} from '../../../../routes/dashboard'
import ImgText from '../../../Common/ImgText/ImgText'
import calendarIcon from '../../../../assets/images/icons/calendar-primary.svg'
import {getDateNewFormat} from '../../../../utils/Helpers'
import SearchBox from '../../../Common/SearchBox/SearchBox'

export default function TeacherAttendance() {
  const [teacherAttendance, setTeacherAttendance] = useState({})
  const [filteredTeachers, setFilteredTeachers] = useState(null)
  const [searchText, setSearchText] = useState('')

  const {instituteInfo} = useSelector((state) => state)
  const dispatch = useDispatch()

  const getTeacherAttendance = () => {
    dispatch(showLoadingAction(true))
    utilsGetTeacherAttendance()
      .then(({data}) => {
        setTeacherAttendance(data)
        setFilteredTeachers(Object.values(data.teacher_details))
      })
      .catch(() => dispatch(showErrorOccuredAction(true)))
      .finally(() => dispatch(showLoadingAction(false)))
  }

  useEffect(() => {
    if (instituteInfo && instituteInfo._id) getTeacherAttendance()
  }, [instituteInfo])

  const attendanceStatsItems = [
    {
      title: 'Working Day',
      titleMobile: (
        <>
          Working <br />
          Day
        </>
      ),
      value: 1,
    },
    {
      title: 'Avg Attendance',
      titleMobile: (
        <>
          Avg <br /> Attendace
        </>
      ),
      value: `${
        (teacherAttendance && teacherAttendance.teacher_attendance) || 0
      }%`,
    },
    {
      title: 'Classes Taken',
      titleMobile: (
        <>
          Classes <br />
          Taken
        </>
      ),
      value: `${
        (teacherAttendance && teacherAttendance.attended_classes) || 0
      }/${(teacherAttendance && teacherAttendance.scheduled_classes) || 0}`,
    },
  ]

  const handleSearchFilter = (text) => {
    setSearchText(text)

    if (text === '')
      setFilteredTeachers(
        (teacherAttendance &&
          Object.values(teacherAttendance.teacher_details)) ||
          null
      )
    else {
      let tempArray = Object.values(
        (teacherAttendance && teacherAttendance.teacher_details) || {}
      ).filter((teacher) =>
        teacher.name
          .toLowerCase()
          .replace('  ', ' ')
          .includes(text.toLowerCase())
      )
      setFilteredTeachers(tempArray)
    }
  }

  return (
    <div className="lg:pb-6 lg:pt-3">
      <div className="flex justify-between">
        <div className="tm-border-radius1 bg-white py-2 hidden lg:flex">
          {attendanceStatsItems.map(({title, value}) => (
            <div
              className="tm-attendance-head-item flex items-center px-4"
              key={title}
            >
              <div className="tm-para2">{title}:</div>
              &nbsp;&nbsp;
              <div className="tm-h5 tm-color-orange">{value}</div>
            </div>
          ))}
        </div>
        <div className="px-4 py-3 flex justify-between">
          <ImgText
            icon={calendarIcon}
            text={`${getDateNewFormat()}`}
            textStyle=""
          />
        </div>
      </div>

      <div className="bg-white py-3 grid grid-cols-3 lg:hidden">
        {attendanceStatsItems.map(({titleMobile, value}, index) => (
          <div className="tm-attendance-head-item text-center" key={index}>
            <div className="tm-h4 tm-color-orange">{value}</div>
            <div className="tm-para2 mt-1">{titleMobile}</div>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 lg:px-0">
        <div className="lg:hidden">
          <SearchBox
            value={searchText}
            placeholder="Search for Teacher"
            handleSearchFilter={handleSearchFilter}
          />
        </div>
        <div className="flex justify-between items-center mt-2 lg:mt-0">
          <div className="tm-para2">
            Total Teachers:{' '}
            {teacherAttendance && teacherAttendance.total_teachers}
          </div>
          <div className="hidden lg:block w-96">
            <SearchBox
              value={searchText}
              placeholder="Search for Teacher"
              handleSearchFilter={handleSearchFilter}
            />
          </div>
        </div>
      </div>

      <div className="px-4 lg:p-0">
        {filteredTeachers &&
          filteredTeachers.map((item, index) => (
            <div
              className={`bg-white tm-box-shadow1 tm-border-radius1 p-3 flex flex-wrap justify-between mb-3 ${
                item.is_present ? 'tm-border-green-left' : 'tm-border-red-left'
              }`}
              key={index}
            >
              <div className="tm-para1 tm-color-text-primary w-full lg:w-auto mb-2 lg:m-0 lg:w-4/12">
                {item.name}
              </div>
              <div className="tm-para2 flex items-center">
                <div>
                  Days Present: {item.is_present ? 1 : 0}
                  /1
                </div>
                <div
                  className={`w-5 h-5 lg:w-6 lg:h-6 rounded-full tm-color-white tm-para2 ml-1 flex items-center justify-center ${
                    item.is_present ? 'tm-bg-green' : 'tm-bg-red'
                  }`}
                >
                  {item.is_present ? 'P' : 'A'}
                </div>
              </div>
              <div className="tm-para2">
                Classes Taken : {item.class_attended}/{item.class_count}
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
