document.addEventListener('DOMContentLoaded', () => {
    //document.querySelector('#search').addEventListener('keyup', filter_table);
    // There are searchBtn and searchInput in index.html
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
    // Observe every element with class red-circle
    document.querySelectorAll('.red-circle').forEach((element) => {
        observer.observe(element);
    });
    // Do the same for .black-circle
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
    // Get from local storage current pokemon name
    update_selected_pokemon();
    // Get each element with class pkmn-type
    document.querySelectorAll('.pkmn-type').forEach((element) => {
        // Get text from element
        let type = element.innerHTML;
        // Change background color of element
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
        // href to search/<name>/1
        element.href = '/search/' + current_pokemon + '/1';
    });
    // If current pokemon is pokemon on card = recolor card-header to yellow
    document.querySelectorAll('.card-header').forEach((element) => {
        // Get into h2 of card-header
        let card_header = element.querySelector('h2');
        // Get text from h2
        let card_header_text = card_header.querySelector('a').innerHTML;
        // Get text from h2 without spaces
        // If text from h2 is equal to current pokemon name
        if (card_header_text === current_pokemon) {
            // Recolor card-header to yellow
            // Remove class white
            element.classList.remove('white');
            element.classList.add('yellow');
            console.log(element);
        } else {
            // Remove yellow color from card-header
            element.classList.remove('yellow');
            // Add white color to card-header
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