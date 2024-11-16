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

app.post('/api/v1/chapter', async(req,res)=>{
    const {id} = req.body
    const url = `https://api.mangadex.org/manga/${id}/feed?translatedLanguage%5B%5D=en&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&includeFutureUpdates=1&order%5BcreatedAt%5D=asc&order%5BupdatedAt%5D=asc&order%5BpublishAt%5D=asc&order%5BreadableAt%5D=asc&order%5Bvolume%5D=asc&order%5Bchapter%5D=asc`


    const baseUrl = 'https://api.mangadex.org';

    const resp = await axios({
        method: 'GET',
        url: `${baseUrl}/manga/${id}/feed`,
        params: {
            translatedLanguage: ['en']
        }
    });

    // const resp = await axios.get(url)
    // chaplist = resp.data.data
    res.status(200).send({msg:"manga fetched success" , data:resp.data.data})
})

  

app.listen(3000, () => console.log("Server ready on port 3000."));

export default app;