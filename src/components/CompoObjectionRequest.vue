<template>
  <div style="display: contents">
    <div class="pl-quick-layer-body" style="height: calc(100vh - 263px)">
      <!-- stat -->
      <div class="spacing-wrap sp-32 align-start">
        <div class="d-flex align-start flex-column">
          <div class="d-flex align-center">
            <v-icon class="pl-icon20 date-fill"></v-icon>
            <span class="pl-label">이의제기 기간</span>
            <span class="ml-2">{{ objtData.OBJT_END_DT ? objtData.OBJT_END_DT + " 까지" : "" }}</span>
          </div>
          <div
            v-if="objtData.STTS_CD == 'ARGUTP04' || objtData.RE_OBJT_YN == 'Y'"
            class="d-flex align-center ml-5">
            <span class="pl-label">재결요청 기간</span>
            <span class="ml-2">{{ objtData.RE_OBJT_END_DT ? objtData.RE_OBJT_END_DT + " 까지": ""}}</span>
          </div>
        </div>
        <div class="d-flex align-start flex-column">
          <div class="d-flex align-center" v-if="objtData.OBJT_ID">
            <v-icon class="pl-icon20 date-simple-fill"></v-icon>
            <span class="pl-label">팀장 확인</span>
            <span class="ml-2">{{ mixin_nvl(objtData.MNGR_IDNTY_DT, "미확인")}}</span>
          </div>
          <div class="d-flex align-center ml-5"  v-if="objtData.RE_OBJT_YN == 'Y'">
            <span class="pl-label">팀장 확인</span>
            <span class="ml-2">{{ mixin_nvl(objtData.RE_MNGR_IDNTY_DT, "미확인") }}</span>
          </div>
        </div>
        <!-- 뱃지 -->
        <span
          v-if="objtData.OBJT_ID"
          :class="`ml-auto pl-badge is-${mixin_displayStatus(objtData.STTS_CD_NM, 'STAT_LIST')}`">{{objtData.STTS_CD_NM}}</span>
      </div>

      <!-- content -->
      <div class="is-border-top pt-3 is-mt-m">
        <div class="d-flex align-center">
          <span class="pl-subtit">이의신청 내용</span>
          <v-btn
            @click="clickAddObjtArtcl"
            class="pl-btn is-icon is-trans ml-auto"
            :disabled="!mixin_isEmpty(objtData.OBJT_ID) || isExpiredObjtDt('OBJT_END_DT')"
            v-if="USER_TYPE === 'MANAGER'"
            >
            <span class="pl-icon20 circle-plus"></span>
            이의제기 항목 등록
          </v-btn>
        </div>
        <!-- 신청한 이의제기 항목이 없을 경우 && 상담사 -->
        <template v-if="objtData.MODE == 'NONE' && USER_TYPE == 'MANAGER'">
          <div class="is-border-default pl-esp-box px-3 py-8 text-center is-mt-s">
            <p>
              이의제기 하실 경우 우측의 <strong>[이의제기 항목 등록] 버튼을 클릭 후 이의제기 항목을 선택</strong>하십시오.<br>이의제기는 한번에 복수의 항목을 등록할 수 있습니다.
            </p>
          </div>
        </template>
        <!-- 신청한 이의제기 기간이 경과된 경우 && 상담사 -->
        <template v-else-if="objtData.MODE == 'EXPIRED' && USER_TYPE == 'MANAGER'">
          <div class="is-border-default pl-esp-box px-3 py-8 text-center is-mt-s">
            <p><strong>이의제기 기간이 경과</strong>되어 이의제기 할 수 없습니다.</p>
          </div>
        </template>
        <!-- 이의제기 내용 있을때 -->
        <template v-else-if="objtData.MODE == 'OBJECTION' && isObject">
          <div class="spacing-wrap sp-8 flex-column is-mt-s">
            <table
              class="pl-tbl-detail"
              v-for="(item, index) in objtArtclList">
              <colgroup>
                <col width="127px" />
                <col width="100px" />
                <col width="160px" />
                <col width="100px" />
                <col width="" />
              </colgroup>
              <tbody>
                <!-- 이의제기 항목 -->
                <tr>
                  <th scope="row">
                    <span class="pl-label">
                      이의제기 항목
                    </span>
                  </th>
                  <td colspan="4">
                    <div class="spacing-wrap sp-4 align-center">
                      <span class="is-ellips">
                        {{ item.OBJT_ARTCL_CN }}
                      </span>
                      <v-btn class="pl-btn is-esp is-sm ml-1" @click="clickShowDetailBtn" v-if="objtData.EVL_SE_CD != 'ARGUDV03'">자세히 보기</v-btn>
                      <template v-if="objtData.RE_OBJT_YN == 'N' && objtData.STTS_CD == 'ARGUTP04' && item.RFLT_YN == 'N' && USER_TYPE == 'MANAGER' && !isExpiredObjtDt('RE_OBJT_END_DT')">
                        <div>
                          <v-checkbox
                            v-model="item.RE_OBJT_YN"
                            class="pl-check ml-auto"
                            style="width: 80px"
                            label="재결 요청"
                          ></v-checkbox>
                        </div>
                      </template>
                      <template v-if="mixin_isEmpty(objtData.OBJT_ID) && USER_TYPE == 'MANAGER'">
                        <!-- 툴팁 버튼 -->
                        <compo-tooltip-btn
                          TitleProp="삭제"
                          ClassProp="pl-tooltip-btn ml-auto"
                          IconProp="pl-icon20 trash"
                          TooltipPositionProp="bottom"
                          @btnClick="clickDeleteBtn(item, index)"
                        ></compo-tooltip-btn>
                      </template>
                    </div>
                  </td>
                </tr>
                <!-- 이의신청 내용 -->
                <tr>
                  <th scope="row">
                    <span class="pl-label">
                      이의신청 내용
                    </span>
                  </th>
                  <td colspan="4" class="has-textarea">
                    <v-textarea
                      class="pl-form is-noresize"
                      v-model="item.OBJC_APLY_CN"
                      :spellcheck="false"
                      placeholder="이의신청 내용을 입력해주세요."
                      v-byte-counter="4000"
                      :readonly="isReadonly.OBJC_APLY_CN"
                    />
                  </td>
                </tr>
                <!-- 이의신청 결과 -->
                <template v-if="objtData.RE_OBJT_YN == 'Y'|| objtData.STTS_CD == 'ARGUTP04' || (objtData.STTS_CD == 'ARGUTP03' && USER_TYPE == 'ADMIN')">
                  <tr>
                    <th scope="row" rowspan="2">
                      <span class="pl-label">
                        이의신청 결과
                      </span>
                    </th>
                    <th scope="row" >
                      <span class="pl-label">
                        결과 통보일
                      </span>
                    </th>
                    <td >{{ item.RSLT_REG_DT }}</td>
                    <th scope="row" >
                      <span class="pl-label">
                        반영 여부
                      </span>
                    </th>
                    <td v-if="!isReadonly.OBJC_APLY_RSLT_CN">
                      <div class="d-flex align-center">
                        <v-radio-group row class="pl-radio-group" v-model="item.RFLT_YN" style="width: auto">
                          <v-radio class="pl-radio" value="N" label="미반영"></v-radio>
                          <v-radio class="pl-radio" value="Y" label="반영"></v-radio>
                        </v-radio-group>
                        <v-text-field
                            v-if="item.RFLT_YN == 'Y' && objtData.EVL_SE_CD == 'ARGUDV01'"
                            class="pl-form text-center"
                            v-model="item.AFTR_SCR"
                            oninput="this.value=this.value.replace(/(?!^-)[^0-9.]/g, '')"
                            style="flex: 0 0 40px;"
                            @input="changeScore(index, 'AFTR_SCR')"
                          ></v-text-field>
                          <span class="ml-1" v-if="item.RFLT_YN == 'Y' && objtData.EVL_SE_CD == 'ARGUDV01'">/{{ item.ALLOC_SCORE }}</span>
                      </div>
                    </td>
                    <td v-else>
                      {{ item.RFLT_YN == "Y" ? '반영' : '미반영' }}
                      <span v-if="item.RFLT_YN == 'Y' && objtData.EVL_SE_CD == 'ARGUDV01'">( {{ "이전점수: "+item.BFR_SCR + " > 반영점수: "+ item.AFTR_SCR }})</span>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="4" class="has-textarea">
                      <v-textarea
                        class="pl-form is-noresize"
                        v-model="item.OBJC_APLY_RSLT_CN"
                        :spellcheck="false"
                        aria-placeholder="이의신청 결과를 입력해주세요."
                        v-byte-counter="4000"
                        :readonly="isReadonly.OBJC_APLY_RSLT_CN"
                      />
                    </td>
                  </tr>
                </template>
                
                  <!-- 재결신청 내용 -->
                  <template v-if="(objtData.STTS_CD == 'ARGUTP04' && USER_TYPE == 'MANAGER' && item.RE_OBJT_YN) || (item.RE_OBJT_YN && objtData.RE_OBJT_YN == 'Y')">
                    <tr>
                      <th scope="row">
                        <span class="pl-label">
                          재결신청 내용
                        </span>
                      </th>
                      <td colspan="4" class="has-textarea">
                        <v-textarea
                          class="pl-form is-noresize"
                          v-model="item.RE_OBJC_APLY_CN"
                          :spellcheck="false"
                          placeholder="재결신청 내용을 입력해주세요."
                          v-byte-counter="4000"
                          :readonly="isReadonly.RE_OBJC_APLY_CN"
                        />
                      </td>
                    </tr>
                  </template>
                  <!-- 재결신청 결과 -->
                  <template v-if="item.RE_OBJT_YN && objtData.RE_OBJT_YN == 'Y' && ( objtData.STTS_CD == 'ARGUTP04' || (objtData.STTS_CD == 'ARGUTP03' && USER_TYPE == 'ADMIN'))">
                    <tr>
                      <th scope="row" rowspan="2">
                        <span class="pl-label">
                          재결신청 결과
                        </span>
                      </th>
                      <th scope="row" >
                        <span class="pl-label">
                          결과 통보일
                        </span>
                      </th>
                      <td >{{ item.RE_RSLT_REG_DT }}</td>
                      <th scope="row" >
                        <span class="pl-label">
                          반영 여부
                        </span>
                      </th>
                      <td v-if="!isReadonly.RE_OBJC_APLY_RSLT_CN">
                        <div class="d-flex align-center">
                          <v-radio-group row class="pl-radio-group" v-model="item.RE_RFLT_YN" style="width: auto">
                            <v-radio class="pl-radio" value="N" label="미반영"></v-radio>
                            <v-radio class="pl-radio" value="Y" label="반영"></v-radio>
                          </v-radio-group>
                          <v-text-field
                            v-if="item.RE_RFLT_YN == 'Y' && objtData.EVL_SE_CD == 'ARGUDV01'"
                            class="pl-form text-center"
                            v-model="item.RE_AFTR_SCR"
                            oninput="this.value=this.value.replace(/(?!^-)[^0-9.]/g, '')"
                            style="flex: 0 0 40px;"
                            @input="changeScore(index, 'RE_AFTR_SCR')"
                          ></v-text-field>
                          <span class="ml-1" v-if="item.RE_RFLT_YN == 'Y' && objtData.EVL_SE_CD == 'ARGUDV01'">/{{ item.ALLOC_SCORE }}</span>
                        </div>
                      </td>
                      <td v-else>
                        {{ item.RE_RFLT_YN == "Y" ? '반영' : '미반영' }}
                        <span v-if="item.RE_RFLT_YN == 'Y' && objtData.EVL_SE_CD == 'ARGUDV01'">({{ "이전점수: "+item.RE_BFR_SCR + " > 반영점수: "+ item.RE_AFTR_SCR }})</span>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="4" class="has-textarea">
                        <v-textarea
                          class="pl-form is-noresize"
                          v-model="item.RE_OBJC_APLY_RSLT_CN"
                          :spellcheck="false"
                          placeholder="재결신청 결과를 입력해주세요."
                          v-byte-counter="4000"
                          :readonly="isReadonly.RE_OBJC_APLY_RSLT_CN"
                        />
                      </td>
                    </tr>
                  </template>
              </tbody>
            </table>
          </div>
        </template>
        <!-- 등록된 이의제기 내용이 없는 경우 -->
        <template v-else>
          <div class="is-border-default pl-esp-box px-3 py-8 text-center is-mt-s">
            <p> 이의제기 내용이 없습니다.</p>
          </div>
        </template>
      </div>
    </div>

    <!-- footer -->
    <div class="pl-quick-layer-footer">
      <div class="pl-btn-wrap ml-auto">
        <v-btn class="pl-btn is-trans" @click="close">닫기</v-btn>
        <template>
          <v-btn class="pl-btn" v-if="objtData.RE_OBJT_YN == 'N' && objtData.STTS_CD == '' && USER_TYPE == 'MANAGER'" @click="clickObjtReqBtn">이의제기 요청</v-btn>
          <v-btn class="pl-btn is-esp3" v-if="objtData.RE_OBJT_YN == 'N' && objtData.STTS_CD == 'ARGUTP01' && USER_TYPE == 'MANAGER'" @click="clickCancleBtn">이의제기 취소</v-btn>
        </template>
        <template>
          <v-btn class="pl-btn" v-if="objtData.RE_OBJT_YN == 'N' && objtData.STTS_CD == 'ARGUTP04' && USER_TYPE == 'MANAGER'" @click="clickObjtReqBtn">재결요청</v-btn>
          <v-btn class="pl-btn is-esp3" v-if="objtData.RE_OBJT_YN == 'Y' && objtData.STTS_CD == 'ARGUTP01' && USER_TYPE == 'MANAGER'" @click="clickCancleBtn">재결요청 취소</v-btn>
        </template>
        <template>
          <v-btn class="pl-btn" v-if="objtData.STTS_CD == 'ARGUTP01' && USER_TYPE == 'LEADER'" @click="clickLeaderApplyBtn"> 팀장 확인</v-btn>
        </template>
        <template>
          <v-btn class="pl-btn" v-if="objtData.STTS_CD == 'ARGUTP03' && USER_TYPE == 'ADMIN'" @click="clickCloseBtn"> 종결 처리</v-btn>
        </template>
      </div>
    </div>
    <!-- dialog: 이의제기 신청 -->
    <v-dialog
      v-model="dialogRegObjection"
      v-if="dialogRegObjection"
      width="800"
      content-class="dialog-draggable"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="이의제기 항목 "
        @hide="mixin_hideDialog('RegObjection')"
        @submit="submitDialog('RegObjection')"
      >
        <template slot="body">
          <CompoObjectionRequestDialog ref="CompoObjectionRequestDialog" :propsData="propsData" :isPreview="isPreview" @Add="addObjtArtcl" :objtArtclList="objtArtclList"/>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="mixin_hideDialog('RegObjection')">닫기</v-btn>
          <v-btn class="pl-btn" @click="clickAddBtn" v-if="!isPreview">추가</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
