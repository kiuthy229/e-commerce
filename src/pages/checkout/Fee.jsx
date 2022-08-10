import React from 'react'
import { useQuery, gql } from '@apollo/client';
import './Cart.css';

const GET_FEE = gql`
    query Query($location: String!) {
        fee(location: $location) {
            shipping
            tax
        }
    }
`;

export function Fee(location) {
    const getFee = useQuery(GET_FEE, {
        variables: {
            location: location.location
        }
    })

    return (
        <div>
            <div className='fee'><span className='smallTitle'>Shipping</span> {getFee.data?.fee.shipping}</div>
            <div className='fee'><span className='smallTitle'>Tax</span> {getFee.data?.fee.tax}</div>
        </div>

    );
}