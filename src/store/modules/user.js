const state = {
    loggedIn: false,
    id: "",
    nickname: "",
    avatarPath: "",
    realName: "",
    role: ""
}

const getters = {
    userInfo: (state) => {
        return {
            loggedIn: state.loggedIn,
            name: state.nickname,
            avatar: state.avatarPath,
            id: state.id,
            role: state.role
        }
    },
}

const mutations = {
    userLogin(state, user) {
        state.loggedIn = true
        state.id = user.userId
        state.nickname = user.userNickname
        state.avatarPath = user.userImage
        state.realName = user.userName
        console.log("in mutation", state)
    },

    uerAvatarChange(state, path) {
        state.avatarPath = path
    },

    userLogout(state) {
        state.loggedIn = false
        state.id = ""
        state.nickname = ""
        state.avatarPath = ""
        state.realName = ""
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations
}

