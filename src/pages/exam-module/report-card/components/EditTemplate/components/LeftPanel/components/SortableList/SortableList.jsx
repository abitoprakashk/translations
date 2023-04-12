import {Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import Sortable from 'react-sortablejs'
import {useSelector} from 'react-redux'
import styles from './SortableList.module.css'
import {events} from '../../../../../../../../../utils/EventsConstants'

const ListItem = ({key, id, children, hasDeleteBtn, onDelete}) => {
  return (
    <div className={styles.wrapper} key={key || id} data-id={id || key}>
      <div className="flex items-center">
        <Icon
          name="dragIndicator"
          size={ICON_CONSTANTS.SIZES.XXX_SMALL}
          className={styles.pointerCursor}
        />
        {children}
      </div>
      {hasDeleteBtn && (
        <Icon
          name="delete1"
          onClick={() => onDelete(id)}
          type={ICON_CONSTANTS.TYPES.SECONDARY}
          size={ICON_CONSTANTS.SIZES.X_SMALL}
        />
      )}
    </div>
  )
}

const SortableList = ({
  sortableKey,
  onChange,
  headerType,
  subHeaderType,
  children,
}) => {
  const eventManager = useSelector((state) => state.eventManager)

  const handleChange = (list) => {
    eventManager.send_event(events.REPORT_CARD_ORDER_CHANGE_CLICKED_TFI, {
      header_type: headerType,
      sub_header_type: subHeaderType,
    })
    onChange(list)
  }

  return (
    <Sortable
      key={sortableKey}
      options={{
        group: 'examTypes',
        animation: 400,
        forceFallback: true,
        chosenClass: styles.sortableChosen,
        dragClass: styles.sortableDrag,
      }}
      onChange={handleChange}
    >
      {children}
    </Sortable>
  )
}

SortableList.ListItem = ListItem

export default SortableList
