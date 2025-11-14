<template>
  <div style="display: contents;">
    <div class="pl-quick-layer-body" style="flex: 0 0 calc(100% - 217px);">
      <div class="d-flex flex-column">
        <!-- 상담사 -->
        <div class="d-flex" style="position: relative;">
          <template v-if="!USER_PROFILE.USER_ID">
            <div style="flex: 0 0 40px">
              <img :src="require('@/assets/img/@manager_profile_default.png')" :alt="DataProp.RG_EMP_NM" style="width: 100%; border-radius: 50%;">
            </div>
            <div class="ml-4">
              <div>
                <strong style="font-size: 14px">{{ DataProp.RG_EMP_NM }}</strong>
                <span class="ml-1 is-txt-sub"></span>
              </div>
              <div class="">
                <strong>발송일</strong> : {{ DataProp.RG_DATE }}
                <template v-if="SmsTypeProp == 'SMS'">
                  <strong class="ml-2">발송 타입</strong> : {{ DataProp.TYPE }}
                </template>
                <template v-if="SmsTypeProp == 'ATALK'">
                  <strong class="ml-2">발송 시스템</strong> : {{ DataProp.REQ_DEPT_NM }}
                </template>
              </div>
            </div>
          </template>
          <template v-else>
            <div style="flex: 0 0 40px">
              <template v-if="SmsTypeProp == 'SMS'">
                <img :src="USER_PROFILE.ICON_IMG_URI" :alt="USER_PROFILE.USER_NM" style="width: 100%; border-radius: 50%;" @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}">
              </template>
              <template v-if="SmsTypeProp == 'ATALK'">
                <img :src="require('@/assets/img/@manager_profile_default.png')" :alt="DataProp.REQ_USR_ID" style="width: 100%; border-radius: 50%;">
              </template>
            </div>
            <div class="ml-4">
              <div >
                <template v-if="SmsTypeProp == 'SMS'">
                  <strong style="font-size: 14px">{{ USER_PROFILE.USER_NM }}</strong>
                  <span class="ml-1 is-txt-sub">{{ USER_PROFILE.DEPT_NM }}</span>
                </template>
                <template v-if="SmsTypeProp == 'ATALK'">
                  <strong style="font-size: 14px">{{ DataProp.REQ_USR_ID }}</strong>
                </template>
              </div>

              <div class="">
                <strong>발송일</strong> : {{ DataProp.RG_DATE }}
                <template v-if="SmsTypeProp == 'SMS'">
                  <strong class="ml-2">발송 타입</strong> : {{ DataProp.TYPE }}
                </template>
                <template v-if="SmsTypeProp == 'ATALK'">
                  <strong class="ml-2">발송 시스템</strong> : {{ DataProp.REQ_DEPT_NM }}
                </template>
              </div>
            </div>
          </template>
        </div>
        <!-- sms 발송 정보 -->
        <div class="is-border-sub-top pt-3 is-mt-s">
          <div class="pl-subtit">SMS 발송 정보</div>
          <div class="is-mt-m d-flex">
            <div class="d-flex align-center">
              <v-icon class="pl-icon20 phone-line"></v-icon>
              <strong class="ml-1">수신자 번호</strong>
              <span class="ml-2">{{ DataProp.RECEIVER }}</span>
            </div>
            <template v-if="DataProp.SENDER">
              <div class="d-flex align-center ml-auto mr-4">
                <strong>발신 번호</strong>
                <span class="ml-2">{{ DataProp.SENDER }}</span>
              </div>
            </template>
          </div>
          <!-- text -->
          <div
            class="pl-scroll-body is-bg-light pa-3 rounded-lg is-mt-m"
            style="height: 553px">
            <div v-if="SmsTypeProp == 'ATALK'" class="pl-subtit">제목: {{ DataProp.SUBJECT }}</div>
            <div :class="SmsTypeProp == 'ATALK' && 'is-border-top is-mt-s pt-2'" style="white-space: pre-line;">
              {{ DataProp.MSG }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pl-quick-layer-footer">
      <div class="pl-btn-wrap ml-auto">
        <v-btn class="pl-btn is-trans" @click="$emit('Close')">닫기</v-btn>
      </div>
    </div>
  </div>
  </template>

<script>
export default {
  name: "CompoSmsLog", //name은 'MENU_' + 파일명 조합
  components: {
  },
  props: {
    DataProp: {
      type: Object,
    },
    PagingProp: {
      type: Boolean,
      default: true
    },
    SmsTypeProp: {
      type: String,
      default: "SMS"
    }
  },
  data() {
    return {
      USER_PROFILE: {},
    }
  },
  methods: {

    async getUserProfile() {
      if(this.SmsTypeProp == "SMS") {
        this.USER_PROFILE = await this.mixin_get_cusl_profile(this.DataProp.RG_EMP_NO);
      }

    }
  },
  mounted() {
  },
  async created() {
    this.getUserProfile();
  },
  computed: {
  },
  watch: {
    DataProp(){
      this.getUserProfile();
    }
  },
};
</script>

<style lang="scss" scoped>

</style>