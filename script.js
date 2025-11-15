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
  
  const url = 'https://chat-vercel-proxy.vercel.app/proxy';
  
  console.log('========== START REQUEST ==========');
  console.log('🔵 URL:', url);
  console.log('🔵 Message:', text);
  console.log('🔵 Time:', new Date().toLocaleTimeString());
  
  try {
    console.log('📤 Sending fetch request...');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: text })
    });
    
    console.log('📥 Response received!');
    console.log('🟢 Status:', response.status);
    console.log('🟢 Status Text:', response.statusText);
    console.log('🟢 OK?:', response.ok);
    console.log('🟢 Headers:', [...response.headers.entries()]);
    
    if (!response.ok) {
      let errorText;
      try {
        errorText = await response.text();
      } catch (e) {
        errorText = 'Could not read error response';
      }
      console.error('🔴 Error Response Text:', errorText);
      console.error('🔴 Full Response:', response);
      throw new Error(`Server returned ${response.status}: ${errorText}`);
    }
    
    let data;
    try {
      const responseText = await response.text();
      console.log('📄 Raw Response:', responseText);
      data = JSON.parse(responseText);
      console.log('✅ Parsed Data:', data);
    } catch (e) {
      console.error('🔴 Failed to parse JSON:', e);
      throw new Error('Invalid JSON response from server');
    }
    
    typingIndicator.remove();
    
    const replyText = data.reply || data.message || 'קיבלתי את ההודעה!';
    console.log('💬 Reply:', replyText);
    addMessage(replyText, 'bot');
    
    console.log('========== END REQUEST (SUCCESS) ==========');
    
  } catch (err) {
    console.error('========== ERROR CAUGHT ==========');
    console.error('🔴 Error Type:', err.name);
    console.error('🔴 Error Message:', err.message);
    console.error('🔴 Error Stack:', err.stack);
    console.error('🔴 Full Error Object:', err);
    console.error('========== END REQUEST (FAILED) ==========');
    
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
