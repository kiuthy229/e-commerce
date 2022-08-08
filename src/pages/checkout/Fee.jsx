import React from 'react'
import { useQuery, gql } from '@apollo/client';

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
            <div>Shipping {!getFee.data?.fee.shipping ? 'Not available' : getFee.data?.fee.shipping}</div>
            <div>Fee {!getFee.data?.fee.tax ? 'Not available' : getFee.data?.fee.tax}</div>
        </div>

    );
}