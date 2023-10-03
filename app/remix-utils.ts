export const noContent = () => new Response(null, { status: 204 })

export const unauthorized = () => new Response(null, { status: 401 })

export const methodNotAllowed = () => new Response(null, { status: 405 })
