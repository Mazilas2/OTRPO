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
    // Get from local storage current pokemon name
    update_selected_pokemon();

});

function filter_table() {
    let filter = document.querySelector('#search').value.toUpperCase();
    // On click - go to @app.route('/search/<name>/<int:page>')
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