import React from 'react'
import {useSelector} from 'react-redux'
import BarChart from '../../Common/BarChart/BarChart'
import CircularProgressBar from '../../Common/CircularProgressBar/CircularProgressBar'
import history from '../../../history'
import {sidebarData} from '../../../utils/SidebarItems'
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary'

export default function DetailAttendancePage() {
  const {instituteAttendance} = useSelector((state) => state)

  return (
    <div className="w-full justify-between px-4 py-3">
      <div>
        <div className="tm-h5">Today’s Attendance Overview</div>
        <div className="flex flex-row justify-between mt-3">
          <ErrorBoundary>
            <div className="bg-white tm-border-radius1 px-3 py-3 w-24/25 flex flex-row justify-between items-center">
              <div className="tm-para2 w-1/2">Students Attendance</div>
              <CircularProgressBar
                type={1}
                value={
                  instituteAttendance &&
                  instituteAttendance[1] &&
                  instituteAttendance[1].attendance &&
                  instituteAttendance[1].attendance[6]
                }
              />
            </div>
            <div className="bg-white tm-border-radius1 px-3 py-3 w-24/25 flex flex-row justify-between items-center">
              <div className="tm-para2 w-1/2">Teacher Attendance</div>
              <CircularProgressBar
                type={1}
                value={
                  instituteAttendance &&
                  instituteAttendance[0] &&
                  instituteAttendance[0].attendance &&
                  instituteAttendance[0].attendance[6]
                }
              />
            </div>
          </ErrorBoundary>
        </div>
      </div>

      <div className="mt-4">
        <div className="tm-h5">Last 7 Days Attendance</div>
        <div className="mt-3">
          <ErrorBoundary>
            {instituteAttendance &&
              instituteAttendance.map(({title, attendance}, index) => (
                <div
                  className="bg-white tm-border-radius1 px-3 py-3 mb-3"
                  key={title}
                  onClick={() => {
                    if (index === 0)
                      history.push(sidebarData.CLASSROOM_ATTENDANCE.route)
                  }}
                >
                  <ErrorBoundary>
                    <BarChart title={title} attendance={attendance} />
                  </ErrorBoundary>
                </div>
              ))}
          </ErrorBoundary>
        </div>
      </div>
    </div>
  )
}
