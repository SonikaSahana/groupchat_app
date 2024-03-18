document.addEventListener('DOMContentLoaded', function () {
    const chatWindow = document.getElementById('chat-window');
    const usernameInput = document.getElementById('username-input');
    const messageInput = document.getElementById('message-input');

    // Function to add a new message to the chat window
    function addMessage(user, content) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.textContent = `${user}: ${content}`;
        chatWindow.appendChild(messageElement);
        // Scroll to bottom of chat window
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    // Function to handle sending a message
    function sendMessage() {
        const username = usernameInput.value.trim();
        const message = messageInput.value.trim();
        if (username !== '' && message !== '') {
            addMessage(username, message);
            messageInput.value = ''; // Clear the message input
        }
    }

    // Function to add user logged in message
    function userLoggedIn(username) {
        addMessage(`${username} has joined the chat`);
    }

    // Attach event listener to the send button
    document.getElementById('send-button').addEventListener('click', sendMessage);

    // Focus on the message input when page loads
    messageInput.focus();

    // Simulate user joining (for demonstration)
    //  const token = localStorage.getItem("token");
    //  const data = jwt.verify(token , process.env.JWT_TOKEN)
    //  loggerObj.log(data)
     //const defaultUsername = 'data.name+data.id';
    const defaultUsername = 'Guest' + Math.floor(Math.random() * 1000);
    usernameInput.value = defaultUsername;
    userLoggedIn(defaultUsername);
});