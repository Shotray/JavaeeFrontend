<template>
  <el-main class="bg-repeat">
    <div>
      <el-row class="p-14">
        <el-col :span="5" :offset="2">
          <el-card class="avatar-card" :body-style="{ padding: '35px' }">
            <img :src="user.userImage" alt="" />
            <!-- <el-upload
              class="avatar-uploader"
              :before-upload="beforeAvatarUpload"
              :show-file-list="false"
            >
              <div id="wrap">
                <div id="box">
                  <img
                    v-if="imageUrl"
                    :src="'https://139.196.20.137:5001/' + imageUrl"
                    class="avatar"
                  />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </div>
              </div>
            </el-upload> -->
          </el-card>
        </el-col>
        <el-col :span="14" :offset="1">
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span>用户信息</span>
                <router-link to="/editInfo">
                  <el-button class="button" type="text">修改信息</el-button>
                </router-link>
              </div>
            </template>
            <div class="text item">用户昵称：{{ user.userNickname }}</div>
            <div class="text item">真实姓名：{{ user.userName }}</div>
            <div class="text item">性别：{{ user.userSex ? "男" : "女" }}</div>
            <div class="text item">电话号码：{{ user.userPhone }}</div>
          </el-card>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg pb-20" justify="space-around">
        <el-tabs type="border-card">
          <el-tab-pane class="order-box">
            <template #label>
              <span><i class="el-icon-s-goods"></i>订单管理</span>
            </template>
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <!-- <el-tab-pane name="second">
                <template #label>
                  <span><i class="el-icon-document"></i>进行中</span>
                </template>
                <MyOrders
                    :type="'UNPAID'"
                >

                </MyOrders>
              </el-tab-pane> -->
              <el-tab-pane name="first">
                <template #label>
                  <span><i class="el-icon-document-checked"></i>我的订单</span>
                </template>
                <MyOrders :type="'PAID'"> </MyOrders>
              </el-tab-pane>
            </el-tabs>
          </el-tab-pane>
        </el-tabs>
      </el-row>
      <el-row  type="flex" class="row-bg pb-20" justify="space-around">
          <!-- <MyCommodityAndPost :isMe="true" :id="id"></MyCommodityAndPost> -->
          <el-tabs type="border-card">
            <el-tab-pane class="order-box">
              <template #label>
                <span><i class="el-icon-s-goods"></i>发布的商品</span>
              </template>
              <div>
                <el-table :data="commodities">
                  <el-table-column label="商品图片">
                    <template #default="scope">
                      <el-image
                        style="width: 100px; height: 100px"
                        :src="commodities[scope.$index].image"
                      >
                      </el-image>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="goodsEntity.goodsName"
                    label="商品名称"
                    class="w-1/3"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="goodsEntity.goodsPrice"
                    label="商品价格"
                    class="w-1/3"
                  >
                  </el-table-column>
                  <el-table-column label="操作" class="w-1/3">
                    <template #default="scope">
                      <el-button
                        type="primary"
                        @click="viewCommodityDetail(scope.$index)"
                        >查看详情</el-button
                      >
                      <el-button
                        type="primary"
                        @click="deleteCommodity(scope.$index)"
                        >删除</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
            <el-tab-pane class="order-box">
              <template #label>
                <span><i class="el-icon-date"></i>发布的求物帖</span>
              </template>
              <div>
                <el-table :data="posts">
                  <el-table-column prop="postTitle" label="标题" class="w-1/4">
                  </el-table-column>
                  <el-table-column
                    prop="postIntroduction"
                    label="内容"
                    class="w-2/4"
                  >
                  </el-table-column>
                  <el-table-column label="操作" class="w-1/4">
                    <template #default="scope">
                      <el-button
                        type="primary"
                        @click="viewPostDetail(scope.$index)"
                        >查看详情</el-button
                      >
                      <el-button
                        type="primary"
                        @click="deletePost(scope.$index)"
                        >删除</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
          </el-tabs>
      </el-row>
    </div>
  </el-main>
</template>

<script>
import { useStore } from "vuex";
import { api } from "@/request";
import { ElMessage } from "element-plus";
import { staticData } from "@/assets/js/static";
import MyOrders from "@/pages/MyOrders";
// import MyCommodityAndPost from "../components/Public/MyCommodityAndPost";

