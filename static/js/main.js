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
    
});

function filter_table() {
    let filter = document.querySelector('#search').value.toUpperCase();
    // On click - go to @app.route('/search/<name>/<int:page>')
    window.location.href = '/search/' + filter + '/1';
}
