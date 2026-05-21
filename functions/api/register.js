export async function onRequestPost(context) {
  const request = context.request;
  const env = context.env;

  try {
    const formData = await request.formData();

    // Honeypot spam trap. Normal visitors never fill this hidden field.
    if ((formData.get("website") || "").toString().trim() !== "") {
      return json({ message: "Registration sent." }, 200);
    }

    const turnstileToken = formData.get("cf-turnstile-response");
    if (!turnstileToken) {
      return json({ message: "Please complete the anti-spam check." }, 400);
    }

    const ip = request.headers.get("CF-Connecting-IP");

    const verifyForm = new FormData();
    verifyForm.append("secret", env.TURNSTILE_SECRET_KEY);
    verifyForm.append("response", turnstileToken);
    if (ip) verifyForm.append("remoteip", ip);

    const turnstileResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: verifyForm
    });

    const turnstileResult = await turnstileResponse.json();

    if (!turnstileResult.success) {
      return json({ message: "Anti-spam verification failed. Please try again." }, 400);
    }

    const fields = {
      date: clean(formData.get("date")),
      name: clean(formData.get("name")),
      email: clean(formData.get("email")),
      phone: clean(formData.get("phone")),
      nights: clean(formData.get("nights")),
      vesselName: clean(formData.get("vesselName")),
      vesselType: clean(formData.get("vesselType")),
      vesselId: clean(formData.get("vesselId")),
      totalLength: clean(formData.get("totalLength"))
    };

    for (const [key, value] of Object.entries(fields)) {
      if (!value) {
        return json({ message: `Missing required field: ${key}` }, 400);
      }
    }

    const bodyText = `
New Degnen Bay Harbour Authority visitor registration:

Date: ${fields.date}
Name: ${fields.name}
Email: ${fields.email}
Phone / Cell: ${fields.phone}
Number of nights stay: ${fields.nights}
Vessel name: ${fields.vesselName}
Vessel type: ${fields.vesselType}
Vessel ID: ${fields.vesselId}
Total length: ${fields.totalLength} ft
`.trim();

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: env.FROM_EMAIL,
        to: ["registration@degnenbayharbourauthority.ca"],
        reply_to: fields.email,
        subject: `Visitor Registration - ${fields.vesselName}`,
        text: bodyText
      })
    });

    if (!emailResponse.ok) {
      const details = await emailResponse.text();
      console.error("Email send failed:", details);
      return json({ message: "Registration could not be emailed. Please text the harbour manager." }, 502);
    }

    return json({ message: "Registration sent." }, 200);
  } catch (error) {
    console.error(error);
    return json({ message: "Registration could not be sent. Please try again." }, 500);
  }
}

function clean(value) {
  return (value || "").toString().trim().slice(0, 500);
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    }
  });
}
