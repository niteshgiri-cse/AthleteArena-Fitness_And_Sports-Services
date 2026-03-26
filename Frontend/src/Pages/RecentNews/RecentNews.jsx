import { fetchArticle, fetchSportsByCategory } from "@/Api/ArticalAPi";
import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";
const CACHE_KEY = "sports_news_cache";
const CACHE_DURATION = 60 * 60 * 1000;
const RecentNews = () => {
  const [recentNews, setRecentNews] = useState([]);
  const [sportsNews, setSportsNews] = useState([]);
  useEffect(() => {
    let refreshTimer;

    async function loadNews() {
      try {
        const cachedData = localStorage.getItem(CACHE_KEY);

        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          const timePassed = Date.now() - parsed.timestamp;

          if (timePassed < CACHE_DURATION) {
            setRecentNews(parsed.recentNews);
            setSportsNews(parsed.sportsNews);

            refreshTimer = setTimeout(loadNews, CACHE_DURATION - timePassed);
            return;
          }
        }

        const [res, sports] = await Promise.all([
          fetchArticle(),
          fetchSportsByCategory(),
        ]);

        setRecentNews(res || []);
        setSportsNews(sports || []);

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            recentNews: res,
            sportsNews: sports,
            timestamp: Date.now(),
          }),
        );

        refreshTimer = setTimeout(loadNews, CACHE_DURATION);
      } catch (error) {
        console.error("API Error:", error);
      }
    }

    loadNews();

    return () => clearTimeout(refreshTimer);
  }, []);

  console.log("Recent:", recentNews);
  console.log("Sports:", sportsNews);

  return (
    <div className="max-w-7xl mx-auto px-6 py-14">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Recent News</h2>
        <button className="text-blue-600 font-semibold hover:underline">
          View All
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative rounded-xl overflow-hidden group cursor-pointer">
          <img
            src={
              recentNews[0]?.urlToImage
                ? recentNews[0].urlToImage
                : "https://images.unsplash.com/photo-1517649763962-0c623066013b"
            }
            alt=""
            className="w-full h-105 object-cover group-hover:scale-105 transition duration-500"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1517649763962-0c623066013b";
            }}
          />

          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

          <div className="absolute bottom-0 p-6 text-white">
            <p className="text-sm">{recentNews[0]?.source?.name}</p>

            <h3 className="text-2xl font-bold">{recentNews[0]?.title}</h3>

            <p className="text-sm">
              {recentNews[0]?.publishedAt &&
                new Date(recentNews[0].publishedAt).toLocaleDateString(
                  "en-IN",
                  {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    timeZone: "Asia/Kolkata",
                  },
                )}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <ScrollArea className=" h-105 w-88 rounded-md  px-2">
            {sportsNews?.map((news) => (
              <Link
                key={news.id}
                to={news.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-4 group cursor-pointer hover:bg-gray-50 p-3 rounded-xl transition duration-300"
              >
                <img
                  src={
                    news.image
                      ? news.image
                      : "https://images.unsplash.com/photo-1517649763962-0c623066013b"
                  }
                  alt={news.title}
                  className="w-28 h-24 object-cover rounded-lg group-hover:scale-105 transition duration-300"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1517649763962-0c623066013b";
                  }}
                />

                <div className="flex flex-col justify-between">
                  <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide">
                    {news.category}
                  </p>

                  <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition leading-snug line-clamp-2">
                    {news.title}
                  </h4>

                  <p className="text-sm text-gray-500">{news.date}</p>
                </div>
              </Link>
            ))}
          </ScrollArea>
        </div>
      </div>

      <div className="mb-12 mt-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
          Top Sports Stories
        </h1>
        <div className="w-16 h-0.75 bg-blue-600 mt-4 rounded-full"></div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {recentNews.map((news) => (
          <Link
            key={news?.url}
            to={news?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl overflow-hidden shadow hover:shadow-lg transition cursor-pointer block"
          >
            <img
              src={
                news?.urlToImage
                  ? news.urlToImage
                  : "https://images.unsplash.com/photo-1517649763962-0c623066013b"
              }
              alt=""
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1517649763962-0c623066013b";
              }}
            />

            <div className="p-4">
              <p className="text-xs text-blue-600 font-semibold">
                {news?.source?.name}
              </p>

              <h3 className="font-bold line-clamp-2">{news?.title}</h3>

              <p className="text-sm text-gray-500">
                {news?.publishedAt &&
                  new Date(news.publishedAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    timeZone: "Asia/Kolkata",
                  })}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentNews;