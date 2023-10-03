<template>
  <div>
    <div v-if="room_id != null" className="chat-box">
      <div className="chat-container" ref="chatContainer">
        <div v-for="(message, k) in messageList" :key="k" className="messageList">
          <div :className="message.type === 'received' ? 'messages received' : 'messages sent'">
            <div className="fullname" v-if="message.type === 'received'">{{ message.author}}</div>
            <div className="message">{{ message.data.text}}</div>
            <div className="status">{{ message.status }}</div>
          </div>
        </div>
        <div v-if="userTyping" class="chat-typing">...  ai đó đang chat</div>
      </div>
      <div className="chat-footer">
        <div class="chat-action">
          <input class="input" placeholder="message..." v-model="newMessage" @keyup.enter="sendMessage" @keypress="typing"/><input class="submit" @click="sendMessage" type="submit"/>
        </div>
        <div class="chat-copyright">Power by Osiner.com</div>
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
        userId : this.userData.id,
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
      
      console.log('connected socket');
      this.sendSocket({
        pageId    : this.page_id,
        userId    : this.userData._id,
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
          console.log('room_id_osiner', jsonData.data.room_id)
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
          userId: this.userData._id,
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
            chatContainer.scrollTop = chatContainer.scrollHeight ? chatContainer.scrollHeight: 0
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
        userId : this.userData._id,
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