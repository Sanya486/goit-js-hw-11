import { fetchImages } from "./js/fetchImages";
import { Notify } from "notiflix";

const refs = {
    inputEl: document.querySelector('input'),
    searchBtn: document.querySelector('button'),
    formEl: document.querySelector('form'),
    gallery: document.querySelector('.gallery'),
    anchor: document.querySelector('.anchor')
};

let page = 1;
let seaerchRequest = "";


refs.formEl.addEventListener('submit', OnSubmit);

const observer = new IntersectionObserver(OnObserve, {rootMargin: '300px'});

function OnSubmit (e) {
    e.preventDefault();
    refs.gallery.innerHTML = "";
    page = 1;
    seaerchRequest = refs.inputEl.value.trim();
    fetchImages(seaerchRequest, page)
    .then(response => {
        response.hits.forEach(image => makeAndInsertMarkup(image));
        if(response.totalHits > 0){
            Notify.success(`Hooray! We found ${response.totalHits} images.`)
        }
        else {
            Notify.failure('Sorry, there are no images matching your search query. Please try again.')
        }
        })
    .catch((error => console.log(error)))
    .finally(()=> observer.observe(refs.anchor))
}

function OnObserve (entries) {
    entries.forEach(entry => {
        if(entry.isIntersecting === true && page < 13){
            page += 1;
            fetchImages(seaerchRequest, page).then(response => response.hits.forEach((image) => makeAndInsertMarkup(image)))
            }
        else if (page >= 13){
            observer.unobserve(refs.anchor)
            Notify.info(`We're sorry, but you've reached the end of search results.`)
        }
    })
    
}






function makeAndInsertMarkup ({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) {
    const markup = `<div class="photo-card">
    <div class="image-wrapper"><img class="gallery-image" src="${webformatURL}" alt="${tags}" loading="lazy" /></div>
    <div class="info">
      <p class="info-item">
        <b>Likes </b> </br>
        ${likes}
      </p>
      <p class="info-item">
        <b>Views</b></br>
        ${views}
      </p>
      <p class="info-item">
        <b>Comments</b></br>
        ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b></br>
        ${downloads}
      </p>
    </div>
  </div>`;
  return refs.gallery.insertAdjacentHTML('beforeend', markup);
}

fetchImages('cat', 5).then(resp => console.dir(resp))