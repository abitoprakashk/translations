import React from 'react'
import classNames from 'classnames'
import styles from './ToggleSwitch.module.css'

class ToggleSwitch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {isToggleOn: false}

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    this.setState((prevState) => ({
      isToggleOn: !prevState.isToggleOn,
    }))
  }

  render() {
    return (
      <div onClick={this.handleClick} className={styles.ToggleSwitch}>
        <div
          className={classNames(
            styles.knob,
            this.state.isToggleOn ? styles.active : ''
          )}
        />
        {/* {this.state.isToggleOn ? 'now it\'s on' : 'now it\'s off'} */}
      </div>
    )
  }
}

export default ToggleSwitch
