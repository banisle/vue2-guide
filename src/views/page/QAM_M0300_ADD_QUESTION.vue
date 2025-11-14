<template>
  <div>
    <!-- search form -->
    <div class="pl-grid-top">
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline">
          <span class="pl-label">
            분류유형
          </span>
          <div class="pl-desc">
            <v-select
              class="pl-form type-middle is-lg"
              :items="DROP_QSTN_TYPE"
              v-model="searchParams.QSTN_TYPE"
              item-text="CD_NM"
              item-value="CD_ID"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            검색 유형
          </span>
          <div class="pl-desc">
            <v-select
              class="pl-form type-middle"
              :items="DROP_SEARCH_TYPE"
              v-model="searchParams.SEARCH_TYPE"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            검색어
          </span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form type-middle is-lg"
              placeholder="검색어 입력"
              v-model="searchParams.KEYWORD">
            </v-text-field>
          </div>
        </div>
        <div class="is-right spacing-wrap sp-4">
          <v-btn class="pl-btn is-icon flex-grow-0"
            @click="selectQaQstnList">
            <span class="pl-icon20 search"></span>
            조회
          </v-btn>
          <!-- 툴팁 버튼 -->
          <compo-tooltip-btn
            TitleProp="초기화"
            ClassProp="pl-tooltip-btn flex-grow-0"
            IconProp="pl-icon20 refresh"
            TooltipPositionProp="bottom"
            @btnClick="clickResetBtn"
          ></compo-tooltip-btn>
        </div>
      </div>
    </div>

    <div class="pl-grid-top is-mt-s">
      <div class="pl-grid-top-left">
        <strong class="pl-bullet-txt is-blue">{{ propsQaPaperData.PAPER_NM }}</strong>
      </div>
    </div>

    <!-- grid -->
    <v-data-table
      class="pl-grid is-rowspan is-no-hover is-mt-s"
      :headers="headersRowSpan"
      :items="itemsRowSpan"
      fixed-header
      item-key="ROW_NUM"
      height="652px"
      disable-pagination
      hide-default-footer
      no-data-text="등록된 데이터가 없습니다."
    >
      <template v-slot:item="{ item, index }">
        <tr
          :class="mixin_getItemClass(item)"
          :key="index">
          <td >
            <div class="d-flex justify-center">
              <v-checkbox
                v-model="item.CHK"
                class="pl-check"
              ></v-checkbox>
            </div>
          </td>
          <!-- 문항유형 -->
          <td
            v-if="index === 0 || item.QA_LCD !== itemsRowSpan[index - 1].QA_LCD"
            :rowspan="mixin_getRowCount(index, 'QA_LCD')"
            style="white-space: pre-line"
            :class="mixin_getHeaderClass(headersRowSpan[1].align)">
            {{ item.QA_LCD_NM }} ({{getGroupScore(item.QA_LCD, 'QA_LCD')}})
          </td>
          <!-- 문항 -->
          <td
            v-if="index === 0 || item.QA_LMCD !== itemsRowSpan[index - 1].QA_LMCD"
            :rowspan="mixin_getRowCount(index, 'QA_LMCD')"
            style="white-space: normal;"
            :class="mixin_getHeaderClass(headersRowSpan[2].align)">
            <span v-html="item.QA_MCD_NM"></span>
            ({{getGroupScore(item.QA_LMCD, 'QA_LMCD')}})
          </td>
          <!-- 보기 -->
          <td
            v-html="item.QSTN_NM"
            style="white-space: pre-line"
            :class="mixin_getHeaderClass(headersRowSpan[3].align)">
          </td>
          <!-- 점수 -->
          <td class="text-center"  >
            {{ item.QSTN_SCORE }}
          </td>
          <!-- 분류 유형 -->
          <td style="white-space: normal;">
            {{ item.QSTN_TYPE_NM }}
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>

