const brain = require('brain.js');
const fs = require("fs");
const baseNounsFile = require('./nounsBase.json')
const nouns = require('./nouns.json')

const LSTM = brain.recurrent.LSTM;
const net = new LSTM();
const maxInput = 10000;

//reduceData();
//train();
test();

function reduceData(){
    let numbersOfInputs = baseNounsFile.length;
    let nounsBuffer = [];

    for (let i = 0; i < maxInput; i++) {
        let currentPart = baseNounsFile[getRandomInt(numbersOfInputs)];
        nounsBuffer.push({
            input: currentPart.noun,
            put: currentPart.gender
        })

        if (i % 100 === 0){
            console.log(i + "/" + maxInput)
        }
    }

    let out = JSON.parse(JSON.stringify(nounsBuffer));
    fs.writeFileSync('./nouns.json', JSON.stringify(out));
}

function train(){
    net.train(nouns, { log: true,  logPeriod: 1, errorThresh: 0.09, iterations: 50});

    fs.writeFileSync('./model.json', JSON.stringify(net.toJSON()));

    console.log("Training finished, launching test: ")

    let errors = 0;
    for (let i = 0; i < nouns.length; i++) {
        const resInput = nouns[i].input;
        const resOutput = net.run(resInput);

        let error = nouns.find(value => {
            return value.input.toUpperCase() === resInput.toUpperCase() && value.output.toUpperCase() === resOutput.toUpperCase()
        });

        errors += error ? 0 : 1;
    }
    console.log('Errors: ' + 100 * (errors / nouns.length) + "%");

    test();
}

function test(){
    let data = fs.readFileSync('./model.json', {encoding:'utf8', flag:'r'});
    net.fromJSON(JSON.parse(data));

    let word = "catapulte"
    console.log(word + ":" + net.run(word))
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}