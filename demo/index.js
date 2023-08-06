const brain = require('brain.js');
const fs = require("fs");
const gradient = require("gradient-string")
const chalk = require("chalk")
const reader = require('readline').createInterface({ input: process.stdin, output: process.stdout})

const LSTM = brain.recurrent.LSTM;
const net = new LSTM();

const logo = "\n" +
    " ██████  ███████ ███    ██ ██████  ███████ ██████      ███████ ██ ███    ██ ██████  ███████ ██████  \n" +
    "██       ██      ████   ██ ██   ██ ██      ██   ██     ██      ██ ████   ██ ██   ██ ██      ██   ██ \n" +
    "██   ███ █████   ██ ██  ██ ██   ██ █████   ██████      █████   ██ ██ ██  ██ ██   ██ █████   ██████  \n" +
    "██    ██ ██      ██  ██ ██ ██   ██ ██      ██   ██     ██      ██ ██  ██ ██ ██   ██ ██      ██   ██ \n" +
    " ██████  ███████ ██   ████ ██████  ███████ ██   ██     ██      ██ ██   ████ ██████  ███████ ██   ██ \n" +
    "                                                                                                    "

main()

function main() {
    console.clear()

    console.log(gradient.morning(logo))

    reader.question(chalk.blueBright("Mot: "), (response) => {
        predict(response)
    });
}

function predict(mot){
    let data = fs.readFileSync('./model.json', {encoding:'utf8', flag:'r'});
    net.fromJSON(JSON.parse(data));

    console.clear()

    let result = net.run(mot);

    if (result === "f"){
        result = chalk.magentaBright("féminin")
    } else if(result === "m"){
        result = chalk.blueBright("masculin")
    }

    console.log(mot + gradient.morning(" est un mot ") + result)

    setTimeout(() => {
        main()
    }, 2 * 1000)
}