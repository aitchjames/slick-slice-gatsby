import path from 'path'
import fetch from 'isomorphic-fetch'

async function turnPizzasIntoPages({ graphql, actions }) {
  // 1. Get a template for this page
  const pizzaTemplate = path.resolve('./src/templates/Pizza.js')

  // 2. Query all pizzas
  const { data } = await graphql(`
    query {
        pizzas: allSanityPizza {
            nodes {
                name
                slug {
                    current
                }
            }
        }
    }
    `)

    // 3. Loop over each pizza and create a page for that pizza
    data.pizzas.nodes.forEach((pizza) => {
        actions.createPage({
        // What is the URL for this new page??
        path: `pizza/${pizza.slug.current}`,
        component: pizzaTemplate,
        context: {
            slug: pizza.slug.current,
        },
        })
    })
}

async function turnToppingsIntoPages({ graphql, actions }) {
    // 1. Get a template for this page
    const toppingsTemplate = path.resolve('./src/pages/pizzas.js')

    // 2. Query all toppings
    const { data } = await graphql(`
        query {
            toppings: allSanityTopping {
                nodes {
                    name
                    id
                }
            }
        }
    `)

    // 3. Loop over each topping and create a page for that topping
    data.toppings.nodes.forEach((topping) => {
        actions.createPage({
            path: `topping/${topping.name}`,
            component: toppingsTemplate,
            context: {
                topping: topping.name,
                // TODO: Regex for topping
                toppingRegex: `/${topping.name}/i`
            }
        })
    })
}

async function fetchBeersAndTurnIntoNodes({ actions, createNodeId, createContentDigest }) {
    console.log('Turn beers into nodes!')
    // Fetch a list of beers
    const res = await fetch('https://api.sampleapis.com/beers/ale')
    const beers = await res.json()

    // Loop over each one
    for (const beer of beers) {
        // Create a node for each beer
        const nodeMeta = {
            id: createNodeId(`beer-${beer.name}`),
            parent: null,
            children: [],
            internal: {
                type: 'Beer',
                mediaType: 'application/json', 
                contentDigest: createContentDigest(beer),
            }
        }
        
        // Create a node for that beer
        actions.createNode({ ...beer, ...nodeMeta})
    }    
}

async function turnSlicemastersIntoPages({ graphql, actions }) {
    // Query all slicemasters
    const { data } = await graphql(`
        query {
            slicemasters: allSanityPerson {
                totalCount
                nodes {
                    name
                    id
                    slug {
                        current
                    }
                }
            }
        }
    `)

    // Turn each slicemaster into their own page

    // Figure out how many pages there are based on how many slicemasters there are, and how many per page
    const pageSize = parseInt(process.env.GATSBY_PAGE_SIZE);
    const pageCount = Math.ceil(data.slicemasters.totalCount / pageSize);

    console.log(`There are ${data.slicemasters.totalCount} total people. We have ${pageCount} pages with ${pageSize} per page`);

    // Loop from 1 to n and create the pages for them
    Array.from({ length: pageCount }).forEach((_, i) => {
        actions.createPage({
            path: `/slicemasters/${i + 1}`,
            component: path.resolve('./src/pages/slicemasters.js'),
            context: {
                skip: i * pageSize,
                currentPage: i + 1,
                pageSize
            }
        })
    })
}

export async function sourceNodes(params) {
    // Fetch a list of beers and source them into our gatsby API
    await Promise.all([
        fetchBeersAndTurnIntoNodes(params)
    ])
}

export async function createPages(params) {
    // Create pages dynamically
    await Promise.all([
        turnPizzasIntoPages(params),
        turnToppingsIntoPages(params),
        turnSlicemastersIntoPages(params)
    ])
}