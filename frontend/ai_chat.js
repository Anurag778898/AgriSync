/**
 * AgriSync AI Chat Client
 * Connects the AI Farming Assistant page to /api/v1/chat
 */

const CHAT_API = (location.port === '8000' || location.port === '') ? '/api/v1/chat' : 'http://127.0.0.1:8000/api/v1/chat';

let attachedFileData = null;

function formatBotMessage(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code style="background:#1a2e1a;padding:2px 6px;border-radius:4px;font-family:monospace">$1</code>')
    .replace(/\n/g, '<br>');
}

function appendMessage(role, content) {
  const container = document.getElementById('chatMessages');
  if (!container) return;

  const isUser = role === 'user';
  const div = document.createElement('div');
  div.style.cssText = `
    display:flex; gap:12px; margin-bottom:16px;
    justify-content:${isUser ? 'flex-end' : 'flex-start'};
  `;

  const bubble = document.createElement('div');
  bubble.style.cssText = `
    max-width:70%; padding:12px 16px; border-radius:12px; font-size:14px; line-height:1.6;
    background:${isUser ? '#166534' : '#1a2e1a'};
    color:${isUser ? '#dcfce7' : '#a3e635'};
    border:1px solid ${isUser ? '#15803d' : '#365314'};
  `;
  bubble.innerHTML = isUser ? content.replace(/\n/g, '<br>') : formatBotMessage(content);
  div.appendChild(bubble);
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function showTypingIndicator() {
  const container = document.getElementById('chatMessages');
  if (!container) return null;
  const div = document.createElement('div');
  div.id = 'typing-indicator';
  div.style.cssText = 'display:flex;gap:12px;margin-bottom:16px;';
  div.innerHTML = `<div style="padding:12px 16px;border-radius:12px;background:#1a2e1a;border:1px solid #365314;color:#86efac;font-size:13px;">
    <span>AgriSync AI is thinking</span>
    <span style="animation:blink 1s infinite">...</span>
  </div>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return div;
}

async function sendMessage() {
  const input = document.getElementById('chatInput');
  const btn = document.getElementById('chatSendBtn');
  if (!input) return;

  const text = input.value.trim();
  if (!text && !attachedFileData) return;

  input.value = '';
  if (btn) btn.disabled = true;

  appendMessage('user', text || '[File attached]');

  const typing = showTypingIndicator();

  try {
    const body = { message: text };
    if (attachedFileData) {
      body.file_data = attachedFileData;
      attachedFileData = null;
      const badge = document.getElementById('attachedFileBadge');
      if (badge) badge.style.display = 'none';
    }

    const res = await fetch(CHAT_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (typing) typing.remove();

    if (!res.ok) {
      const err = await res.text();
      appendMessage('assistant', `⚠️ Error ${res.status}: ${err}`);
      return;
    }

    const data = await res.json();
    const reply = data.response || data.message || data.reply || JSON.stringify(data);
    appendMessage('assistant', reply);

  } catch (err) {
    if (typing) typing.remove();
    appendMessage('assistant', `⚠️ Network error: ${err.message}`);
  } finally {
    if (btn) btn.disabled = false;
    if (input) input.focus();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('chatInput');
  const btn = document.getElementById('chatSendBtn');
  const attachBtn = document.getElementById('attachBtn');
  const fileInput = document.getElementById('chatFileInput');

  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  if (btn) btn.addEventListener('click', sendMessage);

  if (attachBtn && fileInput) {
    attachBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = e => {
        attachedFileData = e.target.result;
        const badge = document.getElementById('attachedFileBadge');
        if (badge) {
          badge.textContent = `📎 ${file.name}`;
          badge.style.display = 'inline-block';
        }
      };
      reader.readAsDataURL(file);
    });
  }

  const style = document.createElement('style');
  style.textContent = '@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }';
  document.head.appendChild(style);
});
