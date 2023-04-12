export const templateStyles = {
  PAGE: {
    margin: '24px 8px 8px 8px',
  },
  CONTAINER: {
    padding: '0px 24px 6em 24px',
  },
}

const style1 = `
  <style type="text/css" media="print">
    @page {
      size: A4 {{ page_orientation }} !important;
      margin: ${templateStyles.PAGE.margin};
    }

    .template-body {
      margin: 0 !important;
    }
  </style>`

const style2 = `
  <style type="text/css">
    html {
      -webkit-print-color-adjust: exact;
    }
    .template-body {
      font-family: 'Inter', sans-serif;
      font-weight: 400;
      margin: ${templateStyles.PAGE.margin};
    }

    .vspace {
      height: 10px;
    }

    .container {
      position: relative;
      width: ${templateStyles.CONTAINER.width || '100%'};
      box-sizing: border-box;
      box-decoration-break: clone;
      font-family: 'Inter', sans-serif;
      font-weight: 400;

      font-size: 10px;
      padding: ${templateStyles.CONTAINER.padding};
      {% if show_signature %}
      {% else %}
        padding-bottom: 24px;
      {% endif %}
    }

    .details_report {
      font-size: 12px;
    }
    
    .details {
      font-size: 10px;
    }
    .text-left {
      text-align: left;
    }
    
    .text-right {
      text-align: right;
    }
    .text-center {
      text-align: center;
    }
    .clearfix::after {
      content: "";
      clear: both;
      display: table;
    }
    
    .footerData {
      position: absolute;
      bottom: 8px;
      width: calc(100% - 2 * 24px);
    }
    
    .instituteLogo {
      text-align: center;
      font-weight: 600;
      font-size: 14px;
      margin-right: 48px;
    }
    
    .instituteLogo img {
      width: 60px;
      height: 60px;
    }

    .school-name {
      padding-bottom: 8px;
      font-size: 20px;
      font-weight: 700;
    }

    .address {
      color: #08192a;
    }

    .heading {
      background: #dbe2ea;
      width: 100%;
      align-items: center;
      text-align: center;
      font-size: 12px;
      
      padding: 8px 0px;
      margin: 12px 0 8px 0;
    }
    
    .flex-div {
      display: flex;
    }
    
    .flex-justify {
      justify-content: space-between;
    }

    .dp-holder {
      width: 11%;
      max-width: 75px;
    }

    .img-dp {
      width: 100%;
      height: auto;
    }

    .student-details {
      display: flex;
      gap: 8px;
    }

    .tables {
      font-size: 10px;
      width: 100%;
    }
    
    .tables,
    .tables th,
    .tables td,
    .tables tr,
    .co_tables,
    .co_tables th,
    .co_tables td,
    .co_tables tr {
      border: 1px solid #dbe2ea;
      border-collapse: collapse;
    }
    
    .tables td {
      padding: 8px;
    }
    .co_tables {
      font-size: 10px;
      margin: 4px 0px 4px 0px;
      width: 100%;
    }
    
    .co_tables td {
      padding: 8px;
    }
    
    .term_cell_width {
      width: 22%;
    }
    
    .font-weight-700 {
      font-weight: 700;
    }
    
    .font-weight-500 {
      font-weight: 500;
    }
    
    .font-size-8px {
      font-size: 8px;
    }
    
    .font-size-10px {
      font-size: 10px;
    }
    
    .font-size-12px {
      font-size: 12px;
    }
    
    .border-black,
    .border-black th,
    .border-black td,
    .border-black tr {
      border: 1px solid #000;
    }
    
    .col-3 {
      float: left;
      width: 33.33%;
      padding: 10px;
      height: 300px;
    }
    .cosh-width {
      width: 100% !important;
    }
    .cosh-two-col {
      gap: 8px;
    }
    .left-cosh, .right-cosh {
      display: inline-block;
      font-size: 14px;
      width: calc((100% - 8px)/2);
    }
    .left-cosh > .co_tables, .right-cosh > .co_tables {
      margin: 0;
    }
    .page-breaker {
      clear: both;
      -webkit-column-break-inside: avoid !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    .margin-top-3em {
      margin-top: 3em;
    }
    .heading-attendance-size {
      font-size: 12px;
      color: #08192a;
    }
    .attendance-heading {
      background-color: #dbe2ea;
    }
    .attendance-heading th {
      margin-bottom: 8px;
      padding: 8px 0px 8px 8px;
    }
    .attendence-value {
      font-weight: 700;
      float: right;
    }
    .margin-left-5 {
      margin-left: 10px;
    }
    .cosch-heading {
      font-weight: 700;
      font-size: 10px;
    }
    .margin-bottom-4 {
      margin-bottom: 4px;
    }
    .margin-bottom-5 {
      margin-bottom: 5px;
    }
    .margin-top-8 {
      margin-top: 8px;
    }
    .margin-bottom-8 {
      margin-bottom: 8px;
    }
    .margin-top-12 {
      margin-top: 12px;
    }
    .margin-bottom-12 {
      margin-bottom: 12px;
    }
    .margin-bottom-16 {
      margin-bottom: 16px;
    }
    .margin-bottom-32 {
      margin-bottom: 32px;
    }
    .sign {
      flex: 33.33%;
    }
    .total_width {
      min-width: 100%;
    }
  </style>
`

