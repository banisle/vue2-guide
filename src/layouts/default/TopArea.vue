<template>
  <v-app-bar height="55px" class="pl-layout-top" >
    <v-app-bar-nav-icon @click.stop="$emit('drawer')" data-state="topMenu">
      <template slot>
        <span class="top-menu">menu</span>
      </template>
    </v-app-bar-nav-icon>
    <template v-if="(computedUserCenter === '2'/*공가해소*/ || computedUserCenter === '5'/*주택지원*/) && computedUserDetailType === 'CENTER_LEADER'">
      <!-- 공가해소or주택지원의 센터장인경우는 공가해소센터와 주택지원센터 선택 세팅할 수 있도록한다. -->
      <v-toolbar-title class="pl-layout-top-logo" @click="dropSelectCompany = !dropSelectCompany" >
        <div class="pl-layout-top-logo-wrap">
        <span class="company-text-center">
          {{ computedUserCenterDeptNm }}
        </span>
        </div>
      </v-toolbar-title>
      <v-slide-y-transition>
        <div class="pl-drop-layer is-logo-company" v-if="dropSelectCompany === true" v-click-outside="closeDropSelectCompany">
          <div class="pl-drop-layer-body">
            <ul class="pl-drop-layer-list">
              <li
                  v-for="item in COMPANY_INFO"
                  :key="item.CD"
                  @click="selectCompanyList(item)"
              >
                <span class="ml-2 company-text-center">
                  {{ item.CD_NM }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </v-slide-y-transition>
    </template>
    <!-- <template v-else-if="computedUserDetailType === 'SYS_ADMIN' || computedUserDetailType === 'SUPER_ADMIN' || computedUserDetailType === 'SYS_MANAGER' || computedUserDetailType === 'SYS_HUMAN'"> -->
    <template v-else-if="$store.getters['authStore/GE_AUTH_LOGIN_DATA'].GROUP_CD_LIST.indexOf('SYS_ADMIN') > -1 || $store.getters['authStore/GE_AUTH_LOGIN_DATA'].GROUP_CD_LIST.indexOf('SUPER_ADMIN') > -1 || $store.getters['authStore/GE_AUTH_LOGIN_DATA'].GROUP_CD_LIST.indexOf('SYS_MANAGER') > -1 || $store.getters['authStore/GE_AUTH_LOGIN_DATA'].GROUP_CD_LIST.indexOf('SYS_HUMAN') > -1">
      <!-- 슈퍼관리자, 시스템관리자, 인재개발팀, 운영지원팀 권한은 센터를 선택 세팅할 수 있도록한다. -->
      <v-toolbar-title class="pl-layout-top-logo" @click="dropSelectCompany = !dropSelectCompany" >
        <div class="pl-layout-top-logo-wrap">
        <span class="company-text-center">
          {{ computedUserCenterDeptNm }}
        </span>
        </div>
      </v-toolbar-title>
      <v-slide-y-transition>
        <div class="pl-drop-layer is-logo-company" v-if="dropSelectCompany === true" v-click-outside="closeDropSelectCompany">
          <div class="pl-drop-layer-body">
            <ul class="pl-drop-layer-list">
              <li
                  v-for="item in COMPANY_INFO"
                  :key="item.CD"
                  @click="selectCompanyList(item)"
              >
                <span class="ml-2 company-text-center">
                  {{ item.CD_NM }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </v-slide-y-transition>
    </template>
    <template v-else>
      <!-- 일반적인 경우 -->
      <div class="pl-layout-top-logo-wrap"><span class="company-text">{{computedUserCenterDeptNm}}</span></div>
    </template>
    <span class="pl-badge is-bg-red ml-2 px-2" style="cursor: pointer;" v-if="!mixin_isEmpty(computedSrcDlgtUser.USER_ID)/* 위임받은자 */"
          @click="mixin_loginDlgt(computedSrcDlgtUser.LGN_ID, computedSrcDlgtUser.USER_ID, null, 'N')">위임받은 계정 (나의 계정으로)</span>
    <template v-if="mixin_isEmpty(computedSrcDlgtUser.USER_ID)/* 위임받은자x */ && computedUserAuthrtDlgtList.length > 0">
      <span class="ml-5" style="color:white">위임받은권한 :</span>
      <div
          class="d-flex"
          v-for="item,index in computedUserAuthrtDlgtList"
          :key="item.USER_AUTHRT_DLGT_ID">
          <span class="pl-badge is-bg-green ml-2 px-2" style="cursor: pointer;" @click="mixin_loginDlgt(item.DLGT_LGN_ID, item.DLGT_USER_ID, item.DLGT_USER_NM, 'Y')">{{ item.DLGT_USER_NM }}</span>
      </div>
    </template>
    <v-spacer></v-spacer>
    <template v-if="computedUserCenter !== '-1' && SOFT_PHN_USE_YN === 'Y' && $store.getters['userStore/GE_USER_ROLE'].EXT_NO"><!--소프트폰 사용 상태이고 내선 번호가 있는 경우만 CTI 버튼 컨트롤 노출-->
      <div class="pl-layout-top-cti">
        <v-switch v-model="CTI_STAT"
          class="pl-main-switch"
          :label="CTI_STAT === true ? 'CTI 끊기' : 'CTI 연결' "
          @change="ctiConnectEvent()"
          >
        </v-switch>
        <template v-for="item in CTI_MENU" >
          <div
            :key="item.id"
            class="pl-cti-btns"
            :class="{ active: item.active, 'is-disabled': item.disabled }"
            @click=ctiBtnEvt(item)>
              <span :class=item.icon></span>
              <span class="pl-cti-btns-text">{{ item.text }}</span>
            </div>
        </template>
        <template v-for="item,index in MOVE_LIST" >
          <div
            :key="item.id"
            class="pl-cti-btns"
            :class="[{ active: item.active, 'is-disabled': item.disabled }, `type-${index === 0 ?'secondary is-first':'secondary'}` ]"
            @click=ctiBtnEvt(item)>
              <span :class=item.icon></span>
              <span class="pl-cti-btns-text">{{ item.text }}</span>
            </div>
        </template>
      </div>
      <div>
        <div class="pl-layout-top-callstat">
          <span
            style="line-height: 0;"
            class="d-flex align-center">
            {{ CALLSTAT[SELECTED_CALLSTAT].type }}
            <span class="pl-layout-top-callstat-time">{{ CUSL_STAT_TIME }}</span>
          </span>
        </div>
      </div>
    </template>

    <v-spacer></v-spacer>

    <!-- 인재개발관리자자 -->
    <template v-if="computedUserDetailType === 'SYS_HUMAN'">
      <div class="pl-layout-top-callstat mr-2" style="width: 150px" >
        <div
          class="d-flex"
          v-for="item,index in SYS_HUMAN_REQ_STAT"
          :key="item.id">
          <v-icon
            v-if="item.icon"
            :class="item.icon"></v-icon>
          <span class="ml-1">{{ item.title }}</span>
          <span class="ml-4 is-txt-yellow">{{ item.count }}건</span>
          <!-- <v-divider
            v-if="index === 0"
            vertical
            class="is-border-yellow mx-4 my-1"></v-divider> -->
        </div>
      </div>
    </template>
      <!-- 센터운영관리자자 -->
    <template v-else-if="computedUserDetailType === 'SYS_MANAGER'">
      <div class="pl-layout-top-callstat mr-2" style="width: 420px" >
        <div
          class="d-flex"
          v-for="item,index in SYS_MANAGER_REQ_STAT"
          :key="item.id">
          <v-icon
            v-if="item.icon"
            :class="item.icon"></v-icon>
          <span class="ml-1">{{ item.title }}</span>
          <span class="ml-4 is-txt-yellow">{{ item.count }}건</span>
          <v-divider
            v-if="index === 0 || index === 1"
            vertical
            inset
            class="is-border-yellow mx-4 my-1"></v-divider>
        </div>
      </div>
    </template>

    <!-- test : 이석 -->
    <!-- <v-btn color="success" small @click="testLeaveEvt()">식사</v-btn>
    <v-spacer></v-spacer> -->
    <Teleport to="body">
      <CompoLeaveCover
        v-if="isTestLeave"
        @Hide="closeLeaveEvt()"
        :moveStatTxt="MOVE_STAT_TXT"
        />
    </Teleport>
    <!--// test : 이석 -->

    <div class="pl-layout-top-utils">
      <!-- //mark: 전화걸기 -->
       <!--내선이 있고 소프트폰을 사용하더라도 상담사인 경우는 전화걸기 버튼을 노출하지 않음. 2025.02.28 오대리님 요청-->
      <template v-if="computedUserCenter !== '-1' && SOFT_PHN_USE_YN === 'Y' && $store.getters['userStore/GE_USER_ROLE'].EXT_NO && computedUserDetailType !== 'MANAGER'"><!--소프트폰 사용 상태이고 내선 번호가 있는 경우만 CTI 버튼 컨트롤 노출-->
        <compo-tooltip-btn
          TitleProp="전화걸기"
          ClassProp="pl-tooltip-btn mr-5"
          IconProp="pl-icon30 call-white"
          TooltipPositionProp="bottom"
          @btnClick="outCall"
        ></compo-tooltip-btn>
      </template>

      <!-- //mark: 북마크 -->
      <v-tooltip content-class="pl-tooltip bottom" bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-menu
            min-width="350"
            bottom
            left
            offset-y
            offset-x
            :close-on-content-click=false
            content-class="pl-menu-drop pa-2"
            v-model="DropBmk"
            >
            <template v-slot:activator="{ on: menuOn, attrs: menuAttrs }">
              <v-btn
                v-bind="menuAttrs"
                v-on="menuOn"
                class="pl-tooltip-btn pl-top-util"
                min-width="30"
                height="30"
                plain
                >
                <v-icon
                  v-bind="attrs"
                  v-on="on"
                  class="pl-icon20 four-square"></v-icon>
              </v-btn>
            </template>
            <div class="px-3 py-2">
              <div class="d-flex">
                <h3 style="font-size: 16px">북마크</h3>
                <v-btn
                  @click="dropBmkClose()"
                  plain
                  min-width="22"
                  height="22"
                  class="pl-tooltip-btn ml-auto "
                  >
                  <v-icon
                    small
                    class="pl-icon20 dialog-close-black">
                  </v-icon>
                </v-btn>

              </div>
              <!-- 링크정보 -->
              <div class="is-mt-l">
                <div class="d-flex align-center">
                  <v-icon class="pl-icon20 bookmark-org"></v-icon>
                  <strong class="ml-2">링크정보</strong>
                 <template v-if="(computedUserDetailType === 'TEAM_LEADER' || computedUserDetailType === 'CENTER_LEADER')">
                  <compo-tooltip-btn
                    TitleProp="추가"
                    ClassProp="pl-tooltip-btn ml-auto"
                    IconProp="pl-icon20 circle-plus"
                    TooltipPositionProp="bottom"
                    @btnClick="addBmk('addBmkLinkWrap')"
                  ></compo-tooltip-btn>
                </template>
                </div>
                <!-- drag list -->
                <div class="d-flex flex-column is-mt-s ml-5 pl-scroll-body" style="gap: 8px; max-height: 210px">
                  <draggable
                    ghost-class="drag-ghost-box"
                    v-model="BOOKMARK.LINK"
                    @change="chaDragLink()">
                    <div
                      v-for="item,index in BOOKMARK.LINK"
                      :key="item.id"
                      >
                      <!-- 수정 모드 -->
                      <div v-if="editingIndex === index"
                        class="spacing-wrap sp-4 pl-2 py-1"
                        >
                        <div class="flex-column spacing-wrap sp-4 flex-grow-1">
                          <v-text-field
                            class="pl-form type-middle is-auto"
                            v-model="item.TITLE"
                          ></v-text-field>
                          <v-text-field
                            class="pl-form type-middle is-auto"
                            v-model="item.URL"
                          ></v-text-field>
                        </div>
                        <div class="">
                          <compo-tooltip-btn
                            TitleProp="저장"
                            ClassProp="pl-tooltip-btn"
                            IconProp="pl-icon20 confirm"
                            TooltipPositionProp="bottom"
                            @btnClick="addBmkLink()"
                          ></compo-tooltip-btn>
                        </div>
                      </div>
                      <div  v-else
                        class="d-flex align-center pl-2 pr-1 py-1">
                        <a
                          :href="item.URL"
                          target="_blank"
                          class="text-hover"
                          style="width: 100%"
                          >
                          {{item.TITLE}}
                        </a>
                        <!-- 상세 버튼 -->
                        <template v-if="(computedUserDetailType === 'TEAM_LEADER' || computedUserDetailType === 'CENTER_LEADER')">
                        <v-menu
                          min-width="100"
                          bottom
                          left
                          offset-y
                          content-class="pl-simple-drop pa-2"
                          >
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              v-bind="attrs"
                              v-on="on"
                              class="pl-tooltip-btn ml-auto"
                              min-width="22"
                              height="22"
                              plain
                              >
                              <v-icon
                                v-bind="attrs"
                                v-on="on"
                                class="pl-icon20 detail"></v-icon>
                            </v-btn>
                          </template>
                          <ul class="pl-drop-layer-list" >
                            <li @click="editBnk(index,'editingIndex')">
                              <v-icon class="pl-icon20 edit"></v-icon>
                              <span class="ml-2">수정</span>
                            </li>
                            <li @click="removeBnkLink(index)">
                              <v-icon class="pl-icon20 trash"></v-icon>
                              <span class="ml-2">삭제</span>
                            </li>
                          </ul>
                        </v-menu>
                        </template>

                      </div>
                    </div>
                  </draggable>
                </div>
                <div v-if="addBmkLinkWrap"
                  class="spacing-wrap sp-4 pl-2 py-1 ml-5"
                  >
                  <div class="flex-column spacing-wrap sp-4 flex-grow-1">
                    <v-text-field
                      v-model="newBmkLinkTxt"
                      class="pl-form type-middle is-auto"
                      placeholder="북마크 제목"
                    ></v-text-field>
                    <v-text-field
                      v-model="newBmkLinkUrl"
                      class="pl-form type-middle is-auto"
                      placeholder="URL 경로"
                    ></v-text-field>
                  </div>
                  <div class="">
                    <compo-tooltip-btn
                      TitleProp="저장"
                      ClassProp="pl-tooltip-btn"
                      IconProp="pl-icon20 confirm"
                      TooltipPositionProp="bottom"
                      @btnClick="saveBmkLink"
                    ></compo-tooltip-btn>
                    <compo-tooltip-btn
                      TitleProp="취소"
                      ClassProp="pl-tooltip-btn"
                      IconProp="pl-icon20 cancel-x"
                      TooltipPositionProp="bottom"
                      @btnClick="addBmkLinkWrap = false"
                    ></compo-tooltip-btn>
                  </div>
                </div>
              </div>
              <!-- 즐겨찾기 -->
              <div class="is-mt-m pt-3 is-border-top">
                <div class="d-flex align-center">
                  <v-icon class="pl-icon20 favorite-grn"></v-icon>
                  <strong class="ml-2">즐겨찾기</strong>
                  <compo-tooltip-btn
                    TitleProp="추가"
                    ClassProp="pl-tooltip-btn ml-auto"
                    IconProp="pl-icon20 circle-plus"
                    TooltipPositionProp="bottom"
                    @btnClick="addBmk('addBmkFavWrap')"
                  ></compo-tooltip-btn>
                </div>
                <!-- drag list -->
                <div class="d-flex flex-column is-mt-s ml-5 pl-scroll-body" style="gap: 8px; max-height: 210px">
                  <draggable
                    ghost-class="ghost"
                    v-model="BOOKMARK.FAVORITE"
                    @change="chaDragFav()"
                    >
                    <div
                      v-for="item,index in BOOKMARK.FAVORITE"
                      :key="item.id">
                      <!-- 수정 모드 -->
                      <div v-if="editingIndex2 === index"
                        class="spacing-wrap sp-4 pl-2 py-1"
                        >
                        <div class="flex-column spacing-wrap sp-4 flex-grow-1">
                          <v-text-field
                            class="pl-form type-middle is-auto"
                            v-model="item.TITLE"
                          ></v-text-field>
                          <v-text-field
                            class="pl-form type-middle is-auto"
                            v-model="item.URL"
                          ></v-text-field>
                        </div>
                        <div class=""> <!-- @btnClick="editingIndex2 = null;" -->
                          <compo-tooltip-btn
                            TitleProp="저장"
                            ClassProp="pl-tooltip-btn"
                            IconProp="pl-icon20 confirm"
                            TooltipPositionProp="bottom"
                            @btnClick="addBmkFav()"
                          ></compo-tooltip-btn>
                        </div>
                     </div>
                     <div v-else
                       class="d-flex align-center pl-2 pr-1 py-1" >
                       <a
                         :href="item.URL"
                         target="_blank"
                         class="text-hover"
                         >
                         {{ item.TITLE }}
                       </a>
                       <!-- 상세 버튼 -->
                       <v-menu
                         min-width="100"
                         bottom
                         right
                         offset-y
                         content-class="pl-simple-drop pa-2"
                         >
                         <template v-slot:activator="{ on, attrs }">
                           <v-btn
                             v-bind="attrs"
                             v-on="on"
                             class="pl-tooltip-btn ml-auto"
                             min-width="22"
                             height="22"
                             plain
                             >
                             <v-icon
                               v-bind="attrs"
                               v-on="on"
                               class="pl-icon20 detail"></v-icon>
                           </v-btn>
                         </template>
                         <ul class="pl-drop-layer-list" >
                           <li @click="editBnk(index,'editingIndex2')"">
                             <v-icon class="pl-icon20 edit"></v-icon>
                             <span class="ml-2">수정</span>
                           </li>
                           <li @click="removeBnkFav(index)">
                             <v-icon class="pl-icon20 trash"></v-icon>
                             <span class="ml-2">삭제</span>
                           </li>
                         </ul>
                       </v-menu>
                     </div>

                    </div>
                  </draggable>
                </div>
                <div v-if="addBmkFavWrap"
                  class="spacing-wrap sp-4 pl-2 py-1 ml-5"
                  >
                  <div class="flex-column spacing-wrap sp-4 flex-grow-1">
                    <v-text-field
                      v-model="newBmkFavTxt"
                      class="pl-form type-middle is-auto"
                      placeholder="북마크 제목"
                    ></v-text-field>
                    <v-text-field
                      v-model="newBmkFavUrl"
                      class="pl-form type-middle is-auto"
                      placeholder="URL 경로"
                    ></v-text-field>
                  </div>
                  <div class="">
                    <compo-tooltip-btn
                      TitleProp="저장"
                      ClassProp="pl-tooltip-btn"
                      IconProp="pl-icon20 confirm"
                      TooltipPositionProp="bottom"
                      @btnClick="saveBmkFav"
                    ></compo-tooltip-btn>
                    <compo-tooltip-btn
                      TitleProp="취소"
                      ClassProp="pl-tooltip-btn"
                      IconProp="pl-icon20 cancel-x"
                      TooltipPositionProp="bottom"
                      @btnClick="addBmkFavWrap = false">
                    </compo-tooltip-btn>
                  </div>
                </div>
              </div>
            </div>
          </v-menu>
        </template>
        <span>북마크</span>
      </v-tooltip>

      <!-- //mark: 사용자 정보 -->
      <div>
        <v-btn
          @click="mixin_showDialog('Profile')"
          class="pl-top-person"
          title="개인 정보">
          <img
            :src="USER_PROFILE.IMG"
            :alt="USER_PROFILE.USER_NM"
            @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}" />
        </v-btn>
        <v-dialog
            v-model="dialogProfile"
            content-class="pl-top-profile-dialog type-top"
            hide-overlay>
            <TopAreaProfileDialog @Close="closeProfile"
                                  @getUserInfo="getUserInfo"
                                  @changePswd="()=>{
                                    initPswdVar()
                                    mixin_showDialog('Password')
                                  }"
                                  :USER_PROFILE=USER_PROFILE
            />
        </v-dialog>
      </div>
    </div>

    <!-- //mark: 비밀번호 변경 모달 -->
    <v-dialog
      v-model="dialogPassword"
      content-class="dialog-draggable pl-top-password"
      :persistent="forceChange"
      >
      <div class="draggable-area">drag area</div>
        <v-form ref="form">
      <compo-dialog
        header-title="비밀번호 변경"
        :ForceProp="!forceChange"
        @hide="[mixin_hideDialog('Password'), initPswdVar()]"
        @submit="[submitDialog('Password'), initPswdVar()]"
      >
      <template slot="body">
          <div class="pl-form-inline-wrap vertical label-80">
            <div class="pl-form-inline">
              <span class="pl-label">
                현재 비밀번호
              </span>
              <div class="pl-desc">
                <v-text-field
                  v-model="PASSWORD_OLD"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show1 ? 'text' : 'password'"
                  class="pl-form type-middle"
                  placeholder="현재 비밀번호 입력"
                  oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' );"
                  @click:append="show1 = !show1"
                  v-byte-counter="60"
                ></v-text-field>
              </div>
            </div>

            <div class="pl-form-inline">
              <span class="pl-label">
                변경 비밀번호
              </span>
              <div class="pl-desc">
                <v-text-field
                  v-model="PASSWORD_NEW"
                  :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.required, rules.min, rules.max, rules.noneSpace,rules.pw,]"
                  :type="show2 ? 'text' : 'password'"
                  class="pl-form type-middle"
                  placeholder="변경할 비밀번호 입력"
                  oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' );"
                  @click:append="show2 = !show2"
                  v-byte-counter="16"
                ></v-text-field>
              </div>
            </div>

            <div class="pl-form-inline">
              <span class="pl-label">
                비밀번호 재입력
              </span>
              <div class="pl-desc">
                <v-text-field
                  v-model="PASSWORD_NEW2"
                  :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.required, rules.min, rules.max, rules.noneSpace,rules.pw ]"
                  :type="show3 ? 'text' : 'password'"
                  class="pl-form type-middle"
                  placeholder="변경할 비밀번호 다시 입력"
                  oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' );"
                  @click:append="show3 = !show3"
                  v-byte-counter="16"
                ></v-text-field>
              </div>
            </div>

          </div>
          <ul class="pl-list-dot">
            <li>비밀번호는 8~16자의 영문 대소문자, 숫자 특수문자만 가능합니다.</li>
            <li>사용 가능한 특수문자 32자<br/>: ! " # $ % & ' ( ) * + , - . / : ; &lt; = &lt; ? @ [ ₩ ] ^ _ ` { | } ~</li>
          </ul>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" v-if="!forceChange" @click="[mixin_hideDialog('Password'), initPswdVar()]">닫기</v-btn>
          <v-btn class="pl-btn" @click="PswdValidate">저장</v-btn>
        </template>
      </compo-dialog>
          </v-form>
    </v-dialog>

    <!-- //mark:  전화걸기 모달 -->
    <v-dialog
      v-model="dialogOutCall"
      content-class="dialog-draggable is-call"
      persistent
      no-click-animation>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        :FooterProp="false"
        header-title="전화 걸기"
        @hide="obClearCall"
      >
        <template slot="body">
          <!-- component -->
          <compo-out-call
            :DataProp="OUT_CALL_DATA"
            @setCallingFlag="setCallingFlag"
            @ClearCall="obClearCall"
          />
        </template>
      </compo-dialog>
    </v-dialog>

    <!-- 전화받기 -->
    <v-dialog
      v-model="dialogInCall"
      content-class="dialog-draggable is-call type-in px-0 "
      persistent>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="전화 받기"
        :FooterProp="false"
        :ForceProp="false"
      >
        <template slot="body">
          <!-- component -->
          <compo-in-call
            :DataProp="IN_CALL_DATA"
            @inCall="inCall()"
          />
        </template>
      </compo-dialog>
    </v-dialog>
  </v-app-bar>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

