<template>
  <el-main>
    <div>
      <el-container class="h-24 flex justify-around items-center">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </el-container>
      <div class="grid grid-cols-2">
        <div class="ml-32 rounded-lg border-gray-300 border">
          <div>
            <el-carousel
              v-if="images.length !== 0"
              loopindicator-position="outside"
              :interval="4000"
              :autoplay="true"
              class="rounded-lg"
            >
              <el-carousel-item v-for="url in images" :key="url">
                <img class="window-img" :src="url" />
              </el-carousel-item>
            </el-carousel>
            <el-carousel-item v-if="video !== undefined && video !== ''">
              <video controls="controls" @click="clickVideo()">
                <source :src="video" type="video/mp4" />
              </video>
            </el-carousel-item>
          </div>

          <br />

          <div
            class="
              bg-blue-100
              text-center
              grid
              justify-items-center
              items-center
            "
          >
            <div class="mr-16 mt-6 flex items-center justify-start pl-16">
              <div><font class="mb-8 pl-16">价格：</font></div>
              <div>
                <font class="text-2xl font-bold mt-4 text-red-600 pr-16">
                  ￥{{ price ? price : "9999" }}
                </font>
              </div>
            </div>

            <div class="mr-8 mt-6 flex items-center justify-start">
            </div>
          </div>
        </div>

        <div class="border-red-300 ml-12 grid justify-items-center">
          <div class="mt-8">
            <p class="text-center px-3 py-3 text-3xl font-bold">
              {{ name ? name : "超好用拖鞋寝室外出沙滩旅游打小孩居家必备" }}
            </p>
          </div>

          <div class="rounded-lg border-2 border-blue-200">
            <div class="grid grid-cols-2 pt-8 pr-8 pl-12 pr-12">
              <div>
                <user-and-avatar
                  :is-owner-avatar-success="isOwnerAvatarSuccess"
                  :owner-avatar="ownerAvatar"
                  :owner-name="ownerName"
                  class="flex items-center"
                ></user-and-avatar>
              </div>
              <div class="ml-12">
                <!-- <report class="ml-2"></report> -->
              </div>

              <div class="mr-12 mt-6 flex items-center justify-start">
                <div>
                  <font class="mb-8">热度：&nbsp;&nbsp;&nbsp;&nbsp;</font>
                </div>
                <div>
                  <font class="text-2xl font-bold mt-4 text-red-600">
                    {{ likes * 10 + 3 * clicks + 3 }}
                  </font>
                </div>
              </div>
              <div class="ml-12 mt-6 flex items-center justify-start">
                <img
                  v-show="isLike === false"
                  @click="star"
                  src="https://img.icons8.com/android/24/000000/star.png"
                />
                <img
                  v-show="isLike === true"
                  @click="star"
                  src="https://img.icons8.com/material-rounded/24/000000/star--v1.png"
                />
                <el-dialog v-model="isLikeDialog" title="收藏">
                  <el-table
                    :data="favorites"
                    style="width: 100%"
                    max-height="250"
                  >
                    <el-table-column
                      prop="name"
                      label="Favorites Name"
                    />
                    <el-table-column label="Operations">
                      <template #default="scope">
                        <el-button
                          type="text"
                          size="small"
                          @click="addGoodsToFavorites(scope.$index, favorites)"
                        >
                          添加
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-dialog>
                <div><font class="mb-8"> ：&nbsp;</font></div>
                <div>
                  <font class="text-2xl font-bold mt-4 text-red-600">
                    {{ likes }}
                  </font>
                </div>
              </div>
            </div>
          </div>

          <br />
          <el-input-number
            v-model="shoppingCartCount"
            :min="1"
            :max="stock"
          ></el-input-number>

          <div class="flex justify-around mt-8">
            <div class="mr-8 ml-8">
              <buy-commodity
                :buyer="userName"
                :commodity-name="name"
                :price="price"
                :for_rent="for_rent"
                :commodity-id="String(commodityId)"
                :seller-id="String(ownerId)"
                :stock="stock"
                :buyNum="shoppingCartCount"
              ></buy-commodity>
            </div>

            <div></div>

            <div class="mr-8 ml-8">
              <el-button type="danger" @click="addShoppingCart()"
                >加入购物车</el-button
              >
            </div>
          </div>
        </div>

        <div
          class="
            border-green-300
            col-span-2
            ml-32
            mr-16
            mt-12
            w-2/3
            justify-self-center
          "
        >
          <el-tabs
            type="border-card"
            class="rounded-lg"
            @tab-click="handleClick"
          >
            <el-tab-pane
              @click="canLoad = false"
              label="商品描述"
              class="ml-4 mr-2"
              >{{ description }}</el-tab-pane
            >
            <!-- <el-tab-pane @click="canLoad = true" label="用户评论">
              <CommodityCommentList
                :comments="comments"
                :can-load="canLoad"
              ></CommodityCommentList>
            </el-tab-pane> -->
          </el-tabs>
        </div>
        <br />
        <br />
      </div>
    </div>
  </el-main>
</template>

<script>
import { ElMessage } from "element-plus";
import BuyCommodity from "@/components/CommodityDetail/BuyCommodity";
// import report from "@/components/Public/Report";
// import RentCommodity from "@/components/CommodityDetail/RentCommodity";
import UserAndAvatar from "@/components/Public/UserAndAvatar";
// import CommodityCommentList from "@/components/Public/CommodityCommentList";
import { api } from "@/request";
import { useStore } from "vuex";

