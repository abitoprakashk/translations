import {useState, useEffect, useMemo} from 'react'

const useTypeWritterText = ({dataText = [], delay = 500, addPipe = true}) => {
  const [text, setText] = useState('')
  const [loopNum, setLoopNum] = useState(0)
  const fullText = useMemo(
    () => dataText[loopNum % dataText.length],
    [loopNum, dataText]
  )

  useEffect(() => {
    if (fullText) {
      let isDeleting = false
      const interval = setInterval(() => {
        setText((prevText) => {
          if (fullText === prevText) {
            if (!isDeleting) {
              setTimeout(() => {
                isDeleting = true
              }, delay)
            }
          }
          if (isDeleting && !prevText) {
            setLoopNum((loopNum) => loopNum + 1)
            setText('')
            isDeleting = false
          }
          return isDeleting
            ? fullText.substring(0, prevText.length - 1)
            : fullText.substring(0, prevText.length + 1)
        })
      }, 60)
      return () => clearInterval(interval)
    }
  }, [fullText])
  return `${text}${addPipe ? '|' : ''}`
}

export default useTypeWritterText
