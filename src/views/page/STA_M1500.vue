<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                분배일자
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
                센터
              </span>
              <div class="pl-desc">
                <v-select
                    class="pl-form type-middle"
                    placeholder="전체"
                    :items="custcoList"
                    v-model="selectedCustcoItem"
                    return-object
                    :disabled="true"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                부서/상담사
              </span>
              <div class="pl-desc">
                <v-select
                    v-model="selectedDeptItem"
                    class="pl-form type-middle"
                    :items="mixin_ognz_list_detail(common_ognz_list, selectedCustcoItem.DEPT_ID, '전체' ,'Y'/*콜센터여부,없으면전체*/)"
                    return-object
                    @change=" getUserList"
                    item-value="DEPT_ID"
                    placeholder="전체"
                    :disabled="mixin_isEmpty(selectedCustcoItem)?true:false"
                ></v-select>
                <v-autocomplete
                    v-model="srchParam.srchUserId"
                    :items="userList"
                    item-text="USER_NM"
                    item-value="USER_ID"
                    class="pl-form type-middle"
                    placeholder="전체"
                    :disabled="mixin_isEmpty(selectedDeptItem.DEPT_ID)?true:false"
                ></v-autocomplete>
              </div>
            </div>

            <div>
              <v-btn
                class="pl-btn is-icon"
                @click="getStatsSchdlDistCntct"
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
            <strong class="pl-bullet-txt is-blue">스케줄러 분배건 접촉현황</strong>
          </div>
          <div class="pl-grid-top-utils">
            <!-- 엑셀 다운로드 버튼 -->
            <compo-excel
                TypeProp="Download"
                :DataHeaderProp="headersExcel"
                :DataBodyProp="[...itemsRowSpan, ...[totCntObject]]"
                :FileNameProp="`상담사별_접촉분포_${srchParam.srchStartDt.replaceAll('-','')}_${srchParam.srchEndDt.replaceAll('-','')}`"
                SheetNameProp="상담사별_접촉분포"
                :DisabledProp="mixin_isEmpty(itemsRowSpan)"
            />
          </div>
        </div>
        <!-- grid -->
        <v-data-table
          class="pl-grid is-mt-s is-rowspan "
          :headers="headersRowSpan"
          :items="itemsRowSpan"
          item-class="cellClass"
          :loading="isLoading"
          fixed-header
          item-key="ROW_NUMBER"
          height="calc(-306px + 100vh)"
          :items-per-page="itemsRowSpan.length"
          hide-default-header
          hide-default-footer
          no-data-text="등록된 데이터가 없습니다."
          @dblclick:row="showDetail()"
          :page.sync="page"
          @page-count="pageCount = $event">

          <template v-slot:header>
            <thead class="v-data-table-header multi-row">
              <tr>
                <th rowspan="2" width="50px" class="text-center"><span>NO</span></th>
                <th rowspan="2" width="120px" class="text-center"><span>팀</span></th>
                <th rowspan="2" class="text-center"><span>상담사</span></th>
                <th colspan="4" width="40%" class="text-center"><span>스케줄러</span></th>
                <th colspan="4" width="40%" class="text-center"><span>접촉(상담)</span></th>
              </tr>
              <tr>
                <th class="text-center"><span>총분배</span></th>
                <th class="text-center"><span>스케줄러제외건</span></th>
                <th class="text-center"><span>스케줄러대상건</span></th>
                <th class="text-center"><span>일평균</span></th>
                <th class="text-center"><span>총접촉</span></th>
                <th class="text-center"><span>스케줄러제외건</span></th>
                <th class="text-center"><span>스케줄러대상건</span></th>
                <th class="text-center"><span>일평균</span></th>
              </tr>
            </thead>
          </template>

          <!-- 합계 -->
          <template slot="footer">
            <div class="pl-grid-sum">
              <table >
                <colgroup>
                  <col v-for="(col, ROW_NUMBER) in headersRowSpan" :key="ROW_NUMBER" :width=col.width />
                </colgroup>
                <tbody >
                  <tr >
                    <td class="pl-grid-sum-head text-center" colspan="3">{{ this.totCntObject.USER_NM }}</td>
                    <td class="text-right" > {{ this.totCntObject.SCHDL_CNT }} </td>
                    <td class="text-right" > {{ this.totCntObject.SCHDL_NO_CNT }} </td>
                    <td class="text-right" > {{ this.totCntObject.SCHDL_OK_CNT }} </td>
                    <td class="text-right" > - </td>
                    <td class="text-right" > {{ this.totCntObject.CNSLT_CNT }} </td>
                    <td class="text-right" > {{ this.totCntObject.CNSLT_NO_CNT }} </td>
                    <td class="text-right" > {{ this.totCntObject.CNSLT_OK_CNT }} </td>
                    <td class="text-right" > - </td>
