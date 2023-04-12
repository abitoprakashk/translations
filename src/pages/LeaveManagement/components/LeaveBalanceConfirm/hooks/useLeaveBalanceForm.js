import produce from 'immer'
import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {events} from '../../../../../utils/EventsConstants'
import {submitSessionLeaves} from '../../../redux/actions/leaveManagement.actions'
import {LEAVEBALANCE_DEFAULT} from '../LeaveBalance.constant'

const useLeaveForm = () => {
  const [leaves, setleaves] = useState(LEAVEBALANCE_DEFAULT) // leaves: casual + sick

  // get session leave balance
  const {
    data: {balance},
    submitting,
    submitError,
    submitSuccess,
  } = useSelector((state) => state.leaveManagement.yearlyLeavesOfInstitute)

  const eventManager = useSelector((state) => state.eventManager)

  const dispatch = useDispatch()

  useEffect(() => {
    // balance is called in leavemanagement.js
    if (balance) {
      setleaves(() => {
        return produce(leaves, (draft) => {
          draft[0].value = balance.SICK
          draft[1].value = balance.CASUAL
        })
      })
    }
  }, [balance])

  const setInputValue = (index, value) => {
    setleaves(() => {
      return produce(leaves, (draft) => {
        draft[index].value = value
      })
    })
  }

  const submitLeaves = async () => {
    // submit leaves
    const sick = parseInt(leaves[0].value)
    const casual = parseInt(leaves[1].value)
    dispatch(submitSessionLeaves({casual, sick}))
    eventManager.send_event(events.CONFIRM_LEAVE_BALANCE_CLICKED_TFI)
  }

  return {
    leaves,
    submitting,
    success: submitSuccess,
    errors: submitError,
    setInputValue,
    submitLeaves,
  }
}

export default useLeaveForm
