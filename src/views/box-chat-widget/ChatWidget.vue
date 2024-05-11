<template>
  <div>
    <div v-if="room_id != null" className="chat-box">
      <!-- product detail start -->
      <div className="product-detail">
        <img src="https://cf.shopee.vn/file/vn-11134207-7r98o-lq6ekru0wfyq14_tn" style="width:50px; height:50px" />
        <div className="info">
          <div className="title">ghế xoay làm việc văn phòng lưng dưới xoay tròn 360 độ cao cấp trường mau Sài Gòn ghế xoay làm việc văn phòng lưng dưới xoay tròn 360 độ cao cấp trường mau Sài Gòn</div>
          <div className="price">
            <span style="text-decoration:line-through;color:#bbb;padding-right:2px">500.000vnđ</span>
            500.000vnđ</div>
        </div>
      </div>
      <!-- product detail end -->
      <!-- content chat start -->
      <div className="chat-container" ref="chatContainer">
        
        <div v-for="(message, k) in messageList" :key="k" :className="message.type === 'received' ? 'messageList received' : 'messageList sent'">
          <div className="messages">
            <div className="fullname" v-if="message.type === 'received'">{{ message.author}}</div>
            <div className="message">{{ message.data.text}}</div>
            <div className="status">{{ message.status }}</div>
          </div>
        </div>
        <div v-if="userTyping" class="chat-typing">... ai đó đang chat</div>
        <div className="scrollToBottom"></div>
      </div>
      <!-- content chat end -->
      <!-- chat footer start -->
      <div className="chat-footer">
        <div class="chat-action">
          <div class="input-attach"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="M6 22h12a2 2 0 0 0 2-2V8l-6-6H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2zm7-18 5 5h-5V4zM8 14h3v-3h2v3h3v2h-3v3h-2v-3H8v-2z"></path></svg></div>
      
          <textarea class="input" placeholder="message..." rows=1 v-model="newMessage" @keyup.enter="sendMessage" @keypress="typing"></textarea>
          <!-- <input class="submit" @click="sendMessage" type="submit"/> -->
          <div class="input-smile"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path><path d="M14.829 14.828a4.055 4.055 0 0 1-1.272.858 4.002 4.002 0 0 1-4.875-1.45l-1.658 1.119a6.063 6.063 0 0 0 1.621 1.62 5.963 5.963 0 0 0 2.148.903 6.042 6.042 0 0 0 2.415 0 5.972 5.972 0 0 0 2.148-.903c.313-.212.612-.458.886-.731.272-.271.52-.571.734-.889l-1.658-1.119a4.017 4.017 0 0 1-.489.592z"></path><circle cx="8.5" cy="10.5" r="1.5"></circle><circle cx="15.493" cy="10.493" r="1.493"></circle></svg></div>
          
        </div>
        <!-- <div class="chat-copyright">Power by Osiner.com</div> -->
        </div>
    </div>
    <div v-else>
      <div style="text-align: center">
        <div class="start" @click="startButton">Bắt đầu Chat</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['page_id'],
  data() {
    return {
      sort: 0,//xắp xếp tin nhắn
      socket: null,
      room_id: localStorage.getItem('room_id'),
      app_id: null,
      refUrl: null,
      userTyping: false,
      userData: JSON.parse(localStorage.getItem('userData')),
      newMessage: '',
      participants: [
        {
          id: 'user1',
          name: 'Matteo',
          imageUrl: 'https://avatars3.githubusercontent.com/u/1915989?s=230&v=4'
        },
        {
          id: 'user2',
          name: 'Support',
          imageUrl: 'https://avatars3.githubusercontent.com/u/37018832?s=200&v=4'
        }
      ], // the list of all the participant of the conversation. `name` is the user name, `id` is used to establish the author of a message, `imageUrl` is supposed to be the user avatar.
      titleImageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png',
      messageList: [
          { type: 'sent', author: `me`, data: { text: `Xin chào, mình có thể giúp gì cho bạn!` } },
          //{ type: 'receive', author: `user1`, data: { text: `No.` } }
      ], // the list of the messages to show, can be paginated and adjusted dynamically
      newMessagesCount: 0,
      isChatOpen: true, // to determine whether the chat window should be open or closed
      showTypingIndicator: '', // when set to a value matching the participant.id it shows the typing indicator for the specific user
      colors: {
        header: {
          bg: '#4e8cff',
          text: '#ffffff'
        },
        launcher: {
          bg: '#4e8cff'
        },
        messageList: {
          bg: '#ffffff'
        },
        sentMessage: {
          bg: '#4e8cff',
          text: '#ffffff'
        },
        receivedMessage: {
          bg: '#eaeaea',
          text: '#222222'
        },
        userInput: {
          bg: '#f4f7f9',
          text: '#565867'
        }
      }, // specifies the color scheme for the component
      alwaysScrollToBottom: false, // when set to true always scrolls the chat to the bottom when new events are in (new message, user starts typing...)
      messageStyling: true // enables *bold* /emph/ _underline_ and such (more info at github.com/mattezza/msgdown)
    }
  },
  created() {
    this.reconnectWebsocket();
    //load messages first login
  },
  mounted() {
    this.app_id = this.$route.query.app_id
    this.refUrl = this.$route.query.ref_url
  },
  methods: {
    typing() {
      this.sendSocket({
        pageId : this.page_id,
        userId : this.userData ? this.userData._id : null,
        appId  : this.app_id,
        ref     : this.ref,
        type    : 'typing',
        roomId : this.room_id
      })
    },
    sendSocket(data) {
      if(this.socket.readyState === 1) {
        this.socket.send(JSON.stringify(data))
      }else {
        console.log('cant not sent', this.socket.readyState);
      }
    },
    onSocketOpen() {
      //kiểm tra đã có phòng hay chưa? chưa thì tạo
      
      //console.log('connected socket');
      this.sendSocket({
        pageId    : this.page_id,
        userId    : this.userData ? this.userData._id : null,
        userData  : this.userData,
        appId     : this.app_id,
        ref       : this.ref,
        type      : 'first_osiner',
        roomId    : this.room_id
      })
    },
    onSocketMessage(event) {
      let jsonData = JSON.parse(event.data)
      console.log('Received message:', jsonData);
      switch(jsonData.type) {
        case 'messages' : {
          //lan dau
          this.sort = jsonData.data.length
          this.messageList = jsonData.data.map((item) => {
            return {
              type: item.user_id !== this.page_id ? 'sent' : 'received',
              author: item.user_id,
              data: {
                text: item.message
              }
            }
          })
          this.scrollToBottom()
        }
        break
        case 'typing' : {
          //dang gửi tin nhắn
          this.userTyping = true
          setTimeout(() => {
            this.userTyping = false
          }, 5000)
        }
        break
        case 'leaving_room' : {
          //rời phòng
        }
        break
        case 'list_message' : {
          console.log('list_message');
        }
        break
        case 'status_message' : {
          //sent, readed
          let status = 'Đã gửi'
          if(jsonData.status === 'readed') status = 'Đã đọc'
          else if(jsonData.status === 'received') status = 'Đã nhận'
          this.messageList = this.messageList.map((item) => {
            return {...item, status: status}
          })
        }
        break
        case 'added_message' : {
          //nhan tn nhan
          this.messageList.push({
              type: jsonData.data.type,
              author: jsonData.data.userData.name,
              data: {
                text: jsonData.data.text
              }
            })
            this.scrollToBottom()
        }
        break
        case 'start_btn_osiner' : {
          //hiển thị nút bắt đầu
          console.log('start_btn_osiner')
          this.room_id = null
          localStorage.setItem('room_id', null)
        }
        break
        case 'room_id_osiner' : {
          //luu lai room_id
          //join vào phòng
          //console.log('room_id_osiner', jsonData.data.room_id)
          this.room_id = jsonData.data.room_id
          localStorage.setItem('room_id', jsonData.data.room_id)
        }
        break
      }
      
      
      // Xử lý dữ liệu nhận được từ WebSocket
    },
    onSocketClose() {
      //console.log('WebSocket disconnected');
      // Thực hiện các hành động khi WebSocket bị đóng kết nối
      // Có thể triển khai việc kết nối lại tại đây
      this.reconnectWebsocket();
    },
    reconnectWebsocket() {
      this.socket  = new WebSocket("ws://localhost:6968")
      this.socket.onopen = this.onSocketOpen;
      this.socket.onmessage = this.onSocketMessage;
      this.socket.onclose = this.onSocketClose;
    },
    sendMessage () {
        this.newMessagesCount = this.isChatOpen ? this.newMessagesCount : this.newMessagesCount + 1
        let data = {
          userData: this.userData,
          type: 'add_message', 
          roomId: this.room_id,
          data: { text: this.newMessage, type: 'sent' },
          pageId: this.page_id,
          userId: this.userData ? this.userData._id : null,
          sort: this.sort+1
        }
        this.onMessageWasSent(data)
        this.sendSocket(data)
        this.newMessage = ''
        this.scrollToBottom()
    },
    onMessageWasSent (message) {
      // called when the user sends a message
      this.sort++
      this.messageList = [ ...this.messageList, message ]
    },
    openChat () {
      // called when the user clicks on the fab button to open the chat
      this.isChatOpen = true
      this.newMessagesCount = 0
    },
    closeChat () {
      // called when the user clicks on the botton to close the chat
      this.isChatOpen = false
    },
    handleScrollToTop () {
      // called when the user scrolls message list to top
      // leverage pagination for loading another page of messages
    },
    handleOnType () {
      console.log('Emit typing event')
    },
    editMessage(message){
      const m = this.messageList.find(m => m.id === message.id);
      m.isEdited = true;
      m.data.text = message.data.text;
    },
    scrollToBottom() {
        this.$nextTick(() => {
            const chatContainer = this.$refs.chatContainer;
            if(typeof chatContainer !== 'undefined')
            chatContainer.scrollTop = chatContainer.scrollHeight
        });
    },
    startButton() {
      //
      console.log('startButton');
      this.messageList = []
      this.sendSocket({
        type: 'start_osiner',
        appId: this.app_id,
        pageId: this.page_id,
        userId : this.userData ? this.userData._id : null,
      })
    }
  }
}
</script>
<style scoped>
.start {
  cursor: pointer;
  font-weight: bold;
  margin-top: 50%;
}
</style>