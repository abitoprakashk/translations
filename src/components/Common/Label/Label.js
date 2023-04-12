import React from 'react'

export default function Label({text, textStyle}) {
  return (
    <div className={`tm-hdg-10 py-1 px-1.5 rounded-sm ${textStyle}`}>
      {text}
    </div>
  )
}
