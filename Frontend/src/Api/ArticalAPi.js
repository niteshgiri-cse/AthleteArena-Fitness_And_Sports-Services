import axios from "axios";

const NEWS_API = import.meta.env.VITE_NEWS_API_KEY;

export async function fetchArticle() {
  try {
  
    const today = new Date();

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const pastDate = new Date();
    pastDate.setDate(today.getDate() - 15);

    const fromDate = pastDate.toLocaleDateString("en-CA");
    const toDate = yesterday.toLocaleDateString("en-CA");

    const response = await axios.get(
      `https://newsapi.org/v2/everything`,
      {
        params: {
          q: "sports OR olympics OR fitness OR competition",
          from: fromDate,
          to: toDate,
          sortBy: "publishedAt", 
          language: "en",
          pageSize: 20,
          apiKey: NEWS_API,
        },
      }
    );

    return response.data.articles;

  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}


export async function fetchSportsByCategory() {
  try {
    const today = new Date();

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const pastDate = new Date();
    pastDate.setDate(today.getDate() - 15);

    const fromDate = pastDate.toLocaleDateString("en-CA");
    const toDate = yesterday.toLocaleDateString("en-CA");

    const categories = [
      "cricket",
      "football",
      "fitness",
      "running",
      "basketball",
    ];

    const results = [];

    for (let i = 0; i < categories.length; i++) {
      const response = await axios.get(
        "https://newsapi.org/v2/everything",
        {
          params: {
            q: categories[i],
            from: fromDate,
            to: toDate,
            sortBy: "publishedAt",
            language: "en",
            pageSize: 10,
            apiKey: NEWS_API,
          },
        }
      );

      const article = response.data.articles.find(
        (item) => item.urlToImage && item.url
      );

      if (article) {
        results.push({
          id: i + 1,
          title: article.title,
          image: article.urlToImage,
          date: new Date(article.publishedAt).toLocaleDateString(
            "en-IN",
            {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }
          ),
          category:
            categories[i].charAt(0).toUpperCase() +
            categories[i].slice(1),
          url: article.url,
        });
      }
    }

    return results;
  } catch (error) {
    console.error("Error fetching categorized sports news:", error);
    return [];
  }
}