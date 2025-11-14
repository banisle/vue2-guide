import axios from "axios";
import store from "@/store";

import Vue      from 'vue';

export const ipronCallUtil = new Vue({
    data: () => ({
        bReconnect : false,
        sessionKey : '',
        UCID : '',
        ConnId : '',
        Hop : '',
        PrevConnId : '',
        CallId : '',
        ExHandle : '',
        newExHandle : '',
        CALL_ID : '',
        PREV_CALL_ID : '',
        CUSL_LOGIN_STAT : 40,
        CUSL_LOGIN_SUB_STAT : '',
        DSPTCH_NO : '16001004',//아웃바운드 대표번호(기본 마이홈 대표번호)
    }),
    methods: {
        openServer(){
            ipron.SetProtocol(process.env.VUE_APP_IPRON_PROTOCOL);
            ipron.SetServerInfo(process.env.VUE_APP_IPRON_IP_ADDR1, process.env.VUE_APP_IPRON_PORT, process.env.VUE_APP_IPRON_IP_ADDR2, process.env.VUE_APP_IPRON_PORT);
            ipron.SetHeartbeatInfo(process.env.VUE_APP_IPRON_HB_PERIOD, process.env.VUE_APP_IPRON_HB_ERR_CNT);
            ipron.OpenServer("EASD Test App", this.CBFuncEvent, this.CBFuncResponse);
        },

        closeServer(){
            // this.logoutAgent();
            
            store.commit("statusStore/MU_CUTT_ING", false); //상담 종료 처리
        },

        registerDn(){
            ipron.Register(store.getters["userStore/GE_USER_ROLE"].EXT_NO, process.env.VUE_APP_IPRON_TENANT_NAME);
        },
        
        unRegisterDn(){
            ipron.Unregister(store.getters["userStore/GE_USER_ROLE"].EXT_NO, process.env.VUE_APP_IPRON_TENANT_NAME);
        },

        //로그인
        loginAgent(defaultStat, defaultSubStat){
            ipron.AgentLogin(store.getters["userStore/GE_USER_ROLE"].EXT_NO
                            , store.getters["userStore/GE_USER_ROLE"].AGENT_ID
                            , '1'
                            , process.env.VUE_APP_IPRON_TENANT_NAME
                            , defaultStat
                            , defaultSubStat
                            , 0
                            , 4 /*SHA-2(512)*/
                            , '');
        },

        //로그아웃
        logoutAgent(){
            ipron.AgentLogout(store.getters["userStore/GE_USER_ROLE"].EXT_NO
                            , store.getters["userStore/GE_USER_ROLE"].AGENT_ID
                            , process.env.VUE_APP_IPRON_TENANT_NAME
                            , 0);
        },

        //소프트폰 체크
        getDeviceActivate() {
            ipron.GetDeviceActivate(process.env.VUE_APP_IPRON_TENANT_NAME
                                , store.getters["userStore/GE_USER_ROLE"].EXT_NO
                                , 0 /*GetMediaType()*/
                                , '' /*TextAgtPrivateData.value*/);
        },

        //전화받기
        answerCall(){
            ipron.AnswerCall(store.getters["userStore/GE_USER_ROLE"].EXT_NO
                            , this.ConnId
                            , this.ExHandle
                            , 0 /*GetSrcMediaType()*/);
        },

        //전화걸기
        obCall(obCallPhnNo, sExHandle) {
            ipron.MakeCall(store.getters["userStore/GE_USER_ROLE"].EXT_NO
                        , (obCallPhnNo.length > 5 ? '9' + obCallPhnNo.replace(/[^0-9]/g, ''):obCallPhnNo)
                        , store.getters["userStore/GE_USER_ROLE"].DSPTCH_NO /*TextCallObCallingDN.value*/
                        , 0 /*Number(TextCallSkillLevel.value) */
                        , 0 /*Number(TextCallPriority.value)*/
                        , '' /*TextCallRelationAgentDN.value*/
                        , '' /*TextCallRelationAgentID.value*/
                        , 0 /*GetRelationMethod()*/
                        , 0 /*GetRouteMethod()*/
                        , 0 /*Number(TextCallRouteSkillID.value)*/
                        , 0 /*Number(TextCallRouteGroupID.value)*/
                        , this.UCID /*TextCallUcid.value*/
                        , !sExHandle ? this.ExHandle : sExHandle /*topPage.TextExHandle.value*/
                        , 0 /*GetSrcMediaType()*/
                        , 0 /*GetUsePrevAgent()*/
                        , 0 /*GetUseDesignatedAgent()*/
                        , 0 /*Number(TextCallRelationTimeout.value)*/
                        , 0 /*Number(TextHop.value)*/);
        },

        //전화 끊기
        clearCall(){
            ipron.ClearCall(store.getters["userStore/GE_USER_ROLE"].EXT_NO
                        , this.ConnId
                        , 0
                        , 0 /*GetSrcMediaType()*/);
        },

        //보류
        holdCall(){
            ipron.HoldCall(store.getters["userStore/GE_USER_ROLE"].EXT_NO
                        , this.ConnId
                        , 0
                        , 0 /*GetSrcMediaType()*/);
        },
        
        //보류 해제
        retrieveCall(ConnId){
            ipron.RetrieveCall(store.getters["userStore/GE_USER_ROLE"].EXT_NO
                        , ConnId
                        , 0
                        , 0 /*GetSrcMediaType()*/);
        },

        //Agent(상담사) 상태 지정
        SetAgentState(sState, sSubState){
            ipron.SetAgentState(store.getters["userStore/GE_USER_ROLE"].AGENT_ID
                                , process.env.VUE_APP_IPRON_TENANT_NAME
                                , sState /*GetAgentStateList1()*/
                                , sSubState /*GetAgentSubcode()*/
                                , 0
                                , '' /*GetMediaSet()*/);
            if(sState === 30){
                this.$eventBus.$emit('cuslMoveScreen', sSubState); //상담사 이석 화면 스크린
            }
        },

        //CTI Queue상태 조회용(인입, 대기, 포기호..)
        getQueueTrafficEx(){
            ipron.GetQueueTrafficEx(process.env.VUE_APP_IPRON_TENANT_NAME
                            , this.computedUserCTIQ
                            , ''
                            , ''
                            , ''
                            , ''
            );
        },
        
        //개인 전광판
        getAgentReport(){
            ipron.GetDIAgentReport(store.getters["userStore/GE_USER_ROLE"].AGENT_ID
                            , process.env.VUE_APP_IPRON_TENANT_NAME
                            , '0'
            );
        },

        //상담원 상태
        getAgentInfo(){
            ipron.GetAgentInfo(process.env.VUE_APP_IPRON_TENANT_NAME
                            , store.getters["userStore/GE_USER_ROLE"].AGENT_ID
                            , '' /*TextAgtPrivateData2.value*/
            );
        },
        
        //In / Out 구분하여 상담원 후처리 상태 설정
        clearCallAftState(inOUt){
            let inStat = inOUt === 2?'60':'';
            let inSubStat = inOUt === 2?'1':'';

            let outStat = inOUt === 3?'60':'';
            let outSubStat = inOUt === 3?'2':'';
            ipron.SetAFTCallStateEx(store.getters["userStore/GE_USER_ROLE"].AGENT_ID
                                    , process.env.VUE_APP_IPRON_TENANT_NAME
                                    , inStat
                                    , inSubStat /*IN후처리 */
                                    , outStat
                                    , outSubStat /*OUT후처리 */
                                    , '' /*GetMediaSet()*/);
        },

        //통화중 Web 비정상 종료시 재로그인 한 경우 call 정보 획득용
        getCallInfoEx(callid){
            ipron.GetCallInfoEx(callid);
        },

        //connection 별 사용자 데이터 가져오기
        getUserdata(connId, exHandle){
            ipron.GetUserdata(process.env.VUE_APP_IPRON_TENANT_NAME
                            , store.getters["userStore/GE_USER_ROLE"].EXT_NO
                            , connId
                            , exHandle);
        },
        
        //배려고객 임시차단
        custTempBlockCall(){
            this.createExtension(); //extension 생성
            if(this.newExHandle > -1){
                ipron.EXTAddRecord(this.newExHandle, 'UEI23', '000');
            }

            ipron.DeflectCall(store.getters["userStore/GE_USER_ROLE"].EXT_NO
                            , this.ConnId
                            , 8987
                            , store.getters["userStore/GE_USER_ROLE"].DSPTCH_NO /*TextCallObCallingDN.value */
                            , 0 /*Number(TextCallSkillLevel.value) */
                            , 0 /*Number(TextCallPriority.value) */
                            , 8987
                            , ''
                            , 0 /*GetRelationMethod() (0 : 대기, 1 : 예약 2 : 우선)*/
                            , 0 /*GetRouteMethod() (0 : Skill, 1 : Group, 2 : GroupSkill)*/
                            , 0 /*Number(TextCallRouteSkillID.value)*/
                            , 0 /*Number(TextCallRouteGroupID.value)*/
                            , 0 /*Number(TextCallRouteGroupID.value)*/
                            , this.newExHandle /*topPage.TextExHandle.value*/
                            , 0 /*GetSrcMediaType()*/
                            , 0 /*GetUsePrevAgent()*/
                            , 0 /*GetUseDesignatedAgent()*/
                            , 0 /*Number(TextCallRelationTimeout.value)*/);
        },

        //당첨 ARS
        custPrizeArs(){
            ipron.DeflectCall(store.getters["userStore/GE_USER_ROLE"].EXT_NO
                            , this.ConnId
                            , 8911
                            , store.getters["userStore/GE_USER_ROLE"].DSPTCH_NO /*TextCallObCallingDN.value */
                            , 0 /*Number(TextCallSkillLevel.value) */
                            , 0 /*Number(TextCallPriority.value) */
                            , 8911
                            , ''
                            , 0 /*GetRelationMethod() (0 : 대기, 1 : 예약 2 : 우선)*/
                            , 0 /*GetRouteMethod() (0 : Skill, 1 : Group, 2 : GroupSkill)*/
                            , 0 /*Number(TextCallRouteSkillID.value)*/
                            , 0 /*Number(TextCallRouteGroupID.value)*/
                            , 0 /*Number(TextCallRouteGroupID.value)*/
                            , '' /*this.newExHandletopPage.TextExHandle.value*/
                            , 0 /*GetSrcMediaType()*/
                            , 0 /*GetUsePrevAgent()*/
                            , 0 /*GetUseDesignatedAgent()*/
                            , 0 /*Number(TextCallRelationTimeout.value)*/);
        },

        //그룹 전환
        callGroupTransfer(groupExtNo){
            ipron.DeflectCall(store.getters["userStore/GE_USER_ROLE"].EXT_NO
                            , this.ConnId
                            , groupExtNo
                            , store.getters["userStore/GE_USER_ROLE"].DSPTCH_NO /*TextCallObCallingDN.value */
                            , 0 /*Number(TextCallSkillLevel.value) */
                            , 0 /*Number(TextCallPriority.value) */
                            , groupExtNo
                            , ''
                            , 0 /*GetRelationMethod() (0 : 대기, 1 : 예약 2 : 우선)*/
                            , 0 /*GetRouteMethod() (0 : Skill, 1 : Group, 2 : GroupSkill)*/
                            , 0 /*Number(TextCallRouteSkillID.value)*/
                            , 0 /*Number(TextCallRouteGroupID.value)*/
                            , 0 /*Number(TextCallRouteGroupID.value)*/
                            , '' /*this.newExHandletopPage.TextExHandle.value*/
                            , 0 /*GetSrcMediaType()*/
                            , 0 /*GetUsePrevAgent()*/
                            , 0 /*GetUseDesignatedAgent()*/
                            , 0 /*Number(TextCallRelationTimeout.value)*/);
        },

        //콜봇 안내
        linkCallBot(menuId){
            this.createExtension(); //extension 생성
            if(this.newExHandle > -1){
                ipron.EXTAddRecord(this.newExHandle, 'UEI38', menuId);
            }

            ipron.DeflectCall(store.getters["userStore/GE_USER_ROLE"].EXT_NO
                , this.ConnId
                , 8910
                , store.getters["userStore/GE_USER_ROLE"].DSPTCH_NO /*TextCallObCallingDN.value */
                , 0 /*Number(TextCallSkillLevel.value) */
                , 0 /*Number(TextCallPriority.value) */
                , 8910
                , ''
                , 0 /*GetRelationMethod() (0 : 대기, 1 : 예약 2 : 우선)*/
                , 0 /*GetRouteMethod() (0 : Skill, 1 : Group, 2 : GroupSkill)*/
                , 0 /*Number(TextCallRouteSkillID.value)*/
                , 0 /*Number(TextCallRouteGroupID.value)*/
                , 0 /*Number(TextCallRouteGroupID.value)*/
                , this.newExHandle /*this.newExHandletopPage.TextExHandle.value*/
                , 0 /*GetSrcMediaType()*/
                , 0 /*GetUsePrevAgent()*/
                , 0 /*GetUseDesignatedAgent()*/
                , 0 /*Number(TextCallRelationTimeout.value)*/);
        },
        
        //배려고객 경고 멘트 ARS (호 전환 후 전화를 다시 회수해야하는 경우)
        custCautionARS(sWarnTypeCd, iMentOrd){
            this.createExtension(); //extension 생성
            if(this.newExHandle > -1){
                let sUEIData = '00'+Number(sWarnTypeCd.replace('BLC', ''));
                ipron.EXTAddRecord(this.newExHandle, 'UEI23', sUEIData);

                let sUEIDKey = ''
                if(sUEIData === '002'){ //욕설
                    sUEIDKey = 'UEI24';
                }else if(sUEIData === '003'){ //폭언
                    sUEIDKey = 'UEI29';
                }else if(sUEIData === '004'){ //반복억지
                    sUEIDKey = 'UEI25';
                }else if(sUEIData === '005'){ //민원불분명
                    sUEIDKey = 'UEI26';
                }else if(sUEIData === '006'){ //사유없는콜백
                    sUEIDKey = 'UEI27';
                }else if(sUEIData === '007'){ //반말
                    sUEIDKey = 'UEI28';
                }

                if(iMentOrd > 0 && sUEIData !== '001') ipron.EXTAddRecord(this.newExHandle, sUEIDKey, iMentOrd);
            }

            ipron.SinglestepConference(store.getters["userStore/GE_USER_ROLE"].EXT_NO
                                        , this.ConnId
                                        , 8987
                                        , ''
                                        , 0 /*GetPartyType() (호의 참여 형태 (0 : SILENCE, 1 : ACTIVE, 2 : COACH, 4 : MUTE, 5 : MUTE Moh, 6 : Rx, 7 : Tx))*/
                                        , this.newExHandle
                                        , 0 /*GetSrcMediaType()*/);
            
            this.ConnId = this.PrevConnId;
            console.log('this.ConnId : ', this.ConnId, ', this.PrevConnId : ', this.PrevConnId);
        },
        
        //호전환(대기 호를 전환 하는 경우)
        transferMuteCall(sTargetExtNo, ConnId){
            ipron.MuteTransfer(store.getters["userStore/GE_USER_ROLE"].EXT_NO
                                , ConnId
                                , sTargetExtNo.indexOf('99') === 0 || sTargetExtNo.indexOf('98') === 0 ? (sTargetExtNo.length > 5 ? '9' + sTargetExtNo.substring(3, sTargetExtNo.length).replace(/[^0-9]/g, ''):sTargetExtNo.replace(/[^0-9]/g, '')) : (sTargetExtNo.length > 5 ? '9' + sTargetExtNo.replace(/[^0-9]/g, ''):sTargetExtNo.replace(/[^0-9]/g, ''))
                                , this.ExHandle
                                , 0 /*GetSrcMediaType()*/);
        },

        //extension 생성
        createExtension(){
            let sResult = ipron.EXTCreateExtension();
            if(sResult < 0) this.$eventBus.$emit("ipronErrMsg", {msg : 'Extension Create. Result Failed', evt : 'createExtension'});
            else this.newExHandle = sResult;
        },

        clearData() {
            this.UCID = '';
            this.ConnId = '';
            this.Hop = '';
            this.PrevConnId = '';
            this.CallId = '';
            this.ExHandle = '';
            this.newExHandle = '';
            this.CALL_ID = '';
            this.PREV_CALL_ID = '';
        },

        AddEvent(str) {
            let strTime;
            let now = new Date();
            strTime = "[" + this.leadingSpaces(now.getHours(), 2) + ":" + this.leadingSpaces(now.getMinutes(), 2) + ":" + this.leadingSpaces(now.getSeconds(), 2) + "." + this.leadingSpaces(now.getMilliseconds(), 3) + "] | ";

            // txtEvent.value += strTime + str + '\n';

            // if (chkEventAutoScroll.checked) {
            //     txtEvent.scrollTop = txtEvent.scrollHeight;
            // }

            // console.log(strTime + str);
        },

        AddResponse(str) {
            let strTime;
            let now = new Date();
            strTime = "[" + this.leadingSpaces(now.getHours(), 2) + ":" + this.leadingSpaces(now.getMinutes(), 2) + ":" + this.leadingSpaces(now.getSeconds(), 2) + "." + this.leadingSpaces(now.getMilliseconds(), 3) + "] | ";

            // txtResponse.value += strTime + str + '\n';

            // if (chkResponseAutoScroll.checked) {
            //     txtResponse.scrollTop = txtResponse.scrollHeight;
            // }
            // console.log(strTime + str);
        },

        AddReportOutput(str) {
            // txtReportOutput.value += str + '\n';
            // txtReportOutput.scrollTop = txtReportOutput.scrollHeight;
            // console.log(str);
        },

        leadingSpaces(n, digits) {
            let space = '';
            n = n.toString();

            if (n.length < digits) {
                for (let i = 0; i < digits - n.length; i++)
                    space += '0';
            }
            return space + n;
        },

        GetAgentState() {
            let nState = 0;
    
            switch (AgentState.selectedIndex) {
                case 0: nState = 0; break;  // Null
                case 1: nState = 10; break; // Logout
                case 2: nState = 20; break; // Login
                case 3: nState = 30; break; // Not Ready
                case 4: nState = 40; break; // Ready
                case 5: nState = 41; break; // Inbound Ready
                case 6: nState = 42; break; // Outbound Ready
                case 7: nState = 50; break; // Busy
                case 8: nState = 60; break; // AftWork
            }
            return nState;
        },

        GetPasswdType() {
            let nPtype = 0;
    
            switch (PasswdType.selectedIndex) {
                case 0: nPtype = 0; break;  // No Encryption
                case 1: nPtype = 1; break;  // SHA-1 160
                case 2: nPtype = 2; break;  // SHA-2 256
                case 3: nPtype = 3; break;  // SHA-2 384
                case 4: nPtype = 4; break;  // SHA-2 512
            }
            return nPtype;
        },

        MakeOpenServerResult(result) {
            let str;

            switch (result) {
                case -24: str = "IC Server 와 Interface Version 이 다릅니다."; break;
                case -23: str = "Win32 OCX Error. OCX의 Event 를 전달 받을 HWND 핸들이 없습니다. InitAPI() 함수 호출 후 사용"; break;
                case -22: str = "이미 연결되어 있는 Socket 의 IP와 지금 연결 하려는 IP 정보가 다릅니다"; break;
                case -21: str = "입력값 중에 NULL값 또는 잘못된 데이터가 있습니다"; break;
                case -20: str = "OpenServer 최대 개수 초과"; break;
                case -19: str = "재접속 시도중입니다"; break;
                case -18: str = "보내려는 패킷크기가 너무 큽니다."; break;
                case -17: str = "Memory 할당 실패"; break;
                case -16: str = "대기 시간 초과"; break;
                case -15: str = "Thread Stop 실패"; break;
                case -14: str = "데이터 전송 실패"; break;
                case -13: str = "Extension Data 처리 오류"; break;
                case -12: str = "핸들값 에러"; break;
                case -11: str = "이미 연결 되어 있음"; break;
                case -10: str = "Thread 생성 실패"; break;
                case -9: str = "Response 실패"; break;
                case -8: str = "Event 대기 실패"; break;
                case -7: str = "데이터 전송 실패"; break;
                case -6: str = "소켓 에러"; break;
                case -5: str = "Password 암호화 실패"; break;
                case -4: str = "DN 값이 잘못된 형식입니다.(DN 은 0~9, *, # 문자만 가능합니다)"; break;
                case -3: str = "Out형 변수의 값이 NULL 입니다."; break;
                case -2: str = "Socket 연결이 끊겼습니다."; break;
                case -1: str = "Register 된 DN를 찾지 못하였습니다"; break;
                default: str = "알수 없는 에러 코드 : [" + result + "]"; break;
            }

            return str;
        },

        MakeAgentStateString(state) {
            let str;

            switch (state) {
                case 0: str = "NULL"; break;
                case 10: str = "Logout"; break;
                case 20: str = "Login"; break;
                case 30: str = "Not Ready"; break;
                case 40: str = "Ready"; break;
                case 41: str = "InReady"; break;
                case 42: str = "OutReady"; break;
                case 50: str = "Busy"; break;
                case 51: str = "Ringing Busy"; break;
                case 52: str = "Dialing Busy"; break;
                case 60: str = "Work After Call"; break;
                default: str = "Unknown State : " + JSON.stringify(state); break;
            }
            return str;
        },

        MakeResult(result) {
            let str;

            switch (result) {
            case 0: str = "성공"; break;
            case 1001: str = "이미 사용중"; break;
            case 1002: str = "발견하지 못함"; break;
            case 1003: str = "라이센스 초과"; break;
            case 1004: str = "여유공간 초과"; break;
            case 1005: str = "유효하지 않은 상태"; break;
            case 1006: str = "이미 처리중"; break;
            case 1007: str = "이미 할당됨"; break;
            case 1008: str = "부정확한 정보"; break;
            case 2000: str = "IC Server와 Version 정보가 일치 하지 않습니다"; break;
            case 2001: str = "사용중인 Device"; break;
            case 2002: str = "사용중인 사용자"; break;
            case 2003: str = "비 수신대기인 사용자"; break;
            case 2004: str = "통화중인 Device"; break;
            case 2006: str = "이미 로그인 중인 사용자"; break;
            case 2101: str = "Device  찾을 수 없음"; break;
            case 2102: str = "App ID 찾을 수 없음"; break;
            case 2103: str = "Tenant 찾을 수 없음"; break;
            case 2104: str = "Mornitor ID 찾을 수 없음"; break;
            case 2105: str = "사용자 찾을 수 없음"; break;
            case 2106: str = "Group 찾을 수 없음"; break;
            case 2107: str = "Queue 찾을 수 없음"; break;
            case 2108: str = "Skill 찾을 수 없음"; break;
            case 2109: str = "사유코드 찾을 수 없음"; break;
            case 2110: str = "Connection 찾을 수 없음"; break;
            case 2111: str = "Call 찾을 수 없음"; break;
            case 2112: str = "DNIS 찾을 수 없음"; break;
            case 2113: str = "UCID 찾을 수 없음"; break;
            case 2114: str = "Media ID 찾을 수 없음"; break;
            case 2115: str = "Subscribe ID 찾을 수 없음"; break;
            case 2116: str = "GroupSkill 찾을 수 없음"; break;
            case 2201: str = "시스템 라이선스 Full"; break;
            case 2202: str = "Tenant 라이선스 Full"; break;
            case 2203: str = "Connection 개수 Full"; break;
            case 2301: str = "Device 개수 초과"; break;
            case 2302: str = "UserData 허용 크기 초과"; break;
            case 2303: str = "Virtual Media 허용 크기 초과"; break;
            case 2304: str = "UserCdr 허용 크기 초과"; break;
            case 2401: str = "유효하지 않는 App ID"; break;
            case 2402: str = "유효하지 않는 사용자 상태"; break;
            case 2403: str = "유효하지 않는 Device 상태"; break;
            case 2404: str = "유효하지 않는 사유 코드"; break;
            case 2405: str = "유효하지 않는 Connection"; break;
            case 2406: str = "유효하지 않는 UCID"; break;
            case 2407: str = "유효하지 않는 Option"; break;
            case 2501: str = "올바르지 않은 범위"; break;
            case 2502: str = "올바르지 않은 패스워드"; break;
            case 2503: str = "올바르지 않은 Device"; break;
            case 2504: str = "올바르지 않은 사용자"; break;
            case 2505: str = "올바르지 않은 상태코드"; break;
            case 2506: str = "올바르지 않은 Call	"; break;
            case 2601: str = "지원하지 않는 Media Type"; break;
            case 2701: str = "MCS Unknown Consult 실패"; break;
            case 2702: str = "MCS Busy Consult 실패"; break;
            case 2703: str = "MCS NoAnswer Consult 실패"; break;
            case 2704: str = "MCS Select Consult 실패"; break;
            case 2705: str = "MCS UserAbort Consult 실패"; break;
            case 2706: str = "MCS Reconnect 실패"; break;
            case 2707: str = "MCS Transfer 실패"; break;
            case 2708: str = "MCS Unknown SGTransfer 실패"; break;
            case 2709: str = "MCS Busy SGTransfer 실패"; break;
            case 2710: str = "MCS NoAnswer SGTransfer 실패"; break;
            case 2711: str = "MCS Select SGTransfer 실패"; break;
            case 2712: str = "MCS UserAbort SGTransfer 실패"; break;
            case 2713: str = "MCS Unknown Reroute 실패"; break;
            case 2714: str = "MCS Busy Reroute 실패"; break;
            case 2715: str = "MCS NoAnswer Reroute 실패"; break;
            case 2716: str = "MCS Select Reroute 실패"; break;
            case 2717: str = "MCS UserAbort Reroute 실패"; break;
            case 2801: str = "BSR 무효"; break;
            case 2802: str = "BSR 찾을 수 없음"; break;
            case 2803: str = "Node In Service"; break;
            case 2804: str = "Node Out Service"; break;
            case -1: str = "Register 된 DN를 찾지 못하였습니다"; break;
            case -2: str = "Socket 연결이 끊겼습니다"; break;
            case -3: str = "Out형 변수의 값이 NULL 입니다"; break;
            case -4: str = "DN 값이 잘못된 형식입니다.(DN 은 0~9, *, # 문자만 가능합니다"; break;
            case -5: str = "Password 암호화 실패"; break;
            case -6: str = "소켓 에러"; break;
            case -7: str = "데이터 전송 실패"; break;
            case -8: str = "Event 대기 실패"; break;
            case -9: str = "Response 실패"; break;
            case -10: str = "Thread 생성 실패"; break;
            case -11: str = "이미 연결 되어 있음"; break;
            case -12: str = "핸들값 에러"; break;
            case -13: str = "Extension Data 처리 오류"; break;
            case -14: str = "데이터 전송 실패"; break;
            case -15: str = "Thread Stop 실패"; break;
            case -16: str = "대기 시간 초과"; break;
            case -17: str = "Memory 할당 실패"; break;
            case -18: str = "보내려는 패킷크기가 너무 큽니다"; break;
            case -19: str = "재접속 시도중입니다"; break;
            case -20: str = "OpenServer 최대 개수 초과"; break;
            case -21: str = "입력값 중에 NULL값 또는 잘못된 데이터가 있습니다"; break;
            case -22: str = "이미 연결되어 있는 Socket 의 IP와 지금 연결 하려는 IP 정보가 다릅니다"; break;
            case -23: str = "OCX의 Event 를 전달 받을 HWND 핸들이 없습니다"; break;
            case -24: str = "IC Server 와 Interface Version 이 다릅니다"; break;
                default: str = "알수 없는 에러 코드 : [" + result.toString() + "]"; break;
            }

            return str;
        },

        MakeICConnectionState(state){
            var str;
            switch(state){
            case 0: str = "Null"; break;
            case 1: str = "Initiated"; break;
            case 2: str = "Alerting"; break;
            case 3: str = "Connected"; break;
            case 4: str = "Hold"; break;
            case 5: str = "Queued"; break;
            case 6: str = "Failed"; break;
            case 7: str = "Deleted"; break;
            default: str = "알수 없는 코드"; break;
            }
            return str;
        },

        CBFuncEvent(data) {
            let log = "[" + data.method + "]";
            switch (data.method) {
                case ipron.APIEvent.OPENSRVSUCCESS:
                    log += " OpenServer Success. NodeId[" + data.nodeid + "]";
                    // this.registerDn();
                    break;
                case ipron.APIEvent.RINGING: // ringing
                    log += " Ringing. ThisDn[" + data.thisdn + "]";
                    this.$eventBus.$emit('RINGING', {data: data, datetime : data.datetime, extensiondata : ipron.GetExtensionData(data.extensionhandle)});
                    break;
                case ipron.APIEvent.ESTABLISHED: // establish(호 연결)
                    log += " Establish. ThisDn[" + data.thisdn + "]";
                    this.$eventBus.$emit('ESTABLISHED', data);
                    break;
                case ipron.APIEvent.RELEASED: //released(호 종료)
                    log += " Released. ThisDn[" + data.thisdn + "] ConnCnt[" + data.connectioncnt + "]";
                    this.$eventBus.$emit('RELEASED', data);
                    break;
                case ipron.APIEvent.DIALING: // dialing
                    log += " Dialing. ThisDn[" + data.thisdn + "]";
                    this.$eventBus.$emit('DIALING', data);
                    break;
                case ipron.APIEvent.ABANDONED: // abandoned
                    log += " Abandoned. ThisDn[" + data.thisdn + "]";
                    break;
                case ipron.APIEvent.DESTBUSY: // dest busy
                    log += " DestBusy. ThisDn[" + data.thisdn + "]";
                    break;
                case ipron.APIEvent.HELD: // held
                    log += " Held. ThisDn[" + data.thisdn + "]";
                    this.$eventBus.$emit('HELD', data);
                    break;
                case ipron.APIEvent.RETRIEVED: // retrieved
                    log += " Retrieved. ThisDn[" + data.thisdn + "]";
                    break;
                case ipron.APIEvent.PARTYADDED: // party added
                    log += " PartyAdded. ThisDn[" + data.thisdn + "]";
                    // this.$eventBus.$emit('setAgentStat', data);
                    break;
                case ipron.APIEvent.PARTYCHANGED: // party changed
                    log += " PartyChanged. ThisDn[" + data.thisdn + "]";
                    this.$eventBus.$emit('PARTYCHANGED', data);
                    break;
                case ipron.APIEvent.PARTYDELETED: // party deleted
                    log += " PartyDeleted. ThisDn[" + data.thisdn + "]";
                    break;
                case ipron.APIEvent.QUEUED: // queued
                    log += " Queued. ThisDn[" + data.thisdn + "]";
                    break;
                case ipron.APIEvent.DIVERTED: // diverted
                    log += " Diverted. ThisDn[" + data.thisdn + "]";
                    break;
                case ipron.APIEvent.ACDAGENT_LOGGEDON: // acd Login
                    log += " ACD Login. ThisDn[" + data.thisdn + "] AgentID[" + data.agentid + "]";
                    break;
                case ipron.APIEvent.ACDAGENT_LOGGEDOFF: // acd Logout
                    log += " ACD Logout. ThisDn[" + data.thisdn + "] AgentID[" + data.agentid + "]";
                    break;
                case ipron.APIEvent.ACDAGENT_NOTREADY: // acd NotReady
                    log += " ACD NotReady. ThisDn[" + data.thisdn + "] AgentID[" + data.agentid + "]";
                    break;
                case ipron.APIEvent.ACDAGENT_READY: // acd Ready
                    log += " ACD Ready. ThisDn[" + data.thisdn + "] AgentID[" + data.agentid + "]";
                    break;
                case ipron.APIEvent.ACDAGENT_WORKAFTCALL: // acd AFTCall
                    log += " ACD AFTCall. ThisDn[" + data.thisdn + "] AgentID[" + data.agentid + "]";
                    break;
                case ipron.APIEvent.AGENTLOGIN: // agent login
                    log += " AgentLogin. AgentID[" + data.agentid + "] VoipState[" + data.voipagentstate;
                    log += "] VoipStateSub[" + data.voipagentstatesub + "]";
                    break;
                case ipron.APIEvent.AGENTLOGOUT: // agent logout
                    log += " AgentLogout. AgentID[" + data.agentid + "]";
                    // this.unRegisterDn();
                    break;
                case ipron.APIEvent.GROUPLOGIN: // agent login
                    log += " GroupLogin. GroupID[" + data.groupid + "] VoipState[" + data.voipagentstate;
                    log += "] VoipStateSub[" + data.voipagentstatesub + "]";
                    break;
                case ipron.APIEvent.GROUPLOGOUT: // agent logout
                    log += " GroupLogout. GroupID[" + data.groupid + "]";
                    break;
                case ipron.APIEvent.AGENTREADY: // agent ready
                    log += " AgentReady. AgentID[" + data.agentid + "]";
                    log += " Agent State[" + data.agentstate + "] SubState[" + data.agentstatesub + "]";
                    this.$eventBus.$emit('AGENTREADY', data);
                    break;
                case ipron.APIEvent.AGENTNOTREADY: // agent not ready
                    log += " AgentNotReady. AgentID[" + data.agentid + "]";
                    log += " Agent State[" + data.agentstate + "] SubState[" + data.agentstatesub + "]";
                    this.$eventBus.$emit('AGENTNOTREADY', data);
                    break;
                case ipron.APIEvent.AGENTACW: // agent acw
                    log += " AgentAcw. AgentID[" + data.agentid + "]";
                    log += " Agent State[" + data.agentstate + "] SubState[" + data.agentstatesub + "]";
                    this.$eventBus.$emit('AGENTACW', data);
                    break;
                case ipron.APIEvent.REGISTERED: // registered
                    log += " Registered. ThisDn[" + data.thisdn + "]";
                    log += " result[" + this.MakeResult(data.result) + "]";
                    if(data.result === 0){
                        this.loginAgent(this.CUSL_LOGIN_STAT, this.CUSL_LOGIN_SUB_STAT); //로그인 이후 기본 상태 대기
                    }else{
                        this.$eventBus.$emit("ipronErrMsg", {msg : this.MakeResult(data.result), evt : 'ipron.APIEvent.REGISTERED'});
                    }
                    break;
                case ipron.APIEvent.UNREGISTERED: // unregistered
                    log += " Unregistered. ThisDn[" + data.thisdn + "]";
                    log += " result[" + this.MakeResult(data.result) + "]";
                    // if(data.result === 0){
                    //     ipron.CloseServer();
                    // }else{
                    //     this.$eventBus.$emit("ipronErrMsg", {msg : this.MakeResult(data.result), evt : 'ipron.APIEvent.UNREGISTERED'});
                    // }
                    break;
                case ipron.APIEvent.UPDATE_USERDATA: // update userdata
                    log += " UpdateUserdata. UpdateDn[" + data.updatedn + "]";
                    break;
                case ipron.APIEvent.USEREVENT: // user event
                    log += " UserEvent. SenderDn[" + data.senderdn + "]";
                    break;
                case ipron.APIEvent.INITIATED: // initiated
                    log += " Initiated. ThisDn[" + data.thisdn + "]";
                    break;
                case ipron.APIEvent.AGENTINREADY: // agent in ready
                    log += " AgentInReady. ThisDn[" + data.thisdn + "]";
                    log += " Agent State[" + data.agentstate + "]";
                    break;
                case ipron.APIEvent.AGENTOUTREADY: // agent out ready
                    log += " AgentOutReady. ThisDn[" + data.thisdn + "]";
                    log += " Agent State[" + data.agentstate + "]";
                    break;
                case ipron.APIEvent.MEDIAPLAY: // media play
                    log += " MediaPlay. ThisDn[" + data.thisdn + "]";
                    break;
                case ipron.APIEvent.MEDIACOLLECT: // media collect
                    log += " MediaCollect. ThisDn[" + data.thisdn + "]digits[" + data.digits + "]";
                    break;
                case ipron.APIEvent.BANISHMENT: // banishment
                    log += " Banishment. DestDn[" + data.destdn + "]";
                    this.$eventBus.$emit('BANISHMENT', data);
                    break;
                case ipron.APIEvent.ACDAGENT_BUSY: // acd agent busy
                    log += " AcdAgentBusy. ThisDn[" + data.thisdn + "]";
                    break;
                case ipron.APIEvent.MCS_REROUTE: // reroute
                    log += " Reroute. ThisDn[" + data.thisdn + "]";
                    break;
                case ipron.APIEvent.VIRTUAL_MEDIA_CREATE: // virtual media create
                    log += " VirtualMediaCreate. QueueDn[" + data.queuedn + "]";
                    break;
                case ipron.APIEvent.VIRTUAL_MEDIA_DISTRIBUTE: // virtual media distribute
                    log += " VirtualMediaDistribute. QueueDn[" + data.queuedn + "]";
                    break;
                case ipron.APIEvent.VIRTUAL_MEDIA_DELETE: // virtual media delete
                    log += " VirtualMediaDelete. QueueDn[" + data.queuedn + "]";
                    break;
                case ipron.APIEvent.DEVICE_DND: // device dnd
                    log += " Device DND. AgentDn[" + data.agentdn + "] AgentId[" + data.agentid + "]";
                    break;
                case ipron.APIEvent.HASTATE_CHANGED: // ha state changed
                    log += " HaStateChanged. HaState[" + data.hastate + "]";
                    break;
                case ipron.APIEvent.AGENT_SSCRIBE_PUSH: // agent subscribe push
                    log += " Agent Subscribe Push.";
                    SubscribePage.AgentSubscribe(data.subscribeid, data.intotal, data.insuccess, data.intalktime, data.outtotal, data.outsuccess, data.outtalktime, data.transfercalls, data.logintime,
                                                   data.logouttime, data.inintsuc, data.inextsuc, data.inconsuc, data.outintsuc, data.outextsuc, data.outconsuc, data.ringingtime, data.dialingtime,
                                                   data.readytime, data.notreadytime, data.acwtime);
                    break;
                case ipron.APIEvent.AGENT_SSCRIBE_EX_PUSH: // agent subscribe push
                    log += " Agent SubscribeEx Push.";
                    SubscribePage.AgentSubscribeEx(data.subscribeid, data.intotal, data.insuccess, data.intalktime, data.outtotal, data.outsuccess, data.outtalktime, data.transfercalls, data.logintime,
                                                   data.logouttime, data.inintsuc, data.inextsuc, data.inconsuc, data.outintsuc, data.outextsuc, data.outconsuc, data.ringingtime, data.dialingtime,
                                                   data.readytime, data.notreadytime, data.acwtime, data.notreadycnt, data.readycnt, data.acwcnt, data.transintalktime, data.transinsuc);
                    break;
                case ipron.APIEvent.GROUP_SSCRIBE_PUSH: // agent subscribe push
                    log += " Group Subscribe Push.";
                    SubscribePage.GroupSubscribe(data);
                    break;
                case ipron.APIEvent.QUEUE_SSCRIBE_PUSH: // agent subscribe push
                    log += " Queue Subscribe Push.";
                    SubscribePage.QueueSubscribe(data);
                    break;
                case ipron.APIEvent.TENANT_SSCRIBE_PUSH: // agent subscribe push
                    log += " Tenant Subscribe Push.";
                    SubscribePage.TenantSubscribe(data);
                    break;
                case ipron.APIEvent.DNIS_SSCRIBE_PUSH: // agent subscribe push
                    log += " Dnis Subscribe Push.";
                    SubscribePage.DnisSubscribe(data.subscribeid, data.inboundtotal, data.abandontotal, data.agttry, data.agttryabandon, data.rejecttotal, data.accepttotal, data.nonsvctotal, data.ivrsvccount, data.waitcount, data.inbusyagentcount, data.ivragtconfcount);
                    break;
                case ipron.APIEvent.NEW_NOTICE: // Notice
                    log += " New Notice.";
                    break;
                case ipron.APIEvent.CALLBACK_DISTRIBUTE: // Callback
                    log += " Callback.";
                    break;
                case ipron.APIEvent.MEDIA_ENABLED: //Media Enabled
                    log += " Media Enabled. AgentID[" + data.agentid + "] MediaType[" + data.mediatype + "] Enable [" + data.enable + "]";
                    break;
                case ipron.APIEvent.MEDIA_READY: // Media Ready
                    log += " Media Ready. AgentID[" + data.agentid + "] MediaType[" + data.mediatype + "] MediaReady [" + data.mediaready + "]";
                    break;
                case ipron.APIEvent.FAILED: // failed
                    log += " Failed. ThisDn[" + data.thisdn + "]";
                    break;
                case ipron.APIEvent.DEVICE_OUT_OF_SERVICE: // Device Out of Service
                    log += " Device Out of Service. EventDn[" + data.eventdn + "]";
                    break;
                case ipron.APIEvent.DEVICE_BACK_IN_SERVICE: // Device Back in Service
                    log += " Device Back in Service. EventDn[" + data.eventdn + "]";
                    break;
                case ipron.APIEvent.AGENTBUSY: //Agent Busy
                    log += " AgentBusy. AgentID[" + data.agentid + "]";
                    log += " Agent State[" + data.agentstate + "] SubState[" + data.agentstatesub + "]";
                    this.$eventBus.$emit('AGENTBUSY', data); //상담원 상태 변경(통화중)
                    break;
                case ipron.APIEvent.NODE_DR_STATE: 
                    log += " Node Dr State. Node[" + data.nodeid + "] Down[" + data.drstate + "]";
                    break;
                case ipron.APIEvent.RESOURCE_CHANGE:
                    log += " Resource Change. AppId[" + data.appid + "] ResourceType[" + data.resourcetype +"]";
                    break;
                case ipron.APIEvent.GROUPAGTSTS: //Group Agent State
                    log += " GroupAgtSts. AgentID[" + data.agentid + "]";
                    if(data.groupagtstatevoice) {
                        log += " Agent Voice State[" + data.groupagtstatevoice + "] SubState[" + data.groupagtstatesubvoice + "]";
                    }
                    if(data.groupagtstatechat) {
                        log += " Agent Chat State[" + data.groupagtstatechat + "] SubState[" + data.groupagtstatesubchat + "]";
                    }
                    if(data.groupagtstatevvoice) {
                        log += " Agent Vvoice State[" + data.groupagtstatevvoice + "] SubState[" + data.groupagtstatesubvvoice + "]";
                    }
                    if(data.groupagtstatevchat) {
                        log += " Agent Vchat State[" + data.groupagtstatevchat + "] SubState[" + data.groupagtstatesubvchat + "]";
                    }
                    if(data.groupagtstateemail) {
                        log += " Agent Email State[" + data.groupagtstateemail + "] SubState[" + data.groupagtstatesubemail + "]";
                    }
                    if(data.groupagtstatefax) {
                        log += " Agent Fax State[" + data.groupagtstatefax + "] SubState[" + data.groupagtstatesubfax + "]";
                    }
                    if(data.groupagtstatemvoip) {
                        log += " Agent Mvoip State[" + data.groupagtstatemvoip + "] SubState[" + data.groupagtstatesubmvoip + "]";
                    }
                    if(data.groupagtstateweb) {
                        log += " Agent Web State[" + data.groupagtstateweb + "] SubState[" + data.groupagtstatesubweb + "]";
                    }
                    break
                default:
                    break;
            }

            switch (data.method) {
                case ipron.APIEvent.INITIATED: // initiated
                    // TextThisDn.value = data.thisdn;
                    this.UCID = data.ucid;
                    this.Hop = data.hop;
                    this.PrevConnId = this.ConnId;
                    this.ConnId = data.connectionid;
                    this.CallId = data.callid;
                    break;
                case ipron.APIEvent.HELD: // held
                case ipron.APIEvent.RINGING: // ringing
                case ipron.APIEvent.ESTABLISHED: // establish
                case ipron.APIEvent.RELEASED: //released
                case ipron.APIEvent.DIALING: // dialing
                case ipron.APIEvent.DIVERTED: // diverted
                case ipron.APIEvent.RETRIEVED: // retrieved
                case ipron.APIEvent.PARTYADDED: // party added
                    this.PrevConnId = this.ConnId;
                    this.ConnId = data.connectionid;
                    this.CallId = data.callid;
                    break;
                case ipron.APIEvent.PARTYCHANGED: // party changed
                case ipron.APIEvent.PARTYDELETED: // party delete
                    data.connectionid = this.PrevConnId;
                    break;
                case ipron.APIEvent.QUEUED: // queued
                    // TextThisDn.value = data.thisdn;
                    this.UCID = data.ucid;
                    this.Hop = data.hop;
                    this.ConnId = data.connectionid;
                    this.CallId = data.callid;
                    break;
                default:
                    break;
            }

            this.AddEvent(log);

            // 재접속 관련...
            switch (data.method) {
                case ipron.APIEvent.ACTIVE_TIMEOUT:
                    this.AddEvent("ACTIVE_TIMEOUT");
                    this.AddEvent("Retry OpenServer...");
                    this.$eventBus.$emit("ipronErrMsg", {msg : 'ACTIVE_TIMEOUT', evt : 'ipron.APIEvent.ACTIVE_TIMEOUT'});
                    this.bReconnect = true;
                    ipron.OpenServer("EASD Test App", this.CBFuncEvent, this.CBFuncResponse);
                    break;
                case ipron.WebEvent.ERR_DISCONNECT:
                    this.AddEvent("ERR_DISCONNECT");
                    this.AddEvent("Retry OpenServer...");
                    this.$eventBus.$emit("ipronErrMsg", {msg : 'ERR_DISCONNECT', evt : 'ipron.APIEvent.ERR_DISCONNECT'});
                    this.bReconnect = true;
                    ipron.OpenServer("EASD Test App", this.CBFuncEvent, this.CBFuncResponse);
                    break;
                case ipron.WebEvent.ERR_OPENSERVER:
                    this.AddEvent("ERR_OPENSERVER");
                    this.$eventBus.$emit("ipronErrMsg", {msg : 'ERR_OPENSERVER', evt : 'ipron.APIEvent.ERR_OPENSERVER'});
                    if (this.bReconnect) {
                        this.AddEvent("Retry OpenServer...");
                        ipron.OpenServer("EASD Test App", this.CBFuncEvent, this.CBFuncResponse);
                        break;
                    }
            }

            if (data.extensionhandle > 0) {
                this.AddEvent(this.ExtensionData((data)));
                this.ExHandle = data.extensionhandle;
                console.log(data.extensionhandle);
                
                if(data.connectionid !== this.ConnId){
                    data.connectionid = this.PrevConnId;
                }
            }
        },

        CBFuncResponse(data) {
            this.$eventBus.$emit('ctiResponse', data);
            let log = "";
            let result = 0;
            switch (data.messagetype) {
                case ipron.MsgType.AjaxResponse:
                    log += data.method + " (AJAX Response) result[" + data.result + "]";
                    if (data.method == ipron.Request.OpenServer) {
                        if (data.result == ipron.JSONValue.True) {
                            this.sessionKey = data.key;
                            this.bReconnect = false;
                            log += " Handle[" + data.handle + "]";
                        }
                        else {
                            log += " Result[" + this.MakeOpenServerResult(data.handle) + "]";
                            this.$eventBus.$emit('ipronErrMsg', {msg : this.MakeOpenServerResult(data.handle), evt : 'ipron.Request.OpenServer'});
                            if (this.bReconnect) {
                                this.AddEvent("OpenServerTry Fail...");
                                this.AddEvent("Retry OpenServer...");
                                setTimeout('ipron.OpenServer("EASD Test App", this.CBFuncEvent, this.CBFuncResponse)', 3000);
                                break;
                            }
                        }
                    }

                    break;
                case ipron.MsgType.ICResponse:
                    log += "[" + data.method + "]";
                    switch (data.method) {
                        case ipron.APIMethod.GET_NODEAGENT_LIST_RES:
                            log += " GetNodeAgentListRes. Result[" + this.MakeResult(data.result) + "]";
                            ReportPage.AgentNodeList(data.extensionhandle);
                        case ipron.APIMethod.REGIADDR_RES: // register
                            log += " RegisterRes. Result[" + this.MakeResult(data.result) + "]";
                            if(data.result !== 0) this.$eventBus.$emit("ipronErrMsg", {msg : this.MakeResult(data.result), evt : 'ipron.APIMethod.REGIADDR_RES'});
                            break;
                        case ipron.APIMethod.UNREGIADDR_RES: // unregister
                            log += " UnregisterRes. Result[" + this.MakeResult(data.result) + "]";
                            //                            UnRegiResCnt++;
                            //                            TextUnRegiResCnt.value = "" + UnRegiResCnt;
                            if(data.result !== 0) this.$eventBus.$emit("ipronErrMsg", {msg : this.MakeResult(data.result), evt : 'ipron.APIMethod.UNREGIADDR_RES'});
                            break;
                        case ipron.APIMethod.GROUP_REGIADDR_RES: // groupregister
                            log += " GroupRegisterRes. Result[" + this.MakeResult(data.result) + "]";
                            break;
                        case ipron.APIMethod.GROUP_UNREGIADDR_RES: // groupunregister
                            log += " GroupUnregisterRes. Result[" + this.MakeResult(data.result) + "]";
                            break;
                        case ipron.APIMethod.MAKECALL_RES: // make call
                            log += " MakeCallRes. Result[" + this.MakeResult(data.result) + "]";
                            if(data.result !== 0) this.$eventBus.$emit("ipronErrMsg", {msg : this.MakeResult(data.result), evt : 'ipron.APIMethod.MAKECALL_RES'});
                            break;
                        case ipron.APIMethod.ANSWERCALL_RES: // Answer Call
                            log += " AnswerCallRes. Result[" + this.MakeResult(data.result) + "]";
                            if(data.result !== 0) this.$eventBus.$emit("ipronErrMsg", {msg : this.MakeResult(data.result), evt : 'ipron.APIMethod.ANSWERCALL_RES'});
                            break;
                        case ipron.APIMethod.CLEARCALL_RES: // clear call
                            log += " ClearCallRes. Result[" + this.MakeResult(data.result) + "]";
                            if(data.result !== 0) this.$eventBus.$emit("ipronErrMsg", {msg : this.MakeResult(data.result), evt : 'ipron.APIMethod.CLEARCALL_RES'});
                            break;
                        case ipron.APIMethod.HOLDCALL_RES: // hold call
                            log += " HoldCallRes. Result[" + this.MakeResult(data.result) + "]";
                            if(data.result !== 0) this.$eventBus.$emit("ipronErrMsg", {msg : this.MakeResult(data.result), evt : 'ipron.APIMethod.HOLDCALL_RES'});
                            break;
                        case ipron.APIMethod.HOLDCALL_EX_RES: // hold call Ex
                            log += " HoldCallExRes. Result[" + this.MakeResult(data.result) + "]";
                            if(data.result !== 0) this.$eventBus.$emit("ipronErrMsg", {msg : this.MakeResult(data.result), evt : 'ipron.APIMethod.HOLDCALL_EX_RES'});
                            break;
                        case ipron.APIMethod.RETRIEVECALL_RES: // retrieve call
                            log += " RetrieveCallRes. Result[" + this.MakeResult(data.result) + "]";
                            if(data.result !== 0) this.$eventBus.$emit("ipronErrMsg", {msg : this.MakeResult(data.result), evt : 'ipron.APIMethod.RETRIEVECALL_RES'});
                            break;
                        case ipron.APIMethod.JOINCALL_RES: // join call
                            log += " JoinCallRes. Result[" + this.MakeResult(data.result) + "]";
                            if(data.result !== 0) this.$eventBus.$emit("ipronErrMsg", {msg : this.MakeResult(data.result), evt : 'ipron.APIMethod.JOINCALL_RES'});
                            break;
                        case ipron.APIMethod.AGENT_JOINCALL_RES: // Agent join call
                            log += " AgentJoinCallRes. Result[" + this.MakeResult(data.result) + "]";
                            if(data.result !== 0) this.$eventBus.$emit("ipronErrMsg", {msg : this.MakeResult(data.result), evt : 'ipron.APIMethod.AGENT_JOINCALL_RES'});
                            break;
                        case ipron.APIMethod.GRPICKUP_RES: // group pickup
                            log += " GroupPickupRes. Result[" + this.MakeResult(data.result) + "]";
                            if(data.result !== 0) this.$eventBus.$emit("ipronErrMsg", {msg : this.MakeResult(data.result), evt : 'ipron.APIMethod.GRPICKUP_RES'});
                            break;
                        case ipron.APIMethod.QUEUE_PICKUP_RES: // queue pickup
                            log += " QueuePickupRes. Result[" + this.MakeResult(data.result) + "]";
                            if(data.result !== 0) this.$eventBus.$emit("ipronErrMsg", {msg : this.MakeResult(data.result), evt : 'ipron.APIMethod.QUEUE_PICKUP_RES'});
                            break;
                        case ipron.APIMethod.SINGLESTEP_TRANSFER_RES: // singlestep transfer
                            log += " SinglestepTransferRes. Result[" + this.MakeResult(data.result) + "]";
                            if(data.result !== 0) this.$eventBus.$emit("ipronErrMsg", {msg : this.MakeResult(data.result), evt : 'ipron.APIMethod.SINGLESTEP_TRANSFER_RES'});
                            break;
                        case ipron.APIMethod.MUTE_TRANSFER_RES: // mute transfer
                            log += " MuteTransferRes. Result[" + this.MakeResult(data.result) + "]";
                            if(data.result !== 0) this.$eventBus.$emit("ipronErrMsg", {msg : this.MakeResult(data.result), evt : 'ipron.APIMethod.MUTE_TRANSFER_RES'});
                            break;
                        case ipron.APIMethod.SINGLESTEP_CONFERENCE_RES: // singlestep conference
                            log += " SinglestepConferenceRes. Result[" + this.MakeResult(data.result) + "]";
                            if(data.result !== 0) this.$eventBus.$emit("ipronErrMsg", {msg : this.MakeResult(data.result), evt : 'ipron.APIMethod.SINGLESTEP_CONFERENCE_RES'});
                            break;
                        case ipron.APIMethod.CONFERENCE_RES: // mute conference call
                            log += " MuteConferenceRes. Result[" + this.MakeResult(data.result) + "]";
                            if(data.result !== 0) this.$eventBus.$emit("ipronErrMsg", {msg : this.MakeResult(data.result), evt : 'ipron.APIMethod.CONFERENCE_RES'});
                            break;
                        case ipron.APIMethod.DEFLECTCALL_RES: // deflect call
                            log += " DeflectCallRes. Result[" + this.MakeResult(data.result) + "]";
                            if(data.result !== 0) this.$eventBus.$emit("ipronErrMsg", {msg : this.MakeResult(data.result), evt : 'ipron.APIMethod.DEFLECTCALL_RES'});
                            break;
                        case ipron.APIMethod.MCS_REROUTE_RES: // mcs reroute
                            log += " McsRerouteRes. Result[" + this.MakeResult(data.result) + "]";
                            if(data.result !== 0) this.$eventBus.$emit("ipronErrMsg", {msg : this.MakeResult(data.result), evt : 'ipron.APIMethod.MCS_REROUTE_RES'});
                            break;
                        case ipron.APIMethod.GETCONNECTION_RES: // get connection
                            log += " GetConnectionRes. Result[" + this.MakeResult(data.result) + "]";
                            log += " ConnectionId1[" + data.connectionid1 + "]";
                            log += " ConnectionId2[" + data.connectionid2 + "]";
                            if(data.result !== 0) this.$eventBus.$emit("ipronErrMsg", {msg : this.MakeResult(data.result), evt : 'ipron.APIMethod.GETCONNECTION_RES'});
                            break;
                        case ipron.APIMethod.AGENTLOGIN_RES: // agent login
                            log += " AgentLoginRes. Result[" + this.MakeResult(data.result) + "]";
                            if(data.result !== 0) this.$eventBus.$emit("ipronErrMsg", {msg : this.MakeResult(data.result), evt : 'ipron.APIMethod.AGENTLOGIN_RES'});
                            else this.getDeviceActivate();
                            break;
                        case ipron.APIMethod.ADNLOGIN_RES: // adn agent login
                            log += " AdnLoginRes. Result[" + this.MakeResult(data.result) + "]";
                            if(data.result !== 0) this.$eventBus.$emit("ipronErrMsg", {msg : this.MakeResult(data.result), evt : 'ipron.APIMethod.ADNLOGIN_RES'});
                            break;
                        case ipron.APIMethod.AGENTLOGOUT_RES: // agent logout
                            log += " AgentLogoutRes. Result[" + this.MakeResult(data.result) + "]";
                            if(data.result !== 0) this.$eventBus.$emit("ipronErrMsg", {msg : this.MakeResult(data.result), evt : 'ipron.APIMethod.AGENTLOGOUT_RES'});
                            break;
                        case ipron.APIMethod.GETSTATE_SUBCODE_RES: // get state sub code
                            log += " GetStateSubcodeRes. Result[" + this.MakeResult(data.result) + "]";
                            this.GetStateSubCode(data.extensionhandle);
                            if(data.result !== 0) this.$eventBus.$emit("ipronErrMsg", {msg : this.MakeResult(data.result), evt : 'ipron.APIMethod.GETSTATE_SUBCODE_RES'});
                            break;
                        case ipron.APIMethod.GETROUTEABLE_RES: // get routeable
                            log += " GetRouteableRes. Result[" + this.MakeResult(data.result) + "]";
                            if (data.result == 0)
                                log += " 통화 가능";
                            else
                                log += " 통화 불가능";

                            if(data.result !== 0) this.$eventBus.$emit("ipronErrMsg", {msg : this.MakeResult(data.result), evt : 'ipron.APIMethod.GETROUTEABLE_RES'});
                            break;
                        case ipron.APIMethod.UPDATE_USERDATA_RES: // update userdata
                            log += " UpdateUserdataRes. Result[" + this.MakeResult(data.result) + "]";
                            if(data.result !== 0) this.$eventBus.$emit("ipronErrMsg", {msg : this.MakeResult(data.result), evt : 'ipron.APIMethod.UPDATE_USERDATA_RES'});
                            break;
                        case ipron.APIMethod.DELETE_KEY_USERDATA_RES: // delete key userdata 
                            log += " DeleteKeyUserdataRes. Result[" + this.MakeResult(data.result) + "]";
                            if(data.result !== 0) this.$eventBus.$emit("ipronErrMsg", {msg : this.MakeResult(data.result), evt : 'ipron.APIMethod.DELETE_KEY_USERDATA_RES'});
                            break;
                        case ipron.APIMethod.DELETE_ALL_USERDATA_RES: // delete all userdata 
                            log += " DeleteAllUserdataRes. Result[" + this.MakeResult(data.result) + "]";
                            if(data.result !== 0) this.$eventBus.$emit("ipronErrMsg", {msg : this.MakeResult(data.result), evt : 'ipron.APIMethod.DELETE_ALL_USERDATA_RES'});
                            break;
                        case ipron.APIMethod.SEND_USEREVENT_RES: // send user event 
                            log += " SendUserEventRes. Result[" + this.MakeResult(data.result) + "]";
                            if(data.result !== 0) this.$eventBus.$emit("ipronErrMsg", {msg : this.MakeResult(data.result), evt : 'ipron.APIMethod.SEND_USEREVENT_RES'});
                            break;
                        case ipron.APIMethod.GET_USERDATA_RES: // get userdata 
                            log += " GetUserdataRes. Result[" + this.MakeResult(data.result) + "]";
                            log += " Conn ID [" + data.connectionid + "]";
                            log += " "
                            if(data.result !== 0) this.$eventBus.$emit("ipronErrMsg", {msg : this.MakeResult(data.result), evt : 'ipron.APIMethod.GET_USERDATA_RES'});
                            else this.$eventBus.$emit("GET_USERDATA_RES", data);
                            break;
                        case ipron.APIMethod.GETCONNSTATE_RES: // get conn state 
                            log += " GetConnStateRes. Result[" + this.MakeResult(data.result) + "]";
                            log += " Conn ID [" + data.connectionid + "]";
                            log += " State [" + this.MakeICConnectionState(data.connectionstate) + "]";
                            if(data.result !== 0) this.$eventBus.$emit("ipronErrMsg", {msg : this.MakeResult(data.result), evt : 'ipron.APIMethod.GETCONNSTATE_RES'});
                            break;
                        case ipron.APIMethod.SET_ANI_USERDATA_RES: // set ani userdata 
                            log += " SetAniUserdataRes. Result[" + this.MakeResult(data.result) + "]";
                            if(data.result !== 0) this.$eventBus.$emit("ipronErrMsg", {msg : this.MakeResult(data.result), evt : 'ipron.APIMethod.SET_ANI_USERDATA_RES'});
                            break;
                        case ipron.APIMethod.SET_UCID_USERDATA_RES: // set ucid userdata 
                            log += " SetUcidUserdataRes. Result[" + this.MakeResult(data.result) + "]";
                            if(data.result !== 0) this.$eventBus.$emit("ipronErrMsg", {msg : this.MakeResult(data.result), evt : 'ipron.APIMethod.SET_UCID_USERDATA_RES'});
                            break;
                        case ipron.APIMethod.SETAGENTSTATE_RES: // set agent state 
                            log += " SetAgentStateRes. Result[" + this.MakeResult(data.result) + "]";
                            log += " State [" + this.MakeAgentStateString(data.agentstate) + "]";
                            log += " State Sub [" + data.agentstatesub + "]";
                            // if(data.result !== 0) this.$eventBus.$emit("ipronErrMsg", {msg : this.MakeResult(data.result), evt : 'ipron.APIMethod.SETAGENTSTATE_RES'});
                            // else this.$eventBus.$emit('setAgentStat', data); //상담원 상태 변경
                            break;
                        case ipron.APIMethod.SETAGENTSTATE_DATA_RES: // set agent state data
                            log += " SetAgentStateDataRes. Result[" + this.MakeResult(data.result) + "]";
                            log += " State [" + this.MakeAgentStateString(data.agentstate) + "]";
                            log += " State Sub [" + data.agentstatesub + "]";
                            if(data.result !== 0) this.$eventBus.$emit("ipronErrMsg", {msg : this.MakeResult(data.result), evt : 'ipron.APIMethod.SETAGENTSTATE_DATA_RES'});
                            break;
                        case ipron.APIMethod.GET_NODEAGENT_STATE_RES:
                            log += " GetNodeAgentStateRes. Result[" + this.MakeResult(data.result) + "]\n";
                            var arrMedia = data.mediaset.split('-');
                            for (var i = 0; i < arrMedia.length; i++) {
                                switch (arrMedia[i]) {
                                    case '0':
                                        log += "Voice State [" + this.MakeAgentStateString(data.voipagentstate) + "]";
                                        log += "Voice State Sub [" + data.voipagentstatesub + "]\n";
                                        break;
                                    case '10':
                                        log += "Chat State [" + this.MakeAgentStateString(data.chatagentstate) + "]";
                                        log += "Chat State Sub [" + data.chatagentstatesub + "]\n";
                                        break;
                                    case '20':
                                        log += "VVoice State [" + this.MakeAgentStateString(data.vvoiceagentstate) + "]";
                                        log += "VVoice State Sub [" + data.vvoiceagentstatesub + "]\n";
                                        break;
                                    case '30':
                                        log += "VChat State [" + this.MakeAgentStateString(data.vchatagentstate) + "]";
                                        log += "VChat State Sub [" + data.vchatagentstatesub + "]\n";
                                        break;
                                    case '40':
                                        log += "email State [" + this.MakeAgentStateString(data.emailagentstate) + "]";
                                        log += "email State Sub [" + data.emailagentstatesub + "]\n";
                                        break;
                                    case '50':
                                        log += "FAX State [" + this.MakeAgentStateString(data.faxagentstate) + "]";
                                        log += "FAX State Sub [" + data.faxagentstatesub + "]\n";
                                        break;
                                    case '61':
                                        log += "MVOIP State [" + this.MakeAgentStateString(data.mvoipagentstate) + "]";
                                        log += "MVOIP State Sub [" + data.mvoipagentstatesub + "]\n";
                                        break;
                                    case '80':
                                        log += "Web State [" + this.MakeAgentStateString(data.webagentstate) + "]";
                                        log += "Web State Sub [" + data.webagentstatesub + "]\n";
                                        break;
                                }
                            }
                            break;
                        case ipron.APIMethod.GETAGENTSTATE_RES: // get agent state 
                            log += " GetAgentStateRes. Result[" + this.MakeResult(data.result) + "]\n";
                            var arrMedia = data.mediaset.split('-');
                            for (var i = 0; i < arrMedia.length; i++) {
                                switch (arrMedia[i]) {
                                    case '0':
                                        log += "Voice State [" + this.MakeAgentStateString(data.voipagentstate) + "]";
                                        log += "Voice State Sub [" + data.voipagentstatesub + "]\n";
                                        break;
                                    case '10':
                                        log += "Chat State [" + this.MakeAgentStateString(data.chatagentstate) + "]";
                                        log += "Chat State Sub [" + data.chatagentstatesub + "]\n";
                                        break;
                                    case '20':
                                        log += "VVoice State [" + this.MakeAgentStateString(data.vvoiceagentstate) + "]";
                                        log += "VVoice State Sub [" + data.vvoiceagentstatesub + "]\n";
                                        break;
                                    case '30':
                                        log += "VChat State [" + this.MakeAgentStateString(data.vchatagentstate) + "]";
                                        log += "VChat State Sub [" + data.vchatagentstatesub + "]\n";
                                        break;
                                    case '40':
                                        log += "email State [" + this.MakeAgentStateString(data.emailagentstate) + "]";
                                        log += "email State Sub [" + data.emailagentstatesub + "]\n";
                                        break;
                                    case '50':
                                        log += "FAX State [" + this.MakeAgentStateString(data.faxagentstate) + "]";
                                        log += "FAX State Sub [" + data.faxagentstatesub + "]\n";
                                        break;
                                    case '61':
                                        log += "MVOIP State [" + this.MakeAgentStateString(data.mvoipagentstate) + "]";
                                        log += "MVOIP State Sub [" + data.mvoipagentstatesub + "]\n";
                                        break;
                                    case '80':
                                        log += "Web State [" + this.MakeAgentStateString(data.webagentstate) + "]";
                                        log += "Web State Sub [" + data.webagentstatesub + "]\n";
                                        break;
                                }
                            }
                            break;
                        case ipron.APIMethod.SETAFTCALLSTATE_RES: // set aft state 
                            log += " SetAftCallStateRes. Result[" + this.MakeResult(data.result) + "]";
                            log += " State [" + this.MakeAgentStateString(data.agentstate) + "]";
                            log += " State Sub [" + data.agentstatesub + "]";
                            if(data.result !== 0) this.$eventBus.$emit("ipronErrMsg", {msg : this.MakeResult(data.result), evt : 'ipron.APIMethod.SETAFTCALLSTATE_RES'});
                            // else this.$eventBus.$emit('setAgentStat', data); //상담원 상태 변경
                            break;
                        case ipron.APIMethod.SETAFTCALLSTATE_EX_RES: // set aft state Ex
                            log += " SetAftCallStateExRes. Result[" + this.MakeResult(data.result) + "]";
                            log += " State Inbound [" + this.MakeAgentStateString(data.inboundagentstate) + "]";
                            log += " State Sub Inbound [" + data.inboundagentstatesub + "]";
                            log += " State Outbound [" + this.MakeAgentStateString(data.outboundagentstate) + "]";
                            log += " State Sub Outbound [" + data.outboundagentstatesub + "]";
                            break;
                        case ipron.APIMethod.SETSKILL_ENABLE_RES: // set skill enable
                            log += " SetSkillEnableRes. Result[" + this.MakeResult(data.result) + "]";
                            break;
                        case ipron.APIMethod.FORCE_SETAGTSTATE_RES: // force set agent state 
                            log += " ForceSetAgentStateRes. Result[" + this.MakeResult(data.result) + "]";
                            log += " State [" + this.MakeAgentStateString(data.agentstate) + "]";
                            log += " State Sub [" + data.agentstatesub + "]";
                            if(data.result !== 0) this.$eventBus.$emit("ipronErrMsg", {msg : this.MakeResult(data.result), evt : 'ipron.APIMethod.FORCE_SETAGTSTATE_RES'});
                            // else this.$eventBus.$emit('setAgentStat', data); //상담원 상태 변경
                            break;
                        case ipron.APIMethod.GETGROUPLIST_RES: // get group list 
                            log += " GetGroupListRes. Result[" + this.MakeResult(data.result) + "]";
                            ReportPage.GroupList(data.extensionhandle);
                            break;
                        case ipron.APIMethod.GETQUEUELIST_RES: // get queue list 
                            log += " GetQueueListRes. Result[" + this.MakeResult(data.result) + "]";
                            ReportPage.QueueList(data.extensionhandle);
                            break;
                        case ipron.APIMethod.GETAGENTLIST_RES: // get agent list 
                            log += " GetAgentListRes. Result[" + this.MakeResult(data.result) + "]";
                            ReportPage.AgentList(data.extensionhandle);
                            break;
                        case ipron.APIMethod.GETAGENTINFO_RES: // get agent info 
                            log += " GetAgentInfoRes. Result[" + this.MakeResult(data.result) + "]";
                            // if (ReportPage != null) {
                            //     var str = "";
                            //     str += "Tenant Name : " + data.tenantname + "\n";
                            //     str += "상태 : \n";
                            //     str += "Voice State [" + this.MakeAgentStateString(data.voipagentstate) + "] ";
                            //     str += "Voice State Sub [" + data.voipagentstatesub + "]\n";
                            //     str += "Chat State [" + this.MakeAgentStateString(data.chatagentstate) + "] ";
                            //     str += "Chat State Sub [" + data.chatagentstatesub + "]\n";
                            //     str += "VVoice State [" + this.MakeAgentStateString(data.vvoiceagentstate) + "] ";
                            //     str += "VVoice State Sub [" + data.vvoiceagentstatesub + "]\n";
                            //     str += "VChat State [" + this.MakeAgentStateString(data.vchatagentstate) + "] ";
                            //     str += "VChat State Sub [" + data.vchatagentstatesub + "]\n";
                            //     str += "email State [" + this.MakeAgentStateString(data.emailagentstate) + "] ";
                            //     str += "email State Sub [" + data.emailagentstatesub + "]\n";
                            //     str += "FAX State [" + this.MakeAgentStateString(data.faxagentstate) + "] ";
                            //     str += "FAX State Sub [" + data.faxagentstatesub + "]\n";
                            //     str += "MVOIP State [" + this.MakeAgentStateString(data.mvoipagentstate) + "] ";
                            //     str += "MVOIP State Sub [" + data.mvoipagentstatesub + "]\n";
                            //     str += "Web State [" + this.MakeAgentStateString(data.webagentstate) + "] ";
                            //     str += "Web State Sub [" + data.webagentstatesub + "]\n";
                            //     str += "조회 대상 DN : " + data.destdn + "\n";
                            //     str += "조회 대상 ID : " + data.destagentid + "\n";
                            //     str += "이름 : " + data.agentname + "\n";
                            //     str += "Agent Position : " + data.agentposition + "\n";
                            //     str += "Agent Level : " + data.agentlevel + "\n";
                            //     this.AddReportOutput(str);
                            // }
                            break;
                        case ipron.APIMethod.GETAGENTINFO_EX_RES: // get agent info Ex
                            log += " GetAgentInfoExRes. Result[" + this.MakeResult(data.result) + "]";
                            // if (ReportPage != null) {
                                var str = "";
                                str += "Tenant Name : " + data.tenantname + "\n";
                                str += "상태 : \n";
                                str += "Voice State [" + this.MakeAgentStateString(data.voipagentstate) + "] ";
                                str += "Voice State Sub [" + data.voipagentstatesub + "]\n";
                                str += "Chat State [" + this.MakeAgentStateString(data.chatagentstate) + "] ";
                                str += "Chat State Sub [" + data.chatagentstatesub + "]\n";
                                str += "VVoice State [" + this.MakeAgentStateString(data.vvoiceagentstate) + "] ";
                                str += "VVoice State Sub [" + data.vvoiceagentstatesub + "]\n";
                                str += "VChat State [" + this.MakeAgentStateString(data.vchatagentstate) + "] ";
                                str += "VChat State Sub [" + data.vchatagentstatesub + "]\n";
                                str += "email State [" + this.MakeAgentStateString(data.emailagentstate) + "] ";
                                str += "email State Sub [" + data.emailagentstatesub + "]\n";
                                str += "FAX State [" + this.MakeAgentStateString(data.faxagentstate) + "] ";
                                str += "FAX State Sub [" + data.faxagentstatesub + "]\n";
                                str += "MVOIP State [" + this.MakeAgentStateString(data.mvoipagentstate) + "] ";
                                str += "MVOIP State Sub [" + data.mvoipagentstatesub + "]\n";
                                str += "Web State [" + this.MakeAgentStateString(data.webagentstate) + "] ";
                                str += "Web State Sub [" + data.webagentstatesub + "]\n";
                                str += "조회 대상 DN : " + data.destdn + "\n";
                                str += "조회 대상 ID : " + data.destagentid + "\n";
                                str += "이름 : " + data.agentname + "\n";
                                str += "Agent Position : " + data.agentposition + "\n";
                                str += "Agent Level : " + data.agentlevel + "\n";
                                str += "Agent Alias : " + data.agentalias + "\n";
                                switch (data.agentpwdencryptkind) {
                                    case 1:
                                        str += "Agent PwdEncryptType : SHA-1 \n";
                                        break;
                                    case 2:
                                        str += "Agent PwdEncryptType : SHA-256 \n";
                                        break;
                                    case 5:
                                        str += "Agent PwdEncryptType : SHA-512 \n";
                                        break;
                                }
                                str += "Agent PwdChgDate : " + data.agentpwdchgdate + "\n";

                                str += "Agent UID : " + data.agentuid + "\n";
                                str += "Agent GroupId : " + data.groupid + "\n";
                                str += "Backup NodeID : " + data.bknodeid + "\n";
                                str += "Node Id : " + data.nodeid + "\n";
                                str += "Master Queue Id : " + data.masterqueid + "\n";
                                str += "Use Group Skill Option : " + data.usegrpsklopt + "\n";
                                str += "Use Group Media Option : " + data.usegrpmdaopt + "\n";
                                str += "AutoAnswer Chat Mode : " + data.autoansmodechat + "\n";
                                str += "AutoAnswer VideoVoice Mode : " + data.autoansmodevvoice + "\n";
                                str += "AutoAnswer VideoChat Mode : " + data.autoansmodevchat + "\n";
                                str += "AutoAnswer Email Mode : " + data.autoansmodeemail + "\n";
                                str += "AutoAnswer Fax Mode : " + data.autoansmodefax + "\n";
                                str += "AutoAnswer Voip Mode : " + data.autoansmodevoip + "\n";
                                str += "AutoAnswer MVoip Mode : " + data.autoansmodemvoip + "\n";
                                str += "AutoAnswer Web Mode : " + data.autoansmodeweb + "\n";

                                str += "AutoAnswer Chat Time : " + data.autoanstimechat + "\n";
                                str += "AutoAnswer VideoVoice Time : " + data.autoanstimevvoice + "\n";
                                str += "AutoAnswer VideoChat Time : " + data.autoanstimevchat + "\n";
                                str += "AutoAnswer Email Time : " + data.autoanstimeemail + "\n";
                                str += "AutoAnswer Fax Time : " + data.autoanstimefax + "\n";
                                str += "AutoAnswer Voip Time : " + data.autoanstimevoip + "\n";
                                str += "AutoAnswer MVoip Time : " + data.autoanstimemvoip + "\n";
                                str += "AutoAnswer Web Time : " + data.autoanstimeweb + "\n";

                                str += "Chat Ready Acc Time : " + data.accreadytimechat + "\n";
                                str += "VideoVoice Ready Acc Time : " + data.accreadytimevvoice + "\n";
                                str += "Video Chat Ready Acc Time : " + data.accreadytimevchat + "\n";
                                str += "Email Ready Acc Time : " + data.accreadytimeemail + "\n";
                                str += "Fax Ready Acc Time : " + data.accreadytimefax + "\n";
                                str += "Voip Ready Acc Time : " + data.accreadytimevoip + "\n";
                                str += "MVoip Ready Acc Time : " + data.accreadytimemvoip + "\n";
                                str += "Web Ready Acc Time : " + data.accreadytimeweb + "\n";

                                this.AddReportOutput(str);
                            // }
                            break;
                        case ipron.APIMethod.GETCATEGORYLIST_RES: // get category list
                            this.CategoryList(data.extensionhandle);
                            break;
                        case ipron.APIMethod.GETCATEGORYINFO_RES: // get category info
                        this.CategoryInfo(data);
                            break;
                        case ipron.APIMethod.GETAGENT_SKILLLIST_RES: // get agent skill list 
                            log += " GetAgentSkillListRes. Result[" + this.MakeResult(data.result) + "]";
                            this.AgentSkillList(data.extensionhandle);
                            break;
                        case ipron.APIMethod.GETAGENT_QUEUELIST_RES: // get agent queue list 
                            log += " GetAgentQueueListRes. Result[" + this.MakeResult(data.result) + "]";
                            this.AgentQueueList(data.extensionhandle);
                            break;
                        case ipron.APIMethod.BSR_RES: // bsr 
                            log += " BsrRes. Result[" + this.MakeResult(data.result) + "]";
                            this.BsrList(data.thisdn, data.queuedn, data.destdn, data.nodeid, data.bsrvalue, data.bsrprefix);
                            break;
                        case ipron.APIMethod.GETQUEUETRAFFIC_RES: // get queue traffic 
                            log += " GetQueueTrafficRes. Result[" + this.MakeResult(data.result) + "]";
                            this.QueueTraffic(data.svclvltime, data.svclevel, data.waitcount, data.allagentcount, data.loginagentcount, data.readyagentcount, data.inbusyagentcount, data.outbusyagentcount,
                                                    data.aftworkagentcount, data.notreadyagentcount, data.ringingcount, data.inboundtotal, data.accepttotal, data.abandontotal, data.transbackup,
                                                    data.answercountavr, data.talktimecountavr, data.waittime, data.maxwaittime, data.minwaittime, data.waittimeavr, data.waittimesum, data.distributewaitcount);
                            break;
                        case ipron.APIMethod.GETQUEUEORDER_RES: // get queue order 
                            log += " GetQueueOrderRes. Result[" + this.MakeResult(data.result) + "]";
                            this.GetQueueOrder(data.waitcount);
                            break;
                        case ipron.APIMethod.GETQUEUEORDER_EX_RES: // get queue order ex
                            log += " GetQueueOrderExRes. Result[" + this.MakeResult(data.result) + "]";
                            this.GetQueueOrderEx(data.localwaitcount, data.bsrwaitcount);
                            break;
                        case ipron.APIMethod.AGENT_REPORT_RES: // agent report 
                            log += " AgentReportRes. Result[" + this.MakeResult(data.result) + "]";
                            this.AgentReport(data.intotal, data.insuccess, data.intalktime, data.outtotal, data.outsuccess, data.outtalktime, data.transfercalls, data.logintime,
                                                   data.logouttime, data.inintsuc, data.inextsuc, data.inconsuc, data.outintsuc, data.outextsuc, data.outconsuc, data.ringingtime, data.dialingtime,
                                                   data.readytime, data.notreadytime, data.acwtime);
                            break;
                        case ipron.APIMethod.DI_AGENT_REPORT_RES: // DI agent report 
                            log += " DI AgentReportRes. Result[" + this.MakeResult(data.result) + "]";
                            break;
                        case ipron.APIMethod.AGENT_REPORT_EX_RES: // agent report 
                            log += " AgentReportExRes. Result[" + this.MakeResult(data.result) + "]";
                            this.AgentReportEx(data.intotal, data.insuccess, data.intalktime, data.outtotal, data.outsuccess, data.outtalktime, data.transfercalls, data.logintime,
                                                   data.logouttime, data.inintsuc, data.inextsuc, data.inconsuc, data.outintsuc, data.outextsuc, data.outconsuc, data.ringingtime, data.dialingtime,
                                                   data.readytime, data.notreadytime, data.acwtime, data.notreadycnt, data.readycnt, data.acwcnt, data.transintalktime, data.transinsuc);
                            break;
                        case ipron.APIMethod.GROUP_REPORT_RES: // group report 
                            log += " GroupReportRes. Result[" + this.MakeResult(data.result) + "]";
                            this.GroupReport(data);
                            break;
                        case ipron.APIMethod.QUEUE_REPORT_RES: // queue report 
                            log += " QueueReportRes. Result[" + this.MakeResult(data.result) + "]";
                            this.QueueReport(data);
                            break;
                        case ipron.APIMethod.TENANT_REPORT_RES: // tenant report 
                            log += " TenantReportRes. Result[" + this.MakeResult(data.result) + "]";
                            this.TenantReport(data);
                            break;
                        case ipron.APIMethod.DNIS_REPORT_RES: // dnis report 
                            log += " DnisReportRes. Result[" + this.MakeResult(data.result) + "]";
                            this.DnisReport(data.inboundtotal, data.abandontotal, data.agttry, data.agttryabandon, data.rejecttotal, data.accepttotal, data.nonsvctotal, data.ivrsvccount, data.waitcount, data.inbusyagentcount, data.ivragtconfcount)
                            break;
                        case ipron.APIMethod.MEDIA_ATTACH_RES: // media attach 
                            log += " MediaAttachtRes. Result[" + this.MakeResult(data.result) + "]";
                            break;
                        case ipron.APIMethod.MEDIA_DEATTACH_RES: // media detach 
                            log += " MediaDetachRes. Result[" + this.MakeResult(data.result) + "]";
                            break;
                        case ipron.APIMethod.MEDIA_PLAY_RES: // media play 
                            log += " MediaPlayRes. Result[" + this.MakeResult(data.result) + "]";
                            break;
                        case ipron.APIMethod.MEDIA_COLLECT_RES: // media collect 
                            log += " MediaCollectRes. Result[" + this.MakeResult(data.result) + "]";
                            break;
                        case ipron.APIMethod.AGENT_SUBSCRIBE_EX_RES: // agent subscribe 
                            log += " AgentSubscribeExRes. Result[" + this.MakeResult(data.result) + "]";
                            break;
                        case ipron.APIMethod.AGENT_SUBSCRIBE_RES: // agent subscribe 
                            log += " AgentSubscribeRes. Result[" + this.MakeResult(data.result) + "]";
                            break;
                        case ipron.APIMethod.GROUP_SUBSCRIBE_RES: // group subscribe 
                            log += " GroupSubscribeRes. Result[" + this.MakeResult(data.result) + "]";
                            break;
                        case ipron.APIMethod.QUEUE_SUBSCRIBE_RES: // queue subscribe 
                            log += " QueueSubscribeRes. Result[" + this.MakeResult(data.result) + "]";
                            break;
                        case ipron.APIMethod.TENANT_SUBSCRIBE_RES: // tenant subscribe 
                            log += " TenantSubscribeRes. Result[" + this.MakeResult(data.result) + "]";
                            break;
                        case ipron.APIMethod.DNIS_SUBSCRIBE_RES: // dnis subscribe 
                            log += " DnisSubscribeRes. Result[" + this.MakeResult(data.result) + "]";
                            break;
                        case ipron.APIMethod.CLOSE_SUBSCRIBE_RES: // close subscribe
                            log += " CloseSubscribeRes. Result[" + this.MakeResult(data.result) + "]";
                            break;
                        case ipron.APIMethod.GETAGENTLIST_EX_RES: // get agent list ex
                            log += " AdGetAgentListRes. Result[" + this.MakeResult(data.result) + "]";
                            AdvanceListPage.SetList(data.method, data.advanceListHandle);
                            break;
                        case ipron.APIMethod.GETGROUPLIST_EX_RES: // get group list ex
                            log += " AdGetGroupListRes. Result[" + this.MakeResult(data.result) + "]";
                            AdvanceListPage.SetList(data.method, data.advanceListHandle);
                            break;
                        case ipron.APIMethod.GETQUEUELIST_EX_RES: // get queue list ex
                            log += " AdGetQueueListRes. Result[" + this.MakeResult(data.result) + "]";
                            AdvanceListPage.SetList(data.method, data.advanceListHandle);
                            break;
                        case ipron.APIMethod.GETAGENT_SKILLLIST_EX_RES: // get agent skill list ex
                            log += " AdGetAgentSkillListRes. Result[" + this.MakeResult(data.result) + "]";
                            AdvanceListPage.SetList(data.method, data.advanceListHandle);
                            break;
                        case ipron.APIMethod.GETAGENT_QUEUELIST_EX_RES: // get agent queue list ex
                            log += " AdGetAgentQueueListRes. Result[" + this.MakeResult(data.result) + "]";
                            AdvanceListPage.SetList(data.method, data.advanceListHandle);
                            break;
                        case ipron.APIMethod.DTMF_PLAY_RES: // Dtmf Play
                            log += " DtmfPlayRes. Result[" + this.MakeResult(data.result) + "]";
                            break;
                        case ipron.APIMethod.VIRTUAL_QUEUE_RES:
                            log += " VirtualQueueRes. Result[" + this.MakeResult(data.result) + "]";
                            break;
                        case ipron.APIMethod.SET_CALLBACK_RES:
                            log += " SetCallbackRes. Result[" + this.MakeResult(data.result) + "]";
                            break;
                        case ipron.APIMethod.MEDIA_DND_RES:
                            log += " MediaDndRes. Result[" + this.MakeResult(data.result) + "]";
                            break;
                        case ipron.APIMethod.RESERVED_AGENT_STATE_RES:
                            log += " ReservedAgentStateRes. Result[" + this.MakeResult(data.result) + "]";
                            break;
                        case ipron.APIMethod.SEND_GLOBAL_EVENT_RES:
                            log += " SendGlobalEventRes. Result[" + this.MakeResult(data.result) + "]";
                            break;
                        case ipron.APIMethod.AGENTCALL_RES:
                            log += " AgentCallRes. Result[" + this.MakeResult(data.result) + "]";
                            break;
                        case ipron.APIMethod.GET_MEDIA_ACTIVATE_RES:
                            log += " GetMediaRes. Result[" + this.MakeResult(data.result) + "]" + "\n";
                            log += " Chat Activate : " + data.chatactivate;
                            log += " VVoice Activate : " + data.vvoiceactivate;
                            log += " VChat Activate : " + data.vchatactivate;
                            log += " Email Activate : " + data.emailactivate;
                            log += " Fax Activate : " + data.faxactivate;
                            log += " Voip Activate : " + data.voipactivate;
                            log += " MVoip Activate : " + data.mvoipactivate;
                            log += " Web Activate : " + data.webactivate;
                            break;
                        case ipron.APIMethod.GETROUTEPOLICY_RES:
                            log += "GetRoutePolicy. Result[" + this.MakeResult(data.result) + "]" + "\n";
                            switch (data.routepolicy) {
                                case 0:
                                    log += "정책적으로 호 분배가 가능하지 않음";
                                    break;
                                case 1:
                                    log += "정책적으로 호 분배가 가능하고 현재 즉시 수신 가능한 상태";
                                    break;
                                case 2:
                                    log += "정책적으로 호 분배가 가능하지만 현재는 수신 할 수 없는 상태";
                                    break;
                            }
                            break;
                        case ipron.APIMethod.SET_MEDIAREADY_STATE_RES:
                            log += " SetMediaReadyStateRes. Result[" + this.MakeResult(data.result) + "]";
                            break;
                        case ipron.APIMethod.GET_MEDIAREADY_STATE_RES:
                            log += " GetMediaReadyStateRes. Result[" + this.MakeResult(data.result) + "] AgentID[" + data.agentid + "] MediaType["
                             + data.mediatype + "] MediaReady [" + data.mediaready + "]";
                            break;
                        case ipron.APIMethod.GET_USER_CDR_RES:
                            log += " GetUserCdrRes. Result[" + this.MakeResult(data.result) + "] Conn ID[" + data.connectionid + "] UserCdr[" + data.usercdr + "] PrivateData[" + data.privatedata + "]";
                            break;
                        case ipron.APIMethod.SET_USER_CDR_RES:
                            log += " GetUserCdrRes. Result[" + this.MakeResult(data.result) + "] Conn ID[" + data.connectionid + "] UserCdr[" + data.usercdr + "] PrivateData[" + data.privatedata + "]";
                            break;
                        case ipron.APIMethod.GET_USER_CDR_EX_RES:
                            log += " GetUserCdrExRes. Result[" + this.MakeResult(data.result) + "] Conn ID[" + data.connectionid + "] UserCdr[" + data.usercdr + "] PrivateData[" + data.privatedata + "]";
                            break;
                        case ipron.APIMethod.SET_USER_CDR_EX_RES:
                            log += " SetUserCdrExRes. Result[" + this.MakeResult(data.result) + "] Conn ID[" + data.connectionid + "] UserCdr[" + data.usercdr + "] PrivateData[" + data.privatedata + "]";
                            break;
                        case ipron.APIMethod.SET_MUTE_ENABLE_RES:
                            log += " SetDeviceMuteEnableRes. Result[" + this.MakeResult(data.result) + "] This DN [" + data.thisdn + "] Conn ID[" + data.connectionid + "] PrivateData[" + data.privatedata;
                            log += "] Media Type [" + data.mediatype + "] Enable [" + data.enable + "]";
                            break;
                        case ipron.APIMethod.RESERVE_IR_ATTR_RES:
                            log += " ReserveIrAttrRes. Result[" + this.MakeResult(data.result) + "] Ani[" + data.aninumber + "] PrivateData[" + data.privatedata;
                            log += "] Media Type [" + data.mediatype + "]";
                            break;
                        case ipron.APIMethod.FIND_WAIT_IR_RES:
                            log += " FindWaitIrRes. Result[" + this.MakeResult(data.result) + "] Ani [" + data.aninumber + "] PrivateData[" + data.privatedata + "]";
                            break;
                        case ipron.APIMethod.GETCONNECTION_EX_RES:
                            log += " GetConnectionExRes. Result[" + this.MakeResult(data.result) + "]";
                            break;
                        case ipron.APIMethod.GETCALL_INFO_RES:
                            log += " GetCallInfoRes. Result[" + this.MakeResult(data.result) + "]";
                            break;
                        case ipron.APIMethod.GET_CALLINFO_EX_RES:
                            log += " GetCallInfoExRes. Result[" + this.MakeResult(data.result) + "] Ucid[" + data.ucid + "] NodeId[" + data.nodeid + "] Hop[" + data.hop + "]";
                            this.$eventBus.$emit('GET_CALLINFO_EX_RES', data);
                            break;
                        case ipron.APIMethod.GETCATEGORY_LIST_RES:
                            log += " GetCategoryListRes. Result[" + this.MakeResult(data.result) + "]";
                            break;
                        case ipron.APIMethod.GETCATEGORY_INFO_RES:
                            log += " GetCategoryInfoRes. Result[" + this.MakeResult(data.result) + "]";
                            break;
                        case ipron.APIMethod.GETAGENT_MASTERQUEUEINFO_RES:
                            log += " GetAgentMasterQueueInfo. Result[" + this.MakeResult(data.result) + "] QueueDN [" + data.queuedn + "] QueueId [" + data.queueid + "] QueueName [" + data.queuename + "] SkillId [" + data.skillid + "] SkillName [" + data.skillname + "]";
                            break;
                        case ipron.APIMethod.GET_DEVICE_ACTIVATE_RES:
                            log += " GetDeviceActivate. Result[" + this.MakeResult(data.result) + "]";
                            break;
                        case ipron.APIMethod.SET_USER_CDR_V5_RES:
                            log += " SetUserCdrV5Res. Result[" + this.MakeResult(data.result) + "] Conn ID[" + data.connectionid + "] UserCdrType[" + data.usercdrtype + "] UserCdrIndex[" + data.usercdrindex + "] UserCdr[" + data.usercdr + "] PrivateData[" + data.privatedata + "]";
                            break;
                        case ipron.APIMethod.MUTE_TRANSFER_EX_RES: // mute transfer
                            log += " MuteTransferExRes. Result[" + this.MakeResult(data.result) + "]";
                            break;
                        case ipron.APIMethod.GET_MEDIA_OPTION_RES:
                            log += " GetMediaOptionRes. Result[" + this.MakeResult(data.result) + "] TenantName [" + data.tenantname + "] AgentId [" + data.agentid + "]\n";
                            log += "ChatWeight[" + data.chatweight + "] ChatMax[" + data.chatmax + "]\n";
                            log += "VVoiceWeight[" + data.vvoiceweight + "] VVoiceMax[" + data.vvoicemax + "]\n";
                            log += "VChatWeight[" + data.vchatweight + "] VChatMax[" + data.vchatmax + "]\n";
                            log += "EMailWeight[" + data.emailweight + "] EMailMax[" + data.emailmax + "]\n";
                            log += "FaxWeight[" + data.faxweight + "] FaxMax[" + data.faxmax + "]\n";
                            log += "VoipWeight[" + data.voipweight + "] VoipMax[" + data.voipmax + "]\n";
                            log += "MVoipWeight[" + data.mvoipweight + "] MVoipMax[" + data.mvoipmax + "]\n";
                            log += "WebWeight[" + data.webweight + "] WebMax[" + data.webmax + "]\n";
                            break;
                        case ipron.APIMethod.SET_MEDIA_OPTION_RES:
                            log += " SetMediaOptionRes. Result[" + this.MakeResult(data.result) + "] TenantName [" + data.tenantname + "] AgentId [" + data.agentid + "] MediaSet[" + data.mediaset + "] AgtMediaWeight[" + data.agtmediaweight + "] AgtMediaMax[" + data.agtmediamax + "]";
                            break;
                        case ipron.APIMethod.GET_GROUPSKILL_LIST_RES: // get agent skill list 
                            log += " GetGroupSkillListRes. Result[" + this.MakeResult(data.result) + "]";
                            this.GroupSkillList(data.extensionhandle);
                            break;
                        case ipron.APIMethod.GET_DEVICE_LIST_RES: // get device list 
                            log += " GetDeviceListRes. Result[" + this.MakeResult(data.result) + "]";
                            this.GetDeviceList(data.extensionhandle);
                            break;
                        case ipron.APIMethod.SET_AFT_RECALLSTATE_RES:
                            log += " SetAftRecallStateRes. Result[" + this.MakeResult(data.result) + "]";
                            break;
                        case ipron.APIMethod.GET_TENANT_LIST_RES:
                            log += " GetTenantListRes. Result[" + this.MakeResult(data.result) + "]";
                            this.TenantList(data.extensionhandle);
                            break;
                        case ipron.APIMethod.AGENTCALL_EX_RES:
                            log += " AgentCallExRes. Result[" + this.MakeResult(data.result) + "]";
                            break;
                        case ipron.APIMethod.GET_CALL_POSITION_RES:
                            log += " GetCallPositionRes. Result[" + this.MakeResult(data.result) + "]";
                            this.GetCallPosition(data.localwaitcount, data.bsrwaitcount);
                            break;
                        case ipron.APIMethod.GET_QUEUE_TRAFFIC_EX_RES: // get queue traffic 
                            log += " GetQueueTrafficExRes. Result[" + this.MakeResult(data.result) + "]";
                            this.QueueTraffic(data.svclvltime, data.svclevel, data.waitcount, data.allagentcount, data.loginagentcount, data.readyagentcount, data.inbusyagentcount, data.outbusyagentcount,
                                                    data.aftworkagentcount, data.notreadyagentcount, data.ringingcount, data.inboundtotal, data.accepttotal, data.abandontotal, data.transbackup,
                                                    data.answercountavr, data.talktimecountavr, data.waittime, data.maxwaittime, data.minwaittime, data.waittimeavr, data.waittimesum, data.distributewaitcount);
                            break;
                        case ipron.APIMethod.GET_IR_STATE_RES:
                            log += " GetIRStateRes. Result[" + this.MakeResult(data.result) + "] Total[" + data.devicecount + "] Busy[" + data.busydevicecount + "] Idle[" + data.idledevicecount + "]";
                            break;
                        case ipron.APIMethod.GET_DR_STATE_RES:
                            log += " GetDRStateRes. Result[" + this.MakeResult(data.result) + "] State[" + data.drstate + "]";
                            break;
                        case ipron.APIMethod.AGENTLOGIN_EX_RES: // agent login ex
                            log += " AgentLoginExRes. Result[" + this.MakeResult(data.result) + "]";
                            break;
                        case ipron.APIMethod.AGENTLOGIN_DUP_RES: // agent login dup
                            log += " AgentLoginDupRes. Result[" + this.MakeResult(data.result) + "]";                 
                            if(data.result == 0){                                
                                ipron.AgentLoginEx(data.agentdn, data.agentid, data.agentpassword, data.tenantname, data.agentreqstate, data.agentreqstatesub, "", data.passwdtype, data.mediaset, 1);
                            }else if(data.result == 2006){                                
                                if(confirm("이미 로그인 된 아이디입니다. 새로 로그인하시겠습니까?") == true){                                    
                                    ipron.AgentLoginEx(data.agentdn, data.agentid, data.agentpassword, data.tenantname, data.agentreqstate, data.agentreqstatesub, "", data.passwdtype, data.mediaset, 1);
                                }
            
                            }
                            break;
                        case ipron.APIMethod.GROUPLOGIN_RES: // group login
                            log += " GroupLoginRes. Result[" + this.MakeResult(data.result) + "]";
                            break;
                        case ipron.APIMethod.GROUPLOGOUT_RES: // group logout
                            log += " GroupLogoutRes. Result[" + this.MakeResult(data.result) + "]";
                            break;
                    }
                    break;
                default:
                    break;
            }

            this.AddResponse(log);

            if (data.extensionhandle > 0)
                this.AddResponse(this.ExtensionData((data)));
        },

        AgentNodeList(handle) {
            let i = 0, j = 0;
            let nRecord = 0; nField = 0;
            let strKey, strValue;
            let str = "";
    
            nRecord = ipron.EXTGetRecordCount(handle);
    
            for (i = 0; i < nRecord; i++) {
                nField = ipron.EXTGetValueCountForRecord(handle, i);
    
                strKey = ipron.EXTGetKey(handle, i);
    
                if (nField == 1) {
                    strValue = ipron.EXTGetValueForRecord(handle, i, 0);
                    str = strKey + ' : ' + strValue;
                    AddReportOutput(str);
                    continue;
                }
    
                str = "ID : " + strKey + " | ";
    
                for (j = 0; j < nField; j++) {
                    strValue = topPage.api.EXTGetValueForRecord(handle, i, j);
                    switch (j) {
                        case 0: str += "Group Id : " + strValue + " | "; break;  // 할당 DN
                        case 1: str += "Master QueueId : " + strValue + " | "; break;  // Login DN
                        case 2: str += "Node Id : " + strValue + " | "; break;  // Login DN
                        case 3: str += "Tenant Id : " + strValue + " | "; break;  // State
                        case 4: str += "Login DN : " + strValue + " | "; break;   // State Subcode
                        case 5: str += "Name : " + strValue + " | "; break;
                        case 6: str += "Login ID : " + strValue + " | "; break;
                        case 7: str += "상태유지시간 : " + strValue; break;
                        default: str += "|Unknown : " + strValue; break;
                    }
                }
                AddReportOutput(str);
            }
        },

        CategoryList(handle) {
            let i = 0, j = 0;
            let nRecord = 0; nField = 0;
            let strKey, strValue;
            let str = "";
    
            nRecord = ipron.EXTGetRecordCount(handle);
    
            for (i = 0; i < nRecord; i++) {
                nField = ipron.EXTGetValueCountForRecord(handle, i);
    
                strKey = ipron.EXTGetKey(handle, i);
    
                str = "Skill ID : " + strKey + " | ";
    
                for (j = 0; j < nField; j++) {
                    strValue = ipron.EXTGetValueForRecord(handle, i, j);
                    switch (j) {
                        case 0: str += "Id : " + strValue + " | "; break;
                        case 1: str += "Queue Dn : " + strValue; break;
                        case 2: str += "Name : " + strValue; break;
                        default: str += " | Unknown Data : " + strValue; break;
                    }
                }
                this.AddReportOutput(str);
            }
        },

        AgentSkillList(handle) {
            let i = 0, j = 0;
            let nRecord = 0; nField = 0;
            let strKey, strValue;
            let str = "";
    
            nRecord = ipron.EXTGetRecordCount(handle);
    
            for (i = 0; i < nRecord; i++) {
                nField = ipron.EXTGetValueCountForRecord(handle, i);
    
                strKey = ipron.EXTGetKey(handle, i);
    
                str = "Skill ID : " + strKey + " | ";
    
                for (j = 0; j < nField; j++) {
                    strValue = ipron.EXTGetValueForRecord(handle, i, j);
                    switch (j) {
                        case 0: str += "Name : " + strValue + " | "; break;
                        case 1: str += "Enable : " + strValue; break;
                        default: str += " | Unknown Data : " + strValue; break;
                    }
                }
                this.AddReportOutput(str);
            }
        },

        AgentQueueList(handle) {
            let i = 0, j = 0;
            let nRecord = 0; nField = 0;
            let strKey, strValue;
            let str = "";
    
            nRecord = ipron.EXTGetRecordCount(handle);
    
            for (i = 0; i < nRecord; i++) {
                nField = ipron.EXTGetValueCountForRecord(handle, i);
    
                strKey = ipron.EXTGetKey(handle, i);
    
                str = "Queue ID : " + strKey + " | ";
    
                for (j = 0; j < nField; j++) {
                    strValue = ipron.EXTGetValueForRecord(handle, i, j);
                    switch (j) {
                        case 0: str += "Name : " + strValue + " | "; break;
                        case 1: str += "DN : " + strValue + " | "; break;
                        case 2: str += "SkillID : " + strValue; break;
                        default: str += " | Unknown Data : " + strValue; break;
                    }
                }
                this.AddReportOutput(str);
            }
        },

        BsrList(this_dn, queue_dn, dest_dn, node_id, bsr_value, bsr_prefix) {
            let msg = "";
    
            msg += "BSR List \n";
            msg += "This DN : " + this_dn.toString() + "\n";
            msg += "Queue DN : " + queue_dn.toString() + "\n";
            msg += "Dest DN : " + dest_dn.toString() + "\n";
            msg += "Dest Node ID : " + node_id.toString() + "\n";
            msg += "BSR 결과 측정치 : " + bsr_value.toString() + "\n";
            msg += "BSR 결과 Prefix : " + bsr_prefix.toString() + "\n";
    
            this.AddReportOutput(msg);
        },

        QueueTraffic(svc_lvl_time, svc_level, wait_count, all_agent_count, login_agent_count, ready_agent_count, inbusy_agent_count, outbusy_agent_count, aft_agent_count, notready_agent_count, ringing_count, inbound_total, accept_total, abandon_total, trans_backup, answer_count_avr, talktime_count_avr, wait_time, max_wait_time, min_wait_time, wait_time_avr, wait_time_sum, distribute_wait_coun) {

            let msg = "";
    
            msg += "Queue Traffic \n";
            msg += "서비스 레벨 타임 : " + svc_lvl_time.toString() + "\n";
            msg += "서비스 레벨 : " + svc_level.toString() + "\n";
            msg += "대기호 : " + wait_count.toString() + "\n";
            msg += "전체 상담원 : " + all_agent_count.toString() + "\n";
            msg += "로그인 중인 상담원 : " + login_agent_count.toString() + "\n";
            msg += "대기중인 상담원 : " + ready_agent_count.toString() + "\n";
            msg += "Inbusy 상담원 : " + inbusy_agent_count.toString() + "\n";
            msg += "Outbusy 상담원 : " + outbusy_agent_count.toString() + "\n";
            msg += "후 처리 중인 상담원 : " + aft_agent_count.toString() + "\n";
            msg += "자리 비움 중인 상담원 : " + notready_agent_count.toString() + "\n";
            msg += "벨 울림 상태 수 : " + ringing_count.toString() + "\n";
            msg += "당일 큐 인입호 : " + inbound_total.toString() + "\n";
            msg += "당일 큐 응대호 : " + accept_total.toString() + "\n";
            msg += "당일 큐 포기호 : " + abandon_total.toString() + "\n";
            msg += "Backup Queue DN 전환 호 수 : " + trans_backup.toString() + "\n";
            msg += "상담원 별 평균 응대호 : " + answer_count_avr.toString() + "\n";
            msg += "상담원 별 평균 통화 시간 : " + talktime_count_avr.toString() + "\n";
            msg += "예상 대기 시간 : " + wait_time.toString() + "\n";
            msg += "최장 대기 시간 : " + max_wait_time.toString() + "\n";
            msg += "최소 대기 시간 : " + min_wait_time.toString() + "\n";
            msg += "대기 시간 평균 : " + wait_time_avr.toString() + "\n";
            msg += "대기 시간 합계 : " + wait_time_sum.toString() + "\n";
            msg += "분배 대기호 수 : " + distribute_wait_coun.toString() + "\n";
    
            this.AddReportOutput(msg);
        },

        GetQueueOrder(wait_count) {
            let msg = "";
    
            msg += "Queue Order \n";
            msg += "Wait Count : " + wait_count.toString() + "\n";
    
            this.AddReportOutput(msg);
        },

        GetQueueOrderEx(local_wait_count, bsr_wait_count) {
            let msg = "";
    
            msg += "Queue Order Ex \n";
            msg += "Local Wait Count : " + local_wait_count.toString() + "\n";
            msg += "BSR Wait Count : " + bsr_wait_count.toString() + "\n";
    
            this.AddReportOutput(msg);
        },

        AgentReport(in_total, in_success, in_talk_time, out_total, out_success, out_talk_time, transfer_calls, login_time, logout_time, in_int_suc, in_ext_suc, in_con_suc, out_int_suc, out_ext_suc, out_con_suc, ringing_time, dialing_time, ready_time, notready_time, acw_time) {
            let msg = "";
    
            msg += "Agent Report \n";
            msg += "Inbound Total : " + in_total.toString() + "\n";
            msg += "Inbound 성공 : " + in_success.toString() + "\n";
            msg += "Inbound 통화시간 : " + in_talk_time.toString() + "\n";
            msg += "Outbound Total : " + out_total.toString() + "\n";
            msg += "Outbound 성공 : " + out_success.toString() + "\n";
            msg += "Outbound 통화시간 : " + out_talk_time.toString() + "\n";
            msg += "전환 호 합계 : " + transfer_calls.toString() + "\n";
            msg += "최근 로그인 시각 : " + login_time + "\n";
            msg += "최근 로그아웃 시각 : " + logout_time + "\n";
            msg += "내선 인바운드 통화수 : " + in_int_suc.toString() + "\n";
            msg += "국선 인바운드 통화수 : " + in_ext_suc.toString() + "\n";
            msg += "협의 인바운드 통화수 : " + in_con_suc.toString() + "\n";
            msg += "내선 아웃바운드 통화수 : " + out_int_suc.toString() + "\n";
            msg += "국선 아웃바운드 통화수 : " + out_ext_suc.toString() + "\n";
            msg += "협의 아웃바운드 통화수 : " + out_con_suc.toString() + "\n";
            msg += "벨울림 시간 : " + ringing_time.toString() + "\n";
            msg += "다이얼링 시간 : " + dialing_time.toString() + "\n";
            msg += "수신대기상태 시간 : " + ready_time.toString() + "\n";
            msg += "자리비움상태 시간 : " + notready_time.toString() + "\n";
            msg += "후 처리상태 시간 : " + acw_time.toString() + "\n";
    
            this.AddReportOutput(msg);
        },

        AgentReportEx(in_total, in_success, in_talk_time, out_total, out_success, out_talk_time, transfer_calls, login_time, logout_time, in_int_suc, in_ext_suc, in_con_suc, out_int_suc, out_ext_suc, out_con_suc, ringing_time, dialing_time, ready_time, notready_time, acw_time, notready_cnt, ready_cnt, acw_cnt, trans_in_talktime, trans_in_suc) {
            let msg = "";
    
            msg += "Agent Report \n";
            msg += "Inbound Total : " + in_total.toString() + "\n";
            msg += "Inbound 성공 : " + in_success.toString() + "\n";
            msg += "Inbound 통화시간 : " + in_talk_time.toString() + "\n";
            msg += "Outbound Total : " + out_total.toString() + "\n";
            msg += "Outbound 성공 : " + out_success.toString() + "\n";
            msg += "Outbound 통화시간 : " + out_talk_time.toString() + "\n";
            msg += "전환 호 합계 : " + transfer_calls.toString() + "\n";
            msg += "최근 로그인 시각 : " + login_time + "\n";
            msg += "최근 로그아웃 시각 : " + logout_time + "\n";
            msg += "내선 인바운드 통화수 : " + in_int_suc.toString() + "\n";
            msg += "국선 인바운드 통화수 : " + in_ext_suc.toString() + "\n";
            msg += "협의 인바운드 통화수 : " + in_con_suc.toString() + "\n";
            msg += "내선 아웃바운드 통화수 : " + out_int_suc.toString() + "\n";
            msg += "국선 아웃바운드 통화수 : " + out_ext_suc.toString() + "\n";
            msg += "협의 아웃바운드 통화수 : " + out_con_suc.toString() + "\n";
            msg += "벨울림 시간 : " + ringing_time.toString() + "\n";
            msg += "다이얼링 시간 : " + dialing_time.toString() + "\n";
            msg += "수신대기상태 시간 : " + ready_time.toString() + "\n";
            msg += "자리비움상태 시간 : " + notready_time.toString() + "\n";
            msg += "후 처리상태 시간 : " + acw_time.toString() + "\n";
            msg += "수신대기 횟수 : " + ready_cnt.toString() + "\n";
            msg += "자리비움 횟수 : " + notready_cnt.toString() + "\n";
            msg += "후 처리 횟수 : " + acw_cnt.toString() + "\n";
            msg += "호전환 수신 통화시간 : " + trans_in_talktime.toString() + "\n";
            msg += "호전환 수신 통화호 : " + trans_in_suc.toString() + "\n";
    
            this.AddReportOutput(msg);
        },

        GroupReport(data) {
            let msg = "";
            let szExt = "";
    
            msg += "Group Report \n";
            msg += "응답호 대기시간 평균 : " + data.answaitavr + "\n";
            msg += "내선 인바운드 인입 호 수 : " + data.ininttot + "\n";
            msg += "내선 인바운드 성공 통화 수 : " + data.inintsuc + "\n";
            msg += "국선 인바운드 인입 호 수 : " + data.inexttot + "\n";
            msg += "국선 인바운드 성공 통화 수 : " + data.inextsuc + "\n";
            msg += "내선 아웃바운드 통화 시도 수 : " + data.outinttot + "\n";
            msg += "내선 아웃바운드 성공 통화 수 : " + data.outintsuc + "\n";
            msg += "국선 아웃바운드 통화 시도 수 : " + data.outexttot + "\n";
            msg += "국선 아웃바운드 성공 통화 수 : " + data.outextsuc + "\n";
            msg += "내선 인바운드 통화 시간 합계 : " + data.ininttalktime + "\n";
            msg += "국선 인바운드 통화 시간 합계 : " + data.inexttalktime + "\n";
            msg += "전체 상담원 수 : " + data.allagentcount + "\n";
            msg += "로그인 상담원 수 : " + data.loginagentcount + "\n";
            msg += "수신대기 상담원 수 : " + data.readyagentcount + "\n";
            msg += "벨울림 상담원 수 : " + data.ringingcount + "\n";
            msg += "다이얼링 상담원 수 : " + data.dialingcount + "\n";
            msg += "내선 인바운드 통화 중 상담원 수 : " + data.ibintbusyagt + "\n";
            msg += "국선 인바운드 통화 중 상담원 수 : " + data.ibextbusyagt + "\n";
            msg += "내선 아웃바운드 통화 중 상담원 수: " + data.obintbusyagt + "\n";
            msg += "국선 아웃바운드 통화 중 상담원 수 : " + data.obextbusyagt + "\n";
            msg += "후처리 상담원 수 : " + data.aftworkagentcount + "\n";
            msg += "자리비움 상담원 수 : " + data.notreadyagentcount + "\n";
    
            this.AddReportOutput(msg);
        },

        QueueReport(data) {
            let msg = "";
            let szExt = "";
    
            msg += "Queue Report \n";
            msg += "대기호 : " + data.waitcount + "\n";
            msg += "현재 대기호 최대 대기 시간 : " + data.maxwaittime + "\n";
            msg += "현재 대기호 대기시간 합계 : " + data.waittimesum + "\n";
            msg += "인입호 : " + data.inboundtotal + "\n";
            msg += "응답호 : " + data.accepttotal + "\n";
            msg += "Non-Service 처리호 : " + data.nonsvctotal + "\n";
            msg += "서비스 레벨 이내 응답호 : " + data.svcaccepttotal + "\n";
            msg += "서비스 레벨 이내 포기호 : " + data.svcabandontotal + "\n";
            msg += "포기호 : " + data.abandontotal + "\n";
            msg += "거부호 : " + data.rejecttotal + "\n";
            msg += "응답률 : " + data.acceptratio + "\n";
            msg += "내선 아웃바운드 통화 시도 수 : " + data.outinttot + "\n";
            msg += "내선 아웃바운드 성공 통화 수 : " + data.outintsuc + "\n";
            msg += "국선 아웃바운드 통화 시도 수 : " + data.outexttot + "\n";
            msg += "국선 아웃바운드 성공 통화 수 : " + data.outextsuc + "\n";
            msg += "응답호 총 통화시간 : " + data.accepttalktimesum + "\n";
            msg += "서비스 레벨 타임 : " + data.svclvltime + "\n";
            msg += "서비스 레벨 : " + data.svclevel + "\n";
            msg += "전체 상담원 수 : " + data.allagentcount + "\n";
            msg += "로그인 상담원 수 : " + data.loginagentcount + "\n";
            msg += "수신대기 상담원 수 : " + data.readyagentcount + "\n";
            msg += "벨울림 상담원 수 : " + data.ringingcount + "\n";
            msg += "다이얼링 상담원 수 : " + data.dialingcount + "\n";
            msg += "내선 인바운드 통화 중 상담원 수 : " + data.ibintbusyagt + "\n";
            msg += "국선 인바운드 통화 중 상담원 수 : " + data.ibextbusyagt + "\n";
            msg += "내선 아웃바운드 통화 중 상담원 수 : " + data.obintbusyagt + "\n";
            msg += "국선 아웃바운드 통화 중 상담원 수 : " + data.obextbusyagt + "\n";
            msg += "후처리 상담원 수 : " + data.aftworkagentcount + "\n";
            msg += "자리비움 상담원 수 : " + data.notreadyagentcount + "\n";
    
            this.AddReportOutput(msg);
        },

        TenantReport(data) {
            let msg = "";
            let szExt = "";
    
            msg += "Tenant Report \n";
            msg += "현재 인바운드 큐 대기호 : " + data.waitcount + "\n";
            msg += "현재 인바운드 대기호 최대 대기 시간 : " + data.maxwaittime + "\n";
            msg += "현재 인바운드 대기호 대기시간 합계 : " + data.waittimesum + "\n";
            msg += "IVR 인입호 : " + data.ivrtotal + "\n";
            msg += "IVR 포기호 : " + data.ivrabandon + "\n";
            msg += "IVR 전환호 : " + data.ivrdodtrns + "\n";
            msg += "인바운드 큐 인입호 : " + data.ivricqtrns + "\n";
            msg += "인바운드 큐 응답호 : " + data.icqaccept + "\n";
            msg += "인바운드 큐 서비스 레벨 이내 응답호 : " + data.icqsvclvlaccept + "\n";
            msg += "인바운드 큐 서비스 레벨 이내 포기호 : " + data.icqsvclvlabandon + "\n";
            msg += "인바운드 큐 포기호 : " + data.icqabandon + "\n";
            msg += "인바운드 큐 거부호 : " + data.icqreject + "\n";
            msg += "Non-Service 처리호 : " + data.nonsvctotal + "\n";
            msg += "국선 아웃바운드 시도 호 : " + data.outexttot + "\n";
            msg += "국선 아웃바운드 성공 호 : " + data.outextsuc + "\n";
            msg += "인바운드 큐 응답률 : " + data.icqacceptratio + "\n";
            msg += "인바운드 통화 시간 합계 : " + data.intalktime + "\n";
            msg += "아웃바운드 통화 시간 합계 : " + data.outtalktime + "\n";
            msg += "서비스 레벨 : " + data.svclevel + "\n";
            msg += "전체 상담원 수 : " + data.allagentcount + "\n";
            msg += "로그인 상담원 수 : " + data.loginagentcount + "\n";
            msg += "수신대기 상담원 수 : " + data.readyagentcount + "\n";
            msg += "벨울림 상담원 수 : " + data.ringingcount + "\n";
            msg += "다이얼링 상담원 수 : " + data.dialingcount + "\n";
            msg += "내선 인바운드 통화 중 상담원 수 : " + data.ibintbusyagt + "\n";
            msg += "국선 인바운드 통화 중 상담원 수 : " + data.ibextbusyagt + "\n";
            msg += "내선 아웃바운드 통화 중 상담원 수 : " + data.obintbusyagt + "\n";
            msg += "국선 아웃바운드 통화 중 상담원 수 : " + data.obextbusyagt + "\n";
            msg += "후처리 상담원 수 : " + data.aftworkagentcount + "\n";
            msg += "자리비움 상담원 수 : " + data.notreadyagentcount + "\n";
    
            this.AddReportOutput(msg);
        },

        DnisReport(inbound_total, abandon_total, agt_try, agt_try_abandon, reject_total, accept_total, non_svc_total, ivr_svc_count, wait_count, inbusy_agent_count, ivr_agt_conf_count) {
            let msg = "";
    
            msg += "Dnis Report \n";
            msg += "인입호 수 : " + inbound_total + "\n";
            msg += "포기호 수 : " + abandon_total + "\n";
            msg += "상담원 연결 시도호 수 : " + agt_try + "\n";
            msg += "상담원 연결 시도후 포기호 수 : " + agt_try_abandon + "\n";
            msg += "상담원 거부호 수 : " + reject_total + "\n";
            msg += "상담원 연결 성공호 수 : " + accept_total + "\n";
            msg += "Non-Service 처리호 수 : " + non_svc_total + "\n";
            msg += "현재 IVR 청취 고객호 수 : " + ivr_svc_count + "\n";
            msg += "현재 CTI Queue 대기호 수 : " + wait_count + "\n";
            msg += "현재 상담원 통화호 수 : " + inbusy_agent_count + "\n";
            msg += "현재 상담원 IVR 3자 통화호 수 : " + ivr_agt_conf_count + "\n";
    
            this.AddReportOutput(msg);
        },

        GetDeviceType2() {
            let nResult = 0;
    
            switch (DeviceType2.selectedIndex) {
                case 0: nResult = 10; break;  // DN_KIND_AGENT
                case 1: nResult = 11; break;  // DN_KIND_IEADN
                case 2: nResult = 20; break;  // DN_KIND_IVR
                case 3: nResult = 30; break;  // DN_KIND_IVRQ
                case 4: nResult = 40; break;  // DN_KIND_ICQ
                case 5: nResult = 50; break;  // DN_KIND_ETC
            }
            return nResult;
        },

        GroupSkillList(handle) {
            let i = 0, j = 0;
            let nRecord = 0; nField = 0;
            let strKey, strValue;
            let str = "";
    
            nRecord = ipron.EXTGetRecordCount(handle);
    
            for (i = 0; i < nRecord; i++) {
                nField = ipron.EXTGetValueCountForRecord(handle, i);
    
                strKey = ipron.EXTGetKey(handle, i);
    
                str = "Skill ID : " + strKey + " | ";
    
                for (j = 0; j < nField; j++) {
                    strValue = ipron.EXTGetValueForRecord(handle, i, j);
                    switch (j) {
                        case 0: str += "Name : " + strValue + " | "; break;
                        case 1: str += "Enable : " + strValue; break;
                        default: str += " | Unknown Data : " + strValue; break;
                    }
                }
                this.AddReportOutput(str);
            }
        },

        GetDeviceList(handle) {
            let i = 0, j = 0;
            let nRecord = 0; nField = 0;
            let strKey, strValue;
            let str = "";
    
            nRecord = ipron.EXTGetRecordCount(handle);
    
            for (i = 0; i < nRecord; i++) {
                nField = ipron.EXTGetValueCountForRecord(handle, i);
    
                strKey = ipron.EXTGetKey(handle, i);
    
                str = "DN : " + strKey + " | ";
    
                for (j = 0; j < nField; j++) {
                    strValue = ipron.EXTGetValueForRecord(handle, i, j);
                    if (j == 0) {
                        str += "Status : " + strValue;
                    }
                    else {
                        str += " | Unknown Data : " + strValue;
                    }
                }
                this.AddReportOutput(str);
            }
        },

        TenantList(handle) {
            let i = 0, j = 0;
            let nRecord = 0; nField = 0;
            let strKey, strValue;
            let str = "";
    
            nRecord = ipron.EXTGetRecordCount(handle);
    
            for (i = 0; i < nRecord; i++) {
                nField = ipron.EXTGetValueCountForRecord(handle, i);
    
                strKey = ipron.EXTGetKey(handle, i);
    
                str = "Tenant ID : " + strKey + " | ";
    
                for (j = 0; j < nField; j++) {
                    strValue = ipron.EXTGetValueForRecord(handle, i, j);
                    switch (j) {
                        case 0: str += "Name : " + strValue; break;
                        default: str += " | Unknown Data : " + strValue; break;
                    }
                }
                this.AddReportOutput(str);
            }
        },

        GetCallPosition(local_wait_count, bsr_wait_count) {
            let msg = "";
    
            msg += "GetCallPosition Resposne\n";
            msg += "Local Wait Count : " + local_wait_count.toString() + "\n";
            msg += "BSR Wait Count : " + bsr_wait_count.toString() + "\n";
    
            this.AddReportOutput(msg);
        },

        ExtensionData(data) {
            let extlog = "[" + data.method + "]";
            let ex = "";

            ex = ipron.GetExtensionData(data.extensionhandle);
            extlog += " Extension Data [" + ex + "]";

            return extlog;
        },

        GetMediaSet() {
            let strMediaSet = "";
            
            if (voice.checked) if (strMediaSet.length == 0) strMediaSet += "0"; else strMediaSet += "-0";
            if (chat.checked) if (strMediaSet.length == 0) strMediaSet += "10"; else strMediaSet += "-10";
            if (video_voice.checked) if (strMediaSet.length == 0) strMediaSet += "20"; else strMediaSet += "-20";
            if (video_chat.checked) if (strMediaSet.length == 0) strMediaSet += "30"; else strMediaSet += "-30";
            if (email.checked) if (strMediaSet.length == 0) strMediaSet += "40"; else strMediaSet += "-40";
            if (fax.checked) if (strMediaSet.length == 0) strMediaSet += "50"; else strMediaSet += "-50";
            if (mvoip.checked) if (strMediaSet.length == 0) strMediaSet += "61"; else strMediaSet += "-61";
            if (web.checked) if (strMediaSet.length == 0) strMediaSet += "80"; else strMediaSet += "-80";
            
            return strMediaSet;
        }
    }

})