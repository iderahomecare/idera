
const cfg = window.IDERA_CONFIG || {};

const ready =
  cfg.supabaseUrl &&
  !cfg.supabaseUrl.startsWith("YOUR_") &&
  cfg.supabaseAnonKey &&
  !cfg.supabaseAnonKey.startsWith("YOUR_");

const db = ready && window.supabase
  ? window.supabase.createClient(
      cfg.supabaseUrl,
      cfg.supabaseAnonKey
    )
  : null;

// Update footer year
const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
}

// IMPORTANT:
// Do not add a hamburger-menu click listener here.
// The menu is controlled by the inline script in index.html.

// Load gallery images from Supabase
async function loadGallery() {
  const grid = document.querySelector(".gallery-grid");

  if (!grid || !db) return;

  try {
    const { data, error } = await db
      .from("gallery_items")
      .select("id,title,description,image_url")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error || !data || !data.length) return;

    data.forEach((item) => {
      if (!item.image_url) return;

      const card = document.createElement("article");
      card.className = "gallery-item";

      const img = document.createElement("img");
      img.src = item.image_url;
      img.alt = item.title || "IDERA gallery photograph";
      img.loading = "lazy";

      const caption = document.createElement("p");
      caption.textContent = item.title || item.description || "";

      card.appendChild(img);
      card.appendChild(caption);
      grid.appendChild(card);
    });
  } catch (error) {
    console.error("Gallery loading error:", error);
  }
}

loadGallery();

// Enquiry form
const enquiryForm = document.getElementById("enquiry-form");

if (enquiryForm) {
  enquiryForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const status = document.getElementById("form-status");

    if (!status) return;

    if (!db) {
      status.textContent =
        "The enquiry form is not connected yet. Please contact us directly.";
      return;
    }

    const formData = new FormData(enquiryForm);

    const name = formData.get("name");
    const contact = formData.get("contact");
    const message = formData.get("message");

    if (!name || !contact || !message) {
      status.textContent = "Please complete all fields.";
      return;
    }

    status.textContent = "Sending your enquiry...";

    try {
      const { error } = await db
        .from("enquiries")
        .insert([{ name, contact, message }]);

      if (error) throw error;

      status.textContent =
        "Thank you! Your enquiry has been received.";

      enquiryForm.reset();
    } catch (error) {
      console.error("Enquiry submission error:", error);

      status.textContent =
        "Sorry, your enquiry could not be sent. Please try again.";
    }
  });
}
