import React from 'react'
import editImageIcon from '../../../assets/images/icons/profile-edit-blue.svg'

export default function ImageInput({
  instituteLogo,
  instituteOldLogo,
  setInstituteLogo,
}) {
  return (
    <div className="relative">
      <img
        src={
          instituteLogo ? URL.createObjectURL(instituteLogo) : instituteOldLogo
        }
        alt="institute"
        className="w-32 h-32 object-cover rounded-full"
      />
      <label htmlFor="institute-logo">
        <img
          src={editImageIcon}
          alt="Edit"
          className="absolute bottom-0 right-2 cursor-pointer"
        />
      </label>
      <input
        type="file"
        id="institute-logo"
        className="hidden"
        accept="image/png, image/jpg, image/jpeg"
        onChange={(e) => {
          if (!e.target.files[0]) return 0
          setInstituteLogo(e.target.files[0])
          e.target.value = null
        }}
      />
    </div>
  )
}
