import {useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {generatePath, useHistory, useParams} from 'react-router-dom'
import globalActions from '../../../../redux/actions/global.actions'
import styles from './GeneratedIdCards.module.css'
import {HeaderTemplate} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'
import Loader from '../../../../components/Common/Loader/Loader'
import GeneratedIdCardsTable from '../../components/GeneratedIdCardsTable/GeneratedIdCardsTable'
import {generatedIdCardList} from '../../redux/CustomId.selector'
import {CUSTOM_ID_CARD_ROOT_ROUTE} from '../../CustomId.routes'

const GeneratedIdCards = () => {
  const {userType} = useParams()
  const history = useHistory()
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const {data: generatedDocumentsList, isLoading} = generatedIdCardList()

  useEffect(() => {
    dispatch(
      globalActions.generatedIdCardList.request({
        c: parseInt(+new Date() / 1000),
        user_type: userType.toUpperCase(),
        count: 500,
      })
    )
  }, [])

  return (
    <div className={styles.wrapper}>
      <Loader show={isLoading} />
      <HeaderTemplate
        breadcrumbObj={{
          className: '',
          paths: [
            {
              label: t('customId.idCards'),
              to: generatePath(CUSTOM_ID_CARD_ROOT_ROUTE, {
                userType,
              }),
              onClick: (e) => {
                e?.preventDefault()
                history.push(
                  generatePath(CUSTOM_ID_CARD_ROOT_ROUTE, {
                    userType,
                  })
                )
              },
            },
            {
              label: t('customId.recentlyGenerated'),
            },
          ],
        }}
        mainHeading={t('customId.recentlyGenerated')}
      />
      <GeneratedIdCardsTable rows={generatedDocumentsList} />
    </div>
  )
}

export default GeneratedIdCards
