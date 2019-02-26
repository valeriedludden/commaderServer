const net = require('net');
const fs = require('fs');

let writeStream = fs.createWriteStream('./serverLog.log');

let clientCounter = 1;
let clientArray = [];
let adminPassword = 'password';
let newName = ' ';
let kickName = ' ';
let whisperName = '';

        let server = net.createServer(client => {
            client.username = `Person${clientCounter}`;
            clientCounter++;
            clientArray.push(client);

            client.write(`Welcome to the chat room ${client.username}!`);

            chat(client, `${client.username} has joined the group`);

            client.on('data', (dataChunk)=> {
                let data = dataChunk.toString();

                //find out if it is a special "/" command
                if (data[0] === '/') {
                    let commandArray = data.split(' ');

                    //whisper
                    if (commandArray[0] === '/w') {
                        whisperName = commandArray[1];
                        if(whisperName != client.username && commandArray.length > 2) {

                            secretMessage = commandArray.slice(2, commandArray.length).toString();
                            console.log(`Private Message from ${client.username} to ${whisperName}: ${secretMessage}`);

                            clientArray.forEach((socketClient) => {

                                if (whisperName === socketClient.username) {
                                    socketClient.write(`Private message from ${client.username} ${secretMessage}`);
                                    writeStream.write(`Private message from ${client.username} "${secretMessage}" to ${socketClient.username}`);
                                    return;
                                }
                            });
                        }
                    }
                    //Change username
                    if (commandArray[0] === '/username') {
                        newName = commandArray[1];
                        if (newName !== '' && newName !== client.username) {

                            writeStream.write(`${client.username} has changed their name to ${newName}`);
                            clientArray.forEach((clientSocket) => {
                                if (clientSocket.username === client.username) {
                                    clientSocket.write(`Your user name been reset to ${newName}`);
                                    console.log(`${client.username} has reset their username to ${newName}`)
                                } else {
                                    clientSocket.write(`${client.username} has changed their username to ${newName}`)
                                }
                            });
                            client.username = newName;
                        }
                    }

                    if (commandArray[0] === '/kick' && commandArray[1] === adminPassword && client.username === commandArray[2]){
                        client.write("You can't kick yourself out");
                        return;
                    }
                        if (commandArray[0] === '/kick' && commandArray[1] === adminPassword && client.username !== commandArray[2]) {
                            kickName = commandArray[2];
                            clientArray.forEach((clientSocket, index) => {
                                if (clientSocket.username === kickName) {
                                    clientArray.splice(index, 1);
                                    clientSocket.write('You have been voted off the island');
                                    chat(client, `${clientSocket.username} has been kicked out of the group`);
                                }
                            });
                            kickName = '';

                        }
                    //Show client list
                    if (commandArray[0] === '/clientlist') {
                        console.log("clientlist");
                        let nameArray = [];
                        clientArray.forEach((clientSocket) =>{
                            nameArray.push(clientSocket.username)
                        });
                        client.write(`Current users are: ${nameArray}`);
                        console.log(`${client.username} asked for current user list`);
                        writeStream.write(`${client.username} asked for current user list`);

                    }

                } else


                    chat(client, `${client.username} says: "${data}"`);

                client.on('close', (dataChunck) => {

                    clientArray.forEach((clientSocket, index) => {
                        if (clientSocket.username === client.username) {
                            clientArray.splice(index, 1)
                        }
                    });
                    chat(client, `${client.username} has left the group`);
                });
            });

        }).listen(5000);

        console.log("listening to port 5000");

        function chat(client, message) {
            writeStream.write(`${message}\n\n`);
            clientArray.forEach((clientSocket) => {
                if (clientSocket.username === client.username) {
                    return;
                } else {
                    clientSocket.write(message)
                }
            });
            console.log(message);
        }

