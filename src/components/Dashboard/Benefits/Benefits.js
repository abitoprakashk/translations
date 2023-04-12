import React from 'react'
import liveClassesIcon from '../../../assets/images/dashboard/benefits/live-classes.svg'
import analyticsIcon from '../../../assets/images/dashboard/benefits/analytics.svg'
import attendanceReportIcon from '../../../assets/images/dashboard/benefits/attendance-reports.svg'
import feeCollectionIcon from '../../../assets/images/dashboard/benefits/fee-collection.svg'

export default function Benefits({handleTeacherInviteShare}) {
  const benifitsItem = [
    {
      num: 1,
      title: 'Live Class',
      desc: 'Monitor your classrooms from anywhere, anytime',
      imgSrc: liveClassesIcon,
    },
    {
      num: 2,
      title: 'Analytics',
      desc: 'Now easily track number of classes taken, learning hours and much more',
      imgSrc: analyticsIcon,
    },
    {
      num: 3,
      title: 'Attendance Reports',
      desc: 'Daily attendance log of both teachers and students',
      imgSrc: attendanceReportIcon,
    },
    {
      num: 4,
      title: 'Fee Collection',
      desc: "Collect and manage your entire institute's fees in one place",
      imgSrc: feeCollectionIcon,
    },
  ]

  return (
    <div className="w-full px-4 lg:px-0">
      <div className="tm-h5">Benefits of Teachmint for Institute</div>
      <div className="w-full bg-white tm-border-radius1 px-3 my-3 pb-3 lg:py-6 tm-box-shadow1">
        <div className="w-full lg:flex lg:flex-row">
          {benifitsItem.map(({title, desc, imgSrc}) => (
            <div
              className="w-full flex flex-row items-start py-3 tm-dashboard-benefits-card lg:w-1/4 lg:flex-col lg:items-center lg:py-0 px-4"
              key={title}
            >
              <img
                className="w-8 h-8 lg:w-10 lg:h-10"
                src={imgSrc}
                alt={title}
              />
              <div className="ml-2 lg:text-center">
                <div className="tm-h5 lg:mt-1">{title}</div>
                <div className="tm-para2 mt-2">{desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div
          className="w-full tm-btn1-blue tm-remove-element-web cursor-pointer my-2"
          onClick={handleTeacherInviteShare}
        >
          Invite&nbsp;Teacher
        </div>
      </div>
    </div>
  )
}
