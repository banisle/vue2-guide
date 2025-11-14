<template>
  <div style="display: contents;">
    <template v-if="AUDIO !== undefined && !mixin_isEmpty(AUDIO.CALL_ID) && !IS_REC_DOWNLOADING">
      <template v-if="maxRetryesFlag">
        <div class="pl-audiowave no-wave">
          <span class="ml-2">녹취파일을 찾을 수 없습니다.</span>
        </div>
      </template>
      <template v-else>
        <div class="pl-audiowave" disabled>
          <audio
            controls
            name="media"
            :src="computedUserDetailType === 'MANAGER' ? (AUDIO['CUSL_ID'] === user_id ? audioSrc : '') : audioSrc"
            ref="audioElement"
            controlsList="nodownload"
            >
          </audio>
          <av-waveform
            v-if="audioSrc"
            ref-link="audioElement"
            :canv-width=WidthProp
            :canv-height=30
            :playtime=false
            played-line-color="#4E9E00"
            noplayed-line-color="#666"
            :audio-src="audioSrc">
          </av-waveform>
          <template v-if="IsLogBtn">
            <compo-tooltip-btn
              v-if="AUDIO.STT_YN === 'Y'"
              TitleProp="대화록 보기"
              ClassProp="pl-tooltip-btn ml-auto"
              IconProp="pl-icon20 sts"
              TooltipPositionProp="bottom"
              :MinWidthProp=20
              :HeightProp=20
              :DisabledProp="computedUserDetailType === 'MANAGER' ? (AUDIO['CUSL_ID'] === user_id ? false : true) : false"
              @btnClick="mixin_showTalkLog(AUDIO)"
            ></compo-tooltip-btn>
          </template>
        </div>
      </template>
    </template>
    <template v-else-if="IS_REC_DOWNLOADING">
      <div class="pl-audiowave no-wave">
        <span class="ml-2">녹취서버에 연결중 입니다.</span>
        <template v-if="IsLogBtn">
          <compo-tooltip-btn
              v-if="AUDIO.STT_YN === 'Y'"
              TitleProp="대화록 보기"
              ClassProp="pl-tooltip-btn ml-auto"
              IconProp="pl-icon20 sts"
              TooltipPositionProp="bottom"
              :MinWidthProp=20
              :HeightProp=20
              :DisabledProp="computedUserDetailType === 'MANAGER' ? (AUDIO['CUSL_ID'] === user_id ? false : true) : false"
              @btnClick="mixin_showTalkLog(AUDIO)"
          ></compo-tooltip-btn>
        </template>
      </div>
    </template>  
    <template v-else>
      <div class="pl-audiowave no-wave">
        <v-icon class="pl-icon20 mute"></v-icon>
        <span class="ml-2">연결되어있는 녹취파일이 없습니다.</span>
      </div>
    </template>
  </div>

</template>

