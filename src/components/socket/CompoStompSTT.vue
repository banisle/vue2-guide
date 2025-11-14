<template></template>
<script>
import axios from "axios";

let retryCnt = 10; //STT 접속오류시 재접속

export default {
  name: 'CompoStompSTT',
  props: {
  },
  data: () => ({

    IS_CLOSED_CALL: true,

    baseSearchUrl: process.env.VUE_APP_KONAN_SEARCH_URL, // 검색엔진URL
    baseSessionUrl: process.env.VUE_APP_STT_SESSION_URL, // 'https://haiv.timbel.net:40002/api/public/monitoring',  //STT 실시간 view - session id 가져오기
    baseSocketUrl: process.env.VUE_APP_STT_SOCKET_URL, //'wss://haiv.timbel.net:40002/client/ws/monitoring?original-session-id',
    //baseSocketUrl: "wss://haiv.timbel.net:40002/client/ws/monitoring", //'wss://haiv.timbel.net:40002/client/ws/monitoring?original-session-id',
    IS_ENTER_MONITOR: false,

    CALL_ID : '',
    CALL_DATE : '',
    CUSL_PROFILE: {},

    socketRx : null,
    originalSessionIdRx : null,//"09dfccf6-3b48-b03f-42c8-c9a636a249f1",
    connectionStatusRx: "Disconnected",

    socketTx : null,
    originalSessionIdTx : null,//"09dfccf6-3b48-b03f-42c8-c9a636a249f1",
    connectionStatusTx: "Disconnected",

    messages: [],
    newMessage: "",

    sendSearchWordsLimits : 100, /* 검색엔진에게 전송할 검색어 최소 단어수. */
    sendSearchWords : "", /* 검색엔진에게 전송할 검색어 모음 (STT에서 넘어온 문장을 | 구분하여 sendSearchWordsLimits 만큼 씩만 전송한다.)  */

  }),
  beforeDestroy(){
    this.$eventBus.$off("setSttCallId"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("closeCallId"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("setEnterMonitor"); //eventBus 중복방지를 위해 off

  },
  async created() {

    console.log("[CompoStompSTT]>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>[CompoStompSTT]");

    //this.selectSearchEngine("안녕하세요 원주무실 공공지원민간임대주택 문의드려요. 여기는 충청북도 제천시 장락동이에요..");
    //this.selectSearchEngine("결로에 대한 이해와 발생원인은 어떻게 되나요? 여기는 충청북도 제천시 청전동 이에요..");
    this.CUSL_PROFILE = this.$store.getters["userStore/GE_USER_ROLE"];

    // 모니터링에서 인입되는경우.
    this.$eventBus.$on("setEnterMonitor", (obj) => {
      this.IS_ENTER_MONITOR = true;
      // if( !this.mixin_isEmpty(obj) ) {
      //   this.CUSL_PROFILE.USER_NM = obj.USER_NM;
      //   this.CUSL_PROFILE.IMG = obj.IMG;
      //   this.CALL_DATE = obj.REG_DT;
      // }
    });

    this.$eventBus.$on("setSttCallId", (callInfo) => {
      this.IS_CLOSED_CALL = false;
      this.$store.dispatch('statusStore/AC_TALK_DATA', []); //실시간 대화록 초기화
      this.$store.dispatch('statusStore/AC_TALK_DATA_SEARCH_KMS', []); //KMS데이터 초기화
      this.$store.dispatch('statusStore/AC_TALK_DATA_SEARCH_KEYWORD', []); //KMS데이터 초기화
      this.$store.dispatch('statusStore/AC_TALK_DATA_SEARCH_CLCN', []); //공고문데이터 초기화
      this.$store.dispatch('statusStore/AC_TALK_DATA_SEARCH_R1_SUMMARIZE', ""); //R1 요약본초기화
      this.$store.dispatch('statusStore/AC_TALK_DATA_SEARCH_R1_PHONE', ""); //R1 요약본초기화
      this.$store.dispatch('statusStore/AC_TALK_DATA_SEARCH_R1_NAME', ""); //R1 요약본초기화
      this.$store.dispatch('statusStore/AC_TALK_DATA_SEARCH_T1_SUMMARIZE', ""); //T1 요약본초기화
      this.$store.dispatch('statusStore/AC_TALK_DATA_SEARCH_CUTT', ""); //추천유형 초기화

      this.CALL_DATE = this.$moment().format('YYYYMMDDHHmmss');
      this.CALL_ID = callInfo.CALL_ID;

      setTimeout(() => {
        this.sttRxConnection(); //Rx(고객 : R1)
        this.sttTxConnection(); //Tx(상담사 : T1)
      }, 1000);

      this.sendSearchWords = "";  //검색엔진에게 전송할 검색어 초기화
    });

    //전화 끊으면 STT소켓 닫기.
    this.$eventBus.$on("closeCallId", (callInfo) => {

      if( !this.IS_CLOSED_CALL ) {
        this.IS_CLOSED_CALL = true;

        // 1. STT에서 넘어온 대화 REDIS 에 저장.
        this.sttRxConnectionClose();
        this.sttTxConnectionClose();

        console.log("closeCallId :: this.IS_ENTER_MONITOR :: ", this.IS_ENTER_MONITOR, callInfo);
        let callId = "";
        if (!this.mixin_isEmpty(callInfo.CALL_ID)) {
          callId = callInfo.CALL_ID;
        } else if (!this.mixin_isEmpty(callInfo.ucid)
            && !this.mixin_isEmpty(callInfo.hop)
            && !this.mixin_isEmpty(callInfo.thisdn)
            && !this.mixin_isEmpty(callInfo.datetime)) {
          callId = callInfo.datetime.substring(0, 8) + "_" + callInfo.ucid + "_" + callInfo.hop + "_" + callInfo.thisdn;
        }

        if (!this.mixin_isEmpty(callId)) {

          // 2. STT의 데이터 대화 내용 REDIS 데이터 DB에 저장.
          if (!this.IS_ENTER_MONITOR) {
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> insertDataRedisToDatabase ", callId);
            this.common_postCall("/api/itf/stt/insertDataRedisToDatabase"
                , {CALL_ID: callId, STT_DATA: JSON.stringify(this.$store.getters["statusStore/GE_TALK_DATA"])}
                , {}
            );
          }

          /* 3. 통화 종료이후 남은 검섹데이터 검색엔진에게 전송. */
          if (!this.IS_ENTER_MONITOR) this.selectSearchEngineProcess();

          /* 4. 통화 종료이후 전체데이터 검색엔진에게 전송하여 추천 상담유형 및 긍정부정 정보 조회용도. */
          if (!this.IS_ENTER_MONITOR) this.summarizeSearchEngine();
        }
      }

    });
  },
  mounted() {
  },
  methods: {

    // 1. sessionId 취득하기.
    async retriveSessionId( CALL_ID, speakerDiv) {

      console.log("retriveSessionId:::::::" , CALL_ID, speakerDiv );

      this.CALL_ID = CALL_ID;
      this.speakerDiv = speakerDiv;

      let returnData = '';
      let params = {
        method: 'GET',
        url: this.baseSessionUrl.concat("?call-id=",this.CALL_ID).concat("&speaker-div=",this.speakerDiv).concat("&model=","KOREAN_ONLINE_8K").concat("&project=","fc849953-84d9-4914-a55e-6c6641a7d7cd"),
        headers: {},
      }
      await axios.request(params)
          .then(response=>{
            console.log( response );
            if(response.data){
              returnData = response.data.sessionId;
            }
          })
          .catch(error=>{
            console.log( error );
            if( retryCnt > 0 ) {  // 재연결 시도
              if( speakerDiv === 'R1' ) setTimeout(this.sttRxConnection, 1000);
              if( speakerDiv === 'T1' ) setTimeout(this.sttTxConnection, 1000);
              --retryCnt;
              console.log( "retryCnt : " + retryCnt);
            }
          });

      return returnData;

    },

    //Rx(고객 : R1)
    async sttRxConnection(){
      /*------------------------------------------------------*/
      /* STT 실시간 view - 모니터링 연결                         */
      /*------------------------------------------------------*/
      //https://haiv.timbel.net:3443/stt-online/monitoring-online-connect/

      // 1. sessionId취득  - STT 실시간 view - 모니터링 연결
      if(this.CALL_ID) this.originalSessionIdRx = await this.retriveSessionId(this.CALL_ID, 'R1');

      console.log("/*------------------------------------------------------*/");
      console.log(" Rx(고객 : R1) sttRxConnection - STT 실시간 view - 모니터링 연결 originalSessionIdRx::", this.originalSessionIdRx);
      console.log("/*------------------------------------------------------*/");

      // 2. 취득한 아이디로 WebSocket Session 연결.
      if( !this.mixin_isEmpty( this.originalSessionIdRx ) ) {
        this.retryCnt = 10;
        this.socketRx = new WebSocket(this.baseSocketUrl.concat("?original-session-id=" + this.originalSessionIdRx));

        // Update status when connected
        this.socketRx.addEventListener("open", () => {
          this.connectionStatusRx = "Connected";
          console.log("RX::::::WebSocket connected");
        });

        // Handle incoming messages
        this.socketRx.addEventListener("message", (event) => {
          let eventJson = JSON.parse(event.data);
          console.log("RX::::::Message from server:", eventJson);
          let jsonStt = {
                "speakerDiv": 'R1'
              , "date" : this.mixin_convertDate(this.$moment(new Date(this.mixin_convertDate(this.CALL_DATE, 'yyyy-MM-dd HH:mm:ss'))).add((eventJson['segment-start'] * 1000), 'milliseconds').format("YYYYMMDDHHmmss"), 'yyyy-MM-dd HH:mm:ss')
              , "status": eventJson['status']
              , "segment": eventJson['segment']
              , "segment-start": eventJson['segment-start']
              , "segment-length": eventJson['segment-length']
              , "total-length": eventJson['total-length']
              , "bayes-risk": eventJson['bayes-risk']
              , "transcript": eventJson['result']['hypotheses'][0]['transcript']
              , type:'cs'
              , name : '고객'
              , img : require('@/assets/img/@profile_user.png')
              , isBmk: false
              , isBmkDate:''
              , isBlack: false  //사용안함
              , modelVoc: false //사용안함
              , modelReuqest: false //사용안함
          }

          let talkData = this.$store.getters["statusStore/GE_TALK_DATA"];
          talkData.push(jsonStt);
          this.$store.dispatch('statusStore/AC_TALK_DATA', talkData);

          if(!this.IS_ENTER_MONITOR) {
            //모니터링으로 들어온경우가 아닌 상담사가 통화하는 경우 아래 수행.
            // 1. STT에서 넘어온 대화 REDIS 에 저장.
            this.common_postCall("/api/itf/stt/insertDataRedis", { CALL_ID : this.CALL_ID, STT_DATA : JSON.stringify( talkData )}, {});

            // 2. 검색엔진에게 데이터 전송(일정글자수 모이면 전송함.)
            if( jsonStt.transcript.length > 1) this.selectSearchEngine(jsonStt.transcript);
          }
        });

        // Handle connection errors
        this.socketRx.addEventListener("error", (error) => {
          this.connectionStatusRx = "Error";
          console.error("RX::::::WebSocket error:", error);
        });

        // Update status when connection is closed
        this.socketRx.addEventListener("close", () => {
          this.connectionStatusRx = "Disconnected";
          console.log("RX::::::WebSocket connection closed");
          if(this.socketRx) this.socketRx.close(); this.socketRx = null;
        });

      }else {
        this.showAlertCaution( {msg:'STT 서버에 sessionId 요청 응답에 실패하였습니다.'})
      }
    },

    //Tx(상담사 : T1)
    async sttTxConnection(){

      /*------------------------------------------------------*/
      /* STT 실시간 view - 모니터링 연결                         */
      /*------------------------------------------------------*/
      //https://haiv.timbel.net:3443/stt-online/monitoring-online-connect/

      // 1. sessionId취득  - STT 실시간 view - 모니터링 연결
      if(this.CALL_ID) this.originalSessionIdTx = await this.retriveSessionId(this.CALL_ID, 'T1');

      console.log("/*------------------------------------------------------*/");
      console.log(" Tx(상담사 : T1) sttTxConnection - STT 실시간 view - 모니터링 연결 originalSessionIdTx::" , this.originalSessionIdTx);
      console.log("/*------------------------------------------------------*/");

      // 2. 취득한 아이디로 WebSocket Session 연결.
      if( !this.mixin_isEmpty( this.originalSessionIdTx ) ) {
        this.retryCnt = 0;
        this.socketTx = new WebSocket(this.baseSocketUrl.concat("?original-session-id=" + this.originalSessionIdTx));

        // Update status when connected
        this.socketTx.addEventListener("open", () => {
          this.connectionStatusTx = "TX::::::Connected";
          console.log("TX::::::WebSocket connected");
        });

        // Handle incoming messages
        this.socketTx.addEventListener("message", (event) => {
          let eventJson = JSON.parse(event.data);
          console.log("TX::::::Message from server:", eventJson);
          let jsonStt = {
            "speakerDiv": 'T1'
            , "date" : this.mixin_convertDate(this.$moment(new Date(this.mixin_convertDate(this.CALL_DATE, 'yyyy-MM-dd HH:mm:ss'))).add((eventJson['segment-start'] * 1000), 'milliseconds').format("YYYYMMDDHHmmss"), 'yyyy-MM-dd HH:mm:ss')
            , "status": eventJson['status']
            , "segment": eventJson['segment']
            , "segment-start": eventJson['segment-start']
            , "segment-length": eventJson['segment-length']
            , "total-length": eventJson['total-length']
            , "bayes-risk": eventJson['bayes-risk']
            , "transcript": eventJson['result']['hypotheses'][0]['transcript']
            , type:'manager'
            , name : this.CUSL_PROFILE.USER_NM
            , img : this.CUSL_PROFILE.IMG
            , isBmk: false
            , isBmkDate:''
            , isBlack: false  //사용안함
            , modelVoc: false //사용안함
            , modelReuqest: false //사용안함
          }

          let talkData = this.$store.getters["statusStore/GE_TALK_DATA"];
          talkData.push(jsonStt);
          this.$store.dispatch('statusStore/AC_TALK_DATA', talkData);
          if(!this.IS_ENTER_MONITOR) {
            //모니터링으로 들어온경우가 아닌 상담사가 통화하는 경우 아래 수행.
            // 1. STT에서 넘어온 대화 REDIS 에 저장.
            this.common_postCall("/api/itf/stt/insertDataRedis", { CALL_ID : this.CALL_ID, STT_DATA : JSON.stringify( talkData )}, {});

            // 2. 검색엔진에게 데이터 전송(일정글자수 모이면 전송함.)

            if( jsonStt.transcript.length > 1 ) this.selectSearchEngine(jsonStt.transcript);

          }
        });

        // Handle connection errors
        this.socketTx.addEventListener("error", (error) => {
          this.connectionStatusTx = "Error";
          console.error("TX::::::WebSocket error:", error);
        });

        // Update status when connection is closed
        this.socketTx.addEventListener("close", () => {
          console.log("TX::::::WebSocket connection closed");
          this.connectionStatusTx = "Disconnected";
          if(this.socketTx) this.socketTx.close(); this.socketTx = null;
        });

      }else {
        this.showAlertCaution( {msg:'STT 서버에 sessionId 요청 응답에 실패하였습니다.'})
      }
    },
    async sttRxConnectionClose(){
      console.log("RX::::::sttRxConnectionClose");
      if(this.socketRx) this.socketRx.close(); this.socketRx = null;
    },
    async sttTxConnectionClose(){
      console.log("TX::::::sttTxConnectionClose");
      if(this.socketTx) this.socketTx.close(); this.socketTx = null;
    },

    /* 검색엔진에게 데이터 전송 및 리시브 */
    selectSearchEngine(txt){

      console.log( "this.sendSearchWords.length :: ", this.sendSearchWordsLimits, this.sendSearchWords.length, this.sendSearchWords );

      if(txt !== undefined && txt.length > 1) {
        if( this.sendSearchWords.length !== 0 ) this.sendSearchWords += " "

        this.sendSearchWords += txt;
        if( this.sendSearchWords.length > this.sendSearchWordsLimits) {
          this.selectSearchEngineProcess();
          console.log(">>>>>>>>>>>>>>>>>>>>>sendSearchEngine::", this.sendSearchWords);
        }

      }
    },
    selectSearchEngineProcess() {
      let _this = this;
      if( !this.mixin_isEmpty( this.sendSearchWords ) ) {
        let paramData = {
          text: this.sendSearchWords,
          domain: this.computedUserCenter,
          limit: 10
        };
        this.sendSearchWords = "";

        let params = {method: 'POST', url: this.baseSearchUrl + "/ksm/total/total", headers: {}, data:JSON.stringify(paramData)};

        $.ajax(params).done(function (response) {
          console.log(">>>>>>>>>>>>>>>>>>>>>sendSearchEngine.search.response::", response);
          // 지식
          if( response.v_plt_kms_conts.result.rows.length > 0) {
            let dataArr = [];
            let dataKeywordArr = [];
            response.v_plt_kms_conts.result.rows.map(item => {
              //지식컨텐츠
              dataArr.push(item.fields);

              //지식해시테그
              let tags = item.fields.hash_tag.split(",");
              tags.map((tag,i) => {
                dataKeywordArr.push({
                  tp : 'kms',
                  cont_id : item.fields.kms_conts_id,
                  text : tags[i],
                  value : tags[i],
                  sub_text: '',
                })
              });
            });
            let talkDataKMS = _this.$store.getters["statusStore/GE_TALK_DATA_SEARCH_KMS"];
            const map = new Map();
            talkDataKMS.forEach(item => map.set(item.kms_conts_id, item));
            dataArr.forEach(item => map.set(item.kms_conts_id, {...map.get(item.kms_conts_id), ...item}));
            let uniqueArr = Array.from(map.values());
            _this.$store.dispatch('statusStore/AC_TALK_DATA_SEARCH_KMS', uniqueArr);
            _this.setSearchEngineKeyword( dataKeywordArr );
          }

          // 공고문
          if( response.v_lcc_clcn_is.result.rows.length > 0) {
            let dataArr = [];
            response.v_lcc_clcn_is.result.rows.map(item => {
              //공고문
              item.fields["ATTACH_NMS_ARR"] = item.fields.attach_nms.split("|");
              item.fields["ATTACH_EXTS_ARR"] = item.fields.attach_nms.split("|").map(row => {
                  return _this.mixin_getExtensionOfFilename(row);
              });
              item.fields["ATTACH_IDS_ARR"] = item.fields.attach_ids.split("|");
              dataArr.push(item.fields);
            });
            let talkDataCLCN = _this.$store.getters["statusStore/GE_TALK_DATA_SEARCH_CLCN"];
            const map = new Map();
            talkDataCLCN.forEach(item => map.set(item.pan_id, item));
            dataArr.forEach(item => map.set(item.pan_id, {...map.get(item.pan_id), ...item}));
            let uniqueArr = Array.from(map.values());
            _this.$store.dispatch('statusStore/AC_TALK_DATA_SEARCH_CLCN', uniqueArr);
          }

          //주소 => 키워드로
          if( response.result_address.result.length > 0) {
            console.log(">>>>>>>>>>>>>>>>>>>>>sendSearchEngine.result_address.dataArr::", dataArr);
            const dataArr = [];
            response.result_address.result.map(item=>{
              dataArr.push({
                 tp : 'address',
                 cont_id : '',
                 text : item.address,
                 value : item.address,
                sub_text: '',
               })
            });
            console.log(">>>>>>>>>>>>>>>>>>>>>sendSearchEngine.result_address.dataArr::", dataArr);
            _this.setSearchEngineKeyword(dataArr);
          }

          //주소 => 키워드로
          if( response.v_as_mma_mntn_flw_cs_m.length > 0) {
            const dataArr = [];
            response.v_as_mma_mntn_flw_cs_m.map(item=>{
              let flwname = item.split(":");
              dataArr.push({
                tp : 'as',
                cont_id : '',
                text : flwname[0],
                value : item,
                sub_text: flwname[1],
              })
            });
            _this.setSearchEngineKeyword(dataArr);
          }
        })
        .fail(function (data, textStatus, errorThrown) {
          console.log(">>>>>>>>>>>>>>>>>>>>>sendSearchEngine.search.fail::", data, textStatus, errorThrown);
        });
      }
    },

    setSearchEngineKeyword(items) {
      let talkDataKEYWORD = this.$store.getters["statusStore/GE_TALK_DATA_SEARCH_KEYWORD"];

      const map = new Map();
      talkDataKEYWORD.forEach(item => map.set(item.value, item));
      items.forEach(item => map.set(item.value, {...map.get(item.value), ...item}));
      let uniqueArr = Array.from(map.values());
      this.$store.dispatch('statusStore/AC_TALK_DATA_SEARCH_KEYWORD', uniqueArr);
    },

    /* 통화 종료이후 전체데이터 검색엔진에게 전송하여 추천 상담유형 및 긍정부정 정보 조회용도. */
    async summarizeSearchEngine(){

      let talkData = this.$store.getters["statusStore/GE_TALK_DATA"];
      let talkData_TOT = talkData.filter(item => item.transcript.length > 1).map(row=>{return row.transcript}).join(" "); //전체
      let talkData_R1 = talkData.filter(item => item.speakerDiv === 'R1' && item.transcript.length > 1).map(row=>{return row.transcript}).join(" "); //고객
      let talkData_T1 = talkData.filter(item => item.speakerDiv === 'T1' && item.transcript.length > 1).map(row=>{return row.transcript}).join(" "); //상담사
      //
       console.log( "summarizeSearchEngine.talkData_TOT :: ", talkData_TOT);
       console.log( "summarizeSearchEngine.talkData_R1 :: ", talkData_R1);
       console.log( "summarizeSearchEngine.talkData_T1 :: ", talkData_T1);

      if( !this.mixin_isEmpty( talkData_R1 ) || !this.mixin_isEmpty( talkData_T1 ) ) {
        this.summarizeSearchEngineProcess("R1", talkData_R1);
        this.summarizeSearchEngineProcess("T1", talkData_T1);
        this.cuttSearchEngineProcess(talkData_TOT);  //상담유형 추천
      }
    },
    async summarizeSearchEngineProcess( type, txt) {
      if( !this.mixin_isEmpty( txt ) ) {
        let _this = this;
        let sUrl = this.baseSearchUrl + "/ksm/sum/summarize";
        let paramData = {text: txt};
        let params = {method: 'POST', url: sUrl, async: false, headers: {}, data: JSON.stringify(paramData)};

        // eslint-disable-next-line no-undef
        await $.ajax(params).done(function (response) {

          console.log(type + ">>>>>>>>>>>>>>>>>>>>>sendSearchEngine.summarize.response::", response);

          if (type === 'R1' && response.result[0].theme.length > 0) _this.$store.dispatch('statusStore/AC_TALK_DATA_SEARCH_R1_SUMMARIZE', response.result[0].theme[0].string); //R1 요약본
          if (type === 'R1' && response.telephone.telephone) _this.$store.dispatch('statusStore/AC_TALK_DATA_SEARCH_R1_PHONE', response.telephone.telephone); //R1 고객추출전화번호 요약본
          if (type === 'R1' && response.name.name) _this.$store.dispatch('statusStore/AC_TALK_DATA_SEARCH_R1_NAME', response.name.name); //R1 고객추출이름 요약본
          if (type === 'T1' && response.result[0].theme.length > 0) _this.$store.dispatch('statusStore/AC_TALK_DATA_SEARCH_T1_SUMMARIZE', response.result[0].theme[0].string); //T1 요약본

          let talkData_R1 = _this.$store.getters["statusStore/GE_TALK_DATA_SEARCH_R1_SUMMARIZE"];
          let talkData_T1 = _this.$store.getters["statusStore/GE_TALK_DATA_SEARCH_T1_SUMMARIZE"];

          console.log("talkData_R1 : " + talkData_R1);
          console.log("talkData_T1 : " + talkData_T1);
        })
        .fail(function (data, textStatus, errorThrown) {
          console.log(">>>>>>>>>>>>>>>>>>>>>sendSearchEngine.summarize.fail::", data, textStatus, errorThrown);
        });
      }
    },

    /* 상담유형 후천 */
    async cuttSearchEngineProcess( txt ) {
      let _this = this;
      let sUrl = this.baseSearchUrl + "/ksm/cutt/cutt";
      let paramData = {
        text: txt,
        domain: this.computedUserCenter,
        limit: 3
      };
      let params = {method: 'POST', url: sUrl, async:false, headers: {}, data: JSON.stringify(paramData) };

      // eslint-disable-next-line no-undef
      await $.ajax(params).done(function (response) {

        console.log(">>>>>>>>>>>>>>>>>>>>>sendSearchEngine.cutt.response::", response);
        if( response.v_plt_cutt_type.result.rows.length > 0) {
          let dataArr = [];
          response.v_plt_cutt_type.result.rows.map(item => {
            dataArr.push({
              id: item.fields.full_path_id.split(">").slice(2).join(">"),
              text: item.fields.full_path.split(">").slice(2).join(">")
            });
          });
          _this.$store.dispatch('statusStore/AC_TALK_DATA_SEARCH_CUTT', dataArr);
        }

      })
      .fail(function (data, textStatus, errorThrown) {
        console.log(">>>>>>>>>>>>>>>>>>>>>sendSearchEngine.summarize.fail::", data, textStatus, errorThrown);
      });
    },
  }
};
</script>

<style>

</style>
