import {ACCESS_LEVEL_ENUM} from '../constant/constant'
// parse module, sub-module permission Map data fetched from backend to store in redux
export const parsePermissionMap = (givenPermissionMapList) => {
  const permissionMapping = {
    moduleList: [], // List of Modules
    subModuleMap: {}, // moduleID -> List of sub-modules
    permissionMap: {}, // sub-module or module ID -> JSON List of permissions ({read:[], create:[],update:[], delete:[]})
  }
  // moduleList
  permissionMapping.moduleList =
    givenPermissionMapList?.map((module) => ({
      _id: module?._id,
      name: module?.name,
    })) || []

  givenPermissionMapList?.forEach((module) => {
    permissionMapping.subModuleMap[module._id] = []
    module?.submodules?.forEach((submodule) => {
      // moduleID -> List of sub-modules
      permissionMapping.subModuleMap[module._id]?.push({
        _id: submodule?._id || module?._id,
        name: submodule?.name || module?.name,
        description: submodule?.description || module?.description,
        manage_disabled: submodule?.manage_disabled || module?.manage_disabled,
        view_disabled: submodule?.view_disabled || module?.view_disabled,
      })
      // sub-module or module ID -> JSON List of permission
      permissionMapping.permissionMap[submodule?._id || module?._id] =
        submodule?.permissions
    })
  })

  return permissionMapping
}

// permissionMap =  {sub-module or module ID : JSON List of permissions}  , const data from redux store
// selectedPermissionMap = {sub-module or module ID : view/manage permission}

// to send selected permission  as list to BACKEND
export const permissionMapToList = (permissionMap, selectedPermissionMap) => {
  if (!permissionMap || !selectedPermissionMap) {
    return []
  }
  const permissionList = [] //List of role's permission
  Object.keys(selectedPermissionMap)?.forEach((subModuleId) => {
    if (selectedPermissionMap[subModuleId] === ACCESS_LEVEL_ENUM.MANAGE) {
      permissionList?.push(
        ...(permissionMap[subModuleId]?.read || []),
        ...(permissionMap[subModuleId]?.create || []),
        ...(permissionMap[subModuleId]?.update || []),
        ...(permissionMap[subModuleId]?.delete || [])
      )
    } else if (
      selectedPermissionMap[subModuleId] === ACCESS_LEVEL_ENUM.VIEW_ONLY
    ) {
      permissionList?.push(...(permissionMap[subModuleId]?.read || []))
    }
  })

  return Array.from(new Set(permissionList))
}

// selectedPermissionList = //List of role's permission
// to show the fetched selected permission in the Permission Table    :  (case - view role )
export const permissionListToMap = (permissionMap, selectedPermissionList) => {
  if (!permissionMap || !selectedPermissionList) {
    return {}
  }
  const permissionSet = new Set(selectedPermissionList)
  const selectedPermissionMap = {}
  Object.keys(permissionMap)?.forEach((subModuleId) => {
    const hasViewAccess = permissionMap[subModuleId]?.read?.every((p) =>
      permissionSet.has(p)
    )

    let hasManageAccess = false
    if (
      permissionMap[subModuleId]?.create?.length > 0 ||
      permissionMap[subModuleId]?.update?.length > 0 ||
      permissionMap[subModuleId]?.delete?.length > 0
    ) {
      hasManageAccess =
        permissionMap[subModuleId]?.create?.every((p) =>
          permissionSet.has(p)
        ) &&
        permissionMap[subModuleId]?.update?.every((p) =>
          permissionSet.has(p)
        ) &&
        permissionMap[subModuleId]?.delete?.every((p) => permissionSet.has(p))
    }

    if (hasManageAccess && hasViewAccess) {
      selectedPermissionMap[subModuleId] = ACCESS_LEVEL_ENUM.MANAGE
    } else if (hasViewAccess) {
      selectedPermissionMap[subModuleId] = ACCESS_LEVEL_ENUM.VIEW_ONLY
    } else {
      selectedPermissionMap[subModuleId] = ACCESS_LEVEL_ENUM.NONE
    }
  })

  return selectedPermissionMap
}