const style3 = `
  <style type="text/css">
    .details {
      display: flex;
      flex-direction: row;
    }

    .text-left {
      text-align: left;
    }

    .term_column:not(:first-of-type) {
      border-left: none;
    }

    .cell {
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      box-sizing: border-box;
      border-left: 1px solid #dbe2ea;
      border-top: 1px solid #dbe2ea;
    }

    .cell:last-child {
      border-bottom: 1px solid #dbe2ea;
    }

    .subject_column ~ div:last-child {
      border-right: 1px solid #dbe2ea;
    }

    .cell2 {
      height: 48px;
    }

    .subject_column {
      width: 20%;
    }
    .subject_heading {
      align-items: start;
      padding-left: 5px;
      justify-content: space-evenly;
    }

    .subject_entries {
      min-width: fit-content;
      align-items: start;
      padding-left: 5px;
    }
    .term_area {
      display: flex;
      flex-direction: row;
    }

    .term_result {
      display: flex;
    }
    .term_flex_class {
      justify-content: space-between;
      display: flex;
      flex-direction: row;
    }

    .flex_class {
      display: flex;
      flex-direction: row;
    }
    .test_area {
      display: flex;
      flex-direction: row;
    }

    .test_flex_class {
      display: flex;
      flex-direction: row;
    }

    .test_result {
      display: flex;
      flex-direction: row;
    }

    .subtest_area {
      display: flex;
      flex-direction: row;
    }

    .session_result {
      display: flex;
    }
    .vertical_line {
      border: 1px solid grey;
    }
    .grade_desc {
      border: 1px solid grey;
      margin-top: 7px;
      padding-left: 5px;
    }
    .cell {
      clear: both;
      page-break-inside: avoid;
    }
  </style>
`

const header = `
  <div class="flex-div margin-bottom-16">
    {%if institute_details.ins_logo and institute_details.ins_logo != "" %}
      <div class="instituteLogo">
        <img src="{{ institute_details.ins_logo }}" />
      </div>
    {%endif%}
    <div>
      <div class="school-name">{{ institute_details.name }}</div>
      <div class="address">
        {{institute_details.address.line1}}
        {{institute_details.address.line2 }}
        {{institute_details.address.city }}
        {{institute_details.address.state}} {{institute_details.address.pin
        }}
      </div>
    </div>
  </div>
`

const studentDetails = `
  {% if show_student_details %}
  <div class="student-details">
    <table class="tables preview-studentDetails">
      {% tablerow item in student_details_arr cols:3 %}
        {{ item.label }} : {{item.value}}
      {% endtablerow %}
    </table>
    {% if show_student_pic %}
      {% if student_pic_url %}
        <div class="dp-holder">
          <img class="img-dp" src={{student_pic_url}} />
        </div>
      {% else %}
        <div class="dp-holder">
          <svg width="37" height="48" viewBox="0 0 37 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="img-dp">
            <rect width="37" height="48" rx="4" fill="#F4F4F4"/>
            <g clip-path="url(#clip0_8417_33648)">
            <path d="M17.9997 24.0002C19.8413 24.0002 21.333 22.5085 21.333 20.6668C21.333 18.8252 19.8413 17.3335 17.9997 17.3335C16.158 17.3335 14.6663 18.8252 14.6663 20.6668C14.6663 22.5085 16.158 24.0002 17.9997 24.0002ZM17.9997 25.6668C15.7747 25.6668 11.333 26.7835 11.333 29.0002V29.8335C11.333 30.2918 11.708 30.6668 12.1663 30.6668H23.833C24.2913 30.6668 24.6663 30.2918 24.6663 29.8335V29.0002C24.6663 26.7835 20.2247 25.6668 17.9997 25.6668Z" fill="#CCCCCC"/>
            </g>
            <defs>
            <clipPath id="clip0_8417_33648">
            <rect width="20" height="20" fill="white" transform="translate(8 14)"/>
            </clipPath>
            </defs>
          </svg>
        </div>
      {% endif %}
    {% endif %}
  </div>
  {% endif %}
`

