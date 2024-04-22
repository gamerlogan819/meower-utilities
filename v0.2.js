// THE HATERS SAID WE COULDNT DO IT BUT WE DID IT CHAT 🔥🔥🔥🔥🔥
// this is the official base version by gamerlogan819, for added features you csn check out yadamod or showermod
let token;
let mostRecentPost = "None";
let mostRecentPoster = "None";
let mostRecentPostOrigin = "None";
let cloudlink;

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
    }
    mostRecentPostOrigin = packet.val.post_origin;
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
      content: message
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

class MeowerUtils {
  constructor() {
    this.latestPacket = null;
    cloudlink = new WebSocket("wss://server.meower.org");
    cloudlink.onmessage = this.onMessage.bind(this);
    cloudlink.onopen = () => {
      console.log("WebSocket connection opened.");
    };
    cloudlink.onerror = (error) => console.error("WebSocket error:", error);
  }

  handleIncomingPacket(packet) {
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
      }
      mostRecentPostOrigin = packet.val.post_origin;
    }
  }

  onMessage(event) {
    const packet = JSON.parse(event.data);
    console.log("Received packet:", packet);
    this.latestPacket = packet;
    this.handleIncomingPacket(packet);
    if (packet.val.payload && packet.val.payload.token) {
      token = packet.val.payload.token;
      console.log("Token:", token);
    } else {
      console.log("Token not found in the received packet.");
    }
  }

  getInfo() {
    return {
      id: 'meowerutils',
      name: 'Meower Utilities',
      color1: '#FFA500',
      color2: '#FFFFFF',
      blocks: [
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
          opcode: 'connectToWebSocket',
          blockType: Scratch.BlockType.COMMAND,
          text: 'connect to meower'
        },
        {
          opcode: 'isWebSocketOpen',
          blockType: Scratch.BlockType.BOOLEAN,
          text: 'connected to meower?'
        },
        {
          opcode: 'disconnectFromMeower',
          blockType: Scratch.BlockType.COMMAND,
          text: 'disconnect from meower'
        },
        {
          opcode: 'getRawPacket',
          blockType: Scratch.BlockType.REPORTER,
          text: 'raw packet'
        }
      ]
    };
  }

  login(args) {
    login(args.username, args.password);
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

  connectToWebSocket() {
    cloudlink = new WebSocket("wss://server.meower.org");
    cloudlink.onmessage = this.onMessage.bind(this);
    cloudlink.onopen = () => {
      console.log("Websocket connection opened");
    };
    cloudlink.onerror = (error) => console.error("Websocket error:", error);
  }

  isWebSocketOpen() {
    return cloudlink.readyState === WebSocket.OPEN;
  }

  disconnectFromMeower() {
    cloudlink.close();
    console.log("Disconnected from Meower");
  }

  getRawPacket() {
    return JSON.stringify(this.latestPacket)
  }
}

Scratch.extensions.register(new MeowerUtils());
