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
                업체
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form is-search type-middle"
                  placeholder="검색어 입력"
                  v-model="srchParam.srchFrmNm"
                  clearable
                  @change="()=>{
                    if(mixin_isEmpty(srchParam.srchFrmNm)) srchParam.srchFrmCd = ''
                  }"
                  @keydown.enter="mixin_showDialog('FindAsIcpr')"
                  >
                  <template v-slot:append>
                    <v-btn
                      @click="mixin_showDialog('FindAsIcpr')"
                      class="pl-btn has-icon-only">
                      <span class="pl-icon20 in-search"></span>
                    </v-btn>
                  </template>
                </v-text-field>
              </div>
            </div>
            <div class="pl-form-inline">
          <span class="pl-label">
            단지
          </span>
              <div class="pl-desc">
                <v-text-field
                    v-model="srchParam.srchMgofNm"
                    class="pl-form is-search type-middle is-md"
                    placeholder="검색어 입력"
                    clearable
                    @change="()=>{
                      if(mixin_isEmpty(srchParam.srchMgofNm)) srchParam.srchMgofCd = ''
                    }"
                    @keyup.enter="openSrchMgof"
                >
                  <template v-slot:append>
                    <v-btn
                        @click="openSrchMgof"
                        class="pl-btn has-icon-only">
                      <span class="pl-icon20 in-search"></span>
                    </v-btn>
                  </template>
                </v-text-field>
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
                @click="getStatsFrmCustCntct"
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
            <strong class="pl-bullet-txt is-blue">업체 및 고객 접촉율</strong>
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
          :loading="isLoading"
          item-class="cellClass"
          fixed-header
          item-key="index"
          height="652px"
          :items-per-page="ROW_PER_PAGE"
          hide-default-header
          hide-default-footer
          no-data-text="등록된 데이터가 없습니다."
          @dblclick:row="showDetail()"
          :page.sync="page"
          @page-count="pageCount = $event">
          <!-- 헤더 -->
          <template v-slot:header>
            <thead class="v-data-table-header multi-row">
              <tr>
                <th rowspan="2" width="50px" class="text-center"><span>NO</span></th>
                <th rowspan="2" width="180px" class="text-center"><span>팀</span></th>
                <th rowspan="2" width="150px" class="text-center"><span>상담사</span></th>
                <th rowspan="2" width="7.5%" class="text-center"><span>분배건수</span></th>
                <th rowspan="2" width="7.5%" class="text-center"><span>분배미접촉건</span></th>
                <th colspan="4" width="30%" class="text-center"><span>업체접촉</span></th>
                <th colspan="4" width="30%" class="text-center"><span>고객접촉</span></th>
              </tr>
              <tr>
                <th class="text-center"><span>접촉건</span></th>
                <th class="text-center"><span>미접촉건</span></th>
                <th class="text-center"><span>접촉률</span></th>
                <th class="text-center"><span>미접촉률</span></th>
                <th class="text-center"><span>접촉건</span></th>
                <th class="text-center"><span>미접촉건</span></th>
                <th class="text-center"><span>접촉률</span></th>
                <th class="text-center"><span>미접촉률</span></th>
              </tr>
            </thead>
          </template>

          <template v-slot:item.DIST_CNT="{ item }">
            <td class="text-right is-txt-blue is-hover"
                style="position: relative;
                cursor: pointer;"
                @click="openDetail(true,item)"
            >{{ item.DIST_CNT }}</td>
          </template>
          <template v-slot:item.CNTCT_NOT_CNT="{ item }">
            <td class="text-right is-txt-blue is-hover"
                style="position: relative;
                cursor: pointer;"
                @click="openDetail(false,item)"
            >{{ item.CNTCT_NOT_CNT }}</td>
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
                    <td class="pl-grid-sum-head text-center" colspan="3">{{ totCntObject.USER_NM }}</td>
                    <td class="text-right" >{{totCntObject.DIST_CNT}}</td>
                    <td class="text-right" >{{totCntObject.CNTCT_NOT_CNT}}</td>
                    <td class="text-right" >{{totCntObject.FRM_CNT}}</td>
                    <td class="text-right" >{{totCntObject.FRM_NOT_CNT}}</td>
                    <td class="text-right" >{{totCntObject.FRM_RATE}}</td>
                    <td class="text-right" >{{totCntObject.FRM_NOT_RATE}}</td>
                    <td class="text-right" >{{totCntObject.CUST_CNT}}</td>
                    <td class="text-right" >{{totCntObject.CUST_NOT_CNT}}</td>
                    <td class="text-right" >{{totCntObject.CUST_RATE}}</td>
                    <td class="text-right" >{{totCntObject.CUST_NOT_RATE}}</td>
