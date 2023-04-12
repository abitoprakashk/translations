import {t} from 'i18next'
import backgroundSVG from './assets/texture.svg'
import fieldsSVGDark from './assets/fieldsDark.svg'
import backgroundSVGDark from './assets/textureDark.svg'
import fieldsSVG from './assets/fields.svg'
import {TEMPLATE_GENERATOR_EVENTS} from '../TemplateGenerator.events'

export const BACKGROUND = 'background'
export const IMAGES = 'images'
export const FIELDS = 'fields'
export const WATERMARK = 'watermark'
export const NONE = 'none'

export const LEFT_PANEL_HEADER = {
  [BACKGROUND]: {
    title: t('background'),
    icon: backgroundSVG,
    iconDark: backgroundSVGDark,
    type: 'img',
    eventName:
      TEMPLATE_GENERATOR_EVENTS.TEMPLATE_MAKER_TEMPLATE_BACKGROUND_CLICKED_TFI,
  },
  [FIELDS]: {
    title: t('fields'),
    icon: fieldsSVG,
    iconDark: fieldsSVGDark,
    type: 'img',
    eventName:
      TEMPLATE_GENERATOR_EVENTS.TEMPLATE_MAKER_TEMPLATE_IMAGE_CLICKED_TFI,
  },
  [IMAGES]: {
    title: t('images'),
    icon: 'image',
    type: 'ico',
    eventName:
      TEMPLATE_GENERATOR_EVENTS.TEMPLATE_MAKER_TEMPLATE_FIELDS_CLICKED_TFI,
  },
  // [WATERMARK]: {
  //   title: t('watermark'),
  //   icon: 'edit',
  // },
}

export const IMAGE_SIZE_LIMIT = '200000'
