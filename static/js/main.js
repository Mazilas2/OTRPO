document.addEventListener('DOMContentLoaded', () => {
    //document.querySelector('#search').addEventListener('keyup', filter_table);
    // There are searchBtn and searchInput in index.html
    document.querySelector('#searchBtn').addEventListener('click', filter_table);
});

function filter_table() {
    let filter = document.querySelector('#search').value.toUpperCase();
    // On click - go to @app.route('/search/<name>/<int:page>')
    window.location.href = '/search/' + filter + '/1';
}

function expand_element() {
    // https://codepen.io/AlbertFeynman/pen/YJGjmz
}
