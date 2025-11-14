<template>
  <div class="pl-cols fill-height">
    <!-- grid -->
    <div class="is-vrt">
      <div class="pl-card-body">
        <!-- grid top -->
        <div class="pl-grid-top pt-2">
          <div class="pl-grid-top-left spacing-wrap sp-16 ">
            <v-btn class="pl-btn is-icon is-trans" @click="clickAddFiles">
              <span class="pl-icon20 upload-all"></span>
              일괄 업로드
            </v-btn>
            <v-file-input
                v-show="false"
                ref="excelRef"
                @change="[makeJson($event, excelHeaders)]"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                counter
                label="엑셀파일을 선택하세요"
                :show-size="1000"
            />
            <v-btn class="pl-btn is-icon is-trans"
                   @click="dwnTmpl"
            >
              <span class="pl-icon20 template"></span>
              업로드 템플릿
            </v-btn>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ uploadData.length }})</em> 건</span>
          </div>
        </div>
        <!-- grid -->
        <v-data-table
          class="pl-grid is-mt-s is-hover"
          :headers="headers"
          :items="uploadData"
          :loading="isLoading"
          fixed-header
          item-class="cellClass"
          item-key="index"
          height="calc(-303px + 100vh)"
          :items-per-page="ROW_PER_PAGE"
          hide-default-footer
	        no-data-text="등록된 데이터가 없습니다."
          @dblclick:row="showDetail()"
          :page.sync="page"
          @page-count="pageCount = $event">
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
            :total-visible="7">
          </v-pagination>

          <!-- 더보기 다음 있을때만 노출 -->
          <span class="pl-pager-period">
            보기 {{ mixin_getPagePeriod(uploadData, page) }} / {{ uploadData.length }}
            <compo-tooltip-btn
              TitleProp="다음 검색"
              ClassProp="pl-tooltip-btn is-line"
              IconProp="pl-icon20 arrow-next-paging"
              TooltipPositionProp="bottom"
            ></compo-tooltip-btn>
          </span>
        </div>
      </div>
    </div>
    <!-- 대량 문자 발송 -->
    <div class="is-col-fix d-flex flex-column" style="width: 40%;">
      <div class="pl-card flex-grow-1">
        <h2 class="pl-subtit">대량 문자 발송 내용 </h2>
        <div class="pl-subdesc">
          <p>발송할 문자내용을 확인 하시고 발송 대상자 엑셀파일을 업로드 하여 주십시오.</p>
        </div>
        <!-- 상용구 리스트 -->
        <div>
          <!-- grid top  -->
          <div class="pl-grid-top pt-2">
            <div class="pl-grid-top-left spacing-wrap sp-16 ">
              <strong class="pl-bullet-txt is-blue">상용구 리스트</strong>
            </div>
            <div class="pl-grid-top-utils">
              <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ tmplList.length }})</em> 건</span>
              <!-- 엑셀 다운로드 버튼 -->
