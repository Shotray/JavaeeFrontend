<template>

  <el-main>
    <div class="w-full grid grid-cols-9">
      <div></div>

      <el-table
          :data="tableData"
          height="700"
          show-summary
          :summary-method="getSummaries"
          stripe="true"
          @selection-change="handleSelectionChange"
          style="width: 100%" class="col-span-7 mt-16 mb-8 rounded-lg border border-grey-200">

        <el-table-column
            type="selection"
            label="选择" width="50" align="center">
        </el-table-column>
        <el-table-column
            prop="image"
            label="商品图片" width="275" align="center">

          <template #default="scope">
          <span style="margin-left: 10px" class="text-xl font-semibold ">
            <center><img
                class="w-44 h-44 rounded-b-none rounded-xl"
                :src="scope.row.image ? scope.row.image : 'https://i.loli.net/2021/05/18/vWptQgAlsTqdxrK.png'"
            ></center>
          </span>
          </template>
        </el-table-column>

        <el-table-column
            prop="commodity"
            label="商品名" width="200" align="center">
          <template #default="scope">
          <span style="margin-left: 10px" class="text-xl font-semibold ">
            {{ scope.row.commodity }}
          </span>
          </template>
        </el-table-column>

        <el-table-column
            prop="price"
            label="单价" width="200" class="col-span-1" align="center">
        </el-table-column>

        <el-table-column
            prop="count"
            label="购物车中数量" width="200" class="col-span-1" align="center">
        <template #default="scope">
          <el-input-number v-model="scope.row.count" @change="handleChange(scope.$index, tableData)" :min="1" :max="100" label="描述文字"></el-input-number>
        </template>
            
        </el-table-column>

        <el-table-column
            fixed="right"
            label="操作"
            class="col-span-3" align="center">
          <template #default="scope">
            <el-button
                @click.prevent="deleteRow(scope.$index, tableData)"
                type="primary" class="mr-8">
              移除
            </el-button>

            <el-button type="primary" class="ml-8"
                       @click.prevent="buyCommodity(scope.$index, tableData)">
              结算
            </el-button>


          </template>
        </el-table-column>

      </el-table>
      

    </div>
    <el-form ref="ruleForm" label-width="100%">
  <el-form-item label-width="0">
     <el-button type="primary" @click.prevent="settlement">结算</el-button>
  </el-form-item>
</el-form>

  </el-main>
  
</template>
<script>
import {useStore} from "vuex";
import {api} from "@/request";
import {ElMessage} from "element-plus";

export default {
  name: "ShoppingCart",
  props: {
    title: String,
    img: String,
  },
  data() {
    return {
      tableData: [],
      selectedList: [],
    };
  },
  mounted() {
    this.$nextTick(() => {
      const that = this
      api({
        url: "shoppingCart",
        method: "get",
      })
          .then(function (response) {
            console.log(JSON.stringify(response.data[0]['image']));
            that.tableData = []
            for (let i = 0; i < response.data.length; i++) {
              let temp = {}
              temp['count'] = Number(response.data[i]['count'])
              temp['price'] = Number(response.data[i]['goodsPrice'])
              temp['commodity'] = response.data[i]['goodsName']
              temp['id'] = response.data[i]['goodsId']
              temp['image'] = response.data[i]['image']
              that.tableData.push(temp)
            }
          })
          .catch(function (error) {
            console.log(error);
            ElMessage.error({
              message: '服务器在开小差...',
              type: 'error'
            })
          });
    })
  },
  methods: {
    settlement(){
      for (var item of this.selectedList){
        console.log(item.count)
      }
    },
    handleSelectionChange (val) {
      console.log('选中的表格', val)
      this.selectedList = val
    },
    handleChange(index, rows) {
      console.log(index);
      let goodsId = rows[index]['id']
      let count = rows[index]['count']
      let data = {"goodsId": goodsId, 'count': count}
      api({
        url: "shoppingCart/changeCount",
        method: "put",
        params: data,
      })
        .then(function (response) {
          console.log(JSON.stringify(response.data));
          if (response.status == 200) {
            ElMessage.success({
              message: '修改成功',
              type: 'success'
            });
          }
        })
        .catch(function (error) {
          console.log(error);
          ElMessage.error({
            message: '服务器在开小差...',
            type: 'error'
          })
        });
    },
    deleteRow(index, rows) {
      let goodsId = rows[index]['id']
      let data = {"goodsId": goodsId}
      console.log(data)
      api({
        url: "shoppingCart",
        method: "delete",
        params: data,
      })
        .then(function (response) {
          console.log(JSON.stringify(response.data));
          if (response.status == 200) {
            rows.splice(index, 1);
            ElMessage.success({
              message: '删除成功',
              type: 'success'
            });
          }
        })
        .catch(function (error) {
          console.log(error);
          ElMessage.error({
            message: '服务器在开小差...',
            type: 'error'
          })
        });
    },
    buyCommodity(index, rows) {
      console.log(rows[index]);
      this.$router.push({
        path: '/CommodityDetail/' + rows[index]['id'],
      })
    },
    getSummaries(param) {
      const {columns, data} = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = '总价';
          return;
        }
        if (index === 4) {
          sums[index] = 0
          for (let i = 0; i < this.tableData.length; i++) {
            sums[index] += Number(data[i]["price"]) * Number(data[i]["count"])
          }
          sums[index] = sums[index].toFixed(2)
          sums[index] += ' 元';
        }
      });
      return sums;
    },
  },

  setup() {
    let store = useStore()
    return {
      store
    }
  }
}
</script>


<style scoped>
@import url("//unpkg.com/element-plus/lib/theme-chalk/index.css");
.el-main {
  background: -webkit-linear-gradient(left top, #2f90b9 2.5%, #1781b5 7.5%, #93b5cf 20%, #d8e3e7 50%, #93b5cf 70%, #1781b5 92.5%, #2f90b9 97.5%); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(bottom right, #000, #fff); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(bottom right, #000, #fff); /* Firefox 3.6 - 15 */
  background-color: #93b5cf;
}

.el-form-item{
  text-align: center;
}


</style>