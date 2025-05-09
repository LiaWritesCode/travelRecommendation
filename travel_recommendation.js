// Recommendations & Search
document.querySelector(".search-bar").addEventListener("submit", (event) => {
    event.preventDefault(); // Prevents page reload

    const searchQuery = document.querySelector(".search-bar input[name='search']").value.toLowerCase();

    fetch("travel_recommendation_api.json")
        .then(response => response.json())
        .then(data => {
            const filteredResults = data.filter(destination => 
                destination.name.toLowerCase().includes(searchQuery)
            );

            displayRecommendations(filteredResults);
        })
        .catch(error => console.error("Fetch Error:", error));
});

// Keyword Searches
const searchQuery = document.getElementById("searchBox").value.toLowerCase();
const keywords = {
    beach: ["beach", "beaches"],
    temple: ["temple", "temples"],
    country: ["country", "countries"]
};