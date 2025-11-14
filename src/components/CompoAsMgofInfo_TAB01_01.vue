<template>
  <div>
    <table class="pl-tbl-detail">
      <colgroup>
        <col width="127px" />
        <col width="" />
        <col width="127px" />
        <col width="250px" />
      </colgroup>
      <tbody>
        <tr>
          <th scope="row">
            <span class="pl-label">
              현장 단지명
            </span>
          </th>
          <td >
            <v-text-field
              v-model="MGOF_INFO.FIELD_MGOF_NM"
              class="pl-form is-auto"
              :disabled="computedUserDetailType === 'MANAGER'"
              placeholder="" />
          </td>
          <th scope="row">
            <span class="pl-label">
              등록자
            </span>
          </th>
          <td >
            <span class="pl-value-txt">{{ MGOF_INFO.UPD_EMP_NM }} ({{ MGOF_INFO.UPD_DT }}) </span>
          </td>
        </tr>
        <tr>
          <th scope="row">
            <span class="pl-label">
              특이사항
            </span>
          </th>
          <td colspan="3" class="has-textarea">
            <v-textarea
              v-model="MGOF_INFO.MGOF_MEMO"
              :disabled="computedUserDetailType === 'MANAGER'"
              class="pl-form"
              :spellcheck="false"
              auto-grow
            />
<!--              height="130"-->
          </td>
        </tr>
      </tbody>
    </table>
    <!-- file grid -->
    <compo-file-grid
        SmallTitleProp
        TitleProp="첨부 파일"
        :FilesProp="FILE_LIST"
        :DisabledProp="mixin_isEmpty(this.MGOF_INFO.UDP_DT) && computedUserDetailType ==='MANAGER'"
        :DelData="DEL_FILE"
        @addFile="clickAddFiles"
        @removeFile="deleteProc"
    >
      <template slot="infotext">
        <ul class="pl-list-info">
          <li>첨부 파일은 <strong>최대 50MB</strong>이며, 업로드 가능한 파일은 “pdf, hwp, hwpx, MS Office, PNG, JPG, JPEG, Zip” 입니다.</li>
        </ul>
      </template>
    </compo-file-grid>
    <v-file-input
        style="display: none"
        ref="fileUpload"
        @change="handleFileUpload"
        multiple
        label="파일을 선택하세요"
    />

    <!-- 데일리 정보 -->
    <div class="pl-header is-no-boredr is-mt-l">
      <v-icon class="pl-icon20 square-title" style="margin-top: 2px;"></v-icon>
      <div class="pl-subtit ml-1">데일리 정보</div>
    </div>
    <div
      v-if="DAILY_INFO && DAILY_INFO.PST_ID"
        class="pl-rounded-box pa-3 is-mt-s rounded-0 pl-scroll-body"
      style=" height: 110px; "
      v-html="restoreXSS_CrossEditor(DAILY_INFO.PST_CN)"
    >
    </div>
    <compo-file-grid
        SmallTitleProp
        :HeaderButtonProp="false"
        TitleProp="첨부 파일"
        :FilesProp="DAILY_INFO_FILE_LIST"
    >
    </compo-file-grid>

  </div>
</template>

