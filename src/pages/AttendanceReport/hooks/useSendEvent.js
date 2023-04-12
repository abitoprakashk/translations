import {useSelector} from 'react-redux'

function useSendEvent() {
  const {eventManager} = useSelector((state) => state)

  const sendEvent = (event, data = {}) => {
    eventManager.send_event(event, data)
  }

  return sendEvent
}

export default useSendEvent
