import React from 'react'
import { graphql } from 'gatsby'
import styled from 'styled-components'

const BeerGridStyles = styled.div`
    display: grid;
    gap: 2rem;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
`
const SingleBeerStyles = styled.div`
    img {
        width: 100%;
        height: 150px;
        object-fit: contain;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
        margin-bottom: 10px;
    }
`

export default function BeersPage({ data }) {
    return (
        <>
            <h2 className="center" style={{ marginBottom: `50px` }}>We have {data.beers.nodes.length} beers available. Dine in only!</h2>
            <BeerGridStyles>
                {data.beers.nodes.map(beer => {
                    const rating = Math.round(beer.rating.average)

                    return (
                        <SingleBeerStyles key={beer.id}>
                            <img src={beer.image} alt={beer.name} />
                            <h3>{beer.name}</h3>
                            <span>{beer.price}</span>
                            <p title={`${rating} out of 5 stars`} style={{ margin: `5px 0 20px`, transform: `scale(0.75, 0.75)`, transformOrigin: `0 0` }}>
                                {`⭐`.repeat(rating)} 
                                <span style={{ filter: `grayscale(100%)`}}>{`⭐`.repeat(5 - rating)}</span>
                                <span> ({beer.rating.reviews})</span>
                            </p>
                        </SingleBeerStyles>
                    )
                } )}
            </BeerGridStyles>
        </>
    )
}

export const query = graphql`
    query {
        beers: allBeer {
            nodes {
                id
                name
                price
                image
                rating {
                    average 
                    reviews
                }
            }
        }
    }
`