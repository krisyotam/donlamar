document.addEventListener("DOMContentLoaded", () => {
    const navButtons = document.querySelectorAll(".nav-button");
    const pageContent = document.getElementById("page-content");
    let currentPage = "home";
    let searchBar = null;  // Track the search bar element
    let overlay = null;    // Track the overlay element

    // Show welcome message and fade the rest of the page
    const showWelcomeMessage = () => {
        pageContent.innerHTML = `
            <div class="welcome-message">
                <h2>WELCOME</h2>
                <p class="search-message">Enter to search</p>
            </div>
        `;
        // Fade in the rest of the page content
        document.body.classList.add('fade-in');

        const welcomeMessage = document.querySelector('.welcome-message');
        // Fade out the welcome message after 3 seconds
        setTimeout(() => {
            welcomeMessage.classList.add('fade-out');
            loadPosts().then(posts => renderPosts(posts));  // Load and render posts after fading out
        }, 3000); // After 3 seconds
    };

    // Load posts from blogs.json
    const loadPosts = async () => {
        try {
            const response = await fetch('/pages/json/blogs.json');
            if (!response.ok) {
                throw new Error('Failed to load posts');
            }
            const blogPosts = await response.json();
            return blogPosts.posts; // Ensure to access the "posts" key from the JSON
        } catch (error) {
            console.error('Error fetching posts:', error);
            return []; // Return an empty array if fetching fails
        }
    };

    // Render blog posts with title and date initially, and show more info on hover
    const renderPosts = (posts) => {
        if (posts.length === 0) {
            pageContent.innerHTML = "<p>No posts available.</p>";
            return;
        }
        const postCards = posts.map(post => `
            <div class="card post-card">
                <a href="${post.link}" class="post-link">
                    <div class="card-header">
                        <div class="card-title">${post.title}</div>
                    </div>
                    <div class="card-content">
                        <p class="post-date">${post.date}</p>
                    </div>
                    <!-- Hidden hover info by default -->
                    <div class="post-hover-info">
                        <p class="post-description">${post.description}</p>
                        <p class="post-tags">Tags: ${post.tags.join(", ")}</p>
                    </div>
                </a>
            </div>
        `).join("");
        pageContent.innerHTML = postCards;
    };

    // Render page content based on currentPage
    const renderPage = (page) => {
        switch (page) {
            case "home":
                showWelcomeMessage();
                break;
            case "about":
                pageContent.innerHTML = `
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
                pageContent.innerHTML = `
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
                pageContent.innerHTML = `
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
                loadPosts().then(posts => renderPosts(posts)); // Default case
        }
    };

    // Set event listener on nav buttons
    navButtons.forEach(button => {
        button.addEventListener("click", () => {
            currentPage = button.getAttribute("data-page");
            renderPage(currentPage);
            navButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
        });
    });

    // Handle the Enter key to display the search bar and fade background
    document.addEventListener("keydown", async (event) => {
        if (event.key === "Enter" && !searchBar) {
            // Create and show the search bar centered with overlay
            searchBar = document.createElement("input");
            searchBar.type = "text";
            searchBar.placeholder = "Search posts or tags...";
            searchBar.classList.add("search-bar");

            // Create and show the overlay to fade the rest of the site
            overlay = document.createElement("div");
            overlay.classList.add("overlay");

            // Add the overlay and search bar to the page
            pageContent.appendChild(overlay);
            pageContent.appendChild(searchBar);

            // Focus on the search bar and center it
            searchBar.focus();

            // Create instructions under the search bar
            const instructions = document.createElement("p");
            instructions.classList.add("search-instructions");
            instructions.innerText = "Esc to close, Enter to open";
            pageContent.appendChild(instructions);

            // Fade out the background content
            document.body.classList.add('fade-background');

            // Show the search bar, instructions, and overlay with a transition
            searchBar.classList.add("show");
            instructions.classList.add("show");
            overlay.classList.add("show");
        }

        // Handle Escape key to remove the search bar and overlay
        if (event.key === "Escape" && searchBar) {
            searchBar.classList.remove("show");  // Hide the search bar
            overlay.classList.remove("show");    // Hide the overlay
            document.body.classList.remove('fade-background');  // Restore the background
            searchBar = null;    // Clear the searchBar reference

            // Remove elements after transition ends
            setTimeout(() => {
                searchBar.remove();  // Remove the search bar
                overlay.remove();    // Remove the overlay
                instructions.remove(); // Remove the instructions
            }, 300); // Wait for transition to finish
        }
    });

    // Initial page render
    renderPage(currentPage);
});
