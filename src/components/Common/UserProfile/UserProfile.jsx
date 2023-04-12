import React from 'react'
import {getRequestStatusLabel} from '../../../utils/Helpers'
import userProfileImg from '../../../assets/images/icons/user-profile.svg'
import appStyles from '../../../App.module.css'

export default function UserProfile({
  image,
  name,
  phoneNumber,
  email,
  joinedState = null,
  handleChange,
  showProfileImg = true,
}) {
  return (
    <div
      className={`flex items-center ${handleChange ? 'cursor-pointer' : ''}`}
      onClick={() => handleChange && handleChange()}
    >
      {showProfileImg && (
        <img
          src={image || userProfileImg}
          alt=""
          className="w-9 h-9 lg:w-11 lg:h-11 mr-3 cover rounded-full"
        />
      )}
      <div>
        <div className={`tm-hdg-14 ${handleChange ? 'tm-cr-bl-2' : 'tm-hdg'}`}>
          {name}
        </div>
        <div className="flex items-center mt-1">
          <div className="tm-para tm-para-14">
            {phoneNumber ? phoneNumber : email}
          </div>
          {joinedState && (
            <>
              <span className={appStyles.dotDiv}></span>
              {getRequestStatusLabel(joinedState)}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
