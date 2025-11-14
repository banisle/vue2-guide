<template>
  <div class="pl-container">
   <div class="pl-card-wrap">
    <!-- sub top -->
    <compo-sub-layout-top  >
      <template slot="search">
        <div class="pl-form-inline-wrap">
          <div class="pl-form-inline">
            <span class="pl-label">
              예약일
            </span>
            <div class="pl-desc">
              <compo-date-range-picker
                :StartDayProp.sync="srchRsrvStartDt"
                :EndDayProp.sync="srchRsrvEndDt"
                @startDayChange="mixin_testLog(srchRsrvStartDt)"
                @endDayChange="mixin_testLog(srchRsrvEndDt)"
                ParentStyleProp="width: 306px"
              />
            </div>
          </div>

          <div class="pl-form-inline">
            <span class="pl-label">
              처리여부
            </span>
            <div class="pl-desc">
              <v-select
                :items="procItems"
                v-model="srchProcYn"
                class="pl-form type-middle"
                placeholder="전체"
              ></v-select>
            </div>
          </div>
          <div class="pl-form-inline">
              <span class="pl-label">
                부서/상담사
              </span>
            <div class="pl-desc"
                 v-if="computedUserCenter < 0 ? true : false"
            >
              <v-select
                  class="pl-form type-middle is-sm"
                  placeholder="전체"
                  :items="custcoList"
                  v-model="selectedCustcoItem"
                  return-object
              ></v-select>
            </div>
            <v-select
                v-model="selectedDeptItem"
                class="pl-form type-middle"
                :items="mixin_ognz_list_detail(common_ognz_list, selectedCustcoItem.DEPT_ID, '전체' ,'Y'/*콜센터여부,없으면전체*/)"
                return-object
                item-value="DEPT_ID"
                placeholder="전체"
                :disabled="mixin_isEmpty(selectedCustcoItem) || (computedUserDetailType ==='TEAM_LEADER' || computedUserDetailType === 'MANAGER')"
            ></v-select>
<!--            @change="getUserList"-->
            <v-autocomplete
                v-model="srchUserId"
                :items="userList"
                item-text="USER_NM"
                item-value="USER_ID"
                class="pl-form type-middle"
                placeholder="전체"
                :disabled="mixin_isEmpty(selectedDeptItem.DEPT_ID) || computedUserDetailType === 'MANAGER'"
            ></v-autocomplete>
          </div>

          <div class="pl-form-inline">
            <span class="pl-label">
              전화번호
            </span>
            <div class="pl-desc">
              <v-text-field
                class="pl-form type-middle"
                placeholder="전화번호 입력"
                v-model="srchRsrvTelNo"
                @keydown.enter="getCallRsrvList(false)"
              />
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              고객명
            </span>
            <div class="pl-desc">
              <v-text-field
                class="pl-form type-middle"
                placeholder="발송자 입력"
                v-model="srchCustNm"
                @keydown.enter="getCallRsrvList(false)"
              />
            </div>
          </div>
          <div>
            <v-btn
              class="pl-btn is-icon"
              @click="getCallRsrvList(false);"
              :disabled="isLoading"
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
          <v-btn class="pl-btn is-icon is-trans"
                 @click="beforeDel"
                 :disabled="mixin_isEmpty(chkRsrvItem)"
          >
            <span class="pl-icon20 trash"></span>
             삭제
          </v-btn>
        </div>
        <div class="pl-grid-top-utils">
          <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ callRsrvList.length }})</em> 건</span>
          <!-- 엑셀 다운로드 버튼 -->
          <compo-excel
              TitleProp="엑셀 다운로드"
              TypeProp="Download"
              :DataHeaderProp="headers"
              :DataBodyProp="callRsrvList"
              :FileNameProp="`통화예약현황(${srchRsrvStartDt.replaceAll('-','')}-${srchRsrvEndDt.replaceAll('-','')})`"
              :SheetNameProp="`통화예약현황`"
              HeaderColorProp="00B0F0"
              :DisabledProp="mixin_isEmpty(callRsrvList)"
          ></compo-excel>
        </div>
      </div>
      <!-- grid -->
      <v-data-table
        class="pl-grid is-mt-s has-control"
        :headers="headers"
        :items="callRsrvList"
        v-model="chkRsrvItem"
        show-select
        fixed-header
        item-key="RCPT_PHN_ID"
        height="calc(-306px + 100vh)"
        :items-per-page="ROW_PER_PAGE"
        hide-default-footer
        :loading="isLoading"
        :page.sync="page"
        no-data-text="등록된 데이터가 없습니다."
        @page-count="pageCount = $event">

      </v-data-table>
      <div class="pl-pager">
        <div class="pl-pager-row">
          <span>페이지당 항목 수</span>
          <v-select
            class="pl-form"
            :value="ROW_PER_PAGE"
            :items="perPage"
            :item-text="toString(ROW_PER_PAGE)"
            @change="ROW_PER_PAGE = parseInt($event, 10);"
          ></v-select>
        </div>
        <v-pagination
          v-model="page"
          :length="pageCount"
          circle
          :total-visible="7">
        </v-pagination>

        <!-- 더보기 다음 있을때만 노출 -->
        <span class="pl-pager-period">
          보기 {{ mixin_getPagePeriod(callRsrvList, page) }} / {{ callRsrvList.length }}
          <compo-tooltip-btn
            TitleProp="다음 검색"
            ClassProp="pl-tooltip-btn is-line"
            IconProp="pl-icon20 arrow-next-paging"
            TooltipPositionProp="bottom"
            @click="getCallRsrvList(true)"
            :DisabledProp="nextDisabled"
          ></compo-tooltip-btn>
        </span>
      </div>
    </div>

   </div>
 </div>
