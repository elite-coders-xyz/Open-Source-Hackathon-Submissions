// Global variables
let mediaRecorder;
let audioChunks = [];
let recordedBlob;
let currentSessionId = "";
let autoRecordEnabled = false;
let isWaitingForResponse = false;
let isRecording = false;
let retryCount = 0;
const MAX_RETRIES = 3;

// Server configuration
const SERVER_BASE_URL = "http://127.0.0.1:8000";

// Error handling configuration
const ERROR_CONFIG = {
  showNotifications: true,
  playErrorSounds: true,
  autoRetry: true,
  fallbackAudioEnabled: true,
};

// Enhanced UI elements mapping
const UI_ELEMENTS = {
  currentSession: "current-session",
  conversationTurns: "conversation-turns",
  totalMessages: "total-messages",
  mainRecordButton: "main-record-button",
  recordStatusText: "record-status-text",
  sendTextButton: "send-text-button",
  textInput: "text-input",
  voiceSelect: "voice-select",
  statusDisplay: "status-display",
  autoRecordToggle: "auto-record-toggle",
  historyMessages: "history-messages",
  newSessionBtn: "new-session-btn",
  clearHistoryBtn: "clear-history-btn",
  loadSessionBtn: "load-session-btn",
  customSessionInput: "custom-session-input",
  errorContainer: "error-container",
  warningContainer: "warning-container",
  serverStatus: "server-status",
  responseAudio: "response-audio",
};

// Initialize when page loads
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Enhanced Voice Chat Client initializing...");

  initializeSession();
  setupEventListeners();
  setupErrorHandling();
  checkServerHealth();
  enhanceAccessibility();
  handleOfflineMode();
  setupKeyboardShortcuts();

  console.log("✅ Voice Chat Client loaded successfully!");
});

// Event Listeners Setup
function setupEventListeners() {
  console.log("Setting up event listeners...");

  // Session management
  const newSessionBtn = getElementById(UI_ELEMENTS.newSessionBtn);
  const clearHistoryBtn = getElementById(UI_ELEMENTS.clearHistoryBtn);
  const loadSessionBtn = getElementById(UI_ELEMENTS.loadSessionBtn);

  if (newSessionBtn) newSessionBtn.addEventListener("click", createNewSession);
  if (clearHistoryBtn)
    clearHistoryBtn.addEventListener("click", clearCurrentSession);
  if (loadSessionBtn)
    loadSessionBtn.addEventListener("click", loadCustomSession);

  // Main record button (unified start/stop)
  const mainRecordButton = getElementById(UI_ELEMENTS.mainRecordButton);
  if (mainRecordButton) {
    mainRecordButton.addEventListener("click", toggleRecording);
    console.log("Record button listener added");
  } else {
    console.error("Main record button not found!");
  }

  // Text input and send
  const sendTextButton = getElementById(UI_ELEMENTS.sendTextButton);
  const textInput = getElementById(UI_ELEMENTS.textInput);

  if (sendTextButton) sendTextButton.addEventListener("click", sendToAI);
  if (textInput) {
    textInput.addEventListener("keydown", handleTextInputKeydown);
    textInput.addEventListener("input", handleTextInputChange);
  }

  // Auto-record toggle
  const autoRecordToggle = getElementById(UI_ELEMENTS.autoRecordToggle);
  if (autoRecordToggle)
    autoRecordToggle.addEventListener("click", toggleAutoRecord);

  // Voice selection
  const voiceSelect = getElementById(UI_ELEMENTS.voiceSelect);
  if (voiceSelect) voiceSelect.addEventListener("change", handleVoiceChange);

  console.log("Event listeners setup complete");
}

// Enhanced Recording Toggle
function toggleRecording() {
  console.log(
    "Toggle recording called. Current state:",
    isRecording,
    "Waiting for response:",
    isWaitingForResponse
  );

  if (isWaitingForResponse) {
    showWarning("Please wait for the current response to complete", 3000);
    return;
  }

  if (!isRecording) {
    startRecording();
  } else {
    stopRecording();
  }
}

