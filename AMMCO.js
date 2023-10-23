/* Problem:

On your Facebook account, you have friends who all have a list of movies that they like. Write a function that returns the most popular movie of a person in his/her network of friends. Network means that you have to consider friends of friends as well.

Solution:

The solution relies on a popular algorithm. Online research is encouraged.

Use object oriented design with the language you like. Write at least 1 test for the happy path. */


//Data
const movieNames = [
    "The Shawshank Redemption", "The Godfather", "Pulp Fiction", "The Dark Knight", "Schindler's List", "Forrest Gump", "The Matrix", "Goodfellas", "The Lord of the Rings: The Fellowship of the Ring", "Star Wars: Episode IV - A New Hope", "Inception", "The Silence of the Lambs", "Gladiator",
    "The Departed", "The Green Mile", "Fight Club", "Casablanca", "The Godfather: Part II", "The Lord of the Rings: The Two Towers", "Se7en", "The Lord of the Rings: The Return of the King", "The Usual Suspects", "The Pianist", "The Lion King", "Titanic", "The Avengers", "Avatar",
    "The Terminator", "Saving Private Ryan", "Jurassic Park", "The Revenant", "The Great Gatsby", "The Social Network", "Eternal Sunshine of the Spotless Mind", "The Big Lebowski", "The Grand Budapest Hotel", "Inglourious Basterds", "Deadpool", "The Martian", "Gone with the Wind",
    "The Wizard of Oz", "Back to the Future", "The Breakfast Club", "Ferris Bueller's Day Off", "The Princess Bride", "Blade Runner", "Interstellar", "Jaws", "The Shining", "A Beautiful Mind", "Memento"
  ];

  const names = [
    "Liam", "Olivia", "Noah", "Emma", "Oliver", "Ava", "Isabella", "Sophia", "Mia", "Charlotte",
    "Amelia", "Harper", "Evelyn", "Abigail", "Emily", "Elizabeth", "Sofia", "Avery", "Ella", "Scarlett",
    "Grace", "Chloe", "Lily", "Samantha", "Victoria", "Penelope", "Lila", "Hannah", "Natalie", "Eleanor",
    "Addison", "Aubrey", "Zoey", "Brooklyn", "Nora", "Leah", "Zoe", "Hazel", "Aurora", "Luna", "Savannah",
    "Audrey", "Claire", "Bella", "Skylar", "Lucy", "Paisley", "Everly", "Anna", "Caroline", "Nova",
    "Genesis", "Stella", "Maya", "Naomi", "Aaliyah", "Elena", "Sarah", "Ariana", "Allison", "Gabriella",
    "Alice", "Madeline", "Cora", "Ruby", "Eva", "Serenity", "Autumn", "Adeline", "Hailey", "Gianna",
    "Valentina", "Isla", "Eliana", "Quinn", "Neveah", "Ivy", "Sadie", "Piper", "Lydia", "Alexa", "Josephine",
    "Emery", "Julia", "Delilah", "Arianna", "Violet", "Kaylee", "Sophie", "Brielle", "Madelyn", "Peyton",
    "Riley", "Clara", "Hadley", "Aubree", "Ariella", "Ellie", "Natalia", "Isabelle", "Lillian", "Makayla"
  ];

//Class Definition
class Person {
    constructor(name, favMovie) {
      this.name = name;
      this.favMovie = favMovie;
      this.friends = new Set([]);
    }

    getFriends(){
        return Array.from(this.friends.keys());
    }

    addFriend(person){
        //create two-way relationship
        this.friends.add(person);
        person.friends.add(this);
    }

    addManyFriends(peopleArray){
        //create two-way relationship for each person
        peopleArray.forEach(person => {
            this.friends.add(person)
            person.friends.add(this);
        });
    }
  }

/*Helper Functions*/
//Random index from array
function getRandomIdx(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return randomIndex;
}
//Random choice from array
function getRandom(array) {
    return array[getRandomIdx(array)];
}

//Assign names and favorite movies
function makePeople(){
    return names.map(name => {
        return new Person(
            name,
            getRandom(movieNames)
        );
     });
}

//Make network of friends
function makeNetwork(peopleArray){
    peopleArray.forEach((person, idx) => {
        //add a random person as a friend
        let randIdx = getRandomIdx(peopleArray);
        while (randIdx === idx){
            randIdx = getRandomIdx(peopleArray);
        }
        person.addFriend(peopleArray[randIdx]);
    });
}

/*SOLUTION*/
function getMostPopularMovie(person){
    let popularityScores = {};
    let visited = new Set([]);
    let queue = [person]
    //BFS traversal of network to get movie popularity
    while (queue.length > 0){
        const curr = queue.pop();
        if (!visited.has(curr.name)) {
            visited.add(curr.name);
            //add score popularity to our saved object
            if (!popularityScores[curr.favMovie]) {
                popularityScores[curr.favMovie] = 1
            } else popularityScores[curr.favMovie] += 1;
            queue = queue.concat(curr.getFriends());
        }
    }
    //Get max score and return movie name
    const highScore = Math.max(...Object.values(popularityScores));
    const names = Object.keys(popularityScores);
    const networkFavMovieIdx = names.findIndex(movie => popularityScores[movie] === highScore)
    const networkFavMovie = names[networkFavMovieIdx]
    //Deal with edge case of ties
    names.splice(networkFavMovieIdx, 1)
    const networkFavMovie2 = names.find(movie => popularityScores[movie] === highScore)
    if(popularityScores[networkFavMovie] !== popularityScores[networkFavMovie2]){
        console.log(`The most popular movie from ${person.name}'s network is: ${networkFavMovie}`)
        return [networkFavMovie]
    }
    console.log(`There was a tie! The most popular movies from ${person.name}'s network are: ${networkFavMovie} and ${networkFavMovie2}`)
    return [networkFavMovie, networkFavMovie2]

}

/*TESTING*/
function test(){
    //Instantiate all people objects and add friends
    const allPeople = makePeople(names);
    makeNetwork(allPeople);
    let testGroupNames = new Set([]);
    let testGroup = [];
    //get unique set of 10 people and run test
    while(testGroup.length < 10){
        let curr = getRandom(allPeople);
        if(!testGroupNames.has(curr.name)){
            testGroupNames.add(curr.name);
            testGroup.push(curr);
        }
    }
    testGroup.forEach(person => getMostPopularMovie(person));
}

//Run test 5 times
const testCount = 5;
for (let i = 0; i < testCount; i++){
    console.log(`Test #${i+1}`);
    test();
    console.log("----------------");
}
