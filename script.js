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
  
  // יצירת אווטר בלי תמונות חיצוניות
  const avatar = document.createElement('div');
  avatar.className = 'avatar';
  avatar.style.cssText = `
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: white;
    font-size: 14px;
    flex-shrink: 0;
  `;
  
  if (type === 'user') {
    avatar.style.background = 'linear-gradient(135deg, #4fc3f7, #29b6f6)';
    avatar.textContent = 'U';
  } else {
    avatar.style.background = 'linear-gradient(135deg, #90dffe, #6ce5e5)';
    avatar.textContent = 'B';
  }
  
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
  
  const url = 'https://server-iblp.vercel.app/proxy';
  
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
      console.error('🔴 שגיאה מהשרת:', errorText);
      throw new Error('HTTP ' + response.status + ': ' + errorText);
    }
    
    const data = await response.json();
    console.log('🟢 נתונים שהתקבלו:', data);
    
    typingIndicator.remove();
    
    // הצגת התשובה
    addMessage(data.reply || data.message || 'קיבלתי את ההודעה!', 'bot');
    
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