// Enhanced Recording Start
async function startRecording() {
  console.log("Starting recording...");

  try {
    // Check if browser supports getUserMedia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("Your browser does not support audio recording");
    }

    // Check for microphone permissions first
    const permissions = await navigator.permissions.query({
      name: "microphone",
    });
    console.log("Microphone permission state:", permissions.state);

    if (permissions.state === "denied") {
      showError(
        "Microphone access denied. Please enable microphone permissions in your browser settings."
      );
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        channelCount: 1,
        sampleRate: 16000,
      },
    });

    console.log("Microphone access granted, creating MediaRecorder...");

    audioChunks = [];

    // Check supported MIME types
    let mimeType = "audio/webm;codecs=opus";
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = "audio/webm";
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "audio/mp4";
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = ""; // Let browser choose
        }
      }
    }

    console.log("Using MIME type:", mimeType);

    const options = mimeType ? { mimeType } : {};
    mediaRecorder = new MediaRecorder(stream, options);

    mediaRecorder.ondataavailable = (event) => {
      console.log("Data available:", event.data.size, "bytes");
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      console.log("MediaRecorder stopped");
      try {
        recordedBlob = new Blob(audioChunks, {
          type: mimeType || "audio/webm",
        });
        console.log("Recorded blob size:", recordedBlob.size);

        if (recordedBlob.size === 0) {
          showError("No audio was recorded. Please try again.");
          return;
        }

        const voiceId =
          getElementById(UI_ELEMENTS.voiceSelect)?.value || "en-US-natalie";
        await transcribeAndProcess(recordedBlob, voiceId);
      } catch (error) {
        console.error("Error processing recording:", error);
        showError("Failed to process recording: " + error.message);
      } finally {
        // Stop all tracks to release microphone
        stream.getTracks().forEach((track) => {
          track.stop();
          console.log("Track stopped");
        });
      }
    };

    mediaRecorder.onerror = (event) => {
      console.error("MediaRecorder error:", event.error);
      showError(
        "Recording failed: " + (event.error?.message || "Unknown error")
      );
    };

    mediaRecorder.start(1000); // Collect data every second
    console.log("MediaRecorder started");

    updateRecordingUI(true);
    updateStatus("🎤 Recording...", "recording");

    // Add visual feedback
    addRecordingVisualFeedback();
  } catch (error) {
    console.error("Failed to start recording:", error);
    handleRecordingError(error);
  }
}

// Enhanced Recording Stop
function stopRecording() {
  console.log("Stopping recording...");

  try {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      console.log("MediaRecorder stop() called");
      updateRecordingUI(false);
      updateStatus("⏹️ Processing recording...", "processing");
      removeRecordingVisualFeedback();
    } else {
      console.log(
        "MediaRecorder not in recording state:",
        mediaRecorder?.state
      );
    }
  } catch (error) {
    console.error("Error stopping recording:", error);
    showError("Failed to stop recording: " + error.message);
  }
}

// Enhanced UI Update for Recording
function updateRecordingUI(recording) {
  console.log("Updating recording UI:", recording);

  const recordButton = getElementById(UI_ELEMENTS.mainRecordButton);
  const statusText = getElementById(UI_ELEMENTS.recordStatusText);

  isRecording = recording;

  if (recordButton) {
    const icon = recordButton.querySelector(".record-icon");

    if (recording) {
      recordButton.classList.add("recording");
      if (icon) icon.textContent = "⏹️";
      recordButton.title = "Click to stop recording";
      recordButton.setAttribute("aria-label", "Stop recording");
      if (statusText) statusText.textContent = "Recording... Click to stop";
    } else {
      recordButton.classList.remove("recording", "processing");
      if (icon) icon.textContent = "🎤";
      recordButton.title = "Click to start recording";
      recordButton.setAttribute("aria-label", "Start recording");
      if (statusText) statusText.textContent = "Click to start recording";
    }
  }
}

// Enhanced Processing UI
function updateProcessingUI(processing) {
  const recordButton = getElementById(UI_ELEMENTS.mainRecordButton);

  if (recordButton) {
    if (processing) {
      recordButton.classList.add("processing");
      recordButton.disabled = true;
    } else {
      recordButton.classList.remove("processing");
      recordButton.disabled = false;
    }
  }
}

