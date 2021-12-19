<template>

  <el-main class="bg-gradient-to-r from-blue-200 to-blue-400 bg-opacity-100 bg-repeat">
    <div class=" rounded-2xl bg-gray-100 border-black divide-y divide-black ml-32 mr-32" >
      <div class="flex justify-center flex-col">
        <!-- 这个div是用户提供求物贴的图片 -->
        <div class="justify-center mt-8">
          <el-carousel  v-if="Images.length !== 0" indicator-position="outside" type="card" :interval="4000" :autoplay= true class="rounded-lg" height="350px">
            <el-carousel-item  v-for="item in Images" :key="item">
              <!-- <img class="window-img" :src = "'https://139.196.20.137:5001/'+item"> -->
              <div class="imgDiv">
                <img class="window-img" :src = "item">
              </div>    
            </el-carousel-item>
          </el-carousel>
          <div v-else class="mt-8 w-full ">
            <img class="window-img" src= "https://th.bing.com/th/id/R.6a56fe9aa650a9ee6d0a47e289f9b1d2?rik=SmTCJTUafE08ug&riu=http%3a%2f%2fwww.zjmzzs.com%2fApp%2fTpl%2fHome%2fUploads%2fim_5b70eecb7c7e7.png&ehk=0XLqbMvt0yPS5x5I3l3zLCqvsjzPKP1AMyebryW1BPo%3d&risl=&pid=ImgRaw">
          </div>
        </div>
        <div class="justify-center">
          <div class="">
            <!-- 这里是用户头像和名字 -->
            <div class="flex justify-center flex-row space-x-2 ">
              <!-- <el-avatar :src= "'https://139.196.20.137:5001/'+AvatarPath"></el-avatar> -->
              <el-avatar :src= "AvatarPath"></el-avatar>
              <p class="py-2 text-xl md:text-2xl">{{SenderName}}</p>
            </div>
            
          </div>

          <p class="font-black flex justify-center mt-4 text-xl md:text-2xl">{{Title}}</p>
          <div class="flex flex-nowrap justify-center text-1xl">
            <p>发布时间：</p>
            <p >{{Time}}</p>
          </div>

          <div class="flex justify-center space-x-20 md:space-x-96">
            <el-button type="primary" icon="el-icon-chat-dot-square" @click="sendContact" round>联系买家</el-button>
            <comment :isRating="F" :userId="simpleUserId" :id="ID" ></comment>

          </div>
          <div class="ml-20 flex float-right text-1xl">
              <!-- 举报按钮 -->
              <p>点击举报</p>
              <report ></report>
            </div>
        </div>
      </div>
      <div>
        <el-tabs type="border-card" class="rounded-lg" @tab-click="handleClick">
          <el-tab-pane @click="canLoad=false" label="商品描述" class="ml-4 mr-2">{{ Content }}</el-tab-pane>
          <el-tab-pane @click="canLoad=true" label="用户评论">
            <CommodityCommentList v-if="flag" :comments="PostComments" :can-load="true" ></CommodityCommentList>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </el-main>

</template>

<script>

import report from "@/components/Public/Report";
import comment from "@/components/Public/comment";
import CommodityCommentList from "@/components/Public/CommodityCommentList";
import {api} from "@/request";

import { toRaw } from '@vue/reactivity';
import {useStore} from "vuex";




export default {
  name: "PostDetail",
  components: {
    report,CommodityCommentList,comment
  },
  data() {
    return {

      Images :[

        "https://img2.baidu.com/it/u=2963238031,3642210617&fm=253&fmt=auto&app=138&f=JPEG?w=354&h=500",
        "https://img1.baidu.com/it/u=457993954,2292183590&fm=26&fmt=auto",
        "https://img14.360buyimg.com/pop/jfs/t1/187644/16/15000/274280/60fe0519E2ef4cf17/2927a2a62ece884a.jpg"
      ],
      Content :"这是一个商品的描述信息",
      SenderId :"",
      Time :"2021-12-19",
      Title :"课程书籍",
      Sender: "",
      PostComments:["123"],
      Status :"",
      ID : "",
      AvatarPath:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Ftvax2.sinaimg.cn%2Fcrop.0.0.996.996.1024%2F00684JDgly8fhhjwmiw57j30ro0roq4s.jpg&refer=http%3A%2F%2Ftvax2.sinaimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1642484846&t=9363d31a7fb6ae50d2ebce257849edbf",
      SenderName:"xny",
      F: false,

      rating:0,
      flag :true,
      simpleUserId :''

    }
  },
  methods:{
    handleClick: function (tab) {
      this.canLoad = tab['props']['label'] !== '商品描述';
    },

    sendContact() {
      let formData = new FormData()
      formData.append("senderId", this.simpleUserId)
      formData.append('receiverId', this.SenderId)
      formData.append("content", "Hi, 我看了你的帖子《" + this.Title + '》')

      api({
        method: "post",
        url: 'chat',
        data: formData
      }).then( response => {
        if (response.data.Code === '200') {
          this.$router.push("/notification")
        }
      })
    },

    getData(){
      // let simpleUser = this.store.getters['user/userInfo']
      // this.simpleUserId = simpleUser.id
      api({
        url: "post/"+this.ID,
        method: "get"
      }).then(
          (res) => {
            // console.log(res.data)
            var data = res.data.Post
            this.Images = data.Images
            this.SenderName = data.SenderName
            this.SenderId = data.SenderId
            this.AvatarPath = data.AvatarPath
            // console.log(this.AvatarPath)
            this.Content = data.Content
            this.Time = data.Time
            this.Time=this.Time.replace("T"," ").substr(0,19);
            this.Title = data.Title
            this.PostComments = data.PostComments
            let t = []
            data.Comments.forEach(element => {
              let temp={
                userName: element.SenderName,
                userImage: 'https://139.196.20.137:5001/'+element.AvatarPath,
                userId: element.SenderId,
                comment: element.Content,
                rating: -1
              }
              t.push(temp)
            });
            this.comments = toRaw(t)
            this.flag = true

          },
          (error) => {
            console.log(error)
          })

    }
  },
  created: function() {
    this.firstPlayFlag = false
    this.$nextTick(() => {
      // console.log(this.$route.params)
      let temp = this.$route.params
      // console.log(temp['ID'])
      if (temp['ID'] !== undefined) {
        this.ID = temp['ID']
      } else {
        this.ID = "946710726649"
      }
      // this.getData()
    })

  },
  setup(){
    let store = useStore()
    return{
      store
    }

  },

}
</script>

<style scoped>
.el-header{
  background: #0f1423;
}
.imgDiv {
  display: flex;
  justify-content: center;
  align-items: center;
}
.window-img {
  width: auto;
  height: 350px;
}
.bg-repeat{
     background-image:url('https://cdn.pixabay.com/photo/2014/12/15/15/36/cloth-569222_1280.jpg');
                background-repeat:no-repeat;
                background-size:100% 100%;
                -moz-background-size:100% 100%;
  }

</style>