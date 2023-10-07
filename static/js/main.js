document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#searchBtn').addEventListener('click', filter_table);
    document.querySelector('#search').addEventListener('keyup', (e) => {
        if (e.keyCode === 13) {
            filter_table();
        }
    });
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('red-circle-animation');
            }
      });
    });
    document.querySelectorAll('.red-circle').forEach((element) => {
        observer.observe(element);
    });
    const observer2 = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('black-circle-animation');
            }
      });
    });
    document.querySelectorAll('.black-circle').forEach((element) => {
        observer2.observe(element);
    }
    );
    update_selected_pokemon();
    document.querySelectorAll('.pkmn-type').forEach((element) => {
        let type = element.innerHTML;
        element.style.backgroundColor = colours[type];
    });
});

function filter_table() {
    let filter = document.querySelector('#search').value.toUpperCase();
    window.location.href = '/search/' + filter + '/1';
}

function selectPokemon(name) {
    localStorage.setItem('current_pokemon', name);
    update_selected_pokemon();
}

function update_selected_pokemon() {
    let current_pokemon = localStorage.getItem('current_pokemon');
    document.querySelectorAll('.pkmn-name').forEach((element) => {
        element.innerHTML = current_pokemon;
        element.href = '/search/' + current_pokemon + '/1';
    });
    document.querySelectorAll('.card-header').forEach((element) => {
        let card_header = element.querySelector('h2');
        let card_header_text = card_header.querySelector('a').innerHTML;
        if (card_header_text === current_pokemon) {
            element.classList.remove('white');
            element.classList.add('yellow');
            console.log(element);
        } else {
            element.classList.remove('yellow');
            element.classList.add('white');
        }
    });
}

const colours = {
	normal: '#A8A77A',
	fire: '#EE8130',
	water: '#6390F0',
	electric: '#F7D02C',
	grass: '#7AC74C',
	ice: '#96D9D6',
	fighting: '#C22E28',
	poison: '#A33EA1',
	ground: '#E2BF65',
	flying: '#A98FF3',
	psychic: '#F95587',
	bug: '#A6B91A',
	rock: '#B6A136',
	ghost: '#735797',
	dragon: '#6F35FC',
	dark: '#705746',
	steel: '#B7B7CE',
	fairy: '#D685AD',
};