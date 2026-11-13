import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_BACKEND_URL || '/api'
const baseUrl = `${apiBaseUrl}/persons`
 
// Fetches all entries
const getAll = () => axios.get(baseUrl).then(r => r.data)

// Sends a new entry to the server
const create = (newObject) => axios.post(baseUrl, newObject).then(r => r.data)

// Deletes a specific entry by ID
const remove = (id) => axios.delete(`${baseUrl}/${id}`).then(r => r.data)

// Updates an existing entry (used for changing numbers)
const update = (id, newObject) => axios.put(`${baseUrl}/${id}`, newObject).then(r => r.data)

export default { getAll, create, remove, update }