<template>
  <div>
    <!-- search -->
    <div class="px-6 py-3">
      <div class="pl-form-inline-wrap mt-2">
        <div class="pl-form-inline">
          <span class="pl-label">
            요청팀
          </span>
          <div class="pl-desc">
            <v-select
              v-model="REQ_DEPT_ID"
              :items="DEPT_LIST"
              class="pl-form type-middle is-md"
              placeholder="전체"
              @change="getReqUserList"
            />
          </div>
        </div>
        <div class="pl-form-inline flex-grow-1" >
          <span class="pl-label">
            요청상담사
          </span>
          <div class="pl-desc flex-grow-1">
            <v-select
              v-model="REQ_USER_ID"
              :items="REQ_USER_LIST"
              class="pl-form type-middle "
              placeholder="전체"
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            접수팀
          </span>
          <div class="pl-desc">
            <v-select
              v-model="TRANS_DEPT_ID"
              :items="DEPT_LIST"
              class="pl-form type-middle is-md"
              placeholder="전체"
              @change="getTransUserList"
            />
          </div>
        </div>
        <div class="pl-form-inline flex-grow-1" >
          <span class="pl-label">
            접수상담사
          </span>
          <div class="pl-desc flex-grow-1">
            <v-select
              v-model="TRANS_USER_ID"
              :items="TRANS_USER_LIST"
              class="pl-form type-middle"
              placeholder="전체"
            />
          </div>
        </div>
        <div class="pl-form-inline flex-grow-1" >
          <span class="pl-label">
            이관일자
          </span>
          <div class="pl-desc flex-grow-1">
            <compo-date-range-picker
              :StartDayProp.sync="TRANS_START_DATE"
              :EndDayProp.sync="TRANS_END_DATE"
              @startDayChange="mixin_testLog(TRANS_START_DATE)"
              @endDayChange="mixin_testLog(TRANS_END_DATE)"
              ParentStyleProp="width: 306px"
            />
          </div>
        </div>
        <div class="pl-form-inline flex-grow-1" >
          <span class="pl-label">
            진행상태
          </span>
          <div class="pl-desc flex-grow-1">
            <v-select
              v-model="RP_PRCS_STTS_CD"
              :items="RP_PRCS_STTS_LIST"
              class="pl-form type-middle is-sm"
            />
          </div>
        </div>


        <div>
          <v-btn class="pl-btn is-icon" @click="getTransSchedulerManageList()">
            <span class="pl-icon20 search"></span>
            조회
          </v-btn>
          <compo-tooltip-btn
              TitleProp="새로고침"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 refresh"
              TooltipPositionProp="bottom"
              @btnClick="initCondition"
          ></compo-tooltip-btn>
        </div>
      </div>
    </div>
    <!-- grid -->
    <div class="is-border-top px-6 py-3">
      <div class="pl-grid-top">
        <div class="pl-grid-top-left">
        </div>
        <div class="pl-grid-top-utils">
          <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ totalCount }})</em> 건</span>
          <!-- 엑셀 다운로드 버튼 -->
          <compo-tooltip-btn
            TitleProp="엑셀 다운로드"
            ClassProp="pl-tooltip-btn "
            IconProp="pl-icon20 exceldown"
            TooltipPositionProp="bottom"
            @btnClick="excelDown"
          ></compo-tooltip-btn>
        </div>
      </div>
      <v-data-table
        class="pl-grid is-mt-s"
        :headers="headers"
        :items="TRANS_LIST"
        :item-style="setItemStyle"
        fixed-header
        item-key="ROW_NUMBER"
        height="562px"
        :items-per-page="ROW_PER_PAGE"
        hide-default-footer
        no-data-text="등록된 데이터가 없습니다."
        :loading="isLoading"
        loading-text="조회중입니다."
        :page.sync="page"
        @page-count="pageCount = $event">
        <template v-slot:item.FLW_ACP_LIST="{ item }">
            <v-tooltip 
              v-for="acpItem in item.FLW_ACP_LIST"
              content-class="pl-tooltip " bottom>
              <template v-slot:activator="{ on, attrs }">
                <span class="ml-1 mt-1 mb-1 spacing-wrap sp-8" style="flex-wrap: wrap;">
                    <span class="pl-badge is-blueGray hover-line" style="width: auto;"
                      v-bind="attrs" 
                      v-on="on"
                      @dblclick="showDetail(acpItem, item.MGOF_CD, item.HNO)">
                      {{acpItem.FLW_ACPT_NO}}
                    </span>
                </span>
              </template>
              <div v-html="acpItem.FLW_ACPT_NO" ></div>
            </v-tooltip>

        </template>
        <template v-slot:item.ACTION="{ item }">
          <div 
            v-if="item.PRCS_STTS_CD == 'ISMACNST016' || item.PRCS_STTS_CD == 'ISMACNST004'"
            class="spacing-wrap sp-4">
            <v-btn class="pl-btn is-sub is-sm" @click="btnComplete(item)">완료</v-btn>
            <!-- <v-btn class="pl-btn is-sub is-sm" @click="btnReject">반려</v-btn> -->
            <!-- 반려 -->
            <v-menu
              v-model="item.modelReject"
              min-width="350"
              offset-overflow
              bottom
              left
              content-class="pl-menu-drop"
              :close-on-content-click=false
              :close-on-click=false
            >
              <template v-slot:activator="{ on: menuOn, attrs: menuAttrs }">
                <v-btn
                  v-bind="menuAttrs"
                  v-on="menuOn"
                  class="pl-btn is-sub is-sm">반려</v-btn>
              </template>
              <!-- 반려 v-menu -->
              <div class="px-3 py-2">
                <!-- header -->
                <div class="d-flex">
                  <h3 style="font-size: 16px">반려사유</h3>
                  <v-btn
                    @click="item.modelReject = false"
                    plain
                    min-width="22"
                    height="22"
                    class="pl-tooltip-btn ml-auto"
                    >
                    <v-icon
                      small
                      class="pl-icon20 dialog-close-black">
                    </v-icon>
                  </v-btn>
                </div>
                <!-- form -->
                <div class="is-mt-s">
                  <v-form :ref="'rejectForm-' + item.ROW_NUMBER">
                    <v-textarea
                      v-model="item.TRANS_REQ_CNTNT"
                      height="80"
                      class="pl-form is-noresize"
                      :spellcheck="false"
                      placeholder="사유 입력"
                      :rules="rejectValidateRules.TRANS_REQ_CNTNT"
                    />
                  </v-form>
                </div>
                <div class="pl-btn-wrap is-mt-m">
                  <v-btn
                    class="pl-btn is-trans ml-auto"
                    @click="item.modelReject = false">취소</v-btn>
                  <v-btn class="pl-btn" @click="btnReject(item)">등록</v-btn>
                </div>
              </div>
            </v-menu>
          </div>
        </template>
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
          보기 {{ mixin_getPagePeriod(TRANS_LIST, page) }} / {{ totalCount }}
          <compo-tooltip-btn
            TitleProp="다음 검색"
            ClassProp="pl-tooltip-btn is-line"
            IconProp="pl-icon20 arrow-next-paging"
            TooltipPositionProp="bottom"
            @btnClick="getTransSchedulerManageList('next')"
          ></compo-tooltip-btn>
        </span>
      </div>

    </div>

  </div>
