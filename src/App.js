import github from "./db";
import { useEffect, useState, useCallback } from "react";
import query from "./Query";
import RepoList from './RepoList';
import Search from "./Search";
function App() {
  let [userName, setUserName] = useState("");
  let [repoList, setRepoList] = useState(null);
  let [pageCount, setPageCount] = useState(10);
  let [queryString, setQueryString] = useState("tutorials");
  let [totalCount, setTotalCount] = useState(null);

  const fetchData = useCallback(() =>{
    const queryText= JSON.stringify(query(pageCount, queryString));

    fetch(github.baseURL,{
      method: "POST",
      headers: github.headers,
      body: queryText,
    }).then((response) => response.json()).then((data)=>{
      const viewer = data.data.viewer;
      const repos = data.data.search.nodes
      const total = data.data.search.repositoryCount;
      console.log('log viewer',viewer);
      setUserName(viewer.name);
      setRepoList(repos);
      setTotalCount(total);
    }).catch((err)=>{
      console.log(err);
    })
  },[pageCount, queryString]);
useEffect(()=>{
  fetchData();
},[fetchData]);
  
  return (
    <div className="App container mt-5">
      <h1 className="text-primary"><i className="bi bi-diagram-2-fill"></i> Repos</h1>
      <p>Hey there {userName}</p>
<Search
totalCount={totalCount}
pageCount={pageCount}
queryString={queryString}
onTotalChange={(myNumber) => {setPageCount(myNumber)}}
onQueryChange={(myString) => {setQueryString(myString)}}
/>
      {
        repoList && (
          <ul className="list-group list-group-flush">
            {
              repoList.map((repo)=>(
                <RepoList key={repo.id} repo={repo}/>
              ))
            }
          </ul>
        )
      }
    </div>
  );
}

export default App;
