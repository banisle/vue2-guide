<template>
  <div style="display: contents;">
    <!-- 좌측메뉴 -->
    <v-navigation-drawer
        absolute
        permanent
        right
        width="60px"
        :class="`pl-layout-left ${computedUserType === 'ETC_ADMIN' ? 'd-none' : ''}`"
    >
      <v-list height="100%" class="">
        <v-list-item-group class="">
          <!-- <v-list-item
            v-for="item in user_menu_left"
            :key="item.NODE_TITLE"
            :to="item.PATH_NM"
            link
            class=""
            :class="[item.setting]"
            :ripple="false"
            @click="mixin_set_active_tab(item)"
            >
            <v-tooltip left content-class="pl-tooltip left">
              <template v-slot:activator="{ on, attrs}">
                <span
                  v-bind="attrs"
                  v-on="on"
                  class="pl-icon-sidemenu"
                  :class="[item.ICON_CLASS_NM, { 'active': $route.path === item.PATH_NM }]">
                </span>
              </template>
                <span>{{ item.NODE_TITLE }}</span>
            </v-tooltip>
          </v-list-item> -->

          <!-- //mark: side panel -->
          <v-list-item
            v-model="item.active"
            v-for="(item, index) in user_menu_right"
            :key="index"
            :class="`${item.ICON_CLASS_NM}`"
            :ripple="false"
            @click="item.ACT_NM ? showSlide(item) : mixin_set_active_tab(item)"
            :ref="`menuitem${index}`"
            :style="`order: ${ index }`"
            >
            <v-tooltip left content-class="pl-tooltip left">
              <template v-slot:activator="{ on, attrs}">
                <span
                  v-if="!item.alarm"
                  v-bind="attrs"
                  v-on="on"
                  
                  class="pl-icon-sidemenu"
                  :class="[item.ICON_CLASS_NM, { 'active': item.active }]">
                </span>
                <span
                  v-else
                  style="cursor: pointer;"
                  v-bind="attrs"
                  v-on="on">
                  <vLottiePlayer
                    :name="item.ACT_NM"
                    :autoplay=true
                    :loop=true
                    width="30px"
                    height="30px"
                    :animationData=item.animationData
                  />
                </span>
              </template>
              <span>{{ item.NODE_TITLE }}</span>
            </v-tooltip>
          </v-list-item>
          <!-- 청약플러스 -->
          <v-list-item
              :style="`order: ${ user_menu_right.length }`"
              class="lhplus"
              @click="mixin_openWindow( 'LayoutPopup', '1300', '750', {compo_name : 'CompoRealTalkLogSearch', title: '청약 플러스', popData:{isPopup: true}})"
          >
            <v-tooltip left content-class="pl-tooltip left">
              <template v-slot:activator="{ on, attrs}">
                <span
                    v-bind="attrs"
                    v-on="on"
                    class="pl-icon-sidemenu lhplus"
                >
                </span>
              </template>
              <span>청약플러스 공고문</span>
            </v-tooltip>
          </v-list-item>
          <!-- setting -->
          <v-list-item
            v-if="(SELECTED_COMPANY.SRVC_GDS_ID == null || SELECTED_COMPANY.SRVC_GDS_ID == undefined || SELECTED_COMPANY.SRVC_GDS_ID != 99) && mixin_isEmpty(computedSrcDlgtUser.USER_ID)/* 위임받은자x */"
            :style="`order: ${ user_menu_right.length }`"
            @click="dialogSetting = !dialogSetting"
            class="mt-auto is-setting">
            <v-tooltip left content-class="pl-tooltip left">
              <template v-slot:activator="{ on, attrs}">
                <span
                  v-bind="attrs"
                  v-on="on"
                  class="pl-icon-leftmenu"
                  :class="`pl-icon-leftmenu setting ${dialogSetting ? 'active' : ''}`">
                </span>
              </template>
              <span>설정</span>
            </v-tooltip>
          </v-list-item>

        </v-list-item-group>
      </v-list>

    </v-navigation-drawer>




    <!-- 모달 : 지식 정보 -->
    <v-slide-x-reverse-transition>
      <div class="pl-quick-layer" v-if=" dialogKms === true">
        <div class="pl-quick-layer-header">
          <h1>지식 정보</h1>
          <compo-tooltip-btn
              TitleProp="닫기"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 dialog-close"
              TooltipPositionProp="bottom"
              @btnClick="closeModal('dialogKms')"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body has-tab">
          <right-kms></right-kms>
        </div>
      </div>
    </v-slide-x-reverse-transition>
    <!-- 모달 : 문자 -->
    <v-slide-x-reverse-transition>
      <div class="pl-quick-layer" v-if=" dialogSms === true ">
        <div class="pl-quick-layer-header"><h1>문자</h1>
          <compo-tooltip-btn
              TitleProp="닫기"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 dialog-close"
              TooltipPositionProp="bottom"
              @btnClick="closeModal('dialogSms')"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body has-tab">
          <right_sms :custInfoProp="CUST_INFO"></right_sms>
        </div>
      </div>
    </v-slide-x-reverse-transition>
    <!-- 모달 : 알림톡 -->
    <v-slide-x-reverse-transition>
      <div class="pl-quick-layer" v-if=" dialogTalk === true ">
        <div class="pl-quick-layer-header"><h1>알림톡</h1>
          <compo-tooltip-btn
              TitleProp="닫기"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 dialog-close"
              TooltipPositionProp="bottom"
              @btnClick="closeModal('dialogTalk')"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body">
          <right-talk :custInfoProp="CUST_INFO"></right-talk>
        </div>
      </div>
    </v-slide-x-reverse-transition>
    <!-- 모달 : 캠페인 -->
    <v-slide-x-reverse-transition>
      <div class="pl-quick-layer" v-if=" dialogCampaign === true ">
        <div class="pl-quick-layer-header"><h1>캠페인</h1>
          <compo-tooltip-btn
              TitleProp="닫기"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 dialog-close"
              TooltipPositionProp="bottom"
              @btnClick="closeModal('dialogCampaign')"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body">
          <right-campaign></right-campaign>
        </div>
      </div>
    </v-slide-x-reverse-transition>
    <!-- 모달 : 콜백 -->
    <v-slide-x-reverse-transition>
      <div class="pl-quick-layer" v-if=" dialogCallback === true ">
        <div class="pl-quick-layer-header"><h1>콜백</h1>
          <compo-tooltip-btn
              TitleProp="닫기"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 dialog-close"
              TooltipPositionProp="bottom"
              @btnClick="closeModal('dialogCallback')"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body">
          <right-callback></right-callback>
        </div>
      </div>
    </v-slide-x-reverse-transition>
    <!-- 모달 : 예약콜 -->
    <v-slide-x-reverse-transition>
      <div class="pl-quick-layer" v-if=" dialogReserveCall === true ">
        <div class="pl-quick-layer-header"><h1>예약콜</h1>
          <compo-tooltip-btn
              TitleProp="닫기"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 dialog-close"
              TooltipPositionProp="bottom"
              @btnClick="closeModal('dialogReserveCall')"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body">
          <right-reservecall></right-reservecall>
        </div>
      </div>
    </v-slide-x-reverse-transition>
    <!-- 모달 : ChatGpt -->
    <v-slide-x-reverse-transition>
      <div class="pl-quick-layer is-chatgpt" v-if=" dialogChatGpt === true ">
        <right-chatgpt
            @hide="closeModal('dialogChatGpt')"
        ></right-chatgpt>
      </div>
    </v-slide-x-reverse-transition>
    <!-- 모달 : 주문내역 -->
    <!--  백그라운드에서 실행되어야 하기 때문에 v-if가 아닌 v-show  -->
    <!--    <v-slide-x-reverse-transition>-->
    <!--      <div class="pl-quick-layer is-order"-->
    <!--           v-if="!mixin_isEmpty(dialogOrderListLayoutId) && dialogOrderList === true"-->
    <!--      >-->
    <!--&lt;!&ndash;           v-show="dialogOrderList === true"&ndash;&gt;-->
    <!--        <div class="pl-quick-layer-header"><h1>주문내역</h1>-->
    <!--          <compo-tooltip-btn-->
    <!--              TitleProp="닫기"-->
    <!--              ClassProp="pl-tooltip-btn"-->
    <!--              IconProp="pl-icon20 dialog-close"-->
    <!--              TooltipPositionProp="bottom"-->
    <!--              @btnClick="closeModal('dialogOrderList')"-->
    <!--          ></compo-tooltip-btn>-->
    <!--        </div>-->
    <!--        <div class="pl-quick-layer-body">-->
    <!--          &lt;!&ndash; 주문내역 &ndash;&gt;-->
    <!--          <mainphone-order-->
    <!--              :CUST_INFO_PROP="CUST_INFO"-->
    <!--              :LAYOUT_ID_PROP="dialogOrderListLayoutId"-->
    <!--              :SHOW_DIALOG_PROP="dialogOrderList"-->
    <!--              @closeOrderList="closeModal('dialogOrderList')"-->
    <!--          />-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </v-slide-x-reverse-transition>-->
    <!-- 모달 : 예약내역(sw전용!!!!!) -->
    <v-slide-x-reverse-transition>
      <div class="pl-quick-layer" v-if=" dialogSwBooking === true ">
        <div class="pl-quick-layer-header"><h1>예약 현황</h1>
          <compo-tooltip-btn
              TitleProp="닫기"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 dialog-close"
              TooltipPositionProp="bottom"
              @btnClick="closeModal('dialogSwBooking')"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body">
          <RightSwBooking></RightSwBooking>
        </div>
      </div>
    </v-slide-x-reverse-transition>

    <!-- side panel : 상담업무지원-->
    <v-slide-x-reverse-transition>
      <div
        class="pl-quick-layer type-right"
         :style="`${computedUserType === 'ETC_ADMIN' ? 'right:0px;width: 480px;' : 'width: 480px;'}`"
        v-if=" dialogCsSupportTool === true ">
        <div class="pl-quick-layer-header"><h1>상담업무지원</h1>
          <compo-tooltip-btn
              TitleProp="닫기"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 dialog-close"
              TooltipPositionProp="bottom"
              @btnClick="closeModal('dialogCsSupportTool')"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body" style="flex: 0 0 calc(100% - 154px)">
          <RightCsSupportTool></RightCsSupportTool>
        </div>
      </div>
    </v-slide-x-reverse-transition>

    <!-- side panel : 업무 담당자-->
    <v-slide-x-reverse-transition>
      <div v-if=" dialogJobParts === true "
        class="pl-quick-layer "
        :style="`${computedUserType === 'ETC_ADMIN' ? 'right:0px;width: 1000px;' : 'width: 1000px;'}`"
        >
        <div class="pl-quick-layer-header"><h1>업무 담당자 찾기</h1>
          <compo-tooltip-btn
            TitleProp="윈도우 팝업 열기"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 openPop"
            TooltipPositionProp="bottom"
            @btnClick="mixin_openWindow( 'LayoutPopup', '1000', '850', {compo_name : 'RightJobParts', callback : 'getPopData', title: '업무 담당자 찾기', popData:{isPopup: true}}), dialogJobParts = false"
          ></compo-tooltip-btn>
          <compo-tooltip-btn
            TitleProp="닫기"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 dialog-close"
            TooltipPositionProp="bottom"
            @btnClick="closeModal('dialogJobParts')"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body pb-0" style="flex: 0 0 calc(100% - 209px)">
          <RightJobParts @setTransTelNo="setTransTelNo" @saveBtnCtl="saveBtnCtl" @transPhnNoClear="TRANS_TEL_NO = ''"></RightJobParts>
        </div>
        <div class="pl-quick-layer-footer">
          <template v-if="computedUserCenter !== '4' && Number(CTI_CALL_STAT.replace(/[^0-9]/g, '')) === 6"><!--바로처리 센터가 아닌 경우만 호전환(현업)사용-->
            <div class="pl-form-inline-wrap">
              <div class="pl-form-inline">
                <span class="pl-label">
                  <v-icon class="pl-icon20 swap"></v-icon>
                  <strong class="ml-1">전환</strong>
                </span>
                <div class="pl-desc">
                  <v-text-field
                    v-model="TRANS_TEL_NO"
                    :value="TRANS_TEL_NO"
                    class="pl-form type-middle ml-1"
                    maxlength="14"
                    hide-spin-buttons
                    type="text"
                    @keyup="setPhoneNo(TRANS_TEL_NO)"
                    oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
                  ></v-text-field><!--readonly 요청으로 제거 처리-->
                </div>
              </div>
            </div>
            <div class="spacing-wrap sp-4 ml-1">
              <v-btn
                class="pl-btn"
                :disabled="TRANS_TEL_NO?Number(CTI_CALL_STAT.replace(/[^0-9]/g, '')) === 6 ? false : true:true"
                @click="tryTrans"
              >전환시도</v-btn>
              <v-btn
                class="pl-btn is-sub"
                :disabled="TRANS_TEL_NO?Number(CTI_CALL_STAT.replace(/[^0-9]/g, '')) === 6 && PREV_CONN_ID ? false : true:true"
                @click="transTelNo"
              >전환</v-btn>
              <v-btn
                class="pl-btn is-sub"
                :disabled="TRANS_TEL_NO?Number(CTI_CALL_STAT.replace(/[^0-9]/g, '')) === 6 && PREV_CONN_ID ? false : true:true"
                @click="transCancel"
              >전환 취소</v-btn>
            </div>
          </template>
          <div class="pl-btn-wrap ml-auto">
            <v-btn
              @click="closeModal('dialogJobParts')"
              class="pl-btn is-trans ml-auto">닫기</v-btn>
            <v-btn class="pl-btn" :disabled="userSaveBtnUseFlag ? false : true" @click="$eventBus.$emit('userInfoUpdValid')">저장</v-btn>
          </div>
        </div>
      </div>
    </v-slide-x-reverse-transition>

    <!-- side panel : 지식정보 -->
    <v-slide-x-reverse-transition>
      <div v-show=" dialogknInfo === true "
        class="pl-quick-layer "
        >
        <div class="pl-quick-layer-header is-noborder"><h1>지식 정보</h1>
          <compo-tooltip-btn
            TitleProp="윈도우 팝업 열기"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 openPop"
            TooltipPositionProp="bottom"
            @btnClick="[mixin_openWindow( 'LayoutPopup', '675', '850', {compo_name : 'RightKnInfo', title: '지식 정보', popData: POP_DATA_CS_INFO}), dialogknInfo = false]"
          ></compo-tooltip-btn>
          <compo-tooltip-btn
            TitleProp="닫기"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 dialog-close"
            TooltipPositionProp="bottom"
            @btnClick="closeModal('dialogknInfo')"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body pa-0" style="flex: 0 0 calc(100% - 140px)">
          <RightKnInfo :TabProp="tabNum"
                       @showKmsSlide="showKmsSlide"
          />
        </div>
      </div>
    </v-slide-x-reverse-transition>

    <!--LHCS 전용 모음-->
    <!-- side panel : 상담 상세정보-->
    <v-slide-x-reverse-transition>
      <div class="pl-quick-layer"
        v-if="slideCsDetail === true"
        :style="tempCenterStyle"
        style="width:800px"
      >
        <div class="pl-quick-layer-header"><h1>상담 상세정보</h1>
          <compo-tooltip-btn
            TitleProp="윈도우 팝업 열기"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 openPop"
            TooltipPositionProp="bottom"
            @btnClick="mixin_openWindow( 'LayoutPopup', '675', '850', {compo_name : 'CSL_M0100_CS_TAB01_DETAIL', callback : 'getPopData', title: '상담 상세정보', popData: POP_DATA_CS_INFO}), slideCsDetail = false"
          ></compo-tooltip-btn>
          <compo-tooltip-btn
            TitleProp="닫기"
            ClassProp="pl-tooltip-btn ml-1"
            IconProp="pl-icon20 dialog-close"
            TooltipPositionProp="bottom"
            @btnClick="slideCsDetail = false"
          ></compo-tooltip-btn>
        </div>
        <CSL_M0100_CS_TAB01_DETAIL @Close="slideCsDetail = false" :CUTT_INFO="CUTT_INFO"/>
      </div>
    </v-slide-x-reverse-transition>

    <!-- side panel : 대화록 보기-->
    <v-slide-x-reverse-transition>
      <div class="pl-quick-layer type-main "
        v-if="slideTalkLog === true"
        :style="tempCenterStyle"
      >
        <div class="pl-quick-layer-header is-noborder">
          <div class="d-flex align-center">
            <h1>[{{ slideTalkLogTitle }}] 님과의 대화록</h1>
