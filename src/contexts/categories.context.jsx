import {createContext, useState, useEffect} from 'react';
import {gql, useQuery} from "@apollo/client";
import {getCategoriesAndDocuments} from '../utils/firebase/firebase.utils';

export const CategoriesContext = createContext({
    categoriesMap: {},
});

const COLLECTIONS = gql`
  query {
    collections {
      id
      title
      items {
        id
        name
        imageUrl
        price
      }
    }
  }
`;

export const CategoriesProvider = ({children}) => {
    const {loading, data, error} = useQuery(COLLECTIONS);
    const [categoriesMap, setCategoriesMap] = useState({});

    useEffect(() => {
        if (data) {
            const {collections} = data;
            const collectionsMap = collections.reduce((accumulator, collection) => {
                accumulator[collection.title.toLowerCase()] = collection.items;
                return accumulator;
            }, {});
            setCategoriesMap(collectionsMap);
        }
    }, [data]);

    const value = {categoriesMap, loading, error};
    return (
        <CategoriesContext.Provider value={value}>
            {children}
        </CategoriesContext.Provider>
    );
};
