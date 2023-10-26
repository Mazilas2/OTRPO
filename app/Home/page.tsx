'use client';

import './page.css'
import Card from '../../components/Home/Card'
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Pagination from '../../components/Home/Pagination'


class cardData {
  name: string;
  img_url: string;
  types: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    'special-attack': number;
    'special-defense': number;
    speed: number;
  };

  constructor(name_: string, img_url: string, types: string[], stats: { hp: number; attack: number; defense: number; 'special-attack': number; 'special-defense': number; speed: number; }) {
    this.name = name_;
    this.img_url = img_url;
    this.types = types;
    this.stats = stats;
  }
}

const Home: React.FC = () => {
  const [pokemonData, setPokemonData] = useState([]);           // Список покемонов
  const [totalPages, setTotalPages] = useState(1);              // Количество страниц
  const [searchQuery, setSearchQuery] = useState('')            // Поисковый запрос
  const [page, setPage] = useState(1);                          // Текущая страница
  const [inputValue, setInputValue] = useState('');             // Значение инпута
  const [isLoading, setIsLoading] = useState(false);            // Статус загрузки
  const [selectedPokemon, setSelectedPokemon] = useState('');   // Выбранный покемон

  const handlePageChange = (newPage: number) => {
    console.log('new page:', newPage);
    setPage(newPage); // Обновляем значение page
  };

  useEffect(() => {
    const selectedPokemon = localStorage.getItem('selectedPokemon');
    if (selectedPokemon) {
      setSelectedPokemon(selectedPokemon);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedPokemon', selectedPokemon);
  }, [selectedPokemon]);

  useEffect(() => {
    const fetchData = async () => {
      console.log('Fetching data');
      setIsLoading(true);
      try {
        const response = await fetch(`/api/pokemon/list?page=${page}&filters=${searchQuery}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Data fetched:', data);
          setPokemonData(data.data);
          setTotalPages(data.num_pages);
        }
      } catch (error) {
        console.error('Error fetching Pokémon data:', error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [page, searchQuery]);

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>,

      <div className="App">
        <header>
          <form
            className="SearchBar"
            onSubmit={(e) => {
              e.preventDefault();
              setPage(1);
              setSearchQuery(inputValue);
            }}
          >
            <input
              type="text"
              placeholder="Search..."
              id="search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              type="submit"
              id="searchBtn"
              className="searchBtn">
              Search
            </button>
          </form>
          <a className="fight-btn btn" href="/Fight">
            Бой
          </a>
          <div className="pagination-container">
            <Pagination page={page} total={totalPages} onPageChange={handlePageChange} />
          </div>
        </header>
        <div className='container'>
          {isLoading ? (
            <span className="loading loading-bars loading-xl"></span>
          ) : (
            pokemonData.map((pokemon: cardData) => {
              return (
                <Card item={pokemon} selectedPokemon={selectedPokemon} setSelectedPokemon={setSelectedPokemon} />
              )
            })
          )}
        </div>
        <footer className="footer footer-center p-4 bg-base-300 text-base-content stick-to-the-bottom">
          <aside>
            <p>Выполнил: Друганов А.В.</p>
          </aside>
        </footer>
      </div>
    </>
  )
}

export default Home;
