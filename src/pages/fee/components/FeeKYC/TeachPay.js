import {Modal, MODAL_CONSTANTS} from '@teachmint/krayon'
import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import globalActions from '../../../../redux/actions/global.actions'
import {
  getTeachPayUrlByPhoneNo,
  getTeachPayUrlByEmail,
} from '../../fees.constants'
import TeachPayGreeting from '../TeachPayGreeting/TeachPayGreeting'

const TeachPay = ({setShowTeachPay, teachPaySetup, credentialsList}) => {
  const dispatch = useDispatch()
  const register_client = teachPaySetup?.register_client
  const upload_student_bulk = teachPaySetup?.upload_student_bulk
  const [showModal, setShowModal] = useState(false)
  const {instituteInfo, currentAdminInfo} = useSelector((state) => state)

  const closeTeachPayModal = () => {
    if (credentialsList === 0) {
      setShowModal(true)
    } else {
      if (currentAdminInfo?.phone_number) {
        window.open(
          getTeachPayUrlByPhoneNo(
            instituteInfo._id,
            currentAdminInfo?.phone_number.split('-')[0],
            currentAdminInfo?.phone_number.split('-')[1]
          ),
          '_blank'
        )
      } else {
        window.open(
          getTeachPayUrlByEmail(instituteInfo._id, currentAdminInfo?.email),
          '_blank'
        )
      }
      setShowTeachPay(false)
    }
  }

  const dispatchStudentRegister = () => {
    dispatch(globalActions.studentDataSendToTeachPay.request())
  }

  const dispatchAdminRegister = () => {
    const successAction = () => closeTeachPayModal()
    dispatch(
      globalActions.adminToTeachPay.request({}, successAction, () => {
        setShowTeachPay(false)
      })
    )
  }

  const dispatchClientRegister = () => {
    const successAction = () => {
      dispatchAdminRegister()
      dispatchStudentRegister()
    }
    dispatch(globalActions.enableTeachpay.request({}, successAction))
  }

  useEffect(() => {
    if (register_client) {
      dispatchAdminRegister()
      if (!upload_student_bulk) dispatchStudentRegister()
    } else dispatchClientRegister()
  }, [])

  return (
    <>
      {showModal && (
        <Modal
          isOpen
          size={MODAL_CONSTANTS.SIZE.X_LARGE}
          children={
            <TeachPayGreeting
              setShowModal={setShowModal}
              setShowTeachPay={setShowTeachPay}
            />
          }
        />
      )}
    </>
  )
}

export default TeachPay
