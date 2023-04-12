export const diffChecker = (initialState, currentState, observeKeys = []) => {
  const keys = Object.keys(currentState)
  const changed = {}

  keys.forEach((key) => {
    let sourceState = initialState[key] || {}
    let targetState = currentState[key] || {}
    if (
      observeKeys.some((subKey) => sourceState[subKey] !== targetState[subKey])
    ) {
      changed[key] = targetState
    }
  })

  return {changes: changed, hasChanged: Object.keys(changed).length > 0}
}
