<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                조회월
              </span>
              <div class="pl-desc">
                <div class="d-flex">
                  <compo-date-picker
                    NoTitleProp
                    PickerType="month"
                    DateType="dateInput"
                    :DateProp.sync="srchParam.srchYm"/>
                </div>
              </div>
            </div>

            <div class="pl-form-inline">
              <span class="pl-label">
                채널
              </span>
              <div class="pl-desc">
                <v-select
                    :items="common_rcv_chn_list"
                    v-model="srchParam.srchRcptChnCd"
                  class="pl-form type-middle is-sm"
                  placeholder="전체"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                인/아웃
              </span>
              <div class="pl-desc">
                <v-select
                    :items="mixin_common_code_get(list_common_code, 'CALL_TP', '전체')"
                  class="pl-form type-middle is-xs"
                  placeholder="전체"
                    v-model="srchParam.srchDrwiTypeCd"
                ></v-select>
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
                    :CustcoProp="'4'"
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
                @click="getStatsCallShare"
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
          <div class="spacing-wrap sp-8">
            <div>
              <strong class="pl-bullet-txt is-blue">월별 통계</strong>
            </div>
          </div>
        </div>
        <div class="pl-grid-top-utils">
          <!-- 엑셀 다운로드 버튼 -->
          <compo-excel
              TypeProp="Download"
              :DataHeaderProp="headersExcel"
              :DataBodyProp="[...itemsRowSpan, ...[totCntObject]]"
              :FileNameProp="`협업사후처리_${srchParam.srchYm.replaceAll('-','')}`"
              SheetNameProp="협업사후처리"
              :DisabledProp="mixin_isEmpty(itemsRowSpan)"
          />
        </div>
      </div>
      <!-- grid -->
      <v-data-table
        class="pl-grid is-mt-s is-rowspan is-header-lg"
        :headers="headersRowSpan"
        :items="itemsRowSpan"
        :loading="isLoading"
        fixed-header
        item-key="index"
        height="652px"
        :items-per-page="itemsRowSpan.length"
        hide-default-footer
        no-data-text="등록된 데이터가 없습니다."
        >
        <template v-slot:item="{ item, index }">
          <tr
            :class="mixin_getItemClass(item)"
            :key="index">
            <td
              v-if="index === 0 || item.L_CUTT_TYPE_NM !== itemsRowSpan[index - 1].L_CUTT_TYPE_NM"
              :rowspan="mixin_getRowCount(index, 'L_CUTT_TYPE_NM')"
              style="white-space: pre-wrap;"
              :class="mixin_getHeaderClass(headersRowSpan[0].align)">{{ item.L_CUTT_TYPE_NM }}</td>
            <td
              v-if="index === 0 || item.M_CUTT_TYPE_NM !== itemsRowSpan[index - 1].M_CUTT_TYPE_NM"
              :rowspan="mixin_getRowCount(index, 'M_CUTT_TYPE_NM')"
              style="white-space: pre-wrap;"
              :class="mixin_getHeaderClass(headersRowSpan[0].align)">{{ item.M_CUTT_TYPE_NM }}</td>
            <td
              v-if="index === 0 || item.S_CUTT_TYPE_NM !== itemsRowSpan[index - 1].S_CUTT_TYPE_NM"
              :rowspan="mixin_getRowCount(index, 'S_CUTT_TYPE_NM')"
              style="white-space: pre-wrap;"
              :class="mixin_getHeaderClass(headersRowSpan[1].align)">{{ item.S_CUTT_TYPE_NM }}</td>

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
            <td class="text-right"> {{ item.CNT_24 }} </td>
            <td class="text-right"> {{ item.CNT_25 }} </td>
            <td class="text-right"> {{ item.CNT_26 }} </td>
            <td class="text-right"> {{ item.CNT_27 }} </td>
            <td class="text-right"> {{ item.CNT_28 }} </td>
            <td class="text-right"> {{ item.CNT_29 }} </td>
            <td class="text-right"> {{ item.CNT_30 }} </td>
            <td class="text-right"> {{ item.CNT_31 }} </td>
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
                  <td class="pl-grid-sum-head text-center" colspan="3">총계</td>
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
                  <td class="text-right"> {{ totCntObject.CNT_24 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_25 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_26 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_27 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_28 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_29 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_30 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_31 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_SUM }} </td>
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

