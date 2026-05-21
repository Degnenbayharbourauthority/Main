const form = document.getElementById('registrationForm');
const statusEl = document.getElementById('formStatus');
const submitButton = document.getElementById('submitButton');
const dateEl = document.getElementById('date');

function todayInPacific() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Vancouver',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());
}

function displayTodayInPacific() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Vancouver',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date());
}

dateEl.value = displayTodayInPacific();
dateEl.dataset.isoDate = todayInPacific();

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  statusEl.className = 'form-status';
  statusEl.textContent = '';

  if (!form.reportValidity()) return;

  submitButton.disabled = true;
  submitButton.textContent = 'Sending...';

  const formData = new FormData(form);
  formData.set('date', dateEl.dataset.isoDate);

  try {
    const response = await fetch(form.action, { method: 'POST', body: formData });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) throw new Error(result.error || 'The registration could not be sent.');

    form.reset();
    dateEl.value = displayTodayInPacific();
    dateEl.dataset.isoDate = todayInPacific();
    if (window.turnstile) window.turnstile.reset();
    statusEl.className = 'form-status success';
    statusEl.textContent = 'Registration sent. Thank you.';
  } catch (error) {
    statusEl.className = 'form-status error';
    statusEl.textContent = error.message || 'Something went wrong. Please text the harbour manager.';
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Send Registration';
  }
});
