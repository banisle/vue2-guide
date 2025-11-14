<template>
  <div>
    <!-- search form -->
    <div>
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline">
          <span class="pl-label">
            그룹
          </span>
          <div class="pl-desc">
            <v-select
              v-model="selectedGroup"
              :items="ognzGroupList"
              class="pl-form type-middle is-md"
              placeholder="선택"
              :disabled="true"
            ></v-select>
<!--              :disabled="searchCustcoId == 4 ? true : false"-->
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            소속
          </span>
          <div class="pl-desc">
            <v-autocomplete
                v-model="selectedDept"
                class="pl-form type-middle is-lg"
                :items="ognzList"
                placeholder="조직을 검색하세요"
                clearable
                no-data-text="결과 없음"
                :disabled="true"
            />
          </div>
        </div>
<!--        <div class="pl-form-inline">-->
<!--          <span class="pl-label">-->
<!--            부서명-->
<!--          </span>-->
<!--          <div class="pl-desc">-->
<!--            <v-text-field-->
<!--              class="pl-form type-middle is-sm"-->
<!--              placeholder="검색어 입력" />-->
<!--          </div>-->
<!--        </div>-->
        <div class="pl-form-inline">
          <span class="pl-label">
            이름
          </span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form type-middle is-xs"
              v-model="schNm"
              placeholder="이름 입력"
              @keyup.enter="getUserList(false, schNm)"
              />
          </div>
        </div>

        <div class="is-right spacing-wrap sp-4">
          <v-btn class="pl-btn is-icon flex-grow-0"
                 :disabled="mixin_isEmpty(selectedGroup)"
                 @click="getUserList(false, schNm)">
            <span class="pl-icon20 search"></span>
            조회
          </v-btn>
          <!-- 툴팁 버튼 -->
          <compo-tooltip-btn
            TitleProp="초기화"
            ClassProp="pl-tooltip-btn flex-grow-0"
            IconProp="pl-icon20 refresh"
            TooltipPositionProp="bottom"
            @btnClick="initParams"
          ></compo-tooltip-btn>
        </div>
      </div>
    </div>
    <!-- temp grid -->
    <v-data-table
      class="pl-grid is-mt-s is-hover has-control"
      :headers="headers"
      :items="userList"
      v-model="selectedUserList"
      fixed-header
      item-key="USER_ID"
      height="430px"
      :items-per-page="ROW_PER_PAGE"
      hide-default-footer
      no-data-text="등록된 데이터가 없습니다."
      :page.sync="page"
      @page-count="pageCount = $event"
      :item-class="isActiveRow"
      :show-select="CHK_YN_PROP"
      @click:row="rowClick"
      @dblclick:row="rowDblClick"
      >
      <template v-slot:item.USER_NM="{ item }">
        <img :src="item.ICON_IMG_URI" :alt="item.USER_NM" class="pl-grid-portrait" style="width: 20px; height: 20px;" @error="function(e){e.target.src=require('@/assets/img/@manager_profile_default.png')}">
        <strong class="ml-1">{{ item.USER_NM }}</strong>
      </template>
    </v-data-table>
    <!-- paging -->
    <div class="pl-pager">
      <div class="pl-pager-row">
        <span>페이지당 항목 수</span>
        <v-select
          class="pl-form"
          :value="ROW_PER_PAGE"
          :items="perPage"
          :item-text="toString(ROW_PER_PAGE)"
          @change="ROW_PER_PAGE = parseInt($event, 15);"
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
        보기 {{ mixin_getPagePeriod(userList, page) }} / {{ userList.length }}
        <compo-tooltip-btn
          TitleProp="다음 검색"
          ClassProp="pl-tooltip-btn is-line"
          IconProp="pl-icon20 arrow-next-paging"
          TooltipPositionProp="bottom"
          @btnClick="getUserList(true, schNm)"
          :DisabledProp="PAGING_PROP ? nextDisabled : !PAGING_PROP"
        ></compo-tooltip-btn>
      </span>
    </div>
  </div>
