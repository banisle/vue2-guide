<template>
  <div style="display: contents">
    <div class="pl-quick-layer-body" style="flex: 0 0 calc(100% - 217px);">
     <CompoManagerInfo
      :DataProp="NEW_CUTT_INFO"
      :popData="popData"
     />
    <!-- 상담 상세내역 -->
    <div class="is-mt-m pt-4 is-border-sub-top">
      <h3 class="pl-subtit">상담 상세내역 {{ NEW_CUTT_INFO ? (NEW_CUTT_INFO.PHN_CUTT_ID ? ' - (' + NEW_CUTT_INFO.PHN_CUTT_ID +')' : ''): (popData.PHN_CUTT_ID ? ' - (' + popData.PHN_CUTT_ID +')' : '') }}</h3>
      <div class="d-flex align-center is-mt-m">
        <CompoAudioWave
          :AudioProp=NEW_CUTT_INFO
          :WidthProp=340
          :popData="popData"
        />
      </div>
      <!-- table -->
      <div class="is-mt-m">
        <template v-if="SCH_CUSTCO_ID == '4'">
          <CompoInfoAsCutt 
            :DataProp="NEW_CUTT_INFO"
            :detailYn="true"
          />
        </template >
        <template v-else>
          <CompoCsInfoDtlTable :popData="popData" :DataProp="NEW_CUTT_INFO"/>
        </template>
      </div>
      <!-- info -->
      <ul class="pl-list-info is-mt-s">
        <li>당일 상담 내역만 수정할 수 있습니다.</li>
      </ul>
    </div>
    </div>
    <div class="pl-quick-layer-footer">
      <div class="pl-btn-wrap ml-auto">
        <!-- <v-btn v-if="popData" class="pl-btn" @click="$emit('sendDataToParent')">부모창 Call</v-btn> -->
        <v-btn class="pl-btn is-trans" @click="close()">닫기</v-btn>
        <!--바로처리 상담저장 버튼은 CompoInfoAsCutt 컴포넌트에서 생성함. -->
        <template v-if="SAVE_BTN_FLAG && SCH_CUSTCO_ID != '4'">
          <v-btn class="pl-btn" @click="$eventBus.$emit('saveCsDtlInfoValid', popData)">저장</v-btn>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import CompoManagerInfo from '@/components/CompoManagerInfo'
import CompoAudioWave from '@/components/CompoAudioWave'
import CompoCsInfoDtlTable from '@/components/CompoCsInfoDtlTable'
import CompoInfoAsCutt from '@/components/csl/CompoInfoAsCutt.vue';

