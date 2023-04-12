import React from 'react'
import styles from './PreviewTemplate.module.css'
import classNames from 'classnames'
import {getScreenWidth} from '../../../../../../utils/Helpers'

export default function PreviewTemplate({url, wrapperStyle}) {
  return (
    <div className={classNames(styles.wrapper, wrapperStyle)}>
      {getScreenWidth() > 1024 ? (
        <object
          data={`${
            url || 'http://www.africau.edu/images/default/sample.pdf'
          }#toolbar=0&navpanes=0&scrollbar=0`}
          type="application/pdf"
          width="100%"
          height="100%"
          id="previewReportCard"
        />
      ) : (
        <iframe
          src={`https://docs.google.com/viewer?url=${url}&embedded=true`}
          width="100%"
          height="100%"
        ></iframe>
      )}
    </div>
  )
}
