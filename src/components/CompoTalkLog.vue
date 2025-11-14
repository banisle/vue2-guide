<template>
  <div style="display: contents">
    <div class="pl-header px-3">
      <div class="pl-header--title">대화록 내용</div>
      <v-switch class="ml-auto pl-switch type-first-label" v-model="isTaggingTalk">
        <template v-slot:label>
          <span class="pl-label">태깅</span>
        </template>
      </v-switch>
    </div>
    <div
      class="pl-quick-layer-body px-0 py-0"
      style="overflow-y: hidden; flex: 0 0 calc(100% - 247px);">
      <CompoTalkMonitor
        :TalkProp=MONITOR_TALK_DATA
        :isPopProp="isPopProp"
        v-if="INIT_TALK_DATA" />
    </div>
    <!-- footer -->
    <div class="pl-quick-layer-footer">
      <div class="d-flex align-center">
        <div class="pl-form-inline-wrap">
          <div class="pl-form-inline">
            <span class="pl-label">
              대화 찾기
            </span>
            <div class="pl-desc">
              <v-text-field
                  class="pl-form is-search type-middle"
                  style="width: 400px"
                  placeholder="검색어 입력"
                  v-model="SRCH_STR"
                  @keyup.enter="searchTalk"
              >
                <template v-slot:append>
                  <v-btn
                      @click="searchTalk"
                      class="pl-btn has-icon-only">
                    <span class="pl-icon20 in-search"></span>
                  </v-btn>
                </template>
              </v-text-field>
            </div>
          </div>
        </div>
      </div>
      <div class="pl-btn-wrap ml-auto">
        <v-btn class="pl-btn is-trans" @click="$emit('Close')">닫기</v-btn>
      </div>
    </div>

  </div>
</template>

<script>
import CompoTalkMonitor from "@/components/CompoTalkMonitor.vue";

export default {
  name: "CompoTalkLog", //name은 'MENU_' + 파일명 조합
  components: {
    CompoTalkMonitor,
  },
  props: {
    DataProp: Object,
    injectionObj: {
      type: Object,
      default:null
    },
    isPopProp:{
      type: Boolean
    }
  },
  data() {
    return {
      isTaggingTalk: false,
      INIT_TALK_DATA:[],
      MONITOR_TALK_DATA:[],
      SRCH_STR: '',
    }
  },
  methods: {
    async selectMonitorRecordInfo( callId ) {
      let response = await this.common_postCall('/api/biz/common/select/selectMonitorRecordInfoCallId', {CALL_ID: callId}, {head : {ns : 'lhcs.phone.cutt.dao.PhoneCuttMapper'}});
      if (!response.HEADER.ERROR_FLAG){
        if (response.HEADER.COUNT > 0) {
          let recordObj = response.DATA[0];
          this.INIT_TALK_DATA = recordObj.STT_CN;
          this.MONITOR_TALK_DATA = JSON.parse(JSON.stringify(this.INIT_TALK_DATA));
        }
      }
    },
    searchTalk() {
      let _this = this;
      if( !this.mixin_isEmpty(this.SRCH_STR) ) {
        if( this.isTaggingTalk ) {
          this.MONITOR_TALK_DATA = JSON.parse(JSON.stringify(this.INIT_TALK_DATA)).filter(item => (item.transcript.indexOf(_this.SRCH_STR) > -1 && item.isBmk === true)).map(
              function (item) {
                if (item.transcript.indexOf(_this.SRCH_STR) > -1) {
                  item.transcript = _this.mixin_highlight(item.transcript, _this.SRCH_STR);
                }
                return item;
              }
          );
        }else {
          this.MONITOR_TALK_DATA = JSON.parse(JSON.stringify(this.INIT_TALK_DATA)).filter(item => (item.transcript.indexOf(_this.SRCH_STR) > -1)).map(
              function (item) {
                if (item.transcript.indexOf(_this.SRCH_STR) > -1) {
                  item.transcript = _this.mixin_highlight(item.transcript, _this.SRCH_STR);
                }
                return item;
              }
          );
        }
      }else {
        if( this.isTaggingTalk ) {
          this.MONITOR_TALK_DATA = JSON.parse(JSON.stringify(this.INIT_TALK_DATA)).filter(item => (item.isBmk ===true));
        }else {
          this.MONITOR_TALK_DATA = JSON.parse(JSON.stringify(this.INIT_TALK_DATA));
        }
      }
    }
  },
  mounted() {

  },
  created() {
    console.log("CompoTalkLog.created()", this.injectionObj);
    if( this.injectionObj.CALL_ID && (this.injectionObj.CALL_ID.startsWith('CO') === false) ) {
      this.selectMonitorRecordInfo(this.injectionObj.CALL_ID);
    }
  },
  computed: {
  },
  watch: {
    SRCH_STR() {
      this.searchTalk();
    },
    isTaggingTalk() {
      this.searchTalk();
    },
  },

};
</script>

<style lang="scss" scoped>

</style>