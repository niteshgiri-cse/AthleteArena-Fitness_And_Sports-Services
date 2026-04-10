import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchNewsData } from "@/redux/features/news/newsAction";


const fallbackImage =
  "https://images.unsplash.com/photo-1517649763962-0c623066013b";

const RecentNews = () => {
  const dispatch = useDispatch();
  const { news, loading, error } = useSelector((state) => state.news);

  useEffect(() => {
    dispatch(fetchNewsData());
  }, [dispatch]);

  if (loading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 py-10">{error}</p>;
  }

  if (!news.length) {
    return <p className="text-center py-10">No news found</p>;
  }

  const featured = news[0];

  return (
    <div className="max-w-7xl mx-auto px-6 py-14">
      <h2 className="text-3xl font-bold mb-8">Recent News</h2>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative rounded-xl overflow-hidden">
          <img
            src={featured.image || fallbackImage}
            className="w-full h-105 object-cover"
            onError={(e) => (e.target.src = fallbackImage)}
          />

          <div className="absolute bottom-0 p-6 text-white">
            <p className="text-sm">{featured.source}</p>
            <h3 className="text-2xl font-bold">{featured.title}</h3>
            <p className="text-sm">{featured.publishedAt}</p>
          </div>
        </div>

        <ScrollArea className="h-105 w-88 px-2">
          {news.slice(1, 6).map((item) => (
            <Link
              key={item.id}
              to={item.url}
              target="_blank"
              className="flex gap-4 p-3 hover:bg-gray-50 rounded-xl"
            >
              <img
                src={item.image || fallbackImage}
                className="w-28 h-24 object-cover rounded-lg"
                onError={(e) => (e.target.src = fallbackImage)}
              />

              <div>
                <p className="text-xs text-blue-600 uppercase">
                  {item.category}
                </p>
                <h4 className="font-semibold line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-500">
                  {item.publishedAt}
                </p>
              </div>
            </Link>
          ))}
        </ScrollArea>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {news.map((item) => (
          <Link
            key={item.url}
            to={item.url}
            target="_blank"
            className="rounded-xl overflow-hidden shadow hover:shadow-lg"
          >
            <img
              src={item.image || fallbackImage}
              className="w-full h-48 object-cover"
              onError={(e) => (e.target.src = fallbackImage)}
            />

            <div className="p-4">
              <p className="text-xs text-blue-600">{item.source}</p>
              <h3 className="font-bold line-clamp-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500">
                {item.publishedAt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentNews;