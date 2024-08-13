import styles from '../styles/NFTCard.module.css';

const NFTCard = ({ nft }) => {
  return (
    <div className={styles.card}>
      <img src={nft.imageURL} alt={nft.description} />
      <h3>{nft.description}</h3>
      <p>Owner: {nft.owner}</p>
    </div>
  );
};

export default NFTCard;