const testArea = `
  <div class="test_area" style="width: {{test_area_width}}%">
    {% for test in term[CHILDREN]%}
      {%if test['checked']%}
        {%assign test_total_width_weight = test[TOTAL_WIDTH_WEIGHT] | plus: test[BODY_WIDTH_WEIGHT] %}
        {%assign test_width = test_total_width_weight | times: test_area_level_division%}
        {%assign test_level_division = 100 | divided_by: test_total_width_weight%}

        <div class="test_column" style="overflow: hidden; width: {{test_width}}%">
          <div data-id="testNameRef" class="cell cell2 text-center">
            {{test['name']}}
          </div>

          <div class="test_flex_class">
            {%assign sub_test_area_width = test[BODY_WIDTH_WEIGHT] | times:test_level_division%}
            {%assign sub_test_area_level_division = 100| divided_by: test[BODY_WIDTH_WEIGHT]%}
            {%assign test_result_area_width = test[TOTAL_WIDTH_WEIGHT] | times: test_level_division%}
            {%assign test_result_area_width = test[TOTAL_WIDTH_WEIGHT] | times: test_level_division%}
            {%if test['children_count']>1%}

              <div class="subtest_area" style="width: {{sub_test_area_width}}%">
                {% for subtest in test[CHILDREN] %}
                  {% if subtest.checked %}
                    {%assign subtest_width = subtest[BODY_WIDTH_WEIGHT] | times: sub_test_area_level_division%}

                    <div class="sub_test_column" style="overflow: hidden; width: {{subtest_width}}%">
                      <div data-id="subtestNameRef" class="cell text-center">
                        <div>{{subtest['name']}}</div>
                        {%if subtest["same_subtest_total"]==true%}
                          <div>{{subtest[WEIGHTAGE]}}</div>
                        {%endif%}
                      </div>

                      {%for subject in exm_str_tree[SUBJECT_MAP]%} 
                        {% if subject.checked %}
                          <div class="cell text-center">
                          {% if subtest[SUBJECT_MAP][TOTAL][SUBJECT_MAP][subject.id][COLOR] %}
                            {%assign subtest_color = subtest[SUBJECT_MAP][TOTAL][SUBJECT_MAP][subject.id][COLOR]%}
                          {%else%}
                            {%assign subtest_color = ""%}
                          {%endif%}
                            <span style="color:{{subtest_color}}">
                              <span>
                                {%if subtest[SUBJECT_MAP][TOTAL][SUBJECT_MAP][subject.id][IS_ABSENT] == true %}
                                  {{subtest[SUBJECT_MAP][TOTAL][SUBJECT_MAP][subject.id][ABSENT]}}
                                {% else %}
                                  {{subtest[SUBJECT_MAP][TOTAL][SUBJECT_MAP][subject.id][RESULT]}}
                                  {%if subtest["same_subtest_total"]==false and subtest[SUBJECT_MAP][TOTAL][SUBJECT_MAP][subject.id][RESULT]%}
                                    <span> / {{subtest[SUBJECT_MAP][TOTAL][SUBJECT_MAP][subject.id][OUT_OF]}}</span>
                                  {%endif%}
                                {% endif %}
                              </span>
                            </span>
                          </div>
                        {%endif%}
                      {%endfor%}
                    </div>
                  {%endif%}
                {%endfor%}
              </div>
            {%else%}
              {%assign test_result_area_width = test[TOTAL_WIDTH_WEIGHT] | times: test_level_division%}
            {%endif%}

            <div class="test_result" style="overflow: hidden; width: {{test_result_area_width}}%">
              {%assign test_subresult_level_division = 100 | divided_by: test[TOTAL_WIDTH_WEIGHT] %}
              {%for item in test[RESULT]%}
                {%assign result_name = item[0] %}
                {%assign result = item[1] %}
                {%assign test_subresult_width = result[BODY_WIDTH_WEIGHT] | times: test_subresult_level_division%}

                <div style="overflow: hidden; width: {{test_subresult_width}}%">
                  <div data-id="testResultRef" class="cell text-center">
                    <div>{{result_name}}</div>

                    {%if test["same_test_total"]==true and result_name != GRADES%}
                      <div>{{test[WEIGHTAGE]}}</div>
                    {%endif%}
                  </div>

                  {%for subject in exm_str_tree[SUBJECT_MAP]%} 
                    {% if subject.checked %}
                      <div class="cell text-center">
                        {%if result[SUBJECT_MAP][subject.id][COLOR]%}
                          {%assign test_color = result[SUBJECT_MAP][subject.id][COLOR]%}
                        {%else%}
                          {%assign test_color = "" %}
                        {%endif%}
                        <span style="color:{{test_color}}">
                          {%if result[SUBJECT_MAP][subject.id][IS_ABSENT] == true %}
                            <span>{{result[SUBJECT_MAP][subject.id][ABSENT]}}</span>
                          {% else %}
                            <span>{{result[SUBJECT_MAP][subject.id][RESULT]}}</span>
                            {% if test["same_test_total"]==false and result_name != GRADES and result[SUBJECT_MAP][subject.id][RESULT]%}
                              <span> /{{result[SUBJECT_MAP][subject.id][OUT_OF]}}</span>
                            {%endif%}
                          {% endif %}
                        </span>
                      </div>
                    {%endif%}
                  {%endfor%}
                </div>
              {%endfor%}
            </div>
          </div>
        </div>
      {%endif%}
    {%endfor%}
  </div>
`

