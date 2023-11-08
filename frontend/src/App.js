import { ConnectWallet } from "./components/ConnectWallet";
import { Navbar } from "./components/Navbar";
import { PetItem } from "./components/PetItem";
import { TxError } from "./components/TxError";
import { WalletNotDetected } from "./components/WalletNotDetected";
import { useState, useEffect } from "react";

const HARDHAT_NETWORK_ID = Number(process.env.REACT_APP_NETWORK_ID);

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
      initializeApp(address);

      window.ethereum.on("accountsChanged", ([newAddress]) => {
        if (newAddress === undefined) {
          setSelectedAddress(undefined);
          return;
        }
        initializeApp(newAddress);
        //conection to SC
        //getting owned pets
      });
    } catch (e) {
      console.error(e.message);
    }
  }

  async function initializeApp(address) {
    setSelectedAddress(address);
    const contract = await initContract();
  }

  async function initContract() {
    alert("I sould init the contract!");
  }

  async function switchNetwork() {
    const chainIdHex = `0x${HARDHAT_NETWORK_ID.toString(16)}`;
    return await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }],
    });
  }

  async function checkNetwork() {
    alert(window.ethereum.networkVersion);

    if (window.ethereum.networkVersion !== HARDHAT_NETWORK_ID.toString()) {
      return switchNetwork();
    }
    return null;
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
