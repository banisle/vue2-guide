import Vue from "vue";
import VueRouter from "vue-router";
import DefaultLayout from "@/layouts/default/index";
import AuthLayout from "@/layouts/auth/index";
import AdminLayout from "@/layouts/admin/index";
import Login from "@/views/auth/Login";
import Home from "@/views/page/Home";
import Omni from "@/views/auth/Omni";
import CustInfo from "@/views/auth/CustInfo";
import Svy from "@/views/page/SVY_PREVIEW";
import LayoutPopup from "@/components/LayoutPopup";
import LayoutPopupTalk from "@/components/LayoutPopupTalk";
import LayoutSearchPopup from "@/components/LayoutSearchPopup";
import CompoPopCalendar from "@/components/csl/CompoPopCalendar";
import CompoAsPopScheduler  from "@/components/csl/CompoAsPopScheduler";

import NotFoundComponent from "@/components/NotFound";

Vue.use(VueRouter);

import store from "../store";

//token 인증 영역 (일단 token이 있기만하면 인증완료)
export const beforeAuth = (isAuth) => (from, to, next) => {
  //token이 없으면 login 페이지를 이동
  if ((window.sessionStorage.getItem("token") && isAuth) || !isAuth) {
    next();
  } else {
    // 로그인 화면으로 이동
    next("/guide");
  }
  //return next();
};

//AuthenticationLayout: header와 aside(메뉴)가 없는 백지 레이아웃 (로그인, 회원가입, 비밀번호 찾기등의 페이지에 사용)
//DefaultLayout: 기본적인 header와 aside(메뉴)가 있는 레이아웃 (거의 모든 메뉴에 적용)
export const routes = [
  {
    path: "/",
    redirect: '/guide',
    component: AuthLayout,
    children: [
      {
        path: "/",
        redirect: '/guide',
        name: "기본",
        component: Login,
        beforeEnter: beforeAuth(false),
      },
      {
        path: "/login",
        redirect: '/guide',
        name: "로그인",
        component: Login,
        beforeEnter: beforeAuth(false),
      },
      {
        path: "/guide",
        name: "가이드",
        component: () => import("@/Guide/pbGuide"),
        beforeEnter: beforeAuth(false),
      },
      {
        path: "/omni",
        name: "간편인증",
        component: Omni,
        beforeEnter: beforeAuth(false),
      },
      {
        path: "/custInfo/:custcoId/:sndrKey/:custId",
        name: "고객정보요청",
        component: CustInfo,
        beforeEnter: beforeAuth(false),
      },
      {
        path: "/svy",
        name: "설문 미리보기",
        component: Svy,
        beforeEnter: beforeAuth(false),
      },
      {
        path: "/LayoutPopup/:menuId",
        name: "LayoutPopup",
        component: LayoutPopup,
        beforeEnter: beforeAuth(false),
        props: true,
      },
      {
        path: "/LayoutPopupTalk/:menuId",
        name: "LayoutPopupTalk",
        component: LayoutPopupTalk,
        beforeEnter: beforeAuth(false),
        props: true,
      },
      {
        path: "/LayoutSearchPopup/:menuId",
        name: "LayoutSearchPopup",
        component: LayoutSearchPopup,
        beforeEnter: beforeAuth(false),
        props: true,
      },
      {
        path: "/CompoPopCalendar",
        name: "CompoPopCalendar",
        component: CompoPopCalendar,
        beforeEnter: beforeAuth(false),
        props: true,
      },
      {
        path: "/CompoAsPopScheduler",
        name: "CompoAsPopScheduler",
        component: CompoAsPopScheduler,
        beforeEnter: beforeAuth(false),
        props: true,
      },
    ],
  },
  {
    path: "/",
    component: DefaultLayout,
    children: [
      {
        path: "/home",
        name: "HOME",
        component: Home,
        beforeEnter: beforeAuth(false),
      },
      {
        path: "/CTE_M0300",
        name: "실적 평가 집계",
        component: () => import("@/views/page/CTE_M0300"),
        beforeEnter: beforeAuth(false),
      },
      {
        path: "/CTE_M0400",
        name: "평가비율 집계",
        component: () => import("@/views/page/CTE_M0400"),
        beforeEnter: beforeAuth(false),
      },
    ],
  },
  {
    path: "/",
    component: AdminLayout,
    children: [],
  },
  {
    path: '/:pathMatch(.*)*',
    component: NotFoundComponent
  },


];

