import React from 'react'
import styles from './ReportSection.module.css'
import feeReportStyles from '../FeeReports.module.css'
import {Card, Icon} from '@teachmint/common'
import Permission from '../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../utils/permission.constants'

export default function ReportSection({report}) {
  return (
    <div>
      <div className={styles.headingSection}>{report?.heading}</div>
      <Permission
        permissionId={
          PERMISSION_CONSTANTS.feeModuleController_reportDownloadRequest_read
        }
      >
        <div className={styles.reportChildrenSection}>
          {report?.children &&
            report.children.map((child, idx) => {
              return (
                <Card
                  key={`${child.title}-${idx}`}
                  className={styles.card}
                  onClick={child.click}
                >
                  <div className={styles.cardIconBg}>
                    <Icon
                      color="basic"
                      name={child?.iconName ? child.iconName : 'user'}
                      size="xs"
                      type="outlined"
                    />
                  </div>
                  <div className={styles.titleSection}>{child.title}</div>
                </Card>
              )
            })}
        </div>
      </Permission>
      <div className={feeReportStyles.divder}></div>
    </div>
  )
}
