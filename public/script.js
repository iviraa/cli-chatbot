const chat = document.getElementById("chat");
const form = document.getElementById("chat-form");
const input = document.getElementById("message");

const startScreen = document.getElementById("start-screen");
const chatScreen = document.getElementById("chat-screen");
const endScreen = document.getElementById("end-screen");
const startButton = document.getElementById("start-chat");

startButton.addEventListener("click", () => {
    startScreen.classList.add("hidden");
    chatScreen.classList.remove("hidden");
    input.focus();
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = input.value.trim();
    if (!msg) return;

    addMessage(msg, "user");
    input.value = "";

    if (msg.toLowerCase() === "/end") {
        chatScreen.classList.add("hidden");
        endScreen.classList.remove("hidden");
        return;
    }

    try {
        const res = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
        });

        const data = await res.json();
        addMessage(data.response, "bot");

        if (msg === "/exit") {
            input.disabled = true;
            input.placeholder = "Session ended.";
        }
    } catch (err) {
        addMessage("Error talking to server.", "bot");
    }
});

function addMessage(text, sender) {
    const div = document.createElement("div");
    div.classList.add("message", sender);
    div.textContent = text;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}