// import { callUtil } from "@/store/callUtil.js";
import { ipronCallUtil } from "@/store/ipronCallUtil.js";
import Vue from "vue";
import io from "socket.io-client"; //socket.io
import { stompUtil } from "@/store/stomp-util.js";

import { eventBus } from "@/store/eventBus.js"; //Event Bus
import axios from "axios";
import { get } from 'http';
import TopAreaProfileDialog from '@/layouts/default/TopAreaProfileDialog.vue';
import CompoLeaveCover from '@/components/CompoLeaveCover'

const sha256 = require("sha256");
const crypto = require("crypto");

export default {
  components: {
    TopAreaProfileDialog,
    CompoLeaveCover
  },
  computed: {
  },
  data: () => ({
    dropSelectCompany: false,
    COMPANY_INFO:[],

    list_common_code:[],

    // test: 이석
    isTestLeave: false,

    USER_PROFILE: {
      IMG: require('@/assets/img/@profile_user.png')
    }, // 사용자 프로필

    PROFILE_FILE : null,

    ENCRYPT_KEY: "",
    PASSWORD_NEW: "",
    PASSWORD_NEW2: "",
    PASSWORD_OLD: "",

    //password
    forceChange: false,
    show1: false,
    show2: false,
    show3: false,
    rules: {
      required: value => !!value || 'Required.',
      min: v =>  (String(v).length >= 8) || 'Min 8 characters',
      max: v =>  (String(v).length <= 16) || 'Max 16 characters',
      noneSpace : v => (v || '').indexOf(' ') < 0 ||'공백을 허용하지 않습니다.',
      pw : v => /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[:!"#$%&'()*+,\-./:;<=>?@[\]\\^_`{|}~]).{8,16}$/.test(v) || '',
      nowPw : v => /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[:!"#$%&'()*+,\-./:;<=>?@[\]\\^_`{|}~]).{5,16}$/.test(v) || '',

    },

    // 인재개발팀
    SYS_HUMAN_INFO: [
      {
        title : '이의제기',
        icon: 'pl-icon20 ai-script-white',
        cnt: 5
      },
      {
        title : '업무평가',
        cnt: 2
      },
    ],

    // 운영지원팀
    SYS_ORG_INFO: [
      {
        title : '차단요청',
        icon: 'pl-icon20 ai-script-white',
        cnt: 8
      },
      {
        title : '철회요청',
        cnt: 2
      },
      {
        title : '민원접수',
        cnt: 3
      },
    ],
    //북마크
    BOOKMARK: {
      LINK: [
        { title: '오늘의 일정', url:'',  },
        { title: '데일리', url:'',  },
        { title: '블랙컨슈머 응대 스크립트', url:'',  },
        { title: '공공주택업무 매뉴얼',  url:'', },
        { title: 'LH 청약플러스',  url:'https://apply.lh.or.kr/lhapply/main.do', },
        { title: 'LH 홈페이지',  url:'https://www.lh.or.kr/index.es?sid=a1', },
        { title: '마이홈 포털',  url:'', },
      ],
      FAVORITE: [
        { title: '국토교통부 홈페이지',  url:'https://www.molit.go.kr/', },
        { title: '대한민국 법령정보 포털',  url:'https://www.law.go.kr/', },
        { title: '네이버 맵',  url:'https://map.naver.com/p/', },
      ]
    },
    editingIndex: null,
    editingIndex2: null,
    DropBmk: false,
    addBmkLinkWrap: false,
    addBmkFavWrap: false,
    newBmkLinkTxt: '',
    newBmkLinkUrl: '',
    newBmkFavTxt: '',
    newBmkFavUrl: '',

    // dialog
    dialogOutCall: false, //전화걸기
    dialogInCall: false, //전화받기
    dialogProfile: false, //사용자 정보
    dialogPassword: false, //비밀번호 변경

    CALL_TYPE : '', //in, out 구분
    ORG_HOPE : '', //첫 연결 hope
    CALL_ID : '', //콜 ID

    //전화걸기 DATA
    CALL_OUT_FLAG : false, //전화걸기 상태
    OUT_CALL_DATA: {},

    //전화받기 인입 DATA
    IN_CALL_DATA: {},

    CTI_STAT: false,

    CTI_MENU: [
      { text: "전화끊기", icon: 'pl-icon-cti-stat-ban', disabled: true, evt: 'ClearCall', active: false, idx: 1},
      { text: "보류", icon: 'pl-icon-cti-stat-hold', disabled: true, evt: 'HoldCall', active: false, idx: 2},
      { text: "대기", icon: 'pl-icon-cti-stat-wait', disabled: true, evt: 'Ready', active: false, idx: 3},
    ],

    MOVE_LIST: [
      { text: "식사", icon: 'pl-icon-cti-stat-launch', disabled: true, evt: 'lanuch', active: false, event: '', type: 'secondary is-first'},
      { text: "교육", icon: 'pl-icon-cti-stat-edu', disabled: true, evt: 'edu', active: false, event: '', type: 'secondary'},
      { text: "휴식", icon: 'pl-icon-cti-stat-rest', disabled: true, evt: 'rest', active: false, event: '', type: 'secondary'},
      { text: "지원", icon: 'pl-icon-cti-stat-support', disabled: true, evt: 'support', active: false, event: '', type: 'secondary'},
      { text: "기타", icon: 'pl-icon-cti-stat-etc', disabled: true, evt: 'etc', active: false, event: '', type: 'secondary'},
    ],

    CALLSTAT:{
      stat1: { type: '오프라인', time: '00:00:00', icon: 'stat-off'},
      stat2: { type: 'CTI 연결', time: '00:00:00', icon: 'stat-on'},
      stat3: { type: 'IN후처리', time: '00:00:00', icon: 'stat-after'},
      stat4: { type: 'OUT후처리', time: '00:00:00', icon: 'stat-after'},
      stat5: { type: '대기', time: '00:00:00', icon: 'stat-wait'},
      stat6: { type: '통화중', time: '00:00:00', icon: 'stat-call'},
    },

    SELECTED_CALLSTAT: 'stat1', //선택된 상태

    CUSL_STAT_TIME: '00:00:00', //상태별 타이머
    CTI_CALL_TIMER: '00:00:00', //상태별 타이머

    TRANS_EXT_NO : '', //호전환 대상 내선 번호
    TRANS_AGENT_INFO : {}, //호전환 대상 정보

    callid : '', //CTI callid(STT에 전달하는 callid와는 다른것임)
    callidEvtCnt : 0,

    MOVE_STAT_TXT : '', //이석 상태

    dropCuttTaskMove : false, //바로처리 업무 구분 드롭다운

    //ARS 그룹 코드
    ARS_GROUP_CD_LIST : [],
  }),
  async mounted() {
    this.COMPANY_INFO = this.$store.getters["userStore/GE_USER_ROLE"].company_list;
  },

  beforeDestroy(){
    this.$eventBus.$off("pwdChange"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("initSettingEnv"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("topOutCall"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("setCtiBtnEvt"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("setAgentStat"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("ESTABLISHED"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("CUST_TEMP_BLOCK"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("STT_TALK_DATABASE_SET"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("callCuttAftSendVeloce"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("prizeArs"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("cuslMoveScreen"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("getSwatToken"); //eventBus 중복방지를 위해 off
  },

  async created() {

    //소속 센터가 있고 소프트폰 사용중이며 내선이 있는 경우만 ipron 연결
    if(this.computedUserCenter !== '-1' && this.SOFT_PHN_USE_YN === 'Y' && this.$store.getters['userStore/GE_USER_ROLE'].EXT_NO){
      //ipron OpenServer
      if(!ipron.IsConnected()){
        this.mixin_ipronOpenServer();
      }
    }

    // 부모 창에서 호출하는 메소드.
    window.receiveDataFromPopup = (data) => {
      console.log( "부모창에서받는정보. window.receiveDataFromPopup::",data );
      if( data.BIZ_TYPE === 'BBS') {
        this.mixin_reloadCuttStat(data.MESSAGE.REFRESH_TARGET);  // 미니전광판(긴급+공지+팀공지+코칭) 리로드
      }
    };

    let currentDate = await this.mixin_getSvrDate("YYYYMMDDHH24MISS");
    //공통코드설정
    let codeName = ['CTI_TP', 'CTI_SEAT_MOVE_TP', 'T206']; //CTI 메뉴, CTI 이석 종류, CTI 상담원 그룹 코드
    this.list_common_code = await this.mixin_common_code_get_all_global(codeName);

    //ARS 그룹 코드
    this.ARS_GROUP_CD_LIST = this.mixin_common_code_get_global(this.list_common_code, 'T206', this.computedUserCenter, '');

    //사용자 정보
    this.USER_PROFILE = this.$store.getters["userStore/GE_USER_ROLE"];

    //사용자 비밀번호 변경
    this.$eventBus.$on("pwdChange", () => {
      this.forceChange = true;
      this['dialogPassword'] = true;
    });

    //다른 컴포넌트에서 전화 걸기
    this.$eventBus.$on("topOutCall", (OUT_CALL_DATA) => {
      this.OUT_CALL_DATA = OUT_CALL_DATA;
      this.outCall();
    });

    //상담저장 후 CTI 상태 변경 이벤트
    this.$eventBus.$on("setCtiBtnEvt", (SAVE_AFTER_ACTION) => {
      // console.log('TOP setCtiBtnEvt : ', SAVE_AFTER_ACTION);
      // this.btnClassRemove();
      const menuList = ['CTI_MENU','MOVE_LIST'];
      for (let i = 0; i < menuList.length; i++) {
        const _menu = menuList[i];
        for (let j = 0; j < this[_menu].length; j++) {
          if(!this[_menu][j].disabled){
            if(this[_menu][j].evt === SAVE_AFTER_ACTION.evt){
              this.ctiBtnEvt(this[_menu][j]);
            }
          }
        }
      }
    });

    //상단 우측 상태 정보
    if(this.computedUserDetailType === 'SYS_HUMAN'){ //인재개발관리자
      this.mixin_reloadCuttStat('SYS_HUMAN_REQ_STAT');
    }

    if(this.computedUserDetailType === 'SYS_MANAGER'){ //센터운영관리자
      this.mixin_reloadCuttStat('SYS_MANAGER_REQ_STAT');
    }

    //고객사별 환결설정 셋팅
    this.$eventBus.$on("initSettingEnv", (e) => {
      if(e === undefined || this.mixin_isEmpty(e)) this.initSettingEnv();
      else{
        let result = JSON.parse(e);
        if('SRVC_INFO' in result) { //고객사별 서비스 정보
          let arrSrvc = [];
          result.SRVC_INFO.split('_##_').forEach((srvc, idx) => {
            let srvcNm = srvc.split(',')[0];
            let srvcStat = srvc.split(',')[1];
            arrSrvc[srvcNm] = srvcStat;
          });
          this.$store.commit("userStore/MU_CUSTCO_SRVC_INFO", {...arrSrvc});
        }else if('CUTT_TASK_LIST' in result){ //바로처리 상담사 업무 구분
          if(result.CUTT_TASK_LIST){
            let useCuttTask = {};
            result.CUTT_TASK_LIST.forEach((task, idx) => {
              useCuttTask[task.value] = 'Y';
              if(task.DEFAULT_YN === 'Y') this.$store.commit("userStore/MU_DEFAULT_CUTT_TASK", task.value);
            });

            this.$store.commit("userStore/MU_USER_CUTT_TASK", useCuttTask);
          }
        }
      }
    });

    //상담사 이석 선택시 스크린 변경
    this.$eventBus.$on("cuslMoveScreen", (sSubState) => {
      if(sSubState === 1 || sSubState === 2 || sSubState === 3){ //교육,식사,휴식
        this.isTestLeave = true;
      }
    });

    //SWAT 토큰 발행
    this.$eventBus.$on("getSwatToken", (e) => {
      try{this.getSwatToken();}catch(e){};
    });

    //콜봇 안내
    this.$eventBus.$on("linkCallBot", (menuId) => {
      const ctiNum = Number(this.CTI_CALL_STAT.replace(/[^0-9]/g, ''));
      if(ctiNum === 6){
        this.showConfirmInfo({
          msg:'콜봇 안내를 전송 하시겠습니까?'
          , callYes: () => {
            ipronCallUtil.linkCallBot(menuId);
            this.closeAlert();
          }
          , callNo: this.closeAlert
        });
      }else{
        this.showAlertInfo({msg : '음성봇 안내 전송은 고객과 통화중 상태만 가능 합니다.'});
        return;
      }
    });

    //당첨 ARS
    this.$eventBus.$on("prizeArs", () => {
      this.showConfirmInfo({
        msg:'당첨 ARS를 전송 하시겠습니까?'
        , callYes: () => {
          ipronCallUtil.custPrizeArs();
          this.closeAlert();
        }
        , callNo: this.closeAlert
      });
    });

    //상담저장 후 고객 정보 녹취 서버로 전송 처리
    this.$eventBus.$on("callCuttAftSendVeloce", (data) => {
      try{this.callCuttAftSendVeloce(data);}catch(e){}
    });
    
    //공가해소 계약 희망 관련 상담저장 후 처리
    this.$eventBus.$on("hopeContractCuttProc", (data) => {
      try{this.hopeContractCuttProc(data);}catch(e){}
    });

    await this.initSettingEnv(); //고객별 환경설정 세팅용도

    this.setStatTime('stat1'); //CTI OFF 타이머 시작

    //센터별 CTI 메뉴 및 이석 종류 가져오기
    this.getCtiMenuSeatMoveTp();

    /****************************************************************************************************************************************************
     * CTI EventBus created START
     ***************************************************************************************************************************************************/
    //IPRON 에러 메시지
    this.$eventBus.$on("ipronErrMsg", (errData) => {
      console.log('errData : ', errData);
      if(errData.evt === 'ipron.APIEvent.ERR_OPENSERVER'
        || errData.evt === 'ipron.APIEvent.ACTIVE_TIMEOUT'
        || errData.evt === 'ipron.APIEvent.ERR_DISCONNECT'
      ){
        this.showAlertInfo({msg: 'CTI 서버에 연결할 수 없습니다.<br>관리자에게 문의해 주세요.'});
        this.setStatTime('stat1');
        setTimeout(() => {this.CTI_STAT = false;}, 100);
      }else{
        if(errData.evt === 'ipron.APIMethod.SINGLESTEP_CONFERENCE_RES'){
          this.showAlertInfo({msg : 'ARS 멘트 송출 중입니다.<br>해당 멘트 종료 후 다시 시도해 주세요.'});
          this.$eventBus.$emit('lastArsDataDel');
          return;
        }else{
          this.showAlertInfo({msg: errData.msg});
          return;
        }
      }
    });

    //CTI response
    this.$eventBus.$on("ctiResponse", (data) => {
      console.log('ctiResponse : ', data);
      if(data.result === 2403){
        this.showAlertInfo({msg: ipronCallUtil.MakeResult(data.result) + '<br>소프트폰 로그인 후 이용해 주시기 바랍니다.'});
        ipronCallUtil.closeServer();
        this.setStatTime('stat1');
        setTimeout(() => {this.CTI_STAT = false;}, 100);
        return;
      }else{
        if(data.result !== 'true' && data.result !== 2402 && data.result !== 1005){ //유효하지 않은 상태 제외
          console.log('ctiResponseCODE : ', data.result, ', ctiResponseTXT : ' , ipronCallUtil.MakeResult(data.result));
          // if(data.result === 2105){ //사용자 찾을 수 없음
          //   ipronCallUtil.closeServer();
          //   this.setStatTime('stat1');
          //   setTimeout(() => {this.CTI_STAT = false;}, 100);
          //   return;
          // }
          if(data.result === 2101 || data.result === 2001 || data.result === 2402){ //Device 찾을 수 없음, 사용중인 Device,
            ipronCallUtil.closeServer();
            this.setStatTime('stat1');
            setTimeout(() => {this.CTI_STAT = false;}, 100);
            return;
          }

          if((data.destdn === '8987' && data.method === 1084) || data.destdn === '8911' || data.destdn === '8910'){ //배려고객 임시차단(8987), 당첨 ARS(8911), 콜봇(8910)
            if(this.CALL_TYPE === 2){
              ipronCallUtil.SetAgentState(60, 1);
              this.setStatTime('stat3'); //IN후처리
            }else {
              ipronCallUtil.SetAgentState(60, 2);
              this.setStatTime('stat4'); //OUT후처리
            }
            ipronCallUtil.clearData();
          }else if(data.destdn !== undefined && !this.mixin_isEmpty(data.destdn) && data.destdn !== this.$store.getters["userStore/GE_USER_ROLE"].EXT_NO){
            //ARS 그룹 전환인 경우
            this.ARS_GROUP_CD_LIST.forEach((item, idx) => {
              console.log('item.value : ', item.cd_vl1, '>>>>>>>>>>data.destdn : ', data.destdn);
              if(item.cd_vl1 === data.destdn){
                if(this.CALL_TYPE === 2){
                  ipronCallUtil.SetAgentState(60, 1);
                  this.setStatTime('stat3'); //IN후처리
                }else {
                  ipronCallUtil.SetAgentState(60, 2);
                  this.setStatTime('stat4'); //OUT후처리
                }
                ipronCallUtil.clearData();
                return;
              }
            });
          }

        }
      }

      if(data.method === 'openserver'){ //OpenServer(3101)
        console.log('OpenServer Success.');
        if(data.result === 'true'){
          //개인전광판 CTI OpenServer 된 상태에서 3초마다 호출
          // if(this.computedUserCenter !== '-1' && this.$store.getters['userStore/GE_USER_ROLE'].EXT_NO){
          //   setInterval(() => {
          //     ipronCallUtil.getAgentReport();
          //   }, 3000);
          // }
          ipron.SetDiServerInfo([process.env.VUE_APP_IPRON_IP_ADDR1,process.env.VUE_APP_IPRON_IP_ADDR2], 9020, 1000);
          ipronCallUtil.getAgentReport(); //개인전광판

          ipronCallUtil.getAgentInfo();
        }
      }else if(data.method === 2026){ //Registered
        console.log('Registered.');
      }else if(data.method === 'agentlogout'){ //로그아웃
        console.log('LogOut.');
        ipronCallUtil.unRegisterDn();
      }else if(data.method === 1045){ //상담사 상태
        //새로고침인 경우 새로고침 이전 상태로 되돌리기
        console.log('상담원 새로고침 이전 상태 : ', data.voipagentstate, data.voipagentstatesub);
        if(data.voipagentstate > 20){
          console.log('ipron.IsConnected() : ', ipron.IsConnected());
          if(ipron.IsConnected()){
            ipronCallUtil.getAgentReport(); //개인전광판
            this.CTI_STAT = true;
            ipronCallUtil.CUSL_LOGIN_STAT = data.voipagentstate;
            ipronCallUtil.CUSL_LOGIN_SUB_STAT = data.voipagentstatesub === -1 ? '' : data.voipagentstatesub;
            ipronCallUtil.registerDn();
            ipronCallUtil.SetAgentState(data.voipagentstate, data.voipagentstatesub === -1 ? '' : data.voipagentstatesub);
          }
        }
      }else if(data.method === 1418){ //개인전광판
        this.$eventBus.$emit('setCuslCallTimeInfo', data);
      }else if(data.method === 1379){ //왼쪽 하단 대기,응대,포기
        console.log('=================================>', data);
      }else if(data.destdn === '8987' && data.method === 1023){ //배려고객 ARS
        console.log('Black Cust ARS');
      }else if(data.method === 'deflectcall'){
        this.$eventBus.$emit('closeCallId', {CALL_ID : this.CALL_ID});
      }
    });

    //전화벨 울림 이벤트
    this.$eventBus.$on("RINGING", (data) => {
      console.log('RINGING : ', data);
      this.CALL_ID = ''; //콜 ID 초기화
      this.ORG_HOPE = '';
      ipronCallUtil.CALL_ID = ''; //콜 ID 초기화
      this.$store.dispatch('statusStore/AC_TALK_DATA', []); //실시간 대화록 초기화
      this.$store.dispatch('statusStore/AC_TALK_DATA_SEARCH_KMS', []); //KMS데이터 초기화
      this.$store.dispatch('statusStore/AC_TALK_DATA_SEARCH_KEYWORD', []); //키워드 초기화
      this.$store.dispatch('statusStore/AC_TALK_DATA_SEARCH_CLCN', []); //공고문 초기화
      this.$store.dispatch('statusStore/AC_TALK_DATA_SEARCH_R1_SUMMARIZE', ""); //R1 요약본초기화
      this.$store.dispatch('statusStore/AC_TALK_DATA_SEARCH_R1_PHONE', ""); //R1 요약본초기화
      this.$store.dispatch('statusStore/AC_TALK_DATA_SEARCH_R1_NAME', ""); //R1 요약본초기화
      this.$store.dispatch('statusStore/AC_TALK_DATA_SEARCH_T1_SUMMARIZE', ""); //T1 요약본초기화
      this.$store.dispatch('statusStore/AC_TALK_DATA_SEARCH_CUTT', ""); //추천유형 초기화
      this.$eventBus.$emit('allReSet'); //전체 초기화
      this.mixin_set_active_tab({PATH_NM:'/CSL_M0100', NODE_TITLE:'전화상담'});

      this.IN_CALL_DATA = JSON.parse(data.extensiondata);
      this.IN_CALL_DATA.datetime = data.datetime;
      this.IN_CALL_DATA.thisdn = data.data.thisdn;
      this.IN_CALL_DATA.otherdn = data.data.otherdn;
      if(this.TRANS_AGENT_INFO) this.IN_CALL_DATA.TRANS_AGENT_INFO = this.TRANS_AGENT_INFO;

      //자동받기 옵션 처리
      if(this.AUTO_DRWI_YN === 'Y'){
        // ipron.AnswerCall(store.getters["userStore/GE_USER_ROLE"].EXT_NO
        //                     , this.ConnId
        //                     , this.ExHandle
        //                     , 0 /*GetSrcMediaType()*/);
        this.mixin_showDialog('InCall'); //전화받기 모달 열기 //위 내용으로 대체 예정
      }else{
        this.mixin_showDialog('InCall'); //전화받기 모달 열기
      }
    });

    //Dialing
    this.$eventBus.$on("DIALING", (data) => {
      console.log('DIALING : ', data);
      this.CALL_TYPE = 3;
    });

    //CTI 중복 로그인 체크
    this.$eventBus.$on("BANISHMENT", (data) => {
      console.log('BANISHMENT : ', data);
    });

    //호 연결
    this.$eventBus.$on("ESTABLISHED", (data) => {
      console.log('ESTABLISHED : ', data, '===this.CALL_ID : ', this.CALL_ID);

      ipronCallUtil.ExHandle = data.extensionhandle;
      
      if(data.calltype === 2 || data.calltype === 3) this.CALL_TYPE = data.calltype; //(0 : Known, 1 : Internal, 2 : Inbound, 3 : Outbound)

      if(!this.CALL_ID){
        this.ORG_HOPE = this.ORG_HOPE?this.ORG_HOPE : data.hop;
        this.CALL_ID = (data.datetime?data.datetime.length>8?data.datetime.substring(0,8):'':'')+'_'+data.ucid+'_'+this.ORG_HOPE+'_'+this.$store.getters["userStore/GE_USER_ROLE"].EXT_NO;
        data.CALL_ID = this.CALL_ID;
        ipronCallUtil.CALL_ID = this.CALL_ID;
        data.CALL_TYPE = this.CALL_TYPE;

        this.$store.commit("statusStore/MU_CALL_ST_DT", data.datetime); //호 연결 시작 시간
        this.$store.commit("statusStore/MU_CALL_END_DT", ''); //호 연결 종료 시간

        //전화상담탭이 있는지 확인
        let m0100 = false;
        if(this.$store.getters['commonStore/GE_COMMON_ACTIVE_TAB'].id === 'CSL_M0100') m0100 = true;

        if(this.CALL_TYPE === 2){
          this.mixin_hideDialog('InCall');

          setTimeout(() => {
            data.ani = data.extensiondata.UEI01[0];
            this.$eventBus.$emit('setCallData', data);
          }, !m0100?1000:10);

          if('extensiondata' in data){
            if('UEI01' in data.extensiondata){
              //실시간 대화록 버튼 노출 처리
              this.$eventBus.$emit('setRealTimeSpeakTxt', data);

              //전화접수 테이블 저장 처리
              this.callRcvTelReg(data);
            }
          }
        }

        if(this.CALL_TYPE === 3){
          //실시간 대화록 버튼 노출 처리
          this.$eventBus.$emit('setRealTimeSpeakTxt', data);

          //전화접수 테이블 저장 처리
          // this.callRcvTelReg(data); //아웃바운드는 전화접수 저장 안함
          this.mixin_hideDialog('OutCall');

          data.CALL_ID = this.CALL_ID;

          this.recordReg(data); //아웃바운드는 녹취 저장
          console.log('----------------------------------------');
          console.log(data);
          console.log('----------------------------------------');
          this.$eventBus.$emit('setCallId', data);
        }

        this.setStatTime('stat6'); //통화중
      }

    });

    //호 종료
    this.$eventBus.$on("RELEASED", (data) => {
      let svrTime = this.mixin_getSvrDate('YYYYMMDDHH24MISS');
      this.$store.commit("statusStore/MU_CALL_END_DT", svrTime); //호 연결 종료 시간

      console.log('RELEASED (this.CALL_TYPE -> '+this.CALL_TYPE+') : ', data);
      if(this.dialogInCall) this.mixin_hideDialog('InCall');
      if(this.dialogOutCall) this.mixin_hideDialog('OutCall');

      if(this.CALL_TYPE === 2){
        if(this.CUTT_ING || this.computedUserCenter === '4') ipronCallUtil.SetAgentState(60, 1); //IN후처리
        else ipronCallUtil.SetAgentState(40, ''); //대기
      }

      if(this.CALL_TYPE === 3){
        if(this.CUTT_ING || this.computedUserCenter === '4') ipronCallUtil.SetAgentState(60, 2); //OUT후처리
        else{
          if(data.calltype === 0){
            ipronCallUtil.SetAgentState(60, 2); //OUT후처리
            this.$store.commit("statusStore/MU_CUTT_ING", true);
          }else{
            ipronCallUtil.SetAgentState(40, ''); //대기
          }
        }
      }

      // if('extensiondata' in data){
      //   if('UEI01' in data.extensiondata){
          // this.ORG_HOPE = '';
          data.CALL_ID = this.CALL_ID;
          this.$eventBus.$emit('closeCallId', data);
          // this.CALL_ID = '';
      //   }
      // }

      this.CALL_ID = '';
      this.ORG_HOPE = '';
    });

    //보류
    this.$eventBus.$on("HELD", (data) => {
      console.log('HELD : ', data);
    });

    //호전환
    this.$eventBus.$on("PARTYCHANGED", (data) => {
      console.log('PARTYCHANGED : ', data);
      this.CALL_TYPE = 2; //인바운드

      setTimeout(() => {

        this.CALL_ID = '';
        this.ORG_HOPE = '';
        this.$eventBus.$emit('ESTABLISHED', data);

        //전화상담탭이 있는지 확인
        let m0100 = false;
        if(this.$store.getters['commonStore/GE_COMMON_ACTIVE_TAB'].id === 'CSL_M0100') m0100 = true;

        setTimeout(() => {
          console.log('ESTABLISHED2 : ', data);
          data.ani = data.extensiondata.UEI01[0];
          this.$eventBus.$emit('setCallData', data);
        }, !m0100?1000:10);

      }, 1000);
    });

    //대기
    this.$eventBus.$on("AGENTREADY", (data) => {
      console.log('AGENTREADY : ', data);
      this.setStatTime('stat5');
    });

    //Not Ready
    this.$eventBus.$on("AGENTNOTREADY", (data) => {
      console.log('AGENTNOTREADY : ', data);
      if(data.agentstate === 30){
        let statNm = '';
        if(data.agentstatesub === 0){
          if(!this.CALL_TYPE) ipronCallUtil.SetAgentState(40, '');
        }else if(data.agentstatesub === 1){ //교육
          statNm = 'stat8';
        }else if(data.agentstatesub === 2){ //식사
          statNm = 'stat7';
        }else if(data.agentstatesub === 3){ //휴식
          statNm = 'stat9';
        }else if(data.agentstatesub === 4){ //지원
          statNm = 'stat10';
        }else if(data.agentstatesub === 5){ //기타
          statNm = 'stat11';
        }else if(data.agentstatesub === 6){ //확인
          statNm = 'stat12';
        }

        if(statNm) this.setStatTime(statNm);
      }else if(data.agentstate === 60){ //후처리
        if(data.agentstatesub == 1) this.setStatTime('stat3'); //IN후처리
        else if(data.agentstatesub == 2) this.setStatTime('stat4'); //OUT후처리
      }
    });

    //AGENTBUSY(고객콜 Hold 상태에서 협의통화 수행 중 협의 통화를 종료하거나 고객이 종료하는 경우에도 해당 Event 발생)
    this.$eventBus.$on("AGENTBUSY", (data) => {
      console.log('AGENTBUSY : ', data);
      console.log('ipron.IsConnected() : ', ipron.IsConnected());

      let tempConnId = Object.keys(data.extensiondata);
      let arrCallInfo = Object.values(data.extensiondata);

      console.log('tempCallId : ', tempConnId[0], ', arrCallInfo = ', arrCallInfo[0][2]);
      ipronCallUtil.ConnId = tempConnId[0];
      ipronCallUtil.CallId = arrCallInfo[0][2];
      ipronCallUtil.ExHandle = data.extensionhandle;

      ipronCallUtil.getCallInfoEx(ipronCallUtil.CallId);
      ipronCallUtil.getUserdata(ipronCallUtil.ConnId, ipronCallUtil.ExHandle);
    });

    //통화중 Web 비정상 종료시 재로그인 한 경우 이전 전화 정보 조회
    this.$eventBus.$on("GET_CALLINFO_EX_RES", (data) => {
      console.log('GET_CALLINFO_EX_RES : ', data);
      ipronCallUtil.UCID = data.ucid;
      // ipronCallUtil.Hop = data.hop;
      ipronCallUtil.Hop = this.ORG_HOPE?this.ORG_HOPE:data.hop;

      this.mixin_set_active_tab({PATH_NM:'/CSL_M0100', NODE_TITLE:'전화상담'});
      this.CTI_STAT = true;
      this.$store.commit("statusStore/MU_CUTT_ING", true); //상담 중 처리
      this.setStatTime('stat6');
    });

    //connection별 사용자 데이터 가져오기
    this.$eventBus.$on("GET_USERDATA_RES", (data) => {
      console.log('GET_USERDATA_RES : ', data);

      data.datetime = currentDate;
      data.ucid = ipronCallUtil.UCID;
      data.hop = ipronCallUtil.Hop;
      setTimeout(() => {
        if('extensiondata' in data) this.CALL_TYPE = 2; //인바운드
        else this.CALL_TYPE = 3; //아웃바운드

        this.$eventBus.$emit('ESTABLISHED', data);
      }, 1000);
    });

    //상담사 상태 강제 변경
    this.$eventBus.$on("AGENTACW", (data) => {
      console.log('AGENTACW : ', data);
      if(data.agentstate === 60){ //후처리
        if(data.agentstatesub == 1) this.setStatTime('stat3'); //IN후처리
        else if(data.agentstatesub == 2) this.setStatTime('stat4'); //OUT후처리
      }
    });

    //임시차단
    this.$eventBus.$on("CUST_TEMP_BLOCK", (data) => {
      console.log('CUST_TEMP_BLOCK : ');
      ipronCallUtil.custTempBlockCall();
      this.$eventBus.$emit('reSetCautionCustInfo'); //배려고객
      this.$eventBus.$emit('CloseBalckArs'); //배려고객 ARS 모달 닫기
    });

    //배려고객 경고 멘트 ARS
    this.$eventBus.$on("CUST_CAUTION_ARS", (item) => {
      console.log('CUST_CAUTION_ARS : ', item);
      ipronCallUtil.custCautionARS(item.value, item.ORD);
    });
    /****************************************************************************************************************************************************
    * CTI EventBus created END
    ****************************************************************************************************************************************************/
    //STT 데이터 레디스에 세팅
    this.$eventBus.$on("STT_TALK_DATABASE_SET", (callId, item) => {
      console.log('STT_TALK_DATABASE_SET : ',  callId);
      this.common_postCall("/api/biz/common/update/updateRecordSttData", { CALL_ID : callId, STT_DATA : JSON.stringify( item )}, {head : {ns : 'lhcs.phone.cutt.dao.PhoneCuttMapper'}});
    });

    this.$store.dispatch("userStore/AC_USER_AUTHRT_DLGT_LIST", {});

    // 북마크
    this.getFavorites();

    // 본인에맞는 CTIQ를 활용하여 대기,인입,포기호 를 조회한다.
    if(this.computedUserCenter !== '-1' && !this.mixin_isEmpty( this.computedUserCTIQ ) ){
      this.getICCTIQReport();
      setInterval(() => {
        this.getICCTIQReport();
      }, 10000);
    }

  },
  // created END
  methods: {
    // 본인에맞는 CTIQ를 활용하여 대기,인입,포기호 를 조회한다.
    getICCTIQReport() {
      // this.common_postCall_callback(
      //     '/api/itf/ipron/swat/ic_ctiq'
      //     , {IC_CTIQ: this.computedUserCTIQ}
      //     , {}
      //     , function(response) {
      //       if (!response.HEADER.ERROR_FLAG) {
      //         if(response.DATA.length > 0){
      //           //상담 정보 영역에 접수 id 전달
      //           this.$eventBus.$emit("setICCTIQ", response.DATA[0]);
      //         }
      //       }
      //     }
      // );
      // ipronCallUtil.getQueueTrafficEx();
    },

    // 센터선택(주택지원센터장권한인경우만.)
    async selectCompanyList(item) {
      if(this.computedUserCenter != item.CD){
        item.isSelectCompany = 'Y';
        this.showAlert({
          alertDialogToggle: true
          , msg: '선택한 ['+ item.CD_NM +']로 변경 하시겠습니까?'
          , iconClass: 'is-info'
          , type: 'confirm'
          , callYes: () => {
            this.$router.push("/home");
            this.mixin_set_active_tab({PATH_NM:'/home', NODE_TITLE:'홈'});
            this.$store
                .dispatch("userStore/AC_USER_COMPANY", item)
                .then(async (response) => {
                  this.$store.commit("alertStore/hideAlert");
                });
            if(item.CD === '-1'){
              this.$store.commit("userStore/MU_USER_TYPE", 'ETC_ADMIN');
              this.$store.commit("userStore/MU_USER_DETAIL_TYPE", this.$store.getters['authStore/GE_AUTH_LOGIN_DATA'].GROUP_CD_LIST);
              this.$store.commit("authStore/MU_AUTH_LOGIN_IC_CTIQ", '');
            }else{
              this.$store.commit("userStore/MU_USER_TYPE", 'LEADER');
              this.$store.commit("userStore/MU_USER_DETAIL_TYPE", 'CENTER_LEADER');
              this.$store.commit("authStore/MU_AUTH_LOGIN_IC_CTIQ", item.IC_CTIQ);
            }

            //mixin에 있는 default_tab 기준으로 탭을 초기화 한다
            this.$store.dispatch("commonStore/AC_COMMON_DELETE_ALL_TAB", "");
            this.$store.dispatch('commonStore/AC_COMMON_LEADER_HOME_TAB', 0);

            // this.$store
            //   .dispatch("userStore/AC_USER_MENU", {
            //     user_id: this.$store.getters['userStore/GE_USER_ROLE'].userId
            //     , AUTHRT_GROUP_ID : item.CD !== '-1' ? 3 : null /*센터장*/
            //   })
            //   .then((response) => {
            //     window.location.reload(true);
            //   });
            window.location.reload(true);
          } //고객사 선색시 모든 tab 삭제
          , callNo: () => {
            this.$store.commit("alertStore/hideAlert");
          }
        });
      }else {
        this.$store.commit("alertStore/hideAlert");
      }
    },

    //사용자 정보 모달 닫기
    closeProfile() {
      this.mixin_hideDialog('Profile');
    },

    // test: 식사
    // testLeaveEvt(){
    //   this.isTestLeave = true
    // },
    closeLeaveEvt(){
      this.isTestLeave = false
    },

    //전화걸기
    outCall(){
      const ctiNum = Number(this.CTI_CALL_STAT.replace(/[^0-9]/g, ''));
      //마이홈등 공통일 때
      if(this.computedUserCenter != '4' && ctiNum > 5 ){
        this.mixin_set_active_tab({PATH_NM:'/CSL_M0100', NODE_TITLE:'전화상담'});
        this.$eventBus.$emit('OutCallInit');
        this.mixin_showDialog('OutCall');
      }else if(this.computedUserCenter == '4' && (ctiNum == 3 || ctiNum == 4 || ctiNum > 5) ){
        //바로처리일때, IN후처리, OUT후처리 허용.
        this.mixin_set_active_tab({PATH_NM:'/CSL_M0100', NODE_TITLE:'전화상담'});
        this.$eventBus.$emit('OutCallInit');
        this.mixin_showDialog('OutCall');
      }else{
        this.showAlertInfo({msg : '전화를 걸 수 없는 상태 입니다.'});
        return;
      }
    },

    //전화받기
    inCall(){
      this.dialogInCall = false;
      this.mixin_hideDialog('dialogInCall'); //전화받기 모달 닫기
      ipronCallUtil.answerCall();
      this.setStatTime('stat6');
    },

    //아웃바운드 전화걸기 버튼 상태
    setCallingFlag(data){
      this.CALL_ID = '';
      this.ORG_HOPE = '';
      this.CALL_OUT_FLAG = data;
    },

    //아웃바운드 전화끊기
    obClearCall(){
      if(this.CALL_OUT_FLAG){
        this.$eventBus.$emit('OutCallInit');
        this.ctiBtnEvt({evt:'ClearCall'});
        this.mixin_hideDialog('OutCall');
        this.CALL_OUT_FLAG = false;
      }else{
        this.mixin_hideDialog('OutCall');
      }
      this.CALL_ID = '';
      this.ORG_HOPE = '';
    },

    //센터별 CTI 메뉴 및 이석 유형 가져오기
    async getCtiMenuSeatMoveTp() {
      let CTI_TP = await this.mixin_common_code_get_global(this.list_common_code, 'CTI_TP', this.computedUserCenter, '');
      let CTI_SEAT_MOVE_TP = await this.mixin_common_code_get_global(this.list_common_code, 'CTI_SEAT_MOVE_TP', this.computedUserCenter, '');

      this.CTI_MENU = [];
      this.MOVE_LIST = [];

      //기본 상태
      this.CALLSTAT = {
        stat1: { type: '오프라인'},
        stat2: { type: 'CTI 연결'},
        stat3: { type: 'IN후처리'},
        stat4: { type: 'OUT후처리'},
        stat5: { type: '대기'},
        stat6: { type: '통화중'},
      }

      if(CTI_TP.length > 0){
        CTI_TP.forEach((reason, idx) => {
          reason.evt = reason.cd_vl2;
          reason.active = false;
          reason.disabled = true;
          reason.event = idx;
          reason.icon = reason.cd_vl1; //공통코드 값에 아이콘 class 값 입력

          this.CTI_MENU.push(reason);
        });
      }

      //이석 유형
      let iStatCnt = Object.keys(this.CALLSTAT).length;
      if(CTI_SEAT_MOVE_TP.length > 0){
        CTI_SEAT_MOVE_TP.forEach((reason, idx) => {
          reason.evt = reason.cd_vl2;
          reason.active = false;
          reason.disabled = true;
          reason.event = (this.CTI_MENU.length + idx);
          reason.icon = reason.cd_vl1; //공통코드 값에 아이콘 class 값 입력

          this.MOVE_LIST.push(reason);

          const obj = {type : reason.text, group : ''};
          this.CALLSTAT["stat"+(iStatCnt + (idx+1))] = obj;
        });
      }
    },

    //상단 CTI on off 이벤트
    ctiConnectEvent() {
      let prevCitStat = !this.CTI_STAT;
      let extNo = this.$store.getters["userStore/GE_USER_ROLE"].EXT_NO;

      if(!this.CUTT_ING){//상담중이 아닐때
        if(extNo){
          if(this.CTI_STAT){
            if (extNo != "" && extNo.length > 3) {
              // ipronCallUtil.openServer();
              ipronCallUtil.CUSL_LOGIN_STAT = 40;
              ipronCallUtil.CUSL_LOGIN_SUB_STAT = '';
              ipronCallUtil.registerDn();
            }
          }else if(!this.CTI_STAT){
            if (ipron.IsConnected()) {
              // ipronCallUtil.closeServer();
              ipronCallUtil.logoutAgent();
            }

            this.setStatTime('stat1'); //CTI OFF 타이머 시작
          }
        }else{
          this.$store.commit("statusStore/MU_CTI_CALL_STAT", 'stat1'); //CTI 상태
          this.showAlertInfo({msg: '내선번호가 존재하지 않습니다.<br>관리자에게 문의해 주세요.'});
        }
      }else {
        this.showAlertInfo({msg: '상담 진행중 입니다.<br>CTI연결 상태를 변경 할 수 없습니다.'});
        setTimeout(() => {this.CTI_STAT = prevCitStat;}, 100);
      }
    },

    // 상단 버튼 이벤트
    ctiBtnEvt(item){
      if(this.CUTT_ING){
        if(item.evt !== 'ClearCall' //전화끊기
          && item.evt !== 'HoldCall' //보류
          && item.evt !== 'RetrieveCall' //보류해제
        ){
          this.showAlertInfo({msg : '상담정보 저장 이후 상태 변경이 가능 합니다.'});
          return;
        }else{
          this.btnClassRemove();
          item.active = !item.active;
        }
      }else{
        this.btnClassRemove();
        item.active = !item.active;
      }

      ipronCallUtil.getAgentReport(); //개인전광판

      /**
       * 대기 상태 아님 Not Ready       : 30
       * 대기 Ready                    : 40
       * 후처리 AftWork                : 60
       */

      if(item.evt === 'ClearCall'){ //전화끊기
        ipronCallUtil.clearCall();
        this.CTI_MENU.forEach((btn, idx) => {
          if(btn.evt === 'RetrieveCall'){
            btn.icon = 'pl-icon-cti-stat-hold';
            btn.text = '보류';
            btn.evt = 'HoldCall';
          }
        });
      }else if(item.evt === 'HoldCall'){ //보류(상태 변경 없음)
        ipronCallUtil.holdCall();
        this.CTI_MENU.forEach((btn, idx) => {
          if(btn.evt === item.evt){
            btn.icon = 'pl-icon-cti-stat-play';
            btn.text = '보류해제';
            btn.evt = 'RetrieveCall';
          }
        });
      }else if(item.evt === 'RetrieveCall'){ //보류 해제(상태 변경 없음)
        ipronCallUtil.retrieveCall(ipronCallUtil.ConnId);
        this.CTI_MENU.forEach((btn, idx) => {
          if(btn.evt === item.evt){
            btn.active = false;
            btn.icon = 'pl-icon-cti-stat-hold';
            btn.text = '보류';
            btn.evt = 'HoldCall';
          }
        });
      }else if(item.evt === 'Ready'){ //대기
        ipronCallUtil.SetAgentState(40, '');
      }else if(item.evt === 'InAftCall'){ //IB후처리 (바로처리 센터에만 사용)
        ipronCallUtil.SetAgentState(60, 1);
      }else if(item.evt === 'OBAftCall'){ //OB후처리 (바로처리 센터에만 사용)
        ipronCallUtil.SetAgentState(60, 2);
      }else if(item.evt === 'lanuch'){ //식사
        ipronCallUtil.SetAgentState(30, 2);
      }else if(item.evt === 'edu'){ //교육
        ipronCallUtil.SetAgentState(30, 1);
      }else if(item.evt === 'rest'){ //휴식
        ipronCallUtil.SetAgentState(30, 3);
      }else if(item.evt === 'support'){ //지원
        ipronCallUtil.SetAgentState(30, 4);
      }else if(item.evt === 'etc'){ //기타
        ipronCallUtil.SetAgentState(30, 5);
      }else if(item.evt === 'confirm'){ //확인 (공가해소 센터에만 사용하나 사용하지 않는것으로 확인 추후 바로처리에서 다른 명칭으로 사용될 예정)
        ipronCallUtil.SetAgentState(30, 6);
      }
    },

    //상태별 시간 카운트
    async setStatTime(stat) {
      let setSeconds = 0;
      this.SELECTED_CALLSTAT = stat;
      this.$store.commit("statusStore/MU_CTI_CALL_STAT", stat); //CTI 상태

      //초기화
      for(let key in this.CALLSTAT){
        this.CALLSTAT[key].time = '00:00:00';
      }

      this.ctiCallTimerEnd();

      this.CTI_CALL_TIMER = setInterval(() => {
        this.CUSL_STAT_TIME = this.mixin_seconds_toHHMMSS(setSeconds++);
        if(stat === 'stat6'){ //통화중
          this.$store.dispatch('statusStore/AC_CUTT_TIME', this.CUSL_STAT_TIME);
        }else if(stat === 'stat3' || stat === 'stat4'){ //IN후처리, OUT후처리
          this.$store.dispatch('statusStore/AC_AFT_PROC_TIME', this.CUSL_STAT_TIME);
        }else{
          this.$store.dispatch('statusStore/AC_CUTT_TIME', '00:00:00');
          this.$store.dispatch('statusStore/AC_AFT_PROC_TIME', '00:00:00');
        }
      }, 1000);

      this.MOVE_STAT_TXT = this.CALLSTAT[this.SELECTED_CALLSTAT].type;
      console.log(this.SELECTED_CALLSTAT , ' : ', this.CALLSTAT[this.SELECTED_CALLSTAT].type)

      if(stat === 'stat1'){ //오프라인
        const menuList = ['CTI_MENU','MOVE_LIST'];
        for (let i = 0; i < menuList.length; i++) {
          const _menu = menuList[i];
          for (let j = 0; j < this[_menu].length; j++) {
            this[_menu][j].active = false;
            this[_menu][j].disabled = true;
          }
        }
      }else if(stat === 'stat2' || stat === 'stat5'){ //CTI 연결, 대기
        this.btnClassRemove();
        const menuList = ['CTI_MENU','MOVE_LIST'];
        for (let i = 0; i < menuList.length; i++) {
          const _menu = menuList[i];
          for (let j = 0; j < this[_menu].length; j++) {
            this[_menu][j].active = stat === 'stat5' && this[_menu][j].evt === 'Ready' ? true : false;
            this[_menu][j].disabled = this[_menu][j].evt === 'ClearCall' || this[_menu][j].evt === 'HoldCall' ? true : false;
          }
        }
      }else if(stat === 'stat3'){ //IN후처리
        this.btnClassRemove();
        const menuList = ['CTI_MENU','MOVE_LIST'];
        for (let i = 0; i < menuList.length; i++) {
          const _menu = menuList[i];
          for (let j = 0; j < this[_menu].length; j++) {
            this[_menu][j].active = this[_menu][j].evt === 'InAftCall' ? true : false;
            this[_menu][j].disabled = this[_menu][j].evt === 'ClearCall' || this[_menu][j].evt === 'HoldCall' ? true : false;
          }
        }

        //바로처리인 경우 IN후처리 상태에선 OB후처리 버튼 이벤트 클릭 못하도록 수정
        if(this.computedUserCenter === '4'){
          this.CTI_MENU.forEach((btn, idx) => {
            if(btn.evt === 'OBAftCall'){
              btn.active = false;
              btn.disabled = true;
            }
          });
        }
      }else if(stat === 'stat4'){ //OUT후처리
        this.btnClassRemove();
        const menuList = ['CTI_MENU','MOVE_LIST'];
        for (let i = 0; i < menuList.length; i++) {
          const _menu = menuList[i];
          for (let j = 0; j < this[_menu].length; j++) {
            this[_menu][j].active = this[_menu][j].evt === 'OBAftCall' ? true : false;
            this[_menu][j].disabled = this[_menu][j].evt === 'ClearCall' || this[_menu][j].evt === 'HoldCall' ? true : false;
          }
        }
      }else if(stat === 'stat6'){ //통화중
        const menuList = ['CTI_MENU','MOVE_LIST'];
        for (let i = 0; i < menuList.length; i++) {
          const _menu = menuList[i];
          for (let j = 0; j < this[_menu].length; j++) {
            this[_menu][j].active = false;
            this[_menu][j].disabled = this[_menu][j].evt === 'ClearCall' || this[_menu][j].evt === 'HoldCall' ? false : true;
          }
        }

        this.$eventBus.$emit('setForceCuttIngFlag', true); //상담정보 영역 새 상담 상태로 변경
      }else{ //이석
        const menuList = ['MOVE_LIST'];
        for (let i = 0; i < menuList.length; i++) {
          const _menu = menuList[i];
          for (let j = 0; j < this[_menu].length; j++) {
            this[_menu][j].active = this[_menu][j].text === this.CALLSTAT[this.SELECTED_CALLSTAT].type ? true : false;
            this[_menu][j].disabled = false;
          }
        }
      }
    },

    //타이머 종료
    ctiCallTimerEnd() {
      clearInterval(this.CTI_CALL_TIMER);
    },

    //CTI 버튼 비활성화
    btnClassRemove() {
      const menuList = ['CTI_MENU','MOVE_LIST'];
      for (let i = 0; i < menuList.length; i++) {
        const _menu = menuList[i];
        for (let j = 0; j < this[_menu].length; j++) {
          this[_menu][j].active = false;
        }
      }
    },

    //전화접수 테이블 저장 처리
    async callRcvTelReg(data){
      let postParam = {
        CALL_ID : data.CALL_ID
        , TEL_PROC_YN : 'N'
        , EXTENSION : this.$store.getters["userStore/GE_USER_ROLE"].EXT_NO
        , AGENT_ID : this.$store.getters["userStore/GE_USER_ROLE"].AGENT_ID
        , CALL_TYPE : this.CALL_TYPE
      };

      if(data.CALL_TYPE === 2){ //인바운드인 경우
        postParam.TEL_NO = data.extensiondata.UEI01[0];
        postParam.ARS_INFO = data.extensiondata.UEI20[0];
      }

      let headParam = {head: {}};
      const response = await this.common_postCall("/phone-api/cutt/callRcvTelReg", postParam, headParam);

      if(response && !response.HEADER.ERROR_FLAG) {
        if(response.DATA.length > 0){
          //상담 정보 영역에 접수 id 전달
          this.$eventBus.$emit("setRcvId", {RCV_TP : 'RCPT_PHN_ID', RCV_ID : response.DATA[0].RCPT_PHN_ID});
          this.mixin_reloadCuttStat('CUTT_MONITOR_STAT'); //상담 모니터링 리로드
        }
      }
    },
    
    //아웃바운드 녹취 저장 처리
    async recordReg(data){
      let postParam = {
        CALL_ID : data.CALL_ID
        , EXTENSION : this.$store.getters["userStore/GE_USER_ROLE"].EXT_NO
        , AGENT_ID : this.$store.getters["userStore/GE_USER_ROLE"].AGENT_ID
      };

      let headParam = {head: {}};
      const response = await this.common_postCall("/phone-api/cutt/callRcvTelReg", postParam, headParam);

      if(response && !response.HEADER.ERROR_FLAG) {
      }
    },

    //상담저장 후 고객 정보 녹취 서버로 전송 처리
    callCuttAftSendVeloce(data){
      let postParam = {
        cmd: 'setcustinfo'
        , tenantid: process.env.VUE_APP_IPRON_TENANT_NAME
        , recdate: data.CTI_INFO.CALL_ID.split('_')[0]
        , agentdn: this.$store.getters["userStore/GE_USER_ROLE"].EXT_NO
        , agentid: this.$store.getters["userStore/GE_USER_ROLE"].AGENT_ID
        , callid: data.CTI_INFO.CALL_ID
        , cust_tel: data.CTI_INFO.PHN_NO.replace(/[^0-9]/g, '')
        , cust_no: data.CUST_INFO.CUST_IDNTF_NO //CUST_IDNTF_NO
        , cust_name: data.CUST_INFO.CUST_NM //CUST_NM
        , cust_etc1: data.CUTT_TYPE_PATH_NM //상담유형(텍스트)
        , call_kind: data.CTI_INFO.CALL_TYPE === 2?'1':'2'
      }

      console.log(postParam);

      $.ajax({
          url: (process.env.VUE_APP_MFU_PORT === '7510' ? 'http://':'https://') + process.env.VUE_APP_MFU_IP + ':' + process.env.VUE_APP_MFU_PORT,
          data : JSON.stringify(postParam),
          async: true,
          dataType: "json",
          type: "POST",
          contentType: "application/json; charset=utf-8",
          crossDomain: true,
          success: function(data) {
              console.log('setcustinfo : ', data);
          },
          error:function(request,status,error){
              console.log("error : " + error);
          }
      });
    },

    async hopeContractCuttProc(data){
      console.log('hopeContractCuttProc : ', data);
      let postParam = {
        UCID : data.UCID
        , CALL_DATE : data.CALL_DATE
        , CUST_ID : data.CUST_ID /*고객 ID*/
        , CONTACT_PHONE : data.CONTACT_PHONE /*고객 전화번호*/
        , CALL_BEGIN_DATETIME : data.CALL_BEGIN_DATETIME /*상담 통화 시작 시간*/
        , CALL_END_DATETIME : data.CALL_END_DATETIME /*상담 통화 종료 시간*/
        , AGT_CONTACT_CODE : data.AGT_CONTACT_CODE /*계약 희망여부 코드*/
        , AGT_CONTACT_TEXT : data.AGT_CONTACT_TEXT /*상담내용*/
        , USER_NM : this.$store.getters["userStore/GE_USER_ROLE"].USER_NM /*상담사명*/
        , EXT_NO : this.$store.getters["userStore/GE_USER_ROLE"].EXT_NO /*내선번호*/
      };

      let headParam = {head: {}};
      const response = await this.common_postCall("/api/external/iprview/hopeContractCuttProc", postParam, headParam);

      if(response && !response.HEADER.ERROR_FLAG) {
        console.log('response : ', response);
      }
    },

    //SWAT 토큰
    async getSwatToken(){
      let response = await this.common_postCall("/api/itf/ipron/swat/auth/token.do", {userSabun:'appuser'}, {});
      if (!response.HEADER.ERROR_FLAG){
        if(response.DATA){
          this.$store.commit("userStore/MU_SWAT_TOKEN", response.DATA[0].token);
        }
      }
    },

    /*****************************
             비밀번호 변경
    *****************************/
   initPswdVar(){
     this.mixin_hideDialog('Profile');
     this.PASSWORD_OLD = "";
     this.PASSWORD_NEW = "";
     this.PASSWORD_NEW2 = "";
     this.resetValidation();
   },

   validate () {
      return this.$refs.form.validate();
   },

   resetValidation() {
     if(this.validate){
      if(this.$refs.form != undefined) this.$refs.form.reset();
     }
   },

    PswdValidate(){
      if(this.validate()){
        if(this.PASSWORD_NEW !== this.PASSWORD_NEW2){
          this.showAlert(this.MESSAGE.ALERT.NOT_CONFIRMED_PSWD);
        }else if(this.PASSWORD_OLD === this.PASSWORD_NEW){
          this.showAlert(this.MESSAGE.ALERT.NOT_SAME_PSWD);
        }else{
          // MESSAGE.CONFIRM에 선언하면 오류 발생
          this.showAlert({alertDialogToggle: true, msg: '비밀번호를 변경 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.getPswdEncKey, callNo: this.closeMsg});
        }
      }
    },

    //비밀번호 암호화 키 호출
    async getPswdEncKey() {

      let sUrl = '/auth-api/password-encpt/process';
      let postParam = {
          username: this.$store.getters["userStore/GE_USER_ROLE"].lgnId,
      }
      let headParam = {
        head:{},
      };

      let response = await this.common_postCall(sUrl,postParam,headParam)


      if (!response.HEADER.ERROR_FLAG) {
        this.ENCRYPT_KEY = response.DATA[0].ENCRYPT_KEY;
        this.chgPswdSave();
      }
    },

    async chgPswdSave(){

      const strPassWD_OLD = sha256(this.PASSWORD_OLD);

      let encPassWD_OLD = GibberishAES.aesEncrypt(
        strPassWD_OLD,
        this.ENCRYPT_KEY
      ); //gibberish-aes.js

      const strPassWD_NEW = sha256(this.PASSWORD_NEW);
      let encPassWD_NEW = GibberishAES.aesEncrypt(
        strPassWD_NEW,
        this.ENCRYPT_KEY
      ); //gibberish-aes.js

      let CHK_OLD_FLAG = "Y";
      let PSWD_FAIL_CNT = "0";
      let BIZ_DIV = "CHANGEPSWD";
      let PSWD_STTS = "NORMAL";

      let sUrl = '/auth-api/password/modify';
      let postParam = {
          CHK_OLD_FLAG: CHK_OLD_FLAG,
          LGN_ID: this.$store.getters["userStore/GE_USER_ROLE"].lgnId,
          PASSWORD_OLD: encPassWD_OLD,
          PASSWORD_NEW: encPassWD_NEW,
          PSWD_FAIL_CNT: PSWD_FAIL_CNT,
          MDFR_ID: this.$store.getters["userStore/GE_USER_ROLE"].userId,
          PSWD_STTS: PSWD_STTS,
          ENCRYPT_KEY: this.ENCRYPT_KEY,
      };
      let headParam = {
        head:{}
      };
      let response = await this.common_postCall(sUrl,postParam,headParam);

      if(!response.HEADER.ERROR_FLAG){
        this.closeMsg();
        this.showToastInfo({msg : '정상 처리 되었습니다.'});
        this.mixin_hideDialog('Password');
        this.initPswdVar();

        this.$store.commit("userStore/MU_PWD_CHANGE_YN", 'Y');
        this.$store.commit("userStore/MU_ELAPSED_DATE", '0');
      }else{
        this.closeMsg();
        this.showToastInfo({msg: response.HEADER.ERROR_MSG});
      }
    },

    closeMsg(){
      this.$store.commit("alertStore/hideAlert");
    },

    /* 상단 사용자 정보 조회  */
    async getUserInfo(){

      let sURL ='/api/biz/common/select/selectLoginSuccessLoginInfo';
      let postParam = {
        SCH_USER_ID : this.$store.getters["userStore/GE_USER_ROLE"].userId,
      }
      let headParam = {
        head : {
          ns:'lhcs.login.dao.LoginMapper'
        }
      }

      let response = await this.common_postCall(sURL,postParam, headParam);
      if(!response.HEADER.ERROR_FLAG){
        this.initUserInfo();
        let tempData = response.DATA;

        this.USER_PROFILE.CNTN_IP = this.$store.getters["userStore/GE_USER_CNTN_IP"];
        this.USER_PROFILE.OFC_ADDR = tempData[0].BLDG_PSTN + " " + tempData[0].BLDG_NM;

        if( tempData[0].ARS_GROUP_CD_LIST.indexOf("GENERAL_ADMIN") > -1 || tempData[0].ARS_GROUP_CD_LIST.indexOf("CNSLT_STAFF") > -1 ){ // 센터장or팀장(부팀장) = 
          this.USER_PROFILE.USER_TYPE = 'LEADER';
        }else if( tempData[0].ARS_GROUP_CD_LIST.indexOf("CNSLT_AGENT") > -1 ) { // 상담사 = 
          this.USER_PROFILE.USER_TYPE = 'MANAGER';
        }else {
          this.USER_PROFILE.USER_TYPE = 'ETC_ADMIN'
        }
        this.USER_PROFILE.EML = this.mixin_isEmpty(tempData[0].EML) ? '-': tempData[0].EML;
        this.USER_PROFILE.PHN_NO = this.mixin_isEmpty(tempData[0].MBL_PHN_NO) ? '-': tempData[0].MBL_PHN_NO;

        if(!this.mixin_isEmpty(tempData[0].ICON)){
          this.USER_PROFILE.FILE_GROUP_KEY = tempData[0].ICON;
          this.USER_PROFILE.IMG =  '/upload/' + tempData[0].ICON_IMG_URI;
        }else{
          this.USER_PROFILE.IMG =  require('@/assets/img/@profile_user.png');
        }
        this.$store.getters["userStore/GE_USER_ROLE"].USER_NM = tempData[0].USER_NM;
        this.$store.getters["userStore/GE_USER_ROLE"].DEPT_NM = tempData[0].DEPT_NM;
        this.$store.getters["userStore/GE_USER_ROLE"].CUSTCO_NM = tempData[0].CUSTCO_NM;
        this.$store.getters["userStore/GE_USER_ROLE"].ICON = tempData[0].ICON;
        this.$store.getters["userStore/GE_USER_ROLE"].ICON_IMG_URI = '/upload/' + tempData[0].ICON_IMG_URI;
        this.$store.getters["userStore/GE_USER_ROLE"].IMG = '/upload/' + tempData[0].ICON_IMG_URI;

        this.$store.getters["userStore/GE_USER_ROLE"].OFC_ADDR = this.USER_PROFILE.OFC_ADDR.trim();
        this.$store.getters["userStore/GE_USER_ROLE"].USER_TYPE = this.USER_PROFILE.USER_TYPE;
        this.$store.getters["userStore/GE_USER_ROLE"].EML = this.USER_PROFILE.EML;
        this.$store.getters["userStore/GE_USER_ROLE"].PHN_NO = this.USER_PROFILE.PHN_NO;

        this.$store.getters["userStore/GE_USER_ROLE"].JBPS_CD = tempData[0].JBPS_CD;
        this.$store.getters["userStore/GE_USER_ROLE"].JBPS_CD_NM = tempData[0].JBPS_CD_NM;
        this.$store.getters["userStore/GE_USER_ROLE"].DUTY_CD = tempData[0].DUTY_CD;
        this.$store.getters["userStore/GE_USER_ROLE"].DUTY_CD_NM = tempData[0].DUTY_CD_NM;

        this.$eventBus.$emit("cs-info", tempData);
      }

    },

    //사용자 정보 초기화
    initUserInfo(){
      this.USER_PROFILE = {
        IMG:require('@/assets/img/@profile_user.png')
      };
    },

    /* 고객사별 환경설정 세팅용도.  */
    async initSettingEnv() {
      let response = await this.common_postCall('/api/setting/env/custcoSettingList', {}, {head: {}});
      if (!response.HEADER.ERROR_FLAG) {
        try {

          let arrInfo = [];
          response.DATA.forEach((data, idx) => {
            arrInfo[data.EXPSN_ATTR_COL_ID] = data;
          });

          this.$store.dispatch('commonStore/AC_CUSTCO_SETTING', {...arrInfo});
        }catch(e){
          console.error( "initSettingEnv error : " + e);
        }
      }
    },

    //녹취 파일 정보 가져오기 위해 CompoFindCallHist의 eventbus 실행
    getRecFileInfo() {
      this.$eventBus.$emit('setRecFileInfo');
    },

    closeDropSelectCompany(){
      this.dropSelectCompany = false;
    },

    // 북마크 관련

    dropBmkClose(){
      this.addBmkFavWrap = false;
      this.addBmkLinkWrap = false;
      this.editingIndex = null;
      this.editingIndex2 = null;
      this.DropBmk = false;
    },

    chaDragLink(){
      if(this.computedUserDetailType === 'TEAM_LEADER' || this.computedUserDetailType === 'CENTER_LEADER'){
        this.saveBmk_act('LK99')
      }
    },

    chaDragFav(){
      this.saveBmk_act('LK00')
    },

    addBmkLink(){
      this.editingIndex = null;
      this.saveBmk_act('LK99')
    },

    addBmkFav(){
      this.editingIndex2 = null;
      this.saveBmk_act('LK00')
    },

    addBmk(type){
      this[`${type}`] = true
    },

    saveBmkLink(){
      this.BOOKMARK.LINK.push({ TITLE: this.newBmkLinkTxt, URL: this.newBmkLinkUrl })
      this.addBmkLinkWrap = false
      this.saveBmk_act('LK99')
    },

    saveBmkFav(){
      this.BOOKMARK.FAVORITE.push({ TITLE: this.newBmkFavTxt, URL: this.newBmkFavUrl })
      this.addBmkFavWrap = false
      this.saveBmk_act('LK00')
    },

    editBnk(index, type){
      this[`${type}`] = index
    },

    removeBnkLink(index){
      //this.BOOKMARK.LINK.splice(index,1)
      //this.saveBmk_act('LK99')

      this.showConfirmInfo({
        msg: '삭제 하시겠습니까?',  callYes: () => {
            this.BOOKMARK.LINK.splice(index,1);
            this.saveBmk_act('LK99');
            this.$store.commit("alertStore/hideAlert");

          }, callNo:this.closeAlert
        }
      )
    },

    removeBnkFav(index){
      this.showConfirmInfo({
        msg: '삭제 하시겠습니까?',  callYes: () => {
            this.BOOKMARK.FAVORITE.splice(index,1);
            this.saveBmk_act('LK00');
            this.$store.commit("alertStore/hideAlert");
          }, callNo:this.closeAlert
        }
      )
    },

    // 북마크 저장 처리 하는곳
    async saveBmk_act(type){

      let sURL ='/system-api/conf/mng/saveFavorites';
      let postParam = {
        USER_ID : this.$store.getters["userStore/GE_USER_ROLE"].userId,
        CENTER_ID : this.computedUserCenter,
        TARGETGRP: type,
        editedRowList: type === 'LK99' ? this.BOOKMARK.LINK : this.BOOKMARK.FAVORITE
      }

      let headParam = { head : {
        DATA_OBJECT: "editedRowList"
      }};
      let response = await this.common_postCall(sURL,postParam, headParam);
      if(!response.HEADER.ERROR_FLAG){
        // this.showToast(this.MESSAGE.TOAST.SUCCESS);
      }

    },

    /* 상단 북마크 즐겨찾기_링크정보 정보 조회  */
    async getFavorites(){
      let sURL ='/system-api/conf/mng/selectFavorites';
      let postParam = {
        SCH_USER_ID : this.$store.getters["userStore/GE_USER_ROLE"].userId,
        CENTER_ID : this.computedUserCenter,   //this.$store.getters["userStore/GE_USER_ROLE"].company.CD;
      }
      let headParam = { }

      let response = await this.common_postCall(sURL,postParam, headParam);
      if(!response.HEADER.ERROR_FLAG){
        this.BOOKMARK.LINK = [];
        this.BOOKMARK.FAVORITE = [];
        response.DATA.forEach(item => {
            if (item.TARGETGRP === 'LK99') {   // Link  ( 센터장, 팀장 )
                this.BOOKMARK.LINK.push(item);
            } else if (item.TARGETGRP === 'LK00') {  // ( 개인 별  )
                this.BOOKMARK.FAVORITE.push(item);
            }
        });
      }
    },
  },
};

//암호화 모듈
let GibberishAES = (function () {
  var Nr = 14,
    /* Default to 256 Bit Encryption */
    Nk = 8,
    Decrypt = false,
    enc_utf8 = function (s) {
      try {
        return unescape(encodeURIComponent(s));
      } catch (e) {
        throw "Error on UTF-8 encode";
      }
    },
    dec_utf8 = function (s) {
      try {
        return decodeURIComponent(escape(s));
      } catch (e) {
        throw "Bad Key";
      }
    },
    padBlock = function (byteArr) {
      var array = [],
        cpad,
        i;
      if (byteArr.length < 16) {
        cpad = 16 - byteArr.length;
        array = [
          cpad,
          cpad,
          cpad,
          cpad,
          cpad,
          cpad,
          cpad,
          cpad,
          cpad,
          cpad,
          cpad,
          cpad,
          cpad,
          cpad,
          cpad,
          cpad,
        ];
      }
      for (i = 0; i < byteArr.length; i++) {
        array[i] = byteArr[i];
      }
      return array;
    },
    block2s = function (block, lastBlock) {
      var string = "",
        padding,
        i;
      if (lastBlock) {
        padding = block[15];
        if (padding > 16) {
          throw "Decryption error: Maybe bad key";
        }
        if (padding == 16) {
          return "";
        }
        for (i = 0; i < 16 - padding; i++) {
          string += String.fromCharCode(block[i]);
        }
      } else {
        for (i = 0; i < 16; i++) {
          string += String.fromCharCode(block[i]);
        }
      }
      return string;
    },
    a2h = function (numArr) {
      var string = "",
        i;
      for (i = 0; i < numArr.length; i++) {
        string += (numArr[i] < 16 ? "0" : "") + numArr[i].toString(16);
      }
      return string;
    },
    h2a = function (s) {
      var ret = [];
      s.replace(/(..)/g, function (s) {
        ret.push(parseInt(s, 16));
      });
      return ret;
    },
    s2a = function (string, binary) {
      var array = [],
        i;

      if (!binary) {
        string = enc_utf8(string);
      }

      for (i = 0; i < string.length; i++) {
        array[i] = string.charCodeAt(i);
      }

      return array;
    },
    size = function (newsize) {
      switch (newsize) {
        case 128:
          Nr = 10;
          Nk = 4;
          break;
        case 192:
          Nr = 12;
          Nk = 6;
          break;
        case 256:
          Nr = 14;
          Nk = 8;
          break;
        default:
          throw "Invalid Key Size Specified:" + newsize;
      }
    },
    randArr = function (num) {
      var result = [],
        i;
      for (i = 0; i < num; i++) {
        result = result.concat(Math.floor(Math.random() * 256));
      }
      return result;
    },
    openSSLKey = function (passwordArr, saltArr) {
      // Number of rounds depends on the size of the AES in use
      // 3 rounds for 256
      //        2 rounds for the key, 1 for the IV
      // 2 rounds for 128
      //        1 round for the key, 1 round for the IV
      // 3 rounds for 192 since it's not evenly divided by 128 bits
      var rounds = Nr >= 12 ? 3 : 2,
        key = [],
        iv = [],
        md5_hash = [],
        result = [],
        data00 = passwordArr.concat(saltArr),
        i;
      md5_hash[0] = GibberishAES.Hash.MD5(data00);
      result = md5_hash[0];
      for (i = 1; i < rounds; i++) {
        md5_hash[i] = GibberishAES.Hash.MD5(md5_hash[i - 1].concat(data00));
        result = result.concat(md5_hash[i]);
      }
      key = result.slice(0, 4 * Nk);
      iv = result.slice(4 * Nk, 4 * Nk + 16);
      return {
        key: key,
        iv: iv,
      };
    },
    rawEncrypt = function (plaintext, key) {
      plaintext = GibberishAES.s2a(plaintext);
      var iv = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      // plaintext, key and iv as byte arrays
      key = expandKey(GibberishAES.s2a(key));
      var numBlocks = Math.ceil(plaintext.length / 16),
        blocks = [],
        i,
        cipherBlocks = [];
      for (i = 0; i < numBlocks; i++) {
        blocks[i] = padBlock(plaintext.slice(i * 16, i * 16 + 16));
      }
      if (plaintext.length % 16 === 0) {
        blocks.push([
          16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
        ]);
        // CBC OpenSSL padding scheme
        numBlocks++;
      }
      for (i = 0; i < blocks.length; i++) {
        blocks[i] =
          i === 0
            ? xorBlocks(blocks[i], iv)
            : xorBlocks(blocks[i], cipherBlocks[i - 1]);
        cipherBlocks[i] = encryptBlock(blocks[i], key);
      }
      return GibberishAES.Base64.encode(cipherBlocks);
    },
    rawDecrypt = function (cryptArr, key) {
      var iv = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      //  cryptArr, key and iv as byte arrays
      key = expandKey(GibberishAES.s2a(key));
      var numBlocks = cryptArr.length / 16,
        cipherBlocks = [],
        i,
        plainBlocks = [],
        string = "";
      for (i = 0; i < numBlocks; i++) {
        cipherBlocks.push(cryptArr.slice(i * 16, (i + 1) * 16));
      }
      for (i = cipherBlocks.length - 1; i >= 0; i--) {
        plainBlocks[i] = decryptBlock(cipherBlocks[i], key);
        plainBlocks[i] =
          i === 0
            ? xorBlocks(plainBlocks[i], iv)
            : xorBlocks(plainBlocks[i], cipherBlocks[i - 1]);
      }
      for (i = 0; i < numBlocks - 1; i++) {
        string += block2s(plainBlocks[i]);
      }
      string += block2s(plainBlocks[i], true);

      return dec_utf8(string);
      //return binary ? string : dec_utf8(string);
    },
    aesEncrypt = function (plaintext, key) {
      var rtnVal = "";
      plaintext = GibberishAES.s2a(plaintext);
      var iv = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      // plaintext, key and iv as byte arrays
      key = expandKey(GibberishAES.s2a(key));
      var numBlocks = Math.ceil(plaintext.length / 16),
        blocks = [],
        i,
        cipherBlocks = [];
      for (i = 0; i < numBlocks; i++) {
        blocks[i] = padBlock(plaintext.slice(i * 16, i * 16 + 16));
      }
      if (plaintext.length % 16 === 0) {
        blocks.push([
          16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
        ]);
        // CBC OpenSSL padding scheme
        numBlocks++;
      }
      for (i = 0; i < blocks.length; i++) {
        blocks[i] =
          i === 0
            ? xorBlocks(blocks[i], iv)
            : xorBlocks(blocks[i], cipherBlocks[i - 1]);
        cipherBlocks[i] = encryptBlock(blocks[i], key);
      }
      rtnVal = GibberishAES.Base64.encode(cipherBlocks);

      return rtnVal.toString().replace("\n", "");
    },
    aesDecrypt = function (base64Text, key) {
      var cryptArr = GibberishAES.Base64.decode(base64Text);
      var iv = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      //  cryptArr, key and iv as byte arrays
      key = expandKey(GibberishAES.s2a(key));
      var numBlocks = cryptArr.length / 16,
        cipherBlocks = [],
        i,
        plainBlocks = [],
        string = "";
      for (i = 0; i < numBlocks; i++) {
        cipherBlocks.push(cryptArr.slice(i * 16, (i + 1) * 16));
      }
      for (i = cipherBlocks.length - 1; i >= 0; i--) {
        plainBlocks[i] = decryptBlock(cipherBlocks[i], key);
        plainBlocks[i] =
          i === 0
            ? xorBlocks(plainBlocks[i], iv)
            : xorBlocks(plainBlocks[i], cipherBlocks[i - 1]);
      }
      for (i = 0; i < numBlocks - 1; i++) {
        string += block2s(plainBlocks[i]);
      }
      string += block2s(plainBlocks[i], true);

      return dec_utf8(string);
      //return binary ? string : dec_utf8(string);
    },
    encryptBlock = function (block, words) {
      Decrypt = false;
      var state = addRoundKey(block, words, 0),
        round;
      for (round = 1; round < Nr + 1; round++) {
        state = subBytes(state);
        state = shiftRows(state);
        if (round < Nr) {
          state = mixColumns(state);
        }
        //last round? don't mixColumns
        state = addRoundKey(state, words, round);
      }

      return state;
    },
    decryptBlock = function (block, words) {
      Decrypt = true;
      var state = addRoundKey(block, words, Nr),
        round;
      for (round = Nr - 1; round > -1; round--) {
        state = shiftRows(state);
        state = subBytes(state);
        state = addRoundKey(state, words, round);
        if (round > 0) {
          state = mixColumns(state);
        }
        //last round? don't mixColumns
      }

      return state;
    },
    subBytes = function (state) {
      var S = Decrypt ? SBoxInv : SBox,
        temp = [],
        i;
      for (i = 0; i < 16; i++) {
        temp[i] = S[state[i]];
      }
      return temp;
    },
    shiftRows = function (state) {
      var temp = [],
        shiftBy = Decrypt
          ? [0, 13, 10, 7, 4, 1, 14, 11, 8, 5, 2, 15, 12, 9, 6, 3]
          : [0, 5, 10, 15, 4, 9, 14, 3, 8, 13, 2, 7, 12, 1, 6, 11],
        i;
      for (i = 0; i < 16; i++) {
        temp[i] = state[shiftBy[i]];
      }
      return temp;
    },
    mixColumns = function (state) {
      var t = [],
        c;
      if (!Decrypt) {
        for (c = 0; c < 4; c++) {
          t[c * 4] =
            G2X[state[c * 4]] ^
            G3X[state[1 + c * 4]] ^
            state[2 + c * 4] ^
            state[3 + c * 4];
          t[1 + c * 4] =
            state[c * 4] ^
            G2X[state[1 + c * 4]] ^
            G3X[state[2 + c * 4]] ^
            state[3 + c * 4];
          t[2 + c * 4] =
            state[c * 4] ^
            state[1 + c * 4] ^
            G2X[state[2 + c * 4]] ^
            G3X[state[3 + c * 4]];
          t[3 + c * 4] =
            G3X[state[c * 4]] ^
            state[1 + c * 4] ^
            state[2 + c * 4] ^
            G2X[state[3 + c * 4]];
        }
      } else {
        for (c = 0; c < 4; c++) {
          t[c * 4] =
            GEX[state[c * 4]] ^
            GBX[state[1 + c * 4]] ^
            GDX[state[2 + c * 4]] ^
            G9X[state[3 + c * 4]];
          t[1 + c * 4] =
            G9X[state[c * 4]] ^
            GEX[state[1 + c * 4]] ^
            GBX[state[2 + c * 4]] ^
            GDX[state[3 + c * 4]];
          t[2 + c * 4] =
            GDX[state[c * 4]] ^
            G9X[state[1 + c * 4]] ^
            GEX[state[2 + c * 4]] ^
            GBX[state[3 + c * 4]];
          t[3 + c * 4] =
            GBX[state[c * 4]] ^
            GDX[state[1 + c * 4]] ^
            G9X[state[2 + c * 4]] ^
            GEX[state[3 + c * 4]];
        }
      }

      return t;
    },
    addRoundKey = function (state, words, round) {
      var temp = [],
        i;
      for (i = 0; i < 16; i++) {
        temp[i] = state[i] ^ words[round][i];
      }
      return temp;
    },
    xorBlocks = function (block1, block2) {
      var temp = [],
        i;
      for (i = 0; i < 16; i++) {
        temp[i] = block1[i] ^ block2[i];
      }
      return temp;
    },
    expandKey = function (key) {
      // Expects a 1d number array
      var w = [],
        temp = [],
        i,
        r,
        t,
        flat = [],
        j;

      for (i = 0; i < Nk; i++) {
        r = [key[4 * i], key[4 * i + 1], key[4 * i + 2], key[4 * i + 3]];
        w[i] = r;
      }

      for (i = Nk; i < 4 * (Nr + 1); i++) {
        w[i] = [];
        for (t = 0; t < 4; t++) {
          temp[t] = w[i - 1][t];
        }
        if (i % Nk === 0) {
          temp = subWord(rotWord(temp));
          temp[0] ^= Rcon[i / Nk - 1];
        } else if (Nk > 6 && i % Nk == 4) {
          temp = subWord(temp);
        }
        for (t = 0; t < 4; t++) {
          w[i][t] = w[i - Nk][t] ^ temp[t];
        }
      }
      for (i = 0; i < Nr + 1; i++) {
        flat[i] = [];
        for (j = 0; j < 4; j++) {
          flat[i].push(
            w[i * 4 + j][0],
            w[i * 4 + j][1],
            w[i * 4 + j][2],
            w[i * 4 + j][3]
          );
        }
      }
      return flat;
    },
    subWord = function (w) {
      // apply SBox to 4-byte word w
      for (var i = 0; i < 4; i++) {
        w[i] = SBox[w[i]];
      }
      return w;
    },
    rotWord = function (w) {
      // rotate 4-byte word w left by one byte
      var tmp = w[0],
        i;
      for (i = 0; i < 4; i++) {
        w[i] = w[i + 1];
      }
      w[3] = tmp;
      return w;
    },
    // S-box
    SBox = [
      99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171, 118,
      202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175, 156, 164, 114,
      192, 183, 253, 147, 38, 54, 63, 247, 204, 52, 165, 229, 241, 113, 216, 49,
      21, 4, 199, 35, 195, 24, 150, 5, 154, 7, 18, 128, 226, 235, 39, 178, 117,
      9, 131, 44, 26, 27, 110, 90, 160, 82, 59, 214, 179, 41, 227, 47, 132, 83,
      209, 0, 237, 32, 252, 177, 91, 106, 203, 190, 57, 74, 76, 88, 207, 208,
      239, 170, 251, 67, 77, 51, 133, 69, 249, 2, 127, 80, 60, 159, 168, 81,
      163, 64, 143, 146, 157, 56, 245, 188, 182, 218, 33, 16, 255, 243, 210,
      205, 12, 19, 236, 95, 151, 68, 23, 196, 167, 126, 61, 100, 93, 25, 115,
      96, 129, 79, 220, 34, 42, 144, 136, 70, 238, 184, 20, 222, 94, 11, 219,
      224, 50, 58, 10, 73, 6, 36, 92, 194, 211, 172, 98, 145, 149, 228, 121,
      231, 200, 55, 109, 141, 213, 78, 169, 108, 86, 244, 234, 101, 122, 174, 8,
      186, 120, 37, 46, 28, 166, 180, 198, 232, 221, 116, 31, 75, 189, 139, 138,
      112, 62, 181, 102, 72, 3, 246, 14, 97, 53, 87, 185, 134, 193, 29, 158,
      225, 248, 152, 17, 105, 217, 142, 148, 155, 30, 135, 233, 206, 85, 40,
      223, 140, 161, 137, 13, 191, 230, 66, 104, 65, 153, 45, 15, 176, 84, 187,
      22,
    ],
    // Precomputed lookup table for the inverse SBox
    SBoxInv = [
      82, 9, 106, 213, 48, 54, 165, 56, 191, 64, 163, 158, 129, 243, 215, 251,
      124, 227, 57, 130, 155, 47, 255, 135, 52, 142, 67, 68, 196, 222, 233, 203,
      84, 123, 148, 50, 166, 194, 35, 61, 238, 76, 149, 11, 66, 250, 195, 78, 8,
      46, 161, 102, 40, 217, 36, 178, 118, 91, 162, 73, 109, 139, 209, 37, 114,
      248, 246, 100, 134, 104, 152, 22, 212, 164, 92, 204, 93, 101, 182, 146,
      108, 112, 72, 80, 253, 237, 185, 218, 94, 21, 70, 87, 167, 141, 157, 132,
      144, 216, 171, 0, 140, 188, 211, 10, 247, 228, 88, 5, 184, 179, 69, 6,
      208, 44, 30, 143, 202, 63, 15, 2, 193, 175, 189, 3, 1, 19, 138, 107, 58,
      145, 17, 65, 79, 103, 220, 234, 151, 242, 207, 206, 240, 180, 230, 115,
      150, 172, 116, 34, 231, 173, 53, 133, 226, 249, 55, 232, 28, 117, 223,
      110, 71, 241, 26, 113, 29, 41, 197, 137, 111, 183, 98, 14, 170, 24, 190,
      27, 252, 86, 62, 75, 198, 210, 121, 32, 154, 219, 192, 254, 120, 205, 90,
      244, 31, 221, 168, 51, 136, 7, 199, 49, 177, 18, 16, 89, 39, 128, 236, 95,
      96, 81, 127, 169, 25, 181, 74, 13, 45, 229, 122, 159, 147, 201, 156, 239,
      160, 224, 59, 77, 174, 42, 245, 176, 200, 235, 187, 60, 131, 83, 153, 97,
      23, 43, 4, 126, 186, 119, 214, 38, 225, 105, 20, 99, 85, 33, 12, 125,
    ],
    // Rijndael Rcon
    Rcon = [
      1, 2, 4, 8, 16, 32, 64, 128, 27, 54, 108, 216, 171, 77, 154, 47, 94, 188,
      99, 198, 151, 53, 106, 212, 179, 125, 250, 239, 197, 145,
    ],
    G2X = [
      0x00, 0x02, 0x04, 0x06, 0x08, 0x0a, 0x0c, 0x0e, 0x10, 0x12, 0x14, 0x16,
      0x18, 0x1a, 0x1c, 0x1e, 0x20, 0x22, 0x24, 0x26, 0x28, 0x2a, 0x2c, 0x2e,
      0x30, 0x32, 0x34, 0x36, 0x38, 0x3a, 0x3c, 0x3e, 0x40, 0x42, 0x44, 0x46,
      0x48, 0x4a, 0x4c, 0x4e, 0x50, 0x52, 0x54, 0x56, 0x58, 0x5a, 0x5c, 0x5e,
      0x60, 0x62, 0x64, 0x66, 0x68, 0x6a, 0x6c, 0x6e, 0x70, 0x72, 0x74, 0x76,
      0x78, 0x7a, 0x7c, 0x7e, 0x80, 0x82, 0x84, 0x86, 0x88, 0x8a, 0x8c, 0x8e,
      0x90, 0x92, 0x94, 0x96, 0x98, 0x9a, 0x9c, 0x9e, 0xa0, 0xa2, 0xa4, 0xa6,
      0xa8, 0xaa, 0xac, 0xae, 0xb0, 0xb2, 0xb4, 0xb6, 0xb8, 0xba, 0xbc, 0xbe,
      0xc0, 0xc2, 0xc4, 0xc6, 0xc8, 0xca, 0xcc, 0xce, 0xd0, 0xd2, 0xd4, 0xd6,
      0xd8, 0xda, 0xdc, 0xde, 0xe0, 0xe2, 0xe4, 0xe6, 0xe8, 0xea, 0xec, 0xee,
      0xf0, 0xf2, 0xf4, 0xf6, 0xf8, 0xfa, 0xfc, 0xfe, 0x1b, 0x19, 0x1f, 0x1d,
      0x13, 0x11, 0x17, 0x15, 0x0b, 0x09, 0x0f, 0x0d, 0x03, 0x01, 0x07, 0x05,
      0x3b, 0x39, 0x3f, 0x3d, 0x33, 0x31, 0x37, 0x35, 0x2b, 0x29, 0x2f, 0x2d,
      0x23, 0x21, 0x27, 0x25, 0x5b, 0x59, 0x5f, 0x5d, 0x53, 0x51, 0x57, 0x55,
      0x4b, 0x49, 0x4f, 0x4d, 0x43, 0x41, 0x47, 0x45, 0x7b, 0x79, 0x7f, 0x7d,
      0x73, 0x71, 0x77, 0x75, 0x6b, 0x69, 0x6f, 0x6d, 0x63, 0x61, 0x67, 0x65,
      0x9b, 0x99, 0x9f, 0x9d, 0x93, 0x91, 0x97, 0x95, 0x8b, 0x89, 0x8f, 0x8d,
      0x83, 0x81, 0x87, 0x85, 0xbb, 0xb9, 0xbf, 0xbd, 0xb3, 0xb1, 0xb7, 0xb5,
      0xab, 0xa9, 0xaf, 0xad, 0xa3, 0xa1, 0xa7, 0xa5, 0xdb, 0xd9, 0xdf, 0xdd,
      0xd3, 0xd1, 0xd7, 0xd5, 0xcb, 0xc9, 0xcf, 0xcd, 0xc3, 0xc1, 0xc7, 0xc5,
      0xfb, 0xf9, 0xff, 0xfd, 0xf3, 0xf1, 0xf7, 0xf5, 0xeb, 0xe9, 0xef, 0xed,
      0xe3, 0xe1, 0xe7, 0xe5,
    ],
    G3X = [
      0x00, 0x03, 0x06, 0x05, 0x0c, 0x0f, 0x0a, 0x09, 0x18, 0x1b, 0x1e, 0x1d,
      0x14, 0x17, 0x12, 0x11, 0x30, 0x33, 0x36, 0x35, 0x3c, 0x3f, 0x3a, 0x39,
      0x28, 0x2b, 0x2e, 0x2d, 0x24, 0x27, 0x22, 0x21, 0x60, 0x63, 0x66, 0x65,
      0x6c, 0x6f, 0x6a, 0x69, 0x78, 0x7b, 0x7e, 0x7d, 0x74, 0x77, 0x72, 0x71,
      0x50, 0x53, 0x56, 0x55, 0x5c, 0x5f, 0x5a, 0x59, 0x48, 0x4b, 0x4e, 0x4d,
      0x44, 0x47, 0x42, 0x41, 0xc0, 0xc3, 0xc6, 0xc5, 0xcc, 0xcf, 0xca, 0xc9,
      0xd8, 0xdb, 0xde, 0xdd, 0xd4, 0xd7, 0xd2, 0xd1, 0xf0, 0xf3, 0xf6, 0xf5,
      0xfc, 0xff, 0xfa, 0xf9, 0xe8, 0xeb, 0xee, 0xed, 0xe4, 0xe7, 0xe2, 0xe1,
      0xa0, 0xa3, 0xa6, 0xa5, 0xac, 0xaf, 0xaa, 0xa9, 0xb8, 0xbb, 0xbe, 0xbd,
      0xb4, 0xb7, 0xb2, 0xb1, 0x90, 0x93, 0x96, 0x95, 0x9c, 0x9f, 0x9a, 0x99,
      0x88, 0x8b, 0x8e, 0x8d, 0x84, 0x87, 0x82, 0x81, 0x9b, 0x98, 0x9d, 0x9e,
      0x97, 0x94, 0x91, 0x92, 0x83, 0x80, 0x85, 0x86, 0x8f, 0x8c, 0x89, 0x8a,
      0xab, 0xa8, 0xad, 0xae, 0xa7, 0xa4, 0xa1, 0xa2, 0xb3, 0xb0, 0xb5, 0xb6,
      0xbf, 0xbc, 0xb9, 0xba, 0xfb, 0xf8, 0xfd, 0xfe, 0xf7, 0xf4, 0xf1, 0xf2,
      0xe3, 0xe0, 0xe5, 0xe6, 0xef, 0xec, 0xe9, 0xea, 0xcb, 0xc8, 0xcd, 0xce,
      0xc7, 0xc4, 0xc1, 0xc2, 0xd3, 0xd0, 0xd5, 0xd6, 0xdf, 0xdc, 0xd9, 0xda,
      0x5b, 0x58, 0x5d, 0x5e, 0x57, 0x54, 0x51, 0x52, 0x43, 0x40, 0x45, 0x46,
      0x4f, 0x4c, 0x49, 0x4a, 0x6b, 0x68, 0x6d, 0x6e, 0x67, 0x64, 0x61, 0x62,
      0x73, 0x70, 0x75, 0x76, 0x7f, 0x7c, 0x79, 0x7a, 0x3b, 0x38, 0x3d, 0x3e,
      0x37, 0x34, 0x31, 0x32, 0x23, 0x20, 0x25, 0x26, 0x2f, 0x2c, 0x29, 0x2a,
      0x0b, 0x08, 0x0d, 0x0e, 0x07, 0x04, 0x01, 0x02, 0x13, 0x10, 0x15, 0x16,
      0x1f, 0x1c, 0x19, 0x1a,
    ],
    G9X = [
      0x00, 0x09, 0x12, 0x1b, 0x24, 0x2d, 0x36, 0x3f, 0x48, 0x41, 0x5a, 0x53,
      0x6c, 0x65, 0x7e, 0x77, 0x90, 0x99, 0x82, 0x8b, 0xb4, 0xbd, 0xa6, 0xaf,
      0xd8, 0xd1, 0xca, 0xc3, 0xfc, 0xf5, 0xee, 0xe7, 0x3b, 0x32, 0x29, 0x20,
      0x1f, 0x16, 0x0d, 0x04, 0x73, 0x7a, 0x61, 0x68, 0x57, 0x5e, 0x45, 0x4c,
      0xab, 0xa2, 0xb9, 0xb0, 0x8f, 0x86, 0x9d, 0x94, 0xe3, 0xea, 0xf1, 0xf8,
      0xc7, 0xce, 0xd5, 0xdc, 0x76, 0x7f, 0x64, 0x6d, 0x52, 0x5b, 0x40, 0x49,
      0x3e, 0x37, 0x2c, 0x25, 0x1a, 0x13, 0x08, 0x01, 0xe6, 0xef, 0xf4, 0xfd,
      0xc2, 0xcb, 0xd0, 0xd9, 0xae, 0xa7, 0xbc, 0xb5, 0x8a, 0x83, 0x98, 0x91,
      0x4d, 0x44, 0x5f, 0x56, 0x69, 0x60, 0x7b, 0x72, 0x05, 0x0c, 0x17, 0x1e,
      0x21, 0x28, 0x33, 0x3a, 0xdd, 0xd4, 0xcf, 0xc6, 0xf9, 0xf0, 0xeb, 0xe2,
      0x95, 0x9c, 0x87, 0x8e, 0xb1, 0xb8, 0xa3, 0xaa, 0xec, 0xe5, 0xfe, 0xf7,
      0xc8, 0xc1, 0xda, 0xd3, 0xa4, 0xad, 0xb6, 0xbf, 0x80, 0x89, 0x92, 0x9b,
      0x7c, 0x75, 0x6e, 0x67, 0x58, 0x51, 0x4a, 0x43, 0x34, 0x3d, 0x26, 0x2f,
      0x10, 0x19, 0x02, 0x0b, 0xd7, 0xde, 0xc5, 0xcc, 0xf3, 0xfa, 0xe1, 0xe8,
      0x9f, 0x96, 0x8d, 0x84, 0xbb, 0xb2, 0xa9, 0xa0, 0x47, 0x4e, 0x55, 0x5c,
      0x63, 0x6a, 0x71, 0x78, 0x0f, 0x06, 0x1d, 0x14, 0x2b, 0x22, 0x39, 0x30,
      0x9a, 0x93, 0x88, 0x81, 0xbe, 0xb7, 0xac, 0xa5, 0xd2, 0xdb, 0xc0, 0xc9,
      0xf6, 0xff, 0xe4, 0xed, 0x0a, 0x03, 0x18, 0x11, 0x2e, 0x27, 0x3c, 0x35,
      0x42, 0x4b, 0x50, 0x59, 0x66, 0x6f, 0x74, 0x7d, 0xa1, 0xa8, 0xb3, 0xba,
      0x85, 0x8c, 0x97, 0x9e, 0xe9, 0xe0, 0xfb, 0xf2, 0xcd, 0xc4, 0xdf, 0xd6,
      0x31, 0x38, 0x23, 0x2a, 0x15, 0x1c, 0x07, 0x0e, 0x79, 0x70, 0x6b, 0x62,
      0x5d, 0x54, 0x4f, 0x46,
    ],
    GBX = [
      0x00, 0x0b, 0x16, 0x1d, 0x2c, 0x27, 0x3a, 0x31, 0x58, 0x53, 0x4e, 0x45,
      0x74, 0x7f, 0x62, 0x69, 0xb0, 0xbb, 0xa6, 0xad, 0x9c, 0x97, 0x8a, 0x81,
      0xe8, 0xe3, 0xfe, 0xf5, 0xc4, 0xcf, 0xd2, 0xd9, 0x7b, 0x70, 0x6d, 0x66,
      0x57, 0x5c, 0x41, 0x4a, 0x23, 0x28, 0x35, 0x3e, 0x0f, 0x04, 0x19, 0x12,
      0xcb, 0xc0, 0xdd, 0xd6, 0xe7, 0xec, 0xf1, 0xfa, 0x93, 0x98, 0x85, 0x8e,
      0xbf, 0xb4, 0xa9, 0xa2, 0xf6, 0xfd, 0xe0, 0xeb, 0xda, 0xd1, 0xcc, 0xc7,
      0xae, 0xa5, 0xb8, 0xb3, 0x82, 0x89, 0x94, 0x9f, 0x46, 0x4d, 0x50, 0x5b,
      0x6a, 0x61, 0x7c, 0x77, 0x1e, 0x15, 0x08, 0x03, 0x32, 0x39, 0x24, 0x2f,
      0x8d, 0x86, 0x9b, 0x90, 0xa1, 0xaa, 0xb7, 0xbc, 0xd5, 0xde, 0xc3, 0xc8,
      0xf9, 0xf2, 0xef, 0xe4, 0x3d, 0x36, 0x2b, 0x20, 0x11, 0x1a, 0x07, 0x0c,
      0x65, 0x6e, 0x73, 0x78, 0x49, 0x42, 0x5f, 0x54, 0xf7, 0xfc, 0xe1, 0xea,
      0xdb, 0xd0, 0xcd, 0xc6, 0xaf, 0xa4, 0xb9, 0xb2, 0x83, 0x88, 0x95, 0x9e,
      0x47, 0x4c, 0x51, 0x5a, 0x6b, 0x60, 0x7d, 0x76, 0x1f, 0x14, 0x09, 0x02,
      0x33, 0x38, 0x25, 0x2e, 0x8c, 0x87, 0x9a, 0x91, 0xa0, 0xab, 0xb6, 0xbd,
      0xd4, 0xdf, 0xc2, 0xc9, 0xf8, 0xf3, 0xee, 0xe5, 0x3c, 0x37, 0x2a, 0x21,
      0x10, 0x1b, 0x06, 0x0d, 0x64, 0x6f, 0x72, 0x79, 0x48, 0x43, 0x5e, 0x55,
      0x01, 0x0a, 0x17, 0x1c, 0x2d, 0x26, 0x3b, 0x30, 0x59, 0x52, 0x4f, 0x44,
      0x75, 0x7e, 0x63, 0x68, 0xb1, 0xba, 0xa7, 0xac, 0x9d, 0x96, 0x8b, 0x80,
      0xe9, 0xe2, 0xff, 0xf4, 0xc5, 0xce, 0xd3, 0xd8, 0x7a, 0x71, 0x6c, 0x67,
      0x56, 0x5d, 0x40, 0x4b, 0x22, 0x29, 0x34, 0x3f, 0x0e, 0x05, 0x18, 0x13,
      0xca, 0xc1, 0xdc, 0xd7, 0xe6, 0xed, 0xf0, 0xfb, 0x92, 0x99, 0x84, 0x8f,
      0xbe, 0xb5, 0xa8, 0xa3,
    ],
    GDX = [
      0x00, 0x0d, 0x1a, 0x17, 0x34, 0x39, 0x2e, 0x23, 0x68, 0x65, 0x72, 0x7f,
      0x5c, 0x51, 0x46, 0x4b, 0xd0, 0xdd, 0xca, 0xc7, 0xe4, 0xe9, 0xfe, 0xf3,
      0xb8, 0xb5, 0xa2, 0xaf, 0x8c, 0x81, 0x96, 0x9b, 0xbb, 0xb6, 0xa1, 0xac,
      0x8f, 0x82, 0x95, 0x98, 0xd3, 0xde, 0xc9, 0xc4, 0xe7, 0xea, 0xfd, 0xf0,
      0x6b, 0x66, 0x71, 0x7c, 0x5f, 0x52, 0x45, 0x48, 0x03, 0x0e, 0x19, 0x14,
      0x37, 0x3a, 0x2d, 0x20, 0x6d, 0x60, 0x77, 0x7a, 0x59, 0x54, 0x43, 0x4e,
      0x05, 0x08, 0x1f, 0x12, 0x31, 0x3c, 0x2b, 0x26, 0xbd, 0xb0, 0xa7, 0xaa,
      0x89, 0x84, 0x93, 0x9e, 0xd5, 0xd8, 0xcf, 0xc2, 0xe1, 0xec, 0xfb, 0xf6,
      0xd6, 0xdb, 0xcc, 0xc1, 0xe2, 0xef, 0xf8, 0xf5, 0xbe, 0xb3, 0xa4, 0xa9,
      0x8a, 0x87, 0x90, 0x9d, 0x06, 0x0b, 0x1c, 0x11, 0x32, 0x3f, 0x28, 0x25,
      0x6e, 0x63, 0x74, 0x79, 0x5a, 0x57, 0x40, 0x4d, 0xda, 0xd7, 0xc0, 0xcd,
      0xee, 0xe3, 0xf4, 0xf9, 0xb2, 0xbf, 0xa8, 0xa5, 0x86, 0x8b, 0x9c, 0x91,
      0x0a, 0x07, 0x10, 0x1d, 0x3e, 0x33, 0x24, 0x29, 0x62, 0x6f, 0x78, 0x75,
      0x56, 0x5b, 0x4c, 0x41, 0x61, 0x6c, 0x7b, 0x76, 0x55, 0x58, 0x4f, 0x42,
      0x09, 0x04, 0x13, 0x1e, 0x3d, 0x30, 0x27, 0x2a, 0xb1, 0xbc, 0xab, 0xa6,
      0x85, 0x88, 0x9f, 0x92, 0xd9, 0xd4, 0xc3, 0xce, 0xed, 0xe0, 0xf7, 0xfa,
      0xb7, 0xba, 0xad, 0xa0, 0x83, 0x8e, 0x99, 0x94, 0xdf, 0xd2, 0xc5, 0xc8,
      0xeb, 0xe6, 0xf1, 0xfc, 0x67, 0x6a, 0x7d, 0x70, 0x53, 0x5e, 0x49, 0x44,
      0x0f, 0x02, 0x15, 0x18, 0x3b, 0x36, 0x21, 0x2c, 0x0c, 0x01, 0x16, 0x1b,
      0x38, 0x35, 0x22, 0x2f, 0x64, 0x69, 0x7e, 0x73, 0x50, 0x5d, 0x4a, 0x47,
      0xdc, 0xd1, 0xc6, 0xcb, 0xe8, 0xe5, 0xf2, 0xff, 0xb4, 0xb9, 0xae, 0xa3,
      0x80, 0x8d, 0x9a, 0x97,
    ],
    GEX = [
      0x00, 0x0e, 0x1c, 0x12, 0x38, 0x36, 0x24, 0x2a, 0x70, 0x7e, 0x6c, 0x62,
      0x48, 0x46, 0x54, 0x5a, 0xe0, 0xee, 0xfc, 0xf2, 0xd8, 0xd6, 0xc4, 0xca,
      0x90, 0x9e, 0x8c, 0x82, 0xa8, 0xa6, 0xb4, 0xba, 0xdb, 0xd5, 0xc7, 0xc9,
      0xe3, 0xed, 0xff, 0xf1, 0xab, 0xa5, 0xb7, 0xb9, 0x93, 0x9d, 0x8f, 0x81,
      0x3b, 0x35, 0x27, 0x29, 0x03, 0x0d, 0x1f, 0x11, 0x4b, 0x45, 0x57, 0x59,
      0x73, 0x7d, 0x6f, 0x61, 0xad, 0xa3, 0xb1, 0xbf, 0x95, 0x9b, 0x89, 0x87,
      0xdd, 0xd3, 0xc1, 0xcf, 0xe5, 0xeb, 0xf9, 0xf7, 0x4d, 0x43, 0x51, 0x5f,
      0x75, 0x7b, 0x69, 0x67, 0x3d, 0x33, 0x21, 0x2f, 0x05, 0x0b, 0x19, 0x17,
      0x76, 0x78, 0x6a, 0x64, 0x4e, 0x40, 0x52, 0x5c, 0x06, 0x08, 0x1a, 0x14,
      0x3e, 0x30, 0x22, 0x2c, 0x96, 0x98, 0x8a, 0x84, 0xae, 0xa0, 0xb2, 0xbc,
      0xe6, 0xe8, 0xfa, 0xf4, 0xde, 0xd0, 0xc2, 0xcc, 0x41, 0x4f, 0x5d, 0x53,
      0x79, 0x77, 0x65, 0x6b, 0x31, 0x3f, 0x2d, 0x23, 0x09, 0x07, 0x15, 0x1b,
      0xa1, 0xaf, 0xbd, 0xb3, 0x99, 0x97, 0x85, 0x8b, 0xd1, 0xdf, 0xcd, 0xc3,
      0xe9, 0xe7, 0xf5, 0xfb, 0x9a, 0x94, 0x86, 0x88, 0xa2, 0xac, 0xbe, 0xb0,
      0xea, 0xe4, 0xf6, 0xf8, 0xd2, 0xdc, 0xce, 0xc0, 0x7a, 0x74, 0x66, 0x68,
      0x42, 0x4c, 0x5e, 0x50, 0x0a, 0x04, 0x16, 0x18, 0x32, 0x3c, 0x2e, 0x20,
      0xec, 0xe2, 0xf0, 0xfe, 0xd4, 0xda, 0xc8, 0xc6, 0x9c, 0x92, 0x80, 0x8e,
      0xa4, 0xaa, 0xb8, 0xb6, 0x0c, 0x02, 0x10, 0x1e, 0x34, 0x3a, 0x28, 0x26,
      0x7c, 0x72, 0x60, 0x6e, 0x44, 0x4a, 0x58, 0x56, 0x37, 0x39, 0x2b, 0x25,
      0x0f, 0x01, 0x13, 0x1d, 0x47, 0x49, 0x5b, 0x55, 0x7f, 0x71, 0x63, 0x6d,
      0xd7, 0xd9, 0xcb, 0xc5, 0xef, 0xe1, 0xf3, 0xfd, 0xa7, 0xa9, 0xbb, 0xb5,
      0x9f, 0x91, 0x83, 0x8d,
    ],
    enc = function (string, pass, binary) {
      // string, password in plaintext
      var salt = randArr(8),
        pbe = openSSLKey(s2a(pass, binary), salt),
        key = pbe.key,
        iv = pbe.iv,
        cipherBlocks,
        saltBlock = [[83, 97, 108, 116, 101, 100, 95, 95].concat(salt)];
      string = s2a(string, binary);
      cipherBlocks = rawEncrypt(string, key, iv);
      // Spells out 'Salted__'
      cipherBlocks = saltBlock.concat(cipherBlocks);
      return Base64.encode(cipherBlocks);
    },
    dec = function (string, pass, binary) {
      // string, password in plaintext
      var cryptArr = Base64.decode(string),
        salt = cryptArr.slice(8, 16),
        pbe = openSSLKey(s2a(pass, binary), salt),
        key = pbe.key,
        iv = pbe.iv;
      cryptArr = cryptArr.slice(16, cryptArr.length);
      // Take off the Salted__ffeeddcc
      string = rawDecrypt(cryptArr, key, iv, binary);
      return string;
    },
    MD5 = function (numArr) {
      function rotateLeft(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
      }

      function addUnsigned(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = lX & 0x80000000;
        lY8 = lY & 0x80000000;
        lX4 = lX & 0x40000000;
        lY4 = lY & 0x40000000;
        lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
        if (lX4 & lY4) {
          return lResult ^ 0x80000000 ^ lX8 ^ lY8;
        }
        if (lX4 | lY4) {
          if (lResult & 0x40000000) {
            return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
          } else {
            return lResult ^ 0x40000000 ^ lX8 ^ lY8;
          }
        } else {
          return lResult ^ lX8 ^ lY8;
        }
      }

      function f(x, y, z) {
        return (x & y) | (~x & z);
      }
      function g(x, y, z) {
        return (x & z) | (y & ~z);
      }
      function h(x, y, z) {
        return x ^ y ^ z;
      }
      function funcI(x, y, z) {
        return y ^ (x | ~z);
      }

      function ff(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(f(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
      }

      function gg(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(g(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
      }

      function hh(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(h(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
      }

      function ii(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(funcI(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
      }

      function convertToWordArray(numArr) {
        var lWordCount,
          lMessageLength = numArr.length,
          lNumberOfWords_temp1 = lMessageLength + 8,
          lNumberOfWords_temp2 =
            (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64,
          lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16,
          lWordArray = [],
          lBytePosition = 0,
          lByteCount = 0;
        while (lByteCount < lMessageLength) {
          lWordCount = (lByteCount - (lByteCount % 4)) / 4;
          lBytePosition = (lByteCount % 4) * 8;
          lWordArray[lWordCount] =
            lWordArray[lWordCount] | (numArr[lByteCount] << lBytePosition);
          lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] =
          lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
      }

      function wordToHex(lValue) {
        var lByte,
          lCount,
          wordToHexArr = [];
        for (lCount = 0; lCount <= 3; lCount++) {
          lByte = (lValue >>> (lCount * 8)) & 255;
          wordToHexArr = wordToHexArr.concat(lByte);
        }
        return wordToHexArr;
      }

      /*function utf8Encode(string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "",
            n,
            c;

            for (n = 0; n < string.length; n++) {

                c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        }*/

      var x = [],
        k,
        AA,
        BB,
        CC,
        DD,
        a,
        b,
        c,
        d,
        S11 = 7,
        S12 = 12,
        S13 = 17,
        S14 = 22,
        S21 = 5,
        S22 = 9,
        S23 = 14,
        S24 = 20,
        S31 = 4,
        S32 = 11,
        S33 = 16,
        S34 = 23,
        S41 = 6,
        S42 = 10,
        S43 = 15,
        S44 = 21;

      x = convertToWordArray(numArr);

      a = 0x67452301;
      b = 0xefcdab89;
      c = 0x98badcfe;
      d = 0x10325476;

      for (k = 0; k < x.length; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = ff(a, b, c, d, x[k + 0], S11, 0xd76aa478);
        d = ff(d, a, b, c, x[k + 1], S12, 0xe8c7b756);
        c = ff(c, d, a, b, x[k + 2], S13, 0x242070db);
        b = ff(b, c, d, a, x[k + 3], S14, 0xc1bdceee);
        a = ff(a, b, c, d, x[k + 4], S11, 0xf57c0faf);
        d = ff(d, a, b, c, x[k + 5], S12, 0x4787c62a);
        c = ff(c, d, a, b, x[k + 6], S13, 0xa8304613);
        b = ff(b, c, d, a, x[k + 7], S14, 0xfd469501);
        a = ff(a, b, c, d, x[k + 8], S11, 0x698098d8);
        d = ff(d, a, b, c, x[k + 9], S12, 0x8b44f7af);
        c = ff(c, d, a, b, x[k + 10], S13, 0xffff5bb1);
        b = ff(b, c, d, a, x[k + 11], S14, 0x895cd7be);
        a = ff(a, b, c, d, x[k + 12], S11, 0x6b901122);
        d = ff(d, a, b, c, x[k + 13], S12, 0xfd987193);
        c = ff(c, d, a, b, x[k + 14], S13, 0xa679438e);
        b = ff(b, c, d, a, x[k + 15], S14, 0x49b40821);
        a = gg(a, b, c, d, x[k + 1], S21, 0xf61e2562);
        d = gg(d, a, b, c, x[k + 6], S22, 0xc040b340);
        c = gg(c, d, a, b, x[k + 11], S23, 0x265e5a51);
        b = gg(b, c, d, a, x[k + 0], S24, 0xe9b6c7aa);
        a = gg(a, b, c, d, x[k + 5], S21, 0xd62f105d);
        d = gg(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = gg(c, d, a, b, x[k + 15], S23, 0xd8a1e681);
        b = gg(b, c, d, a, x[k + 4], S24, 0xe7d3fbc8);
        a = gg(a, b, c, d, x[k + 9], S21, 0x21e1cde6);
        d = gg(d, a, b, c, x[k + 14], S22, 0xc33707d6);
        c = gg(c, d, a, b, x[k + 3], S23, 0xf4d50d87);
        b = gg(b, c, d, a, x[k + 8], S24, 0x455a14ed);
        a = gg(a, b, c, d, x[k + 13], S21, 0xa9e3e905);
        d = gg(d, a, b, c, x[k + 2], S22, 0xfcefa3f8);
        c = gg(c, d, a, b, x[k + 7], S23, 0x676f02d9);
        b = gg(b, c, d, a, x[k + 12], S24, 0x8d2a4c8a);
        a = hh(a, b, c, d, x[k + 5], S31, 0xfffa3942);
        d = hh(d, a, b, c, x[k + 8], S32, 0x8771f681);
        c = hh(c, d, a, b, x[k + 11], S33, 0x6d9d6122);
        b = hh(b, c, d, a, x[k + 14], S34, 0xfde5380c);
        a = hh(a, b, c, d, x[k + 1], S31, 0xa4beea44);
        d = hh(d, a, b, c, x[k + 4], S32, 0x4bdecfa9);
        c = hh(c, d, a, b, x[k + 7], S33, 0xf6bb4b60);
        b = hh(b, c, d, a, x[k + 10], S34, 0xbebfbc70);
        a = hh(a, b, c, d, x[k + 13], S31, 0x289b7ec6);
        d = hh(d, a, b, c, x[k + 0], S32, 0xeaa127fa);
        c = hh(c, d, a, b, x[k + 3], S33, 0xd4ef3085);
        b = hh(b, c, d, a, x[k + 6], S34, 0x4881d05);
        a = hh(a, b, c, d, x[k + 9], S31, 0xd9d4d039);
        d = hh(d, a, b, c, x[k + 12], S32, 0xe6db99e5);
        c = hh(c, d, a, b, x[k + 15], S33, 0x1fa27cf8);
        b = hh(b, c, d, a, x[k + 2], S34, 0xc4ac5665);
        a = ii(a, b, c, d, x[k + 0], S41, 0xf4292244);
        d = ii(d, a, b, c, x[k + 7], S42, 0x432aff97);
        c = ii(c, d, a, b, x[k + 14], S43, 0xab9423a7);
        b = ii(b, c, d, a, x[k + 5], S44, 0xfc93a039);
        a = ii(a, b, c, d, x[k + 12], S41, 0x655b59c3);
        d = ii(d, a, b, c, x[k + 3], S42, 0x8f0ccc92);
        c = ii(c, d, a, b, x[k + 10], S43, 0xffeff47d);
        b = ii(b, c, d, a, x[k + 1], S44, 0x85845dd1);
        a = ii(a, b, c, d, x[k + 8], S41, 0x6fa87e4f);
        d = ii(d, a, b, c, x[k + 15], S42, 0xfe2ce6e0);
        c = ii(c, d, a, b, x[k + 6], S43, 0xa3014314);
        b = ii(b, c, d, a, x[k + 13], S44, 0x4e0811a1);
        a = ii(a, b, c, d, x[k + 4], S41, 0xf7537e82);
        d = ii(d, a, b, c, x[k + 11], S42, 0xbd3af235);
        c = ii(c, d, a, b, x[k + 2], S43, 0x2ad7d2bb);
        b = ii(b, c, d, a, x[k + 9], S44, 0xeb86d391);
        a = addUnsigned(a, AA);
        b = addUnsigned(b, BB);
        c = addUnsigned(c, CC);
        d = addUnsigned(d, DD);
      }

      return wordToHex(a).concat(wordToHex(b), wordToHex(c), wordToHex(d));
    },
    Base64 = (function () {
      var totalChunks;
      // Takes a Nx16x1 byte array and converts it to Base64
      var _chars =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        chars = _chars.split(""),
        encode = function (b, withBreaks) {
          var flatArr = [],
            b64 = "",
            i,
            broken_b64;
          totalChunks = Math.floor((b.length * 16) / 3);
          for (i = 0; i < b.length * 16; i++) {
            flatArr.push(b[Math.floor(i / 16)][i % 16]);
          }
          for (i = 0; i < flatArr.length; i = i + 3) {
            b64 += chars[flatArr[i] >> 2];
            b64 += chars[((flatArr[i] & 3) << 4) | (flatArr[i + 1] >> 4)];
            if (!(flatArr[i + 1] === undefined)) {
              b64 +=
                chars[((flatArr[i + 1] & 15) << 2) | (flatArr[i + 2] >> 6)];
            } else {
              b64 += "=";
            }
            if (!(flatArr[i + 2] === undefined)) {
              b64 += chars[flatArr[i + 2] & 63];
            } else {
              b64 += "=";
            }
          }
          // OpenSSL is super particular about line breaks
          broken_b64 = b64.slice(0, 64) + "\n";
          for (i = 1; i < Math.ceil(b64.length / 64); i++) {
            broken_b64 +=
              b64.slice(i * 64, i * 64 + 64) +
              (Math.ceil(b64.length / 64) == i + 1 ? "" : "\n");
          }
          return broken_b64;
        },
        decode = function (string) {
          string = string.replace(/\n/g, "");
          var flatArr = [],
            c = [],
            b = [],
            i;
          for (i = 0; i < string.length; i = i + 4) {
            c[0] = _chars.indexOf(string.charAt(i));
            c[1] = _chars.indexOf(string.charAt(i + 1));
            c[2] = _chars.indexOf(string.charAt(i + 2));
            c[3] = _chars.indexOf(string.charAt(i + 3));

            b[0] = (c[0] << 2) | (c[1] >> 4);
            b[1] = ((c[1] & 15) << 4) | (c[2] >> 2);
            b[2] = ((c[2] & 3) << 6) | c[3];
            flatArr.push(b[0], b[1], b[2]);
          }
          flatArr = flatArr.slice(0, flatArr.length - (flatArr.length % 16));
          return flatArr;
        };

      //internet explorer
      if (typeof Array.indexOf === "function") {
        _chars = chars;
      }

      /*
        //other way to solve internet explorer problem
        if(!Array.indexOf){
            Array.prototype.indexOf = function(obj){
                for(var i=0; i<this.length; i++){
                    if(this[i]===obj){
                        return i;
                    }
                }
                return -1;
            }
        }
        */

      return {
        encode: encode,
        decode: decode,
      };
    })();

  return {
    size: size,
    h2a: h2a,
    expandKey: expandKey,
    encryptBlock: encryptBlock,
    decryptBlock: decryptBlock,
    Decrypt: Decrypt,
    s2a: s2a,
    rawEncrypt: rawEncrypt,
    aesEncrypt: aesEncrypt,
    aesDecrypt: aesDecrypt,
    dec: dec,
    openSSLKey: openSSLKey,
    a2h: a2h,
    enc: enc,
    Hash: { MD5: MD5 },
    Base64: Base64,
  };
})();
</script>
<!--//mark: 시연: style 종합복지마스터조회  -->
<style lang="scss">
.admin-layout-card-list {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  &.type-noclick {
    flex-wrap: nowrap;
    .pl-box-unit {
      flex: 1;
      cursor: auto;
    }
  }
  &-unit {
    display: flex;
    flex-direction: column;
    flex: 0 0 31%;
    justify-content: space-between;
    padding: 16px;
    background: #FFF;
    border: 1px solid #dbdbdb;
    border-radius: 5px;
    box-sizing: border-box;
    cursor: pointer;
    &-head {
      display: flex;
      align-items: self-start;
    }
    &-sub {
      display: block;
    }
    &-date {
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid #dbdbdb;
    }
    .pl-round-chip {
      background: #FFF;
    }
    &.active {
      background: #F5F8FF;
      border-color: var(--primary-color);
    }
  }
}
</style>

