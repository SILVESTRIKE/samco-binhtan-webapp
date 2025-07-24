import React from 'react';
import { Calendar, User, ArrowRight, Clock } from 'lucide-react';

function NewsArticles({ 
  title = "Latest News",
  subtitle,
  articles = [],
  layout = "2-2", // "2-2" (2 articles each side), "1-1" (1 article each side)
  backgroundColor = "bg-white",
  textColor = "text-gray-900",
  showReadMore = true,
  showAuthor = true,
  showDate = true,
  showReadTime = false
}) {
  
  const getLayoutConfig = () => {
    switch(layout) {
      case "1-1":
        return { leftCount: 1, rightCount: 1 };
      case "2-2":
      default:
        return { leftCount: 2, rightCount: 2 };
    }
  };

  const { leftCount, rightCount } = getLayoutConfig();
  const leftArticles = articles.slice(0, leftCount);
  const rightArticles = articles.slice(leftCount, leftCount + rightCount);

  function ArticleCard({ article, size = "normal" }) {
    const cardSize = size === "large" ? "lg:col-span-2" : "";
    
    return (
      <article className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden ${cardSize}`}>
        {/* Article Image */}
        <div className="aspect-video overflow-hidden">
          <img 
            src={article.image} 
            alt={article.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {/* Article Content */}
        <div className="p-6">
          {/* Category Tag */}
          {article.category && (
            <span className="inline-block bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {article.category}
            </span>
          )}
          
          {/* Article Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
            {article.title}
          </h3>
          
          {/* Article Summary */}
          <p className="text-gray-600 mb-4 line-clamp-3">
            {article.summary || article.description}
          </p>
          
          {/* Article Meta */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            {showDate && article.date && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{article.date}</span>
              </div>
            )}
            
            {showAuthor && article.author && (
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
            )}
            
            {showReadTime && article.readTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{article.readTime}</span>
              </div>
            )}
          </div>
          
          {/* Read More Link */}
          {showReadMore && (
            <a 
              href={article.link || "#"}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors group"
            >
              <span>Đọc thêm</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          )}
        </div>
      </article>
    );
  }

  function ArticleColumn({ articles, position }) {
    return (
      <div className="space-y-8">
        {articles.map((article, index) => (
          <ArticleCard 
            key={`${position}-${index}`} 
            article={article}
            size={layout === "1-1" ? "large" : "normal"}
          />
        ))}
      </div>
    );
  }

  return (
    <section className={`py-20 ${backgroundColor}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold ${textColor} mb-6`}>
            {title}
          </h2>
          {subtitle && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Articles Grid */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column */}
          <ArticleColumn articles={leftArticles} position="left" />
          
          {/* Right Column */}
          <ArticleColumn articles={rightArticles} position="right" />
        </div>

        {/* View All Button */}
        {articles.length > leftCount + rightCount && (
          <div className="text-center mt-12">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
              Xem tất cả bài viết
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default NewsArticles;