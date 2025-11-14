<template>
  <div class="px-6">
    <!-- search -->
    <div class="pl-search-form is-mt-m">
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline">
          <span class="pl-label">
            평가연도
          </span>
          <div class="pl-desc">
            <v-select
              v-model="searchParams.STD_YEAR"
              :items="DROP_YEAR"
              placeholder="선택"
              class="pl-form type-middle is-sm"
            ></v-select>
          </div>
        </div>
        <!-- <div class="pl-form-inline">
          <span class="pl-label">
            평가월
          </span>
          <div class="pl-desc">
            <v-select
              v-model="searchParams.STD_MONTH"
              :items="DROP_MONTH"
              placeholder="전체"
              class="pl-form type-middle is-sm"
            ></v-select>
          </div>
        </div> -->
        <v-btn class="pl-btn is-icon" @click="clickSearchBtn">
          <span class="pl-icon20 search"></span>
          조회
        </v-btn>
      </div>
    </div>

    <div class="is-border-top pt-2">
      <div>
        <!-- grid top -->
        <div class="pl-grid-top ">
          <div class="pl-grid-top-left">
            <span class="pl-bullet-txt is-blue">월별 상담품질 평가 결과 </span>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ userQaRstList.length }})</em> 건</span>
            <!-- 엑셀 다운로드 버튼 -->
            <compo-excel
              TypeProp="Download"
              :DataHeaderProp="excelHeaders"
              :DataBodyProp="userQaRstList"
              :FileNameProp="fileName"
              SheetNameProp="월별 상담품질 평가 결과"
              :isMulti="true"
            />
            </div>
        </div>
        <!-- grid -->
        <v-data-table
          class="pl-grid is-mt-s"
          :headers="gridHeaders"
          :items="userQaRstList"
          fixed-header
          item-key="ROW_NUM"
          height="calc(-288px + 100vh)"
          disable-pagination
          hide-default-header
          hide-default-footer
          no-data-text="등록된 데이터가 없습니다.">
          <template v-slot:header="{ props }">
            <thead class="v-data-table-header multi-row">
              <tr>
                <th rowspan="2" class="text-center" width="50px">번호</th>
                <th rowspan="2" class="text-center" width="6%">평가연도</th>
                <th rowspan="2" class="text-center" width="6%">평가월</th>
                <th colspan="3" class="text-center" width="20%">1차 평가</th>
                <th colspan="3" class="text-center" width="20%">2차 평가</th>
                <th
                  rowspan="2"
                  class="text-center"
                  width="8%"
                  style="box-shadow: inset 1px 0px 0 0px var(--primary-color), inset 0px 1px 0 0px var(--primary-color), inset -1px 1px 0 0px var(--primary-color) !important;">
                  최종
                </th>
                <th rowspan="2" class="text-center" width="7%">팀내순위</th>
                <th rowspan="2" class="text-center" width="7%">전체순위</th>
                <th rowspan="2" class="text-center" width="">비고</th>
              </tr>
              <tr>
                <th class="text-center">점수</th>
                <th class="text-center">평가지</th>
                <th class="text-center">이의제기</th>
                <th class="text-center">점수</th>
                <th class="text-center">평가지</th>
                <th class="text-center">이의제기</th>
              </tr>
            </thead>
          </template>

          <!-- 1차 평가 버튼 -->
          <template v-slot:item.FST_STD_BTN="{ item, index }">
            <v-tooltip content-class="pl-tooltip bottom" bottom v-if=item.FST_STD_INFO>
              <template v-slot:activator="{ on, attrs }">
                <v-menu
                  max-width="230"
                  min-width="230"
                  bottom
                  right
                  offset-y
                  :close-on-content-click=false
                  content-class="pl-menu-drop pa-0"
                  v-model="item.FST_DROP"
                >
                  <template v-slot:activator="{ on: menuOn, attrs: menuAttrs }">
                    <v-btn
                      v-bind="menuAttrs"
                      @click="showStdList(item, index, 'FST')"
                      class="pl-tooltip-btn ml-1"
                      min-width="30"
                      height="30"
                      plain
                      >
                      <v-icon
                        v-bind="attrs"
                        v-on="on"
                        class="pl-icon20 board-docu"></v-icon>
                    </v-btn>
                  </template>
                  <div class="">
                    <div class="pl-card">
                      <div class="d-flex align-center">
                        <div class="pl-subtit">평가결과 목록</div>
                        <v-btn
                            @click="item.FST_DROP = false"
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
                      <ul class="pl-link-list is-mt-m">
                        <template v-for="item in tgtStdList">
                          <li @click="openQaResultPaper(item)">
                            <span class="pl-link-list-title">{{ item.TITLE }}</span>
                          </li>
                        </template>
                      </ul>
                    </div>
                  </div>
                </v-menu>
              </template>
              <span>결과보기</span>
            </v-tooltip>
            <template v-else>
              <span>-</span>
            </template>
          </template>

          <!-- 2차 평가 버튼 -->
          <template v-slot:item.SCN_STD_BTN="{ item, index}">
              <v-tooltip content-class="pl-tooltip bottom" bottom v-if=item.SCN_STD_INFO>
              <template v-slot:activator="{ on, attrs }">
                <v-menu
                  max-width="230"
                  min-width="230"
                  bottom
                  right
                  offset-y
                  :close-on-content-click=false
                  content-class="pl-menu-drop pa-0"
                  v-model="item.SCN_DROP"
                >
                  <template v-slot:activator="{ on: menuOn, attrs: menuAttrs }">
                    <v-btn
                      v-bind="menuAttrs"
                      @click="showStdList(item, index, 'SCN')"
                      class="pl-tooltip-btn ml-1"
                      min-width="30"
                      height="30"
                      plain
                      >
                      <v-icon
                        v-bind="attrs"
                        v-on="on"
                        class="pl-icon20 board-docu"></v-icon>
                    </v-btn>
                  </template>
                  <div class="">
                    <div class="pl-card">
                      <div class="d-flex align-center">
                        <div class="pl-subtit">평가결과 목록</div>
                        <v-btn
                          @click="item.SCN_DROP = false"
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
                      <ul class="pl-link-list is-mt-m">
                        <template v-for="item in tgtStdList">
                          <li @click="openQaResultPaper(item)">
                            <span class="pl-link-list-title">{{ item.TITLE }}</span>
                          </li>
                        </template>
                      </ul>
                    </div>
                  </div>
                </v-menu>
              </template>
              <span>결과보기</span>
            </v-tooltip>
            <template v-else>
              <span>-</span>
            </template>
          </template>

          <!-- 최종 -->
          <template v-slot:item.TOT_SCORE="{ item }">
            <td
              style="box-shadow: inset 1px 0px 0 0px var(--primary-color), inset -1px 0px 0 0px var(--primary-color) !important;"
              :style="userQaRstList.length == item.ROW_NUM && 'box-shadow: inset 1px 0px 0 0px var(--primary-color), inset -1px -1px 0 0px var(--primary-color) !important'"
              class="text-center ">
              <strong>{{ item.TOT_SCORE }}</strong>
            </td>
          </template>

          <!-- 이의제기 -->
          <template v-slot:item.FST_OBJT_TEXT="{ item, index }">
            <span v-if="item.FST_OBJT_ID">{{ item.FST_OBJT_TYPE }}<span :class="`is-txt-${mixin_displayStatus(item.FST_STTS_CD_NM, 'STAT_LIST')}`">({{ item.FST_STTS_CD_NM }})</span></span>
          </template>
          <template v-slot:item.SCN_OBJT_TEXT="{ item, index }">
            <span v-if="item.SCN_OBJT_ID">{{ item.SCN_OBJT_TYPE }}<span :class="`is-txt-${mixin_displayStatus(item.SCN_STTS_CD_NM, 'STAT_LIST')}`">({{ item.SCN_STTS_CD_NM }})</span></span>
          </template>
        </v-data-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HOME_MANAGER_TAB06", //name은 'MENU_' + 파일명 조합
  components: {
  },
  data() {
    return {
      gridHeaders: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px', sortable: false, },
        { text: '평가연도', value: 'STD_YEAR', align: 'center', width: '80px', sortable: false,  },
        { text: '평가월', value: 'STD_MONTH', align: 'center', width: '80px', sortable: false,  },
        { text: '1차', value: 'FST_SCORE', align: 'center', width: '70px', sortable: false,},
        { text: '1차 평가', value: 'FST_STD_BTN', align: 'center', width: '70px', sortable: false,  },
        { text: '1차 이의제기', value: 'FST_OBJT_TEXT', align: 'center', width: '120px', sortable: false,  },
        { text: '2차', value: 'SCN_SCORE', align: 'center', width: '100px', sortable: false,},
        { text: '2차 평가', value: 'SCN_STD_BTN', align: 'center', width: '100px', sortable: false,  },
        { text: '1차 이의제기', value: 'SCN_OBJT_TEXT', align: 'center', width: '100px', sortable: false,  },
        { text: '최종', value: 'TOT_SCORE', align: 'center', width: '80px', sortable: false,  },
        { text: '팀내순위', value: 'TEAM_RANK', align: 'center', width: '80px', sortable: false,  },
        { text: '전체순위', value: 'TOT_RANK', align: 'center', width: '80px', sortable: false,  },
        { text: '비고', value: 'ETC', align: 'center', width: '', sortable: false,  },
      ],

      excelHeaders:[
        [
          { text: '번호', value: 'ROW_NUM', align: 'center', rowspan:1},
          { text: '평가연도', value: 'STD_YEAR', align: 'center', rowspan:1},
          { text: '평가월', value: 'STD_MONTH', align: 'center', rowspan:1},
          { text: '1차 평가', value: 'FST_SCORE', align: 'center', colspan:1},
          { text: '', value: 'FST_OBJT_TEXT', align: 'center'},
          { text: '2차 평가', value: 'SCN_SCORE', align: 'center', colspan:1},
          { text: '', value: 'SCN_OBJT_TEXT', align: 'center'},
          { text: '최종', value: 'TOT_SCORE', align: 'center', rowspan:1},
          { text: '팀내순위', value: 'TEAM_RANK', align: 'center', rowspan:1},
          { text: '전체순위', value: 'TOT_RANK', align: 'center', rowspan:1},
          { text: '비고', value: 'ETC', align: 'center', rowspan:1},
        ],
        [
          { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px', sortable: false, },
          { text: '평가연도', value: 'STD_YEAR', align: 'center', width: '80px', sortable: false,  },
          { text: '평가월', value: 'STD_MONTH', align: 'center', width: '80px', sortable: false,  },
          { text: '점수', value: 'FST_SCORE', align: 'center', width: '80px', sortable: false,},
          { text: '이의제기', value: 'FST_OBJT_TEXT', align: 'center', width: '120px', sortable: false,  },
          { text: '점수', value: 'SCN_SCORE', align: 'center', width: '80px', sortable: false,},
          { text: '이의제기', value: 'SCN_OBJT_TEXT', align: 'center', width: '120px', sortable: false,  },
          { text: '최종', value: 'TOT_SCORE', align: 'center', width: '80px', sortable: false,  },
          { text: '팀내순위', value: 'TEAM_RANK', align: 'center', width: '80px', sortable: false,  },
          { text: '전체순위', value: 'TOT_RANK', align: 'center', width: '80px', sortable: false,  },
          { text: '비고', value: 'ETC', align: 'center', width: '200px', sortable: false,  },
        ]
      ],

      // 상태 컬러
      STAT_LIST: [
        { code: '종결', value: 'green'},
        { code: '요청', value: 'cyan'},
        { code: '취소', value: 'red'},
        { code: '신청', value: 'org'},
      ],

      // 조회 조건
      searchParams:{
        STD_YEAR: this.$moment().format("YYYY")
        , STD_MONTH: this.$moment().format("MM")
        , CENTER_ID: ""
        , DEPT_ID: ""
        , OBJECT_YN: ""
      },

      // 평가년월 콤보 박스
      DROP_YEAR: [],
      DROP_MONTH:[
        { text: "1월", value: "01"}
        , { text: "2월", value: "02"}
        , { text: "3월", value: "03"}
        , { text: "4월", value: "04"}
        , { text: "5월", value: "05"}
        , { text: "6월", value: "06"}
        , { text: "7월", value: "07"}
        , { text: "8월", value: "08"}
        , { text: "9월", value: "09"}
        , { text: "10월", value: "10"}
        , { text: "11월", value: "11"}
        , { text: "12월", value: "12"}
      ],

      // 평가결과 목록
      userQaRstList:[],

      tgtStdList:[],
      propsQaBaseData:{},
      fileName:"",

      MESSAGE: {
        ERROR: {
          ERROR:
            { alertDialogToggle: true, iconClass: 'is-caution', type: 'default', msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', },
        }
      },
    }
  },
  methods: {
    // 조회버튼
    clickSearchBtn(){
      if(this.mixin_isEmpty(this.searchParams.STD_YEAR)){
        this.showAlertInfo({msg:"평가연도를 선택해주세요."});
        return
      }

      // if(this.mixin_isEmpty(this.searchParams.STD_MONTH)){
      //   this.showAlertInfo({msg:"평가월을 선택해주세요."});
      //   return
      // }

      // 사용자 월별 평가결과 조회
      this.selectUserQaRstList();
    },

    // 팀별 평가결과 조회
    async selectUserQaRstList(){
      // let sUrl = '/phone-api/qa/selectUserQaRstList';
      let sUrl = '/api/biz/common/select/selectUserQaRstList';

      let postParam = {
        CENTER_ID: this.searchParams.CENTER_ID
        , DEPT_ID: this.searchParams.DEPT_ID
        , STD_YEAR: this.searchParams.STD_YEAR
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaCommMapper'
        , sn : 'selectUserQaRstList'
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.userQaRstList = response.DATA.map(row=>{
          if( row.ICON_IMG_URI !== '/' ) row.IMG = '/upload/' + row.ICON_IMG_URI;
          else row.IMG = require('@/assets/img/@manager_profile_default.png');

          // null 처리
          row.TOT_SCORE = this.mixin_nvl(row.AVG_SCORE, "-");
          row.FST_SCORE = this.mixin_nvl(row.FST_STD_SCORE, "-");
          row.SCN_SCORE = this.mixin_nvl(row.SCN_STD_SCORE, "-");
          row.TOT_RANK = this.mixin_nvl(row.TOT_RANK, "-");
          row.TEAM_RANK = this.mixin_nvl(row.TEAM_RANK, "-");

          // 평가지 리스트 표시 여부
          row.FST_DROP = false;
          row.SCN_DROP = false;

          // 이의제기 표시
          row.FST_OBJT_TEXT = this.mixin_isEmpty(row.FST_OBJT_ID) ? "" : row.FST_OBJT_TYPE+"("+row.FST_STTS_CD_NM+")";
          row.SCN_OBJT_TEXT = this.mixin_isEmpty(row.SCN_OBJT_ID) ? "" :row.SCN_OBJT_TYPE+"("+row.SCN_STTS_CD_NM+")";

          row.ETC = "";

          return row;
        });

        this.fileName = this.searchParams.STD_YEAR+"년_월별 상담품질 평가 결과";

        // this.YEAR_TEXT = this.searchParams.STD_YEAR+"년";
        // this.MONTH_TEXT = parseInt(this.searchParams.STD_MONTH)+"월";
        // if(this.qaTeamRstList.length > 0){
        //   this.FST_AVG_SCORE = this.getAvgScore("FST_STD_SCORE");
        //   this.SCN_AVG_SCORE = this.getAvgScore("SCN_STD_SCORE");
        //   this.TOT_AVG_SCORE = this.getAvgScore("AVG_SCORE");
        // }else{
        //   this.FST_AVG_SCORE = 0;
        //   this.SCN_AVG_SCORE = 0;
        //   this.TOT_AVG_SCORE = 0;
        // }

      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    // 평균
    getAvgScore(col){
      let sum = 0;
      let cnt = 0;

      // 평가결과가 존재하는 건만 계산
      for(let i=0;i<this.qaTeamRstList.length;i++){
        if(!this.mixin_isEmpty(this.qaTeamRstList[i][col])){
          sum += parseFloat(this.qaTeamRstList[i][col]);
          cnt++;
        }
      }

      return cnt == 0 ? 0 :(sum/cnt).toFixed(2);
    },

    // 평가월 조회
    async selectQaEvlMonth(){
      // let sUrl = '/phone-api/qa/selectQaEvlMonth';
      let sUrl = '/api/biz/common/select/selectQaEvlMonth';

      let postParam = {
        STD_YEAR : this.searchParams.STD_YEAR,
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaCommMapper'
        , sn : 'selectQaEvlMonth'
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.DROP_MONTH = response.DATA.map(row=>{
          row.text = row.MM_TEXT;
          row.value = row.MM;
          return row;
        });
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    // 평가연도 조회
    async selectQaEvlYear(){
      // let sUrl = '/phone-api/qa/selectQaEvlYear';
      let sUrl = '/api/biz/common/select/selectQaEvlYear';

      let postParam = {};

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaCommMapper'
        , sn : 'selectQaEvlYear'
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.DROP_YEAR = response.DATA.map(row=>{
          row.text = row.YR_TEXT;
          row.value = row.YR;
          return row;
        });
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    // 평가결과 팝업 열기
    openQaResultPaper(item){
      // 평가지 리스트 닫기
      this.userQaRstList[item.index]["FST_DROP"] = false;
      this.userQaRstList[item.index]["SCN_DROP"] = false;

      // 슬라이드 닫기 처리
      this.$eventBus.$emit('clearVSlideXreverse');

      this.mixin_showQaResult(item.STD_ID, item.CENTER_ID);
    },

    // 결과보기 클릭 시 이벤트
    showStdList(item, index, type){
      this.tgtStdList = item[type+"_STD_INFO"].split(",").map(row=>{
        let data = row.split("/");
        return {
          STD_MT: data[0]
          , STD_MT_ORD: data[1]
          , STD_ID:data[2]
          , CENTER_ID: item.CENTER_ID
          , index: index
          , TITLE:this.$moment(data[0], "YYYYMM").format("YYYY-MM")+"("+data[1]+"차) 평가"}
      });

      if(this.tgtStdList.length > 1){
        // 평가지 리스트 오픈
        this.userQaRstList[index][type+"_DROP"] = true;
      }else if(this.tgtStdList.length > 0){
        this.openQaResultPaper(this.tgtStdList[0]);
      }
    },
  },
  async mounted() {
    this.searchParams.CENTER_ID = this.computedUserCenter;
    this.searchParams.DEPT_ID = this.computedUserDeptId;

    await this.selectQaEvlYear();
    // await this.selectQaEvlMonth();

    // 사용자 월별 평가결과 조회
    this.selectUserQaRstList();
  },
  created() {
    // 재조회
    this.$eventBus.$on("refreshObjtGridList", (item) => {
      this.selectUserQaRstList();
    });
  },
  beforeDestroy(){
    this.$eventBus.$off("refreshObjtGridList"); //eventBus 중복방지를 위해 off
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>