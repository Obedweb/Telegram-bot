<div align="center">

# 🤖 HUNTER MD — Telegram Bot

<img src="https://img.shields.io/badge/Node.js-18%2B-brightgreen?style=for-the-badge&logo=node.js" />
<img src="https://img.shields.io/badge/Telegram-Bot-blue?style=for-the-badge&logo=telegram" />
<img src="https://img.shields.io/badge/Made%20by-Obed%20Tech-purple?style=for-the-badge" />
<img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" />
<img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" />

<br/>

> ⚡ A powerful, fast, and feature-rich multi-purpose Telegram Bot built for automation, entertainment, group management, AI interaction, and much more.

<br/>

**[🚀 Try Demo](https://t.me/HUNTERMDbot)** • **[📞 Contact Owner](https://wa.me/254701082940)** • **[⭐ Star Repo](#)**

---

</div>

## 📸 Preview

```
██╗  ██╗██╗   ██╗███╗   ██╗████████╗███████╗██████╗     ███╗   ███╗██████╗
██║  ██║██║   ██║████╗  ██║╚══██╔══╝██╔════╝██╔══██╗    ████╗ ████║██╔══██╗
███████║██║   ██║██╔██╗ ██║   ██║   █████╗  ██████╔╝    ██╔████╔██║██║  ██║
██╔══██║██║   ██║██║╚██╗██║   ██║   ██╔══╝  ██╔══██╗    ██║╚██╔╝██║██║  ██║
██║  ██║╚██████╔╝██║ ╚████║   ██║   ███████╗██║  ██║    ██║ ╚═╝ ██║██████╔╝
╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═╝    ╚═╝     ╚═╝╚═════╝
                        [ Made by Obed Tech ]
```

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [⚙️ Requirements](#️-requirements)
- [🛠️ Installation](#️-installation)
- [🔐 Configuration](#-configuration)
- [🚀 Deployment](#-deployment)
- [📖 Commands](#-commands)
- [📁 Project Structure](#-project-structure)
- [❓ FAQ](#-faq)
- [📞 Support](#-support)

---

## ✨ Features

| Category | Feature | Description |
|----------|---------|-------------|
| 🧠 **AI** | GPT / Ask | Ask any question and get smart AI-powered answers |
| 🎵 **Downloads** | Play / Song | Search and download audio from YouTube |
| 🎬 **Downloads** | Video | Download videos from YouTube (up to 2GB) |
| 😄 **Fun** | Hack Prank | Funny hacking simulation for laughs |
| 💬 **Fun** | Quotes | Receive random motivational audio quotes |
| 👥 **Groups** | Promote/Demote | Manage group admin roles with ease |
| 🔗 **Groups** | Anti-Link | Auto-delete unauthorized links in groups |
| 👋 **Groups** | Welcome | Greet new members with a custom GIF message |
| 📤 **Upload** | CDN Upload | Upload any file and get a shareable public link |
| 🔧 **Utility** | Chat ID | Get the ID of any user, group or channel |
| 📋 **General** | Menu / Help | View all available commands in a styled menu |
| ⚙️ **System** | Restart | Remotely restart the bot (owner only) |
| 💻 **System** | Eval | Execute JavaScript code live (owner only) |
| 🌐 **Web** | Express Server | Built-in web server to keep bot alive on hosting platforms |

---

## ⚙️ Requirements

Before you begin, make sure you have the following:

- ✅ [Node.js](https://nodejs.org) v18 or higher
- ✅ A [Telegram](https://telegram.org) account
- ✅ A **Bot Token** from [@BotFather](https://t.me/BotFather)
- ✅ Your **Telegram User ID** from [@userinfobot](https://t.me/userinfobot)
- ✅ npm (comes with Node.js)

---

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/Obedweb/Telegram-bot.git
cd hunter-bot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment

```bash
# Rename the example env file
cp .env.example .env
```

Then open `.env` and fill in your details (see [Configuration](#-configuration) below).

### 4. Start the bot

```bash
npm start
```

If everything is set up correctly, you'll see:
```
✅ Successfully loaded 10 commands
✅ Successfully registered 23 commands
🌐 Web server is running on port 7860
```

---

## 🔐 Configuration

Open your `.env` file and fill in the following:

```env
# =============================================
#         HUNTER MD — BOT CONFIGURATION
# =============================================

# Get your token from @BotFather on Telegram
BOT_TOKEN=your_bot_token_here

# Get your ID from @userinfobot on Telegram
OWNER_ID=your_telegram_user_id

# Bot display name
BOT_NAME=HUNTER MD

# Owner info
OWNER_NAME=Obed Tech
OWNER_USERNAME=ObedTech

# Timezone (default: Africa/Nairobi)
TIMEZONE=Africa/Nairobi

# Command prefix (default: /)
PREFIX=/
```

> ⚠️ **NEVER share your `.env` file or Bot Token publicly. Treat it like a password.**

---

## 🚀 Deployment

Choose your preferred platform to host the bot **24/7**:

### ☁️ Deploy on Render (Recommended — Free)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://dashboard.render.com/new)

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repository
4. Set:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add environment variables (`BOT_TOKEN`, `OWNER_ID`, etc.)
6. Click **Deploy** ✅

---

### 🚂 Deploy on Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app)

1. Go to [railway.app](https://railway.app)
2. Click **New Project** → **Deploy from GitHub**
3. Select your repository
4. Add environment variables in the **Variables** tab
5. Done ✅

---

### 💜 Deploy on Heroku

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://dashboard.heroku.com/new)

> Your bot already includes `Procfile`, `app.json`, and `heroku.yml` — it's ready to go!

1. Create a [Heroku](https://heroku.com) account
2. Create a new app
3. Connect your GitHub repo
4. Add Config Vars: `BOT_TOKEN`, `OWNER_ID`
5. Deploy ✅

---

## 📖 Commands

### 🌐 General
| Command | Aliases | Description |
|---------|---------|-------------|
| `/menu` | `/start`, `/help` | Show all available commands |

### 🧠 AI
| Command | Aliases | Description |
|---------|---------|-------------|
| `/gpt` | `/ai`, `/ask` | Ask AI a question |

### 🎵 Downloads
| Command | Aliases | Description |
|---------|---------|-------------|
| `/play` | `/song`, `/music` | Download audio from YouTube |
| `/video` | `/vid` | Download video from YouTube |

### 😄 Fun
| Command | Aliases | Description |
|---------|---------|-------------|
| `/hack` | `/hacker`, `/prank` | Fun hacking simulation |
| `/quote` | — | Random audio quote |

### 👥 Group Management
| Command | Aliases | Description |
|---------|---------|-------------|
| `/promote` | `/admin` | Promote a user to admin |
| `/demote` | `/removeadmin` | Remove admin from a user |

### 📤 Upload
| Command | Aliases | Description |
|---------|---------|-------------|
| `/cdn` | `/url`, `/geturl` | Upload a file and get a shareable link |

### 🔧 Utility
| Command | Aliases | Description |
|---------|---------|-------------|
| `/chatid` | `/id`, `/myid` | Get ID of chat or user |

### ⚙️ Owner Only
| Command | Aliases | Description |
|---------|---------|-------------|
| `/restart` | `/reboot` | Restart the bot remotely |
| `/eval` | `/run`, `/e` | Execute JavaScript code |

---

## 📁 Project Structure

```
hunter-bot/
├── 📄 index.js           # Entry point — starts bot & web server
├── ⚙️  config.js          # Bot configuration (reads from .env)
├── 🔒 .env               # Your private credentials (never share!)
├── 📋 package.json       # Dependencies
├── 📦 Procfile           # Heroku deployment config
├── 🐳 heroku.yml         # Heroku container config
│
├── 📁 hunt/              # Core bot framework
│   ├── gmdCmds.js        # Command registry
│   ├── gmdHandler.js     # Message router & event handler
│   ├── gmdFunctions.js   # Utility functions (logging, admin check, welcome)
│   ├── gmdHelpers.js     # HTTP client, file tools, CDN uploaders
│   └── gmdUtils.js       # Formatting helpers (buttons, uptime, bytes)
│
└── 📁 hunter/            # Command modules
    ├── ai.js             # AI commands
    ├── download.js       # YouTube download commands
    ├── fun.js            # Fun & entertainment commands
    ├── group.js          # Group management commands
    ├── hack.js           # Prank commands
    ├── menu.js           # Menu & help commands
    ├── system.js         # Owner system commands
    ├── upload.js         # File upload commands
    ├── utility.js        # Utility commands
    └── eval.js           # Code execution (owner only)
```

---

## ❓ FAQ

**Q: Why is the bot not responding?**
> Make sure your `BOT_TOKEN` and `OWNER_ID` are correctly set in your `.env` file.

**Q: Why is `/play` not downloading?**
> The download feature relies on external APIs. If they're down or rate-limited, try again later or contact the owner for an API key upgrade.

**Q: How do I add new commands?**
> Create a new `.js` file in the `hunter/` folder and use the `gmd()` function to register your command. It will be auto-loaded on next start.

**Q: How do I keep the bot running 24/7?**
> Deploy it on [Render](https://render.com), [Railway](https://railway.app), or [Heroku](https://heroku.com). See the [Deployment](#-deployment) section above.

**Q: My token got exposed, what do I do?**
> Go to [@BotFather](https://t.me/BotFather) immediately → `/mybots` → select your bot → **Revoke token** → update your `.env` with the new token.

---

## 📞 Support

Having issues or want to request a feature?

| Platform | Link |
|----------|------|
| 📱 WhatsApp | [+254 701 082 940](https://wa.me/254701082940) |
| 🤖 Demo Bot | [@HUNTERMDbot](https://t.me/HUNTERMDbot) |

---

<div align="center">

**© 2024–2026 OBED TECH — All Rights Reserved**

*Built with ❤️ by [Obed Tech](https://wa.me/254701082940)*

</div>