const termResult = `
{% if term['show_term_total'] %}
  <div style="overflow: hidden; width: {{term_result_area_width}}%">
    <div class="cell cell2 text-center" data-id="termResultTotalRef">Total</div>
    <div class="term_result">
      {%assign term_result_level_divsion = 100 | divided_by:term[TOTAL_WIDTH_WEIGHT]%}
      {%for item in term[RESULT]%}
        {%assign result_name = item[0]%}
        {%assign result = item[1]%}
        {%assign term_subresult_width = result[BODY_WIDTH_WEIGHT] | times: term_result_level_divsion%}

        <div style="overflow: hidden; width: {{term_subresult_width}}%">
          <div class="cell text-center" data-id="termSubResultTotRef">
            <div>{{result_name}}</div>
            {%if term['same_term_total']==true and result_name != GRADES %}
              <div>{{term[OUT_OF]}}</div>
            {%endif%}
          </div>

          {%for subject in exm_str_tree[SUBJECT_MAP]%} 
            {% if subject.checked %}
              <div class="cell text-center">
                {%if result[SUBJECT_MAP][subject.id][COLOR]%}
                  {%assign term_color = result[SUBJECT_MAP][subject.id][COLOR]%}
                {%else%}
                  {%assign term_color = ""%}
                {%endif%}
                <span style="color:{{term_color}}">
                  <span>{{result[SUBJECT_MAP][subject.id][RESULT]}}</span>
                  {%if term['same_term_total'] == false and result_name != GRADES and result[SUBJECT_MAP][subject.id][RESULT]%}
                    <span>/{{result[SUBJECT_MAP][subject.id][OUT_OF]}}</span>
                  {%endif%}
                </span>
              </div>
            {%endif%}
          {%endfor%}
        </div>
      {%endfor%}
    </div>
  </div>
{%endif%}
`

const subjectColumn = `
  <div class="subject_column" style="width: 15%">
    <div data-id="subjectNameRef" class="subject_heading cell font-weight-700 text-center">
      Subject
    </div>

    {% for subject in exm_str_tree[SUBJECT_MAP] %}
      {% if subject.checked %}
        <div class="subject_entries cell">
          {{subject.label}}
        </div>
      {%endif%}
    {%endfor%}
  </div>
`

const termAreaColumn = `
  <div class="term_area" style="overflow: hidden; width: {{exm_str_tree[BODY_WIDTH_WEIGHT] | times: session_level_division}}%">
    {%assign term_area_level_division = 100 | divided_by: exm_str_tree[BODY_WIDTH_WEIGHT]%}
    {% for term in exm_str_tree[CHILDREN] %}
      {%if term['checked']%}
        {%assign term_total_width_weight = term[BODY_WIDTH_WEIGHT] | plus: term[TOTAL_WIDTH_WEIGHT]%}
        {%assign term_width = term_area_level_division | times: term_total_width_weight%}
        {%assign term_level_division = 100 | divided_by: term_total_width_weight%}

        <div class="term_column" style="overflow: hidden; width: {{term_width}}%">
          <div data-id="termNameRef" class="cell font-weight-700 text-center">{{term['name']}}</div>
          <div class="term_flex_class">

            {%assign test_area_width = term[BODY_WIDTH_WEIGHT]| times: term_level_division%}
            {%assign test_area_level_division = 100 | divided_by: term[BODY_WIDTH_WEIGHT]%}

            ${testArea}

            {%assign term_result_area_width = term[TOTAL_WIDTH_WEIGHT] | times: term_level_division%}

            ${termResult}
          </div>
        </div>
      {%endif%}
    {%endfor%}
  </div>
`

