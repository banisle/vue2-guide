<template>
  <div class="px-6">
    <!-- search -->
    <div class="pl-search-form is-mt-m">
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline">
          <span class="pl-label">
            조회기간
          </span>
          <div class="pl-desc">
            <compo-date-range-picker
                ParentStyleProp="width: 300px"
                :StartDayProp.sync="SRCH_PARAMS_TOP.SRCH_ST"
                :EndDayProp.sync="SRCH_PARAMS_TOP.SRCH_END"
                @startDayChange="mixin_testLog(SRCH_PARAMS_TOP.SRCH_ST)"
                @endDayChange="mixin_testLog(SRCH_PARAMS_TOP.SRCH_END)"
            />

          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            구분
          </span>
          <div class="pl-desc">
            <v-select
                class="pl-form type-middle is-sm"
                :items="OUTSIDE_YN_LIST"
                v-model="SRCH_PARAMS_TOP.SRCH_OUTSIDE_YN"
                placeholder="전체"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            확인여부
          </span>
          <div class="pl-desc">
            <v-select
              class="pl-form type-middle is-sm"
              :items="YN_LIST"
              v-model="SRCH_PARAMS_TOP.SRCH_IDNTY_YN"
              placeholder="전체"
            ></v-select>
          </div>
        </div>
        <v-btn class="pl-btn is-icon" @click="selectGridList">
          <span class="pl-icon20 search"></span>
          조회
        </v-btn>
      </div>
    </div>

    <div class="is-border-top pt-2">
      <div>
        <!-- grid top -->
        <div class="pl-grid-top ">
          <div class="pl-grid-top-left spacing-wrap sp-16">
            <span class="pl-bullet-txt is-green">확인 <strong>({{ countByConfirm['확인'] }})</strong></span>
            <span class="pl-bullet-txt is-red">미확인 <strong>({{ countByConfirm['미확인'] }})</strong></span>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ GRID.ITEMS_TOT_CNT }})</em> 건</span>
            <!-- 엑셀 다운로드 버튼 
            <compo-tooltip-btn
              TitleProp="엑셀 다운로드"
              ClassProp="pl-tooltip-btn "
              IconProp="pl-icon20 exceldown"
              TooltipPositionProp="bottom"
              @btnClick="mixin_testLog('엑셀 다운로드')"
            ></compo-tooltip-btn>-->
            <compo-excel
              TypeProp="Download"
              :DataHeaderProp="GRID.HEADERS"
              :DataBodyProp="GRID.ITEMS"
              :FileNameProp="fileName"
              SheetNameProp="코칭 현황"
            />
          </div>
        </div>
        <!-- grid -->
        <v-data-table
          class="pl-grid is-mt-s is-hover"
          :headers="GRID.HEADERS"
          :items="GRID.ITEMS"
          fixed-header
          item-key="ROW_NUMBER"
          height="calc(100vh - 288px)"
          hide-default-footer
	        no-data-text="등록된 데이터가 없습니다."
          @dblclick:row="showCoatchingDetail"
          :items-per-page="-1"
          :loading="mixin_loadding">
          <template v-slot:item.FULL_CUTT_TYPE_NM="{item}">
            <v-tooltip content-class="pl-tooltip " bottom>
              <template v-slot:activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on">
                {{ item.FULL_CUTT_TYPE_NM }}
              </span>
              </template>
              <span>{{ item.FULL_CUTT_TYPE_NM }}</span>
            </v-tooltip>
          </template>
          <template v-slot:item.PRCS_YN="{item}">
            <span v-if="item.PRCS_YN == 'Y'">완료</span>
            <span v-if="item.PRCS_YN == 'N'">-</span>
          </template>
          <!-- 구분 -->
          <template v-slot:item.OUTSIDE_YN="{ item }">
            <span :class="`is-txt-${mixin_displayStatus(item.OUTSIDE_YN, 'STAT_LIST')}`" >{{ item.OUTSIDE_YN }}</span>
          </template>

        </v-data-table>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "HOME_MANAGER_TAB04", //name은 'MENU_' + 파일명 조합
  components: {
  },
  data() {
    return {

      SRCH_PARAMS_TOP:{
        SRCH_ST: this.$moment(new Date()).subtract(14,'days').format('YYYY-MM-DD'),
        SRCH_END: this.$moment(new Date()).format('YYYY-MM-DD'),
        SRCH_TODAY: this.$moment(new Date()).format('YYYY-MM-DD'),
        SRCH_IDNTY_YN: '',
        SRCH_OUTSIDE_YN: '',  //구분 내부I, 외부E
      },

      GRID:{
        HEADERS:[
          { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
          { text: '상담일시', value: 'CUTT_REG_DT', align: 'center', width: '150px', sortable: false },
          { text: '상담번호', value: 'PHN_CUTT_ID', align: 'center', width: '120px', sortable: false },
          { text: '인입번호', value: 'LAST_PHN_NO', align: 'center', width: '130px', sortable: false },
          { text: '상담유형', value: 'FULL_CUTT_TYPE_NM', align: 'left', width: '290px', sortable: false },
          { text: '통화시간', value: 'PHN_HR_FMT', align: 'center', width: '70px', sortable: false },
          { text: '구분', value: 'OUTSIDE_YN', align: 'center', width: '60px', sortable: false },
          { text: '코칭일시', value: 'COACHING_REG_DT', align: 'center', width: '150px', sortable: false },
          { text: '코칭사유', value: 'COACHING_RSN_CD_NM', align: 'center', width: '130px', sortable: false },
          { text: '확인일시', value: 'INQ_DT', align: 'center', width: '150px', sortable: false },
          { text: '나의피드백', value: 'PRCS_YN', align: 'center', width: '90px', sortable: false },
        ],
        ITEMS:[],
        ITEMS_TOT_CNT:0,
      },
      OUTSIDE_YN_LIST:[
        {text: "전체", value: ''},
        {text: "내부", value: 'I'},
        {text: "외부", value: 'E'},
      ],
      YN_LIST: [
        {text: "전체", value: ''},
        {text: "Y", value: 'Y'},
        {text: "N", value: 'N'},
      ],
      STAT_LIST: [
        { code: '내부', value: 'black'},
        { code: '외부', value: 'red'},
      ],
      fileName: '코칭 현황',

    }
  },
  methods: {
    async selectGridList() {

      this.GRID.ITEMS = [];
      this.mixin_loadding = true;

      let sURL = '/api/biz/common/select/selectPhnCuttCoachingList';
      let postParam = {};
      postParam.SRCH_CUSL_ID = this.user_id;
      postParam.SRCH_ST = this.SRCH_PARAMS_TOP.SRCH_ST.replaceAll("-","");
      postParam.SRCH_END = this.SRCH_PARAMS_TOP.SRCH_END.replaceAll("-","");
      postParam.SRCH_IDNTY_YN = this.SRCH_PARAMS_TOP.SRCH_IDNTY_YN;
      postParam.SRCH_OUTSIDE_YN = this.SRCH_PARAMS_TOP.SRCH_OUTSIDE_YN;

      let headParam = {head: {"ns": 'lhcs.phone.cutt.dao.PhoneCuttCoachingMapper'}};
      let response = await this.common_postCall(sURL, postParam, headParam)
      if (!response.HEADER.ERROR_FLAG){
        let responseData = response.DATA;
        let i = 0;
        responseData.map(item => {
          if( item.OUTSIDE_YN === 'E') {
            responseData[i]["OUTSIDE_YN"] = '외부'
          }else if( item.OUTSIDE_YN === 'I') {
            responseData[i]["OUTSIDE_YN"] = '내부'
          }else {
            responseData[i]["OUTSIDE_YN"] = '-'
          }
          responseData[i]["PRCS_CN_SHOW"] = false;

          return i++;
        });
        this.GRID.ITEMS = [...this.GRID.ITEMS, ...responseData];
        this.GRID.ITEMS_TOT_CNT = response.HEADER.TOT_COUNT;
      }else {
        this.GRID.ITEMS = [];
      }
      this.mixin_loadding = false;
    },
    showCoatchingDetail(event, {item}){
      this.mixin_showCoach(item.PHN_CUTT_ID, item.CUSTCO_ID);
    },
  },
  mounted() {
  },
  created() {
    this.selectGridList();

    // 코칭추가시 or 상담사확인시 호출됨. 필요시추가
    this.$eventBus.$on("refreshCoachingGridList", (item) => {
      this.selectGridList()
    });
  },
  beforeDestroy(){
    this.$eventBus.$off("refreshCoachingGridList"); //eventBus 중복방지를 위해 off
  },
  computed: {
    countByConfirm() {
      const statCount = this.GRID.ITEMS.reduce((acc, item) => {
        if (item.IDNTY_YN === 'Y') {
          acc['확인']++;
        }else {
          acc['미확인']++;
        }
        return acc;
      }, { 확인: 0, 미확인: 0 });
      return statCount;
    },
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>