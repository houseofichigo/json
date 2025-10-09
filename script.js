const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// Array of URLs to scrape
const urls = [
    // Insert URLs here
];

// Function to clean text
const cleanText = (text) => {
    return text
        .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/g, '') // Remove <script> tags and content
        .replace(/\s+/g, ' ') // Replace multiple whitespaces with a single space
        .trim(); // Trim leading and trailing whitespaces
};

// Function to save content in Markdown format
const saveToMarkdown = (filename, title, url, content) => {
    const markdownContent = `
# ${title}

**URL:** ${url}

## Content
${content}

---

`;
    fs.writeFileSync(filename, markdownContent, { flag: 'a' }); // Append to file
};

// Function to scrape a single URL
const scrapeUrl = async (url) => {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const title = $('title').text();
        const rawBodyText = $('body').text();
        const cleanBodyText = cleanText(rawBodyText);

        saveToMarkdown('scraped_data_cleaned.md', title, url, cleanBodyText);
        console.log(`Scraped and saved content from ${url}`);
    } catch (error) {
        console.error(`Failed to scrape ${url}:`, error.message);
    }
};

// Loop through the URLs and scrape each one
const scrapeAllUrls = async () => {
    for (const url of urls) {
        await scrapeUrl(url);
    }
};

scrapeAllUrls();
