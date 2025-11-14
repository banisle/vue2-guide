<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
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
              <span class="pl-label" style="width: 68px">
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
              <span class="pl-label" style="width: 56px">
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
                건수
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form type-middle is-xs"
                  oninput="javascript: this.value = this.value.replace(/[^0-9]/g, '' );"
                  suffix="건 이상"
                  v-model="srchParam.srchCnt"
                ></v-text-field>
              </div>
            </div>

            <div>
              <v-btn
                class="pl-btn is-icon"
                @click="getSumCuttCntBtZone"
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
        <!-- 휴가구분 -->
        <!-- grid top -->
        <div class="pl-grid-top pt-2">
          <div class="pl-grid-top-left spacing-wrap sp-16 ">
            <ul class="pl-list-info mt-0">
              <li><strong>사용방법!</strong> 최대 1년을 초과하여 조회하지 않도록 해주세요.</li>
            </ul>
          </div>
          <div class="pl-grid-top-utils">
            <!-- 엑셀 다운로드 버튼 -->
            <compo-excel
                TypeProp="Download"
                :DataHeaderProp="headersExcel"
                :DataBodyProp="itemsRowSpan"
                :FileNameProp="`지역별_상담건수_요약_${srchParam.srchStartDt.replaceAll('-','')}_${srchParam.srchEndDt.replaceAll('-','')}`"
                SheetNameProp="지역별_상담건수_요약"
                :isMulti="true"
                :DisabledProp="mixin_isEmpty(itemsRowSpan)"
            />
          </div>
        </div>
        <!-- grid -->
        <v-data-table
          class="pl-grid is-mt-s is-hover"
          :headers="headers"
          :items="itemsRowSpan"
          fixed-header
          item-key="index"
          height="641px"
          :items-per-page="itemsRowSpan.length"
          hide-default-footer
          :loading="isLoading"
	        no-data-text="등록된 데이터가 없습니다."
          hide-default-header>
          <template v-slot:header>
            <thead class="v-data-table-header multi-row">
              <tr>
                <th width="13%" class="text-center"><span>상담유형</span></th>
                <th colspan="3" width="" class="text-center"><span>상담지역</span></th>
                <th colspan="3" width="40%" class="text-center"><span>상담건수</span></th>
              </tr>
              <tr>
                <th class="text-center"><span>대분류</span></th>
                <th class="text-center"><span>시도</span></th>
                <th class="text-center"><span>시군구</span></th>
                <th class="text-center"><span>지구명</span></th>
                <th class="text-center"><span>완료</span></th>
                <th class="text-center"><span>이관</span></th>
                <th class="text-center"><span>합계</span></th>
              </tr>
            </thead>
          </template>
        </v-data-table>

      </div>
    </div>
  </div>
</template>

<script>
import CompoCuttZoneCombo from "@/components/CompoCuttZoneCombo.vue";
import CompoCuttTypeCombo from "@/components/CompoCuttTypeCombo.vue";

