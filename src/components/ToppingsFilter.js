import React from 'react'
import { useStaticQuery, graphql, Link } from 'gatsby'
import styled from 'styled-components'

const ToppingsStyles = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 4rem;
    a {
        display: grid;
        grid-template-columns: auto 1fr;
        grid-gap: 0 1rem;
        padding: 0.5rem;
        background: var(--grey);
        align-items: center;
        border-radius: 0.35rem;
        .count {
            background: white;
            padding: 2px 5px;
        }
        &[aria-current='page'] {
            background: var(--yellow);
        }
    }
`

function countPizzasInToppings(pizzas) {
    // Return the pizzas with counts
    const counts = pizzas.map(pizza => pizza.toppings).flat().reduce((acc, topping) => {
        // Check if this an existing topping
        const existingTopping = acc[topping.id]

        if (existingTopping) {
            // If it is, increment by 1 
            existingTopping.count += 1
        } else {
            // Otherwise create a new entry in accumalator and set it to 1
            acc[topping.id] = {
                id: topping.id,
                name: topping.name,
                count: 1
            }
        }

        return acc
    }, {})

    // Sort toppings based based on count

    const sortedToppings = Object.values(counts).sort((a, b) => b.count - a.count)

    return sortedToppings
}

export default function ToppingsFilter({ activeTopping }) {
    // Get a list of all toppings
    // Get a list of all the pizzas with their toppings
    const { pizzas } = useStaticQuery(graphql`
        query {
            pizzas: allSanityPizza {
                nodes {
                    toppings {
                        name
                        id
                    }
                }
            }
        }
    `)

    // Count how many pizzas are in each topping
    const toppingsWithCounts = countPizzasInToppings(pizzas.nodes)

    // Loop over the list of toppings and display the topping and the count of pizzas in that topping
    

    return (
        <ToppingsStyles>
            <Link to="/pizzas">
                <span className="name">All</span>
                <span className="count">{pizzas.nodes.length}</span>
            </Link>
            {toppingsWithCounts.map(topping => (
                <Link key={topping.id} to={`/topping/${topping.name}`}>
                    <span className="name">{topping.name}</span>
                    <span className="count">{topping.count}</span>
                </Link>
            ))}
        </ToppingsStyles>
    )
}