<!--                    <td class="text-right" >-->
<!--                      {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "DIST_CNT")) }}-->
<!--                    </td>-->
<!--                    <td class="text-right" >-->
<!--                      {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "CNTCT_NOT_CNT")) }}-->
<!--                    </td>-->
<!--                    <td class="text-right" >-->
<!--                      {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "FRM_CNT")) }}-->
<!--                    </td>-->
<!--                    <td class="text-right" >-->
<!--                      {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "FRM_NOT_CNT")) }}-->
<!--                    </td>-->
<!--                    <td class="text-right" >-->
<!--                      {{ mixin_avg_field(this.itemsRowSpan, "FRM_RATE") }}-->
<!--                    </td>-->
<!--                    <td class="text-right" >-->
<!--                      {{ mixin_avg_field(this.itemsRowSpan, "FRM_NOT_RATE") }}-->
<!--                    </td>-->
<!--                    <td class="text-right" >-->
<!--                      {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "CUST_CNT")) }}-->
<!--                    </td>-->
<!--                    <td class="text-right" >-->
<!--                      {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "CUST_NOT_CNT")) }}-->
<!--                    </td>-->
<!--                    <td class="text-right" >-->
<!--                      {{ mixin_avg_field(this.itemsRowSpan, "CUST_RATE") }}-->
<!--                    </td>-->
<!--                    <td class="text-right" >-->
<!--                      {{ mixin_avg_field(this.itemsRowSpan, "CUST_NOT_RATE") }}-->
<!--                    </td>-->
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
        </v-data-table>

      </div>
    </div>
    <!-- dialog: 업체검색 -->
    <v-dialog
        v-if="dialogFindAsIcpr"
        v-model="dialogFindAsIcpr"
        width="1410"
        content-class="dialog-draggable is-lg"
        hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
          header-title="담당자 검색"
          @hide="mixin_hideDialog('FindAsIcpr')"
          @="submitDialog('FindAsIcpr')"
      >
        <template slot="body">
          <CompoFindAsIcpr
              :DataProp="{FRM_NM : srchParam.srchFrmNm}"
              @setItem="setIcpr"
              @closeDialog="mixin_hideDialog('FindAsIcpr')"
          />
        </template>
      </compo-dialog>
    </v-dialog>
    <!-- dialog : 상세 -->
  </div>
</template>

