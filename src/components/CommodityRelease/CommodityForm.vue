<template>
  <div class="form-box">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>


      <el-form-item label="分类" prop="category">
        <el-select v-model="ruleForm.category" placeholder="请选择物品分类">
          <el-option
              v-for="cat in categories"
              :key="cat[0]"
              :label="cat[0]"
              :value="cat[1]"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="商品价格" prop="price">
        <el-input-number
            v-model="ruleForm.price"
            :precision="2"
            :step="Math.ceil(ruleForm.price/10)"
            :max="9999"
            :min="0"
        ></el-input-number>
      </el-form-item>

      <el-form-item label="单位" prop="unit">
        <el-input v-model="ruleForm.unit" placeholder="输入单位" style="width: 200px">
          <template #prepend>每</template>
        </el-input>
      </el-form-item>

      <el-form-item label="商品库存" prop="stock">
        <el-input-number
            v-model="ruleForm.stock"
            :precision="0"
            :step="1"
            :max="100"
            :min="0"
        ></el-input-number>
      </el-form-item>

      <el-form-item label="商品简介" prop="desc">
        <el-input type="textarea" v-model="ruleForm.desc"></el-input>
      </el-form-item>

      <el-form-item label="商品图片" prop="images">
        <el-upload
            uid: file.uid
            list-type="picture-card"
            :auto-upload="false"
            :file-list="photoList"
            accept=".jpg,.jpeg,.png"
            :on-remove="handleRemove"
            :on-change="handleChange"
            :limit="5"
            :on-exceed="handleExceed"
        >
          <template #default>
            <i class="el-icon-plus"></i>
          </template>
          <template #file="{file}">
            <div>
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt=""/>
              <span class="el-upload-list__item-actions">
          <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleRemove(file)"
          >
            <i class="el-icon-delete"></i>
          </span>
        </span>
            </div>
          </template>
        </el-upload>
        <el-dialog v-model="dialogVisible">
          <img :src="dialogImageUrl" alt="opps">
        </el-dialog>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { api } from "@/request";
import { ElMessage } from "element-plus";
import { staticData } from "@/assets/js/static";

export default {
  name: "CommodityForm",
  data() {
    return {
      ruleForm: {
        name: "",
        category: "",
        forRent: false,
        price: 9.9,
        type: [],
        resource: "",
        desc: "",
        unit: "件",
        stock: 1,
      },
      rules: {
        name: [
          { required: true, message: "请输入商品名", trigger: "blur" },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur",
          },
        ],
        category: [{ required: true, message: "请选择分类", trigger: "blur" }],
        price: [{ required: true, message: "请输入价格", trigger: "blur" }],
        desc: [{ required: true, message: "请填写商品简介", trigger: "blur" }],
        images: [
          { required: false, message: "至少上传一张商品图片", trigger: "blur" },
        ],
        unit: [{ required: true, message: "请填写单位", trigger: "blur" }],
        stock: [{ required: true, message: "请填写库存", trigger: "blur" }],
      },
      photoList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      dynamicTags: [],
      inputVisible: false,
      inputValue: "",
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let formData = new FormData();
          // formData.append("goods_category", this.ruleForm.category)
          // formData.append("goods_name", this.ruleForm.name)
          // formData.append("goods_price", this.ruleForm.price)
          // formData.append("sell_num", this.ruleForm.stock)
          // formData.append("sell_status", 1)
          // formData.append("goods_introduction", this.ruleForm.desc)
          // formData.append("goods_favorite", 0)
          // formData.append("goods_unit", this.ruleForm.category)
          let data = {
            goodsCategory: this.ruleForm.category,
            goodsName: this.ruleForm.name,
            goodsPrice: this.ruleForm.price,
            sellNum: this.ruleForm.stock,
            sellStatus: 1,
            goodsIntroduction: this.ruleForm.desc,
            goodsFavorite: 0,
            goodsUnit: this.ruleForm.unit,
          };
          formData.append(
            "formData",
            new Blob([JSON.stringify(data)], { type: "application/json" })
          );
          for (let i = 0; i < this.photoList.length; i++) {
            console.log("file", this.photoList[i]);
            formData.append("files", this.photoList[i].raw);
          }

          api({
            method: "post",
            data: formData,
            url: "/commodity/publish",
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }).then(
            (response) => {
              console.log(response.data);
              if (response.status == 200) {
                ElMessage.success({
                  message: "上传成功",
                });
                this.$router.push("/me");
              } else {
                ElMessage.error({
                  message: "上传失败，请检查数据",
                });
              }
            },
            (error) => {
              console.log(error);
            }
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    handleClose(tag) {
      console.log("tags", this.dynamicTags);
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        console.log(_);
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },

    forRentChange(c) {
      if (c) {
        this.ruleForm.unit = "一天";
      } else {
        this.ruleForm.unit = "件";
      }
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    handleRemove(file) {
      console.log(file);
      for (var i = 0; i < this.photoList.length; i++) {
        if (file.uid == this.photoList[i].uid) {
          console.log(this.photoList[i].uid);
          this.photoList.splice(i, 1);
        }
      }
    },

    handleChange(file, list) {
      console.log("已经有" + this.photoList.length);
      this.photoList.push(list[list.length - 1]);

      // for (let i = 0; i < list.length; i++) {
      //   this.photoList.push(list[i])
      // }
      // console.log("上传的商品照片");
      // console.log(this.photoList);
    },
    handleExceed() {
      console.log("满了");
      ElMessage.error({
        message: "上传失败，已经达到最大照片数！",
      });
    },
  },
  setup() {
    let store = useStore();
    let categories = staticData.categories;
    return {
      store,
      categories,
    };
  },
};
</script>


<style scoped>
.form-box {
  display: inline-block;
  width: 50vw;
  min-width: 420px;
  margin: auto;
  text-align: left;
}

.input-new-tag {
  max-width: 4rem;
  width: 9vw;
}
</style>