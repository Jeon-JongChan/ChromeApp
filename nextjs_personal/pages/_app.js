import '../styles/globals.css'
import server from '../scripts/server'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export async function getStaticProps() {
  //server.db.exec("CREATE TABLE users('ID' varchar(20), PASSWORD VARCHAR(64))");
  server.db.exec("CREATE TABLE IF NOT EXISTS users('ID' varchar(20), PASSWORD VARCHAR(64))");
  console.log('one by one');
}
export default MyApp
