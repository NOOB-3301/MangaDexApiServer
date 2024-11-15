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
                title: query
            }
        });

        return res.status(200).send({message:resp.data})

    } catch (error) {
        console.log("error fetching manga", error)
        res.status(400).send({error: error})
    }

})

  

app.listen(3000, () => console.log("Server ready on port 3000."));

export default app;