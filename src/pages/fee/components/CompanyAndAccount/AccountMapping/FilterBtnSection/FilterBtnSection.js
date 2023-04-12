import {Button} from '@teachmint/krayon'
import React from 'react'
import Permission from '../../../../../../components/Common/Permission/Permission'
import SubjectTooltipOptions from '../../../../../../components/SchoolSystem/SectionDetails/SubjectTooltipOptions'
import {PERMISSION_CONSTANTS} from '../../../../../../utils/permission.constants'
import {
  ACCOUNT_MAPPING_DOT_BTN_OPTIONS,
  IS_EDIT_OR_CREATE_NEW,
  TRANSLATIONS_CA,
} from '../../companyAccConstants'
import styles from '../AccountMapping.module.css'
import GroupClassFeeTypes from '../GroupClassFeeTypes/GroupClassFeeTypes'

export default function FilterBtnSection({
  setIsFilterModalOpen = () => {},
  setBackupDataForEdit = () => {},
  setIsEditOrCreateNew = () => {},
  handleResetMapping = () => {},
  setGroupedByModalProps = () => {},
  setGroupes = () => {},
  isEditOrCreateNew,
  initData = [],
  groups = {},
  groupedByModalProps = {},
  mappingData = [],
}) {
  // console.log('mappingData', mappingData)
  const handleEditbtnClick = () => {
    let backupData = {}
    backupData.backupInitData = JSON.stringify([...initData])
    backupData.backupGroups = JSON.stringify({...groups})
    setBackupDataForEdit(backupData)
    setIsEditOrCreateNew(IS_EDIT_OR_CREATE_NEW.EDIT)
  }

  const handleFliterBtnClick = () => {
    setIsFilterModalOpen(true)
  }

  return (
    <>
      {groupedByModalProps?.isOpen && (
        <GroupClassFeeTypes
          {...groupedByModalProps}
          onClose={() =>
            setGroupedByModalProps((prev) => {
              return {...prev, isOpen: false}
            })
          }
          setGroupes={setGroupes}
          groups={groups}
        />
      )}

      <div className={styles.filtersAndSaveBtnSection}>
        <div>
          <Button
            classes={{}}
            onClick={handleFliterBtnClick}
            prefixIcon="filter"
            type="outline"
          >
            {TRANSLATIONS_CA.filters}
          </Button>
        </div>
        <div className={styles.saveAndDotBtnSection}>
          {!isEditOrCreateNew && (
            <div>
              <Permission
                permissionId={
                  PERMISSION_CONSTANTS.accountMappingController_upsert_update
                }
              >
                <Button
                  classes={{}}
                  onClick={handleEditbtnClick}
                  prefixIcon="edit2"
                  type="outline"
                >
                  {TRANSLATIONS_CA.edit}
                </Button>
              </Permission>
            </div>
          )}
          <div>
            {mappingData?.length > 0 && (
              <SubjectTooltipOptions
                options={ACCOUNT_MAPPING_DOT_BTN_OPTIONS.map((item) => {
                  return {...item, labelStyle: styles[item.labelStyle]}
                })}
                trigger={
                  <img
                    src="https://storage.googleapis.com/tm-assets/icons/secondary/settings-dots-secondary.svg"
                    alt=""
                    className="w-4 h-4"
                  />
                }
                handleChange={handleResetMapping}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