const sessionResult = `
{% if exm_str_tree['show_session_total'] %}
  <div style="overflow: hidden; width: {{session_result_area_width}}%">
    <div class="cell font-weight-700 text-center" data-id="sessionTotalRef">
      <div>Total</div>
      <div>{{exm_str_tree[TERMS_COMBINED_NAMES]}}</div>
      <div>{{exm_str_tree[TERMS_COMBINED_PERCENTAGES]}}</div>
    </div>
    <div class="session_result">
      {%assign session_result_level_division = 100 | divided_by: exm_str_tree[TOTAL_WIDTH_WEIGHT]%}
      {%for item in exm_str_tree[RESULT]%}
        {%assign result_name = item[0]%}
        {%assign result = item[1]%}
        {%assign session_subresult_width = session_result_level_division | times: result[BODY_WIDTH_WEIGHT]%}

        <div style="width: {{session_subresult_width}}%">
          <div class="cell text-center" data-id="sessionSubTotRef">
            <div>{{result_name}}</div>
            {%if exm_str_tree["same_session_total"]==true and result_name != GRADES%}
              <div>{{exm_str_tree["session_same_total"]}}</div>
            {%endif%}
          </div>
          {%for subject in exm_str_tree[SUBJECT_MAP]%} 
            {% if subject.checked %}
              <div class="cell text-center">
                {%if result[SUBJECT_MAP][subject.id][COLOR]%}
                  {%assign session_color = result[SUBJECT_MAP][subject.id][COLOR]%}
                {%else%}
                  {%assign session_color = ""%}
                {%endif%}
                <span style="color:{{session_color}}">
                  <span>{{result[SUBJECT_MAP][subject.id][RESULT]}}</span>
                  {%if exm_str_tree["same_session_total"]==false and result_name != GRADES and result[SUBJECT_MAP][subject.id][RESULT]%}
                    <span>/{{ result[SUBJECT_MAP][subject.id][OUT_OF] }}</span>
                  {%endif%}
                </span>
              </div>
            {%endif%}
          {%endfor%}
        </div>
      {%endfor%}
    </div>
  </div>
  {%endif%}
`

const grandTotalFooter = `
  <div class="grand_total_footer margin-bottom-8">
    <table class="tables border-black">
      {% assign footerCount = 0 %}

      {% for item in exm_str_tree['grand_total_footer'] %}
        {%if item.checked %}
          {% assign footerCount = footerCount | plus: 1 %}
        {%endif%}
      {% endfor %}

      <tr>
        {% for item in exm_str_tree['grand_total_footer'] %}
          {%if item.checked %}
            <td class="font-weight-700" width="{{100 | divided_by: footerCount }}%"><span>{{item.label}}</span> : <span>{{item.value}}</span></td>
          {%endif%}
        {% endfor %}
      </tr>
    </table>
  </div>
`

const gradingScale = `
  {% if grade_enabled == true %}
    <div class="grading_scale">
      <div class="heading font-weight-700">GRADING SCALE</div>
      <table class="tables">
        <tr>
          <td width="80" class="font-weight-500">Mark range</td>
            {% for item in grades %}
              <td>
                {{item.max}} - {{item.min}}
              </td>
            {%endfor%}
          </tr>
          <tr>
            <td width="80" class="font-weight-500">Grades</td>
            {% for item in grades %}
              <td>
                {{item.name}}
              </td>
            {%endfor%}
        </tr>
      </table>
    </div>
  {% endif %}
`