export default {
  name: "Home",
  components: {  MyOrders },
  data() {
    return {
      activeName: "second",
      fits: ["fill", "contain", "cover", "none", "scale-down"],
      user: {
        userNickname: "null",
        userName: "null",
        userPhone: "0000000000",
        userSex: "null",
        userImage: "null",
      },
      simpleUser: undefined,
      imageUrl: "",
      file: [],
      commodities: undefined,
      posts: undefined,
      postNumber: 0,
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },

    beforeAvatarUpload(file) {
      console.log("files", file);
      let formData = new FormData();
      this.file.push(file);
      for (let i = 0; i < this.file.length; i++) {
        formData.append("files", this.file[i]);
        console.log(this.file[i]);
      }

      api({
        // 需要商量url
        method: "put",
        // url: "user/" + this.id,
        url: "/me/image",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then((response) => {
        console.log(response);
        if (response.status === 200) {
          ElMessage.success("上传成功！");
          api({
            method: "get",
            url: "/me/info",
          }).then((res) => {
            if (res.status === 200) {
              console.log("更改头像了------------");
              console.log(res);
              // this.imageUrl = res.data.User.AvatarPath;
              // this.store.commit("user/uerAvatarChange", this.imageUrl);
            }
          });
        }
      });
    },
    viewPostDetail(index) {
      console.log(this.posts[index].postId);
      this.$router.push("/postDetail/" + this.posts[index].postId);
    },
    viewCommodityDetail(index) {
      console.log(this.commodities[index]);
      this.$router.push("/commodityDetail/" + this.commodities[index].Id);
    },
    deletePost(index) {
      api({
        url: "post/delete",
        method: "DELETE",
        params: {
          id: this.posts[index].postId,
        },
      }).then((response) => {
        console.log(response);

        if (response.status === 200) {
          ElMessage.success({
            message: "删除成功",
            type: "success",
          });
          location.reload();
        } else {
          ElMessage.error({
            message: "删除失败",
            type: "error",
          });
        }
      });
    },
    deleteCommodity(index) {
      api({
        url: "commodity/delete",
        method: "DELETE",
        params: {
          id: this.commodities[index].goodsEntity.goodsId,
        },
      }).then((response) => {
        console.log(response);

        if (response.status === 200) {
          ElMessage.success({
            message: "删除成功",
            type: "success",
          });
          location.reload();
        } else {
          ElMessage.error({
            message: "删除失败",
            type: "error",
          });
        }
      });
    },
  },
  mounted() {
    this.simpleUser = this.store.getters["user/userInfo"];
    if (!this.simpleUser.loggedIn) {
      // this.$router.push("/login")
      return;
    }
    api({
      method: "GET",
      url: "/me/info",
    }).then(
      (response) => {
        console.log(response);
        // console.log("12345667");
        if (response.status === 200) {
          this.user = response.data;
          // this.user = response.data.User
          // this.imageUrl = this.user.AvatarPath
        } else {
          ElMessage.error({
            message:
              "出了点小问题..." +
              (response.data.Description ? response.data.Description : ""),
          });
          // this.$router.push("/")
        }
      },
      (error) => {
        console.log(error);
        ElMessage.error({
          message: "出了点小问题...",
        });
        // this.$router.push("/")
      }
    );
    api({
      url: "/me/goods",
      method: "GET",
      params: {
        userId: this.id,
      },
    }).then((response) => {
      if (response.status === 200) {
        this.commodities = response.data;
      }
    });

    api({
      url: "post/postNumber",
      method: "GET",
      params: {
        userId: this.id,
      },
    }).then((response) => {
      console.log(response);

      if (response.status === 200) {
        this.postNumber = response.data;

        api({
          url: "me/posts",
          method: "GET",
          params: {
            userId: this.id,
            maxNumber: this.postNumber,
          },
        }).then(
          (response) => {
            console.log(response);

            if (response.status === 200) {
              this.posts = response.data;
            }
          },

          (error) => {
            console.log(error);
            ElMessage.error({
              message: "服务器在开小差...",
              type: "error",
            });
          }
        );
      }
    });
  },
  setup() {
    let store = useStore();
    let id = store.getters["user/userInfo"].id;
    const grades = staticData.grades;
    const majors = staticData.majors;
    console.log("in Me setup");
    return {
      grades,
      majors,
      store,
      id,
    };
  },
};
</script>

<style scoped>
@import url("//unpkg.com/element-plus/lib/theme-chalk/index.css");

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.avatar-card {
  min-height: 300px;
}

.box-card {
  min-height: 300px;
}

.avatar {
  min-height: 15vw;
}

#wrap {
  width: 100%;
  height: 100%;
}

#box {
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  position: relative;
  border-radius: 50%;
}

#circleImg {
  width: 100%;
}

.order-box {
  width: 70vw;
  min-width: 600px;
  height: 50vh;
  min-height: 400px;
  overflow: auto;
}

.bg-repeat {
  background-image: url("https://img.tukuppt.com/bg_grid/00/12/50/WRuekkPYAY.jpg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
}
</style>