<template>
  <div>
    <div class="pl-grid-top">
      <strong class="pl-bullet-txt is-blue">{{ title }}</strong>
    </div>
    <template v-if="propsData.EVL_SE_CD == 'ARGUDV01'">
      <v-data-table
        class="pl-grid is-rowspan is-mt-s"
        :headers="headersRowSpan"
        :items="itemsRowSpan"
        fixed-header
        item-key="ROW_NUM"
        height="530px"
        disable-pagination
        hide-default-footer
        no-data-text="이의 제기할 항목이 없습니다."
      >
        <template v-slot:item="{ item, index }">
          <tr
            :class="mixin_getItemClass(item)"
            :key="index">
            <!-- 구분 -->
            <td
              v-if="index === 0 || item.QA_LCD !== itemsRowSpan[index - 1].QA_LCD"
              :rowspan="mixin_getRowCount(index, 'QA_LCD')"
              :class="mixin_getHeaderClass(headersRowSpan[0].align)"
              style="white-space: pre-line;"
              v-html=item.QA_LCD_NM>
            </td>
            
            <!-- 문항 -->
            <td
              v-if="index === 0 || item.QA_LMCD !== itemsRowSpan[index - 1].QA_LMCD"
              :rowspan="mixin_getRowCount(index, 'QA_LMCD')"
              :class="mixin_getHeaderClass(headersRowSpan[1].align)"
              style="white-space: pre-line;"
              v-html=item.QA_MCD_NM>
            </td>
            
            <!-- 보기 -->
            <td
              :class="mixin_getHeaderClass(headersRowSpan[2].align)">
              <strong>
                <div
                  v-html="item.QSTN_NM"
                  style="white-space: pre-line"
                  class=""
                ></div>
              </strong>
              <div
                v-html="'</br>설명) '+item.QSTN_DESC"
                style="white-space: pre-line"
              ></div>
            </td>

            <!-- 배점 -->
            <td width="" class="text-center">
              <template v-if="item.QSTN_SCORE">
                {{ item.QSTN_SCORE }}
              </template>
            </td>

            <!-- 점수 -->
            <td width="" class="text-center">
              <template v-if="item.SCORE">
                <strong>{{ item.SCORE }}</strong>
              </template>
            </td>

            <!-- 코멘트 -->
            <td
              v-html=item.MGR_COMT
              style="white-space: pre-line">
            </td>

            <!-- 선택 -->
            <td>
              <div class="d-flex justify-center">
                <v-checkbox
                  v-model="item.CHECK"
                  class="pl-check"
                  style="width: 18px"
                  :readonly="isPreview"
                ></v-checkbox>
              </div>
            </td>
          </tr>
        </template>
      </v-data-table>
    </template>
    <template v-else>
      <v-data-table
        class="pl-grid is-rowspan is-mt-s"
        :headers="headersRowSpan2"
        :items="itemsRowSpan"
        fixed-header
        item-key="ROW_NUM"
        height="530px"
        disable-pagination
        hide-default-footer
        no-data-text="이의 제기할 항목이 없습니다."
      >
        <template v-slot:item.CRTANS_YN="{ item }">
          <v-icon :class="`pl-icon20 ${ item.CRTANS_YN == 'Y'? 'test-circle' : 'test-cross' }`"></v-icon>
        </template>
        <template v-slot:item.CHECK="{ item }">
          <div class="d-flex justify-center">
            <v-checkbox
              v-model="item.CHECK"
              class="pl-check"
              style="width: 18px"
              :readonly="isPreview"
            ></v-checkbox>
          </div>
        </template>
      </v-data-table>
    </template>
  </div>
</template>

