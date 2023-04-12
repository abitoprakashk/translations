import {Button} from '@teachmint/common'
import styles from './Breadcrum.module.css'

const Breadcrumb = ({path}) =>
  path.map((fragment, i) =>
    i === path.length - 1 ? (
      <span key={fragment.label} className={styles.label}>
        {fragment.label}
      </span>
    ) : (
      <span key={`${fragment.label}_${fragment.to}`}>
        {fragment.to ? (
          <a className={styles.breadcrumbLink} href={fragment.to}>
            {fragment.label}
          </a>
        ) : (
          <Button
            type="secondary"
            onClick={(e) => fragment.onClick({index: i, event: e})}
            className={styles.breadcrumbLink}
          >
            {fragment.label}
          </Button>
        )}
        <span className={styles.gt}>&gt;</span>
      </span>
    )
  )

export default Breadcrumb
