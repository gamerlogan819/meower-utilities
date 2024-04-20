(async (Scratch) => {
await import("https://unpkg.com/@meower-media/meower@2.0.0-alpha11/dist/browser/meower.bundle.js")
await import("https://unpkg.com/@meower-media/meower@2.0.0-alpha11/dist/browser/bot.bundle.js")
class MeowerUtils {
  constructor() {
  	this.mostRecentPost = undefined;
    this.client = new Meower.Bot()
    
    this.client.onPost((username, content, origin, { bridged, raw }) => {
    	this.mostRecentPost = content;
      this.mostRecentPoster = username;
      this.mostRecentPostOrigin = origin;
    });
  }
  getInfo() {
    return {
      id: 'meowerutils',
      name: 'Meower Utilities',
      color1: '#FFC0CB',
      color2: '#FFFFFF',
      blocks: [
        {
          opcode: 'login',
          blockType: Scratch.BlockType.COMMAND,
          text: 'connect and login with username [username] and password [password]',
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
        }
      ]
    };
  }
  async login(args) {
    await this.client.login(args.username, args.password);
  }
  async sendMessage(args) {
    return JSON.stringify(await this.client.post(args.message, args.chat))
  }
  getMostRecentPost() {
    return this.mostRecentPost;
  }
  getMostRecentPoster() {
    return this.mostRecentPoster;
  }
  getMostRecentPostOrigin() {
    return this.mostRecentPostOrigin;
  }
}
Scratch.extensions.register(new MeowerUtils());
})(Scratch)