<template>
  <div
    class="px-6 py-2 flex-column pl-scroll-body list-fade-effect talkScrollRef"
    :style="isPopProp ? 'height: calc(100vh - 154px)' : 'height: calc(100vh - 240px)'">
    <div
      class="pl-realtime-talk-wrap pl-hover-wrap"
      ref="talkContainer"
      v-for="item,index in TalkProp"
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
          <div v-if="item.isBmk" class="ml-auto">
            <v-icon :class="`pl-icon20 ${ !item.isBmk ? '' : 'bookmark-fill'}`"></v-icon>
            <span class="ml-1 is-txt-sub">{{ item.isBmkDate }}에 태깅</span>
          </div>
        </div>
        <div style="white-space: pre-line" v-html="item.transcript"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CompoTalkMonitor", //name은 'MENU_' + 파일명 조합
  components: {
  },
  props: {
    TalkProp: {
      type: Array,
    },
    isRealtimeScroll: {
      type:Boolean,
      default: () => false,
    },
    isPopProp:{
      type: Boolean
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
    TalkProp() {
      if( this.isRealtimeScroll ) {
        try {
          const talkEl = document.querySelector(".talkScrollRef");
          talkEl.scrollTop = talkEl.scrollHeight + 100;
        } catch (e) {
          console.error('Error : ', e);
        }
      }
    },
  },
  mounted() {
  },
  beforeDestroy(){
  },
  async created() {
  },
  methods: {

  },
};
</script>

<style lang="scss" scoped>

</style>