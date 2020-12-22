import logo from './logo.svg';
import './App.css';
import intl from 'react-intl-universal';
function App() {
  console.log(intl.get('src_App1510599991').d('中文'));
  console.log('硬编码1');
  console.log('硬编码2');
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
          <div>硬编码三</div>
        </a>
      </header>
    </div>
  );
}

export default App;
