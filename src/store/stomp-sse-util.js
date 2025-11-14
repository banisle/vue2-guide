/**
 * websocket 관련 비지니스 
 */

import Vue      from 'vue';
import SockJS   from "sockjs-client";
import Stomp    from "webstomp-client";

import _ from 'lodash';
import { mixin } from "@/mixin/mixin.js"

import { eventBus } from "@/store/eventBus.js";           //Event Bus
 
export const stompSseUtil = new Vue({
    mixins: [mixin],
    data() {
        return {
            sseConnected   : false,
            sseStompClient : '',
            baseSocketUrl: '/sse-api/v1',
            token : '',
            lgnId : '',
            userId : '',
            roomCenterId : '',
            roomTeamId : '',
            roomId : '',
            custcoId: '',
            schemaId: '',
            ipAddr: ''
        };
    },
    methods: {

        /**
         * connnected 여부
         * @returns
         */
        isConnected() {
            return this.sseConnected;
        },

        /**
         * connnected 값 셋팅
         * @param {*} val
         */
        setConnected(val) {
            this.sseConnected = val;
        },

        /**
         * websocket connect
         * @param {*} connectCallback 연결 성공 콜백
         * @param {*} errorCallback  연결 실패 콜백 ( 재연결 시도 )
         *  @param {*} store
         */
        //connect(connectCallback, errorCallback, contactInfo, store) {
        connect(connectCallback, errorCallback) {

            //브라우저 알림표시 허용여부
            if (window.Notification) {
                Notification.requestPermission();
            }

            if (!this.sseConnected) {

                const sockJsUrl = this.baseSocketUrl + "/sse-secured/ws-stomp?l="+ this.lgnId.replace('#', '%23') +"&u=" + this.userId + "&c=" + this.custcoId + "&s=" + this.schemaId + "&r=" + this.roomId;

                let options = {debug: false, protocols: Stomp.VERSIONS.supportedProtocols()};

                this.socket = new SockJS(sockJsUrl);
                this.sseStompClient = Stomp.over(this.socket, options);

                this.sseStompClient.reconnect_delay = 3000;
                this.sseStompClient.heartbeat.outgoing = 3000;
                this.sseStompClient.heartbeat.incoming = 3000;

                if(process.env.VUE_APP_ENV === 'production') {
                    this.sseStompClient.debug = function() {};
                }

                this.sseStompClient.connect(
                    {
                        "token":this.token
                        , "Authorization":  "bearer " + window.sessionStorage.getItem("token")
                        , "userId" : this.userId
                        , "lgnId" : this.lgnId
                        , "ipAddr": this.ipAddr
                        , "roomId" : this.roomId
                        , "roomCenterId" : this.roomCenterId
                        , "roomTeamId" : this.roomTeamId
                        , 'userIdentifier' : this.roomId + "_##_"+ this.userId
                    },
                    frame => {
                       this.setConnected(true);
                        connectCallback(frame)
                    },
                    error => {
                        // console.log("stompUtil connect LostConnect errorCallback >>>> " + this.token);
                        this.setConnected(false);
                        errorCallback(error)
                    },
                );

                this.sseStompClient.ws.onclose = function() {
                    errorCallback('close event');
                };

            }
            else {
                connectCallback();
            }
        },

        /**
         * 웹소켓 연결 종료
         */
        disconnect() {

            if(this.sseStompClient  != null) {

                this.sseStompClient.disconnect({
                    "token":this.token
                    , "Authorization":  "bearer " + window.sessionStorage.getItem("token")
                    , "userId" : this.userId
                    , "lgnId" : this.lgnId
                    , "ipAddr": this.ipAddr
                    , "roomId" : this.roomId
                    , "roomCenterId" : this.roomCenterId
                    , "roomTeamId" : this.roomTeamId
                    , 'userIdentifier' : this.roomId + "_##_"+ this.userId
                });
                this.setConnected(false);
            }
        },

        /**
         * SUB 구독
         * @param _this
         * @param {*} uri               구독 uri
         * @param {*} sseMessage       구독시 data
         * @returns
         */
        subscribe(_this, uri, sseMessage) {
           return this.sseStompClient.subscribe(uri, message => {
               this.onmessage(_this, message);
           }, sseMessage);
        },
 
        /**
         * 재구독 재연결 후 ( 네트웍 단절 후 구독 다시 해줘야 함.)
         */ 
        subscribeAfterReconnect(subList) {
            let subListLen  = subList.length;   
            
            if(subList != null && subListLen > 0) {
                let i = 0;
                for(; i<subListLen; i++) {
                    var subObj = subList[i];
                    this.subscribe(subObj.uri, subObj.chatMessage);
                }
            }
        },

        /**
         * 메시지 인입
         * @param _this
         * @param {*} message
         */
        onmessage(_this, message) {
            let body = JSON.parse(message.body);
            if( !body.pos ) body.pos = "right";
            if( !body.second ) body.second = "5";

            this.sseProcess( _this, body );

            // if( body.receiver === 'ALL'  ){
            //     this.sseProcessSystem( _this, body );
            // }else if( body.roomId === this.roomCenterId ){
            //     this.sseProcess( _this, body );
            //
            // }else if( body.roomId === this.roomTeamId ){
            //     this.sseProcess( _this, body );
            //
            // }else if( body.receiver === this.userId && body.roomId === this.roomId){ //
            //     this.sseProcess( _this, body ); //개인메시지용.
            // }
        },

        sseProcess( _this, body ) {
            this.sseProcessSystem(_this, body);
            if( body.type === "MESSAGE_APLY" ) { //.
                let sMsg = '';
                let result = JSON.parse(body.message);

                if('REFRESH_TARGET' in result) {
                    let rts = result.REFRESH_TARGET.split(",");
                    for( let i=0; i<rts.length; i++ ) {
                        setTimeout(() => { _this.mixin_reloadCuttStat( rts[i] ); }, 200);
                    }
                    if('MESSAGE' in result) sMsg = result.MESSAGE;
                }else{
                    sMsg = body.message;
                }

                let isShow = true;
                if('MESSAGE_ALRAM' in result) {
                    if( result.MESSAGE_ALRAM === 'N' ) isShow = false;
                }

                // this.$eventBus.$emit("eventRequestApplyList", body.message); // 리더=>HomeProfile.vue-신청현황 조회 , 상담사=> HomeManagerMy.vue-상담사의 나의신청현황 조회
                // this.$eventBus.$emit("eventSideVacation", body.message); // HomeSideVacation.vue - 휴가신청현황 리더 + 상담사
                // this.$eventBus.$emit("eventMyRequestList", body.message); // HomeManagerMy.vue - 상담사의 나의신청현황 조회

                if( isShow ) {    //센터장
                    const sender = result.SENDER;
                    //긴급 스케줄러이관건은 토스트가 사라지지 않아야 함(24시간 세팅.)
                    if(sender && sender == 'TRANS_SCHEDULER_EMER') {
                        _this.showMainToast({msg: sMsg,  icon: 'mdi-information-outline', class: 'warning'})
                    }
                    else if(sMsg) _this.showToast({msg: sMsg , class: 'info', hasToastIcon: true, icon: 'mdi-information-outline', time: (5 * 1000), type: 'right', progress: true, close: true});
                }
            }else if( body.type === "MESSAGE_EMIT" ) { //.
                let sMsg = '';
                let result = JSON.parse(body.message);

                if('EMIT' in result) {
                    let rts = result.EMIT.split(",");
                    for( let i=0; i<rts.length; i++ ) {
                        setTimeout(() => { _this.$eventBus.$emit( rts[i], result.MESSAGE ); }, 200);
                    }
                }
            }
        },

        sseProcessSystem(_this, body) {
            if( body.type === "SYSTEM_LOGOUT" ) {    //로그아웃
                setTimeout(function(){ _this.forceLogout( body.message );}, (1000));
            }else if( body.type === "SYSTEM_CHECK" ) {
                let msg = '잠시 후 시스템점검 예정입니다.'+ Number(body.second) +'초 후 자동로그아웃 됩니다.';
                _this.showToast({msg: msg , class: 'info', hasToastIcon: true, icon: 'mdi-information-outline', time: (Number(body.second) * 1000), type: body.pos, progress: true, close: true});
                setTimeout(function() {_this.forceLogout();}, (Number(body.second) * 1000));
            }else if( body.type === "SYSTEM_MESSAGE" ) {
                _this.showToast({msg: body.message , class: 'info', hasToastIcon: true, icon: 'mdi-information-outline', time: (5 * 1000), type: body.pos, progress: true, close: true});
                this.$eventBus.$emit("renewalMsgList");
            }else if( body.type === "SYSTEM_REFRESH" ) { //강제 새로고침
                setTimeout(function() {_this.forceRefresh();}, (Number(body.second) * 1000));
            }else if( body.type === "ENV_SETTING" ) { //고객사별 관리자 환경 설정 변경시 호출
                this.$eventBus.$emit("initSettingEnv", body.message); //TopArea.vue store 셋팅 호출
            }
        }
     },
 })
 