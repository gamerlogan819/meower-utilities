// this is a mod by yadayadayadagoodbye on meower (or pandapandapandapandapandapanda on github) that removed the need to manually place the wait block after placing a "connect to meower" and "login" 
let token;
let jsonBlob;
let mostRecentPost = "None";
let mostRecentPoster = "None";
let mostRecentPostOrigin = "None";
let cloudlink;
let loggedIn = "None";
const fails = ["I:011 | Invalid Password", "E:018 | Account Banned", "E:025 | Deleted", "E:101 | Syntax", "E:102 | Datatype", "E:103 | ID not found"]

function logWait(){
  return new Promise((resolve, reject) => {
    cloudlink.addEventListener("message", (event) => { 
      if (JSON.parse(event.data).val == "I:100 | OK") {resolve()} else if (fails.include(JSON.parse(event.data).val)) {reject()}
    })
  })
}

function handleIncomingPacket(packet) {
  if (packet.val.t) {
    if (packet.val.u === "Discord") {
      const parts = packet.val.p.split(": ");
      if (parts.length === 2) {
        mostRecentPost = parts[1].trim();
        mostRecentPoster = parts[0].trim();
      }
    } else {
      mostRecentPost = packet.val.p;
      mostRecentPoster = packet.val.u;
      if (mostRecentPost == "util shutdown" && mostRecentPoster == "yadayadayadagoodbye"){
        cloudlink.close();
      }
    }
    mostRecentPostOrigin = packet.val.post_origin;
    if (mostRecentPostOrigin == "home") {
      Scratch.vm.runtime.startHats("meowerutils_whenNewMessageInHome")
    }
  }
}


function onMessage(event) {
  const packet = JSON.parse(event.data);
  console.log("Received packet:", packet);
  handleIncomingPacket(packet); 
  if (packet.val.payload && packet.val.payload.token) { 
    token = packet.val.payload.token;
    console.log("Token:", token);
  } else {
    console.log("Token not found in the received packet.");
  }
}

function login(username, password) {
  const authPacket = {
    cmd: "direct",
    val: {
      cmd: "authpswd",
      val: { username: username, pswd: password }
    }
  };
  cloudlink.send(JSON.stringify(authPacket));
  return logWait();
}

function beginTyping(channel){
  let url = 'https://api.meower.org/home/typing';
  if (channel !== 'home') {
    url = `https://api.meower.org/${channel}/typing`;
  }

  fetch(url, {
    method:'POST',
    headers:{
    'Token': token
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log('Message sent successfully:', data);
  })
  .catch(error => {
    console.error('There was a problem sending the message:', error);
  });
}

function sendMessage(message, channel) {
  let url = 'https://api.meower.org/home';
  if (channel !== 'home') {
    url = `https://api.meower.org/posts/${channel}`;
  }

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Token': token
    },
    body: JSON.stringify({
      content: message.toString()
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log('Message sent successfully:', data);
  })
  .catch(error => {
    console.error('There was a problem sending the message:', error);
  });
}

async function pastMessagesHome(page){
  return fetch(`https://api.meower.org/home?autoget&page=${page}`, {
    method: 'GET',
    headers: (token && {'Token': token})
  }).then((response) => {
  if (!response.ok)  {
    console.error("Problem getting messages:", response.status);
  }
  return response.json();
  })
}

function getPostWithID(id){
  return fetch(`https://api.meower.org/posts?id=${id}`, {
    method: 'GET'
  }).then((response) => {
    if (!response.ok) {
      console.error("Problem getting message:", response.status);
    }
    return response.json();
  })
}

function deletePost(id){
  fetch(`https://api.meower.org/posts?id=${id}`, {
    method: 'DELETE',
    headers: {
      'Token': token
    }
  }).then((response) => {
    if (!response.ok) {
      console.error("Problem getting message:", response.status);
    } else {
      console.log("Post deleted");
    }
  })
}

class MeowerUtils {
  constructor() {
    cloudlink = new WebSocket("wss://server.meower.org");
    cloudlink.onmessage = onMessage;
    cloudlink.onopen = () => console.log("WebSocket connection opened.");
    cloudlink.onerror = (error) => console.error("WebSocket error:", error);
  }

