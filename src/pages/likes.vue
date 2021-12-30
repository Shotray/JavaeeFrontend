<template>
  <el-main>
    <div v-for="item in tableData" :key="item.favoritesName">
      <el-row>
        <el-col :span="20">
          <h2 class="page-section-title">{{ item.favoritesName }}</h2>
        </el-col>
        <el-col :span="1">
          <el-button
            type="info"
            icon="el-icon-delete"
            circle
            @click="deleteFavorites(item)"
          >
          </el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col
          v-for="data in item.goods"
          :key="data.name"
          :span="4"
          :offset="data.offset"
        >
          <el-card shadow="hover" class="card">
            <el-image :src="data.picture"> </el-image>
            <div style="padding: 14px">
              <span>{{ data.name }}</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <el-row class="row">
      <el-col offset="12">
        <el-button type="primary" plain @click="isVisible = true">+</el-button>
        <el-dialog v-model="isVisible">
          <el-form
            :model="ruleForm"
            status-icon
            :rules="rules"
            label-width="120px"
          >
            <el-form-item label="收藏夹名称" prop="favoritesName">
              <el-input v-model.number="favoritesName"></el-input>
            </el-form-item>
          </el-form>

          <template #footer>
            <span class="dialog-footer">
              <el-button @click="isVisible = false">取 消</el-button>
              <el-button type="primary" @click="clickAddButton">确 定</el-button>
            </span>
          </template>
        </el-dialog>
      </el-col>
    </el-row>
  </el-main>
</template>

<style scoped>
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
  /* background-image: linear-gradient(#3a353f, #505668); */
  background-image: linear-gradient(#5698c3, #d1c2d3);
  color: #e6e6e6;
  font-family: "Helvetica Neue", sans-serif;
}

.title {
  margin: 0;
  font-size: clamp(3rem, 10vw, 6rem);
}

.page-section-title {
  margin: calc(var(--space) / 2) 0;
  padding: 0 var(--space);
  font-size: clamp(2rem, 5vw, 3rem);
}

.el-card {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 3px 3px 6px 3px rgba(0, 0, 0, 0.3);
  border-width: 0px;
  color: #e6e6e6;
}

.el-button {
  /* height: 50px;
  width: 50px; */
  top: 40px;
}

.row {
  text-align: center;
}
</style>

<script>
import { useStore } from "vuex";
import { api } from "@/request";
import { ElMessage } from "element-plus";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

export default {
  name: "likes",
  props: {
    title: String,
    img: String,
  },
  data() {
    return {
      tableData: [],
      isVisible: false,
      favoritesName:""
    };
  },
  mounted() {
    api({
      url: "/favorites/getFavorites/goods",
      method: "get",
    })
      .then((response) => {
        console.log(response);
        this.tableData = response.data["favoritesGoods"];
        console.log(response.data["favoritesName"]);
        console.log(this.tableData);
      })
      .catch((error) => {
        console.log(error);
        ElMessage.error({
          message: "服务器在开小差...",
          type: "error",
        });
      });
  },
  methods: {
    clickAddButton() {
      if(this.favoritesName == "") {
        ElMessage.error({
          message: "收藏夹名不能为空！",
          type: "error",
        });
        return;
      }
      this.isVisible = false;
      var data = {};
      data["favoritesName"] = this.favoritesName;
      api({
      url: "/favorites/createFavorites",
      method: "post",
      data:data
    })
      .then((response) => {
        console.log(response);
        var temp = {};
        temp["favoritesId"] = response.data["favoritesId"];
        temp["favoritesName"] = response.data["favoritesName"];
        temp["goods"] = []
        this.tableData.push(temp);
        this.$forceUpdate();
            ElMessage.success({
            message: "添加收藏夹成功",
            type: "success",
          });
        this.favoritesName = "";
      })
      .catch((error) => {
        console.log(error);
        ElMessage.error({
          message: "服务器在开小差...",
          type: "error",
        });
      });
    },
    deleteFavorites(item) {
      console.log(item);
      api({
        url: "/favorites/deleteFavorites/" + item["favoritesId"],
        method: "delete",
      })
        .then((response) => {
          console.log(response.data);
          this.tableData.splice(this.tableData.indexOf(item), 1);
          console.log(this.tableData);
          this.$forceUpdate();
          ElMessage.success({
            message: "删除收藏夹成功",
            type: "success",
          });
        })
        .catch((error) => {
          console.log(error);
          ElMessage.error({
            message: "服务器在开小差...",
            type: "error",
          });
        });
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总价";
          return;
        }
        if (index === 3) {
          sums[index] = 0;
          for (let i = 0; i < this.tableData.length; i++) {
            sums[index] += Number(data[i]["price"]) * Number(data[i]["count"]);
          }
          sums[index] += " 元";
        }
      });
      console.log(sums);
      return sums;
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


