<template>
  <div class="py-3 list-fade-effect">
    <div class="pl-chatting2">
      <div
        :style="`height: ${HeightProp}`"
        class="pl-chatting2-log pl-scroll-body"
        v-scroll.self="onScroll"
        ref="chatContainer"
        id="drag-area"
        >
        <!-- 채팅 -->
        <div
          v-for="log,i in ChatLogProp"
          :key="log.id"
          :class="log.SNDRCV_CD === 'RCV' ? 'is-rcv' : 'is-snd'"
          class="pl-chatting2-wrap"
          >
          <!-- 고객정보 조회 -->
          <template v-if="log.TYPE === 'custInfo'">
            <div class="pl-rounded-box is-bg-light-main" style="width: 100%">
              <div class="pa-3">
                <span class="pl-subtit">고객정보</span>
                <div class="is-mt-m">
                  <div class="d-flex">
                    <strong style="flex: 0 0 60px">연락처</strong>
                    <span class="pl-form-valuebox type-middle is-bg-white px-1 flex-grow-1">{{ log.CONTENT.split("||")[2] }}</span>
                  </div>
                  <div class="d-flex is-mt-s">
                    <strong style="flex: 0 0 60px">이름</strong>
                    <span class="pl-form-valuebox type-middle is-bg-white px-1 flex-grow-1">{{ log.CONTENT.split("||")[1] }}</span>
                  </div>
                  <div class="d-flex is-mt-s">
                    <strong style="flex: 0 0 60px">주소</strong>
                    <span class="pl-form-valuebox type-middle is-bg-white px-1 flex-grow-1">{{ log.CONTENT.split("||")[3] }}</span>
                  </div>
                </div>
              </div>
              <div class="is-border-top pl-btn-wrap py-2 justify-center">
                <v-btn
                  class="pl-btn is-esp"
                  @click="searchCust(log.CONTENT.split('||')[2])"
                >고객조회</v-btn>
              </div>
            </div>
          </template>
          <!-- 일반 채팅 -->
          <template v-else>
            <div
              class="d-flex"
              v-if="!(log.TYPE == 'QSTN' && !log.QSTN_TYPE_MSG)"
              >
              <img
                v-if="log.SNDRCV_CD === 'RCV'"
                :src="CUST_PROFILE" 
                class="pl-chatting2-log-img "
                style="width: 100%; max-height: 30px; border-radius: 50%;"/>
              <img
                v-else
                :src="USER_PROFILE" 
                class="pl-chatting2-log-img "
                style="width: 100%; max-height: 30px; border-radius: 50%;"/>
              <div class="ml-2" >
                <img
                  v-if="(log.TYPE == 'IM' || log.TYPE == 'photo') ? true : false"
                  :src="log.IMAGE_URL"
                  class="pl-chatting-log-img"
                  @click="chat_img_expand(log.IMAGE_URL)"
                  style="cursor: pointer;"
                />
                <div
                  v-else-if="(log.TYPE == 'FI' || log.TYPE == 'AU' || log.TYPE == 'VI') ? true : false"
                  class="pl-chatting2-log-content" >
                  {{ log.LNK_INFO }}
                </div>
                <div
                  v-else-if="log.TYPE == 'QSTN' && log.QSTN_TYPE_MSG"
                    class="pl-chatting2-log-content"
                  >
                  {{ log.QSTN_TYPE_MSG }}
                  <div class="spacing-wrap sp-8 flex-column is-mt-m">
                    <div
                      v-for="btnList,n in log.QSTN_BTN_LIST"
                      >
                      <div
                        v-if="btnList"
                        :style="ChatLogProp[i+1].QSTN_TYPE_NM == btnList ? 'background-color: rgb(255 255 255);border: 1px solid #8ba1d9;' : 'background-color: #FFF'"
                        class="pl-box-text px-3 py-1 rounded-lg"
                        >
                        {{n+1}}. {{ btnList }}
                      </div>
                      <div
                        v-else
                        class="pl-box-text px-3 py-1 rounded-lg d-flex align-center"
                        :style="ChatLogProp[i+1].CONTENT.indexOf('BACK_') != -1? 'background-color: rgb(255 255 255);border: 1px solid #8ba1d9;' : 'background-color: #FFF'"
                        >
                        {{ '이전' }}
                      </div>
                    </div>
                    <div
                      class="pl-box-text px-3 py-1 rounded-lg d-flex align-center"
                      :style="ChatLogProp[i+1].CONTENT.indexOf('BACK_') != -1 ? 'background-color: rgb(255 255 255);border: 1px solid #8ba1d9;' : 'background-color: #FFF'"
                      >
                      {{ '이전' }}
                    </div>

                  </div>
                </div>
                <div
                  v-else
                  class="pl-chatting2-log-content" >
                  {{log.CONTENT}}
                </div>
                <span class="pl-chatting2-log-date">{{ log.CHAT_DATE }}</span>
              </div>
            </div>
          </template>
        </div>

      </div>

      <!-- 맨위로 -->
      <v-btn
        v-show="scrlTopBtn"
        icon
        class="pl-to-top"
        @click="scrlToTop"
      >
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: "ComponentChatLog", //name은 'MENU_' + 파일명 조합
  components: {
  },
  props: {
    ChatLogProp: {
      type: Array,
    },
    HeightProp: {
      type: String,
      default: '100%'
    },
    ChtUserKey: {
      type: String,
    },
    ChtCuttId: {
      type: String,
    },

  },
  data() {
    return {
      // 스크롤 탑 버튼
      scrlTopBtn: false,

      USER_PROFILE:require('@/assets/img/@manager_profile.png'),
      CUST_PROFILE:require('@/assets/img/@manager_profile_default.png'),
    }
  },
  methods: {
    onScroll(e) {
      e.target.scrollTop > 50 ? this.scrlTopBtn = true : this.scrlTopBtn = false;
    },
    scrlToTop() {
      this.$refs.chatContainer.scrollTop = 0;
    },
    scrlToBottom() {
      if(this.$refs.chatContainer) {
        this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;
      }
    },
    searchCust(phnNo){
      console.log("this.ChtUserKey",this.ChtUserKey);
      this.$eventBus.$emit("searchCustInfo",phnNo,this.ChtUserKey,'KAKAO',this.ChtCuttId);
    },
  },
  mounted() {
    this.USER_PROFILE = this.$store.getters['userStore/GE_USER_ROLE'].IMG
  },
  created() {
  },
  computed: {
  },
  watch: {
    ChatLogProp: {
      handler() {
        this.$nextTick(() => {
          this.scrlToBottom();
        });
      },
      deep: true,
      immediate: true
    },
  },
};
</script>

<style lang="scss" scoped>

</style>