// Enhanced Transcription and Processing
async function transcribeAndProcess(audioBlob, voiceId = "en-US-natalie") {
  console.log("Starting transcription and processing...");

  try {
    isWaitingForResponse = true;
    updateProcessingUI(true);

    updateStatus("🔄 Transcribing and processing...", "processing");

    const formData = new FormData();
    formData.append("audio_file", audioBlob, "recording.webm");
    formData.append("voiceId", voiceId);

    console.log(
      "Sending request to:",
      `${SERVER_BASE_URL}/agent/chat/${currentSessionId}`
    );

    const response = await makeRobustAPICall(
      `${SERVER_BASE_URL}/agent/chat/${currentSessionId}`,
      {
        method: "POST",
        body: formData,
        timeout: 60000,
      }
    );

    console.log("API Response received:", response);
    await handleAPIResponse(response);
  } catch (error) {
    console.error("Error in transcribeAndProcess:", error);
    handleProcessingError(error);
  } finally {
    isWaitingForResponse = false;
    updateProcessingUI(false);
  }
}

// Enhanced Text Message Sending
async function sendToAI() {
  console.log("Sending text message...");

  try {
    if (isWaitingForResponse) {
      showWarning("Please wait for the current response to complete", 3000);
      return;
    }

    const textInput = getElementById(UI_ELEMENTS.textInput);
    const text = textInput?.value?.trim();

    if (!text) {
      showError("Please enter some text to send", 3000);
      textInput?.focus();
      return;
    }

    isWaitingForResponse = true;
    updateProcessingUI(true);

    updateStatus("🔄 Processing your message...", "processing");

    const voiceId =
      getElementById(UI_ELEMENTS.voiceSelect)?.value || "en-US-natalie";

    const formData = new FormData();
    formData.append("text", text);
    formData.append("voiceId", voiceId);

    console.log(
      "Sending text request to:",
      `${SERVER_BASE_URL}/agent/chat/${currentSessionId}`
    );

    const response = await makeRobustAPICall(
      `${SERVER_BASE_URL}/agent/chat/${currentSessionId}`,
      {
        method: "POST",
        body: formData,
        timeout: 60000,
      }
    );

    console.log("Text API Response received:", response);
    await handleAPIResponse(response);

    // Clear text input on success
    if (textInput) {
      textInput.value = "";
      handleTextInputChange(); // Update send button state
    }
  } catch (error) {
    console.error("Error in sendToAI:", error);
    handleProcessingError(error);
  } finally {
    isWaitingForResponse = false;
    updateProcessingUI(false);
  }
}

// Enhanced API Response Handling
async function handleAPIResponse(response) {
  try {
    console.log("Handling API Response:", response);

    if (response.error) {
      await handleErrorResponse(response);
      return;
    }

    if (
      response.status === "success" ||
      response.status === "success_no_audio"
    ) {
      await handleSuccessResponse(response);
    } else {
      showError("Unexpected response format from server");
    }
  } catch (error) {
    console.error("Error handling API response:", error);
    showError("Failed to process server response: " + error.message);
  }
}

// Enhanced Success Response Handling
async function handleSuccessResponse(response) {
  console.log("Handling success response...");

  // Add messages to chat with animation
  if (response.input) {
    addMessageToChat("user", response.input);
  }

  if (response.response) {
    addMessageToChat(
      "assistant",
      response.response,
      response.status === "success_no_audio"
    );
  }

  // Play audio if available
  if (response.audio_urls && response.audio_urls.length > 0) {
    await playResponseAudio(response.audio_urls);
  } else if (response.audio_url) {
    await playResponseAudio([response.audio_url]);
  } else if (response.tts_error) {
    showWarning(
      response.tts_error_message ||
        "Audio generation failed, but here's the text response",
      5000
    );
  }

  // Update session information
  if (response.conversation_turns !== undefined) {
    updateSessionInfo(
      response.conversation_turns,
      response.conversation_length
    );
  }

  updateStatus("✅ Response completed!", "success");

  // Auto-record next message if enabled
  if (autoRecordEnabled && !isWaitingForResponse) {
    setTimeout(() => {
      if (!isWaitingForResponse && !isRecording) {
        startRecording();
      }
    }, 1500);
  }
}

