<template>
  <div
    class="px-6 py-2 flex-column pl-scroll-body list-fade-effect talkScrollRef"
    style="height: 100%;">
    <div
      class="pl-realtime-talk-wrap pl-hover-wrap"
      v-for="item,index in TALK_DATA"
      ref="talkContainer"
      :key="item.index"
      :class="item.type === 'manager' ? 'is-rcv' : 'is-snd'"
      >
      <img
        style="width: 35px; height: 35px; border-radius: 50px; vertical-align: middle; position: relative"
        :src="item.img"
        :alt="item.name"
        @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}" />
      <div class="ml-2 pl-realtime-talk-wrap--text" >
        <div class="d-flex" style="height: 22px">
          <strong>{{ item.name }}</strong>
          <span class="is-txt-sub ml-1">{{ item.date }}</span>
          <!-- 버튼 -->
          <div v-if="item.type === 'cs'"
            class="ml-auto spacing-wrap sp-4">
            <compo-tooltip-btn
              TitleProp="복사하기"
              ClassProp="pl-tooltip-btn pl-hover-func"
              IconProp="pl-icon20 copyPaste"
              TooltipPositionProp="bottom"
              :MinWidthProp=22
              :HeightProp=22
              @btnClick="$copyText(item.transcript).then(() => { showToastInfo({msg:'클립보드에 복사되었어요'})})"
            ></compo-tooltip-btn>
            <compo-tooltip-btn
              TitleProp="대화 태깅"
              :ClassProp="`pl-tooltip-btn pl-hover-func ${ item.isBmk ? 'is-active' : ''}`"
              :IconProp="`pl-icon20 ${ !item.isBmk ? 'bookmark' : 'bookmark-fill'}`"
              TooltipPositionProp="bottom"
              :MinWidthProp=22
              :HeightProp=22
              @btnClick="settingBookmark(item, index)"
            ></compo-tooltip-btn>
          </div>
        </div>
        <div style="white-space: pre-line">
          {{ item.transcript }}
        </div>

      </div>
    </div>
  </div>
</template>
import VueClipboard from 'vue-clipboard2'
<script>
export default {
  name: "CompoTalkHistory", //name은 'MENU_' + 파일명 조합
  components: {
  },
  props: {
    TalkProp: {
      type: Array,
    },
    isRealtimeScroll: {
      type:Boolean,
      default: () => false,
    }
  },
  data() {
    return {
      dropItems: [
        { text: '친절 콜' },
        { text: '프로모션' },
      ],
      dropItems2: [
        { text: '성희롱' },
        { text: '욕설 폭언' },
        { text: '반복억지' },
        { text: '민원요지 불분명' },
        { text: '사유 없는 콜백요청' },
        { text: '반말' },
        { text: '기타' },
      ],

      CUSL_PROFILE : {} //상담사 프로필
    }
  },
  computed: {
  },
  watch: {
    TALK_DATA() {
      if( this.isRealtimeScroll ) {
        try {
          const talkEl = document.querySelector(".talkScrollRef");
          talkEl.scrollTop = talkEl.scrollHeight - 100;
        } catch (e) {
          console.error('Error scrolling chat:', e);
        }
      }
    }
  },
  mounted() {
  },
  beforeDestroy(){
  },
  async created() {
  },
  methods: {
    settingBookmark(item, idx) {
      if( !this.mixin_isEmpty(item.isBmk) && item.isBmk ) {
        item.isBmk = false;
        this.$store.dispatch('statusStore/AC_TALK_DATA_BMK', {idx:idx, isBmk:false, isBmkDate:''});
      }else {
        item.isBmk = true;
        this.$store.dispatch('statusStore/AC_TALK_DATA_BMK', {idx:idx, isBmk:true, isBmkDate:this.$moment(new Date()).format("YYYY-MM-DD HH:mm:ss")});
      }
    }
  },
};
</script>

<style lang="scss" scoped>

</style>