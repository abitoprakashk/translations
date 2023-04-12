import {useEffect} from 'react'

export const useElementOutSideClickHandler = (
  element,
  onOutsideClick,
  onInsideClick
) => {
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.composedPath().includes(element)) {
        onOutsideClick(event)
      } else if (onInsideClick) {
        onInsideClick(event)
      }
    }
    document.addEventListener('click', handleOutsideClick)
    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [])
}
