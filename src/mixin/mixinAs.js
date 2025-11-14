/* as Interface */
import { mixin } from "@/mixin/mixin.js";

export const mixinAs = {
    mixins: [mixin],
    data() {
        return {}
    },
    mounted() {
    },
    destroy() {
    },
    computed: {},
    methods: {

        //바로처리 공통 코드 목록 조회
        async mixinAsGetCommonCode(grpCd, cdIn = [], strHeadText) {
            const postParam = {
                GRP_CD: grpCd,
                CD_IN: cdIn,
                USE_YN: 'Y',
            };
            const headParam = {head: {}};
            const response = await this.common_postCall("/phone-api/as/common/selectCotisCmnCdList", postParam, headParam);
            return this.getResponseData(response, strHeadText);
        },

        //바로처리 시설구분 코드 목록 조회
        async mixinAsGetLclsCode(strHeadText) {
            const postParam = {};
            const headParam = {head: {}};
            const response = await this.common_postCall("/phone-api/as/common/selectCotisLclsCdList", postParam, headParam);
            this.LCLS_CD_LIST = this.getResponseData(response, strHeadText);
        },

        //바로처리 공간 코드 목록 조회
        async mixinAsGetMntnSpceCode(lclsCd, strHeadText) {
            const postParam = {
                LCLS_CD: lclsCd
            };
            const headParam = {
                head: {
                    ns: 'lhcs.phone.as.dao.PhoneAsCommonMapper_Cotis'
                }
            };
            const response = await this.common_postCall("/api/biz/common/external/select/selectCotisMntnSpceCdList", postParam, headParam);
            this.SPCE_CD_LIST = this.getResponseData(response, strHeadText);
        },

        //지역본부 목록 조회
        async mixinAsGetAsAraHdqCdList() {
            const postParam = {
            };
            const headParam = {head: {
            ns: 'lhcs.phone.as.dao.PhoneAsCommonMapper_Cotis'
            }};
            const response = await this.common_postCall("/api/biz/common/external/select/selectCotisAraHdqCdList", postParam, headParam);
            this.ARA_HDQ_CD_LIST = this.getResponseData(response);
        },

        async mixinAsGetSchdlDeptCombo(strHeadText){
            const resData = [];
          const postParam = {}
          const headParam = {head: {
              ns : 'palette3.setting.ognz.dao.OgnzMapper',
              sn : 'selectOgnzByAs'
              }};
          const response = await this.common_postCall("/api/biz/common/select/selectOgnzByAs", postParam, headParam)
            if( !response.HEADER.ERROR_FLAG ){
                response.DATA.map(item=>{
                    resData.push({
                        text : item.DEPT_NM,
                        value : item.DEPT_ID
                    })
                })
            }
            if(!this.mixin_isEmpty(strHeadText)){
                resData.unshift({
                    text: strHeadText,
                    value: ''
                })
            }
            this.AS_DEPT_CD = resData;
        },
        
        //공종 코드 목록 조회
        async mixinAsGetAsMntnCstpCdList() {
            const postParam = {
            };
            const headParam = {head: {
            ns: 'lhcs.phone.as.dao.PhoneAsCommonMapper_Cotis'
            }};
            const response = await this.common_postCall("/api/biz/common/external/select/selectCotisMntnCstpCdList", postParam, headParam);
            this.MNTN_CSTP_CD_LIST = this.getResponseData(response);
        },

        // 응답데이터 리턴
        getResponseData(response, strHeadText = "선택") {
            let responseData = [];
            if (!response.HEADER.ERROR_FLAG) {
                response.DATA.map(item => {
                    responseData.push({text: item.CD_NM, value: item.CD})
                });
            }

            //전체, 선택 등 값이 있다면 추가.
            if (strHeadText != "" && strHeadText != undefined) {
                responseData.unshift({text: strHeadText, value: ""});
            }
            return responseData;
        },


        //바로처리센터 스케줄러 - 검색 결과 
        async mixinAsMoveSearchOther(index, srchUserId) {
            console.log("mixinAsMoveSearchOther", index, srchUserId)
            let searchCondition = "";
            let uri = ""
            let mstatus = "";
            if(index == 1) {//배분
                uri = "selectCtnFlwDtlFullSnList"
            } else if(index == 2) {//방문예정
                uri = "selectCtyFlwDtlFullSnList"
            } else if(index == 3) {//통화예약
                uri = "selectRsrvFlwDtlFullSnList"
            } else if(index == 4) {//'완료' -> '해피콜 예정' 으로 변경(2024.12.26 바로처리 시연 시 협의 사항)
                uri = "selectCmplFlwDtlFullSnList"
            } else if(index == 7 || index == 8 || index == 9) {//모바일 스케줄러 - 카카오 미사용, 업체 미등록, 협의불가가
                uri = "selectMstatusFlwDtlFullSnList"
                mstatus = index == 7 ? "MSTATUS02" : index == 8 ? "MSTATUS03" : index == 9 ? "MSTATUS04" : '';
            }

            const postParam = {
                MSTATUS: mstatus,
                SRCH_USER_ID: srchUserId
            };
            const headParam = {head: {
            ns: 'lhcs.phone.as.dao.PhoneAsSchedulerMapper'
            }};
            const response = await this.common_postCall("/api/biz/common/select/" + uri, postParam, headParam);
            if( !response.HEADER.ERROR_FLAG ) {
                if(uri != "selectMstatusFlwDtlFullSnList") {
                    searchCondition = {SRCH_FROM:"OTHER", SELECT_ROW_YN: 'N', SELECT_ROW_DBL_YN: 'Y', FLW_DTL_FULL_SN_LIST: response.DATA};
                } else if(uri == "selectMstatusFlwDtlFullSnList") {
                    const flwDtlFullSnList = [];
                    response.DATA.map(item => {
                        flwDtlFullSnList.push({FLW_DTL_FULL_SN_LIST: item.FLW_DTL_FULL_SN})
                    })
                    searchCondition = {SRCH_FROM:"OTHER", SELECT_ROW_YN: 'N', SELECT_ROW_DBL_YN: 'Y', FLW_DTL_FULL_SN_LIST: flwDtlFullSnList};
                }
                
            }

            
            //전화상담탭이 있는지 확인
            let m0100 = false;
            if(this.$store.getters['commonStore/GE_COMMON_ACTIVE_TAB'].id === 'CSL_M0100') m0100 = true;

            if(!m0100) this.mixin_set_active_tab({PATH_NM:'/CSL_M0100', NODE_TITLE:'전화상담'});
            setTimeout(() => {
            this.$eventBus.$emit('setSchedulerSrchFrom', "OTHER");
            this.$eventBus.$emit('searchSchedulerListPaging', searchCondition);
            }, !m0100?1000:10);
        },

        //AS 접수번호 패턴 적용( 예) 240906-61-00128 )
        mixinAsSetAsVFlwAcpSn(no){
            if (!no) { return ""; }
      
            no = no.replace(/[^0-9]/g, "");
            //13자리까지 자른다.
            no = no.substring(0, 13);
            let setNum = "";
      
            if (no.length === 13) {
                setNum = no.substring(0, 6) + "-" + no.substring(6, 8) + "-" + no.substring(8, 13);
            } else if(no.length > 8) {
                setNum = no.substring(0, 6) + "-" + no.substring(6, 8) + "-" + no.substring(8);
            } else if (no.length > 6) {
              setNum = no.substring(0, 6) + "-" + no.substring(6);
            } else {
              setNum = no;
            }
            return setNum;
          },
    }
};

