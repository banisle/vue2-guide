<template>
  <div class="pl-container">
   <div class="pl-card-wrap">
     <!-- sub content -->
     <div class="pl-card-body">
       <div class="pl-grid-top pt-2">
         <div class="pl-grid-top-left">
           <v-btn class="pl-btn is-icon is-trans " @click="dblClickRow" :disabled="selectedRow.ROW_NUMBER != undefined ? false : true">
             <span class="pl-icon20 document"></span>
             선택항목 상세
           </v-btn>
           <v-btn class="pl-btn is-icon is-trans " @click="regBtn">
             <span class="pl-icon20 circle-plus"></span>
             등록
           </v-btn>
         </div>
         <div class="pl-grid-top-utils">
           <v-checkbox v-model="SRCH_PLT" class="pl-check ml-1" label="PALETTE" @change="getQuartzList()"></v-checkbox>
           <v-checkbox v-model="SRCH_LHCS_R" class="pl-check ml-1" label="LHCS수신" @change="getQuartzList()"></v-checkbox>
           <v-checkbox v-model="SRCH_COTIS_R" class="pl-check ml-1" label="COTIS수신" @change="getQuartzList()"></v-checkbox>
           <v-checkbox v-model="SRCH_EAI_R" class="pl-check ml-1" label="EAI수신" @change="getQuartzList()"></v-checkbox>
           <v-checkbox v-model="SRCH_EAI_S" class="pl-check ml-1" label="EAI송신" @change="getQuartzList()"></v-checkbox>
           &nbsp;&nbsp;|&nbsp;&nbsp;
           <v-switch class="pl-switch type-first-label ml-1" v-model="isRealtimeSchedule">
             <template v-slot:label>
               <span class="pl-label">자동갱신</span>
             </template>
           </v-switch>
           최종갱신시각 - <span :style="{background: intervalSearchTimeColor}">{{ intervalSearchTime }}</span>
           &nbsp;&nbsp;|&nbsp;&nbsp;
           <span class="pl-counter">전체 <em class="pl-1">({{ items.length }})</em> 건</span>
           <compo-tooltip-btn
               TitleProp="새로고침"
               ClassProp="pl-tooltip-btn"
               IconProp="pl-icon20 refresh"
               TooltipPositionProp="bottom"
               @btnClick="getQuartzList();">
           </compo-tooltip-btn>
         </div>
       </div>
       <v-data-table
         class="pl-grid is-mt-s"
         :headers="headers"
         :items="items"
         single-select
         height="calc(-262px + 100vh)"
         fixed-header
         item-key="ROW_NUMBER"
         hide-default-footer
         :items-per-page="-1"
         :item-class="isActiveRow"
         @click:row="rowSelect"
         @dblclick:row="dblClickRow"
         v-model="selectedData"
         no-data-text="등록된 데이터가 없습니다."
         >
         <template v-slot:item.act="{ item }">
           <span v-if="item.jobStatus == 'RUNNING' ? true : false">
              <v-btn class="pl-btn is-esp2" @click="exeduteAction('pause', '일시중지', item.ROW_NUMBER, item.groupName,item.jobName)">■</v-btn>
           </span>
           <span v-if="(item.jobStatus == 'SCHEDULED' || item.jobStatus == 'WAITING') ? true : false">
              <v-btn class="pl-btn is-esp2" @click="exeduteAction('pause', '일시중지', item.ROW_NUMBER, item.groupName,item.jobName)">■</v-btn>
           </span>
           <span v-if="item.jobStatus == 'COMPLETE' ? true : false">
              <v-btn class="pl-btn is-esp2" @click="exeduteAction('pause', '일시중지', item.ROW_NUMBER, item.groupName,item.jobName)">■</v-btn>
           </span>
           <span v-if="item.jobStatus == 'PAUSED' ? true : false">
              <v-btn class="pl-btn" @click="exeduteAction('resume','재개', item.ROW_NUMBER, item.groupName,item.jobName)">▶</v-btn>
           </span>
           <span v-if="item.jobStatus == '-' ? true : false">
            -
           </span>
         </template>
         <template v-slot:item.jobStatus="{ item }">
           <span v-if="item.jobStatus == 'RUNNING' ? true : false">
             <strong class="is-txt-blue pl-value-txt">RUNNING</strong>
           </span>
           <span v-if="(item.jobStatus == 'SCHEDULED' || item.jobStatus == 'WAITING' || item.jobStatus == 'ACQUIRED' || item.jobStatus == 'BLOCKED' ) ? true : false">
             <strong class="is-txt-blueGray pl-value-txt">{{ item.jobStatus }}</strong>
           </span>
           <span v-if="item.jobStatus == 'COMPLETE' ? true : false">
             <strong class="is-txt-blueGray pl-value-txt">COMPLETE</strong>
           </span>

           <span v-if="item.jobStatus == 'PAUSED' ? true : false">
             <strong class="is-txt-red pl-value-txt">PAUSED</strong>
           </span>
           <span v-if="item.jobStatus == '-' ? true : false">
            -
           </span>
         </template>
         <template v-slot:item.cronExpression="{ item }">
           <span v-if="item.triggerType == 'CRON' ? true : false">
           {{ item.triggerType }}<br/>{{ item.cronExpression }}
           </span>
           <span v-if="item.triggerType == 'ONETIME' ? true : false">
            ONETIME
           </span>
         </template>
         <template v-slot:item.showLastFiredTime="{ item }">
           {{ item.showLastFiredTime }}<br/>{{ item.showNextFireTime }}
         </template>
         <template v-slot:item.description="{ item }">
           {{ item.description }}
