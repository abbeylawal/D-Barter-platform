import styles from '../styles/NFTCard.module.css';

const NFTCard = ({ nft }) => {
  return (
    <div className={styles.card}>
      <img src={nft.imageURL} alt={nft.description} />
      <h3>{nft.description}</h3>
      <p>Seller: {nft.seller}</p>
    </div>
  );
};

export default NFTCard;
