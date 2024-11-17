import express from "express"
import axios from 'axios'
import cors from 'cors'


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
app.listen(3000, () => console.log("Server ready on port 3000."));

export default app;