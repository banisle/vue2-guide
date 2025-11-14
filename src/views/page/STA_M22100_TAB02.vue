<template>
  <div>
    <!-- sub top -->
    <div class="pl-form-inline-wrap pl-card-body py-3">
      <div class="pl-form-inline">
        <span class="pl-label">
          조회기간
        </span>
        <div class="pl-desc">
          <div class="d-flex">
            <compo-date-picker
              NoTitleProp
              PickerType="month"
              DateType="dateInput"
              :DateProp.sync="srchParam.srchStartYm"/>
            <span class="pl-unit">~</span>
            <compo-date-picker
              NoTitleProp
              PickerType="month"
              DateType="dateInput"
              :DateProp.sync="srchParam.srchEndYm"/>
          </div>
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
          @click="getStatsVocByDay"
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
        class="pl-grid is-mt-s is-rowspan is-header-lg"
        :headers="headersRowSpan"
        :items="itemsRowSpan"
        fixed-header
        item-key="index"
        :loading="isLoading"
        height="598px"
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
                  <td class="text-right" >{{ this.totCntObject.CNT_13 }}</td>
                  <td class="text-right" >{{ this.totCntObject.CNT_14 }}</td>
                  <td class="text-right" >{{ this.totCntObject.CNT_15 }}</td>
                  <td class="text-right" >{{ this.totCntObject.CNT_16 }}</td>
                  <td class="text-right" >{{ this.totCntObject.CNT_17 }}</td>
                  <td class="text-right" >{{ this.totCntObject.CNT_18 }}</td>
                  <td class="text-right" >{{ this.totCntObject.CNT_19 }}</td>
                  <td class="text-right" >{{ this.totCntObject.CNT_20 }}</td>
                  <td class="text-right" >{{ this.totCntObject.CNT_21 }}</td>
                  <td class="text-right" >{{ this.totCntObject.CNT_22 }}</td>
                  <td class="text-right" >{{ this.totCntObject.CNT_23 }}</td>
                  <td class="text-right" >{{ this.totCntObject.CNT_24 }}</td>
                  <td class="text-right" >{{ this.totCntObject.CNT_25 }}</td>
                  <td class="text-right" >{{ this.totCntObject.CNT_26 }}</td>
                  <td class="text-right" >{{ this.totCntObject.CNT_27 }}</td>
                  <td class="text-right" >{{ this.totCntObject.CNT_28 }}</td>
                  <td class="text-right" >{{ this.totCntObject.CNT_29 }}</td>
                  <td class="text-right" >{{ this.totCntObject.CNT_30 }}</td>
                  <td class="text-right" >{{ this.totCntObject.CNT_31 }}</td>
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
  name: 'STA_M22100_TAB02', //일별 통계
  components: {
  },
  data() {
    return {
      date2: '2024-11',
      date3: '2024-11',
      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 20,
      headersRowSpan: [
        { text: 'VOC유형', value: 'CD_NM', align: 'center', width: '125px', sortable: false },
        { text: '01 일', value: 'CNT_01', align: 'center', width: '', sortable: false },
        { text: '02 일', value: 'CNT_02', align: 'center', width: '', sortable: false },
        { text: '03 일', value: 'CNT_03', align: 'center', width: '', sortable: false },
        { text: '04 일', value: 'CNT_04', align: 'center', width: '', sortable: false },
        { text: '05 일', value: 'CNT_05', align: 'center', width: '', sortable: false },
        { text: '06 일', value: 'CNT_06', align: 'center', width: '', sortable: false },
        { text: '07 일', value: 'CNT_07', align: 'center', width: '', sortable: false },
        { text: '08 일', value: 'CNT_08', align: 'center', width: '', sortable: false },
        { text: '09 일', value: 'CNT_09', align: 'center', width: '', sortable: false },
        { text: '10 일', value: 'CNT_10', align: 'center', width: '', sortable: false },
        { text: '11 일', value: 'CNT_11', align: 'center', width: '', sortable: false },
        { text: '12 일', value: 'CNT_12', align: 'center', width: '', sortable: false },
        { text: '13 일', value: 'CNT_13', align: 'center', width: '', sortable: false },
        { text: '14 일', value: 'CNT_14', align: 'center', width: '', sortable: false },
        { text: '15 일', value: 'CNT_15', align: 'center', width: '', sortable: false },
        { text: '16 일', value: 'CNT_16', align: 'center', width: '', sortable: false },
        { text: '17 일', value: 'CNT_17', align: 'center', width: '', sortable: false },
        { text: '18 일', value: 'CNT_18', align: 'center', width: '', sortable: false },
        { text: '19 일', value: 'CNT_19', align: 'center', width: '', sortable: false },
        { text: '20 일', value: 'CNT_20', align: 'center', width: '', sortable: false },
        { text: '21 일', value: 'CNT_21', align: 'center', width: '', sortable: false },
        { text: '22 일', value: 'CNT_22', align: 'center', width: '', sortable: false },
        { text: '23 일', value: 'CNT_23', align: 'center', width: '', sortable: false },
        { text: '24 일', value: 'CNT_24', align: 'center', width: '', sortable: false },
        { text: '25 일', value: 'CNT_25', align: 'center', width: '', sortable: false },
        { text: '26 일', value: 'CNT_26', align: 'center', width: '', sortable: false },
        { text: '27 일', value: 'CNT_27', align: 'center', width: '', sortable: false },
        { text: '28 일', value: 'CNT_28', align: 'center', width: '', sortable: false },
        { text: '29 일', value: 'CNT_29', align: 'center', width: '', sortable: false },
        { text: '30 일', value: 'CNT_30', align: 'center', width: '', sortable: false },
        { text: '31 일', value: 'CNT_31', align: 'center', width: '', sortable: false },
        { text: '합계', value: 'CNT_SUM', align: 'center', width: '5%', sortable: false },
      ],
      itemsRowSpan: [],
      srchParam : {
        srchStartYm : this.$moment().format("YYYY-MM"),
        srchEndYm : this.$moment().format("YYYY-MM"),
        srchVocCd : '',
        srchCustcoId : '',
        srchDeptId : '',
        srchUserid : '',
        srchRcptChnCd : '',
      },
      clearProp : false,

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
    async getStatsVocByDay(){
      this.itemsRowSpan = []
      this.totCntObject = {}
      this.isLoading = true;
      let sUrl = '/api/biz/common/select/selectStatsVocByDaily'
      let postParam = {
        SRCH_START_YM : this.srchParam.srchStartYm.replaceAll('-',''),
        SRCH_END_YM : this.srchParam.srchEndYm.replaceAll('-',''),
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