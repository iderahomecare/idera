
const cfg = window.IDERA_CONFIG || {};

const db = window.supabase &&
  cfg.supabaseUrl &&
  cfg.supabaseAnonKey
    ? window.supabase.createClient(
        cfg.supabaseUrl,
        cfg.supabaseAnonKey
      )
    : null;

// Update footer year
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// Do not add a menu listener here.
// index.html already controls the hamburger menu.

// Enquiry form
const form = document.getElementById("enquiry-form");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const status = document.getElementById("form-status");
    const data = new FormData(form);

    if (!db) {
      status.textContent = "Supabase connection is not configured.";
      return;
    }

    const enquiry = {
      name: data.get("name"),
      contact: data.get("contact"),
      message: data.get("message")
    };

    status.textContent = "Sending your enquiry...";

    try {
      const { error } = await db
        .from("enquiries")
        .insert([enquiry]);

      if (error) throw error;

      status.textContent =
        "Thank you! Your enquiry has been received.";

      form.reset();

    } catch (error) {
      console.error("IDERA enquiry error:", error);

      status.textContent =
        "Submission error: " + error.message;
    }
  });
}

// Gallery
async function loadGallery() {
  const grid = document.getElementById("gallery-grid");

  if (!grid || !db) return;

  try {
    const { data, error } = await db
      .from("gallery_items")
      .select("id,title,description,image_url")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error) throw error;

    if (!data || !data.length) return;

    data.forEach((item) => {
      if (!item.image_url) return;

      const img = document.createElement("img");
      img.src = item.image_url;
      img.alt = item.title || "IDERA gallery image";
      img.loading = "lazy";

      grid.appendChild(img);
    });

  } catch (error) {
    console.error("IDERA gallery error:", error);
  }
}

loadGallery();
