import {Link} from 'react-router-dom'
import classNames from 'classnames'
import styles from './BreadCrumb.module.css'

const BreadCrumb = ({title, link, handleAction}) => {
  return (
    <div className={styles.breadCrumbContainer}>
      <Link to={link} onClick={handleAction}>
        <img
          className="w-3 h-3"
          src="https://storage.googleapis.com/tm-assets/icons/blue/left-full-arrow-blue.svg"
          alt="back"
        />
      </Link>

      <div className={classNames('tm-hdg tm-hdg-14', styles.breadCrumbTitle)}>
        {title}
      </div>
    </div>
  )
}
export default BreadCrumb