<!--           <br/>{{ item.showJavaClassName }}-->
         </template>
         <template v-slot:item.jobDataMap="{item}">
           <v-tooltip content-class="pl-tooltip bottom" bottom max-width="40%">
             <template v-slot:activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on" style="cursor: pointer;" @click="mixin_copyMessage(item.jobDataMap)">
                <span class="pl-icon20 document" v-if="item.jobDataMap != ''"></span>
              </span>
             </template>
             <span>{{ item.jobDataMap }}</span>
           </v-tooltip>
         </template>
         <template v-slot:item.lastLogTime="{ item }">
           <span v-if="(item.lastLogTime != '') ? true : false">
             <v-tooltip content-class="pl-tooltip bottom" bottom max-width="40%">
             <template v-slot:activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on" style="cursor: pointer;" @click="mixin_copyMessage(item.lastLogTime +' ' + item.lastLogCnt + ' ' + item.lastLogMsg)">
                {{ item.lastLogTime }} ({{item.lastLogCnt  }})<br/>{{ item.lastLogMsg }}
              </span>
             </template>
             {{ item.lastLogTime }} ({{item.lastLogCnt  }})<br/>{{ item.lastLogMsg }}
           </v-tooltip>
           </span>
         </template>
         <template v-slot:item.atOnce="{ item }">
           <span v-if="(item.jobStatus != 'RUNNING') ? true : false">
            <v-btn class="pl-btn is-sub" @click="exeduteAction('start', '즉시실행', item.ROW_NUMBER, item.groupName,item.jobName)">즉시실행</v-btn>
           </span>
         </template>
       </v-data-table>
     </div>
   </div>
    <!-- dialog -->
    <v-dialog
        width="700"
        v-model="dialogRegQuartz"
        content-class="dialog-draggable"
        hide-overlay
        :retain-focus="false"
        persistent>
      <div class="draggable-area">drag area</div>
      <compo-dialog
          :headerTitle='digParams.DIG_HEADER_TITLE'
          @hide="[mixin_hideDialog('RegQuartz'), initSelect()]">
        <template slot="body">
          <v-form ref="form">
            <div class="pl-form-inline-wrap vertical">
              <div class="pl-form-inline">
                  <span class="pl-label">
                    JOB 설명(제목)
                  </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form type-middle"
                    v-model="digParams.description"
                    required
                    v-byte-counter="100"
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                  <span class="pl-label">
                    JOB NAME(키값)
                    <span v-if="digParams.flag == 'modify' ? true : false">(수정불가)</span>
                  </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form type-middle"
                    v-model="digParams.jobName"
                    :disabled="digParams.flag == 'modify' ? true : false"
                    required
                    v-byte-counter="100"
                  />
                </div>
              </div>
              <div class="pl-form-inline">
              <span class="pl-label">
                JOB CLASS NAME
                <span v-if="digParams.flag == 'modify' ? true : false">(수정불가)</span>
              </span>
                <div class="pl-desc">
                  <v-select
                      class="pl-form type-middle"
                      :items="list_quartz_bean"
                      placeholder="선택하세요"
                      v-model="digParams.javaClassName"
                      :disabled="digParams.flag == 'modify' ? true : false"
                  ></v-select>
                </div>
              </div>
              <div class="pl-form-inline" v-if="(digParams.triggerType == 'CRON' || digParams.triggerType == '') ? true : false ">
                  <span class="pl-label">
                    <div>
                      TRIGGER EXPRESSION
                      <br/>(미기입시 1회성)
                    </div>
                    <compo-tooltip-btn
                      TitleProp="크론 표현식"
                      ClassProp="pl-tooltip-btn align-self-start ml-1"
                      IconProp="pl-icon20 question"
                      TooltipPositionProp="bottom"
                      @btnClick="mixin_showDialog('CronExpression');"
                      :MinWidthProp=22
                      :HeightProp=22></compo-tooltip-btn>
                  </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form type-middle"
                    v-model="digParams.cronExpression"
                    required
                    v-byte-counter="60"
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                  <span class="pl-label">
                    시작기준일시
                  </span>
                <div class="pl-desc">
                  <v-text-field
                      class="pl-form type-middle"
                      v-model="digParams.scheduleTime"
                    required
                    v-byte-counter="100"
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                  <span class="pl-label">
                    JOB DATA (json)
                  </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form type-middle"
                    v-model="digParams.jobDataMap"
                    required
                    placeholder="json data"
                    v-byte-counter="100"
                  />
                </div>
              </div>
              <div class="pl-form-inline" v-if="(digParams.flag == 'modify' && digParams.lastLogMsg != '') ? true : false">
                <span class="pl-label">
                  마지막 로그
                </span>
                <div class="pl-desc">
                  <v-textarea
                      class="pl-form is-noresize type-middle"
                      v-model="digParams.lastLogMsg"
                      required
                      :spellcheck="false"
                      v-byte-counter="4000"
                  />
                </div>
              </div>
            </div>
          </v-form>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-esp3" @click="deleteRegQuartz" v-if="digParams.flag == 'modify' ? true : false">삭제</v-btn>
          <v-btn class="pl-btn is-trans" @click="[mixin_hideDialog('RegQuartz'), initSelect()]">닫기</v-btn>

          <v-btn class="pl-btn" @click="saveRegQuartz">저장</v-btn>

        </template>
      </compo-dialog>
    </v-dialog>
    <!-- 발송자 찾기 모달 -->
    <v-dialog v-model="dialogCronExpression" content-class="dialog-draggable"
              hide-overlay
              :retain-focus="false"
              persistent
    >
      <div class="draggable-area">drag area</div>
      <compo-dialog header-title="크론 표현식" @hide="mixin_hideDialog('CronExpression')" >
        <template slot="body">
          <v-form ref="form">
          <table class="pl-tbl-detail">
            <colgroup>
              <col width="30%" />
              <col width="70%" />
            </colgroup>
            <thead>
            <tr>
              <th scope="row"><span class="pl-label">Expression</span></th>
              <th scope="row"><span class="pl-label">Meaning</span></th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td><strong>* * * ? * *</strong></td>
              <td>Every second</td>
            </tr>
            <tr>
              <td><strong>0 * * ? * *</strong></td>
              <td>Every minute</td>
            </tr>
            <tr>
              <td><strong>0 */2 * ? * *</strong></td>
              <td>Every even minute</td>
            </tr>
            <tr>
              <td><strong>0 1/2 * ? * *</strong></td>
              <td>Every uneven minute</td>
            </tr>
            <tr>
              <td><strong>0 */2 * ? * *</strong></td>
              <td>Every 2 minutes</td>
            </tr>
            <tr>
              <td><strong>0 */3 * ? * *</strong></td>
              <td>Every 3 minutes</td>
            </tr>
            <tr>
              <td><strong>0 */4 * ? * *</strong></td>
              <td>Every 4 minutes</td>
            </tr>
            <tr>
              <td><strong>0 */5 * ? * *</strong></td>
              <td>Every 5 minutes</td>
            </tr>
            <tr>
              <td><strong>0 */10 * ? * *</strong></td>
              <td>Every 10 minutes</td>
            </tr>
            <tr>
              <td><strong>0 */15 * ? * *</strong></td>
              <td>Every 15 minutes</td>
            </tr>
            <tr>
              <td><strong>0 */30 * ? * *</strong></td>
              <td>Every 30 minutes</td>
            </tr>
            <tr>
              <td><strong>0 15,30,45 * ? * *</strong></td>
              <td>Every hour at minutes 15, 30 and 45</td>
            </tr>
            <tr>
              <td><strong>0 0 * ? * *</strong></td>
              <td>Every hour</td>
            </tr>
            <tr>
              <td><strong>0 0 */2 ? * *</strong></td>
              <td>Every hour</td>
            </tr>
            <tr>
              <td><strong>0 0 0/2 ? * *</strong></td>
              <td>Every even hour</td>
            </tr>
            <tr>
              <td><strong>0 0 1/2 ? * *</strong></td>
              <td>Every uneven hour</td>
            </tr>
            <tr>
              <td><strong>0 0 */3 ? * *</strong></td>
              <td>Every three hours</td>
            </tr>
            <tr>
              <td><strong>0 0 */4 ? * *</strong></td>
              <td>Every four hours</td>
            </tr>
            <tr>
              <td><strong>0 0 */6 ? * *</strong></td>
              <td>Every six hours</td>
            </tr>
            <tr>
              <td><strong>0 0 */8 ? * *</strong></td>
              <td>Every eight hours</td>
            </tr>
            <tr>
              <td><strong>0 0 */12 ? * *</strong></td>
              <td>Every twelve hours</td>
            </tr>
            <tr>
              <td><strong>0 0 0 * * ?</strong></td>
              <td>Every day at midnight - 12am</td>
            </tr>
            <tr>
              <td><strong>0 0 1 * * ?</strong></td>
              <td>Every day at 1am</td>
            </tr>
            <tr>
              <td><strong>0 0 6 * * ?</strong></td>
              <td>Every day at 6am</td>
            </tr>
            <tr>
              <td><strong>0 0 12 * * ?</strong></td>
              <td>Every day at noon - 12pm</td>
            </tr>
            <tr>
              <td><strong>0 0 12 * * ?</strong></td>
              <td>Every day at noon - 12pm</td>
            </tr>
            <tr>
              <td><strong>0 0 12 * * SUN</strong></td>
              <td>Every Sunday at noon</td>
            </tr>
            <tr>
              <td><strong>0 0 12 * * MON</strong></td>
              <td>Every Monday at noon</td>
            </tr>
            <tr>
              <td><strong>0 0 12 * * TUE</strong></td>
              <td>Every Tuesday at noon</td>
            </tr>
            <tr>
              <td><strong>0 0 12 * * WED</strong></td>
              <td>Every Wednesday at noon</td>
            </tr>
            <tr>
              <td><strong>0 0 12 * * THU</strong></td>
              <td>Every Thursday at noon</td>
            </tr>
            <tr>
              <td><strong>0 0 12 * * FRI</strong></td>
              <td>Every Friday at noon</td>
            </tr>
            <tr>
              <td><strong>0 0 12 * * SAT</strong></td>
              <td>Every Saturday at noon</td>
            </tr>
            <tr>
              <td><strong>0 0 12 * * MON-FRI</strong></td>
              <td>Every Weekday at noon</td>
            </tr>
            <tr>
              <td><strong>0 0 12 * * SUN,SAT</strong></td>
              <td>Every Saturday and Sunday at noon</td>
            </tr>
            <tr>
              <td><strong>0 0 12 */7 * ?</strong></td>
              <td>Every 7 days at noon</td>
            </tr>
            <tr>
              <td><strong>0 0 12 1 * ?</strong></td>
              <td>Every month on the 1st, at noon</td>
            </tr>
            <tr>
              <td><strong>0 0 12 2 * ?</strong></td>
              <td>Every month on the 2nd, at noon</td>
            </tr>
            <tr>
              <td><strong>0 0 12 15 * ?</strong></td>
              <td>Every month on the 15th, at noon</td>
            </tr>
            <tr>
              <td><strong>0 0 12 1/2 * ?</strong></td>
              <td>Every 2 days starting on the 1st of the month, at noon</td>
            </tr>
            <tr>
              <td><strong>0 0 12 1/4 * ?</strong></td>
              <td>Every 4 days staring on the 1st of the month, at noon</td>
            </tr>
            <tr>
              <td><strong>0 0 12 L * ?</strong></td>
              <td>Every month on the last day of the month, at noon</td>
            </tr>
            <tr>
              <td><strong>0 0 12 L-2 * ?</strong></td>
              <td>Every month on the second to last day of the month, at noon</td>
            </tr>
            <tr>
              <td><strong>0 0 12 LW * ?</strong></td>
              <td>Every month on the last weekday, at noon</td>
            </tr>
            <tr>
              <td><strong>0 0 12 1L * ?</strong></td>
              <td>Every month on the last Sunday, at noon</td>
            </tr>
            <tr>
              <td><strong>0 0 12 2L * ?</strong></td>
              <td>Every month on the last Monday, at noon</td>
            </tr>
            <tr>
              <td><strong>0 0 12 6L * ?</strong></td>
              <td>Every month on the last Friday, at noon</td>
            </tr>
            <tr>
              <td><strong>0 0 12 1W * ?</strong></td>
              <td>Every month on the nearest Weekday to the 1st of the month, at noon</td>
            </tr>
            <tr>
              <td><strong>0 0 12 15W * ?</strong></td>
              <td>Every month on the nearest Weekday to the 15th of the month, at noon</td>
            </tr>
            <tr>
              <td><strong>0 0 12 ? * 2#1</strong></td>
              <td>Every month on the first Monday of the Month, at noon</td>
            </tr>
            <tr>
              <td><strong>0 0 12 ? * 6#1</strong></td>
              <td>Every month on the first Friday of the Month, at noon</td>
            </tr>
            <tr>
              <td><strong>0 0 12 ? * 2#2</strong></td>
              <td>Every month on the second Monday of the Month, at noon</td>
            </tr>
            <tr>
              <td><strong>0 0 12 ? * 5#3</strong></td>
              <td>Every month on the third Thursday of the Month, at noon - 12pm</td>
            </tr>
            <tr>
              <td><strong>0 0 12 ? JAN *</strong></td>
              <td>Every day at noon in January only</td>
            </tr>
            <tr>
              <td><strong>0 0 12 ? JUN *</strong></td>
              <td>Every day at noon in June only</td>
            </tr>
            <tr>
              <td><strong>0 0 12 ? JAN,JUN *</strong></td>
              <td>Every day at noon in January and June</td>
            </tr>
            <tr>
              <td><strong>0 0 12 ? DEC *</strong></td>
              <td>Every day at noon in December only</td>
            </tr>
            <tr>
              <td><strong>0 0 12 ? JAN,FEB,MAR,APR *</strong></td>
              <td>Every day at noon in January, February, March and April</td>
            </tr>
            <tr>
              <td><strong>0 0 12 ? 9-12 *</strong></td>
              <td>Every day at noon between September and December</td>
            </tr>
            </tbody>
          </table>
          </v-form>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="mixin_hideDialog('CronExpression')">닫기</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
 </div>
