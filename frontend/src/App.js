import { Navbar } from "./components/Navbar";
import { PetItem } from "./components/PetItem";
import { TxError } from "./components/TxError";
import { useState, useEffect } from "react";

function App() {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    async function fetchPets() {
      const res = await fetch("/pets.json");
      const data = await res.json();
      setPets(data);
    }

    fetchPets();
  }, []);

  return (
    <div className="container">
      <TxError />
      <br />
      <Navbar />

      <div className="items">
        {pets.map((pet) => (
          <PetItem key={pet.id} pet={pet}/>
        ))}
      </div>
    </div>
  );
}

export default App;
