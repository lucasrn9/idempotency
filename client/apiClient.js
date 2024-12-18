const api = {
    newOrder: async (endpoint, reqBody, error) => {
        const response = await fetch(`http://localhost:8000/${endpoint}`, {
            method: 'post',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Error: error
            },
            body: JSON.stringify(reqBody),
        })
        return response
    }
}

export default api