const coschSection = `
  <!-- Cosch Section --->
  {% assign cosc_subjects_len = 0 %}
  {% if cosch_subjects %}
    {% assign cosc_subjects_len = cosch_subjects | size %}
  {% endif %}
  {% if show_co_scholastic and cosc_subjects_len > 0 %}
    <div class="page-breaker margin-bottom-4 preview-coScholastic">
      {% assign cosch_header_classes = 'heading font-weight-700' %}
      {% if cosch_page_break %}
        {% assign cosch_header_classes = cosch_header_classes | append: 'page-breaker ' %}
      {% endif %}

      <div class="{{cosch_header_classes}} font-weight-700">{{ co_sch_details['co_scholastic_area_title']}}</div>
      <div class="row flex-div flex-justify cosh-two-col">
        {% assign cosch_width_classes = 'column left-cosh ' %}
        {% if right_cosch_data.size < 2 %}
          {% assign cosch_width_classes = cosch_width_classes | append: 'cosh-width ' %}
        {% endif %}

        <div class="{{ cosch_width_classes}}">
          <table class="co_tables">
            {% for list_ele in left_cosch_data %}
              {% if forloop.index == 1 %}
                {% assign header="font-weight-700" %}
              {% else %}
                {% assign header="" %}
              {% endif %}

              <tr>
                {% for element in list_ele %}
                  <td class="{{header}}">{{ element }}</td>
                {% endfor %}
              </tr>
            {% endfor %}
          </table>
        </div>

        {% if right_cosch_data.size >= 2 %}
          <div class="column right-cosh">
            <table class="co_tables">
              {% for list_ele in right_cosch_data %}
                {% if forloop.index == 1 %}
                  {% assign header="font-weight-700" %}
                {% else %}
                  {% assign header="" %}
                {% endif %}

                <tr>
                  {% for element in list_ele %}
                    <td class="{{header}}">{{ element }}</td>
                  {% endfor %}
                </tr>
              {% endfor %}
              {% if right_cosch_blank_row %}
                {% for list_ele in right_cosch_blank_row %}
                  <tr>
                    {% for element in list_ele %}
                      <td><p style="visibility: hidden">text</p></td>
                    {% endfor %}
                  </tr>
                {% endfor %}
              {% endif %}
            </table>
          </div>
        {% endif %}
      </div>
    </div>
  {% endif %}
  <!-- Cosch Section End--->
`

const attendanceSection = `
  <!-- Attendance Section start--->
  {% if show_attendance %}
    {% assign OVERALL = 1 %}
    {% assign TERM_WISE = 2 %}
    {% assign MONTH_WISE = 3 %}
    {% if attendance_type == TERM_WISE %}
      <div class="page-breaker margin-bottom-12">
        <table class="co_tables">
          <tr class="attendance-heading">
            <th class="heading-attendance-size font-weight-700">ATTENDANCE</th>
            <td class="text-center font-weight-700">Present</td>
            <td class="text-center font-weight-700">Total Days</td>
            <td class="text-center font-weight-700">Percentage</td>
          </tr>
          {% for atten in attendance %}
            {% if atten.checked %}
              <tr>
                <td class="margin-left-5">{{ atten.name}}</td>
                <td class="text-center">{{ atten.attendance_val }}</td>
                <td class="text-center">{{ atten.total_working_days }}</td>
                <td class="text-center">{{ atten.attendance_val_percent}}</td>
              </tr>
            {% endif %}
          {% endfor %}
        </table>
      </div>

    {% elsif attendance_type == MONTH_WISE %}
      <div class="page-breaker margin-bottom-8">
        <table class="co_tables">
          <thead>
            <tr class="attendance-heading">
              <th class="heading-attendance-size font-weight-700 text-center" colspan="{{attendance | where: "checked" | size | plus: 2}}">ATTENDANCE</th>
            </tr>
          </thead>
          <tbody>
            {% assign attendanceRow = "Present,Total Days,Percentage" | split: ',' %}
            <tr>
              <td width="100"></td>
              {% for item in attendance %}
                {% if item.checked %}
                  <td class="font-weight-700 text-center">{{item.name}}</td>
                {% endif %}
              {% endfor %}
            </tr>

            <tr>
              <td width="100">Present</td>
              {% for item in attendance %}
                {% if item.checked %}
                  <td class="text-center">{{item.attendance_val}}</td>
                {% endif %}
              {% endfor %}
            </tr>

            <tr>
              <td width="100">Total Days</td>
              {% for item in attendance %}
                {% if item.checked %}
                  <td class="text-center">{{item.total_working_days}}</td>
                {% endif %}
              {% endfor %}
            </tr>

            <tr>
              <td width="100">Percentage</td>
              {% for item in attendance %}
                {% if item.checked %}
                  <td class="text-center">{{item.attendance_val_percent}}</td>
                {% endif %}
              {% endfor %}
            </tr>
          </tbody>
        </table>
      </div>
      {% elsif attendance_type == OVERALL %}
        <div class="heading font-weight-700">ATTENDANCE</div>
        <table class="tables">
          <tr>
            <td><span>Present : </span><span class="attendence-value">{{attendance[0].attendance_val}}</span> </td>
            <td><span>Total Days : </span><span class="attendence-value">{{attendance[0].total_working_days}}</span> </td>
            <td><span>Percentage : </span><span class="attendence-value">{{attendance[0].attendance_val_percent}}</span> </td>
          </tr>
        </table>
      {% endif %}
  {% endif %}
  <!-- Attendance end --->
`

