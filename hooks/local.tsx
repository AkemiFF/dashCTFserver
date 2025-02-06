import Cookies from 'js-cookie';
const getLocal = () => {
    const local = Cookies.get('locale');
    return local;
}
export default getLocal;