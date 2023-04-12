import {Modal, MODAL_CONSTANTS, TabGroup} from '@teachmint/krayon'
import {t} from 'i18next'
import {useState} from 'react'
import BulkImageUpload from '../BulkImageUpload/BulkImageUpload'
import UpdateStudentInfomation from '../UpdateStudentInfomation/UpdateStudentInfomation'
import styles from './UpdateDataModal.module.css'

export default function UpdateDataModal({open, setShow}) {
  const [selectedTab, setSelectedTab] = useState('studentInformation')

  const tabOptions = {
    studentInformation: {
      id: 'studentInformation',
      label: t('studentInformation'),
      component: <UpdateStudentInfomation setShow={setShow} />,
    },
    uploadPhotos: {
      id: 'uploadPhotos',
      label: t('uploadPhotos'),
      component: <BulkImageUpload setShow={setShow} />,
    },
  }

  return (
    <Modal
      isOpen={open}
      onClose={() => setShow(false)}
      header={t('bulkupdate')}
      classes={{content: styles.content}}
      footer={
        <div id="student-update-data-modal" className={styles.footer}></div>
      }
      size={MODAL_CONSTANTS.SIZE.LARGE}
    >
      <div>
        <div className={styles.tabGroupWrapper}>
          <TabGroup
            showMoreTab={false}
            tabOptions={Object.values(tabOptions)}
            selectedTab={selectedTab}
            onTabClick={({id}) => setSelectedTab(id)}
          />
        </div>

        <div className={styles.componentWrapper}>
          {tabOptions[selectedTab]?.component}
        </div>
      </div>
    </Modal>
  )
}