<!--            <span class="ml-2">010-1004-1004</span>-->
<!--            <span-->
<!--              style="width: 54px"-->
<!--              class="ml-2 pl-badge is-green">상담완료</span>-->
          </div>
          <compo-tooltip-btn
            TitleProp="닫기"
            ClassProp="pl-tooltip-btn ml-1"
            IconProp="pl-icon20 dialog-close"
            TooltipPositionProp="bottom"
            @btnClick="slideTalkLog = false"
          ></compo-tooltip-btn>
        </div>
        <!-- component -->
        <CompoTalkLog :injectionObj="injectionObj" @Close="slideTalkLog = false" />
      </div>
    </v-slide-x-reverse-transition>

    <!-- side panel : 코칭-->
    <v-slide-x-reverse-transition>
      <div
        v-if="slideCoachDetail === true"
        class="pl-quick-layer type-main"
        :style="tempCenterStyle"
        >
        <HOME_COACHING_DETAIL :injectionObj="injectionObj" @Close="slideCoachDetail = false"/>
      </div>
    </v-slide-x-reverse-transition>

    <!-- slide: 공지사항 -->
    <v-slide-x-reverse-transition>
      <div class="pl-quick-layer" v-if=" slideNotice === true ">

        <div class="pl-quick-layer-body pa-0">
          <StatusBoardNotice :TabProp="tabNum" :injectionObj="injectionObj" @Close="slideNotice = false" />
        </div>
      </div>
    </v-slide-x-reverse-transition>
    <!-- slide: 상담 미처리 현황 -->
    <v-slide-x-reverse-transition>
      <div class="pl-quick-layer type-side" v-if=" slideMonitor === true ">
        <div class="pl-quick-layer-header"><h1>상담 미처리 현황</h1>
          <compo-tooltip-btn
            TitleProp="닫기"
            ClassProp="pl-tooltip-btn ml-1"
            IconProp="pl-icon20 dialog-close"
            TooltipPositionProp="bottom"
            @btnClick="slideMonitor = false"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body pa-0">
          <StatusBoardMonitor :TabProp="tabNum"/>
        </div>
      </div>
    </v-slide-x-reverse-transition>
    <!-- slide: 마이홈 - 미처리 -->
    <v-slide-x-reverse-transition>
      <div class="pl-quick-layer type-side" v-if=" slideMyhomeUndone === true ">
        <!-- 상담사 -->
        <div class="pl-quick-layer-header">
          <img
            :src="USER_PROFILE.IMG"
            :alt="USER_PROFILE.USER_NM"
            style="border-radius: 50%;max-width: 35px; max-height: 35px"
            @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}" />
          <div class="ml-3">
            <div>
              <strong style="font-size: 14px">{{ USER_PROFILE.USER_NM }}</strong>
              <span class="ml-2 is-txt-sub">{{ (USER_PROFILE.JBPS_CD_NM!= '' && USER_PROFILE.JBPS_CD_NM!= '-')?USER_PROFILE.JBPS_CD_NM:USER_PROFILE.atrtGroupNm }}</span>
            </div>
            <div >
              <strong>{{ USER_PROFILE.CUSTCO_NM }}-{{ USER_PROFILE.DEPT_NM }}</strong>
            </div>
          </div>
          <compo-tooltip-btn
            TitleProp="닫기"
            ClassProp="pl-tooltip-btn ml-auto align-self-start"
            IconProp="pl-icon20 dialog-close"
            TooltipPositionProp="bottom"
            @btnClick="slideMyhomeUndone = false"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body">
          <StatusBoardMyhomeUndone :TabProp="tabNum"/>
        </div>
      </div>
    </v-slide-x-reverse-transition>
    <!-- slide: 상담내용 이첩 현황 -->
    <v-slide-x-reverse-transition>
      <div class="pl-quick-layer type-side" v-if=" slideTrans === true ">
        <div class="pl-quick-layer-header"><h1>상담내용 이첩 현황</h1>
          <compo-tooltip-btn
            TitleProp="닫기"
            ClassProp="pl-tooltip-btn ml-1"
            IconProp="pl-icon20 dialog-close"
            TooltipPositionProp="bottom"
            @btnClick="slideTrans = false"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body pa-0">
          <StatusBoardTrans :TabProp="tabNum"/>
        </div>
      </div>
    </v-slide-x-reverse-transition>
    <!-- slide: 배려고객 현황 -->
    <v-slide-x-reverse-transition>
      <div
        style="width: 550px;"
        class="pl-quick-layer "
        v-if=" slideBlack === true ">
        <div class="pl-quick-layer-header"><h1>배려고객 현황</h1>
          <compo-tooltip-btn
            TitleProp="닫기"
            ClassProp="pl-tooltip-btn ml-1"
            IconProp="pl-icon20 dialog-close"
            TooltipPositionProp="bottom"
            @btnClick="slideBlack = false"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body pa-0">
          <StatusBoardBlack :TabProp="tabNum" :SCH_ST_DT="SCH_ST_DT" :SCH_END_DT="SCH_END_DT"/>
        </div>
      </div>
    </v-slide-x-reverse-transition>
    <!-- slide: 제보요청 현황 -->
    <v-slide-x-reverse-transition>
      <div
        style="width: 550px;"
        class="pl-quick-layer type-side"
        v-if=" slideRequest === true ">
        <div class="pl-quick-layer-header"><h1>제보요청 현황</h1>
          <compo-tooltip-btn
            TitleProp="닫기"
            ClassProp="pl-tooltip-btn ml-1"
            IconProp="pl-icon20 dialog-close"
            TooltipPositionProp="bottom"
            @btnClick="slideRequest = false"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body pa-0">
          <StatusBoardRequest :TabProp="tabNum" :SCH_GVIFMT_TYPE_CD="STTS_KEY_CD" :SCH_ST_DT="SCH_ST_DT" :SCH_END_DT="SCH_END_DT"/>
        </div>
      </div>
    </v-slide-x-reverse-transition>
    <!-- slide: 고객 특이사항 신청 현황 -->
    <v-slide-x-reverse-transition>
      <div
        style="width: 550px;"
        class="pl-quick-layer type-side"
        v-if=" slideExcptnRequest === true ">
        <div class="pl-quick-layer-header"><h1>고객 특이사항 신청 현황</h1>
          <compo-tooltip-btn
            TitleProp="닫기"
            ClassProp="pl-tooltip-btn ml-1"
            IconProp="pl-icon20 dialog-close"
            TooltipPositionProp="bottom"
            @btnClick="slideExcptnRequest = false"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body pa-0">
          <StatusBoardExcptnRequest :TabProp="tabNum" :SCH_ST_DT="SCH_ST_DT" :SCH_END_DT="SCH_END_DT"/>
        </div>
      </div>
    </v-slide-x-reverse-transition>
    <!-- slide: 자체 사후처리 -->
    <v-slide-x-reverse-transition>
      <div
        style="width: 450px;"
        class="pl-quick-layer"
        v-if=" slideSelfExec === true ">
        <div class="pl-quick-layer-header"><h1>사후처리</h1>
          <compo-tooltip-btn
            TitleProp="닫기"
            ClassProp="pl-tooltip-btn ml-1"
            IconProp="pl-icon20 dialog-close"
            TooltipPositionProp="bottom"
            @btnClick="closeSlide('slideSelfExec')"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body pa-0">
          <StatusBoardSelfExec
           :TabProp="tabNum"
           @closeSlide="closeSlide('slideSelfExec')"
          />
        </div>
      </div>
    </v-slide-x-reverse-transition>
    <!-- slide: 바로처리센터:인바운드  이관접수, 반려요청 -->
    <v-slide-x-reverse-transition>
      <div
        style="width: 470px;"
        class="pl-quick-layer"
        v-if=" slideCenterTransInbound === true ">
        <div class="pl-quick-layer-header"><h1>이관요청/반려접수 현황</h1>
          <compo-tooltip-btn
            TitleProp="닫기"
            ClassProp="pl-tooltip-btn ml-1"
            IconProp="pl-icon20 dialog-close"
            TooltipPositionProp="bottom"
            @btnClick="slideCenterTransInbound = false"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body pa-0">
          <StatusBoardCenterTransInbound :TabProp="tabNum"/>
        </div>
      </div>
    </v-slide-x-reverse-transition>
    <!-- slide: 바로처리센터:스케줄러  이관요청, 반려접수 -->
    <v-slide-x-reverse-transition>
      <div
        style="width: 470px;"
        class="pl-quick-layer"
        v-if=" slideCenterTransScheduler === true ">
        <div class="pl-quick-layer-header"><h1>이관접수/반려요청 현황</h1>
          <compo-tooltip-btn
            TitleProp="닫기"
            ClassProp="pl-tooltip-btn ml-1"
            IconProp="pl-icon20 dialog-close"
            TooltipPositionProp="bottom"
            @btnClick="slideCenterTransScheduler = false"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body pa-0">
          <StatusBoardCenterTransScheduler :TabProp="tabNum" :InjectionProp="injectionObj"/>
        </div>
      </div>
    </v-slide-x-reverse-transition>
    <!-- slide: 휴가 신청 현황 -->
    <v-slide-x-reverse-transition>
      <div
          style="width: 550px;"
          class="pl-quick-layer "
          v-if=" sideVacation === true ">
        <div class="pl-quick-layer-header"><h1>휴가 신청 현황</h1>
          <compo-tooltip-btn
              TitleProp="닫기"
              ClassProp="pl-tooltip-btn ml-1"
              IconProp="pl-icon20 dialog-close"
              TooltipPositionProp="bottom"
              @btnClick="sideVacation = false"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body pa-0">
          <HomeSideVacation :TabProp="tabNum"/>
        </div>
      </div>
    </v-slide-x-reverse-transition>

    <!-- slide: 데일리 -->
    <v-slide-x-reverse-transition>
      <div v-if=" slideDaily === true "
           class="pl-quick-layer"
           style="width: 600px;"
      >
        <div class="pl-quick-layer-header"><h1>데일리</h1>
          <compo-tooltip-btn
              TitleProp="윈도우 팝업 열기"
              ClassProp="pl-tooltip-btn ml-1"
              IconProp="pl-icon20 openPop"
              TooltipPositionProp="bottom"
              @btnClick=""
          ></compo-tooltip-btn>
          <compo-tooltip-btn
              TitleProp="닫기"
              ClassProp="pl-tooltip-btn ml-1"
              IconProp="pl-icon20 dialog-close"
              TooltipPositionProp="bottom"
              @btnClick="slideDaily = false"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body pa-0" >
          <HomeSideDaily :TabProp="tabNum"/>
        </div>
      </div>
    </v-slide-x-reverse-transition>

    <!-- slide: 업무평가 -->
    <v-slide-x-reverse-transition>
      <div
          class="pl-quick-layer"
          :style="tempCenterStyle"
          v-if=" slideTestExam === true ">
        <div class="pl-quick-layer-header"><h1>오늘의 업무능력 평가</h1>
          <compo-tooltip-btn
              TitleProp="닫기"
              ClassProp="pl-tooltip-btn ml-1"
              IconProp="pl-icon20 dialog-close"
              TooltipPositionProp="bottom"
              @btnClick="slideTestExam = false"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body pa-0">
          <HomeTestExam :TabProp="tabNum"/>
        </div>
      </div>
    </v-slide-x-reverse-transition>

    <!-- slide : 근태현황  -->
    <v-slide-x-reverse-transition>
      <div class="pl-quick-layer type-side" v-if="slideTodayWkattd === true ">
        <div class="pl-quick-layer-header"><h1>{{ mixin_isEmpty(injectionObj)?'오늘의 근태 현황': injectionObj.title }}</h1>
          <compo-tooltip-btn
              TitleProp="닫기"
              ClassProp="pl-tooltip-btn ml-1"
              IconProp="pl-icon20 dialog-close"
              TooltipPositionProp="bottom"
              @btnClick="slideTodayWkattd = false"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body pa-0">
          <HomeSideTodayWkattd
              :TabProp="tabNum"
              :calendarProp="injectionObj"
          />
        </div>
      </div>
    </v-slide-x-reverse-transition>

    <!-- setting slide -->
    <v-slide-x-reverse-transition>
      <div class="pl-quick-layer is-setting" :style="`${computedUserType === 'ETC_ADMIN' ? 'right:0px;' : ''}`" v-if=" dialogSetting === true">
        <div class="pl-quick-layer-header">
          <h1>환경설정</h1>
          <compo-tooltip-btn
              TitleProp="닫기"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 dialog-close"
              TooltipPositionProp="bottom"
              @btnClick="closeSettingSlide"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body has-tab" style="flex: 0 0 calc(100% - 154px)">
          <setting-slide></setting-slide>
        </div>
      </div>
    </v-slide-x-reverse-transition>
    <!-- slide: 이메일 발송 -->
    <v-slide-x-reverse-transition>
      <div
          v-if=" slideEmailSend === true "
          style="width: 800px"
          class="pl-quick-layer">
        <div class="pl-quick-layer-header"><h1>이메일 발송</h1>
          <compo-tooltip-btn
              TitleProp="닫기"
              ClassProp="pl-tooltip-btn ml-1"
              IconProp="pl-icon20 dialog-close"
              TooltipPositionProp="bottom"
              @btnClick="slideEmailSend = false"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body pa-0" style="flex: 0 0 calc(100% - 217px);">
          <CompoSendEmailWrite
              :DataProp={}
          />
        </div>
        <div class="pl-quick-layer-footer pl-btn-wrap">
          <v-btn class="pl-btn is-trans ml-auto" @click="slideEmailSend = false">취소</v-btn>
          <v-btn class="pl-btn">보내기</v-btn>
        </div>
      </div>
    </v-slide-x-reverse-transition>

    <!-- slide : QA평가결과  -->
    <v-slide-x-reverse-transition>
      <div v-if=" slideQaResult === true "
        class="pl-quick-layer"
        :style="tempCenterStyle"
        style="width:800px">
        <HOME_QC_DETAIL
          @Close="()=>{slideQaResult=false}"
        />
      </div>
    </v-slide-x-reverse-transition>

    <!-- side panel : 알림톡 발송 -->
    <v-dialog
        v-model="dialogSendKakao"
        content-class="dialog-draggable is-lg"
        hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
          header-title="알림톡 발송"
          :OpenPopProp="true"
          @hide="mixin_hideDialog('SendKakao')"
          @submit="submitDialog('SendKakao')"
      >
        <template slot="body">
          <CompoSendKakao
              :InitProp="dialogSendKakao"
              :SendProp="sendKakaoTrigger"
              :DataProp="CUST_INFO"
          />
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="[mixin_hideDialog('SendKakao'), CUST_INFO = {}]">닫기</v-btn>
          <v-btn class="pl-btn is-icon"
                 @click="sendKakaoTrigger=!sendKakaoTrigger"
          >
            <span class="pl-icon20 chat-send-white"></span>
            알림톡 보내기
          </v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
    <!-- SMS 발송 -->
    <v-dialog
        v-model="dialogSendSms"
        content-class="dialog-draggable is-lg is-maxheight"
        hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
          header-title="SMS 발송"
          @hide="mixin_hideDialog('SendSms')"
      >
        <template slot="body">
          <!-- component -->
          <CompoSendSms
              :DataProp="CUST_INFO"
              :InitProp="dialogSendSms"
              :SendProp="sendSmsTrigger"
          />

        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="mixin_hideDialog('SendSms')">닫기</v-btn>
          <v-btn class="pl-btn is-icon"
                 @click="[sendSmsTrigger=!sendSmsTrigger]"
          >
            <span class="pl-icon20 chat-send-white"></span>
            메시지 보내기
          </v-btn>
        </template>
      </compo-dialog>
    </v-dialog>

    <!-- dialog: 바로처리센터: 미대상 -->
    <v-dialog
        v-if="dialogNotarget"
        v-model="dialogNotarget"
        width="1400"
        content-class="dialog-draggable is-lg"
        hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
          header-title="미대상"
          @hide="mixin_hideDialog('Notarget')"
          @submit="submitDialog('Notarget')"
      >
        <template slot="body">
          <CompoNotarget :TabProp="tabNum" @close="mixin_hideDialog('Notarget')"/>
        </template>
      </compo-dialog>
    </v-dialog>

    <!-- dialog: 녹취파일 듣기 -->
    <v-dialog
        v-if="dialogListenAudio"
        v-model="dialogListenAudio"
        content-class="dialog-draggable"
        hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
          header-title="녹취 재생"
          @hide="mixin_hideDialog('ListenAudio')"
          @submit="submitDialog('ListenAudio')"
      >
        <template slot="body">
          <CompoManagerInfo/>
          <!-- 상담 상세내역 -->
          <div class="is-mt-m is-border-sub-top">
            <div class="d-flex align-center is-mt-m">
              <CompoAudioWave
                  :WidthProp=250
                  :AudioProp="AudioProp"
              />
            </div>
          </div>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import RightKms from '@/views/page/right_kms.vue';