export default {
  name: "CommodityDetail",
  components: {
    // report,
    BuyCommodity,
    UserAndAvatar,
    // CommodityCommentList,
  },
  data: function () {
    return {
      commodityId: "1",
      userId: "1",
      userName: "1",
      ownerName: "rzc",
      ownerAvatar: "https://i.loli.net/2021/05/18/vWptQgAlsTqdxrK.png",
      name: "自动编程机",
      former_price: 100,
      price: 66.66,
      likes: 0,
      description:
        "  " +
        "自动编程机，只要点击就可以通过你的意念进行编程。如果你不会编程也没事，你可以通过" +
        "意念来指定编程目标，然后该机器就会自动帮你生成代码。有了它，后端开发无需为调不来数据库而烦恼，前端不必为" +
        "网格对其而烦心",
      stock: 12,
      isAutoChange: true,
      for_rent: false,
      images: [],
      video: "",
      status: "九成新",
      popularity: 55,
      clicks: 666,
      tags: ["好用"],
      comments: [],
      category: "课程用品",
      isLike: true,
      isOwnerAvatarSuccess: true,
      dialogFormVisible: false,
      isAlert: true,
      tagTypes: ["success", "", "info", "warning", "danger"],
      canLoad: false,
      shoppingCartCount: 0,
      isLikeDialog: false,
      favorites: [],
    };
  },
  mounted() {
    this.$nextTick(() => {
      let user = this.store.getters["user/userInfo"];
      this.userId = user.id;
      this.userName = user.name;
      console.log('+++++++++++++')
      console.log(user)
      console.log(this.userName)
      console.log(this.$route.fullPath);
      let temp = this.$route.fullPath.split("/");
      temp = temp[temp.length - 1];
      console.log(temp);
      console.log("-----------------------------------");
      if (temp !== undefined) {
        this.commodityId = temp;
      } else {
        this.commodityId = 1;
      }

      let FormData = require("form-data");
      let data = new FormData();
      data.append("commodityId", this.commodityId);
      console.log(data);
      api({
        url: "/commodity/detailed?commodityId=" + this.commodityId,
        method: "get",
      }).then((response) => {
        console.log(response.data);
        this.ownerName = response.data["userName"];
        this.ownerAvatar = response.data["userImage"];
        this.name = response.data["goodsName"];
        this.likes = response.data["likes"];
        this.description = response.data["description"];
        this.category = response.data["category"];
        this.price = response.data["price"];
        this.stock = response.data["stock"];
        for (let i = 0; i < response.data["goodsImage"].length; i++) {
          this.images.push(response.data["goodsImage"][i]);
        }
      });
      api({
        url:"/favorites/getFavorites",
        method : "get",
      }).then((response) => {
        for(let i = 0;i < response.data.length; i++) {
          var resData = response.data[i];
          temp = {};
          temp["favoritesId"] = resData["favoriteId"];
          temp["name"] = resData["favoriteName"];
          this.favorites.push(temp);
        }
      })
      api({
        url:"/favorites/check/goods?goodsId="+this.commodityId,
        method : "get",
      }).then((response) => {
        console.log(response);
        if(response.data === true){
          this.isLike = true;
        }
        else{
          this.isLike = false;
        }
      })

    });
  },
  methods: {
    getCommodityDetail: function () {
      if (this.commodityId !== undefined) {
        let i = 0;
        i++;
        return i;
      }
    },
    handleClick: function (tab) {
      this.canLoad = tab["props"]["label"] !== "商品描述";
    },
    clickVideo: function () {
      this.isAutoChange = !this.isAutoChange;
    },
    star: function () {
      this.isLike = !this.isLike;
      if (this.isLike === true) {
        this.likes += 1;
        this.isLikeDialog = true;
      } else {
        this.likes -= 1;
        api({
        url: "/favorites/delete/goods?goodsId="+this.commodityId,
        method: "delete",
        })
        .then((response) => {
          console.log(response);
          this.isLikeDialog = false;
          ElMessage.success({
            message: "从收藏夹中删除成功",
            type: "success",
          });
        })
        .catch( (error) =>{
          console.log(error);
          ElMessage.error("从收藏夹中删除失败");
        });
      }
    },
    addShoppingCart: function () {
      //发送请求
      var data = {};
      data["goodsId"] = this.commodityId;
      data["count"] = this.shoppingCartCount;
      console.log(data);

      api({
        url: "/commodity/add/shoppingCart",
        method: "post",
        data: data,
      })
        .then(function (response) {
          console.log(JSON.stringify(response.data));
          ElMessage.success({
            message: "加入购物车成功",
            type: "success",
          });
        })
        .catch(function (error) {
          console.log(error);
          ElMessage.error("加入购物车失败");
        });
    },
    addGoodsToFavorites:function (index,rows){
      var data = {};
      data["favoriteId"] = rows[index].favoritesId
      data["goodsId"] = this.commodityId
       api({
        url: "/favorites/add/goods",
        method: "post",
        data: data,
      })
        .then((response) => {
          console.log(response);
          this.isLikeDialog = false;
          ElMessage.success({
            message: "加入收藏夹成功",
            type: "success",
          });
        })
        .catch( (error) =>{
          console.log(error);
          ElMessage.error("加入收藏夹失败");
        });
    },
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
.el-carousel__item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.el-main {
  background: -webkit-linear-gradient(
    left top,
    #2f90b9 2.5%,
    #1781b5 7.5%,
    #93b5cf 20%,
    #d8e3e7 50%,
    #93b5cf 70%,
    #1781b5 92.5%,
    #2f90b9 97.5%
  ); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(
    bottom right,
    #000,
    #fff
  ); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(
    bottom right,
    #000,
    #fff
  ); /* Firefox 3.6 - 15 */
  /* background-color: #93b5cf; */
  background-image: linear-gradient(#5698c3, #d1c2d3);
}

.carousel-image {
  max-width: 100%;
  max-height: 100%;
}
</style>