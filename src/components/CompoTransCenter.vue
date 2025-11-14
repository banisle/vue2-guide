<template>
  <div>
    <!-- search form -->
    <div>
      <div class="pl-form-inline-wrap" v-if="computedUserCenter === '5'"><!--주택지원센터(렌트홈)인 경우만 사용-->
        <div class="pl-form-inline">
          <span class="pl-label">
            소속
          </span>
          <div class="pl-desc">
            <v-select
              v-model="SCH_DEPT_ID"
              :items="mixin_ognz_list_detail(common_ognz_list, computedUserCenterDeptId, '전체' )"
              class="pl-form type-middle is-md"
              placeholder="선택"
            ></v-select>
            <v-autocomplete
              v-model="SCH_CUSL_ID"
              :items="userList"
              item-text="USER_NM"
              item-value="USER_ID"
              class="pl-form type-middle"
              placeholder="선택"
            ></v-autocomplete>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            ID
          </span>
          <div class="pl-desc">
            <v-text-field
              v-model="SCH_LGN_ID"
              class="pl-form type-middle is-sm"
              @keydown.enter="getUserList('')"
              placeholder="검색어 입력" />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            이름
          </span>
          <div class="pl-desc">
            <v-text-field
              v-model="SCH_CUSL_NM"
              class="pl-form type-middle is-sm"
              @keydown.enter="getUserList('')"
              placeholder="이름 입력"
              />
          </div>
        </div>
        <div class="is-right spacing-wrap sp-4">
          <v-btn class="pl-btn is-icon flex-grow-0" @click="getUserList('')">
            <span class="pl-icon20 search"></span>
            조회
          </v-btn>
          <!-- 툴팁 버튼 -->
          <compo-tooltip-btn
            TitleProp="초기화"
            ClassProp="pl-tooltip-btn flex-grow-0"
            IconProp="pl-icon20 refresh"
            TooltipPositionProp="bottom"
            @btnClick="schReset"
          ></compo-tooltip-btn>
        </div>
      </div>
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline">
          <span class="pl-label">
            타센터
          </span>
          <div class="pl-desc">
            <v-select
              v-model="CTI_GROUP_CD"
              :items="CTI_GROUP_LIST"
              class="pl-form type-middle"
              :style="`width: ${computedUserCenter === '3'?'150':'298'}px;`"
              return-object
              placeholder="선택"
              @change="computedUserCenter === '3'?CTI_GROUP_CD2='':''"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline" v-if="computedUserCenter === '3'"><!--전세임대인 경우-->
          <span class="pl-label">
            타지역
          </span>
          <div class="pl-desc">
            <v-select
              v-model="CTI_GROUP_CD2"
              :items="CTI_GROUP_LIST2"
              class="pl-form type-middle"
              :style="`width: ${computedUserCenter === '3'?'150':'298'}px;`"
              return-object
              placeholder="선택"
              @change="computedUserCenter === '3'?CTI_GROUP_CD='':''"
            ></v-select>
          </div>
        </div>
        <div class="is-right spacing-wrap sp-4">
          <v-btn
            class="pl-btn is-esp"
            @click="chgCtiGroup"
          >
            그룹 전환
          </v-btn>
        </div>
      </div>
    </div>
    <!-- temp grid --><!--주택지원센터(렌트홈)인 경우만 사용-->
    <v-data-table v-if="computedUserCenter === '5'"
      class="pl-grid is-mt-s is-hover"
      :headers="headers"
      :items="items"
      :item-class="isActiveRow"
      fixed-header
      item-key="ROW_NUMBER"
      height="430px"
      :items-per-page="ROW_PER_PAGE"
      hide-default-footer
      @click:row="rowClick"
      no-data-text="등록된 데이터가 없습니다."
      :loading="loading"
      loading-text="조회중입니다."
      >
      <template v-slot:[`item.${header.value}`]="{ item }" v-for="header in headers">
        <template v-if="header.telYn">
          <template v-if="item[header.value]">{{ mixin_setPhoneNo(item[header.value].replace(/[^0-9]/g, "")) }}</template>
        </template>
        <template v-else>
          <template v-if="header.value === 'CHG_DT'">
            {{ mixin_convertDate(item[header.value], 'yyyy-MM-dd HH:mm:ss') }}
          </template>
          <template v-else-if="header.value === 'USER_NM'">
            <img
              :src="item['ICON_IMG_URI'] !== '/'? '/upload/' + item['ICON_IMG_URI'] : require('@/assets/img/@manager_profile_default.png')"
              :alt="item[header.value]"
              class="pl-grid-portrait"
              style="width: 20px; height: 20px; border-radius: 50%;"
              @error="function(e){e.target.src=require('@/assets/img/@manager_profile_default.png')}">
            <strong class="ml-1">{{ item[header.value] }}</strong>
          </template>
          <template v-else-if="header.value === 'AGENT_STATUS'">
            <span :class="`pl-bullet-txt type-dot ${ mixin_displayStatus(item[header.value], 'STAT_LIST') }`">{{ item[header.value] }}</span>
          </template>
          <template v-else-if="header.value === 'TRANSPHN_USE_YN'">
            <span v-if="item[header.value] === 'Y'">허용</span>
            <span v-else>금지</span>
          </template>
          <template v-else>{{ item[header.value] }}</template>
        </template>
      </template>
      <CompoStompICAGENT />
    </v-data-table>
  </div>
