import Link from 'next/link';
import styles from '../styles/Header.module.css';

const Header = () => {
  return (
    <nav className={styles.nav}>
      <Link href="/">Home</Link>
      <Link href="/login">Login</Link>
      <Link href="/register">Register</Link>
      <Link href="/profile">Profile</Link>
      <Link href="/create-nft">Create NFT</Link>
      <Link href="/marketplace">Marketplace</Link>
      <Link href="/trade">Trade</Link>
    </nav>
  );
};

export default Header;
