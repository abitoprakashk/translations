import React from 'react'
import {Trans} from 'react-i18next'
import ImgText from '../../Common/ImgText/ImgText'
import studentIcon from '../../../assets/images/icons/student-orange.svg'
import phoneIcon from '../../../assets/images/icons/phone-gray.svg'
import calendarIcon from '../../../assets/images/icons/live-classroom-gray.svg'
import profileDefaultIcon from '../../../assets/images/dashboard/profile-default.svg'
import {getUniqueItems} from '../../../utils/Helpers'

export default function TeacherCard({showTeacherCard}) {
  return (
    <div className="w-full mt-2 px-4 py-3 lg:mt-0 tm-border-radius1">
      <div className="flex flex-row">
        <img
          src={
            (showTeacherCard && showTeacherCard.teacherData.img_url) ||
            profileDefaultIcon
          }
          className="w-16 h-16 tm-border-radius1 mr-3 object-cover"
          alt="Profile"
        />
        <div className="tm-peanding-request-teacher-card">
          <div className="tm-h4">
            {showTeacherCard && showTeacherCard.teacherData.teacher_name}
          </div>
          <div className="mt-1">
            <ImgText
              icon={phoneIcon}
              text={`+91-${
                showTeacherCard && showTeacherCard.teacherData.phone_number
              }`}
            />
          </div>

          <div className="flex flex-row justify-between mt-1">
            <ImgText
              icon={calendarIcon}
              // text={`${
              //   showTeacherCard && showTeacherCard.teacherData.totalClasses
              // } Classrooms`}
              text={
                <Trans i18nKey="showTeacherCardTotalClasses">
                  {showTeacherCard && showTeacherCard.teacherData.totalClasses}{' '}
                  Classrooms
                </Trans>
              }
            />
            {showTeacherCard.teacherData?.students > 0 && (
              <ImgText
                icon={studentIcon}
                text={
                  <Trans i18nKey="showTeacherCardTotalClasses">
                    {showTeacherCard && showTeacherCard.teacherData.students}{' '}
                    Students
                  </Trans>
                }
                textStyle={'tm-color-orange'}
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-row mt-3 flex-wrap">
        {(
          (showTeacherCard &&
            showTeacherCard.teacherData &&
            getUniqueItems(showTeacherCard.teacherData.subjects.split(','))) ||
          []
        ).map((item) => (
          <div className="tm-subject-tag mr-2 mb-2" key={item}>
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}
