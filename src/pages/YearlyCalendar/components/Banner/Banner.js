import React from 'react'
import s from './Banner.module.scss'
import Leaves from './banner_leaves_color.svg'
import Tree from './banner_tree_grey.svg'
import cx from 'classnames'
const Banner = ({theme = 'dark', eventName, date, type}) => {
  return (
    <div className={cx(s.banner, s[theme])}>
      <div className={s.content}>
        <p className={s.p}>{type}</p>
        <p className={s.eventName}>{eventName}</p>
        <p className={s.p}>{date}</p>
      </div>
      <div className="flex">
        <img src={Leaves} alt="" />
        <img src={Tree} alt="" />
      </div>
    </div>
  )
}

export default Banner
