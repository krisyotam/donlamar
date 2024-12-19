document.addEventListener("DOMContentLoaded", () => {
    const navButtons = document.querySelectorAll(".nav-button");
    const pageContent = document.getElementById("page-content");
    let currentPage = 1;  // Start with page 1
    let posts = [];  // Array to store the posts from the JSON

    const pageSize = 5;  // Number of posts per page

    // Load posts from blogs.json only once
    const loadPosts = async () => {
        try {
            const response = await fetch('/pages/json/blogs.json');
            if (!response.ok) {
                throw new Error('Failed to load posts');
            }
            const blogPosts = await response.json();
            posts = blogPosts.posts;  // Store the posts in a global variable
            renderPosts();
        } catch (error) {
            console.error('Error fetching posts:', error);
            pageContent.innerHTML = "<p>No posts available.</p>";
        }
    };

    // Render blog posts for the current page
    const renderPosts = () => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const currentPosts = posts.slice(startIndex, endIndex);  // Get the current page's posts

        if (currentPosts.length === 0) {
            pageContent.innerHTML = "<p>No posts available.</p>";
            return;
        }

        const postCards = currentPosts.map(post => `
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

        // Update pagination buttons
        updatePagination();
    };

    // Update pagination buttons based on the current page
    const updatePagination = () => {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        const totalPages = Math.ceil(posts.length / pageSize);
        
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;

        const pageNumber = document.getElementById('page-number');
        if (pageNumber) {
            pageNumber.textContent = `Page ${currentPage}`;
        }
    };

    // Event listeners for pagination buttons
    document.getElementById('prev-btn').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPosts();
        }
    });

    document.getElementById('next-btn').addEventListener('click', () => {
        const totalPages = Math.ceil(posts.length / pageSize);
        if (currentPage < totalPages) {
            currentPage++;
            renderPosts();
        }
    });

    // Initialize by loading posts and rendering
    loadPosts();

    // Set event listener on nav buttons
    navButtons.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("data-page");
            renderPage(page);
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
                loadPosts(); // Default case (home) - Load posts
        }
    };
});
