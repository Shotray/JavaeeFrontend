<template>
  <el-main
    class="bg-gradient-to-r from-blue-200 to-blue-400 bg-opacity-100 bg-repeat"
  >
    <div
      class="
        rounded-2xl
        bg-gray-100
        border-black
        divide-y divide-black
        ml-32
        mr-32
      "
    >
      <div class="flex justify-center flex-col">
        <!-- 这个div是用户提供求物贴的图片 -->
        <div class="justify-center mt-8">
          <el-carousel
            v-if="Images.length !== 0"
            indicator-position="outside"
            type="card"
            :interval="4000"
            :autoplay="true"
            class="rounded-lg"
            height="350px"
          >
            <el-carousel-item v-for="item in Images" :key="item">
              <!-- <img class="window-img" :src = "'https://139.196.20.137:5001/'+item"> -->
              <div class="imgDiv">
                <img class="window-img" :src="item" />
              </div>
            </el-carousel-item>
          </el-carousel>
          <div v-else class="mt-8 w-full">
            <img
              class="window-img"
              src="https://th.bing.com/th/id/R.6a56fe9aa650a9ee6d0a47e289f9b1d2?rik=SmTCJTUafE08ug&riu=http%3a%2f%2fwww.zjmzzs.com%2fApp%2fTpl%2fHome%2fUploads%2fim_5b70eecb7c7e7.png&ehk=0XLqbMvt0yPS5x5I3l3zLCqvsjzPKP1AMyebryW1BPo%3d&risl=&pid=ImgRaw"
            />
          </div>
        </div>
        <div class="justify-center">
          <div class="">
            <!-- 这里是用户头像和名字 -->
            <div class="flex justify-center flex-row space-x-2">
              <!-- <el-avatar :src= "'https://139.196.20.137:5001/'+AvatarPath"></el-avatar> -->
              <el-avatar :src="AvatarPath"></el-avatar>
              <p class="py-2 text-xl md:text-2xl">{{ SenderName }}</p>
            </div>
          </div>

          <p class="font-black flex justify-center mt-4 text-xl md:text-2xl">
            {{ Title }}
          </p>
          <div class="flex flex-nowrap justify-center text-1xl">
            <p>发布时间：</p>
            <p>{{ Time }}</p>
          </div>

          <div class="flex justify-center space-x-20 md:space-x-96 mb-8">
            <el-button
            v-if="ownerID!=myUserID"
              type="primary"
              icon="el-icon-chat-dot-square"
              @click="sendContact"
              round
              >联系买家</el-button
            >
            <el-button
              v-else
              type="primary"
              icon="el-icon-chat-dot-square"
              @click="checkContact"
              round
              >查看消息</el-button
            >
            <comment :isRating="F" :userId="simpleUserId" :id="ID"></comment>
          </div>
          <!-- <div class="ml-20 flex float-right text-1xl">
              <p>点击举报</p>
              <report ></report>
            </div> -->
        </div>
      </div>
      <div>
        <el-tabs type="border-card" class="rounded-lg" @tab-click="handleClick">
          <el-tab-pane
            @click="canLoad = false"
            label="商品描述"
            class="ml-4 mr-2"
            >{{ Content }}</el-tab-pane
          >
          <el-tab-pane @click="canLoad = true" label="用户评论">
            <CommodityCommentList
              v-if="flag"
              :comments="PostComments"
              :can-load="true"
            ></CommodityCommentList>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </el-main>
</template>

<script>
// import report from "@/components/Public/Report";
import comment from "@/components/Public/comment";
import CommodityCommentList from "@/components/Public/CommodityCommentList";
import { api } from "@/request";

// import { toRaw } from '@vue/reactivity';
import { useStore } from "vuex";

