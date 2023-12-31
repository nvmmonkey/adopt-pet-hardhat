import { ConnectWallet } from "./components/ConnectWallet";
import { Navbar } from "./components/Navbar";
import { PetItem } from "./components/PetItem";
import { TxError } from "./components/TxError";
import { TxInfo } from "./components/TxInfo";
import { WalletNotDetected } from "./components/WalletNotDetected";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractAddress } from "./address";
import PetAdoptionArtifact from "./contracts/PetAdoption.json";

const HARDHAT_NETWORK_ID = Number(process.env.REACT_APP_NETWORK_ID);

function App() {
  const [pets, setPets] = useState([]);
  const [adoptedPets, setAdoptedPets] = useState([]);
  const [ownedPets, setOwnedPets] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [txError, setTxError] = useState(undefined);
  const [txInfo, setTxInfo] = useState(undefined);
  const [view, setNewView] = useState("home");

  const setView = (newView) => {
    setNewView(newView);
  };

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
          setTxError(undefined);
          setAdoptedPets([]);
          setOwnedPets([]);
          setSelectedAddress(undefined);
          setContract(undefined);
          setTxInfo(undefined);
          setView("home");
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

    getAdoptedPets(contract);
  }

  async function initContract() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner(0);
    // console.log(signer);

    const contract = new ethers.Contract(
      contractAddress.PetAdoption,
      PetAdoptionArtifact.abi,
      signer
    );

    setContract(contract);
    return contract;
  }

  async function getAdoptedPets(contract) {
    try {
      const adoptedPets = await contract.getAllAdoptedPets();
      const ownedPets = await contract.getAllAdoptedPetsByOwner();

      if (adoptedPets.length > 0) {
        // console.log(adoptedPets);
        setAdoptedPets(adoptedPets.map((petIdx) => Number(petIdx)));
      } else {
        setAdoptedPets([]);
      }

      if (ownedPets.length > 0) {
        // console.log(adoptedPets);
        setOwnedPets(ownedPets.map((petIdx) => Number(petIdx)));
      } else {
        setOwnedPets([]);
      }

      // console.log(adoptedPets);
    } catch (e) {
      console.error(e.message);
    }
  }

  async function adoptPet(id) {
    try {
      const tx = await contract.adoptPet(id);
      setTxInfo(tx.hash);
      const receipt = await tx.wait();

      // await new Promise((res) => setTimeout(res, 2000));

      if (receipt.status === 0) {
        throw new Error("Transaction Failed!");
      }

      setAdoptedPets([...adoptedPets, id]);
      setOwnedPets([...ownedPets, id]);
    } catch (e) {
      setTxError(e?.reason);
    } finally {
      setTxInfo(undefined);
    }
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
      {txInfo && <TxInfo message={txInfo} />}
      {txError && (
        <TxError dismiss={() => setTxError(undefined)} message={txError} />
      )}
      <br />

      <Navbar setView={setView} address={selectedAddress} />

      <div className="items">
        {view === "home"
          ? pets.map((pet) => (
              <PetItem
                inProgress={!!txInfo}
                key={pet.id}
                disabled={adoptedPets?.includes(pet.id)}
                pet={pet}
                adoptPet={() => adoptPet(pet.id)}
              />
            ))
          : pets
              .filter((pet) => ownedPets.includes(pet.id))
              .map((pet) => (
                <PetItem
                  key={pet.id}
                  disabled={true}
                  pet={pet}
                  adoptPet={() => {}}
                />
              ))}
      </div>
    </div>
  );
}

export default App;
