import express from "express"
import axios from 'axios'
import cors from 'cors'
import { fetchRecentAnime, fetchStreamingLink, fetchTopAnime} from "./controller/anime.controller.js";


const app = express();

 
app.use(express.json());
app.use(cors())
app.get("/", (req, res) => res.send("Express on Vercel"));

app.post('/api/v1/manga', async(req, res)=>{
    const {query} = req.body
    const baseUrl = 'https://api.mangadex.org';
    
    if(!query){
        return res.status(400).send({error:"body is not found"})
    }

    try {

        const resp = await axios({
            method: 'GET',
            url: `${baseUrl}/manga`,
            params: {
                title: query,
                limit:25
            }
        });

        return res.status(200).send({message:resp.data})

    } catch (error) {
        console.log("error fetching manga", error)
        res.status(400).send({error: error})
    }

})


app.get('/api/v1/recent-manga', async(req,res)=>{
    try {
        const resp = await axios.get(
            'https://api.mangadex.org/manga?limit=60&status%5B%5D=ongoing&order%5BlatestUploadedChapter%5D=desc'
        )
            console.log(resp.data)
            return res.status(200).send({message:"fetched successfully",manga:resp.data}) 
    } catch (error) {
        console.log('error last line', error)
        return res.status(400).send({error:"error while fetching manga",error_message:error})
    }
})
  

app.post('/api/v1/chapter', async(req,res)=>{
    const {id} = req.body

    const baseUrl = 'https://api.mangadex.org';
    // https://api.mangadex.org/manga/b15632d7-88d0-4233-9815-c01e75cabda8/feed?limit=100&translatedLanguage%5B%5D=en&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&includeFutureUpdates=1&order%5Bchapter%5D=asc&includeFuturePublishAt=0&includeExternalUrl=0
    const resp = await axios({
        method: 'GET',
        url: `${baseUrl}/manga/${id}/feed`,
        params: {
            translatedLanguage: ['en'],
            order: { "chapter": "desc"},
            limit:500
        }
    });
    resp.data.data.map((chap)=>{
        console.log({id: chap.id, title:chap.title, })
    })
    // const resp = await axios.get(url)
    // chaplist = resp.data.data
    res.status(200).send({msg:"manga fetched success" , data:resp.data.data})
})


app.get('/api/v1/recent-anime', async(req,res)=>{
    console.log('hello')
    // res.send("anime")
    fetchRecentAnime(req,res)
})


app.post('/api/v1/search', async (req, res) => {
    const { query, page } = req.body; // Ensure you are using req.body for POST requests
    try {
        const encodedQuery = encodeURIComponent(query); // Encode the query to handle spaces and special characters
        const apiUrl = `https://animeapi-xi.vercel.app/anime/gogoanime/${encodedQuery}?page=${page}`;
        
        console.log(query, page);
        console.log(apiUrl);

        const response = await axios.get(apiUrl);
        return res.status(200).send({ message: response.data });
    } catch (err) {
        console.error(err); // Log the complete error to help debug
        const errorMessage = err.response?.data || err.message || "An unexpected error occurred";
        res.status(400).send({ error: errorMessage });
    }
});

app.post('/api/v1/top-anime',async(req,res)=>{
    fetchTopAnime(req,res)
})

app.get('/api/v1/ep-link',async (req,res) => {
    fetchStreamingLink(req,res)
})

// Proxy endpoint to fetch anime info
app.post("/api/v1/anime", async (req, res) => {
    const { id } = req.body;
    const url = `https://animeapi-xi.vercel.app/anime/gogoanime/info/${id}`;
    
    try {
        const { data } = await axios.get(url);
        res.status(200).json({ message: data });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch anime data", 
            error: error.message 
        });
    }
});

app.listen(3000, () => console.log("Server ready on port 3000."));

export default app;