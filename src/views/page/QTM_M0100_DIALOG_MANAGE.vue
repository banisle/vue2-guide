<template>
  <div class="fill-height parent" >
    <!-- 버튼 -->
    <div class="div1 px-5 py-3 is-border-bottom is-border-right">
      <div class="pl-btn-wrap">
        <!-- 추가 -->
        <compo-tooltip-btn
          TitleProp="문항 추가"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 circle-plus"
          TooltipPositionProp="bottom"
          @btnClick="addQtData()"
        ></compo-tooltip-btn>
        <!-- 삭제 -->
        <compo-tooltip-btn
          TitleProp="선택문항 삭제"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 trash"
          TooltipPositionProp="bottom"
          @btnClick="delQtDataFn()"
        ></compo-tooltip-btn>
        <!-- list up 버튼 @btnClick="mixin_testLog('list up')" -->
        <compo-tooltip-btn
          TitleProp="위로"
          ClassProp="pl-tooltip-btn ml-auto"
          IconProp="pl-icon20 is-list-up"
          TooltipPositionProp="bottom"
          @btnClick="handleUp()"
        ></compo-tooltip-btn>
        <!-- list down 버튼 @btnClick="mixin_testLog('list down')" -->
        <compo-tooltip-btn
          TitleProp="아래로"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 is-list-down"
          TooltipPositionProp="bottom"
          @btnClick="handleDown()"
        ></compo-tooltip-btn>
      </div>
    </div>
    <!-- 타이틀 -->
    <div class="div2 px-5 py-3 d-flex is-border-bottom">
      <h3 class="pl-subtit is-lg" >{{this.qstnPaperData.PAPER_TITLE}}</h3>
      <v-btn class="pl-btn is-icon is-trans ml-auto" @click="showPreviewSheet()">
        <span class="pl-icon20 board-docu"></span>
        평가지 미리보기
      </v-btn>
    </div>
    <!-- 문항 -->
    <div class="div3 px-5 py-5 is-border-right pl-scroll-body" style="height: calc(100vh - 255px);">
      <div class="spacing-wrap sp-8 flex-column">
        <div
          :class="`pl-rounded-box pa-3 hover-outline ${ selectedIndex === QSTN_SORT ? 'selected-q' : ''}`"
          @click="selecteInfo(q.QSTN_NO, QSTN_SORT)"
          v-for="q, QSTN_SORT in evalQstnPaper"
          :key="q.id">
          <strong style="font-size: 16px;">{{ q.QSTN_SORT }}번</strong>
          <div class="spacing-wrap sp-4 pt-1">
            <span>{{ q.QSTN_TYPE_NM }}</span>
            <span>{{ q.ANSW_TYPE_NM }}</span>
            <span>{{ q.QSTN_SCORE }}</span>점
          </div>
        </div>
      </div>
    </div>
    <!-- 문항 상세 : 에디터-->
    <div class="div4 is-border-right">
      <!-- editor -->
      <div class="px-5 pt-5">
        <crosseditor
          v-model="crosseditor_initial_value"
          id="ne-crosseditor-001"
          ref="crossEditor"
          editorHeight="300"
          editorWidth="860"
          @initEditorCompleted="initEditorCompleted"
        ></crosseditor>
      </div>
      <!-- 보기/해설  -->
      <div class="div5 py-3 ">
        <!-- tab    -->
        <div class="is-border-bottom">
          <v-tabs
            v-model="tabs2"
            @change="tabChange(tabs2)"
            slider-size="2"
            class="pl-tabs px-4 is-noborder">
            <CompoTabItems :TabsList=tabsList2 >
            </CompoTabItems>
            <v-btn
              v-if="addQtBtnView"
              @click="addExmp()" class="pl-btn is-icon is-trans ml-auto align-self-center" >
              <span class="pl-icon20 circle-plus"></span>
              보기 추가 <!-- 객관식 보기 추가   여기가  보기 추가 버튼 영역   -->
            </v-btn>
          </v-tabs>
        </div>
        <v-tabs-items v-model="tabs2">
          <div class="fill-height">
            <template v-for="(item, index) in tabsList2" >
              <v-tab-item :key="index">
                <div
                  :class="`fill-height tab-contents`">
                  <component :is="item.content" 
                    :ref="item.content" 
                    :DataProp="selectedItem" 
                    :TypeProp="SendProp"
                    :AnswList="answ_list"
                    @onChangeAnswList="handleChangeAnswList"
                    @onChangeIndex="handleChangeIndex"
                    ></component>
                  <!-- AnswList 라는 명으로 answ_list 값을 props로 던짐 -->
                </div>
              </v-tab-item>
            </template>
          </div>
        </v-tabs-items>
      </div>
    </div>
    <!-- 문항 정보 / 출제자 정보 -->
    <div class="div6 px-5 py-5">
      <div>
        <h3 class="pl-subtit is-lg">문항 정보</h3>
        <div class="is-mt-m">
          <div class="pl-form-inline-wrap vertical label-80">
            <div class="pl-form-inline">
              <span class="pl-label">
                  <!-- 객관식 주관식 value="pl-form" -->
                문제 형식
              </span>
              <div class="pl-desc">
                <v-select
                  @change="sendQinfo"
                  :items="mixin_common_code_get(this.common_code, 'QUST_DV','')"
                  v-model="this.modelQtype"
                  class="pl-form type-middle"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                답변 형식
              </span>
              <div class="pl-desc">
                <!-- 객관식  <template v-if="modelQtype === 'S'">
                    :items="itemsAtype"  -->
                <template v-if="this.modelQtype === 'S'">
                  <v-select
                    @change="sendQinfo"
                   :items="mixin_common_code_get(this.common_code, 'MULT_DV','')"
                    v-model="this.modelAtype"
                    class="pl-form type-middle"
                    value="pl-form"
                    />
                </template>
                <!-- 주관식   v-model="modelAtype2" :items="itemsAtype2" -->
                <template v-if="this.modelQtype === 'D'">
                  <v-select
                    @change="sendQinfo"
                     :items="mixin_common_code_get(this.common_code, 'SHOT_DV','')"
                    v-model="this.modelAtype2"
                    class="pl-form type-middle"
                    value="pl-form"
                    />
                </template>
                </div>
              </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                난이도
              </span>
              <div class="pl-desc"><!-- --> 
                <v-select
                  @change="sel_QSTN_LEVEL"
                  :items="mixin_common_code_get(this.common_code, 'QUEST_LV','')"
                  v-model="this.evalQstnBankInfo_.QSTN_LEVEL"
                  class="pl-form type-middle"
                  value="pl-form"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                배점
              </span>
              <div class="pl-desc">
                <v-text-field
                  @change="sel_QSTN_SCORE"
                  v-model="this.evalQstnBankInfo_.QSTN_SCORE"
                  class="pl-form type-middle"
                  type="number" />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                범주
              </span>
              <div class="pl-desc">
                <v-select
                  @change="sel_EXAM_CATE_CD"
                  class="pl-form type-middle"
                  value="pl-form"
                  placeholder="선택"
                   :items="mixin_common_code_get(this.common_code, 'T404','')"
                  v-model="this.evalQstnBankInfo_.EXAM_CATE_CD"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-6 is-border-sub-top pt-6">
        <h3 class="pl-subtit is-lg">출제자 정보</h3>
        <div class="is-mt-m">
          <div class="pl-form-inline-wrap vertical label-80" style="gap: 0">
            <div
              class="pl-form-inline">
              <span class="pl-label">출제자</span>
              <div class="pl-desc">
                <span class="pl-value-txt">{{ this.evalQstnBankInfo_.REG_EMP_NM }}</span>
              </div>
            </div>
            <div
              class="pl-form-inline">
              <span class="pl-label">출제일</span>
              <div class="pl-desc"><span class="pl-value-txt">{{ this.evalQstnBankInfo_.REG_DT }}</span></div>
            </div>
            <div
              class="pl-form-inline">
              <span class="pl-label">수정자</span>
              <div class="pl-desc">
                <span class="pl-value-txt">{{ this.evalQstnBankInfo_.UPD_EMP_NM }}</span>
              </div>
            </div>
            <div
              class="pl-form-inline">
              <span class="pl-label">수정일</span>
              <div class="pl-desc"><span class="pl-value-txt">{{ this.evalQstnBankInfo_.UPD_DT }}</span></div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- dialog:평가지 미리보기 -->
    <template v-if="dialogPreviewSheet">
      <!--CompoPreviewSheet @ConfirmTest="dialogPreviewSheet = false"/-->
      <QTM_M0100_PAPER_Preview @ConfirmTest="dialogPreviewSheet = false"
      :qstnPaperData="qstnPaperData"
      />
    </template>
  </div>
