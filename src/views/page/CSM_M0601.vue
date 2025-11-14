<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="fill-height">
        <div class="pl-cols fill-height">
          <!-- 트리 -->
          <div class="is-col-fix is-vrt" style="width: 600px">
            <div class="pl-search-header pl-card-body py-3">
              <div class="is-left">
                <strong>관심 지역</strong>
              </div>
              <div class="is-right spacing-wrap sp-4 align-center">
                <v-btn class="pl-btn is-sub is-sm" @click="expandAll('treeDefault')">전체 펼치기</v-btn>
                <v-btn class="pl-btn is-sub is-sm" @click="collapseAll('treeDefault')">전체 접기</v-btn>
                <compo-tooltip-btn
                    TitleProp="새로고침"
                    ClassProp="pl-tooltip-btn"
                    IconProp="pl-icon20 refresh"
                    TooltipPositionProp="bottom"
                    @btnClick="[getCuttZoneList(), initZoneData()]">
                </compo-tooltip-btn>
              </div>
            </div>
            <div class="">
              <div class="pl-card-body pl-tree-body flex-grow-1" style="height: calc(-262px + 100vh);">
                <v-treeview
                    ref="treeDefault"
                    activatable
                    return-object
                    :items="ORG_TREE_DATA"
                    :open-all="expanded"
                    :open-on-click=false
                    color="secondary"
                    class="pl-tree-view"
                    @update:active="srch_tree_act"
                >
                  <template v-slot:prepend="{ item, open }">
                    <v-icon v-if="item.children">
                      {{ open ? 'pl-icon20 tree-folder-open' : 'pl-icon20 tree-folder' }}
                    </v-icon>
                    <v-icon v-else>
                      {{ 'pl-icon20 tree-file' }}
                    </v-icon>
                  </template>
                </v-treeview>

              </div>
              <div class="pl-card is-border pl-btn-wrap">
                <!-- new folder 버튼 -->
                <compo-tooltip-btn
                    TitleProp="추가"
                    ClassProp="pl-tooltip-btn"
                    IconProp="pl-icon20 is-new-folder"
                    TooltipPositionProp="top"
                    @btnClick="addZone"
                    :DisabledProp="mixin_isEmpty(selectedNode)"
                ></compo-tooltip-btn>
                <!-- 삭제 버튼 -->
<!--                <compo-tooltip-btn-->
<!--                    TitleProp="삭제"-->
<!--                    ClassProp="pl-tooltip-btn"-->
<!--                    IconProp="pl-icon20 trash"-->
<!--                    TooltipPositionProp="top"-->
<!--                    :DisableProp="mixin_isEmpty(selectedNode)"-->
<!--                    @btnClick=""-->
<!--                ></compo-tooltip-btn>-->
                <div class="ml-auto">
                  <!-- list up 버튼 -->
<!--                  <compo-tooltip-btn-->
<!--                      TitleProp="순서 위로"-->
<!--                      ClassProp="pl-tooltip-btn"-->
<!--                      IconProp="pl-icon20 is-list-up"-->
<!--                      TooltipPositionProp="top"-->
<!--                      @btnClick=""-->
<!--                  ></compo-tooltip-btn>-->
                  <!-- list down 버튼 -->
