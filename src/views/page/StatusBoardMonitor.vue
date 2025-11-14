<template>
  <div class="py-5">
    <v-tabs
      v-model="tabs1"
      hide-slider
      class="pl-tabs type-fill tab-grow px-5">
      <v-tab>전체 미처리</v-tab>
      <v-tab>금일 미처리</v-tab>
      <v-tab>전일 미처리</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabs1">
      <!-- 전체 미처리 -->
      <v-tab-item >
        <!-- list top -->
        <div class="d-flex align-center is-mt-s px-5">
          <span class="pl-label">전체 (<span class="is-txt-blue">{{ gridTotalCnt }}</span>)건</span>

          <!-- 필터 팝업 -->
          <v-tooltip content-class="pl-tooltip bottom" bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-menu
                min-width="300"
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
                  <div class="pl-form-inline-wrap vertical label-100 gap-8">
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        <v-icon class="pl-icon20 person-part"></v-icon>
                        <span class="ml-1">부서(팀)</span>
                      </span>
                      <div class="pl-desc">
                        <v-select
                          v-model="SCH_DEPT_ID"
                          class="pl-form type-middle"
                          :items="mixin_ognz_list_detail(common_ognz_list, computedUserCenterDeptId, '전체' )"
                          placeholder="전체"
                          :disabled="computedUserDetailType === 'TEAM_LEADER' || computedUserDetailType === 'MANAGER'?true:false"
                          @change="computedUserDetailType === 'TEAM_LEADER' || computedUserDetailType === 'MANAGER'?'':getUserList()"
                        ></v-select>
                      </div>
                    </div>
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        <v-icon class="pl-icon20 person"></v-icon>
                        <span class="ml-1">상담사</span>
                      </span>
                      <div class="pl-desc">
                        <v-autocomplete
                          v-model="SCH_CUSL_ID"
                          :items="userList"
                          item-text="USER_NM"
                          item-value="USER_ID"
                          class="pl-form type-middle"
                          placeholder="전체"
                        ></v-autocomplete>
                      </div>
                    </div>
                  </div>
                  <div class="pl-form-inline-wrap vertical label-100 is-border-top pt-3 gap-8">
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        <v-icon class="pl-icon20 cs-phone"></v-icon>
                        <span class="ml-1">고객 전화번호</span>
                      </span>
                      <div class="pl-desc">
                        <v-text-field
                          v-model="SCH_CUST_PHN_NO"
                          class="pl-form type-middle"
                          placeholder="전화번호 입력"
                          maxlength="14"
                          hide-spin-buttons
                          type="text"
                          @keyup="setPhoneNo('SCH_CUST_PHN_NO')"
                          oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
                        ></v-text-field>
                      </div>
                    </div>
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        <v-icon class="pl-icon20 nametag"></v-icon>
                        <span class="ml-1">고객 ID</span>
                      </span>
                      <div class="pl-desc">
                        <v-text-field
                          v-model="SCH_CUST_IDNTF_NO"
                          class="pl-form type-middle"
                          placeholder="아이디 입력"
                        ></v-text-field>
                      </div>
                    </div>
                  </div>
                  <div class="pl-btn-wrap is-mt-s">
                    <v-btn class="pl-btn is-sm ml-auto" @click="cuttUnProcList(0, '')">조회</v-btn>
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
            @btnClick="reFreshCuttUnProc"
          ></compo-tooltip-btn>

        </div>
        <!-- list -->
        <div
          style="height: calc(-262px + 100vh);"
          class="is-mt-s pl-notice-list no-link is-border-top pl-scroll-body">
          <div
            class="pl-notice-list--unit d-flex align-center"
            v-for="item in items"
            @click="setCustCuttInfo(item)"
            :key="item.id">
            <!-- <img :src="item.img" :alt="item.CUSL_NM" style="max-width: 35px; max-height: 35px"> -->
            <img :src="item['ICON_URL'] !== '/'? '/upload/' + item['ICON_URL'] : require('@/assets/img/@manager_profile_default.png')" :alt="item['CUSL_NM']"  style="max-width: 35px; max-height: 35px; border-radius: 50%;" @error="function(e){e.target.src=require('@/assets/img/@manager_profile_default.png')}">

            <div class="ml-3">
              <div>
                <strong style="font-size: 14px">{{ item.CUSL_NM }}</strong>
                <span class="ml-2 is-txt-sub">{{ item.DEPT_NM }}</span>
              </div>
              <div >
                <span>접수일 {{ mixin_convertDate(item.REG_DT, 'yyyy-MM-dd HH:mm:ss') }}</span>
                <span class="ml-2">전화번호 {{ mixin_setPhoneNo(item.TEL_NO.replace(/[^0-9]/g, "")) }}</span>
              </div>
            </div>
          </div>
          <!-- 더보기 -->
          <div v-if="!nextDisabled" class="d-flex justify-center is-mt-m pb-3">
            <v-btn class="pl-btn is-round is-sub px-4" @click="cuttUnProcList(0, 'next')">더보기</v-btn>
          </div>
          <div class="pl-list-nodata" v-if="items.length === 0">
            <span>등록된 데이터가 없습니다.</span>
          </div>
        </div>
      </v-tab-item>
      <!-- 금일 미처리 -->
      <v-tab-item >
        <!-- list top -->
        <div class="d-flex align-center is-mt-s px-5">
          <span class="pl-label">전체 (<span class="is-txt-blue">{{ gridTotalCnt1 }}</span>)건</span>

          <!-- 필터 팝업 -->
          <v-tooltip content-class="pl-tooltip bottom" bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-menu
                min-width="300"
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
                  <div class="pl-form-inline-wrap vertical label-100 gap-8">
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        <v-icon class="pl-icon20 person-part"></v-icon>
                        <span class="ml-1">부서(팀)</span>
                      </span>
                      <div class="pl-desc">
                        <v-select
                          v-model="SCH_DEPT_ID1"
                          class="pl-form type-middle"
                          :items="mixin_ognz_list_detail(common_ognz_list, computedUserCenterDeptId, '전체' )"
                          placeholder="전체"
                          :disabled="computedUserDetailType === 'TEAM_LEADER' || computedUserDetailType === 'MANAGER'?true:false"
                          @change="computedUserDetailType === 'TEAM_LEADER' || computedUserDetailType === 'MANAGER'?'':getUserList()"
                        ></v-select>
                      </div>
                    </div>
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        <v-icon class="pl-icon20 person"></v-icon>
                        <span class="ml-1">상담사</span>
                      </span>
                      <div class="pl-desc">
                        <v-autocomplete
                          v-model="SCH_CUSL_ID1"
                          :items="userList1"
                          item-text="USER_NM"
                          item-value="USER_ID"
                          class="pl-form type-middle"
                          placeholder="전체"
                        ></v-autocomplete>
                      </div>
                    </div>
                  </div>
                  <div class="pl-form-inline-wrap vertical label-100 is-border-top pt-3 gap-8">
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        <v-icon class="pl-icon20 cs-phone"></v-icon>
                        <span class="ml-1">고객 전화번호</span>
                      </span>
                      <div class="pl-desc">
                        <v-text-field
                          v-model="SCH_CUST_PHN_NO1"
                          class="pl-form type-middle"
                          placeholder="전화번호 입력"
                          maxlength="14"
                          hide-spin-buttons
                          type="text"
                          @keyup="setPhoneNo('SCH_CUST_PHN_NO1')"
                          oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
                        ></v-text-field>
                      </div>
                    </div>
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        <v-icon class="pl-icon20 nametag"></v-icon>
                        <span class="ml-1">고객 ID</span>
                      </span>
                      <div class="pl-desc">
                        <v-text-field
                          v-model="SCH_CUST_IDNTF_NO1"
                          class="pl-form type-middle"
                          placeholder="아이디 입력"
                        ></v-text-field>
                      </div>
                    </div>
                  </div>
                  <div class="pl-btn-wrap is-mt-s">
                    <v-btn class="pl-btn is-sm ml-auto" @click="cuttUnProcList(1, '')">조회</v-btn>
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
            @btnClick="reFreshCuttUnProc"
          ></compo-tooltip-btn>

        </div>
        <!-- list -->
        <div
          style="height: calc(-262px + 100vh);"
          class="is-mt-s pl-notice-list no-link is-border-top pl-scroll-body">
          <div
            class="pl-notice-list--unit d-flex align-center"
            v-for="item in items1"
            @click="setCustCuttInfo(item)"
            :key="item.id">
            <!-- <img :src="item.img" :alt="item.CUSL_NM" style="max-width: 35px; max-height: 35px"> -->
            <img :src="item['ICON_IMG_URI'] !== '/'? '/upload/' + item['ICON_URL'] : require('@/assets/img/@manager_profile_default.png')" :alt="item['CUSL_NM']"  style="max-width: 35px; max-height: 35px; border-radius: 50%;" @error="function(e){e.target.src=require('@/assets/img/@manager_profile_default.png')}">

            <div class="ml-3">
              <div>
                <strong style="font-size: 14px">{{ item.CUSL_NM }}</strong>
                <span class="ml-2 is-txt-sub">{{ item.DEPT_NM }}</span>
              </div>
              <div >
                <span>접수일 {{ mixin_convertDate(item.REG_DT, 'yyyy-MM-dd HH:mm:ss') }}</span>
                <span class="ml-2">전화번호 {{ mixin_setPhoneNo(item.TEL_NO.replace(/[^0-9]/g, "")) }}</span>
              </div>
            </div>
          </div>
          <!-- 더보기 -->
          <div v-if="!nextDisabled1" class="d-flex justify-center is-mt-m pb-3">
            <v-btn class="pl-btn is-round is-sub px-4" @click="cuttUnProcList(1, 'next')">더보기</v-btn>
          </div>
          <div class="pl-list-nodata" v-if="items1.length === 0">
            <span>등록된 데이터가 없습니다.</span>
          </div>
        </div>
      </v-tab-item>
      <!-- 전일 미처리 -->
      <v-tab-item >
        <!-- list top -->
        <div class="d-flex align-center is-mt-s px-5">
          <span class="pl-label">전체 (<span class="is-txt-blue">{{ gridTotalCnt2 }}</span>)건</span>

          <!-- 필터 팝업 -->
          <v-tooltip content-class="pl-tooltip bottom" bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-menu
                min-width="300"
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
                  <div class="pl-form-inline-wrap vertical label-100 gap-8">
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        <v-icon class="pl-icon20 person-part"></v-icon>
                        <span class="ml-1">부서(팀)</span>
                      </span>
                      <div class="pl-desc">
                        <v-select
                          v-model="SCH_DEPT_ID2"
                          class="pl-form type-middle"
                          :items="mixin_ognz_list_detail(common_ognz_list, computedUserCenterDeptId, '전체' )"
                          placeholder="전체"
                          :disabled="computedUserDetailType === 'TEAM_LEADER' || computedUserDetailType === 'MANAGER'?true:false"
                          @change="computedUserDetailType === 'TEAM_LEADER' || computedUserDetailType === 'MANAGER'?'':getUserList()"
                        ></v-select>
                      </div>
                    </div>
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        <v-icon class="pl-icon20 person"></v-icon>
                        <span class="ml-1">상담사</span>
                      </span>
                      <div class="pl-desc">
                        <v-autocomplete
                          v-model="SCH_CUSL_ID2"
                          :items="userList2"
                          item-text="USER_NM"
                          item-value="USER_ID"
                          class="pl-form type-middle"
                          placeholder="전체"
                        ></v-autocomplete>
                      </div>
                    </div>
                  </div>
                  <div class="pl-form-inline-wrap vertical label-100 is-border-top pt-3 gap-8">
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        <v-icon class="pl-icon20 cs-phone"></v-icon>
                        <span class="ml-1">고객 전화번호</span>
                      </span>
                      <div class="pl-desc">
                        <v-text-field
                          v-model="SCH_CUST_PHN_NO2"
                          class="pl-form type-middle"
                          placeholder="전화번호 입력"
                          maxlength="14"
                          hide-spin-buttons
                          type="text"
                          @keyup="setPhoneNo('SCH_CUST_PHN_NO2')"
                          oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
                        ></v-text-field>
                      </div>
                    </div>
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        <v-icon class="pl-icon20 nametag"></v-icon>
                        <span class="ml-1">고객 ID</span>
                      </span>
                      <div class="pl-desc">
                        <v-text-field
                          v-model="SCH_CUST_IDNTF_NO2"
                          class="pl-form type-middle"
                          placeholder="아이디 입력"
                        ></v-text-field>
                      </div>
                    </div>
                  </div>
                  <div class="pl-btn-wrap is-mt-s">
                    <v-btn class="pl-btn is-sm ml-auto" @click="cuttUnProcList(2, '')">조회</v-btn>
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
            @btnClick="reFreshCuttUnProc"
          ></compo-tooltip-btn>

        </div>
        <!-- list -->
        <div
          style="height: calc(-262px + 100vh);"
          class="is-mt-s pl-notice-list no-link is-border-top pl-scroll-body">
          <div
            class="pl-notice-list--unit d-flex align-center"
            v-for="item in items2"
            @click="setCustCuttInfo(item)"
            :key="item.id">
            <!-- <img :src="item.img" :alt="item.CUSL_NM" style="max-width: 35px; max-height: 35px"> -->
            <img :src="item['ICON_IMG_URI'] !== '/'? '/upload/' + item['ICON_URL'] : require('@/assets/img/@manager_profile_default.png')" :alt="item['CUSL_NM']"  style="max-width: 35px; max-height: 35px; border-radius: 50%;" @error="function(e){e.target.src=require('@/assets/img/@manager_profile_default.png')}">

            <div class="ml-3">
              <div>
                <strong style="font-size: 14px">{{ item.CUSL_NM }}</strong>
                <span class="ml-2 is-txt-sub">{{ item.DEPT_NM }}</span>
              </div>
              <div >
                <span>접수일 {{ mixin_convertDate(item.REG_DT, 'yyyy-MM-dd HH:mm:ss') }}</span>
                <span class="ml-2">전화번호 {{ mixin_setPhoneNo(item.TEL_NO.replace(/[^0-9]/g, "")) }}</span>
              </div>
            </div>
          </div>
          <!-- 더보기 -->
          <div v-if="!nextDisabled2" class="d-flex justify-center is-mt-m pb-3">
            <v-btn class="pl-btn is-round is-sub px-4" @click="cuttUnProcList(2, 'next')">더보기</v-btn>
          </div>
          <div class="pl-list-nodata" v-if="items2.length === 0">
            <span>등록된 데이터가 없습니다.</span>
          </div>
        </div>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
