<template>
  <div class="pt-32 pr-96 pl-96 bg-repeat">
    <p class="font-black flex justify-center mb-16 text-xl md:text-2xl">
      信息修改
    </p>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="用户昵称">
        <el-input v-model="ruleForm.userNickname"></el-input>
      </el-form-item>
      <el-form-item label="真实姓名">
        <el-input v-model="ruleForm.userName"></el-input>
      </el-form-item>
      <el-form-item label="电话号码">
        <el-input v-model="ruleForm.userPhone"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="ruleForm.userSex" placeholder="请选择您的性别">
          <el-option
            v-for="cat in sex"
            :key="cat[0]"
            :label="cat[0]"
            :value="cat[1]"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="新的头像">
        <el-upload
          class="w-1/6 float-left"
          action=""
          ref="upload"
          accept=".jpg,.jpeg,.png"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-upload="beforeUpload"
          :http-request="upLoad"
          :limit="1"
          :on-exceed="handleExceed"
          :auto-upload="false"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>

      <el-form-item class="pt-16">
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-space :size="64" spacer=" ">
            <router-link to="/me"
              ><el-button type="primary" @click="submitForm()"
                >提交修改</el-button
              ></router-link
            >
            <el-button @click="resetForm">重置修改</el-button>
          </el-space>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { api } from "@/request";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { staticData } from "@/assets/js/static";
export default {
  data() {
    return {
      file:[],
      user: {
        userNickname: "",
        userName: "",
        userPhone: "",
        userSex: "",
      },
      ruleForm: {
        userNickname: "",
        userName: "",
        userPhone: "",
        userSex: "",
      },
      rules: {
        userNickname: [
          { required: false, message: "请输入用户昵称", trigger: "blur" },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur",
          },
        ],
        userName: [
          { required: false, message: "请输入个性签名", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度在 1 到 10 个字符",
            trigger: "blur",
          },
        ],
        userPhone: [
          { required: false, message: "请输入手机号", trigger: "blur" },
          {
            min: 11,
            max: 11,
            message: "请输入正确的手机号格式",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    handlePreview(file) {
      console.log(file);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    beforeUpload(file) {
      this.file.push(file);
    },
    upLoad() {
      console.log("upload successfully");
    },
    handleExceed(){
      ElMessage.error({
        message: "只能上传最多1张图片哦",
        type: "error",
      })
    },
    submitForm() {
      // let id = this.store.getters['user/userInfo'].id;

      if (
        this.ruleForm.userNickname &&
        this.ruleForm.userName &&
        this.ruleForm.userPhone
      ) {

        this.$refs.upload.submit();
        let data={
          "userNickname":this.ruleForm.userNickname,
          "userName":this.ruleForm.userName,
          "userPhone":this.ruleForm.userPhone,
          "userSex":this.ruleForm.userSex
        }
        if (this.file.length > 0) {
          let formData = new FormData();
          formData.append("image", this.file[0]);
          api({
            url: "me/image",
            method: "POST",
            data: formData,
            headers: {
              'Content-Type': 'multipart/form-data'
            },

        }).then((response) => {
          console.log("==========touxiang========")
          console.log(response);

          if (response.status === 200) {
            ElMessage.success({
              message: "修改成功",
              type: "success",
            });
          } else {
            ElMessage.error({
              message: "修改失败",
              type: "error",
            });
          }
        },
        (error) => {
          console.log(formData)
          console.log(error)
        })
        }
        // console.log(formData.get("info"))
        // if (this.file.length == 0) {
        //   formData.append("image", "no image");
        // }
        // for(let i = 0;i < this.file.length;i++) {
        //   formData.append("image",this.file[i]);
        //   console.log(this.file[i]);
        // }

        api({
          url: "me/edit",
          method: "POST",
          data: data,
        }).then((response) => {
          console.log("==========touxiang========")
          console.log(response);

          if (response.status === 200) {
            ElMessage.success({
              message: "修改成功",
              type: "success",
            });
          } else {
            ElMessage.error({
              message: "修改失败",
              type: "error",
            });
          }
        },
        (error) => {

          console.log(error)
        })
      }
    },
    resetForm() {
      // location.reload();
      api({
        method: "GET",
        url: "/me/info",
      }).then(
        (response) => {
          console.log(response);
          if (response.status === 200) {
            this.user = response.data;
            this.ruleForm = response.data;
          } else {
            ElMessage.error({
              message:
                "出了点小问题..." +
                (response.data.Description ? response.data.Description : ""),
            });
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

      // this.ruleForm = this.user;
      // console.log(this.user)
      // console.log(this.ruleForm)
    },
  },
  mounted() {
    api({
      method: "GET",
      url: "/me/info",
    }).then(
      (response) => {
        console.log(response);
        if (response.status === 200) {
          this.user = response.data;
          this.ruleForm = response.data;
        } else {
          ElMessage.error({
            message:
              "出了点小问题..." +
              (response.data.Description ? response.data.Description : ""),
          });
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
  },
  setup() {
    let store = useStore();
    let sex = staticData.sex;
    return {
      store,
      sex,
    };
  },
};
</script>

<style scoped>
.bg-repeat {
  background-image: url("https://img.tukuppt.com/bg_grid/00/12/50/WRuekkPYAY.jpg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  height: 100%;
}
</style>
