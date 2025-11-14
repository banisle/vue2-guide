<template>
  <div :class="isPopup ? 'pl-quick-layer-body pb-0' : ''">
    <!-- search -->
    <div class="pl-rounded-box">
      <div class="pl-form-inline-wrap vertical label-80 px-5 pt-3">
        <div class="pl-form-inline">
          <span class="pl-label">
            부서 선택
          </span>
          <div class="pl-desc">
            <div class="spacing-wrap sp-4">
              <v-select
                v-model="SCH_DEPT_ID[0]"
                class="pl-form type-middle is-sm"
                :items="getDeptList(3, '')"
                @change="clearNextCombo(0)"
                placeholder="선택"
              ></v-select>
              <v-select
                v-model="SCH_DEPT_ID[1]"
                class="pl-form type-middle"
                :items="getDeptList(4, SCH_DEPT_ID[0])"
                @change="clearNextCombo(1)"
                placeholder="선택"
              ></v-select>
              <v-select
                v-model="SCH_DEPT_ID[2]"
                class="pl-form type-middle"
                :items="getDeptList(5, SCH_DEPT_ID[1])"
                @change="clearNextCombo(2)"
                placeholder="선택"
              ></v-select>
              <v-select
                v-model="SCH_DEPT_ID[3]"
                class="pl-form type-middle"
                :items="getDeptList(6, SCH_DEPT_ID[2])"
                @change="clearNextCombo(3)"
                placeholder="선택"
              ></v-select>
              <v-select
                v-model="SCH_DEPT_ID[4]"
                class="pl-form type-middle is-lg"
                :items="getDeptList(7, SCH_DEPT_ID[3])"
                @change="clearNextCombo(4)"
                placeholder="선택"
              ></v-select>
            </div>
          </div>
        </div>
      </div>
      <div class="pl-form-inline-wrap vertical label-80 px-5 py-3 is-border-top">
        <div class="pl-form-inline">
          <span class="pl-label">
            검색어
          </span>
          <div class="pl-desc">
            <div class="spacing-wrap sp-4 align-center">
              <v-text-field
                v-model="SCH_DEPT_NM"
                class="pl-form type-middle"
                @keydown.enter="getUserList()"
                placeholder="부서명 입력" />
              <v-text-field
                v-model="SCH_USER_NM"
                class="pl-form type-middle is-sm"
                @keydown.enter="getUserList()"
                placeholder="이름 입력" />
              <v-text-field
                v-model="SCH_PHN_NO"
                class="pl-form type-middle"
                @keydown.enter="getUserList()"
                placeholder="전화번호 입력" />
              <v-text-field
                v-model="SCH_TKCG_TASK_CN"
                class="pl-form type-middle is-lg"
                @keydown.enter="getUserList()"
                placeholder="담당업무명 입력" />
              <v-checkbox
                v-model="SCH_USER_STTS_CD"
                class="pl-check"
                label="재직중"
                input-value="true"
              ></v-checkbox>
              <v-btn class="pl-btn ml-auto" @click="getUserList()">조회</v-btn>
              <compo-tooltip-btn
                TitleProp="초기화"
                ClassProp="pl-tooltip-btn"
                IconProp="pl-icon20 refresh"
                TooltipPositionProp="bottom"
                @btnClick="schReset"
              ></compo-tooltip-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- grid -->
    <div class="pl-grid-top is-mt-l">
      <div class="pl-grid-top-left">
        <strong class="pl-bullet-txt is-blue">업무 담당자 검색결과</strong>
      </div>
      <div class="pl-grid-top-utils">
        <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ mixin_convertNumToComma(gridTotalCnt) }})</em> 명</span>
      </div>
    </div>
    <v-data-table
      class="pl-grid is-mt-s"
      :headers="headers"
      :items="items"
      :item-class="isActiveRow"
      fixed-header
      item-key="index"
      height="260px"
      :items-per-page="ROW_PER_PAGE"
      hide-default-footer
      no-data-text="등록된 데이터가 없습니다."
      @click:row="rowClick"
      :page.sync="page"
      @page-count="pageCount = $event"
      :loading="loading"
      loading-text="조회중입니다."
      >
      <template v-slot:[`item.${header.value}`]="{ item }" v-for="header in headers">
        <template v-if="header.telYn">
          <template v-if="item[header.value]">{{ item[header.value].indexOf('#') > -1 ? mixin_setPhoneNo(item[header.value].split('#')[0].replace(/[^0-9]/g, "")) : mixin_setPhoneNo(item[header.value].replace(/[^0-9]/g, "")) }}</template>
        </template>
        <template v-else>
          <template v-if="header.value === 'REG_DT'">
            {{ mixin_convertDate(item[header.value], 'yyyy-MM-dd HH:mm:ss') }}
          </template>
          <template v-else-if="header.value === 'TRANSPHN_USE_YN'">
            <span v-if="item[header.value] === 'Y'">허용</span>
            <span v-else>금지</span>
          </template>
          <template v-else>{{ item[header.value] }}</template>
        </template>
      </template>
      <template v-slot:item.DEPT_WHOL_PATH="{ item }">
        <v-tooltip content-class="pl-tooltip " bottom>
          <template v-slot:activator="{ on, attrs }">
              <span
                  v-bind="attrs"
                  v-on="on">
              {{ item.DEPT_WHOL_PATH }}</span>
          </template>
          <span>{{ item.DEPT_WHOL_PATH }}</span>
        </v-tooltip>
      </template>
      <template v-slot:item.TKCG_TASK_CN="{ item }">
        <v-tooltip content-class="pl-tooltip " bottom>
          <template v-slot:activator="{ on, attrs }">
              <span
                  v-bind="attrs"
                  v-on="on">
              {{ item.TKCG_TASK_CN }}</span>
          </template>
          <span>{{ item.TKCG_TASK_CN }}</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <div class="pl-pager">
      <div class="pl-pager-row">
        <span>페이지당 항목 수</span>
        <v-select
          class="pl-form"
          :value="ROW_PER_PAGE"
          :items="perPage"
          :item-text="toString(ROW_PER_PAGE)"
          @change="ROW_PER_PAGE = parseInt($event, 10);"
        ></v-select>
      </div>
      <v-pagination
        v-model="page"
        :length="pageCount"
        circle
        :total-visible="7">
      </v-pagination>

      <!-- 더보기 다음 있을때만 노출 -->
      <span class="pl-pager-period">
        보기 {{ mixin_getPagePeriod(items, page) }} / {{ items.length }}
        <compo-tooltip-btn
          TitleProp="다음 검색"
          ClassProp="pl-tooltip-btn is-line"
          IconProp="pl-icon20 arrow-next-paging"
          TooltipPositionProp="bottom"
          :DisabledProp = "nextDisabled"
          @btnClick="getUserList('next')"
        ></compo-tooltip-btn>
      </span>
    </div>

    <!-- table -->
    <table class="pl-tbl-detail is-mt-l">
      <colgroup>
        <col width="127px" />
        <col width="" />
        <col width="127px" />
        <col width="" />
      </colgroup>
      <tbody>
        <tr>
          <th scope="row">
            <span class="pl-label">
              이름
            </span>
          </th>
          <td >
            <div class="spacing-wrap sp-4">
              <v-text-field
                disabled
                class="pl-form is-auto"
                :value="selectedRow.USER_NM"
              />
              <v-text-field
                disabled
                class="pl-form is-auto"
                :value="selectedRow.JBPS_CD_NM"
              />
              <v-text-field
                disabled
                class="pl-form is-auto"
                :value="selectedRow.EMP_NO"
              />
            </div>
          </td>
          <th scope="row">
            <span class="pl-label">
              부서명
            </span>
          </th>
          <td>
            <v-text-field
              disabled
              class="pl-form is-auto"
              :value="selectedRow.DEPT_WHOL_PATH"
            />
          </td>
        </tr>
        <tr>
          <th scope="row">
            <div class="d-flex align-center">
              <span class="pl-label">
                전화번호
              </span>
              <!-- 전화 버튼 -->
              <!-- <compo-tooltip-btn
                v-if="selectedRow.TEL_NO"
                TitleProp="전화 걸기"
                ClassProp="pl-tooltip-btn ml-auto"
                IconProp="pl-icon20 td-in-call"
                TooltipPositionProp="bottom"
                :MinWidthProp=22
                :HeightProp=22
                @btnClick="outCall"
              ></compo-tooltip-btn> -->
            </div>
          </th>
          <td >
            <div class="spacing-wrap sp-4">
              <v-text-field
                v-model="TEL_NO1"
                class="pl-form flex-grow-0"
                style="width: 111.67px;"
              />
              <v-text-field
                v-model="TEL_NO2"
                class="pl-form flex-grow-0 "
                style="width: 111.67px;"
              />
              <v-text-field
                v-model="TEL_NO3"
                class="pl-form flex-grow-0 "
                style="width: 111.67px;"
              />
            </div>
          </td>
          <th scope="row">
            <span class="pl-label">
              i-Fax 번호
            </span>
          </th>
          <td >
            <v-text-field
              v-model="I_FAX_NO"
              class="pl-form is-auto"
              />
          </td>
        </tr>
        <tr>
          <th scope="row">
            <span class="pl-label">
              담당업무<br>(세부업무)
            </span>
          </th>
          <td colspan="3" class="has-textarea">
            <div class="pl-txt-area" style="height: 80px">
              {{ selectedRow.TKCG_TASK_CN }}
            </div>
          </td>
        </tr>
        <tr>
          <th scope="row">
            <div class="d-flex align-center">
              <span class="pl-label">
                주소
              </span>
              <!-- 주소 -->
              <!-- <compo-tooltip-btn
                TitleProp="문자보내기"
                ClassProp="pl-tooltip-btn ml-auto"
                IconProp="pl-icon20 td-in-sms"
                TooltipPositionProp="bottom"
                :MinWidthProp=22
                :HeightProp=22
                @btnClick=""
              ></compo-tooltip-btn> -->
            </div>
          </th>
          <td colspan="3">
            <v-text-field
              v-model="ADDR"
              class="pl-form is-auto"
              />
          </td>

        </tr>
      </tbody>
    </table>

    <!-- mark:// dialog: 지도 보기 -->
    <v-dialog
      v-model="dialogViewMap"
      content-class="dialog-draggable"
      persistent
      width="440"
      no-click-animation
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="지도 보기"
        :FooterProp="false"
        @hide="mixin_hideDialog('ViewMap')"
      >
        <template slot="body">
          <!-- component -->
           <CompoViewMap :DataProp="map_data"/>

        </template>
        <template slot="footer">

        </template>
      </compo-dialog>
    </v-dialog>

  </div>
