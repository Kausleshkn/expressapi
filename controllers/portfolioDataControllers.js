import fs from "fs";
import qs from "querystring";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let count = 1;

const portfolioData = async (req, res) => {

    try {
        let body = '';
        req.on('data', async function (chunk) {

            body += chunk;

            if (body.length > 2000) {
                req.removeAllListeners('data');
                req.removeAllListeners('end');
                res.status(413).send("user trying to spam");
                // req.destroy();
            }
        });

        req.on('end', function () {

            let data = qs.parse(body);
            data.id = count;
            count++;

            fs.appendFile(path.join(__dirname, 'user_msg.txt'), `${JSON.stringify(data)} \n \n`, error => {
                if (error) {
                    res.status(500).send("Data not recived");
                } else {
                    res.status(200).send("Data Recived");
                }
            });
        });

    } catch (error) {
        res.status(503).send("Data not submitted");
    }
};


const displayUserdata = (req, res) => {

    let stream = fs.createReadStream(path.join(__dirname, 'user_msg.txt'), { encoding: 'utf-8' });
    res.setHeader('Content-Type', 'application/json'); // application/json, text/plain
    stream.pipe(res);

    stream.on('error', (err) => {
        res.status(500).send('Internal Server Error');
    });

    // stream.pipe(fs.createWriteStream("./controllers/user_data.txt"));

    // stream.on("data", (chunk) => {
    //     res.send(chunk);
    // });

    // stream.on("end", () => {
    //     res.status(200);
    // });

    // stream.on("error", (err) => {
    //     res.send("File not Found");
    // });


    // res.sendFile(path.join(process.cwd(), 'controllers', 'user_msg.txt'));
}

export default portfolioData;
export { displayUserdata };