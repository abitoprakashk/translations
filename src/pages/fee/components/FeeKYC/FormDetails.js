import styles from './PaymentGateways.module.css'

const FormDetail = ({data, selectedGateWay}) => {
  return (
    <div className={styles.dispData}>
      <span className={styles.subtext}>{data.subText}</span>
      <ul className={styles.failData}>
        {data.listData.map((listItem) => {
          return (
            <li key={listItem} className={styles.listData}>
              {listItem.replace('{gateway}', selectedGateWay)}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default FormDetail
