import React from 'react'
import PollQuestion from './PollQuestion/PollQuestion'
import Duration from '../../Duration'
import UserSegment from '../../UserSegment/UserSegment'
import Settings from './../../Settings/Settings.js'
import styles from '../../../Communication.module.css'

const ContentContainer = ({step, data, setData}) => {
  let content = ''
  switch (step) {
    case 'Question':
      content = <PollQuestion data={data} setData={setData} />
      break
    case 'Duration':
      content = <Duration />
      break
    case 'Receivers':
      content = <UserSegment />
      break
    case 'Settings':
      content = <Settings surveyType="poll" />
      break
  }
  return <div className={styles.contentSection}>{content}</div>
}

export default ContentContainer