import CompoCuttTypeCombo from "@/components/CompoCuttTypeCombo.vue";

export default {
name:"MENU_STA_M1200", //협업 사후처리 통계
components: {
  CompoCuttTypeCombo
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
        { text: '상담유형_대', value: 'L_CUTT_TYPE_NM', align: 'center', width: '100px', sortable: false },
        { text: '상담유형_중', value: 'M_CUTT_TYPE_NM', align: 'center', width: '100px', sortable: false },
        { text: '상담유형_소', value: 'S_CUTT_TYPE_NM', align: 'center', width: '135px', sortable: false },
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
        { text: '합계', value: 'CNT_SUM', align: 'center', width: '50px', sortable: false },
      ],
    headersExcel:[],
    itemsRowSpan: [],
    srchParam : {
      srchYm : this.$moment(new Date()).format('YYYY-MM'),
      srchCustcoId : '4',
      srchDeptId : '',
      srchUserId : '',
      srchDrwiTypeCd : '',
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

  async created() {
    let codeName = ['CVC','CALL_TP']; //접수채널, 처리매체코드
    this.list_common_code = await this.mixin_common_code_get_all_global(codeName);
    if (this.computedUserCenter < 0) {
      this.common_rcv_chn_list = await this.mixin_common_code_get(this.list_common_code, 'CVC', '전체')
    } else {
      this.common_rcv_chn_list = await this.mixin_common_code_get_global(this.list_common_code, 'CVC', this.computedUserCenter, '전체')
    }
    // 상담지역조회
    this.common_ognz_list = await this.mixin_ognz_list();
    // 고객사 목록 조회
    this.custcoList = await this.mixin_ognz_list_center(this.common_ognz_list, 'CUSL', '' )

    // 해당 메뉴는 바로처리 센터에서만 사용하기 때문에 custco_id = 4 고정
    this.selectedCustcoItem = this.custcoList.find(item => item.CUSTCO_ID === "4")

    let header = _.cloneDeep(this.headersRowSpan)
    header.map(item=>{
      if(item.width === null || item.width === '' || item.width === undefined){
        item.width = '100px'
      }
      this.headersExcel.push(item)
    })

  },

  watch: {
    async selectedCustcoItem() {
      this.srchParam.srchCustcoId = ''
      this.srchParam.srchCustcoId = this.selectedCustcoItem.CUSTCO_ID
      this.srchParam.srchCuttType = '';
    },
  },
  computed: {

  },

  mounted() {
  },

  methods: {
    setCuttType(data){
      this.srchParam.srchCuttType = data[0];
      console.log(data)
      console.log(this.srchParam.srchCuttType)
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
    async getStatsCallShare(){
      this.isLoading = true;
      this.itemsRowSpan = []
      let sUrl = '/api/biz/common/select/selectStatsCallShare'
      let postParam = {
        SRCH_YM : this.srchParam.srchYm.replaceAll('-',''),
        SRCH_CUSTCO_ID : this.srchParam.srchCustcoId,
        SRCH_DEPT_ID : this.selectedDeptItem.DEPT_ID,
        SRCH_CUTT_TYPE : this.srchParam.srchCuttType,
        SRCH_USER_ID : this.srchParam.srchUserId,
        SRCH_RCPT_CHN_CD : this.srchParam.srchRcptChnCd,
        SRCH_DRWI_TYPE_CD : this.srchParam.srchDrwiTypeCd,
      }
      let headParam = {
        head : {
          ns : 'lhcs.statistics.dao.xml.StaticticsCuttTypeMapper'
        },
        timeout : 300000
      }

      try{
        const response = await this.common_postCall(sUrl, postParam, headParam)
        if (!response.HEADER.ERROR_FLAG) {
          response.DATA.map(item => {
            Object.keys(item).some((key) => {
              if (key.includes("CNT")) {
                item[key] = Number(item[key]) > 999 ? this.mixin_convertNumToComma(Number(item[key])) : Number(item[key])
              }
            });
            if (item.CUTT_TYPE_ID === '00') {
              this.totCntObject = item;
            } else {
              this.itemsRowSpan.push(item)
            }
          })
          this.isLoading = false;
        }
      }catch(e){
        this.isLoading = false;
      }
    }

  },
}
</script>

<style lang="scss" scoped>

</style>