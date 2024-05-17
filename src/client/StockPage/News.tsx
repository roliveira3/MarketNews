import { NewsItem } from "./MainSP";

/**
 * News component.
 * takes an array of news items and returns a complete news component.
 */
 export function News({news}: {news:NewsItem[]}){
    return(
        <div className="NewsComponent">
            <h1 className="NewsHeader">Top News</h1>
            {news.map((article, index) => (
                <NewsArticle key={index} newsArticle={article} />
            ))}
      
        </div>
    )
}
/**
 * newsArticle component.
 * each news article is a clickable article with a headline, summary and source. 
 */
function NewsArticle({newsArticle}:{newsArticle:NewsItem}){
    const handleArticleClick = () =>{
        window.open(newsArticle.url,'_blank');
    }

    //if the summary is too long, we truncate it and add ' [...]' at the end
    const truncateSummary = (summary: string) => {
        if (summary.length > 180) {
            let trimmedSummary = summary.substring(0, 180);
            trimmedSummary = trimmedSummary.substring(0, Math.min(trimmedSummary.length, trimmedSummary.lastIndexOf(" ")))
            return trimmedSummary + ' [...]';
        }
        return summary;
    }
    
    return(     
        <article
        className="newsArticle" 
                onClick={handleArticleClick}>
            <h4 className="ArticleHeader">{newsArticle.headline}</h4>           
            <p className="summary"><img className="ArticleImage" src={newsArticle.image} alt={newsArticle.headline} />{truncateSummary(newsArticle.summary)}</p>
            <span className="referals"><p className="source">Source: {newsArticle.source}</p>
            </span>
        </article>
        )


}