<script>
import CompoFindAsIcpr from "@/components/CompoFindAsIcpr.vue";
export default {
  name: 'MENU_STA_M1600', //업체 및 고객 접촉율
  components: {
    CompoFindAsIcpr
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
        { text: '팀', value: 'DEPT_NM', align: '', width: '180px', sortable: false },
        { text: '상담사', value: 'USER_NM', align: '', width: '150px', sortable: false },
        { text: '분배건수', value: 'DIST_CNT', align: 'right', width: '7.5%', sortable: false },
        { text: '분배미접촉건', value: 'CNTCT_NOT_CNT', align: 'right', width: '7.5%', sortable: false },
        { text: '접촉건', value: 'FRM_CNT', align: 'right', width: '7.5%', sortable: false },
        { text: '미접촉건', value: 'FRM_NOT_CNT', align: 'right', width: '7.5%', sortable: false },
        { text: '접촉률', value: 'FRM_RATE', align: 'right', width: '7.5%', sortable: false },
        { text: '미접촉률', value: 'FRM_NOT_RATE', align: 'right', width: '7.5%', sortable: false },
        { text: '접촉건', value: 'CUST_CNT', align: 'right', width: '7.5%', sortable: false },
        { text: '미접촉건', value: 'CUST_NOT_CNT', align: 'right', width: '7.5%', sortable: false },
        { text: '접촉률', value: 'CUST_RATE', align: 'right', width: '7.5%', sortable: false },
        { text: '미접촉률', value: 'CUST_NOT_RATE', align: 'right', width: '7.5%', sortable: false },
      ],
      headersExcel: [
        { text: 'No', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '팀', value: 'DEPT_NM', align: '', width: '180px', sortable: false },
        { text: '상담사', value: 'USER_NM', align: '', width: '150px', sortable: false },
        { text: '분배건수', value: 'DIST_CNT', align: 'right', width: '100px', sortable: false },
        { text: '분배미접촉건', value: 'CNTCT_NOT_CNT', align: 'right', width: '100px', sortable: false },
        { text: '접촉건', value: 'FRM_CNT', align: 'right', width: '100px', sortable: false },
        { text: '미접촉건', value: 'FRM_NOT_CNT', align: 'right', width: '100px', sortable: false },
        { text: '접촉률', value: 'FRM_RATE', align: 'right', width: '100px', sortable: false },
        { text: '미접촉률', value: 'FRM_NOT_RATE', align: 'right', width: '100px', sortable: false },
        { text: '접촉건', value: 'CUST_CNT', align: 'right', width: '100px', sortable: false },
        { text: '미접촉건', value: 'CUST_NOT_CNT', align: 'right', width: '100px', sortable: false },
        { text: '접촉률', value: 'CUST_RATE', align: 'right', width: '100px', sortable: false },
        { text: '미접촉률', value: 'CUST_NOT_RATE', align: 'right', width: '100px', sortable: false },
      ],
      itemsRowSpan: [],
      srchParam : {
        srchStartDt : this.$moment(new Date()).format('YYYY-MM-DD'),
        srchEndDt : this.$moment(new Date()).format('YYYY-MM-DD'),
        srchCustcoId : '4',
        srchDeptId : '',
        srchFrmCd: '',
        srchFrmNm : '',
        srchMgofCd : '',
        srchMgofNm : '',
        srchUserId : '',
      },
      detailParam : {
        srchStartDt : this.$moment(new Date()).format('YYYY-MM-DD'),
        srchEndDt : this.$moment(new Date()).format('YYYY-MM-DD'),
        srchCustcoId : '4',
        srchDeptId : '',
        srchFrmCd: '',
        srchFrmNm : '',
        srchMgofCd : '',
        srchMgofNm : '',
        srchUserId : '',
        srchDistYn : false
      },
      dialogDetail : false,
      dialogFindAsIcpr : false,
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
        , DIST_CNT : 0
        , CNTCT_NOT_CNT : 0
        , FRM_CNT : 0
        , FRM_NOT_CNT : 0
        , FRM_RATE : 0
        , FRM_NOT_RATE : 0
        , CUST_CNT : 0
        , CUST_NOT_CNT : 0
        , CUST_RATE : 0
        , CUST_NOT_RATE : 0
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
    setIcpr(item) {
      this.srchParam.srchFrmCd = item.FRM_CD;
      this.srchParam.srchFrmNm = item.FRM_NM;
      this.mixin_hideDialog('FindAsIcpr')
    },
    setBldgAdr(item) {
      this.srchParam.srchMgofCd = item.MGOF_CD;
      if (item.BLDG_ADR && item.BLDG_ADR != '') {
        this.srchParam.srchMgofNm = item.BLDG_ADR;
      } else {
        this.srchParam.srchMgofNm = item.MGOF_NM;
      }
    },
    openSrchMgof(){
      this.mixin_openSearchWindow( 'LayoutSearchPopup', '1140', '569', {compo_name : 'CompoFindAsBldgAdr', callback : 'setBldgAdr', title: '단지/동주소', popData: { MGOF_NM : this.srchParam.srchMgofNm}});
    },
    async getStatsFrmCustCntct(){
      this.itemsRowSpan = []
      this.isLoading = true;
      let sUrl = '/api/biz/common/select/selectStatsFrmCustCntct'
      let postParam = {
        SRCH_START_DT : this.srchParam.srchStartDt.replaceAll('-',''),
        SRCH_END_DT : this.srchParam.srchEndDt.replaceAll('-',''),
        SRCH_DEPT_ID : this.selectedDeptItem.DEPT_ID,
        SRCH_USER_ID : this.srchParam.srchUserId,
        SRCH_FRM_CD : this.srchParam.srchFrmCd,
        SRCH_MGOF_CD : this.srchParam.srchMgofCd,
      }
      let headParam = {
        head : {
          ns : 'lhcs.statistics.dao.xml.StatisticsFlawMapper'
        },
        timeout : 300000
      }

      const response = await this.common_postCall(sUrl,postParam, headParam)
      if( !response.HEADER.ERROR_FLAG ){
        response.DATA.map(item=>{
          Object.keys(item).some((key) => {
            if(key.includes("CNT")){
              item[key] = Number(item[key]) > 999 ? this.mixin_convertNumToComma(Number(item[key])) : Number(item[key])
            }
          });
          this.itemsRowSpan.push(item)
        })
        Object.keys(this.totCntObject).some((key) => {
          if (key.includes("CNT")) {
            this.totCntObject[key] = this.mixin_convertNumToComma(this.mixin_sum_field(this.itemsRowSpan, key))
          }else if(key.includes("RATE")){
            this.totCntObject[key] = this.mixin_avg_field(this.itemsRowSpan, key)
          }
        })
      }
      this.isLoading = false;
    },
    openDetail(flag,item){
      this.detailParam = {
         type : 'frmCustCntct',
         SRCH_START_DT : this.srchParam.srchStartDt.replaceAll('-',''),
         SRCH_END_DT : this.srchParam.srchEndDt.replaceAll('-',''),
         SECH_DEPT_ID : item.DEPT_ID,
         SRCH_USER_ID : item.USER_ID,
         SRCH_FRM_CD : this.srchParam.srchFrmCd,
         SRCH_MGOF_CD : this.srchParam.srchMgofCd,
         SRCH_DIST_YN : flag ? 'Y' : 'N'
      }

      // this.mixin_showDialog('Detail')
      this.mixin_openWindow( 'LayoutPopup', '1600', '900',
          {
            compo_name : 'STA_M1600_DIALOG'
            , callback : 'getPopData'
            , title : `상담사별 업체 및 고객 ${this.srchParam.srchDistYn ? '분배' : '미분배'} 상세`
            , srchProp : this.detailParam
          })
    },
    closeDetail(){
      this.mixin_hideDialog('Detail')
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