<script>
export default {
  name: 'CompoObjectionRequestDialog', //이의제기 항목 등록
  components: {
  },
  props: {
    propsData:{
      type: Object,
      default: {}
    },

    objtArtclList:{
      type: Array,
      default: () => []
    },

    isPreview:{
      type:Boolean,
      default: true
    }
  },
  data() {
    return {

      // QA
      headersRowSpan: [
        { text: '구분', value: 'QA_LCD_NM', align: 'left', width: '100px', sortable: false },
        { text: '문항', value: 'QA_MCD_NM', align: 'left', width: '150px' , sortable: false},
        { text: '보기', value: 'QSTN_NM', align: 'left', sortable: false},
        { text: '배점', value: 'QSTN_SCORE', align: 'center', width: '50px' , sortable: false},
        { text: '점수', value: 'SCORE', align: 'center font-weight-bold', width: '50px' , sortable: false},
        { text: '코멘트', value: 'MGR_COMT', align: '', width: '150px' , sortable: false},
        { text: '선택', value: 'CHECK', align: 'center', width: '50px' , sortable: false},
      ],

      // QT
      headersRowSpan2:[
        { text: '문제 번호', value: 'EVAL_QSTN_SORT', align: 'center', width: '50px', sortable: false },
        { text: '범주', value: 'EXAM_CATE_CD_NM', align: 'center', width: '100px' , sortable: false},
        { text: '배점', value: 'QSTN_SCORE', align: 'center', width: '70px', sortable: false},
        { text: '정답', value: 'QSTN_ANSW', align: 'center', width: '80px' , sortable: false},
        { text: '제출 답안', value: 'ANSW', align: 'center font-weight-bold', width: '60px' , sortable: false},
        { text: '정/오', value: 'CRTANS_YN', align: 'center', width: '60px' , sortable: false},
        { text: '점수', value: 'EVAL_QSTN_SCORE', align: 'center', width: '60px' , sortable: false},
        { text: '선택', value: 'CHECK', align: 'center', width: '60px' , sortable: false},
      ],

      itemsRowSpan: [],

      title: "",
    }
  },
  methods: {
    // QA 이의제기 대상 항목 조회
    async selectQaObjtArtclTgtList(){
      // let sUrl = '/phone-api/objt/selectQaObjtArtclTgtList';
      let sUrl = '/api/biz/common/select/selectQaObjtArtclTgtList';

      let postParam = {
        CENTER_ID: this.propsData.CENTER_ID
        , STD_ID: this.propsData.STD_ID
        , EVAL_DSTN_NO: this.propsData.EVAL_DSTN_NO
        , CUTT_COACHING_ID: this.propsData.CUTT_COACHING_ID
      };

      let headParam = { head : {
        ns : 'lhcs.phone.objt.dao.xml.PhoneObjectionManageMapper'
        , sn : 'selectQaObjtArtclTgtList'
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.itemsRowSpan = response.DATA.map(row=>{
          row.QA_LMCD = row.QA_LCD + row.QA_MCD;
          row.QA_LMSCD = row.QA_LCD + row.QA_MCD + row.QA_SCD;
          row.OBJT_ARTCL_CN = row.QA_LCD_NM + " > "+ row.QA_MCD_NM + " > " + row.QSTN_NM
          row.CHECK = false;
          return row;
        });

        if(this.itemsRowSpan.length > 0 ) this.title = this.itemsRowSpan[0].PAPER_NM;
        this.checkedObjtArtcl();
      }else{
        this.showErrorMsg();
      }
    },

    // 업무평가 이의제기 대상 항목 조회
    async selectQtObjtArtclTgtList(){
      // let sUrl = '/phone-api/objt/selectQtObjtArtclTgtList';
      let sUrl = '/api/biz/common/select/selectQtObjtArtclTgtList';

      let postParam = {
        EVAL_DSTN_NO: this.propsData.EVAL_DSTN_NO
      };

      let headParam = { head : {
        ns : 'lhcs.phone.objt.dao.xml.PhoneObjectionManageMapper'
        , sn : 'selectQtObjtArtclTgtList'
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.itemsRowSpan = response.DATA.map(row=>{
          // row.OBJT_ARTCL_CN = row.EVAL_QSTN_SORT + "번";
          let text = this.getTextFromHtml(this.restoreXSS(row.QSTN_CNTNT));
          row.OBJT_ARTCL_CN = this.mixin_isEmpty(text) || text == "\n" ? row.EVAL_QSTN_SORT + "번": text;
          row.CHECK = false;
          return row;
        });
        if(this.itemsRowSpan.length > 0) this.title = this.itemsRowSpan[0].EVAL_TITLE;
        this.checkedObjtArtcl();
      }else{
        this.showErrorMsg();
      }
    },

    // 텍스트만 추출
    getTextFromHtml(htmlText){
      let text =  "";

      text = htmlText.replace(/<p[^>]*>(.*?)<\/p>/g, '$1\n');
      text = text.replace(/<[^>]*>/g, '');
      text = text.replace(/&nbsp;/g, ' ');

      return text;
    },

    // 이의제기 항목 선택 처리
    checkedObjtArtcl(){
      if(this.objtArtclList.length <= 0) return;
      
      let colName = "QA_LMSCD"
      if(this.propsData.EVL_SE_CD != "ARGUDV01") colName = "ANSW_SEQ_NO";
      
      let checkedArr = this.objtArtclList.map(row=>{return row[colName]});
      for(let i in this.itemsRowSpan){
        if(checkedArr.filter(row=>{return row == this.itemsRowSpan[i][colName]}).length > 0){
          this.itemsRowSpan[i].CHECK = true;
        }
      }
    },

    // 추가 버튼 클릭
    clickAddBtn(){
      let checkedList = this.itemsRowSpan.filter(row=>{return row.CHECK});

      if(checkedList.length <= 0){
        this.showAlertInfo({msg:"추가할 항목을 선택해주세요."});
        return;
      }

      // 추가 처리
      this.$emit("Add", checkedList);
    },

    showErrorMsg(){
      this.showAlertCaution({msg:"일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오."});
    },
  },
  mounted() {
    if(this.propsData.EVL_SE_CD == "ARGUDV01"){
      this.selectQaObjtArtclTgtList();
    }else{
      this.selectQtObjtArtclTgtList();
    }
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