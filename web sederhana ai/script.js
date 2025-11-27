// --- KONFIGURASI ---
// Masukkan API Key Anda di sini
const API_KEY_RAW = "AIzaSyB8BustHEz-Zb0e546DQ1TIPfD_YEmjH70"; 

// FUNGSI PEMBERSIH: Menghapus spasi atau enter yang tidak sengaja ter-copy
const API_KEY = API_KEY_RAW.trim();

// Kita kembali mencoba model 'gemini-1.5-flash' yang lebih ringan untuk akun baru
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
async function kirimPesan() {
    const inputField = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");
    const userText = inputField.value.trim();

    if (userText === "") return;

    tampilkanPesan(userText, "user-message");
    inputField.value = ""; 
    
    const loadingMessage = tampilkanPesan("Sedang menghubungi server...", "bot-message");

    try {
        console.log("Mencoba mengirim ke:", API_URL); // Cek URL di console

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userText }] }]
            })
        });

        // Cek jika ada error
        if (!response.ok) {
            // Kita paksa baca pesan error dari Google
            const errorData = await response.json().catch(() => null);
            
            // Tampilkan error lengkap di Console agar kita tahu penyebab pastinya
            console.error("DETAIL ERROR DARI GOOGLE:", JSON.stringify(errorData, null, 2));
            
            let pesanError = `Gagal: ${response.status} ${response.statusText}`;
            if (errorData && errorData.error && errorData.error.message) {
                pesanError += ` - ${errorData.error.message}`;
            }
            throw new Error(pesanError);
        }
        
        const data = await response.json();
        const botReply = data.candidates[0].content.parts[0].text;

        chatBox.removeChild(loadingMessage);
        tampilkanPesan(botReply, "bot-message");

    } catch (error) {
        chatBox.removeChild(loadingMessage);
        // Tampilkan pesan error di layar chat
        tampilkanPesan(`⚠️ ERROR: ${error.message}`, "bot-message");
        console.error("Error System:", error);
    }
}

function tampilkanPesan(text, className) {
    const chatBox = document.getElementById("chat-box");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", className);
    messageDiv.innerText = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return messageDiv;
}