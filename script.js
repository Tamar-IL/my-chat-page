// אלמנטים
const openChatBtn = document.getElementById('openChat');
const chatWindow = document.getElementById('chatWindow');
const closeBtn = document.getElementById('closeChat');
const minimizeBtn = document.getElementById('minimizeChat');
const expandBtn = document.getElementById('expandChat');
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

// פתיחת החלונית
openChatBtn.addEventListener('click', () => {
  chatWindow.style.display = 'flex';
  setTimeout(() => chatWindow.classList.add('show'), 10);
});

// סגירת החלונית
closeBtn.addEventListener('click', () => {
  chatWindow.classList.remove('show');
  setTimeout(() => chatWindow.style.display = 'none', 300);
});

// מזעור
minimizeBtn.addEventListener('click', () => {
  chatMessages.classList.toggle('minimized');
  document.querySelector('.chat-input').style.display = 
    chatMessages.classList.contains('minimized') ? 'none' : 'flex';
});

// הרחבה
expandBtn.addEventListener('click', () => {
  chatWindow.classList.toggle('expanded');
});

// הוספת הודעה
function addMessage(text, type) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;
  
  const avatar = document.createElement('img');
  avatar.className = 'avatar';
  avatar.src = type === 'user' 
    ? 'https://via.placeholder.com/32/4fc3f7/ffffff?text=U'
    : 'https://via.placeholder.com/32/90dffe/ffffff?text=B';
  
  const textDiv = document.createElement('div');
  textDiv.className = 'text';
  
  if (type === 'typing') {
    textDiv.innerHTML = '<span></span><span></span><span></span>';
    messageDiv.classList.add('typing');
  } else {
    textDiv.textContent = text;
  }
  
  messageDiv.appendChild(avatar);
  messageDiv.appendChild(textDiv);
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  return messageDiv;
}

// שליחת הודעה
async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;
  
  addMessage(text, 'user');
  userInput.value = '';
  
  const typingIndicator = addMessage('', 'typing');
  
  const url = 'https://server-git-main-tamar-ils-projects.vercel.app/proxy';
  
  console.log('🔵 שולח ל:', url);
  console.log('🔵 הודעה:', text);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: text })
    });
    
    console.log('🟢 סטטוס:', response.status);
    console.log('🟢 תקין?', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('🔴 שגיאה:', errorText);
      throw new Error('HTTP ' + response.status + ': ' + errorText);
    }
    
    const data = await response.json();
    console.log('🟢 נתונים:', data);
    
    typingIndicator.remove();
    
    // הצגת התשובה
    addMessage(data.reply || data.message || 'קיבלתי את ההודעה', 'bot');
    
  } catch (err) {
    console.error('🔴 שגיאה מלאה:', err);
    typingIndicator.remove();
    addMessage('שגיאה: ' + err.message, 'bot');
  }
}

// אירועים
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});
