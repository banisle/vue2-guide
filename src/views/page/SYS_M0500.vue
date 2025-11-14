<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                게시판 유형
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form type-middle"
                  placeholder="전체"
                  :items="mixin_common_code_get(this.listCommonCode, 'BBS_TYPE_CD', '전체')"
                  item-key="CD"
                  v-model="selectedBbsTypeCombo"
                ></v-select>
              </div>
            </div>
            <div>
              <v-btn class="pl-btn is-icon" @click="getBbsList" >
                <span class="pl-icon20 search"></span>
                조회
              </v-btn>
              <compo-tooltip-btn
                TitleProp="새로고침"
                ClassProp="pl-tooltip-btn"
                IconProp="pl-icon20 refresh"
                TooltipPositionProp="bottom"
                @btnClick="resetGrid" />

            </div>

          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-cols fill-height">
        <!-- grid -->
        <div class="pl-card-body is-col-fix is-vrt" style="width: 70%;">
          <div class="pl-grid-top pt-2">
            <div class="pl-grid-top-left">
              <v-btn class="pl-btn is-icon is-trans" @click="setRegMode">
                <span class="pl-icon20 circle-plus"></span>
                등록
              </v-btn>
              <v-btn class="pl-btn is-icon is-trans" @click="beforeDeleteBbs">
                <span class="pl-icon20 trash"></span>
                삭제
              </v-btn>
            </div>
            <div class="pl-grid-top-utils">
              <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ GRID.ITEMS.length }})</em> 건</span>
            </div>
          </div>
          <v-data-table
            class="pl-grid has-control is-mt-s is-hover"
            show-select
            v-model="selectedBbsItem"
            :headers="GRID.HEADERS"
            :items="GRID.ITEMS"
            :item-class="(item) => {return item.BBS_ID === this.detailParams.BBS_ID? 'active':''}"
            fixed-header
            item-key="ROW_NUMBER"
            height="calc(100vh - 268px)"
            @click:row="rowClick"
            hide-default-footer
            :items-per-page="-1"
            no-data-text="등록된 데이터가 없습니다."
          >
            <!-- 사용 여부 -->
            <template v-slot:item.BBS_USE_YN.code="{ item }">
              <span
                :class="`pl-badge is-${mixin_displayStatus(item.BBS_USE_YN.code, 'STAT_LIST')}`"
                style="width: 50px;"
                >
              {{ item.BBS_USE_YN.code }}</span>
            </template>
            <!-- 내용 -->
            <template v-slot:item.GOTOBBS="{ item }">
              <compo-tooltip-btn
                  TitleProp="게시판 보기"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 board-docu"
                  TooltipPositionProp="bottom"
                  @btnClick="mixin_showDialog('BbsList')"
              ></compo-tooltip-btn>
            </template>
          </v-data-table>
        </div>
        <!-- detail -->
        <div class="d-flex flex-column">
          <div class="pl-card flex-grow-1">
            <div class="pl-subtit">{{ regMode ? '게시판 등록':'게시판 상세 정보' }}</div>
            <div class="pl-subdesc">
              <p>
                게시판 ID는 등록 시 시스템에서 자동 부여 됩니다.<br>
                필수 항목을 입력하신 후 [{{ regMode ? '저장' : '수정'}}] 버튼을 클릭하십시오.
              </p>
            </div>
            <!-- form -->
            <v-form ref="form">
              <div class="pl-form-inline-wrap vertical label-80 is-mt-m">
                <div class="pl-form-inline">
                <span class="pl-label">
                  게시판 명
                </span>
                  <div class="pl-desc">
                    <v-text-field
                        class="pl-form type-middle flex-grow-1"
                        placeholder="게시판명을 입력해 주세요."
                        v-model="detailParams.BBS_NM"
                        :rules="validateRules.BBS_NM"
                        :disabled="regMode ? false : mixin_isEmpty(selectedRowObj)"
                    ></v-text-field>
                  </div>
                </div>
                <div class="pl-form-inline">
                <span class="pl-label">
                  게시판 ID
                </span>
                  <div class="pl-desc">
                    <v-text-field
                        disabled
                        class="pl-form type-middle flex-grow-1"
                        v-model="detailParams.BBS_ID"
                    />
                  </div>
                </div>
                <div class="pl-form-inline">
                <span class="pl-label">
                  게시판 유형
                </span>
                  <div class="pl-desc">
                    <v-select
                        class="pl-form type-middle"
                        placeholder="게시판 유형을 선택하세요."
                        :items="mixin_common_code_get(this.listCommonCode, 'BBS_TYPE_CD',null)"
                        v-model="detailParams.BBS_TYPE_CD"
                        :rules="validateRules.BBS_TYPE"
                        disabled
                    ></v-select>
                  </div>
                </div>
                <div class="pl-form-inline">
                <span class="pl-label">
                  사용 부서
                </span>
                  <div class="pl-desc">
                    <v-text-field
                        v-model="detailParams.USER_DEPT.DEPT_NM"
                        class="pl-form is-search type-middle"
                        placeholder="우측의 조직도 찾기를 클릭하세요"
                        @keydown.enter="mixin_showDialog('OrgTree')"
                        @click="mixin_showDialog('OrgTree')"
                        :rules="validateRules.DEPT"
                        :disabled="regMode ? false : mixin_isEmpty(selectedRowObj)|| !mixin_isEmpty(detailParams.BBS_ID)"
                    >
                      <template v-slot:append>
                        <v-btn
                            @click="mixin_showDialog('OrgTree')"
                            class="pl-btn has-icon-only"
                            :disabled="regMode ? false : mixin_isEmpty(selectedRowObj)|| !mixin_isEmpty(detailParams.BBS_ID)"
                        >
                          <span class="pl-icon20 in-search"></span>
                        </v-btn>
                      </template>
                    </v-text-field>
                  </div>
                </div>
                <div class="pl-form-inline is-border-sub-top pt-3">
                  <span class="pl-label">
                    권한 설정
                  </span>
                  <div class="pl-desc">
                      <strong class="is-txt-black">쓰기</strong>
                      <v-select
                          v-model="detailParams.BBS_AUTHRT.write"
                          :items="authrt_group_drop"
                          :rules="validateRules.AUTHRT_GROUP_SELECT"
                          multiple
                          class="pl-form type-middle"
                          placeholder="선택"
                          :disabled="regMode ? false : mixin_isEmpty(selectedRowObj)"
                      ></v-select>
                  </div>
                </div>
                <div class="pl-form-inline pt-3">
                  <span class="pl-label">
                  </span>
                  <div class="pl-desc">
                      <strong class="is-txt-black">읽기</strong>
                      <v-select
                          v-model="detailParams.BBS_AUTHRT.read"
                          :items="authrt_group_drop"
                          :rules="validateRules.AUTHRT_GROUP_SELECT"
                          multiple
                          class="pl-form type-middle"
                          placeholder="선택"
                          :disabled="regMode ? false : mixin_isEmpty(selectedRowObj)"
                      ></v-select>
                  </div>
                </div>