</template>

<script>
import store from "@/store";

export default {
  name: 'CompoFindManager', //직원 조회
  components: {
  },
  props:{
    PAGING_PROP:{
      type : Boolean,
      default : false,
    },
    SEARCH_INPUT_PROP:{
      type : Object,
      default : ()=>{
        return {USER_NM : ''};
      }
    },
    CHK_YN_PROP:{
      type : Boolean,
      default: false,
    },
    USER_PROP:{
      type : Array,
      default :  ()=>{
        return [];
      }
    },
    CUSTCO_ID_PROP:{
      type : String,
      default : ''
    },
    EVAL_YN_PROP:{
      type : String,
      default : 'N'
    },
  },
  data() {
    return {

      dialogFindDanji: false,

      searchCustcoId : null,

      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 15, //페이징 없이 전체 화면 뿌릴때
      pagination: {
        page: 1,
        rowsPerPage: 50,
        sortBy: "",
        descending: ""
      },
      nextDisabled : false,

      ognz : [],              // 전체 부서 정보
      ognzGroupList : [],     // 최상위 부서그룹
      selectedGroup : null,   // 선택한 부서그룹
      ognzList : [],          // 하위 부서
      selectedDept : null,    // 선택한 부서
      schNm : this.mixin_isEmpty(this.SEARCH_INPUT_PROP) ? '' : this.SEARCH_INPUT_PROP.USER_NM,             // 입력한 이름

      userList: [],           // 사용자 목록
      selectedUserList:[],        // 선택된 사용자
      selectedRowObj : {},

      headers: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '그룹', value: 'CUSTCO_NM',  width: '180px', sortable: false },
        { text: '소속', value: 'DEPT_NM',  width: '180px', sortable: false },
        { text: '성명', value: 'USER_NM', align: '', width: '140px',sortable: false },
        { text: '직무', value: 'DUTY_GROUP_NM', align: '', width: '140px', sortable: false },
        { text: '비고', value: 'BIGO', align: '', width: '' , sortable: false},
      ],
      // 직원찾기 모달에서 선택 할 직원 목록(USER_ID)
      userProp : this.USER_PROP,

    }
  },
  methods: {
    // 부서 정보 조회
    async getOgnzList(){
      let postParam = {
        SRCH_TYPE : 'MANAGER' // 직원 찾기
      };
      let headParam = {
        head: {
          ns: "palette3.setting.ognz.dao.OgnzMapper",
          sn: "selectOgnzByRole",
        }
      };

      const response = await this.common_postCall("/api/biz/common/select/selectOgnzByRole", postParam, headParam);
      if(!response.HEADER.ERROR_FLAG){
        this.ognz = response.DATA

        this.ognzGroupList = [];
        this.ognzGroupList.push({text : '전체', value : '', CUSTCO_ID : '', KEY : '' })

        // 최상위 부서(루트 제외)
        this.ognz.filter(item => { if(item.UP_DEPT_ID == 1 && item.UP_DEPT_ID != ''){
          this.ognzGroupList.push({text : item.DEPT_NM, value : item.DEPT_ID, CUSTCO_ID : item.CUSTCO_ID, KEY : item.KEY })
        }});

        this.selectedGroup = '8';
      }
    },
    // 부서 그룹이 선택되면 하위 부서 바인딩
    setOgnzList(deptId, ognz) {
      let result = [];

      const children = this.ognz.filter(item => item.UP_DEPT_ID === deptId);

      for (const child of children) {
        let text = '';
        if(child.LVL > 3){
          // 3레벨 이상은 루트>그룹> 제외된 full path 표기
          text = child.FULL_PATH.replace(/[^>]+>[^>]+>/, "")
        }else{
          text = child.DEPT_NM
        }
        result.push({text : text, value : child.DEPT_ID, CUSTCO_ID : child.CUSTCO_ID});
        const grandchildren = this.setOgnzList(child.DEPT_ID, ognz);
        result = result.concat(grandchildren);
      }
      return result;
    },
    // 직원정보조회
    async getUserList(next, param){

      if(this.PAGING_PROP){
        if (!next){
          this.userList = [];
          this.pagination.page = 1; //페이징 처리 초기화
          this.nextDisabled = true;  //버튼 비활성화
        }
      }else{
        this.userList = [];
      }

      let postParam = {
        SRCH_TYPE : 'MANAGER',
        SRCH_USER_NM : this.mixin_isEmpty(param) ? '' : param,
        SRCH_DEPT_ID : this.selectedDept,
        SRCH_GROUP_ID : this.selectedGroup,
        SRCH_EVAL_AUTH : this.EVAL_YN_PROP === 'Y' ? 'Y' : 'N',
        USER_STTS_CD : 'WORK',
      };
      let headParam = {
        head: {
          ns: "lhcs.system.user.dao.UserMapper",
          sn: "selectUserList"
        }
      };
      //페이징 헤더 추가
      if(this.PAGING_PROP){
        this.$set(headParam.head, 'ROW_CNT', this.pagination.rowsPerPage);
        this.$set(headParam.head, 'PAGES_CNT', this.pagination.page);
        this.$set(headParam.head, 'PAGING',  "Y");
      }
      // console.log("headParam ", headParam)/
      const response = await this.common_postCall("/api/biz/common/select/selectUserList", postParam, headParam);
      if(!response.HEADER.ERROR_FLAG){
        // console.log(response.DATA)
        response.DATA.map((item)=>{
          let groupNm = this.ognz.find(item => item.DEPT_ID = this.selectedGroup).DEPT_NM
          this.userList.push(
              {
                USER_ID : item.USER_ID
                , EMP_NO : item.EMP_NO
                , ROW_NUMBER : item.ROW_NUMBER
                , USER_NM : item.USER_NM
                , UP_DEPT_NM : item.UP_DEPT_NM
                , DEPT_ID : item.DEPT_ID
                , DEPT_NM  : item.DEPT_NM
                , LGN_ID : item.LGN_ID
                , CLOUD_ACNT_ID : item.CLOUD_ACNT_ID
                , CUSTCO_ID : item.CUSTCO_ID
                , CUSTCO_NM  : item.CUSTCO_NM
                , DUTY_NM : item.DUTY_NM
                , DUTY_GROUP_NM : item.DUTY_GROUP_NM
                , DUTY_CD : item.DUTY_CD
                , DUTY_GROUP_CD : item.DUTY_GROUP_CD
                , TKCG_TASK_CN : item.TKCG_TASK_CN
                , ACD_GROUP : item.ACD_GROUP
                , EXT_NO : item.EXT_NO
                , MBL_PHN_NO : item.MBL_PHN_NO
                , LHCS_EMP_NO : item.LHCS_EMP_NO
                , EML : item.EML
                , USER_STTS_CD : item.USER_STTS_CD
                , ICON_IMG_URI : item.ICON_IMG_URI !== '/' ? '/upload/' + item.ICON_IMG_URI : require('@/assets/img/@manager_profile_default.png')
              },
          )
        });
      }

      if(this.mixin_isEmpty(this.selectedUserList) && this.CHK_YN_PROP && !this.mixin_isEmpty(this.userProp)){
        this.setUserProp();
      }

      // request에 보낸 head.PAGES_CNT와 head.ROW_CNT을 곱한값과 response.data.HEADER의 HEADER.TOT_COUNT와 비교하여 다음 조회건이 있는지 확인한다
      if(this.PAGING_PROP) {
        // if (response.HEADER.next !== null && response.HEADER.next !== undefined) {
        //   if (response.HEADER.next === true) {
        //     this.nextDisabled = false //버튼 활성화
        //   } else {
        //     this.nextDisabled = true  //버튼 비활성화
        //   }
        // }

        if (Number(response.HEADER.COUNT) < Number(this.pagination.rowsPerPage)) {
          this.nextDisabled = true  //버튼 비활성화
        }else{
          this.nextDisabled = false //버튼 활성화
        }
        //이부분은 체크해볼것
        this.pagination.page += 1
      }
    },
    //로우 클릭시 색상 변경
    isActiveRow(item){
      const activeClass = (item === this.selectedRowObj) && !this.CHK_YN_PROP ? "active" : "";
      return activeClass;
    },
    rowClick(item){
      this.selectedRowObj = item;
    },
    rowDblClick(){
      if(!this.CHK_YN_PROP){
        this.submitData();
      }
    },
    submitData(){
      // 체크박스를 사용할 때 array, 미사용 시 object
      if(this.CHK_YN_PROP){
        if(!this.mixin_isEmpty(this.selectedUserList)){
          this.$eventBus.$emit("setManagerInfo", this.selectedUserList);
          this.hideDialog();
          this.initParams();
        }else{
          this.showToastCaution({ msg : '추가할 직원을 선택하세요.'})
        }
      }else{
        this.$eventBus.$emit("setManagerInfo", this.selectedRowObj);
        this.hideDialog();
        this.initParams();
      }
    },
    initParams(){
      this.schNm = '';
      this.userList = [];
      this.selectedRowObj = {};
      this.selectedUserList = [];
      this.userProp = [];
    },
    hideDialog() {
      this.$emit("hideDialog");
    },
    setUserProp(){
      this.selectedUserList = []
      this.userProp.map((item)=>{
        for(let i in this.userList){
          if(item.USER_ID === this.userList[i].USER_ID){
            this.selectedUserList.push(this.userList[i]);
          }
        }
      })
    }
  },

  async mounted() {
    // console.log("mounted")
  },

  created() {
    this.getOgnzList();

    this.$eventBus.$off("initFindMng");
    this.$eventBus.$off("findMng");

    if (!this.mixin_isEmpty(this.CUSTCO_ID_PROP)) {
      this.searchCustcoId = this.CUSTCO_ID_PROP
    }else{
      this.searchCustcoId = store.getters['userStore/GE_USER_ROLE'].company.CD
    }

    // 초기화 이벤트 수신
    this.$eventBus.$on("initFindMng",() =>{
      console.log("find user iㅇㅇnit")
      this.initParams();
    });

    // 조회 이벤트 수신
    this.$eventBus.$on("findMng",(managerName) =>{
      if(!this.mixin_isEmpty(managerName)){
        this.schNm = managerName;
      }
      if(!this.mixin_isEmpty(this.selectedGroup)){
        this.getUserList(false, managerName);
      }
    });
  },
  computed: {
    // reversedItems() {
    //   return this.userList.slice().reverse();
    // },
  },
  watch: {
    selectedGroup(){
      // 그룹이 변경되면 선택 부서 초기화
      this.ognzList=[];
      this.ognzList.push({text : "전체", value : '',CUSTCO_ID : ''});
      this.ognzList = [...this.ognzList, ...this.setOgnzList(this.selectedGroup, this.ognz)];

      this.selectedDept = '9';

    },
    selectedDept(){
      if (!this.mixin_isEmpty(this.selectedGroup) && !this.mixin_isEmpty(this.selectedDept)) {
        this.getUserList(false,this.schNm)
      }
    },
    userProp(){
    // console.log("userProp", this.userProp)
    },
    USER_PROP(){
      this.userProp = this.USER_PROP;
    },
  },
  beforeDestroy() {
    // 직원 정보 수신 이벤트 - eventBus 중복방지를 위해 off
    this.$eventBus.$off("initFindMng");
    this.$eventBus.$off("findMng");
    console.log("beforeDestroy")
  },
};
</script>

<style lang="scss" scoped>

</style>