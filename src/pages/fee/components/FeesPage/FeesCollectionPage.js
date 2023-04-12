import {FeeCollectionProvider} from '../context/FeeCollectionContext/FeeCollectionContext'
import FeeCollectionContextComponent from '../context/FeeCollectionContext/FeeCollectionContextComponent'

const FeesCollectionPage = () => {
  return (
    <FeeCollectionProvider>
      <FeeCollectionContextComponent />
    </FeeCollectionProvider>
  )
}

export default FeesCollectionPage
