import {useContext, useState, useEffect, Fragment} from 'react';
import {useParams} from 'react-router-dom';

import ProductCard from '../../components/product-card/product-card.component';

import {CategoryContainer, Title} from './category.styles';
import Spinner from "../../components/spinner/spinner.component";
import {gql, useQuery} from "@apollo/client";

const GET_CATEGORY = gql`
    query($title: String!) {
        getCollectionsByTitle(title: $title) {
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
const Category = () => {
    const {category} = useParams();
    const {data, loading, error} = useQuery(GET_CATEGORY, {variables: {title: category}});
    const [products, setProducts] = useState([]);

    console.log(data)

    useEffect(() => {
        if (data) {
            const {getCollectionsByTitle} = data;
            setProducts(getCollectionsByTitle.items);
        }
    }, [category, data]);

    return (
        <Fragment>
            {
                loading ? <Spinner/> :
                    (
                        <>
                            <Title>{category.toUpperCase()}</Title>
                            <CategoryContainer>
                                {
                                    products.map((product) => (
                                        <ProductCard key={product.id} product={product}/>
                                    ))
                                }
                            </CategoryContainer>
                        </>
                    )
            }
        </Fragment>
    );
};

export default Category;
