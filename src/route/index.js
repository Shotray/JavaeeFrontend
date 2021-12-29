import {createRouter, createWebHashHistory} from "vue-router";
// import {CookieManager} from "@/cookie";
import {api} from "@/request";

const Home = () =>
    import ("../pages/Home")
const CommoditySearch = () =>
    import ("../pages/CommoditySearch")
const CommodityDetail = () =>
    import ("../pages/CommodityDetail")
const PublishCommodity = () =>
    import("../pages/PublishCommodity")

const Login = () =>
    import ("../pages/Login")
const LoginPanel = () =>
    import ("../components/LoginPage/LoginPanel")
const RegisterPanel = () =>
    import ("../components/LoginPage/RegisterPanel")

const Me = () =>
    import ("../pages/Me")
const EditInfo = () =>
    import ("../pages/EditInfo")
const OrderDetail = () =>
    import ("../pages/OrderDetail")
const OrderDetermine = () =>
    import ("../pages/OrderDetermine")

const Notification = () =>
    import ("../pages/Notification")

const Posts = () =>
    import ("../pages/Posts")
const PostDetail = () =>
    import ("../pages/PostDetail")
const PostEdit = () =>
    import ("../pages/PostEdit")

const Others = () =>
    import ("../pages/Others")
const likes = () =>
    import ("../pages/likes")
const ShoppingCart = () =>
    import ("../pages/ShoppingCart")
const Chat = ()=>import ("../components/Chat/Chat")


function loginGuard(to, from, next) {
    console.log("from", from, "to", to)
    api({
        method: "POST",
        url: "user/autoLogin",
    }).then((response) => {
        console.log("autoLogin", response)
        if (response.status == 200) {
            next()
        } else {
            if (from.fullPath === '/login') {
                next()
            }
            next({name: "LoginPanel", params: {next: to.fullPath}})
        }
    }, error => {
        console.log(error)
        next({name: "LoginPanel", params: {next: to.fullPath}})
    })
}

const routes = [
    {
        path: "/login",
        name: "Login",
        component: Login,
        children: [
            {
                path: "",
                name: "LoginPanel",
                component: LoginPanel,
                props: true
            },
            {
                path: "register",
                name: "RegisterPanel",
                component: RegisterPanel,
            }
        ]
    },
    {
        path: "/",
        name: "HomePage",
        component: Home
    },
    {
        path: "/me",
        name: "me",
        component: Me,
        beforeEnter: loginGuard
    },
    {
        path: "/editInfo",
        name: "editPersonalInfo",
        component: EditInfo,
        beforeEnter: loginGuard
    },
    {
        path: "/notzification",
        name: "Notification",
        component: Notification,
        beforeEnter: loginGuard
    },
    {
        path: "/orderDetail/:OrderId",
        name: "OrderDetail",
        component: OrderDetail,
        beforeEnter: loginGuard
    },
    {
        path: "/postDetail/:ID",
        name: "PostDetail",
        component: PostDetail,
        props: true
    },
    {
        path: "/commoditySearch",
        name: "CommoditySearch",
        component: CommoditySearch
    },
    {
        path: "/commodityDetail/:commodityId",
        name: "CommodityDetail",
        component: CommodityDetail,
        props: true
    },
    {
      path: "/publishCommodity",
      name: "PublishCommodity",
      component: PublishCommodity,
        beforeEnter: loginGuard
    },
    {
        path: "/user/:id",
        name: "User",
        component: Others,
        props: true
    },
    {
        path: "/likes",
        name: "likes",
        component: likes,
        beforeEnter: loginGuard
    },
    {
        path: "/shoppingCart",
        name: "ShoppingCart",
        component: ShoppingCart,
        beforeEnter: loginGuard
    },
    {
        path: "/posts",
        name: "Posts",
        component: Posts
    },
    {
        path: "/postEdit",
        name: "PostEdit",
        component: PostEdit,
        beforeEnter: loginGuard
    },
    {
        path: "/OrderDetermine",
        name: "OrderDetermine",
        component: OrderDetermine,
        beforeEnter: loginGuard
    },
    {
        path: "/chat",
        name: "Chat",
        component: Chat,
        beforeEnter: loginGuard
    }
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})