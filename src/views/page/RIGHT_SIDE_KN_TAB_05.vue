<template>
  <div>
    <template v-if="!MY_DETAIL.active">
      <!-- list top -->
      <div class="d-flex py-4 px-5">
        <span class="pl-label">나의 즐겨찾기 (<span class="is-txt-blue">{{ MY_CONTS.length }}</span>)건</span>
      </div>
      <!-- list -->
      <div
        class="pl-alarm-list-wrap is-noicon hover-blue"
        style="height: calc(100vh - 250px);">
        <div
          v-for="item in MY_CONTS"
          :key="item.KMS_CONTS_ID"
          class="pl-alarm-list pl-5"
          @click=" fnContsDetail(item)"
          >
          <div style="width: calc(100% - 50px);">
            <span class="pl-alarm-list-title" v-text=" item.KMS_CONTS_NM "></span>
            <div
              class="d-inline-block"
              style="position: relative; cursor: pointer; z-index: 1000;">
              <!-- @temp :autoplay=true -->
              <vLottiePlayer
                name="lottieFavorite"
                :autoplay=true
                width="60px"
                height="60px"
                style="position: absolute; top: -33px; left: -13px;"
                :animationData="require('@/assets/lottie/animation_favorite.json')"
                @animControl="anim => (lottieFavorite = anim)"
              />
            </div>
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
              더보기
            <v-btn class="pl-btn is-round is-sub is-icon pl-4" @click="getMyContsList(true)">
            </v-btn>
          </div>
        </template>
        <!-- no data -->
        <div v-if="MY_CONTS.length === 0" class="pl-list-nodata">
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
          :DataProp="MY_DETAIL"
          />
      </div>
    </template>
  </div>
</template>

<script>
import RIGHT_SIDE_KN_TAB_02_DETAIL from '@/views/page/RIGHT_SIDE_KN_TAB_02_DETAIL'
export default {
  name: 'RIGHT_SIDE_KN_TAB_05', //즐겨찾기
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

      lottieFavorite: null,
      favorite: true,

      // detail
      detailMode: false,

      // list
      MY_CONTS: [],
      // 지식 콘텐츠 목록
      pagination : {
        ROW_CNT : 500
        , PAGES_CNT : 0
        , showMoreBtn : false
      },
      // 지식 콘텐츠 상세
      MY_DETAIL: {
        active: false,
        favorite: true,
        KMS_CONTS_ID : "",
        KMS_CONTS_NM : "",
        BOOK_MARK_YN : "",
        MDFCN_DT_F : "",
        CLSF_PATH : "",
        },
      firstLoad : false,

    }
  },
  created() {
    this.getMyContsList(false)
  },
  mounted() {
    // if(!this.firstLoad){
    //   this.$emit('loadComplete')
    //   this.firstLoad = true
    // }
  },
  methods: {
    async getMyContsList(next){
      if( next){
        this.pagination.PAGES_CNT += 1;
      } else {
        this.pagination.PAGES_CNT = 1;
        this.MY_CONTS = [];
      }

      let sUrl = '/api/km/right/rightContsList';

      let postParam = {
        ORDER_BY : "DATE"
        , BOOK_MARK_YN : "Y"
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
          this.MY_CONTS = [...this.MY_CONTS, ...tmpList];    // ...append
          if(this.MY_CONTS.length > 0) {
            this.$emit('updateBadge', 'RIGHT_SIDE_KN_TAB_05',true)
          }else{
            this.$emit('updateBadge', 'RIGHT_SIDE_KN_TAB_05', false)
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
      this.MY_DETAIL.KMS_CONTS_ID = item.KMS_CONTS_ID;
      this.MY_DETAIL.KMS_CONTS_NM = item.KMS_CONTS_NM;
      this.MY_DETAIL.BOOK_MARK_YN = item.BOOK_MARK_YN;
      this.MY_DETAIL.MDFCN_DT_F = item.MDFCN_DT_F;
      this.MY_DETAIL.CLSF_PATH = item.CLSF_PATH;
      this.MY_DETAIL.MANAGER = item.MANAGER;
      this.MY_DETAIL.KEYWD_NM_LIST = item.KEYWD_NM_LIST;
      this.MY_DETAIL.REL_CONTENT_LIST = item.REL_CONTENT_LIST;
      this.MY_DETAIL.active = true;
    },
    detailBack(){
      this.MY_DETAIL.active = false
    },


  },
  computed: {
  },
  watch: {
    RefreshProp(){
      if(!this.mixin_isEmpty(this.RefreshProp)) {
        this.getMyContsList(false)
      }
    }
  },
};
</script>

<style lang="scss" scoped>

</style>