export default {
  name: 'MENU_STA_M0300', //지역별 상담건수 요약 통계
  components: {
    CompoCuttTypeCombo,
    CompoCuttZoneCombo
  },
  data() {
    return {

      headers: [
        { text: '대분류', value: 'CUTT_TYPE_NM', align: 'center', width: '', sortable: false },
        { text: '시도', value: 'SIDO_NM', align: 'center', width: '14%', sortable: false },
        { text: '시군구', value: 'SIGUNGU_NM', align: 'center', width: '10%', sortable: false },
        { text: '지구명', value: 'JIGU_NM', align: 'center', width: '14%', sortable: false },
        { text: '완료', value: 'CNSLT_COMP_CNT', align: 'center', width: '8%', sortable: false },
        { text: '이관', value: 'CNSLT_TRANS_CNT', align: 'center', width: '8%', sortable: false },
        { text: '합계', value: 'TOT_CNSLT_CNT', align: 'center', width: '8%', sortable: false },
      ],

      headersExcel:[
          [{ text: '상담유형', value: 'CUTT_TYPE_NM', align: 'center', width: '', sortable: false },
            { text: '상담지역', value: 'SIDO_NM', align: 'center', width: '14%', sortable: false },
            { text: '', value: 'SIGUNGU_NM', align: 'center', width: '10%', sortable: false },
            { text: '', value: 'JIGU_NM', align: 'center', width: '14%', sortable: false },
            { text: '상담건수', value: 'CNSLT_COMP_CNT', align: 'center', width: '8%', sortable: false },
            { text: '', value: 'CNSLT_TRANS_CNT', align: 'center', width: '8%', sortable: false },
            { text: '', value: 'TOT_CNSLT_CNT', align: 'center', width: '8%', sortable: false },
          ],
          [
              { text: '대분류', value: 'CUTT_TYPE_NM', align: 'center', width: '150px', sortable: false },
            { text: '시도', value: 'SIDO_NM', align: 'center', width: '120px', sortable: false },
            { text: '시군구', value: 'SIGUNGU_NM', align: 'center', width: '120px', sortable: false },
            { text: '지구명', value: 'JIGU_NM', align: 'center', width: '150px', sortable: false },
            { text: '완료', value: 'CNSLT_COMP_CNT', align: 'center', width: '100px', sortable: false },
            { text: '이관', value: 'CNSLT_TRANS_CNT', align: 'center', width: '100px', sortable: false },
            { text: '합계', value: 'TOT_CNSLT_CNT', align: 'center', width: '100px', sortable: false },]
      ],
      itemsRowSpan : [],

      srchParam : {
        srchStartDt : this.$moment(new Date()).format('YYYY-MM-DD'),
        srchEndDt : this.$moment(new Date()).format('YYYY-MM-DD'),
        srchCuttType : '',
        srchCuttZone : [],
        srchCustcoId : '',
        srchDeptId : '',
        srchUserId : '',
        srchCnt : '',
        srchRcptChnCd : '',
      },
      clearProp : false,

      list_common_code : [],
      common_ognz_list : [],
      common_rcv_chn_list : [],
      custcoList : [],
      userList : [],
      selectedCustcoItem : {},
      selectedDeptItem : {},
      totCntObject : {},
      isLoading : false,
    }
  },
  /* STA_M0300, STA_M0400, STA_M0500, STA_M0600 동일 */
  async created() {
    let codeName = ['CVC']; //접수채널, 처리매체코드
    this.list_common_code = await this.mixin_common_code_get_all_global(codeName);
    // 접속 고객사에 따라 접수채널 코드 개별조회
    if(this.computedUserCenter < 0){
      this.common_rcv_chn_list = await this.mixin_common_code_get(this.list_common_code, 'CVC', '전체')
    }else{
      this.common_rcv_chn_list = await this.mixin_common_code_get_global(this.list_common_code, 'CVC', this.computedUserCenter,'전체')
    }
    // 상담지역 조회
    this.common_ognz_list = await this.mixin_ognz_list();
    // 고객사 목록 조회
    this.custcoList = await this.mixin_ognz_list_center(this.common_ognz_list, 'CUSL', '' )
    // 접속 고객사에 따라 선택 고객사 기본세팅
    if(this.mixin_isEmpty(this.selectedCustcoItem)){
      if(this.computedUserCenter > 0){
        this.selectedCustcoItem = this.custcoList.find(item => item.CUSTCO_ID === this.computedUserCenter)
      }else{
        this.selectedCustcoItem = this.custcoList[0]
      }
    }
  },
  mounted() {
  },
  methods: {
    setCuttZone(data){
      this.srchParam.srchCuttZone = data;
    },
    setCuttType(data){
      this.srchParam.srchCuttType = data.reverse().find((item) => item != null && item != '');
      console.log(this.srchParam.srchCuttType)
    },
    async getSumCuttCntBtZone(){
      this.isLoading = true;
      this.itemsRowSpan =[]
      let sUrl = '/api/biz/common/select/selectSumCuttCntByZone';
      let postParam = {
        SRCH_START_DT : this.srchParam.srchStartDt.replaceAll('-','')+'000000',
        SRCH_END_DT : this.srchParam.srchEndDt.replaceAll('-','')+'235959',
        SRCH_RCPT_CHN_CD : this.srchParam.srchRcptChnCd,
        SRCH_CUTT_TYPE : this.srchParam.srchCuttType,
        SRCH_CUSTCO_ID : this.srchParam.srchCustcoId,
        SRCH_DEPT_ID : this.mixin_isEmpty(this.selectedDeptItem) ? '':this.selectedDeptItem.DEPT_ID,
        SRCH_CUTT_ZONE_1 : this.srchParam.srchCuttZone[0],
        SRCH_CUTT_ZONE_2 : this.srchParam.srchCuttZone[1],
        SRCH_CUTT_ZONE_3 : this.srchParam.srchCuttZone[2],
        SRCH_CNT : this.srchParam.srchCnt
      }
      let headParam = {
        head : {
          sn : 'selectSumCuttCntByZone',
          ns : 'lhcs.statistics.dao.xml.StaticticsZoneMapper'
        },
        timeout : 300000
      }
      const response = await this.common_postCall(sUrl, postParam,headParam)
      if( !response.HEADER.ERROR_FLAG ){
        response.DATA.map(item =>{
          Object.keys(item).some((key) => {
            if(key.includes("CNT")){
              item[key] = Number(item[key]) > 999 ? this.mixin_convertNumToComma(Number(item[key])) : Number(item[key])
            }
          });
          this.itemsRowSpan.push(item)
        })
      }
      this.isLoading = false;
    }
  },
  computed: {
  },
  watch: {
    // 선택 고객사 변경 시 부서/접수채널 고객사 별 조회 및 바인딩 변수 초기화
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