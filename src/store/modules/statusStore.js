import api from "@/store/apiUtil";

const statusStore = {
  namespaced: true,
  state: () => ({
    cutt_ing : false, //상담 진행중 여부
    cust_modify_ing : false, //고객 수정 진행중 여부
    favoritHidden : false, //관심지역 숨김 여부
    talk_data : [], //RX,TX STT 데이터
    talk_data_search_kms : [], // STT데이터=>검색엔진=>KMS
    talk_data_search_keyword : [], // STT데이터=>검색엔진=>KEYWORD
    talk_data_search_clcn : [], // STT데이터=>검색엔진=>공고문
    talk_data_search_r1_summarize : "", // STT데이터=>검색엔진=>R1 요약(고객)
    talk_data_search_r1_phone : "", // STT데이터=>검색엔진=>R1 추출 전번(고객)
    talk_data_search_r1_name : "", // STT데이터=>검색엔진=>R1 추출 이름(고객)
    talk_data_search_t1_summarize : "", // STT데이터=>검색엔진=>T1 요약(상담사)
    talk_data_search_cutt : "", // STT데이터=>검색엔진=>추천 상담유형
    AFT_STAT : 60, //통화 종료 후 cti 상태(후처리)
    AFT_SUB_STAT : 1, //통화 종료 후 CTI 상태 후처리 상세(IN 후처리)
    cti_call_stat : 'stat1', //CTI 상태(오프라인)
    cutt_time : '00:00:00', //상담 시간
    aft_proc_time : '00:00:00', //후처리 시간
    CALL_ST_DT : '', //호 연결 시작 시간
    CALL_END_DT : '', //호 연결 종료 시간
    BOARD_STAT : [ //게시판 상태(긴급, 공지, 팀공지, 코칭)
      {title:'긴급', count : 0, class: 'is-txt-blue', BBS_ID:''}
      , {title:'공지', count : 0, BBS_ID:''}
      , {title:'팀공지', count : 0, BBS_ID:''}
      , {title:'코칭', count : 0, BBS_ID:''}
    ],
    PERSONAL_STAT : [ //개인 전광판(IN, OUT, 통화, 후처리, 휴식, 식사, 기타, 그외)
      {title:'IN', count : '0', class: ''}
      , {title:'OUT', count : '0', class: ''}
      , {title:'통화', count : '00:00', class: ''}
      , {title:'후처리', count : '00:00', class: ''}
      , {title:'휴식', count : '00:00', class: 'type-sub'}
      , {title:'식사', count : '00:00', class: 'type-sub'}
      , {title:'기타', count : '00:00', class: 'type-sub'}
      , {title:'그외', count : '00:00', class: 'type-sub'}
    ],
    CUTT_MONITOR_STAT : [], //상담 모니터링
    CUTT_MONITOR_INBD_AFTER_PROC_STAT : [ //사후 처리 상태(자체 사후처리, 협업 사후처리)
      {title:'자체 사후처리', count : 0, countBase : 0}
      , {title:'협업 사후처리', count : 0, countBase : 0}
    ],
    BLACK_CUST_STAT : [ //배려고객 요청 상태(미처리, 전일, 금일)
      {title:'미처리', count : 0}
      , {title:'전일', count : 0}
      , {title:'금일', count : 0}
    ],
    GVIFMT_STAT : [ //제보 요청 상태(친절 콜, 프로모션)
      {title:'친절 콜', count : 0, countBase : 0}
      , {title:'프로모션', count : 0, countBase : 0}
    ],
    TRANSF_STAT : [ //이첩 현황 상태(요청, 접수, 반려, 회수)
      {title:'이첩 요청', count : 0}
      , {title:'이첩 접수', count : 0}
      , {title:'이첩 반려', count : 0}
      , {title:'이첩 회수', count : 0}
    ],
    USER_APLY_PROC_STAT : [ //사용자(센터장, 팀장, 상담사) 메인화면 신청/접수 현황
      {title:'휴가 신청 현황', count : 0, countBase : 0}
      , {title:'휴가 반려 현황', count : 0, countBase : 0}
      , {title:'배려고객 신청 현황', count : 0, countBase : 0}
      , {title:'제보 요청 현황', count : 0, countBase : 0}
      , {title:'대 내/외 민원 접수 현황', count : 0, countBase : 0}
      , {title:'코칭 현황', count : 0, countBase : 0}
    ],
    TODAY_USER_WKATTD_STAT:[ // 메인화면(센터장,팀장) - 오늘의 근태 현황.
    ],
    COACHING_AND_EVAL_STAT : [ //코칭 및 업무 평가
      {title:'상담 코칭', count : 0, countBase : 0}
      , {title:'업무 평가', count : 0, countBase : 0}
      // , {title:'상담품질', count : 0, countBase : 0}
    ],
    SYS_HUMAN_REQ_STAT : [ //인재개발관리자 TOP RIGHT
      {title:'이의제기', count : 0, countBase : 0}
      // , {title:'업무평가', count : 0, countBase : 0}
    ],
    SYS_MANAGER_REQ_STAT : [ //센터운영관리자 TOP RIGHT
      {title:'차단요청', count : 0, countBase : 0}
      , {title:'철회요청', count : 0, countBase : 0}
      , {title:'민원접수', count : 0, countBase : 0}
    ],
    AS_CUTT_ADD_ROW_CNT: 0, //바로처리 상담정보의 추가된된 행 갯수
    AS_SHDL_CALLER_TEL: '', //바로처리 스케줄러 연락처(SMS 조회 시 사용)
    AS_SAVED_PHN_CUTT_ID: '', //바로처리 인바운드 상담 저장 시, 저장 phn_cutt_id
    TEAM_QA_PLAN_STAT:[],
    TEAM_QT_PLAN_STAT:[],
    LEADER_OBJT_STAT:[
      { TITLE: '상담품질 평가', CNT: 0, CLASS: '' , TRGT_KEY: "ARGUDV01"}
      , { TITLE: '업무능력 평가', CNT: 0, CLASS: '', TRGT_KEY: "ARGUDV02" }
    ],
  }),
  getters: {
    GE_FAVORIT_HIDDEN : (state) => state.favoritHidden,
    GE_CUTT_ING : (state) => state.cutt_ing,
    GE_CUTT_TIME : (state) => state.cutt_time,
    GE_TALK_DATA : (state) => state.talk_data,
    GE_TALK_DATA_SEARCH_KMS : (state) => state.talk_data_search_kms,
    GE_TALK_DATA_SEARCH_KEYWORD : (state) => state.talk_data_search_keyword,
    GE_TALK_DATA_SEARCH_CLCN : (state) => state.talk_data_search_clcn,
    GE_TALK_DATA_SEARCH_R1_SUMMARIZE : (state) => state.talk_data_search_r1_summarize,
    GE_TALK_DATA_SEARCH_R1_PHONE : (state) => state.talk_data_search_r1_phone,
    GE_TALK_DATA_SEARCH_R1_NAME : (state) => state.talk_data_search_r1_name,
    GE_TALK_DATA_SEARCH_T1_SUMMARIZE : (state) => state.talk_data_search_t1_summarize,
    GE_TALK_DATA_SEARCH_CUTT : (state) => state.talk_data_search_cutt,
    GE_AFT_PROC_TIME : (state) => state.aft_proc_time,
    GE_CTI_CALL_STAT : (state) => state.cti_call_stat,
    GE_AFT_STAT : (state) => state.AFT_STAT,
    GE_AFT_SUB_STAT : (state) => state.AFT_SUB_STAT,
    GE_CUST_MODIFY_ING : (state) => state.cust_modify_ing,
    GE_BOARD_STAT : (state) => state.BOARD_STAT, //게시판 상태(긴급, 공지, 팀공지, 코칭)
    GE_PERSONAL_STAT : (state) => state.PERSONAL_STAT, //개인 전광판(IN, OUT, 통화, 후처리, 휴식, 식사, 기타, 그외)
    GE_CUTT_MONITOR_STAT : (state) => state.CUTT_MONITOR_STAT, //상담 모니터링(금일상담 현황, 팀 미처리(금일), 팀 미처리(전일))
    GE_CUTT_MONITOR_INBD_AFTER_PROC_STAT : (state) => state.CUTT_MONITOR_INBD_AFTER_PROC_STAT, //사후 처리 상태(자체 사후처리, 협업 사후처리)
    GE_BLACK_CUST_STAT : (state) => state.BLACK_CUST_STAT, //배려고객 요청 상태(미처리, 전일, 금일)
    GE_GVIFMT_STAT : (state) => state.GVIFMT_STAT, //제보 요청 상태(친절 콜, 프로모션)
    GE_TRANSF_STAT : (state) => state.TRANSF_STAT, //이첩 현황 상태(요청, 접수, 반려, 회수)
    GE_USER_APLY_PROC_STAT : (state) => state.USER_APLY_PROC_STAT, //사용자(센터장, 팀장, 상담사) 메인화면 신청/접수 현황
    GE_COACHING_AND_EVAL_STAT : (state) => state.COACHING_AND_EVAL_STAT, //코칭 및 업무 평가
    GE_TODAY_USER_WKATTD_STAT : (state) => state.TODAY_USER_WKATTD_STAT, //리더 메인화면 오늘의근태 현황
    GE_AS_CUTT_ADD_ROW_CNT : (state) => state.AS_CUTT_ADD_ROW_CNT,  //바로처리 상담정보의 추가된된 행 갯수
    GE_SYS_HUMAN_REQ_STAT : (state) => state.SYS_HUMAN_REQ_STAT,  //인재개발관리자 TOP RIGHT
    GE_SYS_MANAGER_REQ_STAT : (state) => state.SYS_MANAGER_REQ_STAT,  //센터운영관리자 TOP RIGHT
    GE_CALL_ST_DT : (state) => state.CALL_ST_DT,  //호 연결 시작 시간
    GE_CALL_END_DT : (state) => state.CALL_END_DT,  //호 연결 종료 시간
    GE_AS_SHDL_CALLER_TEL : (state) => state.AS_SHDL_CALLER_TEL,  //호 연결 종료 시간
    GE_AS_SAVED_PHN_CUTT_ID : (state) => state.AS_SAVED_PHN_CUTT_ID,
    GE_TEAM_QA_PLAN_STAT: (state) => state.TEAM_QA_PLAN_STAT,
    GE_TEAM_QT_PLAN_STAT:(state) => state.TEAM_QT_PLAN_STAT,
    GE_LEADER_OBJT_STAT: (state) => state.LEADER_OBJT_STAT,
  },
  mutations: {
    MU_FAVORIT_HIDDEN: (state, data) => {
      state.favoritHidden = data;
    },
    MU_CUTT_ING: (state, data) => {
      state.cutt_ing = data;
    },
    MU_CUTT_TIME: (state, data) => {
      state.cutt_time = data;
    },
    MU_TALK_DATA: (state, data) => {
      state.talk_data = data;
    },
    MU_TALK_DATA_SEARCH_KMS: (state, data) => { //검색엔진 => KMS
      state.talk_data_search_kms = data;
    },
    MU_TALK_DATA_SEARCH_KEYWORD: (state, data) => { //검색엔진 => 키워드
      state.talk_data_search_keyword = data;
    },
    MU_TALK_DATA_SEARCH_CLCN: (state, data) => {  //검색엔진 => 공고문
      state.talk_data_search_clcn = data;
    },
    MU_TALK_DATA_SEARCH_R1_SUMMARIZE: (state, data) => {  //검색엔진 => R1 요약(고객)
      state.talk_data_search_r1_summarize = data;
    },
    MU_TALK_DATA_SEARCH_R1_PHONE: (state, data) => {  //검색엔진 => R1 요약(고객)
      state.talk_data_search_r1_phone = data;
    },
    MU_TALK_DATA_SEARCH_R1_NAME: (state, data) => {  //검색엔진 => R1 요약(고객)
      state.talk_data_search_r1_name = data;
    },
    MU_TALK_DATA_SEARCH_T1_SUMMARIZE: (state, data) => {  //검색엔진 => T1 요약(상담사)
      state.talk_data_search_t1_summarize = data;
    },
    MU_TALK_DATA_SEARCH_CUTT: (state, data) => {  //검색엔진 => T1 요약(상담사)
      state.talk_data_search_cutt = data;
    },
    MU_TALK_DATA_BMK: (state, data) => {
      state.talk_data[data.idx].isBmk = data.isBmk;
      state.talk_data[data.idx].isBmkDate = data.isBmkDate;
    },
    MU_AFT_PROC_TIME: (state, data) => {
      state.aft_proc_time = data;
    },
    MU_CUST_MODIFY_ING: (state, data) => {
      state.cust_modify_ing = data;
    },
    MU_CTI_CALL_STAT: (state, data) => {
      state.cti_call_stat = data;
    },
    MU_AFT_STAT: (state, data) => {
      state.AFT_STAT = data;
    },
    MU_AFT_SUB_STAT: (state, data) => {
      state.AFT_SUB_STAT = data;
    },
    MU_CALL_ST_DT: (state, data) => {
      state.CALL_ST_DT = data;
    },
    MU_CALL_END_DT: (state, data) => {
      state.CALL_END_DT = data;
    },
    MU_BOARD_STAT: (state, data) => { //게시판 상태(긴급, 공지, 팀공지, 코칭)
      state.BOARD_STAT = data;
    },
    MU_PERSONAL_STAT: (state, data) => { //개인 전광판(IN, OUT, 통화, 후처리, 휴식, 식사, 기타, 그외)
      state.PERSONAL_STAT = data;
    },
    MU_CUTT_MONITOR_STAT: (state, data) => { //상담 모니터링(금일상담 현황, 팀 미처리(금일), 팀 미처리(전일))
      state.CUTT_MONITOR_STAT = data;
    },
    MU_BLACK_CUST_STAT: (state, data) => { //배려고객 요청 상태(미처리, 전일, 금일)
      state.BLACK_CUST_STAT = data;
    },
    MU_GVIFMT_STAT: (state, data) => { //제보 요청 상태(친절 콜, 프로모션)
      state.GVIFMT_STAT = data;
    },
    MU_CUTT_MONITOR_INBD_AFTER_PROC_STAT: (state, data) => { //사후 처리 상태(자체 사후처리, 협업 사후처리)
      state.CUTT_MONITOR_INBD_AFTER_PROC_STAT = data;
    },
    MU_TRANSF_STAT: (state, data) => { //이첩 현황 상태(요청, 접수, 반려, 회수)
      state.TRANSF_STAT = data;
    },
    MU_USER_APLY_PROC_STAT: (state, data) => { //사용자(센터장, 팀장, 상담사) 메인화면 신청/접수 현황
      state.USER_APLY_PROC_STAT = data;
    },
    MU_TODAY_USER_WKATTD_STAT: (state, data) => { //리더 메인화면 오늘의근태 현황
      state.TODAY_USER_WKATTD_STAT = data;
    },
    MU_COACHING_AND_EVAL_STAT: (state, data) => { //코칭 및 업무 평가
      state.COACHING_AND_EVAL_STAT = data;
    },
    MU_AS_CUTT_ADD_ROW_CNT: (state, data) => {  //바로처리 상담정보의 추가된된 행 갯수
      state.AS_CUTT_ADD_ROW_CNT = data;
    },
    MU_SYS_HUMAN_REQ_STAT: (state, data) => {  //인재개발관리자 TOP RIGHT
      state.SYS_HUMAN_REQ_STAT = data;
    },
    MU_SYS_MANAGER_REQ_STAT: (state, data) => {  //센터운영관리자 TOP RIGHT
      state.SYS_MANAGER_REQ_STAT = data;
    },
    MU_AS_SHDL_CALLER_TEL: (state, data) => {
      state.AS_SHDL_CALLER_TEL = data;
    },
    MU_AS_SAVED_PHN_CUTT_ID: (state, data) => {
      state.AS_SAVED_PHN_CUTT_ID = data;
    },
    MU_TEAM_QA_PLAN_STAT: (state, data) => {
      state.TEAM_QA_PLAN_STAT = data;
    },
    MU_TEAM_QT_PLAN_STAT: (state, data) => {
      state.TEAM_QT_PLAN_STAT = data;
    },
    MU_LEADER_OBJT_STAT: (state, data) => {
      state.LEADER_OBJT_STAT = data;
    },
    MU_ALL: (state, data) => {

      state.CUTT_MONITOR_STAT = [];

      data.forEach((item, idx) => {
        if(item.GROUP_ID === 'CUTT_MONITOR_STAT'){
          state.CUTT_MONITOR_STAT.push(item);
        }else{
          try{state[item.GROUP_ID][item.index-1] = item;

          }catch(e){
            console.error('Error : ', e);
          }
        }
      });
    },
  },
  actions: {
    async AC_FAVORIT_HIDDEN({ commit }, data) {
      await commit("MU_FAVORIT_HIDDEN",data);
    },
    async AC_CUTT_ING({ commit }, data) {
      await commit("MU_CUTT_ING",data);
    },
    async AC_CUTT_TIME({ commit }, data) {
      await commit("MU_CUTT_TIME",data);
    },
    async AC_TALK_DATA({ commit }, data) {
      await commit("MU_TALK_DATA",data);
    },
    async AC_TALK_DATA_SEARCH_KMS({ commit }, data) {
      await commit("MU_TALK_DATA_SEARCH_KMS",data);
    },
    async AC_TALK_DATA_SEARCH_KEYWORD({ commit }, data) {
      await commit("MU_TALK_DATA_SEARCH_KEYWORD",data);
    },
    async AC_TALK_DATA_SEARCH_CLCN({ commit }, data) {
      await commit("MU_TALK_DATA_SEARCH_CLCN",data);
    },
    async AC_TALK_DATA_SEARCH_R1_SUMMARIZE({ commit }, data) {
      await commit("MU_TALK_DATA_SEARCH_R1_SUMMARIZE",data);
    },
    async AC_TALK_DATA_SEARCH_R1_PHONE({ commit }, data) {
      await commit("MU_TALK_DATA_SEARCH_R1_PHONE",data);
    },
    async AC_TALK_DATA_SEARCH_R1_NAME({ commit }, data) {
      await commit("MU_TALK_DATA_SEARCH_R1_NAME",data);
    },
    async AC_TALK_DATA_SEARCH_T1_SUMMARIZE({ commit }, data) {
      await commit("MU_TALK_DATA_SEARCH_T1_SUMMARIZE",data);
    },
    async AC_TALK_DATA_SEARCH_CUTT({ commit }, data) {
      await commit("MU_TALK_DATA_SEARCH_CUTT",data);
    },
    async AC_TALK_DATA_BMK({ commit }, data) {
      await commit("MU_TALK_DATA_BMK",data);
    },
    async AC_AFT_PROC_TIME({ commit }, data) {
      await commit("MU_AFT_PROC_TIME",data);
    },
    async AC_CALL_ST_DT({ commit }, data) {
      await commit("MU_CALL_ST_DT",data);
    },
    async AC_CALL_END_DT({ commit }, data) {
      await commit("MU_CALL_END_DT",data);
    },
    async AC_CUST_MODIFY_ING({ commit }, data) {
      await commit("MU_CUST_MODIFY_ING",data);
    },
    async AC_CTI_CALL_STAT({ commit }, data) {
      await commit("MU_CTI_CALL_STAT",data);
    },
    async AC_AFT_STAT({ commit }, data) {
      await commit("MU_AFT_STAT",data);
    },
    async AC_AFT_SUB_STAT({ commit }, data) {
      await commit("MU_AFT_SUB_STAT",data);
    },
    async AC_AS_CUTT_ADD_ROW_CNT({ commit }, data) {
      await commit("MU_AS_CUTT_ADD_ROW_CNT",data);
    },
    async AC_SYS_HUMAN_REQ_STAT({ commit }, data) {
      await commit("MU_SYS_HUMAN_REQ_STAT",data);
    },
    async AC_SYS_MANAGER_REQ_STAT({ commit }, data) {
      await commit("MU_SYS_MANAGER_REQ_STAT",data);
    },
    async AC_AS_SHDL_CALLER_TEL({ commit }, data) {
      await commit("MU_AS_SHDL_CALLER_TEL",data);
    },
    async AC_AS_SAVED_PHN_CUTT_ID({ commit }, data) {
      await commit("MU_AS_SAVED_PHN_CUTT_ID",data);
    },
    async AC_TEAM_QA_PLAN_STAT({ commit }, data) {
      await commit("MU_TEAM_QA_PLAN_STAT", data);
    },
    async AC_TEAM_QT_PLAN_STAT({ commit }, data) {
      await commit("MU_TEAM_QT_PLAN_STAT", data);
    },
    async AC_LEADER_OBJT_STAT({ commit }, data) {
      await commit("MU_LEADER_OBJT_STAT", data);
    },

    async AC_ALL_STAT({ commit }, data) {
      let sCommitTarget = 'MU_';
      sCommitTarget += data.TARGET;
      commit(sCommitTarget, []);

      let sUrl = '/api/biz/common/select/getCuslProcStat';

      let postParam = {
        TARGET : data.TARGET
          , CUSTCO_ID : data.CUSTCO_ID // 로그인사용자의 센터 -1:LHCS(공통), 1:마이홈, 2:공가해소 ,3:전세임대 ,4:바로처리 ,5:주택지원센터
          , USER_ID : data.USER_ID // 로그인 사용자 ID
          , CENTER_DEPT_ID : data.CENTER_DEPT_ID // 로그인사용자의 부서 센터_부서아이디
          , DEPT_ID : data.DEPT_ID // 로그인사용자의 부서
          , USER_TYPE : data.USER_TYPE // 로그인사용자의 타입 LEADER: 팀장(부팀장) or 센터장, MANAGER:상담사, ETC_ADMIN : 기타
          , USER_DTL_TYPE : data.USER_DTL_TYPE // TEAM_LEADER: 팀장(부팀장) , CENTER_LEADER:센터장, MANAGER:상담사, SUPER_ADMIN:시스템관리슈퍼관리자, ETC_ADMIN : 기타
          , USER_GROUP_CD : data.USER_GROUP_CD // 사용자의 부여된 권한그룹목록 - CNSLT_STAFF,GENERAL_ADMIN,SYS_MANAGER :: 팀장(부팀장), 센터장, 센터운영관리자
          , USER_DUTY_GROUP_CD : data.USER_DUTY_GROUP_CD
          , USER_CUTT_TASK : data.USER_CUTT_TASK //바로처리 상담사 상담업무 구분
      }

      let headParam = {
        head : {ns : 'lhcs.system.monitor.dao.MonitorStatMapper', ASYNC: false},
      };

      await api
        .post(
          sUrl,
          postParam,
          headParam
        )
        .then((response) => {
          if (response.data.DATA) {
            let items = [];
            response.data.DATA.forEach((item, idx) => {
              if(data.TARGET === 'ALL' || item.GROUP_ID === data.TARGET){
                items.push({
                    GROUP_ID : item.GROUP_ID
                    , title : item.TITLE
                    , count : item.CNT
                    , countBase : item.TOT_CNT
                    , TOT_CNT_USE_YN : item.TOT_CNT_USE_YN
                    , TRGT_KEY : item.TRGT_KEY
                    , TRGT_KEY_ID : item.TRGT_KEY_ID
                    , STTS_KEY : item.STTS_KEY
                    , STTS_KEY_CD : item.STTS_KEY_CD
                    , index : item.SORT_ORD
                    , tabIndex : item.TAB_INDEX
                    , icon : item.ICON
                    , slideNm : item.SLIDE_NM
                    , dialogNm : item.DIALOG_NM
                    , homeTabNum : item.HOME_TAB_NUM
                    , MENU_PATH : item.MENU_PATH
                    , MENU_NM : item.MENU_NM
                    , SCH_ST_DT : item.SCH_ST_DT
                    , SCH_END_DT : item.SCH_END_DT
                });
              }
            });
            commit(sCommitTarget, items);
          }
        })
        .catch((error) => {
          // 에러인 경우 처리
          console.error(data.TARGET + ' 조회 에러', error);
        });
    },
  },
};

export default statusStore;
