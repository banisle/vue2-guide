const maintoastStore = {
  namespaced: true,
  state: {
    maintoast: [],
  },
  getters: {
    GE_MAINTOAST: (state) => state.maintoast,
  },
  mutations: {
    MU_ADDTOAST(state, maintoast) {
      state.maintoast.push(maintoast);
    },
    // MU_DELTOAST(state, maintoast) {
    //   state.maintoast.splice(state.maintoast.indexOf(maintoast), 1);
    // },
    MU_DELTOAST(state, toastId) {
      state.maintoast = state.maintoast.filter(toast => toast.id !== toastId);
    }

  },
  actions: {
    AC_SHOWTOAST({ commit }, maintoast) {
      // commit('MU_ADDTOAST', maintoast)
      // setTimeout(() => {
      //   commit('MU_DELTOAST', maintoast)
      // }, 5000) // 알림이 표시되는 시간
      const newToast = {
        ...maintoast,
        id: Date.now()  // 고유한 id 생성
      };
      commit('MU_ADDTOAST', newToast);
    }
  }
};
export default maintoastStore;