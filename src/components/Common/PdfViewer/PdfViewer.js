import React, {lazy, Suspense} from 'react'
import Loader from '../Loader/Loader'
const PDFViewer = lazy(() =>
  import(
    /* webpackPrefetch: true, webpackChunkName: "PDFViewer" */ './PdfViewerMain'
  )
)

function PdfViewer(props) {
  return (
    <Suspense fallback={<Loader />}>
      <PDFViewer {...props} />
    </Suspense>
  )
}

export default PdfViewer
