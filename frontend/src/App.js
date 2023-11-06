import { ConnectWallet } from "./components/ConnectWallet";
import { Navbar } from "./components/Navbar";
import { PetItem } from "./components/PetItem";
import { TxError } from "./components/TxError";
import { WalletNotDetected } from "./components/WalletNotDetected";
import { useState, useEffect } from "react";

function App() {
  const [pets, setPets] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(undefined);

  useEffect(() => {
    async function fetchPets() {
      const res = await fetch("/pets.json");
      const data = await res.json();
      setPets(data);
    }

    fetchPets();
  }, []);

  if (window.ethereum === undefined) {
    return <WalletNotDetected />;
  }

  if (selectedAddress === undefined) {
    return <ConnectWallet />;
  }

  return (
    <div className="container">
      <TxError />
      <br />
      <Navbar />

      <div className="items">
        {pets.map((pet) => (
          <PetItem key={pet.id} pet={pet} />
        ))}
      </div>
    </div>
  );
}

export default App;
