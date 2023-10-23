import { useState } from "react";
import "./App.css";

function App() {
  // Define state variables
  const [message, setMessage] = useState(""); // Store the user's input message
  const [chats, setChats] = useState([]);      // Store the conversation history
  const [isTyping, setIsTyping] = useState(false); // Indicates whether the chatbot is typing

  // Function to handle user messages and chatbot responses
  const chat = async (e, message) => {
    e.preventDefault(); // Prevent the default form submission behavior

    if (!message) return; // If the user's message is empty, do nothing

    setIsTyping(true); // Set isTyping to true to show a typing indicator to the user
    scrollTo(0, 1e10); // Scroll to the bottom of the chat area (a large value to ensure it scrolls down)

    let msgs = chats; // Create a copy of the current chat history

    // Add the user's message to the chat history with "role" set to "user"
    msgs.push({ role: "user", content: message });
    setChats(msgs); // Update the chat history with the new message

    setMessage(""); // Clear the input field for the user's message

    // Send a POST request to the server at "http://localhost:8000/"
    fetch("http://localhost:8000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chats, // Send the entire chat history to the server
      }),
    })
    .then((response) => response.json()) // Parse the response as JSON
    .then((data) => {
      // Add the chatbot's response to the chat history
      msgs.push(data.output);
      setChats(msgs); // Update the chat history with the chatbot's response
      setIsTyping(false); // Set isTyping to false (chatbot finished typing)
      scrollTo(0, 1e10); // Scroll to the bottom of the chat area
    })
    .catch((error) => {
      console.log(error); // Handle and log any errors that occur during the fetch request
    });
  };



  return (
    <main>
      <h1>FullStack Chat AI</h1>

      <section>
        {chats && chats.length
          ? chats.map((chat, index) => (
              <p key={index} className={chat.role === "user" ? "user_msg" : ""}>
                <span>
                  <b>{chat.role.toUpperCase()}</b>
                </span>
                <span>:</span>
                <span>{chat.content}</span>
              </p>
            ))
          : ""}
      </section>

      <div className={isTyping ? "" : "hide"}>
        <p>
          <i>{isTyping ? "Typing" : ""}</i>
        </p>
      </div>

      <form action="" onSubmit={(e) => chat(e, message)}>
        <input
          type="text"
          name="message"
          value={message}
          placeholder="Type a message here and hit Enter..."
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>
    </main>
  );
}

export default App;
