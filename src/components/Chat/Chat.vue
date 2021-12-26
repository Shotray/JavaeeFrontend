<template>
    <!-- <div class="chat-box">
      <ol class="chat">
        <Bubble
            v-for="c in record"
            :data="c"
            :key="c.Time"
            :me="c.SenderId === me"
            :a-path="c.SenderId === me ? meAvatar : otherAvatar"
        ></Bubble>
      </ol>
      <input class="textarea" type="text" placeholder="Type here!" v-model="content">
      <el-button type="primary" round class="flex justify-end " @click="send">发送</el-button>
    </div> -->
    <!-- partial:index.partial.html -->
    <el-container>
      <el-main class="bg-repeat">
        <div class="container clearfix">
          
            <nav class="menu">
                <ul class="items">
                    <li class="item" id="homePage">
                        <i class="fa fa-home" aria-hidden="true"></i>
                    </li>
                    <li class="item" id="friendPage">
                        <i class="fa fa-user" aria-hidden="true"></i>
                    </li>
                    <li class="item item-active" id="chatPage">
                        <i class="fa fa-commenting" aria-hidden="true"></i>
                    </li>
                    <li class="item" id="groupPage">
                        <i class="fa fa-users" aria-hidden="true"></i>
                    </li>
                </ul>
            </nav>
            <div class="people-list" id="people-list">
                <div class="search">
                    <input type="text" placeholder="search" />
                    <i class="fa fa-search"></i>
                </div>
                <ul class="list">

                </ul>
            </div>

            <div class="dialog">
                <p class="header">好友列表</p>
                <ul class="list">

                </ul>
                <button class="cancel">取消</button>
            </div>

            <div class="chat">
                <div class="chat-header clearfix">
                    <img class="chatImg" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_01_green.jpg" alt="avatar" />
                    <div class="chat-about">
                        <div class="chat-with">Chat with Vincent Porter</div>
                    </div>
                    <i class="fa fa-star"></i>
                </div>
                <!-- end chat-header -->

                <div class="chat-history">
                    <ul>
                        <li class="clearfix">
                            <div class="message-data align-right">
                                <span class="message-data-time">10:10 AM, Today</span> &nbsp; &nbsp;
                                <span class="message-data-name">Olia</span> <i class="fa fa-circle me"></i>
                            </div>
                            <div class="message other-message float-right">
                                Hi Vincent, how are you? How is the project coming along?
                            </div>
                        </li>

                        <li>
                            <div class="message-data">
                                <span class="message-data-name"><i class="fa fa-circle online"></i> Vincent</span>
                                <span class="message-data-time">10:12 AM, Today</span>
                            </div>
                            <div class="message my-message">
                                Are we meeting today? Project has been already finished and I have results to show you.
                                <div class="operation">
                                    <button class="recall">撤回</button>
                                    <button class="transmit">转发</button>
                                </div>
                            </div>
                        </li>

                        <li class="clearfix">
                            <div class="message-data align-right">
                                <span class="message-data-time">10:14 AM, Today</span> &nbsp; &nbsp;
                                <span class="message-data-name">Olia</span> <i class="fa fa-circle me"></i>
                            </div>

                            <div class="message other-message float-right">
                                Well I am not sure. The rest of the team is not here yet. Maybe in an hour or so? Have you faced any problems at the last phase of the project?
                            </div>
                        </li>

                        <li class="clearfix">
                            <div class="message-data align-right">
                                <span class="message-data-time">10:14 AM, Today</span> &nbsp; &nbsp;
                                <span class="message-data-name">Olia</span> <i class="fa fa-circle me"></i>
                            </div>

                            <div class="recallMessage float-right">
                                撤回了一条消息
                            </div>
                        </li>

                        <li>
                            <div class="message-data">
                                <span class="message-data-name"><i class="fa fa-circle online"></i> Vincent</span>
                                <span class="message-data-time">10:20 AM, Today</span>
                            </div>
                            <div class="message my-message">
                                Actually everything was fine. I'm very excited to show this to our team.
                            </div>
                        </li>

                        <li>
                            <div class="message-data">
                                <span class="message-data-name"><i class="fa fa-circle online"></i> Vincent</span>
                                <span class="message-data-time">10:20 AM, Today</span>
                            </div>
                            <div class="recallMessage">
                                对方撤回了一条消息
                            </div>
                        </li>

                        <li>
                            <div class="message-data">
                                <span class="message-data-name"><i class="fa fa-circle online"></i> Vincent</span>
                                <span class="message-data-time">10:31 AM, Today</span>
                            </div>
                            <i class="fa fa-circle online"></i>
                            <i class="fa fa-circle online" style="color: #AED2A6"></i>
                            <i class="fa fa-circle online" style="color:#DAE9DA"></i>
                        </li>

                    </ul>

                </div>
                <!-- end chat-history -->

                <div class="chat-message clearfix">
                    <textarea name="message-to-send" id="message-to-send" placeholder="Type your message" rows="3"></textarea>

                    <i class="fa fa-file-o"><input type="file" id="myfile" accept="image/*"></i>
                    <i class="fa fa-file-image-o"></i>

                    <button class="send">Send</button>

                </div>
                <!-- end chat-message -->

            </div>
            <!-- end chat -->

        </div>
      </el-main>
    </el-container>
    <!-- end container -->
