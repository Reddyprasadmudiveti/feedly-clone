import Parser from "rss-parser"

export const Home = async (req, res) => {
    try {
        const { url } = req.body
        
        if (!url) {
            return res.status(400).json({ error: "URL is required" })
        }

        // Remove trailing slash if present and add /feed

        let feedUrl = url.replace(/\/$/, '')
        if (!feedUrl.endsWith('/feed')) {
            feedUrl = `${feedUrl}/feed`
        }

        console.log('Modified URL:', feedUrl)

        const parser = new Parser({
            defaultRSS: 2.0,// Default to RSS 2.0 means it will automatically detect between RSS 2.0 and RSS 1.0
            timeout: 5000,
        })

        try {
            const feed = await parser.parseURL(feedUrl)

            const items = feed.items.map(item => ({
                title: item.title,
                link: item.link,
                image: item.imag,
                pubDate: new Date(item.pubDate),
                content: item.content,
                contentSnippet: item.contentSnippet,
                guid: item.guid,
                categories: item.categories,
                creator: item.creator,
                isoDate: item.isoDate,
            }))

            res.status(200).json({ 
                images: feed.image,
                title: feed.title,
                items: items
            })
        } catch (parseError) {
            // Handle XML parsing errors specifically
            const errorMessage = parseError.message || "Failed to parse RSS feed"
            console.error("RSS Parser Error:", {
                message: errorMessage,
                url: feedUrl,
                details: parseError
            })
            res.status(400).json({
                error: "Invalid RSS feed",
                details: errorMessage,
                suggestion: "Make sure you're using a valid website URL. The system will automatically append '/feed' to the URL."
            })
        }
    } catch (error) {
        console.error("General Error:", error.message)
        res.status(500).json({
            error: "Server error",
            message: error.message
        })
    }
}