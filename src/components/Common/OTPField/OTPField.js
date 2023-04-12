import React, {useState} from 'react'

export default function OTPField({setOTPFinal}) {
  const [OTP, setOTP] = useState(['', '', '', '', '', ''])

  const refs = Array.from(Array(6)).map(() => {
    return {ref: null}
  })

  const updateOTPFields = (index, event) => {
    let value = event.target.value
    let OTPTemp = [...OTP]

    if (/^\d{2}$/.test(value) && refs[index + 1]) {
      OTPTemp[index + 1] = String(value)[1]
      refs[index + 1].focus()
    } else if (/^\d{1}$/.test(value)) {
      OTPTemp[index] = value
      if (refs[index + 1]) refs[index + 1].focus()
    }
    setOTP(OTPTemp)
    setOTPFinal(OTPTemp.join(''))
  }

  const onkeyup = (index, event) => {
    let keyCode = event.keyCode
    let OTPTemp = [...OTP]
    if (keyCode === 8) {
      OTPTemp[index] = ''
      setOTP(OTPTemp)
      setOTPFinal(OTPTemp.join(''))
      if (refs[index - 1]) refs[index - 1].focus()
    }
  }

  return (
    <div className="grid grid-cols-6 gap-4">
      {refs.map((_item, index) => (
        <input
          type="number"
          key={index}
          className="tm-otp-input-field tm-border-radius1 tm-border1 h-12 text-center"
          ref={(input) => {
            refs[index] = input
          }}
          maxLength={1}
          onChange={(e) => updateOTPFields(index, e)}
          onKeyUp={(e) => onkeyup(index, e)}
          value={OTP[index]}
          id={`otp-field-${index}`}
        />
      ))}
    </div>
  )
}
