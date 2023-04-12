import React from 'react'
import Lottie from 'lottie-react'
import './loader.scss'
import gridLoader from '../../../assets/images/icons/loader/lottie-loader.json'

export default class Loader extends React.Component {
  render() {
    const {style = {}, type = 'circle', show} = this.props

    return show ? (
      type === 'grid' ? (
        <div className="gridLoaderContainer">
          <Lottie animationData={gridLoader} className="gridLoader" />
        </div>
      ) : (
        <div
          className="deleteModal"
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            zIndex: '999999990',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            ...style,
          }}
        >
          <div className="loader" />
        </div>
      )
    ) : null
  }
}
