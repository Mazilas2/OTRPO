"use client"
import axios from "axios";
import { useEffect, useState } from "react";


export default function GrafanaPage() {
  const [dataFull, setDataFull] = useState([]);
  const [dataPart, setDataPart] = useState([]);
  const [dataTop, setDataTop] = useState([]);
  
  const columns = [
    { text: "Rank", width: 50 },
    { text: "Pokemon", width: 200 },
    { text: "Total Wins", width: 100 },
  ];

  useEffect(() => {
    getData();
    getData2();
    getData3();
  }, []);

  async function getData() {
    const getDataFull = await axios.get(`/api/getBattles`);
    if (getDataFull.status === 200) {
      setDataFull(getDataFull.data);
    }
  }

  async function getData2() {
    const num_weeks = 2;
    const getDataPart = await axios.get(`/api/getBattles?weeks=${num_weeks}`);
    if (getDataPart.status === 200) {
      setDataPart(getDataPart.data);
    }
  }

  async function getData3() {
    const getDataTop = await axios.get(`/api/getTop_pokemons`);
    if (getDataTop.status === 200) {
      setDataTop(getDataTop.data);
    }
  }

  return (
    <>
      {/* Render the data in the Grafana UI */}
      <div>
        <h2>All Time Data</h2>
        <pre>{JSON.stringify(dataFull, null, 2)}</pre>
      </div>
      <div>
        <h2>Data for 2 Weeks</h2>
        <pre>{JSON.stringify(dataPart, null, 2)}</pre>
      </div>
      <div>
        <h2>Top Pokemons</h2>
        <pre>{JSON.stringify(dataTop, null, 2)}</pre>
      </div>

      <button />
    </>
  );
}