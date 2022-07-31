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
            <div>{getFee.data?.fee.shipping}</div>
            <div>{getFee.data?.fee.tax}</div>
        </div>

    );
}