// Enhanced Error Response Handling
async function handleErrorResponse(response) {
  console.log("Handling error response:", response);

  const errorMessage = response.error_message || "An unexpected error occurred";
  showError(errorMessage);

  if (response.response) {
    addMessageToChat("assistant", response.response, true);
  }

  if (response.session_id) {
    await loadSessionHistory();
  }
}

// Enhanced Audio Playback
async function playResponseAudio(audioUrls) {
  try {
    console.log("Playing response audio:", audioUrls.length, "chunks");
    updateStatus("🔊 Playing audio response...", "processing");

    const audio = getElementById(UI_ELEMENTS.responseAudio);
    if (!audio) {
      console.error("Audio element not found");
      return;
    }

    for (let i = 0; i < audioUrls.length; i++) {
      const audioUrl = audioUrls[i];
      console.log(
        `Playing audio chunk ${i + 1}/${audioUrls.length}: ${audioUrl}`
      );

      audio.src = audioUrl;
      audio.volume = 0.8;

      await new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error("Audio playback timeout"));
        }, 30000);

        const cleanup = () => {
          clearTimeout(timeoutId);
          audio.removeEventListener("ended", onEnded);
          audio.removeEventListener("error", onError);
        };

        const onEnded = () => {
          cleanup();
          resolve();
        };

        const onError = (error) => {
          cleanup();
          console.error("Audio playback error:", error);
          reject(error);
        };

        audio.addEventListener("ended", onEnded, { once: true });
        audio.addEventListener("error", onError, { once: true });

        audio.play().catch(reject);
      });
    }

    updateStatus("🔊 Audio playback completed", "success");
  } catch (error) {
    console.error("Audio playback failed:", error);
    showWarning(
      "Audio playback failed, but you can see the text response above",
      5000
    );
  }
}

// Enhanced Chat Message Addition
function addMessageToChat(role, content, isError = false) {
  const historyContainer = getElementById(UI_ELEMENTS.historyMessages);
  if (!historyContainer) {
    console.error("History container not found");
    return;
  }

  console.log(
    "Adding message to chat:",
    role,
    content.substring(0, 100) + "..."
  );

  // Remove the placeholder if it exists
  const emptyChat = historyContainer.querySelector(".empty-chat");
  if (emptyChat) {
    emptyChat.remove();
  }

  const messageDiv = document.createElement("div");
  messageDiv.className = `chat-message ${role} ${isError ? "error" : ""}`;

  const time = new Date().toLocaleTimeString();
  const errorIndicator = isError
    ? '<span class="error-indicator" title="This message had issues">⚠️</span>'
    : "";

  messageDiv.innerHTML = `
    <div class="message-content">${errorIndicator}${escapeHtml(content)}</div>
    <div class="message-time">${time}</div>
  `;

  historyContainer.appendChild(messageDiv);

  // Smooth scroll to bottom
  setTimeout(() => {
    historyContainer.scrollTo({
      top: historyContainer.scrollHeight,
      behavior: "smooth",
    });
  }, 100);
}

// Enhanced Status Update
function updateStatus(message, type = "info") {
  const statusElement = getElementById(UI_ELEMENTS.statusDisplay);
  if (!statusElement) return;

  console.log("Status update:", message, type);

  const iconElement = statusElement.querySelector(".status-icon");
  const textElement = statusElement.querySelector(".status-text");

  if (textElement) {
    textElement.textContent = message.replace(
      /^[🟢🔴🟡⚠️🔄🎤⏹️📤🔊✅❌]+ ?/,
      ""
    );
  }

  if (iconElement) {
    const iconMap = {
      info: "🟢",
      recording: "🎤",
      processing: "🔄",
      success: "✅",
      error: "❌",
      warning: "⚠️",
    };
    iconElement.textContent = iconMap[type] || "🟢";
  }

  statusElement.className = `status-display ${type}`;
}

