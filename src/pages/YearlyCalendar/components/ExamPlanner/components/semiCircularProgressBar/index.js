import './index.css'
export default function SemiCircularProgressBar({
  isTeacher,
  percentage,
  child,
}) {
  let cssPropBar = {},
    cssPropCircle = {},
    cssPropInnerCircle = {}

  cssPropBar = {
    transform: `rotate(${
      45 + (percentage < 0 ? 0 : percentage) * 1.8 * 1 + 'deg'
    })`,
    border: `8px solid ${
      isTeacher
        ? '#F7F9FC'
        : percentage <= 33
        ? '#B53F3F'
        : percentage <= 67
        ? '#BE7E28'
        : '#298F64'
    }`,
    borderBottomColor: `${
      isTeacher
        ? percentage <= 33
          ? '#EB5757'
          : percentage <= 67
          ? '#EEA036'
          : '#40B47B'
        : '#ffffff'
    }`,
    borderRightColor: `${
      isTeacher
        ? percentage <= 33
          ? '#EB5757'
          : percentage <= 67
          ? '#EEA036'
          : '#40B47B'
        : '#ffffff'
    }`,
  }
  cssPropCircle = {
    transform: `rotate(${
      -50 + (percentage < 0 ? 0 : percentage) * 1.8 * 1 + 'deg'
    })`,
  }
  cssPropInnerCircle = {
    backgroundColor: `${
      isTeacher
        ? percentage <= 33
          ? '#EB5757'
          : percentage <= 67
          ? '#EEA036'
          : '#40B47B'
        : percentage <= 33
        ? '#B53F3F'
        : percentage <= 67
        ? '#BE7E28'
        : '#298F64'
    }`,
  }

  return (
    <div className="progress">
      <div className="bar-overflow">
        <div className="bar" style={cssPropBar}></div>
      </div>

      <div className="circle" style={cssPropCircle}>
        <div className="inner-circle" style={cssPropInnerCircle}></div>
      </div>
      <div className="info">{child}</div>
    </div>
  )
}
