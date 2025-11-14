<template>
  <div>
    <!-- search form -->
    <div class="pl-grid-top">
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline">
          <span class="pl-label">
            소속
          </span>
          <div class="pl-desc">                
            <v-select
              v-model="SRCH_PARAMS_TOP.SRCH_DEPT_ID"              
              :items="DEPT_ITEMS"
              item-text="DEPT_NM"       
              item-value="DEPT_ID"
              class="pl-form type-middle"
              placeholder="전체"                
            ></v-select>
          </div>          
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            직무
          </span>
          <div class="pl-desc">
            <v-select
              class="pl-form type-middle"
              placeholder="선택"
              v-model="SRCH_PARAMS_TOP.SRCH_USER_STTS_CD"
              :items="mixin_common_code_get(common_code_global,'JOB_CL','전체')"
            ></v-select>
          </div>
        </div>
        
        <div class="pl-form-inline">
          <span class="pl-label">
            성명
          </span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form type-middle"
              placeholder="성명 입력" 
              v-model="SRCH_PARAMS_TOP.SRCH_USER_NM"
              />
          </div>
        </div>
        <div class="pl-form-inline">
          <v-checkbox
              v-for="(chk, index) in chkTypes"
              v-model="srchEvalTrgrIsALL"
              :key="index"
              :label="chk.text"
              item-value="chk.value"
              class="pl-check "
          ></v-checkbox>
        </div>
        <div class="is-right spacing-wrap sp-4">
          <v-btn class="pl-btn is-icon flex-grow-0" @click="selectUserList()" >
            <span class="pl-icon20 search"></span>
            조회
          </v-btn>
          <!-- 툴팁 버튼 -->
          <compo-tooltip-btn
            TitleProp="초기화"
            ClassProp="pl-tooltip-btn flex-grow-0"
            IconProp="pl-icon20 refresh"
            TooltipPositionProp="bottom"
            @btnClick="searchParamsReset()"
          ></compo-tooltip-btn>
        </div>
      </div>
    </div>
    <div class="is-border-top pt-3 mt-3">
      <div class="pl-cols">
        <!-- 직원 정보 -->
        <div class="flex-grow-1">
          <div class="pl-grid-top">
            <div class="pl-grid-top-left">
              <strong class="pl-bullet-txt is-blue">직원 정보</strong>
            </div>
            <div class="pl-grid-top-utils">
              <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ USER_GRID_ITEMS.length }})</em> 건</span>
            </div>
          </div>

          <v-data-table
            class="pl-grid has-control is-mt-s"
            :headers="headers"
            :items="USER_GRID_ITEMS"
            v-model="checkedList01"
            show-select
            fixed-header
            item-key="ROW_NUMBER"
            height="360px"
            :items-per-page="-1"
            hide-default-footer
	          no-data-text="등록된 데이터가 없습니다."
            :loading="mixin_loadding"
            loading-text="조회중입니다."
            >
          </v-data-table>
          <ul class="pl-list-info">
            <li>직원정보 목록은 평가 대상자만 조회되며, 다중 선택하여 지정할 수 있습니다.</li>
          </ul>


        </div>
        <!-- 화살표 -->
        <div class="spacing-wrap px-4 flex-column justify-center align-center is-col-fix" style="width: 80px;">
          <!-- arrow right 버튼 :disabled="!isConfirm" -->
          <v-tooltip content-class="pl-tooltip top" top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" icon >
                <v-icon
                class="pl-icon30 arrow-right-list"
                @click="itemMove('add')"                
                ></v-icon>
              </v-btn>
            </template>
            <span>평가 대상자 지정</span>
          </v-tooltip>

          <!-- arrow left 버튼 :disabled="!isConfirm" -->
          <v-tooltip content-class="pl-tooltip bottom" bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" icon >
                <v-icon
                class="pl-icon30 arrow-left-list"
                @click="itemMove('remove')"                
                ></v-icon>
              </v-btn>
            </template>
            <span>대상자에서 삭제</span>
          </v-tooltip>

        </div>
        <!-- 평가 대상자 -->
        <div class="flex-grow-1">
          <div class="pl-grid-top">
            <div class="pl-grid-top-left">
              <strong class="pl-bullet-txt is-blue">평가 대상자</strong>
            </div>
            <div class="pl-grid-top-utils">
              <div class="pl-form-inline-wrap">
                <div class="pl-form-inline">
                  <span class="pl-label">
                    소속
                  </span>
                  <div class="pl-desc">
                    <v-select
                        v-model="SRCH_PARAMS_TOP.SRCH_DEPT_ID_CUST"              
                        :items="DEPT_ITEMS"
                        item-text="DEPT_NM"       
                        item-value="DEPT_ID"
                        class="pl-form type-middle"
                        placeholder="전체"                
                      ></v-select>
                    <v-btn class="pl-btn is-icon flex-grow-0" @click="selectCustUserList()">
                      <span class="pl-icon20 search"></span>
                      조회
                    </v-btn>

                    <!--v-text-field
                      class="pl-form is-search type-middle"
                      placeholder="대상자 찾기"
                      @keydown.enter="mixin_testLog('search btn')"
                    >
                    <template v-slot:prepend>
                      <span class="pl-icon20 in-search"></span>
                    </template>
                    </!--v-text-field-->
                  </div>
                </div>
              </div>
            </div>
          </div>

          <v-data-table
            class="pl-grid has-control is-mt-s"
            :headers="headers"
            :items="CK_USER_GRID_ITEMS"
            v-model="checkedList02"
            show-select
            fixed-header
            item-key="ROW_NUMBER"
            height="360px"
            :items-per-page="-1"
            hide-default-footer
	          no-data-text="등록된 데이터가 없습니다."
            >
          </v-data-table>



        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'QTM_M0200_DIALOG', //평가 대상자 설정
  components: {
  },
  props: {
    propsQstnPlanData:{
      type: Object,
      default: () => {},
    }
  },
  data() {
    return {
      srchEvalTrgrIsALL: false,
      chkTypes: [
        {text: "근무일수 미달 포함",value : 'ALL', selected: false,},
      ],

      common_ognz_list:[], //조직
      common_code:[], //공통코드
      common_code_global:[], //공통코드
      SRCH_PARAMS_TOP:{
        SRCH_CENTER: {},  //센터
        SRCH_DEPT: {},
        SRCH_DEPT_DISABLED:false,
        SRCH_DUTY_GROUP_CD: '',  //직무
        SRCH_DUTY_CD: '',  //직급
        SRCH_EVL_TRGT_YN: '',  //평가대상
        SRCH_USER_STTS_CD: '',
        
        SRCH_DEPT_SUB:{},

        SRCH_DEPT_ID: '',  //상단 부서
        SRCH_DEPT_ID_CUST:'', // 등록된 대상자중 부서 검색
        SRCH_USER_NM: '',   // 상단 검색어 
        SRCH_USER_NM_CUST: '',  // 등록된 대상자중 검색어 

      },      

      CENTER_ID:'',
      EVAL_ID:'',
      isConfirm: false,

      DEPT_ITEMS:[],

      // 사용자 가져오기 
      USER_GRID_ITEMS:[],
      // 선택된 사용자 
      CK_USER_GRID_ITEMS:[],

      headers: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: true },
        { text: '성명', value: 'USER_NM', align: '', width: '15%' , sortable: true},
        { text: '소속', value: 'DEPT_NM' , width: '20%', sortable: true},
        { text: '직무', value: 'DUTY_GROUP_NM', align: '', width: '15%', sortable: true },
        { text: '평가대상 여부', value: 'TRSKEVL_TRGT_YN_NM', align: '', width: '20%', sortable: true },
        { text: '근무 일수', value: 'WORK_DT', align: '', width: '', sortable: true },
        
      ],

      //알림창 메시지
      MESSAGE: {
        CONFIRM: {
          
        },
        ALERT:{          
          ADD_ITEM : {alertDialogToggle: true, msg: '등록할 사용자를 선택 해주세요.', iconClass: 'is-info', type: 'default'}
          , REMOVE_ITEM : {alertDialogToggle: true, msg: '삭제할 사용자를 선택 해주세요.', iconClass: 'is-info', type: 'default'}
        },
        TOAST : {
          DONE : {  msg: '평가 대상자가 수정 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
        },
        ERROR: {
          ERROR:
            { alertDialogToggle: true, iconClass: 'is-caution', type: 'default', msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', },
        }
      },

      // 그리드 선택 리스트
      checkedList01:[],
      checkedList02:[],

      // 여기 아래 부터는 퍼블 
      list4: [
        {
          id: 1,
          name: "채팅상담",
          calories: "M01",
        },
      ],
      list5: [
        {
          id: 7,
          name: "지식관리",
          calories: "M07",
        },
      ],
      list4_selected: [],
      list5_selected: [],
      items_selected: [],
      items2_selected: [],

      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 15,
      headers1: [
        { text: '번호', value: 'index', align: 'center', width: '50px', sortable: false },
        { text: '성명', value: 'type01', align: '', width: '15%' },
        { text: '소속', value: 'type02' , width: '15%', sortable: false},
        { text: '직무', value: 'type03', align: '', width: '15%', sortable: false },
        { text: '근무형태', value: 'type04', align: '', width: '15%', sortable: false },
        { text: '단축 근무', value: 'type05', align: '', width: '', sortable: false },
      ],
      items: [],
      items2: [],
    }
  },
  methods: {

    searchParamsReset(){
      this.SRCH_PARAMS_TOP.SRCH_DEPT_ID = '';
      this.SRCH_PARAMS_TOP.SRCH_USER_STTS_CD = '';
      this.SRCH_PARAMS_TOP.SRCH_USER_NM = '';      
    },

    async selectDeptList() {      
      let sUrl = '/phone-api/qt/selectDeptList';
      let postParam = {        
        CENTER_ID: this.CENTER_ID,        
      };

      let headParam = {head: {}};
      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if (!this.mixin_isEmpty(resData)) {
        this.DEPT_ITEMS = [];        
        this.DEPT_ITEMS = resData.DATA ;                
      }else {
        this.DEPT_ITEMS = [];
      }      

      this.DEPT_ITEMS.unshift({ DEPT_ID: "",  DEPT_NM: "전체",})
    },

    // 대상자 검색 ( 커스텀 )
    async selectUserList() {            
      let sUrl = '/phone-api/qt/selectEvalUserList';
      let postParam = {
        EVAL_ID: this.EVAL_ID,
        CENTER_ID: this.CENTER_ID,
        DEPT_ID: this.SRCH_PARAMS_TOP.SRCH_DEPT_ID,
        // WORK_TYPE_CD: this.SRCH_PARAMS_TOP.SRCH_USER_STTS_CD,   // 근무유형(형태)
        DUTY_GROUP_CD:  this.SRCH_PARAMS_TOP.SRCH_USER_STTS_CD, // 직무유형
        SRCH_USER_NM: this.SRCH_PARAMS_TOP.SRCH_USER_NM,
        SRCH_EVAL_YEAR:  this.propsQstnPlanData.SRCH_EVAL_YEAR,
        SRCH_EVAL_MONTH : this.propsQstnPlanData.SRCH_EVAL_MONTH,

        TRGT_IS_ALL : this.srchEvalTrgrIsALL? 'Y':'N',
      };     

      //console.info('pop SRCH_EVAL_YEAR :: '+this.propsQstnPlanData.SRCH_EVAL_YEAR);
      //console.info('pop SRCH_EVAL_MONTH :: '+this.propsQstnPlanData.SRCH_EVAL_MONTH);

      let headParam = {head: {}};
      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if (!this.mixin_isEmpty(resData)) {
        this.items2_selected = [];
        this.items_selected = [];
        this.USER_GRID_ITEMS = [];        
        this.USER_GRID_ITEMS = resData.DATA;        
      }else {
        this.USER_GRID_ITEMS = [];
      }
    },    

    // 등록된 대상자 검색 
    async selectCustUserList() {      
      let sUrl = '/phone-api/qt/selectEvalCustList';
      let postParam = {
        EVAL_ID: this.EVAL_ID,
        DEPT_ID: this.SRCH_PARAMS_TOP.SRCH_DEPT_ID_CUST,
        SRCH_EVAL_YEAR:  this.propsQstnPlanData.SRCH_EVAL_YEAR,
        SRCH_EVAL_MONTH : this.propsQstnPlanData.SRCH_EVAL_MONTH,
      };

      let headParam = {head: {}};
      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if (!this.mixin_isEmpty(resData)) {
        this.items2_selected = [];
        this.items_selected = [];
        this.CK_USER_GRID_ITEMS = [];        
        this.CK_USER_GRID_ITEMS = resData.DATA;        
      }else {
        this.CK_USER_GRID_ITEMS = [];
      }      
    },


    setQstnPlanDataRe(obj){
      //console.info('DIALOG setQstnPlanDataRe');
      this.qstnPlanData = JSON.parse(JSON.stringify(obj));

      this.SRCH_PARAMS_TOP.SRCH_CENTER.value ='';
      this.SRCH_PARAMS_TOP.SRCH_CENTER.value = this.qstnPlanData.CENTER_ID;
      
      this.EVAL_ID = this.qstnPlanData.EVAL_ID;
      this.CENTER_ID = this.qstnPlanData.CENTER_ID;      
      this.isConfirm = this.qstnPlanData.isConfirm;

      this.list4_selected= [];
      this.list5_selected= [];
      this.items_selected= [];
      this.items2_selected= [];
      this.items2= [];     

      // 평가 대상자 
      this.USER_GRID_ITEMS = [];    
      // 선택 등록 대상자 
      this.CK_USER_GRID_ITEMS = [];  
      
      this.selectUserList();
      this.selectCustUserList();
      this.selectDeptList();
    },

    async setQstnPlanData(obj){
      this.qstnPlanData = {};      
      this.qstnPlanData = JSON.parse(JSON.stringify(obj));
      this.SRCH_PARAMS_TOP.SRCH_CENTER.value = this.qstnPlanData.CENTER_ID;      
      this.EVAL_ID = this.qstnPlanData.EVAL_ID;      
      this.CENTER_ID = this.qstnPlanData.CENTER_ID;
      this.isConfirm = this.qstnPlanData.isConfirm;
      await this.selectUserList();
      await this.selectCustUserList();
      await this.selectDeptList();
    },

    // 선택된 대상자를 처리   ( 추가/삭제 )
    async setQstnPlanUserData(type){     

      if( this.EVAL_ID === undefined || this.EVAL_ID === '' ) {
        //console.info('EVAL_ID null ');
        this.showAlert(this.MESSAGE.ERROR.ERROR);
        return;
      }   

      // if( (this.items_selected.length <= 0 ) && (this.items2_selected.length <= 0 ) ){
      //   //console.info('DATA NULL');
      //   this.showAlert(this.MESSAGE.ERROR.ERROR);
      //   return;
      // }

      let sUrl = '/phone-api/qt/editEvalCust';      

      let postParam = {
        //editUserList: this.CK_USER_GRID_ITEMS,
        editUserList: type === 'add' ? this.checkedList01 : this.checkedList02 , 
        EVAL_ID: this.EVAL_ID,
        REG_EMP_NO: this.$store.getters["userStore/GE_USER_ROLE"].userId,
        editType: type       
      };

      let headParam = { head : {
          DATA_OBJECT: "editUserList" 
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);
      
      if(!response.HEADER.ERROR_FLAG) {        
        this.showToast(this.MESSAGE.TOAST.DONE);

        this.selectCustUserList();
        this.selectUserList();
        this.checkedList01 = [];
        this.checkedList02 = [];
        
        // 선택 처리
        // if(type == "add"){
        //   let addlist = this.checkedList01.map(e => {return e.USER_ID});
        //   console.log(addlist)
        //   this.checkedList02 = this.CK_USER_GRID_ITEMS.filter(row=>{return addlist.indexOf(row.USER_ID)});
        //   this.checkedList01 = [];
        // }else{
        //   let deletelist = this.checkedList02.map(e => {return e.USER_ID});
        //   this.checkedList01 = this.USER_GRID_ITEMS.filter(row=>{return deletelist.indexOf(row.USER_ID)});
        //   this.checkedList02 = [];
        // }

        this.$emit('refresh');        
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
      
    },

    itemMove(type) {        

      if(!this.isConfirm){
        return this.showAlertInfo({msg : '평가기간이 종료 되었습니다.'})
      }

      if (type === "remove") {
        if( this.checkedList02.length <=0  ){
          this.showAlert(this.MESSAGE.ALERT.REMOVE_ITEM);
          return;
        }
      } else {
        if( this.checkedList01.length <=0  ){
          this.showAlert(this.MESSAGE.ALERT.ADD_ITEM);
          return;
        }    
      }      
      this.setQstnPlanUserData(type);
    },

    allCheckbox(id) {
      //console.log(
      //  "######## [allCheckbox] this.list5_selected.length=",
     //   this.list5_selected.length
      //);

      if (id === "items") {
        //하나도 체크되어 있지 않으면 전체 체크
        if (this.items_selected.length === 0) {
          this.items_selected = [];
          for (let i = 0; i < this.USER_GRID_ITEMS.length; i++) {
            this.items_selected.push(this.USER_GRID_ITEMS[i]);
          }
        } else {
          //아니라면 전체 해제
          this.items_selected = [];
        }
      } else if (id === "items2") {
        //하나도 체크되어 있지 않으면 전체 체크
        if (this.items2_selected.length === 0) {
          this.items2_selected = [];
          for (let i = 0; i < this.CK_USER_GRID_ITEMS.length; i++) {
            this.items2_selected.push(this.CK_USER_GRID_ITEMS[i]);
          }
        } else {
          //아니라면 전체 해제
          this.items2_selected = [];
        }
      }
    },









    // 여기 아래 부터는 퍼블 
    itemMove_bak(type) {
      if (type === "left") {
        //배열추가
        this.items = [...this.items, ...this.items2_selected];
        //배열삭제
        for (var i = 0; i < this.items2_selected.length; i++) {
          this.items2 = this.items2.filter(
            (element) => element != this.items2_selected[i]
          );
        }
        //선택값 초기화
        this.items2_selected = [];
      } else {
        //배열추가
        this.items2 = [...this.items2, ...this.items_selected];
        //배열삭제
        for (var a = 0; a < this.items_selected.length; a++) {
          this.items = this.items.filter(
            (element) => element != this.items_selected[a]
          );
        }
        //선택값 초기화
        this.items_selected = [];
      }
    },   
    
  },
  async mounted() {
    await this.setQstnPlanData(this.propsQstnPlanData);
  },
  async created() {
    //console.log( "created()" );    

    this.SRCH_PARAMS_TOP.SRCH_CENTER.value = "1000";
    this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID = "1000";
    this.SRCH_PARAMS_TOP.SRCH_DEPT.value = '';
        

    //조직
    this.common_ognz_list = await this.mixin_ognz_list();
    //공통코드설정
    let codeName = ['USE_WT', 'T203'/*직위*/, 'T207'/*직급*/, 'USER_STTS_CD'/* 재직 */];
    this.common_code = await this.mixin_common_code_get_all(codeName);

    let codeNameGloal = ['JOB_CL'/*근무유형(CUSTCO별)*/, 'WT'/*근무유형(CUSTCO별)*/];
    this.common_code_global = await this.mixin_common_code_get_all_global( codeNameGloal );
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>