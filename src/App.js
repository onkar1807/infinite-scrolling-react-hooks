import { useEffect, useRef, useState } from 'react';
import loading from './loading.35b947f5.gif';
import './App.css';

function App() {

  const [photos, setPhotos] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [isloading, setIsLoading] = useState(false);

  const fetchPhotos = async(pageNumber) => {
    const res = await fetch(
      `https://api.unsplash.com/photos/?client_id=${access_key}&page=${pageNumber}&per_page=10`
      )

    const data = await res.json();
    setPhotos(photo => [...photo, ...data]);
    setIsLoading(true)
  }

  useEffect(() => {
    fetchPhotos(pageNumber)
  },[pageNumber])


  const loadMore = () => {
    setPageNumber(prevPage => prevPage + 1)
  }


  const pageEnd = useRef();
  let num = 1;

  useEffect(() => {
    if(isloading) {
      const observer = new IntersectionObserver(entries => {

        if(entries[0].isIntersecting) {
          num++;
          loadMore();
          if(num >= 10) {
            observer.unobserve(pageEnd.current)
          }
        }
      },
      {threshold: true});

      observer.observe(pageEnd.current);
    }
  },[isloading,num])


  return (
    <div className="App">
      <h1>Infinite Scrolling React Hooks</h1>
      {
        photos && photos.map((photo, idx) => (
          <div className="photos" key={idx}>
            <img src={photo.urls.small} alt="#" />
            <p>{photo.user.first_name + ' ' + photo.user.last_name}</p>
            <span>Likes: {photo.user.total_likes}</span>
          </div>
        ))
      }

      <div className="loading">
        <img src={loading} alt="#" />
      </div>

      <h3>{photos.length}</h3>

      <button 
        ref={pageEnd}
        onClick={loadMore}
      >
        Load More
      </button>
    </div>
  );
}

export default App;



// https://infinite-scrolling-react-hooks.herokuapp.com