import {PERMISSION_CONSTANTS} from '../../../utils/permission.constants'

export const ANNOUNCEMENT_TYPE = {
  ANNOUNCEMENT: 0,
  FEEDBACK: 1,
  POLL: 2,
  SMS: 3,
}

export const COMMON_ICONS = {
  FORWARD_ARROW: 'arrowForwardIos',
}

export const COMMUNICATION_NOT_CREATED = {
  HEADER_TITLE: 'Communication',
  HEADER_ICON: 'announcement',
  HEADER_ICON_BACKGROUND_COLOR: 'announcement',
  HEADER_CTA_TEXT: '',
  HEADER_CTA_TEXT_BACKGROUND_COLOR: '',
  HEADER_CTA_TEXT_PERMISSIONS: '',
  HEADER_CTA_REDIRECT_LINK: '',
  BODY_ICON: 'announcement',
  BODY_CTA_TEXT: 'Create Now',
  BODY_DESCRIPTION_TEXT: 'No communication created',
  BODY_CTA_TEXT_COLOR: '',
  BODY_CTA_TEXT_BACKGROUND_COLOR: '',
  BODY_CTA_TEXT_PERMISSIONS:
    PERMISSION_CONSTANTS.communicationController_announcement_create,
  BODY_CTA_REDIRECT_LINK: '/institute/dashboard/communication/all-posts',
}

export const ANNOUNCEMENT = {
  HEADER_TITLE: 'Last Announcement',
  HEADER_ICON: 'announcement',
  HEADER_ICON_BACKGROUND_COLOR: 'announcement',
  HEADER_CTA_TEXT: 'view',
  HEADER_CTA_TEXT_BACKGROUND_COLOR: '',
  HEADER_CTA_TEXT_PERMISSIONS: '',
  HEADER_CTA_REDIRECT_LINK: '',
  FOOTER_SEEN_TEXT: 'Seen',
  FOOTER_NOT_SEEN_TEXT: 'Not yet seen',
  FOOTER_NOTIFY_TEXT: 'Notified via SMS',
  FOOTER_SEEN_REDIRECT_LINK: '/institute/dashboard/communication/all-posts',
  FOOTER_NOT_SEEN_REDIRECT_LINK: '/institute/dashboard/communication/all-posts',
  FOOTER_NOTIFY_REDIRECT_LINK: '/institute/dashboard/communication/all-posts',
}

export const SMS = {
  HEADER_TITLE: 'Last SMS',
  HEADER_ICON: 'sms',
  HEADER_ICON_BACKGROUND_COLOR: '--tm-kr-color-pastels-feijoa-110',
  HEADER_CTA_TEXT: 'view',
  HEADER_CTA_TEXT_BACKGROUND_COLOR: '',
  HEADER_CTA_TEXT_PERMISSIONS: '',
  HEADER_CTA_REDIRECT_LINK: '',
  FOOTER_RECIPIENT_TEXT: 'RecipientscommunicationWidgetBodyEmptyIcon',
  FOOTER_BALANCE_TEXT: 'SMS balance left',
  FOOTER_RECIPIENT_REDIRECT_LINK: '/institute/dashboard/communication/sms',
}
