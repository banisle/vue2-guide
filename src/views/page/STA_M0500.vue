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
                  @click="getSumCuttType"
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
              <li><strong>사용방법!</strong> 최대 1년을 초과하여 조회하지 않도록 해주세요.</li>
            </ul>
          </div>
          <div class="pl-grid-top-utils">
            <!-- 엑셀 다운로드 버튼 -->
            <compo-excel
                TitleProp="엑셀 다운로드"
                TypeProp="Download"
                :DataHeaderProp="headersExcel"
                :DataBodyProp="[...itemsRowSpan,...[totCntObject]]"
                :FileNameProp="`문의유형별_응대요약_${srchParam.srchStartDt.replaceAll('-','')}_${srchParam.srchEndDt.replaceAll('-','')}`"
                SheetNameProp="문의유형별_응대요약"
                HeaderColorProp="00B0F0"
                :DisabledProp="mixin_isEmpty(itemsRowSpan)"
            ></compo-excel>
          </div>
        </div>
        <!-- grid -->
        <v-data-table
          class="pl-grid is-mt-s is-hover"
          :headers="headers"
          :items="itemsRowSpan"
          fixed-header
          item-key="index"
          height="610px"
          :loading="isLoading"
          :items-per-page="itemsRowSpan.length"
          hide-default-footer
	        no-data-text="등록된 데이터가 없습니다.">
          <template slot="footer">
            <div class="pl-grid-sum">
              <table>
                <tbody>
                <tr>
                  <td class="pl-grid-sum-head text-center" >합계</td>
                  <td class="text-center">{{ totCntObject.TOT_CNSLT_CNT }}</td>
                  <td class="text-center">{{ totCntObject.CNSLT_PER }}</td>
                </tr>
                </tbody>
              </table>
            </div>
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
  name: 'MENU_STA_M0500', //문의유형별 응대 요약 통계
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
      headers: [
        { text: '상담유형(대분류)', value: 'CUTT_TYPE_NM', align: '', width: '', sortable: false },
        { text: '상담건수', value: 'CNSLT_CNT', align: 'center', width: '33%', sortable: false },
        { text: '응대비율', value: 'CNSLT_PER', align: 'center', width: '33%', sortable: false },
      ],
      headersExcel: [
        { text: '상담유형(대분류)', value: 'CUTT_TYPE_NM', align: '', width: '150px', sortable: false },
        { text: '상담건수', value: 'CNSLT_CNT', align: 'center', width: '100px', sortable: false },
        { text: '응대비율', value: 'CNSLT_PER', align: 'center', width: '100px', sortable: false },
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
      },
      clearProp: false,

      list_common_code: [],
      common_ognz_list: [],
      common_rcv_chn_list: [],
      custcoList: [],
      userList: [],
      selectedCustcoItem: {},
      selectedDeptItem: {},
      totCntObject: {},
      totCntRate: {},
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
    async getSumCuttType(){
      this.isLoading = true;
      this.itemsRowSpan =[]
      this.totCntObject={}
      let sUrl = '/api/biz/common/select/selectSumCuttType';
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
          sn : 'selectSumCuttType',
          ns : 'lhcs.statistics.dao.xml.StaticticsResponseMapper'
        }
        , timeout : 300000
      }
      const response = await this.common_postCall(sUrl, postParam,headParam)
      if( !response.HEADER.ERROR_FLAG ){
        response.DATA.map(item =>{
          Object.keys(item).some((key) => {
            if(key.includes("CNT")){
              item[key] = Number(item[key]) > 999 ? this.mixin_convertNumToComma(Number(item[key])) : Number(item[key])
            }else if(key.includes("_PER")){
              item[key] = item[key]+'%';
            }
          });
          if(item.CUTT_TYPE_NM ==='TOT_CNT'){
            this.totCntObject = item;
          }else{
            this.itemsRowSpan.push(item)
          }
        })
      }
      this.isLoading = false;
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