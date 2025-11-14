<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top>
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                조회기간
              </span>
              <div class="pl-desc">
                <compo-date-range-picker
                    :StartDayProp.sync="srchParam.srchStartDt"
                    :EndDayProp.sync="srchParam.srchEndDt"
                    :IsViewDropPickerProp="false"
                    :selectTermProp="true"
                    @startDayChange="()=>{ }"
                    @endDayChange="()=>{ }"
                    ParentStyleProp="width: 370px"
                />
              </div>
            </div>

            <div class="pl-form-inline">
              <span class="pl-label">
                접수채널
              </span>
              <div class="pl-desc">
                <v-select
                    class="pl-form type-middle is-md"
                    :items="common_rcv_chn_list"
                    v-model="srchParam.srchRcptChnCd"
                    placeholder="전체"
                ></v-select>
              </div>
            </div>

            <div class="pl-form-inline">
              <span class="pl-label">
                상담유형
              </span>
              <div class="pl-desc">
                <compo-cutt-type-combo
                    :FormSeProp="'SRCH'"
                    :CustcoProp="mixin_isEmpty(srchParam.srchCustcoId)? computedUserCenter : srchParam.srchCustcoId"
                    :DisabledProp="false"
                    @EMIT_CUTT_TYPE="setCuttType"
                />
              </div>
            </div>


          </div>
          <div class="pl-form-inline-wrap is-mt-s" style="width: 100%">
            <div class="pl-form-inline">
              <span class="pl-label" style="width: 64px">
                센터
              </span>
              <div class="pl-desc">
                <v-select
                    class="pl-form type-middle"
                    placeholder="전체"
                    :items="custcoList"
                    v-model="selectedCustcoItem"
                    return-object
                    :disabled="computedUserCenter < 0 ? false : true"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label" style="width: 48px">
                부서
              </span>
              <div class="pl-desc">
                <v-select
                    v-model="selectedDeptItem"
                    class="pl-form type-middle"
                    :items="mixin_ognz_list_detail(common_ognz_list, selectedCustcoItem.DEPT_ID, '전체' ,'Y'/*콜센터여부,없으면전체*/)"
                    return-object
                    item-value="DEPT_ID"
                    placeholder="전체"
                    :disabled="mixin_isEmpty(selectedCustcoItem)?true:false"
                ></v-select>
              </div>
            </div>

            <div class="pl-form-inline">
              <span class="pl-label">
                상담지역
              </span>
              <compo-cutt-zone-combo
                  :FormSeProp="'SRCH'"
                  :ClearProp="clearProp"
                  @EMIT_CUTT_ZONE="setCuttZone"
              />
            </div>

            <div class="pl-form-inline">
              <span class="pl-label">
                상담메모
              </span>
              <div class="pl-desc">
                <v-text-field
                    class="pl-form type-middle"
                    style="width: 380px; flex: 0 0 380px"
                    v-model="srchParam.srchCuttCn"
                ></v-text-field>
                <v-checkbox
                    class="pl-check ml-auto"
                    label="배려고객"
                    v-model="srchParam.srchBlackYn"
                    :input-value=false
                ></v-checkbox>
              </div>
            </div>

            <div>
              <v-btn
                  class="pl-btn is-icon"
                  @click="getStatsCustList(false)"
              >
                <span class="pl-icon20 search"></span>
                조회
              </v-btn>
            </div>

          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-card-body">
        <!-- grid top -->
        <div class="pl-grid-top pt-2">
          <div class="pl-grid-top-left spacing-wrap sp-16 ">
            <ul class="pl-list-info mt-0">
              <li>
                <strong>사용방법!</strong> 최대 1년을 초과하여 조회하지 않도록 해주세요.
                <strong class="ml-2">주의!</strong> 엑셀다운로드 시 시스템 부하를 최소화 하기 위해 최소한의 자원으로 생성하므로 다소 시간이 오래 걸릴 수 있으니 기다리시면 안정적으로 다운로드 할 수 있습니다.
              </li>
            </ul>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1">({{ mixin_convertNumToComma(totCnt) }})</em> 건</span>
            <!-- 엑셀 다운로드 버튼 -->