// import RightSms from '@/views/page/right_sms.vue';
import RightTalk from '@/views/page/right_talk.vue';
import RightCampaign from '@/views/page/right_campaign.vue';
import RightCallback from '@/views/page/right_callback.vue';
import RightReservecall from '@/views/page/right_reservecall.vue';
import right_sms from '@/views/page/right_sms.vue';
import RightChatgpt from '@/views/page/right_chatGpt.vue';
import RightSwBooking from '@/views/page/right_swbooking.vue';//(sw전용!!!!!)
import SettingSlide from '@/views/page/SettingSlide.vue';

import RightCsSupportTool from '@/views/page/right_csSupportTool.vue';
import RightJobParts from '@/views/page/right_jobparts.vue';
import RightKnInfo from '@/views/page/RightKnInfo.vue';
import CompoSendKakao from '@/components/CompoSendKakao.vue';
import CompoSendSms from '@/components/CompoSendSms.vue';

import MainphoneOrder from '@/views/page/mainPhone/MainphoneOrder.vue';

import CSL_M0100_CS_TAB01_DETAIL from '@/views/page/CSL_M0100_CS_TAB01_DETAIL.vue'
import CompoTalkLog from '@/components/CompoTalkLog.vue'
import HOME_COACHING_DETAIL from '@/views/page/Home/HOME_COACHING_DETAIL.vue'
import HOME_QC_DETAIL from '@/views/page/Home/HOME_QC_DETAIL.vue'