<!--                  <compo-tooltip-btn-->
<!--                      TitleProp="순서 아래로"-->
<!--                      ClassProp="pl-tooltip-btn"-->
<!--                      IconProp="pl-icon20 is-list-down"-->
<!--                      TooltipPositionProp="top"-->
<!--                      @btnClick=""-->
<!--                  ></compo-tooltip-btn>-->
                </div>
              </div>
            </div>
          </div>
          <!-- 조직 정보 입력 -->
          <v-form ref="form">
            <div class="is-vrt fill-height">
              <div class="pl-card">
                <h2 class="pl-subtit">{{ '관심지역 ' + `${mixin_isEmpty(saveParam.zoneId) ? ' 등록 ' : ' 상세 정보'}` }}</h2>
                <div class="pl-subdesc">
                  <p>좌측 트리에서 등록 하고자 하는 관심지역을 선택 하시고 하위 지역명을 입력 후 [저장] 버튼을 클릭 하십시오.</p>
                </div>
              </div>
              <div class="pl-card is-noborder pt-0 flex-grow-1">
                <v-form ref="form">
                  <div class="pl-card-form-body" >
                    <div class="pl-form-inline-wrap vertical label-80">
                      <div class="pl-form-inline">
                    <span class="pl-label">
                      상위 지역명
                    </span>
                        <div class="pl-desc">
                          <v-text-field
                              v-model="saveParam.upZoneNm"
                              class="pl-form type-middle"
                              disabled
                          />
                        </div>
                      </div>
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          관심지역 ID
                        </span>
                        <div class="pl-desc">
                          {{ saveParam.zoneId }}
                        </div>
                      </div>
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          관심지역 명
                        </span>
                        <div class="pl-desc">
                          <v-text-field
                              v-model="saveParam.zoneNm"
                              class="pl-form type-middle"
                              placeholder="관심지역 명 입력"
                              :rules="validateRules.NAME"
                              :disabled="!editable"
                          />
                        </div>
                      </div>
                      <div class="pl-form-inline">
                    <span class="pl-label">
                      사용 여부
                    </span>
                        <div class="pl-desc">
                          <v-radio-group
                              v-model="saveParam.useYn"
                              row
                              class="pl-radio-group"
                          >
                            <v-radio
                                v-for="(rad01, index) in radioGroup"
                                :key="radioGroup[index].text"
                                :label="rad01.text"
                                :value="rad01.value"
                                class="pl-radio"
                                :disabled="!editable"
                            >
                            </v-radio>
                          </v-radio-group>
                        </div>
                      </div>
                      <div class="pl-form-inline">
                    <span class="pl-label">
                      센터 정보
                    </span>
                        <div class="pl-desc">
                          <v-select
                              class="pl-form type-middle"
                              placeholder="선택"
                              :items="cntrCdList"
                              item-value="DEPT_CD"
                              v-model="saveParam.cntrCd"
                              @change="()=>{
                                let custcoId = null;
                                custcoId = cntrCdList.find(item => item.DEPT_CD === saveParam.cntrCd).CUSTCO_ID
                                setCmmCd(custcoId)
                              }"
                              :disabled="computedUserCenterDeptId > 0"
                          />
                          <v-select
                              class="pl-form type-middle"
                              placeholder="선택"
                              :items="mhcCdList"
                              item-text="text"
                              item-value="value"
                              v-model="saveParam.deptCd"
                              :disabled="!editable"
                          />
                        </div>
                      </div>
                      <div class="pl-form-inline">
                    <span class="pl-label">
                      설명
                    </span>
                        <div class="pl-desc">
                          <v-textarea
                              v-model="saveParam.expln"
                              class="pl-form is-noresize"
                              :spellcheck="false"
                              placeholder="기타 설명 입력 "
                              :disabled="!editable"
                          />
                        </div>
                      </div>
                        <div class="pl-form-inline">
                          <span class="pl-label">
                            정렬 순서
                          </span>
                          <div class="pl-desc">
                            <v-text-field
                                v-model="saveParam.sortOrd"
                                class="pl-form type-middle is-sm flex-grow-0"
                                oninput="javascript: this.value=this.value.replace(/[^-\.0-9]/g,'');"
                                :disabled="!editable"
                            />
                        </div>
                      </div>
                    </div>
                  </div>
                </v-form>
              </div>
              <div class="pl-card is-border text-right">
                <v-btn
                    class="pl-btn"
                    @click="beforeSave"
                    :disabled="!editable"
                >{{ mixin_isEmpty(saveParam.zoneId) ? '저장' : '수정' }}
                </v-btn>
              </div>
            </div>
          </v-form>
        </div>
      </div>

    </div>
  </div>
</template>

<script>

