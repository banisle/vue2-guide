<template>
  <div style="display: contents;">
    <div class="pl-quick-layer-body pb-0" style="height: calc(100vh - 253px)">
      <div class="pl-grid-top">
        <div class="pl-grid-top-left">
          <span class="pl-subtit"><span class="is-txt-blue">({{this.qaBaseData.STD_MT_ORD}}차)</span>{{ this.qaBaseData.PAPER_NM }}</span>
        </div>
        <div class="pl-grid-top-utils">
          <CompoAudioWave
            :AudioProp="qaBaseData"
            :popData="qaBaseData"
            :WidthProp="isResult?230:140"
          />
          <compo-tooltip-btn
            TitleProp="배점을 평가점수로 일과 일괄 적용"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 all-chk"
            TooltipPositionProp="bottom"
            @btnClick="clickSetQstnScoreBtn"
            v-if="!isResult"
          ></compo-tooltip-btn>
          <!-- 평가점수 클리어 -->
          <compo-tooltip-btn
            TitleProp="평가점수 클리어"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 refresh"
            TooltipPositionProp="bottom"
            @btnClick="clickClearScoreBtn"
            v-if="!isResult"
          ></compo-tooltip-btn>
        </div>
      </div>
      <!-- grid -->
      <v-data-table
        class="pl-grid is-rowspan is-mt-s is-no-hover"
        :headers="headersRowSpan"
        :items="itemsRowSpan"
        fixed-header
        item-key="ROW_NUM"
        disable-pagination
        height="580px"
        hide-default-footer
        no-data-text="등록된 데이터가 없습니다."
      >
        <template v-slot:item="{ item, index }">
          <tr
            @mouseover="mixin_hoverItem(item,'itemsRowSpan')"
            @mouseleave="mixin_leaveItem(item,'itemsRowSpan')"
            :class="mixin_getItemClass(item)"
            :key="index">
            <td
              v-if="index === 0 || item.QA_LCD !== itemsRowSpan[index - 1].QA_LCD"
              :rowspan="mixin_getRowCount(index, 'QA_LCD')"
              style="white-space: pre-line"
              :class="mixin_getHeaderClass(headersRowSpan[0].align)">{{ item.QA_LCD_NM }}({{ item.QA_LCD_SCORE }})</td>
            <td
              v-if="index === 0 || item.QA_LMCD !== itemsRowSpan[index - 1].QA_LMCD"
              v-html=item.QA_MCD_NM
              style="white-space: pre-line"
              :rowspan="mixin_getRowCount(index, 'QA_LMCD')"
              :class="mixin_getHeaderClass(headersRowSpan[1].align)"></td>
            <!-- <td
              v-html=item.QSTN_NM
              style="white-space: pre-line"
              :class="mixin_getHeaderClass(headersRowSpan[2].align)">
            </td> -->
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
            <td width="" class="text-center px-0">
              <template v-if="item.QSTN_SCORE">
                {{ item.QSTN_SCORE }}
                <compo-tooltip-btn
                  TitleProp="표준 코멘트"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 document"
                  TooltipPositionProp="bottom"
                  @btnClick="clickSetStdOpnn(item, index)"
                  v-if="!mixin_isEmpty(item.STD_OPNN) && !isResult"
                ></compo-tooltip-btn>
              </template>
            </td>
            <td width="" class="text-center">
              <v-text-field
                  v-model="item.SCORE"
                  class="pl-form text-center"
                  oninput="this.value=this.value.replace(/(?!^-)[^0-9.]/g, '')"
                  @input="changeScore(index)"
                  :disabled="isResult"
                 />
            </td>
            <td class="py-2">
              <v-textarea
                class="pl-form is-noresize "
                v-model="item.MGR_COMT"
                :spellcheck="false"
                :readonly="isResult"
                style="height: 100%;"
                v-byte-counter="2000"
              />
            </td>
          </tr>
        </template>
        <!-- 합계 -->
        <template slot="footer">
          <div class="pl-grid-sum">
            <table >
              <colgroup>
                <col v-for="(col, index) in headersRowSpan" :key="index" :width=col.width />
              </colgroup>
              <tbody >
                <tr >
                  <td colspan="3"class="pl-grid-sum-head text-center">평가 점수</td>
                  <td class="text-center">
                    {{ mixin_sum_field(this.itemsRowSpan, "QSTN_SCORE") }}
                  </td>
                  <td class="text-center" >
                    {{ getSumScore("SCORE") }}
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </v-data-table>
    </div>
    <div class="pl-quick-layer-footer">
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline">
          <span class="pl-label">
            콜구분
          </span>
          <div class="pl-desc">
            <v-select
              v-model="qaBaseData.CALL_TYPE"
              :items="DROP_CALL_TYPE"
              class="pl-form type-middle is-sm"
              placeholder="선택"
              :disabled="isResult"
              @change="changeCallType"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline">
          <div class="pl-desc">
            <v-text-field 
              class="pl-form  type-middle" 
              placeholder="콜구분 사유"
              style="width:300px;" 
              v-model="qaBaseData.CALL_TYPE_RSN"
              :disabled="mixin_isEmpty(qaBaseData.CALL_TYPE) || this.isResult"
              v-byte-counter="4000"/>
          </div>
        </div>
      </div>
      <div class="pl-btn-wrap ml-auto">
        <v-btn class="pl-btn is-trans" @click="clickCloseBtn">닫기</v-btn>
        <v-btn class="pl-btn is-icon is-trans" v-if="!isPreview" @click="clickCompleteBtn">
          <span class="pl-icon20 person-chk"></span>
          평가완료
        </v-btn>
        <v-btn class="pl-btn" v-if="!isPreview" @click="clickSaveBtn">저장</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import CompoAudioWave from '@/components/CompoAudioWave';

