<template>
  <!-- 엑셀 파일을 받아 첫번째 시트의 내용을 HeaderProp의 내용과 일치하는 열을 KEY, VALUE의 JSON Array로 리턴합니다. -->
<!--  <div class="pl-form-inline">-->
<!--              <span class="pl-label">-->
<!--                {{ TextProp }}-->
<!--              </span>-->
<!--    <div class="pl-desc">-->
<!--      &lt;!&ndash; 파일 목록 &ndash;&gt;-->
<!--      <div-->
<!--          v-if="uploadedFiles.length !== 0"-->
<!--          class="file-tag-wrap">-->
<!--            <span class="file-tag">-->
<!--              {{ uploadFileName }}-->
<!--            </span>-->
<!--      </div>-->
<!--      &lt;!&ndash; 버튼 형식 &ndash;&gt;-->
<!--      <v-btn class="pl-btn is-sub" @click="clickAddFiles">엑셀파일 업로드</v-btn>-->
<!--      <v-file-input-->
<!--          v-show="false"-->
<!--          ref="excelRef"-->
<!--          @change="[makeJson($event, HeaderProp), setFileName($event)]"-->
<!--          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"-->
<!--          counter-->
<!--          label="엑셀파일을 선택하세요"-->
<!--          :show-size="1000"-->
<!--      />-->
<!--      <v-btn class="pl-btn is-sub flex-grow-0" @click="">양식파일 다운로드</v-btn>-->
<!--    </div>-->
<!--  </div>-->
  <v-dialog v-model="ShowProp" content-class="dialog-draggable is-lg" hide-overlay>
    <div class="draggable-area">drag area</div>
    <compo-dialog :header-title="TextProp" @hide="$emit('closeCompo')">
      <template slot="body">
        <div class="pl-form-inline-wrap">
          <div class="pl-form-inline">
            <span class="pl-label">
              {{ TextProp }}
            </span>
            <div class="pl-desc">
              <!-- 파일 목록 -->
              <div class="file-tag-wrap">
                <span class="file-tag">{{ uploadFileName ? uploadFileName : '업로드할 파일을 선택해주세요.' }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 버튼 형식 -->
        <div class="spacing-wrap sp-4">
          <v-btn
            class="pl-btn is-sub ml-auto"
            @click="clickAddFiles">엑셀파일업로드</v-btn>
          <v-file-input
            v-show="false"
            ref="excelRef"
            @change="[makeJson($event, HeaderProp), setFileName($event)]"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            counter
            label="엑셀파일을 선택하세요"
            :show-size="1000"
            />
          <v-btn class="pl-btn is-sub flex-grow-0" @click="downloadFile">양식파일 다운로드</v-btn>
        </div>
        <div >
          <template v-if="!mixin_isEmpty(excelItems)">
            <v-data-table
              class="pl-grid is-mt-s"
              :headers="excelHeader"
              :items="excelItems"
              :item-key="excelHeader[0].value"
              fixed-header
              height="300px"
              :row.sync="index"
              :item-class="isActiveRow"
              :sort-by="mixin_isEmpty(excelItems) ? 'ROW_NUMBER':'REASON desc'"
              :items-per-page="ROW_PER_PAGE"
              hide-default-footer
              :loading="isLoading"
              no-data-text="등록된 데이터가 없습니다."
              :page.sync="page"
              @page-count="pageCount = $event"
              >
            </v-data-table>
            <div class="pl-pager">
              <div class="pl-pager-row">
                <span>페이지당 항목 수</span>
                <v-select
                    class="pl-form"
                    :value="ROW_PER_PAGE"
                    :items="perPage"
                    :item-text="toString(ROW_PER_PAGE)"
                    @change="ROW_PER_PAGE = parseInt($event, 10);"
                ></v-select>
              </div>
              <v-pagination
                  v-model="page"
                  :length="pageCount"
                  circle
                  :total-visible="11">
              </v-pagination>
              <!-- 더보기 다음 있을때만 노출 -->
              <span class="pl-pager-period">보기 {{ mixin_getPagePeriod(excelItems, page) }} / {{ excelItems.length }}</span>
            </div>
          </template>
          <template v-else>
            <v-data-table
              class="pl-grid is-mt-s"
              :headers="excelHeader"
              :items="excelItems"
              fixed-header
              height="300px"
              :items-per-page="excelItems.length"
              hide-default-footer
              no-data-text="등록된 데이터가 없습니다."
              >
            </v-data-table>
          </template>
        </div>
      </template>
      <template slot="footer">
        <span v-if="isLoading">{{ progressMsg }}</span>
        <v-btn class="pl-btn"
               :disabled="isLoading"
               @click="$emit('upload', {FILE_NM : uploadFileName, DATA : excelItems})">업로드</v-btn>
        <v-btn class="pl-btn is-sub" @click="$emit('closeCompo')">닫기</v-btn>
      </template>
    </compo-dialog>
  </v-dialog>
</template>

<script>
import XLSX from "xlsx-color";

export default {
  name: "CompoExcelUpload",
  props: {
    ShowProp: {
      type: Boolean,
      default: false,
    },
    TextProp: {
      type: String,
      default: "엑셀파일등록",
    },
    HeaderProp: {
      type: Array,
      default: () => {
        return []
      }
    },
    SampleProp : {
      type : Object,
      default : ()=>{
        return {}
      }
    }
  },
  data() {
    return {
      index: 0,
      isLoading: false,
      progressMsg: '',
      uploadedFiles: [],
      uploadFileName: '',
      excelHeader : [],
      excelItems : [],
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 15,
    }
  },
  computed: {

  },
  created(){
    this.$eventBus.$on("UPLOAD_EXCEL", (msg)=>{
     if(msg.STATUS === 'PRCS'){
       if(msg.ERR_FLAG){
         if(this.excelHeader.findIndex(header=> header.value == "REASON") < 0) this.excelHeader.push({ text: '실패사유', value: 'REASON', align: 'center', width: '20%' , sortable: false},)
         this.excelItems.find(item=>{
           this.index = item.ROW_NUMBER;
           if(item.ROW_NUMBER == msg.ROW_NUMBER){
             item.REASON = msg.REASON;
           }
         })
       }
       this.progressMsg = msg.MSG + `( 전체 ${this.mixin_convertNumToComma(msg.TOT_CNT)}건 중 ${this.mixin_convertNumToComma(msg.PRGS_CNT)}건 성공 / ${this.mixin_convertNumToComma(msg.ERR_CNT)}건 실패 )`
      }else if(msg.STATUS === 'START' || msg.STATUS === 'END'){
       this.isLoading = !this.isLoading
       if(msg.STATUS === 'END'){
         this.showToastInfo({msg : '작업이 완료되었습니다.'})
       }
     }
    })
  },
  mounted() {
  },
  methods: {
    isActiveRow(item) {
      const activeClass = item.ROW_NUMBER === this.index ? "focused-row" : "";
      return activeClass;
    },
    setFileName(event) {
      this.uploadFileName = event.name;
    },
    clickAddFiles() {
      this.$refs.excelRef.$refs.input.value = null;
      this.$refs.excelRef.$refs.input.click();
    },
    makeJson(file, tempGridHeaders) {
      this.page = 1;
      this.pageCount = 0;

      let upload_bodys = [];
      if(!file === true){ return false}
      const fileName = file.name;
      const reader = new FileReader();

      reader.onload = (e) => {
        var buffer = reader.result;
        var data = new Uint8Array(buffer);
        var arr = new Array();
        for (var i = 0; i != data.length; ++i)
          arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, {
          type: "binary",
          cellDates: true,
        });
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        var oData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
        let getData = [];
        let oHeaders = _.cloneDeep(tempGridHeaders);
        // oHeaders.splice(0, 1);
        oHeaders.unshift({ text: '번호', value: 'ROW_NUMBER', align: 'center', width: '70px', sortable: false },)
        //엑셀에 빈값이 있는경우 빈값을 셋팅한다.(빈값은 엑셀라이브러리에서 빠져버림.)
        let rowCnt = 1;
        oData.forEach(e => {
          let o = {};
          oHeaders.forEach(v => {
            o[v.text] = (this.mixin_isEmpty(e[v.text]) ? '' : e[v.text]);
          });
          getData.push(o);
        });

        if (getData.length > 0) {
          getData.map(v => {
            let map = {}
            oHeaders.forEach((j,i) => {
              if(j.text === Object.keys(v)[i]){
                map[j.value] = v[Object.keys(v)[i]]
              }
            })
            map["ROW_NUMBER"] = rowCnt++;
            upload_bodys.push(map)
          })
        }
        this.getExcelData(oHeaders, upload_bodys);
      };
      reader.readAsArrayBuffer(file);
    },
    getExcelData(upload_headers, upload_bodys) {
      console.log(upload_headers)
      console.log(upload_bodys)

      this.excelHeader = _.cloneDeep(upload_headers);
      this.excelItems = _.cloneDeep(upload_bodys);
    },
    beforeEmit(){
      this.showConfirmInfo({msg : '해당 엑셀 파일을 등록하시겠습니까?', callYes: ()=>{
          this.$emit('upload', this.excelItems);
          this.$emit('closeCompo');
          this.closeAlert();
        },
        callNo: this.closeAlert
      })
    },
    downloadFile() {
      let fileUrl = this.SampleProp.FILE_URL; // 파일의 URL을 설정합니다.
      let fileName = this.SampleProp.FILE_NM; // 다운로드될 파일의 이름을 설정합니다.
      this.mixin_common_template_excel_down(fileUrl, fileName);
    },
  },
  watch:{
    ShowProp(){
      if(!this.isLoading){
        this.excelItems=[]
        this.uploadFileName = '';
        this.page=0;

      }
    },
  },
  beforeDestroy() {
    this.$eventBus.$off("UPLOAD_EXCEL");
  },
};
</script>

<style>
.v-overlay__scrim {
  /* opacity: 0 !important; */
}
</style>
