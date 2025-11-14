<template>
  <div>
    <!-- sub top -->
    <div class="pl-form-inline-wrap pl-card-body py-3">
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
              item-value="DEPT_NM"
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
              :disabled="mixin_isEmpty(selectedDeptItem.DEPT_NM)?true:false"
          ></v-autocomplete>
        </div>
      </div>

      <div>
        <v-btn
          class="pl-btn is-icon"
          @click="getStatsSchdlPrcsCutt"
          >
          <span class="pl-icon20 search"></span>
          조회
        </v-btn>
      </div>

    </div>
    <!-- sub content -->
    <div class="is-border-top pl-card-body">
      <!-- grid top -->
      <div class="pl-grid-top pt-2">
        <div class="pl-grid-top-left spacing-wrap sp-16 ">
          <div class="spacing-wrap sp-8">
            <div>
              <strong class="pl-bullet-txt is-blue">상담사별 통계</strong>
            </div>
          </div>
        </div>
        <div class="pl-grid-top-utils">
          <!-- 엑셀 다운로드 버튼 -->
          <compo-excel
              TypeProp="Download"
              :DataHeaderProp="headersGridExcel"
              :DataBodyProp="[...itemsRowSpan, ...[totCntObject]]"
              :FileNameProp="`스케줄러_진행실적_상담사별_${srchParam.srchStartDt.replaceAll('-','')}_${srchParam.srchEndDt.replaceAll('-','')}`"
              SheetNameProp="상담사별_진행실적"
              :DisabledProp="mixin_isEmpty(itemsRowSpan)"
          />
        </div>
      </div>
      <!-- grid -->
      <v-data-table
        class="pl-grid is-mt-s is-rowspan"
        :headers="headersRowSpan"
        :items="itemsRowSpan"
        fixed-header
        item-key="ROW_NUMBER"
        :loading="isLoading"
        height="598px"
        :items-per-page="itemsRowSpan.length"
        hide-default-footer
        no-data-text="등록된 데이터가 없습니다."
        >
        <template v-slot:item="{ item }">
          <tr class="text-center"
              :key="item.ROW_NUMBER">
            <td v-for="(col,idx) in headersRowSpan" :key="col.value"
                :class="col.value.includes('_CNT')? item[col.value] < 1? 'text-right' : 'text-right is-txt-blue is-hover' : 'text-center'"
                @click="()=>{
                if( idx > 1 && item[col.value] > 0 ) clickedRow(col, item)
              }"
            >
              {{ item[col.value] }}
            </td>
          </tr>
        </template>

        <!-- 합계 -->
        <template slot="footer">
          <div class="pl-grid-sum">
            <table >
              <colgroup>
                <col v-for="(col, idx) in headersRowSpan" :key="idx" :width=col.width />
              </colgroup>
              <tbody >
                <tr >
                  <td class="pl-grid-sum-head text-center" colspan="3" >합계</td>
                  <td class="text-right" >
                    {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "ASSGN_CNT")) }}
                  </td>
                  <td class="text-right" >
                    {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "RSRV_CNT")) }}
                  </td>
                  <td class="text-right" >
                    {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "VISIT_CNT")) }}
                  </td>
                  <td class="text-right" >
                    {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "EXP_CNT")) }}
                  </td>
                  <td class="text-right" >
                    {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "TERMI_CNT")) }}
                  </td>
                  <td class="text-right" >
                    {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "END_CNT")) }}
                  </td>
                  <td class="text-right" >
                    {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "SURVEY_CNT")) }}
                  </td>
                  <td class="text-right" >
                    {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "ING_CNT")) }}
                  </td>

                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'STA_M1300_TAB01', //상담사별 통계
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
      ROW_PER_PAGE: 20,
      headersRowSpan: [
        { text: 'No', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '팀', value: 'DEPT_NM', align: '', width: '150px', sortable: false },
        { text: '상담사', value: 'USER_NM', align: '', width: '150px', sortable: false },
        { text: '분배건수', value: 'ASSGN_CNT', align: 'center', width: '', sortable: false },
        { text: '통화예약건', value: 'RSRV_CNT', align: 'center', width: '', sortable: false },
        { text: '방문확정건', value: 'VISIT_CNT', align: 'center', width: '', sortable: false },
        { text: '제외', value: 'EXP_CNT', align: 'center', width: '', sortable: false },
        { text: '종결', value: 'TERMI_CNT', align: 'center', width: '', sortable: false },
        { text: '완료', value: 'END_CNT', align: 'center', width: '', sortable: false },
        { text: '해피콜', value: 'SURVEY_CNT', align: 'center', width: '', sortable: false },
        { text: '진행중(미처리)', value: 'ING_CNT', align: 'center', width: '', sortable: false },
      ],
      headersGridExcel: [
        { text: 'No', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '팀', value: 'DEPT_NM', align: '', width: '150px', sortable: false },
        { text: '상담사', value: 'USER_NM', align: '', width: '150px', sortable: false },
        { text: '분배건수', value: 'ASSGN_CNT', align: 'center', width: '100px', sortable: false },
        { text: '통화예약건', value: 'RSRV_CNT', align: 'center', width: '100px', sortable: false },
        { text: '방문확정건', value: 'VISIT_CNT', align: 'center', width: '100px', sortable: false },
        { text: '제외', value: 'EXP_CNT', align: 'center', width: '100px', sortable: false },
        { text: '종결', value: 'TERMI_CNT', align: 'center', width: '100px', sortable: false },
        { text: '완료', value: 'END_CNT', align: 'center', width: '100px', sortable: false },
        { text: '해피콜', value: 'SURVEY_CNT', align: 'center', width: '100px', sortable: false },
        { text: '진행중(미처리)', value: 'ING_CNT', align: 'center', width: '100px', sortable: false },
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
      if(!this.mixin_isEmpty(this.selectedDeptItem.DEPT_NM)) {
        const response = await this.common_postCall("/api/biz/common/select/selectUserList", postParam, headParam);

        if (!response.HEADER.ERROR_FLAG) {
          this.userList = response.DATA;
          if (this.computedUserDetailType === 'MANAGER') { //상담사 경우
            this.SCH_CUSL_ID = this.$store.getters['userStore/GE_USER_ROLE'].userId;
          }
        }
      }
    },
    async getStatsSchdlPrcsCutt(){
      this.itemsRowSpan = []
      this.isLoading = true;
      let sUrl = '/api/biz/common/select/selectStatsSchdlPrcsCutt'
      let postParam = {
        SRCH_START_DT : this.srchParam.srchStartDt.replaceAll('-',''),
        SRCH_END_DT : this.srchParam.srchEndDt.replaceAll('-',''),
        SRCH_DEPT_ID : this.selectedDeptItem.DEPT_ID,
        SRCH_USER_ID : this.srchParam.srchUserId,
      }
      let headParam ={
        head : {
          ns : 'lhcs.statistics.dao.xml.StatisticsFlawMapper'
        },
        timeout : 300000,
      }

      const response = await this.common_postCall(sUrl, postParam, headParam)
      if( !response.HEADER.ERROR_FLAG ){
        response.DATA.map(item=>{
          Object.keys(item).some((key) => {
            if (key.includes("CNT")) {
              item[key] = Number(item[key]) > 999 ? this.mixin_convertNumToComma(Number(item[key])) : Number(item[key])
            }
          });
          this.itemsRowSpan.push(item)
        })
      }else{
        this.showAlertCaution({msg : '조회 중 문제가 발생하였습니다.'})
      }
      this.isLoading = false;
    },
    async clickedRow(col, item){
      this.showToastInfo({msg:`${col.text} 엑셀 다운로드 시작`})

      let sUrl = '/api/statistics/Flaw/downloadStatsSchdlPrcs'

      let postParam = {
        SRCH_START_DT : this.srchParam.srchStartDt.replaceAll('-',''),
        SRCH_END_DT : this.srchParam.srchEndDt.replaceAll('-',''),
        SRCH_CUSTCO_ID : this.srchParam.srchCustcoId,
        SRCH_DEPT_ID : item.DEPT_ID,
        SRCH_USER_ID : item.USER_ID,
        CLICK_ITEM : col.value
      }
      try {
        const response = await axios.post(sUrl, postParam, {
          responseType: "blob", // 파일 데이터 수신 설정
        });
        const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

        // 다운로드 링크 생성 및 클릭
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `스케줄러 목록_상담사별_${col.text}.xlsx`; // 파일명 설정
        link.click();

        URL.revokeObjectURL(link.href);
      } catch (error) {
        console.error("Excel download failed:", error);
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    }
  },
  computed: {
  },
  watch: {
    async selectedCustcoItem() {
      this.srchParam.srchCustcoId = this.selectedCustcoItem.CUSTCO_ID;
    }
  },
};
</script>

<style lang="scss" scoped>

</style>