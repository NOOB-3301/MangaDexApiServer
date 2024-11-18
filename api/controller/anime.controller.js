import axios from 'axios'

export async function fetchRecentAnime(req,res) {
    const {page} = req.body
    try {
        const data = await axios.get("https://animeapi-xi.vercel.app/anime/gogoanime/recent-episodes",{ params: { page: {page}, type: 1 } })
        return res.status(200).json({message:data.data})
    } catch (error) {
        return(res.status(400).send({error:"there is error", error}))
    }
}

export async function fetchTopAnime(req,res) {
    const url = "https://animeapi-xi.vercel.app/anime/gogoanime/top-airing";
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return res.status(200).send({message:data})
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function fetchStreamingLink(req,res) {
    const {epId} = req.body
    const url = `https://animeapi-xi.vercel.app/anime/gogoanime/watch/${epId}`;
    console.log(url)
    try {
        const resp = await axios.get(url, { params: { server: "gogocdn" } });
        return res.status(200).send({message:resp.data})
        // console.log(resp.data)
    } catch (err) {
        throw new Error(err.message);
    }
}
