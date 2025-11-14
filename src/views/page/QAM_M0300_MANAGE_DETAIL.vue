<template>
  <div class="fill-height">
    <div class="pl-quick-layer-body" style="height: calc(100vh - 210px)">
      <div class="pl-grid-top">
        <div class="pl-grid-top-left">
          <h2 class="pl-subtit">{{ qaPaperData.PAPER_NM }}</h2>
        </div>
        <div class="pl-grid-top-utils">
          <v-btn class="pl-btn is-icon is-trans" @click="openAddQaQstnPopup" :disabled="isUse">
            <span class="pl-icon20 circle-plus"></span>
            문항추가
          </v-btn>
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
            :class="mixin_getItemClass(item)">
            <td >
              <div class="d-flex justify-center">
                <v-checkbox
                  v-model="item.CHK"
                  class="pl-check"
                  @change="checkItem($event, item)"
                ></v-checkbox>
              </div>
            </td>
            <!-- 문항유형 -->
            <td
              v-if="index === 0 || item.QA_LCD !== itemsRowSpan[index - 1].QA_LCD"
              :rowspan="mixin_getRowCount(index, 'QA_LCD')"
              style="white-space: pre-line"
              :class="mixin_getHeaderClass(headersRowSpan[1].align)">
              <v-checkbox
                v-model="item.GROUP_CHK"
                class="pl-check"
                @change="checkGroup($event, item)"
              ></v-checkbox>
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
            <td>
              <v-text-field class="pl-form type-middle text-center"
                oninput="this.value=this.value.replace(/[^0-9]/g,'')"
                v-model="item.QSTN_SCORE"
                :disabled="isUse" />
            </td>
          </tr>
        </template>
      </v-data-table>
    </div>
    <div class="pl-quick-layer-footer">
      <!-- list up 버튼 -->
      <compo-tooltip-btn
        TitleProp="이전"
        ClassProp="pl-tooltip-btn"
        IconProp="pl-icon20 is-list-up"
        TooltipPositionProp="top"
        @btnClick="moveBtn('UP')"
      ></compo-tooltip-btn>
      <!-- list down 버튼 -->
      <compo-tooltip-btn
        TitleProp="다음"
        ClassProp="pl-tooltip-btn"
        IconProp="pl-icon20 is-list-down"
        TooltipPositionProp="top"
        @btnClick="moveBtn('DOWN')"
      ></compo-tooltip-btn>

      <div class="pl-btn-wrap ml-auto">
        <v-btn class="pl-btn is-trans" @click="$emit('Close')">닫기</v-btn>
        <v-btn class="pl-btn is-icon is-trans" @click="clickDeleteBtn" :disabled="isUse">
          <span class="pl-icon20 trash"></span>
            삭제
        </v-btn>
        <v-btn class="pl-btn" @click="clickSaveBtn">저장</v-btn>
      </div>
    </div>
    <!-- dialog -->
    <v-dialog
      v-model="dialogAddQuestion"
      v-if="dialogAddQuestion"
      content-class="dialog-draggable is-maxHeight"
      width="1300"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="평가지 문항 추가"
        @hide="mixin_hideDialog('AddQuestion')"
      >
        <template slot="body">
          <QAM_M0300_ADD_QUESTION 
            ref="QAM_M0300_ADD_QUESTION"
           :propsQaPaperData="qaPaperData"
           :propsQaPaperQstnData="itemsRowSpan"
           @Add="(data)=>{addQaPaperQstn(data)}"
           />
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="mixin_hideDialog('AddQuestion')">닫기</v-btn>
          <v-btn class="pl-btn" @click="clickAddBtn">추가</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
import QAM_M0300_ADD_QUESTION from '@/views/page/QAM_M0300_ADD_QUESTION.vue';