export default {
  name: 'QAM_M0500_CS_DETAIL_01', //평가실행관리 - 평가결과
  components: {
    CompoAudioWave
  },
  props: {
    // 선택 상담이력 정보
    qaBaseData:{
      type: Object,
      default: ()=>{}
    },
  },
  data() {
    return {
      headersRowSpan: [
        { text: "구분", value: "QA_LCD_NM", align: "left", width: "10%" , sortable: false},
        { text: "문항", value: "QA_MCD_NM", align: "left", width: "25%" , sortable: false},
        { text: "보기", value: "QSTN_NM", align: "left", width: "" , sortable: false},
        { text: "배점", value: "QSTN_SCORE", align: "center", width: "7%" , sortable: false},
        { text: "점수", value: "SCORE", align: "center", width: "6%" , sortable: false},
        { text: "코멘트", value: "MGR_COMT", align: "left", width: "30%" , sortable: false},
      ],
      itemsRowSpan: [],

      // 콜구분
      DROP_CALL_TYPE: [
        { text:"미지정", value:"" }
        , { text:"베스트콜", value:"B" }
        , { text:"워스트콜", value:"W" }
      ],

      // 미리보기 여부
      isPreview: false,

      // 평가결과 여부
      isResult: false,

      // 저장여부
      isSave: true,

      MESSAGE: {
        CONFIRM: {
          SAVE:{ alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '해당 평가지를 저장하시겠습니까?', callYes: this.saveQaExecuteResult, callNo: this.closeAlert, },
        },
        ALERT:{
        },
        TOAST : {
          SAVE_DONE : {  msg: '평가결과가 저장되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 },
        },
        ERROR: {
          ERROR:
            { alertDialogToggle: true, iconClass: 'is-caution', type: 'default', msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', },
        }
      },
    }
  },
  methods: {

    async selectQaExecutePaperQstn(){

      // let sUrl = '/phone-api/qa/selectQaExecutePaperQstn';
      let sUrl = '/api/biz/common/select/selectQaExecutePaperQstn';

      let postParam = {
        CENTER_ID: this.qaBaseData.CENTER_ID
        , PAPER_ID: this.qaBaseData.PAPER_ID
        , STD_ID: this.qaBaseData.STD_ID
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaExecuteManageMapper'
        , sn : 'selectQaExecutePaperQstn'
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.itemsRowSpan = response.DATA.map(row=>{
          row.QA_LMCD = row.QA_LCD + row.QA_MCD;
          row.QA_LMSCD = row.QA_LCD + row.QA_MCD + row.QA_LMSCD;
          return row;
        });
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    // 평가 완료 버튼
    clickCompleteBtn(){
      // 미리보기인 경우 사용불가
      if(this.isPreview) return;
      this.isSave = false;

      for(let i=0; i<this.itemsRowSpan.length; i++){
        if(this.mixin_isEmpty(this.itemsRowSpan[i].SCORE)){
          this.showAlertCaution({msg:"평가되지 않은 항목이 있습니다."});
          return;
        }
      }

      this.MESSAGE.CONFIRM.SAVE.msg = "해당 평가지를 평가완료 하시겠습니까?";
      this.showAlert(this.MESSAGE.CONFIRM.SAVE);
    },

    // 평가저장 버튼
    clickSaveBtn(){
      // 미리보기인 경우 사용불가
      if(this.isPreview) return;

      this.isSave = true;

      this.MESSAGE.CONFIRM.SAVE.msg = "해당 평가지를 저장하시겠습니까?";
      this.showAlert(this.MESSAGE.CONFIRM.SAVE);
    },

    // 평가결과 저장
    async saveQaExecuteResult(){

      this.closeAlert();

      let sUrl = '/phone-api/qa/saveQaExecuteResult';

      let postParam = {
        CENTER_ID: this.qaBaseData.CENTER_ID
        , PHN_CUTT_ID: this.qaBaseData.PHN_CUTT_ID
        , STD_MT: this.qaBaseData.STD_MT.replaceAll("-", "")
        , STD_MT_ORD: this.qaBaseData.STD_MT_ORD
        , PAPER_ID: this.qaBaseData.PAPER_ID
        , STD_ID: this.qaBaseData.STD_ID
        , APPLY_YN: this.qaBaseData.APPLY_YN
        , CALL_TYPE: this.qaBaseData.CALL_TYPE
        , CALL_TYPE_RSN: this.qaBaseData.CALL_TYPE_RSN
        , COMPLETE_YN: this.isSave ? "N" : "Y"
        , STD_SCORE: this.mixin_sum_field(this.itemsRowSpan, "SCORE")
        , TGT_EMP_NO: this.qaBaseData.TGT_EMP_NO
        , MGR_EMP_NO: this.qaBaseData.MGR_EMP_NO
        , qstnList: this.itemsRowSpan.map(row=>{return {
                        QA_LCD: row.QA_LCD
                        , QA_MCD: row.QA_MCD
                        , QA_SCD: row.QA_SCD
                        , SCORE: isNaN(Number(row.SCORE)) ? '0' : row.SCORE // 하이픈만 입력된 경우 0점 처리
                        , MGR_COMT: row.MGR_COMT
                    }})
      };

      let headParam = { head : { DATA_OBJECT:"qstnList"}};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.showAlert(this.MESSAGE.TOAST.SAVE_DONE);
        this.$emit("refresh");
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    // 배점 일괄 적용
    clickSetQstnScoreBtn(){
      this.itemsRowSpan.map(row=>{
        row.SCORE = row.QSTN_SCORE;
        return row;
      });
    },

    // 점수 초기화 버튼
    clickClearScoreBtn(){
      this.itemsRowSpan.map(row=>{
        row.SCORE = "";
        return row;
      });
    },

    // 표준 코멘트 적용
    clickSetStdOpnn(item, index){
      item.MGR_COMT = item.STD_OPNN;
    },

    // 점수 변경시 이벤트
    changeScore(index){
      if(parseInt(this.itemsRowSpan[index].SCORE) > parseInt(this.itemsRowSpan[index].QSTN_SCORE)){
        this.$nextTick(() => {
          this.itemsRowSpan[index].SCORE = "";
          this.showAlertCaution({msg:"점수는 배점 이내로 입력해주세요."});
        });
      }
    },

    getSumScore(group){
      let sum = 0;

      for(let i in this.itemsRowSpan){
        if(this.itemsRowSpan[i][group] != "" && this.itemsRowSpan[i][group] != "-") sum += parseInt(this.itemsRowSpan[i][group]);
      }

      return sum;
    },

    // 콜구분 변경 시
    changeCallType(){
      // 콜구분 미지정 시 사유 삭제
      if(this.mixin_isEmpty(this.qaBaseData.CALL_TYPE)) this.qaBaseData.CALL_TYPE_RSN = "";
    },

    clickCloseBtn(){
      this.$emit("close");
    },
  },
  mounted() {
    this.isPreview = this.qaBaseData.isPreview;
    this.isResult = this.qaBaseData.isResult;
    if(this.isPreview){
      this.qaBaseData.STD_MT_ORD = this.mixin_nvl(this.qaBaseData.STD_MT_ORD, 0);
    }
    this.selectQaExecutePaperQstn();
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