</template>

<script>
export default {
  name: 'CompoAsTransSchedulerManager', //스케줄러 이관 목록 - 팀장 관리 기능
  components: {
  },
  data() {
    return {

      // grid
      isLoading: false,
      totalCount: 0,
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 100,
      pagination: {
        page: 1,
        rowsPerPage: 500,
      },
      headers: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false, },
        { text: 'AS접수번호', value: 'FLW_ACP_LIST', align: '', width: '8%', sortable: false, },
        { text: '긴급여부', value: 'FLW_ACPT_EMER_YN', align: 'center', width: '8%', sortable: false, },
        { text: '진행상태', value: 'PROC_STAT_NM', align: 'center', width: '8%', sortable: false, },
        { text: '이관요청자', value: 'REQ_EMP_NM', align: 'center', width: '8%', sortable: false, },
        { text: '이관접수자', value: 'TARGET_EMP_NM', align: 'center', width: '8%', sortable: false, },
        { text: '이관일', value: 'REQ_DT', align: 'center', width: '8%', sortable: false, },
        { text: '이관사유', value: 'REQ_CNTNT', align: '', width: '', sortable: false, },
        { text: '반려일', value: 'RETRANS_DT', align: 'center', width: '8%', sortable: false, },
        { text: '반려사유', value: 'RETRANS_CNTNT', align: '', width: '8%', sortable: false, },
        { text: '확인', value: 'ACTION', align: 'center', width: '100px', sortable: false, },
      ],
      

      //팀 목록
      DEPT_LIST: [],
      //요청 사용자 목록
      REQ_USER_LIST: [], 
      //접수 사용자 목록
      TRANS_USER_LIST: [],
      //요청 부서 ID
      REQ_DEPT_ID: '',
      //요청 사용자 ID
      REQ_USER_ID: '',
      //접수 부서 ID
      TRANS_DEPT_ID: '',
      //접수 사용자 ID
      TRANS_USER_ID: '',
      //이관일자 시작일
      TRANS_START_DATE: (new Date(Date.now() - (365 * 24 * 60 * 60 * 1000) - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),// 현재일 기준 365일 이전 날짜 계산
      //이관일자 종료일
      TRANS_END_DATE: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      //진행상태
      RP_PRCS_STTS_CD: 'T',
      RP_PRCS_STTS_LIST: [
        {text: '전체' , value: ''},
        {text: '이관' , value: 'T'},
        {text: '반려' , value: 'R'},
        {text: '완료' , value: 'Y'},
      ],

      //이관 목록
      TRANS_LIST: [],

      rejectValidateRules: {
        TRANS_REQ_CNTNT: [
          v => !!v || '반려 사유는 필수 항목 입니다.',
        ],
      },


      table_head: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false, },
        { text: 'AS접수번호', value: 'FLW_ACPT_NOS_XLS', align: 'left', width: '400px', sortable: false, },
        { text: '긴급여부', value: 'FLW_ACPT_EMER_YN', align: 'center', width: '85px', sortable: false, },
        { text: '진행상태', value: 'PROC_STAT_NM', align: 'center', width: '85px', sortable: false, },
        { text: '이관요청자', value: 'REQ_EMP_NM', align: 'center', width: '180px', sortable: false, },
        { text: '이관접수자', value: 'TARGET_EMP_NM', align: 'center', width: '180px', sortable: false, },
        { text: '이관일', value: 'REQ_DT', align: 'center', width: '170px', sortable: false, },
        { text: '이관사유', value: 'REQ_CNTNT', align: 'left', width: '450px', sortable: false, },
        { text: '반려일', value: 'RETRANS_DT', align: 'center', width: '170px', sortable: false, },
        { text: '반려사유', value: 'RETRANS_CNTNT', align: 'left', width: '450px', sortable: false, },
      ],
      table_body: [],
      file_name: '',
      sheet_name: "스케줄러이관목록",
      header_color: "EFF5FC"
    }
  },
  methods: {

    //팀 목록 조회
    async getDeptList() {
        this.DEPT_LIST = [{value: '', text: '전체'}];

        let postParam = {
          SRCH_TYPE : 'CUSL',
          SRCH_CUSTCO_ID: "4"
        };
        let headParam = {head: {
          ns: 'palette3.setting.ognz.dao.OgnzMapper'
        }};
        const response = await this.common_postCall("/api/biz/common/select/selectOgnzByRole", postParam, headParam);

        if(response && !response.HEADER.ERROR_FLAG) {
          response.DATA.map(item => {
            if(item.UP_DEPT_ID != '1') {
              this.DEPT_LIST.push({
                value: item.DEPT_ID,
                text: item.DEPT_NM
              })
            }
          })
        }
      },

      //요청팀 상담사 목록 조회
      async getReqUserList() {
        this.REQ_USER_ID = '';
        this.REQ_USER_LIST = [{value: '', text: '전체'}];

        let postParam = {
          USER_STTS_CD : 'WORK',
          SRCH_TYPE : 'CUSL',
          SRCH_DEPT_ID: this.REQ_DEPT_ID
        };
        let headParam = {head: {
          ns: 'lhcs.system.user.dao.UserMapper'
        }};
        const response = await this.common_postCall("/api/biz/common/select/selectUserList", postParam, headParam);

        if(response && !response.HEADER.ERROR_FLAG) {
          response.DATA.map(item => {
            this.REQ_USER_LIST.push({
              value: item.USER_ID,
              text: item.USER_NM
            })
          })
        }
      },

      //접수팀 상담사 목록 조회
      async getTransUserList() {
        this.TRANS_USER_ID = '';
        this.TRANS_USER_LIST = [{value: '', text: '전체'}];

        let postParam = {
          USER_STTS_CD : 'WORK',
          SRCH_TYPE : 'CUSL',
          SRCH_DEPT_ID: this.TRANS_DEPT_ID
        };
        let headParam = {head: {
          ns: 'lhcs.system.user.dao.UserMapper'
        }};
        const response = await this.common_postCall("/api/biz/common/select/selectUserList", postParam, headParam);

        if(response && !response.HEADER.ERROR_FLAG) {
          response.DATA.map(item => {
            this.TRANS_USER_LIST.push({
              value: item.USER_ID,
              text: item.USER_NM
            })
          })
        }
      },

      //스케줄러이관 목록 - selectTransSchedulerManageList
      async getTransSchedulerManageList(next = '') {
        //다음버튼 클릭 유무
        if (next == 'next'){
        } else {
          this.totalCount = 0;
          this.TRANS_LIST = [];
          this.pagination.page = 1; //페이징 처리 초기화
          this.nextDisabled = true;  //버튼 비활성화
        }
        let postParam = {
          TRANS_START_DATE: this.TRANS_START_DATE.replaceAll(/[^0-9]/g,''),
          TRANS_END_DATE: this.TRANS_END_DATE.replaceAll(/[^0-9]/g,''),
          REQ_DEPT_ID: this.REQ_DEPT_ID,
          REQ_USER_ID: this.REQ_USER_ID,
          TRANS_DEPT_ID: this.TRANS_DEPT_ID,
          TRANS_USER_ID: this.TRANS_USER_ID,
          RP_PRCS_STTS_CD: this.RP_PRCS_STTS_CD
        };
        let headParam = {head: {
          ns: 'lhcs.phone.as.dao.PhoneAsSchedulerMapper',
          "ROW_CNT" : this.pagination.rowsPerPage,
          "PAGES_CNT" : this.pagination.page,
          "PAGING" : "Y",
        }};
       
        this.isLoading = true;
        const response = await this.common_postCall("/api/biz/common/select/selectTransSchedulerManageList", postParam, headParam);

        if(response && !response.HEADER.ERROR_FLAG) {
          response.DATA.map(item => {
            //AS접수번호 링크 생성을 위한 정보로 변환
            const arrFlwAcptNos = item.FLW_ACPT_NOS.split(',')
            item.FLW_ACP_LIST = []
            arrFlwAcptNos.map(acpNo => {
              const arrAcpNo = acpNo.split('|')
              item.FLW_ACP_LIST.push({FLW_ACPT_NO: arrAcpNo[0], FLW_DTL_FULL_SN: arrAcpNo[1]})
            })

            const transInfo = item.TRANS_INFO;
            const retransInfo = item.RETRANS_INFO;
            if(transInfo.indexOf('|') > -1) {
              const arrTransInfo = transInfo.split("|");
              item.REQ_EMP_NM = arrTransInfo[0];
              item.TARGET_EMP_NM = arrTransInfo[1];
              item.REQ_DT = arrTransInfo[2];
              item.REQ_CNTNT = arrTransInfo[3];
            }
            if(retransInfo.indexOf('|') > -1) {
              const arrTransInfo = transInfo.split("|");
              item.RETRANS_DT = arrTransInfo[2];
              item.RETRANS_CNTNT = arrTransInfo[3];
            }
            item.ACTION = '';
          })
          this.TRANS_LIST = [...this.TRANS_LIST, ...response.DATA]

          this.totalCount = response.HEADER.TOT_COUNT;

          //다음
          //request에 보낸 head.PAGES_CNT와 head.ROW_CNT을 곱한값과 response.data.HEADER의 HEADER.TOT_COUNT와 비교하여 다음 조회건이 있는지 확인한다
          if(response.HEADER.next !== null && response.HEADER.next !== undefined){
            if(response.HEADER.next === true){
              this.nextDisabled = false //버튼 활성화
            }else{
              this.nextDisabled = true  //버튼 비활성화
            }
          }

          this.pagination.page += 1;
        }
        this.isLoading = false;
      },

      //이관접수 - 완료
      btnComplete(item) {
        this.showConfirmInfo({
          msg:'완료 처리하시겠습니까?'
          , callYes: () => {
            this.transComplete(item);
          }
          , callNo: this.closeAlert
        });
      },

      //이관 완료 처리
      async transComplete(item) {
        const postParam = {
          PHN_CUTT_ID: item.PHN_CUTT_ID, // 상담번호
          RCPT_TRNSF_ID: item.RCPT_TRNSF_ID, // 이관접수번호
        };
        const headParam = {head: {}};
        console.log("transComplete", postParam)
        let response = await this.common_postCall("/phone-api/as/scheduler/transComplete", postParam, headParam);
        if(!response.HEADER.ERROR_FLAG) {

          this.getTransSchedulerManageList();
          this.showToastSuccess({msg:"정상 처리되었습니다."})
          this.closeAlert();
        }
      },


      //이관접수 - 반려 요청
      btnReject(item) {
        console.log("btnReject", item)
        if(!this.$refs["rejectForm-" + item.ROW_NUMBER].validate()) {
          return
        }
        this.showConfirmInfo({
          msg:'반려 요청하시겠습니까?'
          , callYes: () => {
            this.transReject(item);
          }
          , callNo: this.closeAlert
        });
      },

      //이관 반려 요청 처리
      async transReject(item) {
        const postParam = {
          PHN_CUTT_ID: item.PHN_CUTT_ID, // 상담번호
          RCPT_TRNSF_ID: item.RCPT_TRNSF_ID, // 이관접수번호
          REQ_CNTNT: item.TRANS_REQ_CNTNT //반려 요청 내용
        };
        const headParam = {head: {}};
        console.log("transReject", postParam)
        let response = await this.common_postCall("/phone-api/as/scheduler/transReject", postParam, headParam);
        if(!response.HEADER.ERROR_FLAG) {

          item.modelReject = false;
          this.getTransSchedulerManageList();
          this.showToastSuccess({msg:"정상 처리되었습니다."})
          this.closeAlert();
        }
      },


      showDetail(acpItem, mgofCd, hno) {
        //this.dialogCsDetail = true
        const acpInfo = acpItem.FLW_DTL_FULL_SN.split('-');
        console.log("showDetail", acpInfo, mgofCd, hno)
        this.mixin_openWindow('LayoutPopup', '1040', '895', { compo_name : 'CompoAsFlwAcpDetail', callback: 'getPopData', title: 'AS 접수 상세', popData: { histType: "NEW", ARA_HDQ_CD: acpInfo[0], FLW_RGS_DT: acpInfo[1], FLW_ACP_SN: acpInfo[2], FLW_DTL_SN: acpInfo[3], MGOF_CD: mgofCd, HNO: hno } })
      },


      setItemStyle(item) {
        //팀장협업요청(stc2), 팀장협업완료(stc3)를 제외한 태그는 상담사 본인만 tag_color 적용.
        if(item.FLW_ACPT_EMER_YN == '긴급') {
          return 'background-color: #fdbcb1';
        }
        return '';
      },

      initCondition() {
        this.REQ_USER_LIST = [];
        this.TRANS_USER_LIST = [];
        this.REQ_DEPT_ID = '';
        this.REQ_USER_ID = '';
        this.TRANS_DEPT_ID = '';
        this.TRANS_USER_ID = '';
        this.TRANS_START_DATE = (new Date(Date.now() - (365 * 24 * 60 * 60 * 1000) - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10);
        this.TRANS_END_DATE = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10);
        this.RP_PRCS_STTS_CD = 'T';
      },

      // 엑셀형식으로 다운로드 한다 
    async excelDown() {   

      let headParam = {head: {
        ns: 'lhcs.phone.as.dao.PhoneAsSchedulerMapper',
      }};

      let postParam = {
        TRANS_START_DATE: this.TRANS_START_DATE.replaceAll(/[^0-9]/g,''),
        TRANS_END_DATE: this.TRANS_END_DATE.replaceAll(/[^0-9]/g,''),
        REQ_DEPT_ID: this.REQ_DEPT_ID,
        REQ_USER_ID: this.REQ_USER_ID,
        TRANS_DEPT_ID: this.TRANS_DEPT_ID,
        TRANS_USER_ID: this.TRANS_USER_ID,
        RP_PRCS_STTS_CD: this.RP_PRCS_STTS_CD
      };

      this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", true);
      const response = await this.common_postCall("/api/biz/common/select/selectTransSchedulerManageList", postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", false);
        response.DATA.map(item => {
          const transInfo = item.TRANS_INFO;
          const retransInfo = item.RETRANS_INFO;
          if(transInfo.indexOf('|') > -1) {
            const arrTransInfo = transInfo.split("|");
            item.REQ_EMP_NM = arrTransInfo[0];
            item.TARGET_EMP_NM = arrTransInfo[1];
            item.REQ_DT = arrTransInfo[2];
            item.REQ_CNTNT = arrTransInfo[3];
          }
          if(retransInfo.indexOf('|') > -1) {
            const arrRetransInfo = retransInfo.split("|");
            item.RETRANS_DT = arrRetransInfo[2];
            item.RETRANS_CNTNT = arrRetransInfo[3];
          }
        })
        const table_b = response.DATA;
        this.sheet_name = "스케줄러이관목록";//mixin_common_exportExcel_all 에서 초기화 하여 다시 선언.
        const table_h = this.table_head;

        this.file_name = this.sheet_name + "-" + this.$moment(new Date()).format('YYYYMMDDHHmmss');
        const isMulti = false;


        // 헤더에 없는 body filter
        let tempBodyObj = [];
        tempBodyObj = table_b.map(row=>{
          let tempBodyJson = {};
          if(isMulti){
            let headerKey = table_h[table_h.length-1].map(el=> {return el.value});
            for(let i in headerKey){
              tempBodyJson[headerKey[i]] = this.mixin_nvl(row[headerKey[i]], "");
            }
          }else{
          let headerKey = table_h.map(el=> {return el.value});
            for(let i in headerKey){
              tempBodyJson[headerKey[i]] = this.mixin_nvl(row[headerKey[i]], "");
            }
          }
          return tempBodyJson
        });

        this.table_body = tempBodyObj;

        this.mixin_common_exportExcel_all(this.table_head, this.table_body, this.file_name, this.sheet_name, this.header_color);
      }
    },
  },
  mounted() {
  },
  created() {
    this.getDeptList();
    this.getTransSchedulerManageList();
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>