<!--            <compo-excel-->
<!--                TypeProp="Download"-->
<!--                :DataHeaderProp="headersExcel"-->
<!--                :DataBodyProp="itemsRowSpan"-->
<!--                :FileNameProp="`지역_및_상담유형_고객현황_${srchParam.srchStartDt.replaceAll('-','')}_${srchParam.srchEndDt.replaceAll('-','')}`"-->
<!--                SheetNameProp="지역_및_상담유형_고객현황"-->
<!--                :DisabledProp="mixin_isEmpty(itemsRowSpan)"-->
<!--            />-->
            <compo-tooltip-btn
                TitleProp="엑셀 다운로드"
                ClassProp="pl-tooltip-btn "
                IconProp="pl-icon20 exceldown"
                TooltipPositionProp="bottom"
                :DisabledProp="mixin_isEmpty(itemsRowSpan)"
                @btnClick="()=>{showConfirmInfo({msg : '엑셀을 다운로드 하시겠습니까?'
                  ,callYes : ()=>{
                  this.downloadExcel()
                  this.closeAlert()
                  }
                  , callNo : this.closeAlert
                })}"
            ></compo-tooltip-btn>
          </div>
        </div>
        <!-- grid -->
        <v-data-table
          class="pl-grid is-mt-s is-hover"
          :headers="headers"
          :items="itemsRowSpan"
          fixed-header
          item-key="index"
          height="598px"
          :items-per-page="ROW_PER_PAGE"
          :loading="isLoading"
          hide-default-footer
	        no-data-text="등록된 데이터가 없습니다."
          :page.sync="page"
          @page-count="pageCount = $event">
          <template v-slot:item.CUTT_CN="{ item }">
            <p style="white-space: pre-line;" class="py-1">
              {{ item.CUTT_CN }}
            </p>
          </template>
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
            보기 {{ mixin_getPagePeriod(itemsRowSpan, page) }} / {{ itemsRowSpan.length }}
            <compo-tooltip-btn
              TitleProp="다음 검색"
              ClassProp="pl-tooltip-btn is-line"
              IconProp="pl-icon20 arrow-next-paging"
              TooltipPositionProp="bottom"
              @btnClick="getStatsCustList(true)"
              :DisabledProp="pagination.nextDisabled"
            ></compo-tooltip-btn>
          </span>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import CompoCuttZoneCombo from "@/components/CompoCuttZoneCombo.vue";