const remarksAndResultSection = `
  <!-- Remaks and Result Section start --->
  <div class="result-section total_width margin-top-12 margin-bottom-12">
    <!-- Termwise Remarks section starts --->
    {% assign TERM_WISE = 2 %}
    {% assign OVERALL = 1 %}
    {% if show_remarks and remarks_type == TERM_WISE %}
      <div>
        {% assign remark_header_classes = 'heading font-weight-700' %}
        {% if remark_page_break %}
          {% assign remark_header_classes = remark_header_classes | append: 'page-breaker ' %}
        {% endif %}

        <div class="{{remark_header_classes}} font-weight-700">REMARKS</div>
        <table class="co_tables">
          {% for remark in remarks %}
            {% if remark.checked %}
              <tr>
                <td class="term_cell_width font-weight-700">{{ remark.name }}</td>
                <td>{{ remark.value }}</td>
              </tr>
            {% endif %}
          {% endfor %}
        </table>
      </div>
    {% endif %}
    <!-- Termwise Remarks section ends --->

    <!-- Termwise Result section starts --->
    {% if show_result and result_type == TERM_WISE %}
      <div>
        {% assign result_header_classes = 'heading font-weight-700' %}
        {% if result_page_break %}
          {% assign result_header_classes = result_header_classes | append: 'page-breaker ' %}
        {% endif %}

        <div class="{{result_header_classes}} font-weight-700">RESULT</div>
        <table class="co_tables">
          {% for result in results %}
            {% if result.checked %}
              <tr>
                <td class="term_cell_width font-weight-700">{{ result.name }}</td>
                <td>{{ result.value }}</td>
              </tr>
            {% endif %}
          {% endfor %}
        </table>
      </div>
    {% endif %}
    <!-- Termwise Result section ends --->

    <div>
      {% if show_remarks and remarks_type == OVERALL %}
        <div class="flex-div margin-bottom-12 margin-top-12">
          <span class="font-weight-700">REMARKS: </span>
          <span class="margin-left-5">{{remarks[0].value}}</span>
        </div>
      {% endif %}
      {% if show_result and result_type == OVERALL %}
        <div class="flex-div margin-top-12 margin-bottom-12">
          <span class="font-weight-700">RESULT: </span>
          <span class="margin-left-5">{{results[0].value}}</span>
        </div>
      {% endif %}
    </div>
  </div>
  <!-- Remaks and Result Section end--->
`

