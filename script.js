// === CONFIGURATION - UPDATE THESE VALUES ===
const SMS_COACHING_NUMBER = "+14422074242";
const COURSE_PORTAL_URL   = "https://www.intention-academy.com/login";
const ABOUT_URL           = "https://www.intention-academy.com/what-is-intention-academy";

// Optional: prefill SMS body
const SMS_BODY = "START";

// === Simple state (for demo/prototype only) ===
let userState = {
  hasPaidAccess: false
};

function saveUserState() {
  localStorage.setItem("intentionAcademyUser", JSON.stringify(userState));
}

function loadUserState() {
  const saved = localStorage.getItem("intentionAcademyUser");
  if (saved) userState = { ...userState, ...JSON.parse(saved) };
  updateUI();
}

function updateUI() {
  const subtitle = document.getElementById("courseSubtitle");
  const pill = document.getElementById("premiumPill");

  if (!subtitle || !pill) return;

  if (userState.hasPaidAccess) {
    subtitle.textContent = "Tap to continue your course";
    pill.hidden = false;
  } else {
    subtitle.textContent = "Interactive Course - Paid Access";
    pill.hidden = true;
  }
}

// Clipboard helper (works best on HTTPS / secure context)
async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) {}

  // Fallback
  const ta = document.createElement("textarea");
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  ta.remove();
  return true;
}

document.addEventListener("DOMContentLoaded", () => {
  loadUserState();

  // 1) SMS Button
  document.getElementById("smsButton").addEventListener("click", async () => {
    const ua = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);

    const body = encodeURIComponent(SMS_BODY);

    // iOS commonly needs ;body=, others typically work with ?body=
    const smsUrl = isIOS
      ? `sms:${SMS_COACHING_NUMBER};body=${body}`
      : `sms:${SMS_COACHING_NUMBER}?body=${body}`;

    // If on desktop, just copy number
    if (!/android|iphone|ipad|ipod/.test(ua)) {
      await copyText(SMS_COACHING_NUMBER);
      alert(`SMS number copied: ${SMS_COACHING_NUMBER}`);
      return;
    }

    window.location.href = smsUrl;
  });

  // 2) Course Button (same tab)
  document.getElementById("courseButton").addEventListener("click", () => {
    window.location.href = COURSE_PORTAL_URL;
  });

  // 3) About Button (same tab)
  document.getElementById("aboutButton").addEventListener("click", () => {
    window.location.href = ABOUT_URL;
  });
});

// === Demo helpers (run in console) ===
function simulatePaidAccess() {
  userState.hasPaidAccess = true;
  saveUserState();
  updateUI();
  console.log("✅ Premium simulated");
}

function resetUser() {
  localStorage.removeItem("intentionAcademyUser");
  userState = { hasPaidAccess: false };
  updateUI();
  console.log("🔄 Reset");
}