</template>

<script>
// import Bubble from "@/components/Chat/Bubble";
import {ElMessage} from "element-plus";
import {api} from "@/request";

export default {
  name: "Chat",
  data() {
    return {
      content: "",
      meAvatar: "",
      otherAvatar: ""
    }
  },
  props: {
    other: String,
    me: String,
    record: Array
  },
  // components: {Bubble},
  methods: {
    send() {
      if (this.content === '') {
        ElMessage.error({
          message: "内容不能为空"
        })
      } else {
        let fd = new FormData()
        fd.append("senderId", this.me)
        fd.append("receiverId", this.other)
        fd.append("content", this.content)
        api({
          method: "POST",
          url: "chat",
          data: fd
        }).then( response => {
          if (response.data.Code === '200') {
            console.log("send success")
            this.content = ""
          } else {
            console.log(response)
            ElMessage.error("没发成")
          }
        })
      }
    }
  },
  mounted() {
    api({
      method: "get",
      url: 'user/' + this.me,
    }).then( response => {
      if (response.data.Code === '200') {
        this.meAvatar = response.data.User.AvatarPath
      }
    })

    api({
      method: "get",
      url: 'user/' + this.other,
    }).then( response => {
      if (response.data.Code === '200') {
        this.otherAvatar = response.data.User.AvatarPath
      }
    })
  }
}
</script>

<style scoped>
.el-header {
  background: #0f1423;
}

.chat {
  list-style: none;
  background: none;
  margin: 0;
  padding: 0 0 50px 0;
  margin-top: 60px;
  margin-bottom: 10px;
}

input.textarea {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 80vw;
  height: 50px;
  z-index: 99;
  background: #fafafa;
  border: none;
  outline: none;
  padding-left: 55px;
  padding-right: 55px;
  color: #666;
  font-weight: 400;
}

.el-button {
  position: fixed;
  bottom: 4px;
  right: 0px;
  z-index: 100;
}

.el-button:active, .el-button:focus:not(.el-button:hover) {
  background: #409eff;
}

@import url("https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css");
@import url("https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css");
@import url("https://fonts.googleapis.com/css?family=Lato:400,700");
@import url("https://fonts.googleapis.com/css?family=Poppins:100,200,300,400,500,600,700");
*,
*:before,
*:after {
    box-sizing: border-box;
}

body {
    background: #bcdee7 url("http://victory-design.ru/sandbox/codepen/profile_card/bg.png") no-repeat center center fixed;
    /*background: #C5DDEB;*/
    font: 14px/20px "Lato", Arial, sans-serif;
    padding: 40px 0;
    color: white;
}

.container {
    margin: 0 auto;
    width: 800px;
    background: #444753;
    border-radius: 5px;
}

