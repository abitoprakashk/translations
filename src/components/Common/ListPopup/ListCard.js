import styles from './ListPopup.module.css'
export default function ListCard({
  num,
  icon,
  title,
  role,
  desc,
  handleSelection,
  selectedItem,
}) {
  return (
    <>
      <div className={`hidden lg:block`}>
        <div
          className={
            selectedItem?.num === num ? styles.selected : styles.container
          }
          onClick={() => {
            handleSelection(num)
          }}
        >
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
        </div>
      </div>
      <div className={`lg:hidden`}>
        <div
          className={
            selectedItem?.num === num ? styles.selected : styles.mCardContainer
          }
          onClick={() => {
            handleSelection(num)
          }}
        >
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
        </div>
      </div>
    </>
  )
}