export let templateHTML = `<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
      rel="stylesheet"
    />
    <title>Report Card</title>
    ${style1}
    ${style2}
  </head>

  <body class="template-body">
    <div class="container" id="wrapper">
      <div class="preview-header">
        ${header}
        <div class="heading font-weight-700">
          {%if title%} {{title}}{%else%} REPORT CARD{%endif%}
        </div>
      </div>
      <div class="details_report margin-bottom-12">
        ${studentDetails}
      </div>

      <div class="preview-scholastic">
        <div class="heading font-weight-700">
          {%if scholastic_area_title%}
            {{scholastic_area_title}}
          {%else%}
            SCHOLASTIC AREA
          {%endif%}
        </div>

        <div class="margin-bottom-12">
          ${style3}
          <div class="font-size-12px">
            {% assign TOTAL = 'Total'%}
            {% assign GRADES = 'Gr.'%}
            {% assign RESULT = 'Result'%}
            {% assign OUT_OF = 'out_of'%}
            {% assign IS_ABSENT = 'is_absent' %}
            {% assign ABSENT = 'absent' %}
            {% assign SUBJECT_MAP = 'subject_map'%}
            {% assign BODY_WIDTH_WEIGHT = 'body_width_weight'%}
            {% assign TOTAL_WIDTH_WEIGHT = 'total_width_weight'%}
            {% assign TERMS_COMBINED_NAMES = 'terms_combined_names'%}
            {% assign TERMS_COMBINED_PERCENTAGES = 'terms_combined_percentages'%}
            {% assign WEIGHTAGE = 'weightage'%}
            {% assign COLOR= "color"%}
            {% assign CHILDREN = "children"%}
            {% assign session_total_width_weight = exm_str_tree[TOTAL_WIDTH_WEIGHT] | plus: exm_str_tree[BODY_WIDTH_WEIGHT]%}
            {% assign session_level_division = 85 | divided_by: session_total_width_weight%}

            <div class="details margin-bottom-8">
              ${subjectColumn}
  
              ${termAreaColumn}
  
              {%assign session_result_area_width = exm_str_tree[TOTAL_WIDTH_WEIGHT] | times: session_level_division%}
  
              ${sessionResult}
            </div>

            {% if params_student_marks['grand_total'] != nil or params_student_marks['percentage'] != nil or exm_str_tree['grand_total_footer']['grade'] %}
              <table class="tables font-weight-700 margin-bottom-8">
                <tr>
                  {% if params_student_marks['grand_total'] != nil %}
                    <td>
                      {{ exm_str_tree["grand_total_footer"]["grand_total"] }} :
                      {%if exm_str_tree['grand_total_footer']['grand_total_marks'] %}
                        <span style="color: {{ exm_str_tree['grand_total_footer'][COLOR] }}" >
                          {{exm_str_tree["grand_total_footer"]["grand_total_marks"]}}/{{exm_str_tree["grand_total_footer"]["grand_total_out_of"]}}
                        </span>
                      {%endif%}
                    </td>
                  {%endif%}

                  {% if params_student_marks['percentage'] != nil %}
                    <td>
                      {{ exm_str_tree["grand_total_footer"]["percentage"] }} :
                      <span style="color: {{exm_str_tree['grand_total_footer'][COLOR]}}">
                        {{exm_str_tree["grand_total_footer"]["percentage_obtained"]}}
                      </span>
                    </td>
                  {%endif%}

                  {% if exm_str_tree['grand_total_footer']['grade'] %}
                    <td>
                      {{ exm_str_tree["grand_total_footer"]["grade"] }} :
                      <span style="color: {{exm_str_tree['grand_total_footer'][COLOR]}}">
                        {{exm_str_tree["grand_total_footer"]["grade_obtained"]}}
                      </span>
                    </td>
                  {%endif%}
                </tr>
              </table>
            {% endif %}

            {%if exm_str_tree['grand_total_footer']['grade'] %}
              <table class="tables margin-bottom-8">
                <tr>
                  <td style="padding: 4px">
                    *{{ exm_str_tree["grading_desc"] }}
                  </td>
                </tr>
              </table>
            {%endif%}

            ${grandTotalFooter}

            ${gradingScale}
          </div>

          <script>
            function adjustCellHeight(){
              const {top: termTop} = document.querySelectorAll("[data-id=termNameRef]")[0].getBoundingClientRect();
    
              const {bottom: testResultBottom, top: testResultTop} = document.querySelectorAll("[data-id=testResultRef]")[0].getBoundingClientRect();
    
              const subjectName = document.querySelectorAll("[data-id=subjectNameRef]")[0]

              if (subjectName) subjectName.style.height = (testResultBottom - termTop) + "px";

              const sessionTotal = document.querySelectorAll("[data-id=sessionTotalRef]")[0]

              if (sessionTotal) sessionTotal.style.height = (testResultTop - termTop) + "px"
            }
            adjustCellHeight()
          </script>
        </div>
      </div>

      <div class="font-size-12px">
        ${coschSection}

        <div class="preview-additionalInfo ">
          ${attendanceSection}
  
          ${remarksAndResultSection}
  
          <!-- Signature Section start--->
          {% if show_signature %}
            <div class="footerData flex-div flex-justify font-size-12px">
              {% for sign in signature_arr %}
                {% if sign.checked %}
                  <div>{{sign.label}}</div>
                {% endif %}
              {% endfor %}
            </div>
          {% endif %}
          <!-- Signature Section end--->
        </div>
      </div>
    </div>
  </body>
  <script>
  // This will work Only in A4 size
  function adjustHeightAndFooter () {
    const page_orientation = "{{page_orientation}}" || "portrait";

    const inchToPixel = (inchs) => inchs * 96

    const A4 = ({
      portrait: {
        width: inchToPixel(8.27), height: inchToPixel(11.69)
      },
      landscape: {
        height: inchToPixel(8.27), width: inchToPixel(11.69)
      }
    })[page_orientation];

    const wrapper = document.getElementById("wrapper");
    const wrapperHeightInPixel = wrapper.offsetHeight;
    const overallHeight = document.body.parentElement.offsetHeight;
    const TOTAL_PAGE = Math.ceil(overallHeight/A4.height);
    const totalPageHeight = TOTAL_PAGE * A4.height

    const wrapperParentStyle = window.getComputedStyle(wrapper.parentElement)
    const marginTop = wrapperParentStyle.marginTop
    const marginBottom  = wrapperParentStyle.marginBottom

    // due to some reason there is some decimal offset, so using 0.5px to cover it
    wrapper.setAttribute("style", "min-height: calc("+ totalPageHeight + "px - " + TOTAL_PAGE + "*" + marginTop + " - " + TOTAL_PAGE + "*" + marginBottom + " - 0.5px )");
  }

  window.addEventListener("beforeprint", (event) => {
    // console.log('event', event)
    adjustHeightAndFooter()
  });
</script>
</html>
`

// let removedCondition = ` and result[SUBJECT_MAP][subject.id][IS_ABSENT] at 488 and 526`
