import React from 'react'
import {HELP_VIDEOS} from '../../fees.constants'
import styles from './FeesHelpVideos.module.css'

export default function FeesHelpVideos({type}) {
  const feeCollectionHelpVideos = [
    // {
    //   url: HELP_VIDEOS.RECURRING_STRUCTURE,
    //   title: 'Set up a dynamic fee structure as per your school needs',
    // },
    // {
    //   url: HELP_VIDEOS.DUE_REPORTS,
    //   title: 'Get all your Unpaid fees reports under a single head',
    // },
    // {
    //   url: HELP_VIDEOS.TRANSACTION,
    //   title: 'View complete transaction history on a single screen',
    // },
    // {
    //   url: HELP_VIDEOS.ONETIME_STRUCTURE,
    //   title: 'Set up a one-time fee structure',
    // },
    // {
    //   url: HELP_VIDEOS.TRANSPORT_STRUCTURE,
    //   title: 'Set up transportation fee structures for all students',
    // },
    {
      url: HELP_VIDEOS.NEW_STRUCTURE_FLOW,
      title: "Create a recurring fee structure as per your school's needs.",
    },
    {
      url: HELP_VIDEOS.COLLECT_FEE,
      title: 'Collect fee for various payment methods',
    },
    {
      url: HELP_VIDEOS.RECEIPT_PAYMENT_SETTINGS,
      title: 'Customize payment receipts as required',
    },
    {
      url: HELP_VIDEOS.COLLECT_FEE,
      title: 'Collect fee for various payment methods',
    },
    {
      url: HELP_VIDEOS.DUE_FEE_REMINDERS,
      title: 'Send due fee reminders to parents and students',
    },
    {
      url: HELP_VIDEOS.ADD_ON_DISCOUNT,
      title: 'Give add-on discounts to students for various fee categories',
    },
    {
      url: HELP_VIDEOS.DEMAND_LETTER,
      title: 'Generate a demand letter in just a few clicks',
    },
  ]

  const feeConfigurationHelpVideos = [
    {
      url: HELP_VIDEOS.NEW_STRUCTURE_FLOW,
      title: "Create a recurring fee structure as per your school's needs.",
    },
    {
      url: HELP_VIDEOS.RECEIPT_PAYMENT_SETTINGS,
      title: 'Customize payment receipts as required',
    },
    {
      url: HELP_VIDEOS.DISCOUNTS,
      title: 'Create and apply customized discounts for the students',
    },
    {
      url: HELP_VIDEOS.FINE_MANAGEMENT,
      title: 'Create fine types for different fee categories',
    },
  ]

  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
        {(type === 'FEE_COLLECTION'
          ? feeCollectionHelpVideos
          : feeConfigurationHelpVideos
        ).map((video, i) => {
          return (
            <div key={i} className={styles.videoWrapper}>
              <span>{video.title}</span>
              <div className={styles.video}>
                <iframe
                  src={video.url}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