import CompoObjectionRequestDialog from '@/components/CompoObjectionRequestDialog'

export default {
  name: 'CompoObjectionRequest', //이의제기
  components: {
    CompoObjectionRequestDialog
  },
  props:{
    // QAM: { EVL_SE_CD: "ARGUDV01", CENTER_ID: "", STD_ID:"", CUSL_ID: ""}
    // QTM: { EVL_SE_CD: "ARGUDV02", EVAL_DSTN_NO: "", CUSL_ID: "", CENTER_ID: ""}
    propsData:{ 
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      dialogRegObjection: false,
      
      // 상태 컬러
      STAT_LIST: [
        { code: '종결', value: 'green'},
        { code: '요청', value: 'cyan'},
        { code: '취소', value: 'red'},
        { code: '신청', value: 'org'},
      ],

      // 사용자 타입
      USER_TYPE: "ETC",

      // 이의제기 정보
      objtData: {
        OBJT_ID : ""
        , EVL_SE_CD : ""
        , CENTER_ID : ""
        , STD_ID : ""
        , EVAL_DSTN_NO : ""
        , CUTT_COACHING_ID : ""
        , STTS_CD : ""
        , RGTR_ID : ""
        , OBJT_DT : ""
        , OBJT_ARTCL_CN: ""
        , RE_OBJT_ID : ""
        , RE_OBJT_DT : ""
        , RE_OBJT_YN : ""
        , OBJT_END_DT : ""
        , RE_OBJT_END_DT : ""
        , MODE:""
      },

      // 이의제기 항목 정보
      objtArtclList:[],

      // 이의신청 항목 표시 여부
      isObject: true,

      // 미리보기 여부
      isPreview: true,

      isReadonly:{
        OBJC_APLY_CN: true,
        OBJC_APLY_RSLT_CN: true,
        RE_OBJC_APLY_CN: true,
        RE_OBJC_APLY_RSLT_CN: true,
      },
    }
  },
  methods: {
    // 이의제기 기본정보 조회
    async selectObjectionData(){
      // let sUrl = '/phone-api/objt/selectQaTgtData';
      let sUrl = '/api/biz/common/select/selectObjectionData';

      let postParam = {
        EVL_SE_CD: this.propsData.EVL_SE_CD
        , OBJT_ID: this.propsData.OBJT_ID
        , CENTER_ID: this.propsData.CENTER_ID
        , STD_ID: this.propsData.STD_ID
        , EVAL_DSTN_NO: this.propsData.EVAL_DSTN_NO
        , CUTT_COACHING_ID: this.propsData.CUTT_COACHING_ID
      };

      let headParam = { head : {
        ns : 'lhcs.phone.objt.dao.xml.PhoneObjectionManageMapper'
        , sn : 'selectObjectionData'
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        if(response.DATA.length > 0) this.objtData = response.DATA[0];
        
        if(this.mixin_isEmpty(this.objtData.OBJT_ID)){
          this.objtData.EVL_SE_CD = this.mixin_nvl(this.propsData.EVL_SE_CD, "");
          this.objtData.CENTER_ID = this.mixin_nvl(this.propsData.CENTER_ID, "");
          this.objtData.STD_ID = this.mixin_nvl(this.propsData.STD_ID, "");
          this.objtData.EVAL_DSTN_NO = this.mixin_nvl(this.propsData.EVAL_DSTN_NO, "");
          this.objtData.CUTT_COACHING_ID = this.mixin_nvl(this.propsData.CUTT_COACHING_ID, "");
        }
      }else{
        this.showErrorMsg();
      }
    },
    
    // 이의제기 항목 정보 조회
    async selectObjtArtclList(){
      if(this.mixin_isEmpty(this.objtData.OBJT_ID)) return;

      // let sUrl = '/phone-api/objt/selectObjtArtclList';
      let sUrl = '/api/biz/common/select/selectObjtArtclList';

      let postParam = {
        OBJT_ID: this.objtData.OBJT_ID
        , RE_OBJT_YN: this.objtData.RE_OBJT_YN
      };

      let headParam = { head : {
        ns : 'lhcs.phone.objt.dao.xml.PhoneObjectionManageMapper'
        , sn : 'selectObjtArtclList'
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.objtArtclList = response.DATA.map(row=>{
          row.RE_OBJT_YN = row.RE_OBJT_YN == "Y" ? true : false;
          // 신청 상태인 경우 현재 점수 셋팅
          if(this.objtData.STTS_CD == "ARGUTP03" && this.objtData.RE_OBJT_YN == "N"){
            row.BFR_SCR = row.SCORE;
            // 업무평가는 만점처리
            row.AFTR_SCR = this.objtData.EVL_SE_CD == "ARGUDV02" ? row.ALLOC_SCORE : row.SCORE;
          }else if(this.objtData.STTS_CD == "ARGUTP03" && this.objtData.RE_OBJT_YN == "Y"){
            row.RE_BFR_SCR = row.SCORE;
            // 업무평가는 만점처리
            row.RE_AFTR_SCR = this.objtData.EVL_SE_CD == "ARGUDV02" ? row.ALLOC_SCORE : row.SCORE;
          }
          
          // 업무평가인 경우 문항 내용이 없는 경우 문항 번호로 대체
          if(this.objtData.EVL_SE_CD == "ARGUDV02"){
            let text = this.getTextFromHtml(this.restoreXSS(row.QT_OBJT_ARTCL_CN));
            row.OBJT_ARTCL_CN = this.mixin_isEmpty(text) || text == "\n" ? row.OBJT_ARTCL_CN + "번": text;
          }
          
          return row;
        });
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

    // 이의제기 항목 추가 버튼 클릭
    clickAddObjtArtcl(){
      this.isPreview = false;

      // 항목 추가 팝업 오픈
      this.mixin_showDialog('RegObjection');
    },

    // 추가 버튼
    clickAddBtn(){
      if(this.$refs.CompoObjectionRequestDialog) this.$refs.CompoObjectionRequestDialog.clickAddBtn();
    },

    // 이의제기 항목 추가
    addObjtArtcl(data){
      let colName = "QA_LMSCD"
      if(this.propsData.EVL_SE_CD != "ARGUDV01") colName = "ANSW_SEQ_NO";

      let existList = this.objtArtclList.map(e => {return e[colName]}).join(",");
      let addList = data.filter(e => {return existList.indexOf(e[colName]) === -1});

      for(let i=0; i<addList.length; i++){
        let obj = {
            OBJT_ID: ""                                                   // 이의제기ID
            , OBJT_ARTCL_ID: ""                                           // 이의제기 항목 ID
            , RE_OBJT_YN: false                                           // 재결 여부
            , OBJT_ARTCL_CN: this.mixin_nvl(addList[i].OBJT_ARTCL_CN, "") // 항목 내용
            , OBJC_APLY_CN: ""                                            // 이의 신청 내용
            , OBJC_APLY_RSLT_CN: ""                                       // 이의 신청 결과 내용
            , RSLT_REG_DT: ""                                             // 결과 등록 일시
            , RFLT_YN: "N"                                                // 반영 여부
            , RE_OBJT_ARTCL_ID:""                                         // 재결 항목 ID
            , RE_OBJC_APLY_CN: ""                                         // 재결 신청 내용
            , RE_OBJC_APLY_RSLT_CN: ""                                    // 재결 신청 결과 내용
            , RE_RSLT_REG_DT:""                                           // 재결 결과 등록 일시
            , RE_RFLT_YN: "N"                                             // 재결 반영 여부
            , EVL_SE_CD: this.propsData.EVL_SE_CD                         // 평가 구분
            , QA_LCD: this.mixin_nvl(addList[i].QA_LCD, "")
            , QA_MCD: this.mixin_nvl(addList[i].QA_MCD, "")
            , QA_SCD: this.mixin_nvl(addList[i].QA_SCD, "")
            , QA_LMSCD: this.mixin_nvl(addList[i].QA_LMSCD, "")
            , ANSW_SEQ_NO: this.mixin_nvl(addList[i].ANSW_SEQ_NO, "")
            , CUTT_COACHING_ID: ""                                        
            , ALLOC_SCORE: this.mixin_nvl(addList[i].ALLOC_SCORE, "")
            , SCORE: this.mixin_nvl(addList[i].SCORE, "")
        };

        this.objtArtclList.push(obj);
      }

      this.setObjectionForm();
      this.mixin_hideDialog('RegObjection');
    },

    clickDeleteBtn(item, index){
      if(this.isExpiredObjtDt("OBJT_END_DT")){
        this.showAlertInfo({msg:"이의제기 기간이 경과되었습니다."});
        return;
      }

      if(!(this.objtData.STTS_CD == "" || this.objtData.STTS_CD != "ARGUTP01")){
        this.showAlertInfo({msg:"종결 또는 신청중인 이의제기 입니다."});
        return;
      }

      this.showConfirmInfo({
        msg:'해당 항목을 삭제하시겠습니까?'
        , callYes: () => {
          this.objtArtclList.splice(index, 1);
          if(this.objtArtclList.length <= 0) this.objtData.MODE = "NONE";
          this.closeAlert();
        }
        , callNo: this.closeAlert
      });
    },


    // 자세히 보기 버튼
    clickShowDetailBtn(){
      this.isPreview = true;

      // 항목 추가 팝업 오픈
      this.mixin_showDialog('RegObjection');
    },

    // 이의제기/재결 요청
    clickObjtReqBtn(){
      if(this.mixin_isEmpty(this.objtData.OBJT_ID) && this.USER_TYPE == 'MANAGER'){
        // 이의제기 요청
        if(this.isExpiredObjtDt("OBJT_END_DT")){
          this.showAlertInfo({msg:"이의제기 기간이 경과되었습니다."});
          return 
        }

        if(!(this.objtData.STTS_CD == "" || this.objtData.STTS_CD == "ARGUTP01")){
          this.showAlertInfo({msg:"종결 또는 신청중인 이의제기 입니다."});
          return;
        }

        if(this.objtArtclList.length <= 0 ){
          this.showAlertInfo({msg:"이의제기 항목과 신청내용을 입력하십시오."});
          return
        }

        for(let i in this.objtArtclList){
          if(this.mixin_isEmpty(this.objtArtclList[i].OBJC_APLY_CN)){
            this.showAlertInfo({msg:"이의제기 항목과 신청 내용을 입력하십시오."});
            return
          }
        }

        this.showConfirmInfo({
          msg:'이의제기 요청 하시겠습니까?<br>(팀장 확인 시 정식으로 이의제기 신청처리 됩니다.)'
          , callYes: () => {
            this.insertObjectionData(false);
            this.closeAlert();
          }
          , callNo: this.closeAlert
        });

      }else if(this.objtData.STTS_CD == "ARGUTP04" && this.USER_TYPE == 'MANAGER'){
        // 재결 요청
        if(this.isExpiredObjtDt("RE_OBJT_END_DT")){
          this.showAlertInfo({msg:"재결요청 기간이 경과되었습니다."});
          return 
        }

        if(this.objtData.STTS_CD != "ARGUTP04"){ // 종결인 경우에만 가능
          this.showAlertInfo({msg:"신청중인 재결내용 입니다."});
          return;
        }

        // 재결 요청 목록
        let reObjtList = this.objtArtclList.filter(row=>{return row.RE_OBJT_YN});

        if(reObjtList.length <= 0){
          this.showAlertInfo({msg:"재결요청 항목과 신청내용을 입력하십시오."});
          return ;
        }

        for(let i in reObjtList){
          if(this.mixin_isEmpty(reObjtList[i].RE_OBJC_APLY_CN)){
            this.showAlertInfo({msg:"재결요청 항목과 신청내용을 입력하십시오."});
            return
          }
        }
        
        this.showConfirmInfo({
          msg:'재결요청 하시겠습니까?<br>(팀장 확인 시 정식으로 재결 신청처리 됩니다.)'
          , callYes: () => {
            this.insertObjectionData(true);
            this.closeAlert();
          }
          , callNo: this.closeAlert
        });
      }
    },

    // 이의제기/제결요청 등록
    async insertObjectionData(reObjtYn){
      let sUrl = '/phone-api/objt/insertObjectionData';
      // let sUrl = '/api/biz/common/select/insertObjectionData';      

      let reObjtList = this.objtArtclList.filter(row=>{return row.RE_OBJT_YN});

      let postParam = {
        OBJT_ID: this.objtData.OBJT_ID
        , EVL_SE_CD: this.objtData.EVL_SE_CD
        , CENTER_ID: this.objtData.CENTER_ID
        , STD_ID: this.objtData.STD_ID
        , EVAL_DSTN_NO: this.objtData.EVAL_DSTN_NO
        , CUTT_COACHING_ID: this.objtData.CUTT_COACHING_ID
        , STTS_CD: "ARGUTP01" // 요청
        , RE_OBJT_YN: reObjtYn ? "Y" : "N"
        , objtArtclList: reObjtYn ? reObjtList : this.objtArtclList
      };

      let headParam = { head : {
        DATA_OBJECT:"objtArtclList"
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        this.showToastSuccess({msg: reObjtYn ? "재결요청이 등록되었습니다." : "이의제기 요청이 등록되었습니다." });
        this.$eventBus.$emit('refreshObjtGridList');
        this.loadObjtData();
      }else{
        this.showErrorMsg();
      }
    },

    // 이의제기/재결요청 취소
    clickCancleBtn(){

      // 이의제기 요청
      if(this.isExpiredObjtDt(this.objtData.RE_OBJT_YN == "N" ? "OBJT_END_DT" : "RE_OBJT_END_DT")){
        this.showAlertInfo({msg: this.objtData.RE_OBJT_YN == "N" ? "이의제기 기간이 경과되었습니다." :"재결요청 기간이 경과되었습니다."});
        return 
      }

      if(!(this.objtData.STTS_CD == "" || this.objtData.STTS_CD == "ARGUTP01")){
        this.showAlertInfo({msg:"종결 또는 신청중인 "+ (this.objtData.RE_OBJT_YN == "N" ? "이의제기" : "재결내용") +" 입니다."});
        return;
      }

      this.showConfirmInfo({
        msg: this.objtData.RE_OBJT_YN == "N" ? '이의제기 취소하시겠습니까?<br>(취소한 이의제기는 재 신청할 수 없습니다.)' 
                                            : "재결요청 취소하시겠습니까?<br>(취소한 재결내용은 재 신청할 수 없습니다.)"
        , callYes: () => {
          this.cancleObjectionData(this.objtData.RE_OBJT_YN == "N" ? false : true);
          this.closeAlert();
        }
        , callNo: this.closeAlert
      });
    },

    // 이의제기 취소
    async cancleObjectionData(reObjtYn){
      // let sUrl = '/phone-api/objt/cancleObjectionData';
      let sUrl = '/api/biz/common/update/cancleObjectionData';

      let postParam = {
        OBJT_ID: this.objtData.OBJT_ID
        , STTS_CD: "ARGUTP02"
      };

      let headParam = { head : {
        ns : 'lhcs.phone.objt.dao.xml.PhoneObjectionManageMapper'
        , sn : 'selectObjtArtclList'
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        this.objtArtclList = [];
        this.showToastSuccess({msg: reObjtYn ? "재결요청이 취소되었습니다." : "이의제기 요청이 취소되었습니다." });
        this.$eventBus.$emit('refreshObjtGridList');
        await this.loadObjtData();
      }else{
        this.showErrorMsg();
      }
    },

    // 팀장확인 버튼 클릭
    clickLeaderApplyBtn(){
      // if(this.isExpiredObjtDt(this.objtData.RE_OBJT_YN == "N" ? "OBJT_END_DT" : "RE_OBJT_END_DT")){
      //   this.showAlertInfo({msg: this.objtData.RE_OBJT_YN == "N" ? "이의제기 기간이 경과되었습니다." :"재결요청 기간이 경과되었습니다."});
      //   return 
      // }

      if(!(this.objtData.STTS_CD == "" || this.objtData.STTS_CD == "ARGUTP01")){
        this.showAlertInfo({msg:"종결 또는 신청중인 "+ (this.objtData.RE_OBJT_YN == "N" ? "이의제기" : "재결내용") +" 입니다."});
        return;
      }

      this.showConfirmInfo({
        msg: this.objtData.RE_OBJT_YN == "N" ? "이의제기 신청하시겠습니까?<br>(팀장 확인 시 이의제기 신청 내용은 수정할 수 없습니다.)" 
                                            : "재결 신청하시겠습니까?<br>(팀장 확인 시 재결신청 내용은 수정할 수 없습니다.)"
        , callYes: () => {
          this.applyObjectionData();
          this.closeAlert();
        }
        , callNo: this.closeAlert
      });
    },

    // 신청
    async applyObjectionData(){
      let sUrl = '/phone-api/objt/applyObjectionData';
      // let sUrl = '/api/biz/common/update/applyObjectionData';      

      let reObjtList = this.objtArtclList.filter(row=>{return row.RE_OBJT_YN});

      let postParam = {
        OBJT_ID: this.objtData.OBJT_ID
        , STTS_CD: "ARGUTP03" // 신청
        , RE_OBJT_YN: this.objtData.RE_OBJT_YN
        , objtArtclList: this.objtData.RE_OBJT_YN == "Y" ? reObjtList : this.objtArtclList
      };

      let headParam = { head : {
        DATA_OBJECT:"objtArtclList"
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        this.showToastSuccess({msg: this.objtData.RE_OBJT_YN == "N" ? "이의제기 신청되었습니다." : "재결 신청되었습니다." });
        this.$eventBus.$emit('refreshObjtGridList');
        this.loadObjtData();
      }else{
        this.showErrorMsg();
      }
    },

    // 종결처리 버튼 클릭
    clickCloseBtn(){
      if(this.objtData.RE_OBJT_YN == "N"){
        for(let i in this.objtArtclList){
          if(this.mixin_isEmpty(this.objtArtclList[i].OBJC_APLY_RSLT_CN)){
            this.showAlertInfo({msg:"이의신청 결과를 입력하십시오."});
            return
          }

          if(this.mixin_isEmpty(this.objtArtclList[i].AFTR_SCR) && this.objtArtclList[i].RFLT_YN == "Y"){
            this.showAlertInfo({msg:"반영 점수를 입력하십시오."});
            return
          }
        }
      }else{
        // 재결 요청 목록
        let reObjtList = this.objtArtclList.filter(row=>{return row.RE_OBJT_YN});

        for(let i in reObjtList){
          if(this.mixin_isEmpty(reObjtList[i].RE_OBJC_APLY_RSLT_CN)){
            this.showAlertInfo({msg:"재결신청 결과를 입력하십시오."});
            return
          }

          if(this.mixin_isEmpty(this.objtArtclList[i].RE_AFTR_SCR) && this.objtArtclList[i].RE_RFLT_YN == "Y"){
            this.showAlertInfo({msg:"반영 점수를 입력하십시오."});
            return
          }
        }
      }

      this.showConfirmInfo({
        msg: "종결 처리하시겠습니까?"
        , callYes: () => {
          this.closeObjectionData();
          this.closeAlert();
        }
        , callNo: this.closeAlert
      });
    },

    async closeObjectionData(){
      let sUrl = '/phone-api/objt/closeObjectionData';
      // let sUrl = '/api/biz/common/update/closeObjectionData';      

      let reObjtList = this.objtArtclList.filter(row=>{return row.RE_OBJT_YN});

      let postParam = {
        OBJT_ID: this.objtData.OBJT_ID
        , STTS_CD: "ARGUTP04" // 신청
        , RE_OBJT_YN: this.objtData.RE_OBJT_YN
        , objtArtclList: this.objtData.RE_OBJT_YN == "Y" ? reObjtList : this.objtArtclList
      };

      let headParam = { head : {
        DATA_OBJECT:"objtArtclList"
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        this.showToastSuccess({msg: "종결 처리되었습니다." });
        this.$eventBus.$emit('refreshObjtGridList');
        this.loadObjtData();
      }else{
        this.showErrorMsg();
      }
    },

    // 이의제기 구성요소 셋팅
    setObjectionForm(){
      // 사용자 정보 셋팅
      if(this.computedUserType  === "ETC_ADMIN" && this.computedUserDetailType === "SYS_HUMAN"){  // 인재개발 // this.computedUserDetailType === "CENTER_LEADER"
        // 평가자인 경우
        this.USER_TYPE = "ADMIN";
        this.isObject = this.objtData.STTS_CD == "ARGUTP03" || this.objtData.STTS_CD == "ARGUTP04" ? true : false;
      }else if(this.computedUserDetailType === "TEAM_LEADER" || this.computedUserDetailType === "CENTER_LEADER"){ 
        // 팀장
        this.USER_TYPE = "LEADER";
      }else if(this.propsData.CUSL_ID === this.$store.getters['userStore/GE_USER_ROLE'].userId){  // this.computedUserDetailType == "MANAGER" 
        // 상담사
        this.USER_TYPE = "MANAGER";
      }else{  // 그 외
        this.USER_TYPE = "ETC"; // 기타

        // 종결된 경우에만 표시
        this.isObject = this.objtData.STTS_CD === "ARGUTP04" ? true : false;
      }
      
      if(this.objtArtclList.length > 0){
        this.objtData.MODE = "OBJECTION";
      }else if(this.isExpiredObjtDt("OBJT_END_DT") && this.USER_TYPE === "MANAGER"){
        this.objtData.MODE = "EXPIRED";
      }else if(!this.mixin_isEmpty(this.objtData.OBJT_END_DT) && !this.isExpiredObjtDt("OBJT_END_DT") && this.USER_TYPE === "MANAGER"){
        this.objtData.MODE = "NONE";
      }

      this.isReadonly.OBJC_APLY_CN = ((this.objtData.STTS_CD == "" && this.USER_TYPE == "MANAGER") || (this.objtData.STTS_CD == "ARGUTP01" && this.USER_TYPE == "LEADER")) && this.objtData.RE_OBJT_YN == "N" ? false : true;
      this.isReadonly.OBJC_APLY_RSLT_CN = this.objtData.STTS_CD == "ARGUTP03" && this.USER_TYPE == "ADMIN" && this.objtData.RE_OBJT_YN == "N"? false : true;
      this.isReadonly.RE_OBJC_APLY_CN = ((this.objtData.STTS_CD == "ARGUTP04" && this.USER_TYPE == "MANAGER") || (this.objtData.STTS_CD == "ARGUTP01" && this.USER_TYPE == "LEADER" && this.objtData.RE_OBJT_YN == "Y"))? false : true;
      this.isReadonly.RE_OBJC_APLY_RSLT_CN = this.objtData.STTS_CD == "ARGUTP03" && this.USER_TYPE == "ADMIN" && this.objtData.RE_OBJT_YN == "Y"? false : true;
    },

    // 이의제기/재결요청 기간 만료 여부
    isExpiredObjtDt(dateName){ 
      if(this.mixin_isEmpty(this.objtData[dateName])) return true;
      else return this.$moment().diff(this.$moment(this.objtData[dateName]), 'seconds') > 0;
    },

    // 점수 변경시 이벤트
    changeScore(index, type){
      if(parseInt(this.objtArtclList[index][type]) > parseInt(this.objtArtclList[index].ALLOC_SCORE)){
        this.$nextTick(() => {
          this.objtArtclList[index][type] = "";
          this.showAlertCaution({msg:"점수는 배점 이내로 입력해주세요."});
        });
      }
    },

    // 닫기
    close(){
      this.$emit("close");
    },

    // 에러 메세지
    showErrorMsg(){
      this.showAlertCaution({msg:"일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오."});
    },

    // 재조회
    async loadObjtData(){
      await this.selectObjectionData();
      await this.selectObjtArtclList();
      await this.setObjectionForm();
    }
  },
  mounted() {
    this.loadObjtData();
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