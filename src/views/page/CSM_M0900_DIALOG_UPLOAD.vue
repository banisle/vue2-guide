<template>
  <div>
    <ul class="pl-list-info mt-0 ">
      <li>양식파일을 다운로드 하시고 파일내에 있는 모든 항목들을 채워서 업로드하셔야 정상적으로 등록됩니다.</li>
    </ul>
    <!-- tab -->
    <div class="pl-form-inline-wrap vertical label-80 mt-5">
      <div class="pl-form-inline">
              <span class="pl-label">
                업로드 대상
              </span>
        <div class="pl-desc">
          <v-select
              :items="ARA_HDQ_CD_LIST"
              v-model="uploadTargetHdq"
              class="pl-form type-middle"
          />
        </div>
      </div>
      <div class="pl-form-inline">
              <span class="pl-label">
                엑셀파일등록
              </span>
        <div class="pl-desc">
          <!-- 파일 목록 -->
          <div
              v-if="uploadedFiles.length !== 0"
              class="file-tag-wrap">
            <span class="file-tag">
              {{ uploadFileName }}
            </span>

          </div>
          <!-- 버튼 형식 -->
          <v-btn class="pl-btn is-sub" @click="clickAddFiles">엑셀파일 업로드</v-btn>
          <v-file-input
              v-show="false"
              ref="excelRef"
              @change="[uploadExcel($event, excelHeader), setFileName($event)]"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              counter
              label="엑셀파일을 선택하세요"
              :show-size="1000"
          />
          <v-btn class="pl-btn is-sub flex-grow-0" @click="getSampleExcel">양식파일 다운로드</v-btn>
        </div>
      </div>
    </div>
    <v-tabs class="pl-tabs is-mt-m" >
      <v-tab>상담사 업로드</v-tab>
      <v-tab :disabled="mixin_isEmpty(afterRegItems)">등록된 상담사</v-tab>
      <!-- 상담사 업로드 -->
      <v-tab-item >
    <div class="mt-2">
      <v-data-table
          class="pl-grid is-hover is-mt-s"
          :headers="excelHeader"
          :items="excelItems"
          fixed-header
          :loading="isLoading"
          item-key="ROW_NUMBER"
          height="330px"
          :items-per-page="ROW_PER_PAGE"
          hide-default-footer
          :page.sync="page"
          @page-count="pageCount = $event"
          sort-by="ROW_NUMBER DESC"
          :sort-desc="mixin_isEmpty(afterRegItems) ? false:true"
          no-data-text="등록된 데이터가 없습니다."
      >
      </v-data-table>
      <div class="pl-pager justify-center">
        <v-pagination
            v-model="page"
            :length="pageCount"
            circle
            :total-visible="7">
        </v-pagination>
      </div>
    </div>
      </v-tab-item>
      <v-tab-item>
        <div class="mt-2">
          <v-data-table
              class="pl-grid is-hover is-mt-s"
              :headers="afterRegHeaders"
              :items="afterRegItems"
              fixed-header
              item-key="ROW_NUMBER"
              height="330px"
              :items-per-page="ROW_PER_PAGE"
              hide-default-footer
              :page.sync="page"
              @page-count="pageCount = $event"
              no-data-text="등록된 데이터가 없습니다."
          >
          </v-data-table>
          <div class="pl-pager justify-center">
            <v-pagination
                v-model="page"
                :length="pageCount"
                circle
                :total-visible="7">
            </v-pagination>
          </div>
        </div>
      </v-tab-item>
    </v-tabs>
    </div>
</template>

<script>


