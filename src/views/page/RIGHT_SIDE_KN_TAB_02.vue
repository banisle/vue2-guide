<template>
  <div>
    <!-- search -->
    <template v-if="!CONTS_DETAIL.active">
      <div class="spacing-wrap sp-4 py-4 px-5">
        <v-text-field
          class="pl-form is-search type-middle "
          v-model="KEY_WORD"
          placeholder="지식 콘텐츠 검색 "
          rounded
          clearable
          :disabled=" KMS_SCRIPT_VIEW === 'tree' "
          @keydown.enter="getContsList"
          >
          <template v-slot:append>
            <span class="pl-icon20 in-search"></span>
          </template>
        </v-text-field>

        <div class="d-flex align-center ml-2">
          <v-btn-toggle v-model="viewSorting" class="pl-btn-group divider-l" mandatory>
            <compo-tooltip-btn
              v-for="item in btnGroupSort"
              :key="item.id"
              :TitleProp="item.title"
              ClassProp="pl-btn"
              :IconProp="`pl-icon20 ${item.icon}`"
              TooltipPositionProp="bottom"
              @btnClick="() => FnBtnPath(item.evt)"
            ></compo-tooltip-btn>
          </v-btn-toggle>
        </div>
      </div>
    </template>
    <div >
      <template v-if="!CONTS_DETAIL.active">
        <!-- tree -->
        <div v-show="KMS_SCRIPT_VIEW === 'tree'" class="is-border-top">
          <div class="pl-tree-body px-5" style="height: calc(100vh - 262px);">
            <v-treeview ref="treeDefault"
              :items="treeItems"
              :open-all="true"
              :open.sync="treeOpenSync"
              item-key="id"
              activatable
              return-object
              item-disabled="LOCKED == 'true'"
              :open-on-click=true
              color="secondary"
              class="pl-tree-view">
              <template v-slot:prepend="{ item, open }">
                <v-icon v-if="!mixin_isEmpty(item.KMS_CONTS_ID)">
                    {{ 'pl-icon20 tree-file' }}
                </v-icon>
                <v-icon v-else>
                    {{open ? 'pl-icon20 tree-folder-open' : 'pl-icon20 tree-folder'}}
                </v-icon>
              </template>
              <template v-slot:label="{item}">
                <span @dblclick="()=>{if(!mixin_isEmpty(item.KMS_CONTS_ID)) fnContsDetail(item)}">
                  {{ item.name.length > 30 ? item.name.slice(0,30)+'...  ' : item.name  }}
                  <v-icon v-if=" !mixin_isEmpty(item.KMS_CONTS_ID) " >
                    {{ 'pl-icon20' }}
<!--                    {{ 'pl-icon20 preview' }}-->
                </v-icon>
                </span>
              </template>
            </v-treeview>
          </div>
        </div>
        <!-- list -->
        <div v-show="KMS_SCRIPT_VIEW === 'list'"
          class="pl-alarm-list-wrap is-noicon hover-blue"
          style="height: calc(100vh - 262px);">
          <div
            v-for="item in CONTS_LIST"
            :key="item.KMS_CONTS_ID"
            class="pl-alarm-list pl-5"
            @click=" fnContsDetail(item)"
            >
            <div style="width: calc(100% - 50px);">
              <span class="pl-alarm-list-title" v-text=" item.KMS_CONTS_NM "></span>
              <span class="pl-alarm-list-desc">
                <div class="is-ellips">
                  {{ item.KMS_CONTS_DESC }}
                </div>
                <div class="d-flex align-center">
                  <v-icon class="pl-icon20 category-group"></v-icon> {{ item.CLSF_PATH }}
                  <v-icon class="pl-icon20 date-simple ml-1"></v-icon> {{ item.MDFCN_DT_F }}
                </div>
              </span>
            </div>
            <div>
              <span class="pl-alarm-list-link" ></span>
            </div>
          </div>
          <!-- 더보기 버튼 -->
          <template v-if="CONTS_PAGE.showMoreBtn">
            <div class="pl-bottom-fixed">
              <v-btn class="pl-btn is-round is-sub is-icon px-4" @click="getContsList(true)">
                더보기
              </v-btn>
            </div>
          </template>
          <!-- no data -->
          <div v-if="CONTS_LIST.length === 0" class="pl-list-nodata">
            <span>등록된 데이터가 없습니다.</span>
          </div>
        </div>
      </template>
      <!-- detail -->
      <template v-else>
        <div class="pl-right-kms-detail">
          <RIGHT_SIDE_KN_TAB_02_DETAIL
            @detailContsBack="detailBack"
            @refresh="$emit('refresh')"
            :DataProp="CONTS_DETAIL"
            PUBLIC_YN="N"
            />
        </div>
      </template>
    </div>

  </div>