<!--              <compo-tooltip-btn-->
<!--                TitleProp="엑셀 다운로드"-->
<!--                ClassProp="pl-tooltip-btn "-->
<!--                IconProp="pl-icon20 exceldown"-->
<!--                TooltipPositionProp="bottom"-->
<!--                @btnClick="mixin_testLog('엑셀 다운로드')"-->
<!--              ></compo-tooltip-btn>-->
            </div>
          </div>
          <!-- grid -->
          <v-data-table
            class="pl-grid is-mt-s is-hover"
            :headers="headers2"
            :items="tmplList"
            fixed-header
            item-key="index"
            height="180px"
            :items-per-page="tmplList. length"
            hide-default-footer
	          no-data-text="등록된 데이터가 없습니다."
            @click:row="setSmsCntnt"
            >
            <template v-slot:item.FAV_YN="{ item }">
              <v-icon
                  class="pl-icon20"
                  :class="item.FAV_YN ? 'favorite-on' : 'favorite'">
              </v-icon>
            </template>
          </v-data-table>
        </div>
        <!-- 발송할 문자 내용 -->
        <div class="is-mt-m">
          <!-- grid top  -->
          <div class="pl-grid-top pt-2">
            <div class="pl-grid-top-left spacing-wrap sp-16 ">
              <strong class="pl-bullet-txt is-blue">발송할 문자 내용 </strong>
            </div>
            <div class="pl-grid-top-utils">

            </div>
          </div>
          <!-- content -->
          <v-textarea
            class="pl-form is-noresize is-mt-s"
            :spellcheck="false"
            height="290"
            v-model="sendParams.cntnt"
          />
          <div class="pl-form-inline-wrap is-mt-s">
            <div class="pl-form-inline">
              <span class="pl-label">
                발신자
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form type-middle"
                  item-text="SMS_SENDER_NO"
                  item-value="SMS_SENDER_NO"
                  v-model="sendParams.outgoingNum"
                  :items="outGoingNumList"
                  :disabled="outGoingNumList.length < 2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- bottom -->
      <div class="pl-card is-border text-right">
        <v-btn class="pl-btn is-icon"
               @click="beforeSendSms"
        >
          <v-icon class="pl-icon20 chat-send-white"></v-icon>
          메시지 보내기
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import CompoSmsLog from '@/components/CompoSmsLog'
import compoExcelUpload from "@/components/CompoExcelUpload.vue";
import XLSX from "xlsx-color";

