import styles from './FeeTransactionFilters.module.css'

const FilterItems = ({name, header = '', filters, filterItems}) => {
  return (
    <>
      <header className={styles.filterHeader}>{header}</header>
      {filterItems.map((item) => (
        <section key={item.key}>
          <label>
            <input
              name={name}
              value={item.key}
              type="checkbox"
              defaultChecked={filters[name].includes(item.key)}
            />
            <span className="ml-2">{item.value}</span>
          </label>
        </section>
      ))}
    </>
  )
}
export default FilterItems