// Session Management
function initializeSession() {
  console.log("Initializing session...");

  const urlParams = new URLSearchParams(window.location.search);
  const sessionFromUrl = urlParams.get("session");

  if (sessionFromUrl && sessionFromUrl.length > 0) {
    currentSessionId = sessionFromUrl;
  } else {
    currentSessionId = generateSessionId();
    updateURL();
  }

  const currentSessionElement = getElementById(UI_ELEMENTS.currentSession);
  if (currentSessionElement) {
    currentSessionElement.textContent = currentSessionId;
  }

  console.log("Session initialized:", currentSessionId);
  loadSessionHistory();
}

function generateSessionId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `session-${timestamp}-${random}`;
}

function updateURL() {
  const newUrl = `${window.location.pathname}?session=${currentSessionId}`;
  window.history.replaceState({}, "", newUrl);
}

async function loadSessionHistory() {
  try {
    console.log("Loading session history for:", currentSessionId);

    const data = await makeRobustAPICall(
      `${SERVER_BASE_URL}/agent/history/${currentSessionId}`,
      {
        timeout: 10000,
      }
    );

    console.log("Session history loaded:", data);

    if (data.status === "success") {
      updateSessionInfo(data.conversation_turns, data.message_count);
      displayChatHistory(data.history);
    }
  } catch (error) {
    console.error("Failed to load session history:", error);
    showWarning("Could not load conversation history", 5000);
  }
}

function updateSessionInfo(turns, messages) {
  const turnsElement = getElementById(UI_ELEMENTS.conversationTurns);
  const messagesElement = getElementById(UI_ELEMENTS.totalMessages);

  if (turnsElement) turnsElement.textContent = turns || 0;
  if (messagesElement) messagesElement.textContent = messages || 0;
}

function displayChatHistory(history) {
  const historyContainer = getElementById(UI_ELEMENTS.historyMessages);
  if (!historyContainer) return;

  historyContainer.innerHTML = "";

  if (!history || history.length === 0) {
    historyContainer.innerHTML = `
      <div class="empty-chat">
        <div class="empty-icon">💭</div>
        <p>Start a conversation by recording or typing a message</p>
      </div>
    `;
    return;
  }

  console.log("Displaying chat history:", history.length, "messages");

  history.forEach((message, index) => {
    setTimeout(() => {
      const messageDiv = document.createElement("div");
      messageDiv.className = `chat-message ${message.role}`;

      const time = new Date(message.timestamp * 1000).toLocaleTimeString();
      messageDiv.innerHTML = `
        <div class="message-content">${escapeHtml(message.content)}</div>
        <div class="message-time">${time}</div>
      `;

      historyContainer.appendChild(messageDiv);
    }, index * 50); // Staggered animation
  });

  setTimeout(() => {
    historyContainer.scrollTop = historyContainer.scrollHeight;
  }, history.length * 50 + 100);
}

function createNewSession() {
  console.log("Creating new session...");

  currentSessionId = generateSessionId();
  const currentSessionElement = getElementById(UI_ELEMENTS.currentSession);
  if (currentSessionElement) {
    currentSessionElement.textContent = currentSessionId;
  }

  updateURL();

  updateSessionInfo(0, 0);
  const historyContainer = getElementById(UI_ELEMENTS.historyMessages);
  if (historyContainer) {
    historyContainer.innerHTML = `
      <div class="empty-chat">
        <div class="empty-icon">💭</div>
        <p>Start a conversation by recording or typing a message</p>
      </div>
    `;
  }
  updateStatus("🆕 New session created!", "success");
}

async function clearCurrentSession() {
  try {
    console.log("Clearing current session...");

    const response = await makeRobustAPICall(
      `${SERVER_BASE_URL}/agent/history/${currentSessionId}`,
      {
        method: "DELETE",
        timeout: 10000,
      }
    );

    console.log("Clear session response:", response);

    if (response.error) {
      showError(response.error_message || "Failed to clear session");
      return;
    }

    updateSessionInfo(0, 0);
    const historyContainer = getElementById(UI_ELEMENTS.historyMessages);
    if (historyContainer) {
      historyContainer.innerHTML = `
        <div class="empty-chat">
          <div class="empty-icon">💭</div>
          <p>Start a conversation by recording or typing a message</p>
        </div>
      `;
    }
    updateStatus("🗑️ Session history cleared!", "success");
  } catch (error) {
    console.error("Failed to clear session:", error);
    showError("Failed to clear session history: " + error.message);
  }
}