export default {
  name: 'CSM_M0900_DIALOG_UPLOAD', //일괄 업로드
  components: {},
  props: {
    DataProp: {
      type: Object,
      default: () => {
        return {}
      }
    },
    RegProp: {
      type: Boolean,
      default: false,
    },
    ClearProp: {
      type: Boolean,
      default: false,
    },


  },
  data() {
    return {
      // 엑셀 파일 등록
      uploadedFiles: [],
      uploadFileName: '',
      ARA_HDQ_CD_LIST: this.DataProp.ARA_HDQ_CD_LIST,
      uploadTargetHdq: this.DataProp.TGT_HDQ_CD,

      isLoading : false,
      // 등록된 상담사
      page: 1,
      pageCount: 0,
      perPage: [15, 30, 50, 100],
      ROW_PER_PAGE: 10,
      headers: [],
      afterRegHeaders: [
        {text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false,},
        {text: '본부명', value: 'ARA_HDQ_NM', align: '', width: '80px', sortable: false,},
        {text: '단지명', value: 'MGOF_NM', sortable: false,},
        {text: '분배상담사', value: 'TGT_USER_NM', align: 'center', width: '80px', sortable: false,},
        {text: '분배일시', value: 'REG_DT', align: 'center', width: '80px', sortable: false,},
        {text: '등록상담사', value: 'REG_USER_NM', align: 'center', width: '80px', sortable: false,},
      ],
      excelHeader: [
        {text: '번호', value: 'ROW_NUMBER', align: 'center', width: '9%', sortable: false,},
        {text: '지역본부번호', value: 'ARA_HDQ_CD', align: '', width: '15%', sortable: false,},
        {text: '단지코드', value: 'MGOF_CD', align: '', width: '15%', sortable: false,},
        {text: '상담사ID', value: 'TGT_USER_ID', align: '', width: '15%', sortable: false,},
      ],
      excelItems: [],
      afterRegItems: [],
      excelTotCnt : 0,
      afterRegTotCnt : 0,



    }
  },
  methods: {
    initGrid() {
      this.excelItems = [];
      this.afterRegItems = [];
      this.uploadedFiles = [];
      this.uploadFileName = '';
      let idx = this.excelHeader.findIndex(item => item.value == 'REASON')
      console.log(this.excelHeader.findIndex(item => item.value == 'REASON'))
      if(idx > -1) {

        console.log("clearHead",this.excelHeader)
        console.log("clearHead")
        this.excelHeader.splice(idx, 1);
        console.log("clearHead",this.excelHeader)
      }
    },
    clickAddFiles() {
      this.$refs.excelRef.$refs.input.value = null;
      this.$refs.excelRef.$refs.input.click();
    },
    setFileName(event) {
      console.log(event)
      console.log(event.name)
      this.uploadFileName = event.name;
      this.uploadedFiles.push(event.File);

    },
    removeFile(ROW_NUMBER) {
      this.uploadedFiles.splice(ROW_NUMBER, 1);
    },
    rowClick() {
      this.mixin_showDialog('DivManager')
    },
    getExcelData(upload_headers, upload_bodys) {
      console.log(upload_headers)
      console.log(upload_bodys)

      this.excelHeader = [];
      this.excelHeader = _.cloneDeep(upload_headers);
      this.excelHeader.unshift({text: '번호', value: 'ROW_NUMBER', align: 'center', width: '9%', sortable: false})

      this.excelItems = _.cloneDeep(upload_bodys);
      //CUST_PHN_NO 값이 들어있는 행만 필터로 가지고 온다.
      this.excelItems = this.excelItems.filter(filterItem => {
        return filterItem.TGT_USER_ID != null && filterItem.TGT_USER_ID != ''
      })

      this.excelItems.forEach((item, index) => {
        item.ROW_NUMBER = index + 1;
      });

      if(this.uploadTargetHdq !== this.excelItems[0].ARA_HDQ_CD) this.uploadTargetHdq = this.excelItems[0].ARA_HDQ_CD.toString()

      this.gridTotalCnt = this.excelItems.length;
    },
    async distMgofImport() {
      this.isLoading = true;
      let postParam = {
        arrDistMgof: this.excelItems.map(row => {
          return {
            ROW_NUMBER: row.ROW_NUMBER,
            ARA_HDQ_CD: row.ARA_HDQ_CD,
            TGT_USER_ID: row.TGT_USER_ID,
            MGOF_CD: row.MGOF_CD
          }
        })
        ,ORG_ARA_HDQ_CD : this.uploadTargetHdq,
      }
      let headParam = {
        head : {
          DATA_OBJECT : 'arrDistMgof'
        }
      }
      const response = await this.common_postCall('/phone-api/cutt/mng/assgn/insertDistMgofImport', postParam, headParam)
      if( !response.HEADER.ERROR_FLAG ){
        this.headers = [];
        this.headers = _.cloneDeep(this.afterRegHeaders);

        response.DATA.map(item=>{
          this.afterRegItems.push({
            ROW_NUMBER: item.ROW_NUMBER,
            REG_DT : this.mixin_convertDate(item.REG_DT, 'yyyy-MM-dd'),
            TGT_USER_NM : item.TGT_USER_NM,
            ARA_HDQ_CD : item.ARA_HDQ_CD,
            TGT_USER_ID : item.TGT_USER_ID,
            REG_USER_NM : item.REG_USER_NM,
            ARA_HDQ_NM : item.ARA_HDQ_NM,
            REG_USER_ID : item.REG_USER_ID,
            MGOF_CD : item.MGOF_CD,
            MGOF_NM : item.MGOF_NM,
          })
        })
        let msg = '업로드 처리 되었습니다'
        if(!this.mixin_isEmpty(response.FAIL_REASON)){
          let i = 0;
          this.excelHeader.push(({text: '업로드 실패 사유', value: 'REASON', align: '', width: '40%', sortable: true}))
          this.excelItems.map((excel)=>{
              response.FAIL_REASON.map((item)=>{
              // if(excel.ARA_HDQ_CD.toString() == item.ARA_HDQ_CD && excel.MGOF_CD === item.MGOF_CD && excel.TGT_USER_ID.toString() === item.TGT_USER_ID){
              if(Number(excel.ROW_NUMBER) === Number(item.ROW_NUMBER)){
                excel.FAIL_YN = true
                excel.REASON = item.REASON;
              }else{
                if(!excel.FAIL_YN) excel.FAIL_YN = false;
              }
            })
          })
         msg = msg + '\n실패 건수 (' + response.FAIL_REASON.length +'/'+  this.excelItems.length + ')'
        }

        this.showAlertInfo({msg : msg})
        this.isLoading = false;
      }else{
        this.showToastInfo({msg : '업로드 중 오류가 발생했습니다.'})
        this.isLoading = false;
      }

    },
    getSampleExcel(){
      let fileUrl = '/web/excel/sched_dist_import_sample.xlsx'
      let fileName = '스케줄러_자동배분관리_업로드_샘플.xlsx'
      this.mixin_common_template_excel_down(fileUrl, fileName);
    }
  },
  mounted() {
    console.log('Component mounted.')
    this.initGrid();
  },
  created() {
  },
  computed: {},
  watch: {
    RegProp() {
      if(this.mixin_isEmpty(this.excelItems) || this.mixin_isEmpty(this.uploadFileName)){
        this.showAlertCaution({msg : '업로드할 파일을 등록 해주세요.'})
      }else{
        this.distMgofImport();
      }
    },
    ClearProp(){
      this.initGrid();
    }
  },
};
</script>

<style lang="scss" scoped>

</style>