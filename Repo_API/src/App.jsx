import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [info, setInfo] = useState({});
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://rickandmortyapi.com/api/character/?page=${page}&name=${query}`
        );
        if (!response.ok) {
          throw new Error('No se encontraron personajes.');
        }
        const data = await response.json();
        setCharacters(data.results);
        setInfo(data.info);
      } catch (err) {
        setError(err.message);
        setCharacters([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [page, query]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setQuery(search);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Rick and Morty Directory</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Buscar personaje (ej. Rick, Morty...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">Buscar</button>
        </form>
      </header>

      <main className="main-content">
        {loading && <p className="status-msg">Cargando datos del multiverso...</p>}
        {error && <p className="status-msg error">{error}</p>}

        {!loading && !error && (
          <>
            <div className="grid">
              {characters.map((char) => (
                <div key={char.id} className="card">
                  <img src={char.image} alt={char.name} className="card-img" />
                  <div className="card-info">
                    <h2>{char.name}</h2>
                    <p className="status">
                      <span className={`indicator ${char.status.toLowerCase()}`}></span>
                      {char.status} - {char.species}
                    </p>
                    <p className="detail"><strong>Origen:</strong> {char.origin.name}</p>
                    <p className="detail"><strong>Ubicación:</strong> {char.location.name}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pagination">
              <button
                disabled={!info.prev}
                onClick={() => setPage((prev) => prev - 1)}
                className="btn-page"
              >
                Anterior
              </button>
              <span>Página {page} de {info.pages || 1}</span>
              <button
                disabled={!info.next}
                onClick={() => setPage((prev) => prev + 1)}
                className="btn-page"
              >
                Siguiente
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;