<script>
export default {
  name: 'CompoAsMgofInfo_TAB01_01', //단지 특이사항
  components: {
  },
  props: {
    TabProp: {
      type: Number,
      default: null,
    },
    DataProp: {
      type: Object,
      default: () => {
        return {}
      }
    },
    SaveRequestProp: {
      type: String,
      default: "N",
    }
  },
  data() {
    return {
      MGOF_CD: '',
      MGOF_INFO: {},
      FILE_LIST : [],
      DEL_FILE : [],

      noMsg: "특이사항 이력이 없습니다.",
      
      // file
      DAILY_INFO: {},
      DAILY_INFO_FILE_LIST: [],
      MESSAGE : {
        CONFIRM : {
          REG : {alertDialogToggle: true, msg: '저장하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.mgofSave, callNo: this.mgofSaveComplete}
        },
      }

    }
  },
  mounted() {
  },
  created() {
    console.log("CompoAsMgofInfo_TAB01_01 created", this.DataProp)
    this.MGOF_CD = this.DataProp && this.DataProp.MGOF_CD ? this.DataProp.MGOF_CD : '';  //단지코드
    if(this.MGOF_CD != '') {
      this.getMgofMemo();
    }
    this.getDailyInfo();
  },
  computed: {
  },
  watch: {
    SaveRequestProp() {
      if(this.SaveRequestProp == "Y") {
        this.btnSave();
      }
    }
  },
  methods: {
    //단지정보 - 특이사항 조회
    async getMgofMemo() {
        const postParam = {
            MGOF_CD: this.MGOF_CD
        };
        const headParam = {head: {
          ns: 'lhcs.phone.as.dao.PhoneAsCommonMapper'
        }};
        const response = await this.common_postCall("/api/biz/common/select/selectMgofMemo", postParam, headParam);
        if(!response.HEADER.ERROR_FLAG) {
          console.log("getMgofMemo", response.DATA[0])
          this.MGOF_INFO = response.DATA[0];
          if(!this.mixin_isEmpty(this.MGOF_INFO.FILE_GROUP_KEY)){
            this.getMgofMemoFiles(this.MGOF_INFO.FILE_GROUP_KEY)
          }
        }
    },
    async getMgofMemoFiles(FILE_GROUP_KEY) {
      const response = await this.mixin_getFileList(FILE_GROUP_KEY);
      if (!this.mixin_isEmpty(response)) {
        response.map((item) => {
          if (item.TASK_TYPE_CD == 'LHAT05') {
            this.FILE_LIST.push({
              filename: item.ACTL_FILE_NM,
              filesize: this.mixin_isEmpty(item.FILE_SZ) ? '0' : this.mixin_format_bytes(item.FILE_SZ),
              download: item.FILE_PATH,
              count: this.mixin_isEmpty(item.DWNLD_CNT) ? 0 : item.DWNLD_CNT,
              busiType: item.TASK_TYPE_CD,
              pathType: item.PATH_TYPE_CD,
              fileGroupKey: item.FILE_GROUP_KEY,
              fileKey: item.FILE_KEY,
              STRG_FILE_NM: item.STRG_FILE_NM,
              FILE_PATH: item.FILE_PATH,
              FILE_EXTN: item.FILE_EXTN,
              FILE_URL: item.FILE_URL,
            })
          }
        });
      }
    },

    
    async getDailyInfo() {
      const postParam = {};
      const headParam = {};
      const response = await this.common_postCall("/phone-api/as/common/selectDailyInfo", postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        console.log("getDailyInfo", response.DATA[0])
        this.DAILY_INFO = response.DATA[0];
        if(this.DAILY_INFO.FILE_GROUP_KEY) {
          this.getDailyInfoFiles(this.DAILY_INFO.FILE_GROUP_KEY);
        }
      }
    },

    async getDailyInfoFiles(FILE_GROUP_KEY) {
      const response = await this.mixin_getFileList(FILE_GROUP_KEY);
      if (!this.mixin_isEmpty(response)) {
        response.map((item) => {
          this.DAILY_INFO_FILE_LIST.push({
            filename: item.ACTL_FILE_NM,
            filesize: this.mixin_isEmpty(item.FILE_SZ) ? '0' : this.mixin_format_bytes(item.FILE_SZ),
            download: item.FILE_PATH,
            count: this.mixin_isEmpty(item.DWNLD_CNT) ? 0 : item.DWNLD_CNT,
            busiType: item.TASK_TYPE_CD,
            pathType: item.PATH_TYPE_CD,
            fileGroupKey: item.FILE_GROUP_KEY,
            fileKey: item.FILE_KEY,
            STRG_FILE_NM: item.STRG_FILE_NM,
            FILE_PATH: item.FILE_PATH,
            FILE_EXTN: item.FILE_EXTN,
            FILE_URL: item.FILE_URL,
          })
        });
      }
    },

    //부모 컴포넌트에서 저장 버튼 클릭함.
    btnSave() {
      this.showAlert(this.MESSAGE.CONFIRM.REG);
    },

    //TODO:: 첨부파일 저장은 방안 결정 후 by hjh. 2024.10.23
    async mgofSave() {

      let postParam = {
        MGOF_CD : this.MGOF_INFO.MGOF_CD,
        MGOF_MEMO : this.MGOF_INFO.MGOF_MEMO,
        FIELD_MGOF_NM : this.MGOF_INFO.FIELD_MGOF_NM,
        FILE_GROUP_KEY : this.MGOF_INFO.FILE_GROUP_KEY,
        //FILE_NMS : this.FILE_NMS,
        //FILE_PATHS : this.FILE_PATHS,
        //FILE_SIZES : this.FILE_SIZES,
        //EXT_NMS : this.EXT_NMS,
        //USER_FILE_NMS : this.USER_FILE_NMS,
        UPDATE_YN : this.MGOF_INFO.UPD_DT && this.MGOF_INFO.UPD_DT != "" ? "Y" : "N"
      }

      let headParam = {head : {}}

      let response  = await this.common_postCall('/phone-api/as/common/mergeMgofInfo', postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        

        this.mgofSaveComplete();
      }

    },

    mgofSaveComplete() {
      this.$emit("saveComplete");
      this.closeMsg();
    },

    //메시지창 종료
    closeMsg(){
      this.$store.commit('alertStore/hideAlert');
    },

    clickAddFiles() {
      this.$refs.fileUpload.$refs.input.value = null;
      this.$refs.fileUpload.$refs.input.click()
    },
    async handleFileUpload( files ) {
      await
          this.mixin_handleFileUpload(
              files,
              {fileGroupKey : this.MGOF_INFO.FILE_GROUP_KEY ,busiType: 'LHAT05', pathType: 'files', maxFileCount: 3, maxFileSize: 50 * 1024 * 1024},
              this.callbackHandleFileUpload
          );
    },
    async callbackHandleFileUpload(resultObj) {
      this.MGOF_INFO.FILE_GROUP_KEY = resultObj.display[0].fileGroupKey
      this.mgofSave();
    },

    async deleteProc(files) {
      console.log(files)
      let arrError = []
      await files.FILE_LIST.map(item => {
        try {
          this.deleteFile(item.fileGroupKey, item.fileKey)
        } catch (e) {
          this.showToastCaution({msg: '삭제 중 오류가 발생했습니다.'})
        }
      })
      if (arrError.includes(true)) {
        this.showToastCaution({msg: '삭제 중 오류가 발생했습니다.'})
      } else {
        this.showToastInfo({msg: '정상 처리되었습니다.'})
        // this.getFloorplanFiles();
      }
    },

  },
};
</script>

<style lang="scss" scoped>

</style>