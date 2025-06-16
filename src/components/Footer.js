const Footer = () => (
  <footer style={{ textAlign: 'center', padding: '1rem', background: '#f4f4f4' }}>
    <p>&copy; {new Date().getFullYear()} TurnReady. All rights reserved.</p>
    <p><Link to="/terms">Terms</Link> | <Link to="/privacy">Privacy</Link></p>
  </footer>
);

export default Footer;
