<template>
  <el-card class="post-list">
    <div class="divide-y">
      <div class="text-lg font-bold">
        求物帖动态
      </div>
      <div>
        <div
             v-for="p in posts"
             :key="p.postId"
             class="pt-2 text-gray-600"
        >
          <span class="hover:text-blue-500"><router-link :to="'/postDetail/' + p.postId">{{p.postTitle.replace(/^\s*|\s*$/g,"").substr(0,9) + (p.postTitle.replace(/^\s*|\s*$/g,"").length > 9 ? "..." : "")}} </router-link></span>
          <span class="float-right hover:text-blue-500"><router-link :to="'/user/' + p.userId">{{"@" + p.userNickname}}</router-link></span>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import {api} from "@/request";

export default {
  name: "PostListThumbnail",
  data() {
    return {
      posts: []
    }
  },
  mounted() {
    let data = {'pageNumber': 0, 'maxNumber': 6}
    api({
      url: 'post/posts',
      method: "GET",
      params: data
    }).then( response => {
      if (response.status == 200) {
        this.posts = response.data
        console.log(this.posts)
      }
    })
  }
}
</script>

<style scoped>
.post-list {
  position: relative;
  width: 20%;
  height: 100%;
  min-height: 100%;
  background: rgba(255,255,255,0.6);
  backdrop-filter: blur(2px);
}

.title {
  width: 10vw;
  max-width: 40px !important;
}
</style>