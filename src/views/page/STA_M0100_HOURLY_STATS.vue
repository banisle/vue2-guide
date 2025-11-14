<template>
  <div>
    <!-- sub top -->
    <div class="pl-form-inline-wrap pl-card-body py-3">
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
          상담유형_대
        </span>
        <div class="pl-desc">
          <compo-cutt-type-combo
              :FormSeProp="'SRCH_DEPTH_1'"
              :SRCH_DEPTH_1_HEADTEXT="'전체'"
              :CustcoProp="mixin_isEmpty(srchParam.srchCustcoId)? computedUserCenter : srchParam.srchCustcoId"
              :DisabledProp="false"
              @EMIT_CUTT_TYPE="setCuttType"
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
            :disabled="computedUserCenter < 0 ? false : true"
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
          @click="getStatisticsHourly"
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
              <strong class="pl-bullet-txt is-blue">시간별 통계</strong>
            </div>
          </div>
        </div>
        <div class="pl-grid-top-utils">
          <!-- 엑셀 다운로드 버튼 -->
          <compo-excel
              TitleProp="엑셀 다운로드"
              TypeProp="Download"
              :DataHeaderProp="headersRowSpan"
              :DataBodyProp="[...itemsRowSpan,...[totCntObject]]"
              :FileNameProp="`상담유형별통계_시간별통계_${srchParam.srchStartDt.replaceAll('-','')}_${srchParam.srchEndDt.replaceAll('-','')}`"
              :SheetNameProp="`상담유형별통계_시간별통계`"
              HeaderColorProp="00B0F0"
              :DisabledProp="mixin_isEmpty(itemsRowSpan)"
          ></compo-excel>
        </div>
      </div>
      <!-- grid -->
      <v-data-table
        class="pl-grid is-mt-s is-rowspan is-header-lg"
        :headers="headersRowSpan"
        :items="itemsRowSpan"
        fixed-header
        item-key="index"
        height="598px"
        :items-per-page="itemsRowSpan.length"
        hide-default-footer
        :loading="isLoading"
	      no-data-text="등록된 데이터가 없습니다."
        >
        <template v-slot:item="{ item, index }">
          <tr
            :class="mixin_getItemClass(item)"
            :key="index">
            <td
              v-if="index === 0 || item.CUTT_TYPE_1_NM !== itemsRowSpan[index - 1].CUTT_TYPE_1_NM"
              :rowspan="mixin_getRowCount(index, 'CUTT_TYPE_1_NM')"
              style="white-space: pre-wrap;"
              :class="mixin_getHeaderClass(headersRowSpan[0].align)">
              <v-tooltip content-class="pl-tooltip " bottom v-if="item.CUTT_TYPE_1_NM.length > 6 ">
                  <template v-slot:activator="{ on, attrs }">
                    <span v-bind="attrs" v-on="on">{{ item.CUTT_TYPE_1_NM.substr(0, 6) + '...' }}</span>
                  </template>
                  <span>{{ item.CUTT_TYPE_1_NM }}</span>
                </v-tooltip>
              <span v-else>{{ item.CUTT_TYPE_1_NM }}</span>
            </td>
            <td
              v-if="index === 0 || item.CUTT_TYPE_2_NM !== itemsRowSpan[index - 1].CUTT_TYPE_2_NM"
              :rowspan="mixin_getRowCount(index, 'CUTT_TYPE_2_NM')"
              style="white-space: pre-wrap;"
              :class="mixin_getHeaderClass(headersRowSpan[1].align)">
                <v-tooltip content-class="pl-tooltip " bottom v-if="item.CUTT_TYPE_2_NM.length > 6 ">
                  <template v-slot:activator="{ on, attrs }">
                    <span v-bind="attrs" v-on="on">{{ item.CUTT_TYPE_2_NM.substr(0, 6) + '...' }}</span>
                  </template>
                  <span>{{ item.CUTT_TYPE_2_NM }}</span>
                </v-tooltip>
              <span v-else>{{ item.CUTT_TYPE_2_NM }}</span>
            </td>
            <td
              v-if="index === 0 || item.CUTT_TYPE_3_NM !== itemsRowSpan[index - 1].CUTT_TYPE_3_NM"
              :rowspan="mixin_getRowCount(index, 'CUTT_TYPE_3_NM')"
              style="white-space: pre-wrap;"
              :class="mixin_getHeaderClass(headersRowSpan[2].align)">
              <v-tooltip content-class="pl-tooltip " bottom v-if="item.CUTT_TYPE_3_NM.length > 6 ">
                  <template v-slot:activator="{ on, attrs }">
                    <span v-bind="attrs" v-on="on">{{ item.CUTT_TYPE_3_NM.substr(0, 6) + '...'  }}</span>
                  </template>
                  <span>{{ item.CUTT_TYPE_3_NM }}</span>
                </v-tooltip>
              <span v-else>{{ item.CUTT_TYPE_3_NM }}</span>
            </td>

            <td class="text-right"> {{ item.CNT_00 }} </td>
            <td class="text-right"> {{ item.CNT_01 }} </td>
            <td class="text-right"> {{ item.CNT_02 }} </td>
            <td class="text-right"> {{ item.CNT_03 }} </td>
            <td class="text-right"> {{ item.CNT_04 }} </td>
            <td class="text-right"> {{ item.CNT_05 }} </td>
            <td class="text-right"> {{ item.CNT_06 }} </td>
            <td class="text-right"> {{ item.CNT_07 }} </td>
            <td class="text-right"> {{ item.CNT_08 }} </td>
            <td class="text-right"> {{ item.CNT_09 }} </td>
            <td class="text-right"> {{ item.CNT_10 }} </td>
            <td class="text-right"> {{ item.CNT_11 }} </td>
            <td class="text-right"> {{ item.CNT_12 }} </td>
            <td class="text-right"> {{ item.CNT_13 }} </td>
            <td class="text-right"> {{ item.CNT_14 }} </td>
            <td class="text-right"> {{ item.CNT_15 }} </td>
            <td class="text-right"> {{ item.CNT_16 }} </td>
            <td class="text-right"> {{ item.CNT_17 }} </td>
            <td class="text-right"> {{ item.CNT_18 }} </td>
            <td class="text-right"> {{ item.CNT_19 }} </td>
            <td class="text-right"> {{ item.CNT_20 }} </td>
            <td class="text-right"> {{ item.CNT_21 }} </td>
            <td class="text-right"> {{ item.CNT_22 }} </td>
            <td class="text-right"> {{ item.CNT_23 }} </td>
            <td class="text-right"> {{ item.CNT_SUM }} </td>
          </tr>
        </template>
        <!-- 합계 -->
        <template slot="footer">
          <div class="pl-grid-sum">
            <table >
              <colgroup>
                <col v-for="(col, index) in headersRowSpan" :key="index" :width=col.width />
              </colgroup>
              <tbody >
                <tr >
                  <td class="pl-grid-sum-head text-center" colspan="3" style="width: 485px !important">총계</td>
                  <td class="text-right"> {{ totCntObject.CNT_00 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_01 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_02 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_03 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_04 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_05 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_06 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_07 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_08 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_09 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_10 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_11 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_12 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_13 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_14 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_15 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_16 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_17 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_18 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_19 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_20 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_21 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_22 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_23 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_SUM }} </td>
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
import CompoCuttTypeCombo from "@/components/CompoCuttTypeCombo.vue";

