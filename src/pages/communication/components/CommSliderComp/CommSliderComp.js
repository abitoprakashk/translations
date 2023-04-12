import React from 'react'
import SliderScreen from '../../../../components/Common/SliderScreen/SliderScreen'

export default function CommSliderComp(props) {
  const {width, handleConfirmationModalPopup} = props
  return (
    <div>
      <SliderScreen setOpen={handleConfirmationModalPopup} width={width}>
        {props.children}
      </SliderScreen>
    </div>
  )
}
