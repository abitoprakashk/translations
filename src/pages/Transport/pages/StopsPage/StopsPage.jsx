import styles from './stopsPage.module.css'
import SchoolAddress from './components/SchoolAddress/SchoolAddress'
import StopsListing from './components/StopsListing/StopsListing'

export default function StopsPage() {
  return (
    <div className={styles.wrapper}>
      <SchoolAddress />
      <StopsListing />
    </div>
  )
}
