import React from 'react'
import defaultUserImg from '../../../assets/images/icons/user-profile.svg'

export default function BookProfile({image, name, isbnNumber, handleChange}) {
  return (
    <div
      className={`flex items-center ${handleChange ? 'cursor-pointer' : ''}`}
      onClick={() => handleChange && handleChange()}
    >
      <img
        src={image || defaultUserImg}
        alt=""
        className="w-9 h-9 lg:w-11 lg:h-11 mr-1 cover rounded-full"
      />
      <div>
        <div
          className={`tm-hdg-14 lg:tm-hdg-16 ${
            handleChange ? 'tm-cr-bl-2' : ''
          }`}
        >
          {name}
        </div>
        <div className="flex items-center mt-1">
          <div className="tm-para tm-para-14">{isbnNumber}</div>
          {/* <img
            src="https://storage.googleapis.com/tm-assets/icons/secondary/dot-secondary.svg"
            alt=""
            className="w-1 h-1 mx-2"
          /> */}
        </div>
      </div>
    </div>
  )
}