import StatusBoardNotice from '@/views/page/StatusBoardNotice.vue'
import StatusBoardMonitor from '@/views/page/StatusBoardMonitor.vue'
import StatusBoardTrans from '@/views/page/StatusBoardTrans.vue'
import StatusBoardSelfExec from '@/views/page/StatusBoardSelfExec.vue'
import StatusBoardBlack from '@/views/page/StatusBoardBlack.vue'
import StatusBoardRequest from '@/views/page/StatusBoardRequest.vue'
import StatusBoardExcptnRequest from '@/views/page/StatusBoardExcptnRequest.vue'
import StatusBoardMyhomeUndone from '@/views/page/StatusBoardMyhomeUndone.vue'
import StatusBoardCenterTransScheduler from '@/views/page/StatusBoardCenterTransScheduler.vue'
import StatusBoardCenterTransInbound from '@/views/page/StatusBoardCenterTransInbound.vue'
import CompoNotarget from '@/components/CompoNotarget.vue'

import CompoManagerInfo from '@/components/CompoManagerInfo.vue';
import CompoAudioWave from '@/components/CompoAudioWave.vue';

import HomeSideVacation from '@/views/page/Home/HomeSideVacation.vue'
import HomeSideDaily from '@/views/page/Home/HomeSideDaily.vue'
import HomeTestExam from '@/views/page/Home/HomeTestExam.vue'


