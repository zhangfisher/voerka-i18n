import logo from './logo.svg';
import './App.css';

function App() {
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
        </a>
          <div>
            t("中国")<br/>
            t("中华人民共和国")<br/>
            t('中国')<br/>
            t('中华人民共和国')<br/>
            t("中国",1)<br/>
            t("中华人民共和国","fdf")<br/>
        </div>
      </header>
    </div>
  );
}

export default App;
