import React from 'react'
import Permission from '../Permission/Permission'

export default function EmptyScreenV1({
  image,
  title,
  desc = null,
  btnText = null,
  handleChange,
  btnType = 'secondary',
  permissionId = null,
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <img src={image} alt="" className="w-40" />
      <div className="tm-hdg tm-hdg-16 lg:tm-hdg-20 mt-4">{title}</div>
      {desc && (
        <div className="tm-para tm-para-14 lg:tm-para-16 my-4">{desc}</div>
      )}
      {btnText &&
        (permissionId ? (
          <Permission permissionId={permissionId}>
            <div
              className={`${
                btnType === 'primary'
                  ? 'tm-btn2-blue h-11'
                  : 'tm-btn2-white-blue'
              } w-80 mt-3`}
              onClick={handleChange}
            >
              {btnText}
            </div>
          </Permission>
        ) : (
          <div
            className={`${
              btnType === 'primary' ? 'tm-btn2-blue h-11' : 'tm-btn2-white-blue'
            } w-80 mt-3`}
            onClick={handleChange}
          >
            {btnText}
          </div>
        ))}
    </div>
  )
}
