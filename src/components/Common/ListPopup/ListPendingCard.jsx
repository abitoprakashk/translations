import styles from './ListPopup.module.css'
import {useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {utilsUpdatePendingStatus} from '../../../routes/dashboard'

export default function ListPendingCard({
  iid,
  role,
  icon,
  title,
  desc,
  getActiveInstituteList,
  getPendingInstituteList,
}) {
  const {adminInfo} = useSelector((state) => state)
  const tempArray = desc.split(' ')
  const institute_id = tempArray[1]
  const {t} = useTranslation()

  const handleAccept = () => {
    const params = {
      institute_id: institute_id,
      iid: iid,
      status: 1,
    }
    utilsUpdatePendingStatus(params).then((status) => {
      if (status) {
        getActiveInstituteList()
        getPendingInstituteList(adminInfo?.phone_number, adminInfo?.email)
      }
    })
  }
  const handleReject = () => {
    const params = {
      institute_id: institute_id,
      iid: iid,
      phone_number: adminInfo?.phone_number,
      email: adminInfo?.email,
      status: 3,
    }
    utilsUpdatePendingStatus(params).then((status) => {
      if (status) {
        getActiveInstituteList()
        getPendingInstituteList(adminInfo?.phone_number, adminInfo?.email)
      }
    })
  }

  return (
    <>
      <div className={`hidden lg:block`}>
        <div className={styles.container}>
          <img src={icon} className={styles.image} alt="icon" />
          <div className={styles.ml}>
            <div className={styles.name}>{title}</div>
            <div className={styles.descContainer}>
              <div className={styles.desc}>{desc}</div>
              <img
                src="https://storage.googleapis.com/tm-assets/icons/secondary/dot-secondary.svg"
                alt=""
                className="w-1 h-1 mx-2"
              />
              <div className={styles.desc}>{role}</div>
            </div>
          </div>
          <div className={styles.wrap}>
            <div className={styles.acceptButton} onClick={handleAccept}>
              {t('accept')}
            </div>
            <div className={styles.rejectButton} onClick={handleReject}>
              {t('reject')}
            </div>
          </div>
        </div>
      </div>
      <div className={`lg:hidden ${styles.mt2}`}>
        <div className={`${styles.mContainer}`}>
          <div className={`${styles.mt}  ${styles.mTopContainer}`}>
            <img src={icon} className={styles.mImage} alt="icon" />
            <div className={styles.margin}>
              <div className={styles.name}>{title}</div>
              <div className={styles.descContainer}>
                <div className={styles.desc}>{desc}</div>
                <img
                  src="https://storage.googleapis.com/tm-assets/icons/secondary/dot-secondary.svg"
                  alt=""
                  className="w-1 h-1 mx-2"
                />
                <div className={styles.desc}>{role}</div>
              </div>
            </div>
          </div>
          <div className={styles.mActionContainer}>
            <div className={styles.mAcceptButton} onClick={handleAccept}>
              {t('accept')}
            </div>
            <div className={styles.mRejectButton} onClick={handleReject}>
              {t('reject')}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