export default {
  name: 'QAM_M0300_ADD_QUESTION', //평가지 문항 추가
  components: {
  },
  props: {
    // 평가지 정보
    propsQaPaperData:{
      type: Object,
      default: () => {},
    },

    // 평가지 문항
    propsQaPaperQstnData:{
      type: Array,
      default: () => [],
    }
  },
  data() {
    return {

      // 검색유형
      DROP_SEARCH_TYPE: [
        { text:"문항유형명", value:"QA_LCD_NM"},
      ],

      // 분류유형
      DROP_QSTN_TYPE: [],

      headersRowSpan: [
        { text: "선택", value: "CHK", align: "center", width: "50px" , sortable: false},
        { text: "문항유형", value: "QA_LCD_NM", align: "left", width: "100px" , sortable: false},
        { text: "문항", value: "QA_MCD_NM", align: "left", width: "200px" , sortable: false},
        { text: "보기", value: "QSTN_NM", align: "left", width: "" , sortable: false},
        { text: "점수", value: "QSTN_SCORE", align: "center", width: "70px" , sortable: false},
        { text: "분류유형", value: "QSTN_TYPE_NM", align: "left", width: "200px" , sortable: false},
      ],

      itemsRowSpan: [],

      // 조회 조건
      searchParams: {
        QSTN_TYPE: "",
        SEARCH_TYPE: "QA_LCD_NM",
        KEYWORD:"",
      },

      //알림창 메시지
      MESSAGE: {
        ALERT:{
          FAIL01:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '선택된 문항이 없습니다.' },
        },
        ERROR: {
          ERROR:
            { alertDialogToggle: true, iconClass: 'is-caution', type: 'default', msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', },
        }
      },
    }
  },
  methods: {

    // 추가 버튼 클릭 시 선택 목록 리턴
    getAddQstnList(){
      return this.itemsRowSpan.filter(row => {return row.CHK;});
    },

    // 조회 조건 초기화
    clickResetBtn(){
      this.searchParams = {
        QSTN_TYPE: "",
        SEARCH_TYPE: "QA_LCD_NM",
        KEYWORD:"",
      };
    }, 
    
    // 문항 조회
    async selectQaQstnList(){

      // let sUrl = '/phone-api/qa/selectQaQstnList';
      let sUrl = '/api/biz/common/select/selectQaQstnList';

      let postParam = {
        CENTER_ID: this.propsQaPaperData.CENTER_ID,
        QSTN_TYPE: this.searchParams.QSTN_TYPE,
        QA_LCD_NM: this.searchParams.KEYWORD,
        USE_YN: 'Y',
        SEARCH_TYPE: 'ADD_POPUP'
      };
      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaEvlQuestionManageMapper'
        , sn : 'selectQaQstnList'
      } };

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        let list = response.DATA;
        
        this.itemsRowSpan = list.map((row)=>{
          row.CHK = false;
          row.PAPER_ID = this.propsQaPaperData.PAPER_ID;
          row.QA_LMCD = row.QA_LCD + row.QA_MCD;
          row.QA_LMSCD = row.QA_LCD + row.QA_MCD + row.QA_LMSCD;
          return row;
        }).filter(row =>{
          return ! this.propsQaPaperQstnData.find(item=>{
            return row.QA_LMSCD == item.QA_LMSCD;
          });
        });
        
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },


    // 분류유형 조회
    async selectQaType(){

      // let sUrl = '/phone-api/qa/selectQaTypeList';
      let sUrl = '/api/biz/common/select/selectQaTypeList';
      
      let postParam = {
        CENTER_ID: this.propsQaPaperData.CENTER_ID,
        USE_YN: "Y",
      };
      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaEvlQuestionManageMapper'
        , sn : 'selectQaTypeList'
      } };

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.DROP_QSTN_TYPE = response.DATA;
      }else{
        this.DROP_QSTN_TYPE = [];
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }

      this.DROP_QSTN_TYPE.unshift({CD_ID:"", CD_NM:"전체"});
    },

    // 그룹별 문항 점수
    getGroupScore(group, type){
      let sum = 0;

      this.itemsRowSpan.forEach(row=>{
        if(row[type] == group){
          if(!this.mixin_isEmpty(row.QSTN_SCORE)) sum += parseInt(row.QSTN_SCORE);
        }
      });

      return sum;
    }
  },
  mounted() {

    // 분류유형 조회
    this.selectQaType();

    // 평가 문항조회
    this.selectQaQstnList();
  },
  created() {
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>