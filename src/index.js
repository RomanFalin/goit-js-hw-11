import fetchImages from "./partials/images";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import LoadMoreBtn from "./partials/load_more";

const searchForm = document.querySelector('.search-form');
const galleryList = document.querySelector('.gallery');
const btnLoadMore = new LoadMoreBtn({
    selector: '.load-more',
    hidden: true,
});

