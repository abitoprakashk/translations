const biometricSubRoutesList = [
  '/institute/dashboard/hrms-configuration/biometric-machines',
  '/institute/dashboard/hrms-configuration/biometric-users',
  '/institute/dashboard/hrms-configuration/biometric-users/all',
  '/institute/dashboard/hrms-configuration/biometric-users/registered',
  '/institute/dashboard/hrms-configuration/biometric-users/unregistered',
]

export const biometricUsersRoutesList = {
  all: '/institute/dashboard/hrms-configuration/biometric-users/all',
  registered:
    '/institute/dashboard/hrms-configuration/biometric-users/registered',
  unregistered:
    '/institute/dashboard/hrms-configuration/biometric-users/unregistered',
}

export const UserIDStatusTabMap = {
  '/institute/dashboard/hrms-configuration/biometric-users/all': null,
  '/institute/dashboard/hrms-configuration/biometric-users/registered': true,
  '/institute/dashboard/hrms-configuration/biometric-users/unregistered': false,
}

export default biometricSubRoutesList
