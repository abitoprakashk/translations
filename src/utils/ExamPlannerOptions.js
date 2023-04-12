import * as EPC from './ExamPlannerConstants'
import {PERMISSION_CONSTANTS} from './permission.constants'

export const EXAM_TOOLTIP_OPTIONS = [
  {
    label: 'Edit Exam Schedule',
    action: EPC.ACT_EXAM_EDIT,
    labelStyle: '',
    active: true,
    permissionId: PERMISSION_CONSTANTS.academicPlannerController_upsert_create,
  },
  {
    label: 'Delete',
    action: EPC.ACT_EXAM_DELETE,
    labelStyle: 'tm-cr-rd-1',
    active: true,
    permissionId:
      PERMISSION_CONSTANTS.academicPlannerController_deleteRoute_delete,
  },
]