.menu {
    float: left;
    height: 100%;
    width: 50px;
    background: #4768b5;
    background: -webkit-linear-gradient(#4768b5, #35488e);
    background: -o-linear-gradient(#4768b5, #35488e);
    background: -moz-linear-gradient(#4768b5, #35488e);
    background: linear-gradient(#4768b5, #35488e);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19);
}

.menu .items {
    list-style: none;
    margin: auto;
    padding: 0;
}

.menu .items .item {
    height: 70px;
    border-bottom: 1px solid #6780cc;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #9fb5ef;
    font-size: 17pt;
}

.menu .items .item-active {
    background-color: #5172c3;
    color: #FFF;
}

.menu .items .item:hover {
    cursor: pointer;
    background-color: #4f6ebd;
    color: #cfe5ff;
}

.people-list {
    width: 260px;
    float: left;
}

.people-list .search {
    padding: 20px;
}

.people-list input {
    border-radius: 3px;
    border: none;
    padding: 14px;
    color: white;
    background: #6A6C75;
    width: 90%;
    font-size: 14px;
}

.people-list .fa-search {
    position: relative;
    left: -25px;
}

.people-list ul {
    padding: 20px;
    height: 770px;
    overflow: scroll;
}

.people-list ul li {
    padding-bottom: 20px;
}

.people-list .button {
    border: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    font: inherit;
    font-weight: bold;
    border-radius: 0.5rem;
    padding: 0.5rem 0;
    transition: all 0.5s ease;
    width: 80px;
    margin-left: 10px;
    margin-top: 10px;
}

.people-list .button.-delete {
    grid-column: 1;
    background-color: red;
    color: white;
}

.people-list .button.-delete.-clicked{
    grid-column: 1;
    background-color: gray;
    color: white;
}

.people-list img {
    width: 50px;
    height: 50px;
    float: left;
}

.dialog{
    background-color: rgba(255,255, 255, 1);
    width: 300px;
    border-radius: 5px;
    z-index: 1;/*优先*/
    text-align: center;
    /* 实现对浏览器窗口的垂直居中 */
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    display: none;
}

.dialog .header{
    color: black;
    height: 20%;
    line-height: 60px;
    margin: 0 auto;
}

.dialog ul {
    padding: 20px;
    overflow: scroll;
}

.dialog ul li {
    padding-bottom: 20px;
}

.dialog .button {
    border: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    font: inherit;
    font-weight: bold;
    border-radius: 0.5rem;
    padding: 0.5rem 0;
    transition: all 0.5s ease;
    width: 80px;
    margin-left: 10px;
    margin-top: 10px;
}

.dialog .button.-delete {
    grid-column: 1;
    background-color: red;
    color: white;
}

.dialog .button.-delete.-clicked{
    grid-column: 1;
    background-color: gray;
    color: white;
}

.dialog img {
    width: 50px;
    height: 50px;
    float: left;
}


.dialog .about {
    color: black;
    float: left;
    margin-top: 8px;
}

.dialog .about {
    padding-left: 8px;
}


.chat {
    width: 490px;
    float: left;
    background: #F2F5F8;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    color: #434651;
}

.chat .chat-header {
    padding: 20px;
    border-bottom: 2px solid white;
}

.chat .chat-header img {
    width: 50px;
    height: 50px;
    float: left;
}

.chat .chat-header .chat-about {
    float: left;
    padding-left: 10px;
    margin-top: 6px;
}

.chat .chat-header .chat-with {
    font-weight: bold;
    font-size: 16px;
}

.chat .chat-header .chat-num-messages {
    color: #92959E;
}

.chat .chat-header .fa-star {
    float: right;
    color: #D8DADF;
    font-size: 20px;
    margin-top: 12px;
}

.chat .chat-history {
    padding: 30px 30px 20px;
    border-bottom: 2px solid white;
    overflow-y: scroll;
    height: 575px;
}

.chat .chat-history .message-data {
    margin-bottom: 15px;
}

.chat .chat-history .message-data-time {
    color: #a8aab1;
    padding-left: 6px;
}

.chat .chat-history .message {
    color: white;
    padding: 18px 20px;
    line-height: 26px;
    font-size: 16px;
    border-radius: 7px;
    margin-bottom: 30px;
    width: 90%;
    position: relative;
}

.chat .chat-history .recallMessage{
    color: white;
    padding: 20px 20px;
    line-height: 20px;
    font-size: 15px;
    border-radius: 7px;
    margin-bottom: 30px;
    width: 100%;
    background: #b0b0b0;
    text-align: center;
}

.chat .chat-history .operation .recall{
    border-radius: 25%;
    background: #FF5722;
    color: white;
    border-color: #5d5d5d;
}

.chat .chat-history .operation .transmit{
    border-radius: 25%;
    background: #04befe;
    color: white;
    border-color: #5d5d5d;
}

.pop{
    margin: 0;
    padding: 0;
    display: flex;
}

.pop li
{
    position: relative;
    list-style: none;
    width: 10px;
    height: 10px;
    background: #777;
    margin: 0 5px;
    border-radius: 50%;
    transition: 0.5s;
    cursor: pointer;
}

.pop li:hover
{
    background: #86ff3b;
    box-shadow: 0 0 0 4px #333,
    0 0 0 6px #86ff3b;
}

.pop li .content
{
    position: absolute;
    bottom: 25px;
    width: 100px;
    height: 30px;
    background: #fff;
    padding: 20px;
    box-sizing: border-box;
    border-radius: 4px;
    visibility: hidden;
    opacity: 0;
    transition: 0.5s;
    transform: translateX(-50%) translateY(-50px);
}

.pop li .content:before
{
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    background: #fff;
    bottom: -5px;
    left: 49px;
    transform: rotate(45deg);
}

.pop li:hover .content
{
    visibility: visible;
    opacity: 1;
    transform: translateX(-50%) translateY(0px);
}

.pop li .font
{
    color: black;
    text-align: center;
    height: 30px;
}


.chat .chat-history .message:after {
    bottom: 100%;
    left: 7%;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border: 10px solid transparent;
    border-bottom-color: #86BB71;
    margin-left: -10px;
}

.chat .chat-history .my-message {
    background: #86BB71;
}

.chat .chat-history .other-message {
    background: #94C2ED;
}

.chat .chat-history .other-message:after {
    border-bottom-color: #94C2ED;
    left: 93%;
}

.chat .chat-message {
    padding: 30px;
}

.chat .chat-message textarea {
    width: 100%;
    border: none;
    padding: 10px 20px;
    font: 14px/22px "Lato", Arial, sans-serif;
    margin-bottom: 10px;
    border-radius: 5px;
    resize: none;
}

.chat .chat-message .fa-file-o,
.chat .chat-message .fa-file-image-o {
    font-size: 16px;
    color: gray;
    cursor: pointer;
}

.chat .chat-message button {
    float: right;
    color: #94C2ED;
    font-size: 16px;
    text-transform: uppercase;
    border: none;
    cursor: pointer;
    font-weight: bold;
    background: #F2F5F8;
}

.chat .chat-message button:hover {
    color: #75b1e8;
}

.online,
.offline,
.me {
    margin-right: 3px;
    font-size: 10px;
}

.online {
    color: #86BB71;
}

.offline {
    color: #E38968;
}

.me {
    color: #94C2ED;
}

.align-left {
    text-align: left;
}

.align-right {
    text-align: right;
}

.float-right {
    float: right;
}

.people-list .list .clearfix .active,
.people-list .list .clearfix:hover {
    margin-top: -1px;
    margin-left: -1px;
    padding-top: 13px;
    border: 0;
    width: calc(100% + 2px);
    padding-left: calc(10% + 1px);
}

.clearfix:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: " ";
    clear: both;
    height: 0;
}

.bg-repeat {
  background-image: url('https://cdn.pixabay.com/photo/2014/12/15/15/36/cloth-569222_1280.jpg');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
}

</style>

