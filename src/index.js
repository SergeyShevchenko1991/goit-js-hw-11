import { fetchImages } from './js/api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const lightbox = new SimpleLightbox('.gallery a');
let searchQuery = '';
let page = 1;

function isLastPage(total, list) {
  const perPage = 40;
  if (perPage * page >= total) return true;
  if (list.length < perPage) return true;
  return false;
}

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

const handleImagesDebounce = async function (evt) {
  evt.preventDefault();
  const value = form.elements['searchQuery'].value.trim();
  const { hits, totalHits } = await fetchImages(value);
  if (hits.length) {
    renderGallery(hits);
    lightbox.refresh();
    searchQuery = value;
    page = 1;
  }

  changePaginationDisplay(hits, totalHits);
};

form.addEventListener('submit', handleImagesDebounce);
loadMore.addEventListener('click', async function () {
  page++;
  const res = await fetchImages(searchQuery, page);
  if (!res) return;
  if (res.hits.length) renderGallery(res.hits);
  const lastPage = isLastPage(res.totalHits, res.hits);
  changePaginationDisplay(res.hits, res.totalHits);
  lightbox.refresh();
  if (lastPage)
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
});

function changePaginationDisplay(hits, totalHits) {
  if (!isLastPage(totalHits, hits)) {
    loadMore.classList.add('is-active');
  } else {
    loadMore.classList.remove('is-active');
  }
}

function renderGallery(images) {
  let fragment = '';
  for (const image of images) {
    fragment += createPreviewHtml(image);
  }
  gallery.innerHTML = '';
  gallery.insertAdjacentHTML('afterbegin', fragment);
}

function createPreviewHtml(image) {
  return `<a href="${image.largeImageURL}">
        <div class="photo-card">
            <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
            <div class="info">
                <p class="info-item">
                    <b>Likes</b>
                    ${image.likes}
                </p>
                <p class="info-item">
                    <b>Views</b>
                    ${image.views}
                </p>
                <p class="info-item">
                    <b>Comments</b>
                    ${image.comments}
                </p>
                <p class="info-item">
                    <b>Downloads</b>
                    ${image.downloads}
                </p>
            </div>
        </div>
    </a>`;
}
