import classNames from 'classnames'
import React, {useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
// import './feedbackResponse.css'
// import feedbackIcon from '../../../../../../../assets/images/icons/message-three-dots-light-grey.svg'
// import studentImage from '../../../../../../../assets/images/login/user-types/student.png'
import SliderScreenHeader from './../../../../../../components/Common/SliderScreenHeader/SliderScreenHeader'
import {fetchFeedbackResponseDataRequestAction} from './../../../../redux/actions/feedbackActions'
import UserResponseInfo from './components/UserResponseInfo'
import styles from './FeedbackResponse.module.css'

export default function FeedbackResponse() {
  const {t} = useTranslation()
  const {feedback} = useSelector((state) => state.communicationInfo)
  const {feddbackResponseLoader, feddbackResponses, feedbackInfo} = feedback
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(
      fetchFeedbackResponseDataRequestAction(feedbackInfo.announcement_id)
    )
  }, [feedbackInfo.announcement_id])

  return (
    <>
      <SliderScreenHeader
        title={t('feedbackResponse')}
        icon={
          'https://storage.googleapis.com/tm-assets/icons/primary/feedback-primary.svg'
        }
      />
      <div className={styles.feedbackResponseSecion}>
        {feddbackResponseLoader ? (
          <div
            className={classNames('loader', styles.feedbackResponseLoader)}
          ></div>
        ) : (
          <>
            <div className={styles.feedbackResponseQuestion}>
              {feedbackInfo ? `Q. ${feedbackInfo.question}` : ''}
            </div>
            <div className={classNames('px-3')}>
              {feddbackResponses.length ? (
                feddbackResponses.map((userResponse, idx) => {
                  return (
                    <div key={`${idx}-${userResponse._id}`}>
                      <UserResponseInfo
                        isAnonymous={feedbackInfo.is_anonymous}
                        userResponse={userResponse}
                      />
                    </div>
                  )
                })
              ) : (
                <>
                  <div className={styles.feedbackResponseNotYet}>
                    {t('noResponsesYet')}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}
