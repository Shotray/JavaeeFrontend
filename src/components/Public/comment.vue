<template>
  <div>
    <el-button type="primary" icon="el-icon-s-comment" round @click="dialogFormVisible = true" >评论</el-button>

    <el-dialog v-model="dialogFormVisible">
      <el-form :model="form">
       <div class="block" v-if="isRating">
        <span class="demonstration">请为商品评分</span>
        <el-slider
          v-model="form.rating"
          max = 10
          show-input
          show-stops>
        </el-slider>
      </div>
        <el-form-item >
          <p>请填写评论内容</p>
          <el-input v-model="form.content"></el-input>
        </el-form-item>
      </el-form>
  
      <template #footer>
                <span class="dialog-footer">
                  <el-button @click="dialogFormVisible = false">取 消</el-button>
                  <el-button type="primary" @click="comment()">确 定</el-button>
                </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>

import {ElMessage} from "element-plus";
import {api} from "@/request";

export default {
  name: "PostComment",
  props:{
    isRating :Boolean,
    userId :String,
    id :String,

  },
  data: function () {
    return {
      form: {
        content: '',rating :Number
      },
      dialogFormVisible: false,
    }
  },
  methods: {
    comment: function () {
      if(this.form.content){      
        this.dialogFormVisible = false
          let url="post/comment"
          console.log(url)
          let data = {
            'content': this.form.content,
            'id': this.id
          }
          api({
            method: "POST",
            url: url,
            data: data,
          }).then((res) => {
            console.log(res)
            ElMessage.success({
              message: "评论成功！"
            })
          }, (error) => {
            console.log(error)
            ElMessage.error({
              message: "出了点问题...一会儿再试吧"
            })
          })
        }
        this.form.content=""
        this.form.rating =0
      }
    
  }
}
</script>

<style scoped>

</style>