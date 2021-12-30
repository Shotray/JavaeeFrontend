<template>
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
                </ul>
            </nav>
            <div class="people-list" id="people-list">
                <div class="search">
                    <input type="text" placeholder="search" />
                    <i class="fa fa-search"></i>
                </div>
                <div class="people">
                    <img class="chatImg" :src="otherAvatar" alt="avatar" />
                        <div class="people-name">{{otherName}}</div>
                </div>
            </div>

            <div class="dialog">
                <p class="header">好友列表</p>
                <ul class="list">

                </ul>
                <button class="cancel">取消</button>
            </div>

            <div class="chat">
                <div class="chat-header clearfix">
                    <img class="chatImg" :src="otherAvatar" alt="avatar" />
                    <div class="chat-about">
                        <div class="chat-with">{{otherName}}</div>
                    </div>
                    <i class="fa fa-star"></i>
                </div>
                <!-- end chat-header -->

                <div class="chat-history" id="chat-history" ref="chatMain">
                    
                    <li  class="clearfix" v-for="(message, key) in messageList" :key="key">
                            <div v-if="message.messageFromUserId==meID" class="message-data align-right">
                                <span class="message-data-time">{{message.messageDate}}</span> &nbsp; &nbsp;
                                <span class="message-data-name">我</span> <i class="fa fa-circle me"></i>
                            </div>
                            <div v-else class="message-data">
                                <span class="message-data-name"><i class="fa fa-circle online"></i> {{otherName}}</span>
                                <span class="message-data-time">{{message.messageDate}}</span>
                            </div>                            
                            <div v-if="message.messageFromUserId==meID" class="message other-message float-right">
                               {{message.messageContent}}
                            </div>
                            <div v-else class="message my-message">
                                {{message.messageContent}}
                            </div>
                    </li>

                </div>
                <!-- end chat-history -->

                <div class="chat-message clearfix">
                    <textarea name="message-to-send" id="message-to-send" placeholder="Type your message" rows="3" v-model="content"></textarea>

                    <i class="fa fa-file-o"><input type="file" id="myfile" accept="image/*"></i>
                    <i class="fa fa-file-image-o"></i>

                    <button class="send" @click="sendMessage">Send</button>

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
// import {ElMessage} from "element-plus";
import {api} from "@/request";

