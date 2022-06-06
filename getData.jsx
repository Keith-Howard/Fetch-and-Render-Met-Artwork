const { useEffect, useState } = React;

function App() {
    const [query, setQuery] = useState('');
    const [idUrl] = useState('https://collectionapi.metmuseum.org/public/collection/v1/search?q=');
    const [artworkUrl] = useState('https://collectionapi.metmuseum.org/public/collection/v1/objects/');
    const [posts, setPosts] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(50);

    useEffect(() => {
        let artwork = [];
        axios.get(idUrl + query)
            .then(response => {
                let objectIds = response.data.objectIDs;
                for (let id of objectIds) {
                    axios.get(artworkUrl + id)
                        .then(response => { 
                            artwork = [...artwork, response.data]
                            setPosts(artwork)
                        })
                        .catch(err => {
                            console.log(err);
                        })
                }
            })
            .catch(err => {
                console.log(err);
            })
    },[query])

    const Pagination = ({postsPerPage, totalPosts, paginate}) => {
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
            pageNumbers.push(i);
        } 

        return (
            <nav>
                <ul className="pagination">
                    {pageNumbers.map(number =>(
                        <li key={number}>
                            <button onClick={() => paginate(number)} key={number} id={number} href="#top" className={currentPage === number ? "btn btn-secondary" : 'btn btn-light'} >
                                {number}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        )
    }
    const replaceImage =(array) => {
        for (let item of array) {
            if (item.primaryImage === "") {
                item.primaryImage = "imageNA.png";
            }
        }
    }

    replaceImage(posts);

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    
    
    const handleSubmit = () => {
        if (userInput === '') {
            alert('Please enter search criteria!');
        } else{
            setQuery(userInput);
        }
        document.getElementById("userInputBox").value='';
    }

    return (
        <form>
            <div>Browse the Collection</div>
            <input id='userInputBox' type='text' className="inputStyle" onChange={(event) => setUserInput(event.target.value)} placeholder="Search..."/>
            <input type='submit' onClick={() => handleSubmit()} className="inputStyle" />
            <div>
                <ul className="listContainer">
                    {currentPosts.map((item, i) => <li className='list-group-item' key={i} id={i}><img src={item.primaryImage} className="artworkImage"/><br/><a href={item.objectURL} target="_blank">{item.title}</a> By {item.artistDisplayName}<br/>{item.artistDisplayBio} </li>)}
                </ul>
            </div>
            <Pagination 
                postsPerPage={postsPerPage} 
                totalPosts={posts.length} 
                paginate={paginate} 
                />
        </form>
    )
}

ReactDOM.render(<App />, document.getElementById("root"))