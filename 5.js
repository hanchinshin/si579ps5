//consts
const wordInput = document.getElementById("word_input");
const savedWords = document.getElementById("saved_words");
const outputDescription = document.getElementById("output_description");
const wordOutput = document.getElementById("word_output");
const showRhymesBtn = document.getElementById("show_rhymes");
const showSynonymsBtn = document.getElementById("show_synonyms");
const link = "https://api.datamuse.com/words?"
const savedWordsList = [];

//add "s"
function addS(num) {
    if (num === 1) {
        return "";
    } else {
        return "s";
    }
}

/**
 * Returns a list of objects grouped by some property. For example:
 * groupBy([{name: 'Steve', team:'blue'}, {name: 'Jack', team: 'red'}, {name: 'Carol', team: 'blue'}], 'team')
 * 
 * returns:
 * { 'blue': [{name: 'Steve', team: 'blue'}, {name: 'Carol', team: 'blue'}],
 *    'red': [{name: 'Jack', team: 'red'}]
 * }
 * 
 * @param {any[]} objects: An array of objects
 * @param {string|Function} property: A property to group objects by
 * @returns  An object where the keys representing group names and the values are the items in objects that are in that group
 */
 function groupBy(objects, property) {
    // If property is not a function, convert it to a function that accepts one argument (an object) and returns that object's
    // value for property (obj[property])
    if(typeof property !== 'function') {
        const propName = property;
        property = (obj) => obj[propName];
    }

    const groupedObjects = new Map(); // Keys: group names, value: list of items in that group
    for(const object of objects) {
        const groupName = property(object);
        //Make sure that the group exists
        if(!groupedObjects.has(groupName)) {
            groupedObjects.set(groupName, []);
        }
        groupedObjects.get(groupName).push(object);
    }

    // Create an object with the results. Sort the keys so that they are in a sensible "order"
    const result = {};
    for(const key of Array.from(groupedObjects.keys()).sort()) {
        result[key] = groupedObjects.get(key);
    }
    return result;
}

//get rhymes
async function getRhymes() {
    outputDescription.textContent = "Words that rhyme with " + wordInput.value + ": ";
    wordOutput.textContent = "...loading";
    const result = await fetch(link + "rel_rhy=" +wordInput.value);
    const dict = await result.json();
    
    if (dict.length===0) {
        wordOutput.textContent = "(no results)";
    } else {
        wordOutput.textContent = `Words that rhyme with ${wordInput.value}: `;
        const wordGroup = groupBy(dict, 'numSyllables');
        for (const elem in wordGroup) {
            const newHeader = document.createElement("h3");
            newHeader.textContent = `${elem} syllable${addS(Number(elem))}:`; //addS func
            wordOutput.append(newHeader);
            for (const word of wordGroup[elem]) {
                const newList = document.createElement("li");
                newList.textContent = word.word;
                const saveBtn = document.createElement('button');
                saveBtn.textContent = "save";
                wordOutput.append(newList);
                newList.append(saveBtn);
                saveBtn.classList.add("btn", "btn-outline-success");
                saveBtn.addEventListener('click', ()=> {
                    savedWordsList.push(word.word);
                    savedWords.innerText = savedWordsList.join(', ');
                });
            }
        }
    }
}

//EventListener
showRhymesBtn.addEventListener('click', getRhymes);
wordInput.addEventListener('keydown', function(event) {
    if (event.keyCode === 13) {
        getRhymes();
    }
});

//get synonyms
async function getSynonyms() {
    outputDescription.textContent = "Words that rhyme with " + wordInput.value + ": ";
    wordOutput.textContent = "...loading";
    const result = await fetch(link + "ml=" +wordInput.value); //change url to the ml api
    const dict = await result.json();

    if (dict.length===0) {
        wordOutput.textContent = "(no results)";
    } else {
        wordOutput.textContent = `Words that rhyme with ${wordInput.value}: `;
        const wordGroup = groupBy(dict, 'numSyllables');
        //console.log(dict);
        for (const elem in wordGroup) {
            const newHeader = document.createElement("h3");
            newHeader.textContent = `${elem} syllable${addS(Number(elem))}:`;
            wordOutput.append(newHeader);
            for (const word of wordGroup[elem]) {
                const newList = document.createElement("li");
                newList.textContent = word.word;
                const saveBtn = document.createElement('button');
                saveBtn.textContent = "save";
                wordOutput.append(newList);
                newList.append(saveBtn);
                saveBtn.classList.add("btn", "btn-outline-success");
                saveBtn.addEventListener('click', ()=> {
                    savedWordsList.push(word.word);
                    savedWords.innerText = savedWordsList.join(', ');
                });
            }
        }
    }
}

//EventListener
showSynonymsBtn.addEventListener('click', getSynonyms);
wordInput.addEventListener('keydown', function(event) {
    if (event.keyCode === 13) {
        getSynonyms();
    }
});