export default {
  name: "PostDetail",
  components: {
    CommodityCommentList,
    comment,
  },
  data() {
    return {
      // Images :[

      //   "https://img2.baidu.com/it/u=2963238031,3642210617&fm=253&fmt=auto&app=138&f=JPEG?w=354&h=500",
      //   "https://img1.baidu.com/it/u=457993954,2292183590&fm=26&fmt=auto",
      //   "https://img14.360buyimg.com/pop/jfs/t1/187644/16/15000/274280/60fe0519E2ef4cf17/2927a2a62ece884a.jpg"
      // ],
      Images: [],
      Content: "这是一个商品的描述信息",
      SenderId: "",
      Time: "2021-12-19",
      Title: "",
      Sender: "",
      PostComments: ["123"],
      Status: "",
      ID: "",
      AvatarPath:
        "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Ftvax2.sinaimg.cn%2Fcrop.0.0.996.996.1024%2F00684JDgly8fhhjwmiw57j30ro0roq4s.jpg&refer=http%3A%2F%2Ftvax2.sinaimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1642484846&t=9363d31a7fb6ae50d2ebce257849edbf",
      SenderName: "xny",
      F: false,
      ownerID: "",
      rating: 0,
      flag: true,
      simpleUserId: "",
      myUserID:"",
      otherID:"",
      otherName:"",

    };
  },
  methods: {
    handleClick: function (tab) {
      this.canLoad = tab["props"]["label"] !== "商品描述";
    },

    sendContact() {
      // this.$router.push("/chat")
      this.$router.push({
        path: "/chat",
        query: {
          ID: this.ownerID,
          SenderName: this.SenderName,
          AvatarPath: this.AvatarPath,
        },
      });
    },
    checkContact() {
      api({
        url: "chat/friend",
        method: "get",
      }).then(
        (res) => {
          // console.log("------------==========");
          // console.log(res);
          this.otherID=res.data[0].userId;
          // console.log(this.otherID);
          this.otherName=res.data[0].userName;
          console.log(this.otherName);

          this.$router.push({
          path: "/chat",
          query: {
          ID: this.otherID,
          SenderName: this.otherName,
          AvatarPath: this.AvatarPath,
        },
      });
        },
        (error) => {
          console.log("错误了");
          console.log(error);
        }
      )
      
    },
    getData() {
      // let simpleUser = this.store.getters['user/userInfo']
      // this.simpleUserId = simpleUser.id
      api({
        url: "post/" + this.ID,
        method: "get",
        // params: {
        //   "postId": this.ID
        // },
      }).then(
        (res) => {
          console.log("--------------求物贴详情");
          console.log(res.data);
          var data = res.data;
          // this.Images = data.Images
          this.SenderName = data.postUser["userNickname"];
          this.AvatarPath = data.postUser["userImage"];
          // console.log(this.AvatarPath)
          this.Content = data.post["postIntroduction"];
          this.Time = data.post["postDate"];
          if (this.Time != null) {
            this.Time = this.Time.substring(0, 10);
          }
          console.log(this.Time);
          this.Title = data.post["postTitle"];
          for (let i = 0; i < data.postImages.length; i++) {
            this.Images.push(data.postImages[i]["imageUrl"]);
          }
          this.ownerID = data.post["userId"];
          console.log("ownerid---" + this.ownerID);
          console.log(this.Images);
          console.log(this.Title);
        },
        (error) => {
          console.log(error);
        }
      ),
      api({
          method: "GET",
          url: "/post/comment/" + this.ID,
        }).then(
          (response) => {
            console.log(response);
            this.PostComments = response.data
            this.flag = true
          },
          (error) => {
            error
          }
        ),
        api({
          method: "GET",
          url: "/me/info",
        }).then(
          (response) => {
            console.log(response);
            // console.log("12345667");
            if (response.status === 200) {
              console.log("请求成功了！！");
              this.myUserID=response.data.userId;
              console.log(this.myUserID);
              // this.user = response.data;
              // this.user = response.data.User
              // this.imageUrl = this.user.AvatarPath
            } else {
              // this.$router.push("/")
            }
          },
          (error) => {
            error
            // this.$router.push("/")
          }
        );
    },
  },
  created: function () {
    this.firstPlayFlag = false;
    this.$nextTick(() => {
      // console.log(this.$route.params)
      let temp = this.$route.params;
      // console.log(temp['ID'])
      if (temp["ID"] !== undefined) {
        this.ID = temp["ID"];
      } else {
        this.ID = "946710726649";
      }
      this.getData();
    });
  },
  setup() {
    let store = useStore();
    return {
      store,
    };
  },
};
</script>

<style scoped>
.el-header {
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
.bg-repeat {
  background-image: url("https://img.tukuppt.com/bg_grid/00/12/50/WRuekkPYAY.jpg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
}
</style>