export default {
  name: "StatusBoardMonitor", //name은 'MENU_' + 파일명 조합
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
      common_ognz_list:[], //조직정보
      tabs1: 0,

      //검색
      userList : [{USER_NM : '전체', USER_ID : ''}], //사용자 목록
      userList1 : [{USER_NM : '전체', USER_ID : ''}], //사용자 목록
      userList2 : [{USER_NM : '전체', USER_ID : ''}], //사용자 목록
      SCH_DEPT_ID : '',
      SCH_DEPT_ID1 : '',
      SCH_DEPT_ID2 : '',
      SCH_CUSL_ID : '', //상담사
      SCH_CUSL_ID1 : '', //상담사
      SCH_CUSL_ID2 : '', //상담사
      SCH_CUST_PHN_NO : '',//고객 전화번호
      SCH_CUST_PHN_NO1 : '',//고객 전화번호
      SCH_CUST_PHN_NO2 : '',//고객 전화번호
      SCH_CUST_IDNTF_NO : '',//고객 ID
      SCH_CUST_IDNTF_NO1 : '',//고객 ID
      SCH_CUST_IDNTF_NO2 : '',//고객 ID

      pagination : [
        {page: 1, rowsPerPage: 10, sortBy: "", descending: ""}
        ,{page: 1, rowsPerPage: 10, sortBy: "", descending: ""}
        ,{page: 1, rowsPerPage: 10, sortBy: "", descending: ""}
      ],//그리드 페이지속성정의
      nextDisabled:true,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼
      nextDisabled1:true,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼
      nextDisabled2:true,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼

      items: [],
      items1: [],
      items2: [],

      gridTotalCnt : 0,
      gridTotalCnt1 : 0,
      gridTotalCnt2 : 0,

      CUTT_DAY : null,
    }
  },
  computed: {
  },
  watch: {
    TabProp() {
      this.tabs1 = this.TabProp;
    },
    tabs1() {
      if(this.computedUserDetailType === 'TEAM_LEADER' || this.computedUserDetailType === 'MANAGER'){ //팀장(부팀장), 상담사
        if(this.tabs1 === 0){
          this.SCH_DEPT_ID = this.computedUserDeptId;
        }else if(this.tabs1 === 1){
          this.SCH_DEPT_ID1 = this.computedUserDeptId;
        }else if(this.tabs1 === 2){
          this.SCH_DEPT_ID2 = this.computedUserDeptId;
        }

        this.getUserList();
      }

      if(this.tabs1 === 0){
        this.CUTT_DAY = null;
      }else if(this.tabs1 === 1){
        this.CUTT_DAY = 1;
      }else if(this.tabs1 === 2){
        this.CUTT_DAY = 2;
      }

      this.cuttUnProcList(this.tabs1);
    }
  },
  mounted() {
  },
  beforeDestroy(){
    this.$eventBus.$off("leftEvtCuttUnProcList"); //eventBus 중복방지를 위해 off
  },
  async created() {
    this.tabs1 = this.TabProp;
    this.common_ognz_list =  await this.mixin_ognz_list();

    this.cuttUnProcList(this.tabs1);//상담 미처리 목록

    this.$eventBus.$on("leftEvtCuttUnProcList", (tabNum) => {
      this.tabs1 = tabNum;
    });

    if(this.computedUserDetailType === 'TEAM_LEADER' || this.computedUserDetailType === 'MANAGER'){ //팀장(부팀장), 상담사
      if(this.tabs1 === 0){
        this.SCH_DEPT_ID = this.computedUserDeptId;
      }else if(this.tabs1 === 1){
        this.SCH_DEPT_ID1 = this.computedUserDeptId;
      }else if(this.tabs1 === 2){
        this.SCH_DEPT_ID2 = this.computedUserDeptId;
      }
    }

    if(this.tabs1 === 0){
      this.CUTT_DAY = null;
    }else if(this.tabs1 === 1){
      this.CUTT_DAY = 1;
    }else if(this.tabs1 === 2){
      this.CUTT_DAY = 2;
    }

    this.getUserList();
  },
  methods: {
    //상담 미처리 목록
    async cuttUnProcList(selIdx, next){
      let postParam = {
        TEAM_YN : 'Y' //팀 여부
        , RSRV_YN : 'N' //통화예약이 아닌 미처리
        , USER_DTL_TYPE : this.computedUserDetailType
        , CUTT_DAY : this.CUTT_DAY
      };

      if(this.computedUserDetailType === 'TEAM_LEADER' || this.computedUserDetailType === 'MANAGER'){ //팀장(부팀장), 상담사
        postParam.DEPT_ID = this.computedUserDeptId;
      }else{
        if(selIdx === 0){
          postParam.DEPT_ID = this.SCH_DEPT_ID;
        }else if(selIdx === 1){
          postParam.DEPT_ID = this.SCH_DEPT_ID1;
        }else if(selIdx === 2){
          postParam.DEPT_ID = this.SCH_DEPT_ID2;
        }
      }

      if(selIdx === 0){
        postParam.CUSL_ID = this.SCH_CUSL_ID;
        postParam.CUST_PHN_NO = this.SCH_CUST_PHN_NO.replace(/[^0-9]/g, '');
        postParam.CUST_IDNTF_NO = this.SCH_CUST_IDNTF_NO;
      }else if(selIdx === 1){
        postParam.CUSL_ID = this.SCH_CUSL_ID1;
        postParam.CUST_PHN_NO = this.SCH_CUST_PHN_NO1.replace(/[^0-9]/g, '');
        postParam.CUST_IDNTF_NO = this.SCH_CUST_IDNTF_NO1;
      }else if(selIdx === 2){
        postParam.CUSL_ID = this.SCH_CUSL_ID2;
        postParam.CUST_PHN_NO = this.SCH_CUST_PHN_NO2.replace(/[^0-9]/g, '');
        postParam.CUST_IDNTF_NO = this.SCH_CUST_IDNTF_NO2;
      }

      //다음버튼 클릭 유무
      if (this.tabs1 === selIdx && next == 'next'){
      } else {
        this.pagination[selIdx].page = 1; //페이징 처리 초기화
        if(selIdx === 0){
          this.items = [];
          this.nextDisabled = true;  //버튼 비활성화
        }else if(selIdx === 1){
          this.items1 = [];
          this.nextDisabled1 = true;  //버튼 비활성화
        }else if(selIdx === 2){
          this.items2 = [];
          this.nextDisabled2 = true;  //버튼 비활성화
        }
      }

      let headParam = {
        head: {
          ROW_CNT : this.pagination[selIdx].rowsPerPage,
          PAGES_CNT : this.pagination[selIdx].page,
          PAGING : 'Y',
          ns: "lhcs.phone.cutt.dao.PhoneCuttMapper",
          sn: "cuttUnProcList"
        }
      };

      const response = await this.common_postCall("/api/biz/common/select/cuttUnProcList", postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        // if(response.DATA.length > 0){
          let tempDataText = response.DATA;

          if(selIdx === 0){
            this.items = [...this.items, ...tempDataText];

            if(response.HEADER.next !== null && response.HEADER.next !== undefined){
              if(response.HEADER.next === true){
                this.nextDisabled = false //버튼 활성화
              }else{
                this.nextDisabled = true  //버튼 비활성화
              }
            }
            if(this.items.length > 0) this.gridTotalCnt = response.HEADER.TOT_COUNT;
            else this.gridTotalCnt = 0;
          }else if(selIdx === 1){
            this.items1 = [...this.items1, ...tempDataText];

            if(response.HEADER.next !== null && response.HEADER.next !== undefined){
              if(response.HEADER.next === true){
                this.nextDisabled1 = false //버튼 활성화
              }else{
                this.nextDisabled1 = true  //버튼 비활성화
              }
            }
            if(this.items1.length > 0) this.gridTotalCnt1 = response.HEADER.TOT_COUNT;
            else this.gridTotalCnt1 = 0;
          }else if(selIdx === 2){
            this.items2 = [...this.items2, ...tempDataText];

            if(response.HEADER.next !== null && response.HEADER.next !== undefined){
              if(response.HEADER.next === true){
                this.nextDisabled2 = false //버튼 활성화
              }else{
                this.nextDisabled2 = true  //버튼 비활성화
              }
            }
            if(this.items2.length > 0) this.gridTotalCnt2 = response.HEADER.TOT_COUNT;
            else this.gridTotalCnt2 = 0;
          }

          this.pagination[selIdx].page += 1;
        // }
      }
    },

    //사용자 목록 조회
    async getUserList() {
      let postParam = {
        SCH_TYPE : 'CUSL',
        SCH_GROUP_ID : this.computedUserCenterDeptId,
      };

      if(this.tabs1 === 0){
        postParam.SCH_DEPT_ID = this.SCH_DEPT_ID;
      }else if(this.tabs1 === 1){
        postParam.SCH_DEPT_ID = this.SCH_DEPT_ID1;
      }else if(this.tabs1 === 2){
        postParam.SCH_DEPT_ID = this.SCH_DEPT_ID2;
      }

      let headParam = {
        head: {
          ns: "palette3.common.user.dao.UserCmmnMapper",
          sn: "selectUserList"
        }
      };

      const response = await this.common_postCall("/api/biz/common/select/selectUserList", postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        if(this.tabs1 === 0){
          this.userList = [{USER_NM : '전체', USER_ID : ''}];
          this.userList = [...this.userList, ...response.DATA];
        }else if(this.tabs1 === 1){
          this.userList1 = [{USER_NM : '전체', USER_ID : ''}];
          this.userList1 = [...this.userList1, ...response.DATA];
        }else if(this.tabs1 === 2){
          this.userList2 = [{USER_NM : '전체', USER_ID : ''}];
          this.userList2 = [...this.userList2, ...response.DATA];
        }
      }
    },

    //전화번호 하이픈 추가
    setPhoneNo(sTarget){
      let res = this.mixin_setPhoneNo(this[sTarget].replace(/[^0-9]/g, ""));
      this[sTarget] = res;
    },

    reFreshCuttUnProc(){
      if(this.computedUserDetailType === 'TEAM_LEADER' || this.computedUserDetailType === 'MANAGER'){ //팀장(부팀장), 상담사
        if(this.tabs1 === 0){
          this.SCH_DEPT_ID = this.computedUserDeptId;
          this.SCH_CUSL_ID = '';
        }if(this.tabs1 === 1){
          this.SCH_DEPT_ID1 = this.computedUserDeptId;
          this.SCH_CUSL_ID1 = '';
        }if(this.tabs1 === 2){
          this.SCH_DEPT_ID2 = this.computedUserDeptId;
          this.SCH_CUSL_ID2 = '';
        }
      }else{
        if(this.tabs1 === 0){
          this.SCH_DEPT_ID = '';
          this.SCH_CUSL_ID = '';
        }if(this.tabs1 === 1){
          this.SCH_DEPT_ID1 = '';
          this.SCH_CUSL_ID1 = '';
        }if(this.tabs1 === 2){
          this.SCH_DEPT_ID2 = '';
          this.SCH_CUSL_ID2 = '';
        }
      }

      if(this.tabs1 === 0){
        this.SCH_CUST_PHN_NO = '';
        this.SCH_CUST_IDNTF_NO = '';
      }else if(this.tabs1 === 1){
        this.SCH_CUST_PHN_NO1 = '';
        this.SCH_CUST_IDNTF_NO1 = '';
      }else if(this.tabs1 === 2){
        this.SCH_CUST_PHN_NO2 = '';
        this.SCH_CUST_IDNTF_NO2 = '';
      }

      this.cuttUnProcList(this.tabs1, '');
    },

    setCustCuttInfo(item){
      if(Number(this.CTI_CALL_STAT.replace('stat', '')) === 5){
        this.showAlertInfo({msg : '대기 중에는 다른 업무를 수행할 수 없습니다.'});
        return;
      }else if(Number(this.CTI_CALL_STAT.replace('stat', '')) === 6){
        this.showAlertInfo({msg : '콜 상담 중에는 다른 업무를 수행할 수 없습니다.<br>상담을 먼저 처리해주세요.'});
        return;
      }else{
        //전화상담탭이 있는지 확인
        let m0100 = false;
        if(this.$store.getters['commonStore/GE_COMMON_ACTIVE_TAB'].id === 'CSL_M0100') m0100 = true;

        if(!m0100) this.mixin_set_active_tab({PATH_NM:'/CSL_M0100', NODE_TITLE:'전화상담'});
        setTimeout(() => {
          this.$eventBus.$emit('setCuttUnProcCustInfo', item);
        }, !m0100?1000:10);
      }
    }
  },
};
</script>

<style lang="scss" scoped>

</style>