function loadCustomSession() {
  const customSessionInput = getElementById(UI_ELEMENTS.customSessionInput);
  const sessionId = customSessionInput?.value?.trim();

  if (!sessionId) {
    showError("Please enter a session ID", 3000);
    customSessionInput?.focus();
    return;
  }

  currentSessionId = sessionId;
  const currentSessionElement = getElementById(UI_ELEMENTS.currentSession);
  if (currentSessionElement) {
    currentSessionElement.textContent = currentSessionId;
  }

  updateURL();

  if (customSessionInput) customSessionInput.value = "";
  loadSessionHistory();
  updateStatus("📂 Session loaded!", "success");
}

// Enhanced Auto-Record Toggle
function toggleAutoRecord() {
  autoRecordEnabled = !autoRecordEnabled;
  const toggle = getElementById(UI_ELEMENTS.autoRecordToggle);
  const statusElement = toggle?.querySelector(".toggle-status");

  if (toggle && statusElement) {
    if (autoRecordEnabled) {
      toggle.classList.add("active");
      statusElement.textContent = "ON";
    } else {
      toggle.classList.remove("active");
      statusElement.textContent = "OFF";
    }
  }

  updateStatus(
    `🔄 Auto-record ${autoRecordEnabled ? "enabled" : "disabled"}`,
    "info"
  );
}

// Enhanced Event Handlers
function handleTextInputKeydown(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    e.preventDefault();
    sendToAI();
  }
}

function handleTextInputChange() {
  const textInput = getElementById(UI_ELEMENTS.textInput);
  const sendButton = getElementById(UI_ELEMENTS.sendTextButton);

  if (textInput && sendButton) {
    const hasText = textInput.value.trim().length > 0;
    sendButton.disabled = !hasText || isWaitingForResponse;
    sendButton.style.opacity = hasText && !isWaitingForResponse ? "1" : "0.5";
  }
}

function handleVoiceChange() {
  const voiceSelect = getElementById(UI_ELEMENTS.voiceSelect);
  if (voiceSelect) {
    const selectedVoice = voiceSelect.options[voiceSelect.selectedIndex].text;
    updateStatus(`🎭 Voice changed to ${selectedVoice}`, "info");
  }
}

// Enhanced Error Handling
function handleRecordingError(error) {
  console.error("Recording error:", error);

  if (error.name === "NotAllowedError") {
    showError(
      "Microphone access denied. Please enable microphone permissions and try again."
    );
  } else if (error.name === "NotFoundError") {
    showError(
      "No microphone found. Please connect a microphone and try again."
    );
  } else if (error.name === "NotReadableError") {
    showError("Microphone is already in use by another application.");
  } else {
    showError("Failed to start recording: " + error.message);
  }
}

function handleProcessingError(error) {
  console.error("Processing error:", error);

  if (error.message.includes("timeout")) {
    showError(
      "The request took too long. Please try with a shorter recording or message."
    );
  } else if (error.message.includes("No internet") || !navigator.onLine) {
    showError(
      "No internet connection. Please check your network and try again."
    );
  } else if (error.message.includes("Failed to fetch")) {
    showError(
      "Cannot connect to the server. Please make sure the server is running."
    );
  } else {
    showError("Failed to process your request: " + error.message);
  }
}

// Enhanced API Call Function
async function makeRobustAPICall(url, options = {}) {
  console.log("Making API call to:", url);

  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    options.timeout || 30000
  );

  let attempt = 0;
  const maxAttempts = options.maxRetries || 1;

  while (attempt < maxAttempts) {
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      console.log("API response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log("API response data:", data);
        return data;
      } else {
        const text = await response.text();
        console.log("API response text:", text.substring(0, 200) + "...");
        return text;
      }
    } catch (error) {
      attempt++;
      clearTimeout(timeoutId);

      console.error(`API call attempt ${attempt} failed:`, error);

      if (error.name === "AbortError") {
        throw new Error(
          "Request timeout - the server is taking too long to respond"
        );
      }

      if (!navigator.onLine) {
        throw new Error("No internet connection");
      }

      if (attempt >= maxAttempts) {
        throw error;
      }

      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
}

