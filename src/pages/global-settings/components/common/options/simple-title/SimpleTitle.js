import styles from './SimpleTitle.module.css'
const SimpleTitle = ({title, handleAction}) => {
  return (
    <>
      <div className={styles.simpleTitleContainer} onClick={handleAction}>
        {title}
      </div>
    </>
  )
}

export default SimpleTitle
