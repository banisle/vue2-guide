<template>
  <div class="pt-3 px-5">
    <!-- <compo-file-grid
      TitleProp="첨부 파일"
      SmallTitleProp
      NoMarginProp
      HeightProp="280px"
      :HeadersProp="filelist_header"
      :FilesProp="filelist"
      @addFile="mixin_testLog('add file')"
    @removeFile="mixin_testLog('remove file')"
  >
    </compo-file-grid> -->
    
    <compo-file-grid
      TitleProp="첨부 파일"
      ref="bbsRef"
      :HeadersProp="filelist_header"
      :FilesProp="FORM_DATA.filelist"
      @addFile="clickAddFiles"
      :fileuploadding="mixin_fileuploadding"
      :DelData="DEL_FILE"
      @removeFile="removeFile()"
      HeightProp="280px"
      SmallTitleProp
      NoMarginProp
      :DisabledProp="isFinish"
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
export default {
  name: 'CTM_M0300_TAB_02_DETAIL_TAB_03', //민원상세정보 - 첨부파일
  components: {
  },
  props:{
    CVLCPT_DATA:{
      type:Object
      , default: {}
    },
    isFinish:{
      type: Boolean
      , default: false
    },
    FILE_GROUP_KEY:{
      type: String
      , default: ""
    },
  },
  data() {
    return {
      FORM_DATA:{
        PSTG_BGNG_DT_DD: this.$moment(new Date()).format('YYYY-MM-DD'),
        PSTG_END_DT_DD: '2099-12-31',
        filelist:[],
      },
      fileuploadding:false,
      FILE_KEY:'',              //파일키
      DEL_FILE:[],              //컴포넌트 모달에서 가져온 삭제파일정보
      DEL_FILE_LIST:[],         //삭제파일정보

      
      filelist_header: [
        { text: '파일명', value: 'filename', align: 'left',sortable: false },
        { text: '크기', value: 'filesize', align: 'left',sortable: false , width: '100px'},
        { text: '다운로드', value: 'download', align: 'center',sortable: false, width: '100px' },
      ],
      filelist: [
        {
          filename : '포인트 업종별 적립율 상세 정보.pdf',
          filesize : '1024KB',
        },
        {
          filename : '22포인트 업종별 적립율 상세 정보.pdf',
          filesize : '12024KB',
        },
        {
          filename : '22포인트 업종별 적립율 상세 정보.pdf',
          filesize : '12024KB',
        },
      ],
    }
  },
  methods: {
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

      // console.log( "callbackHandleFileUpload :: aft " , this.FORM_DATA.filelist );
    },
    
    //파일 삭제 클릭
    removeFile(){
      for(let i=0;i<this.DEL_FILE.FILE_LIST.length;i++){
        this.DEL_FILE_LIST.push(this.DEL_FILE.FILE_LIST[i]);
      }
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
          return true;
        }else{
          return false;
        }
      }

      return true;
    },
  },
  async mounted() {
    // console.log(this.FILE_GROUP_KEY)
    if(!this.mixin_isEmpty(this.FILE_GROUP_KEY)) {
      // 파일리스트 조회
      this.FORM_DATA.filelist = await this.mixin_getFileList(this.FILE_GROUP_KEY);
    }
  },
  created() {
  },
  computed: {
  },
  watch: {
    // async FILE_GROUP_KEY(){
    //   console.log(this.FILE_GROUP_KEY)
    //   if(!this.mixin_isEmpty(this.FILE_GROUP_KEY)) {
    //     this.FORM_DATA.filelist = await this.mixin_getFileList(this.FILE_GROUP_KEY);
    //   }
    // }
  },
};
</script>

<style lang="scss" scoped>

</style>