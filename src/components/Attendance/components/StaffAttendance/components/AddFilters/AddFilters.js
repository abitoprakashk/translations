import classNames from 'classnames'
import styles from './AddFilters.module.css'
import {useTranslation} from 'react-i18next'
import {Button} from '@teachmint/common'

const AddFilters = ({filters, onApplyFilters}) => {
  const {t} = useTranslation()
  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = {
      staffRolesNames: formData.getAll('staffRolesNames'),
    }
    onApplyFilters && onApplyFilters(data)
  }

  const staffRoles = [
    {
      key: 'ADMIN',
      label: t('admin'),
    },
    {
      key: 'ACCOUNTANT',
      label: t('accountant'),
    },
    {
      key: 'ADMISSION_MANAGER',
      label: t('admissionManager'),
    },
    {
      key: 'ACADEMIC_ADMINISTRATOR',
      label: t('academicAdminstrator'),
    },
    {
      key: 'HOSTEL_WARDEN',
      label: t('hostelWarden'),
    },
    {
      key: 'TEACHER',
      label: t('teacher'),
    },
    {
      key: 'LIBRARIAN',
      label: t('librarian'),
    },
    {
      key: 'DRIVER',
      label: t('driver'),
    },
    {
      key: 'CONDUCTOR',
      label: t('conductor'),
    },
  ]

  return (
    <div className={classNames(styles.dropdown)}>
      <form onSubmit={handleSubmit}>
        <div className={styles.filters}>
          <div>
            <header>{t('roles')}</header>
            {staffRoles.map((status, i) => (
              <section key={`paymentStatus_${i}`} className="p-0">
                <label className="pl-0">
                  <input
                    type="checkbox"
                    value={status.key}
                    name="staffRolesNames"
                    defaultChecked={
                      filters.staffRolesNames
                        ? filters.staffRolesNames.indexOf(status.key) !== -1
                        : ''
                    }
                  />
                  <span className="ml-2">{status.label}</span>
                </label>
              </section>
            ))}
          </div>
        </div>

        <div className={classNames(styles.applyFiltersBlock)}>
          <Button size="big" className={styles.applyFilterButton} type="fill">
            {t('addFilters')}
          </Button>
        </div>
      </form>
    </div>
  )
}
export default AddFilters