<!--                    <td class="text-right" >-->
<!--                      {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "SCHDL_CNT")) }}-->
<!--                    </td>-->
<!--                    <td class="text-right" >-->
<!--                      {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "SCHDL_NO_CNT")) }}-->
<!--                    </td>-->
<!--                    <td class="text-right" >-->
<!--                      {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "SCHDL_OK_CNT")) }}-->
<!--                    </td>-->
<!--                    <td class="text-right" >-->

<!--                    </td>-->
<!--                    <td class="text-right" >-->
<!--                      {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "CNSLT_CNT")) }}-->
<!--                    </td>-->
<!--                    <td class="text-right" >-->
<!--                      {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "CNSLT_NO_CNT")) }}-->
<!--                    </td>-->
<!--                    <td class="text-right" >-->
<!--                      {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "CNSLT_OK_CNT")) }}-->
<!--                    </td>-->
<!--                    <td class="text-right" >-->

<!--                    </td>-->
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
export default {
  name: 'MENU_STA_M1500', //스케줄러 분배건 접촉현황
  components: {
  },
  data() {
    return {
      date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      date3: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 30,
      headersRowSpan: [
        { text: 'No', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '팀', value: 'DEPT_NM', align: '', width: '', sortable: false },
        { text: '상담사', value: 'USER_NM', align: '', width: '', sortable: false },
        { text: '총분배', value: 'SCHDL_CNT', align: 'right', width: '10%', sortable: false },
        { text: '스케줄러제외건', value: 'SCHDL_NO_CNT', align: 'right', width: '10%', sortable: false },
        { text: '스케줄러대상건', value: 'SCHDL_OK_CNT', align: 'right', width: '10%', sortable: false },
        { text: '일평균', value: 'AVG_SCHDL_CNT', align: 'right', width: '10%', sortable: false },
        { text: '총접촉', value: 'CNSLT_CNT', align: 'right', width: '10%', sortable: false },
        { text: '스케줄러제외건', value: 'CNSLT_NO_CNT', align: 'right', width: '10%', sortable: false },
        { text: '스케줄러대상건', value: 'CNSLT_OK_CNT', align: 'right', width: '10%', sortable: false },
        { text: '일평균', value: 'AVG_CNSLT_CNT', align: 'right', width: '10%', sortable: false },
      ],
      headersExcel: [
        { text: 'No', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '팀', value: 'DEPT_NM', align: '', width: '200px', sortable: false },
        { text: '상담사', value: 'USER_NM', align: '', width: '200px', sortable: false },
        { text: '총분배', value: 'SCHDL_CNT', align: 'right', width: '100px', sortable: false },
        { text: '스케줄러제외건', value: 'SCHDL_NO_CNT', align: 'right', width: '100px', sortable: false },
        { text: '스케줄러대상건', value: 'SCHDL_OK_CNT', align: 'right', width: '100px', sortable: false },
        { text: '일평균', value: 'AVG_SCHDL_CNT', align: 'right', width: '100px', sortable: false },
        { text: '총접촉', value: 'CNSLT_CNT', align: 'right', width: '100px', sortable: false },
        { text: '스케줄러제외건', value: 'CNSLT_NO_CNT', align: 'right', width: '100px', sortable: false },
        { text: '스케줄러대상건', value: 'CNSLT_OK_CNT', align: 'right', width: '100px', sortable: false },
        { text: '일평균', value: 'AVG_CNSLT_CNT', align: 'right', width: '100px', sortable: false },
      ],
      itemsRowSpan: [],

      srchParam : {
        srchStartDt : this.$moment(new Date()).format('YYYY-MM-DD'),
        srchEndDt : this.$moment(new Date()).format('YYYY-MM-DD'),
        srchCuttZone : [],
        srchCustcoId : '4',
        srchDeptId : '',
        srchCallTp : '',
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
      totCntObject: {
        USER_NM : '합계'
        ,SCHDL_CNT : 0
        ,SCHDL_NO_CNT : 0
        ,SCHDL_OK_CNT : 0
        ,CNSLT_CNT : 0
        ,CNSLT_NO_CNT : 0
        ,CNSLT_OK_CNT : 0
      },

      isLoading : false,
    }
  },
  async created() {
    // 상담지역조회
    this.common_ognz_list = await this.mixin_ognz_list();
    // 고객사 목록 조회
    this.custcoList = await this.mixin_ognz_list_center(this.common_ognz_list, 'CUSL', '' )

    // 해당 메뉴는 바로처리 센터에서만 사용하기 때문에 custco_id = 4 고정
    this.selectedCustcoItem = this.custcoList.find(item => item.CUSTCO_ID === "4")
  },
  mounted() {
  },
  methods: {
    async getUserList() {
      this.userList = [];
      this.srchParam.srchUserId = '';

      let postParam = {
        SRCH_TYPE : 'CUSL',
        SRCH_GROUP_ID : this.selectedCustcoItem.DEPT_ID,
        SRCH_DEPT_ID : this.selectedDeptItem.DEPT_ID,
      };
      let headParam = {
        head: {
          ns: "lhcs.system.user.dao.UserMapper",
          sn: "selectUserList"
        }
      };
      if(!this.mixin_isEmpty(this.selectedDeptItem.DEPT_ID)) {
        const response = await this.common_postCall("/api/biz/common/select/selectUserList", postParam, headParam);

        if (!response.HEADER.ERROR_FLAG) {
          this.userList = response.DATA;
          if (this.computedUserDetailType === 'MANAGER') { //상담사 경우
            this.SCH_CUSL_ID = this.$store.getters['userStore/GE_USER_ROLE'].userId;
          }
        }
      }
    },
    async getStatsSchdlDistCntct(){
      this.itemsRowSpan = []
      this.isLoading = true
      let sUrl = '/api/biz/common/select/selectStatsSchdlDistCntct'
      let postParam = {
        SRCH_START_DT : this.srchParam.srchStartDt.replaceAll('-',''),
        SRCH_END_DT : this.srchParam.srchEndDt.replaceAll('-',''),
        SRCH_CUSTCO_ID : this.srchParam.srchCustcoId,
        SRCH_DEPT_ID : this.selectedDeptItem.DEPT_ID,
        SRCH_USER_ID : this.srchParam.srchUserId,
      }
      let headParam = {head:{ ns : 'lhcs.statistics.dao.xml.StatisticsFlawMapper',timeout : 300000}}
      try{
        const response = await this.common_postCall(sUrl, postParam, headParam);
        if (!response.HEADER.ERROR_FLAG) {
          response.DATA.map(item => {
            Object.keys(item).some((key) => {
              if (key.includes("CNT")) {
                item[key] = Number(item[key]) > 999 ? this.mixin_convertNumToComma(Number(item[key])) : item[key]
              }
            });
            this.itemsRowSpan.push(item)
          })

          Object.keys(this.totCntObject).some((key) => {
            if (key.includes("CNT")) {
              this.totCntObject[key] = this.mixin_convertNumToComma(this.mixin_sum_field(this.itemsRowSpan, key))
            }
          })
        }
      }catch(e){
        this.isLoading = false
      }
      this.isLoading = false
    }
  },
  computed: {
  },
  watch: {
    async selectedCustcoItem() {
      this.srchParam.srchCustcoId = this.selectedCustcoItem.CUSTCO_ID
    }
  },
};
</script>

<style lang="scss" scoped>

</style>