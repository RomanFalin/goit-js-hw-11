import fetchImages from "./partials/images";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './styles.css';
import LoadMoreBtn from "./partials/load_more";

const searchForm = document.querySelector('.search-form');
const galleryList = document.querySelector('.gallery');

const btnLoadMore = new LoadMoreBtn({
    selector: '.load-more',
    hidden: true,
});

searchForm.addEventListener('submit', submitForm);
btnLoadMore.refs.button.addEventListener('click', onLoadMore);
btnLoadMore.hide();

let queryItem = '';
let currentPage = 1;
let currentHits = 0;

function createImageCard(gallery) {
    const markup = gallery.map(
        ({
            webformatURL,
            largeImageURL,
            tags,
            likes,
            views,
            comments,
            downloads,
        }) => {
            return `
            <li class="photo-card">
                <a class="gallery__item" href="${largeImageURL}">
                    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                    <div class="info">
                        <p class="info-item">
                            <b>Likes:</b> <span>${likes}</span> 
                        </p>
                        <p class="info-item">
                            <b>Views:</b> <span>${views}</span>
                        </p>
                        <p class="info-item">
                            <b>Comments:</b> <span>${comments}</span> 
                        </p>
                        <p class="info-item">
                            <b>Downloads:</b> <span>${downloads}</span> 
                        </p>
                    </div>
                </a>
            </li>`
        }).join('');
    galleryList.insertAdjacentHTML('beforeend', markup);
}

let lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
    showCounter: false,
    overlayOpacity: 0.9,
});

function scrollPage() {
    const { height: cardHeight } = document.querySelector('.gallery').firstElementChild.getBoundingClientRect();
    window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
    });
}

function clearGallery() {
    galleryList.innerHTML = '';
}

async function submitForm(evt) {
    evt.preventDefault();
    queryItem = evt.currentTarget.searchQuery.value;
    currentPage = 1;
    clearGallery();

    if (queryItem === '') {
        return;
    }

    const response = await fetchImages(queryItem, currentPage);
    currentHits = response.hits.length;

    try {
        if (response.totalHits > 0) {
            Notify.success(`Hooray! We found ${response.totalHits} images.`);
            createImageCard(response.hits);
            btnLoadMore.show();
            scrollPage();
            lightbox.refresh();
        }
        if (response.totalHits === 0) {
            Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        }
    } catch (error) {
        console.log(error);
    }
}

async function onLoadMore() {
    currentPage += 1;
    const response = await fetchImages(queryItem, currentPage);
    createImageCard(response.hits);
    lightbox.refresh();
    currentHits += response.hits.length;
    scrollPage();

    if (currentHits === response.totalHits) {
        btnLoadMore.hide();
        Notify.info("We're sorry, but you've reached the end of search results.");
    }
}