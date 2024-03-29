import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';


function App() {
  const [query, setQuery] = useState<string>('');
    const idUrl: string = 'https://collectionapi.metmuseum.org/public/collection/v1/search?q=';
    const artworkUrl: string = 'https://collectionapi.metmuseum.org/public/collection/v1/objects/';
    const [posts, setPosts] = useState<any[]>([]);
    const [userInput, setUserInput] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const postsPerPage: number = 10;

    
    useEffect(() => {
        const getArtwork = async () => {
            if (query !=="") {
                let searchString: string =  idUrl + query;
                 await axios.get(searchString)
                    .then(response => {
                        if(response.data.objectIDs !== null) {
                            let objectIds = response.data.objectIDs;
                            objectIds = objectIds.slice(0,50);
                            let count = 0;
                            (async (ids) => {
                                let artwork: any = [];
                                for (let id of ids) {
                                    console.log('id# ',id);
                                    await axios.get(artworkUrl + id)
                                        .then(response => {
                                            if (response.data.primaryImage === "") {
                                                response.data.primaryImage = "imageNA.png";
                                            }
                                            artwork = [...artwork, response.data]
                                            console.log("output data ", response.data)
                                            console.log("id after then ", id);
                                            setPosts(artwork);
                                            count++;
                                            if (count === objectIds.length){
                                                (document.getElementById("search") as HTMLInputElement).disabled = false;
                                            }
                                        })
                                        .catch(err => {
                                            console.log(artworkUrl + id);
                                            console.log(err);
                                            count++;
                                            if (count === objectIds.length){
                                                (document.getElementById("search") as HTMLInputElement).disabled = false;
                                            }
                                        })
                                }
                            })(objectIds);
                            console.log("set page");
                            setCurrentPage(1);
                        }else{
                            alert("Search string " + query + ", no artwork found.");
                            (document.getElementById("search") as HTMLInputElement).disabled = false;
                        }
                    })
            }
        }

        getArtwork()
            .catch(err => {
                console.log(err);
            });
    },[query])


    const pagination = (postsPerPage, totalPosts) => {
        console.log("pagination");
        let previewButton: any; 
        let nextButton: any;

        if (totalPosts !== 0) {
            console.log('posts > 0')
            if (currentPage === 1) {
                previewButton = <button id="prevButton" className="btn btn-light btn-outline-dark" disabled>Prev</button>;
            } else{
                previewButton = <button id="prevButton" className="btn btn-light btn-outline-dark" onClick={()=> setCurrentPage((currentPage - 1))}><a className="scrollBtn" href="#top">Prev</a></button>;
            }

            if (currentPage === Math.ceil(totalPosts / postsPerPage)) {
                nextButton = <button id="nextButton" className="btn btn-light btn-outline-dark" disabled>Next</button>;
            } else {
                nextButton = <button id="nextButton" className="btn btn-light btn-outline-dark" onClick={()=> setCurrentPage((currentPage + 1))}><a className="scrollBtn" href="#top">Next</a></button>;
            }
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

    const handleSubmit = (event) => {
        console.log("handle submit");
        if (userInput === '') {
            alert('Please enter search criteria!');
        } else{
            setQuery(userInput);
        }
        event.preventDefault();
        //document.getElementById("userInputBox").value = '';
        (document.getElementById("userInputBox") as HTMLInputElement).value = '';
        (document.getElementById("search") as HTMLInputElement).disabled = true;
    }
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
    console.log('after slice ', indexOfFirstPost, indexOfLastPost);
    return (
        <form>
            <div>Browse the Collection</div>
            <input id='userInputBox' type='text' className="inputStyle" onChange={(event) => setUserInput(event.target.value)} placeholder="Search..."/>
            <input type='submit' id="search" onClick={(event) => handleSubmit(event)} className="inputStyle" />
            <div>
                <ul className="listContainer">
                    {currentPosts.map((item, i) => <li className='list-group-item' key={i}><img src={item.primaryImage} alt={item.title} className="artworkImage"/><br/><a href={item.objectURL} target="_blank" rel="noreferrer">{item.title}</a> By {item.artistDisplayName}<br/>{item.artistDisplayBio} </li>)}
                </ul>
            </div>
            {pagination(postsPerPage, posts.length)}
        </form>
    )
}

export default App;
