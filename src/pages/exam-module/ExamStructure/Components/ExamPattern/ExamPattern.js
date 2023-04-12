import {Route} from 'react-router-dom'
import {EXAM_STRUCTURE_PATHS} from '../../Constants/Constants'
import AddToTermPopup from '../AddToTermPopup/AddToTermPopup'
import ExamStructureHome from '../ExamStructureHome/ExamStructureHome'
import ExamTemplateEditor from '../ExamTemplateEditor/ExamTemplateEditor'
import ImportExamStructurePopup from '../ImportExamStructurePopup/ImportExamStructurePopup'
const ExamPattern = () => {
  return (
    <div>
      <Route
        path={EXAM_STRUCTURE_PATHS.examPattern}
        exact
        component={ExamStructureHome}
      />
      <Route
        path={EXAM_STRUCTURE_PATHS.editExamPattern}
        exact
        component={ExamTemplateEditor}
      />
      <Route
        path={EXAM_STRUCTURE_PATHS.importExamPattern}
        exact
        component={ImportExamStructurePopup}
      />
      <Route
        path={EXAM_STRUCTURE_PATHS.addToTerm}
        exact
        component={AddToTermPopup}
      />
    </div>
  )
}

export default ExamPattern
