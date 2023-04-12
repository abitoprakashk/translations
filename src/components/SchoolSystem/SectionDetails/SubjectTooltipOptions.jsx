import React from 'react'
import {useRef} from 'react'
import Popup from 'reactjs-popup'
import Permission from '../../Common/Permission/Permission'
export default function SubjectTooltipOptions({
  subjectItem,
  options,
  trigger,
  wrapperClass = '',
  handleChange,
  toolTipOptionsContainerClass = '',
}) {
  const ref = useRef()
  const closeTooltip = () => ref.current.close()
  function onClick(action, subjectItem) {
    closeTooltip()
    handleChange(action, subjectItem)
  }
  return (
    <div
      className={`cursor-pointer ${toolTipOptionsContainerClass}`}
      id="keepinside"
    >
      <Popup
        ref={ref}
        trigger={trigger}
        keepTooltipInside="#keepinside"
        on={['hover', 'click']}
        position={['top center', 'bottom right', 'bottom left']}
        closeOnDocumentClick
      >
        <div className={`bg-white rounded-lg tm-box-shadow3 ${wrapperClass}`}>
          {options.map(({label, action, labelStyle, permissionId}) =>
            permissionId ? (
              <Permission key={label} permissionId={permissionId}>
                <div
                  className={`tm-hdg-16 px-4 py-3 tm-border1-bottom cursor-pointer ${labelStyle}`}
                  key={label}
                  onClick={() => onClick(action, subjectItem)}
                >
                  {label}
                </div>
              </Permission>
            ) : (
              <div
                className={`tm-hdg-16 px-4 py-3 tm-border1-bottom cursor-pointer ${labelStyle}`}
                key={label}
                onClick={() => onClick(action, subjectItem)}
              >
                {label}
              </div>
            )
          )}
        </div>
      </Popup>
    </div>
  )
}
