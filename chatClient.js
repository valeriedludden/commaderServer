const net = require('net');
const readline= require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let client = net.createConnection({port: 5000}, () =>
    console.log("You have joined the chat! You can chat with friends by typing your message. Type 'exit' to leave")); // Need to "listen" to the server so.......

client.on('data', (data)=> {
    console.log(data.toString());
});

    rl.on('line', (input) => {
        if(input === 'exit'){
            console.log("Now existing program\n");
            client.destroy();
            process.exit();
        }
        else{
            client.write(input);
        }

});