<!--                <div class="pl-form-inline is-border-sub-top pt-3">-->
<!--                <span class="pl-label">-->
<!--                  업로드 용량-->
<!--                </span>-->
<!--                  <div class="pl-desc">-->
<!--                    <v-text-field-->
<!--                        class="pl-form type-middle flex-grow-1"-->
<!--                        suffix="MB"-->
<!--                        v-model="detailParams.UPLOAD_LIMIT_SIZE"-->
<!--                        :rules="detailParams.FILE_ATCH_YN==='Y'?validateRules.FILE_SIZE : []"-->
<!--                        :disabled="regMode ? false || detailParams.FILE_ATCH_YN === 'N' : mixin_isEmpty(selectedRowObj) || detailParams.FILE_ATCH_YN === 'N'"                 ></v-text-field>-->
<!--                  </div>-->
<!--                </div>-->
                <div class="pl-form-inline is-border-sub-top pt-3">
                <span class="pl-label">
                  설명
                </span>
                  <div class="pl-desc">
                    <v-textarea
                      class="pl-form is-noresize"
                      v-model="detailParams.BBS_EXPLN"
                      :spellcheck="false"
                      placeholder="게시판 설명을 입력하세요."
                      :disabled="regMode ? false : mixin_isEmpty(selectedRowObj)"
                      height="90px"
                    />
                  </div>
                </div>
                <div class="pl-form-inline">
                <span class="pl-label">
                  사용 여부
                </span>
                  <div class="pl-desc">
                    <v-select
                        v-model="detailParams.BBS_USE_YN"
                        :items="STAT_LIST"
                        item-text="code"
                        item-value="vl"
                        class="pl-form type-middle flex-grow-0"
                        placeholder="선택"
                        :rules="validateRules.USE_YN"
                        :disabled="regMode ? false : mixin_isEmpty(selectedRowObj)"
                    ></v-select>
                  </div>
                </div>
              </div>
            </v-form>
          </div>
          <!-- bottom -->
          <div class="pl-card is-border text-right">
            <v-btn class="pl-btn" :disabled="regMode ? false : mixin_isEmpty(selectedRowObj)" @click="beforeSaveBbs">{{ regMode ? '저장' : '수정'}}</v-btn>
          </div>
        </div>
      </div>
    </div>
    <v-dialog
        v-model="dialogOrgTree"
        content-class="dialog-draggable"
        hide-overlay>
        <div class="draggable-area">drag area</div>
        <CompoDialog
            header-title="조직 선택"
            @hide="mixin_hideDialog('OrgTree')"
        >
          <template slot="body">
            <CompoTree ref="ognzDataCompo"
                       :SRCH_DEPT_KEY="mixin_isEmpty(detailParams.USER_DEPT) ? this.$store.getters['userStore/GE_USER_ROLE'].CENTER_DEPT_ID : detailParams.USER_DEPT.DEPT_ID"
                       :ExpandedProp=true
                       @Close="dialogOrgTree = false"
            />
          </template>
          <template slot="footer">
            <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('OrgTree')">닫기</v-btn>
            <v-btn class="pl-btn" @click="setOgnzSubmitData">선택</v-btn>
          </template>
        </CompoDialog>
    </v-dialog>
    <v-dialog
        persistent
        v-if="dialogBbsList"
        v-model="dialogBbsList"
        content-class="dialog-draggable is-lg is-nopadding is-maxHeight">
      <div class="draggable-area">drag area</div>
      <compo-dialog
          :header-title="selectedRowObj.BBS_HEADER_TITLE"
          :FooterProp=false
          @hide="mixin_hideDialog('BbsList')"
      >
        <template slot="body">
          <!-- component -->
          <BBS_LIST :DataProp="detailParams" @Close="dialogBbsList = false"/>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