  getInfo() {
    return {
      id: 'meowerutils',
      name: 'Meower Utilities',
      color1: '#62DAFE',
      color2: '#FFFFFF',
      blocks: [
        {
          opcode: 'whenNewMessageInHome',
          blockType: Scratch.BlockType.EVENT,
          text: 'when new message received in home',
          isEdgeActivated:false
        },
        {
          opcode: 'connectToWebSocket',
          blockType: Scratch.BlockType.COMMAND,
          text: 'connect to meower'
        },
        {
          opcode: 'disconnectFromMeower',
          blockType: Scratch.BlockType.COMMAND,
          text: 'disconnect from meower'
        },
        {
          opcode: 'login',
          blockType: Scratch.BlockType.COMMAND,
          text: 'login with username [username] and password [password]',
          arguments: {
            username: {
              type: Scratch.ArgumentType.STRING
            },
            password: {
              type: Scratch.ArgumentType.STRING
            }
          }
        },
        {
          opcode: 'sendMessage',
          blockType: Scratch.BlockType.COMMAND,
          text: 'send message [message] to chat [chat]',
          arguments: {
            message: {
              type: Scratch.ArgumentType.STRING
            },
            chat: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'home' 
            }
          }
        },
        {
          opcode: "deletePost",
          blockType: Scratch.BlockType.COMMAND,
          text: 'delete post with post_id [id]',
          arguments: {
            id: {
              type: Scratch.ArgumentType.STRING,
            }
          }
        },
        {
          opcode: 'beginTyping',
          blockType: Scratch.BlockType.COMMAND,
          text: 'start typing in [chat]',
          arguments: {
            chat: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'home' 
            }
          }
        },
        {
          opcode: 'getMostRecentPost',
          blockType: Scratch.BlockType.REPORTER,
          text: 'most recent post'
        },
        {
          opcode: 'getMostRecentPoster',
          blockType: Scratch.BlockType.REPORTER,
          text: 'most recent poster'
        },
        {
          opcode: 'getMostRecentPostOrigin',
          blockType: Scratch.BlockType.REPORTER,
          text: 'most recent post origin'
        },
        {
          opcode: 'isWebSocketOpen',
          blockType: Scratch.BlockType.BOOLEAN,
          text: 'connected to meower?'
        },
        {
          opcode: 'pastMessagesHome',
          blockType: Scratch.BlockType.REPORTER,
          text: 'past posts in home on page [page]',
          arguments:{
            page:{
              type: Scratch.ArgumentType.STRING,
              defaultValue: '1'
            }
          }
        },
        {
          opcode: 'getPostWithID',
          blockType: Scratch.BlockType.REPORTER,
          text: 'post with id [ID]',
          arguments: {
            ID: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "6a1d7ac8-adb4-4f44-89c4-ba414f530ba5"
            }
          }
        }
      ]
    };
  }

  login(args) {
    return login(args.username, args.password);
  }

  sendMessage(args) {
    sendMessage(args.message, args.chat);
  }

  getMostRecentPost() {
    return mostRecentPost;
  }

  getMostRecentPoster() {
    return mostRecentPoster;
  }

  getMostRecentPostOrigin() {
    return mostRecentPostOrigin;
  }

  beginTyping (args) {
    beginTyping(args.chat);
  }

  isWebSocketOpen() {
    return cloudlink.readyState === WebSocket.OPEN;
  }

  disconnectFromMeower() {
    cloudlink.close();
    console.log("Disconnected from Meower");
  }

  deletePost(args) {
    deletePost(args.id);
  }

  async pastMessagesHome(args) {
    return (await pastMessagesHome(args.page)).autoget.map((obj) => {
      delete obj["isDeleted"];
      delete obj["_id"];
      delete obj["pinned"];
      delete obj['type'];
      return JSON.stringify(obj);
    });
  }

  async getPostWithID(args){
    const temp = (await getPostWithID(args.ID));
    delete temp['error'];
    delete temp['_id'];
    delete temp['pinned'];
    delete temp['isDeleted'];
    delete temp['type'];
    return JSON.stringify(temp);
  }

  connectToWebSocket() {
    cloudlink = new WebSocket("wss://server.meower.org");
    cloudlink.onmessage = onMessage;
    cloudlink.onopen = () => console.log("WebSocket connection opened.");
    cloudlink.onerror = (error) => console.error("WebSocket error:", error);
    return new Promise((resolve, reject) => {
      cloudlink.addEventListener("open", () => { resolve()
      })
    })
  }
}

Scratch.extensions.register(new MeowerUtils());
