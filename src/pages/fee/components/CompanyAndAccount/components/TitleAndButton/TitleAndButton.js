import {Button, Heading} from '@teachmint/krayon'
import classNames from 'classnames'
import React from 'react'
import Permission from '../../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../../utils/permission.constants'
import styles from './TitleAndButton.module.css'

export default function TitleAndButton({
  text = '',
  buttonText = '',
  onButtonClick = () => {},
  classes = {},
}) {
  return (
    <div className={`${styles.section} ${classes?.wrapper}`}>
      <Heading
        textSize="s"
        weight="bold"
        className={classNames(styles.heading, classes?.heading)}
        title={text}
      >
        {text}
      </Heading>
      <div>
        <Permission
          permissionId={
            PERMISSION_CONSTANTS.companyController_updateRoute_update
          }
        >
          <Button
            classes={{...classes?.buttonClasses}}
            onClick={onButtonClick}
            type="outline"
          >
            {buttonText}
          </Button>
        </Permission>
      </div>
    </div>
  )
}