export default {
  name: 'CSL_M0601_TAB_02', // 문자 대량 발송
  components: {
    compoExcelUpload,
    CompoSmsLog,
  },
  data() {
    return {
      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 20,
      headers: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '수신 번호', value: 'MOBILE', align: 'left', width: '17%',sortable: true },
        { text: '수신자', value: 'TARGET_CUST_NM', align: 'left', width: '13%',sortable: false },
        { text: '비고', value: 'ETC', align: 'left', width: '', sortable: false },
      ],
      excelHeaders: [
        { text: '수신 번호', value: 'MOBILE', align: 'left', width: '150px',sortable: true },
        { text: '수신자', value: 'TARGET_CUST_NM', align: 'left', width: '150px',sortable: false },
        { text: '비고', value: 'ETC', align: 'left', width: '150px', sortable: false },
      ],
      uploadData: [],
      headers2: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '구분', value: 'TMPL_SE_NM', align: 'left', width: '10%',sortable: false },
        { text: '대상', value: 'TARGET_NM', align: 'left', width: '15%',sortable: false },
        { text: '메시지 유형', value: 'TYPE_CD_NM', align: 'left', width: '15%', sortable: false },
        { text: '상용구 제목', value: 'TTL', align: 'left', width: '', sortable: false },
        { text: '⭐', value: 'FAV_YN', align: 'center', width: '7%', sortable: false },
      ],
      tmplList: [],
      dialogShowProp : false,
      isLoading : false,

      // 발송할 문자 내용
      outGoingNumList: [],
      sendParams : {
        targetNum : '',
        outgoingNum : '',
        cntnt : '',
        ttl: '',
        msgType: '',
        tmplContentsId: '',
        trgtType: '',
        trgtDept: '',
        tmplCd: '',
      },

    }
  },
  created() {
    this.getOutNumFromConf()
    this.getSmsTmplList()
  },
  mounted() {
  },
  methods: {
    dwnTmpl(){
      this.mixin_common_exportExcelHeader(this.excelHeaders, 'SMS_대량발송_업로드_템플릿', 'sheet', 'F8FAFC');
    },
    showDetail(){
      this.dialogSmsDetail = true
    },
    setSmsCntnt(item){
      this.sendParams.cntnt = item.CNTNT
    },
    async getOutNumFromConf(){
      let postParam = {
        IS_UNIQUE : 'N',
        KEY : 'SMS_SENDER_NO'
      }
      let headParam = {
        head : {
          ns: 'lhcs.system.conf.dao.confMngMapper',
          sn: 'selectConf'
        }
      }
      const response = await this.common_postCall('/api/biz/common/select/selectConf', postParam, headParam)
      if( !response.HEADER.ERROR_FLAG){
        response.DATA.map(item=>{
          this.outGoingNumList.push({
            SMS_SENDER_NO : String(item.VAL).slice(0, 4) + '-' + String(item.VAL).slice(4)
          })
        })
        this.sendParams.outgoingNum = this.outGoingNumList[0]["SMS_SENDER_NO"]
      }
    },
    async getSmsTmplList(){
      this.tmplList = [];
      let sUrl = '/api/biz/common/select/selectSmsTmplList'
      let postParam = {
        SRCH_TMPL_SE_CD : 'S',
        // SRCH_TYPE_CD : this.srchParams.srchMsgType,
        SRCH_DEPT_ID : this.computedUserDetailType === 'MANAGER' ? this.computedUserDeptId : '',
      }
      let headParam = {
        head : {
          ns : 'lhcs.system.sms.dao.SmsTmplMngMapper',
          sn : 'selectSmsTmplList'
        }
      }
      const response = await this.common_postCall(sUrl,postParam, headParam)
      if( !response.HEADER.ERROR_FLAG ){
        response.DATA.map(item=>{
          item.TMPL_SE_NM = item.DATA_FLAG =='S' ? '문자' : '이메일';
          item.TTL = this.mixin_decode(item.TTL);
          item.FAV_YN = item.FAV_YN == 'N' ? false : true
          item.CNTNT = this.mixin_decode(item.CNTNT);
          this.tmplList.push(item)
        })
      }
    },
    clickAddFiles() {
      this.$refs.excelRef.$refs.input.value = null;
      this.$refs.excelRef.$refs.input.click();
      this.sendParams.cntnt = '';
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
      this.uploadData = _.cloneDeep(upload_bodys);
    },
    beforeSendSms(){
      if(this.mixin_isEmpty(this.uploadData)){
        this.showAlertCaution({msg : '발송 대상자를 업로드 하세요.'})
      }else if(this.mixin_isEmpty(this.sendParams.cntnt)){
        this.showAlertCaution({msg : '발송할 문자 내용을 입력하세요.'})
      }else if(this.mixin_isEmpty(this.sendParams.outgoingNum)){
        this.showAlertCaution({msg : '발신 번호를 선택하세요.'})
      }else{
        this.showConfirmInfo({msg : `${this.uploadData[0].TARGET_CUST_NM} 외 ${this.uploadData.length-1}명에게 \n SMS를 발송 하시겠습니까?`
          , callYes : ()=>{
            this.upload();
            this.closeAlert();
          }
          , callNo : this.closeAlert
        })

      }
    },
    async upload(){
      this.isLoading = true;
      let sUrl = '/api/common/sendSms'
      let postParam = {
        CMD : 'sendBulkSms'
        , SMS_CNTNT_TXT : this.sendParams.cntnt
        , DSPTCH_NO : this.sendParams.outgoingNum.replaceAll('-','') //발신번호
        , ACCOUNT_ID : this.$store.getters['userStore/GE_USER_ROLE'].userId //발신자ID
        , ACCOUNT_NAME : this.$store.getters['userStore/GE_USER_ROLE'].userName //발신자명
        , smsSendCustList : this.uploadData
      }
      let headParam = {
        head : {
          DATA_OBJECT : 'smsSendCustList'
        }
        , timeout : 3600000
      }
      const response = await this.common_postCall(sUrl,postParam,headParam)
      if(!response.HEADER.ERROR_FLAG){
        response.failedData.map(item=>{
          this.uploadData.map(obj =>{
            if(Number(obj.ROW_NUMBER) === Number(item.ROW_NUMBER)){
              // obj.cellClass = 'is-bg-red'
              obj.ETC = item.REASON
            }
          })
        })
        this.showAlertInfo({msg : '대량 SMS발송에 성공했습니다.', callAfter : ()=>{
            this.closeAlert();
          }})
      }else{
        this.showAlertCaution({msg : '처리중 문제가 발생했습니다.'})
        this.isLoading = false;
      }
      this.isLoading = false;
    },
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>