import {
  Badges,
  BADGES_CONSTANTS,
  Para,
  PARA_CONSTANTS,
  useOutsideClickHandler,
  BUTTON_CONSTANTS,
  Button,
} from '@teachmint/krayon'
import React from 'react'
import {useRef} from 'react'
import {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'
import {useCheckPermission} from '../../../../utils/Permssions'
import styles from './StudentStaffTable.module.css'

const MissingFieldsKabab = ({missingFields = [], openUserProfile}) => {
  const [showFields, toggleShowFields] = useState(false)
  const wrapperRef = useRef()

  const updateUserDetails = useCheckPermission(
    PERMISSION_CONSTANTS.ipsController_updateUsers_update
  )

  useOutsideClickHandler(wrapperRef, () => {
    toggleShowFields(false)
  })

  const {t} = useTranslation()
  return (
    <div>
      {missingFields?.length ? (
        <>
          <div ref={wrapperRef} className={styles.missingFieldsWrapper}>
            <Para
              type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
              textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
            >
              {t('customId.generatedWithMissingDetails')}
            </Para>
            <Badges
              size={BADGES_CONSTANTS.SIZE.SMALL}
              type={BADGES_CONSTANTS.TYPE.WARNING}
              iconName="caution"
              label={`${missingFields.length} ${t('customId.infoMissing')}`}
              onClick={() => toggleShowFields(!showFields)}
              className={'cursor_pointer'}
            />
            {showFields && (
              <div className={styles.missingFieldsPopup}>
                <Badges
                  size={BADGES_CONSTANTS.SIZE.SMALL}
                  type={BADGES_CONSTANTS.TYPE.WARNING}
                  iconName="caution"
                  label={`${t('customId.missingDetails')}`}
                  className={styles.warning}
                />
                <div className={styles.headerDivider} />
                <Para
                  type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
                  textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
                >
                  {t('customId.addDetailsToGenerate')}
                </Para>
                <div className={styles.missingFields}>
                  {missingFields.map((item) => (
                    <span key={item.id}>{item.name}</span>
                  ))}
                </div>

                <Button
                  size={BUTTON_CONSTANTS.SIZE.SMALL}
                  width={BUTTON_CONSTANTS.WIDTH.FULL}
                  classes={{button: styles.addDetailsButton}}
                  onClick={openUserProfile}
                  isDisabled={!updateUserDetails}
                >
                  {t('addDetails')}
                </Button>
              </div>
            )}
          </div>
        </>
      ) : (
        <Para
          type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
          textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
        >
          {t('customId.idGenerated')}
        </Para>
      )}
    </div>
  )
}

export default MissingFieldsKabab
