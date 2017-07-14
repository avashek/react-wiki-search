import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

function SearchBox(props) {
  return (
    <div>
      <input type="text" placeholder="Search Wikipedia" />
    </div>
  )
}
function WikiCard(props){
  var resultArray = [];
  //var testArray = ['<span>John</span>',<span>D</span>,<span>Doe</span>]
  if(props.searchResult)
  props.searchResult.map((val,i) => {
    var snip = val["snippet"];
    //snip = snip.replace(/</g,'&lt;');
    //snip = snip.replace(/>/g,"&gt;");
    //snip = snip.replace(/^"(.*)"$/, '$1');
    snip = snip.replace(/<span class="searchmatch">/g,'');
    snip = snip.replace(/<\/span>/g,'');
    snip = snip.replace(/&quot;/g,'"');
    snip = snip.replace(/\[.*\]/g,'"');
    //var re = new RegExp(props.searchElement,'g');
    //snip = snip.replace(re,<span className="searchmatch">props.searchElement</span>)
  resultArray.push(<div key={i} className="wikicard"><h4>{val["title"]}</h4>{snip}</div>)
});
  return (
    <div>
      {resultArray}
    </div>
  )
}
class App extends Component {
  constructor(){
    super();
    this.state = {
      searchElement : null,
      searchResult : null,
      searchState : false,
      url : null,
    }
    this.handleKeydown = this.handleKeydown.bind(this);
  }
  componentDidMount() {
    window.addEventListener('keydown',this.handleKeydown);
  }
  handleKeydown(e)
  {
    var k = e.keyCode;
    //var url = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=templates%7Cextracts&list=search&continue=-%7C%7Ctemplates%7Cextracts&tlnamespace=&srsearch="+e.target.value+"&sroffset=10"
    var url = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&list=search&srsearch="+e.target.value+"&srnamespace=0&srlimit=10&srprop=timestamp%7Csnippet%7Ctitlesnippet%7Cwordcount%7Csize";
    if(k === 13)
    {
      this.setState({
        url : url,
        searchElement : e.target.value,
      });
      this.handleSearch();
    }
  }
  handleSearch()
  {
    var myheaders = new Headers();
    var options = {
      method : 'GET',
      headers : myheaders,
      mode : 'cors',
      cache : 'default',
    }

    fetch(this.state.url,options).then((response) => response.json().then(json => this.setState({searchResult : json["query"]["search"]})));
    this.setState({searchState : true,})
  }
  render() {
    return (
      <div className="App">
        <SearchBox />
        {
          this.state.searchState ? 
          <WikiCard searchResult={this.state.searchResult} searchElement={this.state.searchElement}/>
          :
          <h5>Search something</h5>
        }
      </div>
    );
  }
}

export default App;
