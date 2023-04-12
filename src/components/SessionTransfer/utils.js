import {STEPPER_CONSTANTS} from '@teachmint/krayon'
import {
  NODE_CLASS,
  NODE_DEPARTMENT,
  NODE_SESSION,
  NODE_SECTION,
} from '../../utils/SchoolSetupConstants'
import {STEPS_ORDER} from './constants'

const CHILD_KEYS = {
  [NODE_SESSION]: 'department',
  [NODE_DEPARTMENT]: 'standard',
  [NODE_CLASS]: 'section',
}

export const getSessionTransferSteps = (steps, activeStepId) => {
  const activeStepOrder = STEPS_ORDER[activeStepId]

  return steps.map((step, index) => ({
    ...step,
    status: getStepStatus(index + 1, activeStepOrder),
  }))
}

export const getStepStatus = (stepIndex, activeIndex) => {
  if (stepIndex < activeIndex) {
    return STEPPER_CONSTANTS.STATUS.COMPLETED
  }

  return stepIndex === activeIndex
    ? STEPPER_CONSTANTS.STATUS.IN_PROGRESS
    : STEPPER_CONSTANTS.STATUS.NOT_STARTED
}

export const constructHierarchy = (instituteHierarchy) =>
  instituteHierarchy ? parseHierarchyNode(instituteHierarchy) : {}

const parseHierarchyNode = (node, parent) => {
  const nodeDetails = getHierarchyNodeDetails(node, parent)

  if (node.children?.length && CHILD_KEYS[node.type]) {
    nodeDetails[CHILD_KEYS[node.type]] = node.children.map((child) =>
      parseHierarchyNode(child, nodeDetails)
    )
  }
  return nodeDetails
}

const getHierarchyNodeDetails = (node, parent) => ({
  id: node.id,
  name: getHierarchyNodeName(node, parent),
  type: node.type,
  originalName: node.name,
})

const getHierarchyNodeName = (node, parent) =>
  node.type === NODE_SECTION
    ? `${parent.originalName} - ${node.name}`
    : node.name

export const getSessionIdDict = (sessions) =>
  sessions.reduce((acc, session) => {
    acc[session._id] = session
    return acc
  }, {})
