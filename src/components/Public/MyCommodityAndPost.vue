<template>
  <center>
    <el-tabs type="border-card" class="w-3/5">
      <el-tab-pane class="order-box">
        <template #label>
          <span><i class="el-icon-s-goods"></i>发布的商品</span>
        </template>
        <div>
          <el-table
              :data="commodities">
            <el-table-column
            label="商品图片">
              <template #default="scope">
              <el-image
                  style="width: 100px; height: 100px"
                  :src='commodities[scope.$index].image'>
              </el-image>
              </template>
            </el-table-column>
            <el-table-column
                prop="goodsEntity.goodsName"
                label="商品名称"
                class="w-1/3">
            </el-table-column>
            <el-table-column
                prop="goodsEntity.goodsPrice"
                label="商品价格"
                class="w-1/3">
            </el-table-column>
            <el-table-column
                label="操作"
                class="w-1/3">
              <template #default="scope">
                <el-button type="primary" @click="viewCommodityDetail(scope.$index)">查看详情</el-button>
                <el-button type="primary" v-if="isMe" @click="deleteCommodity(scope.$index)">删除</el-button>
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
          <el-table
          :data="posts">
            <el-table-column
                prop="postTitle"
                label="标题"
                class="w-1/4">
            </el-table-column>
            <el-table-column
                prop="postIntroduction"
                label="内容"
                class="w-2/4">
            </el-table-column>
            <el-table-column
                label="操作"
                class="w-1/4">
              <template #default="scope">
               <el-button type="primary" @click="viewPostDetail(scope.$index)">查看详情</el-button>
                <el-button type="primary" v-if="isMe" @click="deletePost(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </center>
</template>

<script>
import {ElMessage} from "element-plus";
import {api} from "@/request";

export default {
  name: "MyCommodityAndPost",
  props: {
    isMe: Boolean,
    id: String,
  },
  data() {
    return {
      commodities: undefined,
      posts: undefined,
      postNumber: 0,
    }
  },
  methods: {
    viewPostDetail(index) {
      console.log(this.posts[index].postId)
      this.$router.push("/postDetail/"+this.posts[index].postId);
    },
    viewCommodityDetail(index) {
      this.$router.push("/commodityDetail/"+this.commodities[index].Id);
    },
    deletePost(index) {
      api({
        url: "post/delete",
        method: "DELETE",
        params: {
          id: this.posts[index].postId,
      }
      }).then(
          (response) => {
            console.log(response);

            if(response.status === 200) {
              ElMessage.success({
                message: "删除成功",
                type: "success",
              })
              this.posts.splice(index, 1)
              this.$forceUpdate()
              // location.reload();
            }
            else{
              ElMessage.error({
                message: "删除失败",
                type: "error",
              })
            }
          }
      )

    },
    deleteCommodity(index) {
      api({
        url: "commodity/delete",
        method: "DELETE",
        params: {
          id: this.commodities[index].goodsEntity.goodsId,
      }
      }).then(
          (response) => {
            console.log(response);

            if(response.status === 200) {
              ElMessage.success({
                message: "删除成功",
                type: "success",
              })
              this.commodities.splice(index, 1)
              this.$forceUpdate()
              // location.reload();
            }
            else{
              ElMessage.error({
                message: "删除失败",
                type: "error",
              })
            }
          }
      )
    },
  },
  mounted() {
    api({
      url:"/me/goods",
      method: "GET",
      params: {
        userId: this.id,
      }
    }).then(
        (response) => {
          console.log("这是啥玩")
          console.log(response);

          if(response.status === 200){
            this.commodities=response.data;
          }
        }
    )

    api({
      url: "post/postNumber",
      method: "GET",
      params: {
        userId: this.id,
      }
    }).then(
        (response) => {
          console.log(response);

          if(response.status === 200) {
            this.postNumber = response.data;

            api({
              url: "me/posts",
              method: "GET",
              params: {
                userId: this.id,
                maxNumber: this.postNumber,
              }
            }).then(
                (response) => {
                  console.log(response);

                  if(response.status === 200) {
                    this.posts = response.data;
                  }
                },

                (error) => {
                  console.log(error)
                  ElMessage.error({
                    message: '服务器在开小差...',
                    type: 'error'
                  })
                }
            )
          }
        },
    )
  },
}
</script>

<style scoped>

</style>