</template>

<script>
import CompoStompICAGENT from "@/components/socket/CompoStompICAGENT.vue";
import { ipronCallUtil } from "@/store/ipronCallUtil.js";

export default {
  name: 'CompoTransCenter', //이첩 대상자 선택
  components: {
    CompoStompICAGENT,
  },
  data() {
    return {
      list_common_code : [],
      common_code : [],
      // search
      common_ognz_list:[], //조직정보
      SCH_DEPT_ID : '', //소속 ID

      userList : [], //사용자 목록(검색)
      SCH_CUSL_ID : '', //상담사 ID

      SCH_LGN_ID : '', //상담사 로그인 ID
      SCH_CUSL_NM : '', //상담사 명

      CTI_GROUP_LIST : [], //CTI 그룹 목록
      CTI_GROUP_CD : '', //CTI 상담사 그룹 코드
      CTI_GROUP_LIST2 : [], //CTI 그룹 목록
      CTI_GROUP_CD2 : '', //CTI 상담사 그룹 코드

      ROW_PER_PAGE: -1, //페이징 없이 전체 화면 뿌릴때

      headers: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '소속', value: 'DEPT_NM',  width: '', sortable: false },
        { text: '성명', value: 'USER_NM', align: '', width: '110px',sortable: false },
        { text: '직무', value: 'DUTY_GROUP_NM', align: '', width: '100px', sortable: false },
        { text: '사용자 ID', value: 'LGN_ID', align: '', width: '11%' , sortable: false},
        { text: '내선번호', value: 'EXT_NO', align: '', width: '8%' , sortable: false},
        { text: '호전환 허용여부', value: 'TRANSPHN_USE_YN', align: 'center', width: '10%' , sortable: false},
        { text: 'CTI 상태', value: 'AGENT_STATUS', align: '', width: '10%' , sortable: false},
        { text: '최근 변경 시간', value: 'STATUS_TIME', align: '', width: '140px' , sortable: false},
      ],
      items: [],

      selectedRow : {}, //그리드 선택 값

       // 상태 컬러
       STAT_LIST: [
        { code: '이석(교육)', value: 'is-stat-work'},
        { code: '이석(식사)', value: 'is-stat-rest'},
        { code: '이석(휴식)', value: 'is-stat-rest'},
        { code: '이석(지원)', value: 'is-stat-rest'},
        { code: '이석(기타)', value: 'is-stat-rest'},
        { code: '이석(확인)', value: 'is-stat-rest'},
        { code: '대기', value: 'is-stat-wait'},
        { code: '후처리', value: 'is-stat-work'},
        { code: '통화중', value: 'is-stat-call'},
        { code: '로그아웃', value: 'is-stat-out'},
      ],

      loading : false,
    }
  },
  computed: {
  },
  watch: {
    SCH_DEPT_ID() {
      this.getUserList('combo'); //사용자 목록 조회
    }
  },
  mounted() {
  },
  beforeDestroy() {
    this.$eventBus.$off("reSetTrnsfInfo");
  },
  async created() {
    //공통코드설정
    let codeName = ['T206']; //CTI 상담원 그룹 코드
    this.list_common_code = await this.mixin_common_code_get_all_global(codeName);

    this.common_ognz_list =  await this.mixin_ognz_list();

    this.CTI_GROUP_LIST = [];
    this.CTI_GROUP_LIST2 = [];
    
    if(this.computedUserCenter === '5'){ //주택지원(렌트홈)인 경우 그리드 데이터 호출
      this.CTI_GROUP_LIST = this.mixin_common_code_get_global(this.list_common_code, 'T206', this.computedUserCenter, '선택');
      this.getUserList('combo'); //검색 영역 콤보용
      this.getUserList(''); //그리드용
    }else{
      if(this.computedUserCenter === '3'){ //전세임대인 경우 그룹으 타센터와 타지역으로 구분하여 노출
        let arrCtiGroupList = this.mixin_common_code_get_global(this.list_common_code, 'T206', this.computedUserCenter, '선택');

        this.CTI_GROUP_LIST.push({text: '선택', value : ''});
        this.CTI_GROUP_LIST2.push({text: '선택', value : ''});
        arrCtiGroupList.forEach((item, idx) => {
          if(item.cd_vl2 === 'CTI') this.CTI_GROUP_LIST2.push(item); //타지역
          else this.CTI_GROUP_LIST.push(item); //타센터
        });

      }else{
        this.CTI_GROUP_LIST = this.mixin_common_code_get_global(this.list_common_code, 'T206', this.computedUserCenter, '선택');
      }
    }

    this.$eventBus.$on("reSetTrnsfInfo", (item) => {
      this.clearInit();
    });
  },
  methods: {
    clearInit() {
      this.schReset();
    },

    schReset() { //검색 초기화
      this.SCH_DEPT_ID = '';
      this.SCH_CUSL_ID = '';
      this.SCH_LGN_ID = '';
      this.SCH_CUSL_NM = '';
      this.CTI_GROUP_CD = '';
      this.CTI_GROUP_CD2 = '';
      this.$emit('transPhnNoClear');
    },
    //사용자 목록 조회
    async getUserList(sGb) {
      if(sGb === 'combo') this.userList = [];

      let postParam = {
        SRCH_TYPE : 'CUSL',
        SRCH_GROUP_ID : this.computedUserCenterDeptId,
        SRCH_DEPT_ID : this.SCH_DEPT_ID,
        SRCH_USER_ID : this.SCH_CUSL_ID,
        LGN_ID : this.SCH_LGN_ID,
        USER_NM : this.SCH_CUSL_NM
      };
      let headParam = {
        head: {
          ns: 'lhcs.system.user.dao.UserMapper'
        }
      };

      if(sGb !== 'combo') this.loading = true;
      const response = await this.common_postCall('/api/biz/common/select/selectUserList', postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        if(sGb === 'combo'){
          this.userList = response.DATA;
        }else{
          // this.items = response.DATA;
          this.getCtiUserList(response.DATA); //Cti 상담사 목록
        }

      }
      if(sGb !== 'combo') this.loading = false;
    },

    //CTI 상담사 목록 조회
    async getCtiUserList(userList) {
      this.items = [];
      let response = await this.common_postCall("/api/itf/ipron/swat/redisAgentMonitor", {}, {});
      if (!response.HEADER.ERROR_FLAG) {
        let responseData = response.DATA;

        userList.forEach((item, idx) => {
          item.AGENT_STATUS = '로그아웃';
          responseData.forEach((agentItem, seq) => {
            if(item.AGENT_ID === agentItem.AGENT_LOGIN_ID){
              item.FINAL_TALK_ANI = agentItem.FINAL_TALK_ANI;
              if( !this.mixin_isEmpty(agentItem.STATUS_TIME)) {
                item.STATUS_TIME = this.mixin_convertDate(agentItem.STATUS_TIME, 'yyyy-MM-dd HH:mm:ss');
              }

              if( agentItem.AGENT_STATUS === 30 ) { //이석
                if( agentItem.REASON_CODE === 1) {
                  item.AGENT_STATUS = '이석(교육)';
                }else if( agentItem.REASON_CODE === 2) {
                  item.AGENT_STATUS = '이석(식사)';
                }else if( agentItem.REASON_CODE === 3) {
                  item.AGENT_STATUS = '이석(휴식)';
                }else if( agentItem.REASON_CODE === 4) {
                  item.AGENT_STATUS = '이석(지원)';
                }else if( agentItem.REASON_CODE === 5) {
                  item.AGENT_STATUS = '이석(기타)';
                }else if( agentItem.REASON_CODE === 6) {
                  item.AGENT_STATUS = '이석(확인)';
                }else {
                  item.AGENT_STATUS = '이석';
                }
              }else if( agentItem.AGENT_STATUS === 40 ) { //대기
                item.AGENT_STATUS = '대기';
              }else if( agentItem.AGENT_STATUS === 50 ) { //통화중
                item.AGENT_STATUS = '통화중';
              }else if( agentItem.AGENT_STATUS === 51 ) { //벨울림중
                item.AGENT_STATUS = '벨울림중';
              }else if( agentItem.AGENT_STATUS === 52 ) { //다이얼링중
                item.AGENT_STATUS = '다이얼링중';
              }else if( agentItem.AGENT_STATUS === 60 ) { //후처리
                item.AGENT_STATUS = '후처리';
              }else {
                item.AGENT_STATUS = '로그아웃';
              }
            }
          });
          this.items.push(item);
        });

      }
    },

    //로우 클릭시 색상 변경
    isActiveRow(item){
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },

    rowClick(item) {
      this.selectedRow = item;
      // this.$emit('setTransPhnNo', item);
      if(item.TRANSPHN_USE_YN === 'Y') this.$emit('setTransPhnNo', item);
      else this.$emit('transPhnNoClear');
    },

    //대상자 선택
    // setTransPhnNo(item){
    //   this.$emit('setTransPhnNo', item);
    // },

    //CTI 상담사 그룹 전환
    chgCtiGroup() {
      if(this.computedUserCenter === '3'){
        if((this.mixin_isEmpty(this.CTI_GROUP_CD.cd_vl1) || this.CTI_GROUP_CD.text.indexOf('-------') > -1) && (this.mixin_isEmpty(this.CTI_GROUP_CD2.cd_vl1) || this.CTI_GROUP_CD2.text.indexOf('-------') > -1)){
          this.showAlert({alertDialogToggle: true, msg: '그룹을 선택해 주세요.', iconClass: 'is-info', type: 'default'});
          return;
        }else{
          this.showConfirmInfo({
            msg:'그룹 전환을 하시겠습니까?'
            , callYes: () => {
              let CTI_GROUP_NUM = this.CTI_GROUP_CD.cd_vl1;
              let CTI_GROUP_TXT = this.CTI_GROUP_CD.text;
              
              if(!this.CTI_GROUP_CD.cd_vl1){
                CTI_GROUP_NUM = this.CTI_GROUP_CD2.cd_vl1;
                CTI_GROUP_TXT = this.CTI_GROUP_CD2.text;
              }

              if(Number(this.CTI_CALL_STAT.replace(/[^0-9]/g, '')) === 6){//통화중인 경우
                ipronCallUtil.callGroupTransfer(CTI_GROUP_NUM);
                this.$eventBus.$emit('addTrnsfInfoCuttCn', {TRNSF_GB: 2, GROUP_NM : CTI_GROUP_TXT});
                this.closeAlert();
                this.$eventBus.$emit('CloseTransCenter');
              }else{
                this.showAlertInfo({msg : '고객과 통화중 상태일 경우만 호전환이 가능 합니다.'});
                return;
              }
            }
            , callNo: this.closeAlert
          });
        }
      }else{
        if(this.mixin_isEmpty(this.CTI_GROUP_CD.cd_vl1) || this.CTI_GROUP_CD.text.indexOf('-------') > -1){
          this.showAlert({alertDialogToggle: true, msg: '그룹을 선택해 주세요.', iconClass: 'is-info', type: 'default'});
          return;
        }else{
          this.showConfirmInfo({
            msg:'그룹 전환을 하시겠습니까?'
            , callYes: () => {

              if(Number(this.CTI_CALL_STAT.replace(/[^0-9]/g, '')) === 6){//통화중인 경우
                ipronCallUtil.callGroupTransfer(this.CTI_GROUP_CD.cd_vl1);
                this.$eventBus.$emit('addTrnsfInfoCuttCn', {TRNSF_GB: 2, GROUP_NM : this.CTI_GROUP_CD.text});
                this.closeAlert();
                this.$eventBus.$emit('CloseTransCenter');
              }else{
                this.showAlertInfo({msg : '고객과 통화중 상태일 경우만 호전환이 가능 합니다.'});
                return;
              }
            }
            , callNo: this.closeAlert
          });
        }
      }
    }
  },
};
</script>

<style lang="scss" scoped>

</style>