export default {
  name: 'STA_M0100_HOURLY_STATS', //시간별 통계
  components: {
    CompoCuttTypeCombo
  },
  data() {
    return {
      srchParam : {
        srchStartDt : this.$moment(new Date()).format('YYYY-MM-DD'),
        srchEndDt : this.$moment(new Date()).format('YYYY-MM-DD'),
        srchCuttType : '',
        srchCustcoId : '',
        srchDeptId : '',
        srchUserId : '',
      },
      common_ognz_list : [],
      custcoList : [],
      userList : [],
      selectedCustcoItem : {},
      selectedDeptItem : {},
      totCntObject : {},
      isLoading : false,


      date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      date3: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 20,
      headersRowSpan: [
        { text: '상담유형_대', value: 'CUTT_TYPE_1_NM', align: '', width: '100px', sortable: false },
        { text: '상담유형_중', value: 'CUTT_TYPE_2_NM', align: '', width: '100px', sortable: false },
        { text: '상담유형_소', value: 'CUTT_TYPE_3_NM', align: '', width: '100px', sortable: false },
        { text: '00 시', value: 'CNT_00', align: 'center', width: '', sortable: false },
        { text: '01 시', value: 'CNT_01', align: 'center', width: '', sortable: false },
        { text: '02 시', value: 'CNT_02', align: 'center', width: '', sortable: false },
        { text: '03 시', value: 'CNT_03', align: 'center', width: '', sortable: false },
        { text: '04 시', value: 'CNT_04', align: 'center', width: '', sortable: false },
        { text: '05 시', value: 'CNT_05', align: 'center', width: '', sortable: false },
        { text: '06 시', value: 'CNT_06', align: 'center', width: '', sortable: false },
        { text: '07 시', value: 'CNT_07', align: 'center', width: '', sortable: false },
        { text: '08 시', value: 'CNT_08', align: 'center', width: '', sortable: false },
        { text: '09 시', value: 'CNT_09', align: 'center', width: '', sortable: false },
        { text: '10 시', value: 'CNT_10', align: 'center', width: '', sortable: false },
        { text: '11 시', value: 'CNT_11', align: 'center', width: '', sortable: false },
        { text: '12 시', value: 'CNT_12', align: 'center', width: '', sortable: false },
        { text: '13 시', value: 'CNT_13', align: 'center', width: '', sortable: false },
        { text: '14 시', value: 'CNT_14', align: 'center', width: '', sortable: false },
        { text: '15 시', value: 'CNT_15', align: 'center', width: '', sortable: false },
        { text: '16 시', value: 'CNT_16', align: 'center', width: '', sortable: false },
        { text: '17 시', value: 'CNT_17', align: 'center', width: '', sortable: false },
        { text: '18 시', value: 'CNT_18', align: 'center', width: '', sortable: false },
        { text: '19 시', value: 'CNT_19', align: 'center', width: '', sortable: false },
        { text: '20 시', value: 'CNT_20', align: 'center', width: '', sortable: false },
        { text: '21 시', value: 'CNT_21', align: 'center', width: '', sortable: false },
        { text: '22 시', value: 'CNT_22', align: 'center', width: '', sortable: false },
        { text: '23 시', value: 'CNT_23', align: 'center', width: '', sortable: false },
        { text: '합 계', value: 'CNT_SUM', align: 'center', width: '4%', sortable: false },
      ],
      itemsRowSpan: [],
    }
  },
  async created() {
    this.common_ognz_list = await this.mixin_ognz_list();
      this.custcoList = await this.mixin_ognz_list_center(this.common_ognz_list, 'CUSL', '' )

    if(this.mixin_isEmpty(this.selectedCustcoItem)){
      if(this.computedUserCenter > 0){
        this.selectedCustcoItem = this.custcoList.find(item => item.CUSTCO_ID === this.computedUserCenter)
      }else{
        this.selectedCustcoItem = this.custcoList[0]
      }
    }
    this.getStatisticsHourly();
  },
  mounted() {
  },
  methods: {
    // 상담유형
    setCuttType(data){
      this.srchParam.srchCuttType = data[1];
    },
    async getStatisticsHourly(){
      this.isLoading=true;
      let sUrl = '/api/biz/common/select/selectStatsCuttTypeHourly'

      let postParam = {
        SRCH_CUSTCO_ID : this.selectedCustcoItem.CUSTCO_ID,
        SRCH_START_DT : this.srchParam.srchStartDt.replaceAll('-','')+'000000',
        SRCH_END_DT : this.srchParam.srchEndDt.replaceAll('-','')+'235959',
        SRCH_CUTT_TYPE : this.srchParam.srchCuttType,
        SRCH_DEPT_ID: this.selectedDeptItem.DEPT_ID,
        SRCH_USER_ID : this.srchParam.srchUserId
      }
      let headParam = {
        head : {
          ns : 'lhcs.statistics.dao.xml.StaticticsCuttTypeMapper',
          sn : 'selectStatsCuttTypeHourly'
        }
        ,timeout : 300000
      }

      const response = await this.common_postCall(sUrl, postParam, headParam)
      if( !response.HEADER.ERROR_FLAG ){
        this.itemsRowSpan = []
        response.DATA.map(item =>{
          if(item.CUTT_TYPE == '00000000'){
            this.totCntObject = item;
          }else{
            item.CNT_SUM = this.mixin_convertNumToComma(Number(item.CNT_SUM))
            this.itemsRowSpan.push(item)
          }
        })
          Object.keys(this.totCntObject).some((key) => {
            if(key.includes("CNT")){
              this.totCntObject[key] = Number(this.totCntObject[key]) > 999 ? this.mixin_convertNumToComma(Number(this.totCntObject[key])) : Number(this.totCntObject[key])
            }
          });
      }
      this.isLoading=false;
    },
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
  },
  computed: {
  },
  watch: {
    selectedCustcoItem(){
      this.srchParam.srchCustcoId = this.selectedCustcoItem.CUSTCO_ID
      this.srchParam.srchCuttType = '';
    }
  },
};
</script>

<style lang="scss" scoped>

</style>