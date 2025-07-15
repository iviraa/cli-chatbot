const chat = document.getElementById("chat");
const form = document.getElementById("chat-form");
const input = document.getElementById("message");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = input.value.trim();
    if (!msg) return;

    addMessage(msg, "user");
    input.value = "";

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
