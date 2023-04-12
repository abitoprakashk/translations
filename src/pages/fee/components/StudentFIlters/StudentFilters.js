import styles from './StudentFilters.module.css'
import {events} from '../../../../utils/EventsConstants'
import {useSelector} from 'react-redux'
import {studentFeeStatus} from '../../fees.constants'

const StudentFilters = ({filters, sections, onApplyFilters}) => {
  const eventManager = useSelector((state) => state.eventManager)
  eventManager.send_event(events.FEE_ADD_FILTER_CLICKED_TFI, {
    screen_name: 'fee_collection',
  })
  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = {
      paymentStatus: formData.get('paymentStatus'),
      sectionIds: formData.getAll('classes'),
    }
    onApplyFilters && onApplyFilters(data)
  }
  const studentFeesStatus = [
    {
      key: 'ALL',
      value: studentFeeStatus.ALL,
    },
    {
      key: 'PAID',
      value: studentFeeStatus.PAID,
    },
    {
      key: 'DUE',
      value: studentFeeStatus.DUE,
    },
  ]
  return (
    <div className={styles.dropdown}>
      <form onSubmit={handleSubmit}>
        <div className={styles.filters}>
          <div>
            <header className={styles.filterHeader}>Payment Status</header>
            {studentFeesStatus.map((feeStatus, i) => (
              <section key={`paymentMode_${i}`}>
                <label>
                  <input
                    type="radio"
                    value={feeStatus.key}
                    name="paymentStatus"
                    defaultChecked={filters.paymentStatus == feeStatus.key}
                  />
                  <span className={styles.filterText}> {feeStatus.value}</span>
                </label>
              </section>
            ))}
          </div>
          <div>
            <header className={styles.filterHeader}>Section</header>
            {sections.map((section, i) => (
              <section key={i}>
                <label>
                  <input
                    type="checkbox"
                    value={section.id}
                    name="classes"
                    defaultChecked={
                      filters.sectionIds
                        ? filters.sectionIds.indexOf(section.id) !== -1
                        : ''
                    }
                  />
                  <span className={styles.filterText}>{section.name}</span>
                </label>
              </section>
            ))}
          </div>
        </div>
        <div style={{textAlign: 'right', padding: '5px'}}>
          <button className="fill" type="submit">
            Apply Filter
          </button>
        </div>
      </form>
    </div>
  )
}

export default StudentFilters
