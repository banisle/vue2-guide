<template>
  <div class="pl-cols" style="height: 100%">
    <!-- 트리 -->
    <div class="is-col-fix is-vrt" style="width: 600px">
      <div class="pl-search-header pl-card-body py-3">
        <div class="is-left">
          <strong>조직 정보</strong>
        </div>
        <div class="is-right spacing-wrap sp-4 align-center">
          <v-btn class="pl-btn is-sub is-sm" @click="expandAll('treeDefault')">전체 펼치기</v-btn>
          <v-btn class="pl-btn is-sub is-sm" @click="collapseAll('treeDefault')">전체 접기</v-btn>
          <compo-tooltip-btn
            TitleProp="새로고침"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 refresh"
            TooltipPositionProp="bottom"
            @btnClick="getTreeList">
          </compo-tooltip-btn>
        </div>
      </div>

      <div class="">
        <div class="pl-card-body pl-tree-body flex-grow-1 is-border-top" style="height: calc(100vh - 305px)">
          <v-treeview
            ref="treeDefault"
            activatable
            return-object
            :items="treeItems"
            :open-all="expanded"
            :open-on-click=false
            :open.sync="treeOpenSync"
            item-key="id"
            @update:active="srch_tree_act"
            color="secondary"
            class="pl-tree-view">
            <template v-slot:prepend="{ item, open }">
              <v-icon v-if="item.children.length > 0">
                  {{open ? 'pl-icon20 tree-folder-open' : 'pl-icon20 tree-folder'}}
              </v-icon>
              <v-icon v-else>
                  {{ 'pl-icon20 tree-file' }}
              </v-icon>
            </template>
            <template v-slot:label="{ item}">
              <span>{{ item.name }}</span>
            </template>
          </v-treeview>

        </div>
        <div class="pl-card is-border pl-btn-wrap">
          <!-- new folder 버튼 -->
          <compo-tooltip-btn
            TitleProp="부서 추가"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 is-new-folder"
            TooltipPositionProp="top"
            @btnClick="ognzRegForm"
          ></compo-tooltip-btn>
          <!-- 삭제 버튼 -->
          <compo-tooltip-btn
            TitleProp="부서 삭제"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 trash"
            TooltipPositionProp="top"
            @btnClick="ognzDelCheck"
          ></compo-tooltip-btn>
          <div class="ml-auto">
            <!-- list up 버튼 -->
            <compo-tooltip-btn
              TitleProp="순서 위로"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 is-list-up"
              TooltipPositionProp="top"
              @btnClick="treeNodeMove('UP')"
            ></compo-tooltip-btn>
            <!-- list down 버튼 -->
            <compo-tooltip-btn
              TitleProp="순서 아래로"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 is-list-down"
              TooltipPositionProp="top"
              @btnClick="treeNodeMove('DOWN')"
            ></compo-tooltip-btn>
          </div>
        </div>
      </div>
    </div>
    <!-- 조직 정보 입력 -->
    <div class="is-vrt fill-height">
      <div class="pl-card">
        <h2 class="pl-subtit">조직 상세 정보</h2>
        <div class="pl-subdesc">
          <p>LHCS 상담센터를 제외한 조직 정보는 매일 저녁 LH 로부터 신규 정보가 반영되어 집니다.<br>
          CTI 조직코드는 조직 신규생성 시 CTI와 실시간 연계되어 CTI로부터 코드가 발급되어 리턴 됩니다. </p>
        </div>
      </div>
      <div class="pl-card is-noborder pt-0 flex-grow-1 pl-scroll-body" >
        <v-form ref="form">
          <div class="pl-card-form-body" >
            <div class="pl-form-inline-wrap vertical label-80">
              <div class="pl-form-inline">
                <span class="pl-label">
                  전체 경로
                </span>
                <div class="pl-desc">
                  {{DTL_FULL_PATH}}
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  조직 명
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form type-middle"
                    v-model="DTL_DEPT_NM"
                    :rules="validateRules.DEPT_NM"
                    v-byte-counter="100"
                  />
                </div>
              </div>
              <!-- 추가 -->
              <div class="pl-form-inline">
                <span class="pl-label">
                  부서코드
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form type-middle"
                    ref="orgForm.DTL_DEPT_CD"
                    :rules="validateRules.DEPT_CD"
                    v-model="DTL_DEPT_CD"
                  />
                  <v-btn class="pl-btn is-esp flex-grow-0" @click="ognzDeptCdDuplicateCheck">중복체크</v-btn>
                  <span class="is-esp flex-grow-0">(부서번호 : {{DTL_DEPT_ID}})</span>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  콜센터 여부
                </span>
                <div class="pl-desc">
                  <v-select
                      class="pl-form type-middle flex-grow-0"
                      :items="mixin_common_code_get(this.common_code, 'USE_WT')"
                      placeholder="선택하세요"
                      v-model="DTL_CL_CNTR_YN"
                  ></v-select>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  담당지역
                </span>
                <div class="pl-desc">
                  <v-select
                      class="pl-form type-middle"
                      :items="dept_rgn_list"
                      placeholder="선택하세요"
                      v-model="DTL_DEPT_RGN_ID"
                  ></v-select>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  CTI 조직코드
                </span>
                <div class="pl-desc">
                  <!-- <v-text-field
                      class="pl-form type-middle is-sm"
                      v-model="DTL_CTI_DEPT_ID"
                  /> -->
                  <v-select
                      class="pl-form type-middle"
                      :items="ctiqIdList"
                      item-text="CTIQ_NAME"
                      item-value="CTIQ_ID"
                      placeholder="선택하세요"
                      v-model="DTL_CTI_DEPT_ID"
                      multiple
                  ></v-select>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  정렬 순서
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form type-middle is-sm"
                    v-model="DTL_SORT_ORD"
                    disabled
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  사용 여부
                </span>
                <div class="pl-desc">
                  <v-select
                    class="pl-form type-middle flex-grow-0"
                    :items="mixin_common_code_get(this.common_code, 'USE_WT')"
                    placeholder="선택하세요"
                    v-model="DTL_USE_YN"
                    :rules="validateRules.USE_YN"
                  ></v-select>
                </div>
              </div>
            </div>
          </div>
        </v-form>
      </div>
      <div class="pl-card is-border text-right">
        <v-btn
          class="pl-btn"
          @click="ognzRegValidate"
          :disabled="DTL_UP_DEPT_ID ===''?true:false"
        >저장</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SYS_M0201_TAB_01', //조직정보
  components: {
  },
  data() {
    return {
      common_code: [],
      dept_rgn_list:[], /* 담당지역목록 */

      //tree
      treeOpenSync: [],
      expanded: false,
      treeItems: [],
      activeItem:[],
      selectedNode: null,

      //조직 상세 정보
      DTL_duplicateCheck: false,
      DTL_FULL_PATH:'',
      DTL_CUSTCO_ID:'', //선택 조직 CUSTCO_ID
      DTL_UP_CUSTCO_ID:'', // 선택 조직 UP_CUSTCO_ID
      DTL_UP_DEPT_ID:'', //상위 조직 ID
      DTL_UP_DEPT_NM:'', //상위 조직 명
      DTL_DEPT_ID:'', //조직 ID
      DTL_DEPT_NM:'', //조직 명
      DTL_DEPT_CD:'', //부서코드
      DTL_BLDG_PSTN:'', //위치
      DTL_BLDG_NM:'', //건물 이름
      DTL_UDGD_YN:false, //지하 여부
      DTL_BLDG_NOFL:'', //층수
      DTL_OFC_NO:'', //사무실 번호
      DTL_USE_YN:'', //사용여부
      DTL_SORT_ORD:'', //정렬순서
      DTL_RE_SORT_ORD:'', //정렬순서
      DTL_MAX_SORT_ORD:'', //상위 조직의 최대 정렬순서
      DTL_CHILD_CNT:0,
      DTL_LVL:'',
      DTL_CL_CNTR_YN: '', //콜센터여부
      DTL_EVL_YN: '', //평가여부
      DTL_DEPT_RGN_ID: '', //담당지역
      DTL_CTI_DEPT_ID: [], //CTI_조직코드

      valid : true,
      validateRules: {
        DEPT_NM: [
          v => !!v || '조직명 은(는) 필수 입력 항목 입니다.',
        ],
        DEPT_CD: [
          v => !!v || '조직명 은(는) 필수 입력 항목 입니다.',
        ],
        USE_YN: [
          v => !!v || '사용여부 은(는) 필수 입력 항목 입니다.',
        ],
      },



      page: 1,
      pageCount: 0,

      ctiqIdList : [], //CTI_조직코드 목록
    }
  },
  beforeDestroy(){
  },

  async created() {
    //공통코드설정
    let codeName = ['USE_WT'];
    this.common_code = await this.mixin_common_code_get_all(codeName);

    this.dept_rgn_list = await this.mixin_charge_area_combo("전체");  //담당지역 콤보
  },

  mounted() {
    this.getTreeList();
    this.getCtiqIdList(); //CTI_조직코드 목록 조회
  },

  methods: {

    //조직 Tree 목록 조회
    async getTreeList() {
      this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", true);
      let sURL ='/api/setting/ognz/ognzTreeList';
      let postParam = {}
      let headParam = {head : {}}
      let response  = await this.common_postCall(sURL, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG){
        this.treeItems = await this.mixin_makeOrgTreeData(response.DATA);
        if( this.selectedNode ) {
          // 조회전에 선택된 노드가 있다면 다시 Open & 선택 ::
          // 아래 순서 지켜야 노드 오픈되고 선택되어짐.
          await this.treeNodeOpenSelect( this.selectedNode.id );
          await this.treeNodeSelect( this.selectedNode.id );
        }else {
          //조회전에 선택된 노드가 없으면 1depth만 Open
          this.treeNodeOpenRoot();
        }
      }
      this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", false);
    },

    //root Tree Open
    treeNodeOpenRoot() {
      if(!!this.treeItems && this.treeItems.length > 0 && Number(this.treeItems[0]?.CHILD_CNT) > 0) {
        this.treeOpenSync = [{'id':this.treeItems[0].id}]
      }
    },
    treeNodeOpenSelect( key ) {
        // 해당키의 부모찾아서 Open
        let _tmpSelectNode = this.findNodeById( this.treeItems , key);
        if( _tmpSelectNode.UP_KEY != undefined && _tmpSelectNode.UP_KEY != "" ) {
          this.treeOpenSync.push({'id': _tmpSelectNode.UP_KEY});
          this.treeNodeOpenSelect( _tmpSelectNode.UP_KEY );
        }
    },
    treeNodeSelect(key) {
      // 외부에서 해당키 찾아서 Active상태로 (select)
      try {
        this.$refs['treeDefault'].updateActive(key, true);
        this.$refs['treeDefault'].emitActive();
      } catch (e) {}
    },

    expandAll(id){
      this.expanded = true;
      this.$refs[id].updateAll(true);
    },
    collapseAll(id){
      this.expanded = false;
      this.$refs[id].updateAll(false);
    },

    //트리 클릭 시 해당 row정보 세팅
    findNodeById(nodes, id) {
      for (let node of nodes) {
        if (node.id === id) {
          return node;
        }
        if (node.children && node.children.length > 0) {
          const foundNode = this.findNodeById(node.children, id);
          if (foundNode) {
            return foundNode;
          }
        }
      }
      return null;
    },

    srch_tree_act(node){

      this.activeItem = node;
      this.selectedNode = this.activeItem[0];

      if(this.selectedNode != null){
        this.DTL_FULL_PATH = this.selectedNode.FULL_PATH.replace('LH주거복지정보>','');
        this.DTL_CUSTCO_ID = this.selectedNode.CUSTCO_ID;
        this.DTL_UP_CUSTCO_ID = this.selectedNode.UP_CUSTCO_ID;
        this.DTL_UP_DEPT_ID = this.selectedNode.UP_DEPT_ID;
        this.DTL_UP_DEPT_NM = this.selectedNode.UP_DEPT_NM;
        this.DTL_DEPT_ID = this.selectedNode.DEPT_ID;
        this.DTL_DEPT_NM = this.selectedNode.DEPT_NM;
        this.DTL_DEPT_CD = this.selectedNode.DEPT_CD;
        this.DTL_BLDG_PSTN = this.selectedNode.BLDG_PSTN;
        this.DTL_BLDG_NM = this.selectedNode.BLDG_NM;
        this.DTL_UDGD_YN = this.selectedNode.UDGD_YN === 'Y'?true:false;
        this.DTL_BLDG_NOFL = this.selectedNode.BLDG_NOFL;
        this.DTL_OFC_NO = this.selectedNode.OFC_NO;
        this.DTL_USE_YN = this.selectedNode.USE_YN;
        this.DTL_SORT_ORD = this.selectedNode.SORT_ORD;
        this.DTL_CL_CNTR_YN = this.selectedNode.CL_CNTR_YN;
        this.DTL_EVL_YN = this.selectedNode.EVL_YN;
        this.DTL_DEPT_RGN_ID = this.selectedNode.DEPT_RGN_ID;
        this.DTL_RE_SORT_ORD = this.selectedNode.SORT_ORD;
        this.DTL_MAX_SORT_ORD = this.selectedNode.MAX_SORT_ORD;
        this.DTL_CHILD_CNT = this.selectedNode.CHILD_CNT;
        this.DTL_LVL = this.selectedNode.LVL;
        this.DTL_CTI_DEPT_ID = this.selectedNode.CTI_DEPT_ID.split('-');

      }
    },

    //등록 form 호출 및 form 초기화
    ognzRegForm() {
      if(this.selectedNode){
        if( this.selectedNode.UP_CUSTCO_ID === '' ){
          this.showAlertCaution({ msg:"센터(1depth) 조직은 추가할 수 없습니다." });
          return;
        }
        console.log("this.selectedNode", this.selectedNode)
        this.DTL_CUSTCO_ID = this.selectedNode.CUSTCO_ID;
        this.DTL_UP_DEPT_ID = this.selectedNode.DEPT_ID;
        this.DTL_UP_DEPT_NM = this.selectedNode.DEPT_NM;
        this.DTL_UP_CUSTCO_ID = this.selectedNode.CUSTCO_ID;
        this.DTL_duplicateCheck = false;  //DEPT_CD중복체크용도.
        this.DTL_DEPT_ID = '';
        this.DTL_DEPT_NM = '';
        this.DTL_BLDG_PSTN = '';
        this.DTL_BLDG_NM = '';
        this.DTL_UDGD_YN = false;
        this.DTL_BLDG_NOFL = '';
        this.DTL_OFC_NO = '';
        this.DTL_USE_YN = 'Y';
        this.DTL_SORT_ORD = '';
        this.DTL_RE_SORT_ORD = '';
        this.DTL_MAX_SORT_ORD = '';
        this.DTL_CHILD_CNT = '';
        this.DTL_LVL = '';
        this.DTL_CL_CNTR_YN = 'N';
        this.DTL_EVL_YN = 'N';
        this.DTL_DEPT_CD = '';
        this.DTL_DEPT_RGN_ID = '';
        this.DTL_CTI_DEPT_ID = [];
      }else{
        this.showAlertCaution({ msg:"상위 조직 정보를 선택해 주세요." });
      }
    },

    //등록 수정 validate 체크
    ognzRegValidate() {
      if (!this.validate()) {
        return;
      }
      if( this.DTL_DEPT_ID === '' && !this.DTL_duplicateCheck) {
        this.showAlertCaution({ msg:"부서코드 중복체크를 먼저 진행하세요." });
        return;
      }
      this.showConfirmInfo({
        msg: "내용을 저장 하시겠습니까?",
        callYes: async () => {
          this.ognzSave();
        },
        callNo: this.closeAlert
      });
    },

    //validate check
    validate () {
      return this.$refs.form.validate();
    },

    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },

    //조직 등록 수정
    async ognzSave() {
      let sUrl = '/api/setting/ognz/ognzProc';
      let postParam = {
          DEPT_ID : this.DTL_DEPT_ID
        , SEL_CUSTCO_ID : this.DTL_CUSTCO_ID
        , UP_DEPT_ID : this.DTL_UP_DEPT_ID
        , UP_CUSTCO_ID : this.DTL_UP_CUSTCO_ID
        , DEPT_NM : this.DTL_DEPT_NM
        , DEPT_CD : this.DTL_DEPT_CD
        , DEPT_SE_CD : 'DEPT'
        , CTI_DEPT_ID : JSON.stringify(this.DTL_CTI_DEPT_ID) //CTI_조직코드
        , CL_CNTR_YN : this.DTL_CL_CNTR_YN  //콜센터여부
        , DEPT_RGN_ID : this.DTL_DEPT_RGN_ID  //담당지역
        , EVL_YN : this.DTL_EVL_YN  // 평가여부
        , SORT_ORD : this.DTL_SORT_ORD  // 정렬순서
        , USE_YN : this.DTL_USE_YN  // 사용여부
      }
      let headParam = {
        head : {
        }
      }
      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG){
        this.showToastInfo({msg:'정상 처리 되었습니다.', callAfter:()=>{
            this.getTreeList();
            this.closeMsg();
          }}
        );
      }
    },

    async ognzDeptCdDuplicateCheck() {
      if( this.selectedNode ) {
        if (this.mixin_isEmpty(this.DTL_DEPT_CD)) {
          this.showAlertCaution({
            msg: "부서코드를 입력하세요.", callAfter: () => {
              this.setFocus("orgForm.DTL_DEPT_CD");
            }
          });
          return false;
        }
        // 부서코드 중복체크
        let sURL = '/api/biz/common/select/ognzDeptCdDuplicateCheck';
        let postParam = {DEPT_CD: this.DTL_DEPT_CD};
        let headParam = {head: {ns: 'palette3.setting.ognz.dao.OgnzMapper'}};
        let response = await this.common_postCall(sURL, postParam, headParam);
        if (!response.HEADER.ERROR_FLAG) {
          if( response.DATA.length > 0) {
            this.showAlertCaution({
              msg: "중복되는 부서코드가 있습니다.", callAfter: () => {
                this.setFocus("orgForm.DTL_DEPT_CD");
              }
            });
            this.DTL_duplicateCheck = false;
          }else {
            this.showToastInfo({msg:'사용 가능합니다.', callAfter:()=>{
                this.DTL_duplicateCheck = true;
              }}
            );

          }
        }
      }else {
        this.DTL_duplicateCheck = false;
        this.showAlertCaution({msg: "상위조직을 먼저 선택하세요."});
      }
    },

    ognzDelCheck(){
      if(this.selectedNode){
        this.showConfirmInfo({
          msg: "선택된 조직을 삭제 하시겠습니까?",
          callYes: async () => {
            this.ognzDel();
          },
          callNo: this.closeAlert
        });
      }else{
        this.showAlertCaution({ msg:"삭제할 조직을 선택해 주세요." });
      }
    },

    //삭제
    async ognzDel() {
      if(this.DTL_DEPT_ID === '' || this.DTL_LVL === '1'){
        this.showAlertCaution({ msg:"해당 조직은 삭제 하실 수 없습니다." });
        return;
      }

      if(this.selectedNode.CHILD_CNT > 0){
        this.showAlertCaution({ msg:"하위 조직이있어 삭제할 수 없습니다." });
        return;
      }

      if(this.selectedNode.USE_CNT > 0){
        this.showAlertCaution({ msg:"해당 조직으로 지정된 사용자가 있습니다."});
        return;
      }

      let sUrl = '/api/setting/ognz/ognzDel';
      let postParam = {
        arrDeptId: this.DTL_DEPT_ID,
      }

      let headParam = {
        head : {
        }
      }

      let resData  = await this.common_postCall(sUrl, postParam, headParam);

      if (!resData.HEADER.ERROR_FLAG){
        this.showToastInfo({msg:'정상 처리 되었습니다.', callAfter:()=>{
            this.closeMsg();
            this.getTreeList();
            this.$refs.form.reset();
          }}
        );
      }
    },

    //Node 순서 변경
    async treeNodeMove(type){

      if(this.selectedNode){
        if((type === 'UP' && this.DTL_RE_SORT_ORD > 1)
          || (type === 'DOWN' && this.DTL_RE_SORT_ORD < this.DTL_MAX_SORT_ORD)) {
          this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", true);
          let sUrl = '/api/setting/ognz/ognzOrderUpdate';
          let postParam = {
            DEPT_SE_CD : 'DEPT',
            // DEPT_SE_CD : this.DTL_DEPT_SE_CD,
            DEPT_ID: this.DTL_DEPT_ID,
            UP_DEPT_ID: this.DTL_UP_DEPT_ID,
            SORT_ORD: this.DTL_SORT_ORD,
            MAX_SORT_ORD: this.DTL_MAX_SORT_ORD,
            ORDER_TYPE: type,
          }

          let headParam = {
            head: {
            }
          }

          let response  = await this.common_postCall(sUrl, postParam, headParam);

          if (!response.HEADER.ERROR_FLAG){
            await this.getTreeList();
            this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", false);
          }
        }else{
          this.showAlertCaution({ msg: '동일 레벨에서만 이동 가능 합니다.', iconClass: 'is-info' });
          this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", false);
        }
      }else{
        this.showAlertCaution({ msg:"조직 정보를 선택해 주세요." });
        this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", false);
      }
    },

    //CTI 조직코드 리스트 조회
    async getCtiqIdList() {
      let sURL ='/api/setting/ognz/getCtiqIdList';
      let postParam = {}
      let headParam = {head : {}}
      let response  = await this.common_postCall(sURL, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG){
        this.ctiqIdList = response.DATA;

        console.log('this.ctiqIdList : ', this.ctiqIdList);
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>