</template>

<script>
import CompoTabItems from '@/components/CompoTabItems.vue';
import CompoPreviewSheet from '@/components/CompoPreviewSheet.vue';
import QTM_M0100_DIALOG_MANAGE_TAB_01 from '@/views/page/QTM_M0100_DIALOG_MANAGE_TAB_01.vue';
import QTM_M0100_DIALOG_MANAGE_TAB_02 from '@/views/page/QTM_M0100_DIALOG_MANAGE_TAB_02.vue';
import QTM_M0100_PAPER_Preview from '@/views/page/QTM_M0100_PAPER_Preview.vue';

export default {
  name: 'QTM_M0100_DIALOG_MANAGE', //평가지 문항 관리
  components: {
    CompoTabItems,
    CompoPreviewSheet,
    QTM_M0100_PAPER_Preview,
    QTM_M0100_DIALOG_MANAGE_TAB_01,
    QTM_M0100_DIALOG_MANAGE_TAB_02,
  },
  props: {
    propsQstnPaperData:{
      type: Object,
      default: () => {},
    }
  },
  data() {
    return {
      //공통코드
      common_code:[],
      answ_list:[],

      PAPER_ID: "",
      QSTN_NO: "",
      //CUSTCO_ID: "",
      CENTER_ID: "",
      QSTN_LEVEL:"",

      // 문항 정보
      evalQstnPaper:[],

      // 문항 상세
      evalQstnBankInfo:[],
      evalQstnBankInfo_: {},
      evalQstnBankInfoExmp:[],

      selectedIndex: null,
      selectedItem: [],

      isInitCompleted: false,
      crosseditor_initial_value: "",

      addItem: [],
      sendAddItem: [],
      qstnPaperData:{},

      // tab
      tabs2: null,
      tabsList2: [
        { title: '보기/답란', content: 'QTM_M0100_DIALOG_MANAGE_TAB_01', badge: false},
        { title: '해설', content: 'QTM_M0100_DIALOG_MANAGE_TAB_02', badge: false},
      ],

      // 문항 정보
      modelQtype: 'S',
      itemsQtype: ['S','D'],

      modelAtype: '',
      itemsAtype: ['ISMHEVANSS001','ISMHEVANSS002'],
      //SHOT_DV  주관식 답안형식
      modelAtype2: 'ISMHEVANSD001',
      //itemsAtype2: ['ISMHEVANSD001','ISMHEVANSD002'],   //단답형, 서술형
      itemsAtype2: ['ISMHEVANSD001'],   //단답형, 서술형

      modelDiffculty: 'M',
      itemsDiffculty: ['H','M','L'],

      modelQSTN_NO:'',
      modelEXAM_CATE_CD:'',
      SendProp: {},
      modelPoint: 10,

      // dialog: 평가지 미리보기
      dialogPreviewSheet: false,
      addQtBtnView: false,

      //알림창 메시지
      MESSAGE : {
        CONFIRM :{
          DELETE : { alertDialogToggle : true, msg : '선택한 문항을 삭제 하시겠습니까?', iconClass:'is-info', type :'confirm', callYes: this.delQtData, callNo:this.closeMsg},
          SAVE : { alertDialogToggle : true, msg : '문항을 저장 하시겠습니까?', iconClass:'is-info', type :'confirm', callYes: this.qtEmpSave, callNo:this.closeMsg},
          CONFIRM_SAVE : { alertDialogToggle : true, msg : '평가지 확정 하시겠습니까?', iconClass:'is-info', type :'confirm', callYes: this.qtEmpConfirmSave_, callNo:this.closeMsg},
          //CONFIRM_SAVE : { alertDialogToggle : true, msg : '평가지 확정 하시겠습니까?', iconClass:'is-info', type :'confirm', callYes: this.qtEmpConfirmSave_('ISMHEVST003'), callNo:this.closeMsg},
          CONFIRM_SAVE1 : { alertDialogToggle : true, msg : '평가지 확정 취소 하시겠습니까?', iconClass:'is-info', type :'confirm', callYes: this.qtEmpConfirmCan_, callNo:this.closeMsg},

        },
        ALERT : {
          SPOINT : {alertDialogToggle: true, msg: '첫 번째 문항입니다.', iconClass: 'is-info', type: 'default'}
          , EPOINT : {alertDialogToggle: true, msg: '마지막 번째 문항입니다.', iconClass: 'is-info', type: 'default'}
          , NODATA : {alertDialogToggle: true, msg: '선택 문항이 없습니다.', iconClass: 'is-info', type: 'default'}
          , OVER_DATA : {alertDialogToggle: true, msg: '더이상 문항을 추가 할 수 없습니다.', iconClass: 'is-info', type: 'default'}
          , F_DATA : {alertDialogToggle: true, msg: '첫번째 문항은 삭제 할 수 없습니다.', iconClass: 'is-info', type: 'default'}
          , QT_EMP_CNT:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '최대 보기 개수는 5개 입니다.' }
          , SAVE_FAIL01:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '문항 정보는 필수 등록 항목입니다.' }
          , SAVE_FAIL02:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '보기 정보는 필수 등록 항목입니다.' }
          , SAVE_FAIL03:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '정답 정보는 필수 등록 항목입니다.' }
          , SAVE_FAIL04:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '단일 선택시 보기 정답은 1개만 가능합니다.' }
          , SAVE_FAIL05:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '배점 정보는 필수 등록 항목입니다.' }
          , SAVE_FAIL06:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '평가지 확정된것은 문항 수정이 불가능합니다.' }

          , CON_FAIL01:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '평가지 문항개수와 실제 저장 문항 개수를 확인해주세요' }
          , CON_FAIL02:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '문항 별 상세 정보를 입력후 문항 저장 후 확정 진행 해주세요.' }
          , CON_FAIL03:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '문항 별 점수의 총점과 평가지의 총점 을 확인후 진행해주세요.' }
          , CON_FAIL04:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '해당 평가지를 사용하는 평가 일정을 먼저 삭제하여 주십시오.' }


        },
        TOAST : {
          REG_SUCCESS: {  msg: '평가지 정보가 등록되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 },
          DEL_SUCCESS: {  msg: '평가지 정보가 삭제되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 },
          CONFIRM_SUCCESS: {  msg: '평가지 확정이 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 },
          CONFIRM_SUCCESS1: {  msg: '평가지 확정 취소 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 },
          MOVE_SUCCESS: {  msg: '문항이 이동 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 },
        },
        ERROR: {
          ERROR:
            { alertDialogToggle: true, iconClass: 'is-caution', type: 'default', msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', },
        }
      }
    }
  },

  methods: {
    initEditorCompleted() {
      //alert("initEditorCompleted");
      this.isInitCompleted = true;
      //this.$refs.crossEditor.update( this.restoreXSS(this.crosseditor_initial_value) );
      this.$refs.crossEditor.update( this.restoreXSS_CrossEditor(this.crosseditor_initial_value) );
    },
    // 조회 영역
    async selectEvalQstnPaper(){
      this.evalQstnPaper= [];
      this.selectedItem= [];
      let sUrl = '/phone-api/qt/selectEvalQstn';
      let postParam = {
        CENTER_ID : this.qstnPaperData.CENTER_ID,
        PAPER_ID: this.qstnPaperData.PAPER_ID,
        QSTN_NO: this.qstnPaperData.QSTN_NO
      };

      let headParam = {};
      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        this.evalQstnPaper = response.DATA;
        this.selectedIndex = 0;
        if(response.DATA.length > 0){
          this.selecteInfo(this.evalQstnPaper[0].QSTN_NO, this.selectedIndex);
        }else{
          this.initQstnInfo();
        }        
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }

    },

    // 문항 정보 초기 등록
    async setEvalQstn(){
      let sUrl = '/phone-api/qt/evalQstnProc';
      let postParam = {
        CENTER_ID : this.qstnPaperData.CENTER_ID,
        PAPER_ID: this.qstnPaperData.PAPER_ID,
        REG_EMP_NO:this.$store.getters["userStore/GE_USER_ROLE"].userId,
        QSTN_SCORE: 10,
        QSTN_SORT: this.evalQstnPaper.length + 1,
        REG_DATA: this.sendAddItem
      };

      let headParam = {};
      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        this.showAlert(this.MESSAGE.TOAST.REG_SUCCESS);
        this.selectEvalQstnPaper();
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },


    // 아래는 각종 컨트롤
    // 버튼 클릭시 문항 추가
    addQtData(){
      // 마스터 문항 설정 갯수와 비교
      if(this.qstnPaperData.PAPER_QSTN_CNT > this.evalQstnPaper.length ){
        this.sendAddItem = [];
        let addItemSet = { QSTN_SORT: this.evalQstnPaper.length + 1, QSTN_NO: "",
                      ANSW_TYPE:"ISMHEVANSS001",  QSTN_SCORE: 10, EXMP_SORT_NO: '',
                      QSTN_CNTNT:'', QSTN_ANSW: '', REPLACE_STR:'', CASE_YN:'',
                      USE_YN: "Y", EXMP_CNT: 1, QSTN_LEVEL:'M', EXAM_CATE_CD:"VC01", SPACE_YN:"N", DEL_CHK_STR:"",
                      QSTN_EXPLAIN:"", QSTN_TYPE: "S", QSTN_TYPE_NM: '단일선택' } ;

        this.evalQstnPaper.push( addItemSet );
        this.sendAddItem.push( addItemSet );
        //저장
        this.setEvalQstn();
      }else{
        this.showAlert(this.MESSAGE.ALERT.OVER_DATA);
        return;
      }
    },

    addQtSubData(){
      this.selectedItem = [];
      this.selectedIndex = this.evalQstnPaper.length - 1;
      // 보기 항목을 위해서
      this.selectedItem.push( { EXMP_SEQ_NO: '', QSTN_NO: '', EXMP_SORT_NO: '', EXMP_WORD: 'test', ANSW_TYPE: '',
                                CASE_YN: '', SPACE_YN: '', QSTN_TYPEA: '', NSW_TYPE: '', QSTN_CNTNT: '', QSTN_ANSW: '',
                                USE_YN: '', EXMP_CNT: '', QSTN_LEVEL: '', EXAM_CATE_CD: '',});

      this.$refs.crossEditor.update('');
    },

    // 평가지에 문항 1st 초기 세팅
    initQstnInfo(){
      this.addQtData();
    },

    // 선택 문항 삭제
    delQtDataFn(){
      if(this.evalQstnPaper.length < 2 ){
        this.showAlert(this.MESSAGE.ALERT.F_DATA);
        return;
      }
      this.showAlert(this.MESSAGE.CONFIRM.DELETE);
    },

    // 선택 문항 삭제
    async delQtData(){

      let DEL_QSTN_NO_ = this.evalQstnPaper[this.selectedIndex].QSTN_NO;

      if(this.selectedIndex != null){
        this.evalQstnPaper.splice(this.selectedIndex,1);
      }else{
        this.showAlert(this.MESSAGE.ALERT.NODATA);
      }
      this.selectedIndex = this.selectedIndex-1;

      let sUrl = '/phone-api/qt/evalQstnBankDelProc';
      let postParam = {        
        CENTER_ID: this.qstnPaperData.CENTER_ID,
        PAPER_ID: this.qstnPaperData.PAPER_ID,
        QSTN_NO: DEL_QSTN_NO_,
        evalQstnPaper : this.evalQstnPaper
      };

      let headParam = { head : {
        DATA_OBJECT: "evalQstnPaper"
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {        
        this.selectedItem = [];
        this.selectEvalQstnPaper();

        this.showAlert(this.MESSAGE.TOAST.DEL_SUCCESS);
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
      this.closeAlert();
    },

    // 문항 위아래 변경시 처리
    async upDwonQtData(){
      let sUrl = '/phone-api/qt/evalQstnBankMoveProc';
      let postParam = {
        CENTER_ID: this.qstnPaperData.CENTER_ID,
        PAPER_ID: this.qstnPaperData.PAPER_ID,
        evalQstnPaper : this.evalQstnPaper
      };

      let headParam = { head : {
        DATA_OBJECT: "evalQstnPaper"
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.showToast(this.MESSAGE.TOAST.MOVE_SUCCESS);
        this.selectedItem = [];
        this.selectEvalQstnPaper();
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
      this.closeAlert();
    },

    //문항 위로 올림
    handleUp() {
      if (this.selectedIndex === 0) {
        this.showAlert(this.MESSAGE.ALERT.SPOINT);
        return;
      }
      const temp = this.evalQstnPaper[this.selectedIndex];
      this.evalQstnPaper[this.selectedIndex] = this.evalQstnPaper[this.selectedIndex - 1];
      this.evalQstnPaper[this.selectedIndex - 1] = temp;
      this.selectedIndex = this.selectedIndex - 1;
      this.upDwonQtData();
    },

    // 문항 아래로 내림
    handleDown() {
      if (this.selectedIndex === this.evalQstnPaper.length - 1) {
          this.showAlert(this.MESSAGE.ALERT.EPOINT);
          return;
      }
      const temp = this.evalQstnPaper[this.selectedIndex];
      this.evalQstnPaper[this.selectedIndex] = this.evalQstnPaper[this.selectedIndex + 1];
      this.evalQstnPaper[this.selectedIndex + 1] = temp;
      this.selectedIndex = this.selectedIndex + 1;
      this.upDwonQtData();
    },

    // 보기 추가
    addExmp() {
      if(this.selectedItem.length > 4 ){  // 보기 최대개수 체크
        this.showAlert(this.MESSAGE.ALERT.QT_EMP_CNT);
        return;
      }else{
        this.selectedItem.push( { EXMP_WORD: '', QSTN_ANSW_YN:'', EXMP_SORT_NO: this.selectedItem.length + 1 });
      }
    },

    showPreviewSheet(){
      // 평가지 확정시에 보여주기
      this.dialogPreviewSheet = true
      // this.mixin_fullscreen()
    },

    // 문항 선택(클릭)시    
    async selecteInfo(qstn_no,index){

      this.selectedIndex = index;
      this.selectedItem = [];
      this.evalQstnBankInfo = [];
      this.evalQstnBankInfoExmp = [];
      this.answ_list = [];

      let sUrl = '/phone-api/qt/selectEvalQstnExmp';
      let postParam = {
        //CUSTCO_ID: this.CUSTCO_ID,
        CENTER_ID: this.qstnPaperData.CENTER_ID,
        PAPER_ID: this.qstnPaperData.PAPER_ID,
        QSTN_NO: qstn_no,
        QSTN_TYPE: this.evalQstnPaper[index].QSTN_TYPE,
      };

      let headParam = {};
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {

        if(response.DATA.length > 0){
          this.evalQstnBankInfo = response.DATA;     
          this.selectedItem = this.evalQstnBankInfo;   // 보기 갯수만큼 정보 가져오기 위함 데이타 셋          

          this.evalQstnBankInfo_ = this.evalQstnBankInfo[0];

          if( this.isInitCompleted ) {
            this.$refs.crossEditor.update( this.restoreXSS_CrossEditor(this.evalQstnBankInfo[0].QSTN_CNTNT) );
          }else {
            this.crosseditor_initial_value = this.evalQstnBankInfo[0].QSTN_CNTNT;
          }
          
          this.modelQtype = this.selectedItem[0].QSTN_TYPE;         
          this.modelAtype = this.selectedItem[0].ANSW_TYPE;         
          this.modelDiffculty = this.selectedItem[0].QSTN_LEVEL;
          this.modelQSTN_NO = this.evalQstnBankInfo.QSTN_SCORE;
          this.modelEXAM_CATE_CD = this.evalQstnBankInfo.EXAM_CATE_CD;          

          if(this.modelQtype === 'D'){
            this.modelAtype2 = this.selectedItem[0].ANSW_TYPE;
            this.addQtBtnView = false;

            this.modelAtype2= 'ISMHEVANSD001';

            this.SendProp = {
                q_type: this.modelQtype,
                a_type2: this.modelAtype2
            }
            
          }
          if(this.modelQtype === 'S'){
            this.SendProp = {
              q_type: this.modelQtype,
              a_type2: this.modelAtype
            }            
            this.addQtBtnView = true
            const { QSTN_ANSW } = this.selectedItem[0];
            this.answ_list = QSTN_ANSW.includes(",") ? QSTN_ANSW.split(",").map((answer) => Number(answer)) : [Number(QSTN_ANSW)];
          }         

        }else{
          this.selectedIndex = index;
          this.modelDiffculty = 'M';
          this.modelQtype= 'S';
          this.modelAtype= 'ISMHEVANSS001';

          let addItemSet = { QSTN_SORT: this.evalQstnPaper.QSTN_SORT, QSTN_NO: this.evalQstnPaper.QSTN_NO,
                    ANSW_TYPE:"ISMHEVANSS001",  QSTN_SCORE: 10, EXMP_SORT_NO: '1', EXMP_WORD: '',
                    QSTN_CNTNT:'', QSTN_ANSW: '', REPLACE_STR:'', CASE_YN:'',
                    USE_YN: 'Y', EXMP_CNT: 0, EXAM_CATE_CD: "VC01", SPACE_YN: 'N', DEL_CHK_STR: '', QSTN_LEVEL: 'M', QSTN_LEVEL_NM: '중',
                    QSTN_EXPLAIN: '', QSTN_TYPE: 'S', QSTN_TYPE_NM: '객관식', QSTN_ANSW_YN:'' } ;

          this.evalQstnBankInfo.push( addItemSet );   // 기본 정보
          this.selectedItem.push( addItemSet );    // 겍관식 정보
          this.addQtBtnView = true;                            
          // crossEditor.update 시 null 업데이트가 안되서 일단 
          this.crosseditor_initial_value = ' ';

          if( this.isInitCompleted ) {
            this.$refs.crossEditor.update(this.restoreXSS_CrossEditor(this.crosseditor_initial_value));            
          }
          // 다시 원복
          this.crosseditor_initial_value = '';         

        }
      //this.sendQinfo(this.modelQtype);   // 확인대상
      if(this.modelQtype === 'S'){
        this.addQtBtnView = true
      }      

      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    tabChange(tab){
      this.$emit('Tabchange',tab)
    },

    // 주관식 객관식 선택시 변경
    sendQinfo(newValue){           

      if(newValue === 'D'){   //주관식
        this.SendProp = {
          q_type: newValue,
          a_type2: this.modelAtype2
        }
        this.modelQtype = newValue;
        this.addQtBtnView = false;

        this.modelAtype2= 'ISMHEVANSD001';

      }else if(newValue === 'S'){  // 객관식
        this.SendProp = {
          q_type: newValue,
          a_type2: this.modelAtype
        }        

        this.modelAtype= 'ISMHEVANSS001';    // <==  문제가??
        this.modelQtype = newValue;
        this.addQtBtnView = true;    // 객관식 보기 추가 버튼
      }else {
        this.SendProp = {
          q_type: this.modelQtype,
          a_type2: newValue
        }
        this.modelAtype = newValue;
        this.modelAtype2 = newValue;
      }
      
    },

    sel_QSTN_LEVEL(newValue){
      //this.modelQSTN_LEVEL = newValue;
      this.evalQstnBankInfo[0].QSTN_LEVEL = newValue;
    },
    sel_EXAM_CATE_CD(newValue){
      //this.modelEXAM_CATE_CD = newValue;
      this.evalQstnBankInfo[0].EXAM_CATE_CD = newValue;
    },
    sel_QSTN_SCORE(newValue){
      //this.modelQSTN_SCORE = newValue;
      this.evalQstnBankInfo[0].QSTN_SCORE = newValue;
    },

    closeMsg(){
      this.$store.commit("alertStore/hideAlert");
    },

    // 평가지 확정
    confirmSaveFn(){

      if(this.qstnPaperData.PAPER_QSTN_CNT > this.evalQstnPaper.length ){
        // 평가지에 표기된 문항수보다 실제 등록건수 체크
        this.showAlert(this.MESSAGE.ALERT.CON_FAIL01);
        return;
      }

      let c_tot_score = 0;
      for(let i in this.evalQstnPaper){
        c_tot_score = c_tot_score + parseInt(this.evalQstnPaper[i].QSTN_SCORE);
      }

      if( (this.qstnPaperData.TOT_SCORE < c_tot_score )  ||  (this.qstnPaperData.TOT_SCORE > c_tot_score )  ){
        this.showAlert(this.MESSAGE.ALERT.CON_FAIL03);
          return;
      }

      for(let i in this.evalQstnPaper){
        if(this.mixin_isEmpty(this.evalQstnPaper[i].QSTN_CNTNT)){    // 문제 정보
          this.showAlert(this.MESSAGE.ALERT.CON_FAIL02);
          return;
        }

        if(this.mixin_isEmpty(this.evalQstnPaper[i].QSTN_ANSW)){    // 정답정보
          this.showAlert(this.MESSAGE.ALERT.CON_FAIL02);
          return;
        }        
      }
      this.showAlert(this.MESSAGE.CONFIRM.CONFIRM_SAVE);
    },

    // 확정 취소
    confirmCanFn(){
      if(this.qstnPaperData.PLAN_USE_CNT > 0 ){
        // 평가 계획에 등록된 평가지는 확정 취소 할수 없다.
        this.showAlert(this.MESSAGE.ALERT.CON_FAIL04);
        return;
      }
      this.showAlert(this.MESSAGE.CONFIRM.CONFIRM_SAVE1);      
    },

    qtEmpConfirmSave_(){
      const type= 'ISMHEVST003';
      this.qtEmpConfirmSave(type);
    },

    qtEmpConfirmCan_(){
      const type= 'ISMHEVST001';
      this.qtEmpConfirmSave(type);
    },

    // 평가지 확정/취소 처리 
    async qtEmpConfirmSave(type){
      let sUrl = '/phone-api/qt/confirmEvalPaper';      
      
      let postParam = {
        PAPER_ID: this.qstnPaperData.PAPER_ID,
        //PROC_STAT: "ISMHEVST003",
        PROC_STAT: type,
        REG_EMP_NO: this.$store.getters["userStore/GE_USER_ROLE"].userId,
      };

      let headParam = { head : {
      }};
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {           

        if(type === 'ISMHEVST003'){
          this.$emit("closeFn003");
          this.showToast(this.MESSAGE.TOAST.CONFIRM_SUCCESS);
        }else{
          this.$emit("closeFn001");  
          this.showToast(this.MESSAGE.TOAST.CONFIRM_SUCCESS1);
        }        

        //this.mixin_hideDialog('ManageQuestion');   // 현재 창 닫기
        //this.$emit.selectEvalQstnPaperList();   // 바탕 새로 고침
        this.closeMsg();

      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    // 문항 저장
    saveMaFn(){

      if(this.qstnPaperData.PROC_STAT === 'ISMHEVST003' ){  // 평가지 확정 
        this.showAlert(this.MESSAGE.ALERT.SAVE_FAIL06);
        return;          
      }

      if(!this.validate()){
        return;
      }
      this.showAlert(this.MESSAGE.CONFIRM.SAVE);
    },

    //문항 저장
    async qtEmpSave(){

      let sUrl = '/phone-api/qt/evalQstnExmpProc';      

      this.answ_list.sort((a, b) => a - b);      
      //JSON.stringify(this.answ_list);     

      let postParam = {        
        CENTER_ID: this.qstnPaperData.CENTER_ID,
        PAPER_ID: this.qstnPaperData.PAPER_ID,
        QSTN_NO: this.evalQstnPaper[this.selectedIndex].QSTN_NO,
        REG_EMP_NO: this.$store.getters["userStore/GE_USER_ROLE"].userId,
        //QSTN_CNTNT: this.$refs.crossEditor.getTextValue(),  // 문항 설명
        QSTN_CNTNT: this.$refs.crossEditor.getValue(),  // 문항 설명
        QSTN_SCORE: this.evalQstnBankInfo[0].QSTN_SCORE,  // 배점
        QSTN_EXPLAIN: this.evalQstnBankInfo[0].QSTN_EXPLAIN,  // 해설
        QSTN_TYPE: this.modelQtype,  //문제형식
        ANSW_TYPE: "",  //답변형식
        QSTN_LEVEL: this.evalQstnBankInfo[0].QSTN_LEVEL, // 난이도
        EXAM_CATE_CD: this.evalQstnBankInfo[0].EXAM_CATE_CD, // 범주
        CASE_YN: this.evalQstnBankInfo[0].CASE_YN == "true" ? "Y" : "N",
        SPACE_YN: this.evalQstnBankInfo[0].SPACE_YN  == "true" ? "Y" : "N",
        REPLACE_STR: this.evalQstnBankInfo[0].REPLACE_STR,
        DEL_CHK_STR: this.evalQstnBankInfo[0].DEL_CHK_STR,

        addExmpList: this.selectedItem,    // 객관식에서 보기 개수 만큼 or 주관식 정보    
        //QSTN_ANSW: serializedArray_answ_list.join(",")
        QSTN_ANSW: this.answ_list.join(",")

      };

      if( this.modelQtype == 'S'){
        postParam.ANSW_TYPE = this.modelAtype;
      }else{
        postParam.ANSW_TYPE = this.modelAtype2;
      }

      let headParam = { head : {
        DATA_OBJECT: "addExmpList"
      }};
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.showToast(this.MESSAGE.TOAST.REG_SUCCESS);

        this.selectedItem = [];
        this.selectEvalQstnPaper();
        this.closeMsg();
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    // 문항별 필수 값 체크
    validate () {
      //getValue = GetBodyValue    , getTextValue
      if(this.mixin_isEmpty(this.$refs.crossEditor.getValue())){   // 문항 정보
        this.showAlert(this.MESSAGE.ALERT.SAVE_FAIL01);
        return false;
      }

      // 우선 객관식 주관식 여부 체크 필요
      if(this.modelQtype === 'S'){
        // 객관식 경우 보기 개수 체크
        if( this.selectedItem.length <= 0 ){   // 보기 정보 등록 여부
          this.showAlert(this.MESSAGE.ALERT.SAVE_FAIL02);
          return false;
        }

        // 객관식 보기 글 체크
        for(let i=0; i<this.selectedItem.length; i++){          

          if(this.selectedItem[i].EXMP_WORD == undefined){
            this.showAlert(this.MESSAGE.ALERT.SAVE_FAIL02);
            return false;
          }          

          if(this.selectedItem[i].EXMP_WORD.length == 0){
            this.showAlert(this.MESSAGE.ALERT.SAVE_FAIL02);
            return false;
          }
        }

        // 보기 항목에서 정답 여부 체크
        if(this.answ_list.length <= 0){
          this.showAlert(this.MESSAGE.ALERT.SAVE_FAIL03);
          return false;
        }

        // 다중 선택 가능 여부 체크    ( 단일 선택시  정답 갯수 체크 )
        if(this.answ_list.length  > 1 && this.modelAtype === 'ISMHEVANSS001'){
          this.showAlert(this.MESSAGE.ALERT.SAVE_FAIL04);
          return false;
        }

      }else{  // 주관식
        if( this.modelAtype == 'ISMHEVANSD001'){   // 단답형일 경우만
          if(this.selectedItem[0].QSTN_ANSW.length == 0){
            this.showAlert(this.MESSAGE.ALERT.SAVE_FAIL03);
            return false;
          }
          if(this.evalQstnBankInfo[0].QSTN_ANSW.length == 0){
            this.showAlert(this.MESSAGE.ALERT.SAVE_FAIL03);
            return false;
          }
        }
      }

      if(this.selectedItem[0].QSTN_SCORE.length == 0 ){
        this.showAlert(this.MESSAGE.ALERT.SAVE_FAIL05);
        return false;
      }

      if(this.evalQstnBankInfo[0].QSTN_SCORE.length == 0 ){
        this.showAlert(this.MESSAGE.ALERT.SAVE_FAIL05);
        return false;
      }

      return true;
    },

    async setQstnPaperData(obj){
      this.qstnPaperData = JSON.parse(JSON.stringify(obj));
    },

    handleChangeAnswList (newAnswList) {      
      this.answ_list = newAnswList;
    },
    setAnswList(answer, moveAnswer){
      const answerIndex = this.answ_list.indexOf(answer);
      const moveAnswerIndex = this.answ_list.indexOf(moveAnswer);

      // 모두 정답에 포함되지 않거나 모두 정답에 포함될 경우 (그대로)
      if((answerIndex < 0 && moveAnswerIndex < 0) || (answerIndex > -1 && moveAnswerIndex > -1)){
        return;
      }

      if(answerIndex > -1){
        this.$set(this.answ_list, answerIndex, moveAnswer);
      }else{
        this.$set(this.answ_list, moveAnswerIndex, answer);
      }

    },
     handleChangeIndex(down, index){
      const selectedItemCopy = [...this.selectedItem]

      const moveItemIndex = down ? index + 1 : index - 1;
      const targetItem =  this.selectedItem[index];

      selectedItemCopy[index] = selectedItemCopy[moveItemIndex];
      selectedItemCopy[moveItemIndex] = targetItem;

      // 정답 변경 함수
      this.setAnswList(index + 1, moveItemIndex + 1);

      this.selectedItem = [];

      this.$nextTick(()=>{
        this.selectedItem = selectedItemCopy;
      })

      // Vue2에서 반응형 배열의 값을 변경할 때는 this.$set을 사용
      // this.$set(this.selectedItem, index, this.selectedItem[moveItemIndex]);
      // this.$set(this.selectedItem, moveItemIndex, targetItem);

      // 일반적인 변경 코드
      // this.selectedItem[index] = this.selectedItem[moveItemIndex];
      // this.selectedItem[moveItemIndex] = targetItem;
    },

    // 평가지 복사
    clickCopyBtn(){
      this.showConfirmInfo({msg : '해당 평가지를 복사하시겠습니까?'
        , callYes: ()=>{
          this.closeAlert();
          this.copyQtPaperData();
        },
        callNo: this.closeAlert
      })
    },

    async copyQtPaperData(){
      let sUrl = '/phone-api/qt/copyQtPaper';      

      let postParam = {        
        CENTER_ID: this.qstnPaperData.CENTER_ID,
        COPY_PAPER_ID: this.qstnPaperData.PAPER_ID,
        REG_EMP_NO: this.$store.getters["userStore/GE_USER_ROLE"].userId
      };

      let headParam = {};
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.showToastSuccess({msg : '평가지가 복사되었습니다.'});
        this.$emit("refresh");
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },
  },

  mounted() {
    //this.CUSTCO_ID = this.$store.getters["userStore/GE_USER_ROLE"].company.CD;
    /*   최초 로딩시 첫번째 문항의 문제 내용을 textarea 에 넣어주기 위해....
    this.$nextTick(() => {
        // DOM 업데이트가 완료된 후 실행됨
        if (this.$refs.crossEditor && this.$refs.crossEditor.update) {
            this.selectEvalQstnPaper();
        }
    });
    */

    this.qstnPaperData = JSON.parse(JSON.stringify(this.propsQstnPaperData));

    this.selectEvalQstnPaper();
  },
  async created() {
    //공통코드설정
    let codeName = ['QUST_DV', 'MULT_DV', 'SHOT_DV', 'T404', 'QUEST_LV'];  // 문젠형식, 객관식 답안형식, 주관식 답안 형식,  범주, 난이도
    this.common_code = await this.mixin_common_code_get_all(codeName);

    //this.qstnPaperData = Object.assign({}, this.propsQstnPaperData);
    //this.qstnPaperData = JSON.parse(JSON.stringify(this.propsQstnPaperData));
    //this.setQstnPaperData(this.propsQstnPaperData);
  },
  computed: {
  },
  watch: {

  },
};
</script>

<style lang="scss" scoped>
.parent {
display: grid;
grid-template-columns: 250px 900px 1fr;
grid-template-rows: 55px repeat(2, 1fr);
grid-column-gap: 0px;
grid-row-gap: 0px;
}

.div1 { grid-area: 1 / 1 / 2 / 2; }
.div2 { grid-area: 1 / 2 / 2 / 4; }
.div3 { grid-area: 2 / 1 / 4 / 2; }
.div4 { grid-area: 2 / 2 / 4 / 3; }
.div5 { grid-area: 3 / 2 / 4 / 3; }
.div6 { grid-area: 2 / 3 / 4 / 4; }
.selected-q{
  border-color: var(--primary-color);
}
</style>'