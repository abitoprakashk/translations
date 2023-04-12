import {useCallback, useEffect} from 'react'
import {isMobile as isMobileFunc} from '@teachmint/krayon'
import {setisMobileAction} from '../redux/actions/commonAction'
import {useDispatch} from 'react-redux'
import {debounce} from '../utils/Helpers'

// Tells whether the device is mobile or not
//  Adds `isMobile` key to redux.
export default function useIsMobileReduxUpdate() {
  const dispatch = useDispatch()

  const dispatchAction = useCallback(
    debounce(() => {
      dispatch(setisMobileAction(isMobileFunc()))
    }, 200),
    []
  )

  useEffect(() => {
    dispatchAction()
    window.addEventListener('resize', dispatchAction)
    return () => {
      window.removeEventListener('resize', dispatchAction)
    }
  }, [])
}
