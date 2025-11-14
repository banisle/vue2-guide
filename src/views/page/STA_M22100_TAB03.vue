<template>
  <div>
    <!-- sub top -->
    <div class="pl-form-inline-wrap pl-card-body py-3">
      <div class="pl-form-inline">
        <span class="pl-label">
          조회기간
        </span>
        <div class="pl-desc">
          <v-select
              class="pl-form type-middle"
              :items="YEAR_DROP"
              placeholder="선택하세요"
              v-model="srchParam.srchYear"
          ></v-select>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          VOC 유형
        </span>
        <div class="pl-desc">
          <v-select
              class="pl-form type-middle"
              placeholder="전체"
              :items="common_voc_cd_list"
              v-model="srchParam.srchVocCd"
              :disabled="common_voc_cd_list.length<2"
          ></v-select>
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
            :disabled="common_voc_cd_list.length<2"
            @click="getStatsVocByMonth"
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
        <div class="pl-grid-top-left">
          <ul class="pl-list-info mt-0">
            <li ><strong >사용방법!</strong> 최대 1년을 초과하여 조회하지 않도록 해주세요.</li>
          </ul>
        </div>
        <div class="pl-grid-top-utils">
          <v-btn class="pl-btn is-icon is-trans">
            <span class="pl-icon20 exceltemplate"></span>
            VOC별 상담메모
          </v-btn>
          <!-- 엑셀 다운로드 버튼 -->
          <compo-tooltip-btn
            TitleProp="엑셀 다운로드"
            ClassProp="pl-tooltip-btn "
            IconProp="pl-icon20 exceldown"
            TooltipPositionProp="bottom"
            @btnClick="mixin_testLog('엑셀 다운로드')"
          ></compo-tooltip-btn>
        </div>
      </div>
      <!-- grid -->
      <v-data-table
        class="pl-grid is-mt-s is-rowspan "
        :headers="headersRowSpan"
        :items="itemsRowSpan"
        fixed-header
        item-key="index"
        height="598px"
        :loading="isLoading"
        :items-per-page="itemsRowSpan.length"
        hide-default-footer
        no-data-text="등록된 데이터가 없습니다."
        >
        <!-- 합계 -->
        <template slot="footer">
          <div class="pl-grid-sum">
            <table >
              <colgroup>
                <col v-for="(col, index) in headersRowSpan" :key="index" :width=col.width />
              </colgroup>
              <tbody >
                <tr >
                  <td class="pl-grid-sum-head text-center" >총계</td>
                  <td class="text-right" >{{ this.totCntObject.CNT_01 }}</td>
                  <td class="text-right" >{{ this.totCntObject.CNT_02 }}</td>
                  <td class="text-right" >{{ this.totCntObject.CNT_03 }}</td>
                  <td class="text-right" >{{ this.totCntObject.CNT_04 }}</td>
                  <td class="text-right" >{{ this.totCntObject.CNT_05 }}</td>
                  <td class="text-right" >{{ this.totCntObject.CNT_06 }}</td>
                  <td class="text-right" >{{ this.totCntObject.CNT_07 }}</td>
                  <td class="text-right" >{{ this.totCntObject.CNT_08 }}</td>
                  <td class="text-right" >{{ this.totCntObject.CNT_09 }}</td>
                  <td class="text-right" >{{ this.totCntObject.CNT_10 }}</td>
                  <td class="text-right" >{{ this.totCntObject.CNT_11 }}</td>
                  <td class="text-right" >{{ this.totCntObject.CNT_12 }}</td>
                  <td class="text-right" >{{ this.totCntObject.CNT_SUM }}</td>
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
export default {
  name: 'STA_M22100_TAB03', //월별 통계
  components: {
  },
  data() {
    return {

      modelYear: '2024년',
      itemsYear: ['2024년'],

      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 20,
      headersRowSpan: [
        { text: 'VOC 유형', value: 'CD_NM', align: 'center', width: '125px', sortable: false },
        { text: '01 월', value: 'CNT_01', align: 'center', width: '', sortable: false },
        { text: '02 월', value: 'CNT_02', align: 'center', width: '', sortable: false },
        { text: '03 월', value: 'CNT_03', align: 'center', width: '', sortable: false },
        { text: '04 월', value: 'CNT_04', align: 'center', width: '', sortable: false },
        { text: '05 월', value: 'CNT_05', align: 'center', width: '', sortable: false },
        { text: '06 월', value: 'CNT_06', align: 'center', width: '', sortable: false },
        { text: '07 월', value: 'CNT_07', align: 'center', width: '', sortable: false },
        { text: '08 월', value: 'CNT_08', align: 'center', width: '', sortable: false },
        { text: '09 월', value: 'CNT_09', align: 'center', width: '', sortable: false },
        { text: '10 월', value: 'CNT_10', align: 'center', width: '', sortable: false },
        { text: '11 월', value: 'CNT_11', align: 'center', width: '', sortable: false },
        { text: '12 월', value: 'CNT_12', align: 'center', width: '', sortable: false },
        { text: '합계', value: 'CNT_SUM', align: 'center', width: '7%', sortable: false },
      ],
      itemsRowSpan: [],
      srchParam : {
        srchYear : this.$moment().format("YYYY"),
        srchVocCd : '',
        srchCustcoId : '',
        srchDeptId : '',
        srchUserid : '',
        srchRcptChnCd : '',
      },
      clearProp : false,

      YEAR_DROP : [],
      list_common_code : [],
      common_ognz_list : [],
      common_voc_cd_list : [],
      custcoList : [],
      userList : [],
      selectedCustcoItem : {},
      selectedDeptItem : {},
      totCntObject : {},
      isLoading : false,
    }
  },
  async created() {
    //진행년도 설정(금년기준 -5, +5)
    const date = new Date();
    const curYear = date.getFullYear();
    for (let i = -10; i < 1; i++) {
      this.YEAR_DROP.unshift({ text: `${curYear + i}년`, value: (curYear + i).toString() });
    }
    this.srchParam.srchYear = curYear.toString();
    let codeName = ['CVT']; //접수채널, 처리매체코드
    this.list_common_code = await this.mixin_common_code_get_all_global(codeName);
    if (this.computedUserCenter < 0) {
      this.common_voc_cd_list = await this.mixin_common_code_get(this.list_common_code, 'CVT', '전체')
    } else {
      this.common_voc_cd_list = await this.mixin_common_code_get_global(this.list_common_code, 'CVT', this.computedUserCenter, '전체')
    }
    // 부서정보 조회
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
    if(!this.common_voc_cd_list.length<2){
      this.getStatsVocByDay();
    }
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
    async getStatsVocByMonth(){
      this.itemsRowSpan = []
      this.totCntObject = {}
      this.isLoading = true;
      let sUrl = '/api/biz/common/select/selectStatsVocByMonthly'
      let postParam = {
        SRCH_YEAR : this.srchParam.srchYear,
        SRCH_VOC_CD : this.srchParam.srchVocCd,
        SRCH_CUSTCO_ID : this.srchParam.srchCustcoId,
        SRCH_DEPT_ID : this.mixin_isEmpty(this.selectedDeptItem) ? '':this.selectedDeptItem.DEPT_ID,
        SRCH_USER_ID : this.srchParam.srchUserId,
      }
      let headParam = {
        head : { ns : 'lhcs.statistics.dao.xml.StaticticsVocMapper'}
      }
      try{
        const response = await this.common_postCall(sUrl, postParam, headParam);
        if (!response.HEADER.ERROR_FLAG) {
          response.DATA.map(item => {
            Object.keys(item).some((key) => {
              if(key.includes("CNT")){
                item[key] = Number(item[key]) > 999 ? this.mixin_convertNumToComma(Number(item[key])) : Number(item[key])
              }
            });
            if(item.CD_ID === 'CVT0'){
              this.totCntObject = item
            }else{
              this.itemsRowSpan.push(item)
            }
          })
        }
      }catch(e){
        this.isLoading = false;
      }
      this.isLoading = false;
    }
  },
  computed: {
  },
  watch: {
    async selectedCustcoItem() {
      this.srchParam.srchCustcoId = ''
      this.srchParam.srchCustcoId = this.selectedCustcoItem.CUSTCO_ID
      this.common_voc_cd_list = await this.mixin_common_code_get_global(this.list_common_code, 'CVT', this.selectedCustcoItem.CUSTCO_ID, '전체')
      this.srchParam.srchVocCd = '';
    }
  },
};
</script>

<style lang="scss" scoped>

</style>