import BackgroundPanelWrapper from './components/BackgroundPanelWrapper'
import {t} from 'i18next'
import {TEMPLATE_GENERATOR_EVENTS} from '../../../../components/TemplateGenerator/TemplateGenerator.events'
import backgroundSVG from '../../../CustomCertificate/components/CreateTemplate/assets/texture.svg'
import fieldsSVGDark from '../../../CustomCertificate/components/CreateTemplate/assets/fieldsDark.svg'
import backgroundSVGDark from '../../../CustomCertificate/components/CreateTemplate/assets/textureDark.svg'
import fieldsSVG from '../../../CustomCertificate/components/CreateTemplate/assets/fields.svg'
import TemplateFieldsPanel from '../../../CustomCertificate/components/CreateTemplate/Components/TemplateFieldsPanel'
import TemplateLayoutTab from '../../../../components/TemplateGenerator/LeftPanel/Components/TemplateLayoutTab/TemplateLayoutTab'
import ImagesPanelWrapper from './components/ImagesPanelWrapper'
// import WatermarkForTemplate from '../../../../components/TemplateGenerator/LeftPanel/Components/WatermarkTemplate/WatermarkForTemplate'
// import {IDCARD} from '../../CustomId.constants'
import qrDark from './assets/qrDark.svg'
import qr from './assets/qr.svg'
import QrCodePanel from './components/QrCodePanel/QrCodePanel'

export const BACKGROUND = 'background'
export const IMAGES = 'images'
export const FIELDS = 'fields'
export const WATERMARK = 'watermark'
export const LAYOUT = 'layout'

export const leftPanelItems = (userType) => {
  return {
    [BACKGROUND]: {
      title: t('background'),
      icon: backgroundSVG,
      iconDark: backgroundSVGDark,
      type: 'img',
      component: <BackgroundPanelWrapper />,
      eventName:
        TEMPLATE_GENERATOR_EVENTS.TEMPLATE_MAKER_TEMPLATE_BACKGROUND_CLICKED_TFI,
    },
    [FIELDS]: {
      title: t('fields'),
      icon: fieldsSVG,
      iconDark: fieldsSVGDark,
      type: 'img',
      component: (
        <TemplateFieldsPanel userType={userType} showCustomFields={false} />
      ),
      eventName:
        TEMPLATE_GENERATOR_EVENTS.TEMPLATE_MAKER_TEMPLATE_FIELDS_CLICKED_TFI,
    },
    [IMAGES]: {
      title: t('images'),
      icon: 'image',
      type: 'ico',
      component: <ImagesPanelWrapper />,
      eventName:
        TEMPLATE_GENERATOR_EVENTS.TEMPLATE_MAKER_TEMPLATE_IMAGE_CLICKED_TFI,
    },
    [LAYOUT]: {
      title: t('layout'),
      icon: 'borderAll',
      type: 'ico',
      component: <TemplateLayoutTab />,
      eventName:
        TEMPLATE_GENERATOR_EVENTS.TEMPLATE_MAKER_TEMPLATE_IMAGE_CLICKED_TFI,
    },
    empty: {
      title: t('qrCode'),
      icon: qr,
      iconDark: qrDark,
      type: 'img',
      component: <QrCodePanel userType={userType} />,
      eventName:
        TEMPLATE_GENERATOR_EVENTS.TEMPLATE_MAKER_TEMPLATE_QR_CODE_CLICKED_TFI,
    },
    empty2: {
      title: '',
      icon: '',
      type: '',
    },
  }
}
