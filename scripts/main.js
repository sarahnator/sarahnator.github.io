const grid = document.querySelector("#project-grid");
const buttons = document.querySelectorAll(".filter-pill");
document.querySelector("#year").textContent = new Date().getFullYear();

function mediaMarkup(project) {
  if (!project.image) {
    return `<div class="placeholder">${project.title}</div>`;
  }

  const isVideo = project.image.endsWith(".mp4") || project.image.endsWith(".webm");
  if (isVideo) {
    return `<video src="${project.image}" autoplay muted loop playsinline></video>`;
  }

  return `<img src="${project.image}" alt="${project.title} preview" loading="lazy" />`;
}

function renderProjects(filter = "all") {
  const projects = window.PROJECTS
    .filter(project => filter === "all" || project.category === filter)
    .sort((a, b) => Number(b.year || 0) - Number(a.year || 0));

  grid.innerHTML = projects.map(project => `
    <a class="project-card ${project.featured ? "featured" : ""}" href="project.html?id=${project.id}">
      <div class="media-frame">
        ${mediaMarkup(project)}
      </div>
      <div class="project-info">
        <div class="project-meta">
          <span>${project.date}</span>
          <span>·</span>
          <span>${project.category}</span>
        </div>
        <h2 class="project-title">${project.title}</h2>
        ${project.description ? `<p class="project-description">${project.description}</p>` : ""}
        <div class="tags">
          ${(project.tags || []).map(tag => `<span class="tag">${tag}</span>`).join("")}
        </div>
      </div>
    </a>
  `).join("");
}

buttons.forEach(button => {
  button.addEventListener("click", () => {
    buttons.forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    renderProjects(button.dataset.filter);
  });
});

renderProjects();
