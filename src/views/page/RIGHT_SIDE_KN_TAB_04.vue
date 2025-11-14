<template>
  <div>
    <!-- search -->
    <template v-if="!NEW_DETAIL.active">
      <div class="spacing-wrap sp-4 py-4 px-5">
        <v-text-field
          class="pl-form is-search type-middle "
          placeholder="지식 콘텐츠 검색 "
          v-model="NEW_KEY_WORD"
          rounded
          clearable
          @keydown.enter="getNewContsList(false)"
          >
          <template v-slot:append>
            <span class="pl-icon20 in-search"></span>
          </template>
        </v-text-field>

      </div>
    </template>

    <template v-if="!NEW_DETAIL.active">
      <!-- list -->
      <div
        class="pl-alarm-list-wrap is-noicon hover-blue"
        style="height: calc(100vh - 262px);">
        <div
          v-for="item in NEW_CONTS"
          :key="item.KMS_CONTS_ID"
          class="pl-alarm-list pl-5"
          @click=" fnContsDetail(item)"
          >
          <div style="width: calc(100% - 50px);">
            <span class="pl-alarm-list-title" v-text=" item.KMS_CONTS_NM "></span>
            <span v-if="item.today" class="pl-badge is-new ml-1">Today</span>
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
        <template v-if="pagination.showMoreBtn">
          <div class="pl-bottom-fixed">
            <v-btn class="pl-btn is-round is-sub is-icon pl-4" @click="getNewContsList(true)">
              더보기
            </v-btn>
          </div>
        </template>
        <!-- no data -->
        <div v-if="NEW_DETAIL.length === 0" class="pl-list-nodata">
          <span>등록된 데이터가 없습니다.</span>
        </div>
      </div>
    </template>
    <!-- detail -->
    <template v-else>
      <div class="pl-right-kms-detail">
        <RIGHT_SIDE_KN_TAB_02_DETAIL
          @detailContsBack="detailBack"
          @refresh="[$emit('refresh')]"
          :DataProp="NEW_DETAIL"
          />
      </div>
    </template>
  </div>
</template>

<script>
import RIGHT_SIDE_KN_TAB_02_DETAIL from '@/views/page/RIGHT_SIDE_KN_TAB_02_DETAIL'
export default {
  name: 'RIGHT_SIDE_KN_TAB_04', //새로운 지식
  components: {
    RIGHT_SIDE_KN_TAB_02_DETAIL
  },
  props : {
    RefreshProp : {
      type : Boolean
    }
  },
  data() {
    return {
      // detail
      detailMode: false,

      NEW_KEY_WORD : "",
      NEW_CONTS : [],

      // list
      CONTS_LIST: [],
      // 지식 콘텐츠 목록
      pagination : {
        ROW_CNT : 500
        , PAGES_CNT : 0
        , showMoreBtn : false
      },
      // 지식 콘텐츠 상세
      NEW_DETAIL: {
        active: false,
        favorite: false,
        KMS_CONTS_ID : "",
        KMS_CONTS_NM : "",
        BOOK_MARK_YN : "",
        MDFCN_DT_F : "",
        CLSF_PATH : "",
        GUIDE_LIST : [],
        // 상세내용
        CONTENTS: {
          KMS_CONTS_CN_HMTL: '',
          KEYWD_NM_LIST: [
            '신청방법', '대상자 발표', '영구임대주택'
          ],
          REL_CONTENT_LIST: [
            { KMS_CONTS_NM: '1. 신청자격 및 순위' },
            { KMS_CONTS_NM: '7. 예비입주자의 지위' },
          ],
        }
      },
      firstLoad : false,
    }
  },
  created() {
    this.getNewContsList(false)
  },
  mounted() {
    // if(!this.firstLoad){
    //   this.$emit('loadComplete')
    //   this.firstLoad = true
    // }
  },
  methods: {
    async getNewContsList(next){
      if( next ){
        this.pagination.PAGES_CNT += 1;
      } else {
        this.pagination.PAGES_CNT = 1;
        this.NEW_CONTS = [];
      }

      let sUrl = '/api/km/right/rightContsList';

      let postParam = {
        KEY_WORD : this.NEW_KEY_WORD
        , ORDER_BY : "DATE"
        , NEW_YN : "Y"
        , SE_CD : 'KNOWLEDGE'
        , SRCH_CENTER_PARTIAL: "Y"
      };

      let headParam = {
        head : {
          ROW_CNT : this.pagination.ROW_CNT,
          PAGES_CNT : this.pagination.PAGES_CNT,
          PAGING : "Y",
        }
      };
      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG){
        if(response.DATA){
          let tmpList = response.DATA;
          this.NEW_CONTS = [...this.NEW_CONTS, ...tmpList];    // ...append
          if(this.NEW_CONTS.length > 0) {
            this.$emit('updateBadge', 'RIGHT_SIDE_KN_TAB_04',true)
          }else{
            this.$emit('updateBadge', 'RIGHT_SIDE_KN_TAB_04', false)
          }
        }

        if(response.HEADER.next !== null && response.HEADER.next !== undefined){
          if(response.HEADER.next === true){
            this.pagination.showMoreBtn = true //버튼 활성화
          }else{
            this.pagination.showMoreBtn = false  //버튼 비활성화
          }
        }

      }
    },
    fnContsDetail(item){
      this.NEW_DETAIL.KMS_CONTS_ID = item.KMS_CONTS_ID;
      this.NEW_DETAIL.KMS_CONTS_NM = item.KMS_CONTS_NM;
      this.NEW_DETAIL.BOOK_MARK_YN = item.BOOK_MARK_YN;
      this.NEW_DETAIL.MDFCN_DT_F = item.MDFCN_DT_F;
      this.NEW_DETAIL.CLSF_PATH = item.CLSF_PATH;
      this.NEW_DETAIL.MANAGER = item.MANAGER;
      this.NEW_DETAIL.KEYWD_NM_LIST = item.KEYWD_NM_LIST;
      this.NEW_DETAIL.REL_CONTENT_LIST = item.REL_CONTENT_LIST;
      this.NEW_DETAIL.active = true;
    },
    detailBack(){
      this.NEW_DETAIL.active = false
    }
  },
  computed: {
  },
  watch: {
    RefreshProp(){
      if(!this.mixin_isEmpty(this.RefreshProp)) {
        this.getNewContsList(false)
      }
    }
  },
};
</script>

<style lang="scss" scoped>

</style>