import Permission from '../Permission/Permission'
import styles from './ToggleSwitch.module.scss'

export default function ToggleSwitch({
  handleChange,
  value,
  permissionId = null,
}) {
  return (
    <div className={styles.toggleSwitch}>
      <span>
        <input
          type="checkbox"
          checked={value}
          className={styles.toggleInput}
          onChange={handleChange}
        />
        {permissionId ? (
          <Permission permissionId={permissionId}>
            <button
              className={styles.slider}
              type="button"
              onClick={() => handleChange(!value)}
            ></button>
          </Permission>
        ) : (
          <button
            className={styles.slider}
            type="button"
            onClick={() => handleChange(!value)}
          ></button>
        )}
      </span>
    </div>
  )
}
