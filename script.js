const openChat = document.getElementById('openChat');
const closeChat = document.getElementById('closeChat');
const minimizeBtn = document.getElementById('minimizeChat');
const expandBtn = document.getElementById('expandChat');
const chatWindow = document.getElementById('chatWindow');
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

// פתיחה וסגירה
openChat.addEventListener('click', () => chatWindow.classList.add('show'));
closeChat.addEventListener('click', () => chatWindow.classList.remove('show'));

// הקטנה/הסתרה
minimizeBtn.addEventListener('click', () => chatMessages.classList.toggle('minimized'));

// הרחבה
expandBtn.addEventListener('click', () => chatWindow.classList.toggle('expanded'));

// פונקציה להוספת הודעה
function addMessage(text, sender) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', sender);

  if (sender === 'typing') {
    msgDiv.classList.add('bot');
    msgDiv.innerHTML = `<div class="avatar"><img src="bot.png" /></div><div class="text"><span></span><span></span><span></span></div>`;
  } else {
    msgDiv.innerHTML = `
      <div class="avatar"><img src="${sender === 'user' ? 'user.png' : 'bot.png'}" /></div>
      <div class="text">${text}</div>
    `;
  }

  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return msgDiv;
}

// שליחת הודעה ל-API
async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, 'user');
  userInput.value = '';

  // הצגת "כותב..."
  const typingIndicator = addMessage('', 'typing');

  try {
    const response = await fetch('https://example.com/api/chat', { // הכנס כאן את ה-URL שלך
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });

    const data = await response.json();

    typingIndicator.remove();
    addMessage(data.reply || 'אין תשובה', 'bot');

  } catch (err) {
    typingIndicator.remove();
    addMessage('שגיאה בחיבור לשרת', 'bot');
    console.error(err);
  }
}

// אירועי לחיצה ואנטר
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});
