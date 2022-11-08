const { useEffect, useState } = React;

function App() {
    const [query, setQuery] = useState('');
    const idUrl = 'https://collectionapi.metmuseum.org/public/collection/v1/search?q=';
    const artworkUrl = 'https://collectionapi.metmuseum.org/public/collection/v1/objects/';
    const [posts, setPosts] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10;

    useEffect(() => {
        if (query !=="") {
            let searchString =  idUrl + query;
            let artwork = [];
            axios.get(searchString)
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
        }
    },[query])

    const Pagination = ({postsPerPage, totalPosts}) => {
        let previewButton; 
        let nextButton;

        if (currentPage === 1) {
            previewButton = <button id="prevButton" className="btn btn-light btn-outline-dark" disabled onClick={()=> setCurrentPage((currentPage - 1))}>Prev</button>;
        } else{
            previewButton = <button id="prevButton" className="btn btn-light btn-outline-dark" onClick={()=> setCurrentPage((currentPage - 1))}><a className="scrollBtn" href="#top">Prev</a></button>;
        }

        if (currentPage === Math.ceil(totalPosts / postsPerPage)) {
            nextButton = <button id="nextButton" className="btn btn-light btn-outline-dark" disabled onClick={()=> setCurrentPage((currentPage + 1))}>Next</button>;
        } else {
            nextButton = <button id="nextButton" className="btn btn-light btn-outline-dark" onClick={()=> setCurrentPage((currentPage + 1))}><a className="scrollBtn" href="#top">Next</a></button>;
        }

        return (
            <>
            {
                totalPosts === 0 ? ('') : (
                    <div className="inputStyle">
                        {previewButton}
                        {nextButton}
                    </div>
                )
            }
            </>
        )
    }

    posts.map(item => {
        if (item.primaryImage === "") {
            item.primaryImage = "imageNA.png";
        }
    })

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const handleSubmit = (event) => {
        if (userInput === '') {
            alert('Please enter search criteria!');
        } else{
            setQuery(userInput);
        }
        event.preventDefault();
        document.getElementById("userInputBox").value='';
    }

    return (
        <form>
            <div>Browse the Collection</div>
            <input id='userInputBox' type='text' className="inputStyle" onChange={(event) => setUserInput(event.target.value)} placeholder="Search..."/>
            <input type='submit' onClick={(event) => handleSubmit(event)} className="inputStyle" />
            <div>
                <ul className="listContainer">
                    {currentPosts.map((item, i) => <li className='list-group-item' key={i} id={i}><img src={item.primaryImage} className="artworkImage"/><br/><a href={item.objectURL} target="_blank">{item.title}</a> By {item.artistDisplayName}<br/>{item.artistDisplayBio} </li>)}
                </ul>
            </div>
            <Pagination 
            postsPerPage={postsPerPage} 
            totalPosts={posts.length}
            />
        </form>
    )
}

ReactDOM.render(<App />, document.getElementById("root"))
