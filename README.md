# Hive Social Explorer

A modern, vibrant React application for exploring and interacting with the Hive blockchain. Built with a sleek red and white design, this application allows users to browse trending posts, create content, and engage with the Hive community.

![Hive Social Explorer](https://i.imgur.com/your-screenshot.png)

## 🚀 Features

- **Modern UI Design**: Sleek red and white color scheme with smooth animations and transitions
- **Secure Authentication**: Login with Hive Keychain for secure blockchain interactions
- **Trending Posts**: Browse the latest trending content from the Hive blockchain
- **Content Creation**: Create and publish posts with Markdown support
- **Interactive Elements**: Vote on posts, follow users, and engage with content
- **Responsive Design**: Fully responsive layout that works on all devices
- **Real-time Updates**: Instant feedback for all blockchain interactions

## 🛠️ Technologies Used

- React 18
- Hive Keychain
- @hiveio/hive-js
- React Markdown
- Modern CSS with CSS Variables
- Responsive Design
- Custom Animations

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/hive-social-explorer.git
cd hive-social-explorer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔧 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- [Hive Keychain Browser Extension](https://chrome.google.com/webstore/detail/hive-keychain/jcacnejopjdphbnjgfaaobbfafkihpep)
- A Hive account

## 💻 Usage

1. **Login**:
   - Install the Hive Keychain browser extension
   - Click "Login with Keychain"
   - Enter your Hive username
   - Approve the login request in Keychain

2. **Browse Posts**:
   - View trending posts on the home page
   - Click on posts to read full content
   - Use the vote button to support content creators

3. **Create Content**:
   - Click "Create Post" in the navigation
   - Fill in the title, content, and tags
   - Use Markdown formatting for rich content
   - Preview your post before publishing
   - Click "Publish" to broadcast to the blockchain

4. **Interact**:
   - Vote on posts
   - Follow other users
   - Engage with the community

## 🎨 Customization

The application uses CSS variables for easy theme customization. Main colors can be modified in `src/index.css`:

```css
:root {
  --primary-color: #C60000;
  --primary-dark: #990000;
  --primary-light: #FF1A1A;
  --secondary-color: #FF4D4D;
  /* ... other variables */
}
```

## 🔐 Security

- All blockchain interactions are handled through Hive Keychain
- No private keys are stored in the application
- Secure authentication flow
- Input validation and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Hive blockchain community
- Hive Keychain developers
- React development team
- All contributors and users


## 🐛 Troubleshooting

**Common Issues**:

1. **Keychain Not Detected**:
   - Ensure Hive Keychain is installed
   - Refresh the page
   - Check if Keychain is enabled

2. **Transaction Failed**:
   - Verify you have sufficient resources (RC)
   - Check your account permissions
   - Try again after a few minutes

3. **Content Not Loading**:
   - Check your internet connection
   - Clear browser cache
   - Try a different Hive API node

## 🔄 Updates

Stay updated with the latest changes:

```bash
git pull origin main
npm install
```

## 📊 Performance

The application is optimized for:
- Fast loading times
- Smooth animations
- Efficient blockchain interactions
- Responsive user interface

---

Built with ❤️ for the Hive community 