async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, 'user');
  userInput.value = '';

  const typingIndicator = addMessage('', 'typing');

  try {
    // שליחת הבקשה לשרת פרוקסי
    const response = await fetch(
      "https://server-5bck57zvr-tamar-ils-projects.vercel.app/proxy",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }) // שולחים את הטקסט של המשתמש
      }
    );

    const data = await response.json(); // עכשיו response מוגדר
    typingIndicator.remove();
    addMessage(data.reply || 'אין תשובה', 'bot');

  } catch (err) {
    typingIndicator.remove();
    addMessage('שגיאה בחיבור לשרת', 'bot');
    console.error(err);
  }
}
