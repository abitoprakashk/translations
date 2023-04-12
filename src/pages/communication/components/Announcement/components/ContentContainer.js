import React from 'react'
import Message from './Message/Message'
import UserSegment from '../../UserSegment/UserSegment'
import styles from '../../../Communication.module.css'

const ContentContainer = ({step, data, setData}) => {
  let content = ''
  switch (step) {
    case 'Message':
      content = <Message data={data} setData={setData} />
      break
    case 'Receivers':
      content = <UserSegment />
      break
    default:
      return null
  }
  return <div className={styles.contentSection}>{content}</div>
}

export default ContentContainer