<script>
export default {
  name: "CompoAudioWave", //name은 'MENU_' + 파일명 조합
  components: {
  },
  props: {
    AudioProp : {
      type: Object,
    },
    WidthProp: {
      type: Number,
      default: 340
    },
    IsLogBtn: {
      type: Boolean,
      default: true
    },
    popData : {
      type: Object,
    }
  },
  data() {
    return {
      AUDIO:{},
      audioSrc: null, // 오디오 소스 저장
      IS_REC_DOWNLOADING: false,
      MFU_REC_KEY: process.env.VUE_APP_MFU_REC_KEY_MP3.replace(/_DOLLAR_/gi, '$'),
      retryCount: 0,
      maxRetries: 5, // 최대 재시도 횟수
      maxRetryesFlag: false,
    }
  },
  methods: {
    async serverDownloadIpronRec() {

      //this.audioSrc = require('@/assets/34866602-0fba-4b3f-8e80-9898944e9990.mp3');

      console.log("*** CompoAudioWave.vue.serverDownloadIpronRec()" , this.AUDIO);
      console.log( "-365 :: " + this.$moment(new Date()).subtract(365, 'day').format("YYYYMMDDHHmmss") );

      // if( this.AUDDIO.CALL_ID.startsWith('CO') === false ) {
      //   this.AUDDIO.audioSrc = '/api/itf/ipron/rec/stream?userid=' + this.user_id + '&callId=' + this.AUDDIO.CALL_ID
      // }else if( this.AUDDIO.CALL_ID.startsWith('CO') === true && !this.mixin_isEmpty( this.AUDDIO.RECORD_KEY ) ) {
      //   this.AUDDIO.audioSrc = '/api/itf/ipron/rec/stream?userid=' + this.user_id + '&callId=' + this.AUDDIO.RECORD_KEY;
      // }if( this.AUDDIO.CALL_ID.startsWith('CO') === false ) {
      //   this.AUDDIO.audioSrc = '/api/itf/ipron/rec/stream?userid=' + this.user_id + '&callId=' + this.AUDDIO.CALL_ID
      // }else if( this.AUDDIO.CALL_ID.startsWith('CO') === true && !this.mixin_isEmpty( this.AUDDIO.RECORD_KEY ) ) {
      //   this.AUDDIO.audioSrc = '/api/itf/ipron/rec/stream?userid=' + this.user_id + '&callId=' + this.AUDDIO.RECORD_KEY;
      // }
      
      if('CALL_ID' in this.AUDIO){
        let paramData = {
            key: this.MFU_REC_KEY
          , type: "mp3" /*화자분리된 파일 요청시 rx, tx 구분하여 호출 가능, rx, tx 다운 시 wav 파일로 생성되고 mp3파일로 다운 시 mono 입니다.*/
          , original: "0"
          , userid: this.user_id
          , dnno: ""
        };

        if (this.AUDIO.CALL_ID.startsWith('CO') === false) {
          paramData.callid = this.AUDIO.CALL_ID;
          paramData.filename = this.AUDIO.CALL_ID + ".mp3";
        } else if (this.AUDIO.CALL_ID.startsWith('CO') === true && !this.mixin_isEmpty(this.AUDIO.RECORD_KEY)) {
          paramData.callid = this.AUDIO.RECORD_KEY;
          paramData.filename = this.AUDIO.RECORD_KEY + ".mp3";
        }

        if( this.mixin_isEmpty( paramData.callid )) {
          this.AUDIO.CALL_ID = undefined;
        }else {
          // Blob 데이터를 가져오기
          // const audioBlob = await this.fetchAudioFile("/voctopcmwav.do", paramData);
          // this.audioSrc = URL.createObjectURL(audioBlob);
          // this.$once("hook:beforeDestroy", () => {
          //   console.log( "hook:beforeDestroy" )
          //   URL.revokeObjectURL(this.audioSrc);
          // });
          this.maxRetryesFlag = false;
          this.IS_REC_DOWNLOADING = true;
          console.log("Audio File Downloading....");

          const xhr = new XMLHttpRequest();
          xhr.open('POST', '/voctopcmwav.do', true);
          xhr.responseType = 'blob'; // Blob 타입 응답

          xhr.setRequestHeader('Content-Type', 'application/json');

          xhr.onload = () => {
            if (xhr.status === 200) {
              const blob = xhr.response;
              this.audioSrc = URL.createObjectURL(blob);
              this.IS_REC_DOWNLOADING = false;
              this.retryCount = 0;
              console.log('Audio successfully fetched');
            } else {
              this.handleError();
            }
          };

          xhr.onerror = () => {
            this.handleError();
          };

          // 요청 데이터
          const requestData = JSON.stringify(paramData);
          xhr.send(requestData);
        }
      }
    },

    //재시도용
    handleError() {
      console.log('reTry==>', this.retryCount);
      if (this.retryCount < this.maxRetries) {
        console.warn(`Retrying (${this.retryCount + 1}/${this.maxRetries})...`);
        this.serverDownloadIpronRec();
        this.retryCount++;
      } else {
        this.IS_REC_DOWNLOADING = false;
        this.retryCount = 0;
        this.maxRetryesFlag = true;
        console.log("파일 로딩오류");
        console.error('Failed to fetch audio after 5 attempts');
      }
    },

    //사용 안함함
    async fetchAudioFile(url, bodyData) {
      this.IS_REC_DOWNLOADING = true;
      console.log("파일 로딩시작");
      const response = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(bodyData),
      });
      if (!response.ok) {
        this.AUDIO.CALL_ID = undefined;
        this.IS_REC_DOWNLOADING = false;
        console.log("파일 로딩오류 ", response.status);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.IS_REC_DOWNLOADING = false;
      console.log("파일 로딩완료");
      return await response.blob(); // 오디오 파일 데이터(blob 형태) 가져오기
    }
  },
  mounted() {
    console.log('AudioProp : ', this.AudioProp);
  },
  beforeDestroy(){
    this.$eventBus.$off("setCuttDetailInfo"); //eventBus 중복방지를 위해 off
    if( this.audioSrc !== null ) URL.revokeObjectURL(this.audioSrc);
  },
  created() {
    //
    // if(this.AudioProp) this.AUDIO = this.AudioProp;
    // if(this.popData) this.AUDIO = this.popData;
    //
    // if( (this.AUDIO !== undefined && this.AUDIO.CALL_ID !== undefined)  ) {
    //   this.serverDownloadIpronRec();
    // }

    //상담 상세보기 emit
    this.$eventBus.$on("setCuttDetailInfo", (CS_INFO) => {
      this.AUDIO = JSON.parse(JSON.stringify(CS_INFO))/* Deep Copy */;
      this.serverDownloadIpronRec();
    });

  },
  computed: {
  },
  watch: {
    AudioProp: {
      handler(newVal) {
        if (newVal) {
          this.AUDIO = JSON.parse(JSON.stringify(newVal))/* Deep Copy */;
          this.serverDownloadIpronRec();
        }
      },
      immediate: true,
    },
    popData: {
      handler(newVal) {
        if (newVal) {
          this.AUDIO = JSON.parse(JSON.stringify(newVal))/* Deep Copy */;
          this.serverDownloadIpronRec();
        }
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>

</style>