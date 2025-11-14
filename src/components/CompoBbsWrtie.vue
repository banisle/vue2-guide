<template>
  <div>
    <!-- 공지사항 -->
    <template v-if="TypeProp === 'notice'">
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline" v-if="FORM_DATA.BBS_TYPE_CD === 'EMRG_NTC'/*긴급공지인경우*/">
          <span class="pl-label">
            센터
          </span>
          <div class="pl-desc">
            <v-select
                class="pl-form type-middle is-md"
                placeholder="선택"
                v-model="SRCH_PARAMS_TOP.SRCH_CENTER"
                :disabled="SRCH_PARAMS_TOP.SRCH_CENTER_DISABLED"
                return-object
                :items="mixin_ognz_list_center(common_ognz_list, 'CUSL', '전체' )"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline" v-if="FORM_DATA.BBS_TYPE_CD == 'GNRL_NTC'/*일반공지*/ || FORM_DATA.BBS_TYPE_CD == 'DAYLY_NTC' ">
          <span class="pl-label">
            조직
          </span>
          <div class="pl-desc">
            <v-autocomplete
                class="pl-form type-middle is-md"
                v-model="SRCH_PARAMS_TOP.SRCH_DEPT"
                :items="bbs_ognz_list_detail(common_ognz_list, SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID, '' ,'Y'/*콜센터여부,없으면전체*/)"
                placeholder="조직을 검색하세요"
                return-object
                no-data-text="결과 없음"
                :disabled="SRCH_PARAMS_TOP.SRCH_DEPT_DISABLED"
            />
          </div>
          <span class="pl-label">
            유형
          </span>
          <div class="pl-desc">
            <v-select
              class="pl-form type-middle"
              v-model="FORM_DATA.PST_TYPE_CD"
              :items="mixin_common_code_get_global(common_code_global, 'NE', FORM_DATA.CUSTCO_ID, '전체' )"
              placeholder="선택"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline" v-if="FORM_DATA.BBS_TYPE_CD == 'GNRL_BBS'/*일반*/ && FORM_DATA.BBS_USE_SE_CD !== 'A'">
          <span class="pl-label">
            조직
          </span>
          <div class="pl-desc">
            <v-autocomplete
                class="pl-form type-middle is-md"
                v-model="SRCH_PARAMS_TOP.SRCH_DEPT"
                :items="bbs_ognz_list_detail(common_ognz_list, SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID, '' ,'Y'/*콜센터여부,없으면전체*/)"
                placeholder="조직을 검색하세요"
                return-object
                no-data-text="결과 없음"
                :disabled="SRCH_PARAMS_TOP.SRCH_DEPT_DISABLED"
            />
          </div>
        </div>
        <div class="pl-form-inline" v-show="FORM_DATA.BBS_TYPE_CD != 'GNRL_BBS'/*일반*/">
          <span class="pl-label">
            게시 기간
          </span>
          <div class="pl-desc">
            <compo-date-range-picker
              ParentStyleProp="width: 300px"
              :StartDayProp.sync="SRCH_PARAMS_TOP.SRCH_ST_DD"
              :EndDayProp.sync="SRCH_PARAMS_TOP.SRCH_END_DD"
              @startDayChange="mixin_testLog(SRCH_PARAMS_TOP.SRCH_ST_DD)"
              @endDayChange="mixin_testLog(SRCH_PARAMS_TOP.SRCH_END_DD)"
              :PickerRangeProp="pickerRange"
              :BbsDateProp="true"
            />
          </div>
        </div>
      </div>
      <div class="pl-form-inline-wrap is-mt-s">
        <div class="pl-form-inline flex-grow-1">
          <span class="pl-label">
            제목
          </span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form type-middle flex-grow-1 mr-4"
              v-model="FORM_DATA.PST_TTL"
              placeholder="제목을 입력하십시오." />
            <template v-if="FORM_DATA.BBS_TYPE_CD === 'GNRL_BBS'/*일반*/ && FORM_DATA.BBS_USE_SE_CD === 'A'"></template>
            <template v-else>
              <v-checkbox
                class="pl-check flex-grow-0"
                label="목록 상단고정"
                v-model="FORM_DATA.POPUP_YN"
              ></v-checkbox>
            </template>
          </div>
        </div>
      </div>
    </template>

    <!-- editor -->
    <div class="is-mt-m" style="height: 430px;">
      <crosseditor
        v-model="crosseditor_initial_value"
        id="ne-crosseditor-001"
        ref="crossEditor"
        editorHeight="430"
        CreateTab="0|1|2"
        @initEditorCompleted="initEditorCompleted"
      ></crosseditor>
    </div>
     <!-- <v-btn
      @click="editorContents()">
      에디터 내용
     </v-btn>
     <v-btn
      @click="changeContents()">
      내용 변경
     </v-btn> -->
     <!-- file grid -->
     <compo-file-grid
        TitleProp="첨부 파일"
        ref="bbsRef"
        :FilesProp="FORM_DATA.filelist"
        @addFile="clickAddFiles"
        :fileuploadding="mixin_fileuploadding"
        :DelData="DEL_FILE"
        @removeFile="removeFile()"
      >
    </compo-file-grid>
    <v-file-input
        style="display: none"
        ref="fileUpload"
        @change="handleFileUpload"
        multiple
        label="파일을 선택하세요"
    />
  </div>
