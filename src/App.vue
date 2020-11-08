<template>
  <v-app >
    <v-layout>
      <v-flex xs12 sm6 offset-sm3>
        <v-card id="mydiv" class="contain" style="overflow-y: auto" > 
          <v-app-bar  color="primary" dark>
            {{me.name}}
          </v-app-bar>
          
            <div class="overline text-right">
              Users
            </div>
            <v-list class="text-right ">
              <v-list-item v-for="(user, i) in users" :key="i">
                <v-list-item-title>{{ user.name }}</v-list-item-title>
              </v-list-item>
            </v-list> 
         
        <v-card-text>
          <v-card  id = "scrolled-content" class=" mt-10 chats" width="70%" >
            <v-list>
                  <chat  class="ma-5 " v-for="(chat, i) in chats" :key="i" :hours="chat.hours" :minutes="chat.minutes"  :name="chat.name" :color="chat.color" :isSelf="isMe(chat.name)" :message="chat.payload"/> 
              </v-list>
          </v-card >
          
      </v-card-text>
    </v-card>
    <v-main class >
                <v-text-field  v-model="message" append-icon="mdi-send" @keyup.enter.native="send" @click:append="send"/>
              </v-main>
  </v-flex>
</v-layout>
  </v-app>
</template>
<script>
import { client } from './socket'
import Chat from './components/Chat.vue'
export default {
  components: {
    Chat
  },
  data() {
    return {
      message: '',
      users: [],
      chats: [],
      me: {},
      elem: null,
      container: null,
      scrollTop: 400
      
    }
  },
  mounted() {
    client.addEventListener('USER', this.onUser)
    client.addEventListener('CHATS', this.initalChats)
    client.addEventListener('USERS', this.initalUsers)
    client.addEventListener('MESSAGE', this.onMessage)
    client.addEventListener('ME', this.assignUser)
    client.addEventListener('UPDATE', this.change)

  },
  methods: {
    onUser(user) {
      this.users.push(user)
    },
    scroll(){
      var div = document.getElementById('mydiv');
       div.scrollTop = div.scrollHeight;
      
    },
    send() {
      client.emit('MESSAGE', this.message)
      this.message = ''
    },
    assignUser(user) {
      this.me = user
      this.checkCookies()
      document.cookie = 'place=RobsChat'
      document.cookie = `name=${user.name}`
      document.cookie = `color=${user.color}`
    },
    initalChats(chats){
      this.chats = chats
    },
    initalUsers(users){
      this.users = users
      console.log(this.users)
    },
    async onMessage(message) {
      await this.chats.push(message)
      this.scroll()
    },
    checkCookies() {
      try{
        let allCookies = document.cookie
        console.log(allCookies)
        let parsed = allCookies.split('; ').find(row => row.startsWith('place')).split('=')[1]
        let color = allCookies.split('; ').find(row => row.startsWith('color')).split('=')[1]
        let name = allCookies.split('; ').find(row => row.startsWith('name')).split('=')[1]
        console.log(name)
        console.log(this.users.name)
        for(let i = 0; i < this.users.length; i++){
          if(name === this.users[i].name){
            this.me.color = color
            return
          }
        }
        console.log(this.users)
        this.me.name = name
        this.me.color = color
        console.log('exsists')
        client.emit('EXSIST', this.me)
      }catch(err){
        console.log(err)

      }
    },
    getUser(id) {
      let user = this.users.find(user => user.id === id)
      if(user) {
        return user
      } else {
        user = {
          id,
          name: id,
          color: 'black'
        }
        this.users.push(user)
        return user
      }
    },
    change(user) {
      this.me = user
      document.cookie = `name=${user.name}`
      document.cookie = `color=${user.color}`
    },
    isMe(name){
      if(name === this.me.name){
        return true
      }
      else{
        return false
      }

    }
  }
}
</script>
<style scoped>
.card-actions {
  bottom: 0;
  position: relative;
}
.users {
  position: absolute;
  right: 0;
  width: 20%;
  flex-shrink: 1;
  flex-grow: 0;
}

.chats {
  position: absolute;
  bottom: 0;
  flex-grow: 0;
  max-height: 90%;
}
#scroller * {
    overflow-anchor: none;
}
#anchor {
    overflow-anchor: auto;
    height: 1px;
}
.contain{
  height: 90%;
}
.holder{
  min-height: 90%;
}
</style>
