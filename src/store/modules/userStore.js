import api from "@/store/apiUtil";

const userStore = {
  namespaced: true,
  state: () => ({
    // user_name: "도로시",
    user_state: "none",
    user_role: {
      userId: "",
      lgnId: "",
      userName: "",
      userNick: "",
      hpNo: "",
      groupCd: "",
      atrtGroupId: "",
      atrtGroupNm: "",
      cntnIp: "",
      lastLoginDt: "",
      EXT_NO: "",
      PDS_EXT_NO: "",
      AGENT_ID: "",
      DSPTCH_NO: "",
      CNTN_IP: "",
      TOPMSG: "",
      ICON: "",
      ICON_IMG_URI:"",
      SCHEDULE: 0,
      PWD_CHANGE_YN: 'N',
      ELAPSED_DATE: 0,
      CHK_CUST: {
        CHK: 0,
        vue: "",
        CHK_CD: "",
        CHK_NM: "",
      },
      CHK_TMPL:{
        CHK: 0,
        vue: "",
        CUSTCO_ID : '',
        SNDR_KEY : '',
        TALK_UUID       : '',
        TMPL_CD         : '',
        TMPL_NM         : '',
        TMPL_TYP        : '',
        TMPL_EMPH       : '',
        TMPL_CON        : '',
        TMPL_EXT        : '',
        TMPL_IMG        : '',
        TMPL_IMG_URL    : '',
        TMPL_TIT        : '',
        TMPL_SUB        : '',
        TMPL_HEAD       : '',
        TMPL_HILIT      : '',
        TMPL_ITEM       : '',
        CATEGORY        : '',
        BUTN            : '',
        FILE_GROUP      : '',
        HLIT_IMG        : '',
        HLIT_IMG_URL    : '',
      },
      company_list: [],
      company:'',

      USER_CENTER:'',
      USER_TYPE:'', // 센터장or팀장(부팀장):LEADER, 상담자:MANAGER, 이외 : ETC_ADMIN
      USER_DETAIL_TYPE:'', // 센터장:CENTER_READER , 팀장(부팀장):TEAM_LEADER, 상담자:MANAGER, 이외 : ETC_ADMIN
      IMG:'',
      USER_NM:'',
      JBPS_CD:'',
      JBPS_CD_NM:'',
      DUTY_CD:'',
      DUTY_CD_NM:'',
      DUTY_GROUP_CD: '',
      CUSTCO_NM:'',
      CUSTCO_ID:'',
      DEPT_NM:'',
      OFC_ADDR:'',
      EML:'',
      PHN_NO:'',
      DEPT_NM_FULL_PATH:'',
      CENTER_DEPT_ID:'',
      CENTER_DEPT_NM:'',
      CENTER_DEPT_CD:'',/*사용하는곳없음*/
      CENTER_DEPT_ID_FULL_PATH:'',/*사용하는곳없음*/
      CENTER_DEPT_NM_FULL_PATH:'',/*사용하는곳없음*/
      AUTHRT_DLGT_LIST:[],  /* 본인에게 권한위임한 사용자목록 */
      TKCG_RGN_CD:'', /* 담당 지역 코드드 */
      CHT_USE_YN: 'N',
      SMS_CUTT_USE_YN: 'N',
      EML_CUTT_USE_YN: 'N',
      SOFT_PHN_USE_YN: 'N', /*소프트폰 사용 여부*/
      MNG_CUSL_YN: 'N', /*선임 상담사 여부*/
      REC_DWNLD_YN: 'N', /*녹취 다운로드 가능 여부*/
      STT_DWNLD_YN: 'N', /*STT 엑셀 다운로드 가능 여부*/
      AUTO_DRWI_YN: 'N', /*CTI 인입 전화 자동받기 여부*/
      MNG_CUSTCO_ID: '', /*담당 센터 ID*/
      MNG_CUSTCO_DEPT_ID: '', /*담당 센터 부서 ID*/
    },
    user_menu: [], //사용자 메뉴권한 (tree 구조)
    user_menu_dev: [], //사용자 DEV 메뉴권한 (2 depth 구조)
    user_menu_left: [], //사용자 LEFT 메뉴권한 (1 depth 구조)
    user_menu_right: [], //사용자 RIGHT 메뉴권한 (1 depth 구조)
    user_menu_list: [], //사용자 메뉴 및 버튼 권한
    left_menu:[],  //좌측메뉴
    mobie_yn : "",      //모바일사용여부
    USER_SHORTCUT : {
      ALT_SHORTCUT : [],
      ALT_SHIFT_SHORTCUT : [],
    }, //사용자 단축키
    CHAT_STAT:'', //채팅 상태
    SRC_DLGT_USER:{
      USER_ID:'',
      LGN_ID:'',
    }
    ,USER_CUTT_TASK: { //바로처리 상담사 업무 구분
    }
    ,DEFAULT_CUTT_TASK:''//바로처리 상담사 기본 상담 업무
    ,SWAT_TOKEN:''
  }),
  getters: {
    GE_USER_NAME: (state) => state.user_role.userName,
    GE_USER_STATE: (state) => state.user_state,
    GE_USER_ROLE: (state) => state.user_role,
    GE_USER_MENU: (state) => state.user_menu,
    GE_USER_MENU_LIST: (state) => state.user_menu_list,
    GE_DEV_MENU: (state) => state.user_menu_dev,
    GE_LEFT_MENU: (state) => state.user_menu_left,
    GE_RIGHT_MENU: (state) => state.user_menu_right,
    GE_USER_ID: (state) => state.user_role.userId,
    GE_SLGN_ID: (state) => state.user_role.lgnId,
    GE_USER_COMPANY_LIST: (state) => state.user_role.company_list,
    GE_USER_COMPANY: (state) => state.user_role.company,
    GE_USER_CENTER: (state) => state.user_role.USER_CENTER,
    GE_USER_CENTER_DEPT_ID: (state) => state.user_role.CENTER_DEPT_ID,
    GE_USER_CENTER_DEPT_NM: (state) => state.user_role.CENTER_DEPT_NM,/*사용하는곳없음*/
    GE_USER_DEPT_ID: (state) => state.user_role.DEPT_ID,
    GE_USER_DEPT_NM: (state) => state.user_role.DEPT_NM,
    GE_USER_TYPE: (state) => state.user_role.USER_TYPE,
    GE_USER_DETAIL_TYPE: (state) => state.user_role.USER_DETAIL_TYPE,
    GE_USER_DUTY_GROUP_CD: (state) => state.user_role.USER_DUTY_GROUP_CD,
    GE_USER_TKCG_RGN_CD: (state) => state.user_role.TKCG_RGN_CD,
    GE_USER_CHT_USE_YN: (state) => state.user_role.CHT_USE_YN,
    GE_USER_SMS_CUTT_USE_YN: (state) => state.user_role.SMS_CUTT_USE_YN,
    GE_USER_EML_CUTT_USE_YN: (state) => state.user_role.EML_CUTT_USE_YN,
    GE_SOFT_PHN_USE_YN: (state) => state.user_role.SOFT_PHN_USE_YN,
    GE_MNG_CUSL_YN: (state) => state.user_role.MNG_CUSL_YN, /*선임 상담사 여부*/
    GE_REC_DWNLD_YN: (state) => state.user_role.REC_DWNLD_YN, /*녹취 다운로드 가능 여부*/
    GE_STT_DWNLD_YN: (state) => state.user_role.STT_DWNLD_YN, /*STT 엑셀 다운로드 가능 여부*/
    GE_AUTO_DRWI_YN: (state) => state.user_role.AUTO_DRWI_YN, /*CTI 인입 전화 자동받기 여부*/
    GE_MNG_CUSTCO_ID: (state) => state.user_role.MNG_CUSTCO_ID, /*담당 센터 ID*/
    GE_MNG_CUSTCO_DEPT_ID: (state) => state.user_role.MNG_CUSTCO_DEPT_ID, /*담당 센터 부서 ID*/
    GE_USER_GROUP_CD: (state) => state.user_role.groupCd,
    GE_USER_EXT_NO: (state) => state.user_role.EXT_NO,
    GE_USER_PDS_EXT_NO: (state) => state.user_role.PDS_EXT_NO,
    GE_USER_AGENT_ID: (state) => state.user_role.AGENT_ID,
    GE_USER_DSPTCH_NO: (state) => state.user_role.DSPTCH_NO,
    GE_USER_CNTN_IP: (state) => state.user_role.CNTN_IP,
    GE_USER_TOPMSG: (state) => state.user_role.TOPMSG,
    GE_USER_ICON: (state) => state.user_role.ICON,
    GE_USER_ICON_IMG_URI: (state) => state.user_role.ICON_IMG_URI,
    GE_USER_SCHEDULE: (state) => state.user_role.SCHEDULE,
    GE_USER_CHK_CUST: (state) => state.user_role.CHK_CUST,
    GE_USER_CHK_TMPL: (state) => state.user_role.CHK_TMPL,
    GE_USER_IP_ADDR: (state) => state.user_role.CNTN_IP,       // 상담사로그인 IP
    GE_MOBILE_YN : (state) => state.mobie_yn,                  //모바일사용여부
    GE_PWD_CHANGE_YN : (state) => state.user_role.PWD_CHANGE_YN,    //초기 비밀번호 변경 여부
    GE_USER_SHORTCUT : (state) => state.USER_SHORTCUT,    //사용자 단축키
    GE_ELAPSED_DATE : (state) => state.user_role.ELAPSED_DATE,    //비밀번호 변경 후 경과일
    GE_CHAT_STAT : (state) => state.CHAT_STAT,    //채팅 상태
    GE_USER_AUTHRT_DLGT_LIST: (state) => state.user_role.AUTHRT_DLGT_LIST,
    GE_SRC_DLGT_USER: (state) => state.SRC_DLGT_USER,
    GE_USER_CUTT_TASK: (state) => state.user_role.USER_CUTT_TASK,
    GE_DEFAULT_CUTT_TASK: (state) => state.user_role.DEFAULT_CUTT_TASK,
    GE_IS_CONTAIN_ADMIN_GROUP : (state) => state.user_role.IS_CONTAIN_ADMIN_GROUP,  //admin group cd 포함 여부.
    GE_SWAT_TOKEN : (state) => state.SWAT_TOKEN,  //SWAT 토큰(1440분 짜리 토큰)

  },
  mutations: {
    MU_USER_NAME: (state, data) => {
      /*
                여기서는 payload를 객체로 받습니다.
                payload를 객체로 받으면, mutation를 조금더 유연하게 사용할 수 있기는 합니다.
            */
      state.user_name = data.userName;
    },
    MU_USER_STATE: (state, data) => {
      state.user_state = data.ustate;
    },
    MU_USER_TYPE: (state, data) => {
      state.user_role.USER_TYPE = data;
    },
    MU_USER_DETAIL_TYPE: (state, data) => {
      state.user_role.USER_DETAIL_TYPE = data;
    },
    MU_USER_COMPANY_LIST: (state, data) => {
      if (data) {
        let companyArray = [];

        for (var i = 0; i < data.length; i++) {
          let arrSrvc = [];
          if("SRVC_INFO" in data[i]){
            if(data[i]["SRVC_INFO"]){
              data[i]["SRVC_INFO"].split('_##_').forEach((srvc, idx) => {
                let srvcNm = srvc.split(',')[0];
                let srvcStat = srvc.split(',')[1];
                arrSrvc[srvcNm] = srvcStat;
              });
            }
          }

          companyArray.push({
            // icon: require('@/assets/img/@logo_palette.png'),
            icon: data[i]["CUSTCO_ICON"],
            SCHEMA_ID: data[i]["SCHEMA_ID"],
            CD: data[i]["CD"],
            CD_NM: data[i]["CD_NM"],
            CUSTCO_ID: data[i]["CD"],
            CENTER_DEPT_ID: data[i]["CENTER_DEPT_ID"],
            ASP_CUST_KEY: data[i]["ASP_CUST_KEY"],
            USER_ID: data[i]["USER_ID"],
            EXT_NO: data[i]["EXT_NO"],
            PDS_EXT_NO: data[i]["PDS_EXT_NO"],
            API_URI: data[i]["API_URI"],
            RPRS_NO: data[i]["RPRS_NO"],
            DSPTCH_NO: data[i]["DSPTCH_NO"],
            CERT_CUSTCO_ID: data[i]["CERT_CUSTCO_ID"],
            SRVC_GDS_ID: data[i]["SRVC_GDS_ID"],
            SRVC_INFO: {...arrSrvc},
            IC_CTIQ: data[i]["IC_CTIQ"],
          });
        }
        state.user_role.company_list = companyArray;
      }
    },
    MU_USER_COMPANY: (state, data) => {
      if (data) {
        let selectCompany = {CD : data.CD
                            , CD_NM : data.CD_NM
                            , CUSTCO_ID: data.CD
                            , CENTER_DEPT_ID: data.CENTER_DEPT_ID
                            , ASP_CUST_KEY: data.ASP_CUST_KEY
                            , USER_ID: data.USER_ID
                            , EXT_NO: data.EXT_NO
                            , PDS_EXT_NO: data.PDS_EXT_NO
                            , API_URI: data.API_URI
                            , RPRS_NO: data.RPRS_NO
                            , DSPTCH_NO: data.DSPTCH_NO
                            , icon: data.icon
                            , SCHEMA_ID: data.SCHEMA_ID
                            , CERT_CUSTCO_ID: data.CERT_CUSTCO_ID
                            , SRVC_GDS_ID: data.SRVC_GDS_ID
                            , SRVC_INFO: data.SRVC_INFO
                            , IC_CTIQ: data.IC_CTIQ
                          };
          state.user_role.company = selectCompany;

          if( data.isSelectCompany !== undefined && data.isSelectCompany === 'Y' ) {
            //주택지원센터장이 센터를 선택한경우.
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> selectCompany :: " , selectCompany);
            state.user_role.CUSTCO_ID = data.CD;
            state.user_role.CUSTCO_NM = data.CD_NM;
            state.user_role.USER_CENTER = data.CD;
            state.user_role.CENTER_DEPT_NM = data.CD_NM;
            state.user_role.CENTER_DEPT_ID = data.CENTER_DEPT_ID;
            state.user_role.DEPT_ID = data.CENTER_DEPT_ID;
            state.user_role.DEPT_NM = data.CD_NM;
          }

      }
    },
    MU_CUSTCO_SRVC_INFO: (state, data) => {
      state.user_role.company.SRVC_INFO = data;
    },
    MU_USER_EXT_NO: (state, data) => {
      if (data) {
        state.user_role.EXT_NO = data;
      }
    },
    MU_USER_PDS_EXT_NO: (state, data) => {
      if (data) {
        state.user_role.PDS_EXT_NO = data;
      }
    },
    MU_USER_AGENT_ID: (state, data) => {
      if (data) {
        state.user_role.AGENT_ID = data;
      }
    },
    MU_PWD_CHANGE_YN: (state, data) => {
      if (data) {
        state.user_role.PWD_CHANGE_YN = data;
      }
    },
    MU_ELAPSED_DATE: (state, data) => {
      if (data) {
        state.user_role.ELAPSED_DATE = data;
      }
    },
    MU_USER_MENU: (state, data) => {
      // state.ustate = date.ustate;
      if (data) {
        data.MENU_ITEMS.forEach((menu, idx) => {
          if('child' in menu){
            menu.child.forEach((child, seq) => {
              if(child.C_NODE_NO === 'CSL_M0200'){ //특수채널 상담인 경우
                if(state.user_role.CHT_USE_YN === 'N' && state.user_role.SMS_CUTT_USE_YN === 'N' && state.user_role.EML_CUTT_USE_YN === 'N'){
                  menu.child.splice(seq, 1);
                }
              }
            });
          }
        });
        state.user_menu = data.MENU_ITEMS;
        state.user_menu_dev = data.DEV_MENU_ITEMS; //개발 가이트 메뉴
        // state.user_menu_list = data.DATA;
        if(data.DATA.length >0){
          state.user_menu_list = [];
          state.user_menu_left = [];
          state.user_menu_right = [];
          for(var i = 0; i < data.DATA.length; i++){
            if(data.DATA[i].VIEW_TRGT === 'MAIN' || data.DATA[i].VIEW_TRGT === 'LEFT' || data.DATA[i].VIEW_TRGT === 'DEV'){ //메인메뉴, LEFT 메뉴
              if(data.DATA[i].C_NODE_NO === 'CSL_M0200'){ //특수채널 상담인 경우
                if(state.user_role.CHT_USE_YN === 'Y' || state.user_role.SMS_CUTT_USE_YN === 'Y' || state.user_role.EML_CUTT_USE_YN === 'Y'){
                  state.user_menu_list.push(data.DATA[i]);
                }
              }else{
                state.user_menu_list.push(data.DATA[i]);
              }

              if(data.DATA[i].VIEW_TRGT == 'LEFT'){ //LEFT 메뉴
                state.user_menu_left.push(data.DATA[i]);
              }
            }else{//RIGHT 메뉴
              const rightMenu = data.DATA[i];
              rightMenu.active = false;
              rightMenu.alarm = false;

              //예약콜, 콜백이 있을 경우 상담직원이 인지할 수 있도록 우측 사이드바의 해당 아이콘에 에니메이션 효과를 적용 용도.
              if( data.DATA[i].ICON_CLASS_NM == "campaign" ) {
                rightMenu.animationData = require( '@/assets/lottie/animation_campaign.json' );
              }else if( data.DATA[i].ICON_CLASS_NM == "reserveCall" ) {
                rightMenu.animationData = require( '@/assets/lottie/animation_reserve.json' );
              }else if( data.DATA[i].ICON_CLASS_NM == "callback" ) {
                rightMenu.animationData = require( '@/assets/lottie/animation_callback.json' );
              } else if( data.DATA[i].ICON_CLASS_NM == "orderlist" ) {
                rightMenu.animationData = require( '@/assets/lottie/animation_orderlist.json' );
              }

              if(data.DATA[i].C_NODE_NO === 'CSL_M0200'){ //특수채널 상담인 경우
                if(state.user_role.CHT_USE_YN === 'Y' || state.user_role.SMS_CUTT_USE_YN === 'Y' || state.user_role.EML_CUTT_USE_YN === 'Y'){
                  state.user_menu_right.push(rightMenu);
                }
              }else{
                state.user_menu_right.push(rightMenu);
              }
            }
          }
        }
      }
    },
    MU_USER_DETAIL: (state, data) => {
      // state.ustate = date.ustate;
      if (data.data) {
        let getData = data.data;
        state.user_role.userId = getData.USER_ID;
        state.user_role.lgnId = getData.LGN_ID;
        state.user_role.userName = getData.USER_NM;
        state.user_role.userNick = getData.USER_NICK;
        // state.user_role.hpNo = getData.HP_NO;
        state.user_role.groupCd = getData.GROUP_CD_LIST;
        state.user_role.atrtGroupId = getData.AUTHOR_GROUP_ID_LIST;
        state.user_role.atrtGroupNm = getData.AUTHOR_GROUP_NM_LIST;
        state.user_role.cntnIp = getData.CNTN_IP;
        state.user_role.lastLoginDt = getData.LAST_LOGIN_DT;
        state.user_role.EXT_NO = getData.EXT_NO;
        state.user_role.PDS_EXT_NO = getData.PDS_EXT_NO;
        state.user_role.AGENT_ID = getData.AGENT_ID;
        state.user_role.DSPTCH_NO = getData.DSPTCH_NO;
        state.user_role.CNTN_IP = getData.CNTN_IP;
        state.user_role.TOPMSG = getData.TOPMSG;
        state.user_role.ICON = getData.ICON;
        state.user_role.ICON_IMG_URI = getData.ICON_IMG_URI;
        state.user_role.PWD_CHANGE_YN = getData.PWD_CHANGE_YN;
        state.user_role.ELAPSED_DATE = getData.ELAPSED_DATE;


        state.user_role.USER_NM = getData.USER_NM;
        state.user_role.DEPT_ID = getData.DEPT_ID;
        state.user_role.DEPT_NM = getData.DEPT_NM;
        state.user_role.CUSTCO_ID = getData.CUSTCO_ID;
        state.user_role.CUSTCO_NM = getData.CUSTCO_NM;
        state.user_role.JBPS_CD = getData.JBPS_CD;
        state.user_role.JBPS_CD_NM = getData.JBPS_CD_NM;
        state.user_role.DUTY_CD = getData.DUTY_CD;
        state.user_role.DUTY_CD_NM = getData.DUTY_CD_NM;
        state.user_role.DUTY_GROUP_CD = getData.DUTY_GROUP_CD;
        state.user_role.TKCG_RGN_CD = getData.TKCG_RGN_CD;
        state.user_role.CHT_USE_YN = getData.CHT_USE_YN;
        state.user_role.SMS_CUTT_USE_YN = getData.SMS_CUTT_USE_YN;
        state.user_role.EML_CUTT_USE_YN = getData.EML_CUTT_USE_YN;
        state.user_role.SOFT_PHN_USE_YN = getData.SOFT_PHN_USE_YN;
        state.user_role.MNG_CUSL_YN = getData.MNG_CUSL_YN; /*선임 상담사 여부*/
        state.user_role.REC_DWNLD_YN = getData.REC_DWNLD_YN; /*녹취 다운로드 가능 여부*/
        state.user_role.STT_DWNLD_YN = getData.STT_DWNLD_YN; /*STT 엑셀 다운로드 가능 여부*/
        state.user_role.MNG_CUSTCO_ID = getData.MNG_CUSTCO_ID; /* 담당 센터 ID*/
        state.user_role.MNG_CUSTCO_DEPT_ID = getData.MNG_CUSTCO_DEPT_ID; /* 담당 센터 부서 ID*/
        state.user_role.AUTO_DRWI_YN = getData.AUTO_DRWI_YN; /*CTI 인입 전화 자동받기 여부*/
        state.user_role.PHN_NO = (getData.MBL_PHN_NO != undefined && getData.MBL_PHN_NO != '') ? '-': getData.MBL_PHN_NO;

        if(getData.ICON != undefined && getData.ICON != ''){
          state.user_role.IMG =  '/upload/' + getData.ICON_IMG_URI;
        }else{
          state.user_role.IMG =  require('@/assets/img/@profile_user.png');
        }
        state.user_role.DEPT_NM_FULL_PATH =  getData.DEPT_NM_FULL_PATH;
        state.user_role.CENTER_DEPT_ID =  getData.CENTER_DEPT_ID;
        state.user_role.CENTER_DEPT_NM =  getData.CENTER_DEPT_NM;
        state.user_role.CENTER_DEPT_CD =  getData.CENTER_DEPT_CD;/*사용용도없음*/
        state.user_role.CENTER_DEPT_ID_FULL_PATH =  getData.DEPT_ID_FULL_PATH;
        state.user_role.CENTER_DEPT_NM_FULL_PATH =  getData.CENTER_DEPT_NM_FULL_PATH;

        //바로처리 사용자 업무 구분
        if("USER_CUTT_TASK" in getData){
          let arrTask = [];
          if(getData.USER_CUTT_TASK){
            getData.USER_CUTT_TASK.split('_##_').forEach((task, idx) => {
              let taskCd = task.split(',')[0];
              let taskUserYn = task.split(',')[1];
              arrTask[taskCd] = taskUserYn;
            });
          }

          state.user_role.USER_CUTT_TASK = {...arrTask};
        }
        
        if("DEFAULT_CUTT_TASK" in getData){
          state.user_role.DEFAULT_CUTT_TASK = getData.DEFAULT_CUTT_TASK;
        }

        /* 주의) BIZ단 JwtTokenProvider resolveTokenUserType() 과 매치하여야한다. start ↓ */
        if( getData.GROUP_CD_LIST.indexOf("GENERAL_ADMIN") > -1 ) {     // 1순위 센터장이 우선순위로 포함된경우
          state.user_role.USER_TYPE = 'LEADER';
          state.user_role.USER_DETAIL_TYPE = 'CENTER_LEADER';
        }else if( getData.GROUP_CD_LIST.indexOf("CNSLT_STAFF") > -1 ) { // 2순위 팀장(부팀장)이 우선순위로 포함된경우
          state.user_role.USER_TYPE = 'LEADER';
          state.user_role.USER_DETAIL_TYPE = 'TEAM_LEADER';
        }else if( getData.GROUP_CD_LIST.indexOf("CNSLT_AGENT") > -1 ) { // 3순위 상담사이 우선순위로 포함된경우
          state.user_role.USER_TYPE = 'MANAGER';
          state.user_role.USER_DETAIL_TYPE = 'MANAGER';
        }else if( getData.GROUP_CD_LIST.indexOf("SUPER_ADMIN") > -1 ) { // 4순위 시스템관리슈퍼관리자 우선순위로 포함된경우
          state.user_role.USER_TYPE = 'ETC_ADMIN';
          state.user_role.USER_DETAIL_TYPE = 'SUPER_ADMIN';
        }else if( getData.GROUP_CD_LIST.indexOf("SYS_ADMIN") > -1 ) { // 5순위 시스템관리자 우선순위로 포함된경우
          state.user_role.USER_TYPE = 'ETC_ADMIN';
          state.user_role.USER_DETAIL_TYPE = 'SYS_ADMIN';
        }else if( getData.GROUP_CD_LIST.indexOf("SYS_HUMAN") > -1 ) { // 6순위 인재개발관리자 우선순위로 포함된경우
          state.user_role.USER_TYPE = 'ETC_ADMIN';
          state.user_role.USER_DETAIL_TYPE = 'SYS_HUMAN';
        }else if( getData.GROUP_CD_LIST.indexOf("SYS_MANAGER") > -1 ) { // 7순위 센터운영개발관리자 우선순위로 포함된경우
          state.user_role.USER_TYPE = 'ETC_ADMIN';
          state.user_role.USER_DETAIL_TYPE = 'SYS_MANAGER';
        }else {
          state.user_role.USER_TYPE = 'ETC_ADMIN';
          state.user_role.USER_DETAIL_TYPE = 'ETC_ADMIN';
        }

        let isContainAdminGroup = false;
        //시스템관리자, 센터장, 매니저, 팀장(부팀장), 센터운영관리자, 지식평가관리자, 총무
        if(getData.GROUP_CD_LIST.indexOf("SYS_ADMIN") > -1 || getData.GROUP_CD_LIST.indexOf("GENERAL_ADMIN") > -1 || 
            getData.GROUP_CD_LIST.indexOf("STAFF_ADMIN") > -1 || getData.GROUP_CD_LIST.indexOf("CNSLT_ADMIN") > -1 || 
            getData.GROUP_CD_LIST.indexOf("CNSLT_STAFF") > -1 || getData.GROUP_CD_LIST.indexOf("SYS_MANAGER") > -1 || 
            getData.GROUP_CD_LIST.indexOf("SYS_EVAL") > -1 || getData.GROUP_CD_LIST.indexOf("STAT_ADMIN") > -1 ) {
              isContainAdminGroup = true;
        }
        state.user_role.IS_CONTAIN_ADMIN_GROUP = isContainAdminGroup;
        /* 주의) BIZ단 JwtTokenProvider resolveTokenUserType() 과 매치하여야한다. end ↑ */

        state.user_role.USER_CENTER = state.user_role.CUSTCO_ID;
        state.user_role.USER_DUTY_GROUP_CD = state.user_role.DUTY_GROUP_CD;

        state.SWAT_TOKEN = ''; //로그인시 swat 토큰 초기화

      }
    },

    // right menu active
    MU_ANIMATION_ACTIVE(state, index) {
      try{state.user_menu_right[index].alarm = true;}catch(e){ console.error('Error : ', e); }
    },
    MU_ANIMATION_INACTIVE(state, index) {
      try{state.user_menu_right[index].alarm = false;}catch(e){ console.error('Error : ', e);}
    },

     /**
     * 모바일사용여부
     * @param {*} param0
     * @param {*} data
     */
    MU_MOBIE_YN: (state, data) => {
      state.mobie_yn = data;
    },
    //사용자 단축키
    MU_USER_SHORTCUT: (state, data) => {
      state.USER_SHORTCUT = data;
    },

    //CTI 인입 전화 자동받기 여부
    MU_AUTO_DRWI_YN: (state, data) => {
      state.user_role.AUTO_DRWI_YN = data;
    },

    //채팅 상태
    MU_CHAT_STAT: (state, data) => {
      state.CHAT_STAT = data;
    },
    //권한위임받은목록
    MU_USER_AUTHRT_DLGT_LIST: (state, data) => {
      state.user_role.AUTHRT_DLGT_LIST = data;
    },

    //위임받은사람이 로그인항경우 이전계정정보.
    MU_SRC_DLGT_USER: (state, data) => {
      state.SRC_DLGT_USER = data;
    },
    MU_USER_CUTT_TASK: (state, data) => {
      if (data) {
        state.user_role.USER_CUTT_TASK = data;
      }
    },
    MU_DEFAULT_CUTT_TASK: (state, data) => {
      if (data) {
        state.user_role.DEFAULT_CUTT_TASK = data;
      }
    },
    MU_SWAT_TOKEN: (state, data) => {
        state.SWAT_TOKEN = data;
    },
  },
  actions: {

    /**
     * 모바일사용여부
     * @param {*} param0
     * @param {*} data
     */
    AC_MOBIE_YN: ({ commit }, data) => {
      commit("MU_MOBIE_YN", data);
    },

    AC_USER_NAME: ({ commit }, data) => {
      commit("MU_USER_NAME", data);
    },
    AC_USER_STATE: ({ commit }, data) => {
      commit("MU_USER_STATE", data);
    },
    //사용자 센터조회
    async AC_USER_COMPANY_LIST({ commit }, data) {
      let set_headers = {
        SERVICE: "code.common.code-book.sender",
        METHOD: "aspinqry",
        TYPE: "BIZ_SERVICE",
        ASYNC: false,
      };

      await api
        .post(
          "/api/code/common/code-book/aspinqry",
          {
            ASP_USER_ID: data.user_id,
            USER_ID: data.user_id,
            LGN_ID: data.lgn_id,
          },
          { head: set_headers }
        )
        .then((response) => {
          if (response.data[data.user_id]) {

            let companyList = response.data[data.user_id];

            if( data.author_group_nm_list.indexOf("센터장") > -1 && ( data.custco_id === '2' || data.custco_id === '5' ) ) {
              //주택지원센터 센터장인경우 에 대한 처리
              //공가해소센터추가.
              companyList.push({
                  API_URI: companyList[0].API_URI
                , ASP_CUST_KEY: companyList[0].ASP_CUST_KEY
                , CD: "2"
                , CD_NM: "공가해소센터"
                , CENTER_DEPT_ID: '201000'
                , DSPTCH_NO: companyList[0].DSPTCH_NO
                , EXT_NO: companyList[0].EXT_NO
                , PDS_EXT_NO: companyList[0].PDS_EXT_NO
                , SRVC_INFO: companyList[0].SRVC_INFO
                , USER_ID: companyList[0].USER_ID
              });
              console.log("공가해소센터추가 : " , companyList);
            }

            commit("MU_USER_COMPANY_LIST", companyList);
          }
        })
        .catch((error) => {
          // 에러인 경우 처리
          console.error("company 조회 에러", error);
        });
    },
    //사용자 회사 선택
    async AC_USER_COMPANY({ commit }, data) {
      await commit("MU_USER_COMPANY",data);
    },
    //사용자 메뉴 조회
    async AC_USER_MENU({ commit }, data) {
      await api
        .post("/api/palette-main/menu/list", {
          USER_ID: data.user_id,
          AUTHRT_GROUP_ID : data.AUTHRT_GROUP_ID
        })
        .then((response) => {
          commit("MU_USER_MENU", response.data);
        })
        .catch((error) => {
          // 에러인 경우 처리
          console.error("menu 조회 에러", error);
        });
    },
    //사용자 상세정보 조회
    async AC_USER_DETAIL({ commit }, data) {
      // api
      //   .post("/api/setting/agent/manage/detail", {
      //     USER_ID: data.user_id,
      //     ASP_NEWCUST_KEY: data.asp_cust_key,
      //   })
      //   .then((response) => {
      await commit("MU_USER_DETAIL", data);
      // })
      // .catch((error) => {
      //   // 에러인 경우 처리
      //   console.error("사용자 상세정보 조회 에러", error);
      // });
    },
    AC_USER_CUTT_TASK: ({ commit }, data) => {
      commit("MU_USER_CUTT_TASK", data);
    },
    AC_DEFAULT_CUTT_TASK: ({ commit }, data) => {
      commit("MU_DEFAULT_CUTT_TASK", data);
    },
    //사용자 단축키 조회
    async AC_USER_SHORTCUT({ commit }, data) {
      await api
        .post(
          "/api/system/shortcut/selectShortcutList",
          {}, 
          { head: {} }
        )
        .then((response) => {
          if (response.data) {
            let altShortcut = [];
            let altShiftShortcut = [];
            const shortcutList = response.data.DATA;
            //ALT 단축키와 ALT + SHIFT 단축키 목록을 별도 구분해서 저장한다.
            shortcutList.map(item => {
              //삭제 상태의 지식 스크립트는 제외(삭제 상태 - item.LNK_CN : '')
              if(item.LNK_CN != '') {
                if(item.ALT_KEY_YN == 'Y' && item.SHIFT_KEY_YN == 'Y') {
                  altShiftShortcut.push(item)
                } else if(item.ALT_KEY_YN == 'Y') {
                  altShortcut.push(item)
                }
              }
            });
            commit("MU_USER_SHORTCUT", {ALT_SHORTCUT : altShortcut, ALT_SHIFT_SHORTCUT : altShiftShortcut});
          }
        })
        .catch((error) => {
          // 에러인 경우 처리
          console.error("사용자 단축키 조회 에러", error);
        });
    },
    //권한위임한 사용자목록
    async AC_USER_AUTHRT_DLGT_LIST({ commit }, data) {
      await api
          .post(
              "/api/lhcs/system/user/selectUserAuthrtDlgtList", {}, { head: {} }
          )
          .then((response) => {
            if (response.data) {
              commit("MU_USER_AUTHRT_DLGT_LIST", response.data.DATA);
            }
          })
          .catch((error) => {
          });
    },
    //권한위임한 사용자목록 초기화
    async INIT_USER_AUTHRT_DLGT_LIST({ commit }, data) {
      commit("MU_USER_AUTHRT_DLGT_LIST", data);
    },

    //위임받은자 로그인시 기존정보 저장용도.
    AC_SRC_DLGT_USER({ commit }, data) {
      commit("MU_SRC_DLGT_USER", data);
    },
    //SWAT 토큰(1440분 짜리)
    AC_SWAT_TOKEN({ commit }, data) {
      commit("MU_SWAT_TOKEN", data);
    },

    //CTI 인입 전화 자동받기 설정
    async AC_AUTO_DRWI_YN({ commit }, data) {
      await api
          .post(
              "/api/setting/agent/manage/userCtiAutoDrwiYnProc", {AUTO_DRWI_YN:data.AUTO_DRWI_YN}, { head: {} }
          )
          .then((response) => {
            if (response.data) {
              commit("MU_AUTO_DRWI_YN", data.AUTO_DRWI_YN);
            }
          })
          .catch((error) => {
          });
    },
  },
};

export default userStore;
