<template>
  <div>
    <v-data-table
      class="pl-grid has-control"
      show-select
      :headers="headers"
      :items="items"
      fixed-header
      item-key="index"
      height="149px"
      :items-per-page="ROW_PER_PAGE"
      hide-default-footer
      no-data-text="등록된 데이터가 없습니다."
      :page.sync="page"
      @page-count="pageCount = $event"
      @click:row="rowClick"
      @dblclick:row="showDetail()"
      :loading="loading"
      loading-text="조회중입니다."
      >

      <template v-slot:[`item.${header.value}`]="{ item }" v-for="header in headers">
        <div v-if="header.telYn">
          <span v-if="item[header.value]">{{ mixin_setPhoneNo(item[header.value].replace(/[^0-9]/g, "")) }}</span>
        </div>
        <div v-else>
          <span v-if="header.value === 'SAVE_TIME'">
            {{ mixin_convertDate(item[header.value], 'yyyy-MM-dd HH:mm:ss') }}
          </span>
          <span v-else>{{ item[header.value] }}</span>
        </div>
      </template>

    </v-data-table>

    <v-dialog
      v-model="dialogSmsContent"
      content-class="dialog-draggable"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="관심지역 발송 내용"
        @hide="mixin_hideDialog('SmsContent')"
        @submit="submitDialog('SmsContent')"
      >
        <template slot="body">
          <div class="pl-rounded-box pa-3 pl-scroll-body" style="white-space: pre-line; height: 300px;">
            {{ MESSAGE }}
          </div>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="mixin_hideDialog('SmsContent')">닫기</v-btn>
          <v-btn class="pl-btn" @click="mixin_copyMessage(MESSAGE)">내용복사</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    props: {
      items : {
        type: Array
      },
      loading : {
        type: Boolean
        , default: false
      }
    },
    data(){
      return{
        //dialog: 관심지역 발송 내역
        dialogSmsContent: false,
        SEL_ROW: {},
        MESSAGE: '',

        page: 1,
        pageCount: 0,
        perPage: [15,30,50,100],
        ROW_PER_PAGE: -1,
        headers: [
          { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '3%', sortable: false },
          { text: '전송일시', value: 'SAVE_TIME', align: 'left', width: '10%',sortable: false },
          { text: '유형', value: 'INTEREST_DIV_CD_NM', align: 'left', width: '14%', sortable: false  },
          { text: '관심지역', value: 'INTEREST_AREA', align: 'left', width: '16%', sortable: false  },
          { text: '수신자 번호', value: 'CALLED_NUMBER', align: 'left', width: '8%', sortable: false, telYn: true  },
          { text: '결과', value: 'PROC_RESULT_NM', align: 'left', width: '6%', sortable: false  },
          { text: '전송 실패 사유', value: 'SKB_RESULT_NM', align: 'left', width: '', sortable: false  },
          { text: '발송 업무', value: 'SEND_WORK_NM', align: 'left', width: '', sortable: false  },
          { text: '발신자 번호', value: 'CALLING_NUMBER', align: 'left', width: '8%', sortable: false, telYn: true  },
          { text: '발송자', value: 'ACCOUNT_NAME', align: 'left', width: '7%', sortable: false  },
        ],
      }
    },
    watch: {
    },
    computed: {
    },
    beforeDestroy(){
    },
    async created() {
    },
    methods: {
      rowClick(item) {
        this.SEL_ROW = item;
      },
      async showDetail() {
        this.MESSAGE = '';
        const postParam = {
          MSG_KEY: this.SEL_ROW.MSG_KEY
        }
      
        const headParam = {head : {
          ns: 'lhcs.external_db.sms.dao.ExternalMapper_Sms'
        }};

        let response  = await this.common_postCall('/api/biz/common/external/select/selectSndMessage', postParam, headParam);

        if (!response.HEADER.ERROR_FLAG) {
          this.MESSAGE = response.DATA[0].MESSAGE;
        }
        this.dialogSmsContent = true
      },
    },
  }
</script>

<style lang="scss" scoped>

</style>