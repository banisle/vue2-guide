<template>
  <div>
    <div class="d-flex align-center">
      <strong class="pl-card-intop--title">일일업무 보고 현황</strong>
      <div class="d-flex align-center ml-auto">
        <compo-tooltip-btn
          TitleProp="새로고침"
          ClassProp="pl-tooltip-btn ml-1"
          IconProp="pl-icon20 refresh"
          TooltipPositionProp="bottom"
          :MinWidthProp=22
          :HeightProp=22
          @btnClick="changeReportDt"
        ></compo-tooltip-btn>
      </div>
    </div>
    <div class="pl-rounded-box pb-3 is-mt-s">
      <div class="d-flex pa-5">
        <strong class="pl-subtit">기준일</strong>
        <compo-date-picker
          DateType="dateInput"
          ClassProp="flex-grow-0 is-trans ml-2"
          StyleProp="width: 100px"
          :DateProp.sync="RPT_DAY"
          @dateChange="changeReportDt"/>
      </div>
      <!-- grid -->
      <div class="d-flex align-center px-0 is-border-top" >
        <v-data-table
          class="pl-grid has-img is-header-lg theme-simple"
          :headers="headers"
          :items="items"
          fixed-header
          item-key="ROW_NUM"
          height="288px"
          disable-pagination
          hide-default-footer
          :loading="loading"
          loading-text="조회중입니다."
	        no-data-text="등록된 데이터가 없습니다.">
          <template v-slot:item.LAST_RPT_YN_NM="{ item }">
            <span
              :class="`pl-badge is-${mixin_displayStatus(item.LAST_RPT_YN_NM, 'STAT_LIST')}`"
              style="width: 40px;"
              >
            {{ item.LAST_RPT_YN_NM }}</span>
          </template>
          <template v-slot:item.RGTR_NM="{ item }">
            <img :src="item.IMG" :alt="item.RGTR_NM" class="pl-grid-portrait" style="width: 20px; height: 20px;" @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}" v-if="item.RGTR_NM != '-'">
            <span class="ml-1">{{ item.RGTR_NM }}</span>
          </template>
          <!-- 보고서 -->
          <template v-slot:item.REPORT_BTN="{ item }">
            <compo-tooltip-btn
              TitleProp="보고서 보기"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 board-docu"
              TooltipPositionProp="bottom"
              @btnClick="clickReportBtn(item)"
              :DisabledProp="mixin_isEmpty(item.RPT_DAY)"
            ></compo-tooltip-btn>
          </template>
        </v-data-table>
      </div>
    </div>
    <!-- dialog: 일일 업무 관리 -->
    <v-dialog
      v-model="dialogReport"
      v-if="dialogReport"
      content-class="dialog-draggable is-lg is-nopadding is-maxHeight"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="일일 업무 관리"
        @hide="mixin_hideDialog('Report')"
      >
        <template slot="body">
          <!-- component -->
          <CSM_M0200_DIALOG ref="CSM_M0200_DIALOG" :propsData="propsData" :isPreview="true"/>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="mixin_hideDialog('Report')">닫기</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
import CSM_M0200_DIALOG from '@/views/page/CSM_M0200_DIALOG'

export default {
  name: 'HomeAdminDaily', //일일업무보고 현황
  components: {
    CSM_M0200_DIALOG,
  },
  data() {
    return {
      RPT_DAY: this.$moment().format("YYYY-MM-DD"),
      
      headers: [
        { text: '센터', value: 'UP_DEPT_NM', align: 'pl-5 font-weight-bold', width: '', sortable: false, },
        { text: '상태', value: 'LAST_RPT_YN_NM', align: 'center', width: '9%' , sortable: false},
        { text: '근무인원 이슈', value: 'WORKER_ISSUE', align: 'center', width: '9%', sortable: false},
        { text: '상담 이슈', value: 'CUTT_ISSUE', align: 'center', width: '9%' , sortable: false},
        { text: '민원 현황', value: 'CVLCPT_RCPT', align: 'center', width: '9%' , sortable: false},
        { text: '시스템 장애', value: 'SYS_ISSUE', align: 'center', width: '9%' , sortable: false},
        { text: '교육', value: 'EDU_CN', align: 'center', width: '9%' , sortable: false},
        { text: '등록자', value: 'RGTR_NM', align: 'center', width: '9%' , sortable: false},
        { text: '등록일', value: 'REG_DT', align: 'center', width: '13%' , sortable: false},
        { text: '보고서', value: 'REPORT_BTN', align: 'center', width: '9%' , sortable: false},
      ],
      items: [],

      STAT_LIST: [
        { code: '보고됨', value: 'blue'},
        { code: '미보고', value: 'org'},
      ],

      //dialog
      dialogReport: false,

      propsData:{
        RPT_DAY: ""
        , SRCH_CUSTCO_ID: ""
      },

      loading: false,
    }
  },
  methods: {
    async selectHomeDayTask(){
      let sUrl = '/api/biz/common/select/selectHomeDayTask';

      let postParam = {
        RPT_DAY: this.RPT_DAY.replaceAll("-", "")
      };

      let headParam = { head : {
        ns : 'lhcs.phone.cuttMng.task.dao.xml.PhoneDayTaskReportMapper'
        , sn : 'selectHomeDayTask'
      }};

      this.loading = true;

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.items = response.DATA.map(row=>{
          // 프로필 이미지
          if( row.ICON_IMG_URI !== '/' ) row.IMG = '/upload/' + row.ICON_IMG_URI;
          else row.IMG = require('@/assets/img/@manager_profile_default.png');

          return row;
        });
      }else{
        this.showAlertCaution({msg:"일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오."});
      }

      this.loading = false;
    },

    changeReportDt(){
      if(this.RPT_DAY.replaceAll("-", "").length >= 8){
        if(this.RPT_DAY.replaceAll("-", "").length != 8){
          this.showAlertInfo({msg:"기준일을 정확히 입력해주세요"});
          return false;
        }
        
        this.selectHomeDayTask();
      }
    },

    // 보고서 버튼
    clickReportBtn(item){
      this.propsData.RPT_DAY = item.RPT_DAY;
      this.propsData.SRCH_CUSTCO_ID = item.TASK_CUSTCO_ID;
      this.dialogReport = true;
    },
  },
  mounted() {
    this.selectHomeDayTask();
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