// Enhanced Notification Functions
function showError(message, duration = 8000) {
  console.error("Showing error:", message);
  updateStatus(`❌ ${message}`, "error");

  const errorContainer = getElementById(UI_ELEMENTS.errorContainer);
  if (errorContainer) {
    errorContainer.innerHTML = `
      <div class="error-message">
        <span class="error-icon">⚠️</span>
        <span class="error-text">${escapeHtml(message)}</span>
        <button onclick="hideError()" class="close-btn" title="Dismiss">✖️</button>
      </div>
    `;
    errorContainer.style.display = "block";

    // Auto hide after duration
    setTimeout(hideError, duration);
  }

  // Add to browser console for debugging
  console.error("Error:", message);
}

function showWarning(message, duration = 6000) {
  console.warn("Showing warning:", message);
  updateStatus(`⚠️ ${message}`, "warning");

  const warningContainer = getElementById(UI_ELEMENTS.warningContainer);
  if (warningContainer) {
    warningContainer.innerHTML = `
      <div class="warning-message">
        <span class="warning-icon">⚠️</span>
        <span class="warning-text">${escapeHtml(message)}</span>
        <button onclick="hideWarning()" class="close-btn" title="Dismiss">✖️</button>
      </div>
    `;
    warningContainer.style.display = "block";

    // Auto hide after duration
    setTimeout(hideWarning, duration);
  }

  console.warn("Warning:", message);
}

function hideError() {
  const errorContainer = getElementById(UI_ELEMENTS.errorContainer);
  if (errorContainer) {
    errorContainer.style.display = "none";
    errorContainer.innerHTML = "";
  }
}

function hideWarning() {
  const warningContainer = getElementById(UI_ELEMENTS.warningContainer);
  if (warningContainer) {
    warningContainer.style.display = "none";
    warningContainer.innerHTML = "";
  }
}

// Server Health Check
async function checkServerHealth() {
  try {
    console.log("Checking server health...");

    const response = await makeRobustAPICall(`${SERVER_BASE_URL}/health`, {
      method: "GET",
      timeout: 5000,
    });

    console.log("Server health response:", response);
    displayHealthStatus(response);

    if (response.status === "degraded") {
      showWarning(
        "Some services are currently unavailable. Functionality may be limited.",
        10000
      );
    }
  } catch (error) {
    console.error("Server health check failed:", error);
    displayHealthStatus({ status: "unhealthy", message: "Server unavailable" });
    showError(
      "Cannot connect to the server. Please make sure it is running on " +
        SERVER_BASE_URL
    );
  }
}

function displayHealthStatus(health) {
  const statusElement = getElementById(UI_ELEMENTS.serverStatus);
  if (!statusElement) return;

  const statusIndicator = statusElement.querySelector(".status-indicator");
  const statusContent = statusElement.querySelector(
    ".server-status-content span"
  );

  const statusColors = {
    healthy: "var(--success-color, #22c55e)",
    degraded: "var(--warning-color, #f59e0b)",
    unhealthy: "var(--danger-color, #ef4444)",
  };

  if (statusIndicator) {
    statusIndicator.style.background =
      statusColors[health.status] || statusColors.unhealthy;
    statusIndicator.className = `status-indicator ${health.status}`;
  }

  if (statusContent) {
    if (health.apis) {
      statusContent.innerHTML = `
        <div style="font-weight: 700; margin-bottom: 4px;">Server: ${health.status.toUpperCase()}</div>
        <div style="font-size: 0.75rem;">
          STT: ${health.apis.assemblyai?.status || "Unknown"}<br>
          LLM: ${health.apis.gemini?.status || "Unknown"}<br>
          TTS: ${health.apis.murf?.status || "Unknown"}
        </div>
      `;
    } else {
      statusContent.textContent = health.message || `Server: ${health.status}`;
    }
  }
}

// Visual Feedback Functions
function addRecordingVisualFeedback() {
  document.body.classList.add("recording-active");

  // Add pulsing effect to record button
  const recordButton = getElementById(UI_ELEMENTS.mainRecordButton);
  if (recordButton) {
    recordButton.style.boxShadow = "0 0 30px rgba(239, 68, 68, 0.5)";
  }
}