export default {
  name: 'QAM_M0300_MANAGE_DETAIL', //평가지 관리 문항관리
  components: {
    QAM_M0300_ADD_QUESTION
  },
  props: {
    propsQaPaperData:{
      type: Object,
      default: () => {},
    }
  },
  data() {
    return {
      // dialog
      dialogAddQuestion: false,
      
      // grid
      headersRowSpan: [
        { text: "선택", value: "CHK", align: "center", width: "50px" , sortable: false},
        { text: "문항유형", value: "QA_LCD_NM", align: "left", width: "100px" , sortable: false},
        { text: "문항", value: "QA_MCD_NM", align: "left", width: "200px" , sortable: false},
        { text: "보기", value: "QSTN_NM", align: "left", width: "" , sortable: false, cellClass:""},
        { text: "점수", value: "QSTN_SCORE", align: "center", width: "70px" , sortable: false},
      ],

      // 평가지 상세정보
      qaPaperData: {},

      // 평가지 문항 목록
      itemsRowSpan: [],

      // 버튼 비활성화 여부
      isUse: false,

      //알림창 메시지
      MESSAGE: {
        CONFIRM: {
          SAVE:{ alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '해당 평가지 문항을 저장하시겠습니까?', callYes: this.saveQaPaperQstnList, callNo: this.closeAlert, },
          DELETE:{ alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '선택된 문항을 삭제하시겠습니까?', callYes: this.deleteQaPaperQstn, callNo: this.closeAlert, },
        },
        ALERT:{
          FAIL01:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '선택된 문항이 없습니다.' },
          FAIL02:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '사용중인 평가지 문항은 삭제할 수 없습니다.' },
          FAIL03:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '사용중인 평가지는 문항을 추가할 수 없습니다.' },
        },
        TOAST : {
          SAVE_DONE : {  msg: '평가지 문항이 저장되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 },
        },
        ERROR: {
          ERROR:
            { alertDialogToggle: true, iconClass: 'is-caution', type: 'default', msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', },
        }
      },

    }
  },
  methods: {

    // 평가지 문항 조회
    async selectQaPaperQstnList(){

      // let sUrl = '/phone-api/qa/selectQaPaperQstnList';
      let sUrl = '/api/biz/common/select/selectQaPaperQstnList';
      let postParam = {
        CENTER_ID: this.qaPaperData.CENTER_ID,
        PAPER_ID: this.qaPaperData.PAPER_ID,
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaPaperManageMapper'
        , sn : 'selectQaPaperQstnList'
      } };

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.itemsRowSpan = response.DATA.map((row, index)=>{
          row.CHK = false;
          row.GROUP_CHK = false;
          row.PAPER_ID = this.qaPaperData.PAPER_ID;
          row.QA_LMCD = row.QA_LCD + row.QA_MCD;
          row.QA_LMSCD = row.QA_LCD + row.QA_MCD + row.QA_LMSCD;
          return row;
        });
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    // 저장버튼 클릭 이벤트
    clickSaveBtn(){      
      if(this.mixin_isEmpty(this.qaPaperData.PAPER_ID)) return;
      this.showAlert(this.MESSAGE.CONFIRM.SAVE);
    },

    // 평가지 문항 저장
    async saveQaPaperQstnList(){

      this.closeAlert();

      let qaQstnList = this.itemsRowSpan.map(row=>{
        return {
          CENTER_ID: row.CENTER_ID
          , PAPER_ID: row.PAPER_ID
          , QA_LCD: row.QA_LCD
          , QA_MCD: row.QA_MCD
          , QA_SCD: row.QA_SCD
          , QSTN_NM: row.QSTN_NM
          , QSTN_TYPE: row.QSTN_TYPE
          , QSTN_DESC: row.QSTN_DESC
          , QSTN_SCORE: row.QSTN_SCORE
          , STD_OPNN: row.STD_OPNN
        };
      });

      let sUrl = '/phone-api/qa/saveQaPaperQstnList';
      let postParam = {
        CENTER_ID: this.qaPaperData.CENTER_ID,
        PAPER_ID: this.qaPaperData.PAPER_ID,
        USER_ID: this.$store.getters['userStore/GE_USER_ROLE'].USER_ID,
        qaQstnList: qaQstnList,
      };

      let headParam = { head : { DATA_OBJECT: "qaQstnList", } };

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.showToast(this.MESSAGE.TOAST.SAVE_DONE);

        // 재조회
        this.$emit("Select");

        // 상세 팝업 닫기
        this.$emit("Close");

      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    // 삭제버튼 클릭 이벤트
    clickDeleteBtn(){

      // 사용중인 경우 문항 삭제 불가
      if(this.isUse){
        this.showAlert(this.MESSAGE.ALERT.FAIL02);
        return;
      }

      let checkedList = this.itemsRowSpan.filter(row=>{return row.CHK});
      if(checkedList.length<=0){
        this.showAlert(this.MESSAGE.ALERT.FAIL01);
        return;
      }

      this.showAlert(this.MESSAGE.CONFIRM.DELETE);
    },

    // 평가문항 삭제
    deleteQaPaperQstn(){
      this.closeAlert();

      let checkedList = this.itemsRowSpan.map((row, index)=>{return {index:index, isChecked:row.CHK}}).filter(row=>{return row.isChecked});

      checkedList.reverse().forEach(row=>{
        this.itemsRowSpan.splice(row.index, 1);
      });
    },

    openAddQaQstnPopup(){
      if(this.isUse){
        this.showAlert(this.MESSAGE.ALERT.FAIL03);
        return;
      }

      this.mixin_showDialog('AddQuestion');
    },

    clickAddBtn(){
      if(this.$refs.QAM_M0300_ADD_QUESTION != undefined){
        let list = this.$refs.QAM_M0300_ADD_QUESTION.getAddQstnList();

        if(list.length <= 0){
          this.showAlert(this.MESSAGE.ALERT.FAIL01);
          return;
        }

        // 다이얼로그 닫기
        this.mixin_hideDialog("AddQuestion");

        // 추가
        list.forEach( e => {
            e.CHK = false;
            
            let qaLcdIndex = -1;
            let qaLMcdIndex = -1;

            this.itemsRowSpan.forEach((_e, index)=>{
                if (e.QA_LCD === _e.QA_LCD) {
                  qaLcdIndex = index;
                }
                
                if (e.QA_LMCD === _e.QA_LMCD) {
                  qaLMcdIndex = index;
                }
            });
            
            if (qaLcdIndex > -1 && qaLMcdIndex > -1) {
              this.itemsRowSpan.splice(qaLMcdIndex + 1, 0, e);
            } else if (qaLcdIndex > -1) {
              this.itemsRowSpan.splice(qaLcdIndex + 1, 0, e);
            } else {
              this.itemsRowSpan.push(e);
            }
        });
      }
    },

    // 체크박스 선택 이벤트
    checkItem(isChecked, item){
      let group = this.itemsRowSpan.filter(row => {return row.QA_LCD == item.QA_LCD && row.QA_MCD == item.QA_MCD;});
      let isGroupChk = false;
      
      // 동일 그룹 선택 여부 확인
      group.map(row=>{
        if(row.GROUP_CHK){
          isGroupChk = true;
        }
      });

      // 동일 그룹 선택 해제
      if(isGroupChk && !isChecked){
        this.itemsRowSpan.filter(row => {return row.QA_LCD == item.QA_LCD}).map(row=>{row.CHK = false; row.GROUP_CHK = false;});
      }

      // 다른 그룹 선택 해제
      this.itemsRowSpan.filter(row => {return row.CHK && (row.QA_LCD != item.QA_LCD || row.QA_MCD != item.QA_MCD);}).map(row=>{row.CHK = false; row.GROUP_CHK = false;});
    },

    // 그룹 체크박스 선택 이벤트
    checkGroup(isChecked, item){
      // 다른 그룹 선택 해제
      this.itemsRowSpan.filter(row => {return row.CHK && row.QA_LCD != item.QA_LCD;}).map(row=>{row.CHK = false; row.GROUP_CHK = false;});

      // 동일 그룹 선택
      this.itemsRowSpan.filter(row => {return row.QA_LCD == item.QA_LCD;}).map(row=>{row.CHK = isChecked; row.GROUP_CHK = true;});
    },

    // 정렬순서 변경 버튼 클릭 이벤트
    moveBtn(type){
      let isUp = type == "UP";
      let checkedIndex = this.itemsRowSpan.map((row, idx)=>{return {index:idx, checked: row.CHK}}).filter(row=>{return row.checked});

      if(checkedIndex.length<=0){
        this.showAlert(this.MESSAGE.ALERT.FAIL01);
        return;
      }

      if(!isUp){
        checkedIndex = checkedIndex.slice().reverse();
      }

      let beingMovedIndex = checkedIndex[0].index;
      let qaLcdCnt = 0;
      let qaMcdCnt = 0;
      let qaScdCnt = 0;

      this.itemsRowSpan.forEach(row=>{
        if (row.QA_LCD === this.itemsRowSpan[beingMovedIndex].QA_LCD) qaLcdCnt += 1;
        if (row.QA_LMCD === this.itemsRowSpan[beingMovedIndex].QA_LMCD) qaMcdCnt += 1;
        if (row.QA_LMSCD === this.itemsRowSpan[beingMovedIndex].QA_LMSCD) qaScdCnt += 1;
      });

      let isCheckedLcd = checkedIndex.length === qaLcdCnt;
      let isCheckedMcd = checkedIndex.length === qaMcdCnt;
      let isCheckedScd = checkedIndex.length === qaScdCnt;

      let movingIndex = 0;

      if(isUp){
        if(beingMovedIndex == 0) return;

        let beforeIndex = 0;

        if (isCheckedLcd) {
          for (let i = 0; i < this.itemsRowSpan.length; i++) {
              if (this.itemsRowSpan[i].QA_LCD === this.itemsRowSpan[beingMovedIndex - 1].QA_LCD) {
                beforeIndex = i;
                break;
              }
          }
        } else if (isCheckedMcd) {
          if (this.itemsRowSpan[beingMovedIndex].QA_LCD !== this.itemsRowSpan[beingMovedIndex - 1].QA_LCD) return;
          for (let i = 0; i < this.itemsRowSpan.length; i++) {
              if (this.itemsRowSpan[i].QA_LMCD === this.itemsRowSpan[beingMovedIndex - 1].QA_LMCD) {
                  beforeIndex = i;
                  break;
              }
          }
        } else {
          if (this.itemsRowSpan[beingMovedIndex].QA_LMCD !== this.itemsRowSpan[beingMovedIndex - 1].QA_LMCD) return;
              beforeIndex = beingMovedIndex - 1;
        }

        movingIndex = beforeIndex - beingMovedIndex;

      }else{
        if (beingMovedIndex === this.itemsRowSpan.length - 1) return;
        let nextIndex = 0;

        if (isCheckedLcd) {
          for (var i = this.itemsRowSpan.length - 1; i >= 0; i--) {
              if (this.itemsRowSpan[i].QA_LCD === this.itemsRowSpan[beingMovedIndex + 1].QA_LCD) {
                  nextIndex = i;
                  break;
              }
          }
        } else if (isCheckedMcd) {
            if (this.itemsRowSpan[beingMovedIndex].QA_LCD !== this.itemsRowSpan[beingMovedIndex + 1].QA_LCD) return;
            for (var i = this.itemsRowSpan.length - 1; i >= 0; i--) {
                if (this.itemsRowSpan[i].QA_LMCD === this.itemsRowSpan[beingMovedIndex + 1].QA_LMCD) {
                    nextIndex = i;
                    break;
                }
            }
        } else {
            if (this.itemsRowSpan[beingMovedIndex].QA_LMCD !== this.itemsRowSpan[beingMovedIndex + 1].QA_LMCD) return;
            nextIndex = beingMovedIndex + 1;
        }

        movingIndex = nextIndex - beingMovedIndex;
      }

      checkedIndex.forEach((row)=> {
        this.moveArrayPosition(this.itemsRowSpan, row.index, movingIndex);
      });
    },

    // 배열 순서 변경 함수
    moveArrayPosition(array, index, delta){
      let newIndex = index + delta;

      while (index < 0) {
          index += array.length;
      }
      while (newIndex < 0) {
          newIndex += array.length;
      }
      if (newIndex >= array.length) {
          newIndex = 0;
          index = array.length - 1;
      }
      array.splice(newIndex, 0, array.splice(index, 1)[0]);
    },

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
    // 평가지 정보 셋팅
    this.qaPaperData = JSON.parse(JSON.stringify(this.propsQaPaperData));

    // 사용여부에 따라 비활성화 여부 셋팅
    // 사용중인 경우 문항추가, 삭제 불가
    this.isUse = this.qaPaperData.USE_CNT == "0" ? false : true;

    // 문항정보 조회
    this.selectQaPaperQstnList();
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