</template>

<script>
import axios from "axios";
import CompoFileGrid from "@/components/CompoFileGrid.vue";
import Vue from "vue";
export default {
  name: "CompoBbsWrtie", //name은 'MENU_' + 파일명 조합
  props: {
    TypeProp: {
      type: String,
      default: 'notice'
    },
    DataSet: {
      type: Object,
      default: null
    },
  },
  components: {
    CompoFileGrid
  },
  data() {
    return {
      common_ognz_list:[], //조직
      isInitCompleted: false,
      crosseditor_initial_value: "",

      common_code_global:[],
      SRCH_PARAMS_TOP:{
        SRCH_CENTER: {},  //센터
        SRCH_DEPT: {},
        SRCH_CENTER_DISABLED:false,
        SRCH_DEPT_DISABLED:false,
        SRCH_ST_DD: this.$moment(new Date()).format('YYYY-MM-DD'),
        SRCH_END_DD: '2099-12-31',
      },

      FORM_DATA:{
        filelist:[],
      },
      fileuploadding:false,
      FILE_KEY:'',              //파일키
      DEL_FILE:[],              //컴포넌트 모달에서 가져온 삭제파일정보
      DEL_FILE_LIST:[],         //삭제파일정보

      // 피커
      pickerRange: [
        { label: "6개월", day: 0, month: 6},
        { label: "1년", day: 0, month: 12},
        { label: "3년", day: 0, month: 36},
        { label: "10년", day: 0, month: 120},
      ],

    }
  },
  methods: {
    initEditorCompleted() {
      //alert("initEditorCompleted");
      this.isInitCompleted = true;
      if( this.FORM_DATA !== null ) {
        this.$refs.crossEditor.update( this.restoreXSS_CrossEditor(this.FORM_DATA.PST_CN) );
      }
    },
    initFormData() {

      this.FORM_DATA = {};
      this.FORM_DATA.filelist = [];
      this.FORM_DATA = JSON.parse(JSON.stringify(this.DataSet)); // Deep Copy
      if( this.FORM_DATA.PSTG_BGNG_DT_DD !== undefined) this.SRCH_PARAMS_TOP.SRCH_ST_DD = this.FORM_DATA.PSTG_BGNG_DT_DD;
      if( this.FORM_DATA.PSTG_END_DT_DD !== undefined) this.SRCH_PARAMS_TOP.SRCH_END_DD = this.FORM_DATA.PSTG_END_DT_DD;

      if( this.FORM_DATA.BBS_TYPE_CD === 'EMRG_NTC'/*긴급공지인경우*/ ) {
        this.SRCH_PARAMS_TOP.SRCH_CENTER.CUSTCO_ID = '-1';
        this.SRCH_PARAMS_TOP.SRCH_CENTER.value = '';
        this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID = '1';
        this.SRCH_PARAMS_TOP.SRCH_CENTER_DISABLED = true;
        if(this.SRCH_PARAMS_TOP.SRCH_DEPT){
          this.SRCH_PARAMS_TOP.SRCH_DEPT.value = '1';
          this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID = '1';
        }
      }else if( (this.FORM_DATA.BBS_TYPE_CD === 'GNRL_NTC'/*일반공지인경우*/ ) ) {
        this.SRCH_PARAMS_TOP.SRCH_CENTER.CUSTCO_ID = this.FORM_DATA.CUSTCO_ID;
        this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID = this.FORM_DATA.CENTER_DEPT_ID;
        if(this.SRCH_PARAMS_TOP.SRCH_DEPT){
          this.SRCH_PARAMS_TOP.SRCH_DEPT.value = this.FORM_DATA.CENTER_DEPT_ID;
          this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID = this.FORM_DATA.CENTER_DEPT_ID;
        }
        this.SRCH_PARAMS_TOP.SRCH_DEPT_DISABLED = false;
      }else if(this.FORM_DATA.BBS_TYPE_CD === 'DAYLY_NTC'/*일일공지인경우*/ ) {
        this.SRCH_PARAMS_TOP.SRCH_CENTER.CUSTCO_ID = this.FORM_DATA.CUSTCO_ID;
        this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID = this.FORM_DATA.CENTER_DEPT_ID;
        if(this.SRCH_PARAMS_TOP.SRCH_DEPT){
          this.SRCH_PARAMS_TOP.SRCH_DEPT.value = this.FORM_DATA.CENTER_DEPT_ID;
          this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID = this.FORM_DATA.CENTER_DEPT_ID;
        }
        this.SRCH_PARAMS_TOP.SRCH_DEPT_DISABLED = false;
      }else if(this.FORM_DATA.BBS_TYPE_CD === 'GNRL_BBS'/* 일반게시판. */  &&  this.FORM_DATA.BBS_USE_SE_CD === 'CT' /* 일반게시판 C + T*/ ) {
        this.SRCH_PARAMS_TOP.SRCH_CENTER.CUSTCO_ID = this.FORM_DATA.CUSTCO_ID;
        this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID = this.FORM_DATA.CENTER_DEPT_ID;
        if(this.SRCH_PARAMS_TOP.SRCH_DEPT){
          this.SRCH_PARAMS_TOP.SRCH_DEPT.value = this.FORM_DATA.CENTER_DEPT_ID;
          this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID = this.FORM_DATA.CENTER_DEPT_ID;
        }
        this.SRCH_PARAMS_TOP.SRCH_DEPT_DISABLED = false;
      }else if(this.FORM_DATA.BBS_TYPE_CD === 'GNRL_BBS'/* 일반게시판. */  &&  this.FORM_DATA.BBS_USE_SE_CD === 'T' /* 일반게시판 팀T*/ ) {
        this.SRCH_PARAMS_TOP.SRCH_CENTER.CUSTCO_ID = this.FORM_DATA.CUSTCO_ID;
        this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID = this.FORM_DATA.CENTER_DEPT_ID;
        if(this.SRCH_PARAMS_TOP.SRCH_DEPT){
          this.SRCH_PARAMS_TOP.SRCH_DEPT.value = this.FORM_DATA.DEPT_ID;
          this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID = this.FORM_DATA.DEPT_ID;
        }
        this.SRCH_PARAMS_TOP.SRCH_DEPT_DISABLED = true;
      }else if(this.FORM_DATA.BBS_TYPE_CD === 'GNRL_BBS'/* 일반게시판. */  &&  this.FORM_DATA.BBS_USE_SE_CD === 'A' /* 일반게시판 전체 */ ) {
        this.SRCH_PARAMS_TOP.SRCH_CENTER.CUSTCO_ID = '-1';
        this.SRCH_PARAMS_TOP.SRCH_CENTER.value = '';
        this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID = '1';
        this.SRCH_PARAMS_TOP.SRCH_CENTER_DISABLED = true;
        if(this.SRCH_PARAMS_TOP.SRCH_DEPT){
          this.SRCH_PARAMS_TOP.SRCH_DEPT.value = '1';
          this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID = '1';
        }
      }

    },
    editorContents(){
      let editorContents = this.$refs.crossEditor.getValue();
      console.log("editorContents", editorContents);
    },
    changeContents(){
      this.$refs.crossEditor.update('<p>에디터 초기내용</p>');
    },

    parentRefresh(){
      this.$emit('Refresh');
    },
    closeModal() {
      this.initFormData();
      this.$store.commit("alertStore/hideAlert");
      this.$emit('Close');
    },
    // file input
    clickAddFiles() {
      this.$refs.fileUpload.$refs.input.value = null;
      this.$refs.fileUpload.$refs.input.click()
    },

    async handleFileUpload( files ) {
      await
          this.mixin_handleFileUpload(
              files,
              {busiType:'bbs', pathType:'files', maxFileCount:3, maxFileSize: this.FORM_DATA.ATCH_FILE_SZ},
              this.callbackHandleFileUpload
          );
    },
    //파일업로드 콜백
    async callbackHandleFileUpload(resultObj) {
      for(let n=0;n<resultObj.display.length;n++) {
        this.FORM_DATA.filelist.push({
              index: this.mixin_isEmpty(this.FORM_DATA.filelist) ? n : this.FORM_DATA.filelist[this.FORM_DATA.filelist.length - 1].index + 1,
              filename: resultObj.display[n].filename,
              filesize: resultObj.display[n].filesize,
              download: false,
              count: 0,
              downloadFile: resultObj.display[n].downloadFile,
              fileGroupKey: resultObj.display[n].fileGroupKey,
              fileKey: resultObj.display[n].fileKey,
              FILE_EXTN: this.mixin_getExtensionOfFilename( resultObj.display[n].filename )
            });
      }

      console.log( "callbackHandleFileUpload :: aft " , this.FORM_DATA.filelist );
    },
    //파일 삭제 클릭
    removeFile(){
      for(let i=0;i<this.DEL_FILE.FILE_LIST.length;i++){
        this.DEL_FILE_LIST.push(this.DEL_FILE.FILE_LIST[i]);
      }
    },
    //게시판 수정 시 파일 삭제실행=>단일파일삭제 반복 후 게시물 저장
    fileDel(){
      if(this.DEL_FILE_LIST.length != 0){
        let leng=this.DEL_FILE_LIST.length
        for(let i=0;i<leng;i++){
          this.FILE_KEY = this.DEL_FILE_LIST[i].fileKey
          this.fileDelExecute('NO_MSG');
        }
      }
      this.fileGroupKeyUnity();
    },
    //파일 그룹 키 통일
    async fileGroupKeyUnity(){
      let arrFileKey = [];
      if(this.FORM_DATA.filelist.length > 0){
        let leng = this.FORM_DATA.filelist.length;
        for(let i=0;i<leng;i++){
          arrFileKey.push(this.FORM_DATA.filelist[i]["fileKey"])
        }
        //게시물 저장
        let sUrl = '/api/file/fileKey-unity/process';
        let postParam = {
          FILE_GROUP_KEY: this.FORM_DATA.filelist[0]["fileGroupKey"],
          arrFileKey:arrFileKey
        }
        let headParam = {
          head: {
          }
        }

        let resData = await this.common_postCall(sUrl, postParam, headParam)
        if(!resData.HEADER.ERROR_FLAG){
          this.saveProcess();
        }
      }else{
        this.saveProcess();
      }
    },
    bbs_ognz_list_detail(all_code, dept_id, strHeadText, CL_CNTR_YN/*콜센터여부*/) {

      var responseData = [];
      if (strHeadText != "" && strHeadText != undefined) {
        responseData.push({ text: strHeadText, value: "" });
      }
      if (all_code && typeof all_code === "object") {
        for (var i = 0; i < all_code.length; i++) {
          let item = all_code[i];
          item.value = item.DEPT_ID;
          if (item.LVL > 3) {
            // 3레벨 이상은 루트>그룹> 제외된 full path 표기
            item.text = item.FULL_PATH.replace(/[^>]+>[^>]+>/, "")
          } else {
            item.text = this.mixin_decode(item.DEPT_NM); //공통코드명 특수문자 decode
          }
          if (this.FORM_DATA.BBS_TYPE_CD === 'GNRL_NTC'/*일반공지인경우*/ && this.FORM_DATA.BBS_GB === 'T' /*팀*/) {
            if( item.DEPT_ID !== dept_id ) {  // 팀게시판인경우는 센터제외
              if (item.FULL_DEPT_PATH.startsWith('1>' + dept_id)) {
                if (CL_CNTR_YN) {
                  if (item.CL_CNTR_YN === CL_CNTR_YN) {  //조직정보에 콜센터여부 에따른 조회인경우.
                    responseData.push(item);
                  }
                }
              }
            }
          }else {
            if (item.FULL_DEPT_PATH.startsWith('1>' + dept_id)) {
              if (CL_CNTR_YN) {
                if (item.CL_CNTR_YN === CL_CNTR_YN) {  //조직정보에 콜센터여부 에따른 조회인경우.
                  responseData.push(item);
                }
              }
            }
          }
        }
      }
      return responseData;
    },
    saveTaskInfo() {

      if( this.FORM_DATA.BBS_TYPE_CD === 'EMRG_NTC'/*긴급공지인경우*/ ) {
      }else if( (this.FORM_DATA.BBS_TYPE_CD === 'GNRL_NTC'/*일반공지인경우*/ ) && this.FORM_DATA.BBS_GB === '' /*전체*/ ) {
      }else if( this.FORM_DATA.BBS_TYPE_CD === 'GNRL_NTC'/*일반공지인경우*/ &&  this.FORM_DATA.BBS_GB === 'T' /*팀*/ ) {
      }else if( (this.FORM_DATA.BBS_TYPE_CD === 'DAYLY_NTC'/*일일공지인경우*/ ) ) {

      }else if( (this.FORM_DATA.BBS_TYPE_CD === 'GNRL_BBS'/*일반*/ ) ) {
      }

      if( this.mixin_isEmpty( this.FORM_DATA.PST_TTL ) ) {
        this.showAlertCaution({msg: '제목을 입력하세요.'});
        return;
      }
      let cn = this.$refs.crossEditor.getValue();
      if(cn == '' || cn == '<p></p>' || cn == '<p><br></p>') {
        this.showAlertCaution({msg: '내용을 입력하세요.'});
        return;
      }

      this.showConfirmInfo({msg: '저장 하시겠습니까?'
        , callYes : ()=>{  this.fileGroupKeyUnity(); }
        , callNo : this.closeAlert
      })


    },

    async saveProcess() {
      let fileGroupKey = this.mixin_isEmpty(this.FORM_DATA.filelist) ? null : this.FORM_DATA.filelist[0]["fileGroupKey"];

      let postParam = {};
      postParam.PST_ID = this.FORM_DATA.PST_ID;
      postParam.BBS_ID = this.FORM_DATA.BBS_ID;
      postParam.PST_TYPE_CD = this.FORM_DATA.PST_TYPE_CD;
      postParam.SRCH_CUSTCO_ID = this.SRCH_PARAMS_TOP.SRCH_CENTER.CUSTCO_ID;
      postParam.SRCH_DEPT_ID = this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID;
      postParam.FILE_GROUP = fileGroupKey;
      postParam.FILE_GROUP_KEY = fileGroupKey;
      postParam.PSTG_BGNG_DT = this.SRCH_PARAMS_TOP.SRCH_ST_DD.replaceAll("-","");
      postParam.PSTG_END_DT = this.SRCH_PARAMS_TOP.SRCH_END_DD.replaceAll("-","");
      postParam.POPUP_YN = this.FORM_DATA.POPUP_YN === true?'Y':'N';
      postParam.PST_TTL = this.sendXSS__CrossEditor(this.FORM_DATA.PST_TTL)   // 게시물내용
      postParam.PST_CN = this.sendXSS__CrossEditor(this.$refs.crossEditor.getValue())   // 게시물내용
      postParam.RGTR_IP = this.$store.getters['userStore/GE_USER_IP_ADDR'] // IP
      postParam.PST_LVL = '1';

      let sUrl = '/system-api/bbs/pstUpsert';
      let response = await this.common_postCall(sUrl, postParam, {});

      if (!response.HEADER.ERROR_FLAG) {
        this.showToastInfo({msg : '정상 처리되었습니다.', callAfter : ()=>{
            this.$eventBus.$emit('reloadBoardList');
            if( !this.mixin_isEmpty(postParam.PST_ID ) ) {

              this.$eventBus.$emit('reloadBoardDetailClose', postParam);
            }
        }});
      }else {
        this.showToastCaution({msg: response.HEADER.ERROR_MSG});
      }
      this.closeModal();
    },
  },
  mounted() {
  },
  async created() {

    console.log("CompoBbsWrtie.create()");

    this.initFormData();

    //조직
    this.common_ognz_list = await this.mixin_ognz_list();

    let codeNameGloal = ['NE'/*게시물유형*/];
    this.common_code_global = await this.mixin_common_code_get_all_global( codeNameGloal );

    this.FORM_DATA.PST_TTL = this.restoreXSS_CrossEditor(this.FORM_DATA.PST_TTL);
    this.FORM_DATA.POPUP_YN = ( this.FORM_DATA.POPUP_YN === 'Y' )?true:false;
    if( this.FORM_DATA.PST_TYPE_CD === undefined ) this.FORM_DATA.PST_TYPE_CD = '';
    if( this.FORM_DATA.PSTG_BGNG_DT_DD === undefined ) this.FORM_DATA.PSTG_BGNG_DT_DD = this.$moment(new Date()).format('YYYY-MM-DD');
    if( this.FORM_DATA.PSTG_END_DT_DD === undefined ) this.FORM_DATA.PSTG_END_DT_DD = '2099-12-31';
    if( this.FORM_DATA.filelist === undefined ) this.FORM_DATA.filelist = [];
    if( this.FORM_DATA.PST_TYPE_CD === undefined ) this.FORM_DATA.PST_TYPE_CD = '';
    if( this.isInitCompleted && this.FORM_DATA !== null ) {
      this.$refs.crossEditor.update( this.restoreXSS_CrossEditor(this.FORM_DATA.PST_CN) );
    }
    console.log( "created()::", this.FORM_DATA );
  },
  computed: {
  },
  beforeDestroy(){
    this.initFormData();
  },
  watch: {
    DataSet() {
      console.log("watch.DataSet :: " , this.DataSet);
      this.FORM_DATA = JSON.parse(JSON.stringify(this.DataSet))/*DeepCopy*/;
      if( this.FORM_DATA.filelist === undefined ) this.FORM_DATA.filelist = [];
      if( this.FORM_DATA.PST_TYPE_CD === undefined ) this.FORM_DATA.PST_TYPE_CD = '';
      if( this.isInitCompleted ) {
        this.$refs.crossEditor.update( this.restoreXSS_CrossEditor(this.FORM_DATA.PST_CN) );
      }
    }
  },
};
</script>

<style lang="scss" scoped>

</style>