import CompoCuttTypeCombo from "@/components/CompoCuttTypeCombo.vue";
export default {
  name: 'MENU_STA_M0700', //지역 및 상담유형별 고객현황
  components: {
    CompoCuttZoneCombo,
    CompoCuttTypeCombo
  },
  data() {
    return {
      date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      date3: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      modelPickerDate: '당일',
      itemsPickerDate: [
        '지정일',
        '당일',
        '전일',
        '일주일전',
        '전월',
        '전분기',
        '전년',
      ],

      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 30,
      pagination : {
        ROW_CNT : 500
        , PAGES_CNT : 0
        , nextDisabled : false
      },
      headers: [
        { text: '대분류', value: 'L_CUTT_TYPE_NM', align: '', width: '10%', sortable: false },
        { text: '중분류', value: 'M_CUTT_TYPE_NM', align: '', width: '10%', sortable: false },
        { text: '소분류', value: 'S_CUTT_TYPE_NM', align: '', width: '14%', sortable: false },
        { text: '상담메모', value: 'CUTT_CN', align: '', width: '', sortable: false },
        { text: '고객명', value: 'CUST_NM', align: 'center', width: '10%', sortable: false },
        { text: '핸드폰번호', value: 'CUST_PHN_NO', align: 'center', width: '7%', sortable: false },
        { text: '전화번호', value: 'CUST_PHN_NO1', align: 'center', width: '7%', sortable: false },
        { text: '배려', value: 'BLACK_YN', align: 'center', width: '7%', sortable: false },
      ],
      headersExcel: [
        { text: '대분류', value: 'L_CUTT_TYPE_NM', align: 'left', width: '150px', sortable: false },
        { text: '중분류', value: 'M_CUTT_TYPE_NM', align: 'left', width: '150px', sortable: false },
        { text: '소분류', value: 'S_CUTT_TYPE_NM', align: 'left', width: '200px', sortable: false },
        { text: '상담메모', value: 'CUTT_CN', align: 'left', width: '800px', sortable: false },
        { text: '고객명', value: 'CUST_NM', align: 'center', width: '100px', sortable: false },
        { text: '핸드폰번호', value: 'CUST_PHN_NO', align: 'center', width: '120px', sortable: false },
        { text: '전화번호', value: 'CUST_PHN_NO1', align: 'center', width: '120px', sortable: false },
        { text: '배려', value: 'BLACK_YN', align: 'center', width: '80px', sortable: false },
      ],
      itemsRowSpan: [],
      srchParam: {
        srchStartDt: this.$moment(new Date()).format('YYYY-MM-DD'),
        srchEndDt: this.$moment(new Date()).format('YYYY-MM-DD'),
        srchCuttType: '',
        srchCuttZone: [],
        srchCustcoId: '',
        srchDeptId: '',
        srchUserId: '',
        srchCnt: '',
        srchRcptChnCd: '',
        srchBlackYn: false,
        srchCuttCn: '',
      },
      clearProp: false,

      list_common_code: [],
      common_ognz_list: [],
      common_rcv_chn_list: [],
      custcoList: [],
      userList: [],
      selectedCustcoItem: {},
      selectedDeptItem: {},
      totCnt: 0,
      isLoading: false,

    }
  },
  async created() {
    let codeName = ['CVC']; //접수채널, 처리매체코드
    this.list_common_code = await this.mixin_common_code_get_all_global(codeName);
    if (this.computedUserCenter < 0) {
      this.common_rcv_chn_list = await this.mixin_common_code_get(this.list_common_code, 'CVC', '전체')
    } else {
      this.common_rcv_chn_list = await this.mixin_common_code_get_global(this.list_common_code, 'CVC', this.computedUserCenter, '전체')
    }
    this.common_ognz_list = await this.mixin_ognz_list();
    this.custcoList = await this.mixin_ognz_list_center(this.common_ognz_list, 'CUSL', '')

    if (this.mixin_isEmpty(this.selectedCustcoItem)) {
      if (this.computedUserCenter > 0) {
        this.selectedCustcoItem = this.custcoList.find(item => item.CUSTCO_ID === this.computedUserCenter)
      } else {
        this.selectedCustcoItem = this.custcoList[0]
      }
    }
  },
  mounted() {
  },
  methods: {
    setCuttZone(data) {
      this.srchParam.srchCuttZone = data;
    },
    setCuttType(data) {
      this.srchParam.srchCuttType = data.reverse().find((item) => item != null && item != '');
      console.log(this.srchParam.srchCuttType)
    },
    async getStatsCustList(next){
      this.isLoading = true;
      if( !next ){
        this.itemsRowSpan =[]
        this.pagination.PAGES_CNT = 1
      }
      let sUrl = '/api/biz/common/select/selectStatsCust';
      let postParam = {
        SRCH_START_DT : this.srchParam.srchStartDt.replaceAll('-','')+'000000',
        SRCH_END_DT : this.srchParam.srchEndDt.replaceAll('-','')+'235959',
        SRCH_RCPT_CHN_CD : this.srchParam.srchRcptChnCd,
        SRCH_CUTT_TYPE : this.mixin_isEmpty(this.srchParam.srchCuttType) ? this.srchParam.srchCuttType : '',
        SRCH_CUSTCO_ID : this.srchParam.srchCustcoId,
        SRCH_DEPT_ID : this.mixin_isEmpty(this.selectedDeptItem) ? '':this.selectedDeptItem.DEPT_ID,
        SRCH_CUTT_ZONE_1 : this.srchParam.srchCuttZone[0],
        SRCH_CUTT_ZONE_2 : this.srchParam.srchCuttZone[1],
        SRCH_CUTT_ZONE_3 : this.srchParam.srchCuttZone[2],
        SRCH_CUTT_CN : this.srchParam.srchCuttCn,
        SRCH_BLACK_YN : this.srchParam.srchBlackYn ? 'Y' : '',
      }
      let headParam = {
        head : {
          sn : 'selectStatsCust',
          ns : 'lhcs.statistics.dao.xml.StaticticsCustMapper',
          ROW_CNT : this.pagination.ROW_CNT,
          PAGES_CNT : this.pagination.PAGES_CNT,
          PAGING : "Y",
        },
        timeout : 300000,
      }
      const response = await this.common_postCall(sUrl, postParam,headParam)
      if( !response.HEADER.ERROR_FLAG ){
        this.totCnt = response.HEADER.TOT_COUNT;
        response.DATA.map(item =>{
          if(item.CAUTION_CUST_YN ==='Y'){
            item.BLACK_YN = '배려고객'
          }
          this.itemsRowSpan.push(item)
        })
        console.log(response.HEADER)
        if(response.HEADER.next !== null && response.HEADER.next !== undefined){
          console.log(response.HEADER.next)
          if(response.HEADER.next === true){
            this.pagination.nextDisabled = false //버튼 활성화
          }else{
            this.pagination.nextDisabled = true  //버튼 비활성화
          }
        }
        this.pagination.PAGES_CNT ++
      }
      this.isLoading = false;
    },
    async downloadExcel(){

      let sHeaderData = '';
      let makeHeader = []
      this.headersExcel.map((item)=>{
        let str = `${item.value}^${item.text}`
        makeHeader.push(str)
      })
      sHeaderData = makeHeader.join(',');

        let sURL = '/api/biz/common/cmmExcelDwnld';
        let postParams = {

          SRCH_START_DT : this.srchParam.srchStartDt.replaceAll('-','')+'000000',
          SRCH_END_DT : this.srchParam.srchEndDt.replaceAll('-','')+'235959',
          SRCH_RCPT_CHN_CD : this.srchParam.srchRcptChnCd,
          SRCH_CUTT_TYPE : this.srchParam.srchCuttType,
          SRCH_CUSTCO_ID : this.srchParam.srchCustcoId,
          SRCH_DEPT_ID : this.mixin_isEmpty(this.selectedDeptItem) ? '':this.selectedDeptItem.DEPT_ID,
          SRCH_CUTT_ZONE_1 : this.mixin_isEmpty(this.srchParam.srchCuttZone) ? '' : this.srchParam.srchCuttZone[0],
          SRCH_CUTT_ZONE_2 : this.mixin_isEmpty(this.srchParam.srchCuttZone) ? '' : this.srchParam.srchCuttZone[1],
          SRCH_CUTT_ZONE_3 : this.mixin_isEmpty(this.srchParam.srchCuttZone) ? '' : this.srchParam.srchCuttZone[2],
          SRCH_CUTT_CN : this.srchParam.srchCuttCn,
          SRCH_BLACK_YN : this.srchParam.srchBlackYn ? 'Y' : '',

          sFileName: '지역 및_상담_유형별_고객현황',
          sTitleName: '고객현황',
          iExcelLimitRowCnt: 100000,
          serviceNm: 'kr.co.hkcloud.lhcs.statistics.dao.xml.StaticticsCustMapper',
          sqlId: 'selectStatsCust',
          sHeaderData: sHeaderData,
        };
        let headParams = {
          head: '',
        }
        this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", true);
        this.requestServerExcelDownloadApi({
          url: sURL, // required
          headers: {
            // required
            Authorization: "",
          },
          callback: (data) => {
            this.$store.commit("alertStore/hideAlert");
          },
          data: postParams,
        }, '지역 및_상담_유형별_고객현황');

    }
  },
  computed: {
  },
  watch: {
    async selectedCustcoItem() {
      this.srchParam.srchCustcoId = this.selectedCustcoItem.CUSTCO_ID
      this.common_rcv_chn_list = await this.mixin_common_code_get_global(this.list_common_code, 'CVC', this.selectedCustcoItem.CUSTCO_ID, '전체')
      this.srchParam.srchCuttType = '';
      this.srchParam.srchRcptChnCd = '';
    }
  },
};
</script>

<style lang="scss" scoped>

</style>