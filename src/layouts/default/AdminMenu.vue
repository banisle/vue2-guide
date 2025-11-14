<template>
  <!-- menu -->
  <div class="layout-gnb-side type-admin">
    <!-- profile -->
    <div class="px-4 py-3 d-flex is-border-bottom">
      <img :src="USER_PROFILE.IMG" :alt="USER_PROFILE.USER_NM" style="max-width: 35px; max-height: 35px; border-radius: 50%"  @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}">
      <div class="ml-3">
        <div>
          <strong style="font-size: 14px">{{ USER_PROFILE.USER_NM }}</strong>
        </div>
        <span class="is-txt-sub">{{ USER_PROFILE.atrtGroupNm }}</span>
      </div>
    </div>
    <v-list dense nav class="menu-list ">
      <template v-for="(item, index) in user_menu">
        <!-- {{ user_menu }} -->
        <!-- 하위메뉴가 있으면... -->
        <!-- v-if="item.items && checkUserRole(item.id, user_menu) === true" -->
        <menu-group-list v-if="item.child" :key="`item-${index}`" :item="item" :user_menu="user_menu" />
        <!-- 하위메뉴가 없으면... -->
        <!-- v-else-if="checkUserRole(item.id, user_menu) === true" -->
        <menu-list v-else :key="`item-${index}`" :item="item" :user_menu="user_menu" />
      </template>

      <!--시스템관리자 추가 메뉴-->
      <template v-if="computedUserType === 'ETC_ADMIN'" v-for="(item, index) in user_setting_menu">
        <menu-group-list v-if="item.child" :key="`item-${user_menu.length + index}`" :item="item" :user_menu="user_setting_menu" />
        <menu-list v-else :key="`item-${index}`" :item="item" :user_menu="user_setting_menu" />
      </template>
    </v-list>
  </div>
</template>

<script>
import MenuList from "./MenuList";
import MenuGroupList from "./MenuGroupList";

export default {
  name: 'AdminMenu', //관리자 메뉴
  components: {
    MenuList,
    MenuGroupList,
  },
  data: () => ({
    AUTH:"",
    // items 옵션 설명
    //   title: aside에 보여지는 메뉴명 설정(iframe이 false인 경우 필수)
    //   icon: aside에 보여지는 아이콘 설정(iframe이 false인 경우 필수)
    //   to: aside에 보여진 후 클릭하면 이동할 링크 경로(iframe이 false인 경우 필수)
    //   iframe: 전체화면 또는 tab으로 보여질지 선택(true이면 tab으로 보여짐. default: true)
    //   id: 컴포넌트의 name 값 (iframe이 true인 경우 사용)
    //   tabIcon: tab에 보여질 아이콘 설정(iframe이 true인 경우 사용. 빈값인 경우 아이콘 생략)
    items: [ ],
    right: null,
    USER_PROFILE: {},
    user_setting_menu: [
      {NODE_TITLE: "설정 및 지원", ICON_CLASS_NM: "m11", ADMIN_ADD_MENU : true, SETTING_MENU : false, child:[
          {NODE_TITLE: "설정", ADMIN_ADD_MENU : true, SETTING_MENU : true},
          {NODE_TITLE: "상담업무지원", ADMIN_ADD_MENU : true, SETTING_MENU : false, ACT_NM: 'dialogCsSupportTool',},
          {NODE_TITLE: "업무담당자", ADMIN_ADD_MENU : true, SETTING_MENU : false, ACT_NM: 'dialogJobParts',},
        ]
      },
    ],
  }),
  mounted() {
    this.USER_PROFILE = this.$store.getters["userStore/GE_USER_ROLE"];
    this.changeMenuName();
    this.checkUserAuth();
  },
  computed: {
  },
  watch: {
    //user_menu가 변경되면 메뉴 리셋
    user_menu(data) {
      //변경 처리
      // this.changeMenuName();
    },
  },
  methods: {
    setActiveTab(item) {
      let setId = item.to.replace("/", "");
      this.$store.dispatch("commonStore/AC_COMMON_ACTIVE_TAB", {
        id: setId,
        title: item.NODE_TITLE,
        default: "N",
        tabIcon: item.tabIcon,
        link: item.PATH_NM,
      });
    },
    checkUserRole: (id, user_menu) => {
      var return_val = false;
      if (id) {
        if (user_menu) {
          for (var i = 0; i < user_menu.length; i++) {
            if (id === user_menu[i].C_NODE_NO) return_val = true;
          }
        }
      }
      return return_val;
    },
    checkUserAuth(){
      this.$api
        .post(
          "/api/palette-main/myAuth/inqire", //api url입력
          {
            USER_ID: this.$store.getters['userStore/GE_USER_ROLE'].userId,
          },
          {
            head: {
              SERVICE: "palette-main.myAuth",
              METHOD: "inqire",
              TYPE: "BIZ_SERVICE",
            },
          }
        )
        .then((response) => {
          this.AUTH = response.data.DATA[0].USER_AUTH;
          this.mixin_setRouter();
        })
        .catch((err) => {
          alert(err);
        });
    },

    //새로고침 라우터
    setRouter(){
      //좌측메뉴 만들기
      let menuList = this.$store.getters["userStore/GE_USER_MENU_LIST"];
      let len = menuList.length;
      let menu = [];
      for (let i = 0; i < len; i++) {
        menu[i] = {
          path: menuList[i].PATH_NM,
          name: menuList[i].NODE_TITLE
        };
      }
      setMenu(menu);
    },

    //메뉴명 변경 처리. 더 좋은 방법이 있겠지만 걍 무식하게 처리
    async changeMenuName() {
      //1depth 메뉴 변경
      for (let i = 0; i < this.items.length; i++) {
        //메뉴명 가져오기
        let get_title = await this.searchMatchMenu(
          this.items[i].id,
          this.items[i].title
        );
        //메뉴명 변경
        this.items[i].title = get_title;

        //2depth 가 있다면 2depth도 변경
        if (this.items[i].items) {
          //2depth 메뉴 변경
          for (let a = 0; a < this.items[i].items.length; a++) {
            //메뉴명 가져오기
            let get_title1 = await this.searchMatchMenu(
              this.items[i].items[a].id,
              this.items[i].items[a].title
            );

            //메뉴명 변경
            this.items[i].items[a].title = get_title1;

            //3depth 가 있다면 3depth도 변경
            if (this.items[i].items[a].items) {
              //메뉴명 가져오기
              for (let b = 0; b < this.items[i].items[a].items.length; b++) {
                let get_title2 = await this.searchMatchMenu(
                  this.items[i].items[a].items[b].id,
                  this.items[i].items[a].items[b].title
                );

                //메뉴명 변경
                this.items[i].items[a].items[b].title = get_title2;
              }
            }
          }
        }
      }
    },
    searchMatchMenu(id, title) {
      // console.log("##### [changeMenuName] id=", id);
      // console.log("##### [changeMenuName] title=", title);
      // console.log("##### [changeMenuName] this.user_menu=", this.user_menu);
      let set_title = title;
      for (let i = 0; i < this.user_menu.length; i++) {
        if (this.user_menu[i].C_NODE_NO === id) {
          set_title = this.user_menu[i].title;
        }
      }
      return set_title;
    },



  },
};
</script>

<style lang="scss" scoped>

</style>