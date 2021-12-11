<template>
  <el-main>
    <div v-for="item in tableData" :key="item.favoritesName">
      <el-row>
        <h2 class="page-section-title">{{ item.favoritesName }}</h2>
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
  background-image: linear-gradient(#3a353f, #505668);
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
      tableData: [
        {
          favoritesName: "Hello",
          goods: [
            {
              picture:
                "https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png",
              name: "test",
              price: 100,
              offset: 0,
            },
            {
              picture:
                "https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png",
              name: "test",
              price: 100,
              offset: 1,
            },
            {
              picture:
                "https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png",
              name: "test",
              price: 100,
              offset: 1,
            },
          ],
        },
        {
          favoritesName: "Hello1",
          goods: [
            {
              picture:
                "https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png",
              name: "test",
              price: 100,
              offset: 0,
            },
          ],
        },
        {
          favoritesName: "Hello2",
          goods: [
            {
              picture:
                "https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png",
              name: "test",
              price: 100,
              offset: 0,
            },
          ],
        },
      ],
    };
  },
  mounted() {
    console.log(this.tableData[1].goods.name);
    this.$nextTick(() => {
      let user = this.store.getters["user/userInfo"];
      let userId = user.id;
      console.log("Likes/" + userId.replaceAll('"', ""));
      const that = this;
      api({
        url: "Likes/" + userId.replaceAll('"', ""),
        method: "get",
      })
        .then(function (response) {
          console.log(JSON.stringify(response.data));
          that.tableData = [];
          for (let i = 0; i < response.data["ItemList"].length; i++) {
            let temp = {};
            temp["price"] = Number(
              response.data["ItemList"][i]["CommodityPrice"]
            );
            temp["commodity"] = response.data["ItemList"][i]["CommodityName"];
            temp["id"] = response.data["ItemList"][i]["CommodityId"];
            temp["image"] =
              "https://139.196.20.137:5001/" +
              response.data["ItemList"][i]["CommodityCover"];
            that.tableData.push(temp);
          }
        })
        .catch(function (error) {
          console.log(error);
          ElMessage.error({
            message: "服务器在开小差...",
            type: "error",
          });
        });
    });
  },
  methods: {
    deleteRow(index, rows) {
      let commodityId = rows[index]["id"];
      let user = this.store.getters["user/userInfo"];
      let userId = user.id;

      var FormData = require("form-data");
      var data = new FormData();
      data.append("userId", userId);
      data.append("commodityId", commodityId);
      console.log(data.get("userId"));
      console.log(data.get("commodityId"));
      api({
        url: "Likes",
        method: "post",
        data: data,
      })
        .then(function (response) {
          console.log(JSON.stringify(response.data));
          rows.splice(index, 1);
          ElMessage.success({
            message: "取消收藏成功",
            type: "success",
          });
        })
        .catch(function (error) {
          console.log(error);
          ElMessage.error({
            message: "服务器在开小差...",
            type: "error",
          });
        });
    },
    buyCommodity(index, rows) {
      console.log(rows[index]);
      this.$router.push({
        path: "/CommodityDetail/" + rows[index]["id"],
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