export default {
  name: "Chat",
  data() {
    return {
      content: "",
      meAvatar: "",
      otherAvatar: "",
      meID:"",
      websocket:null,
      otherID:"",
      otherName:"",
      messageList:[],
    //   otherMessageList:[]
    }
  },
  props: {
    other: String,
    me: String,
    record: Array
  },
  // components: {Bubble},
  methods: {
      
    sendMessage() {
        // console.log(this.websocket)
        let msg = {
            messageFromUserId: this.meID + "",
            messageContent: this.content + "",
            messageToUserId: this.otherID + "",
            messageType: 0,
            messageDate: new Date(Date.parse(new Date())+3600*8*1000)
        };
        api({
            method: "post",
            url: "/chat/add",
            data: msg,
          }).then((res) => {
            if (res.status === 200) {
                console.log()
            }
          });
        console.log(msg);
        this.websocket.send(JSON.stringify(msg));

        // console.log("---------------"+msg.messageDate.toISOString());
        var tempHM = msg.messageDate.toISOString().substring(11,19);
        msg.messageDate=msg.messageDate.toISOString().substring(0,10)+ " "+tempHM;
        this.messageList.push(msg);
        // this.scrollToBottom();
        this.$refs.chatMain.scrollTop = this.$refs.chatMain.scrollHeight;
        window.onresize = () => {
        this.$refs.chatMain.scrollTop = this.$refs.chatMain.scrollHeight;
        }
        this.content="";
    },
    destroyed() {
		this.websocketclose(); //离开页面断开连接       
	},
    initWebSocket() {                
			// WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
            let url = "ws://localhost:8081/websocket/"+this.meID;
            // console.log(url)
            // console.log(this.meID);
			this.websocket = new WebSocket(url); //这里是websocket服务地址，这里的地址可以前端根据后台地址参数规则拼成，也可以向后端请求         
			this.websocket.onopen = this.websocketonopen;                
			this.websocket.onerror = this.websocketonerror;                
			this.websocket.onmessage = this.websocketonmessage;                
			this.websocket.onclose = this.websocketclose;
            // console.log(this.websocket)
            // console.log(this.meID)
		},              
		websocketonopen() {                
			console.log("WebSocket连接成功");              
		},              
		websocketonerror(e) {                
			console.log("WebSocket连接发生错误");  
            e            
		},              
		websocketonmessage(e) {                
			console.log(e);               // console.log(e);
            console.log(e["data"])
            var tempJson=JSON.parse(e["data"]);
            console.log(tempJson);
            var myDate = new Date(tempJson.messageDate+8*3600*1000);
            console.log(myDate)
            var tempHM = myDate.toISOString().substring(11,19);
            tempJson.messageDate=myDate.toISOString().substring(0,10)+ " "+tempHM;
            console.log(tempJson);
            console.log("=========================")
            // console.log(e["data"].messageContent)
            // console.log(JSON.stringify(e["data"]).indexOf("messageDate"))
            // console.log(e.data["messageContent"]);
            // var tempHM = JSON.stringify(e["data"]).substring(22,JSON.stringify(e["data"]).indexOf("messageDate")-3);
            // msg.messageDate=msg.messageDate.toISOString().substring(0,10)+ " "+tempHM;
            // this.messageList.push(msg);
            this.messageList.push(tempJson);
            // console.log(tempHM)
            console.log("-----------dasdsada-------------成功收到了吗")            
		},              
		websocketclose(e) {                
			console.log("connection closed (" + e.code + ")");              
		},  
  },
  mounted() {
    //   this.$refs.chatMain.scrollTop = this.$refs.chatMain.scrollHeight;
    //     window.onresize = () => {
    //     this.$refs.chatMain.scrollTop = this.$refs.chatMain.scrollHeight;
    //     }
      this.otherAvatar=this.$route.query.AvatarPath;
      this.otherID=this.$route.query.ID;
      this.otherName=this.$route.query.SenderName;
      console.log(this.otherName+"对面的名字");
      api({
            method: "get",
            url: "/me/info",
          }).then((res) => {
            if (res.status === 200) {
            //   console.log("更改头像了------------");
            //   console.log(res);
              this.meID=res.data.userId;
            //   console.log(this.meID);
              this.initWebSocket(); 
            }
          });
        api({
            method: "get",
            url: "/chat/"+this.otherID,
          }).then((res) => {
            if (res.status === 200) {
            console.log(res);
            console.log("历史消息")
            console.log(res.data[0])
            for(var i=0;i<res.data.length;i++)
            {
                var tempHM = res.data[i].messageDate.substring(11,19);
                res.data[i].messageDate=res.data[i].messageDate.substring(0,10)+ ' '+ tempHM;
                this.messageList.push(res.data[i]);
            }
            console.log(this.messageList)
          } 
          });
      //进入页面开始初始化websocket建立连接      
    // api({
    //   method: "get",
    //   url: 'user/' + this.me,
    // }).then( response => {
    //   if (response.data.Code === '200') {
    //     this.meAvatar = response.data.User.AvatarPath
    //   }
    // })

    // api({
    //   method: "get",
    //   url: 'user/' + this.other,
    // }).then( response => {
    //   if (response.data.Code === '200') {
    //     this.otherAvatar = response.data.User.AvatarPath
    //   }
    // })
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

.people {
    background-color: #76c3ce;
    height: 50px;
}

.people-name {
    text-align: center;
    justify-content: center;
    line-height: 50px;
    /* margin-right: 50px; */
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
    height: 800px;
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
  background-image: url('https://img.tukuppt.com/bg_grid/00/12/50/WRuekkPYAY.jpg');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
}

</style>

