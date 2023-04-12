import {useState} from 'react'

function useForceUpdate() {
  const [value, setValue] = useState(0) // integer state
  return {forceUpdate: () => setValue((value) => value + 1), key: value} // update state to force render
}

export default useForceUpdate
