const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT | 5000;

app.use(cors({ origin: '*' })); 
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.chblh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });

        const campaignCollection = client.db('CrowndFundingDB').collection('campaigns')
        const donationCollection = client.db('CrowndFundingDB').collection('doantions')


        // Campaign

        app.get("/campaigns", async (req, res) => {
            try {
                const campaigns = await campaignCollection.find({}).toArray();
                if (campaigns.length === 0) {
                    return res.json({ message: "No campaigns found!" });
                }
                res.json(campaigns);
            } catch (error) {
                console.error("❌ Error fetching campaigns:", error);
                res.status(500).json({ message: "Server error" });
            }
        });


        app.get('/campaigns/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await campaignCollection.findOne(query);
            res.send(result);
        })

        app.get('/myCampaign', async (req, res) => {
            const email = req.query.email;  // Get email from query
            if (!email) return res.status(400).json({ error: "Email is required" });

            try {
                const campaign = await campaignCollection.find({ email }).toArray();  // Filter by email
                res.json(campaign);
            } catch (error) {
                console.error("Error fetching tasks:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });

        app.post('/campaigns', async (req, res) => {
            const campaign = req.body;
            const result = await campaignCollection.insertOne(campaign);
            res.send(result);
        })


        // DonationAmount

        app.get('/donationAmount', async (req, res) => {
            const email = req.query.email;  // Get email from query
            if (!email) return res.status(400).json({ error: "Email is required" });

            try {
                const campaign = await donationCollection.find({ donor_email: email }).toArray();  // Filter by email
                res.json(campaign);
            } catch (error) {
                console.error("Error fetching tasks:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });

        app.post('/donationAmount', async (req, res) => {

            const donation = req.body;
            const result = await donationCollection.insertOne(donation);
            res.send(result)

        })
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("All the best thing in life is in the other side of the pain")
})

app.listen(port, () => {
    console.log(`Reporting from Port:${port}`);
})
