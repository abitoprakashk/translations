import {t} from 'i18next'
import backgroundSVG from './assets/texture.svg'
import fieldsSVGDark from './assets/fieldsDark.svg'
import backgroundSVGDark from './assets/textureDark.svg'
import fieldsSVG from './assets/fields.svg'
import BackgroundPanel from './Components/BackgroundPanel/BackgroundPanel'
import ImagesPanel from './Components/ImagesPanel'
import TemplateFieldsPanel from './Components/TemplateFieldsPanel'
import {
  BACKGROUND,
  FIELDS,
  IMAGES,
  LAYOUT,
  WATERMARK,
} from './CreateTemplate.constant'
import {TEMPLATE_GENERATOR_EVENTS} from '../../../../components/TemplateGenerator/TemplateGenerator.events'
import TemplateLayoutTab from '../../../../components/TemplateGenerator/LeftPanel/Components/TemplateLayoutTab/TemplateLayoutTab'
import WatermarkForTemplate from '../../../../components/TemplateGenerator/LeftPanel/Components/WatermarkTemplate/WatermarkForTemplate'
import {CERTIFICATE} from '../../CustomCertificate.constants'

export const leftPanelItems = (userType) => {
  return {
    [BACKGROUND]: {
      title: t('background'),
      icon: backgroundSVG,
      iconDark: backgroundSVGDark,
      type: 'img',
      component: <BackgroundPanel />,
      eventName:
        TEMPLATE_GENERATOR_EVENTS.TEMPLATE_MAKER_TEMPLATE_BACKGROUND_CLICKED_TFI,
    },
    [FIELDS]: {
      title: t('fields'),
      icon: fieldsSVG,
      iconDark: fieldsSVGDark,
      type: 'img',
      component: <TemplateFieldsPanel userType={userType} />,
      eventName:
        TEMPLATE_GENERATOR_EVENTS.TEMPLATE_MAKER_TEMPLATE_FIELDS_CLICKED_TFI,
    },
    [IMAGES]: {
      title: t('images'),
      icon: 'image',
      type: 'ico',
      component: <ImagesPanel />,
      eventName:
        TEMPLATE_GENERATOR_EVENTS.TEMPLATE_MAKER_TEMPLATE_IMAGE_CLICKED_TFI,
    },
    [WATERMARK]: {
      title: t('watermark'),
      icon: 'colorTray',
      type: 'ico',
      component: <WatermarkForTemplate module={CERTIFICATE} />,
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
      title: '',
      icon: '',
      type: '',
    },
  }
}
