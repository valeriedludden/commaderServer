const net = require('net');
const fs = require('fs');

let writeStream = fs.createWriteStream('./serverLog.log');

let clientCounter = 1;
let clientArray = [];
let adminPassword = 'password';
let newName = ' ';
let kickName = ' ';
//*************************NEW********************************

program

    .option('/w, --whisper <whisperClient>', 'chat with only one other guest')
    .option('/username, --changeUserName <newName>', 'change user name')
    .option('/kick, --kick <kickName>', 'kick a user off the chat if admin password is given')
    .option('/clientlist, --clientlist', 'list all')
    .parse(process.argv);

// if(program.whisper){
//     fs.createReadStream(inputFile)
//         .pipe(parse({
//             columns: true,
//             ltrim: true
//         }))
//         .on('data', (data) =>{
//             if(program.file && program.column && program.value) {
//
//                 if(data[program.column] === program.value) {
//                     output.push(data);
//                 }
//             }
//         })
//         .on('end', () => {
//             console.log(output);
//         });
// }

//************************END********************************

        let server = net.createServer(client => {
            client.username = `Person ${clientCounter}`;
            clientCounter++;
            clientArray.push(client);

            client.write(`Welcome to the chat room ${client.username}!`);

            chat(client, `${client.username} has joined the group`);

            client.on('data', (data)=>{

//*******************************NEW*****************************************
                if(program.whisper){
                    clientArray.forEach((whisperClient, message, index)=>{
                        if(whisperClient === client.userName){
                            client.write(message)
                        }
                    })


                }
                if(program.userName && newName !== client.username && newName !== ' '){
                    clientArray.forEach((newName, index)=>{
                        if(clientSocket.userName === client.userName){
                            client.userName = newName;
                        }
                    })

                }
                if(program.kick && adminPassword){
                    clientArray.forEach((kickClient, index)=> {
                        if (kickName === client.username)
                            clientArray.splice(index, 1)
                    })

                }
                if(program.clientlist){

                    clientArray.forEach(client.write(
                        'Current users are: ' +
                    clientArray.forEach(client.username)))
                }




// ******************************END****************************************
                chat(client, `${client.username} says: "${data}"`);
                // console.log(`user ${client.username} says ${data}`)
            });

            client.on('close', (data)=>{

                clientArray.forEach((clientSocket, index)=>{
                    if(clientSocket.username === client.username){
                        clientArray.splice(index, 1)
                    }
                })
                chat(client, `${client.username} has left the group`);
            });

        }).listen(5000);

        console.log("listening to port 5000");

        function chat(client, message){
            writeStream.write(`${message}\n\n`);
            clientArray.forEach( (clientSocket) =>{
                if(clientSocket.username === client.username){
                    return;
                }
        else{
            clientSocket.write(message)
        }
    });
    console.log(message);
}
