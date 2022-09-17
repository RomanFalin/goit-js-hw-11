import axios from "axios";

export default async function fetchImages(value, page) {
    const KEY = '29957045-d37badbcede2aa4ce9440014c';
    const url = `https://pixabay.com/api/?key=${KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
    return await axios.get(url).then(response => response.data);
}