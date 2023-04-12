import {Trans} from 'react-i18next'

const receiversLabel = <Trans i18nKey={'receivers'} />
const classLabel = <Trans i18nKey={'class'} />
const roleLabel = <Trans i18nKey={'role'} />
const actionsLabel = <Trans i18nKey={'actions'} />

export const RECEIVER_LIST_TABLE_HEADERS = [
  {key: 'studentDetails', label: receiversLabel},
  {key: 'classAndSection', label: classLabel},
  {key: 'role', label: roleLabel},
  {key: 'action', label: actionsLabel},
]

export const MEMBER_TYPES = {
  NONE: 0,
  ADMIN: 1,
  TEACHER: 2,
  SUPER_ADMIN: 3,
  STUDENT: 4,
  OTHER: 5,
}
