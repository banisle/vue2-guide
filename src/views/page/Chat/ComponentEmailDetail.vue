<template>
  <div
    class="pl-chat-email-wrap">
    <!-- 이메일 상단 정보 -->
    <div v-if="DataProp.TTL" class="pl-chat-email-wrap-top px-6 pt-3">
      <div class="is-ellips">
        <strong >{{ DataProp.TTL }}</strong>
        <div class="is-mt-s">
          <span class="pl-chat-email-wrap-title">
            보낸 사람
          </span>
          <span class="pl-chat-email-wrap-desc">
            {{ DataProp.SNDR_EML }}
          </span>
        </div>
        <div>
          <span class="pl-chat-email-wrap-title">
            받는 사람
          </span>
          <span class="pl-chat-email-wrap-desc">
            {{ DataProp.RCVR_EML }}
          </span>
        </div>
      </div>
      <div class="pl-chat-email-wrap-top-date" >
        {{ this.mixin_convertDate(DataProp.RCPTN_DT, 'yyyy-MM-dd HH:mm:ss') }}
      </div>
    </div>
    <div v-else class="pl-list-nodata" >
      <span>등록된 데이터가 없습니다.</span>
    </div>
    <!-- 이메일 컨텐츠 -->
    <div
      class="pl-chat-email-wrap-content pt-0"
      style="height: calc(100vh - 345px)">
      <compo-file-grid
        v-if="DataProp.FILE_LIST != undefined && DataProp.FILE_LIST.length > 0"
        NoMarginProp
        TitleProp=""
        :HeadersProp="filelist_header"
        :HeaderButtonProp="false"
      />
      <div  v-dompurify-html="DataProp.CN" />
    </div>
  </div>
</template>

<script>
export default {
  name: "ComponentEmailDetail", //name은 'MENU_' + 파일명 조합
  props: {
    DataProp: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  components: {
  },

  data() {
    return {
      // file grid
      filelist_header: [
        { text: '파일명', value: 'filename', align: 'left',sortable: false },
        { text: '크기', value: 'filesize', align: 'left',sortable: false , width: '100px'},
        { text: '다운로드', value: 'download', align: 'center',sortable: false, width: '100px' },
        { text: '다운로드 수', value: 'count', align: 'center',sortable: false, width: '100px' },
      ],

    }
  },
  methods: {
  },
  mounted() {
  },
  created() {
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>