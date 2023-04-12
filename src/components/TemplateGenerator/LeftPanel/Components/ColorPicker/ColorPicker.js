import {useState, useRef} from 'react'
import {CirclePicker, ChromePicker} from 'react-color'
import styles from './ColorPicker.module.css'
import {useOutsideClickHandler} from '@teachmint/krayon'
import HeaderWithAddButton from '../HeaderWithAddButton/HeaderWithAddButton'

const ColorPicker = ({colors, onColorChange, activeColor, label = ''}) => {
  const [color, setColor] = useState('')
  const [showChromePicker, toggleChromePicker] = useState(false)
  const colorPickerRef = useRef('')
  useOutsideClickHandler(colorPickerRef, () => {
    toggleChromePicker(false)
  })

  return (
    <>
      <div className={styles.wrapper} ref={colorPickerRef}>
        <HeaderWithAddButton
          action={() => toggleChromePicker(!showChromePicker)}
          label={label}
        />
        {showChromePicker && (
          <div className={styles.popover}>
            <ChromePicker
              onChange={(color) => {
                setColor(color.hex)
              }}
              onChangeComplete={(color) => onColorChange(color.hex)}
              color={color || activeColor}
              disableAlpha={true}
            />
          </div>
        )}
      </div>
      <CirclePicker
        color={activeColor}
        onChange={(color) => {
          onColorChange(color.hex)
        }}
        colors={colors}
        circleSize={30}
        circleSpacing={4}
        className={styles.container}
      />
    </>
  )
}

export default ColorPicker