// export function setMenu(menuList) {
//   for(let i=0; i < routes.length; i++){
//     if(i == 0){
//       const arrAuthLayoutChildren = [];
//       arrAuthLayoutChildren.push({path: "/", name: "기본", component: Login, beforeEnter: beforeAuth(false)});
//       arrAuthLayoutChildren.push({path: "/login", name: "로그인", component: Login, beforeEnter: beforeAuth(false)});
//       arrAuthLayoutChildren.push({path: "/omni", name: "간편인증", component: Omni, beforeEnter: beforeAuth(false)});
//       arrAuthLayoutChildren.push({path: "/custInfo/:custcoId/:sndrKey/:custId", name: "고객정보요청", component: CustInfo, beforeEnter: beforeAuth(false)});
//       arrAuthLayoutChildren.push({path: "/svy", name: "설문 미리보기", component: Svy, beforeEnter: beforeAuth(false)});
//       arrAuthLayoutChildren.push({path: "/LayoutPopup/:menuId", name: "LayoutPopup", component: LayoutPopup, beforeEnter: beforeAuth(false)});
//       arrAuthLayoutChildren.push({path: "/LayoutPopupTalk/:menuId", name: "LayoutPopupTalk", component: LayoutPopupTalk, beforeEnter: beforeAuth(false)});
//       arrAuthLayoutChildren.push({path: "/LayoutSearchPopup/:menuId", name: "LayoutSearchPopup", component: LayoutSearchPopup, beforeEnter: beforeAuth(false)});
//       arrAuthLayoutChildren.push({path: "/CompoPopCalendar", name: "CompoPopCalendar", component: CompoPopCalendar, beforeEnter: beforeAuth(false)});
//       arrAuthLayoutChildren.push({path: "/CompoAsPopScheduler", name: "CompoAsPopScheduler", component: CompoAsPopScheduler, beforeEnter: beforeAuth(false)});
//       for (let k = 0; k < menuList.length; k++) {
//         if(menuList[k] != undefined && menuList[k].viewTrgt != undefined && menuList[k].viewTrgt==="DEV"){
//           arrAuthLayoutChildren.push({path: menuList[k].path, name: menuList[k].name, component: () => import("@/Guide/pbGuide"), isGuide: true, beforeEnter: beforeAuth(false)});
//         }
//       }
//       routes[0].children = [];
//       routes[0].children = arrAuthLayoutChildren;
//     }else if(i == 1){
//       const arrDefaultLayoutChildren = [];
//       arrDefaultLayoutChildren.push({path: "/home", name: "HOME", component: Home, beforeEnter: beforeAuth(false)});

//       for (let k = 0; k < menuList.length; k++) {
//         if(menuList[k] != undefined && menuList[k].viewTrgt != undefined &&  menuList[k].viewTrgt!="DEV"){
//           // console.log(menuList[k]);
//           arrDefaultLayoutChildren.push({path: menuList[k].path, name: menuList[k].name, component: () => import("@/views/page"+`${menuList[k].path}`), isGuide: true, beforeEnter: beforeAuth(false)});
//         }
//       }

//       routes[1].children = [];
//       routes[1].children = arrDefaultLayoutChildren;
//     }
//   }
//   resetRouter();
// }

function resetRouter() {
  const newRouter = new VueRouter({
    mode: "history",
    routes,
  })
  router.matcher = newRouter.matcher
}

const router = new VueRouter({
  mode: "history",
  routes,
});

router.afterEach((to, from) => {

  // 타이틀 변경 처리. 추후 필요시 수정필요함.
  let title = "LHCS 콜센터";
  let companyName = store.getters['userStore/GE_USER_COMPANY'].CD_NM;
  if( companyName !== undefined && companyName !== '') {
    title = title + "("+ companyName+")";
  }
  Vue.nextTick(() => {
    // document.title = title + (to.name === undefined ? '' : ' - '+to.name);
    document.title = title + (to.name === undefined ? '' : '');
  });
});

export default router;
