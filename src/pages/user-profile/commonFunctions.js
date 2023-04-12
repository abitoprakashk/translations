import {Icon} from '@teachmint/common'

// Get slider header part icon
export const getSliderHeaderIcon = ({
  color,
  name,
  size,
  type,
  className = '',
}) => {
  const iconHTML = (
    <Icon
      color={color}
      name={name}
      size={size}
      type={type}
      className={className}
    />
  )
  return iconHTML
}
