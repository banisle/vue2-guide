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
                @click="getStatsFrstCntctPgrs"
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
              <li ><strong class="is-txt-red" >재보수 지시 건 제외</strong></li>
            </ul>
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
          class="pl-grid is-mt-s"
          :headers="headersRowSpan"
          :items="itemsRowSpan"
          item-class="cellClass"
          :loading="isLoading"
          fixed-header
          item-key="index"
          height="calc(100vh - 262px)"
          :items-per-page="itemsRowSpan.length"
          hide-default-footer
          no-data-text="등록된 데이터가 없습니다."
          @dblclick:row="showDetail()"
          :page.sync="page"
          @page-count="pageCount = $event">
          <template v-slot:item="{ item,index }">
            <tr class="text-center"
                :key="index">
              <td v-for="(col, idx) in headersRowSpan"
                  :key="col.value"
                  :class="`text-center ${idx > 1 ? item[col.value] !== '0' ? 'is-hover is-txt-blue':'':''}`"
                  :style="getStyle(col.value)"
                  @click="openDetail(col.value, item)"
              >
                {{ item[col.value] }}
              </td>
            </tr>
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
  </div>
</template>

<script>
import CompoFindAsIcpr from "@/components/CompoFindAsIcpr.vue";

export default {
  name: 'MENU_STA_M1700', //업체별 고객 최초 접촉경과 기간
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
        { text: '구분', value: 'CNTCT_CHNL_NM', align: '', width: '180px', sortable: false },
        { text: '상담사', value: 'USER_NM', align: '', width: '150px', sortable: false },
        { text: '0일', value: 'DAY0', align: 'right', width: '', sortable: false },
        { text: '1일', value: 'DAY1', align: 'right', width: '', sortable: false },
        { text: '2일', value: 'DAY2', align: 'right', width: '', sortable: false },
        { text: '3일', value: 'DAY3', align: 'right', width: '', sortable: false },
        { text: '4일', value: 'DAY4', align: 'right', width: '', sortable: false },
        { text: '5일', value: 'DAY5', align: 'right', width: '', sortable: false },
        { text: '6일', value: 'DAY6', align: 'right', width: '', sortable: false },
        { text: '7일 이상', value: 'DAY7_OVER', align: 'right', width: '', sortable: false },
      ],
      headersExcel: [
        { text: '구분', value: 'CNTCT_CHNL_NM', align: '', width: '180px', sortable: false },
        { text: '상담사', value: 'USER_NM', align: '', width: '150px', sortable: false },
        { text: '0일', value: 'DAY0', align: 'right', width: '100px', sortable: false },
        { text: '1일', value: 'DAY1', align: 'right', width: '100px', sortable: false },
        { text: '2일', value: 'DAY2', align: 'right', width: '100px', sortable: false },
        { text: '3일', value: 'DAY3', align: 'right', width: '100px', sortable: false },
        { text: '4일', value: 'DAY4', align: 'right', width: '100px', sortable: false },
        { text: '5일', value: 'DAY5', align: 'right', width: '100px', sortable: false },
        { text: '6일', value: 'DAY6', align: 'right', width: '100px', sortable: false },
        { text: '7일 이상', value: 'DAY7_OVER', align: 'right', width: '100px', sortable: false },
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
      detailParam : {},
      clearProp : false,
      dialogFindAsIcpr : false,

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
    getStyle(value){
      let style = value.includes('DAY') ? 'position: relative;cursor: pointer;' :'';
      return style;
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
      this.mixin_openSearchWindow( 'LayoutSearchPopup', '1140', '569', {compo_name : 'CompoFindAsBldgAdr', callback : 'setBldgAdr', title: '단지/동주소', popData: {MGOF_NM : this.srchParam.srchMgofNm}});
    },
    async getStatsFrstCntctPgrs(){
      this.itemsRowSpan = []
      this.isLoading = true;
      let sUrl = '/api/biz/common/select/selectStatsFrstCntctPgrs'
      let postParam = {
        SRCH_START_DT : this.srchParam.srchStartDt.replaceAll('-',''),
        SRCH_END_DT : this.srchParam.srchEndDt.replaceAll('-',''),
        SRCH_CUSTCO_ID : this.srchParam.srchCustcoId,
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
            if(key.includes("DAY")){
              item[key] = Number(item[key]) > 999 ? this.mixin_convertNumToComma(Number(item[key])) : Number(item[key])
            }
          });
          this.itemsRowSpan.push(item)
        })
      }
      this.isLoading = false;
    },
    openDetail(day, item){
      console.log("sdsds  ",day.charAt(3), item)
      this.detailParam = {
        type : 'frstCntctPgrs',
        SRCH_START_DT : this.srchParam.srchStartDt.replaceAll('-',''),
        SRCH_END_DT : this.srchParam.srchEndDt.replaceAll('-',''),
        SECH_DEPT_ID : item.DEPT_ID,
        SRCH_USER_ID : item.USER_ID,
        SRCH_FRM_CD : this.srchParam.srchFrmCd,
        SRCH_MGOF_CD : this.srchParam.srchMgofCd,
        SRCH_CNTCT_CHNL_CD : item.CNTCT_CHNL_NM ==='고객'? 'CUST':'FRM',
        SRCH_DAY : day.charAt(3)
      }
      this.mixin_openWindow( 'LayoutPopup', '1600', '900',
          {
            compo_name : 'STA_M1600_DIALOG'
            , callback : 'getPopData'
            , title : '업체별 고객 최초 접촉경과기간 상세'
            , srchProp : this.detailParam
          })
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