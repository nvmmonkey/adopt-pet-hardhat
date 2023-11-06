export function ConnectWallet({ connect }) {
  return (
    <div className="container">
      <div>Please, connect to wallet to enter the application</div>
      <br />
      <button onClick={connect} className="action-button">
        Connect to Wallet
      </button>
    </div>
  );
}
