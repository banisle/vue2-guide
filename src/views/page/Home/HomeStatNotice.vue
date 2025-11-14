<template>
  <div class="" style="flex: 1 1 calc(27%);">
    <div class="d-flex fill-height" style="gap: 24px;">
      <!-- 공지사항 -->
      <div class="pl-rounded-box" style="flex: 1 1 calc(70%);">
        <div class="">
          <v-tabs v-model="SELECT_TAB" class="pl-tabs is-trans">
            <v-tab v-for="item, index in GRID.TABS">
              <v-badge :value="item.ALARMYN === 'Y' ? true : false" color="#0073ce" bordered offset-x="-1" offset-y="9" dot>
                {{ item.TAB_NM }}
              </v-badge>
            </v-tab>
            <div class="ml-auto pl-btn-wrap">
              <compo-tooltip-btn TitleProp="상세보기" ClassProp="pl-tooltip-btn ml-auto mr-3" IconProp="pl-icon20 plus"
                TooltipPositionProp="bottom" :MinWidthProp=22 :HeightProp=22
                @btnClick="showSlideList('slideNotice')"></compo-tooltip-btn>
            </div>
          </v-tabs>
          <v-tabs-items v-model="SELECT_TAB">
            <v-tab-item v-for="list, index in GRID.TABS">
              <div class="d-flex flex-column px-5 py-4" style="gap: 8px">
                <template v-if="GRID.ITEMS[index].length > 0">
                  <div class="hover-bold" v-for="item in GRID.ITEMS[index]"
                    :style="`display: grid;grid-template-columns: ${(GRID.TABS[index].BBS_TYPE_CD === 'EMRG_NTC'/*긴급게시판인경우*/ || GRID.TABS[index].BBS_TYPE_CD === 'GNRL_BBS'/*일반게시판인경우*/) ? '0' : '120'}px 1fr 80px;`"
                    @click="showSlide('slideNotice', index, item)" :key="item.id">
                    <span>
                      <span
                        v-if="(GRID.TABS[index].BBS_TYPE_CD !== 'EMRG_NTC'/*긴급게시판인경우*/ && GRID.TABS[index].BBS_TYPE_CD !== 'GNRL_BBS'/*일반게시판인경우*/)">
                        {{ item.PST_TYPE_CD_NM }} </span>
                    </span>
                    <span class="is-ellips">
                      <span v-if="item.POPUP_YN === 'Y'"><span class="pl-badge is-new">고정</span> </span>
                      {{ item.PST_TTL }}
                      <span v-if="item.FILE_GROUP_KEY"><v-icon class="pl-icon20 file"></v-icon></span>
                      <span v-if="item.IS_NEW === 'Y'"><span class="pl-badge is-new ml-1">N</span></span>
                    </span>
                    <span class="text-right">
                      {{ item.REG_DT_DD }}
                    </span>
                  </div>
                </template>
                <template v-else>
                  <div class="pl-card pl-list-nodata">
                    <span>조회된 정보가 없습니다.</span>
                  </div>
                </template>
              </div>
            </v-tab-item>
          </v-tabs-items>
        </div>
      </div>
      <!-- 지식 정보 -->
      <div style="width: 378px; flex: 0 0 378px;">
        <div class="pl-rounded-box fill-height">
          <div class="d-flex align-center pl-5 pr-3" style="height: 45px">
            <span class="pl-subtit">지식 정보</span>
            <!-- 툴팁 버튼 -->
            <compo-tooltip-btn TitleProp="상세보기" ClassProp="pl-tooltip-btn ml-auto" IconProp="pl-icon20 plus"
              TooltipPositionProp="bottom" @btnClick="$eventBus.$emit('openKnowledgeSlide')"></compo-tooltip-btn>
          </div>
          <div class="is-border-top px-5 py-4" style="height: calc(100% - 45px);">
            <div class="d-flex flex-column " style="gap: 8px" v-if="!mixin_isEmpty(CONTS_LIST)">
              <div class="d-inline-flex hover-bold" v-for="item in CONTS_LIST" :key="item.id">
                <span class="is-ellips" style="width: auto;"
                  @click="$eventBus.$emit('openKnowledgeSlide', item.KMS_CONTS_ID)">
                  {{ item.KMS_CONTS_NM }}
                </span>
                <span v-if="item.IS_NEW"><span class="pl-badge is-new ml-1">N</span></span>
              </div>
            </div>
            <div class="d-flex flex-column fill-height justify-center" style="gap: 8px" v-else>
              <div class="d-inline hover-bold">
                <div class="pl-list-nodata">
                  <span>조회된 정보가 없습니다.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: "HomeStatNotice", //name은 'MENU_' + 파일명 조합
  components: {
  },
  data() {
    return {

      SELECT_TAB: 1,
      GRID: {
        TABS: [],
        ITEMS: []
      },

      CONTS_LIST: [],
    }
  },
  methods: {
    showSlide(slide, tabNum, item) {
      item.tabNum = tabNum;
      this.$eventBus.$emit('showVSlideXreverse', { slide: slide, tabNum: tabNum, injectionObj: item })
    },
    showSlideList(slide) {
      this.GRID.TABS[this.SELECT_TAB].tabNum = this.SELECT_TAB;
      this.$eventBus.$emit('showVSlideXreverse', { slide: slide, tabNum: this.SELECT_TAB, injectionObj: this.GRID.TABS[this.SELECT_TAB] });
    },


    async selectHomeHeaderBbsList() {

      let sURL = '/api/biz/common/select/selectHomeHeaderBbsList';
      let postParam = {
        SRCH_DEPT_ID: this.computedUserDeptId
        , SRCH_CENTER_DEPT_ID: this.computedUserCenterDeptId
        , SRCH_CUSTCO_ID: this.computedUserCenter
      };
      let headParam = { head: { ns: 'lhcs.system.bbs.dao.BbsMapper' } };
      let response = await this.common_postCall(sURL, postParam, headParam)
      if (!response.HEADER.ERROR_FLAG) {
        this.GRID.TABS = [];
        this.GRID.ITEMS = [];
        this.GRID.TABS = response.DATA;
        for (let i = 0; i < this.GRID.TABS.length; i++) {
          this.GRID.ITEMS[i] = [];
        }
        this.selectHomeBbsList();
      }
    },
    async selectHomeBbsList() {
      let obj = this.GRID.TABS[this.SELECT_TAB];

      let sURL = '/api/biz/common/select/selectHomeBbsList';
      let postParam = {};
      postParam.SRCH_TYPE = 'HOME';
      postParam.SRCH_DEPT_ID = this.computedUserDeptId;
      postParam.SRCH_CENTER_DEPT_ID = this.computedUserCenterDeptId;
      postParam.SRCH_CUSTCO_ID = this.computedUserCenter;
      postParam.SRCH_ROWNUM = 15;
      postParam.SRCH_BBS_TYPE_CD = obj.BBS_TYPE_CD;
      postParam.SRCH_BBS_GB = obj.BBS_GB;
      postParam.SRCH_BBS_ID = obj.BBS_ID;
      postParam.SRCH_BBS_USE_SE_CD = "" + obj.BBS_USE_SE_CD;
      let headParam = { head: { ns: 'lhcs.system.bbs.dao.BbsMapper' } };
      let response = await this.common_postCall(sURL, postParam, headParam)
      if (!response.HEADER.ERROR_FLAG) {
        let responseData = response.DATA;
        responseData.map((item, idx) => {
          if (idx === 5) return true;
          item.PST_TTL = this.restoreXSS(item.PST_TTL);
          item.SELECT_TAB = this.SELECT_TAB;
          item.BBS_TYPE_CD = obj.BBS_TYPE_CD;
          item.BBS_GB = obj.BBS_GB;
          item.BBS_USE_SE_CD = obj.BBS_USE_SE_CD;
        });
        this.GRID.ITEMS[this.SELECT_TAB] = [];
        this.GRID.ITEMS.splice(this.SELECT_TAB, 1, responseData.filter((item, idx) => idx < 5));
      }
    },
    async getContsList() {

      this.CONTS_LIST = []
      let sUrl = '/api/km/right/rightContsList';

      let postParam = {
        SE_CD: 'KNOWLEDGE'
        , SRCH_CENTER_PARTIAL: this.computedUserCenter === "-1" ? "N" : "Y"
      };

      let headParam = {
        head: {
          ROW_CNT: 5,
          PAGES_CNT: 1,
          PAGING: "Y",
        }
      };
      let response = await this.common_postCall(sUrl, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG) {
        if (response.DATA) {
          response.DATA.map((item, idx) => {
            item.IS_NEW = item.MDFCN_DT > this.$moment().subtract(7, 'days').format('YYYYMMDD') + '000000' ? true : false
            this.CONTS_LIST.push(item)
          })
        }
      }
    },
  },
  async mounted() {
    console.log("** HomeStatNotice.vue.mounted()");
  },
  async created() {
    this.selectHomeHeaderBbsList();
    this.getContsList();
    this.$eventBus.$on('reloadBoardList', (type) => {
      console.log("HomeStatNotice.reloadBoardList");
      this.selectHomeBbsList();
    });
  },
  beforeDestroy() {
    this.$eventBus.$off("reloadBoardList");

  },
  computed: {
  },
  watch: {
    SELECT_TAB() {
      if (this.SELECT_TAB != undefined) {
        console.log("watch.SELECT_TAB :: " + this.SELECT_TAB);
        this.selectHomeBbsList();
      }
    }
  },
};
</script>

<style lang="scss" scoped></style>