</template>

<script>
import RIGHT_SIDE_KN_TAB_02_DETAIL from '@/views/page/RIGHT_SIDE_KN_TAB_02_DETAIL'

export default {
  name: 'RIGHT_SIDE_KN_TAB_02', //지식 콘텐츠
  components: {
    RIGHT_SIDE_KN_TAB_02_DETAIL
  },
  props : {
    DataProp : {
      type : Object,
      default : ()=>{
        return {}
      }
    },
    RefreshProp : {
      type : Boolean
    }
  },
  data() {
    return {
      KEY_WORD : "",
      treeOpenSync : [],

      viewSorting: 0, //초기 selected 값
      btnGroupSort: [
        { icon: 'pl-icon20 sort-tree', title: '트리보기', evt: () => { this.KMS_SCRIPT_VIEW = 'tree'; this.KEY_WORD = ""; this.getContsTreeList(); } },
        { icon: 'pl-icon20 sort-list', title: '목록으로 보기', evt: () =>{ this.KMS_SCRIPT_VIEW = 'list';  } },
      ],
      KMS_LIST: [],
      KMS_SCRIPT_VIEW : 'tree',
      // tree
      treeItems: [],

      // detail
      detailMode: false,

      // list
      CONTS_LIST: [],
      // 지식 콘텐츠 목록
      CONTS_PAGE : {
        ROW_CNT : 500
        , PAGES_CNT : 0
        , showMoreBtn : true
      },
      // 지식 콘텐츠 상세
      CONTS_DETAIL: {
        active: false,
        favorite: false,
        KMS_CONTS_ID : "",
        KMS_CONTS_NM : "",
        BOOK_MARK_YN : "",
        MDFCN_DT_F : "",
        CLSF_PATH : "",
        GUIDE_LIST : [],
      },

    }
  },
  async created() {
    await this.getContsList(false)
    this.getContsTreeList()

    // if(!this.mixin_isEmpty(this.DataProp)){
      // this.KMS_SCRIPT_VIEW = this.DataProp.KMS_SCRIPT_VIEW;
      // await this.fnContsDetail(this.CONTS_LIST.find(item => item.KMS_CONTS_ID === this.DataProp.KMS_CONTS_ID))
      await this.setDetail()
    // }

  },
  async mounted() {
    await this.setDetail()
  },
  methods: {
    async setDetail(){
      if(!this.mixin_isEmpty(this.DataProp)) {
        this.CONTS_DETAIL.active = false
        this.KMS_SCRIPT_VIEW = this.DataProp.KMS_SCRIPT_VIEW;
        this.viewSorting = this.btnGroupSort.findIndex(item => item.icon.includes(this.KMS_SCRIPT_VIEW));
        if(!this.mixin_isEmpty(this.DataProp.KMS_CONTS_ID)) {
          this.fnContsDetail(this.CONTS_LIST.find(item => item.KMS_CONTS_ID === this.DataProp.KMS_CONTS_ID))
        }
      }
    },
    // sort
    FnBtnPath(evt) {
      evt();
    },
    initDetail(){
      this.CONTS_DETAIL={
        active: false,
        favorite: false,
        KMS_CONTS_ID : "",
        KMS_CONTS_NM : "",
        BOOK_MARK_YN : "",
        MDFCN_DT_F : "",
        CLSF_PATH : "",
        GUIDE_LIST : [],
      }
    },
    fnContsDetail(item){
      this.initDetail()
      this.CONTS_DETAIL.KMS_CONTS_ID = item.KMS_CONTS_ID;
      this.CONTS_DETAIL.KMS_CONTS_NM = this.mixin_isEmpty(item.KMS_CONTS_NM) ? item.name : item.KMS_CONTS_NM
      this.CONTS_DETAIL.BOOK_MARK_YN = item.BOOK_MARK_YN;
      this.CONTS_DETAIL.MDFCN_DT_F = item.MDFCN_DT_F;
      this.CONTS_DETAIL.CLSF_PATH = item.CLSF_PATH;
      this.CONTS_DETAIL.MANAGER = item.MANAGER;
      this.CONTS_DETAIL.KEYWD_NM_LIST = item.KEYWD_NM_LIST;
      this.CONTS_DETAIL.REL_CONTENT_LIST = item.REL_CONTENT_LIST;
      this.CONTS_DETAIL.active = true;
    },
    detailBack(){
      this.CONTS_DETAIL.active = false
    },
    async getContsList(next){

      if( !next ){
        this.CONTS_PAGE.PAGES_CNT += 1;
      } else {
        this.CONTS_PAGE.PAGES_CNT = 1;
        this.CONTS_LIST = [];
      }

      let sUrl = '/api/km/right/rightContsList';

      let postParam = {
        KEY_WORD : this.KEY_WORD
        , ORDER_BY : this.ORDER_BY
        , SE_CD : 'KNOWLEDGE'
        , SRCH_CENTER_PARTIAL: "Y"
      };

      let headParam = {
        head : {
          ROW_CNT : this.CONTS_PAGE.ROW_CNT,
          PAGES_CNT : this.CONTS_PAGE.PAGES_CNT,
          PAGING : "Y",
        }
      };
      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG){
        if(response.DATA){
          let tmpList = response.DATA;
          this.CONTS_LIST = [...this.CONTS_LIST, ...tmpList];    // ...append
        }

        if(response.HEADER.next !== null && response.HEADER.next !== undefined){
          if(response.HEADER.next === true){
            this.CONTS_PAGE.showMoreBtn = true //버튼 활성화
          }else{
            this.CONTS_PAGE.showMoreBtn = false  //버튼 비활성화
          }
        }
      }
    },
    async getContsTreeList(){
      let sUrl = '/api/km/right/rightContsTreeList';

      let postParam = {
        SE_CD : 'KNOWLEDGE'
      };

      let headParam = {
        head : {}
      };
      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG){
        if(response.KM_CLSF_TREE){
          this.treeItems = response.KM_CLSF_TREE;
          this.openAll();
          // this.openTreeRoot()
        }
      }
    },
    //root Tree Open
    openTreeRoot() {
      if(!!this.treeItems && this.treeItems.length > 0 && this.treeItems[0]?.children?.length > 0) {
        this.treeOpenSync = [{'id':this.treeItems[0].id}]
      }
    },

    openAll(){
      if(this.treeItems.length <= 0) return;
      this.treeOpenSync = this.getAllIds(this.treeItems);
    },

    closeAll(){
      this.treeOpenSync = [];
    },
    
    getAllIds(items) {
      let ids = [];
      items.forEach(item => {
        ids.push({id:item.id});  // 현재 아이템의 id 추가
        if (item.children) {
          ids = ids.concat(this.getAllIds(item.children));  // 자식 항목들의 id 추가
        }
      });

      return ids;
    }
  },
  computed: {
  },
  watch: {
    RefreshProp(){
      if(!this.mixin_isEmpty(this.RefreshProp)){
        this.getContsList(false)
        this.getContsTreeList()
      }
    },
    DataProp : {
      handler(newval){
        this.setDetail()
      },
      deep:true
    }
  },
};
</script>

<style lang="scss" scoped>

</style>