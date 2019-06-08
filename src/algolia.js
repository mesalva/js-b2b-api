import algoliasearch from 'algoliasearch'

const algoliaClient = algoliasearch(process.env.MESALVA_ALGOLIA_ID, process.env.MESALVA_ALGOLIA_KEY)

export const algoliaIndex = algoliaClient.initIndex('SearchData')
