import styles from './MenuItem.module.css'
const MenuItem = ({isSelected, title}) => {
  return (
    <div className={styles.container}>
      {isSelected && <div className={styles.vl}></div>}
      <div className={isSelected ? styles.titleSelected : styles.title}>
        {title}
      </div>
    </div>
  )
}

export default MenuItem
