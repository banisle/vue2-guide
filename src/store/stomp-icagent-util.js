/**
 * websocket 관련 비지니스 
 */

import Vue      from 'vue';
import SockJS   from "sockjs-client";
import Stomp    from "webstomp-client";

import _ from 'lodash';
import { mixin } from "@/mixin/mixin.js"

import { eventBus } from "@/store/eventBus.js";           //Event Bus
 
export const stompICAGENTUtil = new Vue({
    mixins: [mixin],
    data() {
        return {
            icagentConnected   : false,
            icagentStompClient : '',
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
            return this.icagentConnected;
        },

        /**
         * connnected 값 셋팅
         * @param {*} val
         */
        setConnected(val) {
            this.icagentConnected = val;
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

            if (!this.icagentConnected) {

                const sockJsUrl = this.baseSocketUrl + "/sse-secured/ws-stomp?tp=ICAGENT&l="+ this.lgnId.replace('#', '%23') +"&u=" + this.userId + "&c=" + this.custcoId + "&s=" + this.schemaId;

                let options = {debug: false, protocols: Stomp.VERSIONS.supportedProtocols()};

                this.socket = new SockJS(sockJsUrl);
                this.icagentStompClient = Stomp.over(this.socket, options);

                this.icagentStompClient.reconnect_delay = 3000;
                this.icagentStompClient.heartbeat.outgoing = 3000;
                this.icagentStompClient.heartbeat.incoming = 3000;

                if(process.env.VUE_APP_ENV === 'production') {
                    this.icagentStompClient.debug = function() {};
                }

                this.icagentStompClient.connect(
                    {
                        "token":this.token
                        , "Authorization":  "bearer " + window.sessionStorage.getItem("token")
                        , "userId" : this.userId
                        , "lgnId" : this.lgnId
                        , "ipAddr": this.ipAddr
                        , "roomId" : this.roomId
                        , "roomCenterId" : this.roomCenterId
                        , "roomTeamId" : this.roomTeamId
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

                this.icagentStompClient.ws.onclose = function() {
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

            if(this.icagentStompClient  != null) {

                this.icagentStompClient.disconnect();
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
           return this.icagentStompClient.subscribe(uri, message => {
               this.onmessage(_this, message);
           }, sseMessage);
        },

        /**
         * 메시지 인입
         * @param _this
         * @param {*} message
         */
        onmessage(_this, message) {
            let body = JSON.parse(message.body);
            this.$eventBus.$emit('emitRecieveRedisICAGENT', body);
        },
     },
 })
 