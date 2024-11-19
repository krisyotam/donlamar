document.addEventListener("DOMContentLoaded", () => {
    const navButtons = document.querySelectorAll(".nav-button");
    const pageContent = document.getElementById("page-content");
    let currentPage = "home";
  
    const blogPosts = [
      { title: "The Future of AI in Creative Industries", date: "2023-06-15" },
      { title: "Embracing Minimalism in Digital Design", date: "2023-06-10" },
      { title: "The Power of Personal Branding", date: "2023-06-05" },
      { title: "Navigating the World of Cryptocurrencies", date: "2023-05-30" },
      { title: "The Rise of Remote Work Culture", date: "2023-05-25" },
    ];
  
    const renderPage = (page) => {
      let contentHtml = "";
      switch (page) {
        case "about":
          contentHtml = `
            <div class="card">
              <div class="card-header">
                <div class="card-title">About Don Lamar</div>
              </div>
              <div class="card-content">
                <p>Don Lamar is a visionary creator and thought leader in the digital space.</p>
              </div>
            </div>
          `;
          break;
        case "follow":
          contentHtml = `
            <div class="card">
              <div class="card-header">
                <div class="card-title">Follow Don Lamar</div>
              </div>
              <div class="card-content">
                <p>Stay updated with Don Lamar's latest insights and creations.</p>
                <div class="button-group">
                  <button class="button">Twitter</button>
                  <button class="button">Instagram</button>
                  <button class="button">LinkedIn</button>
                </div>
              </div>
            </div>
          `;
          break;
        case "contact":
          contentHtml = `
            <div class="card">
              <div class="card-header">
                <div class="card-title">Contact Don Lamar</div>
              </div>
              <div class="card-content">
                <p>Get in touch with Don Lamar for collaborations and inquiries.</p>
                <button class="button">Send a Message</button>
              </div>
            </div>
          `;
          break;
        default:
          contentHtml = blogPosts.map((post) => `
            <div class="card">
              <div class="card-header">
                <div class="card-title">${post.title}</div>
              </div>
              <div class="card-content">
                <p>${post.date}</p>
              </div>
            </div>
          `).join("");
      }
      pageContent.innerHTML = contentHtml;
    };
  
    navButtons.forEach((button) => {
      button.addEventListener("click", () => {
        currentPage = button.getAttribute("data-page");
        renderPage(currentPage);
        navButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
      });
    });
  
    renderPage(currentPage);
  });
  