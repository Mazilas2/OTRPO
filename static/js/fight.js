document.addEventListener('DOMContentLoaded', async () => {
    // Make request to server to get the current pokemons
    // Get pokemon from local storage (current_pokemon)
    var current_pokemon = localStorage.getItem('current_pokemon');
    var random_pokemon = pkmnName;
    var pkmn_1 = await get_pokemon(current_pokemon);
    var pkmn_2 = await get_pokemon(random_pokemon);
    // Wait for the response
    // Console log the response
    pkmn_1 = pkmn_1[0];
    pkmn_2 = pkmn_2[0];
    console.log(pkmn_1);
    console.log(pkmn_2);
    // Get from data hp
    var pkmn_1_hp = pkmn_1['stats']['hp'];
    var pkmn_2_hp = pkmn_2['stats']['hp'];
    // Set to hp-count-my
    document.querySelector('#hp-count-my').innerHTML = pkmn_1_hp;
    document.querySelector('#hp-count-enemy').innerHTML = pkmn_2_hp;
    // Set same hp to hp-count-my-current
    document.querySelector('#hp-count-my-current').innerHTML = pkmn_1_hp;
    document.querySelector('#hp-count-enemy-current').innerHTML = pkmn_2_hp;
    // Set image to my-pokemon-img
    document.querySelector('#my-pokemon-img').src = pkmn_1['img_url'];
    document.querySelector('#enemy-pokemon-img').src = pkmn_2['img_url'];
    // my-pokemon-name
    document.querySelector('#my-pokemon-name').innerHTML = pkmn_1['name'];
    document.querySelector('#enemy-pokemon-name').innerHTML = pkmn_2['name'];


});

function get_pokemon(pokemon_name) {
    return fetch(`/get_pokemon?pokemon_name=${pokemon_name}`)
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error(error);
        });
}

// Check two numbers on even or odd
function isEvenOrOdd(num1, num2) {
    if (num1 % 2 == 0 && num2 % 2 == 0) {
        return true;
    } else if (num1 % 2 != 0 && num2 % 2 != 0) {
        return true;
    } else {
        return false;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function attack() {
    // Clear fight-log (textarea)
    document.querySelector('#fight-log').innerHTML = "";
    var winner = "";
    while (winner == "") {
        // Generate number for user (1-10)
        var user_attack = Math.floor(Math.random() * 10) + 1;
        // Generate number for enemy (1-10)
        var enemy_attack = Math.floor(Math.random() * 10) + 1;
        // If two numbers are even or two numbers are odd, user attack
        var result = isEvenOrOdd(user_attack, enemy_attack);
        // If two numbers are different, enemy attack
        var damage = Math.floor(Math.random() * 10) + 10;
        if (result) {
            // Enemy hp - damage
            var enemy_hp = document.querySelector('#hp-count-enemy-current').innerHTML;
            enemy_hp = parseInt(enemy_hp);
            enemy_hp = enemy_hp - damage;
            if (enemy_hp <= 0) {
                enemy_hp = 0;
                winner = "user";
            }
            document.querySelector('#hp-count-enemy-current').innerHTML = enemy_hp;
            // Change width of hp bar (hp-line-enemy) (hp-count-enemy/enemy_hp)
            var enemy_hp_all = document.querySelector('#hp-count-enemy').innerHTML;
            enemy_hp = parseFloat(enemy_hp);
            enemy_hp_all = parseFloat(enemy_hp_all);
            var percent = enemy_hp / enemy_hp_all * 100;
            document.querySelector('#hp-line-enemy').style.width = percent + '%';

        } else {
            // User hp - damage
            var user_hp = document.querySelector('#hp-count-my-current').innerHTML;
            user_hp = parseInt(user_hp);
            user_hp = user_hp - damage;
            if (user_hp <= 0) {
                user_hp = 0;
                winner = "enemy";
            }
            document.querySelector('#hp-count-my-current').innerHTML = user_hp;
            // Change width of hp bar (hp-line-my) (hp-count-my/user_hp)
            var user_hp_all = document.querySelector('#hp-count-my').innerHTML;
            user_hp = parseFloat(user_hp);
            user_hp_all = parseFloat(user_hp_all);
            var percent = user_hp / user_hp_all * 100;
            if (percent <= 0) {
                percent = 0;
            }
            document.querySelector('#hp-line-my').style.width = percent + '%';
        }
        // Add to fight-log (textarea) (user_attack, enemy_attack, damage) in format: Игроку выпало 5, противнику выпало 7, нанесено урона 15 {Кому}
        var get_damager = "";
        if (result) {
            get_damager = "Игроку";
        } else {
            get_damager = "Противнику";
        }
        var fight_log = document.querySelector('#fight-log').innerHTML;
        fight_log = fight_log + `Игроку выпало ${user_attack}, противнику выпало ${enemy_attack}, нанесено ${damage} урона ${get_damager}\n`;
        document.querySelector('#fight-log').innerHTML = fight_log;
    }
    // Add to fight-log (textarea) winner in format: Победил Игрок
    var winner_ = "";
    if (winner == "user") {
        winner_ = "Игрок";
    } else {
        winner_ = "Противник";
    }
    var fight_log = document.querySelector('#fight-log').innerHTML;
    fight_log = fight_log + `Победил ${winner_}`;
    document.querySelector('#fight-log').innerHTML = fight_log;
    // Make request to server to save winner
    saveWinner(winner_);
}

function saveWinner(winner) {
    fetch('/save_winner', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ winner: winner }),
    })
        .then(response => {
            if (response.ok) {
                console.log('Winner saved successfully');
            } else {
                console.error('Failed to save winner');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}