import CompoTree from "@/components/CompoTree.vue";
import CompoDialog from "@/components/CompoDialog.vue";
import BBS_LIST from "@/views/page/BBS_LIST.vue";

export default {
name:"MENU_SYS_M0500", //게시판 관리
components: {
  BBS_LIST,
  CompoTree,
  CompoDialog
},
data() {
  return {
    progressBar: true,
    socket: null,
    listCommonCode : [],
    selectedBbsTypeCombo : '',
    authrt_group_drop:[],

    STAT_LIST: [
      { code : '사용', value: 'blue', vl : 'Y' },
      { code : '미사용', value: 'yellow', vl : 'N'},
    ],
    radioGroup: [
      { text: "허용", value : 'Y'},
      { text: "차단", value : 'N'},
    ],
    DEPT_KEY : '9',
    dialogOrgTree : false,

    selectedRowObj : {},
    selectedBbsItem : [],

    regMode : false,
    nextDisabled : false,

    detailParams : {
        USER_DEPT: {DEPT_ID : null, DEPT_NM : null, CUSTCO_ID : null, BBS_USE_SE_CD: null, DEPT_WHOL_PATH:null }
      , BBS_AUTHRT: {read: [], write: [],readtxt: '', writetxt: ''}
    },
    GRID: {
      HEADERS: [
        {text: '번호', value: 'ROW_NUMBER', align: 'center', width: '8%', sortable: false},
        {text: '게시판 유형', value: 'BBS_TYPE_NM', align: '', width: '12%'},
        {text: '사용 부서', value: 'USER_DEPT.DEPT_WHOL_PATH', align: '', width: '25%', sortable: false},
        {text: '게시판 명', value: 'BBS_NM', align: '', width: '18%', sortable: false},
        {text: '설명', value: 'BBS_EXPLN', align: '', width: '25%', sortable: false},
        {text: '게시물 수', value: 'PST_CNT', align: 'center', width: '10%', sortable: false},
        {text: '게시판 ID', value: 'BBS_ID', align: 'center', width: '10%', sortable: false},
        {text: '사용여부', value: 'BBS_USE_YN.code', align: 'center', width: '10%', sortable: false},
        {text: '바로가기', value: 'GOTOBBS', align: 'center', width: '10%', sortable: false},
      ],
      ITEMS:[]
    },
    validateRules: {
      BBS_NM: [
        v => !!v || '게시판 명은 필수 입력 항목입니다.',
        v => (v && v.length <=100) || '게시판 명은 100자를 넘을 수 없습니다.',
      ],
      BBS_TYPE: [
        v => !!v || '게시판 명은 필수 입력 항목입니다.',
      ],
      DEPT: [
        v => !!v || '사용 부서는 필수 선택 항목입니다.'
      ],
      FILE_SIZE: [
        v => !!v || '사용 부서는 필수 선택 항목입니다.'
      ],
      FILE_FMT: [
        v => !!v || '사용 부서는 필수 선택 항목입니다.'
      ],
      AUTHRT_GROUP_SELECT: [
        v => !!v || '권한은 필수 선택 항목입니다.'
      ],
      USE_YN: [
        v => !!v || '사용 여부는 필수 선택 항목입니다.'
      ],
    },

    dialogBbsList:false,

  }
},

  watch: {
    detailParams: {
      handler(newValue, oldValue) {
      },
      deep: true,
      immediate: true,
    },
  },

  computed: {
  },
  async created() {
    let codeList = ['BBS_TYPE_CD'];
    this.listCommonCode = await this.mixin_common_code_get_all(codeList);
    this.srchAuthrtGroup();

    this.$eventBus.$off("setOgnzTreeInfo"); //eventBus 중복방지를 위해 off
    this.$eventBus.$on("setOgnzTreeInfo", (ognz) => {
      this.detailParams.USER_DEPT.DEPT_ID = ognz.DEPT_ID;
      this.detailParams.USER_DEPT.DEPT_NM = ognz.DEPT_NM;
      this.detailParams.USER_DEPT.CUSTCO_ID = ognz.CUSTCO_ID;
      if( ognz.LVL === '1' ) this.detailParams.USER_DEPT.BBS_USE_SE_CD = 'A';
      else if( ognz.LVL === '2' ) this.detailParams.USER_DEPT.BBS_USE_SE_CD = 'CT';
      else if( ognz.LVL === '3' ) this.detailParams.USER_DEPT.BBS_USE_SE_CD = 'T';
      else {
        this.showAlertCaution({msg:'게시판은 팀단위(tree level-3) 까지만 선택할 수 있습니다.', callAfter:()=>{
            this.detailParams.USER_DEPT = {DEPT_ID : null, DEPT_NM : null, CUSTCO_ID : null, BBS_USE_SE_CD: null };
        }});
      }
    });



  },
  async mounted(){
     await this.getBbsList();
  },
  methods: {

    // 게시판 목록 조회
    async getBbsList() {
      this.initForm();
      this.GRID.ITEMS = [];

      let postParam = {
        SRCH_TYPE_CD : this.selectedBbsTypeCombo,
      }

      let headParam = {
        head: {
          ns: "lhcs.system.bbs.dao.BbsMapper",
          sn: "selectBbsList"
        }
      };

      const response = await this.common_postCall('/api/biz/common/select/selectBbsList', postParam, headParam)
      if( !response.HEADER.ERROR_FLAG ){
        let responseData = response.DATA;
        responseData.map((item,index)=>{
          responseData[index]["USER_DEPT"] = {DEPT_ID : item.DEPT_ID, DEPT_NM : item.DEPT_NM,CUSTCO_ID:item.CUSTCO_ID,  BBS_USE_SE_CD: item.BBS_USE_SE_CD, DEPT_WHOL_PATH: item.DEPT_WHOL_PATH };
          responseData[index]["UPLOAD_LIMIT_SIZE"] = this.mixin_isEmpty(item.ATCH_FILE_SZ) ? null :Number(item.ATCH_FILE_SZ)/1024/1024;
          responseData[index]["BBS_AUTHRT"] = { read : item.READ_AUTHRT.split(","), write : item.WRITE_AUTHRT.split(","), readtxt: item.READ_AUTHRT, writetxt: item.WRITE_AUTHRT };   // 권한 설정;
          responseData[index]["BBS_USE_YN"] = item.USE_YN === 'Y' ? {code:'사용', vl:'Y'} : {code:'미사용', vl:'N'};
        });
        this.GRID.ITEMS = [...this.GRID.ITEMS, ...responseData];
      }else{
        this.showToastCaution({ msg : response.HEADER.ERROR_MSG })
      }
    },
    resetGrid(){
      this.getBbsList();
      this.initForm();
      this.resetValidation();
      this.resetRegMode();

    },
    setOgnzSubmitData() {
      this.$refs.ognzDataCompo.setOgnzSubmitData(); //callback => setOgnzTreeInfo
    },
    rowClick(item){
      this.resetRegMode();
      this.selectedRowObj = item;
      this.selectedRowObj.BBS_HEADER_TITLE = this.selectedRowObj.BBS_NM + ' <span class="is-txt-sub" style="font-size: 12px; gap: 4px">(유형:'+ this.selectedRowObj.BBS_TYPE_NM +' , 부서:'+ this.selectedRowObj.USER_DEPT.DEPT_WHOL_PATH +')</span>';
      this.selectedRowObj.IS_SYSTEM = 'Y';
      this.detailParams = {}
      this.detailParams = JSON.parse(JSON.stringify(this.selectedRowObj))/* Deep Copy */;
    },
    validate() {
      return this.$refs.form.validate();
    },
    // resetValidate
    setRegMode(){
      this.initForm();
      this.detailParams.BBS_TYPE_CD = 'GNRL_BBS';
      this.regMode = true;
    },
    beforeSaveBbs(){
      if(this.validate() && this.regMode === true) {
        this.showConfirmInfo({
          msg : '게시판을 등록 하시겠습니까?'
          , callYes : ()=>{ this.saveBbs('regist') }
          , callNo:()=>{ this.$store.commit("alertStore/hideAlert") }
        })
      }else if(this.validate() && this.regMode === false){
        this.showConfirmInfo({
          msg : '게시판을 수정 하시겠습니까?'
          , callYes : ()=>{ this.saveBbs('update') }
          , callNo:()=>{ this.$store.commit("alertStore/hideAlert") }
        })
      }else{
        this.showToastCaution({msg : '필수 입력 항목을 확인 해주세요.'})
      }
    },
    // 게시판 등록/수정
    async saveBbs(type){

      console.log("👌 type > " + type + ' details > ' + JSON.stringify(this.detailParams) + ' 까지~!')
      let sUrl = type ==='regist' ? '/system-api/bbs/registBbs' : '/system-api/bbs/updateBbs';
      let postParam = {};
      postParam.BBS_NM = this.detailParams.BBS_NM;
      postParam.BBS_ID = this.mixin_isEmpty(this.detailParams.BBS_ID) ? null : this.detailParams.BBS_ID;
      postParam.BBS_EXPLN = this.detailParams.BBS_EXPLN;
      postParam.BBS_TYPE_CD = this.detailParams.BBS_TYPE_CD;
      postParam.USE_CUSTCO_ID = this.detailParams.USER_DEPT.CUSTCO_ID;
      postParam.USE_DEPT_ID = this.detailParams.USER_DEPT.DEPT_ID;
      postParam.BBS_USE_SE_CD = this.detailParams.USER_DEPT.BBS_USE_SE_CD;
      postParam.FILE_ATCH_YN = this.detailParams.FILE_ATCH_YN;
      postParam.ATCH_FILE_SZ = 100;//this.mixin_isEmpty(this.detailParams.UPLOAD_LIMIT_SIZE) ? '' : this.detailParams.UPLOAD_LIMIT_SIZE;
      postParam.GRNT_AUTHRT_READ = this.detailParams.BBS_AUTHRT.read.join(",");
      postParam.GRNT_AUTHRT_WRITE = this.detailParams.BBS_AUTHRT.write.join(",");
      postParam.USE_YN= typeof this.detailParams.BBS_USE_YN ==='object' ? this.detailParams.BBS_USE_YN.vl : this.detailParams.BBS_USE_YN;

      console.log("🌵 postParam >>> ", JSON.stringify(postParam))
      const response = await this.common_postCall(sUrl, postParam, {});
      if( !response.HEADER.ERROR_FLAG ) {
        this.showToastInfo({msg : type ==='regist' ? '등록 되었습니다.' : '수정 되었습니다.', callAfter : ()=>{
          this.$store.commit("alertStore/hideAlert")
          this.getBbsList();
        }})
      }else{
        this.showToastCaution({msg : response.HEADER.ERROR_MSG, callAfter : ()=>{
            this.$store.commit("alertStore/hideAlert")
          }})
      }
    },
    // validation 초기화
    resetValidation(){
      this.$refs.form.reset();
    },
    // 등록모드 초기화
    resetRegMode(){
      this.regMode = false;
    },
    // form데이터 초기화
    initForm(){
      this.selectedRowObj = {};
      this.selectedBbsItem = [];
      this.detailParams = {};
      this.detailParams.USER_DEPT = {DEPT_ID: null, DEPT_NM: null, UP_DEPT_ID: null, DEPT_WHOL_PATH:null};
      this.detailParams.BBS_AUTHRT = {read: [], write: [], readtxt: '', writetxt: ''};
    },
    beforeDeleteBbs(){
      if(this.mixin_isEmpty(this.selectedBbsItem)){
        this.showToastCaution({msg : "삭제할 게시판을 선택하세요."})
      }else{
        this.showConfirmCaution({
          msg : "선택한 게시판은 영구 삭제됩니다. \n계속 하시겠습니까?"
          , callYes : ()=>{ this.deleteBbs() }
          , callNo : ()=>{ this.$store.commit("alertStore/hideAlert") }})
      }
    },
    async deleteBbs(){
      let sUrl = '/system-api/bbs/deleteBbs';

      let postParam = {
        delBbsList : this.selectedBbsItem.map(row=>{return{
          BBS_ID : row.BBS_ID,
        }})
      }
      console.log("delBbsList >", this.selectedBbsItem)
      console.log("delBbsList >", postParam.delBbsList)
      let headParam = {
        head:{
          DATA_OBJECT : "delBbsList"
        }
      }
      const response = await this.common_postCall(sUrl, postParam, headParam);
      if( !response.HEADER.ERROR_FLAG ) {
        this.showToastInfo({msg : '정상 처리 되었습니다.', callAfter : ()=>{
            this.$store.commit("alertStore/hideAlert")
            this.getBbsList();
          }})

      }else{
          this.showToastCaution({msg : response.HEADER.ERROR_MSG, callAfter : ()=>{
              this.$store.commit("alertStore/hideAlert")
            }})
      }
    },

    // 권한조회
    async srchAuthrtGroup(){
      this.authrt_group_drop = [];
      this.authrt_group_drop.push({text : '모두',value : 'ALL'});
      let sURL = '/api/setting/system/menu-author-manage/author-group/inqire';
      let resData = await this.common_postCall(sURL,{SCH_CUSTCO_ID:'-1'},{});
      if(!resData.HEADER.ERROR_FLAG){
        for(let i= 0 ; i < resData.DATA.length ; i++){
          let dropitem ={
            text : resData.DATA[i].AUTHRT_GROUP_NM,
            value : resData.DATA[i].GROUP_CD,
          };
          this.authrt_group_drop.push(dropitem);
        }
      }
    },

  },
  beforeDestroy() {
    this.$eventBus.$off("setOgnzTreeInfo"); //eventBus 중복방지를 위해 off
  }
}
</script>

<style lang="scss" scoped>

</style>