function removeRecordingVisualFeedback() {
  document.body.classList.remove("recording-active");

  const recordButton = getElementById(UI_ELEMENTS.mainRecordButton);
  if (recordButton) {
    recordButton.style.boxShadow = "";
  }
}

// Keyboard Shortcuts
function setupKeyboardShortcuts() {
  console.log("Setting up keyboard shortcuts...");

  document.addEventListener("keydown", (event) => {
    // Prevent shortcuts when typing in inputs
    if (["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)) {
      return;
    }

    switch (event.code) {
      case "Space":
        event.preventDefault();
        toggleRecording();
        break;

      case "Escape":
        event.preventDefault();
        hideError();
        hideWarning();
        if (isRecording) {
          stopRecording();
        }
        break;

      case "KeyN":
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          createNewSession();
        }
        break;

      case "KeyC":
        if ((event.ctrlKey || event.metaKey) && event.shiftKey) {
          event.preventDefault();
          clearCurrentSession();
        }
        break;
    }
  });

  // Show/hide keyboard hints
  let hintsTimeout;
  document.addEventListener("keydown", () => {
    const hints = document.querySelector(".floating-hints");
    if (hints) {
      hints.style.opacity = "1";
      clearTimeout(hintsTimeout);
      hintsTimeout = setTimeout(() => {
        hints.style.opacity = "0.7";
      }, 3000);
    }
  });
}

// Enhanced Error Handling Setup
function setupErrorHandling() {
  console.log("Setting up error handling...");

  // Global error handler
  window.addEventListener("error", (event) => {
    console.error("Global error:", event.error);
    showError(
      "An unexpected error occurred. Please refresh the page if problems persist."
    );
  });

  // Unhandled promise rejection handler
  window.addEventListener("unhandledrejection", (event) => {
    console.error("Unhandled promise rejection:", event.reason);
    showError(
      "An unexpected error occurred. Please refresh the page if problems persist."
    );
    event.preventDefault();
  });

  // Online/offline handlers
  window.addEventListener("online", () => {
    console.log("Connection restored");
    updateStatus("🟢 Connection restored", "success");
    hideError();
    checkServerHealth();
  });

  window.addEventListener("offline", () => {
    console.log("Connection lost");
    showError("No internet connection. Please check your network.");
    updateStatus("🔴 No internet connection", "error");
  });
}

// Accessibility Enhancements
function enhanceAccessibility() {
  console.log("Enhancing accessibility...");

  const recordButton = getElementById(UI_ELEMENTS.mainRecordButton);
  const textInput = getElementById(UI_ELEMENTS.textInput);

  if (recordButton) {
    recordButton.setAttribute("aria-label", "Start or stop voice recording");
    recordButton.setAttribute("role", "button");
    recordButton.setAttribute("tabindex", "0");
  }

  if (textInput) {
    textInput.setAttribute("aria-label", "Type your message here");
  }

  // Add focus management
  document.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      document.body.classList.add("keyboard-navigation");
    }
  });

  document.addEventListener("mousedown", () => {
    document.body.classList.remove("keyboard-navigation");
  });
}

// Offline Mode Handling
function handleOfflineMode() {
  if (!navigator.onLine) {
    showError("You are currently offline. Some features may not work.");
  }

  // Service worker registration for offline support (if available)
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.log("Service worker registration failed:", err);
    });
  }
}

// Utility Functions
function getElementById(id) {
  const element = document.getElementById(id);
  if (!element) {
    console.warn(`Element with ID '${id}' not found`);
  }
  return element;
}

function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, function (m) {
    return map[m];
  });
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Initialize text input change handler with debouncing
document.addEventListener("DOMContentLoaded", () => {
  const textInput = getElementById(UI_ELEMENTS.textInput);
  if (textInput) {
    const debouncedHandler = debounce(handleTextInputChange, 300);
    textInput.addEventListener("input", debouncedHandler);
  }
});

// Periodic health check
setInterval(checkServerHealth, 30000); // Check every 30 seconds

// Export functions for global access (for onclick handlers)
window.hideError = hideError;
window.hideWarning = hideWarning;

console.log("🎯 Enhanced Voice Chat Client JavaScript loaded successfully!");
