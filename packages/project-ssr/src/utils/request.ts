const HOST = 'http://localhost:8000'

export async function get(url: string) {
  const res = await fetch(`${HOST}${url}`)
  const data = await res.json()
  return data
}

export async function post(url: string, data: any) {
  const res = await fetch(`${HOST}${url}`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  const response = await res.json()
  return response
}