import store from "@/store";
import HomeSideTodayWkattd from "@/views/page/Home/HomeSideTodayWkattd.vue";
import CompoSendEmailWrite from "@/views/page/Chat/CompoSendEmailWrite.vue";

import { ipronCallUtil } from "@/store/ipronCallUtil.js";
import custInfo from "@/views/auth/CustInfo.vue";

export default {
  name: 'right_area',
  components: {
    CompoSendEmailWrite,
    HomeSideTodayWkattd,
    RightKms,
    // RightSms,
    RightTalk,
    RightCampaign,
    RightCallback,
    RightReservecall,
    right_sms,
    RightChatgpt,
    RightSwBooking,//(sw전용!!!!!)
    SettingSlide,
    MainphoneOrder,
    RightCsSupportTool, // sidepanel
    RightJobParts,
    RightKnInfo,
    CompoSendKakao,
    CompoSendSms,
    CSL_M0100_CS_TAB01_DETAIL,
    HOME_QC_DETAIL,
    CompoTalkLog,
    HOME_COACHING_DETAIL,
    HomeSideDaily,
    HomeSideVacation, /* 상담사+리더 휴가신청현황 사이드. */
    HomeTestExam,
    StatusBoardNotice,
    StatusBoardMonitor,
    StatusBoardTrans,
    StatusBoardBlack,
    StatusBoardRequest,
    StatusBoardExcptnRequest,
    StatusBoardMyhomeUndone,
    StatusBoardSelfExec,
    StatusBoardCenterTransScheduler,
    StatusBoardCenterTransInbound,
    CompoNotarget,
    CompoManagerInfo,
    CompoAudioWave,
  },
  props: {
    custInfoProp: {
      type: Object,
    },
  },
  data() {
    return {
      USER_PROFILE: this.$store.getters["userStore/GE_USER_ROLE"],
      CUST_INFO: {},
      CUST_EMAIL: '',
      // modal
      dialogKms: false,
      dialogSms: false,
      dialogSendSms: false,
      dialogSendKakao: false,
      dialogTalk: false,
      dialogCampaign: false,
      dialogCallback: false,
      dialogReserveCall: false,
      dialogChatGpt: false,
      dialogOrderList: false,
      dialogSwBooking: false,//(sw전용!!!!!)
      dialogCsSupportTool: false, //상담업무지원
      dialogJobParts: false, //담당업무직원 찾기
      dialogknInfo: false, // 지식정보
      dialogOrderListLayoutId: null,

      rightIndex: 0,
      selectedItem: null,

      // 알람
      alarmCampaign: false,
      alarmReserve: false,
      alarmCallback: false,
      alarmOrderList: false,


      // slide setting
      SELECTED_COMPANY: '',

      TRANS_TEL_NO: '', //업무 담당자 호전환

      sendSmsTrigger: false, //sms발송 트리거
      sendKakaoTrigger: false, //sms발송 트리거

      //LHCS 전용 모음-------------------------------------------------
      POP_DATA_CS_INFO: {}, //팝업 전달용 데이터
      // slide
      slideCsDetail: false,//상담 상세정보
      slideTalkLog: false, //대화록
      slideTalkLogTitle: '', //대화록
      slideCoachDetail: false, //코칭
      slideNotice: false, //공지사항
      slideMonitor: false, //상담 모니터링
      slideTrans: false, //이첩현황
      sideVacation: false, //(상담사 + 리더) 휴가 신청 현황
      slideTodayWkattd: false, //(리더) 오늘의근태 목록
      slideBlack: false, //배려고객 현황
      slideRequest: false, //제보요청 현황
      slideExcptnRequest: false, //고객 특이사항 신청 현황
      slideMyhomeUndone: false, //마이홈 미처리
      slideSelfExec: false, //바로처리 사후처리 현황
      slideCenterTransScheduler: false, //바로처리센터:스케줄러  이관요청, 반려접수
      slideCenterTransInbound: false, //바로처리:인바운드 이관요청/반려접수 현황
      slideDaily: false, //팀장(부팀장) 메인 데일리
      slideTestExam: false, // 업무평가
      slideEmailSend: false, // 이메일발송
      slideQaResult: false, //QA평가결과

      dialogNotarget: false,// dialog 바로처리센터 : 미대상
      dialogListenAudio: false, //녹취 듣기
      AudioProp: {
        //audioSrc: require('@/assets/file_example_MP3_700KB.mp3')
      },
      //LHCS 전용 모음-------------------------------------------------

      STTS_KEY_CD : '',
      CUTT_INFO : {}, //상담 상세 정보

      tabNum: null,
      injectionObj: null, /* 슬라이드 주입용 객체 */

      TRANS_TEL_NO : '', //호전환 대상 전화번호
      PREV_CONN_ID : '', //이전 전화 연결 ID

      userSaveBtnUseFlag : false, //업무 담당자 찾기 저장 버튼 컨트롤

      SCH_ST_DT : '', //검색 시작일
      SCH_END_DT : '', //검색 종료일

      TRANS_DATA : {}, //호전환 데이터
    };
  },
  computed: {
    custInfo() {
      return custInfo
    },
    dialogSetting: {
      get() {
        return this.$store.getters['commonStore/GE_COMMON_SETTING_SLIDE'];
      },
      set(data) {
        this.$store.dispatch('commonStore/AC_COMMON_SETTING_SLIDE', data);
      },
    },

  },
  watch: {
    CUST_INFO() {
    },
  },
  async mounted() {
  },
  beforeDestroy() {
    this.$eventBus.$off("showRightSlide"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("setSidePanelCustInfo"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("showCsDetail"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("TalkLog"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("CoachDetail"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("showVSlideXreverse"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("clearVSlideXreverse"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("showRightDialog"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("ListenAudio"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("showQaResult"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("showSidePanelCall"); //eventBus 중복방지를 위해 off
  },
  created() {
    // 고객정보 받은 후 세팅
    this.$eventBus.$on("setSidePanelCustInfo", (custInfo) => {
      this.CUST_INFO = custInfo;
    });

    //고객정보에서 우측 메뉴 호출
    this.$eventBus.$on("showRightSlide", (item) => {
      this.user_menu_right.forEach((modal, idx) => {
        if (modal.ACT_NM === item.ACT_NM) {
          this.closeModal(modal, idx);
        } else {
          modal.active = false;
        }
        this.tabNum = item.tabNum
      });
    });

    //전광판 클릭 이벤트로 우측 슬라이드 호출
    this.$eventBus.$on("showVSlideXreverse", (item) => {
      console.log('item : ', item);
      if(item.item !== undefined){
        if('STTS_KEY_CD' in item.item) this.STTS_KEY_CD = item.item.STTS_KEY_CD;
        console.log('this.STTS_KEY_CD : ', this.STTS_KEY_CD);

        if('SCH_ST_DT' in item.item) this.SCH_ST_DT = item.item.SCH_ST_DT;
        if('SCH_END_DT' in item.item) this.SCH_END_DT = item.item.SCH_END_DT;
      }
      this.showVSlideXreverse(item.slide, item.tabNum, item.injectionObj);
    });

    //우측 슬라이드 모두 닫기 이벤트
    this.$eventBus.$on("clearVSlideXreverse", (item) => {
      this.removeSlide();
    });

    this.$eventBus.$on("showRightDialog", (item) => {
      this.mixin_showDialog(item.dialogNm);
    });

    //녹취파일 듣기
    this.$eventBus.$on("ListenAudio", (item) => {
      this.showListenAudio(item);
      this.AudioProp = item;
    });

    // layoutId가 있는 메뉴들은 해당 ACT_NM과   postfix (LayoutId)를 추가해 layoutId를 가지고 있는다.
    this.getLkagLayoutByMenu();

    const companyInfo = this.$store.getters["userStore/GE_USER_ROLE"].company_list;
    if (companyInfo.length > 0) {
      this.SELECTED_COMPANY = companyInfo[0];
    }

    //상담 상세보기
    this.$eventBus.$on("showCsDetail", (SEL_ITEM) => {
      this.POP_DATA_CS_INFO = SEL_ITEM;
      this.CUTT_INFO = SEL_ITEM;
      this.showCsDetail(SEL_ITEM);
    });

    //대화록
    this.$eventBus.$on("TalkLog", (SEL_ITEM) => {
      this.showTalkLog(SEL_ITEM);
    });

    //코칭
    this.$eventBus.$on("CoachDetail", (PHN_CUTT_ID, CUSTCO_ID) => {
      this.showCoachDetail(PHN_CUTT_ID, CUSTCO_ID);
    });

    //QA평가결과
    this.$eventBus.$on("showQaResult", (STD_ID, CUSTCO_ID) => {
      if(this.slideQaResult) this.slideQaResult = false;
      this.$nextTick(() => {
        this.showQaResult(STD_ID, CUSTCO_ID);
      });
    });

    //시스템관리자 설정 메뉴
    this.$eventBus.$on("showSidePanelCall", (item) => {
      this.showSlide(item);
    });
  },
  methods: {
    // setting slide
    closeSettingSlide() {
      this.$store.dispatch('commonStore/AC_COMMON_SETTING_SLIDE', false);
    },

    showSlide(item) {
      this.selectedItem = item;
      this.user_menu_right.forEach((modal, idx) => {
        if (modal.ACT_NM === item.ACT_NM) {
          this.rightIndex = idx;
          if (this[modal.ACT_NM] === true) {
            modal.active = false;
            this[modal.ACT_NM] = false;
          } else {
            modal.active = true;
            this[modal.ACT_NM] = true;
          }
        } else {
          modal.active = false;
          this[modal.ACT_NM] = false;
        }
      });
    },

    showVSlideXreverse(slide, tabNum, injectionObj) {
      this.removeSlide();
      this[`${slide}`] = true;
      this.tabNum = tabNum;
      this.injectionObj = injectionObj;
      console.log("🚀 ~ showSlide ~ tabNum:", slide, tabNum, injectionObj);
    },

    removeSlide() {
      const slideList = [
        'slideCsDetail',
        'slideTalkLog',
        'slideCoachDetail',
        'slideNotice',
        'slideMonitor',
        'slideTrans',
        'sideVacation',
        'slideTodayWkattd',
        'slideBlack',
        'slideRequest',
        'slideExcptnRequest',
        'slideMyhomeUndone',
        'slideSelfExec',
        'slideCenterTransScheduler',
        'slideCenterTransInbound',
        'slideDaily',
        'slideTestExam',
        'slideQaResult'
      ]
      for (let index = 0; index < slideList.length; index++) {
        let slide = slideList[index]
        this[`${slide}`] = false;
      }
    },

    closeModal(modal, index) {
      index = index ?? this.rightIndex;
      const refItem = this.$refs[`menuitem${index}`][0].$el;
      this.$nextTick(() => {
        refItem.click();
        this[`${modal}`] = false;
      });
    },

    closeSlide(slideName) {
      this[`${slideName}`] = false;
    },

    aniCleaner() {
      // this.lottieClenaer.play();
      this.lottieClenaer.playSegments([0, 30], true);
    },

    getLkagLayoutByMenu() {
      this.user_menu_right.forEach((modal, idx) => {
        if (!this.mixin_isEmpty(modal.LAYOUT_ID)) {
          this[`${modal.ACT_NM}LayoutId`] = modal.LAYOUT_ID
        }
      });
    },

    //상담 상세보기
    showCsDetail(SEL_ITEM) {
      this.showVSlideXreverse('slideCsDetail', 0);

      // setTimeout(() => {
      //   this.$eventBus.$emit('setCuslCustInfo', SEL_ITEM); //상담사 및 고객 상세정보 Data
      //   // SEL_ITEM.textareaH = 128; //상담메모 TEXTAREA 높이
      //   this.$eventBus.$emit('setCuttDetailBtnControl', SEL_ITEM); //상담 상세정보 상담정보 Data
      //   this.$eventBus.$emit('setCuttDetailInfo', SEL_ITEM); //상담 상세정보 상담정보 Data
      // }, 100);
    },

    //팝업에서 전달된 데이터 셋
    getPopData(item) {
      this.removeSlide();
      this.windowPopup.close();
    },

    //대화록
    showTalkLog(SEL_ITEM) {
      console.log(">>>>>>>>>>> SidePanel.showTalkLog", SEL_ITEM)
      this.slideTalkLogTitle = SEL_ITEM.LAST_PHN_NO;
      this.showVSlideXreverse('slideTalkLog', 0, SEL_ITEM);
    },

    //코칭
    showCoachDetail(PHN_CUTT_ID, CUSTCO_ID) {
      this.showVSlideXreverse('slideCoachDetail', 0, {PHN_CUTT_ID:PHN_CUTT_ID, CUSTCO_ID:CUSTCO_ID});
    },

    showQaResult(STD_ID, CUSTCO_ID) {
      this.showVSlideXreverse('slideQaResult', 0);
      setTimeout(() => {
        this.$eventBus.$emit('setQaDetailInfo', STD_ID, CUSTCO_ID); // 평가결과 정보
      }, 200);
    },

    //녹취파일 듣기
    showListenAudio(SEL_ITEM) {
      this.mixin_showDialog('ListenAudio');

      setTimeout(() => {
        this.$eventBus.$emit('setCuslCustInfo', SEL_ITEM); //상담사 및 고객 상세정보 Data
      }, 100);
    },

    //호전환 전화번호 셋
    setTransTelNo(item) {
      this.TRANS_DATA = item;
      if (item.TEL_NO){
        if(item.TEL_NO.split('#').length > 0){
          this.TRANS_TEL_NO = this.mixin_setPhoneNo(item.TEL_NO.split('#')[0]);
        }else{
          this.TRANS_TEL_NO = this.mixin_setPhoneNo(item.TEL_NO);
        }
      }else{
        this.TRANS_TEL_NO = '';
      }
    },

    //호전환 전환시도
    tryTrans() {
      if (this.TRANS_TEL_NO) {

        this.PREV_CONN_ID = ipronCallUtil.ConnId;
        ipronCallUtil.PREV_CALL_ID = ipronCallUtil.CALL_ID;

        ipronCallUtil.holdCall();
        ipronCallUtil.obCall(this.TRANS_TEL_NO);
      } else {
        this.showAlert({alertDialogToggle: true, msg: '호전환할 전화번호가 존재하지 않습니다.', iconClass: 'is-info', type: 'default'});
        return;
      }
    },

    //호전환
    transTelNo() {
      if (this.TRANS_TEL_NO) {
        ipronCallUtil.transferMuteCall(this.TRANS_TEL_NO, this.PREV_CONN_ID);

        this.TRANS_DATA.TRNSF_GB = 3;//호전환 구분(1:호전환,2:그룹전환,3:호전환(현업))
        this.TRANS_DATA.TRANS_TEL_NO = this.TRANS_TEL_NO;
        this.$eventBus.$emit('addTrnsfInfoCuttCn', this.TRANS_DATA);

        this.mixin_hideDialog('TransCenter');
      } else {
        this.showAlert({alertDialogToggle: true, msg: '호전환할 전화번호가 존재하지 않습니다.', iconClass: 'is-info', type: 'default'});
        return;
      }
    },

    //전환 취소
    transCancel() {
      ipronCallUtil.retrieveCall(this.PREV_CONN_ID); //보류해제
      ipronCallUtil.clearCall();//호전환 취소
    },

    // 지식정보 슬라이드 오픈
    showKmsSlide(){
      if(!this.dialogknInfo){
        this.showSlide(this.user_menu_right.filter(item => item.ACT_NM === 'dialogknInfo')[0])
      }
    },

    //업무 담당자 찾기 저장 버튼 컨트롤롤
    saveBtnCtl(flag){
      this.userSaveBtnUseFlag = flag;
    },

    setPhoneNo(val){
      let res = this.mixin_setPhoneNo(val.replace(/[^0-9]/g, ""));
      this.TRANS_TEL_NO = res;
    },
  },
};
</script>

<style scoped>

</style>
