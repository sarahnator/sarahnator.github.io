document.querySelector("#year").textContent = new Date().getFullYear();

const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const project = window.PROJECTS.find(item => item.id === id);
const root = document.querySelector("#project-page");

function mediaMarkup(project) {
  if (!project.image) return "";

  const isVideo = project.image.endsWith(".mp4") || project.image.endsWith(".webm");
  if (isVideo) {
    return `<div class="project-hero-media"><video src="${project.image}" autoplay muted loop playsinline controls></video></div>`;
  }

  return `<div class="project-hero-media"><img src="${project.image}" alt="${project.title} preview" /></div>`;
}

if (!project) {
  root.innerHTML = `
    <p class="eyebrow">Not found</p>
    <h1>Project not found.</h1>
    <p class="summary">Return to the project collection and choose an experiment.</p>
    <p><a class="button-link" href="./">Back to experiments</a></p>
  `;
} else {
  document.title = `${project.title} — Your Name`;

  root.innerHTML = `
    <p class="eyebrow">${project.date} · ${project.category}</p>
    <h1>${project.title}</h1>
    <p class="summary">${project.summary || project.description || ""}</p>

    <div class="project-links">
      ${(project.links || []).map(link => `<a class="button-link" href="${link.url}">${link.label}</a>`).join("")}
    </div>

    ${mediaMarkup(project)}

    <div class="tags">
      ${(project.tags || []).map(tag => `<span class="tag">${tag}</span>`).join("")}
    </div>

    ${(project.sections || []).map(section => `
      <section class="project-section">
        <h2>${section.heading}</h2>
        <p>${section.body}</p>
      </section>
    `).join("")}
  `;
}

function renderProjectMedia(project) {
  const src = project.image;
  const isVideo = src.endsWith(".mp4") || src.endsWith(".webm") || src.endsWith(".mov");

  if (isVideo) {
    return `
      <video class="project-media" autoplay muted loop playsinline>
        <source src="${src}" type="video/mp4">
      </video>
    `;
  }

  return `
    <img class="project-media" src="${src}" alt="${project.title}">
  `;
}