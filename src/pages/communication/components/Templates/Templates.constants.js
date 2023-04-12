import styles from '../../Communication.module.css'
export const TemplatesConstants = {
  reciever_mapping: {
    Students: ['student', 'unassigned'],
    Teachers: ['teacher', 'unassigned'],
    All: ['teacher', 'student', 'unassigned'],
    None: [],
  },

  iconMap: {
    Alerts: {name: 'caution', style: styles.template_caution, type: 'filled'},
    Wishes: {name: 'celebration', style: styles.template_wish, type: 'filled'},
    Payments: {
      name: 'rupeeSymbol',
      style: styles.template_rupee,
      type: 'filled',
    },
    Events: {name: 'day', style: styles.template_day, type: 'outlined'},
  },
}
