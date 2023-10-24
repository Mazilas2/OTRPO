document.addEventListener('DOMContentLoaded', async () => {
    var current_pokemon = localStorage.getItem('current_pokemon');
    var random_pokemon = pkmnName;

    var pkmn_1 = await get_pokemon(current_pokemon);
    var pkmn_2 = await get_pokemon(random_pokemon);

    pkmn_1 = pkmn_1[0];
    pkmn_2 = pkmn_2[0];

    console.log(pkmn_1);
    console.log(pkmn_2);

    var pkmn_1_hp = pkmn_1['stats']['hp'];
    var pkmn_2_hp = pkmn_2['stats']['hp'];
    
    document.querySelector('#hp-count-my').innerHTML = pkmn_1_hp;
    document.querySelector('#hp-count-enemy').innerHTML = pkmn_2_hp;
    
    document.querySelector('#hp-count-my-current').innerHTML = pkmn_1_hp;
    document.querySelector('#hp-count-enemy-current').innerHTML = pkmn_2_hp;
    
    document.querySelector('#my-pokemon-img').src = pkmn_1['img_url'];
    document.querySelector('#enemy-pokemon-img').src = pkmn_2['img_url'];
    
    document.querySelector('#my-pokemon-name').innerHTML = pkmn_1['name'].toUpperCase();
    document.querySelector('#enemy-pokemon-name').innerHTML = pkmn_2['name'].toUpperCase();

    var fight_input = document.querySelector('#fight-input');

    fight_input.addEventListener('input', () => {
        if (fight_input.value.length > 0) {
            document.querySelector('#fight-btn').disabled = false;
        } else {
            document.querySelector('#fight-btn').disabled = true;
        }
    });

    document.querySelector('#fight-log').value = "";
});

function get_pokemon(pokemon_name) {
    return fetch(`/pokemon/${pokemon_name}`)
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error(error);
        });
}

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
    
    var winner = "";
    var user_attack = document.querySelector('#fight-input').value;
    var enemy_attack = Math.floor(Math.random() * 10) + 1;
    var result = isEvenOrOdd(user_attack, enemy_attack);
    var damage = Math.floor(Math.random() * 10) + 10;
    if (result) {
        // Attack enemy
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
        // Attack user
        var user_hp = document.querySelector('#hp-count-my-current').innerHTML;
        user_hp = parseInt(user_hp);
        user_hp = user_hp - damage;
        if (user_hp <= 0) {
            user_hp = 0;
            winner = "enemy";
        }
        document.querySelector('#hp-count-my-current').innerHTML = user_hp;
        var user_hp_all = document.querySelector('#hp-count-my').innerHTML;
        user_hp = parseFloat(user_hp);
        user_hp_all = parseFloat(user_hp_all);
        var percent = user_hp / user_hp_all * 100;
        if (percent <= 0) {
            percent = 0;
        }
        document.querySelector('#hp-line-my').style.width = percent + '%';
    }
    var get_damager = "";
    if (result) {
        get_damager = "Игроку";
    } else {
        get_damager = "Противнику";
    }
    var fight_log = document.querySelector('#fight-log').value;
    console.log(fight_log);
    fight_log = fight_log + `Игроку выпало ${user_attack}, противнику выпало ${enemy_attack}, нанесено ${damage} урона ${get_damager} \n`;
    document.querySelector('#fight-log').value = fight_log;
    var winner_ = "";
    if (winner != "") {
        if (winner == "user") {
            winner_ = "Игрок";
        } else {
            winner_ = "Противник";
        }
        var fight_log = document.querySelector('#fight-log').value
        fight_log = fight_log + `Победил ${winner_}`;
        document.querySelector('#fight-log').value = fight_log;
        saveWinner(winner_);

        document.querySelector('#fight-input').value = "";
        document.querySelector('#fight-btn').disabled = true;
        document.querySelector('#hp-count-my-current').innerHTML = document.querySelector('#hp-count-my').innerHTML;
        document.querySelector('#hp-count-enemy-current').innerHTML = document.querySelector('#hp-count-enemy').innerHTML;
        document.querySelector('#hp-line-my').style.width = '80%';
        document.querySelector('#hp-line-enemy').style.width = '80%';
        
    }
}

function saveWinner(winner) {
    fetch('/save_winner', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            user_pkmn: localStorage.getItem('current_pokemon'),
            enemy_pkmn: pkmnName,
            winner: winner 
        }),
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