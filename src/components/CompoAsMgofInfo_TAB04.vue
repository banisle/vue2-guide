<template>
  <div>
    <!-- 배치도 -->
    <div class="pl-header is-no-boredr ">
      <v-icon class="pl-icon20 square-title" style="margin-top: 2px;"></v-icon>
      <div class="pl-subtit ml-1">배치도</div>
    </div>
    <div class="pl-rounded-box pa-3">
      <CompoImageSlider
        :ImagesProp="LHAT03_LIST" />
    </div>

    <!-- 평면도 -->
    <div class="pl-header is-no-boredr is-mt-l">
      <v-icon class="pl-icon20 square-title" style="margin-top: 2px;"></v-icon>
      <div class="pl-subtit ml-1">평면도</div>
    </div>
    <div class="pl-rounded-box pa-3">
      <CompoImageSlider
        :ImagesProp="LHAT04_LIST" />
    </div>
  </div>
</template>

<script>
import CompoImageSlider from '@/components/CompoImageSlider.vue';

export default {
  name: 'CompoAsMgofInfo_TAB04', //평면도
  components: {
    CompoImageSlider
  },
  props: {
    TabProp: {
      type: Number,
      default: null,
    },
    DataProp: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  data() {
    return {
      //고객사 ID : 바로처리 : '4'
      CUSTCO_ID: this.$store.getters["userStore/GE_USER_COMPANY"].CUSTCO_ID,
      MGOF_CD: '',

      //배치도 목록
      LHAT03_LIST: [],
      //평면도 목록
      LHAT04_LIST: [],


      images: [
        { title: '파주운정3 A37블록 국민·영구임대_단지배치도', src: require('@/assets/img/파주운정3 A37블록 국민·영구임대_단지배치도.jpg') },
        { title: '파주운정3 A37블록 국민·영구임대_조감도', src: require('@/assets/img/파주운정3 A37블록 국민·영구임대_조감도.jpg') },
        { title: '파주운정3 A37블록 국민·영구임대_동호배치도', src: require('@/assets/img/파주운정3 A37블록 국민·영구임대_동호배치도.jpg') },
        { title: '운정337블록고령자복지주택동호배치도(wise용)', src: require('@/assets/img/운정337블록고령자복지주택동호배치도(wise용).png') },
      ],
      images2: [
        { title: '파주운정3 A37블록 국민·영구임대_26B', src: require('@/assets/img/26B.png') },
        { title: '파주운정3 A37블록 국민·영구임대_29A', src: require('@/assets/img/29A.png') },
        { title: '파주운정3 A37블록 국민·영구임대_37A', src: require('@/assets/img/37A.png') },
        { title: '파주운정3 A37블록 국민·영구임대_37C', src: require('@/assets/img/37C.png') },
        { title: '파주운정3 A37블록 국민·영구임대_46A', src: require('@/assets/img/46A.png') },
      ],
    }
  },
  mounted() {
  },
  async created() {
    this.MGOF_CD = this.DataProp && this.DataProp.MGOF_CD ? this.DataProp.MGOF_CD : '';  //단지코드
    this.LHAT03_LIST = await this.getFileList("LHAT03");
    this.LHAT04_LIST = await this.getFileList("LHAT04");
  },
  computed: {
  },
  watch: {
  },
  methods: {
    //TODO 평면도 이미지를 우리 서버에서 호출하도록 변경 필요함!!!(현재 기존 상담ap 서버에서 호출중.)
    async getFileList(taskTypeCd) {
        let fileList = [];
        const postParam = {
          SRCH_CUSTCO_ID: this.CUSTCO_ID,
          FILE_GROUP_KEY: this.MGOF_CD,
          TASK_TYPE_CD: taskTypeCd
        };
        const headParam = {head: {}};
        const response = await this.common_postCall("/api/file/json/list", postParam, headParam);
        if(!response.HEADER.ERROR_FLAG) {
          fileList = response.DATA;
          fileList.map(item => {
            item.title = item.ACTL_FILE_NM;
            //item.src = "" + item.FILE_PATH + "/" + item.STRG_FILE_NM
            item.src = "/upload/" + item.FILE_PATH + "/" + item.STRG_FILE_NM;
          })
        }
        return fileList;
    },
    
  },
};
</script>

<style lang="scss" scoped>

</style>