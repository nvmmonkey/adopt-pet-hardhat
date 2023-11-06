import { ConnectWallet } from "./components/ConnectWallet";
import { Navbar } from "./components/Navbar";
import { PetItem } from "./components/PetItem";
import { TxError } from "./components/TxError";
import { WalletNotDetected } from "./components/WalletNotDetected";
import { useState, useEffect } from "react";

const HARDHAT_NETWORK_ID = 31337;

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

  async function connectWallet() {
    try {
      const [address] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      await checkNetwork();

      setSelectedAddress(address);
    } catch (e) {
      console.error(e.message);
    }
  }

  async function checkNetwork() {
    alert(window.ethereum.networkVersion);

    if (window.ethereum.networkVersion !== HARDHAT_NETWORK_ID.toString()) {
      alert("Switching to Hardhat!");
      return;
    }
    alert("Correct Network, dont switch!");
  }

  if (!window.ethereum) {
    return <WalletNotDetected />;
  }

  if (!selectedAddress) {
    return <ConnectWallet connect={connectWallet} />;
  }

  return (
    <div className="container">
      <TxError />
      <br />
      <Navbar address={selectedAddress} />

      <div className="items">
        {pets.map((pet) => (
          <PetItem key={pet.id} pet={pet} />
        ))}
      </div>
    </div>
  );
}

export default App;
