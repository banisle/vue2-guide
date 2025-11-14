<template>
  <div class="fill-height">
    <div class="pl-quick-layer-body" style="height: calc(100vh - 210px)">
      <!-- form -->
      <v-form ref="form">
        <div class="pl-form-inline-wrap vertical label-80 gap-8">
          <div class="pl-form-inline">
          <span class="pl-label">
            제목
          </span>
            <div class="pl-desc">
              <v-text-field
                  class="pl-form type-middle"
                  placeholder="제목 입력"
                  v-model="saveParam.DATA_TTL"
                  :rules="validateRules.TITLE"
              />
            </div>
          </div>
          <div style=" display: grid; grid-template-columns: repeat(3,1fr); gap: 26px">
            <div class="pl-form-inline">
            <span class="pl-label">
              공고일
            </span>
              <div class="pl-desc">
                <compo-date-picker
                    class="pl-form type-middle"
                    DateType="dateInput"
                    StyleProp="width: 100px"
                    :DateProp.sync="saveParam.NOTICE_DT"
                />
              </div>
            </div>
            <div class="pl-form-inline" style="gap: 0">
            <span class="pl-label">
              상담자료 분류
            </span>
              <div class="pl-desc">
                <v-select
                    class="pl-form type-middle"
                    placeholder="선택"
                    :items="mixin_common_code_get(this.commonCode, 'T305', '')"
                    v-model="saveParam.CNSLT_DATA_CD"
                    :rules="validateRules.DIV_CD"
                />
              </div>
            </div>
            <div class="pl-form-inline" style="gap: 0">
            <span class="pl-label">
              담당본부
            </span>
              <div class="pl-desc">
                <v-select
                    class="pl-form type-middle"
                    placeholder="선택"
                    :items="mixin_common_code_get(this.commonCode, 'T304', '')"
                    v-model="saveParam.HEAD_CD"
                    :rules="validateRules.HEAD"
                />
              </div>
            </div>
          </div>
          <div style=" display: grid; grid-template-columns: repeat(3,1fr); gap: 26px">
            <div class="pl-form-inline">
              <span class="pl-label">
                상담유형
              </span>
              <div class="pl-desc">
                <v-select
                    class="pl-form type-middle"
                    placeholder="선택"
                    :items="mixin_common_code_get(this.commonCode, 'CD', '')"
                    v-model="saveParam.DATA_DIV_CD"
                    :rules="validateRules.CUTT_TYPE"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <!--                 style="gap: 0"-->
                <span class="pl-label">
                전화번호
                </span>
              <div class="pl-desc">
                <v-text-field
                    class="pl-form type-middle"
                    v-model="saveParam.TEL"
                    oninput="javascript: this.value=this.value.replace(/[^-\.0-9]/g,'');"
                    placeholder=""/>
              </div>
            </div>
          </div>
        </div>
        <!-- editor -->
        <crosseditor
            class="is-mt-s"
            name="crosseditor1"
            id="ne-crosseditor-001"
            ref="crossEditor"
            :value="saveParam.DATA_CNTNT"
            editorWidth="759"
            editorHeight="250"
        ></crosseditor>
        <div class="pl-form-inline-wrap vertical type-2 gap-8 is-mt-s">
          <div class="pl-form-inline">
            <span class="pl-label">
              특이 사항
            </span>
            <div class="pl-desc">
              <v-textarea
                  v-model="saveParam.UNUSUAL"
                  class="pl-form is-noresize"
                  placeholder="특이 사항 입력"
              />
            </div>
          </div>
        </div>
        <!-- file -->
        <compo-file-grid
            TitleProp="첨부 파일"
            SmallTitleProp
            :FilesProp="fileList"
            :DisabledProp="mixin_isEmpty(DetailProp.DATA_ID) ? false : DetailProp.RGTR_ID !== user_id"
            :DelData="DEL_FILE"
            @input="DEL_FILE = $event"
            @addFile="clickAddFiles"
            @removeFile="deleteProc"
        >
        </compo-file-grid>
        <input ref="fileUpload" type="file" multiple @change="handleFileUpload($event, 'LHAT02')"
               style="display: none"/>
      </v-form>
    </div>
    <div class="pl-quick-layer-footer">
      <div class="pl-btn-wrap ml-auto">
        <v-btn class="pl-btn"
               @click="beforeSave"
        >{{ action === 'insert'? '저장' : '수정'}}
        </v-btn>
      </div>
    </div>
    <div class="text-center">
      <v-dialog v-if="progressBar" v-model="progressBar" persistent content-class="common-progress-dialog">
        <div class="loader-wrap">
          <div class="lds-roller">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>

        </div>
      </v-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CSM_M1300_DETAIL', //상담자료 상세
  components: {},
  props: {
    DetailProp: {
      type: Object
    },
    CmmnCdProp: {
      type: Array
    }
  },
  data() {
    return {
      date1: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

      filelist_header: [
        {text: '파일명', value: 'filename', align: 'left', sortable: false},
        {text: '크기', value: 'filesize', align: 'left', sortable: false, width: '100px'},
      ],
      validateRules: {
        TITLE: [
          v => !!v || '제목은 필수 입력 항목입니다.',
        ],
        CUTT_TYPE: [
          v => !!v || '내용은 필수 입력 항목입니다.',
        ],
        DIV_CD: [
          v => !!v || '내용은 필수 입력 항목입니다.',
        ],
        HEAD: [
          v => !!v || '내용은 필수 입력 항목입니다.',
        ],
        CNTNT: [
          v => !!v || '내용은 필수 입력 항목입니다.',
        ],
      },

      DEL_FILE: [],
      saveParam: {},
      fileList: [],
      isReg : false,
      commonCode: this.CmmnCdProp,

      action : '',
      progressBar : false


    }
  },
  async created() {
    // console.log("created")
    this.action = this.mixin_isEmpty(this.DetailProp.DATA_ID) ? 'insert' : 'update'
    if( !this.mixin_isEmpty(this.DetailProp) ){
      this.saveParam = {
        DATA_ID: this.DetailProp.DATA_ID,
        DATA_TTL: this.DetailProp.DATA_TTL,
        UNUSUAL: this.mixin_decode(this.DetailProp.UNUSUAL),
        RGTR_ID: this.DetailProp.RGTR_ID,
        RGTR_NM: this.DetailProp.RGTR_NM,
        REG_DT: this.DetailProp.REG_DT,
        MDFR_ID: this.DetailProp.MDFR_ID,
        MDFR_NM: this.DetailProp.MDFR_NM,
        MDFCN_DT: this.DetailProp.MDFCN_DT,
        HEAD_CD: this.DetailProp.HEAD_CD,
        HEAD_NM: this.DetailProp.HEAD_NM,
        DATA_DIV_CD: this.DetailProp.DATA_DIV_CD,
        DATA_DIV_CD_NM: this.DetailProp.DATA_DIV_CD_NM,
        NOTICE_DT: this.mixin_isEmpty(this.DetailProp)? this.$moment(new Date()).format('YYYY-MM-DD'):this.DetailProp.NOTICE_DT,
        CNSLT_DATA_CD: this.DetailProp.CNSLT_DATA_CD,
        CNSLT_DATA_NM: this.DetailProp.CNSLT_DATA_NM,
        TEL: this.DetailProp.TEL,
        CUSTCO_ID: this.DetailProp.CUSTCO_ID,
        // DATA_CNTNT: this.DetailProp.DATA_CNTNT,
        IS_EXIST_FILE : this.DetailProp.IS_EXIST_FILE === 'Y' ? true : false,
        FILE_GROUP_KEY : this.DetailProp.FILE_GROUP_KEY,
      }
      let cn = this.restoreXSS(this.DetailProp.DATA_CNTNT)
      this.isReg = false;
      // console.log("😊 리스토어 크로스사이트스크립팅>> ", cn)
      // this.$refs.crossEditor.update(cn);
      this.saveParam.DATA_CNTNT = cn
      // setValue, update 모두 에러 발생
      // this.$refs.crossEditor.setValue(cn);
    }

    if (this.saveParam.IS_EXIST_FILE && !this.mixin_isEmpty(this.saveParam.FILE_GROUP_KEY)) {
      this.fileList = await this.mixin_getFileList(this.saveParam.FILE_GROUP_KEY);
    }
    // console.log("fileList", this.fileList)
  },
  mounted() {
  },
  methods: {
    beforeSave() {
      if ( !this.validate() ) {
        this.showToastCaution({msg: '필수 항목을 입력해 주세요'})
      } else {
        this.showConfirmInfo({msg: `상담 자료를 ${this.action ==='insert' ? '등록' : '수정'} 하시겠습니까?`, callYes:()=>{
            this.isReg = true;
            this.saveData();
          } , callNo: ()=>{
            this.isReg = false;
            this.closeAlert();
          }})
      }
    },
    async saveData(){
      let postParam = {
        DATA_ID : this.action !== 'insert' ? this.saveParam.DATA_ID : '',
        DATA_TTL : this.saveParam.DATA_TTL,
        UNUSUAL : this.saveParam.UNUSUAL,
        HEAD_CD : this.saveParam.HEAD_CD,
        DATA_DIV_CD : this.saveParam.DATA_DIV_CD,
        ANNOUNCEMENTDAY : this.saveParam.NOTICE_DT ? this.saveParam.NOTICE_DT.replaceAll('-','') : '',
        CSELDIVISION : this.saveParam.CNSLT_DATA_CD,
        TEL : this.saveParam.TEL,
        FILE_GROUP_KEY : this.saveParam.FILE_GROUP_KEY,
        DATA_CNTNT : this.restoreXSS_CKeditorDec(this.$refs.crossEditor.getValue())
      }
console.log("postParam", postParam)
      let headParam = {
        head : {
          ns : 'lhcs.phone.cuttMng.data.dao.PhoneCuttDataMngMapper',
          sn : `${this.action}Data`,
          seq_key : 'DATA_ID'
        }
      }
      let sUrl = `/phone-api/cutt/mng/data/${this.action}/${this.action}Data`;

      // console.log(postParam)
      const response = await this.common_postCall(sUrl, postParam, headParam);
      if( !response.HEADER.ERROR_FLAG) {
        this.showToastInfo({msg : '정상 처리 되었습니다', callAfter : ()=>{
              this.$emit('Close')
              this.closeAlert();
          }})
        this.$eventBus.$emit('refreshCuttData'); //SidePanel.vue
      }
    },
    validate() {
      return this.$refs.form.validate();
    },
    resetValidation() {
      this.$refs.form.reset();
    },
    clickAddFiles() {
      this.$refs.fileUpload.click();
    },

    handleFileUpload(event, taskType) {
      const files = event.target.files;

      //파일 제한 체크 (프론트에서 체크하고 업로드 로직 실행x)
      if (files.length > 0 && this.isValidFiles(files)) {
        // 파일 업로드
        this.uploadFiles(files, taskType);
      }
    },

    //파일개수 제한(파일개수 체크)
    isValidFiles(files) {
      // 파일 개수 제한을 설정
      const maxFileCount = 5;
      if (files.length > maxFileCount) {
        this.showAlertInfo({msg: `최대 ${maxFileCount}건 씩 업로드할 수 있습니다.`});
        return false;
      }

      // 파일 크기 및 형식을 설정 (대소문자 구분)
      const allowedFileTypes = [
        'image/gif','image/jpeg', 'image/png', 'image/jpg', 'image/bmp', 'image/bmp', //GIF, JPG, JPEG, PNG, BMP
        'audio/mpeg', // MP3
        'audio/vnd.wav', // WAV
        'video/mp4', // MP4
        'text/plain', // TXT
        'application/pdf', // PDF
        'application/msword', // DOC
        'application/vnd.ms-excel', // XLS
        'application/vnd.ms-powerpoint', // PPT
        'application/vnd.ms-excel.sheet.macroenabled.12', // XLSM
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
        'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPTX
        'application/vnd.hancom.hwp', 'application/haansofthwp', 'application/x-hwp', // HWP
        'application/vnd.hancom.hwpx', 'application/haansofthwpx', // HWPX
        'application/zip', 'application/x-zip','application/zip-compressed', 'application/x-zip-compressed', // ZIP
      ];
      const maxFileSize = 500 * 1024 * 1024; // 50MB
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!allowedFileTypes.includes(file.type)) {
          this.showAlertCaution({msg:'지원하지 않는 파일 형식입니다.'});
          return false;
        }
        if (file.size > maxFileSize) {
          this.showAlertCaution({msg:'파일 크기가 허용 범위를 초과합니다.'});
          return false;
        }
      }

      return true;
    },

    //파일 업로드
    async uploadFiles(files, taskType) {
      this.progressBar = true;
      let fileGroupKey = '';
    // console.log(this.props.DetailProp.FILE_GROUP_KEY)
      if (!this.mixin_isEmpty(this.DetailProp.FILE_GROUP_KEY)){
        fileGroupKey = this.DetailProp.FILE_GROUP_KEY;
      }else{
        fileGroupKey = await this.mixin_getFileGroupKey();
        this.saveParam.FILE_GROUP_KEY = fileGroupKey;
      }

      const result = await this.mixin_uploadFiles_proc(fileGroupKey, files, taskType, 'files')
      // 상담자료 수정 시 파일 그룹키 없으면 업로드
      if(!this.mixin_isEmpty(this.DetailProp.DATA_ID) && this.mixin_isEmpty(this.DetailProp.FILE_GROUP_KEY)){
        this.updateFileGroupKey(fileGroupKey);
      }
      // 서버로 파일 업로드 요청을 보냅니다.
      this.afterUpload()
      this.progressBar = false;
    },
    async afterUpload(arrError) {
      this.showToastInfo({msg: '정상 처리되었습니다.'})
      this.fileList = await this.mixin_getFileList(this.saveParam.FILE_GROUP_KEY)
    },
    async deleteProc(files) {
      let arrError = []
      await files.FILE_LIST.map(item => {
        try {
          this.deleteFile(item.fileGroupKey, item.fileKey)
          if (arrError.includes(true)) {
            this.showToastCaution({msg: '삭제 중 오류가 발생했습니다.'})
          } else {
            this.showToastInfo({msg: '정상 처리되었습니다.'})
          }
        } catch (e) {
          this.showToastCaution({msg: '삭제 중 오류가 발생했습니다.'})
        }
      })
    },
    async updateFileGroupKey(fileGroupKey){
      let sUrl = '/api/biz/common/update/updateCuttDataFile'
      let postParam = {
        DATA_ID : this.saveParam.DATA_ID,
        FILE_GROUP_KEY : fileGroupKey
      }
      let headParam = {
        head : {
          ns : 'lhcs.phone.cuttMng.data.dao.PhoneCuttDataMngMapper',
          sn : 'updateCuttDataFile'
        }
      }
    },
    // 상담자료 저장전에 파일 업로드하고 나서 닫기버튼을 클릭한 경우 업로드한 파일 삭제
    chkFileUnsave(){
      if(!this.mixin_isEmpty(this.saveParam.FILE_GROUP_KEY) && this.mixin_isEmpty(this.saveParam.DATA_ID) && !this.isReg){
        this.deleteProc({FILE_LIST : this.fileList})
      }
    },
  },
  computed: {},
  watch: {
    "saveParam.FILE_GROUP_KEY":{
      handler(){
        console.log("saveParam.FILE_GROUP_KEY", this.saveParam.FILE_GROUP_KEY)
      }
    }
  },
};
</script>

<style lang="scss" scoped>

</style>