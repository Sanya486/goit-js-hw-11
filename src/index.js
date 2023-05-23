import { fetchImages , PER_PAGE} from "./js/fetchImages";
import { Notify } from "notiflix";
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';

let lightbox = new SimpleLightbox('.gallery a', {})


const refs = {
    inputEl: document.querySelector('input'),
    searchBtn: document.querySelector('button'),
    formEl: document.querySelector('form'),
    gallery: document.querySelector('.gallery'),
    anchor: document.querySelector('.anchor')
};

let page = 0;
let seaerchRequest = "";


refs.formEl.addEventListener('submit', OnSubmit);

const observer = new IntersectionObserver(OnObserve, {rootMargin: '300px'});

function OnSubmit (e) {
    e.preventDefault();
    refs.gallery.innerHTML = "";
    page = 1;
    observer.unobserve(refs.anchor)
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
    .finally(()=> {
        observer.observe(refs.anchor);
    lightbox.refresh();})
}

function OnObserve (entries) {
    console.log('AGA POOPALSA'
    )
    entries.forEach(entry => {
        if(entry.isIntersecting === true){
            page += 1
            fetchImages(seaerchRequest, page).then(response => {
                response.hits.forEach((image) => makeAndInsertMarkup(image))
                if(page === Math.ceil(response.totalHits / PER_PAGE)) {
                    observer.unobserve(refs.anchor)
                    Notify.info(`We're sorry, but you've reached the end of search results.` )
                }
            }).catch(error => console.log(error)).finally(() => {lightbox.refresh()})
        }
    })
    
}

// Помітив цікаву річ. Насправді АРІ віддає не 500 картинок максимально в безкоштовній версії, а як мінімум 520 розмірі пейджа 40) Навіть при тому що totalHits пише 500) Можна легко побачити в каунтері галереї.


function makeAndInsertMarkup ({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) {
    
    const markup = `<div class="photo-card">
    <div class="image-wrapper"><a href="${largeImageURL}"><img class="gallery-image" src="${webformatURL}" alt="${tags}" loading="lazy" /></a></div>
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

