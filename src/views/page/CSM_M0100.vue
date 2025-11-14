<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                부서/상담사
              </span>
              <div class="pl-desc">
                <v-select
                    v-model="srchParam.srchDeptId"
                    class="pl-form type-middle"
                    :items="mixin_ognz_list_detail(common_ognz_list, computedUserCenter, '' ,'Y'/*콜센터여부,없으면전체*/)"
                    item-text="DEPT_NM"
                    @change="getUserList"
                    item-value="DEPT_ID"
                    placeholder="전체"
                    :disabled="computedUserDetailType ==='CENTER_LEADER'? false : true"
                ></v-select>
                <v-autocomplete
                    v-model="srchParam.srchUserId"
                    :items="userList"
                    item-text="USER_NM"
                    item-value="USER_ID"
                    class="pl-form type-middle"
                    placeholder="전체"
                    :disabled="mixin_isEmpty(srchParam.srchDeptId)?true:false"
                ></v-autocomplete>
              </div>
            </div>
            <div>
              <v-btn
                class="pl-btn is-icon"
                @click="getUnreadNoticeCnt"
                >
                <span class="pl-icon20 search"></span>
                조회
              </v-btn>

            </div>

          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-cols fill-height">
        <!-- left -->
        <div class="pl-card-body is-col-fix is-vrt" style="width: 60%;">
          <div class="pl-grid-top pt-2">
            <div class="pl-grid-top-left">
              <strong class="pl-bullet-txt is-blue">개인별 미확인 현황</strong>
            </div>
            <div class="pl-grid-top-utils">
              <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ cntItems.length }})</em> 건</span>
            </div>
          </div>
          <v-data-table
            class="pl-grid is-mt-s"
            :headers="cntHeaders"
            :items="cntItems"
            :loading="isLoading"
            fixed-header
            item-key="ROW_NUMBER"
            :item-class="isActiveRow"
            height="calc(-262px + 100vh)"
            :items-per-page="cntItems.length"
            hide-default-footer
            @click:row="rowSelect"
            @dblclick:row="getUnreadNoticeDtl"
            no-data-text="등록된 데이터가 없습니다."
            >
            <!-- 성명 -->
            <template v-slot:item.USER_NM="{ item }">
              <img :src="item.ICON_IMG_URI !== '/' ? item.ICON_IMG_URI : require('@/assets/img/@manager_profile.png')" :alt="item.USER_NM" class="pl-grid-portrait" style="width: 20px; height: 20px;" @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}">
              <span class="ml-1">{{ item.USER_NM }}</span>
            </template>
          </v-data-table>
        </div>
        <!-- right -->
        <div class="pl-card-body">
          <div class="pl-grid-top pt-2">
            <div class="pl-grid-top-left">
              <strong class="pl-bullet-txt is-blue">미확인 게시물 목록</strong>
              <strong class="is-txt-blue" v-if="dtlParam.userNm">({{ dtlParam.userNm }})</strong>
            </div>
            <div class="pl-grid-top-utils">
              <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ mixin_convertNumToComma(dtlItems.length) }})</em> 건</span>
            </div>
          </div>
          <v-data-table
            class="pl-grid is-mt-s"
            :headers="dtlHeaders"
            :items="dtlItems"
            fixed-header
            :loading="dtlLoading"
            item-key="ROW_NUMBER"
            height="calc(-262px + 100vh)"
            :items-per-page="dtlItems.length"
            hide-default-footer
            no-data-text="등록된 데이터가 없습니다."
            >
          </v-data-table>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'MENU_CSM_M0100', //알림 미확인 현황
  components: {
  },
  data() {
    return {
      // 개인별 미확인 현황
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 30,
      cntHeaders: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '센터', value: 'CUSTCO_NM', align: '', width: '17%' , sortable: false},
        { text: '소속', value: 'DEPT_NM', align: '', width: '17%' , sortable: true},
        { text: '성명', value: 'USER_NM', align: '', width: '' , sortable: false},
        { text: '긴급공지 미확인', value: 'EMRG_NTC_CNT', align: 'center', width: '20%' , sortable: false},
        { text: '일반공지 미확인', value: 'GNRL_NCT_CNT', align: 'center', width: '20%' , sortable: false},
      ],
      cntItems: [],

      // 미확인 게시물 목록
      dtlHeaders: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '분류', value: 'BBS_TYPE_NM', align: '', width: '15%' , sortable: false},
        { text: '제목', value: 'PST_TTL', align: '', width: '' , sortable: false},
        { text: '수정일', value: 'MDFCN_DT', align: '', width: '25%' , sortable: false},
      ],
      dtlItems: [],

      srchParam : {
        srchDeptId : '',
        srchUserId : '',
      },
      dtlParam : {
        USER_NM : '',
        srchUserId : ''
      },
      selectedRow : {},
      selectedDeptItem : {},
      common_ognz_list : [],
      userList : [],
      isLoading:false,
      dtlLoading:false,
    }
  },
  async created() {
    // 상담지역조회
    this.common_ognz_list = await this.mixin_ognz_list();
    if(this.computedUserDetailType==='CENTER_LEADER'){
      this.srchParam.srchDeptId =
          this.mixin_ognz_list_detail(this.common_ognz_list, this.computedUserCenter, '', 'Y'/*콜센터여부,없으면전체*/)[1].DEPT_ID
    }else{
      this.srchParam.srchDeptId = this.computedUserDeptId
    }
    if(!this.mixin_isEmpty(this.srchParam.srchDeptId)){
      this.getUnreadNoticeCnt()
      this.getUserList()
    }
  },
  mounted() {
  },
  methods: {
    async getUserList() {
      this.userList = [];
      this.srchParam.srchUserId = '';

      let postParam = {
        SRCH_TYPE : 'CUSL',
        SRCH_GROUP_ID : this.computedUserCenterDeptId,
        SRCH_DEPT_ID : this.srchParam.srchDeptId,
      };
      let headParam = {
        head: {
          ns: "lhcs.system.user.dao.UserMapper",
          sn: "selectUserList"
        }
      };
      if(!this.mixin_isEmpty( this.srchParam.srchDeptId)) {
        const response = await this.common_postCall("/api/biz/common/select/selectUserList", postParam, headParam);

        if (!response.HEADER.ERROR_FLAG) {
          response.DATA.map(item=>{
            this.userList.push(item)
          })
        }
      }
    },
    async getUnreadNoticeCnt(){
      this.isLoading = true
      this.cntItems = []
      let sUrl = '/api/biz/common/select/selectUnreadNoticeCnt';
      let postParam = {
        SRCH_DEPT_ID : this.srchParam.srchDeptId,
        SRCH_USER_ID : this.srchParam.srchUserId,
      }
      let headParam = {
        head : {
          ns : 'lhcs.system.bbs.dao.BbsMapper'
        }
      }
      const response = await this.common_postCall(sUrl, postParam, headParam)
      if( !response.HEADER.ERROR_FLAG ){
        response.DATA.map(item=>{
          item.ICON_IMG_URI = item.ICON_IMG_URI !== '/' ? '/upload/' + item.ICON_IMG_URI : require('@/assets/img/@manager_profile_default.png')
          Object.keys(item).some((key) => {
            if(key.includes("CNT")){
              item[key] = Number(item[key]) > 999 ? this.mixin_convertNumToComma(Number(item[key])) : Number(item[key])
            }
          });
          this.cntItems.push(item)
        })
      }
      this.isLoading = false

    },
    async getUnreadNoticeDtl(){
      this.dtlLoading = true;

      this.dtlParam.srchUserId = this.selectedRow.USER_ID
      this.dtlParam.userNm = this.selectedRow.USER_NM

      this.dtlItems = []
      let sUrl = '/api/biz/common/select/selectUnreadNoticeList';
      let postParam = {
        SRCH_DEPT_ID : this.srchParam.srchDeptId,
        SRCH_USER_ID : this.dtlParam.srchUserId,
      }
      let headParam = {
        head : {
          ns : 'lhcs.system.bbs.dao.BbsMapper'
        }
      }
      const response = await this.common_postCall(sUrl, postParam, headParam)
      if( !response.HEADER.ERROR_FLAG ){
        response.DATA.map(item=>{
          item.PST_TTL = this.mixin_decode(item.PST_TTL)
          item.MDFCN_DT = this.mixin_convertDate(item.MDFCN_DT, 'yyyy-MM-dd HH:mm:ss')
          this.dtlItems.push(item)
        })
      }
      this.dtlLoading = false;
    },
    rowSelect(item) {
      this.selectedRow = item;
      this.dtlParam = {}
    },
    isActiveRow(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>