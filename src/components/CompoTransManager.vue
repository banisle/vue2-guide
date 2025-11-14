<template>
  <div>
    <!-- search form -->
    <div>
      <div class="pl-form-inline-wrap">
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
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            상담사
          </span>
          <div class="pl-desc">
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
              placeholder="검색어 입력"
              @keyup.enter="getUserList('')"
            />
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
              placeholder="이름 입력"
              @keyup.enter="getUserList('')"
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
    </div>
    <!-- temp grid -->
    <v-data-table
      class="pl-grid is-mt-s is-hover "
      :headers="headers"
      :items="items"
      :item-class="isActiveRow"
      fixed-header
      item-key="index"
      height="430px"
      :items-per-page="ROW_PER_PAGE"
      hide-default-footer
      @click:row="rowClick"
      @dblclick:row="addCuttCnTransfInfo"
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
          <template v-else-if="header.value === 'CTI_STAT'">
            <span :class="`pl-bullet-txt type-dot ${ mixin_displayStatus(item[header.value], 'STAT_LIST') }`">{{ item[header.value] }}</span>
          </template>
          <template v-else-if="header.value === 'SEL_BTN'">
            <v-btn class="pl-btn is-sm is-sub" @click="selTransfInfo(item)">선택</v-btn>
          </template>
          <template v-else>{{ item[header.value] }}</template>
        </template>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'CompoTransManager', //이첩 대상자 선택
  components: {
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

      loading : false,
      ROW_PER_PAGE: -1, //페이징 없이 전체 화면 뿌릴때

      headers: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '소속', value: 'DEPT_NM',  width: '180px', sortable: false },
        { text: '성명', value: 'USER_NM', align: '', width: '110px',sortable: false },
        { text: '직위', value: 'DUTY_GROUP_NM', align: '', width: '100px', sortable: false },
        { text: '사용자 ID', value: 'LGN_ID', align: '', width: '11%' , sortable: false},
        { text: 'CTI 상태', value: 'CTI_STAT', align: '', width: '10%' , sortable: false},
        { text: '최근 변경 시간', value: 'CHG_DT', align: '', width: '140px' , sortable: false},
        { text: '대상자', value: 'SEL_BTN', align: 'center', width: '8%' , sortable: false},
      ],
      items: [],

      selectedRow : {}, //그리드 선택 값

       // 상태 컬러
       STAT_LIST: [
        { code: '지원중', value: 'is-stat-work'},
        { code: '휴식중', value: 'is-stat-rest'},
        { code: '대기중', value: 'is-stat-wait'},
        { code: '후처리중', value: 'is-stat-work'},
        { code: '통화중', value: 'is-stat-call'},
        { code: '오프라인', value: 'is-stat-out'},
      ],
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
  async created() {
    //공통코드설정
    let codeName = ['T206']; //CTI 상담원 그룹 코드
    this.list_common_code = await this.mixin_common_code_get_all_global(codeName);

    this.common_ognz_list =  await this.mixin_ognz_list();
    this.getUserList('combo'); //검색 영역 콤보용
    this.getUserList(''); //그리드용
  },
  methods: {
    schReset() { //검색 초기화
      this.SCH_DEPT_ID = '';
      this.SCH_CUSL_ID = '';
      this.SCH_LGN_ID = '';
      this.SCH_CUSL_NM = '';
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
        if(sGb === 'combo') this.userList = response.DATA;
        else this.items = response.DATA;
      }
      if(sGb !== 'combo') this.loading = false;
    },

    //로우 클릭시 색상 변경
    isActiveRow(item){
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },

    rowClick(item) {
      this.selectedRow = item;
    },

    addCuttCnTransfInfo(event, {item}) {
      this.$eventBus.$emit('addCuttCnTransfInfo', item);
    },

    //대상자 선택
    selTransfInfo(item){
      this.$eventBus.$emit('addCuttCnTransfInfo', item);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>