<template>
  <el-container>
    <!-- <el-main class="bg-no-repeat bg-cover bg-repeat" style="background-image: url('https://cdn.pixabay.com/photo/2014/12/15/15/36/cloth-569222_1280.jpg')">
     -->
    <el-main class="bg-cover bg-repeat">
      <center>
      <el-form ref="form" :model="form" label-width="80px" class="bg-gray-100 w-3/5 border-4 rounded-xl border-opacity-100 pt-6 pr-6">
        <el-form-item label="标题">
          <el-input v-model="form.name" placeholder="请输入标题" maxlength="30" show-word-limit @input="titleChange"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="form.desc" placeholder="请输入商品描述" maxlength="1000" show-word-limit rows="10" @input="contentChange"></el-input>
        </el-form-item>
        <el-form-item label="预期价格">
          <el-input v-model="form.price" placeholder="请输入预期价格" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="商品图片">
          <el-upload
              class="w-1/6 float-left"
              action=""
              ref="upload"
              accept=".jpg,.jpeg,.png"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-upload="beforeUpload"
              :http-request="upLoad"
              :limit="5"
              :on-exceed="handleExceed"
              :auto-upload="false"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button class="float-right" type="primary" @click="onSubmit">创建</el-button>
        </el-form-item>
      </el-form>
      </center>
    </el-main>
  </el-container>
</template>


<script>
import {api} from "../request";
import {useStore} from "vuex";
import {ElMessage} from "element-plus";

export default {
  name: "edit",
  data() {
    return {
      form: {
        name: '',
        desc: '',
        price: '',
      },
      file: [],
      ifTitle: false,
      ifContent: false,
    }
  },
  methods: {
    onSubmit() {
      if(this.ifTitle && this.ifContent) {
        // console.log("--------------");
        this.$refs.upload.submit();

        let formData = new FormData();
        let data={
          "postTitle":this.form.name,
          "postIntroduction":this.form.desc,
          "postPrice":this.form.price          
        }

        formData.append("formData", new Blob([JSON.stringify(data)], {type: "application/json"}));
        for(let i = 0;i < this.file.length;i++) {
          formData.append("files",this.file[i]);
          console.log(this.file[i]);
        }

        api({
          url: "post/postEdit",
          method: "POST",
          data: formData,
          headers: {
                'Content-Type': 'multipart/form-data'
            },
        }).then(
            (response) => {
              console.log(response);

              if (response.status === 200) {
                ElMessage.success({
                  message: "创建成功",
                  type: "success",
                })
                this.$router.push("/postDetail/"+response.data['postId']);
              }
              else{
                ElMessage.error({
                  message: "创建失败",
                  type: "error",
                })
              }
            }
        )
      }
      else {
        ElMessage.error({
          message: "标题或内容为空",
          type: "error",
        })
      }
    },
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
        message: "只能上传最多五张图片哦",
        type: "error",
      })
    },
    titleChange(){
      this.ifTitle = (this.form.name.length >= 1);
    },
    contentChange(){
      this.ifContent = (this.form.desc.length >= 1);
    },
  },
  setup() {
    let store = useStore()
    return {
      store,
    }
  }
}
</script>

<style scoped>
  .bg-repeat {
  background-image: url('https://img.tukuppt.com/bg_grid/00/12/50/WRuekkPYAY.jpg');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
}
</style>