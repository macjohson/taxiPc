import queryString from 'query-string';

export default (search)=>{
    return queryString.parse(search)
}