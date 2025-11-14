<template>
  <div class="py-5">
    <v-tabs
      v-model="tabs1"
      hide-slider
      class="pl-tabs type-fill tab-grow px-5">
      <v-tab>자체 사후처리</v-tab>
      <v-tab>협업 사후처리</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabs1">
      <!-- 자체 사후처리 -->
      <v-tab-item >
        <!-- list top -->
        <div class="d-flex align-center is-mt-s px-5">
          <span class="pl-label">전체 (<span class="is-txt-blue">{{ STMT_LIST.length }}</span>)건</span>
          <v-checkbox
            v-model="stmtPpt2Yn"
            class="pl-check ml-4"
            label="긴급"
          ></v-checkbox>
          <div class="pl-btn-wrap ml-auto">
            <compo-tooltip-btn
              TitleProp="새로고침"
              ClassProp="pl-tooltip-btn ml-1"
              IconProp="pl-icon20 refresh"
              TooltipPositionProp="bottom"
              @btnClick="getStmtList"
            ></compo-tooltip-btn>
          </div>
        </div>
        <!-- list -->
        <div
          style="height: calc(-262px + 100vh);"
          class="is-mt-s pl-notice-list type-acco is-border-top pl-scroll-body">
          <template v-for="item in STMT_LIST">
            <div
            v-if="!stmtPpt2Yn || (stmtPpt2Yn && item.PROC_TYPE == 'PPT2')"
            class="pl-notice-list--unit"
            :key="item.id">
              <div
                @click="item.active = !item.active"
                :class="`d-flex acco-title active-${item.active}`">
                <img :src="item['ICON_URI'] !== '/'? '/upload/' + item['ICON_URL'] : require('@/assets/img/@manager_profile_default.png')" :alt="item['CUSL_NM']"  style="max-width: 35px; max-height: 35px" @error="function(e){e.target.src=require('@/assets/img/@manager_profile_default.png')}">
                <div class="d-flex align-center flex-grow-1">
                  <div class="ml-3">
                    <div>
                      <strong style="font-size: 14px">{{ item.CUSL_NM }}</strong>
                      <span class="ml-2 is-txt-sub">{{ item.DEPT_NM }}</span>
                      <span v-if="item.PROC_TYPE == 'PPT2'"
                        class="pl-badge is-red ml-1">긴급</span>
                    </div>
                    <div >
                      <strong>접수일자 </strong><span class="ml-1">{{ item.REG_DT }}</span>
                    </div>
                    <div >
                      <strong>전화번호 </strong><span class="ml-1">{{ item.CALLER_TEL ? mixin_setPhoneNo(item.CALLER_TEL.replace(/[^0-9]/g, "")) : '' }}({{ item.CUST_NM }})</span>
                    </div>
                    <div class="d-flex">
                      <strong class="flex-shrink-0">Note </strong>
                      <span class="ml-2">{{ item.SHARE_CNTNT }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <template v-if="item.active">
                <div class="is-mt-s ml-12 is-border-sub-top pt-2">
                  <div class="pl-form-inline-wrap vertical type-auto">
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        상담메모
                      </span>
                      <div class="pl-desc">
                        <span class="pl-value-txt">{{ item.CUTT_CN }}</span>
                      </div>
                    </div>
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        진행내용
                      </span>
                      <div class="pl-desc">
                        <v-textarea
                          v-model="item.PROC_CNTNT"
                          height="60"
                          class="pl-form is-noresize"
                          :spellcheck="false"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="pl-btn-wrap is-mt-m">
                    <v-btn class="pl-btn is-sub ml-auto"
                      @click="viewDetail(item)">상세보기</v-btn>
                    <v-btn class="pl-btn is-esp " @click="btnSave(item)">저장</v-btn>
                  </div>
                </div>

              </template>
            </div>
          </template>
        </div>
        <!-- footer -->
        <!-- <div class="is-border-top pl-list-footer justify-center">
          <v-btn class="pl-btn is-round is-sub px-4">더보기</v-btn>
        </div> -->
      </v-tab-item>
      <!-- 협업 사후처리 -->
      <v-tab-item>
        <!-- list top -->
        <div class="d-flex align-center is-mt-s px-5">
          <span class="pl-label">전체 (<span class="is-txt-blue">{{ TTMT_LIST.length }}</span>)건</span>
          <v-checkbox
            v-model="ttmtPpt2Yn"
            class="pl-check ml-4"
            label="긴급"
          ></v-checkbox>
          <!-- 필터 팝업 -->
          <v-tooltip content-class="pl-tooltip bottom" bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-menu
                v-model="ttmtSrchMenu"
                max-width="350"
                bottom
                left
                offset-y
                rounded="lg"
                content-class="pa-4 pl-menu-drop"
                :close-on-content-click="false"
              >
                <template v-slot:activator="{ on: menuOn, attrs: menuAttrs }">
                  <v-btn
                    v-bind="menuAttrs"
                    v-on="menuOn"
                    class="pl-tooltip-btn ml-auto"
                    min-width="30"
                    height="30"
                    plain
                    >
                    <v-icon
                      v-bind="attrs"
                      v-on="on"
                      class="pl-icon20 filter"></v-icon>
                  </v-btn>
                </template>
                <div class="">
                  <div class="pl-form-inline-wrap vertical label-80 gap-8">
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        <v-icon class="pl-icon20 person-part"></v-icon>
                        <span class="ml-1">접수일</span>
                      </span>
                      <div class="pl-desc">
                        <compo-date-picker
                          DateType="dateInput"
                          :DateProp.sync="TTMT_SRCH_CONDITION.TTMT_START_DATE"/>
                        <compo-date-picker
                          DateType="dateInput"
                          :DateProp.sync="TTMT_SRCH_CONDITION.TTMT_END_DATE"/>
                      </div>
                    </div>
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        <v-icon class="pl-icon20 cs-phone"></v-icon>
                        <span class="ml-1">전화번호</span>
                      </span>
                      <div class="pl-desc">
                        <v-text-field
                          v-model="TTMT_SRCH_CONDITION.TTMT_SEARCH_TEL"
                          class="pl-form type-middle "
                          placeholder="전화번호 입력"
                        ></v-text-field>
                      </div>
                    </div>
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        <v-icon class="pl-icon20 person"></v-icon>
                        <span class="ml-1">고객명</span>
                      </span>
                      <div class="pl-desc">
                        <v-text-field
                          v-model="TTMT_SRCH_CONDITION.TTMT_CUST_NM"
                          class="pl-form type-middle "
                          placeholder="고객명 입력"
                        ></v-text-field>
                      </div>
                    </div>
                  </div>
                  <div class="pl-form-inline-wrap vertical label-80 is-border-top pt-3 gap-8">
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        <span class="ml-1">상담 메모</span>
                      </span>
                      <div class="pl-desc">
                        <v-text-field
                          v-model="TTMT_SRCH_CONDITION.TTMT_CNTNT"
                          class="pl-form type-middle "
                          placeholder="검색어 입력"
                        ></v-text-field>
                      </div>
                    </div>
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        <span class="ml-1">전달 내용</span>
                      </span>
                      <div class="pl-desc">
                        <v-text-field
                          v-model="TTMT_SRCH_CONDITION.TTMT_SHARE_CNTNT"
                          class="pl-form type-middle "
                          placeholder="검색어 입력"
                        ></v-text-field>
                      </div>
                    </div>
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        <span class="ml-1">처리 내용</span>
                      </span>
                      <div class="pl-desc">
                        <v-text-field
                          v-model="TTMT_SRCH_CONDITION.TTMT_PROC_CNTNT"
                          class="pl-form type-middle "
                          placeholder="검색어 입력"
                        ></v-text-field>
                      </div>
                    </div>
                  </div>
                  <div class="pl-btn-wrap is-mt-s">
                    <v-btn class="pl-btn is-sm ml-auto"
                      @click="getTtmtList">조회</v-btn>
                  </div>
                </div>
              </v-menu>
            </template>
            <span>필터</span>
          </v-tooltip>
          <compo-tooltip-btn
            TitleProp="새로고침"
            ClassProp="pl-tooltip-btn ml-1"
            IconProp="pl-icon20 refresh"
            TooltipPositionProp="bottom"
            @btnClick="getTtmtList"
          ></compo-tooltip-btn>
        </div>
        <!-- list -->
        <div
          style="height: calc(-262px + 100vh);"
          class="is-mt-s pl-notice-list type-acco is-border-top pl-scroll-body">
          <template v-for="item in TTMT_LIST">
            <div
            v-if="!ttmtPpt2Yn || (ttmtPpt2Yn && item.PROC_TYPE == 'PPT2')"
            class="pl-notice-list--unit"
            :key="item.id">
              <div
                @click="item.active = !item.active"
                :class="`d-flex acco-title active-${item.active}`">
                <img :src="item['ICON_URI'] !== '/'? '/upload/' + item['ICON_URL'] : require('@/assets/img/@manager_profile_default.png')" :alt="item['CUSL_NM']"  style="max-width: 35px; max-height: 35px" @error="function(e){e.target.src=require('@/assets/img/@manager_profile_default.png')}">
                <div class="d-flex align-center flex-grow-1">
                  <div class="ml-3">
                    <div>
                      <strong style="font-size: 14px">{{ item.CUSL_NM }}</strong>
                      <span class="ml-2 is-txt-sub">{{ item.DEPT_NM }}</span>
                      <span v-if="item.PROC_TYPE == 'PPT2'"
                        class="pl-badge is-red ml-1">긴급</span>
                    </div>
                    <div >
                      <strong>접수일자 </strong><span class="ml-1">{{ item.REG_DT }}</span>
                    </div>
                    <div >
                      <strong>전화번호 </strong><span class="ml-1">{{ item.CALLER_TEL ? mixin_setPhoneNo(item.CALLER_TEL.replace(/[^0-9]/g, "")) : '' }}({{ item.CUST_NM }})</span>
                    </div>
                    <div class="d-flex">
                      <strong class="flex-shrink-0">전달내용 </strong>
                      <span class="ml-2">{{ item.SHARE_CNTNT }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <template v-if="item.active">
                <div class="is-mt-s ml-12 is-border-sub-top pt-2">
                  <div class="pl-form-inline-wrap vertical type-auto">
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        상담메모
                      </span>
                      <div class="pl-desc">
                        <span class="pl-value-txt">{{ item.CUTT_CN }}</span>
                      </div>
                    </div>
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        진행내용
                      </span>
                      <div class="pl-desc">
                        <v-textarea
                          v-model="item.PROC_CNTNT"
                          height="60"
                          class="pl-form is-noresize"
                          :spellcheck="false"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="pl-btn-wrap is-mt-m">
                    <v-btn class="pl-btn is-sub ml-auto"
                      @click="viewDetail(item)">상세보기</v-btn>
                    <v-btn class="pl-btn is-esp " @click="btnSave(item)">저장</v-btn>
                  </div>
                </div>

              </template>
            </div>
          </template>
        </div>
      </v-tab-item>




    </v-tabs-items>
  </div>
</template>

<script>
export default {
  name: "StatusBoardSelfExec", //자체 사후처리
  components: {
  },
  props:{
    TabProp: {
      type: Number,
      default: null,
    }
  },
  data() {
    return {
      tabs1: 0,
      //자체 사후처리 긴급 체크박스
      stmtPpt2Yn: false,
      //협업 사후처리 긴급 체크박스
      ttmtPpt2Yn: false,
      TTMT_SRCH_CONDITION: {},
      ttmtSrchMenu: false,
      // 자체
      STMT_LIST: [

        // { img: require('@/assets/img/@manager_profile3.png'),
        //   name: '이세연',
        //   center: '바로처리센터 – 바로처리1팀',
        //   rcv_date: '2024-06-20 09:35:02',
        //   phone: '010-1004-1004',
        //   note: '240724-41-01264 240718-41-01171 2건 업체점검만 후 보수 미처리로 세대 동호변경요청 및 곰팡이로 인해 피해 본일 피부병원치료로 피해보상요청 ',
        //   active: false,
        //   cs_memo: '관리소 답변 안내 미수긍,타일 누를 시 벽쪽으로 밀림 주장. 보수 여부 본부 담당자에 확인 요청',
        //   cs_progress: '민원보고 완료'
        // },
        // { img: require('@/assets/img/@manager_profile6.png'),
        //   name: '김경란',
        //   center: '바로처리센터 – 바로처리1팀',
        //   rcv_date: '2024-06-20 09:35:02',
        //   phone: '010-1004-1004',
        //   note: '240724-41-01264 240718-41-01171 2건 업체점검만 후 보수 미처리로 세대 동호변경요청 및 곰팡이로 인해 피해 본일 피부병원치료로 피해보상요청 ',
        //   active: false,
        //   cs_memo: '관리소 답변 안내 미수긍,타일 누를 시 벽쪽으로 밀림 주장. 보수 여부 본부 담당자에 확인 요청',
        //   cs_progress: '민원보고 완료'
        // },
        // { img: require('@/assets/img/@manager_profile_default.png'),
        //   name: '정선애',
        //   center: '바로처리센터 – 바로처리1팀',
        //   rcv_date: '2024-06-20 09:35:02',
        //   phone: '010-1004-1004',
        //   note: '240724-41-01264 240718-41-01171 2건 업체점검만 후 보수 미처리로 세대 동호변경요청 및 곰팡이로 인해 피해 본일 피부병원치료로 피해보상요청 ',
        //   active: false,
        //   cs_memo: '관리소 답변 안내 미수긍,타일 누를 시 벽쪽으로 밀림 주장. 보수 여부 본부 담당자에 확인 요청',
        //   cs_progress: '민원보고 완료'
        // },
      ],
      // 협업
      TTMT_LIST: [

        // { img: require('@/assets/img/@manager_profile2.png'),
        //   name: '박민주',
        //   center: '바로처리센터 – 바로처리1팀',
        //   rcv_date: '2024-06-20 09:35:02',
        //   phone: '010-1004-1004',
        //   note: '240724-41-01264 240718-41-01171 2건 업체점검만 후 보수 미처리로 세대 동호변경요청 및 곰팡이로 인해 피해 본일 피부병원치료로 피해보상요청 ',
        //   active: false,
        //   cs_memo: '관리소 답변 안내 미수긍,타일 누를 시 벽쪽으로 밀림 주장. 보수 여부 본부 담당자에 확인 요청',
        //   cs_progress: '민원보고 완료'
        // },
        // { img: require('@/assets/img/@manager_profile3.png'),
        //   name: '이세연',
        //   center: '바로처리센터 – 바로처리1팀',
        //   rcv_date: '2024-06-20 09:35:02',
        //   phone: '010-1004-1004',
        //   note: '240724-41-01264 240718-41-01171 2건 업체점검만 후 보수 미처리로 세대 동호변경요청 및 곰팡이로 인해 피해 본일 피부병원치료로 피해보상요청 ',
        //   active: false,
        //   cs_memo: '관리소 답변 안내 미수긍,타일 누를 시 벽쪽으로 밀림 주장. 보수 여부 본부 담당자에 확인 요청',
        //   cs_progress: '민원보고 완료'
        // },
        // { img: require('@/assets/img/@manager_profile6.png'),
        //   name: '김경란',
        //   center: '바로처리센터 – 바로처리1팀',
        //   rcv_date: '2024-06-20 09:35:02',
        //   phone: '010-1004-1004',
        //   note: '240724-41-01264 240718-41-01171 2건 업체점검만 후 보수 미처리로 세대 동호변경요청 및 곰팡이로 인해 피해 본일 피부병원치료로 피해보상요청 ',
        //   active: false,
        //   cs_memo: '관리소 답변 안내 미수긍,타일 누를 시 벽쪽으로 밀림 주장. 보수 여부 본부 담당자에 확인 요청',
        //   cs_progress: '민원보고 완료'
        // },
        // { img: require('@/assets/img/@manager_profile_default.png'),
        //   name: '정선애',
        //   center: '바로처리센터 – 바로처리1팀',
        //   rcv_date: '2024-06-20 09:35:02',
        //   phone: '010-1004-1004',
        //   note: '240724-41-01264 240718-41-01171 2건 업체점검만 후 보수 미처리로 세대 동호변경요청 및 곰팡이로 인해 피해 본일 피부병원치료로 피해보상요청 ',
        //   active: false,
        //   cs_memo: '관리소 답변 안내 미수긍,타일 누를 시 벽쪽으로 밀림 주장. 보수 여부 본부 담당자에 확인 요청',
        //   cs_progress: '민원보고 완료'
        // },
      ],

    }
  },
  computed: {
  },
  watch: {
    TabProp() {
      this.tabs1 = this.TabProp - 1;
    },
    tabs1() {
      if(this.tabs1 == 0) {
        this.getStmtList();
      } else {
        this.getTtmtList();
      }
    }

  },
  mounted() {
  },
  created() {
    this.ttmtSrchConditionInit();
    this.tabs1 = this.TabProp - 1;
    console.log("CUTT_MONITOR_INBD_AFTER_PROC_STAT, tabs1", this.CUTT_MONITOR_INBD_AFTER_PROC_STAT, this.tabs1);
    if(this.tabs1 == 0) {
      this.getStmtList();
    } else {
      this.getTtmtList();
    }
  },
  methods: {

    //협업사후처리 검색조건 초기화.
    ttmtSrchConditionInit() {
      this.TTMT_SRCH_CONDITION = {
        TTMT_START_DATE: '',
        TTMT_END_DATE: '',
        TTMT_SEARCH_TEL: '',
        TTMT_CUST_NM: '',
        TTMT_CNTNT: '',
        TTMT_SHARE_CNTNT: '',
        TTMT_PROC_CNTNT: '',
      }
    },

    //자체 사후처리 목록 조회
    async getStmtList() {
      console.log("getStmtList");
      this.STMT_LIST = [];
      const postParam = {
      };
      const headParam = {head: {
        ns: 'lhcs.phone.as.dao.PhoneAsCuttMapper'
      }};
      let response = await this.common_postCall("/api/biz/common/select/selectStmtList ", postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        response.DATA.map(item => {
          item.active = false;
        });
        this.STMT_LIST = response.DATA
        console.log("this.STMT_LIST", this.STMT_LIST)
      }
    },

    //협업 사후처리 목록 조회
    async getTtmtList() {
      this.ttmtSrchMenu = false;
      console.log("getTtmtList");
      this.TTMT_LIST = [];
      const postParam = this.TTMT_SRCH_CONDITION;
      const headParam = {head: {
        ns: 'lhcs.phone.as.dao.PhoneAsCuttMapper'
      }};
      let response = await this.common_postCall("/api/biz/common/select/selectTtmtList ", postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        response.DATA.map(item => {
          item.active = false;
        });
        this.TTMT_LIST = response.DATA;
        console.log("this.TTMT_LIST", this.TTMT_LIST)

      }
    },

    //전화상담 - 고객전화번호 조회 호출
    viewDetail(item) {
      console.log("item", item)
      //전화상담탭이 있는지 확인
      let m0100 = false;
      if(this.$store.getters['commonStore/GE_COMMON_ACTIVE_TAB'].id === 'CSL_M0100') m0100 = true;

      if(!m0100) this.mixin_set_active_tab({PATH_NM:'/CSL_M0100', NODE_TITLE:'전화상담'});
      setTimeout(() => {
        this.$eventBus.$emit("setCuttUnProcCustInfo", {CUST_NO: item.CUST_ID, PHN_CUTT_ID: item.PHN_CUTT_ID, HNO: item.HNO, MON_Q_TASK: this.tabs1 == 0 ? "STMT" : "TTMT"})
        this.$emit("closeSlide");
      }, !m0100?1000:10);

    },

    async btnSave(item) {
      this.showConfirmInfo({
        msg:'처리진행내용을 저장하시겠습니까?'
        , callYes: () => {
          this.save(item);
          this.closeAlert();
        }
        , callNo: this.closeAlert
      });


    },

    async save(item) {
      const postParam = {
        SHARE_TYPE: item.SHARE_TYPE,
				PHN_CUTT_ID: item.PHN_CUTT_ID,
				PROC_CNTNT: item.PROC_CNTNT
      };
      const headParam = {head: {
        ns: 'lhcs.phone.as.dao.PhoneAsCuttMapper'
      }};
      let response = await this.common_postCall("/api/biz/common/update/updateCallCnsltPrcShare ", postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        this.showToastInfo({msg:'정상 처리 되었습니다.'})
      }
    }
  },
};
</script>

<style lang="scss" scoped>

</style>