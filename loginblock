// Declare variables for token and JSON data
let token;
let jsonBlob;

// Create a new CloudlinkClient instance with WebSocket URL and logging enabled
let cloudlink = new WebSocket("wss://server.meower.org");

// Event handler for incoming packets
cloudlink.onmessage = (event) => {
  const packet = JSON.parse(event.data);
  console.log("Received packet:", packet);
  if (packet.val.payload && packet.val.payload.token) { // Check if token property exists
    token = packet.val.payload.token;
    console.log("Token:", token);
  } else {
    console.log("Token not found in the received packet.");
  }
};

// Event handler for WebSocket connection opening
cloudlink.onopen = () => {
  console.log("WebSocket connection opened.");
  console.log("hi");
  login("gps", "hehehehe");
};

// Event handler for WebSocket errors
cloudlink.onerror = (error) => {
  console.error("WebSocket error:", error);
};

// Function to perform login using username and password
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

// Scratch Extension Definition
class LoginExtension {
  getInfo() {
    return {
      id: 'loginexample',
      name: 'Login',
      blocks: [
        {
          opcode: 'login',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Login with username [USERNAME] and password [PASSWORD]',
          arguments: {
            USERNAME: {
              type: Scratch.ArgumentType.STRING
            },
            PASSWORD: {
              type: Scratch.ArgumentType.STRING
            }
          }
        }
      ]
    };
  }

  login(args) {
    login(args.USERNAME, args.PASSWORD);
  }
}

// Register the LoginExtension with Scratch
Scratch.extensions.register(new LoginExtension());