</template>

<script>
import api from "@/store/apiUtil";
import moment from "moment/moment";

export default {
components: {},
props: {
    // DataProp: Array
    selectedTabIndex: {
      type: Number,
    }
  },
data() {
  return {
    isRealtimeSchedule: false,
    intervalSearchTimeColor: '',
    intervalSearchTime: moment().format('HH:mm:ss'),
    intervalQuartz: null,
    list_quartz_bean : [],
    list_common_code : [],
    dialogRegQuartz: false,
    dialogCronExpression: false,
    SRCH_PLT : true,
    SRCH_LHCS_S : true,
    SRCH_LHCS_R : true,
    SRCH_COTIS_S : true,
    SRCH_COTIS_R : true,
    SRCH_EAI_S : true,
    SRCH_EAI_R : true,

    selectedData: [],      // 그리드 체크박스 값
    selectedRow : {},

    headers: [
      { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '60px', sortable : false },
      { text: 'ACT', value: 'act', align: 'center', width: '80px' ,sortable : false},
      { text: '상태', value: 'jobStatus', align: 'center', width: '80px',sortable : false },
      { text: 'TRIGGER', value: 'cronExpression', align: 'left', width: '150px',sortable : false },
      { text: '배치명', value: 'description', align: 'left', sortable : false },
      { text: '시작기준일시', value: 'showScheduleTime', align: 'center', width: '160px',sortable : false},
      { text: '마지막,다음실행', value: 'showLastFiredTime', align: 'center', width: '160px',sortable : false},
      { text: '다음조회조건', value: 'NEXT_SRCH_DT', align: 'center', width: '120px',sortable : false},
      { text: 'CMD', value: 'jobDataMap', align: 'center', width: '60px' ,sortable : false},
      { text: '마지막로그 (차수)', value: 'lastLogTime', align: 'center', width: '180px',sortable : false},
      { text: 'ACT', value: 'atOnce', align: 'center', width: '80px' ,sortable : false},
    ],
    items: [],
    // digparams (상세조회 data)
    digParams:{
      DIG_HEADER_TITLE: '',
      flag: '',
      jobName: '',
      triggerType: '',
      javaClassName: '',
      cronExpression: '',
      scheduleTime:'',
      lastFiredTime:'',
      nextFireTime:'',
      description: '',
      jobDataMap: '',
      lastLogMsg: ''
    },
    //confirm alert 메시지
    MESSAGE : {
      CONFIRM : {
      },
      ALERT : {
      },
      ERROR : {
        ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
      }
    },
  }
 },

  watch: {
    selectedTabIndex() {
      console.log("selectedTabIndex : " + this.selectedTabIndex);
    },
    dialogRegQuartz() {
      console.log("dialogRegQuartz : " + this.dialogRegQuartz);
    }
  },

  computed: {
  },

  beforeDestroy(){
    clearInterval(this.intervalQuartz);
  },

  async created() {
    this.getQuartzList();
    this.list_quartz_bean = await this.select_quartz_bean();

    this.intervalQuartz = setInterval(() => {
      if( this.isRealtimeSchedule ) this.intervalQuartzList();
    }, 5000);

  },

  mounted() {

  },

  methods: {

     async intervalQuartzList() {
       if( !this.dialogRegQuartz && this.selectedTabIndex == 0 ) {

         console.log("intervalQuartzList");
         this.getQuartzList();
       }
     },

    //페이지에서 호출되어 있는 코드셋에서 하나의 그룹코드를 필터하여 가져온다
    async select_quartz_bean() {
      var responseData = [];
      const sUrl = '/batch-api/quartz/scheduler/listQuartzJobBean';
      const postParam = {}
      const headParam = {}
      let response = await this.common_postCall(process.env.VUE_APP_BATCH_URL + sUrl, postParam, headParam );

      if (!response.HEADER.ERROR_FLAG){
        response.DATA.forEach((data, index) => {
          responseData.push({ text: data.className, value: data.classId })
        });
      }

      return responseData;
    },

    async getQuartzList() {

      this.selectedRow = {};

      let sUrl = '/batch-api/quartz/scheduler/selectAllJobs';
      let postParam = {};
      if( this.SRCH_PLT ) postParam.SRCH_PLT = 'Y';
      if( this.SRCH_LHCS_S ) postParam.SRCH_LHCS_S = 'Y';
      if( this.SRCH_LHCS_R ) postParam.SRCH_LHCS_R = 'Y';
      if( this.SRCH_COTIS_S ) postParam.SRCH_COTIS_S = 'Y';
      if( this.SRCH_COTIS_R ) postParam.SRCH_COTIS_R = 'Y';
      if( this.SRCH_EAI_S ) postParam.SRCH_EAI_S = 'Y';
      if( this.SRCH_EAI_R ) postParam.SRCH_EAI_R = 'Y';

      let response  = await this.common_postCall(process.env.VUE_APP_BATCH_URL + sUrl, postParam, {});
      if (!response.HEADER.ERROR_FLAG){
        this.items = [];

        //데이터 가공 영역
        response.DATA.forEach((data, idx) => {
          data.ROW_NUMBER = (idx+1);
          data.triggerType = data.TRIGGER_TYPE;
          data.jobStatus = data.TRIGGER_STATE;
          data.jobName = data.JOB_NAME;
          data.groupName = data.JOB_GROUP;
          data.description = data.JOB_DESCRIPTION;
          data.cronExpression = data.CRON_EXPRESSION;
          data.javaClassName = data.JOB_CLASS_NAME;
          data.showJavaClassName = this.simpleFormatClass( data.JOB_CLASS_NAME );
          data.scheduleTime = data.START_DT;
          data.lastLogTime = (data.REG_DT == '')?'':this.mixin_convertDate(data.REG_DT, 'yyyy-MM-dd HH:mm:ss');
          data.lastLogCnt = data.LOG_CNT;
          data.lastLogMsg = data.OUTPUT;
          data.showScheduleTime = (data.START_DT == '-')?'-':this.mixin_convertDate(data.START_DT, 'yyyy-MM-dd HH:mm:ss');
          if( data.PREV_FIRE_TIME !== '-') {
            data.showLastFiredTime = this.mixin_convertDate(data.PREV_FIRE_TIME, 'yyyy-MM-dd HH:mm:ss');
          }else {
            if( data.REG_DT != '' ) {
              data.showLastFiredTime = this.mixin_convertDate(data.REG_DT, 'yyyy-MM-dd HH:mm:ss');
            }else {
              data.showLastFiredTime = "-";
            }
          }

          if( data.showLastFiredTime !== '-' && data.NEXT_FIRE_TIME !== '-') {
            data.showNextFireTime = this.mixin_convertDate(data.NEXT_FIRE_TIME, 'yyyy-MM-dd HH:mm:ss');
          }else {
            data.showNextFireTime = "-";
          }
          data.jobDataMap = JSON.stringify(data.JOB_DATA_STR);
        });
        this.items = [...this.items, ...response.DATA];
      }else {
        this.isRealtimeSchedule = false;
      }
      this.intervalSearchTimeColor = 'yellow';
      this.intervalSearchTime = moment().format('HH:mm:ss');
      setTimeout(() => { this.intervalSearchTimeColor = '';}, 500);
    },
    async exeduteAction( action,msg, rownumber, group, jobname) {
      console.log( action + "/" +  + "/" + group+ "/" + jobname);
      this.showConfirmInfo({
        msg: '<b>' + msg + '</b> 하시겠습니까? \n'+ this.items[(rownumber - 1)].description
        , callYes: () => {
          this.exeduteActionProcess(action, rownumber, jobname);
        }
        , callNo: this.closeAlert
      });
    },
    async exeduteActionProcess(action, rownumber, jobname) {


      let sUrl = '/batch-api/quartz/scheduler/'+ action;
      let response = await this.common_postCall(process.env.VUE_APP_BATCH_URL + sUrl, {jobName:jobname}, {});
      console.log( response );
      if(!response.HEADER.ERROR_FLAG) {
        this.getQuartzList();
      }else {
        this.showToastCaution({msg: response.HEADER.ERROR_MSG})
      }

      this.closeAlert();
    },


    regBtn() {
      // dialog 초기화
      this.ufnInit();
      this.digParams.DIG_HEADER_TITLE="시스템배치(Quartz) 등록";
      this.digParams.flag="new";
      this.mixin_showDialog('RegQuartz');
    },
    dblClickRow(){
      this.ufnInit();
      this.digParams = {
        DIG_HEADER_TITLE: "시스템배치(Quartz) 상세 - " + this.selectedRow.jobName,
        flag: 'modify',
        jobName: this.selectedRow.jobName,
        javaClassName: this.selectedRow.javaClassName,
        cronExpression: this.selectedRow.cronExpression,
        triggerType: this.selectedRow.triggerType,
        description: this.selectedRow.description,
        jobDataMap: this.selectedRow.jobDataMap,
        scheduleTime:this.selectedRow.scheduleTime,
        lastFiredTime:this.selectedRow.lastFiredTime,
        nextFireTime:this.selectedRow.nextFireTime,
        lastLogMsg:this.selectedRow.lastLogMsg,
      }

      this.mixin_showDialog('RegQuartz');
    },

    //row 선택
    rowSelect(item) {
      this.selectedRow = item;
    },

    //row 선택시 색상 변경
    isActiveRow(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },

    ufnInit() {
      this.digParams = {
        DIG_HEADER_TITLE: '',
        flag: '',
        triggerType: '',
        jobName: '',
        javaClassName: '',
        cronExpression: '',
        description: '',
        jobDataMap: '',
        scheduleTime:'',
        lastFiredTime:'',
        nextFireTime:'',
        lastLogMsg:'',

      }
    },

    async saveRegQuartz() {

      if( this.mixin_isEmpty( this.digParams.description ) ) { alert("JOB 설명(제목)을 입력하세요."); return; }
      if( this.mixin_isEmpty( this.digParams.jobName ) ) { alert("JOB NAME(키값)을 입력하세요."); return; }
      if( this.mixin_isEmpty( this.digParams.javaClassName ) ) { alert("JOB CLASS NAME을 선택하세요."); return; }
      if( this.digParams.triggerType == "CRON" && this.mixin_isEmpty( this.digParams.cronExpression ) ) { alert("CRON 표현식을 입력하세요."); return; }
      if( this.mixin_isEmpty( this.digParams.scheduleTime ) ) { alert("시작기준일시를 입력하세요."); return; }
      if( this.mixin_isEmpty( this.digParams.jobDataMap ) ) { alert("JOB DATA (json)을 입력하세요."); return; }


      this.showConfirmInfo({
        msg: ((this.digParams.flag == 'new')?"등록":"수정") + ' 하시겠습니까?'
        , callYes: () => {
          this.saveRegQuartzProcess();
        }
        , callNo: this.closeAlert
      });
    },

    async saveRegQuartzProcess() {
      let sUrl;
      if(this.digParams.flag == 'new') {
        sUrl = '/batch-api/quartz/scheduler/insert';
      }else if(this.digParams.flag == 'modify') {
        sUrl = '/batch-api/quartz/scheduler/update';
      }
      let response = await this.common_postCall(process.env.VUE_APP_BATCH_URL + sUrl, this.digParams, {});
      console.log( response );
      if(!response.HEADER.ERROR_FLAG){
        this.mixin_hideDialog('RegQuartz');
        this.initSelect();
        this.getQuartzList();
      }else {
        this.showToastCaution({msg: response.HEADER.ERROR_MSG})
      }
      this.closeAlert();
    },

    async deleteRegQuartz() {
      this.showConfirmInfo({
        msg: '삭제 하시겠습니까? '
        , callYes: () => {
          this.deleteRegQuartzProcess();
        }
        , callNo: this.closeAlert
      });
    },

    async deleteRegQuartzProcess() {
      let sUrl = '/batch-api/quartz/scheduler/delete';
      let response = await this.common_postCall(process.env.VUE_APP_BATCH_URL + sUrl, this.digParams, {});
      console.log( response );
      if(!response.HEADER.ERROR_FLAG){
        this.mixin_hideDialog('RegQuartz');
        this.initSelect();
        this.getQuartzList();
        this.closeAlert();
      }else {
        this.closeAlert();
        this.showToastCaution({msg: response.HEADER.ERROR_MSG})

      }
    },
    simpleFormatClass( javaClassName ) {
      if( javaClassName.indexOf(".") > -1 ) {
        var _classLen = javaClassName.length;
        var _lastDot = javaClassName.lastIndexOf('.');
        var _className = javaClassName.substring((_lastDot + 1), _classLen);
        var _simpleJavaClassName = "";
        var simpleJavaClassNameArr = javaClassName.substring(0, _lastDot).split(".");
        for( var i=0; i< simpleJavaClassNameArr.length; i++) {
            if( simpleJavaClassNameArr[ i ] !== undefined ) {
              _simpleJavaClassName += simpleJavaClassNameArr[i].substring(0, 1) + ".";
            }
        }
        return _simpleJavaClassName + _className;

      }else {
        return javaClassName;
      }
    },
    initSelect(){
      this.selectedRow = {};
    },
  },
}
</script>