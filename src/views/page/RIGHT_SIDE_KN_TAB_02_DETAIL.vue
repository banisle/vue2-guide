<template>
  <!-- 스타일, 클래스 추가 -->
  <div class="d-flex flex-column" style="height: calc(100vh - 201px);">
    <!-- header -->
    <div class="px-6 py-2 d-flex align-center is-border-bottom" v-if=" HEAD_VIEW === 'Y' ">
      <!-- 뒤로 버튼 -->
      <compo-tooltip-btn
        TitleProp="뒤로 가기"
        ClassProp="pl-tooltip-btn"
        IconProp="pl-icon20 back-arrow"
        TooltipPositionProp="bottom"
        @btnClick="moveBack"
      ></compo-tooltip-btn>
      <div class="ml-3">
        <strong class="d-flex align-center" style="font-size: 14px;">
          {{ CONTENT_INFO.KMS_CONTS_NM }}
          <div
            @click="fnChgFavorite"
            style="position: relative; cursor: pointer;">
            <vLottiePlayer
              name="lottieFavorite"
              :autoplay=false
              width="60px"
              height="60px"
              style="position: absolute; top: -29px; left: -13px;"
              :animationData="require('@/assets/lottie/animation_favorite.json')"
              @animControl="anim => (lottieFavorite = anim)"
            />
          </div>
        </strong>
        <div class="mt-1">
          <span class="is-txt-sub">{{ CONTENT_INFO.CLSF_PATH }}</span>
        </div>
        <div class="d-flex align-center">
          <v-icon class="pl-icon20 date-simple-fill"></v-icon>
          <span class="is-txt-sub">마지막 수정 : {{ CONTENT_INFO.MDFCN_DT_F }}</span>
          <v-icon class="pl-icon20 person-fill ml-1"></v-icon>
          <span class="is-txt-sub">{{ CONTENT_INFO.RGTR_NM }}</span>
        </div>
      </div>
    </div>
    <!-- contents -->
    <RIGHT_SIDE_KN_DETAIL_CONTENTS
      :KMS_CONTS_ID="CONTENT_INFO.KMS_CONTS_ID"
      :PUBLIC_YN="PUBLIC_YN"
      @refresh="$emit('refresh')"
      @relContsClick="fnChgConts"
      @afterChangeContent="afterChangeContent"
    />
  </div>
</template>

<script>
import RIGHT_SIDE_KN_DETAIL_CONTENTS from '@/views/page/RIGHT_SIDE_KN_DETAIL_CONTENTS'
import right_kms_detail_guide from "@/views/page/right_kms_detail_guide.vue";

export default {
  name: 'RIGHT_SIDE_KN_TAB_02_DETAIL', //지식정보 콘텐츠 상세
  components: {
    right_kms_detail_guide,
    RIGHT_SIDE_KN_DETAIL_CONTENTS
  },
  props: {
    DataProp: {
      type: Object
    },
    HEAD_VIEW :{
      type: String,
      default: "Y",
    },
    PUBLIC_YN :{
      type : String,
      default : "Y",
    },
  },
  data() {
    return {
      lottieFavorite: null,
      favorite: true,
      CONTENT_MODEL : {},
      CONTENT_INFO : {},
    }
  },
  created() {
    this.CONTENT_MODEL = this.DataProp
    this.CONTENT_INFO = this.CONTENT_MODEL

    // this.fnGetContsDetail();
  },
  mounted() {
  },
  methods: {
    fnChgConts(contsId, prevContsId){
      this.CONTENT_INFO.KMS_CONTS_ID = contsId
      this.REL_CONTENT_LIST.push(prevContsId)
    },
    afterChangeContent(item) {
      this.initKmsContent(item)
    },
    moveBack(){
      if(this.REL_CONTENT_LIST && this.REL_CONTENT_LIST.length > 0) {
        const contsId = this.REL_CONTENT_LIST[this.REL_CONTENT_LIST.length-1]
        this.CONTENT_INFO.KMS_CONTS_ID = contsId
        this.REL_CONTENT_LIST.pop()
      } else {
        this.$emit("detailContsBack");
        // this.$emit("detailNewBack");
        // this.$emit("detailMyBack");
        this.CONTENT_MODEL.active = false;
      }

    },

    initKmsContent(item) {
      this.CONTENT_INFO = item
      if(this.CONTENT_INFO.BOOK_MARK_YN == undefined) {
        this.CONTENT_INFO.BOOK_MARK_YN = "N";
      }

      if( "Y" === this.CONTENT_INFO.BOOK_MARK_YN ) {
        this.CONTENT_INFO.favorite = true;
      } else {
        this.CONTENT_INFO.favorite = false;
      }
      this.aniFavorite(this.CONTENT_INFO.favorite);
    },
    fnChgFavorite() {
      this.CONTENT_INFO.favorite = !this.CONTENT_INFO.favorite;

      if( this.CONTENT_INFO.favorite ) {
        this.chgBookMark('reg');
      } else {
        this.chgBookMark('del');
      }
      this.aniFavorite(this.CONTENT_INFO.favorite);
    },


    // favorite animation
    aniFavorite(flag){
      const PLAYBACK_RANGE = [30, 119];
      const lottieFavorite = this.lottieFavorite;

      if (flag) {
          lottieFavorite.playSegments(PLAYBACK_RANGE, true);
      } else {
        try{
          if(lottieFavorite) lottieFavorite.goToAndStop(0, true);
        }catch(e){console.error(e);}
      }
    },

    async chgBookMark( gubun ){
      let sUrl = "";
      if( "del" === gubun ) {
        sUrl = "/api/km/right/rightDelUserConts";
      } else {
        sUrl = "/api/km/right/rightRegUserConts";
      }
      let postParam = {
        KMS_CONTS_ID : this.CONTENT_INFO.KMS_CONTS_ID
      };

      let headParam = {head : {}};
      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG){
        // console.log(response.DATA);
        if( "del" === gubun ) {
          this.showToastInfo({msg :'즐겨찾기가 삭제되었습니다'});
        } else {
          this.showToastInfo({msg: '즐겨찾기가 추가되었습니다'});
        }
      }
      this.$emit("updBadgeCnt");  // 상단 Badge Count 재조회
      this.$emit("refresh");  // 상단 Badge Count 재조회

    },
  },
  computed: {
  },
  watch: {
    DataProp(){
      this.CONTENT_MODEL = this.DataProp
      this.CONTENT_INFO = this.CONTENT_MODEL
    }
  },
};
</script>

<style lang="scss" scoped>

</style>