</template>

<script>

export default {
  name: "MENU_CSL_M0700", //통화 예약 현황
  components: {
  },
  data() {
    return {

      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 30,
      pagination: {
        page: 1,
        rowsPerPage: 500,
        sortBy: "",
        descending: ""
      }, //그리드 페이지속성정의
      nextDisabled : false,
      isLoading : false,


      callRsrvList : [],
      chkRsrvItem : [],
      common_ognz_list : [],
      common_cusl_List : [],
      headers: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '등록일시', value: 'REG_DT', align: 'left', width: '150px', sortable: true },
        { text: '예약일시', value: 'RSRV_DT', align: 'left', width: '150px', sortable: false },
        { text: '예약내용', value: 'RSRV_CNTNT', align: 'left', width: '', sortable: false },
        { text: '처리여부', value: 'PROC_YN_NM', align: 'left', width: '8%', sortable: false },
        { text: '고객명', value: 'CUST_NM', align: 'left', width: '8%', sortable: false },
        { text: '예약전화', value: 'RSRV_TEL_NO', align: 'left', width: '8%', sortable: false },
        { text: '예약자', value: 'USER_NM', align: 'left', width: '8%', sortable: false },
      ],

      selectedCustcoItem: {},
      selectedDeptItem: {},
      custcoList: [],
      deptList: [],
      userList: [],

      srchRsrvStartDt: this.$moment(new Date()).subtract(14,'days').format('YYYY-MM-DD'),
      srchRsrvEndDt: this.$moment(new Date()).format('YYYY-MM-DD'),
      srchProcYn: '',
      srchDeptId: '',
      srchUserId: '',
      srchRsrvTelNo: '',
      srchCustNm: '',
      procItems:[
        {text : '전체', value : ''},
        {text : '처리완료', value : 'Y'},
        {text : '미처리', value : 'N'}
      ],

    }
  },
  async created() {
    this.common_ognz_list =  await this.mixin_ognz_list();

    this.custcoList = await this.mixin_ognz_list_center(this.common_ognz_list, 'CUSL', '' )
    // 센터정보 세팅
    if (this.mixin_isEmpty(this.selectedCustcoItem)) {
      if (this.computedUserCenter > 0) {
        this.selectedCustcoItem = this.custcoList.find(item => item.CUSTCO_ID === this.computedUserCenter)
      } else {
        this.selectedCustcoItem = this.custcoList[0]
      }
    }

    // 부서정보 세팅
    this.deptList = this.mixin_ognz_list_detail(this.common_ognz_list, this.computedUserCenterDeptId, '전체' ,'Y'/*콜센터여부,없으면전체*/)
    if(this.computedUserDetailType ==='MANAGER'){
      this.selectedDeptItem = this.deptList.find(item => item.DEPT_ID === this.computedUserDeptId)
      this.srchUserId = this.user_id
    }else if(this.computedUserDetailType ==='TEAM_LEADER'){
      this.selectedDeptItem = this.deptList.find(item => item.DEPT_ID === this.computedUserDeptId)
    }else if(this.computedUserDetailType ==='CENTER_LEADER'){
      this.selectedDeptItem = this.mixin_ognz_list_detail(this.common_ognz_list, this.selectedCustcoItem.DEPT_ID, '전체' ,'Y'/*콜센터여부,없으면전체*/)[0];
    }

    // await this.getCallRsrvList(false);
  },
  mounted() {
    // this.getCallRsrvList(false);
  },
  methods: {
   async getCallRsrvList( next ){
     this.isLoading = true
     if( !next ){
       this.callRsrvList = [];
       this.chkRsrvItem = [];
       this.pagination.page = 1;
     }
      let postParam = {
        SRCH_RSRV_START_DT : this.srchRsrvStartDt.replaceAll('-','')+'000000'
        , SRCH_RSRV_END_DT : this.srchRsrvEndDt.replaceAll('-','')+'235959'
        , SRCH_PROC_YN : this.srchProcYn
        , SRCH_DEPT_ID : this.mixin_isEmpty(this.selectedDeptItem) ? '':this.selectedDeptItem.DEPT_ID
        , SRCH_USER_ID : this.srchUserId
        , SRCH_RSRV_TEL_NO : this.srchRsrvTelNo
        , SRCH_CUST_NM : this.srchCustNm
      }

      let headParam ={
        head: {
          ROW_CNT : this.pagination.rowsPerPage
          , PAGES_CNT : this.pagination.page
          , PAGING : 'Y'
          , ns : 'lhcs.phone.rsrv.dao.PhoneRsrvMapper'
          , sn : 'selectRsrvCallList'
        }
      }

     try{
       const response = await this.common_postCall("/api/biz/common/select/selectRsrvCallList", postParam, headParam);
       if (!response.HEADER.ERROR_FLAG) {
         response.DATA.map((item) => {

           item.REG_DT = this.mixin_convertDate(item.REG_DT, 'yyyy-MM-dd HH:mm:ss');
           item.RSRV_DT = this.mixin_convertDate(item.RSRV_DT, 'yyyy-MM-dd HH:mm:ss');
           item.RSRV_TEL_NO = this.mixin_setPhoneNo(item.RSRV_TEL_NO);
           item.PROC_YN_NM = item.PROC_YN === 'Y' ? '처리완료' : '미처리';
           this.callRsrvList.push(item)
         })

         if (response.HEADER.next !== null && response.HEADER.next !== undefined) {
           if (response.HEADER.next === true) {
             this.nextDisabled = false //버튼 활성화
           } else {
             this.nextDisabled = true  //버튼 비활성화
           }
         }

         //이부분은 체크해볼것
         this.pagination.page += 1
       } else {
         this.showAlertCaution({msg: response.HEADER.ERROR_MSG});
       }
     }catch(e){
       this.isLoading=false;
       this.showAlertCaution({msg: response.HEADER.ERROR_MSG});
     }
      this.isLoading=false;
    },
    beforeDel(){
     let chkProcYn = false;
     let chkUserId = false;
console.log("dfdfdf")
      this.chkRsrvItem.map((item)=>{
        console.log("map >> ")
        if( item.PROC_YN === 'Y' ) chkProcYn = true;
        if( item.USER_ID !== this.user_id ) chkUserId = true;
      })

      if( chkProcYn ){
        return this.showToastCaution({msg : '처리된 예약건은 삭제할 수 없습니다.'})
      }
      if( chkUserId ){
        return this.showToastCaution({msg : '본인이 등록한 예약건만 삭제할 수 있습니다.'})
      }
      if( !chkUserId && !chkProcYn){
        this.showConfirmCaution({msg : '선택한 통화예약은 영구 삭제됩니다. \n 계속하시겠습니까?', callYes: this.deleteRsrv, callNo : this.closeAlert})
      }
    },
    async deleteRsrv(){

     let sUrl = '/phone-api/rsrv/delete/deleteRsrv'

      let postParam = {
        delRsrvList: this.chkRsrvItem.map(row=>{return {RCPT_PHN_ID: row.RCPT_PHN_ID,PHN_CUTT_ID: row.PHN_CUTT_ID}})
      }

      let headParam ={
        head: {
          DATA_OBJECT : "delRsrvList"
          , ns:'lhcs.phone.rsrv.dao.PhoneRsrvMapper'
          , sn : 'deleteRsrvItem'
        }}

      const response = await this.common_postCall(sUrl, postParam, headParam);
      if( !response.HEADER.ERROR_FLAG){
        this.showToastInfo({msg : '정상 처리되었습니다.', callAfter : ()=>{
            this.$store.commit("alertStore/hideAlert")
            this.getCallRsrvList(false);
          }})
      }else{
        this.showToastCaution({msg : response.HEADER.ERROR_MSG, callAfter : ()=>{
            this.$store.commit("alertStore/hideAlert")
          }});
      }
    },
    // async getUserList() {
    //   this.userList = await this.mixin_get_cusl_list_combo(this.selectedDeptItem.DEPT_ID,'')
    // },
  },
  computed: {

  },
  watch: {
    async "selectedDeptItem.DEPT_ID"(){
      if(!this.mixin_isEmpty(this.selectedDeptItem.DEPT_ID)){
        this.userList = await this.mixin_get_cusl_list_combo(this.selectedDeptItem.DEPT_ID,'')
      }else{
        this.userList =[];
        this.srchUserId = '';
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
