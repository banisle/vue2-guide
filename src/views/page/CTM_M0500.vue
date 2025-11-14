<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top></compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-cols fill-height">
        <!-- grid -->
        <div class="pl-card-body is-col-fix is-vrt" style="width: 40%;">
          <div class="pl-grid-top-left">
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ GRID.ITEMS.length }})</em> 건</span>
            <compo-tooltip-btn
                TitleProp="새로고침"
                ClassProp="pl-tooltip-btn ml-1"
                IconProp="pl-icon20 refresh"
                TooltipPositionProp="bottom"
                @btnClick="getBbsList"
            ></compo-tooltip-btn>
          </div>
          <v-data-table
              class="pl-grid has-control is-mt-s is-hover"
              v-model="selectedBbsItem"
              :headers="GRID.HEADERS"
              :items="GRID.ITEMS"
              :item-class="(item) => {return item.BBS_ID === this.detailParams.BBS_ID? 'active':''}"
              fixed-header
              item-key="ROW_NUMBER"
              height="calc(100vh - 210px)"
              @click:row="rowClick"
              hide-default-footer
              :items-per-page="-1"
              no-data-text="등록된 데이터가 없습니다."
          >
          </v-data-table>
        </div>
        <!-- detail -->
        <div class="d-flex flex-column">
          <BBS_LIST :DataProp="detailParams"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CompoTree from "@/components/CompoTree.vue";
import CompoDialog from "@/components/CompoDialog.vue";
import BBS_LIST from "@/views/page/BBS_LIST.vue";

export default {
  name:"MENU_CTM_M0500", //게시판 관리
  components: {
    BBS_LIST,
    CompoTree,
    CompoDialog
  },
  data() {
    return {
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

      selectedRowObj : {},
      selectedBbsItem : [],
      detailParams : {},
      GRID: {
        HEADERS: [
          {text: '번호', value: 'ROW_NUMBER', align: 'center', width: '25px', sortable: false},
          {text: '게시판유형', value: 'BBS_TYPE_NM', align: '', width: '50px', sortable: false},
          {text: '사용부서', value: 'USER_DEPT.DEPT_WHOL_PATH', align: '', width: '120px', sortable: false},
          {text: '게시판 명', value: 'BBS_NM', align: '', width: '100px', sortable: false},
          {text: '게시물수', value: 'PST_CNT', align: 'center', width: '50px', sortable: false},
        ],
        ITEMS: [],
        FIRST_ITEM:{},
      }

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
  },
  async mounted(){
    await this.getBbsList();
  },
  methods: {
    // 게시판 목록 조회
    async getBbsList() {
      this.GRID.ITEMS = [];

      let postParam = {SRCH_TYPE_CD : this.selectedBbsTypeCombo, IS_OPERATE:'Y' }
      let headParam = { head: { ns: "lhcs.system.bbs.dao.BbsMapper"} };
      const response = await this.common_postCall('/api/biz/common/select/selectBbsList', postParam, headParam);
      if( !response.HEADER.ERROR_FLAG ){
        let responseData = response.DATA;
        responseData.map((item,index)=>{
          responseData[index]["USER_DEPT"] = {DEPT_ID : item.DEPT_ID, DEPT_NM : item.DEPT_NM,CUSTCO_ID:item.CUSTCO_ID,  BBS_USE_SE_CD: item.BBS_USE_SE_CD, DEPT_WHOL_PATH: item.DEPT_WHOL_PATH };
          responseData[index]["UPLOAD_LIMIT_SIZE"] = this.mixin_isEmpty(item.ATCH_FILE_SZ) ? null :Number(item.ATCH_FILE_SZ)/1024/1024;
          responseData[index]["BBS_AUTHRT"] = { read : item.READ_AUTHRT.split(","), write : item.WRITE_AUTHRT.split(","), readtxt: item.READ_AUTHRT, writetxt: item.WRITE_AUTHRT };   // 권한 설정;
          responseData[index]["BBS_USE_YN"] = item.USE_YN === 'Y' ? {code:'사용', vl:'Y'} : {code:'미사용', vl:'N'};
        });
        this.GRID.ITEMS = [...this.GRID.ITEMS, ...responseData];
        this.rowClick(this.GRID.ITEMS[0]);  /*첫번재 클릭.*/
      }else{
        this.showToastCaution({ msg : response.HEADER.ERROR_MSG })
      }
    },

    rowClick(item){
      this.selectedRowObj = item;
      this.selectedRowObj.IS_SYSTEM = 'Y';
      this.selectedRowObj.IS_OPERATE = 'Y';
      this.selectedRowObj.BBS_HEADER_TITLE = this.selectedRowObj.BBS_NM + ' <span class="is-txt-sub" style="font-size: 12px; gap: 4px">(유형:'+ this.selectedRowObj.BBS_TYPE_NM +' , 부서:'+ this.selectedRowObj.USER_DEPT.DEPT_WHOL_PATH +')</span>';
      this.detailParams = {}
      this.detailParams = JSON.parse(JSON.stringify(this.selectedRowObj))/* Deep Copy */;
    },
  },
  beforeDestroy() {
  }
}
</script>

<style lang="scss" scoped>

</style>