export default {
  name: "CSL_M0100_CS_TAB01_DETAIL", //name은 'MENU_' + 파일명 조합
  props: {
    CUTT_INFO : {
      type: Object,
    },
    popData : {
      type: Object,
    },
    readOnly: {
      type: Boolean,
      default : false
    },
    SchCustcoIdProp: {
      type: String,
      default : null
    }
  },
  components: {
    CompoManagerInfo,
    CompoAudioWave,
    CompoCsInfoDtlTable,
    CompoInfoAsCutt
  },
  data() {
    return {
      data: {
        SCH_CUSTCO_ID : '',
        PROFILE: {
          name: '김한나',
          img: require('@/assets/img/@manager_profile4.png'),
          part: '마이홈센터 - 마이홈1팀',
          rcv_date: '2024-06-20 09:30:25',
          exc_date: '2024-06-20 09:38:05',
          excuter: '김한나',
          status: '상담완료',
          statusColor: 'is-bg-green',
        },
        CUS_INFO: [
          { title:'인입번호', icon: 'cs-phone', val: '010-5303-4545' },
          { title:'휴대전화', val: '010-5303-4545' },
          { title:'전화번호1', val: '02-1234-8975' },
          { title:'전화번호2', val: '02-9876-2826' },
          { title:'전화번호3', val: '02-1234-8975' },
          { title:'이메일', val: 'Heons@hkcloud.co.kr' },
          { title:'고객 ID', icon: 'cs-black', val: 'CT169776487781660258' },
          { title:'고객명', val: '나고객' },
        ],
        CS_INFO: {
          audio: { audioSrc: require('@/assets/file_example_MP3_700KB.mp3'), } ,
          radioGroupSelected: '동의',
          radioGroup: [
            { text: '동의' },
            { text: '미동의' },
          ],
          radioGroupSelected2: '일반',
          radioGroup2: [
            { text: '일반' },
            { text: '호전환' },
            { text: '호전환(협업)' },
            { text: '예약' },
            { text: '이첩' },
          ],
          private_terms: 0,
          connect_info: '국민임대',
          in_num: '010-5303-4545',
          exec_way: 0,
          chn_category01: 'IN',
          chn_category02: '전화',
          category01: '국민임대',
          category02: '예비자 모집공고',
          category03: '서류/접수방법',
          place_category01: '경기',
          place_category02: '화성시',
          place_category03: '화성동탄',
          textarea: `경기/화성시/화성동탄-단독, 중증장애X, 생계수급, 용인거주
  문) 화성동탄 문의(3/14 공고) / 관심지역 알리미 수신
  답) 동탄지역 2순위 2024.03.26(화) 1순위 마감여부  확인 후 신청가능 화성지역 2순위 2024.04.02(화) 1순위 마감여부 확인 후 신청가능 `,
          textareaH: 128,
        },

        PHN_CUTT_ID : '', //상담 ID
        
      },

      SAVE_BTN_FLAG : false,
      NEW_CUTT_INFO : {},
    }
  },
  computed: {
  },
  watch: {
    CUTT_INFO(){
      this.NEW_CUTT_INFO = this.CUTT_INFO;
      this.btnControl();
    }
  },
  mounted() {
  },
  beforeDestroy(){
  },
  created() {
    this.SCH_CUSTCO_ID = this.SchCustcoIdProp != null ? this.SchCustcoIdProp : this.computedUserCenter;
    console.log("SCH_CUSTCO_ID", this.SCH_CUSTCO_ID);
    this.NEW_CUTT_INFO = this.CUTT_INFO;
    if(this.NEW_CUTT_INFO) this.btnControl();//저장 버튼 노출 처리

    console.log('NEW_CUTT_INFO : ', this.NEW_CUTT_INFO);

    if(this.popData){
      setTimeout(() => {
        this.$eventBus.$emit('showCsDetail', this.popData);
      }, 1000);
    }

    if(this.readOnly){
      this.NEW_CUTT_INFO = this.popData;
      this.btnControl();//저장 버튼 노출 처리
    }
  },
  methods: {
    //저장 버튼 노출 처리
    async btnControl() {
      let currentDate = await this.mixin_getSvrDate("YYYYMMDD");

      if(this.computedUserType === 'MANAGER'){ //상담사인경우 당일 상담건에 대해서만 수정 가능
        if(this.mixin_convertDate(this.NEW_CUTT_INFO.REG_DT, 'yyyyMMdd') === currentDate) this.SAVE_BTN_FLAG = true;
        else this.SAVE_BTN_FLAG = false;
      }else{ //그외 권한자는 3일 이내 상담건에 대해서만 수정 가능
        if(this.computedUserDetailType === 'TEAM_LEADER'){
          if(this.computedUserDeptId === this.NEW_CUTT_INFO.RCPT_DEPT_ID){
            if(currentDate <= this.$moment(this.mixin_convertDate(this.NEW_CUTT_INFO.REG_DT.replace(/[^0-9]/g, ''), 'yyyyMMdd')).add(3,'days').format('YYYYMMDD')){
              this.SAVE_BTN_FLAG = true;
            }else{
              this.SAVE_BTN_FLAG = false;
            }
          }else{
            this.SAVE_BTN_FLAG = false;
          }
        }else{
          if(currentDate <= this.$moment(this.mixin_convertDate(this.NEW_CUTT_INFO.REG_DT.replace(/[^0-9]/g, ''), 'yyyyMMdd')).add(3,'days').format('YYYYMMDD')){
            this.SAVE_BTN_FLAG = true;
          }else{
            this.SAVE_BTN_FLAG = false;
          }
        }
      }
    },

    close(){
      this.$emit('Close')
    },
  },
};
</script>

<style lang="scss" scoped>

</style>