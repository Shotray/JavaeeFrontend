<template>
  <el-main class="bg-repeat">
  <div>
    <el-row class="p-14">
      <el-col :span="5" :offset="4">
        <el-card :body-style="{ padding: '35px' }">
          <div class="demo-basic--circle">
            <!-- <img v-if="imageUrl" :src="'https://139.196.20.137:5001/' + imageUrl" class="avatar"> -->
            <img src="https://img0.baidu.com/it/u=4114387071,3424465155&fm=26&fmt=auto" alt="">
          </div>
        </el-card>
      </el-col>
      <el-col :span="10" :offset="1">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>用户信息</span>
              
            </div>
          </template>
          <div class="text item">
            用户昵称：{{ user.Nickname }}
          </div>
          <div class="text item">
            专业：{{
              majors.find((i) => {
                return i.value === user.Major
              }).label
            }} <span class="w-4"></span> 年级：{{
              grades.find((i) => {
                return i.value === String(user.Grade)
              }).label
            }}
          </div>
          <div class="text item">
            用户信用值：{{ user.Credit }}
          </div>
          <div class="text item">
            用户个性签名：{{ user.Brief }}
          </div>
        </el-card>
      </el-col>
    </el-row>
    <MyCommodityAndPost :isMe=false :id=id></MyCommodityAndPost>
  </div>
  </el-main>
</template>

<script>
import {api} from "@/request";
import {staticData} from "@/assets/js/static";
import MyCommodityAndPost from "../components/Public/MyCommodityAndPost";

export default {
  name: "Home",
  components: {MyCommodityAndPost},
  props: {
    id: String,
  },
  data () {
    return {
      imageUrl: null,
      user: {
        "userNickname": "null",
        "userName": "null",
        "userPhone": "0000000000",
        "userSex": "null",
        "userImage": "null"
      },
    }
  },
  mounted() {
    api({
      method: 'GET',
      url: "user/" + this.id
    }).then( response => {
      if (response.status === 200) {
        this.user = response.data.User
        this.imageUrl = this.user.userImage
      }
    })
  },
  setup() {
    const grades = staticData.grades
    const majors = staticData.majors
    console.log("in Me setup")
    return {
      grades,
      majors
    }
  }
}
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

.bg-repeat{
     background-image:url('https://img.tukuppt.com/bg_grid/00/12/50/WRuekkPYAY.jpg');
                background-repeat:no-repeat;
                background-size:100% 100%;
                -moz-background-size:100% 100%;
  }
</style>