</template>

<script>
import CompoViewMap from '@/components/CompoViewMap'
export default {
    name: "RightJobParts", //name은 'MENU_' + 파일명 조합
    components: {
      CompoViewMap,
    },
    props:{
    popData: {
      type: Object,
      default: null,
    }
  },
    data() {
      return {
        isPopup: false, //윈도우 팝업 열기 여부

        common_ognz_list:[], //조직정보

        WORK_USER_LIST : [], //업무 담당자 그룹

        SCH_DEPT_ID : new Array(5), //부서

        SCH_DEPT_NM : '', //부서명
        SCH_USER_NM : '', //이름
        SCH_PHN_NO : '', //전화번호
        SCH_TKCG_TASK_CN : '', //담당업무명

        SCH_USER_STTS_CD : true, //재직여부

        selectedRow : {}, //그리드 선택 값

        // grid
        loading : false,
        gridTotalCnt : 0,
        page: 1,
        pageCount: 0,
        perPage: [10,30,50,100],
        ROW_PER_PAGE: 10,
        pagination: {
          page: 1,
          rowsPerPage: 500,
          sortBy: "",
          descending: ""
        },
        nextDisabled : false,

        headers: [
          { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
          { text: '이름', value: 'USER_NM', align: '', width: '80px', sortable: false },
          { text: '직위', value: 'JBPS_CD_NM', align: '', width: '9%', sortable: false },
          { text: '부서명', value: 'DEPT_WHOL_PATH', align: '', width: '', sortable: false },
          { text: '호전환 허용여부', value: 'TRANSPHN_USE_YN', align: 'center', width: '12%', sortable: false},
          { text: '전화번호', value: 'TEL_NO', align: '', width: '12%', sortable: false, telYn: true },
          { text: '담당업무', value: 'TKCG_TASK_CN', align: '', width: '25%', sortable: false },
        ],
        items: [],

        // table
        table_data: {
          parts: `★전화상담 조기 마감 업무담당자(17이후 전화연결 X) ★ 마이홈 상담 * 대체채용 기간직 * 증명서발급 : 코티스신청건 승인불가`,
          address: '(13637)경기도 성남시 분당구 성남대로 54번길 3 804호'
        },

        // dialog 지도보기
        dialogViewMap: false,
        map_data: {
          PROFILE: {
            name: '김진아',
            grade: '주임',
            phone: '02-2169-8814',
            img: require('@/assets/img/@manager_profile_default.png'),
            part: '지사/경기남부본부/주거복지사업처/서울서북권주거복지사',
          },
          place: '(13637)경기도 성남시 분당구 성남대로 54번길 3 804호',
          desc: `★ 전화상담 조기 마감 업무담당자(17시 이후 전화연결 불가)
  - 건설/매매임대, 집주인임대, 상가:갱신(재계약), 명의변경
  - 담당단지: 구로구, 금천구
  - [서울서부권지사(매입임대) 위착관리소 번호] 02-3666-0071(강서, 구로)`,
        },
        OUT_CALL_DATA: {
          dropItems: ['마이홈센터'],
          dropItems2: [],
          CUST_PHN_NO: '010-5303-0000',
        },

        TEL_NO1 : '', //전화번호1
        TEL_NO2 : '', //전화번호2
        TEL_NO3 : '', //전화번호3
        I_FAX_NO : '', //i-Fax 번호
        ADDR : '', //주소소
      }
    },
    computed: {
    },
    watch: {
    },
    mounted() {
    },
    beforeDestroy() {
      this.$eventBus.$off("userInfoUpdValid"); //eventBus 중복방지를 위해 off
    },
    async created() {
      if(this.popData != null) {
        this.isPopup = this.popData.isPopup;
      }
      this.common_ognz_list =  await this.mixin_ognz_list();
      this.WORK_USER_LIST = await this.mixin_ognz_list_detail(this.common_ognz_list, '9000', '' );

      this.$eventBus.$on("userInfoUpdValid", (custInfo) => {
        this.userInfoUpdValid();
      });
      
      if(this.$store.getters["authStore/GE_AUTH_LOGIN_DATA"].TKCG_RGN_CD){
        this.SCH_DEPT_ID[0] = '10000819'; //지사
        this.SCH_DEPT_ID[1] = this.$store.getters["authStore/GE_AUTH_LOGIN_DATA"].TKCG_RGN_CD;
      }else{
        this.SCH_DEPT_ID[0] = '10000819'; //지사
      }

      this.getUserList();
    },
    methods: {
      schReset() { //검색 초기화
        this.SCH_DEPT_ID.forEach((dept, idx) => {
          this.SCH_DEPT_ID[idx] = '';
        });
        this.SCH_DEPT_NM = '';
        this.SCH_USER_NM = '';
        this.SCH_PHN_NO = '';
        this.SCH_WORK_NM = '';
        this.SCH_USER_STAT = true;
      },

      getDeptList(lvl, deptId){
        let arrDeptList = [{text: '전체', value: ''}];
        this.WORK_USER_LIST.forEach((dept, idx) => {
          if(lvl === 3){
            if(Number(dept.LVL) === lvl) arrDeptList.push({text: dept.DEPT_NM, value: dept.DEPT_ID});
          }else{
            if(Number(dept.LVL) === lvl && dept.UP_DEPT_ID === deptId) arrDeptList.push({text: dept.DEPT_NM, value: dept.DEPT_ID});
          }
        });

        return arrDeptList;
      },

      clearNextCombo(ord){
        this.SCH_DEPT_ID.forEach((sch, idx) => {
          if(idx > ord) this.SCH_DEPT_ID[idx] = '';
        });
      },

      //사용자 목록 조회
      async getUserList(next) {
        //다음버튼 클릭 유무
        if (next == 'next'){
        } else {
          this.selectedRow = {};
          this.$emit('setTransTelNo', this.selectedRow);
          this.$emit('saveBtnCtl', false);
          this.TEL_NO1 = '';
          this.TEL_NO2 = '';
          this.TEL_NO3 = '';
          this.ADDR = '';
          this.I_FAX_NO = '';

          this.items = [];
          this.pagination.page = 1; //페이징 처리 초기화
          this.nextDisabled = true;  //버튼 비활성화
        }

        let schDeptId = '';
        this.SCH_DEPT_ID.forEach((dept, idx) => {
          if(dept) schDeptId = dept;
        });

        let postParam = {
          SRCH_TYPE : '', //업무담당자그룹
          // DEPT : schDeptId,
          SRCH_GROUP_ID : schDeptId,
          DEPT_NM : this.SCH_DEPT_NM,
          USER_NM : this.SCH_USER_NM,
          TEL_NO : this.SCH_PHN_NO.replace(/[^0-9]/g, ''),
          TKCG_TASK_CN : this.SCH_TKCG_TASK_CN,
          SRCH_USER_STTS_CD : this.SCH_USER_STTS_CD?'WORK':'',
        };
        let headParam = {
          head: {
            ns: 'lhcs.system.user.dao.UserMapper',
            ROW_CNT : this.pagination.rowsPerPage,
            PAGES_CNT : this.pagination.page,
            PAGING : 'Y'
          }
        };

        this.loading = true;
        const response = await this.common_postCall('/api/biz/common/select/selectUserList', postParam, headParam);

        if (!response.HEADER.ERROR_FLAG){
          response.DATA.forEach((data, idx) => {
            if(data.DEPT_WHOL_PATH){
              let reDeptFullPath = '';
              data.DEPT_WHOL_PATH.split('>').forEach((item, seq) => {
                if(seq > 1){
                  reDeptFullPath += (seq > 2 ? '>' : '') + item;
                }
              });
              data.DEPT_WHOL_PATH = reDeptFullPath;
            }
          });

          let tempDataText = response.DATA;
          this.items = [...this.items, ...tempDataText];

          if(response.HEADER.next !== null && response.HEADER.next !== undefined){
            if(response.HEADER.next === true){
              this.nextDisabled = false //버튼 활성화
            }else{
              this.nextDisabled = true  //버튼 비활성화
            }
          }
          if(this.items.length > 0) this.gridTotalCnt = response.HEADER.TOT_COUNT;

          this.pagination.page += 1;
        }

        this.loading = false;
      },

      //로우 클릭시 색상 변경
      isActiveRow(item){
        const activeClass = item === this.selectedRow ? "active" : "";
        return activeClass;
      },

      rowClick(item) {
        this.selectedRow = item;

        this.TEL_NO1 = item.TEL_NO?item.TEL_NO.split('#').length > 0?this.mixin_setPhoneNo(item.TEL_NO.split('#')[0]):this.mixin_setPhoneNo(item.TEL_NO):'';
        this.TEL_NO2 = item.TEL_NO?item.TEL_NO.split('#').length > 1?this.mixin_setPhoneNo(item.TEL_NO.split('#')[1]):'':'';
        this.TEL_NO3 = item.TEL_NO?item.TEL_NO.split('#').length > 2?this.mixin_setPhoneNo(item.TEL_NO.split('#')[2]):'':'';
        this.ADDR = item.ADDR;
        this.I_FAX_NO = item.I_FAX_NO;

        this.$emit('saveBtnCtl', true);
        // this.$emit('setTransTelNo', this.selectedRow);
        if(item.TRANSPHN_USE_YN === 'Y') this.$emit('setTransTelNo', this.selectedRow);
        else this.$emit('transPhnNoClear');
      },

      //전화걸기 버튼 이벤트
      outCall(){
        if(this.CUTT_ING){
          this.showAlertInfo({msg : '상담 중에는 통화를 할 수 없습니다.<br>상담을 먼저 저장하세요.'});
          return;
        }else{
          this.$eventBus.$emit('topOutCall', {CUST_PHN_NO : this.selectedRow.TEL_NO?this.selectedRow.TEL_NO.split('#').length > 0?this.mixin_setPhoneNo(this.selectedRow.TEL_NO.split('#')[0]):this.mixin_setPhoneNo(this.selectedRow.TEL_NO):''});
        }
      },

      //사용자 정보 저장 valid
      userInfoUpdValid(){
        if(!this.TEL_NO1.trim() && !this.TEL_NO2.trim() && !this.TEL_NO3.trim() && !this.I_FAX_NO.trim() && !this.ADDR.trim()){
          this.showAlertInfo({msg : '전화번호 또는 i-Fax 번호, 주소 중 변경할 내용을 입력해 주세요.'});
          return;
        }

        this.showConfirmInfo({
          msg : '저장 하시겠습니까?'
          , callYes : () => {
            this.userInfoUpd();
          }
          , callNo : this.closeAlert
        });
      },

      //사용자 정보 저장
      async userInfoUpd() {
        let postParam = {
          SRCH_USER_ID : this.selectedRow.USER_ID
          , LGN_ID : this.selectedRow.LGN_ID
        };

        if(this.TEL_NO1 || this.TEL_NO2 || this.TEL_NO3){
          let arrTelNo = [];
          arrTelNo.push({INDEX : 1, TEL_NO : this.TEL_NO1.replace(/[^0-9]/g, '')});
          arrTelNo.push({INDEX : 2, TEL_NO : this.TEL_NO2.replace(/[^0-9]/g, '')});
          arrTelNo.push({INDEX : 3, TEL_NO : this.TEL_NO3.replace(/[^0-9]/g, '')});

          postParam.TEL_NO_LIST = JSON.stringify(arrTelNo);
        }

        postParam.I_FAX_NO = this.I_FAX_NO;
        postParam.ADDR = this.ADDR;

        let headParam = {
          head: {
          }
        };

        const response = await this.common_postCall('/api/user/userInfoUpd', postParam, headParam);

        if (!response.HEADER.ERROR_FLAG){
          this.showAlertInfo({msg : '저장 되었습니다.'});
          this.selectedRow.TEL_NO = this.TEL_NO1+'#'+this.TEL_NO2+'#'+this.TEL_NO3;
          this.$emit('setTransTelNo', this.selectedRow);
          return;
        }
      }
    },
  };
</script>

<style lang="scss" scoped>

</style>