export default {
  name: "MENU_CSM_M0601", //관심지역 관리
  components: {},
  data() {
    return {
      // tree
      expanded: false,
      CUTT_ZONE_ORG_LIST: [], // 조회해온 원본 상담지역 목록
      ORG_TREE_DATA: [], // 트리구조로 가공한 상담지역 목록

      common_code: [],
      selectedNode: {}, // 선택한 노드 객체
      cntrCdList: [],
      mhcCdList: [],

      custcoId: this.$store.getters['userStore/GE_USER_ROLE'].company.CD,
      saveParam: {
        cntrCd: '',
        deptCd: '',
        sortOrd: '',
        lvl: '',
        upZoneNm: '',
        upZoneId: '',
        useYn: '',
        zoneFullPath: '',
        zoneId: '',
        zoneNm: '',
        expln: '',
      },

      editable: false,

      treeItems: [
        {
          id: 1,
          name: '관심지역',
          children: [
            {id: 2, name: '강원'},
            {id: 3, name: '경기'},
            {id: 4, name: '경북'},
            {id: 5, name: '광주'},
            {id: 6, name: '대구'},
            {id: 7, name: '대전'},
            {id: 8, name: '부산'},
          ],
        },
      ],

      validateRules: {
        NAME: [
          v => !!v || '관심지역명은 필수 입력 항목 입니다.',
        ],
        USE_YN: [
          v => !!v || '사용여부는 필수 입력 항목 입니다.',
        ],

      },

      // detail
      modelUpperArea: '동해시',
      radioGroupSelected: "미사용",
      radioGroup: [
        {text: "사용", value: true},
        {text: "미사용", value: false},
      ],

    }
  },
  async created() {
    let codeName = ['MHC']
    await this.getCuttZoneList()
    // this.cntrCdList = await this.mixin_getCenterCombo();
    let common_ognz_list = await this.mixin_ognz_list();
    this.cntrCdList = this.mixin_ognz_list_center(common_ognz_list, 'ALL', '' )

    this.common_code = await this.mixin_common_code_get_all_global(codeName);
    this.setCmmCd(this.computedUserCenter);
  },
  mounted() {
  },
  computed: {},

  watch: {

  },
  methods: {
    async setCmmCd(custcoId){
      console.log("custcoId > ", custcoId)
      if (custcoId < 0) {
        this.mhcCdList = await this.mixin_common_code_get(this.common_code, 'MHC', '전체')
      } else {
        this.mhcCdList = await this.mixin_common_code_get_global(this.common_code, 'MHC', custcoId, '전체')
      }
    },
    initZoneData() {

      this.selectedNode = {}
      this.saveParam = {
        cntrCd: '',
        deptCd: '',
        sortOrd: '',
        lvl: '',
        upZoneNm: '',
        upZoneId: '',
        useYn: '',
        zoneFullPath: '',
        zoneId: '',
        zoneNm: '',
        expln: '',
      }

      this.resetValidation();

    },
    expandAll(id) {
      this.expanded = true;
      this.$refs[id].updateAll(true);
    },
    collapseAll(id) {
      this.expanded = false;
      this.$refs[id].updateAll(false);
    },

    async getCuttZoneList() {
      this.CUTT_ZONE_ORG_LIST = [];
      this.ORG_TREE_DATA = [];

      let sUrl = '/api/biz/common/select/cuttZoneList';
      let postParam = {}

      if (this.custcoId != '-1') {
        postParam.SCH_CUSTCO_ID = this.custcoId;
      }

      let headParam = {
        head: {
          ns: 'lhcs.phone.cutt.dao.PhoneCuttMapper'
          , sn: 'cuttZoneList'
        }
      }

      let response = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {

        this.CUTT_ZONE_ORG_LIST = response.DATA;

        this.ORG_TREE_DATA = await this.mixin_makeOrgTreeData(response.DATA, 'ZONE');
      }
    },
    srch_tree_act(node) {
      this.selectedNode = node[0];
      console.log("😎 >>>> ", this.selectedNode)
      if (this.selectedNode === null) {
        this.selectedNode = {};
      } else {
        this.setSaveParam(this.selectedNode, 'U')
      }
    },
    setSaveParam(item, type) {
      if (!this.mixin_isEmpty(item)) {
        this.editable = true
        if (type === 'U') {
          this.saveParam = {
            cntrCd: item.CENTERCD,
            deptCd: item.MYHOME_CENTER_CD,
            sortOrd: item.SORT_NO,
            lvl: item.DEPTH,
            upZoneNm: item.UP_ZONENAME,
            upZoneId: item.UP_ZONE_ID,
            useYn: item.USEFG == '1' ? true : false,
            zoneFullPath: item.FULL_PATH,
            zoneId: item.ZONE_ID,
            zoneNm: item.ZONE_NM,
            expln: item.ZONEDESC
          }
        } else {
            console.log("1> ",this.custcoId)
            console.log("1> ",this.computedUserCenterDeptId)
            console.log("2> ",this.cntrCdList)
            console.log(this.cntrCdList.find(item => item.DEPT_ID === this.computedUserCenterDeptId))

          this.saveParam = {
            cntrCd: this.cntrCdList.find(item => item.DEPT_ID === this.computedUserCenterDeptId).DEPT_CD,
            deptCd: '',
            sortOrd: '',
            lvl: Number(item.DEPTH) + 1,
            upZoneNm: item.ZONE_NM,
            upZoneId: item.ZONE_ID,
            useYn: false,
            zoneFullPath: item.FULL_PATH,
            zoneId: '',
            zoneNm: '',
            expln: ''
          }
        }
      } else {
        this.editable = false;
        this.initZoneData();
      }
    },
    addZone() {
      if (this.mixin_isEmpty(this.selectedNode)) {
        this.showToastCaution({msg: '상위 관심지역을 선택해주세요.'})
      } else if(this.selectedNode.LVL ==='4'){
        this.showToastCaution({msg : '지구 하위에는 지역을 추가할 수 없습니다.'})
      }else {
        this.showConfirmInfo({
          msg: `[ ${this.selectedNode.ZONE_NM} ]  하위 관심지역을 추가 하시겠습니까? `, callYes: () => {
            this.setSaveParam(this.selectedNode, 'R')
            this.closeAlert()
          }, callNo: this.closeAlert
        })
      }
    },
    async beforeSave() {
      // let dupNm = false;
      // let equalDepth = this.CUTT_ZONE_ORG_LIST.filter((item) => item.UP_ZONE_ID === this.saveParam.upZoneId)
      // equalDepth.map((item) => {
      //   if (this.saveParam.zoneNm === item.ZONE_NM && item.USEFG === '1') {
      //     dupNm = true;
      //   }
      // })

      if (!this.validate()) {
        this.showToastCaution({msg: '필수 항목을 입력해주세요.'})
      } else if (this.selectedNode.LVL === this.saveParam.lvl) {
        this.showToastCaution({msg: '상위 지역과 같은 레벨에 등록할 수 없습니다.'})
      } else if ( this.mixin_isEmpty(this.saveParam.zoneId) && await this.dupNmCheck() ) {
        this.showToastCaution({msg: '동일 레벨에 중복되는 지역명이 존재합니다.'})
      } else {
        this.showConfirmInfo({
          msg: this.mixin_isEmpty(this.saveParam.zoneId)?`[ ${this.saveParam.zoneNm} ]을 관심지역으로 등록 하시겠습니까?`: '수정 하시겠습니까?',
          callYes: this.save,
          callNo: this.closeAlert
        })
      }
    },
    async dupNmCheck(){
      let sUrl = '/api/biz/common/select/dupCheckZone'

      let postParam = {
        UP_ZONE_ID : this.saveParam.upZoneId,
        ZONE_NM : this.saveParam.zoneNm
      }

      let headParam = {
        head:{
          ns : 'lhcs.phone.cuttMng.dao.PhoneCuttZoneMngMapper',
          sn : 'dupCheckZone'
        }
      }
      const response = await this.common_postCall(sUrl,postParam,headParam)
      if( !response.HEADER.ERROR_FLAG ){
        console.log(response.DATA[0].DUP_CHK === 'Y')
        if(response.DATA[0].DUP_CHK === 'Y'){
          return true;
        }else{
          return false;
        }
      }
    },
    async save() {
      let action = this.mixin_isEmpty(this.saveParam.zoneId) ? 'insert' : 'update';

      let sUrl = action === 'insert' ? 'phone-api/cuttMng/interestArea/insertZone' : `/api/biz/common/${action}/${action}Zone`
      let postParam = {
        ZONEID: action === 'insert' ? '' : this.saveParam.zoneId
        , UP_ZONE_ID: this.saveParam.upZoneId
        , ZONE_NM: this.saveParam.zoneNm
        , LVL: this.saveParam.lvl
        , USE_YN: this.saveParam.useYn ? '1' : '0'
        , ZONE_DESC: this.saveParam.expln
        , CENTER_CD: this.saveParam.cntrCd
        , CMM_DEPT_CD: this.saveParam.deptCd
        , SORT_ORD: this.saveParam.sortOrd
        , FULL_PATH: this.makeFullPath(this.saveParam.zoneFullPath + '>' + this.saveParam.zoneNm)
      }
      let headParam = {
        head: {
          ns: 'lhcs.phone.cuttMng.dao.PhoneCuttZoneMngMapper',
          sn: `${action}Zone`
        }
      }
      // if (action == 'insert') this.$set(headParam.head, 'seq_key', 'ZONEID')

      console.log("상위 ", this.selectedNode.LVL, this.selectedNode.ZONE_ID, this.selectedNode.ZONE_NM)
      console.log("sUrl", sUrl)
      console.log("postParam ", postParam)
      console.log('headParam', headParam)
      const response = await this.common_postCall(sUrl, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG) {
        this.showToastInfo({msg: '정상 처리 되었습니다.'})
            this.closeAlert()
            this.initZoneData();
            this.getCuttZoneList();
      } else {
        this.showToastCaution({msg: '처리 중 오류가 발생 했습니다.', callAfter: this.closeAlert})
      }

    },
    async chgOrd(move){
      let equalDepth = this.CUTT_ZONE_ORG_LIST.filter((item) => item.UP_ZONE_ID === this.saveParam.upZoneId)

      equalDepth.map((item) => {
        if ( this.selectedNode.SORT_NO === item.SORT_NO ) {

        }
      })

    },
    makeFullPath(str) {
      let path = str.split('>');
      path.shift();
      return path.join(' / ');
    },
    // beforeDel(){
    //   if( this.mixin_isEmpty(this.selectedNode) ){
    //     this.showToastCaution({msg : '삭제할 지역을 선택해주세요.'})
    //   }else{
    //     this.showConfirmCaution({msg : '해당 지역을 삭제하면 하위의 모든 지역도 삭제됩니다.\n 삭제 하시겠습니까?', callYes: this.delete, callNo : this.closeAlert})
    //   }
    // },
    // async delete(){
    //
    //
    //   let sUrl = `/api/biz/common/delete/deleteZone`
    //   let postParam = {
    //     ZONEID: this.selectedNode.ZONE_ID
    //   }
    //   let headParam = {
    //     head:{
    //       ns : 'lhcs.phone.cuttMng.dao.PhoneCuttZoneMngMapper',
    //       sn : 'deleteZone'
    //     }
    //   }
    //
    //   const response = await this.common_postCall(sUrl, postParam, headParam);
    //   if( !response.HEADER.ERROR_FLAG ){
    //     this.showToastInfo({msg : '정상 처리 되었습니다', callAfter:()=>{
    //         this.closeAlert()
    //         this.initZoneData();
    //         this.getCuttZoneList();
    //       }})
    //   }else{
    //     this.showToastCaution({msg: '처리 중 오류가 발생 했습니다.', callAfter: this.closeAlert})
    //   }
    // },
    validate() {
      return this.$refs.form.validate();
    },
    resetValidation() {
      this.$refs.form.reset();
    },
  },
};
</script>

<style lang="scss" scoped>

</style>